import {useState} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import  Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { toast } from 'sonner';
import type { Reagent } from '../types/Reagent';

interface AddReagentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReagent: (reagent: Reagent) => void;
}

export function AddReagentDialog({ open, onOpenChange, onAddReagent }: AddReagentDialogProps) {
  const [newReagent, setNewReagent] = useState({
    name: '',
    lotNumber: '',
    manufacturer: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    storageTemp: '',
    minimumStock: '',
    costPerUnit: '',
    location: ''
  });

  const resetForm = () => {
    setNewReagent({
      name: '',
      lotNumber: '',
      manufacturer: '',
      quantity: '',
      unit: '',
      expiryDate: '',
      storageTemp: '',
      minimumStock: '',
      costPerUnit: '',
      location: ''
    });
  };

  const handleSubmit = () => {
    if (!newReagent.name || !newReagent.quantity || !newReagent.expiryDate) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    const reagent: Reagent = {
      id: `R${Date.now().toString().slice(-6)}`,
      name: newReagent.name,
      lotNumber: newReagent.lotNumber,
      manufacturer: newReagent.manufacturer,
      quantity: parseInt(newReagent.quantity),
      unit: newReagent.unit,
      expiryDate: newReagent.expiryDate,
      storageTemp: newReagent.storageTemp,
      status: 'available',
      minimumStock: parseInt(newReagent.minimumStock) || 10,
      costPerUnit: parseFloat(newReagent.costPerUnit) || 0,
      location: newReagent.location
    };

    onAddReagent(reagent);
    onOpenChange(false);
    resetForm();
    toast.success('Thêm hóa chất thành công');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm Hóa chất mới</DialogTitle>
          <DialogDescription>Nhập thông tin hóa chất để thêm vào kho</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên Hóa chất *</Label>
            <Input
              id="name"
              value={newReagent.name}
              onChange={(e) => setNewReagent({ ...newReagent, name: e.target.value })}
              placeholder="Nhập tên hóa chất"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lotNumber">Số lô</Label>
            <Input
              id="lotNumber"
              value={newReagent.lotNumber}
              onChange={(e) => setNewReagent({ ...newReagent, lotNumber: e.target.value })}
              placeholder="Nhập số lô"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Nhà sản xuất</Label>
            <Input
              id="manufacturer"
              value={newReagent.manufacturer}
              onChange={(e) => setNewReagent({ ...newReagent, manufacturer: e.target.value })}
              placeholder="Nhập nhà sản xuất"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Số lượng *</Label>
            <Input
              id="quantity"
              type="number"
              value={newReagent.quantity}
              onChange={(e) => setNewReagent({ ...newReagent, quantity: e.target.value })}
              placeholder="Nhập số lượng"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Đơn vị</Label>
            <Input
              id="unit"
              value={newReagent.unit}
              onChange={(e) => setNewReagent({ ...newReagent, unit: e.target.value })}
              placeholder="ml, L, kg..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
            <Input
              id="expiryDate"
              type="date"
              value={newReagent.expiryDate}
              onChange={(e) => setNewReagent({ ...newReagent, expiryDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storageTemp">Nhiệt độ bảo quản</Label>
            <Input
              id="storageTemp"
              value={newReagent.storageTemp}
              onChange={(e) => setNewReagent({ ...newReagent, storageTemp: e.target.value })}
              placeholder="2-8°C, Nhiệt độ phòng..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Vị trí</Label>
            <Input
              id="location"
              value={newReagent.location}
              onChange={(e) => setNewReagent({ ...newReagent, location: e.target.value })}
              placeholder="Tủ lạnh A1, Kệ B2..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Tồn kho tối thiểu</Label>
            <Input
              id="minimumStock"
              type="number"
              value={newReagent.minimumStock}
              onChange={(e) => setNewReagent({ ...newReagent, minimumStock: e.target.value })}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costPerUnit">Giá mỗi đơn vị (VNĐ)</Label>
            <Input
              id="costPerUnit"
              type="number"
              value={newReagent.costPerUnit}
              onChange={(e) => setNewReagent({ ...newReagent, costPerUnit: e.target.value })}
              placeholder="25000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Thêm Hóa chất</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}