import express from "express";
import { ReagentController } from "../../../controllers/reagent.controller.js";

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
  reagent.getById
);


export default router;