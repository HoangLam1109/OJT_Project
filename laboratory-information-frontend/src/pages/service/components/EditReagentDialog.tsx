import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import Button  from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { toast } from 'sonner';
import type { Reagent } from '../types/Reagent';

interface EditReagentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reagent: Reagent | null;
  onEditReagent: (reagent: Reagent) => void;
}

export function EditReagentDialog({ open, onOpenChange, reagent, onEditReagent }: EditReagentDialogProps) {
  const [formData, setFormData] = useState<Reagent | null>(null);

  useEffect(() => {
    if (reagent) {
      setFormData({ ...reagent });
    }
  }, [reagent]);

  // Clear form data when dialog is closed to avoid showing stale data
  useEffect(() => {
    if (!open) {
      setFormData(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onEditReagent(formData);
      toast.success('Cập nhật hóa chất thành công!');
      onOpenChange(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Hóa chất</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin hóa chất trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên hóa chất *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lotNumber">Lô số *</Label>
              <Input
                id="lotNumber"
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer">Nhà sản xuất *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Vị trí lưu trữ *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Đơn vị *</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mL">mL</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="units">units</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minimumStock">Mức tối thiểu *</Label>
              <Input
                id="minimumStock"
                type="number"
                value={formData.minimumStock}
                onChange={(e) => setFormData({ ...formData, minimumStock: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPerUnit">Giá mỗi đơn vị (VNĐ) *</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Hạn sử dụng *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storageTemp">Nhiệt độ bảo quản *</Label>
              <Input
                id="storageTemp"
                value={formData.storageTemp}
                onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
                placeholder="Ví dụ: 2-8°C"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Trạng thái *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Reagent['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Khả dụng</SelectItem>
                  <SelectItem value="low_stock">Sắp hết</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
