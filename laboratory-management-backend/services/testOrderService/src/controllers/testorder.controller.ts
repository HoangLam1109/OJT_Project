import { Request, Response } from "express";
import { TestOrderService } from "../services/testOrderService.js";

export const getAllTestOrders = async (req: Request, res: Response) => {
  try {
    const orders = await TestOrderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTestOrderById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const order = await TestOrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Test order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
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
