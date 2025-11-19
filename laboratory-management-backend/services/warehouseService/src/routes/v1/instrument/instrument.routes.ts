import express from "express";
import {
  addInstrumentController,
  deleteInstrumentController,
  getInstrumentDetailController,
  listInstrumentsController,
  updateInstrumentController,
} from "../../../controllers/instrument/instrument.controller.js";
import authenticateUser from "../../../middlewares/authenticate.middleware.js";
import { isInternalApiKeyValid } from "../../../middlewares/internalApi.middleware.js";

const router = express.Router();

const authorizeWriteAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (isInternalApiKeyValid(req)) {
    next();
    return;
  }

  authenticateUser.authenticateUser(req, res, next);
};

router.post(
  "/",
  /*
  #swagger.tags = ['Instruments']
  #swagger.summary = 'Add new instrument'
  #swagger.description = 'Creates a new laboratory instrument. Optionally clone from an existing instrument.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      instrument_name: 'Cobas 6000',
      instrument_type: 'Analyzer',
      manufacturer: 'Roche',
      location: 'Lab A - Bench 3',
    }
  }
  */
  authorizeWriteAccess,
  addInstrumentController
);

router.get(
  "/",
  /*
  #swagger.tags = ['Instruments']
  #swagger.summary = 'List instruments'
  #swagger.description = 'Retrieve paginated list of instruments with filters.'
  #swagger.parameters['status'] = { in: 'query', type: 'string' }
  #swagger.parameters['is_active'] = { in: 'query', type: 'boolean' }
  #swagger.parameters['manufacturer'] = { in: 'query', type: 'string' }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['sort'] = { in: 'query', type: 'string', default: 'created_at' }
  */
  listInstrumentsController
);

router.get(
  "/:id",
  /*
  #swagger.tags = ['Instruments']
  #swagger.summary = 'Get instrument detail'
  #swagger.description = 'Retrieve detailed information for a single instrument.'
  */
  getInstrumentDetailController
);

router.put(
  "/:id",
  /*
  #swagger.tags = ['Instruments']
  #swagger.summary = 'Update instrument'
  #swagger.description = 'Update basic instrument information and status.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      instrument_name: 'Cobas 6000 Updated',
      instrument_type: 'Analyzer',
      manufacturer: 'Roche',
      location: 'Lab B - Bench 5',
      status: 'Processing',
      is_active: true
    }
  }
  */
  authorizeWriteAccess,
  updateInstrumentController
);

router.delete(
  "/:id",
  /*
  #swagger.tags = ['Instruments']
  #swagger.summary = 'Delete instrument'
  #swagger.description = 'Soft delete an instrument record.'
  */
  authorizeWriteAccess,
  deleteInstrumentController
);

export default router;
