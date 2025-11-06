import express from "express";
import {
  deleteInstrumentHistoryController,
  getInstrumentHistoryDetailController,
  listInstrumentHistoryController,
} from "../../../controllers/instrument/instrumentHistory.controller.js";
import authenticateUser from "../../../middlewares/authenticate.middleware.js";
import { isInternalApiKeyValid } from "../../../middlewares/internalApi.middleware.js";

const router = express.Router();

const authorizeAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (isInternalApiKeyValid(req)) {
    next();
    return;
  }

  authenticateUser.authenticateUser(req, res, next);
};

router.get(
  "/",
  /*
  #swagger.tags = ['InstrumentHistory']
  #swagger.summary = 'List instrument history entries'
  #swagger.description = 'Retrieve paginated instrument history with optional filters.'
  #swagger.parameters['instrument_id'] = { in: 'query', type: 'string' }
  #swagger.parameters['instrument_code'] = { in: 'query', type: 'string' }
  #swagger.parameters['history_type'] = { in: 'query', type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'] }
  #swagger.parameters['performed_by'] = { in: 'query', type: 'string' }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  */
  authorizeAccess,
  listInstrumentHistoryController
);

router.get(
  "/:id",
  /*
  #swagger.tags = ['InstrumentHistory']
  #swagger.summary = 'Get instrument history detail'
  #swagger.description = 'Retrieve detail of a specific instrument history entry.'
  */
  authorizeAccess,
  getInstrumentHistoryDetailController
);

router.delete(
  "/:id",
  /*
  #swagger.tags = ['InstrumentHistory']
  #swagger.summary = 'Delete instrument history entry'
  #swagger.description = 'Remove a specific instrument history entry.'
  */
  authorizeAccess,
  deleteInstrumentHistoryController
);

export default router;
