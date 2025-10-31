import React from 'react';
import type { Instrument } from '../../data/mockInstrumentsData';

interface InstrumentFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  instrument: Partial<Instrument>;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof Instrument, value: any) => void;
}

const InstrumentFormModal: React.FC<InstrumentFormModalProps> = ({
  isOpen,
  isEdit,
  instrument,
  onClose,
  onSave,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên thiết bị *</label>
              <input
                type="text"
                value={instrument.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                value={instrument.model || ''}
                onChange={(e) => onChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số seri *</label>
              <input
                type="text"
                value={instrument.serial || ''}
                onChange={(e) => onChange('serial', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={instrument.status || 'Active'}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Maintenance">Bảo trì</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu chuẩn</label>
              <input
                type="date"
                value={instrument.lastCalibrationDate || ''}
                onChange={(e) => onChange('lastCalibrationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bảo trì tiếp theo</label>
              <input
                type="date"
                value={instrument.nextMaintenanceDate || ''}
                onChange={(e) => onChange('nextMaintenanceDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ thuật viên phụ trách</label>
              <input
                type="text"
                value={instrument.assignedTechnician || ''}
                onChange={(e) => onChange('assignedTechnician', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                value={instrument.notes || ''}
                onChange={(e) => onChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentFormModal;

