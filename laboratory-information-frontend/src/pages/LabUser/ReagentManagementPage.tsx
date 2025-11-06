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

  const handleSaveReagent = () => {
    toast.info('Chức năng tạo/cập nhật thuốc thử chưa được kích hoạt');
  };

  const handleDeleteConfirm = () => {
    toast.info('Chức năng xóa thuốc thử chưa được kích hoạt');
    setIsDeleteModalOpen(false);
    setSelectedReagent(null);
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
