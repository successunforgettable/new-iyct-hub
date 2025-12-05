import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../../api/client';

const colors = {
  background: '#0a1628',
  card: '#1a2332',
  cardHover: '#1f2940',
  border: '#2a3b52',
  accent: '#5dade2',
  accentHover: '#7dc8f0',
  success: '#34c38f',
  warning: '#f0ad4e',
  error: '#dc3545',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#a0a0a0',
};

interface User {
  id: string;
  email: string;
  fullName: string;
  userRole: string;
  status?: string;
  createdAt: string;
  lastLogin?: string;
  enrollmentCount?: number;
}

interface ActionMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onSuspend: (user: User) => void;
  onDelete: (user: User) => void;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ user, onEdit, onSuspend, onDelete, onClose }) => {
  return (
    <div
      className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 overflow-hidden"
      style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
    >
      <button
        onClick={() => { onEdit(user); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
        style={{ color: colors.textPrimary }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.cardHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Edit size={16} style={{ color: colors.accent }} />
        Edit User
      </button>
      <button
        onClick={() => { onSuspend(user); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
        style={{ color: colors.textPrimary }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.cardHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {user.status === 'suspended' ? (
          <>
            <UserCheck size={16} style={{ color: colors.success }} />
            Activate User
          </>
        ) : (
          <>
            <UserX size={16} style={{ color: colors.warning }} />
            Suspend User
          </>
        )}
      </button>
      <button
        onClick={() => { onDelete(user); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
        style={{ color: colors.error }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.cardHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Trash2 size={16} />
        Delete User
      </button>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmType: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmType,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const buttonColor = {
    danger: colors.error,
    warning: colors.warning,
    primary: colors.accent,
  }[confirmType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className="relative z-10 w-full max-w-md rounded-xl p-6"
        style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={24} style={{ color: buttonColor }} />
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            {title}
          </h3>
        </div>
        <p className="mb-6" style={{ color: colors.textSecondary }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: colors.background, color: colors.textPrimary }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: buttonColor, color: '#ffffff' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'delete' | null;
    user: User | null;
  }>({ isOpen: false, type: null, user: null });
  
  const pageSize = 10;

  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', currentPage, searchQuery, roleFilter],
    queryFn: async () => {
      const response = await api.admin.getUsers({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      });
      return response;
    },
  });

  const users: User[] = usersResponse?.data || [];
  const totalUsers = usersResponse?.pagination?.total || users.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch = searchQuery === '' || 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.userRole === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const suspendMutation = useMutation({
    mutationFn: async (user: User) => {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await api.admin.updateUser(user.id, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.admin.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleSuspend = (user: User) => {
    setConfirmModal({ isOpen: true, type: 'suspend', user });
  };

  const handleDelete = (user: User) => {
    setConfirmModal({ isOpen: true, type: 'delete', user });
  };

  const confirmAction = () => {
    if (!confirmModal.user) return;
    if (confirmModal.type === 'suspend') {
      suspendMutation.mutate(confirmModal.user);
    } else if (confirmModal.type === 'delete') {
      deleteMutation.mutate(confirmModal.user.id);
    }
    setConfirmModal({ isOpen: false, type: null, user: null });
  };

  const getRoleBadgeColor = (role: string) => {
    const r = role?.toUpperCase() || '';
    if (r.includes('SUPERADMIN')) return { bg: `${colors.error}20`, text: colors.error };
    if (r.includes('ADMIN')) return { bg: `${colors.warning}20`, text: colors.warning };
    if (r.includes('COACH')) return { bg: `${colors.accent}20`, text: colors.accent };
    return { bg: `${colors.success}20`, text: colors.success };
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return { bg: `${colors.success}20`, text: colors.success };
      case 'suspended': return { bg: `${colors.error}20`, text: colors.error };
      case 'pending': return { bg: `${colors.warning}20`, text: colors.warning };
      default: return { bg: `${colors.success}20`, text: colors.success };
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer transition-colors focus:outline-none"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
            >
              <option value="all">All Roles</option>
              <option value="USER">User</option>
              <option value="COACH">Coach</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer transition-colors focus:outline-none"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.background }}>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Enrollments</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Last Login</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} style={{ color: colors.accent }} />
                    <span style={{ color: colors.textMuted }}>Loading users...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: colors.error }}>
                    Error loading users. Please try again.
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: colors.textMuted }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: User) => {
                  const roleColors = getRoleBadgeColor(user.userRole);
                  const statusColors = getStatusBadgeColor(user.status || 'active');
                  return (
                    <tr
                      key={user.id}
                      className="border-t transition-colors"
                      style={{ borderColor: colors.border }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.cardHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{ backgroundColor: colors.accent, color: '#ffffff' }}
                          >
                            {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.textPrimary }}>{user.fullName || 'Unknown'}</p>
                            <p className="text-sm flex items-center gap-1" style={{ color: colors.textMuted }}>
                              <Mail size={12} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: roleColors.bg, color: roleColors.text }}>
                          {user.userRole || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                        {user.enrollmentCount || 0}
                      </td>
                      <td className="px-6 py-4" style={{ color: colors.textSecondary }}>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: colors.textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <MoreVertical size={18} />
                          </button>
                          {activeMenu === user.id && (
                            <ActionMenu user={user} onEdit={handleEdit} onSuspend={handleSuspend} onDelete={handleDelete} onClose={() => setActiveMenu(null)} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Showing {filteredUsers.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 text-sm" style={{ color: colors.textPrimary }}>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'delete' ? 'Delete User' : 'Suspend User'}
        message={
          confirmModal.type === 'delete'
            ? `Are you sure you want to delete ${confirmModal.user?.fullName}? This action cannot be undone.`
            : confirmModal.user?.status === 'suspended'
            ? `Are you sure you want to activate ${confirmModal.user?.fullName}?`
            : `Are you sure you want to suspend ${confirmModal.user?.fullName}?`
        }
        confirmLabel={confirmModal.type === 'delete' ? 'Delete' : confirmModal.user?.status === 'suspended' ? 'Activate' : 'Suspend'}
        confirmType={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, user: null })}
      />
    </div>
  );
};

export default UserManagement;
