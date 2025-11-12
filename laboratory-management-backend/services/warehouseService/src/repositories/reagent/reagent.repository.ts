// src/repositories/reagent.repository.ts
import Reagent, { IReagent } from "../../db/models/Reagent.model.js";

export class ReagentRepository {
  // Lấy tất cả reagents có phân trang
  async findAll(
    query: any = { is_deleted: false },
    skip = 0,
    limit = 10,
    sort: any = { expiration_date: 1, created_at: -1 }
  ): Promise<IReagent[]> {
    return await Reagent.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
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
  async count(query: any = { is_deleted: false }): Promise<number> {
    return await Reagent.countDocuments(query);
  }

  async countSearch(keyword: string, query: any = { is_deleted: false }) {
    const searchQuery = {
      ...query,
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { barcode: { $regex: keyword, $options: "i" } },
        { notes: { $regex: keyword, $options: "i" } },
      ],
    };
    return Reagent.countDocuments(searchQuery);
  }

  async search(keyword: string, skip = 0, limit = 10, sort: any = { expiration_date: 1, created_at: -1 }) {
    const query: any = { is_deleted: false };
    if (keyword) {
      query.$or = [
        { reagent_name: { $regex: keyword, $options: "i" } },
        { barcode: { $regex: keyword, $options: "i" } },
        { notes: { $regex: keyword, $options: "i" } },
      ];
    }
    const [data, totalItems] = await Promise.all([
      Reagent.find(query).skip(skip).limit(limit).sort(sort),
      Reagent.countDocuments(query),
    ]);

    return { data, totalItems };
  }

}
