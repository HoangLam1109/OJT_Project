import Joi from "joi";

export const emailLinkSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  }),
});

export const resetPasswordSchema = Joi.object({
  dedicatedToken: Joi.string().required().messages({
    'any.required': 'Dedicated token is required'
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'Password must be at least 6 characters long'
  })
});