import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import Button from '@/components/common/button';
import { Label } from '@/components/common/label';
import { ArrowLeft, Eye, Clock, Hash } from 'lucide-react';
import { eventLogService, type EventLog } from '@/service/eventLogService';

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
  recent_instruments_used?: string;
  recent_reagents_info?: string;
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

const EventLogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<EventLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await eventLogService.getById(id);
        if (!mounted) return;
        if (!data) {
          setError('Không tìm thấy nhật ký');
        }
        setLog(data);
      } catch (e) {
        console.error('Failed to load event log detail', e);
        if (mounted) setError('Không thể tải chi tiết nhật ký');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString('vi-VN');
    } catch {
      return iso;
    }
  };

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
          {medicalRecord.recent_instruments_used !== undefined && (
            <div>
              <p className="text-gray-500">Thiết bị sử dụng gần đây</p>
              <p className="font-medium">{medicalRecord.recent_instruments_used || '-'}</p>
            </div>
          )}
          {medicalRecord.recent_reagents_info !== undefined && (
            <div>
              <p className="text-gray-500">Thuốc thử</p>
              <p className="font-medium">{medicalRecord.recent_reagents_info || '-'}</p>
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy nhật ký</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Chi tiết nhật ký sự kiện</h1>
            <p className="text-gray-600">Xem thông tin và dữ liệu thay đổi</p>
          </div>
        </div>
        <div />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Thông tin người thực hiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-gray-600">ID người dùng</Label>
              <p className="text-lg font-semibold mt-1">{log.operator_id || '-'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Họ và tên</Label>
              <p className="text-lg mt-1">{log.operator_name || '-'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <p className="text-lg mt-1">{log.operator_gmail || '-'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Thời gian thực hiện</Label>
              <p className="text-lg mt-1">{formatDate(log.occurred_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Thông tin sự kiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-gray-600">Mã sự kiện</Label>
              <p className="text-lg font-semibold mt-1">{log.event_code || '-'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Chức năng</Label>
              <p className="text-lg mt-1">{log.service_name || '-'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Hành động</Label>
              <p className="text-lg mt-1">{log.action || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600">Nội dung</Label>
              <p className="text-lg mt-1">{log.event_message || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

export default EventLogDetailPage;
