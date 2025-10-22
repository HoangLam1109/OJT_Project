import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import Button from '../../components/common/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/card';
import { AdminUserTable } from './components/AdminUserTable';
import { AdminUserForm } from './components/AdminUserForm';
import { AdminUserFilters } from './components/AdminUserFilters';
import { AdminUserStatistics } from './components/AdminUserStatistics';
import { AdminDeleteConfirmDialog } from './components/AdminDeleteConfirmDialog';
import { useAdminUserManagement } from './hooks/useAdminUserManagement';
import { useAdminUserFilters } from './hooks/useAdminUserFilters';
import { useAdminUserStatistics } from './hooks/useAdminUserStatistics';
import { useAdminUserModal } from './hooks/useAdminUserModal';
import type { AdminUser, AdminUserFormData } from './types/AdminTypes';

export function AdminUserManagementPage() {
  // Custom hooks
  const { users, isLoading, loadUsers, createUser, updateUser, deleteUser, toggleUserLock } = useAdminUserManagement();
  const { filters, setFilters, filteredUsers } = useAdminUserFilters(users);
  const statistics = useAdminUserStatistics(users);
  const { modalState, openCreateModal, openViewModal, openEditModal, closeModal } = useAdminUserModal();
  
  // Local state
  const [deleteUserState, setDeleteUserState] = useState<AdminUser | null>(null);

  // Handlers
  const handleFormSubmit = async (data: AdminUserFormData) => {
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

  const handleToggleLock = async (user: AdminUser) => {
    await toggleUserLock(user.id, user.active);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        onRefresh={loadUsers} 
        onCreate={openCreateModal}
        isLoading={isLoading}
      />

      {/* Statistics */}
      <AdminUserStatistics statistics={statistics} />

      {/* Filters */}
      <AdminUserFilters filters={filters} onFiltersChange={setFilters} />

      {/* Users Table */}
      <UsersTableCard
        users={filteredUsers}
        totalUsers={users.length}
        isLoading={isLoading}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={setDeleteUserState}
        onToggleLock={handleToggleLock}
      />

      {/* User Form Modal */}
      {modalState.isOpen && (
        <AdminUserForm
          mode={modalState.mode}
          user={modalState.user}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteUserState && (
        <AdminDeleteConfirmDialog
          user={deleteUserState}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteUserState(null)}
        />
      )}
    </div>
  );
}

// Subcomponents for better organization
interface PageHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
  isLoading: boolean;
}

function PageHeader({ onRefresh, onCreate, isLoading }: PageHeaderProps) {
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
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo người dùng
        </Button>
      </div>
    </div>
  );
}

interface UsersTableCardProps {
  users: AdminUser[];
  totalUsers: number;
  isLoading: boolean;
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onToggleLock: (user: AdminUser) => void;
}

function UsersTableCard({
  users,
  totalUsers,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onToggleLock,
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
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <AdminUserTable
            users={users}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleLock={onToggleLock}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default AdminUserManagementPage;

