import type { FilterQuery } from "mongoose";
import InstrumentHistory, {
  type IInstrumentHistory,
  type InstrumentHistoryType,
} from "../../db/models/InstrumentHistory.model.js";

export interface InstrumentHistoryFilters {
  instrument_id?: string;
  instrument_code?: string;
  history_type?: InstrumentHistoryType;
  performed_by?: string;
}

export interface PaginatedInstrumentHistory {
  records: IInstrumentHistory[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateInstrumentHistoryPayload {
  instrument_id: string;
  instrument_code: string;
  history_type: InstrumentHistoryType;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  instrument_snapshot?: Record<string, unknown> | null;
  performed_by: string;
  performed_at?: Date;
}

class InstrumentHistoryService {
  async recordHistory(payload: CreateInstrumentHistoryPayload): Promise<IInstrumentHistory> {
    return InstrumentHistory.create({
      ...payload,
      performed_at: payload.performed_at ?? new Date(),
    });
  }

  async getHistory(
    filters: InstrumentHistoryFilters = {},
    page = 1,
    limit = 10
  ): Promise<PaginatedInstrumentHistory> {
    const query: FilterQuery<IInstrumentHistory> = {};

    if (filters.instrument_id) {
      query.instrument_id = filters.instrument_id;
    }

    if (filters.instrument_code) {
      query.instrument_code = filters.instrument_code;
    }

    if (filters.history_type) {
      query.history_type = filters.history_type;
    }

    if (filters.performed_by) {
      query.performed_by = filters.performed_by;
    }

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const [records, total] = await Promise.all([
      InstrumentHistory.find(query)
        .sort({ performed_at: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean<IInstrumentHistory[]>(),
      InstrumentHistory.countDocuments(query),
    ]);

    return {
      records,
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
  }

  async getHistoryById(id: string): Promise<IInstrumentHistory | null> {
    return InstrumentHistory.findById(id).lean<IInstrumentHistory | null>();
  }

  async deleteHistory(id: string): Promise<boolean> {
    const result = await InstrumentHistory.deleteOne({ _id: id });
    return Boolean(result.deletedCount && result.deletedCount > 0);
  }
}

const instrumentHistoryService = new InstrumentHistoryService();
export default instrumentHistoryService;
export type { IInstrumentHistory, InstrumentHistoryType };
