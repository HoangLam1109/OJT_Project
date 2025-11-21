import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/common/dialog";
import Badge from "../../../components/common/badge";
import { Label } from "../../../components/common/label";
import { Separator } from "../../../components/common/separator";
import type { Instrument } from "../types/Instrument";
import { instrumentsService } from "../../../service/instrumentsService";
import { toast } from "sonner";
import {
    Monitor,
    Calendar,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface InstrumentDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    instrumentId: string | null;
}

export function InstrumentDetailDialog({
    open,
    onOpenChange,
    instrumentId,
}: InstrumentDetailDialogProps) {
    const { t } = useTranslation();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && instrumentId) {
            setIsLoading(true);
            setError(null);
            instrumentsService
                .getInstrumentById(instrumentId)
                .then((data) => {
                    setInstrument(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    const message = err instanceof Error ? err.message : t('service.instrument.cannotLoadInstrumentInfo');
                    setError(message);
                    setIsLoading(false);
                    toast.error(message);
                });
        } else if (!open) {
            // Reset when dialog closes
            setInstrument(null);
            setError(null);
        }
    }, [open, instrumentId]);

    const getStatusBadge = (status: string) => {
        const map: Record<string, { text: string; variant: string }> = {
            Ready: { text: t('service.instrument.statusReady'), variant: "default" },
            Processing: { text: t('service.instrument.statusProcessing'), variant: "secondary" },
            Maintenance: { text: t('service.instrument.statusMaintenance'), variant: "outline" },
            Error: { text: t('service.instrument.statusError'), variant: "destructive" },
            Inactive: { text: t('service.instrument.statusInactive'), variant: "destructive" },
        };
        const data = map[status] || { text: status, variant: "outline" };
        return <Badge variant={data.variant as "default" | "secondary" | "destructive" | "outline"}>{data.text}</Badge>;
    };


    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-2xl border border-gray-200">
                <DialogHeader className="pb-2 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                        <Monitor className="w-5 h-5 text-blue-600" />
                        {t('service.instrument.detail.title')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {t('service.instrument.detail.description')}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-3 text-gray-600">{t('service.instrument.detail.loading')}</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : !instrument ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-600">{t('service.instrument.detail.notFound')}</p>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.detail.instrumentCode')}</Label>
                                <p className="font-mono text-sm mt-1">{instrument.instrument_code}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.status')}</Label>
                                <div className="mt-1 flex items-center gap-2">
                                    {getStatusBadge(instrument.status)}
                                    {instrument.is_active ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                            {t('service.instrument.detail.active')}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-gray-50 text-gray-600">
                                            {t('service.instrument.detail.paused')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.instrumentName')}</Label>
                                <p className="mt-1">{instrument.instrument_name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.instrumentType')}</Label>
                                <p className="mt-1">{instrument.instrument_type}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Connection & Location */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.detail.manufacturer')}</Label>
                                <p className="mt-1">{instrument.manufacturer || t('service.instrument.detail.noInfo')}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <Label className="text-xs text-gray-500">{t('service.instrument.location')}</Label>
                                <p className="mt-1">{instrument.location || t('service.instrument.detail.noInfo')}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <Label className="text-sm flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4" /> {t('service.instrument.detail.createdAt')}
                                </Label>
                                <p className="text-sm mt-1">
                                    <span className="font-mono">
                                        {instrument.created_at instanceof Date
                                            ? instrument.created_at.toLocaleDateString("vi-VN")
                                            : new Date(instrument.created_at).toLocaleDateString("vi-VN")}
                                    </span>
                                </p>
                                {instrument.created_by && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('service.instrument.detail.createdBy')}: {instrument.created_by}
                                    </p>
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <Label className="text-sm flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4" /> {t('service.instrument.detail.updatedAt')}
                                </Label>
                                <p className="text-sm mt-1">
                                    <span className="font-mono">
                                        {instrument.updated_at instanceof Date
                                            ? instrument.updated_at.toLocaleDateString("vi-VN")
                                            : new Date(instrument.updated_at).toLocaleDateString("vi-VN")}
                                    </span>
                                </p>
                                {instrument.updated_by && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('service.instrument.detail.updatedBy')}: {instrument.updated_by}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
