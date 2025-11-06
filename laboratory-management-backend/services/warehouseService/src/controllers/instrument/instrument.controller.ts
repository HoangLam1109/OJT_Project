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
import instrumentHistoryService from "../../services/instrument/instrumentHistory.service.js";
import type { IInstrument } from "../../db/models/Instrument.model.js";

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

const pickInstrumentFields = (
  source: Partial<IInstrument> | null | undefined,
  fields: string[]
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  if (!source) {
    return result;
  }
  for (const field of fields) {
    if (field in source) {
      result[field] = (source as Record<string, unknown>)[field];
    }
  }
  return result;
};

const buildInstrumentSnapshot = (instrument: IInstrument | null | undefined): Record<string, unknown> | null => {
  if (!instrument) {
    return null;
  }
  return {
    id: instrument._id,
    code: instrument.instrument_code,
    name: instrument.instrument_name,
    type: instrument.instrument_type,
    manufacturer: instrument.manufacturer ?? null,
    status: instrument.status,
    isActive: instrument.is_active,
    location: instrument.location ?? null,
    createdAt: instrument.created_at,
    updatedAt: instrument.updated_at,
    isDeleted: instrument.is_deleted,
    deletedAt: instrument.deleted_at ?? null,
    deletedBy: instrument.deleted_by ?? null,
  };
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

    const snapshot = buildInstrumentSnapshot(instrument);
    let newValues: Record<string, unknown> | null = null;
    if (instrument) {
      newValues = { ...(instrument as unknown as Record<string, unknown>) };
      if (snapshot) {
        newValues.snapshot = snapshot;
      }
    }
    try {
      await instrumentHistoryService.recordHistory({
        instrument_id: instrument._id,
        instrument_code: instrument.instrument_code,
        history_type: "CREATE",
        old_values: null,
        new_values: newValues,
        instrument_snapshot: snapshot,
        performed_by: actorEmail,
      });
    } catch (historyError) {
      console.error("[InstrumentHistory] Failed to record create history", historyError);
    }

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

    const existingInstrument = await getInstrumentByIdService(id);
    if (!existingInstrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const instrument = await updateInstrumentService(id, {
      ...value,
      updated_by: actorEmail,
    });
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const candidateFields = Object.keys(value);
    if (candidateFields.length > 0) {
      const oldValues = pickInstrumentFields(existingInstrument, candidateFields);
      const newValues = pickInstrumentFields(instrument, candidateFields);
      const oldSnapshot = buildInstrumentSnapshot(existingInstrument);
      const newSnapshot = buildInstrumentSnapshot(instrument);
      if (oldSnapshot) {
        oldValues.snapshot = oldSnapshot;
      }
      if (newSnapshot) {
        newValues.snapshot = newSnapshot;
      }
      try {
        await instrumentHistoryService.recordHistory({
          instrument_id: instrument._id,
          instrument_code: instrument.instrument_code,
          history_type: "UPDATE",
          old_values: oldValues,
          new_values: newValues,
          instrument_snapshot: newSnapshot,
          performed_by: actorEmail,
        });
      } catch (historyError) {
        console.error("[InstrumentHistory] Failed to record update history", historyError);
      }
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

    const existingInstrument = await getInstrumentByIdService(id);
    if (!existingInstrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const instrument = await deleteInstrumentService(id, actorEmail);
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const trackedFields = ["is_deleted", "is_active", "deleted_at", "deleted_by"];
    const oldValues = pickInstrumentFields(existingInstrument, trackedFields);
    const newValues = pickInstrumentFields(instrument, trackedFields);
    const oldSnapshot = buildInstrumentSnapshot(existingInstrument);
    const newSnapshot = buildInstrumentSnapshot(instrument);
    if (oldSnapshot) {
      oldValues.snapshot = oldSnapshot;
    }
    if (newSnapshot) {
      newValues.snapshot = newSnapshot;
    }
    try {
      await instrumentHistoryService.recordHistory({
        instrument_id: instrument._id,
        instrument_code: instrument.instrument_code,
        history_type: "DELETE",
        old_values: oldValues,
        new_values: newValues,
        instrument_snapshot: newSnapshot,
        performed_by: actorEmail,
      });
    } catch (historyError) {
      console.error("[InstrumentHistory] Failed to record delete history", historyError);
    }

    res.status(200).json({ message: "Instrument deleted", data: instrument });
  } catch (err) {
    next(err);
  }
};
