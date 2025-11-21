// routes/testResult.routes.ts
import express from "express";
import {
  getTestOrdersWithResultsSummary,
  getTestResultByPatientId,
  deleteTestResult,
  updateTestResult,
  searchTestResultsPaginated
} from "../controllers/testResult.controller.js";

const router = express.Router();


router.get("/all", getTestOrdersWithResultsSummary);

router.get("/search", searchTestResultsPaginated);

router.get("/getResultsByPatientId/:id", getTestResultByPatientId);

router.put("/update/:id", updateTestResult);

router.delete("/delete/:id", deleteTestResult);


export default router;
