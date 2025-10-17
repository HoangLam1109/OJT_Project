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
  Plus,
  Search,
  Edit,
  Eye,
  Play,
  X,
  TestTube2,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Brain,
  MessageSquare,
  Download
} from 'lucide-react';
import type { Test } from '../../../../types';

interface TestOrderManagementProps {
  currentUser: any;
}

// Mock test order data
const mockTestOrders: Test[] = [
  {
    id: 'T001',
    patientId: 'P001',
    testType: 'Công thức máu hoàn chỉnh',
    orderDate: '2024-10-07',
    status: 'completed',
    sampleId: 'S001',
    results: 'WBC: 7.2 K/uL, RBC: 4.5 M/uL, Hemoglobin: 14.2 g/dL',
    fee: 150000,
    technician: 'Mike Johnson',
    completionDate: '2024-10-08',
    aiReviewData: {
      reviewedAt: '2024-10-08T10:30:00',
      reviewScore: 0.95,
      confidence: 0.98,
      flags: ['normal'],
      recommendations: ['Kết quả trong giới hạn bình thường'],
      anomalies: []
    }
  },
  {
    id: 'T002',
    patientId: 'P002',
    testType: 'Xét nghiệm mỡ máu',
    orderDate: '2024-10-06',
    status: 'in-progress',
    fee: 120000,
    technician: 'Lisa Chen',
    sampleId: 'S002'
  },
  {
    id: 'T003',
    patientId: 'P003',
    testType: 'Chức năng tuyến giáp',
    orderDate: '2024-10-08',
    status: 'pending',
    fee: 180000,
    sampleId: 'S003'
  },
  {
    id: 'T004',
    patientId: 'P001',
    testType: 'Chức năng gan',
    orderDate: '2024-10-05',
    status: 'validated',
    sampleId: 'S004',
    results: 'ALT: 45 U/L (HIGH), AST: 38 U/L, Bilirubin: 1.2 mg/dL',
    fee: 200,
    technician: 'David Kim',
    completionDate: '2024-10-06',
    aiReviewData: {
      reviewedAt: '2024-10-06T15:45:00',
      reviewScore: 0.87,
      confidence: 0.92,
      flags: ['abnormal'],
      recommendations: ['ALT tăng cao - đề nghị theo dõi thêm'],
      anomalies: [
        {
          parameter: 'ALT',
          value: 45,
          expected: '7-40 U/L',
          severity: 'medium',
          description: 'Nồng độ ALT tăng nhẹ'
        }
      ]
    }
  }
];

export function TestOrderManagementPage({ currentUser }: TestOrderManagementProps) {
  const [testOrders, setTestOrders] = useState<Test[]>(mockTestOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAIReviewModal, setShowAIReviewModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  // Filter test orders
  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.sampleId && order.sampleId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      validated: 'bg-purple-100 text-purple-800',
      ai_reviewed: 'bg-indigo-100 text-indigo-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const handleRunTest = (testId: string) => {
    setTestOrders(orders => 
      orders.map(order => 
        order.id === testId 
          ? { ...order, status: 'in-progress', technician: currentUser.name }
          : order
      )
    );
  };

  const handleCancelOrder = (testId: string) => {
    setTestOrders(orders => orders.filter(order => order.id !== testId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Yêu cầu Xét nghiệm</h1>
          <p className="text-gray-600 mt-1">Quản lý yêu cầu xét nghiệm, kết quả và đánh giá AI</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tạo yêu cầu
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Đồng bộ HL7
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {testOrders.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang thực hiện</p>
                <p className="text-2xl font-bold text-blue-600">
                  {testOrders.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <TestTube2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {testOrders.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cảnh báo AI</p>
                <p className="text-2xl font-bold text-red-600">
                  {testOrders.filter(t => t.aiReviewData?.flags.includes('abnormal')).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo mã xét nghiệm, mã bệnh nhân hoặc loại xét nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="validated">Đã xác nhận</option>
                <option value="ai_reviewed">Đã kiểm tra AI</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu Xét nghiệm ({filteredOrders.length})</CardTitle>
          <CardDescription>Quản lý và theo dõi yêu cầu xét nghiệm trong vòng đời</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Chi tiết yêu cầu</th>
                  <th className="text-left p-4 font-medium text-gray-900">Bệnh nhân</th>
                  <th className="text-left p-4 font-medium text-gray-900">Mẫu</th>
                  <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                  <th className="text-left p-4 font-medium text-gray-900">Kỹ thuật viên</th>
                  <th className="text-left p-4 font-medium text-gray-900">Cờ AI</th>
                  <th className="text-center p-4 font-medium text-gray-900">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.testType}</p>
                        <p className="text-xs text-gray-500">
                          Ngày yêu cầu: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500">Phí: {order.fee.toLocaleString('vi-VN')} VNĐ</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">{order.patientId}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{order.sampleId || 'Chưa lấy mẫu'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' ? 'Chờ xử lý' :
                         order.status === 'in-progress' ? 'Đang thực hiện' :
                         order.status === 'completed' ? 'Đã hoàn thành' :
                         order.status === 'validated' ? 'Đã xác nhận' :
                         order.status === 'ai_reviewed' ? 'Đã kiểm tra AI' :
                         order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{order.technician || 'Chưa phân công'}</p>
                    </td>
                    <td className="p-4">
                      {order.aiReviewData ? (
                        <div className="space-y-1">
                          {order.aiReviewData.flags.includes('abnormal') && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Bất thường
                            </span>
                          )}
                          {order.aiReviewData.flags.includes('normal') && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Bình thường
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            Điểm: {Math.round((order.aiReviewData.reviewScore || 0) * 100)}%
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa kiểm tra</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTest(order);
                            setShowResultModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunTest(order.id)}
                            className="text-green-600"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}

                        {order.status !== 'validated' && (
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {order.aiReviewData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTest(order);
                              setShowAIReviewModal(true);
                            }}
                            className="text-blue-600"
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                        )}

                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
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

      {/* Test Result Modal */}
      {showResultModal && selectedTest && (
        <TestResultModal
          test={selectedTest}
          onClose={() => {
            setShowResultModal(false);
            setSelectedTest(null);
          }}
        />
      )}

      {/* AI Review Modal */}
      {showAIReviewModal && selectedTest && (
        <AIReviewModal
          test={selectedTest}
          onClose={() => {
            setShowAIReviewModal(false);
            setSelectedTest(null);
          }}
        />
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newOrder) => {
            setTestOrders([...testOrders, { 
              ...newOrder, 
              id: `T${(testOrders.length + 1).toString().padStart(3, '0')}`,
              orderDate: new Date().toISOString().split('T')[0]
            }]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Test Result Modal Component
function TestResultModal({ test, onClose }: {
  test: Test;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Kết quả xét nghiệm - {test.id}</CardTitle>
          <CardDescription>{test.testType} cho Bệnh nhân {test.patientId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin xét nghiệm</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã xét nghiệm</label>
                  <p className="text-gray-900">{test.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã bệnh nhân</label>
                  <p className="text-gray-900">{test.patientId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Loại xét nghiệm</label>
                  <p className="text-gray-900">{test.testType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mã mẫu</label>
                  <p className="text-gray-900">{test.sampleId || 'Chưa lấy mẫu'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Trạng thái & Thời gian</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                  <p className="text-gray-900 capitalize">{
                    test.status === 'pending' ? 'Chờ xử lý' :
                    test.status === 'in-progress' ? 'Đang thực hiện' :
                    test.status === 'completed' ? 'Đã hoàn thành' :
                    test.status === 'validated' ? 'Đã xác nhận' :
                    test.status === 'ai_reviewed' ? 'Đã kiểm tra AI' :
                    test.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày yêu cầu</label>
                  <p className="text-gray-900">{new Date(test.orderDate).toLocaleString('vi-VN')}</p>
                </div>
                {test.completionDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày hoàn thành</label>
                    <p className="text-gray-900">{new Date(test.completionDate).toLocaleString('vi-VN')}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Kỹ thuật viên</label>
                  <p className="text-gray-900">{test.technician || 'Chưa phân công'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {test.results && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kết quả xét nghiệm</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-mono">{test.results}</p>
              </div>
            </div>
          )}

          {/* AI Review Summary */}
          {test.aiReviewData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tóm tắt đánh giá AI</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Review Score</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {Math.round((test.aiReviewData.reviewScore || 0) * 100)}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Confidence</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.round((test.aiReviewData.confidence || 0) * 100)}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Flags</p>
                  <p className="text-lg font-bold text-purple-900 capitalize">
                    {test.aiReviewData.flags.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Thêm ghi chú
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            {test.status === 'completed' && (
              <Button className="bg-green-600 hover:bg-green-700">
                Xác nhận kết quả
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Review Modal Component
function AIReviewModal({ test, onClose }: {
  test: Test;
  onClose: () => void;
}) {
  if (!test.aiReviewData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>Đánh giá AI - {test.id}</span>
          </CardTitle>
          <CardDescription>Phân tích chi tiết và khuyến nghị từ AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Điểm đánh giá</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((test.aiReviewData.reviewScore || 0) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Độ tin cậy</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round((test.aiReviewData.confidence || 0) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Số bất thường</p>
                  <p className="text-3xl font-bold text-red-600">
                    {test.aiReviewData.anomalies?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cờ cảnh báo AI</h3>
            <div className="flex flex-wrap gap-2">
              {test.aiReviewData.flags.map((flag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    flag === 'normal' ? 'bg-green-100 text-green-800' :
                    flag === 'abnormal' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {flag === 'normal' ? 'Bình thường' :
                   flag === 'abnormal' ? 'Bất thường' :
                   flag}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Khuyến nghị của AI</h3>
            <div className="space-y-2">
              {test.aiReviewData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-gray-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies */}
          {test.aiReviewData.anomalies && test.aiReviewData.anomalies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Phát hiện bất thường</h3>
              <div className="space-y-3">
                {test.aiReviewData.anomalies.map((anomaly, index) => (
                  <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{anomaly.parameter}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                            anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {anomaly.severity === 'high' ? 'Mức độ cao' :
                             anomaly.severity === 'medium' ? 'Mức độ trung bình' :
                             'Mức độ thấp'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Giá trị: </span>
                          <span className="font-medium text-gray-900">{anomaly.value}</span>
                          <span className="text-gray-600 ml-4">Kỳ vọng: </span>
                          <span className="font-medium text-gray-900">{anomaly.expected}</span>
                        </div>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết đánh giá</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Thời gian đánh giá: {new Date(test.aiReviewData.reviewedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất phân tích
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Chấp nhận đánh giá AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Create Order Modal Component
function CreateOrderModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (order: Omit<Test, 'id' | 'orderDate'>) => void;
}) {
  const [formData, setFormData] = useState({
    patientId: '',
    testType: '',
    fee: 0,
    sampleId: '',
    status: 'pending' as Test['status']
  });

  const testTypes = [
    'Complete Blood Count',
    'Lipid Panel',
    'Thyroid Function',
    'Liver Function',
    'Kidney Function',
    'Diabetes Panel',
    'Cardiac Markers',
    'Inflammatory Markers'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <CardTitle>Create Test Order</CardTitle>
          <CardDescription>Create a new test order for a patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                  placeholder="P001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleId">Sample ID</Label>
                <Input
                  id="sampleId"
                  value={formData.sampleId}
                  onChange={(e) => setFormData({...formData, sampleId: e.target.value})}
                  placeholder="S001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testType">Test Type *</Label>
              <select
                id="testType"
                value={formData.testType}
                onChange={(e) => setFormData({...formData, testType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select test type</option>
                {testTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Test Fee ($) *</Label>
              <Input
                id="fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.fee}
                onChange={(e) => setFormData({...formData, fee: parseFloat(e.target.value) || 0})}
                required
                placeholder="150.00"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}