import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/common/dialog";
import { Label } from "../../../components/common/label";
import { Input } from "../../../components/common/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/common/select";
import Button from "../../../components/common/button";
import type { Instrument } from "../types/Instrument";
import { toast } from "sonner";
import { instrumentsService } from "../../../service/instrumentsService";

interface ChangeInstrumentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrument: Instrument | null;
  onStatusChange: (updatedInstrument: Instrument) => void;
}

export function ChangeInstrumentStatusDialog({
  open,
  onOpenChange,
  instrument,
  onStatusChange,
}: ChangeInstrumentStatusDialogProps) {
  const [instrumentName, setInstrumentName] = useState("");
  const [instrumentType, setInstrumentType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Instrument['status'] | "">("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset fields when dialog opens or instrument changes to avoid stale input
  useEffect(() => {
    if (open && instrument) {
      setInstrumentName(instrument.instrument_name || "");
      setInstrumentType(instrument.instrument_type || "");
      setManufacturer(instrument.manufacturer || "");
      setLocation(instrument.location || "");
      setStatus(instrument.status); // Set default to current status
      setIsActive(instrument.is_active);
      setIsSubmitting(false);
    }
  }, [open, instrument]);

  if (!instrument) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const updatePayload: Partial<Instrument> = {
        instrument_name: instrumentName.trim(),
        instrument_type: instrumentType.trim(),
        status: (status || instrument.status) as Instrument['status'],
        is_active: isActive,
      };

      if (manufacturer.trim()) {
        updatePayload.manufacturer = manufacturer.trim();
      }

      if (location.trim()) {
        updatePayload.location = location.trim();
      }

      const updatedInstrument = await instrumentsService.updateInstrument(instrument._id, updatePayload);

      onStatusChange(updatedInstrument);
      toast.success("✅ Thông tin thiết bị đã được cập nhật!");
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể cập nhật thông tin thiết bị";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Cập nhật Thông tin Thiết bị</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin và trạng thái của thiết bị
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên thiết bị */}
            <div className="space-y-2">
              <Label htmlFor="instrument_name">Tên thiết bị</Label>
              <Input
                id="instrument_name"
                value={instrumentName}
                onChange={(e) => setInstrumentName(e.target.value)}
                placeholder="Nhập tên thiết bị"
              />
            </div>

            {/* Loại thiết bị */}
            <div className="space-y-2">
              <Label htmlFor="instrument_type">Loại thiết bị</Label>
              <Select
                value={instrumentType}
                onValueChange={(value) => setInstrumentType(value)}
              >
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Chọn loại thiết bị" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  {[
                    'Máy phân tích huyết học',
                    'Máy sinh hóa tự động', 
                    'Máy đông máu',
                    'Máy xét nghiệm nước tiểu',
                    'Máy miễn dịch tự động',
                    'Máy PCR',
                    'Thiết bị khác'
                  ].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nhà sản xuất */}
            <div className="space-y-2">
              <Label>Nhà sản xuất</Label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Chọn nhà sản xuất" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  {[
                    'Sysmex',
                    'Roche',
                    'Abbott',
                    'Siemens',
                    'Beckman Coulter',
                    'Bio-Rad',
                    'Radiometer',
                    'Khác',
                  ].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vị trí */}
            <div className="space-y-2">
              <Label htmlFor="location">Vị trí</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  <SelectItem value="Phòng Huyết học">Phòng Huyết học</SelectItem>
                  <SelectItem value="Phòng Sinh hóa">Phòng Sinh hóa</SelectItem>
                  <SelectItem value="Phòng Miễn dịch">Phòng Miễn dịch</SelectItem>
                  <SelectItem value="Phòng Vi sinh">Phòng Vi sinh</SelectItem>
                  <SelectItem value="Phòng Nước tiểu">Phòng Nước tiểu</SelectItem>
                  <SelectItem value="Phòng Đông máu">Phòng Đông máu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Instrument['status'])}>
              <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-200 shadow-md">
                <SelectItem value="Ready">Sẵn sàng</SelectItem>
                <SelectItem value="Processing">Đang xử lý</SelectItem>
                <SelectItem value="Maintenance">Bảo trì</SelectItem>
                <SelectItem value="Error">Lỗi</SelectItem>
                <SelectItem value="Inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label>Trạng thái hoạt động</Label>
            <Select value={isActive ? "active" : "inactive"} onValueChange={(v) => setIsActive(v === "active")}>
              <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Chọn trạng thái hoạt động" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Xác nhận thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
