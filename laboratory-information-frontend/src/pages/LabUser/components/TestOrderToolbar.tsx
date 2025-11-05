import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../components/common/input';

interface TestOrderToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TestOrderToolbar: React.FC<TestOrderToolbarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Thực hiện Xét nghiệm</h2>
        <p className="text-gray-600">Khởi tạo và theo dõi quá trình xét nghiệm mẫu</p>
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
      </div>
    </div>
  );
};

export default TestOrderToolbar;

