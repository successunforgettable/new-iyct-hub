import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Clock,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { api } from '../../api/client';
import UserManagement from './UserManagement';
import ProgramManagement from './ProgramManagement';

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

const CHART_COLORS = ['#5dade2', '#34c38f', '#f0ad4e', '#dc3545', '#9b59b6'];

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, changeType = 'neutral', loading }) => {
  const changeColor = changeType === 'positive' ? colors.success : changeType === 'negative' ? colors.error : colors.textMuted;

  return (
    <div className="rounded-xl p-6 border transition-all duration-200 hover:border-opacity-60" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: colors.textMuted }}>{title}</p>
          {loading ? (
            <Loader2 className="animate-spin mt-2" size={24} style={{ color: colors.accent }} />
          ) : (
            <p className="text-3xl font-bold mt-2" style={{ color: colors.textPrimary }}>{value}</p>
          )}
          {change && <p className="text-sm mt-2" style={{ color: changeColor }}>{change}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20` }}>{icon}</div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'programs'>('overview');

  const { data: analyticsResponse, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      try {
        const response = await api.admin.getAnalytics();
        return response?.data || response;
      } catch (error) {
        console.error('Analytics error:', error);
        return null;
      }
    },
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['admin', 'users-count'],
    queryFn: async () => {
      try {
        const response = await api.admin.getUsers({ page: 1, limit: 1 });
        return response;
      } catch (error) {
        console.error('Users count error:', error);
        return null;
      }
    },
  });

  const { data: programsResponse } = useQuery({
    queryKey: ['admin', 'programs-list'],
    queryFn: async () => {
      try {
        const response = await api.admin.getPrograms();
        return response;
      } catch (error) {
        console.error('Programs error:', error);
        return null;
      }
    },
  });

  const analytics = analyticsResponse || {};
  const totalUsers = usersResponse?.pagination?.total || usersResponse?.data?.length || 0;
  const programs = programsResponse?.data || [];
  const totalEnrollments = programs.reduce((sum: number, p: any) => sum + (p.enrollmentCount || p._count?.enrollments || 0), 0);
  const totalRevenue = analytics.totalRevenue || programs.reduce((sum: number, p: any) => sum + ((p.price || 0) * (p.enrollmentCount || p._count?.enrollments || 0)), 0);

  const enrollmentTrends = analytics.enrollmentTrends || [
    { month: 'Jan', enrollments: 0 },
    { month: 'Feb', enrollments: 0 },
    { month: 'Mar', enrollments: 0 },
    { month: 'Apr', enrollments: 0 },
    { month: 'May', enrollments: 0 },
    { month: 'Jun', enrollments: 0 },
  ];

  const revenueByProgram = programs.slice(0, 5).map((p: any, index: number) => ({
    name: p.title?.substring(0, 20) || `Program ${index + 1}`,
    value: (p.price || 0) * (p.enrollmentCount || p._count?.enrollments || 0),
  })).filter((p: any) => p.value > 0);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <BookOpen size={16} style={{ color: colors.accent }} />;
      case 'completion': return <UserCheck size={16} style={{ color: colors.success }} />;
      case 'registration': return <Users size={16} style={{ color: colors.warning }} />;
      default: return <Activity size={16} style={{ color: colors.textMuted }} />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'programs', label: 'Programs' },
  ] as const;

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={24} style={{ color: colors.accent }} />}
          loading={analyticsLoading}
        />
        <StatsCard
          title="Active Enrollments"
          value={totalEnrollments}
          icon={<BookOpen size={24} style={{ color: colors.accent }} />}
          loading={analyticsLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} style={{ color: colors.accent }} />}
          loading={analyticsLoading}
        />
        <StatsCard
          title="Total Programs"
          value={programs.length}
          icon={<Activity size={24} style={{ color: colors.accent }} />}
          loading={analyticsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Enrollment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" stroke={colors.textMuted} />
              <YAxis stroke={colors.textMuted} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.textPrimary }}
              />
              <Line type="monotone" dataKey="enrollments" stroke={colors.accent} strokeWidth={3} dot={{ fill: colors.accent, strokeWidth: 2 }} activeDot={{ r: 6, fill: colors.accentHover }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Revenue by Program</h3>
          {revenueByProgram.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByProgram}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: colors.textMuted }}
                >
                  {revenueByProgram.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.textPrimary }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center" style={{ color: colors.textMuted }}>
              No revenue data available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl p-6 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Your Programs</h3>
          </div>
          <div className="space-y-3">
            {programs.length > 0 ? (
              programs.slice(0, 5).map((program: any) => (
                <div
                  key={program.id || program.programId}
                  className="flex items-center gap-4 p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.background }}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.accent}15` }}>
                    <BookOpen size={16} style={{ color: colors.accent }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{program.title}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      {program.enrollmentCount || program._count?.enrollments || 0} enrolled
                    </p>
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.accent }}>
                    ${program.price || 0}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-8" style={{ color: colors.textMuted }}>No programs found</p>
            )}
          </div>
        </div>

        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New User', icon: Users },
              { label: 'Create Program', icon: BookOpen },
              { label: 'View Reports', icon: TrendingUp },
              { label: 'Send Notification', icon: Activity },
            ].map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200"
                style={{ backgroundColor: colors.background, color: colors.textPrimary }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.cardHover; e.currentTarget.style.borderLeft = `3px solid ${colors.accent}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.background; e.currentTarget.style.borderLeft = 'none'; }}
              >
                <action.icon size={18} style={{ color: colors.accent }} />
                <span className="text-sm font-medium">{action.label}</span>
                <ChevronRight size={16} className="ml-auto" style={{ color: colors.textMuted }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Admin Dashboard</h1>
        <p className="mt-2" style={{ color: colors.textMuted }}>Manage users, programs, and platform analytics</p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg mb-8 w-fit" style={{ backgroundColor: colors.card }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : colors.textSecondary,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'programs' && <ProgramManagement />}
    </div>
  );
};

export default AdminDashboard;
