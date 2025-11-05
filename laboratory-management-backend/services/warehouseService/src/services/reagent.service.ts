// src/services/reagent.service.ts
import { ReagentRepository } from "../repositories/reagent.repository.js";
import { IReagent } from "../db/models/Reagent.model.js";

export class ReagentService {
  private repo: ReagentRepository;

  constructor() {
    this.repo = new ReagentRepository();
  }

  async getAllReagents(): Promise<IReagent[]> {
    return this.repo.findAll();
  }

  async getReagentById(id: string): Promise<IReagent | null> {
    return this.repo.findById(id);
  }

  async createReagent(data: Partial<IReagent>): Promise<IReagent> {
    if (!data.low_stock_threshold) {
      data.low_stock_threshold = Math.round(data.quantity_received * 0.1); // mặc định 10%
    }
    return this.repo.create(data);
  }

  async updateReagent(id: string, data: Partial<IReagent>): Promise<IReagent | null> {
    const reagent = await this.repo.findById(id);
    if (!reagent) throw new Error("Reagent not found");

    // Tự động cập nhật trạng thái
    if (reagent.quantity_current <= 0) data.status = "Depleted";
    else if (reagent.quantity_current <= (reagent.low_stock_threshold ?? 0))
      data.status = "LowStock";
    else if (new Date(reagent.expiration_date) < new Date())
      data.status = "Expired";
    else data.status = "Available";

    return this.repo.update(id, data);
  }

  async deleteReagent(id: string, deletedBy: string): Promise<IReagent | null> {
    return this.repo.softDelete(id, deletedBy);
  }

  async getExpiringSoon(days = 30): Promise<IReagent[]> {
    return this.repo.findExpiringSoon(days);
  }

  async getExpired(): Promise<IReagent[]> {
    return this.repo.findExpired();
  }

  async useReagent(id: string, runs: number): Promise<IReagent | null> {
    const reagent = await this.repo.findById(id);
    if (!reagent) throw new Error("Reagent not found");

    const usedAmount = runs * reagent.usage_per_run;
    if (reagent.quantity_current < usedAmount)
      throw new Error("Not enough reagent available");

    const newQuantity = reagent.quantity_current - usedAmount;
    const status =
      newQuantity <= 0
        ? "Depleted"
        : newQuantity <= (reagent.low_stock_threshold ?? 0)
        ? "LowStock"
        : "InUse";

    return this.repo.update(id, {
      quantity_current: newQuantity,
      status,
    });
  }
}
