
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../components/common/card';
import { 
  BarChart3, 
  Users, 
  TestTube2, 
  TrendingUp,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';

export function LabManagerDashboard() {
  const stats = [
    {
      title: 'Tổng XN hôm nay',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: TestTube2,
      color: 'bg-blue-500'
    },
    {
      title: 'Nhân viên đang làm',
      value: '15/18',
      change: '83%',
      trend: 'stable',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Thời gian trung bình',
      value: '2.3h',
      change: '-15min',
      trend: 'down',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Hiệu suất Lab',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const alerts = [
    { id: 1, type: 'error', message: 'Máy XN001 cần bảo trì khẩn cấp', time: '5 phút trước' },
    { id: 2, type: 'warning', message: 'Thiếu vật tư cho XN Hóa sinh', time: '15 phút trước' },
    { id: 3, type: 'info', message: 'Báo cáo tuần đã sẵn sàng', time: '30 phút trước' }
  ];

  const recentTests = [
    { id: 'XN001', patient: 'Nguyễn Văn A', type: 'Hóa sinh', status: 'completed', technician: 'BS. Minh' },
    { id: 'XN002', patient: 'Trần Thị B', type: 'Huyết học', status: 'in-progress', technician: 'KTV. Hoa' },
    { id: 'XN003', patient: 'Lê Văn C', type: 'Vi sinh', status: 'pending', technician: 'Chưa phân công' },
    { id: 'XN004', patient: 'Phạm Thị D', type: 'Miễn dịch', status: 'completed', technician: 'BS. Long' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Trưởng phòng Lab</h1>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change} so với hôm qua
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Cảnh báo & Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Xét nghiệm gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{test.id} - {test.patient}</p>
                    <p className="text-sm text-gray-600">{test.type} • {test.technician}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    test.status === 'completed' ? 'bg-green-100 text-green-800' :
                    test.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {test.status === 'completed' ? 'Hoàn thành' :
                     test.status === 'in-progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
            Hiệu suất Lab theo tuần
          </CardTitle>
          <CardDescription>
            Theo dõi hiệu suất và khối lượng công việc của phòng thí nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}