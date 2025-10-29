import type {Request, Response, NextFunction} from "express";
import { createTestOrderSchema, updateTestOrderSchema } from "../validators/testOrder.validator.js";


export const validateCreateTestOrder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createTestOrderSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateUpdateTestOrder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateTestOrderSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};