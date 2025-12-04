// apps/frontend/src/pages/programs/ProgramListPage.tsx
// Program list page with correct API method names

import React from 'react';
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

// Circular Progress Component
const CircularProgress: React.FC<{ progress: number; size?: 'sm' | 'md' | 'lg' }> = ({ progress, size = 'md' }) => {
  const sizes = { sm: 60, md: 80, lg: 120 };
  const strokeWidths = { sm: 4, md: 6, lg: 8 };
  const dim = sizes[size];
  const strokeWidth = strokeWidths[size];
  const radius = (dim - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="transform -rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={progress >= 100 ? colors.success : colors.accent}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold" style={{ color: colors.textPrimary, fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1rem' : '0.75rem' }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

// Program Card Component
const ProgramCard: React.FC<{
  program: any;
  enrollment?: any;
  onClick: () => void;
}> = ({ program, enrollment, onClick }) => {
  const progress = enrollment?.completionPercentage || 0;
  const isEnrolled = !!enrollment;

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h3 className="text-lg font-semibold mb-3 line-clamp-2" style={{ color: colors.textPrimary }}>
        {program.name}
      </h3>

      {program.description && (
        <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textMuted }}>
          {program.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        {isEnrolled ? (
          <>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Week {enrollment.currentWeek || 1}
              </p>
              <button
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
              >
                Resume ▸
              </button>
            </div>
            <CircularProgress progress={progress} size="md" />
          </>
        ) : (
          <>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.border, color: colors.textMuted }}>
              {program.programType || 'Course'}
            </span>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
            >
              View ▸
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Main Component
const ProgramListPage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch all programs
  const { data: programs, isLoading: programsLoading, error: programsError } = useQuery({
    queryKey: ['programs'],
    queryFn: () => api.programs.getAll(),
    staleTime: 60000,
  });

  // Fetch user enrollments
  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.programs.getEnrolled(),
    staleTime: 60000,
  });

  // Create enrollment map for quick lookup
  const enrollmentMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    if (enrollments && Array.isArray(enrollments)) {
      enrollments.forEach((e: any) => {
        map[e.programId] = e;
      });
    }
    return map;
  }, [enrollments]);

  // Separate enrolled and available programs
  const enrolledPrograms = programs?.filter((p: any) => enrollmentMap[p.id || p.programId]) || [];
  const availablePrograms = programs?.filter((p: any) => !enrollmentMap[p.id || p.programId]) || [];

  if (programsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
          <p style={{ color: colors.textSecondary }}>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (programsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: colors.error }}>Error loading programs</p>
          <p className="text-sm" style={{ color: colors.textMuted }}>{(programsError as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>Programs</h1>
        <p style={{ color: colors.textMuted }}>Continue your learning journey</p>
      </div>

      {/* Enrolled Programs */}
      {enrolledPrograms.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            My Programs ({enrolledPrograms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledPrograms.map((program: any) => (
              <ProgramCard
                key={program.id || program.programId}
                program={program}
                enrollment={enrollmentMap[program.id || program.programId]}
                onClick={() => navigate(`/programs/${program.id || program.programId}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Programs */}
      {availablePrograms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Available Programs ({availablePrograms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrograms.map((program: any) => (
              <ProgramCard
                key={program.id || program.programId}
                program={program}
                onClick={() => navigate(`/programs/${program.id || program.programId}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Programs */}
      {(!programs || programs.length === 0) && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: colors.textMuted }}>No programs available</p>
        </div>
      )}
    </div>
  );
};

export default ProgramListPage;
