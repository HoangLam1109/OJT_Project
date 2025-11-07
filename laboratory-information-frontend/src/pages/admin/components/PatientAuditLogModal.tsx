import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/button';
import { patientAuditLogService, type PatientAuditLog, type SnapshotNewValues, type SnapshotUser } from '../../../service/patientAuditLogService';
import { userService } from '../../../service/userService';
import { patientService, type PatientOption, viewPatientDetail } from '../../../service/patientService';

interface PatientAuditLogModalProps {
  isOpen: boolean;
  logId: string | null;
  onClose: () => void;
}

export const PatientAuditLogModal: React.FC<PatientAuditLogModalProps> = ({ isOpen, logId, onClose }) => {
  const [log, setLog] = useState<PatientAuditLog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<{ fullName?: string; email?: string; identityNumber?: string; phoneNumber?: string; gender?: string; dateOfBirth?: string; address?: string; patientCode?: string } | null>(null);
  const [deletedPatient, setDeletedPatient] = useState<PatientOption | null>(null);
  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isOpen || !logId) return;
      setLoading(true);
      setError(null);
      setLog(null);
      setCreatedUser(null);
      setDeletedPatient(null);
      try {
        const data = await patientAuditLogService.getAuditLogById(logId);
        if (!mounted) return;
        setLog(data);

        const action = String(data?.action ?? '').toUpperCase();
        // For CREATE, prioritize embedded snapshot data to work even if patient is deleted
        if (action === 'CREATE') {
          const nv = (data?.new_values as SnapshotNewValues | undefined);
          const snapshotUser = nv?.snapshot?.user as SnapshotUser | undefined;
          const patientCode = nv?.patient_code as string | undefined;
          if (snapshotUser) {
            setCreatedUser({
              fullName: snapshotUser.fullName,
              email: snapshotUser.email,
              identityNumber: snapshotUser.identityNumber,
              phoneNumber: snapshotUser.phoneNumber,
              gender: (snapshotUser.gender ?? '').toLowerCase(),
              dateOfBirth: snapshotUser.dateOfBirth,
              address: snapshotUser.address,
              patientCode,
            });
          } else {
            // Fallbacks if snapshot missing: try patient detail, then user service
            const patientId = data?.patient_id;
            const userId = nv?.user_id as string | undefined;
            let populated = false;
            if (patientId) {
              try {
                const detail = await viewPatientDetail(patientId);
                const u = detail?.user;
                if (mounted && u) {
                  setCreatedUser({
                    fullName: u.fullName,
                    email: u.email,
                    identityNumber: u.identityNumber,
                    phoneNumber: u.phoneNumber,
                    gender: (u.gender ?? '').toLowerCase(),
                    dateOfBirth: u.dateOfBirth,
                    address: u.address,
                    patientCode,
                  });
                  populated = true;
                }
              } catch {
                // continue to next fallback
              }
            }
            if (!populated && userId) {
              try {
                const u = await userService.getUserById(userId);
                if (mounted && u) {
                  setCreatedUser({
                    fullName: u.name,
                    email: u.email,
                    identityNumber: u.identify_number,
                    phoneNumber: u.phone_number,
                    gender: u.gender?.toLowerCase(),
                    dateOfBirth: u.date_of_birth,
                    address: u.address,
                    patientCode,
                  });
                }
              } catch {
                // ignore
              }
            }
          }
        }
        // For DELETE, fetch patient name by patient_id
        if (action === 'DELETE') {
          const patientId = data?.patient_id;
          if (patientId) {
            try {
              const p = await patientService.getPatientById(patientId);
              if (mounted) setDeletedPatient(p);
            } catch {
              // ignore enrich failure
            }
          }
        }
      } catch {
        if (mounted) setError('Không thể tải chi tiết nhật ký');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isOpen, logId]);

  const formattedDate = useMemo(() => (log?.performed_at ? new Date(log.performed_at).toLocaleString('vi-VN') : ''), [log?.performed_at]);

  const oldEmergency = useMemo(() => {
    const ov = log?.old_values as { emergency_contact?: { name?: string; phone?: string } } | undefined;
    return ov?.emergency_contact;
  }, [log?.old_values]);

  const newEmergency = useMemo(() => {
    const nv = log?.new_values as { emergency_contact?: { name?: string; phone?: string } } | undefined;
    return nv?.emergency_contact;
  }, [log?.new_values]);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết nhật ký</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="font-medium text-gray-900">{log._id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Thời gian</div>
                  <div className="font-medium text-gray-900">{formattedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Người thực hiện</div>
                  <div className="font-medium text-gray-900">{log.performed_by || 'Không rõ'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Hành động</div>
                  <div className="font-medium text-gray-900">{String(log.action)}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Nội dung</div>
                  <div className="font-medium text-gray-900 break-words">{log.event_message || '-'}</div>
                </div>
              </div>

              {/* Event log section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Nhật ký sự kiện</h3>
                {String(log.action).toUpperCase() === 'CREATE' && (
                  <div>
                    {/* ✅ Thêm dòng tiêu đề in đậm, màu đen */}
                    <div className="font-bold text-black mb-2">Bệnh nhân đã tạo</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Mã bệnh nhân</div>
                        <div className="font-medium text-gray-900">{createdUser?.patientCode || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Họ và tên</div>
                        <div className="font-medium text-gray-900">{createdUser?.fullName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">{createdUser?.email || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Số điện thoại</div>
                        <div className="font-medium text-gray-900">{createdUser?.phoneNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">CMND/CCCD</div>
                        <div className="font-medium text-gray-900">{createdUser?.identityNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Giới tính</div>
                        <div className="font-medium text-gray-900">{createdUser?.gender || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Ngày sinh</div>
                        <div className="font-medium text-gray-900">
                          {formatDateOnly(createdUser?.dateOfBirth)}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-500">Địa chỉ</div>
                        <div className="font-medium text-gray-900 break-words">{createdUser?.address || '-'}</div>
                      </div>
                    </div>
                  </div>
                )}


                {String(log.action).toUpperCase() === 'UPDATE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Dữ liệu cũ</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-gray-500">Tên liên hệ khẩn cấp</div>
                          <div className="font-medium text-gray-900">{oldEmergency?.name ?? '-'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Số điện thoại liên hệ</div>
                          <div className="font-medium text-gray-900">{oldEmergency?.phone ?? '-'}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Dữ liệu mới</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm text-gray-500">Tên liên hệ khẩn cấp</div>
                          <div className="font-medium text-gray-900">{newEmergency?.name ?? '-'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Số điện thoại liên hệ</div>
                          <div className="font-medium text-gray-900">{newEmergency?.phone ?? '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {String(log.action).toUpperCase() === 'DELETE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Bệnh nhân đã xóa</div>
                      <div className="font-medium text-gray-900">{deletedPatient?.fullName || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mã bệnh nhân</div>
                      <div className="font-medium text-gray-900">{deletedPatient?.patientCode || '-'}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};


