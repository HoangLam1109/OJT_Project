import React from 'react';
import { Card, CardContent } from '../../../../components/common/card';
import { Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/common/skeleton';
import {useTranslation} from 'react-i18next'
interface TestOrderStatsCardsProps {
  stats: {
    pending: number;
    processing: number;
    completed: number;
  };
  loading?: boolean;
}

const TestOrderStatsCards: React.FC<TestOrderStatsCardsProps> = ({ stats, loading }) => {
  const {t} = useTranslation();
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 bg-white">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Chờ xử lý */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-4">{t('testOrder.pending')}</p>
              <p className="text-4xl font-semibold text-orange-500">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đang xử lý */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-4">{t('testOrder.processing')}</p>
              <p className="text-4xl font-semibold text-blue-500">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hoàn thành */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-4">{t('testOrder.completed')}</p>
              <p className="text-4xl font-semibold text-green-500">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestOrderStatsCards;

