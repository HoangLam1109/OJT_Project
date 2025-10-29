import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/common/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/common/dialog';
import Badge from '../../components/common/badge';
import { Progress } from '../../components/common/progress';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
  TestTube,
  Pause,
  AlertCircle,
  Monitor,
} from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

// Import types
import type { TestOrder, TestResult } from './types/TestOrderTypes';

// Import API service
import { testOrderService } from '../../service/testOrderService';
import { mockInstrument } from '../service/data/mockInstrument';
import type { Instrument } from '../service/types/Instrument';

// Import components
import TestOrderFormModal from './components/modals/TestOrderFormModal';
import ReviewResultModal from './components/modals/ReviewResultModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import TestOrderDetailModal from './components/modals/TestOrderDetailModal';

// Main Component
const TestOrdersPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Role validation
  useEffect(() => {
    if (user && user.role !== 'LAB_USER') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [instruments] = useState<Instrument[]>(mockInstrument);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadTestOrders();
  }, []);

  // Filter orders when search or status changes
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.testName && order.testName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const loadTestOrders = async () => {
    try {
      setLoading(true);
      const data = await testOrderService.getAllTestOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Không thể tải danh sách lệnh xét nghiệm');
      console.error('Error loading test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setIsEdit(false);
    setFormModalOpen(true);
  };

  const handleEdit = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsEdit(true);
    setFormModalOpen(true);
  };

  const handleDelete = (order: TestOrder) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleReview = (order: TestOrder) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleViewDetail = (order: TestOrder) => {
    toast.info(`Chi tiết lệnh xét nghiệm ${order.id}`);
  };

  const handleFormSubmit = async (orderData: Omit<TestOrder, 'id'> | Partial<TestOrder>) => {
    try {
      if (isEdit && selectedOrder) {
        await testOrderService.updateTestOrder(selectedOrder.id, orderData);
        toast.success('Đã cập nhật lệnh xét nghiệm thành công');
      } else {
        const result = await testOrderService.createTestOrder(orderData as Omit<TestOrder, 'id'>);
        toast.success(`Đã tạo lệnh xét nghiệm thành công với mã: ${result.id}`);
      }
      setFormModalOpen(false);
      await loadTestOrders();
    } catch (error) {
      toast.error('Không thể lưu lệnh xét nghiệm');
      console.error('Error saving test order:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    
    try {
      await testOrderService.deleteTestOrder(selectedOrder.id);
      toast.success(`Đã xóa lệnh xét nghiệm ${selectedOrder.id} thành công`);
      setDeleteModalOpen(false);
      await loadTestOrders();
    } catch (error) {
      toast.error('Không thể xóa lệnh xét nghiệm');
      console.error('Error deleting test order:', error);
    }
  };

  const handleReviewSubmit = async (result: Partial<TestResult>) => {
    try {
      // TODO: Implement test result update API when available
      // await testOrderService.updateTestResult(result.testOrderId!, result);
      toast.success('Đã cập nhật kết quả xét nghiệm thành công');
      setReviewModalOpen(false);
      loadTestOrders();
    } catch (error) {
      toast.error('Không thể cập nhật kết quả xét nghiệm');
      console.error('Error updating test result:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = {
    pending: orders.filter(o => o.status === 'Pending' || o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'Processing' || o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'Completed' || o.status === 'completed').length,
    failed: orders.filter(o => o.status === 'Cancelled' || o.status === 'failed').length,
  };

  // Helper functions for badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Emergency':
      case 'Urgent':
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      case 'Normal':
      case 'normal':
        return <Badge variant="default">Bình thường</Badge>;
      case 'Routine':
      case 'routine':
        return <Badge variant="secondary">Thường quy</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
      case 'processing':
        return <Badge variant="default"><PlayCircle className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'cancelled':
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Process order actions
  const handleStartTest = () => {
    if (!selectedOrder || !selectedInstrument) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? {
            ...o,
            status: 'Processing' as const,
            progress: 0,
            assignedInstrument: selectedInstrument,
            startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            estimatedCompletion: new Date(Date.now() + 15 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        : o
    ));

    toast.success('Đã bắt đầu xét nghiệm');
    setShowStartTestDialog(false);
    setSelectedOrder(null);
    setSelectedInstrument('');
  };

  const handleStartTestClick = (order: TestOrder) => {
    setSelectedOrder(order);
    setShowStartTestDialog(true);
  };

  const handlePauseTest = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: 'Pending' as const }
        : o
    ));
    toast.info('Đã tạm dừng xét nghiệm');
  };

  const handleCompleteTest = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: 'Completed' as const, progress: 100 }
        : o
    ));
    toast.success('Xét nghiệm hoàn thành');
  };

  // Get available instruments
  const availableInstruments = instruments.filter(i => i.status === 'ready' && i.isActive);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Thực hiện Xét nghiệm</h2>
          <p className="text-gray-600">Khởi tạo và theo dõi quá trình xét nghiệm mẫu</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm mẫu..."
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreate} 
            className="
              flex items-center 
              bg-gradient-to-r from-blue-500 to-indigo-600
              text-white font-medium shadow-md
              px-4 py-2 rounded-lg
              hover:from-blue-600 hover:to-indigo-700
              hover:shadow-lg
              focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
              transition-all duration-200 ease-in-out
            "
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo đơn xét nghiệm bệnh nhân
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
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

      {/* Sample List */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Danh sách Mẫu
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi tiến độ xét nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                return (
                  <div 
                    key={order.id} 
                    className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetailDialog(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-mono">{order.barcode || order.id}</h4>
                          {getPriorityBadge(order.priority)}
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>Bệnh nhân: <span className="text-gray-900">{order.patientName}</span></p>
                          <p>Loại xét nghiệm: <span className="text-gray-900">{order.testType}</span></p>
                          {order.assignedInstrument && (
                            <>
                              <p>Thiết bị: <span className="text-gray-900">{order.assignedInstrument}</span></p>
                              <p>Bắt đầu: <span className="text-gray-900">{order.startTime}</span></p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(order.status === 'Pending' || order.status === 'pending') && (
                          <Button 
                            size="sm"
                            className="flex items-center gap-2 px-3 py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTestClick(order);
                            }}
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Bắt đầu</span>
                          </Button>
                        )}
                        {(order.status === 'Processing' || order.status === 'processing') && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-2 px-3 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePauseTest(order.id);
                              }}
                            >
                              <Pause className="w-4 h-4" />
                              <span>Tạm dừng</span>
                            </Button>
                            <Button 
                              size="sm"
                              className="flex items-center gap-2 px-3 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteTest(order.id);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Hoàn thành</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {(order.status === 'Processing' || order.status === 'processing') && order.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className="text-blue-600">{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                        {order.estimatedCompletion && (
                          <p className="text-xs text-gray-500 mt-1">
                            Dự kiến hoàn thành: {order.estimatedCompletion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không có mẫu nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Instruments */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Thiết bị Khả dụng ({availableInstruments.length})
          </CardTitle>
          <CardDescription>
            Danh sách thiết bị sẵn sàng thực hiện xét nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableInstruments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableInstruments.map((instrument) => (
                <div key={instrument.id} className="p-4 border rounded-lg bg-white/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-600" />
                      {instrument.name}
                    </h4>
                    <Badge variant="default" className="bg-green-600">Sẵn sàng</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>{instrument.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vị trí:</span>
                      <span>{instrument.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hiệu suất:</span>
                      <span>{instrument.throughputPerHour} test/h</span>
                    </div>
                    {instrument.reagentLevel !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Hóa chất:</span>
                          <span>{instrument.reagentLevel}%</span>
                        </div>
                        <Progress value={instrument.reagentLevel} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Monitor className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Không có thiết bị khả dụng</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Test Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bắt đầu Xét nghiệm</DialogTitle>
            <DialogDescription>
              Chọn thiết bị để thực hiện xét nghiệm
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã mẫu:</span>
                  <span className="font-mono">{selectedOrder.barcode || selectedOrder.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bệnh nhân:</span>
                  <span>{selectedOrder.patientName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loại xét nghiệm:</span>
                  <span>{selectedOrder.testType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ưu tiên:</span>
                  {getPriorityBadge(selectedOrder.priority)}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="instrument" className="mb-2 text-sm font-medium">Chọn thiết bị *</Label>
                <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                  <SelectTrigger 
                    id="instrument"
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-left h-auto min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                  >
                    <SelectValue placeholder="Chọn thiết bị..." className="text-gray-700" />
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-[300px] overflow-y-auto bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1">
                    {availableInstruments.length > 0 ? (
                      availableInstruments.map((instrument) => {
                        const isCompatible = selectedOrder.testType && selectedOrder.testType !== 'Chưa xác định' 
                          ? instrument.testTypes?.includes(selectedOrder.testType) 
                          : true;
                        
                        return (
                          <SelectItem 
                            key={instrument.id} 
                            value={instrument.id} 
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <Monitor className={`w-4 h-4 flex-shrink-0 ${isCompatible ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="font-medium text-sm text-gray-900">{instrument.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })
                    ) : (
                      <div className="px-3 py-4 text-center text-sm text-gray-500">
                        Không có thiết bị khả dụng
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {availableInstruments.length === 0 && (
                  <p className="text-xs text-red-600 mt-1.5">
                    Không có thiết bị khả dụng. Vui lòng kiểm tra lại sau.
                  </p>
                )}
                {availableInstruments.length > 0 && selectedOrder.testType && selectedOrder.testType !== 'Chưa xác định' && 
                  availableInstruments.filter(i => i.testTypes?.includes(selectedOrder.testType)).length === 0 && (
                  <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Không có thiết bị nào hỗ trợ loại xét nghiệm "{selectedOrder.testType}". Vui lòng chọn thiết bị thủ công.</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-3 sm:gap-2 pt-4 mt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowStartTestDialog(false)}
              className="px-6"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleStartTest}
              disabled={!selectedInstrument}
              className="px-6"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Bắt đầu xét nghiệm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <TestOrderDetailModal
        order={selectedOrder}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        onStartTest={handleStartTestClick}
      />

      {/* Modals */}
      <TestOrderFormModal
        order={selectedOrder}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEdit={isEdit}
      />

      <ReviewResultModal
        order={selectedOrder}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      <DeleteConfirmModal
        order={selectedOrder}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TestOrdersPage;
