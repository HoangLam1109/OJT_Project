import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../components/common/card';
import Button from '../../../../components/common/button';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import {
  Plus,
  Search,
  Edit,
  Eye,
  FileText,
  UserIcon,
  Phone,
  Calendar,
  MapPin,
  TestTube2
} from 'lucide-react';
import type { Patient } from '../../../../types';

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0201',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    testHistory: [
      {
        id: 'T001',
        patientId: 'P001',
        testType: 'Complete Blood Count',
        orderDate: '2024-10-07',
        status: 'completed',
        sampleId: 'S001',
        results: 'Normal ranges',
        fee: 150,
        technician: 'Mike Johnson',
        completionDate: '2024-10-08'
      }
    ]
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0202',
    dateOfBirth: '1992-07-22',
    gender: 'Female',
    address: '456 Oak Ave, City, State 12345',
    testHistory: [
      {
        id: 'T002',
        patientId: 'P002',
        testType: 'Lipid Panel',
        orderDate: '2024-10-06',
        status: 'pending',
        fee: 120,
        technician: 'Lisa Chen'
      }
    ]
  },
  {
    id: 'P003',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0203',
    dateOfBirth: '1978-11-30',
    gender: 'Male',
    address: '789 Pine St, City, State 12345',
    testHistory: []
  }
];

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<string>('patients');

  const tabs = [
    { id: 'patients', label: 'Bệnh nhân', icon: UserIcon },
    { id: 'audit', label: 'Nhật ký kiểm toán', icon: FileText }
  ];

  // Filter patients based on search term and gender
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender === 'all' || patient.gender.toLowerCase() === selectedGender.toLowerCase();
    return matchesSearch && matchesGender;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      validated: 'bg-purple-100 text-purple-800',
      ai_reviewed: 'bg-indigo-100 text-indigo-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Bệnh nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý hồ sơ bệnh nhân và lịch sử xét nghiệm</p>
        </div>
        <Button onClick={() => setShowAddPatientModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm bệnh nhân
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'patients' && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm bệnh nhân theo ID, tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bệnh nhân ({filteredPatients.length})</CardTitle>
              <CardDescription>Xem và quản lý hồ sơ bệnh nhân</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-900">Bệnh nhân</th>
                      <th className="text-left p-4 font-medium text-gray-900">Liên hệ</th>
                      <th className="text-left p-4 font-medium text-gray-900">Thông tin cá nhân</th>
                      <th className="text-left p-4 font-medium text-gray-900">Lần khám cuối</th>
                      <th className="text-left p-4 font-medium text-gray-900">Lịch sử xét nghiệm</th>
                      <th className="text-center p-4 font-medium text-gray-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-600">ID: {patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="text-sm text-gray-600">{patient.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{patient.gender === 'Male' ? 'Nam' : patient.gender === 'Female' ? 'Nữ' : 'Khác'}, {calculateAge(patient.dateOfBirth)} tuổi</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-xs">{patient.address}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">
                            {patient.testHistory.length > 0 
                              ? new Date(patient.testHistory[patient.testHistory.length - 1].orderDate).toLocaleDateString('vi-VN')
                              : 'Chưa có lần khám'
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {patient.testHistory.length} xét nghiệm
                            </span>
                            {patient.testHistory.length > 0 && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                getStatusColor(patient.testHistory[patient.testHistory.length - 1].status)
                              }`}>
                                {patient.testHistory[patient.testHistory.length - 1].status === 'pending' ? 'Chờ xử lý' :
                                 patient.testHistory[patient.testHistory.length - 1].status === 'completed' ? 'Hoàn thành' :
                                 patient.testHistory[patient.testHistory.length - 1].status === 'in-progress' ? 'Đang thực hiện' :
                                 patient.testHistory[patient.testHistory.length - 1].status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowViewModal(true);
                              }}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowEditModal(true);
                              }}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600"
                              title="Tạo xét nghiệm mới"
                            >
                              <TestTube2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              title="Xem báo cáo"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle>Nhật ký kiểm toán - Bệnh nhân</CardTitle>
            <CardDescription>Theo dõi các thao tác liên quan đến hồ sơ bệnh nhân</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tính năng đang phát triển</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <AddPatientModal 
          onClose={() => setShowAddPatientModal(false)}
          onAdd={(newPatient) => {
            setPatients([...patients, { ...newPatient, id: `P${(patients.length + 1).toString().padStart(3, '0')}`, testHistory: [] }]);
            setShowAddPatientModal(false);
          }}
        />
      )}

      {/* Edit Patient Modal */}
      {showEditModal && selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPatient(null);
          }}
          onSave={(updatedPatient) => {
            setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
            setShowEditModal(false);
            setSelectedPatient(null);
          }}
        />
      )}

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <ViewPatientModal
          patient={selectedPatient}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}

// Add Patient Modal Component
function AddPatientModal({ onClose, onAdd }: { 
  onClose: () => void; 
  onAdd: (patient: Omit<Patient, 'id' | 'testHistory'>) => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>Register a new patient in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter patient's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="patient@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="+1-555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                placeholder="Full address"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Edit Patient Modal Component
function EditPatientModal({ patient, onClose, onSave }: { 
  patient: Patient; 
  onClose: () => void; 
  onSave: (patient: Patient) => void; 
}) {
  const [formData, setFormData] = useState({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    address: patient.address
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...patient, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Patient</CardTitle>
          <CardDescription>Update patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// View Patient Modal Component
function ViewPatientModal({ patient, onClose }: { 
  patient: Patient; 
  onClose: () => void; 
}) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      validated: 'bg-purple-100 text-purple-800',
      ai_reviewed: 'bg-indigo-100 text-indigo-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>Complete patient information and test history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient ID</label>
                  <p className="text-gray-900">{patient.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Demographics</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-gray-900">{calculateAge(patient.dateOfBirth)} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-900">{patient.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{patient.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Test History ({patient.testHistory.length})</h3>
            {patient.testHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Test ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Test Type</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Order Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Technician</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.testHistory.map((test, index) => (
                      <tr key={test.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 text-sm text-gray-900">{test.id}</td>
                        <td className="p-3 text-sm text-gray-900">{test.testType}</td>
                        <td className="p-3 text-sm text-gray-900">{new Date(test.orderDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-900">{test.technician || 'Not assigned'}</td>
                        <td className="p-3 text-sm text-gray-900">${test.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No test history available</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Test Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}