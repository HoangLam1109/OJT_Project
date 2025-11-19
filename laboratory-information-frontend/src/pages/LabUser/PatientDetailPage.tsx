import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Label } from '../../components/common/label';
import { ArrowLeft, User, FileText, Eye, Pencil, Trash2 } from 'lucide-react';
import { patientService, type PatientOption, type PatientDetailResponse, viewPatientDetail } from '../../service/patientService';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../service/patientMedicalRecordService';
import { toast } from 'sonner';
// Removed create medical record from detail page per requirement
import EditPatientMedicalRecord from './components/EditPatientMedicalRecord';
import { DeleteConfirmDialog } from '../admin/components/DeleteConfirmDialog';
import MedicalRecordViewModal from '@/pages/LabUser/components/modals/MedicalRecordViewModal';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientOption | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<PatientMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [patientDetail, setPatientDetail] = useState<PatientDetailResponse | null>(null);
  // Create button moved to patient list page
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadPatient = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const foundPatient = await patientService.getPatientById(id);
      setPatient(foundPatient);
      // Fetch detailed info (emergency_contact, patient_code, etc.)
      const detail = await viewPatientDetail(id);
      setPatientDetail(detail);
    } catch (error) {
      toast.error('Không thể tải thông tin bệnh nhân');
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadMedicalRecords = useCallback(async () => {
    if (!patient) return;
    try {
      setRecordsLoading(true);
      const res = await patientMedicalRecordService.getAll({ page: 1, limit: 50, patientId: patient.id });
      setMedicalRecords(res.records || []);
    } catch (error) {
      toast.error('Không thể tải hồ sơ y tế');
      console.error('Error loading medical records:', error);
    } finally {
      setRecordsLoading(false);
    }
  }, [patient]);

  useEffect(() => { loadPatient(); }, [loadPatient]);
  useEffect(() => { if (patient) loadMedicalRecords(); }, [patient, refreshKey, loadMedicalRecords]);

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('vi-VN') : '-';

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const ok = await patientMedicalRecordService.remove(deleteTarget.id);
      if (ok) {
        toast.success('Xóa hồ sơ thành công');
        setRefreshKey(k => k + 1);
      } else {
        toast.error('Xóa hồ sơ thất bại');
      }
    } catch {
      toast.error('Xóa hồ sơ thất bại');
    } finally {
      setDeleteTarget(null);
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

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh nhân</h3>
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
            <h1 className="text-2xl font-semibold text-gray-900">Chi tiết bệnh nhân</h1>
            <p className="text-gray-600">Thông tin và hồ sơ y tế của bệnh nhân</p>
          </div>
        </div>
        <div />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Thông tin bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-gray-600">Mã bệnh nhân</Label>
              <p className="text-lg font-semibold mt-1">{patient.patientCode || patient.id}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Họ và tên</Label>
              <p className="text-lg mt-1">{patient.fullName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Ngày sinh</Label>
              <p className="text-lg mt-1">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Giới tính</Label>
              <p className="text-lg mt-1">{patient.gender?.toLowerCase() === 'male' ? 'Nam' : patient.gender?.toLowerCase() === 'female' ? 'Nữ' : 'Khác'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Số điện thoại</Label>
              <p className="text-lg mt-1">{patient.phoneNumber || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <p className="text-lg mt-1">{patient.email || 'Chưa cập nhật'}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-600">Địa chỉ</Label>
              <p className="text-lg mt-1">{patient.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin người thân bệnh nhân */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Thông tin người thân bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-gray-600">Họ và tên người thân</Label>
              <p className="text-lg mt-1">{patientDetail?.emergency_contact?.name || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Số điện thoại người thân</Label>
              <p className="text-lg mt-1">{patientDetail?.emergency_contact?.phone || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Hồ sơ y tế ({medicalRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : medicalRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hồ sơ y tế</h3>
              <p className="text-gray-500 mb-4">Không có hồ sơ y tế cho bệnh nhân này</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã hồ sơ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian tạo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.record_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewId(record._id)} title="Xem chi tiết">
                            <Eye className="w-4 h-4 mr-1" />Xem
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditId(record._id)} title="Chỉnh sửa">
                            <Pencil className="w-4 h-4 mr-1" />Sửa
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDeleteTarget({ id: record._id, name: record.record_code })} title="Xóa">
                            <Trash2 className="w-4 h-4 mr-1" />Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

  {/* Create MR moved to list page */}
      <EditPatientMedicalRecord id={editId} open={Boolean(editId)} onOpenChange={(o) => { if (!o) setEditId(null); }} onUpdated={() => setRefreshKey(k => k + 1)} />
      <MedicalRecordViewModal recordId={viewId} isOpen={Boolean(viewId)} onClose={() => setViewId(null)} />
      <DeleteConfirmDialog open={Boolean(deleteTarget)} itemName={deleteTarget?.name} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default PatientDetailPage;
