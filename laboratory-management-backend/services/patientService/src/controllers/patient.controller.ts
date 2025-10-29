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

    res.status(200).json(result);
  } catch (error) {
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

    if (!id) {
      res.status(400).json({ message: "Patient ID is required" });
      return;
    }

    const includeUser = typeof populateUser === "string" ? populateUser.toLowerCase() === "true" : true;
    const patient = await patientService.getPatientDetail(id, includeUser);

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json({ patient });
  } catch (error) {
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

    if (!user_id) {
      res.status(400).json({ message: "user_id is required" });
      return;
    }

    const existingPatient = await patientService.getPatientByUserId(user_id);
    if (existingPatient) {
      res.status(200).json({ message: "Patient already exists", patient: existingPatient });
      return;
    }

    const patient = await patientService.createPatient({
      user_id,
      emergency_contact: emergency_contact ?? { name: "", phone: "" },
      is_active: true,
      created_by: "system",
    });

    res.status(201).json({ message: "Patient created", patient });
  } catch (error) {
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

    if (!id) {
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
      res.status(400).json({ message: "No valid fields provided for update" });
      return;
    }

    const updatedPatient = await patientService.updatePatient(id, updateData);

    if (!updatedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json({ message: "Patient updated", patient: updatedPatient });
  } catch (error) {
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

    if (!id) {
      res.status(400).json({ message: "Patient ID is required" });
      return;
    }

    const shouldHardDelete = typeof hard === "string" ? hard.toLowerCase() === "true" : false;

    if (shouldHardDelete) {
      const deleted = await patientService.hardDeletePatient(id);
      if (!deleted) {
        res.status(404).json({ message: "Patient not found" });
        return;
      }

      res.status(200).json({ message: "Patient permanently deleted" });
      return;
    }

    const patient = await patientService.softDeletePatient(id);

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.status(200).json({ message: "Patient deleted", patient });
  } catch (error) {
    errorHandler(res, error);
  }
};

export { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
