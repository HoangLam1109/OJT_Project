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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      toast.success(t('service.instrument.updateSuccess'));
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('service.instrument.cannotUpdateInstrument');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{t('service.instrument.updateDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('service.instrument.updateDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên thiết bị */}
            <div className="space-y-2">
              <Label htmlFor="instrument_name">{t('service.instrument.instrumentName')}</Label>
              <Input
                id="instrument_name"
                value={instrumentName}
                onChange={(e) => setInstrumentName(e.target.value)}
                placeholder={t('service.instrument.updateDialog.instrumentNamePlaceholder')}
              />
            </div>

            {/* Loại thiết bị */}
            <div className="space-y-2">
              <Label htmlFor="instrument_type">{t('service.instrument.instrumentType')}</Label>
              <Select
                value={instrumentType}
                onValueChange={(value) => setInstrumentType(value)}
              >
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={t('service.instrument.updateDialog.instrumentTypePlaceholder')} />
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
              <Label>{t('service.instrument.updateDialog.manufacturer')}</Label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={t('service.instrument.updateDialog.manufacturerPlaceholder')} />
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
              <Label htmlFor="location">{t('service.instrument.location')}</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={t('service.instrument.updateDialog.locationPlaceholder')} />
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
            <Label>{t('service.instrument.status')}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Instrument['status'])}>
              <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder={t('service.instrument.updateDialog.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-200 shadow-md">
                <SelectItem value="Ready">{t('service.instrument.statusReady')}</SelectItem>
                <SelectItem value="Processing">{t('service.instrument.statusProcessing')}</SelectItem>
                <SelectItem value="Inactive">{t('service.instrument.statusInactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label>{t('service.instrument.updateDialog.activeStatus')}</Label>
            <Select value={isActive ? "active" : "inactive"} onValueChange={(v) => setIsActive(v === "active")}>
              <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder={t('service.instrument.updateDialog.activeStatusPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="active">{t('service.instrument.detail.active')}</SelectItem>
                <SelectItem value="inactive">{t('service.instrument.detail.paused')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {t('service.instrument.cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? t('service.instrument.updateDialog.updating') : t('service.instrument.updateDialog.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
