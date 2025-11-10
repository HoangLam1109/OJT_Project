// src/controllers/reagent.controller.ts
import type { Request, Response } from "express";
import { ReagentService } from "../../services/reagent/reagent.service.js";

const service = new ReagentService();

export class ReagentController {
  async getAllReagents(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { data, totalItems } = await service.getAll(page, limit);
      res.json({
        success: true,
        data,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getReagentById(req: Request<{ id: string }>, res: Response) {
    try {
      const reagent = await service.getById(req.params.id);
      if (!reagent) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async createReagent(req: Request, res: Response) {
    try {
      const reagent = await service.create(req.body);
      res.status(201).json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Cập nhật reagent
  async updateReagent(req: Request, res: Response) {
    try {
      const _id = req.params.id as string;
      const data = req.body;
      const updatedReagent = await service.update(_id, data);
      if (!updatedReagent) {
        return res.status(404).json({ message: 'Reagent không tìm thấy' });
      }
      res.status(200).json({
        success: true,
        message: 'Cập nhật reagent thành công',
        data: updatedReagent,
      });
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật reagent:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật reagent' });
    }
  }


  async deleteReagent(req: Request, res: Response) {
    try {
      const _id = req.params.id as string;
      const { deleted_by } = req.body;
      const deletedBy = deleted_by || (req as any).user?.name || 'system';
      const deletedReagent = await service.delete(_id, deletedBy);
      if (!deletedReagent) {
        return res.status(404).json({ message: 'Reagent not found' });
      }
      res.status(200).json({
        message: 'Đã xóa (soft delete) reagent thành công',
        order: deletedReagent,
      });
    } catch (error) {
      console.error('❌ Lỗi khi soft delete reagent:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa reagent' });
    }
  }
}
