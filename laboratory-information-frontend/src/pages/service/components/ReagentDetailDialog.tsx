import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import Badge from '../../../components/common/badge';
import { Label } from '../../../components/common/label';
import { Beaker, Package, Calendar, Thermometer, MapPin, DollarSign } from 'lucide-react';
import type { Reagent } from '../types/Reagent';

interface ReagentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reagent: Reagent | null;
}

export function ReagentDetailDialog({ open, onOpenChange, reagent }: ReagentDetailDialogProps) {
  if (!reagent) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">Khả dụng</Badge>;
      case 'low_stock':
        return <Badge variant="secondary">Sắp hết</Badge>;
      case 'expired':
        return <Badge variant="destructive">Hết hạn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-800">
            <Beaker className="w-5 h-5 text-gray-600" />
            Chi tiết Hóa chất
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Thông tin chi tiết về hóa chất trong kho
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-gray-800">
          {/* Basic Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Mã hóa chất</Label>
                <p className="font-mono mt-1">{reagent.id}</p>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <div className="mt-1">{getStatusBadge(reagent.status)}</div>
              </div>
              <div>
                <Label>Tên hóa chất</Label>
                <p className="mt-1 font-medium">{reagent.name}</p>
              </div>
              <div>
                <Label>Lô số</Label>
                <p className="font-mono mt-1">{reagent.lotNumber}</p>
              </div>
            </div>
          </div>

          {/* Manufacturer & Location */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Nhà sản xuất & Vị trí</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  Nhà sản xuất
                </Label>
                <p className="mt-1">{reagent.manufacturer}</p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Vị trí lưu trữ
                </Label>
                <p className="mt-1">{reagent.location}</p>
              </div>
            </div>
          </div>

          {/* Quantity Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Thông tin tồn kho</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label>Số lượng hiện tại</Label>
                <p className="text-lg font-semibold mt-1">
                  {reagent.quantity} <span className="text-sm text-gray-500">{reagent.unit}</span>
                </p>
              </div>
              <div>
                <Label>Mức tối thiểu</Label>
                <p className="text-lg font-semibold mt-1">
                  {reagent.minimumStock} <span className="text-sm text-gray-500">{reagent.unit}</span>
                </p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Giá mỗi đơn vị
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {reagent.costPerUnit.toLocaleString('vi-VN')} <span className="text-sm text-gray-500">VNĐ</span>
                </p>
              </div>
            </div>
          </div>

          {/* Storage & Expiry */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Bảo quản & Hạn sử dụng</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  Nhiệt độ bảo quản
                </Label>
                <p className="mt-1">{reagent.storageTemp}</p>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Hạn sử dụng
                </Label>
                <p className="mt-1">{reagent.expiryDate}</p>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Giá trị kho</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label>Tổng giá trị</Label>
                <p className="text-lg font-semibold mt-1">
                  {(reagent.quantity * reagent.costPerUnit).toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* Warnings */}
          {reagent.status === 'low_stock' && (
            <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              ⚠️ <strong>Cảnh báo:</strong> Số lượng hóa chất sắp hết. Cần đặt hàng thêm.
            </div>
          )}
          {reagent.status === 'expired' && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg text-sm text-red-800">
              ❌ <strong>Lưu ý:</strong> Hóa chất đã hết hạn. Cần loại bỏ khỏi kho.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
