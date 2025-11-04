import type { Request, Response } from "express";
import { PatientMedicalRecordService } from "../services/patientMedicalRecord.service.js";
import { errorHandler } from "../utils/error.util.js";
import medicalRecordAccessLogService from "../services/medicalRecordAccessLog.service.js";
import iamServiceClient from "../services/iamService.client.js";

const patientMedicalRecordService = new PatientMedicalRecordService();

const fetchActorEmail = async (actorId: string | undefined): Promise<string | null> => {
  if (!actorId) {
    return null;
  }
  try {
    const user = await iamServiceClient.getUserById(actorId);
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.warn(`[PatientMedicalRecordController] Unable to resolve email for user ${actorId}`, error);
  }
  return actorId.includes("@") ? actorId : null;
};

const resolveAccessActor = async (
  req: Request
): Promise<{ actorId: string; actorEmail: string | null }> => {
  const headerEmailRaw = req.headers["x-user-email"];
  const headerEmail = Array.isArray(headerEmailRaw) ? headerEmailRaw[0] : headerEmailRaw;
  if (typeof headerEmail === "string" && headerEmail.length > 0) {
    return { actorId: headerEmail, actorEmail: headerEmail };
  }

  const headerUserIdRaw = req.headers["x-user-id"];
  const headerUserId = Array.isArray(headerUserIdRaw) ? headerUserIdRaw[0] : headerUserIdRaw;
  const resolvedUserId = (req as any).userId ?? (typeof headerUserId === "string" ? headerUserId : undefined);

  if (typeof resolvedUserId === "string" && resolvedUserId.length > 0) {
    const email = await fetchActorEmail(resolvedUserId);
    return { actorId: resolvedUserId, actorEmail: email };
  }

  return { actorId: "system", actorEmail: null };
};

const buildRequestClientFootprint = (
  req: Request
): { ip_address?: string; user_agent?: string } => {
  const footprint: { ip_address?: string; user_agent?: string } = {};
  if (req.ip) {
    footprint.ip_address = req.ip;
  }
  const userAgent = req.get("user-agent");
  if (userAgent) {
    footprint.user_agent = userAgent;
  }
  return footprint;
};

const toPlainRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object") {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
};

const pickValues = (source: Record<string, unknown>, fields: string[]): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in source) {
      result[field] = source[field];
    }
  }
  return result;
};

const diffChangedFields = (
  previous: Record<string, unknown>,
  current: Record<string, unknown>,
  candidateFields: string[]
): { fields: string[]; previousValues: Record<string, unknown>; currentValues: Record<string, unknown> } => {
  const changed: string[] = [];

  for (const field of candidateFields) {
    const before = previous[field];
    const after = current[field];
    const beforeJson = before === undefined ? undefined : JSON.stringify(before);
    const afterJson = after === undefined ? undefined : JSON.stringify(after);
    if (beforeJson !== afterJson) {
      changed.push(field);
    }
  }

  return {
    fields: changed,
    previousValues: pickValues(previous, changed),
    currentValues: pickValues(current, changed),
  };
};

const trackableMedicalRecordFields: string[] = [
  "blood_type",
  "allergies",
  "chronic_conditions",
  "current_medications",
  "medical_history",
  "clinical_notes",
  "recent_test_summary",
  "recent_instruments_used",
  "recent_reagents_info",
  "updated_by",
];

const getPatientRecordDetail = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patient Medical Records']
    #swagger.description = 'Get a patient medical record by record code or ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', description: 'Medical record code or ID', required: true }
    #swagger.parameters['includePatient'] = {
      in: 'query',
      description: 'Include patient profile details',
      type: 'boolean',
      default: true
    }
    #swagger.responses[200] = {
      description: 'Patient medical record retrieved successfully',
      schema: {
        record: {
          _id: 'uuid',
          patient_id: 'patient-uuid',
          record_code: 'MR202510240001',
          blood_type: 'A+',
          allergies: 'Penicillin',
          chronic_conditions: 'Hypertension',
          current_medications: 'Atorvastatin',
          medical_history: 'Appendectomy - 2010',
          clinical_notes: 'Patient showing good recovery',
          created_at: '2025-10-24T11:00:00Z',
          updated_at: '2025-10-24T11:00:00Z',
          patient: {
            _id: 'patient-uuid',
            user_id: 'user-uuid',
            patient_code: 'PT202510240001'
          }
        }
      }
    }
    #swagger.responses[404] = { description: 'Patient medical record not found' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const { includePatient = "true" } = req.query;
    const userId = (req as any).userId;

    console.log(`\n📖 [GET RECORD DETAIL] User: ${userId}`);
    console.log(`   └─ Record ID/Code: ${id}`);
    console.log(`   └─ Include Patient: ${includePatient}`);

    if (!id) {
      console.log(`   ❌ Missing record ID/code`);
      res.status(400).json({ message: "recordCode or recordId is required" });
      return;
    }

    const record = await patientMedicalRecordService.getPatientRecordDetail(id, includePatient === "true");

    if (!record) {
      console.log(`   ❌ Record not found: ${id}`);
      res.status(404).json({ message: "Patient medical record not found" });
      return;
    }

    console.log(`   ✅ Found record: ${record.record_code} (Patient: ${record.patient_id})`);

    const actorContext = await resolveAccessActor(req);
    const footprint = buildRequestClientFootprint(req);
    try {
      await medicalRecordAccessLogService.createAccessLog({
        medical_record_id: record._id,
        patient_id: record.patient_id,
        accessed_by: actorContext.actorId,
        accessed_by_email: actorContext.actorEmail,
        access_type: "VIEW",
        old_values: null,
        new_values: null,
        ...footprint,
      });
    } catch (logError) {
      console.warn("[MedicalRecordAccessLog] Failed to record view event", logError);
    }

    res.status(200).json({ record });
  } catch (error) {
    console.log(`   ⚠️  Error: ${error instanceof Error ? error.message : String(error)}`);
    errorHandler(res, error);
  }
};

const createPatientRecord = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patient Medical Records']
    #swagger.description = 'Create a patient medical record for an existing patient'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        patient_id: 'patient-uuid',
        blood_type: 'A+',
        allergies: 'Penicillin',
        chronic_conditions: 'Hypertension',
        current_medications: 'Atorvastatin',
        medical_history: 'Appendectomy - 2010',
        clinical_notes: 'Patient showing good recovery',
        recent_test_summary: 'CBC normal, HbA1c elevated',
        recent_instruments_used: 'Sysmex XN-1000',
        recent_reagents_info: 'Lot# RGT-2025-09-15'
      }
    }
    #swagger.responses[201] = {
      description: 'Medical record created successfully',
      schema: {
        record: {
          _id: 'uuid',
          patient_id: 'patient-uuid',
          record_code: 'MR202510090001',
          blood_type: 'A+',
          created_at: '2025-10-24T11:00:00Z',
          updated_at: '2025-10-24T11:00:00Z'
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input or business rule violation' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { patient_id, ...payload } = req.body ?? {};
    const userId = (req as any).userId;

    console.log(`\n➕ [CREATE RECORD] User: ${userId}`);
    console.log(`   └─ Patient ID: ${patient_id}`);
    console.log(`   └─ Data: ${JSON.stringify(payload).substring(0, 100)}...`);

    if (!patient_id) {
      console.log(`   ❌ Missing patient_id`);
      res.status(400).json({ message: "patient_id is required" });
      return;
    }

    const createdBy = userId as string | undefined;
    const record = await patientMedicalRecordService.createPatientRecord(
      { patient_id, ...payload },
      createdBy
    );

    console.log(`   ✅ Record created: ${record.record_code} (ID: ${record._id})`);

    const actorContext = await resolveAccessActor(req);
    const footprint = buildRequestClientFootprint(req);
    try {
      await medicalRecordAccessLogService.createAccessLog({
        medical_record_id: record._id,
        patient_id: record.patient_id,
        accessed_by: actorContext.actorId,
        accessed_by_email: actorContext.actorEmail,
        access_type: "CREATE",
        old_values: null,
        new_values: record as unknown as Record<string, unknown>,
        ...footprint,
      });
    } catch (logError) {
      console.warn("[MedicalRecordAccessLog] Failed to record create event", logError);
    }

    res.status(201).json({
      message: "Patient medical record created successfully",
      record,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    if (error instanceof Error && [
      "patient_id is required",
      "Patient not found",
      "Patient medical record already exists for this patient",
    ].includes(error.message)) {
      res.status(400).json({ message: error.message });
      return;
    }

    errorHandler(res, error);
  }
};

const getAllPatientRecords = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patient Medical Records']
    #swagger.description = 'Get all patient medical records with optional filters and patient details'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page number',
      type: 'integer',
      default: 1
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Items per page',
      type: 'integer',
      default: 10
    }
    #swagger.parameters['patientId'] = {
      in: 'query',
      description: 'Filter by patient ID',
      type: 'string'
    }
    #swagger.parameters['recordCode'] = {
      in: 'query',
      description: 'Filter by record code',
      type: 'string'
    }
    #swagger.parameters['includePatient'] = {
      in: 'query',
      description: 'Include patient profile details',
      type: 'boolean',
      default: true
    }
    #swagger.parameters['includeDeleted'] = {
      in: 'query',
      description: 'Include soft-deleted records',
      type: 'boolean',
      default: false
    }
    #swagger.responses[200] = {
      description: 'Patient medical records retrieved successfully',
      schema: {
        records: [{
          _id: 'uuid',
          patient_id: 'patient-uuid',
          record_code: 'MR202510090001',
          blood_type: 'A+',
          allergies: 'Penicillin',
          chronic_conditions: 'Hypertension',
          current_medications: 'Atorvastatin',
          medical_history: 'Appendectomy - 2010',
          clinical_notes: 'Patient showing good recovery',
          recent_test_summary: 'CBC normal, HbA1c elevated',
          recent_instruments_used: 'Sysmex XN-1000',
          recent_reagents_info: 'Lot# RGT-2025-09-15',
          created_at: '2025-10-24T11:00:00Z',
          updated_at: '2025-10-24T11:00:00Z',
          created_by: 'lab-user-uuid',
          updated_by: 'lab-user-uuid',
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
          patient: {
            _id: 'patient-uuid',
            user_id: 'user-uuid',
            patient_code: 'PT202510240001'
          }
        }],
        total: 1,
        page: 1,
        totalPages: 1
      }
    }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const {
      page = "1",
      limit = "10",
      patientId,
      recordCode,
      includePatient = "true",
      includeDeleted = "false",
    } = req.query;
    const userId = (req as any).userId;

    console.log(`\n📋 [LIST RECORDS] User: ${userId}`);
    console.log(`   └─ Page: ${page}, Limit: ${limit}`);
    if (patientId) console.log(`   └─ Filter by Patient: ${patientId}`);
    if (recordCode) console.log(`   └─ Filter by Record Code: ${recordCode}`);
    console.log(`   └─ Include Patient: ${includePatient}, Include Deleted: ${includeDeleted}`);

    const filters: Record<string, unknown> = {};

    if (patientId) {
      filters.patient_id = patientId;
    }

    if (recordCode) {
      filters.record_code = { $regex: recordCode, $options: "i" };
    }

    if (includeDeleted === "true") {
      filters.is_deleted = { $in: [true, false] };
    }

    const result = await patientMedicalRecordService.getAllPatientRecords(
      filters,
      Number(page),
      Number(limit),
      includePatient === "true"
    );

    console.log(`   ✅ Found ${result.total} total records, returned ${result.records.length} records (Page ${result.page}/${result.totalPages})`);
    res.status(200).json(result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const updatePatientRecord = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patient Medical Records']
    #swagger.description = 'Update a patient medical record by record code or ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', description: 'Medical record code or ID', required: true }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        blood_type: 'O+',
        allergies: 'Penicillin',
        chronic_conditions: 'Diabetes',
        current_medications: 'Metformin',
        medical_history: 'Surgery 2020',
        clinical_notes: 'Patient stable',
        recent_test_summary: 'Normal results',
        recent_instruments_used: 'XN-1000',
        recent_reagents_info: 'Lot# XYZ'
      }
    }
  */
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    console.log(`\n✏️  [UPDATE RECORD] User: ${userId}`);
    console.log(`   └─ Record ID/Code: ${id}`);
    console.log(`   └─ Updates: ${JSON.stringify(req.body).substring(0, 100)}...`);

    if (!id) {
      console.log(`   ❌ Missing record ID/code`);
      res.status(400).json({ message: "recordCode or recordId is required" });
      return;
    }

    const actorContext = await resolveAccessActor(req);
    const updates = req.body ?? {};

    const existingRecord = await patientMedicalRecordService.getPatientRecordDetail(id, false);
    if (!existingRecord) {
      console.log(`   ❌ Record not found: ${id}`);
      res.status(404).json({ message: "Patient medical record not found" });
      return;
    }

    const record = await patientMedicalRecordService.updatePatientRecord(
      id,
      updates,
      actorContext.actorId
    );

    if (!record) {
      console.log(`   ❌ Record not found: ${id}`);
      res.status(404).json({ message: "Patient medical record not found" });
      return;
    }

    console.log(`   ✅ Record updated: ${record.record_code}`);

    const footprint = buildRequestClientFootprint(req);
    const diff = diffChangedFields(
      toPlainRecord(existingRecord),
      toPlainRecord(record),
      trackableMedicalRecordFields
    );

    if (diff.fields.length > 0) {
      try {
        await medicalRecordAccessLogService.createAccessLog({
          medical_record_id: record._id,
          patient_id: record.patient_id,
          accessed_by: actorContext.actorId,
          accessed_by_email: actorContext.actorEmail,
          access_type: "UPDATE",
          old_values: diff.previousValues,
          new_values: diff.currentValues,
          ...footprint,
        });
      } catch (logError) {
        console.warn("[MedicalRecordAccessLog] Failed to record update event", logError);
      }
    }

    res.status(200).json({
      message: "Patient medical record updated",
      record,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    if (error instanceof Error && error.message === "recordId is required") {
      res.status(400).json({ message: error.message });
      return;
    }

    errorHandler(res, error);
  }
};

const deletePatientRecord = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patient Medical Records']
    #swagger.description = 'Soft delete a patient medical record by record code or ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', description: 'Medical record code or ID', required: true }
  */
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    console.log(`\n🗑️  [DELETE RECORD] User: ${userId}`);
    console.log(`   └─ Record ID/Code: ${id}`);

    if (!id) {
      console.log(`   ❌ Missing record ID/code`);
      res.status(400).json({ message: "recordCode or recordId is required" });
      return;
    }

    const actorContext = await resolveAccessActor(req);
    const existingRecord = await patientMedicalRecordService.getPatientRecordDetail(id, false);
    if (!existingRecord) {
      console.log(`   ❌ Record not found: ${id}`);
      res.status(404).json({ message: "Patient medical record not found" });
      return;
    }

    const record = await patientMedicalRecordService.deletePatientRecord(id, actorContext.actorId);

    if (!record) {
      console.log(`   ❌ Record not found: ${id}`);
      res.status(404).json({ message: "Patient medical record not found" });
      return;
    }

    console.log(`   ✅ Record deleted (soft): ${record.record_code}`);

    const footprint = buildRequestClientFootprint(req);
    try {
      await medicalRecordAccessLogService.createAccessLog({
        medical_record_id: record._id,
        patient_id: record.patient_id,
        accessed_by: actorContext.actorId,
        accessed_by_email: actorContext.actorEmail,
        access_type: "DELETE",
        old_values: toPlainRecord(existingRecord),
        new_values: toPlainRecord(record),
        ...footprint,
      });
    } catch (logError) {
      console.warn("[MedicalRecordAccessLog] Failed to record delete event", logError);
    }

    res.status(200).json({
      message: "Patient medical record deleted",
      record,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    if (error instanceof Error && error.message === "recordId is required") {
      res.status(400).json({ message: error.message });
      return;
    }

    errorHandler(res, error);
  }
};

export { createPatientRecord, getAllPatientRecords, updatePatientRecord, deletePatientRecord, getPatientRecordDetail };
