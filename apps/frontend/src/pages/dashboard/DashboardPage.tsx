// 📖 DOCUMENTATION REFERENCE: 
// - COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Lines 389-421 (Dashboard Layout)
// - PROJECT_MASTER_PLAN.md, Section 7.3 (React Query usage)
// - SESSION3_COMPLETE_HANDOFF.md, Priority 4 implementation
// 📋 SPEC: Fetch real programs from backend API, replace mock data
// 🔧 FIX: Changed Navigation and ProgramCard imports from default to named imports

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { ProgramCard } from '@/components/program/ProgramCard';
import { programsAPI } from '@/api/client';

interface Program {
  id: string;
  name: string;
  description: string;
  programType: string;
  language: string;
  durationWeeks: number;
  basePriceUsd: string;
  basePriceInr: string;
  basePriceAed: string;
}

interface Enrollment {
  id: string;
  enrollmentStatus: string;
  paymentStatus: string;
  completionPercentage: number;
  currentWeek: number;
  lastActivityAt: string;
  program: Program;
}

const DashboardPage = () => {
  const navigate = useNavigate();

  // Fetch user's enrolled programs
  const {
    data: enrolledData,
    isLoading: enrolledLoading,
    error: enrolledError,
  } = useQuery({
    queryKey: ['enrolled-programs'],
    queryFn: async () => {
      const response = await programsAPI.getEnrolledPrograms();
      return response.data;
    },
  });

  // Fetch all available programs
  const {
    data: allProgramsData,
    isLoading: allProgramsLoading,
    error: allProgramsError,
  } = useQuery({
    queryKey: ['all-programs'],
    queryFn: async () => {
      const response = await programsAPI.getAllPrograms();
      return response.data;
    },
  });

  // Loading state
  if (enrolledLoading || allProgramsLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading programs...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (enrolledError || allProgramsError) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-400">
            <h3 className="font-semibold mb-2">Error loading programs</h3>
            <p className="text-sm">
              {(enrolledError as Error)?.message || (allProgramsError as Error)?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API responses
  const enrollments: Enrollment[] = enrolledData?.data || [];
  const allPrograms: Program[] = allProgramsData?.data || [];

  // Get the most recently active enrolled program for hero card
  const activeEnrollment = enrollments.length > 0 ? enrollments[0] : null;

  // Filter programs: show enrolled programs first, then unenrolled programs
  const enrolledProgramIds = new Set(enrollments.map((e) => e.program.id));
  const unenrolledPrograms = allPrograms.filter((p) => !enrolledProgramIds.has(p.id));

  // Display programs: enrolled programs + unenrolled programs
  const displayPrograms = [
    ...enrollments.map((e) => ({
      ...e.program,
      enrollment: e, // Add enrollment data for display
    })),
    ...unenrolledPrograms.map((p) => ({
      ...p,
      enrollment: null, // No enrollment
    })),
  ];

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Hero Card - Show if user has active enrollment */}
        {activeEnrollment && (
          <div className="mb-12">
            <ProgramCard
              variant="hero"
              title={activeEnrollment.program.name}
              currentWeek={activeEnrollment.currentWeek}
              currentStep={`Current Progress: ${activeEnrollment.completionPercentage}%`}
              progress={activeEnrollment.completionPercentage}
              onResume={() => navigate(`/programs/${activeEnrollment.program.id}`)}
            />
          </div>
        )}

        {/* All Programs Section */}
        <div>
          <h2 className="text-white text-2xl font-semibold mb-6">
            {enrollments.length > 0 ? 'Continue Your Journey' : 'Available Programs'}
          </h2>

          {displayPrograms.length === 0 ? (
            <div className="bg-[#1a2332] rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">No programs available</p>
              <p className="text-gray-500 text-sm">
                Check back later for new coaching programs
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPrograms.map((program: any) => (
                <ProgramCard
                  key={program.id}
                  variant="grid"
                  title={program.name}
                  currentWeek={program.enrollment?.currentWeek || 1}
                  currentStep={
                    program.enrollment
                      ? `${program.enrollment.completionPercentage}% Complete`
                      : `${program.durationWeeks} weeks`
                  }
                  progress={program.enrollment?.completionPercentage || 0}
                  onResume={() => navigate(`/programs/${program.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State for Enrolled Programs */}
        {enrollments.length === 0 && allPrograms.length > 0 && (
          <div className="mt-12 bg-[#1a2332] rounded-xl p-8 border border-[#2a3b52]">
            <h3 className="text-white text-xl font-semibold mb-3">
              Start Your Transformation Journey
            </h3>
            <p className="text-gray-400 mb-4">
              You haven't enrolled in any programs yet. Choose a program above to begin your
              coaching journey with Arfeen Khan.
            </p>
            <div className="flex gap-4">
              <span className="text-[#5dade2] text-sm font-medium">
                ✓ World-class coaching programs
              </span>
              <span className="text-[#5dade2] text-sm font-medium">
                ✓ AI-powered personalization
              </span>
              <span className="text-[#5dade2] text-sm font-medium">
                ✓ Lifetime access
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
