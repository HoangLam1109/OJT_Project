// src/services/reagent.service.ts
import { ReagentRepository } from "../../repositories/reagent/reagent.repository.js";
import { IReagent } from "../../db/models/Reagent.model.js";

export class ReagentService {
  private repo: ReagentRepository;

  constructor() {
    this.repo = new ReagentRepository();
  }

  async getAll(page?: number, limit?: number){
    return await this.repo.findAll(page, limit);
  }

  async getById(id: string): Promise<IReagent | null> {
    return this.repo.findById(id);
  }

async create(data: Partial<IReagent>): Promise<IReagent> {
  // Nếu low_stock_threshold chưa set, mặc định = 10% của quantity_received
  if (!data.low_stock_threshold) {
    data.low_stock_threshold = Math.round((data.quantity_received ?? 0) * 0.1);
  }

  // Nếu quantity_received có, set luôn quantity_current = quantity_received
  if (data.quantity_received !== undefined && data.quantity_current === undefined) {
    data.quantity_current = data.quantity_received;
  }

  return this.repo.create(data);
}


async update(
  id: string,
  data: Partial<IReagent>,
  updatedBy?: string
): Promise<IReagent | null> {
  const reagent = await this.repo.findById(id);
  if (!reagent) throw new Error("Reagent not found");

  if ('reagent_code' in data) delete data.reagent_code;

  const oldQuantityReceived = reagent.quantity_received ?? 0;
  const oldQuantityCurrent = reagent.quantity_current ?? 0;
  const newQuantityReceived = data.quantity_received ?? oldQuantityReceived;
  let newQuantityCurrent = data.quantity_current ?? oldQuantityCurrent;

  // Auto increase quantity_current nếu quantity_received tăng
  if (newQuantityReceived > oldQuantityReceived) {
    newQuantityCurrent += newQuantityReceived - oldQuantityReceived;
  }

  // Kiểm tra quantity_current không vượt quantity_received
  if (newQuantityCurrent > newQuantityReceived) {
    throw new Error(
      `quantity_current (${newQuantityCurrent}) không thể lớn hơn quantity_received (${newQuantityReceived})`
    );
  }

  data.quantity_received = newQuantityReceived;
  data.quantity_current = newQuantityCurrent;

  // Tính status tự động
  const lowStockThreshold = reagent.low_stock_threshold ?? 0;
  const expirationDate = new Date(reagent.expiration_date);
  let newStatus: IReagent["status"] = "Available";
  if (newQuantityCurrent <= 0) newStatus = "Depleted";
  else if (newQuantityCurrent <= lowStockThreshold) newStatus = "LowStock";
  else if (expirationDate < new Date()) newStatus = "Expired";

  data.status = newStatus;

  // Cập nhật metadata
  data.updated_at = new Date();
  if (updatedBy) data.updated_by = updatedBy;

  return this.repo.findAndUpdate(id, data);
}



  async delete(id: string, deletedBy: string): Promise<IReagent | null> {
    return this.repo.softDelete(id, deletedBy);
  }

}
