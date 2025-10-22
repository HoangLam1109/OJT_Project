import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  FlaskConical,
  CheckCircle,
  FileText,
  X,
  Activity,
  Printer,
  FileDown,
  MessageSquare,
  Trash2
} from 'lucide-react';

// Types
interface TestResult {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  testName: string;
  completedAt: string;
  status: 'Completed' | 'Reviewed';
  result: string;
  unit?: string;
  referenceRange?: string;
  attachments?: string[];
  notes?: string;
  comments?: Comment[];
  updatedAt?: string;
  updatedBy?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

// Mock API
const API = {
  fetchTestResults: async (): Promise<TestResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: "TO-2025-010",
        patientName: "Lê Văn C",
        patientId: "P010",
        testType: "Sinh hóa nước tiểu",
        testName: "Protein niệu",
        completedAt: "2025-01-21",
        status: "Completed",
        result: "",
        unit: "mg/dL",
        referenceRange: "< 30 mg/dL",
        notes: "Mẫu nước tiểu buổi sáng",
        comments: [],
        updatedAt: "2025-01-21",
        updatedBy: "Lab User 1"
      },
      {
        id: "TO-2025-011",
        patientName: "Phạm Thị D",
        patientId: "P011",
        testType: "Huyết học",
        testName: "Tổng phân tích tế bào máu",
        completedAt: "2025-01-21",
        status: "Reviewed",
        result: "Bình thường",
        unit: "",
        referenceRange: "",
        attachments: ["result_001.pdf"],
        notes: "Kết quả trong giới hạn bình thường",
        comments: [
          { id: "1", content: "Mẫu chất lượng tốt", createdAt: "2025-01-21", createdBy: "Lab User 1" },
          { id: "2", content: "Kết quả trong giới hạn bình thường", createdAt: "2025-01-21", createdBy: "Lab User 2" }
        ],
        updatedAt: "2025-01-21",
        updatedBy: "Lab User 2"
      },
      {
        id: "TO-2025-012",
        patientName: "Nguyễn Văn E",
        patientId: "P012",
        testType: "Vi sinh",
        testName: "Cấy máu",
        completedAt: "2025-01-20",
        status: "Completed",
        result: "",
        unit: "",
        referenceRange: "",
        notes: "Nghi ngờ nhiễm trùng",
        comments: [],
        updatedAt: "2025-01-20",
        updatedBy: "Lab User 1"
      },
      {
        id: "TO-2025-013",
        patientName: "Trần Thị F",
        patientId: "P013",
        testType: "Miễn dịch",
        testName: "Anti-HCV",
        completedAt: "2025-01-19",
        status: "Reviewed",
        result: "Âm tính",
        unit: "",
        referenceRange: "",
        attachments: ["result_002.pdf"],
        notes: "Không phát hiện kháng thể HCV",
        comments: [
          { id: "3", content: "Kết quả âm tính", createdAt: "2025-01-19", createdBy: "Lab User 3" }
        ],
        updatedAt: "2025-01-19",
        updatedBy: "Lab User 3"
      }
    ];
  },

  updateTestResult: async (id: string, resultData: Partial<TestResult>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating test result:', { id, resultData });
    return { success: true };
  },

  addComment: async (testResultId: string, comment: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Adding comment:', { testResultId, comment });
    return { success: true };
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Deleting comment:', { commentId });
    return { success: true };
  },

  exportToPDF: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Exporting to PDF:', { id });
    return { success: true };
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    Completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Reviewed: { color: 'bg-gray-100 text-gray-800', icon: FileText }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Completed;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// Test Result Detail Modal
const TestResultDetailModal: React.FC<{
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ result, isOpen, onClose }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết Kết quả Xét nghiệm</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Mã Test Order</Label>
                <p className="text-lg font-semibold">{result.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Trạng thái</Label>
                <div className="mt-1">
                  <StatusBadge status={result.status} />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Tên bệnh nhân</Label>
                <p className="text-lg">{result.patientName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Mã bệnh nhân</Label>
                <p className="text-lg">{result.patientId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Loại xét nghiệm</Label>
                <p className="text-lg">{result.testType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Tên xét nghiệm</Label>
                <p className="text-lg">{result.testName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Ngày hoàn thành</Label>
                <p className="text-lg">{result.completedAt}</p>
              </div>
            </div>

            {/* Result */}
            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 block">Kết quả xét nghiệm</Label>
              {result.result ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.result}</p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">Chưa có kết quả xét nghiệm</p>
                </div>
              )}
            </div>

            {/* Attachments */}
            {result.attachments && result.attachments.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">File đính kèm</Label>
                <div className="space-y-2">
                  {result.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileDown className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown className="w-4 h-4 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {result.notes && (
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Ghi chú</Label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{result.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Test Result Form Modal (for new results)
const TestResultFormModal: React.FC<{
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, result: string, attachments: File[]) => void;
}> = ({ result, isOpen, onClose, onSubmit }) => {
  const [testResult, setTestResult] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ result?: string }>({});

  useEffect(() => {
    if (result) {
      setTestResult(result.result || '');
    }
  }, [result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { result?: string } = {};
    if (!testResult.trim()) {
      newErrors.result = 'Kết quả xét nghiệm là bắt buộc';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (result) {
      onSubmit(result.id, testResult.trim(), attachments);
      setTestResult('');
      setAttachments([]);
      setErrors({});
    }
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

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nhập kết quả xét nghiệm</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin Test Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Mã:</span> {result.id}</div>
                <div><span className="font-medium">Bệnh nhân:</span> {result.patientName}</div>
                <div><span className="font-medium">Xét nghiệm:</span> {result.testName}</div>
                <div><span className="font-medium">Loại:</span> {result.testType}</div>
              </div>
            </div>

            {/* Result Input */}
            <div>
              <Label htmlFor="result" className="text-sm font-medium">
                Kết quả xét nghiệm <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="result"
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.result ? 'border-red-500' : ''
                }`}
                rows={6}
                placeholder="Nhập kết quả xét nghiệm chi tiết..."
              />
              {errors.result && (
                <p className="mt-1 text-sm text-red-600">{errors.result}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="attachments" className="text-sm font-medium">
                File đính kèm (PDF, JPG, PNG)
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
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button type="submit">
                <FlaskConical className="w-4 h-4 mr-2" />
                Lưu kết quả
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Review Result Modal - Chỉ cho phép review khi status = "Completed"
const ReviewResultModal: React.FC<{
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, resultData: Partial<TestResult>) => void;
}> = ({ result, isOpen, onClose, onSubmit }) => {
  const [resultData, setResultData] = useState({
    result: '',
    unit: '',
    referenceRange: '',
    notes: ''
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (result) {
      setResultData({
        result: result.result || '',
        unit: result.unit || '',
        referenceRange: result.referenceRange || '',
        notes: result.notes || ''
      });
      setComments(result.comments || []);
    }
  }, [result]);

  // Validation cho acceptable ranges
  const validateResult = (value: string, testType: string): string | null => {
    const ranges: Record<string, { min: number; max: number; unit: string }> = {
      'Đường huyết': { min: 70, max: 100, unit: 'mg/dL' },
      'Protein niệu': { min: 0, max: 30, unit: 'mg/dL' },
      'Tổng phân tích tế bào máu': { min: 4.5, max: 5.5, unit: 'M/μL' },
      'Anti-HCV': { min: 0, max: 1, unit: 'S/CO' }
    };

    const range = ranges[testType];
    if (!range || !value) return null;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Giá trị phải là số';

    if (numValue < range.min || numValue > range.max) {
      return `Giá trị phải trong khoảng ${range.min}-${range.max} ${range.unit}`;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    
    if (!resultData.result.trim()) {
      errors.result = 'Vui lòng nhập kết quả xét nghiệm';
    } else {
      const validationError = validateResult(resultData.result, result?.testType || '');
      if (validationError) {
        errors.result = validationError;
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Audit log
    const auditLog = {
      action: 'REVIEW_TEST_RESULT',
      testOrderId: result!.id,
      oldValue: result!.result,
      newValue: resultData.result,
      updatedBy: 'Lab User',
      updatedAt: new Date().toISOString(),
      reason: 'Review process - E_00004, E_00008'
    };

    console.log('Audit Log:', auditLog);

    const updatedResult = {
      result: resultData.result,
      unit: resultData.unit,
      referenceRange: resultData.referenceRange,
      notes: resultData.notes,
      attachments: attachments.map(f => f.name),
      comments: comments,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Lab User',
      auditLog: auditLog
    };

    onSubmit(result!.id, updatedResult);
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

  if (!isOpen || !result) return null;

  // Chỉ cho phép review khi status = "Completed"
  if (result.status !== 'Completed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Không thể review</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Test Order đã được duyệt
              </h3>
              <p className="text-gray-500">
                Chỉ có thể review test order có trạng thái "Completed"
              </p>
              <div className="mt-4">
                <StatusBadge status={result.status} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Review kết quả xét nghiệm</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin Test Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Mã:</span> {result.id}</div>
                <div><span className="font-medium">Bệnh nhân:</span> {result.patientName}</div>
                <div><span className="font-medium">Xét nghiệm:</span> {result.testName}</div>
                <div><span className="font-medium">Loại:</span> {result.testType}</div>
                <div><span className="font-medium">Trạng thái:</span> 
                  <StatusBadge status={result.status} />
                </div>
                <div><span className="font-medium">Cập nhật lần cuối:</span> {result.updatedAt}</div>
              </div>
            </div>

            {/* Result Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="result" className="text-sm font-medium">
                  Kết quả <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="result"
                  value={resultData.result}
                  onChange={(e) => {
                    setResultData(prev => ({ ...prev, result: e.target.value }));
                    setValidationErrors(prev => ({ ...prev, result: '' }));
                  }}
                  className={validationErrors.result ? 'border-red-500' : ''}
                  placeholder="Nhập kết quả"
                />
                {validationErrors.result && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.result}</p>
                )}
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

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Ghi chú kết quả
              </Label>
              <textarea
                id="notes"
                value={resultData.notes}
                onChange={(e) => setResultData(prev => ({ ...prev, notes: e.target.value }))}
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
                        type="button"
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
              
              {/* Existing Attachments */}
              {result.attachments && result.attachments.length > 0 && (
                <div className="mt-3">
                  <Label className="text-sm font-medium mb-2 block">Files hiện tại:</Label>
                  <div className="space-y-2">
                    {result.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file}</span>
                        <Button variant="outline" size="sm">
                          <FileDown className="w-4 h-4 mr-1" />
                          Tải xuống
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Attached Files */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <Label className="text-sm font-medium">Files mới:</Label>
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
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button type="submit">
                <FlaskConical className="w-4 h-4 mr-2" />
                Gửi để duyệt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Test Result Table Component
const TestResultTable: React.FC<{
  results: TestResult[];
  onViewResult: (result: TestResult) => void;
  onReviewResult: (result: TestResult) => void;
  onExportPDF: (result: TestResult) => void;
}> = ({ results, onViewResult, onReviewResult, onExportPDF }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bệnh nhân
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại XN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày hoàn thành
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {result.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{result.patientName}</div>
                  <div className="text-gray-500">{result.patientId}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{result.testType}</div>
                  <div className="text-gray-500">{result.testName}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {result.completedAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={result.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewResult(result)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Xem kết quả"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {result.status === 'Completed' && (
                    <button
                      onClick={() => onReviewResult(result)}
                      className="text-green-600 hover:text-green-900"
                      title="Review kết quả"
                    >
                      <FlaskConical className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onExportPDF(result)}
                    className="text-purple-600 hover:text-purple-900"
                    title="In / Xuất PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const TestResultsPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadTestResults();
  }, []);

  // Filter results when search or status changes
  useEffect(() => {
    let filtered = results;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(result => result.status === statusFilter);
    }

    setFilteredResults(filtered);
  }, [results, searchTerm, statusFilter]);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      const data = await API.fetchTestResults();
      setResults(data);
    } catch (error) {
      toast.error('Không thể tải danh sách kết quả xét nghiệm');
      console.error('Error loading test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = (result: TestResult) => {
    setSelectedResult(result);
    setDetailModalOpen(true);
  };

  const handleReviewResult = (result: TestResult) => {
    setSelectedResult(result);
    setReviewModalOpen(true);
  };

  const handleSubmitResult = async (id: string, result: string, attachments: File[]) => {
    try {
      await API.updateTestResult(id, { result, attachments: attachments.map(f => f.name) });
      toast.success('Đã lưu kết quả xét nghiệm thành công');
      setResultModalOpen(false);
      loadTestResults(); // Reload data
    } catch (error) {
      toast.error('Không thể lưu kết quả xét nghiệm');
      console.error('Error saving result:', error);
    }
  };

  const handleReviewSubmit = async (id: string, resultData: Partial<TestResult>) => {
    try {
      await API.updateTestResult(id, resultData);
      toast.success('Đã gửi kết quả để duyệt thành công');
      setReviewModalOpen(false);
      loadTestResults(); // Reload data
    } catch (error) {
      toast.error('Không thể gửi kết quả để duyệt');
      console.error('Error reviewing result:', error);
    }
  };

  const handleExportPDF = async (result: TestResult) => {
    try {
      await API.exportToPDF(result.id);
      toast.success(`Đã xuất PDF cho test order ${result.id}`);
    } catch (error) {
      toast.error('Không thể xuất PDF');
      console.error('Error exporting PDF:', error);
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
          <h1 className="text-2xl font-semibold text-gray-900">Kết quả Xét nghiệm</h1>
          <p className="text-gray-600">Nhập và quản lý kết quả xét nghiệm đã hoàn thành</p>
        </div>
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-8 h-8 text-green-600" />
          <span className="text-sm text-gray-500">
            {filteredResults.length} / {results.length} kết quả xét nghiệm
          </span>
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
                <option value="Completed">Hoàn thành</option>
                <option value="Reviewed">Đã duyệt</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={loadTestResults}
                className="flex items-center"
              >
                <Activity className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="w-5 h-5 mr-2" />
            Danh sách Kết quả Xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có kết quả xét nghiệm</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Không tìm thấy kết quả xét nghiệm phù hợp với bộ lọc'
                  : 'Chưa có kết quả xét nghiệm nào'
                }
              </p>
            </div>
          ) : (
            <TestResultTable
              results={filteredResults}
              onViewResult={handleViewResult}
              onReviewResult={handleReviewResult}
              onExportPDF={handleExportPDF}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TestResultDetailModal
        result={selectedResult}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      <TestResultFormModal
        result={selectedResult}
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        onSubmit={handleSubmitResult}
      />

      <ReviewResultModal
        result={selectedResult}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default TestResultsPage;
