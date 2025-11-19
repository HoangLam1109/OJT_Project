import React from 'react';
import { Eye, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/common/table';
import type { Reagent } from '../data/mockReagentsData';
import { getStatusBadge, formatDate, isExpired, isExpiringSoon, getRowClassName } from '../utils/reagentUtils';

interface ReagentTableProps {
  reagents: Reagent[];
  isLoading?: boolean;
  onView: (reagent: Reagent) => void;
  onEdit: (reagent: Reagent) => void;
  onDelete: (reagent: Reagent) => void;
}

const ReagentTable: React.FC<ReagentTableProps> = ({ reagents, isLoading = false, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Thuốc Thử
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hạn Dùng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số Lượng
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vị Trí Lưu
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Đang tải danh sách thuốc thử...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : reagents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Không có thuốc thử nào
              </TableCell>
            </TableRow>
          ) : (
            reagents.map((reagent) => (
            <TableRow key={reagent.id} className={getRowClassName(reagent)}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reagent.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center gap-1">
                  {isExpired(reagent.expiryDate) && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  {isExpiringSoon(reagent.expiryDate) && !isExpired(reagent.expiryDate) && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  {formatDate(reagent.expiryDate)}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-gray-500" />
                  {reagent.quantity}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(reagent.status)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reagent.storageLocation}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(reagent)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(reagent)}
                    className="text-green-600 hover:text-green-900 p-1 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(reagent)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Xóa thuốc thử"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReagentTable;

