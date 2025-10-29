import type { Request, Response } from "express";
import { PatientService, type CreatePatientPayload } from "../services/patient.service.js";
import { errorHandler } from "../utils/error.util.js";

const patientService = new PatientService();

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
    const patient = await patientService.getPatientDetail(id, includeUser);

    if (!patient) {
      console.log(`   ❌ Patient not found: ${id}`);
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    console.log(`   ✅ Found patient: ${patient.patient_code} (User: ${patient.user_id})`);
    res.status(200).json({ patient });
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
    const { user_id, emergency_contact } = req.body ?? {};
    const userId = (req as any).userId;

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

    const patient = await patientService.createPatient({
      user_id,
      emergency_contact: emergency_contact ?? { name: "", phone: "" },
      is_active: true,
      created_by: "system",
    });

    console.log(`   ✅ Patient created: ${patient.patient_code} (ID: ${patient._id})`);
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

    if (shouldHardDelete) {
      const deleted = await patientService.hardDeletePatient(id);
      if (!deleted) {
        console.log(`   ❌ Patient not found: ${id}`);
        res.status(404).json({ message: "Patient not found" });
        return;
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

    console.log(`   ✅ Patient soft deleted: ${patient.patient_code}`);
    res.status(200).json({ message: "Patient deleted", patient });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Error: ${errorMsg}`);
    errorHandler(res, error);
  }
};

export { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
