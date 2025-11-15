import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useTestOrderActions } from '../../context/TestOrderActionsContext';
import type { TestOrder, TestResult } from './types/TestOrderTypes';
import { testOrderService } from '../../service/testOrderService';
import type { Instrument } from '../service/types/Instrument';
import TestOrderToolbar from './components/TestOrderToolbar';
import TestOrderStatsCards from './components/TestOrderStatsCards';
import TestOrderList from './components/TestOrderList';
import StartTestDialog from './components/modals/StartTestDialog';
import TestOrderFormModal from './components/modals/TestOrderFormModal';
import ReviewResultModal from './components/modals/ReviewResultModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import TestOrderDetailModal from './components/modals/TestOrderDetailModal';
import { calculateStats } from './utils/testOrderUtils';
import { Card, CardContent, CardHeader } from '@/components/common/card';
import { Skeleton } from '@/components/common/skeleton';

const TestOrdersPage: React.FC = () => {
  const { user } = useAuthContext();
  const { setOnCreateTestOrder } = useTestOrderActions();
  const navigate = useNavigate();
  const location = useLocation();
  

  const [orders, setOrders] = useState<TestOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track if it's the first load
  const [searchInput, setSearchInput] = useState(''); // Input value (immediate)
  const [searchTerm, setSearchTerm] = useState(''); // Debounced search term (for API)
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [instruments] = useState<Instrument[]>([]);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Debounce search input - update searchTerm after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      // Reset to page 1 when search term changes
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load data when page or searchTerm changes
  useEffect(() => {
    if (searchTerm.trim()) {
      loadSearchResults(searchTerm, currentPage);
    } else {
      loadTestOrders(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);


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
  
  const loadTestOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const { orders: data, pagination: paginationInfo } = await testOrderService.getAllTestOrders(page, 10);
      setOrders(data);
      setFilteredOrders(data); // Set filtered orders to all orders when not searching
      setPagination(paginationInfo);
    } catch (error) {
      toast.error('Không thể tải danh sách lệnh xét nghiệm');
      console.error('Error loading test orders:', error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const loadSearchResults = async (keyword: string, page: number = 1) => {
    try {
      setLoading(true);
      const { orders: data, pagination: paginationInfo } = await testOrderService.searchTestOrders(keyword, page, 10);
      setOrders(data);
      setFilteredOrders(data); // Set filtered orders to search results
      setPagination(paginationInfo);
    } catch (error) {
      toast.error('Không thể tìm kiếm lệnh xét nghiệm');
      console.error('Error searching test orders:', error);
      // On error, clear results
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // Detect current route base path (service or labuser)
  const getBasePath = () => {
    if (location.pathname.startsWith('/service')) {
      return '/service';
    }
    return '/labuser';
  };

  const handleCreate = React.useCallback(() => {
    const basePath = getBasePath();
    navigate(`${basePath}/create-test-order`);
  }, [navigate, location.pathname]);

  // Đăng ký callback với context
  useEffect(() => {
    setOnCreateTestOrder(handleCreate);
    return () => {
      setOnCreateTestOrder(() => {});
    };
  }, [handleCreate, setOnCreateTestOrder]);


  const handleFormSubmit = async (_orderData: Omit<TestOrder, '_id'> | Partial<TestOrder> | TestOrder) => {
    try {
      // TestOrderFormModal đã gọi API trực tiếp, chỉ cần refresh data
      setFormModalOpen(false);
      setIsEdit(false);
      setSelectedOrder(null);
      await loadTestOrders(currentPage);
    } catch (error) { 
      console.error('Error refreshing test orders:', error);
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
      o._id === orderId
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
      await testOrderService.deleteTestOrder(selectedOrder._id, user?.name ?? 'system');
      toast.success(`Đã xóa lệnh xét nghiệm ${selectedOrder._id} thành công`);
      setDeleteModalOpen(false);
      await loadTestOrders(currentPage);
    } catch (error) {
      toast.error('Không thể xóa lệnh xét nghiệm');
      console.error('Error deleting test order:', error);
    }
  };

  const handleReviewSubmit = async (_result: Partial<TestResult>) => {
    try {
      toast.success('Đã cập nhật kết quả xét nghiệm thành công');
      setReviewModalOpen(false);
      loadTestOrders(currentPage);
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
      await testOrderService.changeStatus(selectedOrder._id, 'Processing', user?.name ??'');

      // Cập nhật UI tức thì (optimistic)
      setOrders(prev => prev.map(o =>
        o._id === selectedOrder._id
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


  const handleOrderClick = async (order: TestOrder) => {
    try {
      // Fetch full order details including instrument and reagents
      const fullOrderDetails = await testOrderService.getTestOrderById(order._id);
      if (fullOrderDetails) {
        setSelectedOrder(fullOrderDetails);
        setShowDetailDialog(true);
      } else {
        toast.error('Không thể tải chi tiết lệnh xét nghiệm');
      }
    } catch (error) {
      toast.error('Không thể tải chi tiết lệnh xét nghiệm');
      console.error('Error loading order details:', error);
      // Fallback to basic order info if fetch fails
      setSelectedOrder(order);
      setShowDetailDialog(true);
    }
  };

  const availableInstruments = instruments.filter(i => i.status === 'Ready' && i.is_active === true);

  // Only show full skeleton on initial load, not during search
  if (loading && isInitialLoad) {
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
    </div>
  );
}


  const stats = calculateStats(orders);

  return (
    <div className="space-y-6 p-4">
      <TestOrderToolbar
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        onCreateTestOrder={handleCreate}
      />

      <TestOrderStatsCards stats={stats} loading={loading} />

      <TestOrderList
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
        onStatusChange={handleStatusChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        isLoading={loading && !isInitialLoad}
      />

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
