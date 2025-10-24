import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Card, CardContent } from '../../components/common/card';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Award,
  Clock,
  TestTube2
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    address: user?.address || '',
    dateOfBirth: user?.date_of_birth || '',
    identifyNumber: user?.identify_number || '',
    gender: user?.gender || '',
    age: user?.age || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone_number || '',
      address: user?.address || '',
      dateOfBirth: user?.date_of_birth || '',
      identifyNumber: user?.identify_number || '',
      gender: user?.gender || '',
      age: user?.age || ''
    });
    setIsEditing(false);
  };

  // Mock data for lab user statistics
  const labStats = {
    testsPerformed: 1250,
    testsToday: 15,
    averageTime: '2.5 giờ',
    accuracy: '98.5%',
    experience: '3 năm',
    certifications: ['Chứng chỉ phòng thí nghiệm y tế', 'Chứng chỉ an toàn sinh học']
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Hồ sơ cá nhân
        </h1>
        <p className="text-sm text-gray-500">Quản lý thông tin cá nhân và thống kê công việc</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.fullName || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.dateOfBirth || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Giới tính
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Tuổi
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.age || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.address || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Số CMND/CCCD
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.identifyNumber}
                      onChange={(e) => handleInputChange('identifyNumber', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.identifyNumber || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Chứng chỉ và bằng cấp
              </h2>
              <div className="space-y-3">
                {labStats.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Work Statistics */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TestTube2 className="w-5 h-5 mr-2" />
                Thống kê công việc
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng xét nghiệm đã thực hiện</span>
                  <span className="font-semibold text-gray-900">{labStats.testsPerformed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Xét nghiệm hôm nay</span>
                  <span className="font-semibold text-blue-600">{labStats.testsToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thời gian trung bình</span>
                  <span className="font-semibold text-gray-900">{labStats.averageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Độ chính xác</span>
                  <span className="font-semibold text-green-600">{labStats.accuracy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kinh nghiệm</span>
                  <span className="font-semibold text-gray-900">{labStats.experience}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Hoạt động gần đây
              </h2>
              <div className="space-y-3">
                {[
                  { action: 'Hoàn thành xét nghiệm sinh hóa máu', time: '2 giờ trước' },
                  { action: 'Bắt đầu xét nghiệm công thức máu', time: '3 giờ trước' },
                  { action: 'Xác nhận kết quả chức năng gan', time: '5 giờ trước' },
                  { action: 'Hiệu chuẩn thiết bị phân tích', time: '1 ngày trước' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <TestTube2 className="w-4 h-4 mr-2" />
                  Xem xét nghiệm đang chờ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Lịch làm việc
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Chứng chỉ của tôi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
