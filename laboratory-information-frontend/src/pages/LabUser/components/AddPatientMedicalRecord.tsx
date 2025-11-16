import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import { Label } from '../../../components/common/label';
import { Input } from '../../../components/common/input';
import { Textarea } from '../../../components/common/textarea';
import Button from '../../../components/common/button';
import { patientService, type PatientOption } from '../../../service/patientService';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../../service/patientMedicalRecordService';
import { toast } from 'sonner';

interface AddPatientMedicalRecordProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (record?: PatientMedicalRecord | null) => void;
    patientId?: string;
}

export default function AddPatientMedicalRecord({ open, onOpenChange, onCreated, patientId }: AddPatientMedicalRecordProps) {
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
    });
    const [patientQuery, setPatientQuery] = useState('');
    const [patientSuggestions, setPatientSuggestions] = useState<PatientOption[]>([]);
    const [patientSearchLoading, setPatientSearchLoading] = useState(false);
    const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
    const [highlightedPatientIndex, setHighlightedPatientIndex] = useState(-1);
    const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
    const patientSearchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
    const patientSearchContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !patientId) return;
        let active = true;
        setPatientSearchLoading(true);
        patientService.getPatientById(patientId)
            .then((patient) => {
                if (!active) return;
                if (patient) {
                    setSelectedPatient(patient);
                    setPatientQuery(patient.fullName ?? '');
                    setForm((prev) => ({ ...prev, patient_id: patient.id }));
                } else {
                    setSelectedPatient(null);
                    setPatientQuery('');
                    setForm((prev) => ({ ...prev, patient_id: patientId }));
                }
            })
            .catch(() => {
                if (!active) return;
                setSelectedPatient(null);
                setPatientQuery('');
            })
            .finally(() => {
                if (active) {
                    setPatientSearchLoading(false);
                }
            });
        return () => { active = false; };
    }, [open, patientId]);

    useEffect(() => {
        if (!open || patientId) return;

        if (patientSearchDebounce.current) {
            clearTimeout(patientSearchDebounce.current);
        }

        if (!patientQuery.trim()) {
            setPatientSuggestions([]);
            setPatientSearchLoading(false);
            setShowPatientSuggestions(false);
            setHighlightedPatientIndex(-1);
            return;
        }

        setShowPatientSuggestions(true);
        setPatientSearchLoading(true);

        let active = true;
        patientSearchDebounce.current = window.setTimeout(async () => {
            try {
                const list = await patientService.getAllPatients({
                    search: patientQuery.trim(),
                    limit: 10,
                    page: 1,
                    isActive: true,
                    populateUser: true,
                });
                if (!active) return;
                setPatientSuggestions(list);
                setHighlightedPatientIndex(list.length ? 0 : -1);
            } catch {
                if (!active) return;
                setPatientSuggestions([]);
                setHighlightedPatientIndex(-1);
            } finally {
                if (active) {
                    setPatientSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            active = false;
            if (patientSearchDebounce.current) {
                clearTimeout(patientSearchDebounce.current);
                patientSearchDebounce.current = null;
            }
        };
    }, [open, patientId, patientQuery]);

    useEffect(() => {
        if (!showPatientSuggestions) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!patientSearchContainerRef.current?.contains(event.target as Node)) {
                setShowPatientSuggestions(false);
                setHighlightedPatientIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPatientSuggestions]);

    const handleSelectPatient = (patient: PatientOption) => {
        setSelectedPatient(patient);
        setPatientQuery(patient.fullName ?? '');
        setForm((prev) => ({ ...prev, patient_id: patient.id }));
        setPatientSuggestions([]);
        setShowPatientSuggestions(false);
        setHighlightedPatientIndex(-1);
    };

    const handlePatientKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!showPatientSuggestions || !patientSuggestions.length) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedPatientIndex((prev) => (prev + 1) % patientSuggestions.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedPatientIndex((prev) => (prev - 1 + patientSuggestions.length) % patientSuggestions.length);
        } else if (event.key === 'Enter') {
            if (highlightedPatientIndex >= 0) {
                event.preventDefault();
                handleSelectPatient(patientSuggestions[highlightedPatientIndex]);
            }
        } else if (event.key === 'Escape') {
            setShowPatientSuggestions(false);
            setHighlightedPatientIndex(-1);
        }
    };

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
                            <div ref={patientSearchContainerRef} className="relative">
                                <Input
                                    value={patientQuery}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setPatientQuery(value);
                                        if (selectedPatient && value !== (selectedPatient.fullName ?? '')) {
                                            setSelectedPatient(null);
                                            setForm((prev) => ({ ...prev, patient_id: '' }));
                                        }
                                    }}
                                    onFocus={() => {
                                        if (patientSuggestions.length) {
                                            setShowPatientSuggestions(true);
                                        }
                                    }}
                                    onKeyDown={handlePatientKeyDown}
                                    placeholder="Nhập tên bệnh nhân"
                                    disabled={Boolean(patientId)}
                                />
                                {showPatientSuggestions && (
                                    <div className="absolute z-[70] mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-lg">
                                        {patientSearchLoading ? (
                                            <div className="px-4 py-2 text-sm text-muted-foreground">Đang tìm...</div>
                                        ) : patientSuggestions.length ? (
                                            <ul className="max-h-64 overflow-auto py-1 text-sm">
                                                {patientSuggestions.map((patient, index) => (
                                                    <li key={patient.id}>
                                                        <button
                                                            type="button"
                                                            className={`flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left transition-colors ${index === highlightedPatientIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted focus-visible:bg-muted'}`}
                                                            onMouseDown={(event) => {
                                                                event.preventDefault();
                                                                handleSelectPatient(patient);
                                                            }}
                                                            onMouseEnter={() => setHighlightedPatientIndex(index)}
                                                        >
                                                            <span className="text-sm font-medium">{patient.fullName}</span>
                                                            {patient.patientCode && (
                                                                <span className="text-xs opacity-80">Mã bệnh nhân: {patient.patientCode}</span>
                                                            )}
                                                            {patient.email && (
                                                                <span className="text-xs opacity-80">Email: {patient.email}</span>
                                                            )}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-muted-foreground">Không tìm thấy bệnh nhân</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {selectedPatient?.patientCode && (
                                <p className="text-xs text-muted-foreground">Mã bệnh nhân hiện chọn: {selectedPatient.patientCode}</p>
                            )}
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
                                onCreated?.(created);
                                setForm({
                                    patient_id: '', blood_type: '', allergies: '', chronic_conditions: '', current_medications: '',
                                    medical_history: '', clinical_notes: '', recent_test_summary: ''
                                });
                                setSelectedPatient(null);
                                setPatientQuery('');
                                setPatientSuggestions([]);
                                setHighlightedPatientIndex(-1);
                                setShowPatientSuggestions(false);
                            } else {
                                toast.error('Tạo hồ sơ thất bại');
                            }
                        } catch (error) {
                            const rawMessage = error instanceof Error ? error.message : '';
                            const duplicateMessage = 'Bệnh nhân này đã có hồ sơ y tế.';
                            if (rawMessage && /already exists/i.test(rawMessage)) {
                                toast.error(duplicateMessage);
                            } else if (rawMessage) {
                                toast.error(rawMessage);
                            } else {
                                toast.error('Tạo hồ sơ thất bại');
                            }
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


