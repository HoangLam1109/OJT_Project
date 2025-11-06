// src/services/reagent.service.ts
import { ReagentRepository } from "../../repositories/reagent/reagent.repository.js";
import { IReagent } from "../../db/models/Reagent.model.js";

export class ReagentService {
  private repo: ReagentRepository;

  constructor() {
    this.repo = new ReagentRepository();
  }

  async getAll(): Promise<IReagent[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<IReagent | null> {
    return this.repo.findById(id);
  }

  async create(data: Partial<IReagent>): Promise<IReagent> {
    if (!data.low_stock_threshold) {
      data.low_stock_threshold = Math.round((data.quantity_received ?? 0) * 0.1);
    }
    return this.repo.create(data);
  }

async update(
  id: string,
  data: Partial<IReagent>,
  updatedBy?: string
): Promise<IReagent | null> {
  // 1. Lấy reagent hiện tại
  const reagent = await this.repo.findById(id);
  if (!reagent) throw new Error("Reagent not found");

  // 2. Không cho update reagent_code
  if ('reagent_code' in data) delete data.reagent_code;

  // 3. Kiểm tra logic số lượng
  const quantityCurrent = data.quantity_current ?? reagent.quantity_current;
  const quantityReceived = data.quantity_received ?? reagent.quantity_received;

  if (quantityCurrent > (quantityReceived ?? 0)) {
    throw new Error(
      `quantity_current (${quantityCurrent}) không thể lớn hơn quantity_received (${quantityReceived})`
    );
  }

  // 4. Tính status tự động
  const lowStockThreshold = reagent.low_stock_threshold ?? 0;
  const expirationDate = new Date(reagent.expiration_date);

  let newStatus: IReagent["status"] = "Available";
  if (quantityCurrent <= 0) newStatus = "Depleted";
  else if (quantityCurrent <= lowStockThreshold) newStatus = "LowStock";
  else if (expirationDate < new Date()) newStatus = "Expired";

  data.status = newStatus;

  // 5. Cập nhật metadata
  data.updated_at = new Date();
  if (updatedBy) data.updated_by = updatedBy;

  // 6. Gọi repo update
  return this.repo.findAndUpdate(id, data);
}



  async delete(id: string, deletedBy: string): Promise<IReagent | null> {
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

    return this.repo.findAndUpdate(id, {
      quantity_current: newQuantity,
      status,
    });
  }
}
