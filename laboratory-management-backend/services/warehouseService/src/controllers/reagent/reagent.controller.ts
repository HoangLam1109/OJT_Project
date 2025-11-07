// src/controllers/reagent.controller.ts
import type { Request, Response } from "express";
import { ReagentService } from "../../services/reagent/reagent.service.js";

const service = new ReagentService();

export class ReagentController {
  async getAllReagents(req: Request, res: Response) {
    try {
      const reagents = await service.getAll();
      res.json({ success: true, data: reagents });
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

  // async getExpiringSoon(req: Request, res: Response) {
  //   try {
  //     const days = parseInt(req.query.days as string) || 30;
  //     const reagents = await service.getExpiringSoon(days);
  //     res.json({ success: true, data: reagents });
  //   } catch (err: any) {
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }

  // async getExpired(req: Request, res: Response) {
  //   try {
  //     const reagents = await service.getExpired();
  //     res.json({ success: true, data: reagents });
  //   } catch (err: any) {
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }

  // async use(req: Request, res: Response) {
  //   try {
  //     const { runs } = req.body;
  //     const reagent = await service.useReagent(req.params.id, runs);
  //     res.json({ success: true, data: reagent });
  //   } catch (err: any) {
  //     res.status(400).json({ success: false, message: err.message });
  //   }
  // }
}
