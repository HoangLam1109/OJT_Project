import React from 'react';
import type { Instrument } from '../../data/mockInstrumentsData';
import { mockTestOrders, mockAuditLogs } from '../../data/mockInstrumentsData';

interface InstrumentDetailModalProps {
  isOpen: boolean;
  instrument: Instrument | null;
  onClose: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  formatDate: (dateString: string) => string;
}

const InstrumentDetailModal: React.FC<InstrumentDetailModalProps> = ({
  isOpen,
  instrument,
  onClose,
  getStatusBadge,
  formatDate,
}) => {
  if (!isOpen || !instrument) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thiết bị: {instrument.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Mã thiết bị:</span>
                  <span className="ml-2 text-gray-900">{instrument.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tên thiết bị:</span>
                  <span className="ml-2 text-gray-900">{instrument.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Model:</span>
                  <span className="ml-2 text-gray-900">{instrument.model}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Số seri:</span>
                  <span className="ml-2 text-gray-900">{instrument.serial}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Trạng thái:</span>
                  <span className="ml-2">{getStatusBadge(instrument.status)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày hiệu chuẩn:</span>
                  <span className="ml-2 text-gray-900">{formatDate(instrument.lastCalibrationDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày bảo trì tiếp theo:</span>
                  <span className="ml-2 text-gray-900">
                    {instrument.nextMaintenanceDate ? formatDate(instrument.nextMaintenanceDate) : 'Chưa xác định'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Kỹ thuật viên phụ trách:</span>
                  <span className="ml-2 text-gray-900">{instrument.assignedTechnician || 'Chưa phân công'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin bổ sung</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Ngày sử dụng cuối:</span>
                  <span className="ml-2 text-gray-900">
                    {instrument.lastUsedDate ? formatDate(instrument.lastUsedDate) : 'Chưa sử dụng'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Đơn xét nghiệm liên kết:</span>
                  <div className="ml-2">
                    {instrument.assignedTests.length > 0 ? (
                      <div className="space-y-1">
                        {instrument.assignedTests.map((testId) => {
                          const testOrder = mockTestOrders.find((order) => order.id === testId);
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
                  <p className="ml-2 text-gray-900 mt-1">{instrument.notes || 'Không có ghi chú'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Lịch sử hoạt động gần đây</h3>
            <div className="space-y-2">
              {mockAuditLogs
                .filter((log) => log.instrumentId === instrument.id)
                .slice(0, 3)
                .map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800">{log.action}</span>
                      <span className="text-gray-600 ml-2">- {log.details}</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
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

export default InstrumentDetailModal;

