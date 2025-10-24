import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/common/dialog";
import { Label } from "../../../components/common/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/common/select";
import { Textarea } from "../../../components/common/textarea";
import Button from "../../../components/common/button";
import { Power, PlayCircle, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import type { Instrument } from "../types/Instrument";
import { toast } from "sonner";

interface ChangeInstrumentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrument: Instrument | null;
  onStatusChange: (id: string, newStatus: Instrument['status'], reason: string) => void;
}

export function ChangeInstrumentStatusDialog({
  open,
  onOpenChange,
  instrument,
  onStatusChange,
}: ChangeInstrumentStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<Instrument['status'] | "">("");
  const [reason, setReason] = useState("");

  // Reset fields when dialog opens or instrument changes to avoid stale input
  useEffect(() => {
    if (open) {
      setNewStatus("");
      setReason("");
    }
  }, [open, instrument]);

  if (!instrument) return null;

  const statusIcons: Record<string, React.ReactNode> = {
    ready: <PlayCircle className="text-blue-500 w-4 h-4" />,
    processing: <Power className="text-yellow-500 w-4 h-4" />,
    maintenance: <Wrench className="text-orange-500 w-4 h-4" />,
    error: <AlertTriangle className="text-red-500 w-4 h-4" />,
  };

  const handleConfirm = () => {
    if (!newStatus || !reason.trim()) {
      toast.error("Vui lòng chọn trạng thái mới và nhập lý do thay đổi!");
      return;
    }
    onStatusChange(instrument.id, newStatus, reason);
    toast.success("✅ Trạng thái thiết bị đã được cập nhật!");
    onOpenChange(false);
    setNewStatus("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>Thay đổi Trạng thái Thiết bị</DialogTitle>
          <DialogDescription>
            Chuyển đổi chế độ hoạt động của thiết bị <b>{instrument.name}</b>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Hiện tại */}
          <div>
            <Label className="mb-2">Trạng thái hiện tại</Label>
            <div className="mt-1 flex items-center gap-3 bg-gray-50 border rounded-md px-4 py-3 text-gray-700">
              <div className="flex items-center justify-center">{statusIcons[instrument.status] || <CheckCircle className="text-gray-400 w-5 h-5" />}</div>
              <span className="text-sm">
                {instrument.status === "ready"
                  ? "Sẵn sàng"
                  : instrument.status === "processing"
                  ? "Đang xử lý"
                  : instrument.status === "maintenance"
                  ? "Bảo trì"
                  : "Ngưng hoạt động"}
              </span>
            </div>
          </div>

          {/* Trạng thái mới */}
          <div>
            <Label className="mb-2">Trạng thái mới *</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as Instrument['status'])}>
              <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-200 shadow-md">
                <SelectItem value="ready">Sẵn sàng</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="error">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lý do */}
          <div className="md:col-span-2">
            <Label className="mb-2">Lý do thay đổi *</Label>
            <Textarea
              rows={5}
              className="w-full min-h-[120px]"
              placeholder="Nhập lý do thay đổi trạng thái thiết bị..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Lý do này sẽ được ghi vào nhật ký hệ thống
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Xác nhận thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
