import express from "express";
import { healthCheck } from "../controllers/health.controller.js";
import instrumentRoutes from "./v1/instrument/instrument.routes.js";
import { ReagentController } from "../controllers/reagent.controller.js";
const reagent = new ReagentController();
const router = express.Router();

// ===============================
// 🔹 GET ALL REAGENTS
// ===============================
router.get(
  "/warehouse/reagents",
  /*
  #swagger.tags = ['Reagents']
  #swagger.summary = 'Get all reagents'
  #swagger.description = 'Retrieve a list of all reagents in the system, including available, low stock, and expired ones.'
  #swagger.responses[200] = {
    description: 'List of reagents',
    schema: {
      success: true,
      data: [
        {
          _id: 'uuid',
          reagent_code: 'RG202510090001',
          reagent_name: 'Diluent A',
          reagent_type: 'Cleaner',
          quantity_current: 250,
          unit_of_measure: 'mL',
          status: 'Available'
        }
      ]
    }
  }
  */
  reagent.getAllReagents
);

router.use(
	"/warehouse/instruments",
	/*
	#swagger.tags = ['Instruments']
	#swagger.description = 'Inventory instrument endpoints'
	*/
	instrumentRoutes
);

export default router;
