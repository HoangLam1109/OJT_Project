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
import instrumentMonitoringService from "../../services/instrument/instrumentMonitoring.service.js";
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

const fetchUserName = async (userId: string | null | undefined): Promise<string | null> => {
  if (!userId || typeof userId !== "string") {
    return null;
  }
  try {
    const user = await iamServiceClient.getUserById(userId);
    if (user?.fullName && user.fullName.trim().length > 0) {
      return user.fullName.trim();
    }
    if (user?.email && user.email.trim().length > 0) {
      return user.email.trim();
    }
  } catch (error) {
    console.warn(`[InstrumentController] Unable to resolve name for user ${userId}`, error);
  }
  return null;
};

const resolveOperatorId = (req: Request, fallback?: string): string | undefined => {
  const requestUserId = (req as any).userId;
  if (typeof requestUserId === "string" && requestUserId.trim().length > 0) {
    return requestUserId.trim();
  }

  const headerSources = ["x-user-id", "x-operator-id", "x-actor-id"] as const;
  for (const headerKey of headerSources) {
    const rawValue = req.headers[headerKey];
    const headerValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (typeof headerValue === "string" && headerValue.trim().length > 0) {
      return headerValue.trim();
    }
  }

  if (typeof fallback === "string" && fallback.trim().length > 0) {
    return fallback.trim();
  }

  return undefined;
};

const resolveOperatorName = async (
  req: Request,
  operatorId: string | undefined,
  fallbackName?: string | null
): Promise<string | null> => {
  const headerNameSources = ["x-user-name", "x-operator-name", "x-actor-name"] as const;
  for (const headerKey of headerNameSources) {
    const rawValue = req.headers[headerKey];
    const headerValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (typeof headerValue === "string" && headerValue.trim().length > 0) {
      const normalized = headerValue.trim();
      (req as any).userFullName = normalized;
      return normalized;
    }
  }

  const cachedName = (req as any).userFullName;
  if (typeof cachedName === "string" && cachedName.trim().length > 0) {
    return cachedName.trim();
  }

  if (operatorId) {
    const resolved = await fetchUserName(operatorId);
    if (resolved) {
      (req as any).userFullName = resolved;
      return resolved;
    }
  }

  if (typeof fallbackName === "string" && fallbackName.trim().length > 0) {
    return fallbackName.trim();
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

    const operatorId = resolveOperatorId(req);
    const operatorEmail = await resolvePerformedBy(req, operatorId ?? "system");
    const operatorName = await resolveOperatorName(
      req,
      operatorId,
      operatorEmail === "system" ? undefined : operatorEmail
    );

    const instrument = await createInstrumentService({
      ...value,
      created_by: operatorEmail,
    });

    const snapshot = buildInstrumentSnapshot(instrument);
    let newValues: Record<string, unknown> | null = null;
    if (instrument) {
      newValues = { ...(instrument as unknown as Record<string, unknown>) };
      if (snapshot) {
        newValues.snapshot = snapshot;
      }
    }

    await instrumentMonitoringService.recordCreated({
      instrumentId: `${instrument._id}`,
      instrumentCode: instrument.instrument_code,
      eventMessage: "Instrument created",
      operatorId: operatorId ?? operatorEmail ?? "system",
      operatorEmail,
      operatorName,
      oldValues: null,
      newValues,
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

    const existingInstrument = await getInstrumentByIdService(id);
    if (!existingInstrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const operatorId = resolveOperatorId(req, existingInstrument.updated_by ?? existingInstrument.created_by ?? undefined);
    const operatorEmail = await resolvePerformedBy(req, operatorId ?? "system");
    const operatorName = await resolveOperatorName(
      req,
      operatorId,
      operatorEmail === "system" ? undefined : operatorEmail
    );

    const instrument = await updateInstrumentService(id, {
      ...value,
      updated_by: operatorEmail,
    });
    if (!instrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const candidateFields = Object.keys(value);
    if (candidateFields.length > 0) {
      const changedFields = candidateFields.filter((field) => {
        const before = (existingInstrument as Record<string, unknown>)[field];
        const after = (instrument as Record<string, unknown>)[field];
        const beforeJson = before === undefined ? undefined : JSON.stringify(before);
        const afterJson = after === undefined ? undefined : JSON.stringify(after);
        return beforeJson !== afterJson;
      });

      if (changedFields.length > 0) {
        const oldValues = pickInstrumentFields(existingInstrument, changedFields);
        const newValues = pickInstrumentFields(instrument, changedFields);
      const oldSnapshot = buildInstrumentSnapshot(existingInstrument);
      const newSnapshot = buildInstrumentSnapshot(instrument);
      if (oldSnapshot) {
        oldValues.snapshot = oldSnapshot;
      }
      if (newSnapshot) {
        newValues.snapshot = newSnapshot;
      }
        const messageSuffix = changedFields.join(", ");
        const eventMessage = messageSuffix.length > 0
          ? `Instrument updated (${messageSuffix})`
          : "Instrument updated";

        await instrumentMonitoringService.recordUpdated({
          instrumentId: `${instrument._id}`,
          instrumentCode: instrument.instrument_code,
          eventMessage,
          operatorId: operatorId ?? operatorEmail ?? "system",
          operatorEmail,
          operatorName,
          oldValues,
          newValues,
        });
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

    const existingInstrument = await getInstrumentByIdService(id);
    if (!existingInstrument) {
      res.status(404).json({ message: "Instrument not found" });
      return;
    }

    const operatorId = resolveOperatorId(req, existingInstrument.deleted_by ?? existingInstrument.updated_by ?? existingInstrument.created_by ?? undefined);
    const operatorEmail = await resolvePerformedBy(req, operatorId ?? "system");
    const operatorName = await resolveOperatorName(
      req,
      operatorId,
      operatorEmail === "system" ? undefined : operatorEmail
    );

    const instrument = await deleteInstrumentService(id, operatorEmail);
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

    await instrumentMonitoringService.recordDeleted({
      instrumentId: `${instrument._id}`,
      instrumentCode: instrument.instrument_code,
      eventMessage: "Instrument deleted",
      operatorId: operatorId ?? operatorEmail ?? "system",
      operatorEmail,
      operatorName,
      oldValues,
      newValues,
    });

    res.status(200).json({ message: "Instrument deleted", data: instrument });
  } catch (err) {
    next(err);
  }
};
