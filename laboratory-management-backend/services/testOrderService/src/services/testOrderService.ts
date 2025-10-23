import { TestOrderRepository } from "../repositories/testOrderRepository";

export const TestOrderService = {
  getAllOrders: () => TestOrderRepository.findAll(),

  getOrderById: (id: string) => TestOrderRepository.findById(id),

  createOrder: async (data: any, userId: string) => {
    const newOrder = { ...data, created_by: userId, created_at: new Date() };
    return TestOrderRepository.create(newOrder);
  },

  updateOrder: async (id: string, data: any, userId: string) => {
    const updatedData = { ...data, updated_by: userId, updated_at: new Date() };
    return TestOrderRepository.update(id, updatedData);
  },

  deleteOrder: (id: string, userId: string) => TestOrderRepository.softDelete(id, userId)
};
