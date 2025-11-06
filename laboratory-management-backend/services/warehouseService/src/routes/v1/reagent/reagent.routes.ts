import express from "express";
import { ReagentController } from "../../../controllers/reagent/reagent.controller.js";

const reagent = new ReagentController();
const router = express.Router();

router.get(
  "/",
  /*
  #swagger.tags = ['Reagents']
  #swagger.summary = 'Get all reagents'
  #swagger.description = 'Retrieve a list of all reagents in the system, including available, low stock, and expired ones.'
  #swagger.responses[200] = {
    description: 'List of reagents',
    schema: {
      success: true
    }
  }
  */
  reagent.getAllReagents
);

router.get(
  "/:id",
  /*
  #swagger.tags = ['Reagents']
  #swagger.summary = 'Get reagent by ID'
  #swagger.description = 'Retrieve details of a specific reagent by its ID.'
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'Reagent ID',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = {
    description: 'Reagent details retrieved successfully',
    schema: {
      success: true,
    }
  }
  #swagger.responses[404] = {
    description: 'Reagent not found'
  }
  */
  reagent.getReagentById
);

router.post(
  "/",
  /*
  #swagger.tags = ['Reagents']
  #swagger.summary = 'Create a new reagent'
  #swagger.description = 'Add a new reagent to the system. If low_stock_threshold is not provided, it will default to 10% of quantity_received.'
  #swagger.parameters['body'] = {
  in: 'body',
  description: 'Reagent object that needs to be added',
  required: true,
  schema: {
  "reagent_code": "RG20251109673",
  "reagent_name": "Diluent Solution",
  "reagent_type": "Diluent",
  "quantity_received": 5000,
  "quantity_current": 5000,
  "unit_of_measure": "ml",
  "usage_per_run": 5,
  "expiration_date": "2026-10-01T00:00:00.000Z",
  "received_date": "2025-10-01T09:00:00.000Z",
  "status": "Available",
  "low_stock_threshold": 500,
  "storage_location": "Shelf A - Lab Room 1",
  "created_by": "USER001",
  "updated_by": "USER001"
  }
  }
  #swagger.responses[201] = {
  description: 'Reagent created successfully',
  schema: {
  success: true,
  }
  }
  #swagger.responses[400] = {
  description: 'Invalid input data'
  }
  */
  reagent.createReagent
);

router.delete(
  "/:id",
  /*
  #swagger.tags = ['Reagents']
  #swagger.summary = 'Soft delete a reagent'
  #swagger.description = 'Mark a reagent as deleted without removing it from the database.'
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'Reagent ID to be soft deleted',
    required: true,
    type: 'string'
  }
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Optional info about who deletes the reagent',
    required: false,
    schema: {
      deleted_by: "USER001"
    }
  }
  #swagger.responses[200] = {
    description: 'Reagent soft deleted successfully',
    schema: {
      success: true,
    }
  }
  #swagger.responses[404] = {
    description: 'Reagent not found'
  }
  #swagger.responses[500] = {
    description: 'Server error'
  }
  */
  reagent.deleteReagent
);



export default router;