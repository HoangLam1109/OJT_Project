import React, { useState, useEffect } from 'react';
import { 
  UserCircle, 
  Edit2, 
  KeyRound, 
  Clock, 
  Save,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { mockUserProfile, mockAuditLogs, type UserProfile } from './data/mockUserProfile';
import { useAuthContext } from '../../hooks/useAuthContext';

const PersonalProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    department: profile.department
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  const isLabUser = user?.role === 'LAB_USER';

  useEffect(() => {
    if (!isLabUser) {
      console.log('Access denied: Only Lab Users can access personal profile');
      return;
    }
  }, [isLabUser]);

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!profileForm.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!profileForm.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!profileForm.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(profileForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!profileForm.gender) {
      newErrors.gender = 'Giới tính là bắt buộc';
    }

    if (!profileForm.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!profileForm.department.trim()) {
      newErrors.department = 'Phòng ban là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateProfileForm()) {
      return;
    }

    // Update profile
    const updatedProfile = {
      ...profile,
      ...profileForm,
      updatedAt: new Date().toISOString()
    };
    
    setProfile(updatedProfile);
    setIsEditing(false);
    setSuccessMessage('Cập nhật hồ sơ thành công!');
    
    // Audit log
    console.log(`[AUDIT] E_00012 | ${user?.name} updated profile`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (!validatePasswordForm()) {
      return;
    }

    // Simulate password change
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setSuccessMessage('Đổi mật khẩu thành công!');
    
    // Audit log
    console.log(`[AUDIT] E_00014 | ${user?.name} changed password`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResetProfile = () => {
    setProfileForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      department: profile.department
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleResetPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
    setErrors({});
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  if (!isLabUser) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-500">Chỉ có Lab User mới có thể truy cập trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hồ sơ cá nhân
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={avatarPreview || profile.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-blue-600 font-medium">{profile.role}</p>
            <p className="text-gray-600">{profile.department}</p>
            <p className="text-sm text-gray-500">
              Lần đăng nhập gần nhất: {formatDateTime(profile.lastLogin)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Personal Information */}
        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserCircle className="w-5 h-5 mr-2" />
                Thông tin cá nhân
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={handleResetProfile}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đặt lại
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* User ID - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã người dùng
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                  {profile.id}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => handleProfileInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {profile.name}
                  </div>
                )}
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleProfileInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {profile.email}
                  </div>
                )}
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {profile.phone}
                  </div>
                )}
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính *
                </label>
                {isEditing ? (
                  <select
                    value={profileForm.gender}
                    onChange={(e) => handleProfileInputChange('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {profile.gender}
                  </div>
                )}
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh *
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => handleProfileInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {formatDate(profile.dateOfBirth)}
                  </div>
                )}
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phòng ban / Khoa *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => handleProfileInputChange('department', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {profile.department}
                  </div>
                )}
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              {/* Role - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                  {profile.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Password Change & Activity Log */}
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <KeyRound className="w-5 h-5 mr-2" />
                Đổi mật khẩu
              </h3>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  Đổi mật khẩu
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Lưu mật khẩu
                  </button>
                  <button
                    onClick={handleResetPassword}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {isChangingPassword && (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Activity / Audit Log Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Lịch sử hoạt động
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã sự kiện
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockAuditLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {log.time}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {log.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'Thành công' || log.status === 'Hoàn tất'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfilePage;
