import express from "express";
import { healthCheck } from "../controllers/health.controller.js";
import instrumentRoutes from "./v1/instrument/instrument.routes.js";

const router = express.Router();

router.get(
	"/health",
	/*
	#swagger.tags = ['Health']
	#swagger.summary = 'Health check'
	#swagger.description = 'Returns the service status so orchestrators know the microservice is alive.'
	#swagger.responses[200] = {
		description: 'Service is healthy',
		schema: {
			status: 'OK',
			service: 'WarehouseService'
		}
	}
	*/
	healthCheck
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
