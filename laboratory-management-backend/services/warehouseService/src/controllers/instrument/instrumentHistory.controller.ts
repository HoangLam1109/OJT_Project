import type { Request, Response, NextFunction } from "express";
import instrumentHistoryService, {
  type InstrumentHistoryFilters,
  type InstrumentHistoryType,
} from "../../services/instrument/instrumentHistory.service.js";

export const listInstrumentHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = "1", limit = "10", instrument_id, instrument_code, history_type, performed_by } = req.query;

  const filters: InstrumentHistoryFilters = {};
    if (typeof instrument_id === "string" && instrument_id.trim().length > 0) {
      filters.instrument_id = instrument_id.trim();
    }
    if (typeof instrument_code === "string" && instrument_code.trim().length > 0) {
      filters.instrument_code = instrument_code.trim();
    }
    if (typeof history_type === "string" && history_type.trim().length > 0) {
      filters.history_type = history_type.trim() as InstrumentHistoryType;
    }
    if (typeof performed_by === "string" && performed_by.trim().length > 0) {
      filters.performed_by = performed_by.trim();
    }

    const result = await instrumentHistoryService.getHistory(
      filters,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      message: "Instrument history list",
      data: result.records,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstrumentHistoryDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "History id is required" });
      return;
    }

    const history = await instrumentHistoryService.getHistoryById(id);
    if (!history) {
      res.status(404).json({ message: "Instrument history not found" });
      return;
    }

    res.status(200).json({ message: "Instrument history detail", data: history });
  } catch (error) {
    next(error);
  }
};

export const deleteInstrumentHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "History id is required" });
      return;
    }

    const deleted = await instrumentHistoryService.deleteHistory(id);
    if (!deleted) {
      res.status(404).json({ message: "Instrument history not found" });
      return;
    }

    res.status(200).json({ message: "Instrument history deleted" });
  } catch (error) {
    next(error);
  }
};
