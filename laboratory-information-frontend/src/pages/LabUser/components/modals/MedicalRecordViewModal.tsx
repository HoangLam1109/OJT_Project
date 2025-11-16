import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Label } from '../../../../components/common/label';
import { patientMedicalRecordService, type PatientMedicalRecord } from '../../../../service/patientMedicalRecordService';
import { patientService, type PatientOption } from '../../../../service/patientService';

interface MedicalRecordViewModalProps {
  recordId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const MedicalRecordViewModal: React.FC<MedicalRecordViewModalProps> = ({ recordId, isOpen, onClose }) => {
  const [record, setRecord] = useState<PatientMedicalRecord | null>(null);
  const [patient, setPatient] = useState<PatientOption | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRecord = useCallback(async () => {
    if (!recordId) return;
    setLoading(true);
    try {
      const data = await patientMedicalRecordService.getDetail(recordId);
      setRecord(data);
      if (data?.patient_id) {
        try {
          const p = await patientService.getPatientById(data.patient_id);
          setPatient(p);
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.error('Error loading MR:', e);
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    if (isOpen && recordId) loadRecord();
  }, [isOpen, recordId, loadRecord]);

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('vi-VN') : '-';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết hồ sơ y tế</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : record ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Thông tin bệnh nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Mã hồ sơ</Label>
                    <p className="text-lg">{record.record_code}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Họ và tên</Label>
                    <p className="text-lg">{patient?.fullName || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ngày sinh</Label>
                    <p className="text-lg">{patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Số điện thoại</Label>
                    <p className="text-lg">{patient?.phoneNumber || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Thông tin y khoa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nhóm máu</Label>
                    <p className="text-lg">{record.blood_type || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Dị ứng</Label>
                    <p className="text-lg">{record.allergies || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Bệnh mạn tính</Label>
                    <p className="text-lg">{record.chronic_conditions || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Thuốc đang dùng</Label>
                    <p className="text-lg">{record.current_medications || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">Tiền sử y khoa</Label>
                    <p className="text-lg break-words">{record.medical_history || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">Ghi chú lâm sàng</Label>
                    <p className="text-lg break-words">{record.clinical_notes || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">Tóm tắt xét nghiệm gần đây</Label>
                    <p className="text-lg break-words">{record.recent_test_summary || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Thông tin hệ thống</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Tạo lúc</Label>
                    <p className="text-lg">{formatDate(record.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Cập nhật lúc</Label>
                    <p className="text-lg">{formatDate(record.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">Không tìm thấy hồ sơ y tế</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordViewModal;
