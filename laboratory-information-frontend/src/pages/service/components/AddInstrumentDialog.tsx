import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/common/dialog';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/common/select';
import { Textarea } from '../../../components/common/textarea';
import { toast } from 'sonner';
import type { Instrument } from '../types/Instrument';

interface AddInstrumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddInstrument: (instrument: Instrument) => void;
}

export function AddInstrumentDialog({
    open,
    onOpenChange,
    onAddInstrument,
}: AddInstrumentDialogProps) {
    const [newInstrument, setNewInstrument] = useState({
        name: '',
        model: '',
        serialNumber: '',
        manufacturer: '',
        location: '',
        firmwareVersion: '',
        testTypes: '',
        throughputPerHour: '',
        maintenanceInterval: '',
        configurations: '',
    });

    const resetForm = () =>
        setNewInstrument({
            name: '',
            model: '',
            serialNumber: '',
            manufacturer: '',
            location: '',
            firmwareVersion: '',
            testTypes: '',
            throughputPerHour: '',
            maintenanceInterval: '',
            configurations: '',
        });

    const handleSubmit = () => {
        if (
            !newInstrument.name ||
            !newInstrument.model ||
            !newInstrument.serialNumber ||
            !newInstrument.manufacturer
        ) {
            toast.error('⚠️ Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        const now = new Date();
        const currentDate = now.toISOString();
        const nextCalibration = new Date();
        nextCalibration.setMonth(nextCalibration.getMonth() + 3);

        const instrument: Instrument = {
            id: `INS${Date.now().toString().slice(-6)}`,
            name: newInstrument.name.trim(),
            model: newInstrument.model.trim(),
            serialNumber: newInstrument.serialNumber.trim(),
            manufacturer: newInstrument.manufacturer.trim(),
            location: newInstrument.location || 'Chưa xác định',
            status: 'ready',
            mode: 'ready',
            isActive: true,
            isConnected: true,
            lastCalibration: currentDate.split('T')[0],
            nextCalibration: nextCalibration.toISOString().split('T')[0],
            lastMaintenanceDate: currentDate.split('T')[0],
            maintenanceInterval: parseInt(newInstrument.maintenanceInterval) || 90,
            firmwareVersion: newInstrument.firmwareVersion || 'v1.0.0',
            testTypes: newInstrument.testTypes
                ? newInstrument.testTypes.split(',').map((t) => t.trim())
                : [],
            throughputPerHour: parseInt(newInstrument.throughputPerHour) || 100,
            temperature: 25,
            errorCount: 0,
            qcStatus: 'not_required',
            reagentLevel: 100,
            lastStatusChange: new Date().toLocaleString('vi-VN'),
            statusChangedBy: 'admin',
            configurations: newInstrument.configurations || '{}',
            createdAt: currentDate,
            updatedAt: currentDate,
        };

        onAddInstrument(instrument);
        onOpenChange(false);
        resetForm();
        toast.success('✅ Thêm thiết bị thành công');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-blue-700">
                        Thêm Thiết bị mới
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Nhập thông tin chi tiết để thêm thiết bị vào hệ thống quản lý
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    {[
                        { id: 'name', label: 'Tên thiết bị *', placeholder: 'Máy phân tích huyết học HA-500' },
                        { id: 'model', label: 'Model *', placeholder: 'HA-500' },
                        { id: 'serialNumber', label: 'Số serial *', placeholder: 'HA500-2024-001' },
                    ].map((f) => (
                        <div className="space-y-2" key={f.id}>
                            <Label htmlFor={f.id}>{f.label}</Label>
                            <Input
                                id={f.id}
                                value={newInstrument[f.id as keyof typeof newInstrument] || ""}
                                onChange={(e) =>
                                    setNewInstrument({
                                        ...newInstrument,
                                        [f.id]: e.target.value,
                                    })
                                }
                                placeholder={f.placeholder}
                            />

                        </div>
                    ))}

                    {/* Manufacturer */}
                    <div className="space-y-2">
                        <Label>Nhà sản xuất *</Label>
                        <Select
                            value={newInstrument.manufacturer}
                            onValueChange={(value) =>
                                setNewInstrument({ ...newInstrument, manufacturer: value })
                            }
                        >
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

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Vị trí</Label>
                        <Select
                            value={newInstrument.location}
                            onValueChange={(value) =>
                                setNewInstrument({ ...newInstrument, location: value })
                            }
                        >
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
                    {/* Firmware */}
                    <div className="space-y-2">
                        <Label>Phiên bản firmware</Label>
                        <Input
                            value={newInstrument.firmwareVersion}
                            onChange={(e) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    firmwareVersion: e.target.value,
                                })
                            }
                            placeholder="v2.1.3"
                        />
                    </div>

                    {/* Test types */}
                    <div className="space-y-2">
                        <Label>Loại xét nghiệm</Label>
                        <Input
                            value={newInstrument.testTypes}
                            onChange={(e) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    testTypes: e.target.value,
                                })
                            }
                            placeholder="CBC, WBC, RBC, PLT"
                        />
                    </div>

                    {/* Performance */}
                    <div className="space-y-2">
                        <Label>Công suất (mẫu/giờ)</Label>
                        <Input
                            type="number"
                            value={newInstrument.throughputPerHour}
                            onChange={(e) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    throughputPerHour: e.target.value,
                                })
                            }
                            placeholder="120"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Chu kỳ bảo trì (ngày)</Label>
                        <Input
                            type="number"
                            value={newInstrument.maintenanceInterval}
                            onChange={(e) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    maintenanceInterval: e.target.value,
                                })
                            }
                            placeholder="90"
                        />
                    </div>

                    {/* Config JSON */}
                    <div className="col-span-2 space-y-2">
                        <Label>Cấu hình thiết bị (JSON)</Label>
                        <Textarea
                            value={newInstrument.configurations}
                            onChange={(e) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    configurations: e.target.value,
                                })
                            }
                            rows={3}
                            placeholder='{"sampleVolume": 200, "dilutionRatio": "1:1000"}'
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit}>Thêm thiết bị</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
