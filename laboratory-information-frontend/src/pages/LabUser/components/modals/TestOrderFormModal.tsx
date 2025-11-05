import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import Button from '../../../../components/common/button';
import { Edit3, X, FileText } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';
import { mockTestTypes } from '../../data/mockTestOrdersData';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { patientService, type PatientOption } from '../../../../service/patientService';
import { toast } from 'sonner';

interface TestOrderFormModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called with a orderData that can be used directly to CREATE or UPDATE */
  onSubmit: (order: Omit<TestOrder, 'id'> | Partial<TestOrder>) => Promise<void>;
  isEdit: boolean;
}

/* --------------------------------------------------------------------- */
/*  Helper – normalise status coming from the API (lower-case variants)  */
/* --------------------------------------------------------------------- */
const normalizeStatus = (
  status: string
): 'Pending' | 'Processing' | 'Completed' => {
  const lower = status.toLowerCase();
  if (lower === 'processing') return 'Processing';
  if (lower === 'completed') return 'Completed';
  return 'Pending';
};
/* --------------------------------------------------------------------- */
const TestOrderFormModal: React.FC<TestOrderFormModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmit,
  isEdit,
}) => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState<Omit<TestOrder, 'id'>>({
    patient_id: '',
    patient_name: '',
    barcode: '',
    testType: '',
    status: 'Pending',
    created_by: user?.name ?? '',
    updated_by: user?.name ?? '',
    due_date: '',
    notes: '',
    is_deleted: false,
    deleted_at: '',
    deleted_by: '',
    processing: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  /* =================== RESET KHI MỞ MODAL =================== */
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setIsSubmitting(false);
      loadPatients();

      if (order && isEdit) {
        setFormData({
          patient_id: order.patient_id,
          patient_name: order.patient_name ?? '',
          barcode: order.barcode,
          testType: order.testType,
          status: normalizeStatus(order.status),
          created_by: order.created_by ?? user?.name ?? '',
          updated_by: user?.name ?? '',
          due_date: order.due_date?.split('T')[0] || '', // YYYY-MM-DD
          notes: order.notes ?? '',
          is_deleted: order.is_deleted ?? false,
          deleted_at: order.deleted_at ?? '',
          deleted_by: order.deleted_by ?? '',
          processing: order.processing ?? 0,
        });
      } else {
        // Tạo mới → reset
        setFormData({
          patient_id: '',
          patient_name: '',
          barcode: '',
          testType: '',
          status: 'Pending',
          created_by: user?.name ?? '',
          updated_by: user?.name ?? '',
          due_date: '',
          notes: '',
          is_deleted: false,
          deleted_at: '',
          deleted_by: '',
          processing: 0,
        });
      }
    }
  }, [isOpen, order, isEdit, user]);

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const data = await patientService.getAllPatientsForDropdown();
      setPatients(data);
    } catch (e) {
      toast.error('Không thể tải danh sách bệnh nhân');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handlePatientChange = (patient_id: string) => {
    const patient = patients.find(p => p.id === patient_id);
    setFormData(prev => ({
      ...prev,
      patient_id,
      patient_name: patient?.fullName ?? '',
    }));
  };

  const generateBarcode = (): string => {
    const ts = Date.now().toString(36);
    const rnd = Math.random().toString(36).substr(2, 5);
    return `BC-${ts}-${rnd}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};
    if (!formData.patient_id) newErrors.patient_id = 'Chọn bệnh nhân';
    if (!formData.testType) newErrors.testType = 'Chọn loại xét nghiệm';
    if (!formData.due_date) newErrors.due_date = 'Chọn hạn hoàn thành';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const submitData: any = {
      patient_id: formData.patient_id,
      patient_name: formData.patient_name,
      testType: formData.testType,
      due_date: formData.due_date,
      notes: formData.notes,
      created_by: user?.name || 'system',
      updated_by: user?.name ?? 'system',
      // Chỉ gửi barcode khi TẠO MỚI
      ...(isEdit ? {} : { barcode: generateBarcode() }),
      // Chỉ gửi status khi cần (thường không thay đổi ở form)
      ...(formData.status ? { status: formData.status } : {}),
    };

    try {
      await onSubmit(submitData);
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo lệnh thành công!');
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi hệ thống';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEdit ? 'Chỉnh sửa lệnh xét nghiệm' : 'Tạo lệnh xét nghiệm mới'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEdit
                    ? `Mã: ${order?.barcode || 'N/A'}`
                    : 'Nhập thông tin để tạo lệnh mới'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thông tin barcode (chỉ hiển thị khi edit) */}
            {isEdit && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Label className="text-sm font-medium">Mã barcode</Label>
                <div className="mt-1 font-mono text-lg text-blue-700">
                  {formData.barcode || 'Chưa có'}
                </div>
              </div>
            )}

            {/* Bệnh nhân và Loại xét nghiệm - cùng hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bệnh nhân */}
              <div className="space-y-2">
                <Label htmlFor="patient" className="text-sm font-medium">
                  Bệnh nhân <span className="text-red-500">*</span>
                </Label>
                <select
                  id="patient"
                  value={formData.patient_id}
                  onChange={(e) => handlePatientChange(e.target.value)}
                  disabled={loadingPatients || isSubmitting}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.patient_id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {loadingPatients ? 'Đang tải...' : 'Chọn bệnh nhân'}
                  </option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} {p.patientCode && `(${p.patientCode})`}
                    </option>
                  ))}
                </select>
                {errors.patient_id && (
                  <p className="text-sm text-red-600">{errors.patient_id}</p>
                )}
              </div>

              {/* Loại xét nghiệm */}
              <div className="space-y-2">
                <Label htmlFor="testType" className="text-sm font-medium">
                  Loại xét nghiệm <span className="text-red-500">*</span>
                </Label>
                <select
                  id="testType"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.testType 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  {mockTestTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.testType && (
                  <p className="text-sm text-red-600">{errors.testType}</p>
                )}
              </div>
            </div>

            {/* Hạn hoàn thành - full width */}
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Hạn hoàn thành <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.due_date 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              {errors.due_date && (
                <p className="text-sm text-red-600">{errors.due_date}</p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Ghi chú
              </Label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Ghi chú thêm (tùy chọn)"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {isSubmitting
                  ? 'Đang lưu...'
                  : isEdit
                    ? 'Cập nhật'
                    : 'Tạo lệnh'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestOrderFormModal;