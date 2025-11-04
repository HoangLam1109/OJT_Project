import { Request, Response } from "express";
import { TestOrderService } from "../services/testOrderService.js";
import { TestOrderRepository } from "../repositories/testOrderRepository.js";
import patientServiceClient from "../services/patientServiceClient.js";
import iamServiceClient from "../services/iamServiceClient.js";
export const getAllTestOrders = async (req: Request, res: Response) => {
  try {
    //  Lấy danh sách test order
    const orders = await TestOrderService.getAllOrders();

    //  Lọc bỏ những order đã soft-delete
    const activeOrders = orders.filter((o) => !o.is_deleted);

    //  Lấy các patientId duy nhất
    const patientIds = [...new Set(activeOrders.map((o) => o.patient_id))];

    //  Lấy thông tin patient
    const patientsMap = await patientServiceClient.getPatientsByIds(patientIds);

    //  Lấy danh sách userId từ patients
    const userIds = [...new Set(Array.from(patientsMap.values()).map((p) => p.user_id))];
    const usersMap = await iamServiceClient.getUsersByIds(userIds);

    //  Kết hợp dữ liệu TestOrder + User
    const enrichedOrders = activeOrders.map((order) => {
      const patient = patientsMap.get(order.patient_id);
      const user = patient ? usersMap.get(patient.user_id) : null;

      return {
        _id: order._id,
        patient_id: order.patient_id,
        barcode: order.barcode,
        status: order.status,
        created_at: order.created_at,
        created_by: order.created_by,
        due_date: order.due_date,
        updated_at: order.updated_at,
        updated_by: order.updated_by,
        is_deleted: order.is_deleted,
        deleted_at: order.deleted_at,
        deleted_by: order.deleted_by,
        testType:order.test_type,
        processing:order.processing,
        notes:order.notes,
        user: user
          ? {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            age: user.age,
          }
          : null,
      };
    });
      console.log("enrichedOrders",enrichedOrders);
    res.json(enrichedOrders);
  } catch (err) {
    console.error("[TestOrderController] Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getTestOrderById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const order = await TestOrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Test order not found" });

    const patient = await patientServiceClient.getPatientById(order.patient_id);
    const user = patient ? await iamServiceClient.getUserById(patient.user_id) : null;

    const enrichedOrder = {
      _id: order._id,
      patient_id: order.patient_id,
      barcode: order.barcode,
      status: order.status,
      created_at: order.created_at,
      created_by: order.created_by,
      due_date: order.due_date,
      updated_at: order.updated_at,
      updated_by: order.updated_by,
      is_deleted: order.is_deleted,
      deleted_at: order.deleted_at,
      deleted_by: order.deleted_by,
      testType:order.test_type,
      processing:order.processing,
      notes:order.notes,
      user: user
        ? {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
        }
        : null,
    };
    console.log("enrichedOrder",enrichedOrder);
    res.json(enrichedOrder);
  } catch (err) {
    console.error("[TestOrderController] Error fetching order by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTestOrder = async (req: Request, res: Response) => {
  try {
    const {  ...orderData } = req.body;
    const order = await TestOrderService.createOrder(orderData);
    res.status(201).json({ message: "Test order created successfully", order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTestOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const updatedBy = data.updated_by;
    const updated = await TestOrderService.updateOrder(id, data, updatedBy);

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const softDeleteTestOrder = async (req:Request, res:Response) => {
  try {
    const _id = req.params.id as string;
    const { deleted_by } = req.body; 
    const deletedBy = deleted_by || (req as any).user?.name || 'system';

    const deletedOrder = await TestOrderService.softDelete(_id, deletedBy);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Test order not found' });
    }
    res.status(200).json({
      message: 'Đã xóa (soft delete) lệnh xét nghiệm thành công',
      order: deletedOrder,
    });
  } catch (error) {
    console.error('❌ Lỗi khi soft delete test order:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa test order' });
  }
};

export const updateTestOrderStatus = async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string;
    const { status, updated_by } = req.body;

    if (!updated_by) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin người cập nhật',
      });
    }

    const validStatuses = ['Pending', 'Processing', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ',
      });
    }

    const processing = status === 'Processing' ? 10 : status === 'Completed' ? 100 : 0;
    const updated = await TestOrderService.updateStatus(id, status, updated_by);

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


