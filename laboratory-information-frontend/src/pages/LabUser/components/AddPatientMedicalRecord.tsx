import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import { Label } from '../../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Input } from '../../../components/common/input';
import { Textarea } from '../../../components/common/textarea';
import Button from '../../../components/common/button';
import { patientService, type PatientOption } from '../../../service/patientService';
import { patientMedicalRecordService } from '../../../service/patientMedicalRecordService';
import { toast } from 'sonner';

interface AddPatientMedicalRecordProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AddPatientMedicalRecord({ open, onOpenChange, onCreated }: AddPatientMedicalRecordProps) {
    const [patients, setPatients] = useState<PatientOption[]>([]);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({
        patient_id: '',
        blood_type: '',
        allergies: '',
        chronic_conditions: '',
        current_medications: '',
        medical_history: '',
        clinical_notes: '',
        recent_test_summary: '',
        recent_instruments_used: '',
        recent_reagents_info: '',
    });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!open) return;
            try {
                const list = await patientService.getAllPatients({ page: 1, limit: 100, populateUser: true, isActive: true });
                if (mounted) setPatients(list);
            } catch {
                // ignore
            }
        };
        load();
        return () => { mounted = false; };
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl">
        <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl">Tạo hồ sơ y tế</DialogTitle>
                </DialogHeader>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Bệnh nhân</Label>
                            <Select value={form.patient_id} onValueChange={(v) => setForm(prev => ({ ...prev, patient_id: v }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn bệnh nhân" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-lg z-[60] max-h-72 overflow-auto">
                                    {patients.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nhóm máu</Label>
                            <Select value={form.blood_type} onValueChange={(v) => setForm(prev => ({ ...prev, blood_type: v }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhóm máu" />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-lg z-[60] max-h-72 overflow-auto">
                                    {BLOOD_TYPES.map(bt => (
                                        <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Dị ứng</Label>
                            <Input value={form.allergies} onChange={(e) => setForm(prev => ({ ...prev, allergies: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bệnh mạn tính</Label>
                            <Input value={form.chronic_conditions} onChange={(e) => setForm(prev => ({ ...prev, chronic_conditions: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Thuốc đang dùng</Label>
                            <Input value={form.current_medications} onChange={(e) => setForm(prev => ({ ...prev, current_medications: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tiền sử y khoa</Label>
                            <Input
                                value={form.medical_history}
                                onChange={(e) => setForm(prev => ({ ...prev, medical_history: e.target.value }))}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Ghi chú lâm sàng</Label>
                            <Textarea value={form.clinical_notes} onChange={(e) => setForm(prev => ({ ...prev, clinical_notes: e.target.value }))} />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Tóm tắt xét nghiệm gần đây</Label>
                            <Textarea value={form.recent_test_summary} onChange={(e) => setForm(prev => ({ ...prev, recent_test_summary: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Thiết bị sử dụng gần đây</Label>
                            <Input value={form.recent_instruments_used} onChange={(e) => setForm(prev => ({ ...prev, recent_instruments_used: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Thuốc thử (batch/lot)</Label>
                            <Input value={form.recent_reagents_info} onChange={(e) => setForm(prev => ({ ...prev, recent_reagents_info: e.target.value }))} />
                        </div>
                    </div>
                </div>
        <DialogFooter className="mt-8">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={async () => {
                        if (!form.patient_id) {
                            toast.error('Vui lòng chọn bệnh nhân');
                            return;
                        }
                        setCreating(true);
                        try {
                            const created = await patientMedicalRecordService.create(form);
                            if (created) {
                                toast.success('Tạo hồ sơ thành công');
                                onOpenChange(false);
                                onCreated?.();
                                setForm({
                                    patient_id: '', blood_type: '', allergies: '', chronic_conditions: '', current_medications: '',
                                    medical_history: '', clinical_notes: '', recent_test_summary: '', recent_instruments_used: '', recent_reagents_info: ''
                                });
                            } else {
                                toast.error('Tạo hồ sơ thất bại');
                            }
                        } catch {
                            toast.error('Tạo hồ sơ thất bại');
                        } finally {
                            setCreating(false);
                        }
                    }} disabled={creating}>
                        {creating ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


