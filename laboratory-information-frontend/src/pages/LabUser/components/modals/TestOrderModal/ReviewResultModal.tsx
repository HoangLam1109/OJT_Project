import React, { useState } from 'react';
import { Input } from '../../../../../components/common/input';
import { Label } from '../../../../../components/common/label';
import Button from '../../../../../components/common/button';
import { TestTube2, X, Upload, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { TestOrder, TestResult, Comment } from '../../../types/TestOrderTypes';

interface ReviewResultModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: Partial<TestResult>) => void;
}

const ReviewResultModal: React.FC<ReviewResultModalProps> = ({ order, isOpen, onClose, onSubmit }) => {
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin Test Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Mã:</span> {order.id}</div>
                <div><span className="font-medium">Bệnh nhân:</span> {order.patientName}</div>
                <div><span className="font-medium">Xét nghiệm:</span> {order.testName}</div>
                <div><span className="font-medium">Loại:</span> {order.testType}</div>
              </div>
            </div>

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

            <div>
              <Label className="text-sm font-medium mb-3 block">Bình luận</Label>
              
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

export default ReviewResultModal;

