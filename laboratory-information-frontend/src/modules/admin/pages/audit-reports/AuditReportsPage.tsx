import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../components/common/card';
import Button from '../../../../components/common/button';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import {
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  Users,
  TestTube2,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  service: 'IAM' | 'Patient' | 'Test Order';
  eventCode: string;
  action: string;
  user: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error';
}


// Mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: '1001',
    timestamp: '2024-10-08T10:30:00',
    service: 'IAM',
    eventCode: 'USER_LOGIN',
    action: 'Người dùng đăng nhập',
    user: 'admin@lab.com',
    details: 'Đăng nhập thành công từ trang quản trị',
    ipAddress: '192.168.1.100',
    severity: 'info'
  },
  {
    id: '1002',
    timestamp: '2024-10-08T10:25:00',
    service: 'Test Order',
    eventCode: 'ORDER_CREATED',
    action: 'Tạo yêu cầu xét nghiệm',
    user: 'technician@lab.com',
    details: 'Đã tạo yêu cầu T005 cho bệnh nhân P001',
    ipAddress: '192.168.1.101',
    severity: 'info'
  },
  {
    id: '1003',
    timestamp: '2024-10-08T10:20:00',
    service: 'Patient',
    eventCode: 'PATIENT_UPDATED',
    action: 'Cập nhật thông tin bệnh nhân',
    user: 'labuser@lab.com',
    details: 'Cập nhật thông tin liên hệ cho bệnh nhân P002',
    ipAddress: '192.168.1.102',
    severity: 'info'
  },
  {
    id: '1004',
    timestamp: '2024-10-08T10:15:00',
    service: 'Test Order',
    eventCode: 'RESULT_FLAGGED',
    action: 'Kết quả được đánh dấu nguy hiểm',
    user: 'system',
    details: 'AI phát hiện số lượng WBC bất thường cho bệnh nhân P003',
    ipAddress: '127.0.0.1',
    severity: 'warning'
  },
  {
    id: '1005',
    timestamp: '2024-10-08T10:10:00',
    service: 'IAM',
    eventCode: 'USER_FAILED_LOGIN',
    action: 'Đăng nhập thất bại',
    user: 'unknown@lab.com',
    details: 'Thông tin đăng nhập không hợp lệ',
    ipAddress: '192.168.1.105',
    severity: 'error'
  },
  {
    id: '1006',
    timestamp: '2024-10-08T10:05:00',
    service: 'Test Order',
    eventCode: 'RESULT_VALIDATED',
    action: 'Xác nhận kết quả xét nghiệm',
    user: 'manager@lab.com',
    details: 'Đã xác nhận kết quả cho yêu cầu T003',
    ipAddress: '192.168.1.103',
    severity: 'info'
  }
];

export function AuditReportsPage() {
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.eventCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService === 'all' || log.service === selectedService;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const logDate = new Date(log.timestamp);
      if (dateFrom) {
        matchesDate = matchesDate && logDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && logDate <= new Date(dateTo + 'T23:59:59');
      }
    }
    
    return matchesSearch && matchesService && matchesSeverity && matchesDate;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'IAM':
        return <Users className="h-4 w-4" />;
      case 'Patient':
        return <Users className="h-4 w-4" />;
      case 'Test Order':
        return <TestTube2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const handleExportLogs = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    const filename = `nhat_ky_${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Đang xuất ${filteredLogs.length} nhật ký dưới dạng ${format.toUpperCase()}:`, filename);
    alert(`Đã xuất ${filteredLogs.length} nhật ký dưới dạng ${format.toUpperCase()}`);
  };

  const handleGenerateReport = () => {
    // Mock report generation
    console.log('Đang tạo báo cáo kiểm toán tổng hợp...');
    alert('Đã tạo báo cáo kiểm toán tổng hợp thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật ký & Báo cáo</h1>
          <p className="text-gray-600 mt-1">Theo dõi hoạt động hệ thống và tạo báo cáo tuân thủ</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleGenerateReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Tạo báo cáo
          </Button>
          <Button onClick={() => handleExportLogs('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
          <Button onClick={() => handleExportLogs('pdf')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng sự kiện</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sự kiện IAM</p>
                <p className="text-2xl font-bold text-blue-600">
                  {auditLogs.filter(log => log.service === 'IAM').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sự kiện xét nghiệm</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs.filter(log => log.service === 'Test Order').length}
                </p>
              </div>
              <TestTube2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lỗi/Cảnh báo</p>
                <p className="text-2xl font-bold text-red-600">
                  {auditLogs.filter(log => log.severity === 'error' || log.severity === 'warning').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Tìm kiếm nhật ký..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <Label htmlFor="service">Dịch vụ</Label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả dịch vụ</option>
                <option value="IAM">IAM</option>
                <option value="Patient">Bệnh nhân</option>
                <option value="Test Order">Xét nghiệm</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <Label htmlFor="severity">Mức độ</Label>
              <select
                id="severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="info">Thông tin</option>
                <option value="warning">Cảnh báo</option>
                <option value="error">Lỗi nghiêm trọng</option>
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Từ ngày</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">Đến ngày</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredLogs.length} trên {auditLogs.length} sự kiện
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedService('all');
                setSelectedSeverity('all');
                setDateFrom('');
                setDateTo('');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Đặt lại bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký hệ thống</CardTitle>
          <CardDescription>Nhật ký hoạt động hệ thống chi tiết với khả năng lọc và xuất báo cáo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Thời gian</th>
                  <th className="text-left p-3 font-medium text-gray-900">Dịch vụ</th>
                  <th className="text-left p-3 font-medium text-gray-900">Sự kiện</th>
                  <th className="text-left p-3 font-medium text-gray-900">Người dùng</th>
                  <th className="text-left p-3 font-medium text-gray-900">Chi tiết</th>
                  <th className="text-left p-3 font-medium text-gray-900">Mức độ</th>
                  <th className="text-center p-3 font-medium text-gray-900">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getServiceIcon(log.service)}
                        <span className="text-sm font-medium text-gray-900">{log.service}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-gray-600">{log.eventCode}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{log.user}</p>
                        <p className="text-gray-600">{log.ipAddress}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-gray-900 max-w-xs truncate">{log.details}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert(`Chi tiết nhật ký #${log.id}\n\nNội dung chi tiết:\n${log.details}\n\nThời gian: ${log.timestamp}\nĐịa chỉ IP: ${log.ipAddress}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhật ký</h3>
              <p className="text-gray-600">Hãy điều chỉnh bộ lọc để xem thêm kết quả.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tạo báo cáo</CardTitle>
          <CardDescription>Tạo báo cáo tổng hợp để phân tích và tuân thủ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Báo cáo tuân thủ</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tạo báo cáo tuân thủ tổng hợp bao gồm nhật ký kiểm toán, hoạt động người dùng và sự kiện hệ thống.
              </p>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Tạo báo cáo tuân thủ
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Báo cáo xét nghiệm</h4>
              <p className="text-sm text-gray-600 mb-4">
                Xuất báo cáo xét nghiệm chi tiết với thông tin bệnh nhân, kết quả và trạng thái xác nhận.
              </p>
              <Button variant="outline" className="w-full">
                <TestTube2 className="h-4 w-4 mr-2" />
                Tạo báo cáo xét nghiệm
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Báo cáo hoạt động người dùng</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tạo báo cáo tập trung vào hoạt động người dùng, mẫu đăng nhập và kiểm soát truy cập.
              </p>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Tạo báo cáo người dùng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}