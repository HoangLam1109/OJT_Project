import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/common/dialog';
import Button from '../../../components/common/button';

interface Props {
  open: boolean;
  itemName?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<Props> = ({ open, itemName = 'bệnh nhân', description, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description ?? `Bạn có chắc muốn xóa ${itemName}? Hành động này không thể hoàn tác.`}</DialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Hủy</Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">Xóa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
