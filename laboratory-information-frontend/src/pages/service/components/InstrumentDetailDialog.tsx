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
import { Progress } from "../../../components/common/progress";
import type { Instrument } from "../types/Instrument";
import {
    Monitor,
    Wifi,
    WifiOff,
    Calendar,
    Wrench,
    Activity,
    Thermometer,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface InstrumentDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    instrument: Instrument | null;
}

export function InstrumentDetailDialog({
    open,
    onOpenChange,
    instrument,
}: InstrumentDetailDialogProps) {
    if (!instrument) return null;

    const getStatusBadge = (status: string) => {
        const map: Record<string, { text: string; variant: string }> = {
            ready: { text: "Sẵn sàng", variant: "default" },
            in_use: { text: "Đang sử dụng", variant: "secondary" },
            maintenance: { text: "Bảo trì", variant: "outline" },
            out_of_service: { text: "Ngưng hoạt động", variant: "destructive" },
        };
        const data = map[status] || { text: status, variant: "outline" };
        return <Badge variant={data.variant as "default" | "secondary" | "destructive" | "outline"}>{data.text}</Badge>;

    };

    const getQCStatusBadge = (qcStatus?: string) => {
        switch (qcStatus) {
            case "passed":
                return (
                    <Badge variant="default" className="bg-green-600 text-white">
                        Đạt
                    </Badge>
                );
            case "failed":
                return <Badge variant="destructive">Không đạt</Badge>;
            case "pending":
                return <Badge variant="secondary">Chờ kiểm tra</Badge>;
            default:
                return <Badge variant="outline">Chưa có</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-2xl border border-gray-200">
                <DialogHeader className="pb-2 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                        <Monitor className="w-5 h-5 text-blue-600" />
                        Chi tiết thiết bị
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Thông tin chi tiết về thiết bị xét nghiệm
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Mã thiết bị</Label>
                            <p className="font-mono text-sm mt-1">{instrument.id}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Trạng thái</Label>
                            <div className="mt-1 flex items-center gap-2">
                                {getStatusBadge(instrument.status)}
                                {instrument.isActive ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                        Hoạt động
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                                        Tạm dừng
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Tên thiết bị</Label>
                            <p className="mt-1">{instrument.name}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Model</Label>
                            <p className="mt-1">{instrument.model}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Connection & Location */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Số Serial</Label>
                            <p className="font-mono text-sm mt-1">{instrument.serialNumber}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Nhà sản xuất</Label>
                            <p className="mt-1">{instrument.manufacturer}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Vị trí</Label>
                            <p className="mt-1">{instrument.location}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Label className="text-xs text-gray-500">Kết nối</Label>
                            <div className="flex items-center gap-2 mt-1">
                                {instrument.isConnected ? (
                                    <>
                                        <Wifi className="w-4 h-4 text-green-600" />
                                        <span className="text-green-600 text-sm">Online</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-4 h-4 text-red-600" />
                                        <span className="text-red-600 text-sm">Offline</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Performance Metrics */}
                    <div>
                        <Label className="text-sm text-gray-600 mb-3 block">Hiệu suất & Chất lượng</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-blue-600" />
                                    <Label className="text-xs text-blue-700">Công suất</Label>
                                </div>
                                <p className="text-xl text-blue-600">{instrument.throughputPerHour}</p>
                                <p className="text-xs text-blue-600">test/giờ</p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-4 h-4 text-blue-600" />
                                    <Label className="text-xs text-blue-700">Nhiệt độ</Label>
                                </div>
                                <p className="text-xl text-blue-600">{instrument.temperature}°C</p>
                                <p className="text-xs text-blue-600">Bình thường</p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-4 h-4 text-blue-600" />
                                    <Label className="text-xs text-blue-700">Lỗi</Label>
                                </div>
                                <p className="text-xl text-blue-600">{instrument.errorCount}</p>
                                <p className="text-xs text-blue-600">lỗi ghi nhận</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Reagent Level */}
                    {instrument.reagentLevel !== undefined && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-2">
                                <Label className="text-sm text-gray-600">Mức hóa chất</Label>
                                <span className="text-sm font-medium text-gray-800">
                                    {instrument.reagentLevel}%
                                </span>
                            </div>
                            <Progress value={instrument.reagentLevel} className="h-3" />
                            {instrument.reagentLevel < 30 && (
                                <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Hóa chất sắp hết, cần nạp thêm
                                </p>
                            )}
                        </div>
                    )}

                    <Separator />

                    {/* Calibration & Maintenance */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <Label className="text-sm flex items-center gap-2 text-gray-700">
                                <Calendar className="w-4 h-4" /> Hiệu chuẩn
                            </Label>
                            <p className="text-sm mt-1">
                                Lần cuối: <span className="font-mono">{instrument.lastCalibration}</span>
                            </p>
                            <p className="text-sm mt-1">
                                Lần tiếp: <span className="font-mono">{instrument.nextCalibration}</span>
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <Label className="text-sm flex items-center gap-2 text-gray-700">
                                <Wrench className="w-4 h-4" /> Bảo trì
                            </Label>
                            <p className="text-sm mt-1">
                                Lần cuối: <span className="font-mono">{instrument.lastMaintenanceDate}</span>
                            </p>
                            <p className="text-sm mt-1">
                                Chu kỳ:{" "}
                                <span className="font-mono">{instrument.maintenanceInterval} ngày</span>
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* QC Status */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-sm flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4" /> Trạng thái QC
                            </Label>
                            <div className="mt-2">{getQCStatusBadge(instrument.qcStatus)}</div>
                            {instrument.lastQcDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Kiểm tra cuối: {instrument.lastQcDate}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm text-gray-700">Firmware</Label>
                            <p className="font-mono text-sm mt-2 p-2 bg-white border border-gray-200 rounded-md">
                                {instrument.firmwareVersion}
                            </p>
                        </div>
                    </div>

                    {/* Test Types */}
                    {instrument.testTypes?.length > 0 && (
                        <>
                            <Separator />
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <Label className="text-sm text-gray-700 mb-2 block">
                                    Loại xét nghiệm hỗ trợ
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {instrument.testTypes.map((type, i) => (
                                        <Badge key={i} variant="outline" className="bg-white border-gray-300">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Status Change Reason */}
                    {instrument.statusChangeReason && (
                        <>
                            <Separator />
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Label className="text-sm text-yellow-900 mb-1 block">
                                    Lý do thay đổi trạng thái
                                </Label>
                                <p className="text-sm text-yellow-800">{instrument.statusChangeReason}</p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
