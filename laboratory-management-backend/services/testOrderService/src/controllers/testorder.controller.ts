import { Request, Response } from "express";
import { TestOrderService } from "../services/testOrderService";

export const getAllTestOrders = async (req: Request, res: Response) => {
  const orders = await TestOrderService.getAllOrders();
  res.json(orders);
};

export const getTestOrderById = async (req: Request, res: Response) => {
  const order = await TestOrderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
};

export const createTestOrder = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const order = await TestOrderService.createOrder(req.body, userId);
  res.status(201).json(order);
};

export const updateTestOrder = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const updated = await TestOrderService.updateOrder(req.params.id, req.body, userId);
  res.json(updated);
};

export const deleteTestOrder = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const deleted = await TestOrderService.deleteOrder(req.params.id, userId);
  res.json(deleted);
};
