import React, { useState, useEffect } from 'react';
import { X, User, FileText, Activity } from 'lucide-react';
import { Label } from '../../../../components/common/label';
import StatusBadge from '../StatusBadge';
import { PatientAPI, type Patient, type TestOrder, type AuditLog } from '../../data/mockPatientsData';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose }) => {
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      loadPatientDetails();
    }
  }, [isOpen, patient]);

  const loadPatientDetails = async () => {
    if (!patient) return;
    
    setLoading(true);
    try {
      const [orders, logs] = await Promise.all([
        PatientAPI.getPatientTestOrders(patient.id),
        PatientAPI.getPatientAuditLogs(patient.id)
      ]);
      setTestOrders(orders);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết bệnh nhân</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Mã bệnh nhân</Label>
                  <p className="text-lg font-semibold">{patient.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Họ và tên</Label>
                  <p className="text-lg">{patient.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                  <p className="text-lg">{patient.dateOfBirth}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                  <p className="text-lg">{patient.gender === 'Male' ? 'Nam' : patient.gender === 'Female' ? 'Nữ' : 'Khác'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Số điện thoại</Label>
                  <p className="text-lg">{patient.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-lg">{patient.email || 'Chưa cập nhật'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                  <p className="text-lg">{patient.address || 'Chưa cập nhật'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Tiền sử bệnh lý</Label>
                  <p className="text-lg">{patient.medicalHistory || 'Không có'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Lệnh xét nghiệm ({testOrders.length})
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : testOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chưa có lệnh xét nghiệm nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã lệnh</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại xét nghiệm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{order.testType}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{order.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Lịch sử hoạt động ({auditLogs.length})
              </h3>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chưa có hoạt động nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {log.performedBy} - {new Date(log.performedAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;

