import { TestOrderRepository } from "../repositories/testOrderRepository.js";

export const TestOrderService = {
  // Lấy tất cả Test Orders
  async getAllOrders() {
    // Ensure we always return an array (avoid sending `null` to callers)
    const data = await TestOrderRepository.findAll();
    return Array.isArray(data) ? data : [];
  },

  // Lấy Test Order theo ID
  async getOrderById(id: string) {
    return await TestOrderRepository.findById(id);
  },

  // Tạo Test Order mới
  async createOrder(data: any, userId: String) {
    const newOrder = { ...data, created_by:  userId, created_at: new Date() };
    return await TestOrderRepository.create(newOrder);
  },

  // Cập nhật Test Order theo ID
  async updateOrder(id: string, data: any, userId: string) {
    const updatedData = { ...data, updated_by: userId, updated_at: new Date() };
    return await TestOrderRepository.update(id, updatedData);
  },

  // Xoá Test Order (soft delete)
  async deleteOrder(id: string, userId: string) {
    return await TestOrderRepository.softDelete(id, userId);
  },
};
