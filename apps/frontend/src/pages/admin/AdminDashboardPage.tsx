// apps/frontend/src/pages/admin/AdminDashboardPage.tsx
// Master Plan: Week 4 Day 6-7 - Admin Panel Basic
// Features: User management table, analytics charts, program overview

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../../api/client';

// Design System Colors
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

// Icons
const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.accent} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.warning} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  UserPlus: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.accent} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.textMuted} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg shadow-lg" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
        <p className="text-xs" style={{ color: colors.textMuted }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: colors.accent }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Stat Card
const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; trend?: string }> = ({ label, value, icon, trend }) => (
  <div className="p-5 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: colors.textMuted }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{value}</p>
        {trend && <p className="text-xs mt-1" style={{ color: colors.success }}>{trend}</p>}
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>{icon}</div>
    </div>
  </div>
);

// Role Badge
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleColors: Record<string, { bg: string; text: string }> = {
    SUPERADMIN: { bg: 'rgba(220, 53, 69, 0.2)', text: colors.error },
    ADMIN: { bg: 'rgba(240, 173, 78, 0.2)', text: colors.warning },
    COACH: { bg: 'rgba(93, 173, 226, 0.2)', text: colors.accent },
    CLIENT: { bg: 'rgba(52, 195, 143, 0.2)', text: colors.success },
  };
  const color = roleColors[role] || roleColors.CLIENT;
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>
      {role}
    </span>
  );
};

// Status Badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const isActive = status?.toUpperCase() === 'ACTIVE';
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
      backgroundColor: isActive ? 'rgba(52, 195, 143, 0.2)' : 'rgba(160, 160, 160, 0.2)',
      color: isActive ? colors.success : colors.textMuted
    }}>
      {status || 'ACTIVE'}
    </span>
  );
};

// Main Component
const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'programs'>('overview');

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.admin.getAnalytics(),
    staleTime: 60000,
  });

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', currentPage, searchTerm, roleFilter],
    queryFn: () => api.admin.getUsers({ page: currentPage, limit: 10, search: searchTerm, role: roleFilter }),
    staleTime: 30000,
  });

  // Fetch programs
  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: () => api.admin.getPrograms(),
    staleTime: 60000,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.admin.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
          <p style={{ color: colors.textSecondary }}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = analytics?.stats;
  const userGrowth = analytics?.userGrowth || [];
  const enrollmentsByProgram = analytics?.enrollmentsByProgram || [];
  const recentActivity = analytics?.recentActivity || [];

  const PIE_COLORS = [colors.accent, colors.success, colors.warning, colors.error];

  // Role distribution for pie chart
  const roleDistribution = [
    { name: 'Coaches', value: stats?.totalCoaches || 0 },
    { name: 'Clients', value: stats?.totalClients || 0 },
    { name: 'Admins', value: (stats?.totalUsers || 0) - (stats?.totalCoaches || 0) - (stats?.totalClients || 0) },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: colors.card }}>
              <Icons.ArrowLeft />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: colors.textMuted }}>Manage users, programs, and view analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['overview', 'users', 'programs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
            style={{
              backgroundColor: activeTab === tab ? colors.accent : colors.card,
              color: activeTab === tab ? colors.textPrimary : colors.textMuted,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={<Icons.Users />} trend={`+${stats?.recentSignups || 0} this week`} />
            <StatCard label="Total Coaches" value={stats?.totalCoaches || 0} icon={<Icons.UserPlus />} />
            <StatCard label="Total Programs" value={stats?.totalPrograms || 0} icon={<Icons.BookOpen />} />
            <StatCard label="Active Enrollments" value={stats?.activeEnrollments || 0} icon={<Icons.TrendingUp />} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="lg:col-span-2 p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>User Growth (Last 6 Months)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="month" stroke={colors.textMuted} tick={{ fill: colors.textMuted, fontSize: 12 }} />
                    <YAxis stroke={colors.textMuted} tick={{ fill: colors.textMuted, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="users" stroke={colors.accent} strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role Distribution */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>User Roles</h2>
              {roleDistribution.length > 0 ? (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                          {roleDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    {roleDistribution.map((entry, index) => (
                      <span key={entry.name} className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                        {entry.name} ({entry.value})
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p style={{ color: colors.textMuted }}>No user data</p>
                </div>
              )}
            </div>
          </div>

          {/* Enrollments by Program + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollments by Program */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Enrollments by Program</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentsByProgram} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis type="number" stroke={colors.textMuted} tick={{ fill: colors.textMuted, fontSize: 12 }} />
                    <YAxis dataKey="programName" type="category" stroke={colors.textMuted} tick={{ fill: colors.textMuted, fontSize: 10 }} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="enrollments" fill={colors.accent} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Recent Activity</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                      <p className="text-sm" style={{ color: colors.textPrimary }}>{activity.description}</p>
                      <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4" style={{ color: colors.textMuted }}>No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Search /></div>
            </form>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            >
              <option value="all">All Roles</option>
              <option value="COACH">Coaches</option>
              <option value="CLIENT">Clients</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          {/* Users Table */}
          {usersLoading ? (
            <div className="text-center py-8">
              <p style={{ color: colors.textMuted }}>Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: colors.textMuted }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.data?.map((user: any) => (
                      <tr key={user.id} style={{ borderBottom: `1px solid ${colors.border}` }} className="hover:bg-opacity-50" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.cardHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="py-3 px-4">
                          <p className="font-medium" style={{ color: colors.textPrimary }}>{user.fullName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm" style={{ color: colors.textSecondary }}>{user.email}</p>
                        </td>
                        <td className="py-3 px-4"><RoleBadge role={user.role} /></td>
                        <td className="py-3 px-4"><StatusBadge status={user.status} /></td>
                        <td className="py-3 px-4">
                          <p className="text-sm" style={{ color: colors.textMuted }}>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: colors.background, color: colors.accent }}>
                              <Icons.Edit />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id, user.fullName)} className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: colors.background, color: colors.error }}>
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersData?.pagination && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData.pagination.total)} of {usersData.pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={!usersData.pagination.hasPrev}
                      className="p-2 rounded-lg disabled:opacity-50"
                      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
                    >
                      <Icons.ChevronLeft />
                    </button>
                    <span className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.background, color: colors.textPrimary }}>
                      {currentPage} / {usersData.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!usersData.pagination.hasNext}
                      className="p-2 rounded-lg disabled:opacity-50"
                      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
                    >
                      <Icons.ChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Programs ({programs?.length || 0})</h2>
          {programsLoading ? (
            <div className="text-center py-8">
              <p style={{ color: colors.textMuted }}>Loading programs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs?.map((program: any) => (
                <div key={program.id} className="p-4 rounded-lg" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                  <h3 className="font-medium mb-2 truncate" style={{ color: colors.textPrimary }}>{program.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p style={{ color: colors.textMuted }}>Type: <span style={{ color: colors.textSecondary }}>{program.programType}</span></p>
                    <p style={{ color: colors.textMuted }}>Language: <span style={{ color: colors.textSecondary }}>{program.language?.toUpperCase()}</span></p>
                    <p style={{ color: colors.textMuted }}>Weeks: <span style={{ color: colors.textSecondary }}>{program.weekCount}</span></p>
                    <p style={{ color: colors.textMuted }}>Enrollments: <span style={{ color: colors.accent }}>{program.enrollmentCount}</span></p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={program.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    <button className="text-sm px-3 py-1 rounded-lg" style={{ backgroundColor: colors.accent, color: colors.textPrimary }}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
