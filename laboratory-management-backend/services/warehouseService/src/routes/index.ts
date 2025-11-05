import express from "express";
import { healthCheck } from "../controllers/health.controller.js";

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

export default router;
