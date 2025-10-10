import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/common/card';
import Button from '../components/common/button';
import { Input } from '../components/common/input';
import { Label } from '../components/common/label';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard
} from 'lucide-react';
import type { User } from '../types';

interface AddUserPageProps {
  onBack: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
}

const roles = [
  { id: 'admin', name: 'Quản trị viên', description: 'Toàn quyền truy cập hệ thống' },
  { id: 'laboratory_manager', name: 'Trưởng phòng Lab', description: 'Quản lý hoạt động phòng thí nghiệm' },
  { id: 'technician', name: 'Kỹ thuật viên', description: 'Thực hiện xét nghiệm và cập nhật kết quả' },
  { id: 'lab_user', name: 'Nhân viên Lab', description: 'Hoạt động cơ bản trong phòng thí nghiệm' },
  { id: 'service', name: 'Nhân viên Dịch vụ', description: 'Bảo trì và hỗ trợ kỹ thuật' },
  { id: 'normal_user', name: 'Bệnh nhân', description: 'Chỉ xem kết quả cá nhân' }
];

export function AddUserPage({ onBack, onSave }: AddUserPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'lab_user' as User['role'],
    phone_number: '',
    identify_number: '',
    gender: '',
    age: 0,
    address: '',
    date_of_birth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Họ tên là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.identify_number.trim()) newErrors.identify_number = 'Số CMND/CCCD là bắt buộc';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Số điện thoại là bắt buộc';
    if (!formData.gender) newErrors.gender = 'Giới tính là bắt buộc';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc';
    if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';

    // Tính tuổi từ ngày sinh
    if (formData.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(formData.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        active: true,
        permissions: ['basic'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thêm người dùng mới</h1>
            <p className="text-gray-600 mt-1">Tạo tài khoản người dùng mới trong hệ thống</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
              <CardDescription>Nhập thông tin cơ bản của người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập họ và tên đầy đủ"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@lab.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="+84-xxx-xxx-xxx"
                    className={`pl-10 ${errors.phone_number ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="identify">Số CMND/CCCD *</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="identify"
                    value={formData.identify_number}
                    onChange={(e) => setFormData({...formData, identify_number: e.target.value})}
                    placeholder="079089001234"
                    className={`pl-10 ${errors.identify_number ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.identify_number && <p className="text-sm text-red-600">{errors.identify_number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính *</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.gender ? 'border-red-500' : ''}`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                  {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className={`pl-10 ${errors.date_of_birth ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.date_of_birth && <p className="text-sm text-red-600">{errors.date_of_birth}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Nhập địa chỉ đầy đủ"
                    rows={3}
                    className={`w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Thông tin tài khoản */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Cấu hình quyền truy cập và mật khẩu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-600">
                  {roles.find(r => r.id === formData.role)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Chính sách mật khẩu</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Tối thiểu 6 ký tự</li>
                  <li>• Nên bao gồm chữ hoa, chữ thường và số</li>
                  <li>• Mật khẩu sẽ hết hạn sau 90 ngày</li>
                  <li>• Không được trùng với 5 mật khẩu gần nhất</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Hủy
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Tạo người dùng
          </Button>
        </div>
      </form>
    </div>
  );
}