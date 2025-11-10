import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '../../../components/common/input';
import Button from '../../../components/common/button';

interface TestOrderToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateTestOrder?: () => void;
}

const TestOrderToolbar: React.FC<TestOrderToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onCreateTestOrder,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Danh sách Mẫu</h2>
        <p className="text-gray-600">Quản lý và theo dõi tiến độ xét nghiệm</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm mẫu..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {onCreateTestOrder && (
          <Button
            onClick={onCreateTestOrder}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Tạo đơn xét nghiệm
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestOrderToolbar;

