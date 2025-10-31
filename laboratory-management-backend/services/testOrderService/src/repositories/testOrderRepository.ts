import TestOrder, { ITestOrder } from "../db/models/TestOrder.model.js";

export const TestOrderRepository = {
  // Tạo Test order
  async create(data: Partial<ITestOrder>): Promise<ITestOrder> {
    return await new TestOrder(data).save();
  },

  // Lấy tất cả Test order chưa bị xoá
 async findAll() {
  // Lấy tất cả document chưa bị xóa
  return await TestOrder.find().exec();
}
,

  // Tìm Test order theo ID
  async findById(id: string): Promise<ITestOrder | null> {
    return await TestOrder.findById(id).exec();
  },

  // Cập nhật Test order theo ID
  async updateById(id: string, data: Partial<ITestOrder>): Promise<ITestOrder | null> {
    return await TestOrder.findByIdAndUpdate(id, data, { new: true });
  },

  // Xoá Test order (soft delete)
  async softDelete(id: string, deletedBy: string): Promise<ITestOrder | null> {
    return await TestOrder.findByIdAndUpdate(
      id,
      { is_deleted: true, deleted_at: new Date(), deleted_by: deletedBy },
      { new: true }
    ).exec();
  },
  //Tìm TestOrder theo id và đảm bảo chưa bị xóa mềm
  async findActiveById(id: string): Promise<ITestOrder | null> {
    return await TestOrder.findOne({ _id: id, isDeleted: false });
  },
};


