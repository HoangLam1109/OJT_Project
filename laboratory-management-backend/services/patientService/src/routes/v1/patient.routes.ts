// patient routes placeholder
import { Router } from 'express';
import { getPatient } from '../../controllers/patient.controller';

const router = Router();
router.get('/', getPatient);

export default router;
