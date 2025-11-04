import { TestOrderRepository } from "../repositories/testOrderRepository.js";
import patientServiceClient from "../services/patientServiceClient.js";
import { ITestOrderInput } from "../db/models/TestOrder.model.js";
import { ITestOrder } from "../db/models/TestOrder.model.js";
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

async createOrder(data: any): Promise<ITestOrder> {
  const orderInput: Partial<ITestOrderInput> = {
    patient_id: data.patient_id,
    patient_name: data.patient_name ?? '',  
    barcode: data.barcode,
    test_type: data.testType,               
    status: data.status ?? 'Pending',
    processing: data.processing ?? 0,
    created_by: data.createdBy ?? data.created_by,
    due_date: data.due_date ? new Date(data.due_date) : null,
    updated_by: data.updatedBy || null,
    is_deleted: data.isDeleted ?? false,
    deleted_at: data.deletedAt ? new Date(data.deletedAt) : null,
    deleted_by: data.deletedBy || null,
    notes: data.notes || 'Have no comment' ,
  };

  return await TestOrderRepository.create(orderInput as ITestOrder);
},


async updateOrder(
    _id: string,
    data: any,
    updatedBy: string
  ): Promise<ITestOrder> {
    const orderInput: Partial<ITestOrderInput> = {
      patient_id: data.patient_id,
      patient_name: data.patient_name ?? '',  
      barcode: data.barcode,
      test_type: data.testType,               
      status: data.status ?? 'Pending',
      processing: data.processing ?? 0,
      created_by: data.createdBy ?? data.created_by,
      due_date: data.due_date ? new Date(data.due_date) : null,
      updated_by: updatedBy,
      is_deleted: data.isDeleted ?? false,
      deleted_at: data.deletedAt ? new Date(data.deletedAt) : null,
      deleted_by: data.deletedBy || null,
      notes: data.notes,
    };

    // Xử lý soft delete
    if (data.isDeleted === true) {
      orderInput.is_deleted = true;
      orderInput.deleted_at = new Date();
      orderInput.deleted_by = updatedBy;
    }

    if (data.isDeleted === false) {
      orderInput.is_deleted = false;
      orderInput.deleted_at = null;
      orderInput.deleted_by = null;
    }

    return await TestOrderRepository.update(_id, orderInput as ITestOrder);
  },
  

  // backend/src/services/testOrder.service.ts

async updateStatus(
  id: string,
  status: string,
  updatedBy: string
): Promise<ITestOrder> {
  const order = await TestOrderRepository.findById(id);
  if (!order) throw new Error('Không tìm thấy lệnh xét nghiệm');

  return TestOrderRepository.update(id, {
    ...order.toObject(), 
    status,
    updated_by: updatedBy,
    updated_at: new Date(),
  });
},

async softDelete(_id: string, deletedBy: string): Promise<ITestOrder> {
  const order = await TestOrderRepository.findById(_id);
  if (!order) throw new Error('Không tìm thấy lệnh xét nghiệm');

  return TestOrderRepository.update(_id, {
    ...order.toObject(),
    is_deleted: true,
    deleted_at: new Date(),
    deleted_by: deletedBy,
    updated_by: deletedBy,
    updated_at: new Date(),
  });
}
}


