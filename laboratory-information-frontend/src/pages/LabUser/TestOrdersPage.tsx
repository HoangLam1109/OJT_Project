import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  ClipboardList,
} from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

// Import types
import type { TestOrder, TestResult } from './types/TestOrderTypes';

// Import mock data
import { testOrdersAPI } from './data/mockTestOrdersData';

// Import components
import TestOrderTable from './components/TestOrderTable';
import TestOrderFormModal from './components/modals/TestOrderFormModal';
import ReviewResultModal from './components/modals/ReviewResultModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';

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
        order.testName.toLowerCase().includes(searchTerm.toLowerCase())
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
      const data = await testOrdersAPI.fetchTestOrders();
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
        await testOrdersAPI.updateTestOrder(selectedOrder.id, orderData);
        toast.success('Đã cập nhật lệnh xét nghiệm thành công');
      } else {
        const result = await testOrdersAPI.createTestOrder(orderData as Omit<TestOrder, 'id'>);
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
      await testOrdersAPI.deleteTestOrder(selectedOrder.id);
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
      await testOrdersAPI.updateTestResult(result.testOrderId!, result);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Lệnh Xét nghiệm</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các lệnh xét nghiệm</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleCreate} 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Lệnh Xét nghiệm
          </Button>
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">
              {filteredOrders.length} / {orders.length} lệnh xét nghiệm
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Tìm kiếm
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Tìm theo mã, tên bệnh nhân, loại xét nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Trạng thái
              </Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">Tất cả</option>
                <option value="Pending">Đang chờ</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Danh sách Lệnh Xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lệnh xét nghiệm</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Không tìm thấy lệnh xét nghiệm phù hợp với bộ lọc'
                  : 'Chưa có lệnh xét nghiệm nào được tạo'
                }
              </p>
            </div>
          ) : (
            <TestOrderTable
              orders={filteredOrders}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReview={handleReview}
            />
          )}
        </CardContent>
      </Card>

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
