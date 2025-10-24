import Joi from "joi";
import { validateRole } from "../utils/validation.util.js";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  }),
  fullName: Joi.string().min(1).required().messages({
    'string.min': 'Full name must be at least 1 character long',
    'any.required': 'Full name is required'
  }),
  identityNumber: Joi.string().min(1).required().messages({
    'string.min': 'Identity number must be at least 1 character long',
    'any.required': 'Identity number is required'
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'string.valid': 'Invalid gender',
    'any.required': 'Gender is required'
  }),
  age: Joi.number().integer().min(0).required().messages({
    'number.integer': 'Age must be an integer',
    'number.min': 'Age must be at least 0',
    'any.required': 'Age is required'
  }),
  dateOfBirth: Joi.date().required().messages({
    'date.base': 'Invalid date of birth',
    'any.required': 'Date of birth is required'
  }),
  phoneNumber: Joi.string().min(1).required().messages({
    'string.min': 'Phone number must be at least 1 character long',
    'any.required': 'Phone number is required',
  }),
  address: Joi.string().min(1).required().messages({
    'string.min': 'Address must be at least 1 character long',
    'any.required': 'Address is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().custom((value, helpers) => {
    if (!validateRole(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'any.invalid': 'Invalid role code'
  })
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email address',
  }),
  fullName: Joi.string().min(1).messages({
    'string.min': 'Full name must be at least 1 character long',
  }),
  identityNumber: Joi.string().min(1).messages({
    'string.min': 'Identity number must be at least 1 character long',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').messages({
    'string.valid': 'Invalid gender',
  }),
  age: Joi.number().integer().min(0).messages({
    'number.integer': 'Age must be an integer',
    'number.min': 'Age must be at least 0',
  }),
  dateOfBirth: Joi.date().messages({
    'date.base': 'Invalid date of birth',
  }),
  phoneNumber: Joi.string().min(1).messages({
    'string.min': 'Phone number must be at least 1 character long',
  }),
  address: Joi.string().min(1).messages({
    'string.min': 'Address must be at least 1 character long',
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'Password must be at least 6 characters long'
  })
}).min(1);