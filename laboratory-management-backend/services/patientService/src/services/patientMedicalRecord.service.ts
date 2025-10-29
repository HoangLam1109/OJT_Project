import PatientMedicalRecord, { type PatientMedicalRecordDTO } from "../db/models/PatientMedicalRecord.model.js";
import Patient, { type IPatient } from "../db/models/Patient.model.js";

export type PatientMedicalRecordWithPatient = PatientMedicalRecordDTO & {
  patient?: IPatient | null;
};

export class PatientMedicalRecordService {
  async createPatientRecord(
    payload: Partial<PatientMedicalRecordDTO> & { patient_id: string },
    createdBy?: string
  ): Promise<PatientMedicalRecordDTO> {
    const patientId = payload.patient_id?.trim();

    if (!patientId) {
      throw new Error("patient_id is required");
    }

    const patient = await Patient.findOne({ _id: patientId, is_deleted: false }).lean();
    if (!patient) {
      throw new Error("Patient not found");
    }

    const existingRecord = await PatientMedicalRecord.findOne({ patient_id: patientId, is_deleted: false }).lean();
    if (existingRecord) {
      throw new Error("Patient medical record already exists for this patient");
    }

    const recordData = {
      patient_id: patientId,
      blood_type: payload.blood_type,
      allergies: payload.allergies,
      chronic_conditions: payload.chronic_conditions,
      current_medications: payload.current_medications,
      medical_history: payload.medical_history,
      clinical_notes: payload.clinical_notes,
      recent_test_summary: payload.recent_test_summary,
      recent_instruments_used: payload.recent_instruments_used,
      recent_reagents_info: payload.recent_reagents_info,
      created_by: payload.created_by || createdBy,
      updated_by: payload.updated_by || createdBy,
      is_deleted: false,
    };

    const record = await PatientMedicalRecord.create(recordData);
    return record.toObject() as PatientMedicalRecordDTO;
  }

  async getAllPatientRecords(
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 10,
    includePatient: boolean = false
  ): Promise<{ records: PatientMedicalRecordWithPatient[]; total: number; page: number; totalPages: number }> {
    const refinedFilters = { ...filters };

    if (typeof refinedFilters.is_deleted === "undefined") {
      refinedFilters.is_deleted = false;
    }

    const skip = (page - 1) * limit;

    const projection = {
      _id: 1,
      patient_id: 1,
      record_code: 1,
      blood_type: 1,
      allergies: 1,
      chronic_conditions: 1,
      current_medications: 1,
      medical_history: 1,
      clinical_notes: 1,
      recent_test_summary: 1,
      recent_instruments_used: 1,
      recent_reagents_info: 1,
      created_at: 1,
      updated_at: 1,
      created_by: 1,
      updated_by: 1,
      is_deleted: 1,
      deleted_at: 1,
      deleted_by: 1,
    } as const;

    const [rawRecords, total] = await Promise.all([
      PatientMedicalRecord.find(refinedFilters, projection)
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PatientMedicalRecord.countDocuments(refinedFilters),
    ]);

    const records = rawRecords as PatientMedicalRecordDTO[];

    if (!includePatient || records.length === 0) {
      return {
        records,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    const patientIds = records.map((record) => record.patient_id).filter(Boolean);
    const uniquePatientIds = [...new Set(patientIds)];

    const patients = await Patient.find({ _id: { $in: uniquePatientIds } })
      .select({
        _id: 1,
        user_id: 1,
        patient_code: 1,
        emergency_contact: 1,
        last_visit_date: 1,
        last_test_type: 1,
        is_active: 1,
        created_at: 1,
        updated_at: 1,
      })
      .lean<IPatient[]>();

    const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));

    const recordsWithPatient: PatientMedicalRecordWithPatient[] = records.map((record) => ({
      ...record,
      patient: patientMap.get(record.patient_id) ?? null,
    }));

    return {
      records: recordsWithPatient,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updatePatientRecord(
    recordId: string,
    updates: Partial<PatientMedicalRecordDTO>,
    updatedBy?: string
  ): Promise<PatientMedicalRecordDTO | null> {
    const trimmedId = recordId?.trim();
    if (!trimmedId) {
      throw new Error("recordId is required");
    }

    const allowedFields: Array<keyof PatientMedicalRecordDTO> = [
      "record_code",
      "blood_type",
      "allergies",
      "chronic_conditions",
      "current_medications",
      "medical_history",
      "clinical_notes",
      "recent_test_summary",
      "recent_instruments_used",
      "recent_reagents_info",
    ];

    const payload: Partial<PatientMedicalRecordDTO> = {};

    for (const field of allowedFields) {
      if (typeof updates[field] !== "undefined") {
        payload[field] = updates[field];
      }
    }

    if (updatedBy) {
      payload.updated_by = updatedBy;
    } else if (typeof updates.updated_by !== "undefined") {
      payload.updated_by = updates.updated_by;
    }

    if (Object.keys(payload).length === 0) {
      return await PatientMedicalRecord.findOne({ _id: trimmedId, is_deleted: false }).lean<
        PatientMedicalRecordDTO | null
      >();
    }

    const updatedRecord = await PatientMedicalRecord.findOneAndUpdate(
      { _id: trimmedId, is_deleted: false },
      { $set: payload },
      { new: true, runValidators: true }
    ).lean<PatientMedicalRecordDTO | null>();

    return updatedRecord;
  }

  async deletePatientRecord(recordId: string, deletedBy?: string): Promise<PatientMedicalRecordDTO | null> {
    const trimmedId = recordId?.trim();
    if (!trimmedId) {
      throw new Error("recordId is required");
    }

    const updatePayload: Record<string, unknown> = {
      is_deleted: true,
      deleted_at: new Date(),
    };

    if (deletedBy) {
      updatePayload.deleted_by = deletedBy;
      updatePayload.updated_by = deletedBy;
    }

    const deletedRecord = await PatientMedicalRecord.findOneAndUpdate(
      { _id: trimmedId, is_deleted: false },
      { $set: updatePayload },
      { new: true }
    ).lean<PatientMedicalRecordDTO | null>();

    return deletedRecord;
  }
}
