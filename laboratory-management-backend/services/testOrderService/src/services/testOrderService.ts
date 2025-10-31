import { TestOrderRepository } from "../repositories/testOrderRepository.js";
import patientServiceClient from "../services/patientServiceClient.js";

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
 async createOrder(data: any, userId: string, patientId: string) {
    const patient = await patientServiceClient.getPatientById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    const barcode = data.barcode || `BC${Date.now().toString().slice(-5)}`;
    const now = new Date();
    const newOrder = {
      patient_id: patientId,
      barcode,
      status: "pending",
      created_at: now,
      created_by: userId,
      updated_at: now,
      updated_by: userId,
      is_deleted: false,
      ...data, 
    };
    const createdOrder = await TestOrderRepository.create(newOrder);
    return createdOrder;
  },

  // Cập nhật Test Order theo ID
 async updateOrder(id: string, data: any, userId: string) {
    // Tìm test order chưa bị xóa
    const existing = await TestOrderRepository.findActiveById(id);
    if (!existing) return null;

    // Cập nhật dữ liệu
    const updated = await TestOrderRepository.updateById(id, {
      ...data,
      updated_by: userId,
      updated_at: new Date(),
    });

    return updated;
  },

  // Xoá Test Order (soft delete)
  async deleteOrder(id: string, userId: string) {
    return await TestOrderRepository.softDelete(id, userId);
  },
};
