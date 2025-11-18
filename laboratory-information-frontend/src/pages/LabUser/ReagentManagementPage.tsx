import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [reagents, searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredReagents.length / itemsPerPage);
  }, [filteredReagents.length, itemsPerPage]);

  const paginatedReagents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReagents.slice(startIndex, endIndex);
  }, [filteredReagents, currentPage, itemsPerPage]);

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
    } else {
      // For updates, check if lot number is being changed
      const originalReagent = reagents.find(reagent => reagent.id === editingReagent.id);
      if (originalReagent && originalReagent.lotNumber !== editingReagent.lotNumber) {
        toast.error('Không thể thay đổi số lô thuốc thử');
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
        // Update existing reagent
        const updatedReagent = await reagentService.updateReagent(
          editingReagent.id,
          editingReagent,
          user?.id
        );
        setReagents(prev => prev.map(reagent => reagent.id === editingReagent.id ? updatedReagent : reagent));
        toast.success('Cập nhật thuốc thử thành công');
        console.log(`[AUDIT] E_00027 | Reagent modified by ${user?.name}`);
        
        setIsEditModalOpen(false);
        setEditingReagent({});
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
      } else if (errorMessage.includes('quantity_current') && errorMessage.includes('lớn hơn')) {
        toast.error('Số lượng hiện tại không được lớn hơn số lượng đã nhận');
      } else if (errorMessage.includes('validation') || errorMessage.includes('required')) {
        toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.');
      } else if (errorMessage.includes('not found') || errorMessage.includes('không tìm thấy')) {
        toast.error('Không tìm thấy thuốc thử để cập nhật');
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
        reagents={paginatedReagents}
        isLoading={isLoading}
        onView={handleViewDetails}
        onEdit={handleEditReagent}
        onDelete={handleDeleteReagent}
      />

      {/* Pagination */}
      {filteredReagents.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            // Show first page, last page, current page, and pages around current
            // If totalPages <= 7, show all pages
            const showAllPages = totalPages <= 7;
            const showPage =
              showAllPages ||
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
            
            if (!showPage) {
              // Show ellipsis
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={pageNum} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                className={`px-4 py-2 rounded-lg border transition ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pagination info */}
      {filteredReagents.length > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredReagents.length)} trong tổng số {filteredReagents.length} thuốc thử
        </div>
      )}

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
