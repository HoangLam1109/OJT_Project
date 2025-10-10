import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/common/card';
import { Button } from '../components/common/button';
import { Input } from '../components/common/input';
import { Label } from '../components/common/label';
import {
  Plus,
  Search,
  Edit,
  Lock,
  Unlock,
  Trash2,
  UserIcon,
  Phone,
  Shield,
  Activity,
  FileText
} from 'lucide-react';
import type { User } from '../App';

interface UserManagementProps {
  currentUser: User;
  onNavigateToAddUser?: () => void;
}

// Mock user data phù hợp với database schema
const mockUsers: User[] = [
  {
    id: 'usr001',
    name: 'TS. Sarah Wilson',
    email: 'sarah.wilson@lab.com',
    role: 'admin',
    active: true,
    lastLogin: '2024-10-08 09:30:00',
    permissions: ['all'],
    phone_number: '+84-901-234-567',
    identify_number: '079089001234',
    gender: 'female',
    age: 35,
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    date_of_birth: '1989-03-15'
  },
  {
    id: 'usr002',
    name: 'KTV. Mike Johnson',
    email: 'mike.johnson@lab.com',
    role: 'technician',
    active: true,
    lastLogin: '2024-10-08 08:15:00',
    permissions: ['perform_tests', 'update_results'],
    phone_number: '+84-902-345-678',
    identify_number: '079089005678',
    gender: 'male',
    age: 28,
    address: '456 Phố Huế, Hai Bà Trưng, Hà Nội',
    date_of_birth: '1996-07-22'
  },
  {
    id: 'usr003',
    name: 'CN. Lisa Chen',
    email: 'lisa.chen@lab.com',
    role: 'lab_user',
    active: false,
    lastLogin: '2024-10-07 17:45:00',
    permissions: ['perform_tests', 'view_samples'],
    phone_number: '+84-903-456-789',
    identify_number: '079089009012',
    gender: 'female',
    age: 26,
    address: '789 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    date_of_birth: '1998-11-30'
  },
  {
    id: 'usr004',
    name: 'ThS. David Kim',
    email: 'david.kim@lab.com',
    role: 'laboratory_manager',
    active: true,
    lastLogin: '2024-10-08 07:30:00',
    permissions: ['manage_lab', 'view_reports'],
    phone_number: '+84-904-567-890',
    identify_number: '079089003456',
    gender: 'male',
    age: 42,
    address: '321 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    date_of_birth: '1982-05-18'
  }
];

const roles = [
  { id: 'admin', name: 'Quản trị viên', description: 'Toàn quyền truy cập hệ thống' },
  { id: 'laboratory_manager', name: 'Trưởng phòng Lab', description: 'Quản lý hoạt động phòng thí nghiệm' },
  { id: 'technician', name: 'Kỹ thuật viên', description: 'Thực hiện xét nghiệm và cập nhật kết quả' },
  { id: 'lab_user', name: 'Nhân viên Lab', description: 'Hoạt động cơ bản trong phòng thí nghiệm' },
  { id: 'service', name: 'Nhân viên Dịch vụ', description: 'Bảo trì và hỗ trợ kỹ thuật' },
  { id: 'normal_user', name: 'Bệnh nhân', description: 'Chỉ xem kết quả cá nhân' }
];

export function UserManagementPage({ currentUser, onNavigateToAddUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('users');

  const tabs = [
    { id: 'users', label: 'Người dùng', icon: UserIcon },
    { id: 'roles', label: 'Vai trò & Quyền', icon: Shield },
    { id: 'sessions', label: 'Phiên đăng nhập', icon: Activity },
    { id: 'audit', label: 'Nhật ký kiểm toán', icon: FileText }
  ];

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      laboratory_manager: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800',
      lab_user: 'bg-yellow-100 text-yellow-800',
      service: 'bg-purple-100 text-purple-800',
      normal_user: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.normal_user;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng, vai trò và quyền hạn</p>
        </div>
        <Button onClick={onNavigateToAddUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
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
      {activeTab === 'users' && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tất cả vai trò</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Người dùng ({filteredUsers.length})</CardTitle>
              <CardDescription>Quản lý người dùng hệ thống và cấp độ truy cập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-900">Người dùng</th>
                      <th className="text-left p-4 font-medium text-gray-900">Vai trò</th>
                      <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-gray-900">Đăng nhập cuối</th>
                      <th className="text-left p-4 font-medium text-gray-900">Liên hệ</th>
                      <th className="text-center p-4 font-medium text-gray-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {roles.find(r => r.id === user.role)?.name || user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Hoạt động' : 'Ngưng hoạt động'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Chưa bao giờ'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {user.phone_number && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone_number}</span>
                              </div>
                            )}
                            {user.identify_number && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <UserIcon className="h-3 w-3" />
                                <span>{user.identify_number}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={user.active ? 'text-red-600' : 'text-green-600'}
                            >
                              {user.active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                            {currentUser.role === 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle>Vai trò & Quyền hạn</CardTitle>
            <CardDescription>Quản lý vai trò và phân quyền hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <CardTitle>Phiên đăng nhập đang hoạt động</CardTitle>
            <CardDescription>Quản lý các phiên đăng nhập người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tính năng đang phát triển</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle>Nhật ký kiểm toán</CardTitle>
            <CardDescription>Theo dõi các hoạt động của người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Tính năng đang phát triển</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setShowEditModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave }: { 
  user: User; 
  onClose: () => void; 
  onSave: (user: User) => void; 
}) {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information and settings</CardDescription>
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
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({...formData, active: e.target.value === 'active'})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identify">ID Number</Label>
                <Input
                  id="identify"
                  value={formData.identify_number || ''}
                  onChange={(e) => setFormData({...formData, identify_number: e.target.value})}
                />
              </div>
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