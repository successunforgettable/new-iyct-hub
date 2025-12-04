// apps/frontend/src/pages/programs/ProgramDetailPage.tsx
// Original PHP Layout: Breadcrumb, Week Tabs, 2-Column (Step Info + Video), Step Carousel

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke={colors.success} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Play: () => (
    <svg className="w-16 h-16" fill={colors.accent} viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Section Tab Component (Week tabs with checkmarks)
const SectionTab: React.FC<{
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ label, isActive, isCompleted, onClick }) => (
  <button
    onClick={onClick}
    className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2"
    style={{
      backgroundColor: isActive ? colors.accent : colors.card,
      color: isActive ? colors.textPrimary : isCompleted ? colors.textPrimary : colors.textMuted,
      border: `1px solid ${isActive ? colors.accent : isCompleted ? 'rgba(93, 173, 226, 0.3)' : colors.border}`,
    }}
  >
    {label}
    {isCompleted && <Icons.Check />}
  </button>
);

// Video Player Component
const VideoPlayer: React.FC<{
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  currentStep: number;
  totalSteps: number;
}> = ({ videoUrl, thumbnailUrl, duration = '06:13', currentStep, totalSteps }) => (
  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.card }}>
    {/* Video Area */}
    <div className="relative aspect-video bg-black flex items-center justify-center">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
      )}
      {/* Play Button Overlay */}
      <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(93, 173, 226, 0.9)' }}>
          <Icons.Play />
        </div>
      </button>
    </div>
    {/* Video Info */}
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
        <Icons.Clock />
        <span className="text-sm">{duration}</span>
      </div>
      <span className="text-sm" style={{ color: colors.accent }}>
        {currentStep} of {totalSteps} steps
      </span>
    </div>
  </div>
);

// Step Card for Carousel
const StepCard: React.FC<{
  step: any;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ step, isActive, isCompleted, onClick }) => (
  <div
    onClick={onClick}
    className="flex-shrink-0 w-48 p-4 rounded-lg cursor-pointer transition-all"
    style={{
      backgroundColor: isActive ? colors.accent : colors.card,
      border: `2px solid ${isActive ? colors.accent : isCompleted ? colors.success : colors.border}`,
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium" style={{ color: isActive ? colors.textPrimary : colors.textMuted }}>
        STEP {step.stepNumber}
      </span>
      {isCompleted && <Icons.CheckCircle />}
    </div>
    <p className="text-sm font-medium line-clamp-2" style={{ color: isActive ? colors.textPrimary : colors.textSecondary }}>
      {step.title}
    </p>
  </div>
);

// Main Component
const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [program, setProgram] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, any>>({});
  
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!programId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch program
        const programRes = await api.programs.getById(programId);
        const prog = programRes?.data || programRes;
        if (!prog) throw new Error('Program not found');
        setProgram(prog);

        // Fetch weeks
        const weeksRes = await api.programs.getWeeks(programId);
        const weeksData = weeksRes?.data || weeksRes || [];
        setWeeks(Array.isArray(weeksData) ? weeksData : []);

        // Fetch enrollment
        try {
          const enrollRes = await api.programs.getEnrolled();
          const enrollments = enrollRes?.data || enrollRes || [];
          const found = enrollments.find((e: any) => e.program?.id === programId || e.programId === programId);
          
          if (found) {
            setEnrollment(found);
            setActiveWeek(found.currentWeek || 1);

            // Fetch progress
            try {
              const progressRes = await api.progress.getEnrollmentProgress(found.enrollmentId);
              const progressData = progressRes?.data || progressRes;
              if (progressData?.stepProgress) {
                const map: Record<string, any> = {};
                progressData.stepProgress.forEach((sp: any) => {
                  map[sp.stepId] = sp;
                });
                setStepProgress(map);
              }
            } catch (e) { console.log('No progress data'); }
          }
        } catch (e) { console.log('No enrollment'); }

      } catch (err: any) {
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  // Get current week and step data
  const currentWeekData = weeks.find((w: any) => w.weekNumber === activeWeek);
  const steps = currentWeekData?.steps || [];
  const currentStep = steps[activeStepIndex];
  const isStepCompleted = currentStep && (
    stepProgress[currentStep.id]?.status === 'COMPLETED' ||
    stepProgress[currentStep.id]?.status === 'completed' ||
    stepProgress[currentStep.stepId]?.status === 'COMPLETED' ||
    stepProgress[currentStep.stepId]?.status === 'completed'
  );

  // Handle step completion
  const handleMarkComplete = async () => {
    if (!enrollment || !currentStep || completing) return;

    setCompleting(true);
    try {
      const stepId = currentStep.id || currentStep.stepId;
      await api.progress.completeStep(stepId, enrollment.enrollmentId);

      // Update local state
      setStepProgress(prev => ({
        ...prev,
        [stepId]: { ...prev[stepId], status: 'COMPLETED' }
      }));

      // Auto-advance to next step
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex(activeStepIndex + 1);
      }
    } catch (err) {
      console.error('Error completing step:', err);
    } finally {
      setCompleting(false);
    }
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!programId) return;
    try {
      const res = await api.programs.enroll(programId);
      setEnrollment(res?.data || res);
      setActiveWeek(1);
      setActiveStepIndex(0);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to enroll');
    }
  };

  // Calculate week completion
  const isWeekCompleted = (week: any) => {
    const weekSteps = week.steps || [];
    if (weekSteps.length === 0) return false;
    return weekSteps.every((s: any) => {
      const p = stepProgress[s.id] || stepProgress[s.stepId];
      return p?.status === 'COMPLETED' || p?.status === 'completed';
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: colors.error }}>{error || 'Program not found'}</p>
          <button onClick={() => navigate('/programs')} className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.accent, color: colors.textPrimary }}>
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Breadcrumb */}
      <div className="px-6 py-4 flex items-center gap-2 text-sm" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button onClick={() => navigate('/programs')} className="flex items-center gap-2 hover:text-white transition-colors" style={{ color: colors.textMuted }}>
          <Icons.ArrowLeft />
          Back
        </button>
        <span style={{ color: colors.textMuted }}>|</span>
        <span style={{ color: colors.textMuted }}>Program</span>
        <Icons.ChevronRight />
        <span style={{ color: colors.textMuted }}>{program.name}</span>
        {currentWeekData && (
          <>
            <Icons.ChevronRight />
            <span style={{ color: colors.textMuted }}>Week {activeWeek}</span>
          </>
        )}
        {currentStep && (
          <>
            <Icons.ChevronRight />
            <span style={{ color: colors.textPrimary }}>STEP {currentStep.stepNumber}</span>
          </>
        )}
      </div>

      {/* Week Tabs */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto" style={{ borderBottom: `1px solid ${colors.border}` }}>
        {weeks.map((week: any) => (
          <SectionTab
            key={week.id || week.weekId}
            label={week.title || `Week ${week.weekNumber}`}
            isActive={activeWeek === week.weekNumber}
            isCompleted={isWeekCompleted(week)}
            onClick={() => { setActiveWeek(week.weekNumber); setActiveStepIndex(0); }}
          />
        ))}
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="p-6">
        {!enrollment ? (
          // Not Enrolled State
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>{program.name}</h2>
            <p className="mb-6" style={{ color: colors.textMuted }}>{program.description || 'Start your learning journey'}</p>
            <button onClick={handleEnroll} className="px-8 py-3 rounded-lg font-medium text-lg" style={{ backgroundColor: colors.accent, color: colors.textPrimary }}>
              Enroll Now
            </button>
          </div>
        ) : currentStep ? (
          // Step Content - 2 Column
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Step Info */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <span className="text-sm font-medium" style={{ color: colors.textMuted }}>STEP {currentStep.stepNumber}</span>
              <h2 className="text-2xl font-bold mt-2 mb-4 uppercase" style={{ color: colors.accent }}>
                {currentStep.title}
              </h2>
              
              {currentStep.description && (
                <p className="mb-6" style={{ color: colors.textSecondary }}>
                  {currentStep.description}
                </p>
              )}

              <div className="flex flex-col gap-4">
                {!isStepCompleted ? (
                  <button
                    onClick={handleMarkComplete}
                    disabled={completing}
                    className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    style={{ backgroundColor: colors.accent, color: colors.textPrimary }}
                  >
                    {completing ? 'Completing...' : 'Mark as Complete ▸'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 py-3" style={{ color: colors.success }}>
                    <Icons.CheckCircle />
                    <span className="font-medium">Step Completed</span>
                  </div>
                )}

                {/* Next Step Button */}
                {activeStepIndex < steps.length - 1 && (
                  <button
                    onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                    className="px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                  >
                    Next Step →
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Video Player */}
            <VideoPlayer
              videoUrl={currentStep.videoUrl}
              thumbnailUrl={currentStep.thumbnailUrl}
              duration={currentStep.duration || '06:13'}
              currentStep={activeStepIndex + 1}
              totalSteps={steps.length}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <p style={{ color: colors.textMuted }}>No steps available for this week</p>
          </div>
        )}

        {/* Step Carousel */}
        {steps.length > 0 && enrollment && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                {currentWeekData?.title || `Week ${activeWeek}`} - {steps.length} Steps
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ backgroundColor: colors.card, color: colors.textPrimary }}
                >
                  <Icons.ChevronLeft />
                </button>
                <button
                  onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
                  disabled={activeStepIndex === steps.length - 1}
                  className="p-2 rounded-lg disabled:opacity-30"
                  style={{ backgroundColor: colors.card, color: colors.textPrimary }}
                >
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4">
              {steps.map((step: any, index: number) => {
                const stepId = step.id || step.stepId;
                const progress = stepProgress[stepId];
                const completed = progress?.status === 'COMPLETED' || progress?.status === 'completed';
                
                return (
                  <StepCard
                    key={stepId}
                    step={step}
                    isActive={index === activeStepIndex}
                    isCompleted={completed}
                    onClick={() => setActiveStepIndex(index)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;
