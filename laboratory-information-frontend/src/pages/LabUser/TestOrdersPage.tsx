import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/common/table';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ClipboardList,
  Clock,
  Activity,
  CheckCircle,
  X,
  TestTube2,
  Save,
  Upload,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

// Types
interface TestOrder {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  testName: string;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'Urgent' | 'Emergency';
  assignedTo?: string;
  notes?: string;
  samples: Sample[];
  createdBy: string;
  collectionDate: string;
  sampleType: string;
}

interface Sample {
  id: string;
  type: string;
  receivedDate: string;
  status: string;
}

interface TestResult {
  id: string;
  testOrderId: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  comment: string;
  attachments: string[];
  updatedAt: string;
  updatedBy: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

// Mock data
const initialTestOrders: TestOrder[] = [
  {
    id: "TO-2025-001",
    patientName: "Nguyễn Văn A",
    patientId: "P001",
    testType: "Sinh hóa máu",
    testName: "Đường huyết",
    createdAt: "2025-01-20",
    status: "Pending",
    priority: "Normal",
    assignedTo: "Lab User 1",
    notes: "Nhịn ăn 8h",
    createdBy: "Lab User 1",
    collectionDate: "2025-01-20",
    sampleType: "Máu tĩnh mạch",
    samples: [
      { id: "S001", type: "Máu tĩnh mạch", receivedDate: "2025-01-20", status: "Received" }
    ]
  },
  {
    id: "TO-2025-002",
    patientName: "Trần Thị B",
    patientId: "P002",
    testType: "Huyết học tổng quát",
    testName: "Tổng phân tích tế bào máu",
    createdAt: "2025-01-21",
    status: "Processing",
    priority: "Urgent",
    assignedTo: "Lab User 2",
    notes: "Mẫu máu tĩnh mạch",
    createdBy: "Lab User 2",
    collectionDate: "2025-01-21",
    sampleType: "Máu mao mạch",
    samples: [
      { id: "S002", type: "Máu mao mạch", receivedDate: "2025-01-21", status: "Processing" }
    ]
  },
  {
    id: "TO-2025-003",
    patientName: "Lê Văn C",
    patientId: "P003",
    testType: "Vi sinh",
    testName: "Cấy máu",
    createdAt: "2025-01-19",
    status: "Completed",
    priority: "Emergency",
    assignedTo: "Lab User 1",
    notes: "Sốt cao, nghi ngờ nhiễm trùng",
    createdBy: "Lab User 1",
    collectionDate: "2025-01-19",
    sampleType: "Máu động mạch",
    samples: [
      { id: "S003", type: "Máu động mạch", receivedDate: "2025-01-19", status: "Completed" }
    ]
  },
  {
    id: "TO-2025-004",
    patientName: "Phạm Thị D",
    patientId: "P004",
    testType: "Miễn dịch",
    testName: "Anti-HCV",
    createdAt: "2025-01-18",
    status: "Cancelled",
    priority: "Normal",
    assignedTo: "Lab User 3",
    notes: "Kiểm tra định kỳ",
    createdBy: "Lab User 3",
    collectionDate: "2025-01-18",
    sampleType: "Huyết thanh",
    samples: [
      { id: "S004", type: "Huyết thanh", receivedDate: "2025-01-18", status: "Cancelled" }
    ]
  }
];

// In-memory storage for dynamic data
let dynamicTestOrders: TestOrder[] = [...initialTestOrders];

// Mock API
const API = {
  fetchTestOrders: async (): Promise<TestOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dynamicTestOrders;
  },

  createTestOrder: async (orderData: Omit<TestOrder, 'id' | 'createdAt' | 'createdBy'>): Promise<{ success: boolean; id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate new ID
    const existingIds = dynamicTestOrders.map(o => parseInt(o.id.split('-')[2]));
    const maxId = Math.max(...existingIds, 0);
    const newId = `TO-2025-${String(maxId + 1).padStart(3, '0')}`;
    
    // Create new test order
    const newOrder: TestOrder = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Lab User',
      samples: orderData.samples || []
    };
    
    // Add to dynamic list
    dynamicTestOrders.push(newOrder);
    
    console.log(`[AUDIT] E_00016 | Test Order created by Lab User`, orderData);
    console.log(`[AUDIT] New test order added:`, newOrder);
    
    return { success: true, id: newId };
  },

  updateTestOrder: async (id: string, orderData: Partial<TestOrder>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and update test order
    const orderIndex = dynamicTestOrders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
      dynamicTestOrders[orderIndex] = {
        ...dynamicTestOrders[orderIndex],
        ...orderData
      };
    }
    
    console.log(`[AUDIT] E_00017 | Test Order updated by Lab User`, { id, orderData });
    return { success: true };
  },

  deleteTestOrder: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove from dynamic list
    const orderIndex = dynamicTestOrders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
      dynamicTestOrders.splice(orderIndex, 1);
    }
    
    console.log(`[AUDIT] E_00018 | Test Order deleted by Lab User`, { id });
    return { success: true };
  },

  updateTestResult: async (testOrderId: string, result: Partial<TestResult>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating test result:', { testOrderId, result });
    return { success: true };
  },

  addComment: async (testOrderId: string, comment: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Adding comment:', { testOrderId, comment });
    return { success: true };
  }
};

// Mock data
const mockPatients = [
  { id: "P001", fullName: "Nguyễn Văn A" },
  { id: "P002", fullName: "Trần Thị B" },
  { id: "P003", fullName: "Lê Văn C" },
  { id: "P004", fullName: "Phạm Thị D" },
  { id: "P005", fullName: "Hoàng Văn E" }
];

const mockTestTypes = [
  "Sinh hóa máu",
  "Huyết học tổng quát", 
  "Vi sinh",
  "Miễn dịch",
  "Nội tiết",
  "Ung thư học"
];

const mockSampleTypes = [
  "Máu tĩnh mạch",
  "Máu mao mạch", 
  "Máu động mạch",
  "Huyết thanh",
  "Nước tiểu",
  "Dịch não tủy"
];

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Processing: { color: 'bg-blue-100 text-blue-800', icon: Activity },
    Completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: X }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};


// Create/Edit Test Order Modal
const TestOrderFormModal: React.FC<{
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<TestOrder, 'id'> | Partial<TestOrder>) => void;
  isEdit: boolean;
}> = ({ order, isOpen, onClose, onSubmit, isEdit }) => {
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
    createdBy: 'Lab User'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order && isEdit) {
      setFormData({
        patientId: order.patientId,
        patientName: order.patientName,
        testType: order.testType,
        testName: order.testName,
        sampleType: order.sampleType,
        collectionDate: order.collectionDate,
        priority: order.priority,
        status: order.status,
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
        createdBy: 'Lab User'
      });
    }
  }, [order, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    // Validation
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

    const selectedPatient = mockPatients.find(p => p.id === formData.patientId);
    const orderData = {
      ...formData,
      patientName: selectedPatient?.fullName || formData.patientName,
      createdAt: isEdit ? order?.createdAt : new Date().toISOString().split('T')[0],
      samples: isEdit ? order?.samples : [{ 
        id: `S${Date.now()}`, 
        type: formData.sampleType, 
        receivedDate: formData.collectionDate, 
        status: 'Received' 
      }]
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
    const patient = mockPatients.find(p => p.id === patientId);
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
              {/* Patient Selection */}
              <div>
                <Label htmlFor="patient" className="text-sm font-medium">
                  Bệnh nhân <span className="text-red-500">*</span>
                </Label>
                <select
                  id="patient"
                  value={formData.patientId}
                  onChange={(e) => handlePatientChange(e.target.value)}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                    errors.patientId ? 'border-red-500 bg-red-50' : 'hover:border-gray-400'
                  }`}
                >
                  <option value="">Chọn bệnh nhân</option>
                  {mockPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} ({patient.id})
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
                )}
              </div>

              {/* Test Type */}
              <div>
                <Label htmlFor="testType" className="text-sm font-medium">
                  Loại xét nghiệm <span className="text-red-500">*</span>
                </Label>
                <select
                  id="testType"
                  value={formData.testType}
                  onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors ${
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

              {/* Test Name */}
              <div>
                <Label htmlFor="testName" className="text-sm font-medium">
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

              {/* Sample Type */}
              <div>
                <Label htmlFor="sampleType" className="text-sm font-medium">
                  Loại mẫu <span className="text-red-500">*</span>
                </Label>
                <select
                  id="sampleType"
                  value={formData.sampleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, sampleType: e.target.value }))}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.sampleType ? 'border-red-500' : ''
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

              {/* Collection Date */}
              <div>
                <Label htmlFor="collectionDate" className="text-sm font-medium">
                  Ngày lấy mẫu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                  className={errors.collectionDate ? 'border-red-500' : ''}
                />
                {errors.collectionDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.collectionDate}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  Độ ưu tiên
                </Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Normal">Bình thường</option>
                  <option value="Urgent">Khẩn cấp</option>
                  <option value="Emergency">Cấp cứu</option>
                </select>
              </div>

              {/* Status (only for edit) */}
              {isEdit && (
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Pending">Đang chờ</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Ghi chú
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 transition-colors resize-none"
                rows={3}
                placeholder="Nhập ghi chú..."
              />
            </div>

            {/* Actions */}
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

// Review Test Result Modal
const ReviewResultModal: React.FC<{
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Partial<TestResult>) => void;
}> = ({ order, isOpen, onClose, onSubmit }) => {
  const [resultData, setResultData] = useState({
    resultValue: '',
    unit: '',
    referenceRange: '',
    comment: ''
  });

  const [comments, setComments] = useState<Comment[]>([
    { id: '1', content: 'Mẫu chất lượng tốt', createdAt: '2025-01-20', createdBy: 'Lab User 1' },
    { id: '2', content: 'Kết quả trong giới hạn bình thường', createdAt: '2025-01-21', createdBy: 'Lab User 2' }
  ]);

  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resultData.resultValue.trim()) {
      toast.error('Vui lòng nhập kết quả xét nghiệm');
      return;
    }

    const result = {
      testOrderId: order?.id || '',
      resultValue: resultData.resultValue,
      unit: resultData.unit,
      referenceRange: resultData.referenceRange,
      comment: resultData.comment,
      attachments: attachments.map(f => f.name),
      updatedAt: new Date().toISOString(),
      updatedBy: 'Lab User'
    };

    onSubmit(result);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: String(Date.now()),
      content: newComment,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Lab User'
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error('Chỉ chấp nhận file PDF, JPG, PNG');
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TestTube2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Nhập kết quả xét nghiệm</h2>
                <p className="text-sm text-gray-500">Cập nhật kết quả và thông tin liên quan</p>
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
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin Test Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Mã:</span> {order.id}</div>
                <div><span className="font-medium">Bệnh nhân:</span> {order.patientName}</div>
                <div><span className="font-medium">Xét nghiệm:</span> {order.testName}</div>
                <div><span className="font-medium">Loại:</span> {order.testType}</div>
              </div>
            </div>

            {/* Result Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="resultValue" className="text-sm font-medium">
                  Kết quả <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="resultValue"
                  value={resultData.resultValue}
                  onChange={(e) => setResultData(prev => ({ ...prev, resultValue: e.target.value }))}
                  placeholder="Nhập kết quả"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-sm font-medium">
                  Đơn vị
                </Label>
                <Input
                  id="unit"
                  value={resultData.unit}
                  onChange={(e) => setResultData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="mg/dL, %, etc."
                />
              </div>
              <div>
                <Label htmlFor="referenceRange" className="text-sm font-medium">
                  Giới hạn bình thường
                </Label>
                <Input
                  id="referenceRange"
                  value={resultData.referenceRange}
                  onChange={(e) => setResultData(prev => ({ ...prev, referenceRange: e.target.value }))}
                  placeholder="70-100 mg/dL"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Ghi chú kết quả
              </Label>
              <textarea
                id="comment"
                value={resultData.comment}
                onChange={(e) => setResultData(prev => ({ ...prev, comment: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Nhập ghi chú về kết quả..."
              />
            </div>

            {/* Comments Section */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Bình luận</Label>
              
              {/* Add Comment */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Thêm bình luận..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddComment}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.createdBy} - {comment.createdAt}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="attachments" className="text-sm font-medium">
                File báo cáo (PDF, JPG, PNG)
              </Label>
              <div className="mt-1">
                <input
                  id="attachments"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {/* Attached Files */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <Label className="text-sm font-medium">Files đã chọn:</Label>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
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
                type="button" 
                variant="outline"
                className="px-6 py-2 border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Gửi để duyệt
              </Button>
              <Button 
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <TestTube2 className="w-4 h-4 mr-2" />
                Cập nhật kết quả
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ order, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Xác nhận xóa</h2>
              <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xóa lệnh xét nghiệm <strong className="text-red-600">{order.id}</strong> của bệnh nhân <strong className="text-red-600">{order.patientName}</strong>?
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Test Order Table Component
const TestOrderTable: React.FC<{
  orders: TestOrder[];
  onViewDetail: (order: TestOrder) => void;
  onEdit: (order: TestOrder) => void;
  onDelete: (order: TestOrder) => void;
  onReview: (order: TestOrder) => void;
}> = ({ orders, onViewDetail, onEdit, onDelete, onReview }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mã lệnh
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên bệnh nhân
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ngày tạo
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loại xét nghiệm
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Người tạo
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {order.id}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{order.patientName}</div>
                <div className="text-gray-500">{order.patientId}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {order.createdAt}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{order.testType}</div>
                <div className="text-gray-500">{order.testName}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {order.createdBy}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewDetail(order)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(order)}
                  className="text-green-600 hover:text-green-900"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {order.status === 'Completed' && (
                  <button
                    onClick={() => onReview(order)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Review kết quả"
                  >
                    <TestTube2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(order)}
                  className="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Main Component
const TestOrdersPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Role validation
  useEffect(() => {
    if (user && user.role !== 'LAB_USER') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadTestOrders();
  }, []);

  // Filter orders when search or status changes
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const loadTestOrders = async () => {
    try {
      setLoading(true);
      const data = await API.fetchTestOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Không thể tải danh sách lệnh xét nghiệm');
      console.error('Error loading test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setIsEdit(false);
    setFormModalOpen(true);
  };

  const handleEdit = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsEdit(true);
    setFormModalOpen(true);
  };

  const handleDelete = (order: TestOrder) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleReview = (order: TestOrder) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleViewDetail = (order: TestOrder) => {
    // For now, just show a toast. Can be expanded to a detail modal later
    toast.info(`Chi tiết lệnh xét nghiệm ${order.id}`);
  };

  const handleFormSubmit = async (orderData: Omit<TestOrder, 'id'> | Partial<TestOrder>) => {
    try {
      if (isEdit && selectedOrder) {
        await API.updateTestOrder(selectedOrder.id, orderData);
        toast.success('Đã cập nhật lệnh xét nghiệm thành công');
      } else {
        const result = await API.createTestOrder(orderData as Omit<TestOrder, 'id'>);
        toast.success(`Đã tạo lệnh xét nghiệm thành công với mã: ${result.id}`);
      }
      setFormModalOpen(false);
      await loadTestOrders(); // Reload data and wait for completion
    } catch (error) {
      toast.error('Không thể lưu lệnh xét nghiệm');
      console.error('Error saving test order:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    
    try {
      await API.deleteTestOrder(selectedOrder.id);
      toast.success(`Đã xóa lệnh xét nghiệm ${selectedOrder.id} thành công`);
      setDeleteModalOpen(false);
      await loadTestOrders(); // Reload data and wait for completion
    } catch (error) {
      toast.error('Không thể xóa lệnh xét nghiệm');
      console.error('Error deleting test order:', error);
    }
  };

  const handleReviewSubmit = async (result: Partial<TestResult>) => {
    try {
      await API.updateTestResult(result.testOrderId!, result);
      toast.success('Đã cập nhật kết quả xét nghiệm thành công');
      setReviewModalOpen(false);
      loadTestOrders(); // Reload data
    } catch (error) {
      toast.error('Không thể cập nhật kết quả xét nghiệm');
      console.error('Error updating test result:', error);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Lệnh Xét nghiệm</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các lệnh xét nghiệm</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleCreate} 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Lệnh Xét nghiệm
          </Button>
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">
              {filteredOrders.length} / {orders.length} lệnh xét nghiệm
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Tìm kiếm
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Tìm theo mã, tên bệnh nhân, loại xét nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Trạng thái
              </Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">Tất cả</option>
                <option value="Pending">Đang chờ</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Danh sách Lệnh Xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lệnh xét nghiệm</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Không tìm thấy lệnh xét nghiệm phù hợp với bộ lọc'
                  : 'Chưa có lệnh xét nghiệm nào được tạo'
                }
              </p>
            </div>
          ) : (
            <TestOrderTable
              orders={filteredOrders}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReview={handleReview}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TestOrderFormModal
        order={selectedOrder}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEdit={isEdit}
      />

      <ReviewResultModal
        order={selectedOrder}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      <DeleteConfirmModal
        order={selectedOrder}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TestOrdersPage;