import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import type { AdminUserStatistics } from '../types/AdminTypes';

interface AdminUserStatisticsProps {
  statistics: AdminUserStatistics;
}

export function AdminUserStatistics({ statistics }: AdminUserStatisticsProps) {
  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Quản trị viên',
      MANAGER: 'Quản lý',
      LAB_USER: 'Nhân viên Lab',
      SERVICE: 'Dịch vụ',
      USER: 'Người dùng',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
              <p className="text-2xl font-bold text-red-600">{statistics.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vai trò</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(statistics.byRole).length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Breakdown */}
      {Object.keys(statistics.byRole).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Phân bố theo vai trò</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(statistics.byRole).map(([role, count]) => (
                <div key={role} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{getRoleLabel(role)}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

