import React from 'react';
import { Card, CardContent } from '../../../components/common/card';
import { Clock, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface TestOrderStatsCardsProps {
  stats: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

const TestOrderStatsCards: React.FC<TestOrderStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="glass-strong hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chờ xử lý</p>
              <p className="text-2xl text-orange-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
              <p className="text-2xl text-blue-600">{stats.processing}</p>
            </div>
            <PlayCircle className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
              <p className="text-2xl text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thất bại</p>
              <p className="text-2xl text-red-600">{stats.failed}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestOrderStatsCards;

