import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Label } from '../../components/common/label';
import { ArrowLeft, User, FileText, Eye, Pencil, Trash2, FlaskConical } from 'lucide-react';
import { patientService, type PatientOption, type PatientDetailResponse, viewPatientDetail } from '../../service/patientService';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../service/patientMedicalRecordService';
import { testOrderService } from '../../service/testOrderService';
import { testResultService } from '../../service/testResultService';
import type { TestOrder } from '../LabUser/types/TestOrderTypes';
import type { TestResult } from '../LabUser/types/TestResultTypes';
import { toast } from 'sonner';
// Removed create medical record from detail page per requirement
import EditPatientMedicalRecord from './components/EditPatientMedicalRecord';
import { DeleteConfirmDialog } from '../admin/components/DeleteConfirmDialog';
import MedicalRecordViewModal from '@/pages/LabUser/components/modals/MedicalRecordViewModal';
import TestResultModal from '@/pages/LabUser/components/modals/TestResultModal';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientOption | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<PatientMedicalRecord[]>([]);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [selectedTestResult, setSelectedTestResult] = useState<TestResult | null>(null);
  const [testResultModalOpen, setTestResultModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
      const res = await patientMedicalRecordService.getAll({ page: 1, limit: 50, patientId: patient.id });
      setMedicalRecords(res.records || []);
    } catch (error) {
      toast.error('Không thể tải hồ sơ y tế');
      console.error('Error loading medical records:', error);
    }
  }, [patient]);

  const loadTestOrders = useCallback(async () => {
    if (!patient) return;
    try {
      const { orders } = await testOrderService.getAllTestOrders(1, 100);
      // Filter orders by patient_id
      const patientOrders = orders.filter(order => order.patient_id === patient.id);
      console.log('Patient orders:', patientOrders); // Debug log
      console.log('Patient ID:', patient.id); // Debug log
      setTestOrders(patientOrders);
    } catch (error) {
      console.error('Error loading test orders:', error);
      setTestOrders([]);
    }
  }, [patient]);

  useEffect(() => { loadPatient(); }, [loadPatient]);
  useEffect(() => { 
    if (patient) {
      loadMedicalRecords();
      loadTestOrders();
    }
  }, [patient, refreshKey, loadMedicalRecords, loadTestOrders]);

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

  const handleViewTestResult = async (testOrderId: string) => {
    try {
      const allResults = await testResultService.getAllTestResults();
      // Find the result matching the test order ID
      const result = allResults.find(r => r.testOrderId === testOrderId);
      if (result) {
        setSelectedTestResult(result);
        setTestResultModalOpen(true);
      } else {
        toast.info('Chưa có kết quả xét nghiệm');
      }
    } catch (error) {
      toast.error('Không thể tải kết quả xét nghiệm');
      console.error('Error loading test result:', error);
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Chưa cập nhật';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Chưa cập nhật';
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

      {/* Hồ sơ y tế */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Hồ sơ y tế
            </div>
            {medicalRecords.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setViewId(medicalRecords[0]._id)} title="Xem chi tiết">
                  <Eye className="w-4 h-4 mr-1" />Xem
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditId(medicalRecords[0]._id)} title="Chỉnh sửa">
                  <Pencil className="w-4 h-4 mr-1" />Sửa
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDeleteTarget({ id: medicalRecords[0]._id, name: medicalRecords[0].record_code })} title="Xóa">
                  <Trash2 className="w-4 h-4 mr-1" />Xóa
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medicalRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có hồ sơ y tế</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-gray-600">Nhóm máu</Label>
                <p className="text-lg mt-1">{medicalRecords[0].blood_type || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Dị ứng</Label>
                <p className="text-lg mt-1">
                  {medicalRecords[0].allergies 
                    ? (Array.isArray(medicalRecords[0].allergies) 
                        ? medicalRecords[0].allergies.join(', ') 
                        : medicalRecords[0].allergies)
                    : 'Không có'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Bệnh mạn tính</Label>
                <p className="text-lg mt-1">
                  {medicalRecords[0].chronic_conditions 
                    ? (Array.isArray(medicalRecords[0].chronic_conditions) 
                        ? medicalRecords[0].chronic_conditions.join(', ') 
                        : medicalRecords[0].chronic_conditions)
                    : 'Không có'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Thời gian tạo</Label>
                <p className="text-lg mt-1">{formatDate(medicalRecords[0].created_at)}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-600">Tiền sử y khoa</Label>
                <p className="text-lg mt-1">{medicalRecords[0].medical_history || 'Chưa cập nhật'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kết quả xét nghiệm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            Kết quả xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testOrders.length === 0 ? (
            <div className="text-center py-8">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có kết quả xét nghiệm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Tên thiết bị</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thuốc thử</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {testOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewTestResult(order._id)}
                      title="Click để xem kết quả xét nghiệm"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.instrument?.instrument_name || 'Chưa cập nhật'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.reagents && order.reagents.length > 0
                          ? order.reagents.map((r: { reagent_name: string }) => r.reagent_name).join(', ')
                          : 'Chưa cập nhật'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(order.created_at)}
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
      <TestResultModal 
        isOpen={testResultModalOpen} 
        onClose={() => {
          setTestResultModalOpen(false);
          setSelectedTestResult(null);
        }} 
        testResult={selectedTestResult} 
      />
      <DeleteConfirmDialog open={Boolean(deleteTarget)} itemName={deleteTarget?.name} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default PatientDetailPage;
