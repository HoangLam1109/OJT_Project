import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/common/card';
import type { AdminUser, AdminUserFormData, AdminModalState } from '../types/AdminTypes';

interface AdminUserFormProps {
  mode: AdminModalState['mode'];
  user: AdminUser | null;
  onSubmit: (data: AdminUserFormData) => void;
  onCancel: () => void;
}

export function AdminUserForm({ mode, user, onSubmit, onCancel }: AdminUserFormProps) {
  const [formData, setFormData] = useState<AdminUserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
    phone_number: '',
    identify_number: '',
    gender: 'male',
    date_of_birth: '',
    age: 0,
    address: '',
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        fullName: user.name,
        email: user.email,
        password: '',
        role: user.role,
        phone_number: user.phone_number || '',
        identify_number: user.identify_number || '',
        gender: user.gender || 'male',
        date_of_birth: user.date_of_birth || '',
        age: user.age || 0,
        address: user.address || '',
        active: user.active,
      });
    }
  }, [user, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    if (!formData.identify_number.trim()) {
      newErrors.identify_number = 'Số CMND/CCCD là bắt buộc';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AdminUserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Tạo người dùng mới';
      case 'edit': return 'Chỉnh sửa người dùng';
      case 'view': return 'Chi tiết người dùng';
      default: return 'Người dùng';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'create': return 'Tạo tài khoản người dùng mới cho hệ thống';
      case 'edit': return 'Cập nhật thông tin người dùng';
      case 'view': return 'Xem thông tin chi tiết người dùng';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{getTitle()}</CardTitle>
              <CardDescription>{getDescription()}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 -mt-2 -mr-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={mode === 'view'}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={mode === 'view'}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USER">Người dùng</option>
                  <option value="LAB_USER">Nhân viên Lab</option>
                  <option value="SERVICE">Dịch vụ</option>
                  <option value="MANAGER">Quản lý</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Số điện thoại</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  disabled={mode === 'view'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="identify_number">Số CMND/CCCD *</Label>
                <Input
                  id="identify_number"
                  value={formData.identify_number}
                  onChange={(e) => handleInputChange('identify_number', e.target.value)}
                  disabled={mode === 'view'}
                  className={errors.identify_number ? 'border-red-500' : ''}
                />
                {errors.identify_number && (
                  <p className="text-sm text-red-600">{errors.identify_number}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Ngày sinh *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  disabled={mode === 'view'}
                  className={errors.date_of_birth ? 'border-red-500' : ''}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600">{errors.date_of_birth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Tuổi</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={mode === 'view'}
              />
            </div>

            {mode !== 'view' && (
              <div className="space-y-2">
                <Label htmlFor="active">Trạng thái</Label>
                <select
                  id="active"
                  value={formData.active ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('active', e.target.value === 'active')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            )}

            {mode !== 'view' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Hủy bỏ
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {mode === 'create' ? 'Tạo người dùng' : 'Lưu thay đổi'}
                </Button>
              </div>
            )}

            {mode === 'view' && (
              <div className="flex justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Đóng
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

