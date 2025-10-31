import React from 'react';
import { mockTestOrders, mockAuditLogs } from '../../data/mockReagentsData';
import type { Reagent } from '../../data/mockReagentsData';
import { getStatusBadge, formatDate } from '../../utils/reagentUtils';

interface ReagentDetailModalProps {
  isOpen: boolean;
  reagent: Reagent | null;
  onClose: () => void;
}

const ReagentDetailModal: React.FC<ReagentDetailModalProps> = ({ isOpen, reagent, onClose }) => {
  if (!isOpen || !reagent) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Chi tiết thuốc thử: {reagent.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Mã thuốc thử:</span>
                  <span className="ml-2 text-gray-900">{reagent.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tên thuốc thử:</span>
                  <span className="ml-2 text-gray-900">{reagent.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Số lô:</span>
                  <span className="ml-2 text-gray-900">{reagent.lotNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Nhà sản xuất:</span>
                  <span className="ml-2 text-gray-900">{reagent.manufacturer || 'Không có'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày nhập:</span>
                  <span className="ml-2 text-gray-900">{formatDate(reagent.receivedDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày hết hạn:</span>
                  <span className="ml-2 text-gray-900">{formatDate(reagent.expiryDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Số lượng:</span>
                  <span className="ml-2 text-gray-900">{reagent.quantity}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Trạng thái:</span>
                  <span className="ml-2">{getStatusBadge(reagent.status)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vị trí lưu trữ:</span>
                  <span className="ml-2 text-gray-900">{reagent.storageLocation}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin sử dụng</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Đơn xét nghiệm liên kết:</span>
                  <div className="ml-2">
                    {reagent.usedInTests.length > 0 ? (
                      <div className="space-y-1">
                        {reagent.usedInTests.map(testId => {
                          const testOrder = mockTestOrders.find(order => order.id === testId);
                          return (
                            <div key={testId} className="text-sm text-gray-900">
                              {testId} - {testOrder?.patientName} ({testOrder?.testType})
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-500">Chưa có</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ghi chú:</span>
                  <p className="ml-2 text-gray-900 mt-1">
                    {reagent.notes || 'Không có ghi chú'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Lịch sử hoạt động gần đây</h3>
            <div className="space-y-2">
              {mockAuditLogs
                .filter(log => log.reagentId === reagent.id)
                .slice(0, 3)
                .map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800">{log.action}</span>
                      <span className="text-gray-600 ml-2">- {log.details}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReagentDetailModal;

