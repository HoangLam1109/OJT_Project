import { Request, Response } from "express";
import { TestOrderService } from "../services/testorder/testOrderService.js";

import patientServiceClient from "../services/patient/patientServiceClient.js";
import iamServiceClient from "../services/iam/iamServiceClient.js";
import instrumentServiceClient from "../services/warehouse/instrumentServiceClient.js";
import reagentServiceClient, { Reagent } from "../services/warehouse/reagentServiceClient.js";


export const getAllTestOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;   // trang hiện tại
    const limit = parseInt(req.query.limit as string) || 10; // số bản ghi mỗi trang
    const skip = (page - 1) * limit;

    // Lấy tất cả orders chưa bị xóa
    const [orders, total] = await Promise.all([
      TestOrderService.getAllOrders({ is_deleted: false }, skip, limit),
      TestOrderService.countOrders({ is_deleted: false }),
    ]);

    // Chuẩn hóa dữ liệu trả về
    const enrichedOrders = orders.map((order) => ({
      _id: order._id,
      patient_id: order.patient_id,
      patient_name: order.patient_name,
      barcode: order.barcode,
      status: order.status,
      created_at: order.created_at,
      created_by: order.created_by,
      due_date: order.due_date,
      updated_at: order.updated_at,
      updated_by: order.updated_by,
      testType: order.test_type,
      notes: order.notes,
    }));

    res.json({
      data: enrichedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[TestOrderController] Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getTestOrderById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const order = await TestOrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Test order not found" });

    // Lấy thông tin patient & user
    const patient = await patientServiceClient.getPatientById(order.patient_id);
    const user = patient ? await iamServiceClient.getUserById(patient.user_id) : null;

    // Lấy thông tin instrument
    const instrument = order.instrument_id
      ? await instrumentServiceClient.getInstrumentById(order.instrument_id)
      : null;

    // Lấy danh sách reagent, convert Map -> Array nếu client vẫn trả Map
    const reagentIds = order.reagent_usages?.map(u => u.reagent_id) || [];
    const reagentsMap = reagentIds.length
      ? await reagentServiceClient.getReagentsByIds(reagentIds)
      : new Map<string, Reagent>();

    const reagentsArray = Array.from(reagentsMap.values());

    // Map reagent với số lượng đã dùng từ order.reagent_usages
    const enrichedReagents = reagentsArray.map((r) => {
      const usage = order.reagent_usages?.find((u) => u.reagent_id === r._id)?.quantity_used || 0;
      return {
        reagent_id: r._id,
        reagent_name: r.reagent_name,
        reagent_type: r.reagent_type,
        status: r.status,
        quantity_used: usage,
      };
    });

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
      testType: order.test_type,
      notes: order.notes,

      user: user
        ? {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
        }
        : null,

      instrument: instrument
        ? {
          instrument_code: instrument.instrument_code,
          instrument_name: instrument.instrument_name,
          instrument_type: instrument.instrument_type,
          manufacturer: instrument.manufacturer,
          status: instrument.status,
        }
        : null,

      reagents: enrichedReagents,
    };

    console.log("enrichedOrder", enrichedOrder);
    res.json(enrichedOrder);
  } catch (err) {
    console.error("[TestOrderController] Error fetching order by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const createTestOrder = async (req: Request, res: Response) => {
  try {
    const { ...orderData } = req.body;
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

export const softDeleteTestOrder = async (req: Request, res: Response) => {
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


