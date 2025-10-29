import type { Request, Response } from "express";
import { PatientService } from "../services/patient.service.js";
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

const createPatient = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['Patients']
    #swagger.description = 'Create a new patient profile for an existing IAM user'
    #swagger.security = [{"internalApiKey": []}]
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

export { getAllPatients, createPatient };
