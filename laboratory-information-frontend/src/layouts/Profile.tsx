import { useState } from "react";
import { Save, X, Mail, Phone, Building2, User as UserIcon, Edit3 } from "lucide-react";
import type { User } from "../types/User";
import { Input } from "../components/common/input";
import Button from "../components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card";
import { Label } from "../components/common/label";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "ADMIN" | "MANAGER" | "LAB_USER" | "SERVICE" | "USER";
  department?: string;
  identifyNumber?: string;
  address?: string;
  gender?: string;
  lastLogin?: string;
}

interface ProfileProps {
  currentUser: User;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export default function Profile({ currentUser, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    username: currentUser.name || '', // Using name as username for now
    email: currentUser.email || '',
    phone: currentUser.phone_number || '',
    department: 'Phòng thí nghiệm', // Default department
    identifyNumber: currentUser.identify_number || '',
    address: currentUser.address || '',
    gender: currentUser.gender || '',
    role: currentUser.role,
    lastLogin: currentUser.lastLogin || 'Chưa có thông tin'
  });

  // All fields are editable for now (no role-based permissions)
  const canEditField = (field: keyof UserProfile): boolean => {
    return true; // All fields can be edited
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSave = () => {
    // Validation
    if (!validateEmail(formData.email)) {
      alert("Email không hợp lệ");
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      alert("Số điện thoại không hợp lệ (10-11 chữ số)");
      return;
    }

    // Show success toast
    console.log("Cập nhật hồ sơ thành công");
    
    // Call update callback if provided
    onUpdateProfile?.(formData);
    
    // Exit edit mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to original data
    setFormData({
      name: currentUser.name || '',
      username: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone_number || '',
      department: 'Phòng thí nghiệm',
      identifyNumber: currentUser.identify_number || '',
      address: currentUser.address || '',
      gender: currentUser.gender || '',
      role: currentUser.role,
      lastLogin: currentUser.lastLogin || 'Chưa có thông tin'
    });
    setIsEditing(false);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Quản trị viên',
      'MANAGER': 'Quản lý phòng thí nghiệm',
      'LAB_USER': 'Nhân viên phòng thí nghiệm',
      'SERVICE': 'Nhân viên dịch vụ'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardHeader className="pb-6">
          <div className="flex flex-col items-center border-b border-gray-200 pb-6">
            {/* User Info */}
            <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
              {formData.name}
            </CardTitle>
            <p className="text-blue-600 font-medium text-lg">
              {getRoleDisplayName(formData.role)}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {formData.department}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name - Editable */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Họ và tên
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Username - Editable */}
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Email - Editable */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập email"
              />
            </div>

            {/* Phone - Editable */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Department - Editable */}
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Phòng ban
              </Label>
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập phòng ban"
              />
            </div>

            {/* CCCD/CMND - Editable */}
            <div>
              <Label htmlFor="identifyNumber" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Số CCCD/CMND
              </Label>
              <Input
                id="identifyNumber"
                type="text"
                value={formData.identifyNumber}
                onChange={(e) => handleChange("identifyNumber", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập số CCCD/CMND"
              />
            </div>

            {/* Address - Editable */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Địa chỉ
              </Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Gender - Editable */}
            <div>
              <Label htmlFor="gender" className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Giới tính
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  !isEditing 
                    ? "bg-gray-50 border-gray-200" 
                    : "border-blue-300"
                }`}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Role - Display Only */}
            <div>
              <Label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Vai trò
              </Label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {getRoleDisplayName(formData.role)}
              </div>
            </div>

            {/* Last Login - Display Only */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Lần đăng nhập gần nhất
              </Label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {formData.lastLogin}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
