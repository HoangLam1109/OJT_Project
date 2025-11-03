import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import Badge from '../../components/common/badge';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/common/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/common/dialog';
import { Progress } from '../../components/common/progress';
import { toast } from 'sonner';
import { TestTube, PlayCircle, Monitor, Search, CheckCircle, Clock, AlertCircle, Pause } from 'lucide-react';
import { mockInstrument } from './data/mockInstrument';
import type { Instrument } from './types/Instrument';
import type { TestOrder } from '../LabUser/types/TestOrderTypes';
import { testOrderService } from '../../service/testOrderService';

export function ServiceTestPage() {
  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [instruments] = useState<Instrument[]>(mockInstrument);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load orders from API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Use backend route /api/testOrder/all
        const data = await testOrderService.getAllTestOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Không thể tải danh sách lệnh xét nghiệm');
        // eslint-disable-next-line no-console
        console.error('Error loading test orders (service):', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const availableInstruments = instruments.filter(i => i.status === 'ready' && i.isActive);


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
          processing: o.processing ?? 0,
        }
        : o
    ));

    toast.success('Đã bắt đầu xét nghiệm');
    setShowStartTestDialog(false);
    setSelectedOrder(null);
    setSelectedInstrument('');
  };

  const handlePauseTest = async (orderId: string) => {
    // Cập nhật cục bộ giống LabUser
    setOrders(orders.map(o =>
      o.id === orderId
        ? {
          ...o, status: 'Pending' as const,
        } : o
    ));
    toast.info('Đã tạm dừng xét nghiệm');
  };

  const handleCompleteTest = async (orderId: string) => {
    // Cập nhật cục bộ giống LabUser
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: 'Completed' as const } : o
    ));
    toast.success('Xét nghiệm hoàn thành');
  };

  // const getPriorityBadge = (priority: string) => {
  //   switch (priority) {
  //     case 'urgent':
  //       return <Badge variant="destructive">Khẩn cấp</Badge>;
  //     case 'normal':
  //       return <Badge variant="default">Bình thường</Badge>;
  //     case 'routine':
  //       return <Badge variant="secondary">Thường quy</Badge>;
  //     default:
  //       return <Badge>{priority}</Badge>;
  //   }
  // };

  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case 'pending':
  //       return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
  //     case 'processing':
  //       return <Badge variant="default"><PlayCircle className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
  //     case 'completed':
  //       return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
  //     case 'failed':
  //       return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
  //     default:
  //       return <Badge>{status}</Badge>;
  //   }
  // };

  const filteredOrders = orders.filter(o =>
    (o.barcode || o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.testType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing' ).length,
    completed: orders.filter(o => o.status === 'Completed' ).length,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Thực hiện Xét nghiệm</h2>
          <p className="text-gray-600">Khởi tạo và theo dõi quá trình xét nghiệm mẫu</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm mẫu..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-2xl text-blue-600">{stats.processing}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Queue */}
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
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-mono">{order.barcode || order.id}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Bệnh nhân: <span className="text-gray-900">{order.patient_name}</span></p>
                        <p>Loại xét nghiệm: <span className="text-gray-900">{order.testType}</span></p>
                        <p>Thời gian bắt đầu: <span className="text-gray-900">{order.run_at}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(order.status === 'Pending') && (
                        <Button
                          size="sm"
                          className="flex items-center gap-2 px-3 py-1"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStartTestDialog(true);
                          }}
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Bắt đầu</span>
                        </Button>
                      )}
                      {(order.status === 'Processing' ) && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2 px-3 py-1"
                            onClick={() => handlePauseTest(order.id)}
                          >
                            <Pause className="w-4 h-4" />
                            <span>Tạm dừng</span>
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-2 px-3 py-1"
                            onClick={() => handleCompleteTest(order.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Hoàn thành</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {order.processing !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className={order.processing === 100 ? "text-green-600" : "text-blue-600"}>
                          {order.processing}%
                        </span>
                      </div>
                      <Progress
                        value={order.processing}
                      />
                    </div>
                  )}
                </div>
              ))}
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

      {/* Start Test Dialog */
      }
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
                  <span>{selectedOrder.patient_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loại xét nghiệm:</span>
                  <span>{selectedOrder.testType}</span>
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
                        const isCompatible = selectedOrder?.testType && selectedOrder?.testType !== 'Chưa xác định'
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
                {availableInstruments.length > 0 && selectedOrder?.testType && selectedOrder?.testType !== 'Chưa xác định' &&
                  availableInstruments.filter(i => i.testTypes?.includes(String(selectedOrder?.testType))).length === 0 && (
                    <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Không có thiết bị nào hỗ trợ loại xét nghiệm "{selectedOrder?.testType}". Vui lòng chọn thiết bị thủ công.</span>
                    </p>
                  )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartTestDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleStartTest}
              disabled={!selectedInstrument}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Bắt đầu xét nghiệm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
