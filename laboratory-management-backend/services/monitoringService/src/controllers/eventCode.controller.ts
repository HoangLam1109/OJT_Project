import type { Request, Response } from "express";
import eventCodeService, { type CreateEventCodePayload, type UpdateEventCodePayload, type EventCodeFilters } from "../services/eventCode.service.js";
import { errorHandler } from "../utils/error.util.js";

const getAllEventCodes = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Event Codes']
    #swagger.description = 'Get all event codes with filters and pagination'
    #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 50 }
    #swagger.parameters['category'] = { in: 'query', type: 'string' }
    #swagger.parameters['is_active'] = { in: 'query', type: 'boolean' }
  */
  try {
    const { page = "1", limit = "50", category, is_active } = req.query;

    const filters: EventCodeFilters = {
      ...(typeof category === "string" ? { category } : {}),
      ...(typeof is_active === "string" ? { is_active: is_active.toLowerCase() === "true" } : {}),
    };

    const result = await eventCodeService.getAllEventCodes(filters, Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getEventCodeByCode = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Event Codes']
    #swagger.description = 'Get event code by code'
    #swagger.parameters['code'] = { in: 'path', type: 'string', required: true }
  */
  try {
    const { code } = req.params;

    const eventCode = await eventCodeService.getEventCodeByCode(code.toUpperCase());
    if (!eventCode) {
      res.status(404).json({ message: "Event code not found" });
      return;
    }

    res.status(200).json({ eventCode });
  } catch (error) {
    errorHandler(res, error);
  }
};

const createEventCode = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Event Codes']
    #swagger.description = 'Create a new event code'
    #swagger.security = [{"internalApiKey": []}]
  */
  try {
    const payload: CreateEventCodePayload = req.body;

    if (!payload.event_code || !payload.event_name || !payload.description || !payload.category) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const eventCode = await eventCodeService.createEventCode(payload);
    res.status(201).json({ message: "Event code created", eventCode });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateEventCode = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Event Codes']
    #swagger.description = 'Update event code'
    #swagger.parameters['code'] = { in: 'path', type: 'string', required: true }
    #swagger.security = [{"internalApiKey": []}]
  */
  try {
    const { code } = req.params;
    const payload: UpdateEventCodePayload = req.body;

    const eventCode = await eventCodeService.updateEventCode(code.toUpperCase(), payload);
    if (!eventCode) {
      res.status(404).json({ message: "Event code not found" });
      return;
    }

    res.status(200).json({ message: "Event code updated", eventCode });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteEventCode = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Event Codes']
    #swagger.description = 'Soft delete event code (set is_active to false)'
    #swagger.parameters['code'] = { in: 'path', type: 'string', required: true }
    #swagger.security = [{"internalApiKey": []}]
  */
  try {
    const { code } = req.params;

    const deleted = await eventCodeService.deleteEventCode(code.toUpperCase());
    if (!deleted) {
      res.status(404).json({ message: "Event code not found" });
      return;
    }

    res.status(200).json({ message: "Event code deactivated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

export {
  getAllEventCodes,
  getEventCodeByCode,
  createEventCode,
  updateEventCode,
  deleteEventCode,
};
