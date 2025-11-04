import type { Request, Response } from "express";
import { PatientService, type CreatePatientPayload } from "../services/patient.service.js";
import { errorHandler } from "../utils/error.util.js";
import patientAuditLogService, { type CreateAuditLogPayload } from "../services/patientAuditLog.service.js";
import iamServiceClient from "../services/iamService.client.js";

const patientService = new PatientService();

const fetchUserEmail = async (userId: string | null | undefined): Promise<string | null> => {
  if (!userId || typeof userId !== "string") {
    return null;
  }
  try {
    const user = await iamServiceClient.getUserById(userId);
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.warn(`[PatientController] Unable to resolve email for user ${userId}`, error);
  }
  return null;
};

const resolvePerformedBy = async (req: Request, fallback?: string): Promise<string> => {
  const headerEmailRaw = req.headers["x-user-email"];
  const headerEmail = Array.isArray(headerEmailRaw) ? headerEmailRaw[0] : headerEmailRaw;
  if (typeof headerEmail === "string" && headerEmail.length > 0) {
    (req as any).userEmail = headerEmail;
    return headerEmail;
  }

  const cachedEmail = (req as any).userEmail;
  if (typeof cachedEmail === "string" && cachedEmail.length > 0) {
    return cachedEmail;
  }

  const headerUserIdRaw = req.headers["x-user-id"];
  const headerUserId = Array.isArray(headerUserIdRaw) ? headerUserIdRaw[0] : headerUserIdRaw;
  const userId = (req as any).userId ?? (typeof headerUserId === "string" ? headerUserId : undefined);
  if (typeof userId === "string" && userId.length > 0) {
    const email = await fetchUserEmail(userId);
    if (email) {
      (req as any).userEmail = email;
      return email;
    }
  }

  if (fallback) {
    if (fallback.includes("@")) {
      return fallback;
    }
    if (fallback === "system") {
      return fallback;
    }
    const fallbackEmail = await fetchUserEmail(fallback);
    if (fallbackEmail) {
      return fallbackEmail;
    }
    return fallback;
  }

  return "system";
};

const extractChangedFields = (payload: Record<string, unknown> | null | undefined): string[] => {
  if (!payload) {
    return [];
  }
  return Object.keys(payload).filter((key) => key !== "__v");
};

const pickFields = (
  source: Record<string, unknown> | null | undefined,
  fields: string[]
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (!source) {
    return result;
  }
  for (const field of fields) {
    if (field in source) {
      result[field] = source[field];
    }
  }
  return result;
};

const appendRequestMetadata = (
  req: Request,
  target: { ip_address?: string; user_agent?: string }
): void => {
  if (req.ip) {
    target.ip_address = req.ip;
  }
  const userAgent = req.get("user-agent");
  if (userAgent) {
    target.user_agent = userAgent;
  }
};

const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Get all patients with pagination, search and filters'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10 }
    #swagger.parameters['search'] = { in: 'query', type: 'string' }
    #swagger.parameters['isActive'] = { in: 'query', type: 'boolean' }
    #swagger.parameters['populateUser'] = { in: 'query', type: 'boolean', default: true }
  */
  try {
    const { page = "1", limit = "10", search, isActive, populateUser = "true" } = req.query;
    const userId = (req as any).userId; 

    console.log(`\n📋 [LIST PATIENTS] User: ${userId}`);
    console.log(`   └─ Page: ${page}, Limit: ${limit}`);
    if (search) console.log(`   └─ Search: ${search}`);
    if (isActive) console.log(`   └─ Filter Active: ${isActive}`);
    console.log(`   └─ Include User: ${populateUser}`);

    const filters: Record<string, unknown> = {};

    if (typeof search === "string" && search.trim().length > 0) {
      const regex = { $regex: search.trim(), $options: "i" };
      filters.$or = [
        { patient_code: regex },
        { user_id: regex },
        { last_test_type: regex },
      ];
    }

    if (typeof isActive === "string") {
      filters.is_active = isActive.toLowerCase() === "true";
    }

    const shouldPopulateUser = typeof populateUser === "string" ? populateUser.toLowerCase() === "true" : true;

    const result = await patientService.getAllPatients(
      filters,
      Number(page),
      Number(limit),
      shouldPopulateUser
    );

    console.log(`   ✅ Found ${result.total} total patients, returned ${result.patients.length} patients (Page ${result.page}/${result.totalPages})`);
    res.status(200).json(result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const getPatientById = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Get a single patient by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    #swagger.parameters['populateUser'] = { in: 'query', type: 'boolean', default: true }
  */
  try {
    const { id } = req.params;
    const { populateUser = "true" } = req.query;
    const userId = (req as any).userId;

    console.log(`\n📖 [GET PATIENT DETAIL] User: ${userId}`);
    console.log(`   └─ Patient ID: ${id}`);
    console.log(`   └─ Include User: ${populateUser}`);

    if (!id) {
      console.log(`   ❌ Missing patient ID`);
      res.status(400).json({ message: "Patient ID is required" });
      return;
    }

  const includeUser = typeof populateUser === "string" ? populateUser.toLowerCase() === "true" : true;
  const patient = await patientService.getPatientById(id, includeUser);

    if (!patient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    console.log(`   ✅ Found patient: ${patient.patient_code} (User: ${patient.user_id})`);
    res.status(200).json({
      patient,
      ...(includeUser ? { user: (patient as any).user ?? null } : {}),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const createPatient = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Create a new patient profile for an existing IAM user'
    #swagger.security = [{"internalApiKey": []}, {"apiKeyAuth": []}]
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          example: {
            user_id: '661fd5f2eecf99292a1a1c1b',
            emergency_contact: {
              name: 'John Doe',
              phone: '+84-912345678'
            }
          }
        }
      }
  */
  try {

    console.log(`   └─ Headers:`, JSON.stringify(req.headers));
    console.log(`   └─ Raw body type: ${typeof req.body}`);
    console.log(`   └─ Body:`, req.body);

    // Nếu body là string (PowerShell hoặc client gửi sai), parse lại
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
        console.log("   [DEBUG] Parsed body from string:", body);
      } catch (err) {
        console.log("   [ERROR] Cannot parse body string:", err);
      }
    }
    // Nếu body có thuộc tính example (gửi từ Swagger UI), lấy từ example
    if (body && typeof body === 'object' && body.example) {
      body = body.example;
    }
    let { user_id, emergency_contact } = (body ?? {}) as any;
    const userId = (req as any).userId;

    // Fallback: accept user_id from query string or JWT when body missing
    if (!user_id) {
      user_id = (typeof req.query.user_id === 'string' ? req.query.user_id : undefined) || userId;
      if (user_id) {
        console.log(`   [DEBUG] Using fallback user_id: ${user_id}`);
      }
    }

    console.log(`\n➕ [CREATE PATIENT] User: ${userId}`);
    console.log(`   └─ New User ID: ${user_id}`);
    console.log(`   └─ Emergency Contact: ${JSON.stringify(emergency_contact)}`);

    if (!user_id) {
      console.log(`   ❌ Missing user_id`);
      res.status(400).json({ message: "user_id is required" });
      return;
    }

    const existingPatient = await patientService.getPatientByUserId(user_id);
    if (existingPatient) {
      console.log(`   ℹ️  Patient already exists: ${existingPatient.patient_code}`);
      res.status(200).json({ message: "Patient already exists", patient: existingPatient });
      return;
    }

    const actorEmail = await resolvePerformedBy(req, "system");

    const patient = await patientService.createPatient({
      user_id,
      emergency_contact: emergency_contact ?? { name: "", phone: "" },
      is_active: true,
      created_by: actorEmail,
    });

    console.log(`   ✅ Patient created: ${patient.patient_code} (ID: ${patient._id})`);

    const createAuditPayload: CreateAuditLogPayload = {
      patient_id: patient._id,
      action: "CREATE",
      event_message: "Patient record created",
      old_values: null,
      new_values: patient as unknown as Record<string, unknown>,
      performed_by: actorEmail,
    };
    appendRequestMetadata(req, createAuditPayload);
    try {
      await patientAuditLogService.createAuditLog(createAuditPayload);
    } catch (logError) {
      console.error("[PatientAuditLog] Failed to record create event", logError);
    }

    res.status(201).json({ message: "Patient created", patient });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const updatePatient = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Update patient details'
    #swagger.security = [{"internalApiKey": []}, {"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: false }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            id: '',
            emergency_contact: {
              name: '',
              phone: ''
            },
            last_test_type: '',
            is_active: true
        }
      }
  */
  try {
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const idFromParams = req.params?.id;
    const idFromBody = typeof payload.id === "string" ? payload.id : undefined;
    const id = idFromParams || idFromBody;
    const userId = (req as any).userId;

    console.log(`\n✏️  [UPDATE PATIENT] User: ${userId}`);
    console.log(`   └─ Patient ID: ${id}`);
    console.log(`   └─ Updates: ${JSON.stringify(payload).substring(0, 100)}...`);

    if (!id) {
      console.log(`   ❌ Missing patient ID`);
      res.status(400).json({ message: "Patient ID is required" });
      return;
    }

    const existingPatient = await patientService.getPatientById(id);
    if (!existingPatient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const updateData: Partial<CreatePatientPayload> = {};

    if (idFromBody) {
      delete (payload as Record<string, unknown>).id;
    }

    if (typeof payload.emergency_contact === "object" && payload.emergency_contact !== null) {
      updateData.emergency_contact = payload.emergency_contact as CreatePatientPayload["emergency_contact"];
    }

    if (typeof payload.last_visit_date !== "undefined") {
      const dateValue = new Date(payload.last_visit_date as string | number | Date);
      if (!Number.isNaN(dateValue.getTime())) {
        updateData.last_visit_date = dateValue;
      }
    }

    if (typeof payload.last_test_type === "string") {
      updateData.last_test_type = payload.last_test_type;
    }

    if (typeof payload.is_active !== "undefined") {
      if (typeof payload.is_active === "string") {
        updateData.is_active = payload.is_active.toLowerCase() === "true";
      } else if (typeof payload.is_active === "boolean") {
        updateData.is_active = payload.is_active;
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.log(`   ⚠️  No valid fields provided`);
      res.status(400).json({ message: "No valid fields provided for update" });
      return;
    }

    const updatedPatient = await patientService.updatePatient(id, updateData);

    if (!updatedPatient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const fallbackActor = (() => {
      const createdBy = existingPatient.created_by;
      if (typeof createdBy === "string" && createdBy.length > 0 && createdBy !== "system") {
        return createdBy;
      }
      return existingPatient.user_id;
    })();

    const actorEmail = await resolvePerformedBy(req, fallbackActor);

    const existingRecord = existingPatient as unknown as Record<string, unknown>;
    const updatedRecord = updatedPatient as unknown as Record<string, unknown>;
    const candidateFields = extractChangedFields(updateData as Record<string, unknown>);
    const changedFields = candidateFields.filter((field) => {
      const before = existingRecord[field];
      const after = updatedRecord[field];
      try {
        return JSON.stringify(before) !== JSON.stringify(after);
      } catch {
        return before !== after;
      }
    });

    if (changedFields.length > 0) {
      const updateAuditPayload: CreateAuditLogPayload = {
        patient_id: updatedPatient._id,
        action: "UPDATE",
        event_message: `Patient record updated (${changedFields.join(", ")})`,
        old_values: pickFields(existingRecord, changedFields),
        new_values: pickFields(updatedRecord, changedFields),
        performed_by: actorEmail,
      };
      appendRequestMetadata(req, updateAuditPayload);
      try {
        await patientAuditLogService.createAuditLog(updateAuditPayload);
      } catch (logError) {
        console.error("[PatientAuditLog] Failed to record update event", logError);
      }
    }

    console.log(`   ✅ Patient updated: ${updatedPatient.patient_code}`);
    res.status(200).json({ message: "Patient updated", patient: updatedPatient });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const deletePatient = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Delete a patient (soft delete by default)'
    #swagger.security = [{"internalApiKey": []}, {"apiKeyAuth": []}]
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true }
    #swagger.parameters['hard'] = { in: 'query', type: 'boolean', default: false }
  */
  try {
    const { id } = req.params;
    const { hard = "false" } = req.query;
    const userId = (req as any).userId;

    console.log(`\n🗑️  [DELETE PATIENT] User: ${userId}`);
    console.log(`   └─ Patient ID: ${id}`);
    console.log(`   └─ Hard Delete: ${hard}`);

    if (!id) {
      console.log(`   ❌ Missing patient ID`);
      res.status(400).json({ message: "Patient ID is required" });
      return;
    }

    const shouldHardDelete = typeof hard === "string" ? hard.toLowerCase() === "true" : false;
    const existingPatient = await patientService.getPatientById(id);

    if (!existingPatient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const fallbackActor = (() => {
      const createdBy = existingPatient.created_by;
      if (typeof createdBy === "string" && createdBy.length > 0 && createdBy !== "system") {
        return createdBy;
      }
      return existingPatient.user_id;
    })();

    const actorEmail = await resolvePerformedBy(req, fallbackActor);

    const existingRecord = existingPatient as unknown as Record<string, unknown>;

    if (shouldHardDelete) {
      const deleted = await patientService.hardDeletePatient(id);
      if (!deleted) {
        console.log(`   ❌ Patient not found: ${id}`);
        res.status(404).json({ message: "Patient not found" });
        return;
      }

      const deleteAuditPayload: CreateAuditLogPayload = {
        patient_id: existingPatient._id,
        action: "DELETE",
        event_message: "Patient record hard deleted",
        old_values: existingRecord,
        new_values: null,
        performed_by: actorEmail,
      };
      appendRequestMetadata(req, deleteAuditPayload);
      try {
        await patientAuditLogService.createAuditLog(deleteAuditPayload);
      } catch (logError) {
        console.error("[PatientAuditLog] Failed to record hard delete event", logError);
      }

      console.log(`   ✅ Patient permanently deleted (hard delete): ${id}`);
      res.status(200).json({ message: "Patient permanently deleted" });
      return;
    }

    const patient = await patientService.softDeletePatient(id);

    if (!patient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const updatedRecord = patient as unknown as Record<string, unknown>;
    const softDeleteFields = ["is_deleted", "is_active", "deleted_at"];
    const softDeleteAuditPayload: CreateAuditLogPayload = {
      patient_id: patient._id,
      action: "DELETE",
      event_message: "Patient record soft deleted",
      old_values: pickFields(existingRecord, softDeleteFields),
      new_values: pickFields(updatedRecord, softDeleteFields),
      performed_by: actorEmail,
    };
    appendRequestMetadata(req, softDeleteAuditPayload);
    try {
      await patientAuditLogService.createAuditLog(softDeleteAuditPayload);
    } catch (logError) {
      console.error("[PatientAuditLog] Failed to record soft delete event", logError);
    }

    console.log(`   ✅ Patient soft deleted: ${patient.patient_code}`);
    res.status(200).json({ message: "Patient deleted", patient });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

const softDeletePatientByUserId = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Soft delete patient by user ID (Internal API only)'
    #swagger.security = [{"internalApiKey": []}]
    #swagger.parameters['userId'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { userId } = req.params;

    console.log(`\n🗑️  [SOFT DELETE PATIENT BY USER ID]`);
    console.log(`   └─ User ID: ${userId}`);

    if (!userId) {
      console.log(`   ❌ Missing user ID`);
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const existingPatient = await patientService.getPatientByUserId(userId);

    if (!existingPatient) {
      console.log(`   ❌ Patient not found for user: ${userId}`);
      res.status(404).json({ message: "Patient not found for user" });
      return;
    }

    const patient = await patientService.softDeletePatientByUserId(userId);

    if (!patient) {
      console.log(`   ❌ Patient not found for user: ${userId}`);
      res.status(404).json({ message: "Patient not found for user" });
      return;
    }

    const existingRecord = existingPatient as unknown as Record<string, unknown>;
    const updatedRecord = patient as unknown as Record<string, unknown>;
    const softDeleteFields = ["is_deleted", "is_active", "deleted_at"];
    const fallbackActor = (() => {
      const createdBy = existingPatient.created_by;
      if (typeof createdBy === "string" && createdBy.length > 0 && createdBy !== "system") {
        return createdBy;
      }
      return existingPatient.user_id;
    })();

    const actorEmail = await resolvePerformedBy(req, fallbackActor);
    const softDeleteAuditPayload: CreateAuditLogPayload = {
      patient_id: patient._id,
      action: "DELETE",
      event_message: "Patient record soft deleted by user ID",
      old_values: pickFields(existingRecord, softDeleteFields),
      new_values: pickFields(updatedRecord, softDeleteFields),
      performed_by: actorEmail,
    };
    appendRequestMetadata(req, softDeleteAuditPayload);
    try {
      await patientAuditLogService.createAuditLog(softDeleteAuditPayload);
    } catch (logError) {
      console.error("[PatientAuditLog] Failed to record soft delete by user event", logError);
    }

    console.log(`   ✅ Patient soft deleted: ${patient.patient_code} (User: ${userId})`);
    res.status(200).json({ message: "Patient deleted for user", patient });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

export { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient, softDeletePatientByUserId };
