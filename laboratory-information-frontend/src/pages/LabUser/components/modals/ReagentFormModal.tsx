import React from 'react';
import type { Reagent } from '../../data/mockReagentsData';
import { useTranslation } from 'react-i18next';

interface ReagentFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  reagent: Partial<Reagent>;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof Reagent, value: any) => void;
}

const ReagentFormModal: React.FC<ReagentFormModalProps> = ({
  isOpen,
  isEdit,
  reagent,
  onClose,
  onSave,
  onChange,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isEdit ? t('reagent.formModal.editTitle') : t('reagent.formModal.addTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.name')} *
              </label>
              <input
                type="text"
                value={reagent.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.lotNumber')} *
              </label>
              <input
                type="text"
                value={reagent.lotNumber || ''}
                onChange={(e) => onChange('lotNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.manufacturer')}
              </label>
              <input
                type="text"
                value={reagent.manufacturer || ''}
                onChange={(e) => onChange('manufacturer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.receivedDate')}
              </label>
              <input
                type="date"
                value={reagent.receivedDate || ''}
                onChange={(e) => onChange('receivedDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.expiryDate')} *
              </label>
              <input
                type="date"
                value={reagent.expiryDate || ''}
                onChange={(e) => onChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.quantity')} *
              </label>
              <input
                type="number"
                min="1"
                value={reagent.quantity || ''}
                onChange={(e) => onChange('quantity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.storageLocation')}
              </label>
              <input
                type="text"
                value={reagent.storageLocation || ''}
                onChange={(e) => onChange('storageLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.status')}
              </label>
              <select
                value={reagent.status || 'Available'}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Available">{t('reagent.status.available')}</option>
                <option value="Low Stock">{t('reagent.status.lowStock')}</option>
                <option value="Expired">{t('reagent.status.expired')}</option>
                <option value="Depleted">{t('reagent.status.depleted')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reagent.formModal.notes')}
              </label>
              <textarea
                value={reagent.notes || ''}
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
              {t('reagent.cancel')}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('reagent.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReagentFormModal;

