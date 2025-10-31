import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Eye, 
  Edit2, 
  ToggleLeft, 
  PlayCircle, 
  Wrench, 
  Filter
} from 'lucide-react';
import { mockInstruments, mockTestOrders, mockAuditLogs, type Instrument } from './data/mockInstrumentsData';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/common/table';

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

  const isLabUser = user?.role[0] === 'LAB_USER';

  // Filter instruments based on search and status
  useEffect(() => {
    let filtered = instruments;

    if (searchTerm) {
      filtered = filtered.filter(instrument =>
        instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.serial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(instrument => instrument.status === statusFilter);
    }

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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Maintenance: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, model, số seri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Maintenance">Bảo trì</option>
              </select>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddInstrument}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm thiết bị mới
          </button>
        </div>
      </div>

      {/* Instruments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Thiết Bị
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Thiết Bị
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Seri
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Hiệu Chuẩn
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Cập Nhật
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstruments.map((instrument) => (
              <TableRow key={instrument.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {instrument.id}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {instrument.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {instrument.model}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {instrument.serial}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(instrument.status)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(instrument.lastCalibrationDate)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(instrument.updatedAt)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(instrument)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditInstrument(instrument)}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(instrument)}
                      className={`p-1 rounded ${
                        instrument.status === 'Active' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={instrument.status === 'Active' ? 'Tắt' : 'Bật'}
                    >
                      <ToggleLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExecuteTest(instrument)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded"
                      title="Thực hiện xét nghiệm"
                    >
                      <PlayCircle className="w-4 h-4" />
                    </button>
                    {!isLabUser && (
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Xóa thiết bị"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                    )}
                    {isLabUser && (
                      <div className="relative group">
                        <button
                          disabled
                          className="text-gray-400 p-1 rounded cursor-not-allowed"
                          title="Không có quyền xóa thiết bị"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isAddModalOpen ? 'Thêm thiết bị mới' : 'Chỉnh sửa thiết bị'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên thiết bị *
                  </label>
                  <input
                    type="text"
                    value={editingInstrument.name || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={editingInstrument.model || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số seri *
                  </label>
                  <input
                    type="text"
                    value={editingInstrument.serial || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, serial: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={editingInstrument.status || 'Active'}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                    <option value="Maintenance">Bảo trì</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hiệu chuẩn
                  </label>
                  <input
                    type="date"
                    value={editingInstrument.lastCalibrationDate || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, lastCalibrationDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bảo trì tiếp theo
                  </label>
                  <input
                    type="date"
                    value={editingInstrument.nextMaintenanceDate || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, nextMaintenanceDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỹ thuật viên phụ trách
                  </label>
                  <input
                    type="text"
                    value={editingInstrument.assignedTechnician || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, assignedTechnician: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={editingInstrument.notes || ''}
                    onChange={(e) => setEditingInstrument(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingInstrument({});
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveInstrument}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedInstrument && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Chi tiết thiết bị: {selectedInstrument.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Mã thiết bị:</span>
                      <span className="ml-2 text-gray-900">{selectedInstrument.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Tên thiết bị:</span>
                      <span className="ml-2 text-gray-900">{selectedInstrument.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Model:</span>
                      <span className="ml-2 text-gray-900">{selectedInstrument.model}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Số seri:</span>
                      <span className="ml-2 text-gray-900">{selectedInstrument.serial}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Trạng thái:</span>
                      <span className="ml-2">{getStatusBadge(selectedInstrument.status)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày hiệu chuẩn:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedInstrument.lastCalibrationDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày bảo trì tiếp theo:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedInstrument.nextMaintenanceDate ? formatDate(selectedInstrument.nextMaintenanceDate) : 'Chưa xác định'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Kỹ thuật viên phụ trách:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedInstrument.assignedTechnician || 'Chưa phân công'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin bổ sung</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Ngày sử dụng cuối:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedInstrument.lastUsedDate ? formatDate(selectedInstrument.lastUsedDate) : 'Chưa sử dụng'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Đơn xét nghiệm liên kết:</span>
                      <div className="ml-2">
                        {selectedInstrument.assignedTests.length > 0 ? (
                          <div className="space-y-1">
                            {selectedInstrument.assignedTests.map(testId => {
                              const testOrder = mockTestOrders.find(order => order.id === testId);
                              return (
                                <div key={testId} className="text-sm text-gray-900">
                                  {testId} - {testOrder?.patientName} ({testOrder?.testType})
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-500">Chưa có</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ghi chú:</span>
                      <p className="ml-2 text-gray-900 mt-1">
                        {selectedInstrument.notes || 'Không có ghi chú'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Lịch sử hoạt động gần đây</h3>
                <div className="space-y-2">
                  {mockAuditLogs
                    .filter(log => log.instrumentId === selectedInstrument.id)
                    .slice(0, 3)
                    .map(log => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-800">{log.action}</span>
                          <span className="text-gray-600 ml-2">- {log.details}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execute Test Modal */}
      {isExecuteModalOpen && selectedInstrument && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thực hiện xét nghiệm
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Thiết bị: <span className="font-medium">{selectedInstrument.name}</span>
                </p>
                <p className="text-gray-600">
                  Model: <span className="font-medium">{selectedInstrument.model}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn đơn xét nghiệm
                </label>
                <select
                  value={selectedTestOrder}
                  onChange={(e) => setSelectedTestOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn đơn xét nghiệm --</option>
                  {mockTestOrders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.id} - {order.patientName} ({order.testType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsExecuteModalOpen(false);
                    setSelectedTestOrder('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleExecuteTestConfirm}
                  disabled={!selectedTestOrder}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Xác nhận thực hiện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstrumentManagementPage;
