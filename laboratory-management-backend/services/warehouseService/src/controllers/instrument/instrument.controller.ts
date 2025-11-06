import type { Request, Response, NextFunction } from "express";
import {
  createInstrumentService,
  deleteInstrumentService,
  getInstrumentByIdService,
  getInstrumentsService,
  updateInstrumentService,
} from "../../services/instrument/instrument.service.js";
import {
  createInstrumentSchema,
  getInstrumentsSchema,
  updateInstrumentSchema,
} from "../../validators/instrument/instrument.validator.js";
import type { InstrumentListResponse, InstrumentResponse } from "../../dtos/instrument.dto.js";
import iamServiceClient from "../../services/iamService/client/index.js";

const fetchUserEmail = async (userId: string | null | undefined): Promise<string | null> => {
  if (!userId || typeof userId !== "string") {
    return null;
  }
  try {
    const user = await iamServiceClient.getUserById(userId);
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.warn(`[InstrumentController] Unable to resolve email for user ${userId}`, error);
  }
  return null;
};

const resolvePerformedBy = async (req: Request, fallback?: string): Promise<string> => {
  const headerEmailRaw = req.headers["x-user-email"];
  const headerEmail = Array.isArray(headerEmailRaw) ? headerEmailRaw[0] : headerEmailRaw;
  if (typeof headerEmail === "string" && headerEmail.length > 0) {
    (req as any).userEmail = headerEmail;
    return headerEmail;
  }

  const cachedEmail = (req as any).userEmail;
  if (typeof cachedEmail === "string" && cachedEmail.length > 0) {
    return cachedEmail;
  }

  const headerUserIdRaw = req.headers["x-user-id"];
  const headerUserId = Array.isArray(headerUserIdRaw) ? headerUserIdRaw[0] : headerUserIdRaw;
  const userId = (req as any).userId ?? (typeof headerUserId === "string" ? headerUserId : undefined);
  if (typeof userId === "string" && userId.length > 0) {
    const email = await fetchUserEmail(userId);
    if (email) {
      (req as any).userEmail = email;
      return email;
    }
  }

  if (fallback) {
    if (fallback.includes("@")) {
      return fallback;
    }
    if (fallback === "system") {
      return fallback;
    }
    const fallbackEmail = await fetchUserEmail(fallback);
    if (fallbackEmail) {
      return fallbackEmail;
    }
    return fallback;
  }

  return "system";
};

export const addInstrumentController = async (req: Request, res: Response<InstrumentResponse>, next: NextFunction): Promise<void> => {
  try {
    const { value, error } = createInstrumentSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      res.status(400).json({ message: "Validation failed", details: error.details });
      return;
    }

    const actorEmail = await resolvePerformedBy(req, "system");
    
    const instrument = await createInstrumentService({
      ...value,
      created_by: actorEmail,
    });
    res.status(201).json({ message: "Instrument created", data: instrument });
  } catch (err) {
    next(err);
  }
};

export const listInstrumentsController = async (
  req: Request,
  res: Response<InstrumentListResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { value, error } = getInstrumentsSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      res.status(400).json({ message: "Validation failed", details: error.details });
      return;
    }

    const result = await getInstrumentsService(value);
  res.status(200).json({ message: "Instrument list", ...result });
  } catch (err) {
    next(err);
  }
};

export const getInstrumentDetailController = async (
  req: Request,
  res: Response<InstrumentResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Instrument id is required" });
      return;
    }

    const instrument = await getInstrumentByIdService(id);
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    res.status(200).json({ message: "Instrument detail", data: instrument });
  } catch (err) {
    next(err);
  }
};

export const updateInstrumentController = async (
  req: Request,
  res: Response<InstrumentResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { value, error } = updateInstrumentSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({ message: "Validation failed", details: error.details });
      return;
    }

    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Instrument id is required" });
      return;
    }

    const actorEmail = await resolvePerformedBy(req, "system");

    const instrument = await updateInstrumentService(id, {
      ...value,
      updated_by: actorEmail,
    });
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    res.status(200).json({ message: "Instrument updated", data: instrument });
  } catch (err) {
    next(err);
  }
};

export const deleteInstrumentController = async (
  req: Request,
  res: Response<InstrumentResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Instrument id is required" });
      return;
    }

    const actorEmail = await resolvePerformedBy(req, "system");

    const instrument = await deleteInstrumentService(id, actorEmail);
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    res.status(200).json({ message: "Instrument deleted", data: instrument });
  } catch (err) {
    next(err);
  }
};
