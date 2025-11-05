import React, { useState, useEffect } from 'react';
import { mockInstruments, type Instrument } from './data/mockInstrumentsData';
import { useAuthContext } from '../../hooks/useAuthContext';
import InstrumentTable from './components/InstrumentTable';
import InstrumentToolbar from './components/InstrumentToolbar';
import InstrumentFormModal from './components/modals/InstrumentFormModal';
import InstrumentDetailModal from './components/modals/InstrumentDetailModal';
import ExecuteTestModal from './components/modals/ExecuteTestModal';
import { getStatusBadge, formatDate, filterInstruments } from './utils/instrumentUtils';
import { Skeleton } from '@/components/common/skeleton';

const InstrumentManagementPage: React.FC = () => {
  const { user } = useAuthContext();
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>(mockInstruments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [editingInstrument, setEditingInstrument] = useState<Partial<Instrument>>({});
  const [selectedTestOrder, setSelectedTestOrder] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500); // Giả lập tải 1.5s
  return () => clearTimeout(timer);
}, []);


  const isLabUser = user?.role[0] === 'LAB_USER';

  // Filter instruments based on search and status
  useEffect(() => {
    const filtered = filterInstruments(instruments, searchTerm, statusFilter);
    setFilteredInstruments(filtered);
  }, [instruments, searchTerm, statusFilter]);

  const handleAddInstrument = () => {
    setEditingInstrument({});
    setIsAddModalOpen(true);
  };

  const handleEditInstrument = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsDetailModalOpen(true);
  };

  const handleExecuteTest = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsExecuteModalOpen(true);
  };

  const handleToggleStatus = (instrument: Instrument) => {
    const newStatus: "Active" | "Inactive" | "Maintenance" = instrument.status === 'Active' ? 'Inactive' : 'Active';
    const updatedInstrument = { ...instrument, status: newStatus, updatedAt: new Date().toISOString() };
    
    setInstruments(prev => prev.map(inst => inst.id === instrument.id ? updatedInstrument : inst));
    
    // Audit log
    console.log(`[AUDIT] E_00023 | Instrument ${instrument.id} ${newStatus.toLowerCase()}d by ${user?.name}`);
  };

  const handleSaveInstrument = () => {
    if (!editingInstrument.name || !editingInstrument.model || !editingInstrument.serial) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Check for duplicate serial
    const existingInstrument = instruments.find(inst => 
      inst.serial === editingInstrument.serial && inst.id !== editingInstrument.id
    );
    if (existingInstrument) {
      alert('Số seri đã tồn tại');
      return;
    }

    if (editingInstrument.id) {
      // Update existing instrument
      const updatedInstrument = {
        ...editingInstrument,
        updatedAt: new Date().toISOString()
      } as Instrument;
      
      setInstruments(prev => prev.map(inst => inst.id === editingInstrument.id ? updatedInstrument : inst));
      console.log(`[AUDIT] E_00022 | Instrument updated`);
    } else {
      // Add new instrument
      const newInstrument: Instrument = {
        id: `INS-${String(instruments.length + 1).padStart(3, '0')}`,
        name: editingInstrument.name!,
        model: editingInstrument.model!,
        serial: editingInstrument.serial!,
        status: editingInstrument.status || 'Active',
        lastCalibrationDate: editingInstrument.lastCalibrationDate || new Date().toISOString().split('T')[0],
        nextMaintenanceDate: editingInstrument.nextMaintenanceDate,
        assignedTests: [],
        assignedTechnician: editingInstrument.assignedTechnician,
        notes: editingInstrument.notes,
        createdBy: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setInstruments(prev => [...prev, newInstrument]);
      console.log(`[AUDIT] E_00021 | Instrument created`);
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingInstrument({});
  };

  const handleExecuteTestConfirm = () => {
    if (!selectedInstrument || !selectedTestOrder) {
      alert('Vui lòng chọn đơn xét nghiệm');
      return;
    }

    const updatedInstrument = {
      ...selectedInstrument,
      lastUsedDate: new Date().toISOString(),
      assignedTests: [...selectedInstrument.assignedTests, selectedTestOrder],
      updatedAt: new Date().toISOString()
    };

    setInstruments(prev => prev.map(inst => inst.id === selectedInstrument.id ? updatedInstrument : inst));
    console.log(`[AUDIT] E_00025 | Instrument ${selectedInstrument.id} executed blood testing by ${user?.name}`);
    
    setIsExecuteModalOpen(false);
    setSelectedTestOrder('');
    alert('Thực hiện xét nghiệm thành công!');
  };

  const handleInstrumentChange = (field: keyof Instrument, value: any) => {
    setEditingInstrument(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingInstrument({});
  };
  if (loading) {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Skeleton Header */}
      <div>
        <Skeleton className="h-8 w-80 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Skeleton Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-40 ml-auto" />
      </div>

      {/* Skeleton Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-100 px-4 py-3 font-medium text-gray-600 text-sm">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 px-4 py-3 border-t text-sm text-gray-700"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}


  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý Thiết bị Phòng Xét Nghiệm
        </h1>
        <p className="text-gray-600">
          Quản lý và theo dõi trạng thái các thiết bị trong phòng xét nghiệm
        </p>
      </div>

      <InstrumentToolbar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onAddClick={handleAddInstrument}
      />

      <InstrumentTable
        instruments={filteredInstruments}
        onView={handleViewDetails}
        onEdit={handleEditInstrument}
        onToggleStatus={handleToggleStatus}
        onExecuteTest={handleExecuteTest}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
        isLabUser={isLabUser}
      />

      <InstrumentFormModal
        isOpen={isAddModalOpen || isEditModalOpen}
        isEdit={isEditModalOpen}
        instrument={editingInstrument}
        onClose={handleCloseForm}
        onSave={handleSaveInstrument}
        onChange={handleInstrumentChange}
      />

      <InstrumentDetailModal
        isOpen={isDetailModalOpen}
        instrument={selectedInstrument}
        onClose={() => setIsDetailModalOpen(false)}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />

      <ExecuteTestModal
        isOpen={isExecuteModalOpen}
        instrument={selectedInstrument}
        selectedTestOrder={selectedTestOrder}
        onClose={() => {
          setIsExecuteModalOpen(false);
          setSelectedTestOrder('');
        }}
        onConfirm={handleExecuteTestConfirm}
        onTestOrderChange={setSelectedTestOrder}
      />
    </div>
  );
};

export default InstrumentManagementPage;
