import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import Button from '../../../../components/common/button';
import { TestTube2, X, Save } from 'lucide-react';
import type { TestOrder, Sample } from '../../types/TestOrderTypes';
import { mockTestTypes, mockSampleTypes } from '../../data/mockTestOrdersData';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { patientService, type PatientOption } from '../../../../service/patientService';
import { toast } from 'sonner';

interface TestOrderFormModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<TestOrder, 'id'> | Partial<TestOrder>) => void;
  isEdit: boolean;
}

const TestOrderFormModal: React.FC<TestOrderFormModalProps> = ({ order, isOpen, onClose, onSubmit, isEdit }) => {
  const { user } = useAuthContext();
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    testType: '',
    testName: '',
    sampleType: '',
    collectionDate: '',
    priority: 'Normal' as 'Normal' | 'Urgent' | 'Emergency',
    status: 'Pending' as 'Pending' | 'Processing' | 'Completed' | 'Cancelled',
    notes: '',
    createdBy: user?.id || user?.name || 'Lab User'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    if (order && isEdit) {
      // Normalize priority and status to match formData types
      const normalizeStatus = (status: string): 'Pending' | 'Processing' | 'Completed' | 'Cancelled' => {
        const lower = status.toLowerCase();
        if (lower === 'processing') return 'Processing';
        if (lower === 'completed') return 'Completed';
        if (lower === 'cancelled') return 'Cancelled';
        return 'Pending';
      };

      const normalizePriority = (priority: string): 'Normal' | 'Urgent' | 'Emergency' => {
        const lower = priority.toLowerCase();
        if (lower === 'urgent') return 'Urgent';
        if (lower === 'emergency') return 'Emergency';
        return 'Normal';
      };

      setFormData({
        patientId: order.patientId,
        patientName: order.patientName,
        testType: order.testType,
        testName: order.testName || '',
        sampleType: order.sampleType || '',
        collectionDate: order.collectionDate || new Date().toISOString().split('T')[0],
        priority: normalizePriority(order.priority),
        status: normalizeStatus(order.status),
        notes: order.notes || '',
        createdBy: order.createdBy
      });
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        testType: '',
        testName: '',
        sampleType: '',
        collectionDate: new Date().toISOString().split('T')[0],
        priority: 'Normal',
        status: 'Pending',
        notes: '',
        createdBy: user?.id || user?.name || 'Lab User'
      });
    }
  }, [order, isEdit, user]);

  // Load patients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPatients();
    }
  }, [isOpen]);

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const patientsData = await patientService.getAllPatientsForDropdown();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Không thể tải danh sách bệnh nhân');
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const newErrors: Record<string, string> = {};
    if (!formData.patientId) newErrors.patientId = 'Vui lòng chọn bệnh nhân';
    if (!formData.testType) newErrors.testType = 'Vui lòng chọn loại xét nghiệm';
    if (!formData.testName) newErrors.testName = 'Vui lòng nhập tên xét nghiệm';
    if (!formData.sampleType) newErrors.sampleType = 'Vui lòng chọn loại mẫu';
    if (!formData.collectionDate) newErrors.collectionDate = 'Vui lòng chọn ngày lấy mẫu';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPatient = patients.find(p => p.id === formData.patientId);
    
    // Generate barcode if creating new order
    const generateBarcode = (): string => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `BC${timestamp}${random}`;
    };

    const orderData = {
      ...formData,
      patientName: selectedPatient?.fullName || formData.patientName,
      barcode: isEdit ? order?.barcode : generateBarcode(),
      createdAt: isEdit ? order?.createdAt : new Date().toISOString().split('T')[0],
      createdBy: user?.id || user?.name || formData.createdBy,
      samples: (isEdit ? order?.samples : [{ 
        id: `S${Date.now()}`, 
        type: formData.sampleType, 
        receivedDate: formData.collectionDate, 
        status: 'Received' 
      }]) as Sample[]
    };

    setIsSubmitting(true);
    try {
      await onSubmit(orderData);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patientId,
      patientName: patient?.fullName || '',
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEdit ? 'Chỉnh sửa Lệnh Xét nghiệm' : 'Tạo Lệnh Xét nghiệm mới'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEdit ? 'Cập nhật thông tin lệnh xét nghiệm' : 'Nhập thông tin để tạo lệnh xét nghiệm mới'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient" className="text-sm font-medium mb-2 block">
                  Bệnh nhân <span className="text-red-500">*</span>
                </Label>
                <select
                  id="patient"
                  value={formData.patientId}
                  onChange={(e) => handlePatientChange(e.target.value)}
                  disabled={loadingPatients}
                  className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors px-3 py-2 text-sm ${
                    errors.patientId ? 'border-red-500 bg-red-50' : 'hover:border-gray-400'
                  } ${loadingPatients ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {loadingPatients ? 'Đang tải danh sách bệnh nhân...' : 'Chọn bệnh nhân'}
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} {patient.patientCode ? `(${patient.patientCode})` : ''}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="testType" className="text-sm font-medium mb-2 block">
                  Loại xét nghiệm <span className="text-red-500">*</span>
                </Label>
                <select
                  id="testType"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors px-3 py-2 text-sm ${
                    errors.testType ? 'border-red-500 bg-red-50' : 'hover:border-gray-400'
                  }`}
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  {mockTestTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.testType && (
                  <p className="mt-1 text-sm text-red-600">{errors.testType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="testName" className="text-sm font-medium mb-2 block">
                  Tên xét nghiệm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="testName"
                  value={formData.testName}
                  onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                  className={`rounded-lg transition-colors ${errors.testName ? 'border-red-500 bg-red-50' : 'hover:border-gray-400'}`}
                  placeholder="Nhập tên xét nghiệm"
                />
                {errors.testName && (
                  <p className="mt-1 text-sm text-red-600">{errors.testName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sampleType" className="text-sm font-medium mb-2 block">
                  Loại mẫu <span className="text-red-500">*</span>
                </Label>
                <select
                  id="sampleType"
                  value={formData.sampleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, sampleType: e.target.value }))}
                  className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm transition-colors ${
                    errors.sampleType ? 'border-red-500 bg-red-50' : 'hover:border-gray-400'
                  }`}
                >
                  <option value="">Chọn loại mẫu</option>
                  {mockSampleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.sampleType && (
                  <p className="mt-1 text-sm text-red-600">{errors.sampleType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="collectionDate" className="text-sm font-medium mb-2 block">
                  Ngày lấy mẫu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                  className={errors.collectionDate ? 'border-red-500 bg-red-50' : ''}
                />
                {errors.collectionDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.collectionDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium mb-2 block">
                  Độ ưu tiên
                </Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm transition-colors hover:border-gray-400"
                >
                  <option value="Normal">Bình thường</option>
                  <option value="Urgent">Khẩn cấp</option>
                  <option value="Emergency">Cấp cứu</option>
                </select>
              </div>

              {isEdit && (
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Trạng thái
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm transition-colors hover:border-gray-400"
                  >
                    <option value="Pending">Đang chờ</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Ghi chú
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 transition-colors resize-none px-3 py-2 text-sm"
                rows={3}
                placeholder="Nhập ghi chú..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestOrderFormModal;

