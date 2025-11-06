// src/repositories/reagent.repository.ts
import Reagent, { IReagent } from "../../db/models/Reagent.model.js";

export class ReagentRepository {
  async findAll(): Promise<IReagent[]> {
    return Reagent.find({ is_deleted: false }).sort({ updated_at: -1 });
  }

  async findById(id: string): Promise<IReagent | null> {
    return Reagent.findOne({ _id: id, is_deleted: false });
  }

  async findByCode(code: string): Promise<IReagent | null> {
    return Reagent.findOne({ reagent_code: code, is_deleted: false });
  }

  async create(data: Partial<IReagent>): Promise<IReagent> {
    const reagent = new Reagent(data);
    return reagent.save();
  }

  async update(id: string, data: Partial<IReagent>): Promise<IReagent | null> {
    return Reagent.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: data },
      { new: true }
    );
  }

async softDelete(_id: string, deletedBy: string): Promise<IReagent | null> {
  return Reagent.findOneAndUpdate(
    { _id }, // filter
    {
      is_deleted: true,
      deleted_at: new Date(),
      deleted_by: deletedBy,
    },
    { new: true } // trả về document sau khi update
  ).exec();
}


  async findExpiringSoon(days: number): Promise<IReagent[]> {
    const today = new Date();
    const threshold = new Date(today);
    threshold.setDate(today.getDate() + days);
    return Reagent.find({
      expiration_date: { $lte: threshold, $gte: today },
      is_deleted: false,
    });
  }

  async findExpired(): Promise<IReagent[]> {
    const today = new Date();
    return Reagent.find({
      expiration_date: { $lt: today },
      is_deleted: false,
    });
  }
}
