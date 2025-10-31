import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '../../../components/common/card';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';

interface PatientToolbarProps {
  searchTerm: string;
  genderFilter: string;
  onSearchChange: (value: string) => void;
  onGenderFilterChange: (value: string) => void;
}

const PatientToolbar: React.FC<PatientToolbarProps> = ({
  searchTerm,
  genderFilter,
  onSearchChange,
  onGenderFilterChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">
              Tìm kiếm
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                type="text"
                placeholder="Tìm theo tên, mã BN, số điện thoại..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="md:w-48">
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Giới tính
            </Label>
            <select
              id="gender"
              value={genderFilter}
              onChange={(e) => onGenderFilterChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All">Tất cả</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientToolbar;

