// apps/frontend/src/pages/coach/CoachDashboardPage.tsx
// Master Plan Reference: PROJECT_MASTER_PLAN_PART2.md Section 11 Week 4 Day 4-5
// Coach Dashboard: Client list, progress overview, certification status
// Design System: #0a1628 bg, #1a2332 cards, #5dade2 accent, #34c38f success

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  UserCheck: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Award: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.warning} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke={colors.textMuted} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.textMuted} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

// Stat Card Component
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
}> = ({ label, value, icon, subtext }) => (
  <div
    className="p-5 rounded-xl"
    style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: colors.textMuted }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{value}</p>
        {subtext && (
          <p className="text-xs mt-1" style={{ color: colors.success }}>{subtext}</p>
        )}
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>
        {icon}
      </div>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number; size?: 'sm' | 'md' }> = ({ progress, size = 'md' }) => (
  <div
    className={`w-full rounded-full ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
    style={{ backgroundColor: colors.border }}
  >
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{
        width: `${Math.min(progress, 100)}%`,
        backgroundColor: progress >= 100 ? colors.success : colors.accent,
      }}
    />
  </div>
);

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: 'rgba(52, 195, 143, 0.2)', text: colors.success },
    inactive: { bg: 'rgba(160, 160, 160, 0.2)', text: colors.textMuted },
    completed: { bg: 'rgba(93, 173, 226, 0.2)', text: colors.accent },
    pending: { bg: 'rgba(240, 173, 78, 0.2)', text: colors.warning },
    approved: { bg: 'rgba(52, 195, 143, 0.2)', text: colors.success },
    rejected: { bg: 'rgba(220, 53, 69, 0.2)', text: colors.error },
    in_review: { bg: 'rgba(93, 173, 226, 0.2)', text: colors.accent },
  };

  const color = statusColors[status] || statusColors.inactive;

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

// Client Row Component
const ClientRow: React.FC<{
  client: any;
  onClick: () => void;
}> = ({ client, onClick }) => {
  const formatTime = (ts: string | null) => {
    if (!ts) return 'Never';
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors"
      style={{ backgroundColor: colors.background }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.cardHover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.background)}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: colors.accent }}
      >
        {client.fullName?.charAt(0)?.toUpperCase() || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ color: colors.textPrimary }}>
          {client.fullName}
        </p>
        <p className="text-sm truncate" style={{ color: colors.textMuted }}>
          {client.email}
        </p>
      </div>

      {/* Progress */}
      <div className="w-24 hidden sm:block">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: colors.textMuted }}>Progress</span>
          <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
            {client.overallProgress}%
          </span>
        </div>
        <ProgressBar progress={client.overallProgress} size="sm" />
      </div>

      {/* Programs */}
      <div className="text-center hidden md:block">
        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          {client.enrolledPrograms}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>Programs</p>
      </div>

      {/* Status */}
      <StatusBadge status={client.status} />

      {/* Last Active */}
      <div className="text-right hidden lg:block">
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {formatTime(client.lastActive)}
        </p>
      </div>

      <Icons.ChevronRight />
    </div>
  );
};

// Main Coach Dashboard Component
const CoachDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => api.coach.getDashboard(),
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: colors.accent, borderTopColor: 'transparent' }}
          />
          <p style={{ color: colors.textSecondary }}>Loading coach dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: colors.card }}>
          <p style={{ color: colors.error }}>Failed to load dashboard</p>
          <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
            Make sure you have coach permissions
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
          >
            Go to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const clients = data?.clients || [];
  const certifications = data?.certifications || [];
  const recentActivity = data?.recentClientActivity || [];

  // Filter clients
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch = client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Coach Dashboard
        </h1>
        <p style={{ color: colors.textMuted }}>
          Manage your clients and track their progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Clients"
          value={stats?.totalClients || 0}
          icon={<Icons.Users />}
        />
        <StatCard
          label="Active Clients"
          value={stats?.activeClients || 0}
          icon={<Icons.UserCheck />}
          subtext="Active this week"
        />
        <StatCard
          label="Avg. Progress"
          value={`${stats?.averageClientProgress || 0}%`}
          icon={<Icons.TrendingUp />}
        />
        <StatCard
          label="Certifications"
          value={stats?.certificationsEarned || 0}
          icon={<Icons.Award />}
          subtext={stats?.pendingCertifications ? `${stats.pendingCertifications} pending` : undefined}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Client List - 2 columns */}
        <div
          className="lg:col-span-2 p-6 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Clients ({filteredClients.length})
            </h2>
            <div className="flex gap-2">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg text-sm w-48"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icons.Search />
                </div>
              </div>
              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client: any) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onClick={() => navigate(`/coach/clients/${client.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p style={{ color: colors.textMuted }}>No clients found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Certifications & Activity */}
        <div className="space-y-6">
          {/* Certifications */}
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.length > 0 ? (
                certifications.slice(0, 5).map((cert: any) => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
                        {cert.programName}
                      </p>
                      <StatusBadge status={cert.status} />
                    </div>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      Submitted {new Date(cert.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center py-4" style={{ color: colors.textMuted }}>
                  No certifications yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Client Activity */}
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Recent Activity
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
                    >
                      {activity.clientName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: colors.textPrimary }}>
                        <span className="font-medium">{activity.clientName}</span>
                      </p>
                      <p className="text-xs truncate" style={{ color: colors.textMuted }}>
                        {activity.action}
                      </p>
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        {activity.programName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: colors.textMuted }}>
                      <Icons.Clock />
                      <span className="text-xs whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center py-4" style={{ color: colors.textMuted }}>
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboardPage;
