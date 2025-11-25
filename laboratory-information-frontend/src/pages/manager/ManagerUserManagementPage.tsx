import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/common/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/card';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';
import { UserFilters } from './components/UserFilters';
import { UserStatistics } from './components/UserStatistics';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { useAllUsers } from './hooks/useAllUsers';
import { useUserFilters } from './hooks/useUserFilters';
import { useUserStatistics } from './hooks/useUserStatistics';
import { useUserModal } from './hooks/useUserModal';
import type { ManagerUser, UserFormData } from './types/ManagerTypes';
import { Skeleton } from '@/components/common/skeleton';
import { useTranslation } from 'react-i18next';

export function ManagerUserManagementPage() {
  // Fetch all users for filtering
  const { allUsers, isLoadingAll } = useAllUsers();
  
  // Custom hooks
  const { 
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserLock,
  } = useUserManagement();
  
  const { 
    filters, 
    setFilters, 
    filteredUsers, 
    totalFiltered,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNextPage,
    hasPrevPage 
  } = useUserFilters(allUsers);
  
  const statistics = useUserStatistics(allUsers, allUsers.length);
  const { modalState, openCreateModal, openViewModal, openEditModal, closeModal } = useUserModal();
  
  // Local state
  const [deleteUserState, setDeleteUserState] = useState<ManagerUser | null>(null);

  // Handlers
  const handleFormSubmit = async (data: UserFormData) => {
    let success = false;
    
    if (modalState.mode === 'create') {
      success = await createUser(data);
    } else if (modalState.mode === 'edit' && modalState.user) {
      success = await updateUser(modalState.user.id, data);
    }
    
    if (success) {
      closeModal();
      // Reload the page to refresh all users
      window.location.reload();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteUserState) {
      const success = await deleteUser(deleteUserState.id);
      if (success) {
        setDeleteUserState(null);
        // Reload the page to refresh all users
        window.location.reload();
      }
    }
  };

  const handleToggleLock = async (user: ManagerUser) => {
    const success = await toggleUserLock(user.id, user.active);
    if (success) {
      // Reload the page to refresh all users
      window.location.reload();
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {isLoadingAll ? (
      // 🔹 Hiển thị Skeleton cho toàn trang
      <div className="space-y-4 sm:space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 sm:h-8 w-48" />
            <Skeleton className="h-3 sm:h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
        </div>

        {/* Statistics Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start justify-start space-y-4 w-full">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center w-full gap-6 px-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-[30%]" />
                  <Skeleton className="h-4 w-[20%]" />
                  <Skeleton className="h-4 w-[15%]" />
                  <Skeleton className="h-4 w-[10%]" />
                  <Skeleton className="h-4 w-[10%]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    ) : (
      // 🔹 Khi tải xong dữ liệu, hiển thị nội dung thật
      <>
        <PageHeader onCreate={openCreateModal} />
        <UserStatistics statistics={statistics} />
        <UserFilters filters={filters} onFiltersChange={setFilters} />

        <UsersTableCard
          users={filteredUsers}
          totalUsers={totalFiltered}
          currentPage={currentPage}
          totalPages={totalPages}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={setDeleteUserState}
          onToggleLock={handleToggleLock}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onFirstPage={handleFirstPage}
          onLastPage={handleLastPage}
          hasNext={hasNextPage}
          hasPrev={hasPrevPage}
        />

        {modalState.isOpen && (
          <UserForm
            mode={modalState.mode}
            user={modalState.user}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />
        )}

        {deleteUserState && (
          <DeleteConfirmDialog
            user={deleteUserState}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteUserState(null)}
          />
        )}
      </>
    )}
    </div>
  );
}

// Subcomponents for better organization
interface PageHeaderProps {
  onCreate: () => void;
}

function PageHeader({ onCreate }: PageHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('manager.userManagement')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {t('manager.userManagementDescription')}
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {t('manager.createUser')}
        </Button>
      </div>
    </div>
  );
}

interface UsersTableCardProps {
  users: ManagerUser[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  onView: (user: ManagerUser) => void;
  onEdit: (user: ManagerUser) => void;
  onDelete: (user: ManagerUser) => void;
  onToggleLock: (user: ManagerUser) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

function UsersTableCard({
  users,
  totalUsers,
  currentPage,
  totalPages,
  onView,
  onEdit,
  onDelete,
  onToggleLock,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  hasNext,
  hasPrev,
}: UsersTableCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">{t('manager.userList')}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t('manager.display')} {users.length} / {totalUsers} {t('manager.users')} ({t('manager.page')} {currentPage}/{totalPages})
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <UserTable
          users={users}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleLock={onToggleLock}
          onFirstPage={onFirstPage}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onLastPage={onLastPage}
          hasPrev={hasPrev}
          hasNext={hasNext}
          pageLabel={`${t('manager.page')} ${currentPage} / ${totalPages}`}
        />
      </CardContent>
    </Card>
  );
}

export default ManagerUserManagementPage;
