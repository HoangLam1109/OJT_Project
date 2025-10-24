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
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search by patient code, user ID, or test type',
      type: 'string'
    }
    #swagger.parameters['isActive'] = {
      in: 'query',
      description: 'Filter by active status',
      type: 'boolean'
    }
    #swagger.parameters['populateUser'] = {
      in: 'query',
      description: 'Include user details from IAM Service (default: true)',
      type: 'boolean',
      default: true
    }
    #swagger.responses[200] = {
      description: 'Patients retrieved successfully',
      schema: {
        patients: [{
          _id: 'uuid',
          user_id: 'user-uuid-from-iam',
          user: {
            _id: 'user-uuid-from-iam',
            email: 'user@example.com',
            fullName: 'Nguyen Van A',
            identityNumber: '001234567890',
            gender: 'male',
            age: 35,
            dateOfBirth: '1990-05-15',
            isActive: true,
            role: 'USER'
          },
          patient_code: 'PT202510240001',
          emergency_contact: {
            name: 'Nguyen Van Hung',
            phone: '0971234567'
          },
          last_visit_date: '2025-10-20',
          last_test_type: 'CBC',
          is_active: true,
          created_at: '2025-10-22T11:00:00Z',
          updated_at: '2025-10-22T11:00:00Z',
          created_by: 'admin-user-id'
        }],
        total: 100,
        page: 1,
        totalPages: 10
      }
    }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { page = 1, limit = 10, search, isActive, populateUser = 'true' } = req.query;

    const filters: any = {};
    
    // Filter out soft-deleted patients
    filters.is_deleted = false;
    
    if (search) {
      filters.$or = [
        { patient_code: { $regex: search, $options: "i" } },
        { user_id: { $regex: search, $options: "i" } },
        { last_test_type: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      filters.is_active = isActive === "true";
    }

    // Populate user data from IAM Service
    const shouldPopulateUser = populateUser === 'true';

    const patients = await patientService.getAllPatients(
      filters,
      Number(page),
      Number(limit),
      shouldPopulateUser
    );

    res.status(200).json(patients);
  } catch (error) {
    errorHandler(res, error);
  }
};

export {
  getAllPatients,
};
