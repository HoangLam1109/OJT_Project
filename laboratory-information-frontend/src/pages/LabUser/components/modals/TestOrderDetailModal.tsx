import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/common/dialog';
import Button from '../../../../components/common/button';
import Badge from '../../../../components/common/badge';
import { Clock, User, TestTube } from 'lucide-react';
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

  // const getPriorityBadge = (priority: string) => {
  //   switch (priority) {
  //     case 'Emergency':
  //     case 'Urgent':
  //     case 'urgent':
  //       return <Badge variant="destructive">Khẩn cấp</Badge>;
  //     case 'Normal':
  //     case 'normal':
  //       return <Badge variant="default">Bình thường</Badge>;
  //     case 'Routine':
  //     case 'routine':
  //       return <Badge variant="secondary">Thường quy</Badge>;
  //     default:
  //       return <Badge variant="default">{priority}</Badge>;
  //   }
  // };

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
                <h3 className="font-mono text-lg font-semibold">{order.barcode || order.id}</h3>
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
                  <p className="font-medium">{order.testType}</p>
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
                {order.created_at && (
                  <div>
                    <span className="text-sm text-gray-600">Tiến độ:</span>
                    <p className="font-medium">{order.processing}%</p>
                  </div>
                )}
              </div>
            </div>

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

