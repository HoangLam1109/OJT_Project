// src/controllers/reagent.controller.ts
import type { Request, Response } from "express";
import { ReagentService } from "../services/reagent/reagent.service.js";

const service = new ReagentService();

export class ReagentController {
  async getAllReagents(req: Request, res: Response) {
    try {
      const reagents = await service.getAllReagents();
      res.json({ success: true, data: reagents });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  } 

  async getById(req: Request<{ id: string }>, res: Response) {
    try {

      const reagent = await service.getReagentById(req.params.id);
      if (!reagent) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const reagent = await service.createReagent(req.body);
      res.status(201).json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const reagent = await service.updateReagent(req.params.id, req.body);
      res.json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const reagent = await service.deleteReagent(req.params.id, (req as any).user?.id || "system");
      res.json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getExpiringSoon(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const reagents = await service.getExpiringSoon(days);
      res.json({ success: true, data: reagents });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getExpired(req: Request, res: Response) {
    try {
      const reagents = await service.getExpired();
      res.json({ success: true, data: reagents });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async use(req: Request, res: Response) {
    try {
      const { runs } = req.body;
      const reagent = await service.useReagent(req.params.id, runs);
      res.json({ success: true, data: reagent });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
