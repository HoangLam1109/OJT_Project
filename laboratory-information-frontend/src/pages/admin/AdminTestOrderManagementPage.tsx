import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { TestTube2, Plus, Search, Eye, Edit, Trash2, Clock, CheckCircle, DollarSign } from 'lucide-react';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { mockTestOrders } from './data/mockTestOrders';
import type { TestOrder } from './data/mockTestOrders';
import { Skeleton } from '@/components/common/skeleton';

export function AdminTestOrderManagementPage() {
  const [testOrders] = useState<TestOrder[]>(mockTestOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || order.testCategory === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'stat': return 'Khẩn cấp';
      case 'urgent': return 'Ưu tiên';
      case 'routine': return 'Thường';
      default: return priority;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hematology': return 'Huyết học';
      case 'chemistry': return 'Hóa sinh';
      case 'microbiology': return 'Vi sinh';
      case 'immunology': return 'Miễn dịch';
      case 'pathology': return 'Giải phẫu bệnh';
      default: return category;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'partial': return 'Thanh toán một phần';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 1500);
  return () => clearTimeout(timer);
}, []);
if (loading) {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 w-full lg:w-1/2" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-1/4" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-1/3" /></CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý xét nghiệm</h1>
          <p className="text-gray-600 mt-1">Quản lý đơn xét nghiệm và kết quả</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn xét nghiệm
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đơn xét nghiệm</p>
                <p className="text-2xl font-bold text-gray-900">{testOrders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TestTube2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {testOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {testOrders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-purple-600">
                  {testOrders
                    .filter(o => o.paymentStatus === 'paid')
                    .reduce((sum, o) => sum + o.cost, 0)
                    .toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên bệnh nhân, mã đơn, loại xét nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="hematology">Huyết học</option>
                <option value="chemistry">Hóa sinh</option>
                <option value="microbiology">Vi sinh</option>
                <option value="immunology">Miễn dịch</option>
                <option value="pathology">Giải phẫu bệnh</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn xét nghiệm ({filteredOrders.length})</CardTitle>
          <CardDescription>Quản lý đơn xét nghiệm và theo dõi tiến độ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Mã đơn</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Bệnh nhân</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Loại xét nghiệm</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Ưu tiên</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Thanh toán</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Ngày đặt</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">ID: {order.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {order.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {order.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.testType}</div>
                        <div className="text-sm text-gray-500">{getCategoryLabel(order.testCategory)}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {getPriorityLabel(order.priority)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.cost.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>{new Date(order.orderedDate).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.orderedDate).toLocaleTimeString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {order.status !== 'completed' && (
                          <Button variant="ghost" size="icon" title="Hủy đơn" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
