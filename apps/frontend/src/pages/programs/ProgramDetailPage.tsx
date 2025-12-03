import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SectionTabs } from '@/components/program/SectionTabs';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { StepCarousel } from '@/components/program/StepCarousel';

interface Program {
  id: string;
  name: string;
  description?: string;
  durationWeeks: number;
}

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  contentType: string;
  contentUrl?: string;
  contentHtml?: string;
  durationMinutes?: number;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description?: string;
  steps: Step[];
}

interface Enrollment {
  enrollmentId: string;
  program: {
    id: string;
    name: string;
  };
  completionPercentage: number;
  currentWeek: number;
}

const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [program, setProgram] = useState<Program | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWeekCompleteModal, setShowWeekCompleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!programId) return;

      try {
        console.log('🔄 Fetching program data for:', programId);

        // Fetch program details
        const programResponse = await api.programs.getById(programId);
        const programData = programResponse.data;
        setProgram(programData);
        console.log('✅ Program loaded:', programData.name);

        // Fetch weeks
        const weeksResponse = await api.programs.getWeeks(programId);
        const weeksData = weeksResponse.data;
        setWeeks(weeksData);
        console.log('✅ Weeks loaded:', weeksData.length, 'weeks');

        // Fetch user enrollments
        console.log('🔄 Fetching user enrollments...');
        const enrollmentsResponse = await api.programs.getEnrolled();
        const enrollments = enrollmentsResponse.data;

        console.log('📦 Raw enrollments response:', enrollments);
        console.log('📊 Number of enrollments:', enrollments.length);

        enrollments.forEach((e: any, index: number) => {
          console.log(`Enrollment ${index + 1}:`, {
            enrollmentId: e.enrollmentId,
            programId: e.program?.id,
            programName: e.program?.name || 'Unknown',
            fullObject: e
          });
        });

        console.log('🔍 Looking for programId:', programId);

        let currentEnrollment = enrollments.find((e: any) => 
          e.program?.id === programId
        );

        if (!currentEnrollment) {
          console.log('⚠️ First attempt failed, trying string comparison...');
          currentEnrollment = enrollments.find((e: any) => 
            String(e.program?.id) === String(programId)
          );
        }

        if (currentEnrollment) {
          console.log('✅ Enrollment found:', currentEnrollment.enrollmentId);
          console.log('📊 Current completion:', currentEnrollment.completionPercentage + '%');
          setEnrollment(currentEnrollment);

          // Fetch progress
          console.log('🔄 Fetching enrollment progress...');
          try {
            const progressResponse = await api.progress.getEnrollmentProgress(
              currentEnrollment.enrollmentId
            );
            const progressData = progressResponse.data;
            
            // ✅ FIXED: API returns stepProgress array, not weeks.steps
            const completed: string[] = [];
            progressData.stepProgress?.forEach((progress: any) => {
              // Handle both uppercase and lowercase status
              if (progress.status === 'COMPLETED' || progress.status === 'completed') {
                completed.push(progress.stepId);
              }
            });
            
            setCompletedSteps(completed);
            console.log('✅ Progress loaded, completed steps:', completed.length);
            
            // Update completion percentage
            if (currentEnrollment.completionPercentage !== progressData.completionPercentage) {
              setEnrollment({
                ...currentEnrollment,
                completionPercentage: progressData.completionPercentage
              });
            }
          } catch (error: any) {
            if (error.response?.status === 404) {
              console.log('ℹ️ No progress found yet (first time viewing program)');
              console.log('Error details:', error.response?.data);
            } else {
              console.error('❌ Error fetching progress:', error);
            }
          }
        } else {
          console.log('⚠️ No enrollment found for this program');
          console.log('💡 User may need to enroll first');
        }

      } catch (error) {
        console.error('❌ Error fetching program data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, enrollmentId }: { stepId: string; enrollmentId: string }) => {
      return api.progress.completeStep(stepId, enrollmentId);
    },
    onSuccess: async (response, variables) => {
      console.log('✅ Step marked complete successfully:', response.data);
      
      // Update local completed steps immediately
      setCompletedSteps(prev => [...prev, variables.stepId]);
      
      // Refetch progress to get updated completion percentage
      try {
        const progressResponse = await api.progress.getEnrollmentProgress(variables.enrollmentId);
        const progressData = progressResponse.data;
        
        if (enrollment) {
          setEnrollment({
            ...enrollment,
            completionPercentage: progressData.completionPercentage
          });
        }
        
      } catch (error) {
        console.error('Error refetching progress:', error);
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress', variables.enrollmentId] });
    },
    onError: (error: any) => {
      console.error('❌ Error completing step:', error);
      if (error.response?.status === 404) {
        alert('Progress tracking endpoint not found. Please ensure backend is running.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to mark step as complete. Please try again.');
      }
    }
  });

  const currentWeek = weeks[activeWeekIndex];
  const currentStep = currentWeek?.steps?.[activeStepIndex];
  const isStepCompleted = currentStep ? completedSteps.includes(currentStep.id) : false;

  // Helper function to check if current week is complete
  const isWeekComplete = (weekIndex: number): boolean => {
    const week = weeks[weekIndex];
    if (!week) return false;
    return week.steps.every(step => completedSteps.includes(step.id));
  };

  const handleMarkComplete = async () => {
    if (!currentStep || !enrollment || isStepCompleted || completeStepMutation.isPending) {
      return;
    }

    try {
      await completeStepMutation.mutateAsync({
        stepId: currentStep.id,
        enrollmentId: enrollment.enrollmentId
      });

      // Check if week is complete after this step
      if (isWeekComplete(activeWeekIndex)) {
        setShowWeekCompleteModal(true);
      } else {
        // Auto-advance to next step
        setTimeout(() => {
          handleNextStep();
        }, 500);
      }
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  const handleNextStep = () => {
    if (!currentWeek) return;

    if (activeStepIndex < currentWeek.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else if (activeWeekIndex < weeks.length - 1) {
      setActiveWeekIndex(activeWeekIndex + 1);
      setActiveStepIndex(0);
    }
  };

  const handlePreviousStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    } else if (activeWeekIndex > 0) {
      setActiveWeekIndex(activeWeekIndex - 1);
      setActiveStepIndex(weeks[activeWeekIndex - 1]?.steps.length - 1 || 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!program || !weeks.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Program not found</div>
      </div>
    );
  }

  const totalSteps = weeks.reduce((sum, week) => sum + week.steps.length, 0);
  const completionPercentage = enrollment?.completionPercentage || 0;

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Breadcrumb */}
      <div className="border-b border-[#2a3b52] bg-[#1a2332] px-6 py-4">
        <Breadcrumb
          items={[
            { label: 'Programs', path: '/programs' },
            { label: program.name, path: `/programs/${program.id}` },
            { label: currentWeek?.title || 'Week 1' },
            { label: currentStep?.title || 'Step 1' }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Warning if not enrolled */}
        {!enrollment && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-500 font-medium">
              ⚠️ You are not enrolled in this program. Some features may be limited.
            </p>
          </div>
        )}

        {/* Program Header */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Program Info */}
          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52]">
            <h1 className="text-white text-2xl font-semibold mb-4">
              {program.name}
            </h1>
            <div className="text-gray-400 text-sm mb-2">
              Week {activeWeekIndex + 1} of {weeks.length}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-white font-semibold text-lg mb-1">Program Progress</div>
                <div className="text-[#5dade2] text-3xl font-bold">{completionPercentage}%</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {completedSteps.length} of {totalSteps} steps completed
            </div>
          </div>
        </div>

        {/* Week Tabs */}
        <div className="mb-8">
          <SectionTabs
            weeks={weeks}
            activeWeek={activeWeekIndex + 1}
            onWeekChange={(weekNum) => setActiveWeekIndex(weekNum - 1)}
            completedWeeks={[]}
          />
        </div>

        {/* Step Content */}
        {currentStep && (
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left: Content */}
            <div className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52]">
              <div className="text-gray-400 text-sm mb-2">
                STEP {currentStep.stepNumber}
              </div>

              <h2 className="text-[#5dade2] text-3xl font-semibold uppercase mb-6">
                {currentStep.title}
              </h2>

              {currentStep.contentHtml && (
                <div
                  className="text-gray-300 text-base leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: currentStep.contentHtml }}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleMarkComplete}
                  disabled={!enrollment || isStepCompleted || completeStepMutation.isPending}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    isStepCompleted
                      ? 'bg-green-500 text-white cursor-default'
                      : !enrollment
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : completeStepMutation.isPending
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-[#5dade2] text-white hover:bg-[#7dc8f0] cursor-pointer'
                  }`}
                >
                  {completeStepMutation.isPending
                    ? 'Marking...'
                    : isStepCompleted
                    ? '✓ Completed'
                    : !enrollment
                    ? 'Not Enrolled'
                    : 'Mark Complete'
                  }
                </button>

                <button
                  onClick={handleNextStep}
                  className="bg-[#5dade2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7dc8f0] transition-all"
                >
                  Next Step →
                </button>
              </div>

              {isStepCompleted && (
                <div className="text-green-500 text-sm font-medium mt-4">
                  ✓ Step Completed
                </div>
              )}
            </div>

            {/* Right: Video Player */}
            <div>
              <VideoPlayer
                src={currentStep.contentUrl}
                thumbnail={currentStep.contentUrl}
                duration={currentStep.durationMinutes ? `${currentStep.durationMinutes} min` : undefined}
              />
            </div>
          </div>
        )}

        {/* Step Carousel */}
        {currentWeek && (
          <StepCarousel
            steps={currentWeek.steps}
            activeStepIndex={activeStepIndex}
            onStepClick={setActiveStepIndex}
            completedSteps={completedSteps}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            disabled={activeWeekIndex === 0 && activeStepIndex === 0}
            className="bg-[#2a3b52] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3d5170] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            onClick={handleNextStep}
            disabled={activeWeekIndex === weeks.length - 1 && activeStepIndex === currentWeek.steps.length - 1}
            className="bg-[#5dade2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7dc8f0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* Week Complete Modal */}
      {showWeekCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] rounded-xl p-8 max-w-md mx-4 border border-[#2a3b52]">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Week {activeWeekIndex + 1} Complete!
              </h2>
              <p className="text-gray-300 mb-6">
                Congratulations! You've completed all steps in Week {activeWeekIndex + 1}.
              </p>
              <button
                onClick={() => {
                  setShowWeekCompleteModal(false);
                  if (activeWeekIndex < weeks.length - 1) {
                    setActiveWeekIndex(activeWeekIndex + 1);
                    setActiveStepIndex(0);
                  }
                }}
                className="bg-[#5dade2] text-white px-6 py-3 rounded-lg hover:bg-[#7dc8f0]"
              >
                {activeWeekIndex < weeks.length - 1 
                  ? `Continue to Week ${activeWeekIndex + 2}`
                  : 'Finish Program'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramDetailPage;
