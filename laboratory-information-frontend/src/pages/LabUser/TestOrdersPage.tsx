import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '../../hooks/useAuthContext';
import type { TestOrder, TestResult } from './types/TestOrderTypes';
import { testOrderService } from '../../service/testOrderService';
import { mockInstrument } from '../service/data/mockInstrument';
import type { Instrument } from '../service/types/Instrument';
import TestOrderToolbar from './components/TestOrderToolbar';
import TestOrderStatsCards from './components/TestOrderStatsCards';
import TestOrderList from './components/TestOrderList';
import AvailableInstrumentsCard from './components/AvailableInstrumentsCard';
import StartTestDialog from './components/modals/StartTestDialog';
import TestOrderFormModal from './components/modals/TestOrderFormModal';
import ReviewResultModal from './components/modals/ReviewResultModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import TestOrderDetailModal from './components/modals/TestOrderDetailModal';
import { calculateStats, filterTestOrders } from './utils/testOrderUtils';
import { Card, CardContent, CardHeader } from '@/components/common/card';
import { Skeleton } from '@/components/common/skeleton';

const TestOrdersPage: React.FC = () => {
  const { user } = useAuthContext();
  

  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [instruments] = useState<Instrument[]>(mockInstrument);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadTestOrders();
  }, []);

  useEffect(() => {
    const filtered = filterTestOrders(orders, searchTerm, 'All');
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);


  // Tự động tăng % khi đang Processing
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (order.status === 'Processing' && (order.processing ?? 0) < 95) {
          return { ...order, processing: (order.processing ?? 0) + 5 };
        }
        return order;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const loadTestOrders = async () => {
    try {
      setLoading(true);
      const data = await testOrderService.getAllTestOrders();

      // ⚙️ Chuẩn hóa field từ backend về đúng định dạng interface
      const normalized = data.map((o: TestOrder) => ({
        id: o.id,
        barcode: o.barcode,
        patient_id: o.patient_id,
        patient_name: o.patient_name,
        testType: o.testType,
        status: o.status,
        created_at: o.created_at,
        updated_at: o.updated_at,
        due_date: o.due_date,
        processing: o.processing ?? o.progress ?? 0,
        notes: o.notes,
      }));

      setOrders(normalized);
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


  const handleFormSubmit = async (orderData: Omit<TestOrder, 'id'> | Partial<TestOrder>) => {
    try {
      if (isEdit && selectedOrder) {
        await testOrderService.updateTestOrder(selectedOrder.id, orderData);
        toast.success('Đã cập nhật lệnh xét nghiệm thành công');
      } else {
        await testOrderService.createTestOrder(orderData as Omit<TestOrder, 'id'>);
        toast.success('Đã tạo lệnh xét nghiệm thành công');
      }
      setFormModalOpen(false);
      await loadTestOrders();
    } catch (error) {
      toast.error('Không thể lưu lệnh xét nghiệm');
      console.error('Error saving test order:', error);
    }
  };

const handleStatusChange = async (
  orderId: string,
  newStatus: 'Pending' | 'Processing' | 'Completed'
) => {
  try {
    await testOrderService.changeStatus(orderId, newStatus, user?.name ?? 'system');
    toast.success(`Đã chuyển sang ${newStatus}`);

    // Optimistic UI – cập nhật ngay, không cần reload
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            status: newStatus,
            processing: newStatus === 'Processing' ? 10 : newStatus === 'Completed' ? 100 : 0
          }
        : o
    ));
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    console.error('Status change error:', error.response?.data);
  }
};

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      await testOrderService.deleteTestOrder(selectedOrder.id, user?.name ?? 'system');
      toast.success(`Đã xóa lệnh xét nghiệm ${selectedOrder.id} thành công`);
      setDeleteModalOpen(false);
      await loadTestOrders();
    } catch (error) {
      toast.error('Không thể xóa lệnh xét nghiệm');
      console.error('Error deleting test order:', error);
    }
  };

  const handleReviewSubmit = async (_result: Partial<TestResult>) => {
    try {
      toast.success('Đã cập nhật kết quả xét nghiệm thành công');
      setReviewModalOpen(false);
      loadTestOrders();
    } catch (error) {
      toast.error('Không thể cập nhật kết quả xét nghiệm');
      console.error('Error updating test result:', error);
    }
  };

  const handleStartTest = async () => {
    if (!selectedOrder || !selectedInstrument) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    try {
      // GỌI API ĐỔI STATUS + CẬP NHẬT INSTRUMENT
      await testOrderService.changeStatus(selectedOrder.id, 'Processing', user?.name ??'');

      // Cập nhật UI tức thì (optimistic)
      setOrders(prev => prev.map(o =>
        o.id === selectedOrder.id
          ? { ...o, status: 'Processing', processing: 10 }
          : o
      ));

      toast.success('Đã bắt đầu xét nghiệm');
    } catch (error: any) {
      toast.error('Không thể bắt đầu xét nghiệm');
      console.error(error);
      return;
    } finally {
      setShowStartTestDialog(false);
      setSelectedOrder(null);
      setSelectedInstrument('');
    }
  };


  const handleOrderClick = (order: TestOrder) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const availableInstruments = instruments.filter(i => i.status === 'ready' && i.isActive);

  if (loading) {
  return (
    <div className="space-y-6 p-4">
      {/* Toolbar skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-80 rounded-md" />
          <Skeleton className="h-10 w-60 rounded-md" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </Card>
        ))}
      </div>

      {/* TestOrderList skeleton */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-white/50 mb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AvailableInstruments skeleton */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg bg-white/50 space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


  const stats = calculateStats(orders);

  return (
    <div className="space-y-6 p-4">
      <TestOrderToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={handleCreate}
      />

      <TestOrderStatsCards stats={stats} loading={loading} />

      <TestOrderList
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
        onStatusChange={handleStatusChange}
      />

      <AvailableInstrumentsCard instruments={availableInstruments} />

      <StartTestDialog
        isOpen={showStartTestDialog}
        order={selectedOrder}
        availableInstruments={availableInstruments}
        selectedInstrument={selectedInstrument}
        onClose={() => {
          setShowStartTestDialog(false);
          setSelectedOrder(null);
          setSelectedInstrument('');
        }}
        onInstrumentChange={setSelectedInstrument}
        onConfirm={handleStartTest}
      />

      <TestOrderDetailModal
        order={selectedOrder}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        onDelete={(order) => {
          setSelectedOrder(order);
          setDeleteModalOpen(true);
        }}
        onEdit={(order) => {
          setSelectedOrder(order);
          setIsEdit(true);
          setFormModalOpen(true);
        }}
      />

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
