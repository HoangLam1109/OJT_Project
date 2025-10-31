import Joi, { ObjectSchema } from "joi";

// Validator keys use camelCase to match controller and frontend payloads
export const createTestOrderSchema: ObjectSchema<any> = Joi.object({
  patientId: Joi.string().required().messages({
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

  createdBy: Joi.string().required().messages({
    "any.required": "createdBy is required",
    "string.base": "createdBy must be a string",
  }),

  createdAt: Joi.date().default(() => new Date()),

  runAt: Joi.date().optional().messages({
    "date.base": "runAt must be a valid date",
  }),

  runBy: Joi.string().optional().messages({
    "string.base": "runBy must be a string",
  }),

  updatedAt: Joi.date().optional().default(() => new Date()),

  updatedBy: Joi.string().optional().messages({
    "string.base": "updatedBy must be a string",
  }),

  isDeleted: Joi.boolean().default(false),

  deletedAt: Joi.date().optional().messages({
    "date.base": "deletedAt must be a valid date",
  }),

  deletedBy: Joi.string().optional().messages({
    "string.base": "deletedBy must be a string",
  }),
});

export const updateTestOrderSchema: ObjectSchema<any> = Joi.object({
  patientId: Joi.string().messages({
    "string.base": "patientId must be a string",
  }),

  barcode: Joi.string().messages({
    "string.base": "barcode must be a string",
  }),

  status: Joi.string().messages({
    "string.base": "status must be a string",
  }),

  runAt: Joi.date().messages({
    "date.base": "runAt must be a valid date",
  }),

  runBy: Joi.string().messages({
    "string.base": "runBy must be a string",
  }),

  updatedAt: Joi.date().default(() => new Date()),

  updatedBy: Joi.string().messages({
    "string.base": "updatedBy must be a string",
  }),

  isDeleted: Joi.boolean().messages({
    "boolean.base": "isDeleted must be a boolean",
  }),

  deletedAt: Joi.date().messages({
    "date.base": "deletedAt must be a valid date",
  }),

  deletedBy: Joi.string().messages({
    "string.base": "deletedBy must be a string",
  }),
}).min(1);
