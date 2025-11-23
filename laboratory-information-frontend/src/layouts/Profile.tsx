import { useState, useEffect, useRef } from "react";
import { Save, X, Mail, Phone, User as UserIcon, Edit3, Calendar, Shield, MapPin, Activity, Upload, Loader2 } from "lucide-react";
import type { User } from "../types/User";
import { Input } from "../components/common/input";
import Button from "../components/common/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/common/card";
import { Label } from "../components/common/label";
import { profileService } from "../service/profileService";
import { Skeleton } from "../components/common/skeleton";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await profileService.getProfile();
      setProfile(userData);
      setFormData(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfileData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

 

  const handleSave = async () => {
    try {
      await profileService.updateProfile(formData);
      
      toast.success(t('userProfile.updateProfileSuccess'));
      setIsEditing(false);
      fetchProfile(); // Refresh data
      
      if (onUpdateProfile) {
        onUpdateProfile(formData);
      }
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('userProfile.updateProfileError');
      toast.error(message);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('userProfile.avatarFileTypeError'));
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(t('userProfile.avatarFileSizeError'));
      return;
    }

    try {
      setUploadingAvatar(true);
      const avatarUrl = await profileService.uploadAvatar(file);
      
      // Update local state
      setProfile((prev) => prev ? { ...prev, avatar: avatarUrl } : null);
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
      
      toast.success(t('userProfile.updateAvatarSuccess'));
      
      // Refresh profile to get latest data
      await fetchProfile();
      
      if (onUpdateProfile) {
        onUpdateProfile({ avatar: avatarUrl });
      }
    } catch (error: unknown) {
      console.error("Failed to upload avatar:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                     (error as Error)?.message || 
                     t('userProfile.uploadAvatarError');
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    return <div className="text-center mt-10 text-red-500">{t('userProfile.loadProfileError')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-10">
      {/* Header Section with Cover-like feel */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl shadow-lg"></div>
        <div className="absolute -bottom-16 left-10 flex items-end">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              className={`relative ${isEditing ? 'cursor-pointer group' : ''}`}
              onClick={handleAvatarClick}
            >
              <img 
                src={profile.avatar || "https://github.com/shadcn.png"} 
                alt="Avatar" 
                className={`w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white ${isEditing ? 'group-hover:opacity-80 transition-opacity' : ''}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
                }}
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              {isEditing && !uploadingAvatar && (
                <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                </div>
              )}
            </div>
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
                {t('userProfile.editProfile')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-white/90 hover:bg-white text-gray-700 border-none shadow-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('userProfile.cancel')}
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white border-none shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('userProfile.saveChanges')}
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
                {t('userProfile.statusAndContact')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">{t('userProfile.status')}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${profile.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {profile.isActive ? t('userProfile.active') : t('userProfile.inactive')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate" title={profile.email}>{profile.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{profile.phoneNumber || t('userProfile.notUpdated')}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm truncate" title={profile.address}>{profile.address || t('userProfile.notUpdated')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">{t('userProfile.personalInfo')}</CardTitle>
              <CardDescription>{t('userProfile.personalInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">{t('userProfile.fullName')}</Label>
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
                  <Label className="text-gray-600 text-sm">{t('userProfile.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.email || ''}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="pl-9 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">{t('userProfile.phone')}</Label>
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
                  <Label className="text-gray-600 text-sm">{t('userProfile.dob')}</Label>
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
                  <Label className="text-gray-600 text-sm">{t('userProfile.gender')}</Label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    disabled={!isEditing}
                    className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <option value="Male">{t('userProfile.male')}</option>
                    <option value="Female">{t('userProfile.female')}</option>
                    <option value="Other">{t('userProfile.other')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">{t('userProfile.age')}</Label>
                  <Input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleChange("age", parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm">{t('userProfile.identityNumber')}</Label>
                  <Input
                    value={formData.identityNumber || ''}
                    onChange={(e) => handleChange("identityNumber", e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-600 text-sm">{t('userProfile.address')}</Label>
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
