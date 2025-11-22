import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../../components/common/dialog';
import { Label } from '../../../../../components/common/label';
import { Input } from '../../../../../components/common/input';
import { Textarea } from '../../../../../components/common/textarea';
import Button from '../../../../../components/common/button';
import { patientMedicalRecordService } from '../../../../../service/patientMedicalRecordService';
import { patientService } from '../../../../../service/patientService';
import { toast } from 'sonner';

interface EditPatientMedicalRecordProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export default function EditPatientMedicalRecord({ id, open, onOpenChange, onUpdated }: EditPatientMedicalRecordProps) {
  const [loading, setLoading] = useState(false);

  const [patientName, setPatientName] = useState<string>('');
  const [form, setForm] = useState({
    blood_type: '',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    medical_history: '',
    clinical_notes: '',
    recent_test_summary: '',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!open || !id) return;
      setLoading(true);
      try {
        const detail = await patientMedicalRecordService.getDetail(id);
        if (!mounted) return;

        // Resolve patient name from embedded data or fetch by patient_id
        const embeddedName = detail?.patient?.user?.fullName;
        if (embeddedName) {
          setPatientName(embeddedName);
        } else if (detail?.patient_id) {
          try {
            const p = await patientService.getPatientById(detail.patient_id);
            if (mounted) setPatientName(p?.fullName || '');
          } catch {
            if (mounted) setPatientName('');
          }
        } else {
          setPatientName('');
        }
        setForm({
          blood_type: String(detail?.blood_type ?? ''),
          allergies: String(detail?.allergies ?? ''),
          chronic_conditions: String(detail?.chronic_conditions ?? ''),
          current_medications: String(detail?.current_medications ?? ''),
          medical_history: String(detail?.medical_history ?? ''),
          clinical_notes: String(detail?.clinical_notes ?? ''),
          recent_test_summary: String(detail?.recent_test_summary ?? ''),
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Cập nhật hồ sơ y tế</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Bệnh nhân</Label>
              <Input value={patientName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Nhóm máu</Label>
              <Input
                value={form.blood_type}
                placeholder="Nhập nhóm máu (ví dụ: A+, HH)"
                onChange={(e) => setForm(prev => ({ ...prev, blood_type: e.target.value }))}
              />
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
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={async () => {
            if (!id) return;
            try {
              const updated = await patientMedicalRecordService.update(id, form);
              if (updated) {
                toast.success('Cập nhật hồ sơ thành công');
                onOpenChange(false);
                onUpdated?.();
              } else {
                toast.error('Cập nhật hồ sơ thất bại');
              }
            } catch {
              toast.error('Cập nhật hồ sơ thất bại');
            }
          }} disabled={loading}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



