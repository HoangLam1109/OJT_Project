import React from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';

interface TestOrderToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

const TestOrderToolbar: React.FC<TestOrderToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
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
        <Button 
          onClick={onCreateClick} 
          className="
            flex items-center 
            bg-gradient-to-r from-blue-500 to-indigo-600
            text-white font-medium shadow-md
            px-4 py-2 rounded-lg
            hover:from-blue-600 hover:to-indigo-700
            hover:shadow-lg
            focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
            transition-all duration-200 ease-in-out
          "
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn xét nghiệm bệnh nhân
        </Button>
      </div>
    </div>
  );
};

export default TestOrderToolbar;

