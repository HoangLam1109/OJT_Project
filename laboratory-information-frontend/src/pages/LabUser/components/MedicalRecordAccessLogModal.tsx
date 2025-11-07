import React, { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/button';
import { medicalRecordAccessLogService, type MedicalRecordAccessLog } from '../../../service/medicalRecordAccessLogService';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';

interface MedicalRecordAccessLogModalProps {
  isOpen: boolean;
  logId: string | null;
  onClose: () => void;
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

interface SnapshotData {
  medical_record?: MedicalRecordSnapshot;
  user?: UserSnapshot;
}

export const MedicalRecordAccessLogModal: React.FC<MedicalRecordAccessLogModalProps> = ({ isOpen, logId, onClose }) => {
  const [log, setLog] = useState<MedicalRecordAccessLog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isOpen || !logId) return;
      setLoading(true);
      setError(null);
      setLog(null);
      try {
        const data = await medicalRecordAccessLogService.getById(logId);
        if (!mounted) return;
        setLog(data);
        if (!data) setError('Không tìm thấy nhật ký');
      } catch {
        if (mounted) setError('Không thể tải chi tiết nhật ký');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isOpen, logId]);

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN') : '-');
  const formatDateOnly = (iso?: string) => {
    if (!iso) return '-';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const accessType = useMemo(() => String(log?.access_type ?? '').toUpperCase(), [log?.access_type]);

  // Extract snapshot data
  const getSnapshot = (values: unknown): SnapshotData | null => {
    if (!values || typeof values !== 'object') return null;
    const obj = values as Record<string, unknown>;
    const snapshot = obj.snapshot as SnapshotData | undefined;
    return snapshot || null;
  };

  const getMedicalRecord = (values: unknown): MedicalRecordSnapshot | null => {
    if (!values || typeof values !== 'object') return null;
    const obj = values as Record<string, unknown>;
    // Try snapshot first
    const snapshot = getSnapshot(values);
    if (snapshot?.medical_record) return snapshot.medical_record;
    // Fallback: check if values itself is a medical record (for DELETE case)
    if (obj.record_code || obj.patient_id) {
      return obj as MedicalRecordSnapshot;
    }
    return null;
  };

  const getUser = (values: unknown): UserSnapshot | null => {
    if (!values || typeof values !== 'object') return null;
    const snapshot = getSnapshot(values);
    return snapshot?.user || null;
  };

  // For CREATE and VIEW: use new_values or patient_snapshot
  const createViewRecord = useMemo(() => {
    if (accessType === 'CREATE' || accessType === 'VIEW') {
      const fromNew = getMedicalRecord(log?.new_values);
      const fromPatient = log?.patient_snapshot as { medical_record?: MedicalRecordSnapshot } | undefined;
      return fromNew || fromPatient?.medical_record || null;
    }
    return null;
  }, [log, accessType]);

  const createViewUser = useMemo(() => {
    if (accessType === 'CREATE' || accessType === 'VIEW') {
      const fromNew = getUser(log?.new_values);
      const fromPatient = log?.patient_snapshot as { user?: UserSnapshot } | undefined;
      return fromNew || fromPatient?.user || null;
    }
    return null;
  }, [log, accessType]);

  // For UPDATE: old and new
  const updateOldRecord = useMemo(() => getMedicalRecord(log?.old_values), [log?.old_values]);
  const updateNewRecord = useMemo(() => getMedicalRecord(log?.new_values), [log?.new_values]);
  const updateOldUser = useMemo(() => getUser(log?.old_values), [log?.old_values]);
  const updateNewUser = useMemo(() => getUser(log?.new_values), [log?.new_values]);

  // For DELETE: use old_values
  const deleteRecord = useMemo(() => getMedicalRecord(log?.old_values), [log?.old_values]);
  const deleteUser = useMemo(() => getUser(log?.old_values), [log?.old_values]);

  const renderMedicalRecordFields = (record: MedicalRecordSnapshot | null, user: UserSnapshot | null) => {
    if (!record) return null;
    return (
      <div className="space-y-4">
        {/* Patient Info */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin bệnh nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Họ và tên</div>
                  <div className="font-medium text-gray-900">{user.fullName || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{user.email || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số CMND/CCCD</div>
                  <div className="font-medium text-gray-900">{user.identityNumber || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium text-gray-900">{user.phoneNumber || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Giới tính</div>
                  <div className="font-medium text-gray-900">{user.gender || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ngày sinh</div>
                  <div className="font-medium text-gray-900">{formatDateOnly(user.dateOfBirth)}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Địa chỉ</div>
                  <div className="font-medium text-gray-900">{user.address || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Record Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin hồ sơ y tế</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Mã hồ sơ</div>
                <div className="font-medium text-gray-900">{record.record_code || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Nhóm máu</div>
                <div className="font-medium text-gray-900">{record.blood_type || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dị ứng</div>
                <div className="font-medium text-gray-900">{record.allergies || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Bệnh mạn tính</div>
                <div className="font-medium text-gray-900">{record.chronic_conditions || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Thuốc đang dùng</div>
                <div className="font-medium text-gray-900">{record.current_medications || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tiền sử y khoa</div>
                <div className="font-medium text-gray-900">{record.medical_history || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Ghi chú lâm sàng</div>
                <div className="font-medium text-gray-900">{record.clinical_notes || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Tóm tắt xét nghiệm gần đây</div>
                <div className="font-medium text-gray-900">{record.recent_test_summary || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Thiết bị sử dụng gần đây</div>
                <div className="font-medium text-gray-900">{record.recent_instruments_used || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Thuốc thử (batch/lot)</div>
                <div className="font-medium text-gray-900">{record.recent_reagents_info || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Người tạo</div>
                <div className="font-medium text-gray-900">{record.created_by || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Người cập nhật</div>
                <div className="font-medium text-gray-900">{record.updated_by || '-'}</div>
              </div>
              {record.is_deleted && (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Người xóa</div>
                    <div className="font-medium text-gray-900">{record.deleted_by || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Thời gian xóa</div>
                    <div className="font-medium text-gray-900">{formatDate(record.deleted_at)}</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-sm text-gray-500">Ngày tạo</div>
                <div className="font-medium text-gray-900">{formatDate(record.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Ngày cập nhật</div>
                <div className="font-medium text-gray-900">{formatDate(record.updated_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết nhật ký truy cập</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {loading && <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && log && (
            <>
              {/* Common section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin người thực hiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">ID</div>
                      <div className="font-medium text-gray-900 break-all">{log._id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Thời gian thực hiện</div>
                      <div className="font-medium text-gray-900">{formatDate(log.accessed_at)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Người thực hiện</div>
                      <div className="font-medium text-gray-900">{log.accessed_by_email || 'Không rõ'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Hành động</div>
                      <div className="font-medium text-gray-900">{log.access_type || '-'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event log section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Nhật ký sự kiện</h3>

                {/* CREATE */}
                {accessType === 'CREATE' && (
                  <div>
                    <div className="font-bold text-black mb-4">Hồ sơ đã tạo</div>
                    {renderMedicalRecordFields(createViewRecord, createViewUser)}
                  </div>
                )}

                {/* UPDATE */}
                {accessType === 'UPDATE' && (
                  <div>
                    <div className="font-bold text-black mb-4">Cập nhật hồ sơ</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-4">Dữ liệu cũ</div>
                        {renderMedicalRecordFields(updateOldRecord, updateOldUser)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-4">Dữ liệu mới</div>
                        {renderMedicalRecordFields(updateNewRecord, updateNewUser)}
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW */}
                {accessType === 'VIEW' && (
                  <div>
                    <div className="font-bold text-black mb-4">Hồ sơ đã xem</div>
                    {renderMedicalRecordFields(createViewRecord, createViewUser)}
                  </div>
                )}

                {/* DELETE */}
                {accessType === 'DELETE' && (
                  <div>
                    <div className="font-bold text-black mb-4">Hồ sơ đã xóa</div>
                    {renderMedicalRecordFields(deleteRecord, deleteUser)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 px-4 py-2 border-t border-gray-200">

          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};

