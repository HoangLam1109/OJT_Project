import React, { useState, useEffect } from 'react';
import { mockReagents, type Reagent } from './data/mockReagentsData';
import { useAuthContext } from '../../hooks/useAuthContext';
import ReagentToolbar from './components/ReagentToolbar';
import ReagentTable from './components/ReagentTable';
import ReagentFormModal from './components/modals/ReagentFormModal';
import ReagentDetailModal from './components/modals/ReagentDetailModal';
import ReagentDeleteConfirmModal from './components/modals/ReagentDeleteConfirmModal';
import { filterReagents } from './utils/reagentUtils';

const ReagentManagementPage: React.FC = () => {
  const { user } = useAuthContext();
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [filteredReagents, setFilteredReagents] = useState<Reagent[]>(mockReagents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [editingReagent, setEditingReagent] = useState<Partial<Reagent>>({});

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

  const handleViewDetails = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsDetailModalOpen(true);
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsDeleteModalOpen(true);
  };

  const handleSaveReagent = () => {
    if (!editingReagent.name || !editingReagent.lotNumber || !editingReagent.quantity || !editingReagent.expiryDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const existingReagent = reagents.find(reagent => 
      reagent.lotNumber === editingReagent.lotNumber && reagent.id !== editingReagent.id
    );
    if (existingReagent) {
      alert('Số lô đã tồn tại');
      return;
    }

    const expiryDate = new Date(editingReagent.expiryDate);
    const currentDate = new Date();
    if (expiryDate <= currentDate) {
      alert('Ngày hết hạn phải sau ngày hiện tại');
      return;
    }

    if (editingReagent.quantity! < 1) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    if (editingReagent.id) {
      const updatedReagent = {
        ...editingReagent,
        updatedAt: new Date().toISOString()
      } as Reagent;
      
      setReagents(prev => prev.map(reagent => reagent.id === editingReagent.id ? updatedReagent : reagent));
      console.log(`[AUDIT] E_00027 | Reagent modified by ${user?.name}`);
    } else {
      const newReagent: Reagent = {
        id: `RG-${String(reagents.length + 1).padStart(3, '0')}`,
        name: editingReagent.name!,
        lotNumber: editingReagent.lotNumber!,
        manufacturer: editingReagent.manufacturer,
        receivedDate: editingReagent.receivedDate || new Date().toISOString().split('T')[0],
        expiryDate: editingReagent.expiryDate!,
        quantity: editingReagent.quantity!,
        status: editingReagent.status || 'Available',
        storageLocation: editingReagent.storageLocation || '',
        usedInTests: [],
        notes: editingReagent.notes,
        createdBy: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReagents(prev => [...prev, newReagent]);
      console.log(`[AUDIT] E_00026 | Reagent created by ${user?.name}`);
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingReagent({});
  };

  const handleDeleteConfirm = () => {
    if (selectedReagent) {
      setReagents(prev => prev.filter(reagent => reagent.id !== selectedReagent.id));
      console.log(`[AUDIT] E_00028 | Reagent deleted by ${user?.name}`);
      setIsDeleteModalOpen(false);
      setSelectedReagent(null);
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
