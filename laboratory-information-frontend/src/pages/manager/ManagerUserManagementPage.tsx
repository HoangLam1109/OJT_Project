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

// interface ManagerUserManagementPageProps {
//   currentUser?: ManagerUser;
// }

export function ManagerUserManagementPage() {
  // Custom hooks
  const { users, createUser, updateUser, deleteUser, toggleUserLock } = useUserManagement();
  const { filters, setFilters, filteredUsers } = useUserFilters(users);
  const statistics = useUserStatistics(users);
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
      {/* Header */}
      <PageHeader 
        onCreate={openCreateModal}
      />

      {/* Statistics */}
      <UserStatistics statistics={statistics} />

      {/* Filters */}
      <UserFilters filters={filters} onFiltersChange={setFilters} />

      {/* Users Table */}
      <UsersTableCard
        users={filteredUsers}
        totalUsers={users.length}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={setDeleteUserState}
        onToggleLock={handleToggleLock}
      />

      {/* User Form Modal */}
      {modalState.isOpen && (
        <UserForm
          mode={modalState.mode}
          user={modalState.user}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteUserState && (
        <DeleteConfirmDialog
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
  onView: (user: ManagerUser) => void;
  onEdit: (user: ManagerUser) => void;
  onDelete: (user: ManagerUser) => void;
  onToggleLock: (user: ManagerUser) => void;
}

function UsersTableCard({
  users,
  totalUsers,
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
          <UserTable
            users={users}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleLock={onToggleLock}
          />
      </CardContent>
    </Card>
  );
}

export default ManagerUserManagementPage;
