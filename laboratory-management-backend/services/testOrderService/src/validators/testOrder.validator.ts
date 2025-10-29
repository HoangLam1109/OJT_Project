import Joi, { ObjectSchema } from "joi";
import { ITestOrder } from "../db/models/TestOrder.model.js";


export const createTestOrderSchema: ObjectSchema<ITestOrder> = Joi.object({
  patient_id: Joi.string().required().messages({
    "any.required": "Patient ID is required",
    "string.base": "Patient ID must be a string",
  }),

  barcode: Joi.string().required().messages({
    "any.required": "Barcode is required",
    "string.base": "Barcode must be a string",
  }),

  status: Joi.string().required().messages({
    "any.required": "Status is required",
    "string.base": "Status must be a string",
  }),

  created_by: Joi.string().required().messages({
    "any.required": "Created_by is required",
    "string.base": "Created_by must be a string",
  }),

  created_at: Joi.date().default(() => new Date()),

  run_at: Joi.date().optional().messages({
    "date.base": "Run_at must be a valid date",
  }),

  run_by: Joi.string().optional().messages({
    "string.base": "Run_by must be a string",
  }),

  updated_at: Joi.date().optional().default(() => new Date()),

  updated_by: Joi.string().optional().messages({
    "string.base": "Updated_by must be a string",
  }),

  is_deleted: Joi.boolean().default(false),

  deleted_at: Joi.date().optional().messages({
    "date.base": "Deleted_at must be a valid date",
  }),

  deleted_by: Joi.string().optional().messages({
    "string.base": "Deleted_by must be a string",
  }),
});



export const updateTestOrderSchema: ObjectSchema<Partial<ITestOrder>> = Joi.object({
  patient_id: Joi.string().messages({
    "string.base": "Patient ID must be a string",
  }),

  barcode: Joi.string().messages({
    "string.base": "Barcode must be a string",
  }),

  status: Joi.string().messages({
    "string.base": "Status must be a string",
  }),

  run_at: Joi.date().messages({
    "date.base": "Run_at must be a valid date",
  }),

  run_by: Joi.string().messages({
    "string.base": "Run_by must be a string",
  }),

  updated_at: Joi.date().default(() => new Date()),

  updated_by: Joi.string().messages({
    "string.base": "Updated_by must be a string",
  }),

  is_deleted: Joi.boolean().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),

  deleted_at: Joi.date().messages({
    "date.base": "Deleted_at must be a valid date",
  }),

  deleted_by: Joi.string().messages({
    "string.base": "Deleted_by must be a string",
  }),
}).min(1);
