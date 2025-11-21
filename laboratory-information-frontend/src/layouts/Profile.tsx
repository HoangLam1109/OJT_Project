import { useState, useEffect } from "react";
import { Save, X, Mail, Phone, User as UserIcon, Edit3, Calendar, Shield, MapPin, Activity } from "lucide-react";
import type { User } from "../types/User";
import { Input } from "../components/common/input";
import Button from "../components/common/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/common/card";
import { Label } from "../components/common/label";
import apiClient from "../service/apiClient";
import { Skeleton } from "../components/common/skeleton";

interface UserProfileData {
  email: string;
  fullName: string;
  identityNumber: string;
  role: string[];
  avatar: string;
  isActive: boolean;
  createdAt: string;
  address: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
}

interface ProfileProps {
  currentUser: User; // Keep for compatibility, but we'll fetch fresh data
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
}

export default function Profile({ onUpdateProfile }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ user: UserProfileData }>("/user/userProfile");
      if (response.data && response.data.user) {
        setProfile(response.data.user);
        setFormData(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfileData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Don't set global loading to avoid full page flicker, maybe just show a toast or local indicator
      // But for simplicity, let's keep it simple or add a specific loading state if needed.
      // Using alert for now as per existing pattern
      
      await apiClient.post("/user/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      await fetchProfile(); // Refresh to get new avatar URL
      alert("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Lỗi khi tải lên ảnh đại diện.");
    }
  };

  const handleSave = async () => {
    try {
      // Prepare data for update (remove email as it's not updatable usually, or backend handles it)
      const updateData = { ...formData };
      
      // Remove fields that are not allowed in the update payload
      delete (updateData as Record<string, unknown>)._id;
      delete (updateData as Record<string, unknown>).updatedAt;
      delete (updateData as Record<string, unknown>).__v;
      delete updateData.email; 
      delete updateData.role; 
      delete updateData.createdAt;
      delete updateData.isActive;
      delete (updateData as Record<string, unknown>).password;

      // Clean up data
      if (!updateData.dateOfBirth) {
        delete updateData.dateOfBirth;
      }
      if (updateData.age === undefined || updateData.age === null || isNaN(updateData.age)) {
        delete updateData.age;
      }
      if (!updateData.phoneNumber) {
        delete updateData.phoneNumber;
      }

      // Normalize gender to Title Case if present
      if (updateData.gender) {
        updateData.gender = updateData.gender.charAt(0).toUpperCase() + updateData.gender.slice(1).toLowerCase();
      }

      // Auto-fix identity number (CCCD/CMND) if user forgot leading zero
      if (updateData.identityNumber) {
        const cleanId = updateData.identityNumber.trim();
        // If 11 digits, assume 12-digit CCCD missing leading 0
        if (cleanId.length === 11 && /^\d+$/.test(cleanId)) {
          updateData.identityNumber = '0' + cleanId;
        }
        // If 8 digits, assume 9-digit CMND missing leading 0
        else if (cleanId.length === 8 && /^\d+$/.test(cleanId)) {
          updateData.identityNumber = '0' + cleanId;
        }
      }

      await apiClient.put("/user/UserProfile/Update", updateData);
      
      alert("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      fetchProfile(); // Refresh data
      
      if (onUpdateProfile) {
        onUpdateProfile(formData);
      }
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      alert(message);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-8 p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-10 text-red-500">Không thể tải thông tin hồ sơ.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-10">
      {/* Header Section with Cover-like feel */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl shadow-lg"></div>
        <div className="absolute -bottom-16 left-10 flex items-end">
          <div className="relative">
            <img 
              src={profile.avatar || "https://github.com/shadcn.png"} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
              }}
            />
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                <Edit3 className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
          <div className="ml-6 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <Shield className="w-4 h-4 mr-1.5 text-blue-600" />
              <span className="font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm border border-blue-100">
                {profile.role?.join(", ") || "USER"}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-6">
           {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-white/90 hover:bg-white text-gray-700 border-none shadow-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white border-none shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            )}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Status */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center text-gray-800">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Trạng thái & Liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Trạng thái</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${profile.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {profile.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate" title={profile.email}>{profile.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{profile.phoneNumber || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate" title={profile.address}>{profile.address || "Chưa cập nhật"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Tham gia từ {formatDate(profile.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Thông tin cá nhân</CardTitle>
              <CardDescription>Quản lý thông tin cá nhân và bảo mật của bạn</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">Họ và tên</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.fullName || ''}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      disabled={!isEditing}
                      className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      disabled={!isEditing}
                      className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">Ngày sinh</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      disabled={!isEditing}
                      className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">Giới tính</Label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    disabled={!isEditing}
                    className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">Tuổi</Label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleChange("age", parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">CCCD/CMND</Label>
                  <Input
                    value={formData.identityNumber || ''}
                    onChange={(e) => handleChange("identityNumber", e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-600 text-sm">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.address || ''}
                      onChange={(e) => handleChange("address", e.target.value)}
                      disabled={!isEditing}
                      className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
