import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
// import { Select } from '../../../components/common/select';
import type { PatientDetail, PatientModalMode } from '../hooks/usePatientModal';

interface PatientModalProps {
  isOpen: boolean;
  mode: PatientModalMode;
  patient: PatientDetail | null;
  onClose: () => void;
  onSubmit?: (data: Partial<PatientDetail>) => Promise<void>;
}

interface PatientFormState {
  patient_code?: string;
  fullName?: string;
  email?: string;
  identityNumber?: string;
  phoneNumber?: string;
  gender?: string;
  age?: number | string;
  dateOfBirth?: string;
  address?: string;
  emergency_name?: string;
  emergency_phone?: string;
  created_by?: string;
  created_at?: string;
}

export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, mode, patient, onClose, onSubmit }) => {
  const [formState, setFormState] = useState<PatientFormState>({});

  const isReadOnly = mode === 'view';

  const title = mode === 'create' ? 'Thêm bệnh nhân mới' : mode === 'edit' ? 'Chỉnh sửa bệnh nhân' : 'Chi tiết bệnh nhân';

  const isFieldDisabled = (field: string) => {
    if (mode === 'view') return true;
    if (mode === 'create') return false;
    // mode === 'edit' -> only emergency fields are editable
    return !(field === 'emergency_name' || field === 'emergency_phone');
  };

  useEffect(() => {
    if (patient && (mode === 'view' || mode === 'edit')) {
      // Format date of birth to YYYY-MM-DD
      const dateOfBirth = patient.user?.dateOfBirth ? new Date(patient.user.dateOfBirth).toISOString().split('T')[0] : '';
      
      setFormState({
        patient_code: patient.patient_code ?? '',
        fullName: patient.user?.fullName ?? '',
        email: patient.user?.email ?? '',
        identityNumber: patient.user?.identityNumber ?? '',
        phoneNumber: patient.user?.phoneNumber ?? '',
        gender: patient.user?.gender ?? '',
        age: patient.user?.age ?? '',
        dateOfBirth,
        address: patient.user?.address ?? '',
        emergency_name: patient.emergency_contact?.name ?? '',
        emergency_phone: patient.emergency_contact?.phone ?? '',
        created_by: patient.created_by ?? '',
        created_at: patient.created_at ?? '',
      });
    } else if (mode === 'create') {
      setFormState({});
    }
  }, [patient, mode]);

  const handleChange = (field: keyof PatientFormState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (onSubmit) await onSubmit(formState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formState.fullName ?? ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                disabled={isFieldDisabled('fullName')}
              />
            </div>

            <div>
              <Label htmlFor="patient_code">Mã bệnh nhân</Label>
              <Input id="patient_code" value={formState.patient_code ?? ''} disabled />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formState.email ?? ''}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isFieldDisabled('email')}
              />
            </div>

            <div>
              <Label htmlFor="identityNumber">CMND/CCCD</Label>
              <Input
                id="identityNumber"
                value={formState.identityNumber ?? ''}
                onChange={(e) => handleChange('identityNumber', e.target.value)}
                disabled={isFieldDisabled('identityNumber')}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={formState.phoneNumber ?? ''}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                disabled={isFieldDisabled('phoneNumber')}
              />
            </div>

            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <select
                id="gender"
                value={formState.gender ?? ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                disabled={isFieldDisabled('gender')}
                className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1"
              >
                <option value="">Chọn</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <Label htmlFor="age">Tuổi</Label>
              <Input id="age" type="number" value={formState.age ?? ''} onChange={(e) => handleChange('age', e.target.value)} disabled={isFieldDisabled('age')} />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input id="dateOfBirth" type="date" value={formState.dateOfBirth ?? ''} onChange={(e) => handleChange('dateOfBirth', e.target.value)} disabled={isFieldDisabled('dateOfBirth')} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" value={formState.address ?? ''} onChange={(e) => handleChange('address', e.target.value)} disabled={isFieldDisabled('address')} />
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium">Thông tin liên hệ khẩn cấp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="emergency_name">Tên liên hệ</Label>
                  <Input id="emergency_name" value={formState.emergency_name ?? ''} onChange={(e) => handleChange('emergency_name', e.target.value)} disabled={isFieldDisabled('emergency_name')} />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Số điện thoại</Label>
                  <Input id="emergency_phone" value={formState.emergency_phone ?? ''} onChange={(e) => handleChange('emergency_phone', e.target.value)} disabled={isFieldDisabled('emergency_phone')} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>{isReadOnly ? 'Đóng' : 'Hủy'}</Button>
          {!isReadOnly && (
            <Button type="submit" onClick={handleSubmit}>{mode === 'create' ? 'Thêm bệnh nhân' : 'Cập nhật'}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
