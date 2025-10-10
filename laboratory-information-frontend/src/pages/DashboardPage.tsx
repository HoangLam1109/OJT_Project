import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/common/card';
import Button from '../components/common/button';
import { 
  TestTube2, 
  Users, 
  UserPlus,  
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Plus,
  Search,
  Activity,
  Server
} from 'lucide-react';

export function DashboardPage() {
  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Tổng số xét nghiệm',
      value: '150',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TestTube2,
      color: 'blue'
    },
    {
      title: 'Người dùng hoạt động',
      value: '20',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Bệnh nhân mới',
      value: '50',
      change: '+8%',
      changeType: 'positive' as const,
      icon: UserPlus,
      color: 'purple'
    },
    {
      title: 'Kết quả chờ xử lý',
      value: '23',
      change: '-3%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'orange'
    }
  ];

  // Mock data for order status chart
  const orderStatusData = [
    { status: 'Chờ xử lý', count: 45, color: '#FEB95A' },
    { status: 'Đang thực hiện', count: 32, color: '#3B82F6' },
    { status: 'Hoàn thành', count: 73, color: '#10B981' },
    { status: 'Đã xác nhận', count: 28, color: '#8B5CF6' }
  ];

  // Mock data for flagged results
  const flaggedData = [
    { type: 'Bình thường', count: 85, color: '#10B981' },
    { type: 'Bất thường', count: 12, color: '#F59E0B' },
    { type: 'Nghiêm trọng', count: 3, color: '#EF4444' }
  ];

  // Mock alerts
  const alerts = [
    {
      id: '1',
      type: 'error',
      title: 'Instrument Sync Failed',
      description: 'Hematology analyzer connection lost',
      time: '5 minutes ago',
      action: 'Retry Sync'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Critical Flag Alert',
      description: 'Patient ID: P001 - WBC count critically high',
      time: '10 minutes ago',
      action: 'Review Result'
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'Chemistry analyzer maintenance in 2 hours',
      time: '1 hour ago',
      action: 'View Schedule'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại! Đây là tình hình hoạt động phòng thí nghiệm hôm nay.</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo xét nghiệm mới
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Tìm bệnh nhân
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(kpi.color)}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Order Status</CardTitle>
            <CardDescription>Distribution of test orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.count / Math.max(...orderStatusData.map(d => d.count))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flagged Results */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Results</CardTitle>
            <CardDescription>Critical and abnormal results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flaggedData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.type}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full text-sm">
                  View All Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Health Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>System Alerts</span>
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'error' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'error' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Activity className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{alert.time}</span>
                      <Button variant="outline" size="sm" className="text-xs">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Check Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-green-600" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>Service status and health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">IAM Service</p>
                    <p className="text-xs text-gray-600">All systems operational</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Patient Service</p>
                    <p className="text-xs text-gray-600">Running smoothly</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Test Order Service</p>
                    <p className="text-xs text-gray-600">HL7 sync issues detected</p>
                  </div>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  Error
                </span>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full text-sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Health Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest actions and updates in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: 'Dr. Sarah Wilson', action: 'validated test results for Patient P001', time: '2 minutes ago' },
              { user: 'Tech Mike Johnson', action: 'completed CBC test for Patient P002', time: '5 minutes ago' },
              { user: 'Admin John Doe', action: 'added new user account', time: '10 minutes ago' },
              { user: 'Lab Tech Lisa Chen', action: 'flagged abnormal result for Patient P003', time: '15 minutes ago' },
              { user: 'Dr. David Kim', action: 'reviewed AI flagged results', time: '20 minutes ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}