import { useCallback, useEffect, useState } from 'react';
import { Users, User as UserIcon, Wrench } from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import { MobileHeader } from '../components/common/MobileHeader';
import type { NavigationItem } from '../types/Layout.types';
import type { User } from '../types/User';
import { useTranslation } from 'react-i18next';
import type { UserProfileData } from './Profile';
import { profileService } from '@/service/profileService';

interface ManagerLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function ManagerLayout({ 
  children, 
  currentUser, 
  onLogout, 
  currentPage, 
  onNavigate 
}: ManagerLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigationItems: NavigationItem[] = [
  { id: 'user-management', label: t('manager.userManagement'), icon: Users },
  { id: 'profile', label: t('manager.profile'), icon: UserIcon },
  { id: 'instruments', label: t('manager.instruments'), icon: Wrench }  
  ];

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const loadProfile = useCallback(async () => {
    try {
      const data = await profileService.getProfile(currentUser.id);
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }, [currentUser.id]);
    useEffect(() => {
      loadProfile();
    }, [loadProfile]);
  
    
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentUserName={currentUser.name}
        currentUserRole={t('manager.role')}
        currentPage={currentPage}
        currentUserAvatar={profile?.avatar}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onNavigate={onNavigate}
        navigationItems={navigationItems}
        onLogout={onLogout}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed 
          ? ' md:ml-16 lg:ml-16' 
          : ' md:ml-64 lg:ml-64'
      }`}>
        <MobileHeader 
          onMenuClick={() => setSidebarCollapsed(false)} 
          navigationItems={navigationItems}
        />
        <TopHeader/>
        <main className="flex-1 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

