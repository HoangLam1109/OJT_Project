import { TestOrderRepository } from "../../repositories/testOrderRepository.js";
import reagentServiceClient from "../warehouse/reagentServiceClient.js";
import { CreateOrderInput, ReagentUsage, UpdateOrderInput } from "../../db/models/TestOrder.model.js";
import { ITestOrder } from "../../db/models/TestOrder.model.js";
export const TestOrderService = {
  // Lấy tất cả Test Orders
  async getAllOrders(filter = {}, skip = 0, limit = 10) {
    const data = await TestOrderRepository.findAll(filter, skip, limit);
    return Array.isArray(data) ? data : [];
  }, 
  
  async countOrders(filter = {}) {
    return TestOrderRepository.count(filter);
  },

  // Lấy Test Order theo ID
  async getOrderById(id: string) {
    return await TestOrderRepository.findById(id);
  },

  async createOrder(data: CreateOrderInput): Promise<ITestOrder> {
    // Dùng reagent_usages từ request, ép quantity_used về number, default 1 nếu null
    const reagentUsages: ReagentUsage[] = (data.reagent_usages ?? []).map(r => ({
      reagent_id: r.reagent_id,
      quantity_used: r.quantity_used ?? null,
    }));
    // Chỉ thêm các field optional nếu có giá trị
    const orderInput: Partial<ITestOrder> = {
      patient_id: data.patient_id,
      reagent_usages: reagentUsages,
      patient_name: data.patient_name ?? '',
      barcode: data.barcode,
      test_type: data.testType,
      status: data.status ?? 'Pending',
      created_by: data.created_by,
      ...(data.instrument_id ? { instrument_id: data.instrument_id } : {}),
      ...(data.due_date ? { due_date: new Date(data.due_date) } : {}),
      ...(data.updated_by ? { updated_by: data.updated_by } : {}),
      is_deleted: data.is_deleted ?? false,
      ...(data.deleted_at ? { deleted_at: new Date(data.deleted_at) } : {}),
      ...(data.deleted_by ? { deleted_by: data.deleted_by } : {}),
      notes: data.notes ?? 'have no comment',
    };
    //  Tạo order
    const createdOrder = await TestOrderRepository.create(orderInput as ITestOrder);
    //  Cập nhật tồn kho tương ứng cho từng reagent
    for (const usage of reagentUsages) {
      const reagent = await reagentServiceClient.getReagentById(usage.reagent_id);
      if (!reagent) continue;
      // quantity_current mới = quantity_current  - quantity_used
      const newQuantityCurrent = (reagent.quantity_current ?? 0) - (usage.quantity_used ?? 0);
      await reagentServiceClient.updateReagent(usage.reagent_id, {
        quantity_current: newQuantityCurrent,
      });
    }
    return createdOrder;
  },


  async updateOrder(id: string, data: UpdateOrderInput, updated_by: any): Promise<ITestOrder | null> {
    //  Lấy order hiện tại từ DB
    const existingOrder = await TestOrderRepository.findById(id);
    if (!existingOrder) throw new Error(`Order ${id} not found`);

    //  Nếu có cập nhật reagent_usages thì hoàn trả lượng cũ vào kho trước
    if (data.reagent_usages && data.reagent_usages.length > 0) {
      for (const oldUsage of existingOrder.reagent_usages ?? []) {
        const reagent = await reagentServiceClient.getReagentById(oldUsage.reagent_id);
        if (!reagent) continue;

        const restoredQuantity = (reagent.quantity_current ?? 0) + (oldUsage.quantity_used ?? 0);
        await reagentServiceClient.updateReagent(oldUsage.reagent_id, {
          quantity_current: restoredQuantity,
        });
      }
    }

    //  Chuẩn bị dữ liệu update cho order
    const reagentUsages: ReagentUsage[] = (data.reagent_usages ?? []).map(r => ({
      reagent_id: r.reagent_id,
      quantity_used: r.quantity_used ?? null,
    }));

    const orderUpdate: Partial<ITestOrder> = {
      ...(data.patient_id ? { patient_id: data.patient_id } : {}),
      ...(reagentUsages.length ? { reagent_usages: reagentUsages } : {}),
      ...(data.patient_name ? { patient_name: data.patient_name } : {}),
      ...(data.barcode ? { barcode: data.barcode } : {}),
      ...(data.test_type ? { test_type: data.test_type } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.instrument_id ? { instrument_id: data.instrument_id } : {}),
      ...(data.due_date ? { due_date: new Date(data.due_date) } : {}),
      updated_by: updated_by,
      notes: data.notes ?? existingOrder.notes ?? 'have no comment',
    };

    //  Cập nhật order
    const updatedOrder = await TestOrderRepository.update(id, orderUpdate);

    //  Nếu có reagent_usages mới thì trừ tồn kho theo lượng mới
    if (reagentUsages.length > 0) {
      for (const newUsage of reagentUsages) {
        const reagent = await reagentServiceClient.getReagentById(newUsage.reagent_id);
        if (!reagent) continue;

        const newQuantityCurrent =
          (reagent.quantity_current ?? 0) - (newUsage.quantity_used ?? 0);

        await reagentServiceClient.updateReagent(newUsage.reagent_id, {
          quantity_current: newQuantityCurrent,
        });
      }
    }

    return updatedOrder;
  },


  async updateStatus(
    id: string,
    status: string,
    updated_by: string
  ): Promise<ITestOrder> {
    const order = await TestOrderRepository.findById(id);
    if (!order) throw new Error('Không tìm thấy lệnh xét nghiệm');

    return TestOrderRepository.update(id, {
      ...order.toObject(),
      status,
      updated_by: updated_by,
      updated_at: new Date(),
    });
  },


  async softDelete(_id: string, deleted_by: string): Promise<ITestOrder | null> {
    const order = await TestOrderRepository.findById(_id);
    if (!order) throw new Error("Order không tìm thấy!");
    // Chỉ hồi lại tồn kho nếu order chưa thực hiện
    if (order.status !== "Completed") {
      for (const usage of order.reagent_usages) {
        const reagent = await reagentServiceClient.getReagentById(usage.reagent_id);
        if (!reagent) continue;

        const restoredQuantity = reagent.quantity_current + (usage.quantity_used ?? 0);
        await reagentServiceClient.updateReagent(usage.reagent_id, {
          quantity_current: restoredQuantity,
        });
      }
    } else {
      // Nếu status là Completed thì không hồi lại reagent
      console.log(`Order ${_id} đã hoàn thành, không hồi lại reagent`);
    }

    const softDeleteTestOrder = await TestOrderRepository.softDelete(_id, deleted_by);
    return softDeleteTestOrder;
  },

}


