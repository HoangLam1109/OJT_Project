import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Separator } from '../../components/common/separator';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../service/patientMedicalRecordService';
import { patientService, type PatientOption } from '../../service/patientService';

export default function PatientMedicalRecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<PatientMedicalRecord | null>(null);
  const [patient, setPatient] = useState<PatientOption | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await patientMedicalRecordService.getDetail(id);
        if (!mounted) return;
        setRecord(data);
        if (!data) setError('Không tìm thấy hồ sơ y tế');
        // Nối và tải thông tin bệnh nhân theo patient_id
        if (data?.patient_id) {
          try {
            const p = await patientService.getPatientById(data.patient_id);
            if (mounted) setPatient(p);
          } catch {
            // ignore enrich error
          }
        }
      } catch {
        if (mounted) setError('Không thể tải chi tiết hồ sơ');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('vi-VN') : '-';
  const formatDateOnly = (iso?: string) => iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';

  const warnIncomplete = useMemo(() => {
    if (!record) return '';
    const missingCore = !record.record_code || !record.patient_id;
    return missingCore ? 'Hồ sơ có thông tin thiếu, vui lòng kiểm tra lại.' : '';
  }, [record]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết hồ sơ y tế</h1>
          <p className="text-gray-600 mt-1">Chỉ người có quyền (bác sĩ, kỹ thuật viên phòng xét nghiệm) mới được truy cập.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/labuser/patient-medical-records')}>Quay lại danh sách</Button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && record && (
        <>
          {warnIncomplete && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-amber-700">{warnIncomplete}</div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin bệnh nhân */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bệnh nhân</CardTitle>
              <CardDescription>Thông tin định danh và liên hệ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Mã hồ sơ</div>
                  <div className="font-medium text-gray-900">{record.record_code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mã bệnh nhân</div>
                  <div className="font-medium text-gray-900">{patient?.patientCode || record.patient?.patient_code || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Họ và tên</div>
                  <div className="font-medium text-gray-900">{patient?.fullName || record.patient?.user?.fullName || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ngày sinh</div>
                  <div className="font-medium text-gray-900">{formatDateOnly(patient?.dateOfBirth || record.patient?.user?.dateOfBirth)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{patient?.email || record.patient?.user?.email || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium text-gray-900">{patient?.phoneNumber || record.patient?.user?.phoneNumber || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Địa chỉ</div>
                  <div className="font-medium text-gray-900 break-words">{patient?.address || record.patient?.user?.address || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tóm tắt y khoa */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin y khoa</CardTitle>
              <CardDescription>Tóm tắt lịch sử, bệnh mạn tính, dị ứng và thuốc hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Tiền sử y khoa</div>
                  <div className="font-medium text-gray-900 break-words">{record.medical_history || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Ghi chú lâm sàng</div>
                  <div className="font-medium text-gray-900 break-words">{record.clinical_notes || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Xét nghiệm và thiết bị gần đây */}
          <Card>
            <CardHeader>
              <CardTitle>Kết quả và thiết bị gần đây</CardTitle>
              <CardDescription>Tóm tắt gần đây, thiết bị và thuốc thử sử dụng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Tóm tắt xét nghiệm</div>
                  <div className="font-medium text-gray-900 break-words">{record.recent_test_summary || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Thiết bị sử dụng</div>
                  <div className="font-medium text-gray-900 break-words">{record.recent_instruments_used || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Thuốc thử (batch/lot)</div>
                  <div className="font-medium text-gray-900 break-words">{record.recent_reagents_info || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nhật ký và trạng thái hồ sơ */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
              <CardDescription>Thời gian và người thao tác gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Tạo lúc</div>
                  <div className="font-medium text-gray-900">{formatDate(record.created_at)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cập nhật lúc</div>
                  <div className="font-medium text-gray-900">{formatDate(record.updated_at)}</div>
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
                  <div className="md:col-span-2 text-sm text-red-600">Hồ sơ đã bị xóa khỏi hệ thống</div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


