// src/repositories/reagent.repository.ts
import Reagent, { IReagent } from "../../db/models/Reagent.model.js";

export class ReagentRepository {
  // Lấy tất cả reagents có phân trang
  async findAll(page?: number, limit?: number): Promise<{
    data: IReagent[];
    totalItems: number;
  }> {
    const query = { is_deleted: false };
    // Nếu không có phân trang thì trả hết (giữ tương thích cũ)
    if (!page || !limit) {
      const data = await Reagent.find(query).sort({ updated_at: -1 });
      return { data, totalItems: data.length };
    }
    // Tính toán skip
    const skip = (page - 1) * limit;
    //  Lấy dữ liệu có phân trang
    const [data, totalItems] = await Promise.all([
      Reagent.find(query)
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(limit),
      Reagent.countDocuments(query),
    ]);
    return { data, totalItems };
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

  async findAndUpdate(id: string, data: Partial<IReagent>): Promise<IReagent | null> {
    return Reagent.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: data },
      { new: true }
    ).exec();
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

}
