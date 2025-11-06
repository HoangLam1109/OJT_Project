import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/common/dialog';
import Button from '../../../components/common/button';
import { Label } from '../../../components/common/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/common/select';
import { toast } from 'sonner';
import type { Instrument } from '../types/Instrument';
import { instrumentsService } from '../../../service/instrumentsService';

interface AddInstrumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddInstrument: (instrument: Instrument) => void;
}

interface InstrumentFormData {
    instrument_name: string;
    instrument_type: string;
    manufacturer: string;
    location: string;
}

export function AddInstrumentDialog({
    open,
    onOpenChange,
    onAddInstrument,
}: AddInstrumentDialogProps) {
    const [newInstrument, setNewInstrument] = useState<InstrumentFormData>({
        instrument_name: '',
        instrument_type: '',
        manufacturer: '',
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
        setNewInstrument({
            instrument_name: '',
            instrument_type: '',
            manufacturer: '',
            location: '',
        });
    }, []);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            resetForm();
            setIsSubmitting(false);
        }
    }, [open, resetForm]);

    const handleSubmit = async () => {
        if (!newInstrument.instrument_name || !newInstrument.instrument_type) {
            toast.error('⚠️ Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Partial<Instrument> = {
                instrument_name: newInstrument.instrument_name.trim(),
                instrument_type: newInstrument.instrument_type.trim(),
                manufacturer: newInstrument.manufacturer.trim() || undefined,
                location: newInstrument.location.trim() || undefined,
            };

            const createdInstrument = await instrumentsService.createInstrument(payload);
            onAddInstrument(createdInstrument);
            onOpenChange(false);
            resetForm();
            toast.success('✅ Thêm thiết bị thành công');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể thêm thiết bị';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
                    {/* Instrument Name */}
                    <div className="space-y-2">
                        <Label htmlFor="instrument_name">Tên thiết bị *</Label>
                        <Select
                            value={newInstrument.instrument_name}
                            onValueChange={(value) =>
                                setNewInstrument({
                                    ...newInstrument,
                                    instrument_name: value,
                                })
                            }
                        >
                            <SelectTrigger className="bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue placeholder="Chọn loại thiết bị hoặc nhập tên thiết bị" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-md">
                                {[
                                    'Máy phân tích huyết học HA-500',
                                    'Máy sinh hóa tự động AU480',
                                    'Máy đông máu ACL TOP 300',
                                    'Máy xét nghiệm nước tiểu Urisys 1100',
                                    'Máy miễn dịch tự động Architect i1000SR',
                                    'Máy PCR Rotor-Gene Q',
                                    'Thiết bị khác'
                                ].map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Instrument Type */}
                    <div className="space-y-2">
                        <Label htmlFor="instrument_type">Loại thiết bị *</Label>
                        <Select
                            value={newInstrument.instrument_type}
                            onValueChange={(value) =>
                                setNewInstrument({ ...newInstrument, instrument_type: value })
                            }
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

                    {/* Manufacturer */}
                    <div className="space-y-2">
                        <Label>Nhà sản xuất</Label>
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
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang thêm...' : 'Thêm thiết bị'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
