// routes/testResult.routes.ts
import express from "express";
import {
  getTestOrdersWithResultsSummary,
  getTestOrderById,
  deleteTestResult,
  updateTestResult,
  searchTestResultsPaginated
} from "../controllers/testResult.controller.js";

const router = express.Router();


router.get("/all", getTestOrdersWithResultsSummary);

router.get("/search", searchTestResultsPaginated);

router.get("/getById/:id", getTestOrderById);

router.put("/update/:id", updateTestResult);

router.delete("/delete/:id", deleteTestResult);


export default router;
