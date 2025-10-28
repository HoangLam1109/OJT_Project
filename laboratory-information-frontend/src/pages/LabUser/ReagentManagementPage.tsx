import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter,
  FlaskConical,
  Package,
  AlertTriangle
} from 'lucide-react';
import { mockReagents, mockTestOrders, mockAuditLogs, type Reagent } from './data/mockReagentsData';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/common/table';

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


  // Filter reagents based on search and status
  useEffect(() => {
    let filtered = reagents;

    if (searchTerm) {
      filtered = filtered.filter(reagent =>
        reagent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reagent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reagent.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reagent.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(reagent => reagent.status === statusFilter);
    }

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

    // Check for duplicate lot number
    const existingReagent = reagents.find(reagent => 
      reagent.lotNumber === editingReagent.lotNumber && reagent.id !== editingReagent.id
    );
    if (existingReagent) {
      alert('Số lô đã tồn tại');
      return;
    }

    // Validate expiry date
    const expiryDate = new Date(editingReagent.expiryDate);
    const currentDate = new Date();
    if (expiryDate <= currentDate) {
      alert('Ngày hết hạn phải sau ngày hiện tại');
      return;
    }

    // Validate quantity
    if (editingReagent.quantity! < 1) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    if (editingReagent.id) {
      // Update existing reagent
      const updatedReagent = {
        ...editingReagent,
        updatedAt: new Date().toISOString()
      } as Reagent;
      
      setReagents(prev => prev.map(reagent => reagent.id === editingReagent.id ? updatedReagent : reagent));
      console.log(`[AUDIT] E_00027 | Reagent modified by ${user?.name}`);
    } else {
      // Add new reagent
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

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Available: 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      Expired: 'bg-red-100 text-red-800',
      'In Use': 'bg-blue-100 text-blue-800'
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

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const getRowClassName = (reagent: Reagent) => {
    if (isExpired(reagent.expiryDate)) {
      return 'bg-red-50';
    } else if (isExpiringSoon(reagent.expiryDate)) {
      return 'bg-yellow-50';
    }
    return 'hover:bg-gray-50';
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

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, tên, số lô hoặc nhà sản xuất..."
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
                <option value="Available">Có sẵn</option>
                <option value="Low Stock">Sắp hết</option>
                <option value="Expired">Hết hạn</option>
                <option value="In Use">Đang sử dụng</option>
              </select>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddReagent}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm thuốc thử mới
          </button>
        </div>
      </div>

      {/* Reagents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Thuốc Thử
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Thuốc Thử
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Lô
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạn Dùng
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Lượng
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vị Trí Lưu
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReagents.map((reagent) => (
              <TableRow key={reagent.id} className={getRowClassName(reagent)}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-blue-500" />
                    {reagent.id}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reagent.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reagent.lotNumber}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    {isExpired(reagent.expiryDate) && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    {isExpiringSoon(reagent.expiryDate) && !isExpired(reagent.expiryDate) && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {formatDate(reagent.expiryDate)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-500" />
                    {reagent.quantity}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(reagent.status)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reagent.storageLocation}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(reagent)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditReagent(reagent)}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReagent(reagent)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Xóa thuốc thử"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                {isAddModalOpen ? 'Thêm thuốc thử mới' : 'Chỉnh sửa thuốc thử'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên thuốc thử *
                  </label>
                  <input
                    type="text"
                    value={editingReagent.name || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lô *
                  </label>
                  <input
                    type="text"
                    value={editingReagent.lotNumber || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, lotNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={editingReagent.manufacturer || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, manufacturer: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày nhập
                  </label>
                  <input
                    type="date"
                    value={editingReagent.receivedDate || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, receivedDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn *
                  </label>
                  <input
                    type="date"
                    value={editingReagent.expiryDate || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingReagent.quantity || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí lưu trữ
                  </label>
                  <input
                    type="text"
                    value={editingReagent.storageLocation || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, storageLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={editingReagent.status || 'Available'}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Available">Có sẵn</option>
                    <option value="Low Stock">Sắp hết</option>
                    <option value="Expired">Hết hạn</option>
                    <option value="In Use">Đang sử dụng</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={editingReagent.notes || ''}
                    onChange={(e) => setEditingReagent(prev => ({ ...prev, notes: e.target.value }))}
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
                    setEditingReagent({});
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveReagent}
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
      {isDetailModalOpen && selectedReagent && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Chi tiết thuốc thử: {selectedReagent.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Mã thuốc thử:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Tên thuốc thử:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Số lô:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.lotNumber}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Nhà sản xuất:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.manufacturer || 'Không có'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày nhập:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedReagent.receivedDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ngày hết hạn:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedReagent.expiryDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Số lượng:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.quantity}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Trạng thái:</span>
                      <span className="ml-2">{getStatusBadge(selectedReagent.status)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Vị trí lưu trữ:</span>
                      <span className="ml-2 text-gray-900">{selectedReagent.storageLocation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin sử dụng</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Đơn xét nghiệm liên kết:</span>
                      <div className="ml-2">
                        {selectedReagent.usedInTests.length > 0 ? (
                          <div className="space-y-1">
                            {selectedReagent.usedInTests.map(testId => {
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
                        {selectedReagent.notes || 'Không có ghi chú'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Lịch sử hoạt động gần đây</h3>
                <div className="space-y-2">
                  {mockAuditLogs
                    .filter(log => log.reagentId === selectedReagent.id)
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedReagent && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Xác nhận xóa thuốc thử
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Bạn có chắc muốn xóa thuốc thử này?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedReagent.name}</p>
                  <p className="text-sm text-gray-600">Số lô: {selectedReagent.lotNumber}</p>
                  <p className="text-sm text-gray-600">Mã: {selectedReagent.id}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedReagent(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReagentManagementPage;
