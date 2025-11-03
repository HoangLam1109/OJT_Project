import React from 'react';
import Button from '../../../../components/common/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';

interface DeleteConfirmModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ order, isOpen, onClose, onConfirm }) => {
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
              Bạn có chắc chắn muốn xóa lệnh xét nghiệm <strong className="text-red-600">{order.id}</strong> của bệnh nhân <strong className="text-red-600">{order.patient_name}</strong>?
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

export default DeleteConfirmModal;

