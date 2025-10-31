import type {Request, Response, NextFunction} from "express";
import { AppError } from "../utils/error.util.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";
import { createRoleSchema, updateRoleSchema } from "../validators/role.validator.js";

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createUserSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    throw new AppError(400, error.details[0].message);
  }
  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    throw new AppError(400, error.details[0].message);
  }
  next();
};

export const validateCreateRole = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createRoleSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    throw new AppError(400, error.details[0].message);
  }
  next();
};

export const validateUpdateRole = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateRoleSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    throw new AppError(400, error.details[0].message);
  }
  next();
};
