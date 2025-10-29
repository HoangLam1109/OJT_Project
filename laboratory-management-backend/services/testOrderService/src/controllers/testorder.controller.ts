import { Request, Response } from "express";
import { TestOrderService } from "../services/testOrderService.js";
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
        run_at: order.run_at,
        run_by: order.run_by,
        updated_at: order.updated_at,
        updated_by: order.updated_by,
        is_deleted: order.is_deleted,
        deleted_at: order.deleted_at,
        deleted_by: order.deleted_by,

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
      run_at: order.run_at,
      run_by: order.run_by,
      updated_at: order.updated_at,
      updated_by: order.updated_by,
      is_deleted: order.is_deleted,
      deleted_at: order.deleted_at,
      deleted_by: order.deleted_by,

      user: user
        ? {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
        }
        : null,
    };

    res.json(enrichedOrder);
  } catch (err) {
    console.error("[TestOrderController] Error fetching order by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTestOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const order = await TestOrderService.createOrder(req.body, userId);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTestOrder = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await TestOrderService.updateOrder(req.params.id, req.body, userId);
    if (!updated) return res.status(404).json({ message: "Test order not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTestOrder = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await TestOrderService.deleteOrder(req.params.id, userId);
    if (!deleted) return res.status(404).json({ message: "Test order not found" });

    res.json({ message: "Test order deleted", data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
