import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Label } from '@/components/common/label';
import { Clock } from 'lucide-react';
import type { EventLog } from '@/service/eventLogService';
import { OperatorInfoCard } from './components/EventLog/OperatorInfoCard';
import { EventInfoCard } from './components/EventLog/EventInfoCard';

// Snapshot interfaces (copied from modal for consistency)
interface UserSnapshot {
  id?: string;
  email?: string;
  fullName?: string;
  identityNumber?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  age?: number;
}

interface PatientSnapshot {
  id?: string;
  userId?: string;
  code?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  lastVisitDate?: string | null;
  lastTestType?: string | null;
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
}

interface MedicalRecordSnapshot {
  _id?: string;
  patient_id?: string;
  record_code?: string;
  blood_type?: string;
  allergies?: string;
  chronic_conditions?: string;
  current_medications?: string;
  medical_history?: string;
  clinical_notes?: string;
  recent_test_summary?: string;
  created_by?: string;
  updated_by?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  deleted_by?: string;
}

interface SnapshotData {
  patient?: PatientSnapshot;
  user?: UserSnapshot;
  medical_record?: MedicalRecordSnapshot;
}

interface EventLogPatientDetailPageProps {
  log: EventLog;
}

const EventLogPatientDetailPage: React.FC<EventLogPatientDetailPageProps> = ({ log }) => {
  const formatDateOnly = (iso?: string) => {
    if (!iso) return '-';
    try {
      const date = new Date(iso);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const getSnapshot = (values: unknown): SnapshotData | null => {
    if (!values || typeof values !== 'object') return null;
    const obj = values as Record<string, unknown>;
    const snapshot = obj.snapshot as SnapshotData | undefined;
    return snapshot || null;
  };

  const eventType = useMemo(() => {
    if (!log) return null;
    const action = String(log.action ?? '').toUpperCase();
    const message = String(log.event_message ?? '').toLowerCase();

    if (action === 'CREATE') {
      if (message.includes('patient record created')) return 'CREATE_PATIENT';
      if (message.includes('medical record created')) return 'CREATE_MEDICAL';
    } else if (action === 'DELETE') {
      if (message.includes('patient record soft deleted')) return 'DELETE_PATIENT';
      if (message.includes('medical record soft deleted')) return 'DELETE_MEDICAL';
    } else if (action === 'UPDATE') {
      if (message.includes('patient record updated') && message.includes('emergency_contact')) return 'UPDATE_PATIENT_EMERGENCY';
      if (message.includes('medical record updated')) return 'UPDATE_MEDICAL';
    }
    return null;
  }, [log]);

  const renderPatientInfo = (snapshot: SnapshotData | null, title = 'Thông tin bệnh nhân') => {
    if (!snapshot) return null;
    const user = snapshot.user;
    const patient = snapshot.patient;
    if (!user && !patient) return null;

    return (
      <div className="space-y-4">
        {title && <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">{title}</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {patient?.code && (
            <div>
              <p className="text-gray-500">Mã bệnh nhân</p>
              <p className="font-medium">{patient.code}</p>
            </div>
          )}
          {user?.fullName && (
            <div>
              <p className="text-gray-500">Họ và tên</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
          )}
          {user?.email && (
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          )}
          {user?.identityNumber && (
            <div>
              <p className="text-gray-500">CMND/CCCD</p>
              <p className="font-medium">{user.identityNumber}</p>
            </div>
          )}
          {user?.phoneNumber && (
            <div>
              <p className="text-gray-500">Số điện thoại</p>
              <p className="font-medium">{user.phoneNumber}</p>
            </div>
          )}
          {user?.gender && (
            <div>
              <p className="text-gray-500">Giới tính</p>
              <p className="font-medium">{user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : user.gender}</p>
            </div>
          )}
          {user?.dateOfBirth && (
            <div>
              <p className="text-gray-500">Ngày sinh</p>
              <p className="font-medium">{formatDateOnly(user.dateOfBirth)}</p>
            </div>
          )}
          {user?.age !== undefined && (
            <div>
              <p className="text-gray-500">Tuổi</p>
              <p className="font-medium">{user.age}</p>
            </div>
          )}
          {user?.address && (
            <div className="md:col-span-2">
              <p className="text-gray-500">Địa chỉ</p>
              <p className="font-medium">{user.address}</p>
            </div>
          )}
          {patient?.emergencyContact && (patient.emergencyContact.name || patient.emergencyContact.phone) && (
            <>
              <div>
                <p className="text-gray-500">Tên người thân</p>
                <p className="font-medium">{patient.emergencyContact.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">SĐT người thân</p>
                <p className="font-medium">{patient.emergencyContact.phone || '-'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMedicalRecordInfo = (snapshot: SnapshotData | null, title = 'Thông tin hồ sơ bệnh nhân') => {
    if (!snapshot) return null;
    const medicalRecord = snapshot.medical_record;
    if (!medicalRecord) return null;

    return (
      <div className="space-y-4">
        {title && <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">{title}</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {medicalRecord.record_code && (
            <div>
              <p className="text-gray-500">Mã hồ sơ</p>
              <p className="font-medium">{medicalRecord.record_code}</p>
            </div>
          )}
          {medicalRecord.blood_type && (
            <div>
              <p className="text-gray-500">Nhóm máu</p>
              <p className="font-medium">{medicalRecord.blood_type}</p>
            </div>
          )}
          {medicalRecord.allergies !== undefined && (
            <div>
              <p className="text-gray-500">Dị ứng</p>
              <p className="font-medium">{medicalRecord.allergies || '-'}</p>
            </div>
          )}
          {medicalRecord.chronic_conditions !== undefined && (
            <div>
              <p className="text-gray-500">Bệnh mạn tính</p>
              <p className="font-medium">{medicalRecord.chronic_conditions || '-'}</p>
            </div>
          )}
          {medicalRecord.current_medications !== undefined && (
            <div>
              <p className="text-gray-500">Thuốc đang dùng</p>
              <p className="font-medium">{medicalRecord.current_medications || '-'}</p>
            </div>
          )}
          {medicalRecord.medical_history !== undefined && (
            <div>
              <p className="text-gray-500">Tiền sử y khoa</p>
              <p className="font-medium">{medicalRecord.medical_history || '-'}</p>
            </div>
          )}
          {medicalRecord.clinical_notes !== undefined && (
            <div>
              <p className="text-gray-500">Ghi chú lâm sàng</p>
              <p className="font-medium">{medicalRecord.clinical_notes || '-'}</p>
            </div>
          )}
          {medicalRecord.recent_test_summary !== undefined && (
            <div>
              <p className="text-gray-500">Tóm tắt xét nghiệm gần đây</p>
              <p className="font-medium">{medicalRecord.recent_test_summary || '-'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEventContent = () => {
    if (!log || !eventType) return null;
    switch (eventType) {
      case 'CREATE_PATIENT': {
        const snapshot = getSnapshot(log.new_values);
        return renderPatientInfo(snapshot, 'Thông tin bệnh nhân được tạo');
      }
      case 'CREATE_MEDICAL': {
        const snapshot = getSnapshot(log.new_values);
        return renderMedicalRecordInfo(snapshot, 'Thông tin hồ sơ bệnh nhân được tạo');
      }
      case 'DELETE_PATIENT': {
        const snapshot = getSnapshot(log.old_values) || getSnapshot(log.new_values);
        return renderPatientInfo(snapshot, 'Thông tin bệnh nhân bị xóa');
      }
      case 'DELETE_MEDICAL': {
        const snapshot = getSnapshot(log.old_values) || getSnapshot(log.new_values);
        return renderMedicalRecordInfo(snapshot, 'Thông tin hồ sơ bệnh nhân bị xóa');
      }
      case 'UPDATE_PATIENT_EMERGENCY': {
        const oldSnapshot = getSnapshot(log.old_values);
        const newSnapshot = getSnapshot(log.new_values);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-r pr-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu cũ</h3>
                {renderPatientInfo(oldSnapshot, '')}
              </div>
              <div className="pl-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu mới</h3>
                {renderPatientInfo(newSnapshot, '')}
              </div>
            </div>
          </div>
        );
      }
      case 'UPDATE_MEDICAL': {
        const oldSnapshot = getSnapshot(log.old_values);
        const newSnapshot = getSnapshot(log.new_values);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-r pr-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu cũ</h3>
                {renderMedicalRecordInfo(oldSnapshot, '')}
              </div>
              <div className="pl-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2 mb-4">Dữ liệu mới</h3>
                {renderMedicalRecordInfo(newSnapshot, '')}
              </div>
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 mb-1">Giá trị cũ</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64">
                  {log.old_values ? JSON.stringify(log.old_values, null, 2) : '(trống)'}
                </pre>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giá trị mới</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64">
                  {log.new_values ? JSON.stringify(log.new_values, null, 2) : '(trống)'}
                </pre>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <OperatorInfoCard log={log} />
      <EventInfoCard log={log} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Dữ liệu thay đổi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderEventContent() || (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Giá trị cũ</Label>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
                  {log.old_values ? JSON.stringify(log.old_values, null, 2) : '(trống)'}
                </pre>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Giá trị mới</Label>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-64 mt-1">
                  {log.new_values ? JSON.stringify(log.new_values, null, 2) : '(trống)'}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventLogPatientDetailPage;
