// apps/frontend/src/pages/dashboard/DashboardPage.tsx
// Master Plan Reference: PROJECT_MASTER_PLAN_PART2.md Section 11 Week 4 Day 1-3
// Dashboard with: Progress charts (Recharts), Recent activity feed, Quick actions
// Design System: #0a1628 bg, #1a2332 cards, #5dade2 accent, #34c38f success

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

// ============================================
// DESIGN SYSTEM COLORS (from SESSION9 handoff)
// ============================================
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

// ============================================
// ICONS (SVG Components)
// ============================================
const Icons = {
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  PlayCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.accent} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.warning} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Fire: () => (
    <svg className="w-5 h-5" fill="none" stroke="#ff6b6b" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke={colors.textMuted} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.accent} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Award: () => (
    <svg className="w-6 h-6" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
};

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
interface CircularProgressProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 'md',
  showText = true,
}) => {
  const sizes = {
    sm: { width: 60, strokeWidth: 4, fontSize: 12 },
    md: { width: 80, strokeWidth: 6, fontSize: 16 },
    lg: { width: 140, strokeWidth: 8, fontSize: 24 },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width, height: width }}>
      <svg className="transform -rotate-90" width={width} height={width}>
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {showText && (
        <div
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{ color: colors.textPrimary, fontSize }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendUp }) => (
  <div
    className="p-5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
    style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm mb-1" style={{ color: colors.textMuted }}>
          {label}
        </p>
        <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          {value}
        </p>
        {trend && (
          <p
            className="text-xs mt-1"
            style={{ color: trendUp ? colors.success : colors.error }}
          >
            {trend}
          </p>
        )}
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>
        {icon}
      </div>
    </div>
  </div>
);

// ============================================
// QUICK ACTION CARD COMPONENT
// ============================================
interface QuickActionCardProps {
  title: string;
  subtitle: string;
  link: string;
  type: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, subtitle, link, type }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getIcon = () => {
    switch (type) {
      case 'continue_program':
        return <Icons.PlayCircle />;
      case 'view_certificate':
        return <Icons.Award />;
      case 'start_new':
        return <Icons.BookOpen />;
      default:
        return <Icons.PlayCircle />;
    }
  };

  const getButtonStyle = () => {
    if (type === 'continue_program') {
      return { backgroundColor: colors.accent };
    }
    return { backgroundColor: colors.card, border: `1px solid ${colors.border}` };
  };

  return (
    <button
      onClick={() => navigate(link)}
      className="w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] text-left"
      style={getButtonStyle()}
    >
      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.background }}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-semibold" style={{ color: colors.textPrimary }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          {subtitle}
        </p>
      </div>
      <Icons.ArrowRight />
    </button>
  );
};

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================
interface ActivityItemProps {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, title, description, timestamp }) => {
  const getIcon = () => {
    switch (type) {
      case 'step_completed':
        return <Icons.CheckCircle />;
      case 'program_started':
        return <Icons.PlayCircle />;
      case 'week_completed':
        return <Icons.Trophy />;
      case 'achievement_unlocked':
        return <Icons.Trophy />;
      default:
        return <Icons.CheckCircle />;
    }
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg transition-colors"
      style={{ backgroundColor: colors.background }}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1" style={{ color: colors.textMuted }}>
        <Icons.Clock />
        <span className="text-xs whitespace-nowrap">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

// ============================================
// CUSTOM TOOLTIP FOR CHARTS
// ============================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg shadow-lg"
        style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
      >
        <p className="text-xs" style={{ color: colors.textMuted }}>
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: colors.accent }}>
          {payload[0].value} steps
        </p>
      </div>
    );
  }
  return null;
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.analytics.getDashboard(),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Also fetch enrolled programs for program cards (existing functionality)
  const { data: enrolledPrograms } = useQuery({
    queryKey: ['enrolled-programs'],
    queryFn: () => api.programs.getEnrolled(),
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: colors.accent, borderTopColor: 'transparent' }}
          />
          <p style={{ color: colors.textSecondary }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.card }}
        >
          <p style={{ color: colors.error }}>Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const weeklyProgress = dashboardData?.weeklyProgress || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const quickActions = dashboardData?.quickActions || [];
  const programProgress = dashboardData?.programProgress || [];

  // Pie chart data for program completion
  const pieData = [
    { name: 'Completed', value: stats?.completedPrograms || 0 },
    { name: 'In Progress', value: (stats?.enrolledPrograms || 0) - (stats?.completedPrograms || 0) },
  ];
  const PIE_COLORS = [colors.success, colors.accent];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Welcome Back!
        </h1>
        <p style={{ color: colors.textMuted }}>
          Here's an overview of your learning journey
        </p>
      </div>

      {/* Hero Section - Enrolled Program */}
      {enrolledPrograms && enrolledPrograms.length > 0 && (
        <div
          className="mb-8 p-8 rounded-2xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-lg mb-2" style={{ color: colors.textMuted }}>
                Welcome back, {user?.fullName?.split(" ")[0] || "there"}!
              </p>
              <h2 className="text-2xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
                {enrolledPrograms[0].program?.name || enrolledPrograms[0].name}
              </h2>
              <p className="mb-4" style={{ color: colors.textSecondary }}>
                Week {enrolledPrograms[0].currentWeek || 1} of {enrolledPrograms[0].program?.durationWeeks || 10}
              </p>
              <button
                onClick={() => navigate(`/programs/${enrolledPrograms[0].programId || enrolledPrograms[0].id}`)}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
              >
                Resume Program →
              </button>
            </div>
            <div className="flex-shrink-0">
              <CircularProgress
                percentage={enrolledPrograms[0].completionPercentage || 0}
                size="lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Programs Enrolled"
          value={stats?.enrolledPrograms || 0}
          icon={<Icons.BookOpen />}
        />
        <StatCard
          label="Programs Completed"
          value={stats?.completedPrograms || 0}
          icon={<Icons.Award />}
        />
        <StatCard
          label="Steps Completed"
          value={stats?.totalStepsCompleted || 0}
          icon={<Icons.CheckCircle />}
        />
        <StatCard
          label="Day Streak"
          value={stats?.currentStreak || 0}
          icon={<Icons.Fire />}
          trend={stats?.currentStreak && stats.currentStreak > 0 ? 'Keep it up!' : undefined}
          trendUp={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Progress Chart - Takes 2 columns */}
        <div
          className="lg:col-span-2 p-6 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Weekly Progress
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis
                  dataKey="week"
                  stroke={colors.textMuted}
                  tick={{ fill: colors.textMuted, fontSize: 12 }}
                />
                <YAxis
                  stroke={colors.textMuted}
                  tick={{ fill: colors.textMuted, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="stepsCompleted"
                  stroke={colors.accent}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSteps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Progress Circle - Takes 1 column */}
        <div
          className="p-6 rounded-xl flex flex-col items-center justify-center"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Overall Progress
          </h2>
          <CircularProgress percentage={stats?.overallProgress || 0} size="lg" />
          <p className="mt-4 text-sm" style={{ color: colors.textMuted }}>
            {stats?.totalStepsCompleted || 0} steps completed
          </p>
          
          {/* Mini pie chart */}
          {(stats?.enrolledPrograms || 0) > 0 && (
            <div className="mt-4 w-full">
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
                  Completed
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                  In Progress
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.length > 0 ? (
              quickActions.map((action) => (
                <QuickActionCard
                  key={action.id}
                  title={action.title}
                  subtitle={action.subtitle}
                  link={action.link}
                  type={action.type}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p style={{ color: colors.textMuted }}>No quick actions available</p>
                <Link
                  to="/programs"
                  className="inline-block mt-4 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
                >
                  Browse Programs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Recent Activity
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p style={{ color: colors.textMuted }}>No recent activity</p>
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                  Start learning to see your progress here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Progress Cards */}
      {programProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Your Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programProgress.map((program) => (
              <button
                key={program.programId}
                onClick={() => navigate(`/programs/${program.programId}`)}
                className="p-5 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {program.programName}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Week {program.currentWeek} of {program.totalWeeks}
                    </p>
                  </div>
                  <CircularProgress percentage={program.completionPercentage} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textMuted }}>
                    {program.stepsCompleted} / {program.totalSteps} steps
                  </span>
                  <span
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: colors.accent }}
                  >
                    Continue <Icons.ArrowRight />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!enrolledPrograms || enrolledPrograms.length === 0) && (
        <div
          className="text-center p-12 rounded-xl"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
        >
          <div className="mb-4">
            <Icons.BookOpen />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Start Your Journey
          </h3>
          <p className="mb-6" style={{ color: colors.textMuted }}>
            You haven't enrolled in any programs yet. Explore our programs to begin your transformation.
          </p>
          <Link
            to="/programs"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
          >
            Browse Programs
          </Link>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.background};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.textMuted};
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
