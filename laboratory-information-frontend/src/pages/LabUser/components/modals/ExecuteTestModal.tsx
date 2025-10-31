import React from 'react';
import type { Instrument } from '../../data/mockInstrumentsData';
import { mockTestOrders } from '../../data/mockInstrumentsData';

interface ExecuteTestModalProps {
  isOpen: boolean;
  instrument: Instrument | null;
  selectedTestOrder: string;
  onClose: () => void;
  onConfirm: () => void;
  onTestOrderChange: (testOrderId: string) => void;
}

const ExecuteTestModal: React.FC<ExecuteTestModalProps> = ({
  isOpen,
  instrument,
  selectedTestOrder,
  onClose,
  onConfirm,
  onTestOrderChange,
}) => {
  if (!isOpen || !instrument) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thực hiện xét nghiệm</h2>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Thiết bị: <span className="font-medium">{instrument.name}</span>
            </p>
            <p className="text-gray-600">
              Model: <span className="font-medium">{instrument.model}</span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn đơn xét nghiệm</label>
            <select
              value={selectedTestOrder}
              onChange={(e) => onTestOrderChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn đơn xét nghiệm --</option>
              {mockTestOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.patientName} ({order.testType})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedTestOrder}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xác nhận thực hiện
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecuteTestModal;

