import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Shield, 
  Bell, 
  Globe, 
  Edit, 
  Save, 
  X,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Monitor
} from 'lucide-react';
import Button from '../../components/common/button';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/card';
import { mockAdminProfile } from './data/mockProfile';
import type { AdminProfile } from './data/mockProfile';

export function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>(mockAdminProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'work' | 'security' | 'preferences'>('personal');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality when API is available
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(mockAdminProfile);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'work', label: 'Thông tin công việc', icon: Monitor },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'preferences', label: 'Tùy chọn', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.position} - {profile.department}</p>
              <p className="text-sm text-gray-500">ID: {profile.employeeId}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span className="font-medium">{profile.role}</span>
              </div>
              <p className="text-sm text-gray-500">Đăng nhập cuối: {formatDate(profile.lastLogin)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email công việc</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="identify">Số CMND/CCCD</Label>
                <Input
                  id="identify"
                  value={profile.identify_number || ''}
                  onChange={(e) => setProfile({...profile, identify_number: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="personalEmail">Email cá nhân</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={profile.contactInfo.personalEmail || ''}
                  onChange={(e) => setProfile({
                    ...profile, 
                    contactInfo: {...profile.contactInfo, personalEmail: e.target.value}
                  })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="personalPhone">Số điện thoại cá nhân</Label>
                <Input
                  id="personalPhone"
                  value={profile.contactInfo.personalPhone || ''}
                  onChange={(e) => setProfile({
                    ...profile, 
                    contactInfo: {...profile.contactInfo, personalPhone: e.target.value}
                  })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="emergencyName">Liên hệ khẩn cấp</Label>
                <Input
                  id="emergencyName"
                  value={profile.contactInfo.emergencyContact.name}
                  onChange={(e) => setProfile({
                    ...profile, 
                    contactInfo: {
                      ...profile.contactInfo, 
                      emergencyContact: {...profile.contactInfo.emergencyContact, name: e.target.value}
                    }
                  })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'work' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin công việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="department">Phòng ban</Label>
                <Input
                  id="department"
                  value={profile.department}
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="position">Chức vụ</Label>
                <Input
                  id="position"
                  value={profile.position}
                  onChange={(e) => setProfile({...profile, position: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input
                  id="employeeId"
                  value={profile.employeeId}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="hireDate">Ngày bắt đầu làm việc</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={profile.hireDate}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch làm việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Giờ bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={profile.workSchedule.startTime}
                    onChange={(e) => setProfile({
                      ...profile, 
                      workSchedule: {...profile.workSchedule, startTime: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Giờ kết thúc</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={profile.workSchedule.endTime}
                    onChange={(e) => setProfile({
                      ...profile, 
                      workSchedule: {...profile.workSchedule, endTime: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label>Ngày làm việc</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={profile.workSchedule.workDays.includes(day)}
                        onChange={(e) => {
                          const workDays = e.target.checked
                            ? [...profile.workSchedule.workDays, day]
                            : profile.workSchedule.workDays.filter(d => d !== day);
                          setProfile({
                            ...profile, 
                            workSchedule: {...profile.workSchedule, workDays}
                          });
                        }}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Mật khẩu</p>
                    <p className="text-sm text-gray-600">Thay đổi lần cuối: {formatDate(profile.security.lastPasswordChange)}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Đổi mật khẩu
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Xác thực 2 yếu tố</p>
                    <p className="text-sm text-gray-600">
                      {profile.security.twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {profile.security.twoFactorEnabled ? 'Tắt' : 'Bật'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đăng nhập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.security.loginHistory.slice(0, 5).map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(login.timestamp)}</p>
                        <p className="text-xs text-gray-600">{login.location}</p>
                        <p className="text-xs text-gray-500">{login.ipAddress}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(login.status)}`}>
                      {login.status === 'success' ? 'Thành công' : 'Thất bại'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt ngôn ngữ & thời gian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Ngôn ngữ</Label>
                <select
                  id="language"
                  value={profile.preferences.language}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, language: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Múi giờ</Label>
                <select
                  id="timezone"
                  value={profile.preferences.timezone}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, timezone: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.email}
                    onChange={(e) => setProfile({
                      ...profile, 
                      preferences: {
                        ...profile.preferences, 
                        notifications: {...profile.preferences.notifications, email: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMS</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.sms}
                    onChange={(e) => setProfile({
                      ...profile, 
                      preferences: {
                        ...profile.preferences, 
                        notifications: {...profile.preferences.notifications, sms: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">Push Notification</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.push}
                    onChange={(e) => setProfile({
                      ...profile, 
                      preferences: {
                        ...profile.preferences, 
                        notifications: {...profile.preferences.notifications, push: e.target.checked}
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
