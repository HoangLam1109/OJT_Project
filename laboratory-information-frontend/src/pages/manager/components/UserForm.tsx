import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import type { UserFormData, ValidationErrors, ManagerUser } from '../types/ManagerTypes';

interface UserFormProps {
  mode: 'create' | 'edit' | 'view';
  user?: ManagerUser | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export function UserForm({ mode, user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
    phone_number: '',
    identify_number: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    date_of_birth: '',
    address: '',
    active: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        fullName: user.name|| '',
        email: user.email,
        role: user.role,
        phone_number: user.phone_number || '',
        identify_number: user.identify_number || '',
        gender: (user.gender as 'Male' | 'Female' | 'Other') || 'Male',
        date_of_birth: user.date_of_birth || '',
        age: user.age,
        address: user.address || '',
        active: user.active,
      });
    }
  }, [user, mode]);

  const validateForm = (): boolean => {
    // Skip validation for edit mode
    if (mode === 'edit') {
      return true;
    }

    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
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

    if (mode === 'view') return;

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const isReadOnly = mode === 'view';

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Tạo người dùng mới';
      case 'edit':
        return 'Chỉnh sửa người dùng';
      case 'view':
        return 'Chi tiết người dùng';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {getTitle()}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <Label htmlFor="fullName">
                Họ và tên {mode !== 'edit'}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
                disabled={isReadOnly}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && mode !== 'edit' && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email {mode !== 'edit'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                disabled={isReadOnly || mode === 'edit'}
                aria-invalid={!!errors.email}
              />
              {errors.email && mode !== 'edit' && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            {mode !== 'view' && (
              <div>
                <Label htmlFor="password">
                  Mật khẩu {mode === 'create'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={mode === 'edit' ? 'Để trống nếu không đổi' : '••••••••'}
                  aria-invalid={!!errors.password}
                />
                {errors.password && mode !== 'edit' && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Role */}
            <div>
              <Label htmlFor="role">
                Vai trò {mode !== 'edit'}
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                disabled={isReadOnly}
                className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              >
                <option value="USER">Người dùng</option>
                <option value="LAB_USER">Nhân viên Lab</option>
                <option value="SERVICE">Dịch vụ</option>
                <option value="MANAGER">Quản lý</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phone_number">
                Số điện thoại {mode !== 'edit'}
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="+84-901-234-567"
                disabled={isReadOnly}
                aria-invalid={!!errors.phone_number}
              />
              {errors.phone_number && mode !== 'edit' && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
              )}
            </div>

            {/* Identify Number */}
            <div>
              <Label htmlFor="identify_number">
                CMND/CCCD {mode !== 'edit'}
              </Label>
              <Input
                id="identify_number"
                value={formData.identify_number}
                onChange={(e) => handleChange('identify_number', e.target.value)}
                placeholder="079089001234"
                disabled={isReadOnly}
                aria-invalid={!!errors.identify_number}
              />
              {errors.identify_number && mode !== 'edit' && (
                <p className="text-red-500 text-sm mt-1">{errors.identify_number}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">
                Giới tính {mode !== 'edit'}
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                disabled={isReadOnly}
                className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="date_of_birth">
                Ngày sinh {mode !== 'edit'}
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                disabled={isReadOnly}
                aria-invalid={!!errors.date_of_birth}
              />
              {errors.date_of_birth && mode !== 'edit' && (
                <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Đường ABC, Quận XYZ, TP. Hà Nội"
                disabled={isReadOnly}
              />
            </div>

            {/* Active Status */}
            {mode !== 'create' && (
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => handleChange('active', e.target.checked)}
                  disabled={isReadOnly}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Tài khoản hoạt động
                </Label>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit" onClick={handleSubmit}>
              {mode === 'create' ? 'Tạo người dùng' : 'Cập nhật'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

