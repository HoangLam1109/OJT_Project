import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/common/dialog';
import Button from '../../../components/common/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Instrument } from '../types/Instrument';
import { useTranslation } from 'react-i18next';

interface DeleteInstrumentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrument: Instrument | null;
  onConfirm: () => void;
}

export function DeleteInstrumentConfirmDialog({
  open,
  onOpenChange,
  instrument,
  onConfirm,
}: DeleteInstrumentConfirmDialogProps) {
  const { t } = useTranslation();
  if (!instrument) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {t('service.instrument.deleteDialog.title')}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {t('service.instrument.deleteDialog.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">{t('service.instrument.deleteDialog.infoWillBeDeleted')}</p>
                <p className="text-gray-700">
                  <strong>{instrument.instrument_name}</strong>
                </p>
                {instrument.instrument_type && (
                  <p className="text-gray-600 text-xs mt-1">
                    {t('service.instrument.instrumentType')}: {instrument.instrument_type}
                  </p>
                )}
                {instrument.location && (
                  <p className="text-gray-600 text-xs">
                    {t('service.instrument.location')}: {instrument.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('service.instrument.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('service.instrument.deleteDialog.deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

