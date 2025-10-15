import { getUser, createUser, updateUser, deleteUser, getAll } from "../../controllers/user.controller.js";
import express, { type Request, type Response, type NextFunction } from "express";
import Joi from "joi";

const router = express.Router();

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().min(1).required(),
  identityNumber: Joi.string().min(1).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  age: Joi.number().integer().min(0).required(),
  dateOfBirth: Joi.date().required(),
  password: Joi.string().min(6).required()
});

const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createUserSchema.validate(req.body);
  if (error?.details?.[0]?.message) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

router.get('/all', getAll);
router.get('/:id', getUser);

router.post('/create', validateCreateUser, createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;