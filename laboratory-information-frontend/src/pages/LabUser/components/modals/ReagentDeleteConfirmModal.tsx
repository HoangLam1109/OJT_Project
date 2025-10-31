import React from 'react';
import type { Reagent } from '../../data/mockReagentsData';

interface ReagentDeleteConfirmModalProps {
  isOpen: boolean;
  reagent: Reagent | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ReagentDeleteConfirmModal: React.FC<ReagentDeleteConfirmModalProps> = ({
  isOpen,
  reagent,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !reagent) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Xác nhận xóa thuốc thử
          </h2>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Bạn có chắc muốn xóa thuốc thử này?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{reagent.name}</p>
              <p className="text-sm text-gray-600">Số lô: {reagent.lotNumber}</p>
              <p className="text-sm text-gray-600">Mã: {reagent.id}</p>
            </div>
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReagentDeleteConfirmModal;

