import { Users, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent } from '../../../components/common/card';
import type { UserStatistics as UserStatisticsType } from '../types/ManagerTypes';
import { useTranslation } from 'react-i18next';
interface UserStatisticsProps {
  statistics: UserStatisticsType;
}

export function UserStatistics({ statistics }: UserStatisticsProps) {
  const { t } = useTranslation();
  const stats = [
    {
      title: t('manager.totalUsers'),
      value: statistics.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('manager.activeUsers'),
      value: statistics.active,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('manager.lockedUsers'),
      value: statistics.inactive,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                  {stat.title}
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} ml-6 shadow-lg`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

