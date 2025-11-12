import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/common/dialog';
import Button from '../../../../components/common/button';
import Badge from '../../../../components/common/badge';
import { Clock, User, TestTube, Microscope, FlaskConical } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';

interface TestOrderDetailModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onDelete?: (order: TestOrder) => void; 
  onEdit?: (order: TestOrder) => void; 
  onClose: () => void;
}

const TestOrderDetailModal: React.FC<TestOrderDetailModalProps> = ({
  order,
  isOpen,
  onDelete,
  onEdit,
  onClose,
}) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
      case 'processing':
        return <Badge variant="default"><TestTube className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><TestTube className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Chi tiết Lệnh Xét nghiệm
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về lệnh xét nghiệm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-3 border-b">
              <div>
                <h3 className="font-mono text-lg font-semibold">{order.barcode || order._id}</h3>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Patient Information */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin Bệnh nhân
              </h4>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">Tên bệnh nhân:</span>
                  <p className="font-medium">{order.patient_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Mã bệnh nhân:</span>
                  <p className="font-mono text-sm">{order.patient_id}</p>
                </div>
              </div>
            </div>

            {/* Test Information */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Thông tin Xét nghiệm
              </h4>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">Loại xét nghiệm:</span>
                  <p className="font-medium">{order.test_type}</p>
                </div>
                {order.created_at && (
                  <div>
                    <span className="text-sm text-gray-600">Ngày tạo mẫu:</span>
                    <p className="font-medium">{order.created_at}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <span className="text-sm text-gray-600">Hạn hoàn thành:</span>
                  <p className="font-medium">{order.due_date}</p>
                </div>
              </div>
            </div>

            {/* Instrument Information */}
            {order.instrument && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Microscope className="w-4 h-4" />
                  Thông tin Thiết bị
                </h4>
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <span className="text-sm text-gray-600">Mã thiết bị:</span>
                    <p className="font-mono text-sm">{order.instrument.instrument_code}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tên thiết bị:</span>
                    <p className="font-medium">{order.instrument.instrument_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Loại thiết bị:</span>
                    <p className="font-medium">{order.instrument.instrument_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Nhà sản xuất:</span>
                    <p className="font-medium">{order.instrument.manufacturer}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge variant={order.instrument.status === 'Ready' ? 'default' : 'secondary'} className="mt-1">
                      {order.instrument.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Reagents Information */}
            {order.reagents && order.reagents.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  Thông tin Hóa chất
                </h4>
                <div className="pl-6">
                  <div className="space-y-2">
                    {order.reagents.map((reagent, index) => (
                      <div key={reagent.reagent_id || index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm text-gray-600">Tên hóa chất:</span>
                            <p className="font-medium">{reagent.reagent_name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Loại:</span>
                            <p className="font-medium">{reagent.reagent_type}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Số lượng đã dùng:</span>
                            <p className="font-medium">{reagent.quantity_used}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <Badge variant={reagent.status === 'Available' ? 'default' : 'secondary'} className="mt-1">
                              {reagent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Ghi chú:</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {order.notes?.trim() ? order.notes : 'Không có ghi chú'}
              </p>
            </div>


          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 sm:gap-2 pt-4 mt-2">

          {/* Nút cập nhật */}
          {onEdit && (
            <Button
              variant="default"
              onClick={() => {
                onEdit(order);
                onClose();
              }}
              className="px-6"
            >
              Cập nhật
            </Button>
          )}

          {/* Nút xóa */}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(order);
                onClose();
              }}
              className="px-6"
            >
              Xóa
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default TestOrderDetailModal;

