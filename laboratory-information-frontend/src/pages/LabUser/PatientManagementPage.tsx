import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/card';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Edit2,
  UserPlus,
  User,
  FileText,
  Activity,
  X,
  Save
} from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  PatientAPI, 
  type Patient, 
  type TestOrder, 
  type AuditLog 
} from './data/mockPatientsData';

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800' },
    Processing: { color: 'bg-blue-100 text-blue-800' },
    Completed: { color: 'bg-green-100 text-green-800' },
    Reviewed: { color: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {status}
    </span>
  );
};

// Patient Form Modal (Create/Edit)
const PatientFormModal: React.FC<{
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: Omit<Patient, 'id' | 'createdAt' | 'createdBy'> | Partial<Patient>) => void;
  isEdit: boolean;
}> = ({ patient, isOpen, onClose, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phoneNumber: '',
    email: '',
    address: '',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient && isEdit) {
      setFormData({
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        phoneNumber: patient.phoneNumber,
        email: patient.email || '',
        address: patient.address || '',
        medicalHistory: patient.medicalHistory || ''
      });
    } else {
      setFormData({
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        phoneNumber: '',
        email: '',
        address: '',
        medicalHistory: ''
      });
    }
  }, [patient, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ và tên là bắt buộc';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    
    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    // Email validation (optional)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Chỉnh sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={errors.fullName ? 'border-red-500' : ''}
                  placeholder="Nhập họ và tên đầy đủ"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="text-sm font-medium">
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500' : ''
                  }`}
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                  placeholder="0901234567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <Label htmlFor="medicalHistory" className="text-sm font-medium">
                  Tiền sử bệnh lý
                </Label>
                <textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Nhập tiền sử bệnh lý, dị ứng..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Patient Detail Modal
const PatientDetailModal: React.FC<{
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ patient, isOpen, onClose }) => {
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      loadPatientDetails();
    }
  }, [isOpen, patient]);

  const loadPatientDetails = async () => {
    if (!patient) return;
    
    setLoading(true);
    try {
      const [orders, logs] = await Promise.all([
        PatientAPI.getPatientTestOrders(patient.id),
        PatientAPI.getPatientAuditLogs(patient.id)
      ]);
      setTestOrders(orders);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error loading patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Chi tiết bệnh nhân</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Mã bệnh nhân</Label>
                  <p className="text-lg font-semibold">{patient.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Họ và tên</Label>
                  <p className="text-lg">{patient.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                  <p className="text-lg">{patient.dateOfBirth}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                  <p className="text-lg">{patient.gender === 'Male' ? 'Nam' : patient.gender === 'Female' ? 'Nữ' : 'Khác'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Số điện thoại</Label>
                  <p className="text-lg">{patient.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-lg">{patient.email || 'Chưa cập nhật'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                  <p className="text-lg">{patient.address || 'Chưa cập nhật'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Tiền sử bệnh lý</Label>
                  <p className="text-lg">{patient.medicalHistory || 'Không có'}</p>
                </div>
              </div>
            </div>

            {/* Test Orders */}
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Lệnh xét nghiệm ({testOrders.length})
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : testOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chưa có lệnh xét nghiệm nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã lệnh</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại xét nghiệm</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{order.testType}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{order.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Audit Logs */}
            <div>
              <h3 className="font-medium mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Lịch sử hoạt động ({auditLogs.length})
              </h3>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Chưa có hoạt động nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {log.performedBy} - {new Date(log.performedAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Patient Table Component
const PatientTable: React.FC<{
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}> = ({ patients, onView, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã BN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Họ và tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày sinh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giới tính
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SĐT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {patient.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.dateOfBirth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.gender === 'Male' ? 'Nam' : patient.gender === 'Female' ? 'Nữ' : 'Khác'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.phoneNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(patient)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(patient)}
                    className="text-green-600 hover:text-green-900"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Delete button hidden for Lab User as per SRS */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const PatientManagementPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Role validation
  useEffect(() => {
    if (user && user.role !== 'LAB_USER') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Filter patients when search or gender changes
  useEffect(() => {
    let filtered = patients;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm)
      );
    }

    // Filter by gender
    if (genderFilter !== 'All') {
      filtered = filtered.filter(patient => patient.gender === genderFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, genderFilter]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await PatientAPI.fetchPatients();
      setPatients(data);
    } catch (error) {
      toast.error('Không thể tải danh sách bệnh nhân');
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPatient(null);
    setIsEdit(false);
    setFormModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEdit(true);
    setFormModalOpen(true);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailModalOpen(true);
    console.log(`[AUDIT] E_00015 | Patient viewed by ${user?.name || 'Lab User'}`);
  };

  const handleFormSubmit = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'createdBy'> | Partial<Patient>) => {
    try {
      if (isEdit && selectedPatient) {
        await PatientAPI.updatePatient(selectedPatient.id, patientData);
        toast.success('Đã cập nhật thông tin bệnh nhân thành công');
      } else {
        const result = await PatientAPI.createPatient(patientData as Omit<Patient, 'id' | 'createdAt' | 'createdBy'>);
        toast.success(`Đã tạo hồ sơ bệnh nhân thành công với mã: ${result.id}`);
      }
      setFormModalOpen(false);
      await loadPatients(); // Reload data and wait for completion
    } catch (error) {
      toast.error('Không thể lưu thông tin bệnh nhân');
      console.error('Error saving patient:', error);
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
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý hồ sơ bệnh nhân</h1>
          <p className="text-gray-600">Tạo, xem và quản lý thông tin bệnh nhân</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleCreate} className="flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Thêm bệnh nhân
          </Button>
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">
              {filteredPatients.length} / {patients.length} bệnh nhân
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
                  placeholder="Tìm theo tên, mã BN, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="md:w-48">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Giới tính
              </Label>
              <select
                id="gender"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">Tất cả</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Danh sách bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bệnh nhân</h3>
              <p className="text-gray-500">
                {searchTerm || genderFilter !== 'All' 
                  ? 'Không tìm thấy bệnh nhân phù hợp với bộ lọc'
                  : 'Chưa có bệnh nhân nào được tạo'
                }
              </p>
            </div>
          ) : (
            <PatientTable
              patients={filteredPatients}
              onView={handleView}
              onEdit={handleEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <PatientFormModal
        patient={selectedPatient}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isEdit={isEdit}
      />

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
};

export default PatientManagementPage;
