import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/common/dialog';
import Button from '../../../../components/common/button';
import Badge from '../../../../components/common/badge';
import { Clock, User, Calendar, TestTube, UserCheck } from 'lucide-react';
import type { TestOrder } from '../../types/TestOrderTypes';

interface TestOrderDetailModalProps {
  order: TestOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTest?: (order: TestOrder) => void;
}

const TestOrderDetailModal: React.FC<TestOrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStartTest,
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
      case 'cancelled':
      case 'failed':
        return <Badge variant="destructive"><TestTube className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Emergency':
      case 'Urgent':
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      case 'Normal':
      case 'normal':
        return <Badge variant="default">Bình thường</Badge>;
      case 'Routine':
      case 'routine':
        return <Badge variant="secondary">Thường quy</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
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
                <h3 className="font-mono text-lg font-semibold">{order.barcode || order.id}</h3>
              </div>
              {getPriorityBadge(order.priority)}
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
                  <p className="font-medium">{order.patientName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Mã bệnh nhân:</span>
                  <p className="font-mono text-sm">{order.patientId}</p>
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
                {order.testName && (
                  <div>
                    <span className="text-sm text-gray-600">Tên xét nghiệm:</span>
                    <p className="font-medium">{order.testName}</p>
                  </div>
                )}
                {order.sampleType && (
                  <div>
                    <span className="text-sm text-gray-600">Loại mẫu:</span>
                    <p className="font-medium">{order.sampleType}</p>
                  </div>
                )}
                {order.collectionDate && (
                  <div>
                    <span className="text-sm text-gray-600">Ngày lấy mẫu:</span>
                    <p className="font-medium">{order.collectionDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Information */}
            {(order.assignedInstrument || order.assignedTo || order.startTime || order.progress !== undefined) && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Thông tin Xử lý
                </h4>
                <div className="grid grid-cols-2 gap-3 pl-6">
                  {order.assignedInstrument && (
                    <div>
                      <span className="text-sm text-gray-600">Thiết bị:</span>
                      <p className="font-medium">{order.assignedInstrument}</p>
                    </div>
                  )}
                  {order.assignedTo && (
                    <div>
                      <span className="text-sm text-gray-600">Người thực hiện:</span>
                      <p className="font-medium">{order.assignedTo}</p>
                    </div>
                  )}
                  {order.startTime && (
                    <div>
                      <span className="text-sm text-gray-600">Thời gian bắt đầu:</span>
                      <p className="font-medium">{order.startTime}</p>
                    </div>
                  )}
                  {order.estimatedCompletion && (
                    <div>
                      <span className="text-sm text-gray-600">Dự kiến hoàn thành:</span>
                      <p className="font-medium">{order.estimatedCompletion}</p>
                    </div>
                  )}
                  {order.progress !== undefined && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">Tiến độ:</span>
                      <p className="font-medium">{order.progress}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thông tin Thời gian
              </h4>
              <div className="grid grid-cols-2 gap-3 pl-6">
                {order.createdAt && (
                  <div>
                    <span className="text-sm text-gray-600">Ngày tạo:</span>
                    <p className="font-medium">{order.createdAt}</p>
                  </div>
                )}
                {order.createdBy && (
                  <div>
                    <span className="text-sm text-gray-600">Người tạo:</span>
                    <p className="font-medium">{order.createdBy}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Ghi chú:</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 sm:gap-2 pt-4 mt-2">
          <Button variant="outline" onClick={onClose} className="px-6">
            Đóng
          </Button>
          {order.status === 'Pending' || order.status === 'pending' ? (
            onStartTest && (
              <Button
                onClick={() => {
                  onStartTest(order);
                  onClose();
                }}
                className="px-6"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Bắt đầu xét nghiệm
              </Button>
            )
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestOrderDetailModal;

