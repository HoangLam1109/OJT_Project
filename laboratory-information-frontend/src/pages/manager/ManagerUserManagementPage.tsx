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
import { useUserFilters } from './hooks/useUserFilters';
import { useUserStatistics } from './hooks/useUserStatistics';
import { useUserModal } from './hooks/useUserModal';
import type { ManagerUser, UserFormData } from './types/ManagerTypes';
import { Skeleton } from '@/components/common/skeleton';


export function ManagerUserManagementPage() {
  // Custom hooks
  const { 
    users, 
    pagination, 
    loadNextPage, 
    loadPrevPage,
    loadFirstPage, 
    loadLastPage,
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserLock,
    isLoading 
  } = useUserManagement();
  const { filters, setFilters, filteredUsers } = useUserFilters(users);
  const statistics = useUserStatistics(users, pagination.total);
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
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteUserState) {
      const success = await deleteUser(deleteUserState.id);
      if (success) {
        setDeleteUserState(null);
      }
    }
  };

  const handleToggleLock = async (user: ManagerUser) => {
    await toggleUserLock(user.id, user.active);
  };

  return (
  <div className="space-y-6">
    {isLoading ? (
      // 🔹 Hiển thị Skeleton cho toàn trang
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Statistics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

        {/* Table Skeleton (tận dụng lại phần bạn đã có) */}
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
          totalUsers={pagination.total}
          pagination={pagination}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={setDeleteUserState}
          onToggleLock={handleToggleLock}
          onPrevPage={loadPrevPage}
          onNextPage={loadNextPage}
          onFirstPage={loadFirstPage}
          onLastPage={loadLastPage}
          isLoading={isLoading}
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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý người dùng
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý tài khoản người dùng trong hệ thống
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo người dùng
        </Button>
      </div>
    </div>
  );
}

interface UsersTableCardProps {
  users: ManagerUser[];
  totalUsers: number;
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    total: number;
  };
  onView: (user: ManagerUser) => void;
  onEdit: (user: ManagerUser) => void;
  onDelete: (user: ManagerUser) => void;
  onToggleLock: (user: ManagerUser) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  isLoading: boolean;
}

function UsersTableCard({
  users,
  totalUsers,
  pagination,
  onView,
  onEdit,
  onDelete,
  onToggleLock,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  isLoading,
}: UsersTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách người dùng</CardTitle>
        <CardDescription>
          Hiển thị {users.length} / {totalUsers} người dùng
        </CardDescription>
      </CardHeader>
       <CardContent>
        {isLoading ? (
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
        ) : (
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
            hasPrev={pagination.hasPrev}
            hasNext={pagination.hasNext}
            pageLabel={`Trang hiện tại - ${users.length} người dùng`}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ManagerUserManagementPage;
