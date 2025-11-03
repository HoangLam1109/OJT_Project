import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/common/table';
import { Eye, Edit, Trash2, TestTube2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { TestOrder } from '../types/TestOrderTypes';

interface TestOrderTableProps {
  orders: TestOrder[];
  onViewDetail: (order: TestOrder) => void;
  onEdit: (order: TestOrder) => void;
  onDelete: (order: TestOrder) => void;
  onReview: (order: TestOrder) => void;
}

const TestOrderTable: React.FC<TestOrderTableProps> = ({ 
  orders, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onReview 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mã lệnh
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên bệnh nhân
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ngày tạo
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loại xét nghiệm
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Người tạo
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {order.id}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{order.patient_name}</div>
                <div className="text-gray-500">{order.patient_id}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {order.created_at}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div className="font-medium">{order.testType}</div>
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {order.created_by}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewDetail(order)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(order)}
                  className="text-green-600 hover:text-green-900"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {order.status === 'Completed' && (
                  <button
                    onClick={() => onReview(order)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Review kết quả"
                  >
                    <TestTube2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(order)}
                  className="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TestOrderTable;

