import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import Button from '../../../../components/common/button';
import { TestTube2, X, Save } from 'lucide-react';
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEdit ? 'Chỉnh sửa lệnh xét nghiệm' : 'Tạo lệnh xét nghiệm mới'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEdit
                    ? `Mã: ${order?.barcode || 'N/A'}`
                    : 'Nhập thông tin để tạo lệnh mới'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin barcode (chỉ hiển thị khi edit) */}
            {isEdit && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Label className="text-sm font-medium">Mã barcode</Label>
                <div className="mt-1 font-mono text-lg text-blue-700">
                  {formData.barcode || 'Chưa có'}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bệnh nhân */}
              <div>
                <Label htmlFor="patient">
                  Bệnh nhân <span className="text-red-500">*</span>
                </Label>
                <select
                  id="patient"
                  value={formData.patient_id}
                  onChange={(e) => handlePatientChange(e.target.value)}
                  disabled={loadingPatients || isSubmitting}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 ${
                    errors.patient_id ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500`}
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
                  <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>
                )}
              </div>

              {/* Loại xét nghiệm */}
              <div>
                <Label htmlFor="testType">
                  Loại xét nghiệm <span className="text-red-500">*</span>
                </Label>
                <select
                  id="testType"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  disabled={isSubmitting}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 ${
                    errors.testType ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500`}
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  {mockTestTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.testType && (
                  <p className="mt-1 text-sm text-red-600">{errors.testType}</p>
                )}
              </div>

              {/* Hạn hoàn thành */}
              <div>
                <Label htmlFor="dueDate">
                  Hạn hoàn thành <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  disabled={isSubmitting}
                  className={errors.due_date ? 'border-red-500' : ''}
                />
                {errors.due_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                )}
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                disabled={isSubmitting}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
                placeholder="Ghi chú thêm (tùy chọn)"
              />
            </div>

            {/* Nút */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
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