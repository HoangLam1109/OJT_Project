import React from 'react';
import { X, FileDown } from 'lucide-react';
import { Label } from '../../../../components/common/label';
import Button from '../../../../components/common/button';
import TestResultStatusBadge from '../TestResultStatusBadge';
import type { TestResult } from '../../types/TestResultTypes';

interface TestResultDetailModalProps {
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const TestResultDetailModal: React.FC<TestResultDetailModalProps> = ({ result, isOpen, onClose }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Mã Test Order</Label>
                <p className="text-lg font-semibold">{result.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Trạng thái</Label>
                <div className="mt-1">
                  <TestResultStatusBadge status={result.status} />
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

            {result.result && (
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Kết quả xét nghiệm</Label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.result}</p>
                </div>
              </div>
            )}

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

export default TestResultDetailModal;

