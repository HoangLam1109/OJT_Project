import React, { useState, useEffect } from 'react';
import type { Reagent } from './data/mockReagentsData';
import { useAuthContext } from '../../hooks/useAuthContext';
import { reagentService } from '../../service/reagentService';
import { toast } from 'sonner';
import ReagentToolbar from './components/ReagentToolbar';
import ReagentTable from './components/ReagentTable';
import ReagentFormModal from './components/modals/ReagentFormModal';
import ReagentDetailModal from './components/modals/ReagentDetailModal';
import ReagentDeleteConfirmModal from './components/modals/ReagentDeleteConfirmModal';
import { filterReagents } from './utils/reagentUtils';

const ReagentManagementPage: React.FC = () => {
  const { user } = useAuthContext();
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [filteredReagents, setFilteredReagents] = useState<Reagent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [editingReagent, setEditingReagent] = useState<Partial<Reagent>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch reagents from API
  useEffect(() => {
    const fetchReagents = async () => {
      setIsLoading(true);
      try {
        const allReagents = await reagentService.getAllReagents();
        setReagents(allReagents);
      } catch (error: any) {
        console.error('Error fetching reagents:', error);
        
        // Check if it's a network/connection error
        if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
          toast.error('Không thể kết nối đến server. Vui lòng kiểm tra backend service đã chạy chưa (port 5003)');
        } else {
          toast.error(error.message || 'Không thể tải danh sách thuốc thử');
        }
        
        setReagents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReagents();
  }, []);

  useEffect(() => {
    const filtered = filterReagents(reagents, searchTerm, statusFilter);
    setFilteredReagents(filtered);
  }, [reagents, searchTerm, statusFilter]);

  const handleAddReagent = () => {
    setEditingReagent({});
    setIsAddModalOpen(true);
  };

  const handleEditReagent = (reagent: Reagent) => {
    setEditingReagent(reagent);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = async (reagent: Reagent) => {
    try {
      // Fetch full details from API using getById
      const fullReagent = await reagentService.getReagentById(reagent.id);
      if (fullReagent) {
        setSelectedReagent(fullReagent);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Không tìm thấy thông tin thuốc thử');
      }
    } catch (error: any) {
      console.error('Error fetching reagent details:', error);
      toast.error(error.message || 'Không thể tải thông tin thuốc thử');
      // Fallback to use the reagent from list
      setSelectedReagent(reagent);
      setIsDetailModalOpen(true);
    }
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsDeleteModalOpen(true);
  };

  const handleSaveReagent = async () => {
    // Validate required fields
    if (!editingReagent.name || !editingReagent.lotNumber || !editingReagent.quantity || !editingReagent.expiryDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Số lô, Số lượng, Ngày hết hạn)');
      return;
    }

    // Validate lot number uniqueness (only for new reagents)
    if (!editingReagent.id) {
      const existingReagent = reagents.find(reagent => 
        reagent.lotNumber === editingReagent.lotNumber
      );
      if (existingReagent) {
        toast.error('Số lô đã tồn tại');
        return;
      }
    }

    // Validate expiry date
    const expiryDate = new Date(editingReagent.expiryDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to compare dates only
    if (expiryDate <= currentDate) {
      toast.error('Ngày hết hạn phải sau ngày hiện tại');
      return;
    }

    // Validate quantity
    if (editingReagent.quantity! < 1) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    try {
      if (editingReagent.id) {
        // Update is not implemented yet, show message
        toast.info('Chức năng cập nhật thuốc thử chưa được kích hoạt');
      } else {
        // Create new reagent
        const newReagent = await reagentService.createReagent(
          {
            ...editingReagent,
            receivedDate: editingReagent.receivedDate || new Date().toISOString().split('T')[0],
            status: editingReagent.status || 'Available',
          },
          user?.id
        );
        setReagents(prev => [...prev, newReagent]);
        toast.success('Tạo thuốc thử thành công');
        console.log(`[AUDIT] E_00026 | Reagent created by ${user?.name}`);
        
        setIsAddModalOpen(false);
        setEditingReagent({});
      }
    } catch (error: any) {
      console.error('Error saving reagent:', error);
      
      // Show specific error message
      const errorMessage = error.message || 'Có lỗi xảy ra khi lưu thuốc thử';
      
      // Check for validation errors from backend
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        toast.error('Số lô thuốc thử đã tồn tại trong hệ thống');
      } else if (errorMessage.includes('validation') || errorMessage.includes('required')) {
        toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReagent) return;

    try {
      await reagentService.deleteReagent(selectedReagent.id, user?.id);
      setReagents(prev => prev.filter(reagent => reagent.id !== selectedReagent.id));
      toast.success('Xóa thuốc thử thành công');
      console.log(`[AUDIT] E_00028 | Reagent deleted by ${user?.name}`);
      setIsDeleteModalOpen(false);
      setSelectedReagent(null);
    } catch (error: any) {
      console.error('Error deleting reagent:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa thuốc thử');
    }
  };

  const handleReagentChange = (field: keyof Reagent, value: any) => {
    setEditingReagent(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingReagent({});
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý Thuốc thử
        </h1>
        <p className="text-gray-600">
          Quản lý và theo dõi thuốc thử trong phòng xét nghiệm
        </p>
      </div>

      <ReagentToolbar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onAddClick={handleAddReagent}
      />

      <ReagentTable
        reagents={filteredReagents}
        isLoading={isLoading}
        onView={handleViewDetails}
        onEdit={handleEditReagent}
        onDelete={handleDeleteReagent}
      />

      <ReagentFormModal
        isOpen={isAddModalOpen || isEditModalOpen}
        isEdit={isEditModalOpen}
        reagent={editingReagent}
        onClose={handleCloseForm}
        onSave={handleSaveReagent}
        onChange={handleReagentChange}
      />

      <ReagentDetailModal
        isOpen={isDetailModalOpen}
        reagent={selectedReagent}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ReagentDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        reagent={selectedReagent}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedReagent(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ReagentManagementPage;
