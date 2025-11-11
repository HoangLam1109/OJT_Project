import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import Button from '../../components/common/button';
import { Edit3, ArrowLeft, ArrowRight } from 'lucide-react';
import type { TestOrder } from './types/TestOrderTypes';
import { useAuthContext } from '../../hooks/useAuthContext';
import { patientService, type PatientOption } from '../../service/patientService';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '../../components/common/card';

const testTypes = [
  "Sinh hóa máu",
  "Huyết học tổng quát", 
  "Vi sinh",
  "Miễn dịch",
  "Nội tiết",
  "Ung thư học"
];
 
const CreateTestOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [formData, setFormData] = useState<Omit<TestOrder, '_id'>>({
    patient_id: '',
    patient_name: '',
    barcode: '',
    test_type: '',
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

  useEffect(() => {
    loadPatients();
  }, []);

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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};
    if (!formData.patient_id) newErrors.patient_id = 'Chọn bệnh nhân';
    if (!formData.test_type) newErrors.test_type = 'Chọn loại xét nghiệm';
    if (!formData.due_date) newErrors.due_date = 'Chọn hạn hoàn thành';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Navigate to select instruments page with form data
    navigate('/labuser/select-instruments', {
      state: {
        formData: {
          ...formData,
          barcode: generateBarcode(),
        }
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Step Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {/* Step 1 - Active */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-blue-100 animate-pulse">
                1
              </div>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-blue-700">Tạo lệnh</p>
              <p className="text-sm md:text-base text-gray-600 hidden md:block mt-1">xét nghiệm mới</p>
            </div>
          </div>

          {/* Connector 1 */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gray-300 rounded-full mt-[-32px]"></div>

          {/* Step 2 - Inactive */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-2xl border-2 border-gray-300">
              2
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-semibold text-gray-500">Chọn thiết bị</p>
            </div>
          </div>

          {/* Connector 2 */}
          <div className="flex-1 min-w-[50px] max-w-[100px] h-1.5 bg-gray-300 rounded-full mt-[-32px]"></div>

          {/* Step 3 - Inactive */}
          <div className="flex flex-col items-center gap-4 min-w-[140px]">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-2xl border-2 border-gray-300">
              3
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-semibold text-gray-500">Chọn thuốc thử</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/labuser?page=test-orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Tạo lệnh xét nghiệm mới
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Nhập thông tin để tạo lệnh mới
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Thông tin lệnh xét nghiệm</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNext} className="space-y-6">
            {/* Bệnh nhân và Loại xét nghiệm - cùng hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={formData.test_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, test_type: e.target.value }))}
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.test_type 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  {testTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.test_type && (
                  <p className="text-sm text-red-600">{errors.test_type}</p>
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
                rows={4}
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
                onClick={() => navigate('/labuser?page=test-orders')}
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
                Tiếp theo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTestOrderPage;

