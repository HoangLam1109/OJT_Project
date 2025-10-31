import React from 'react';
import { Eye, Edit2, ToggleLeft, PlayCircle, Wrench } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/common/table';
import type { Instrument } from '../data/mockInstrumentsData';

interface InstrumentTableProps {
  instruments: Instrument[];
  onView: (instrument: Instrument) => void;
  onEdit: (instrument: Instrument) => void;
  onToggleStatus: (instrument: Instrument) => void;
  onExecuteTest: (instrument: Instrument) => void;
  getStatusBadge: (status: string) => JSX.Element;
  formatDate: (dateString: string) => string;
  isLabUser: boolean;
}

const InstrumentTable: React.FC<InstrumentTableProps> = ({
  instruments,
  onView,
  onEdit,
  onToggleStatus,
  onExecuteTest,
  getStatusBadge,
  formatDate,
  isLabUser,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã Thiết Bị
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Thiết Bị
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Model
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số Seri
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Hiệu Chuẩn
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Cập Nhật
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instruments.map((instrument) => (
            <TableRow key={instrument.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {instrument.id}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {instrument.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {instrument.model}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {instrument.serial}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(instrument.status)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(instrument.lastCalibrationDate)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(instrument.updatedAt)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(instrument)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(instrument)}
                    className="text-green-600 hover:text-green-900 p-1 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(instrument)}
                    className={`p-1 rounded ${
                      instrument.status === 'Active'
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                    title={instrument.status === 'Active' ? 'Tắt' : 'Bật'}
                  >
                    <ToggleLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onExecuteTest(instrument)}
                    className="text-purple-600 hover:text-purple-900 p-1 rounded"
                    title="Thực hiện xét nghiệm"
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>
                  {isLabUser ? (
                    <button
                      disabled
                      className="text-gray-400 p-1 rounded cursor-not-allowed"
                      title="Không có quyền xóa thiết bị"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Xóa thiết bị"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstrumentTable;

