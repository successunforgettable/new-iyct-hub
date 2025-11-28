// 📖 DOCUMENTATION REFERENCE:
// - COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md, Lines 481-513 (Program Grid Layouts)
// - PROJECT_MASTER_PLAN.md, Section 6.1 (API endpoints)
// - SESSION4_COMPLETE_HANDOFF.md, Priority 5 requirements
// 📋 SPEC: Dedicated programs page with filters, search, and enrollment
// 🔧 FIX: Proper card layout - buttons inside cards, no absolute positioning

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { programsAPI } from '@/api/client';
import { Search } from 'lucide-react';

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
  completionPercentage: number;
  currentWeek: number;
  program: Program;
}

const ProgramListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for filters and search
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingProgramId, setEnrollingProgramId] = useState<string | null>(null);

  // Fetch all programs
  const {
    data: allProgramsData,
    isLoading: programsLoading,
    error: programsError,
  } = useQuery({
    queryKey: ['all-programs'],
    queryFn: async () => {
      const response = await programsAPI.getAllPrograms();
      return response.data;
    },
  });

  // Fetch user's enrollments
  const {
    data: enrolledData,
    isLoading: enrolledLoading,
  } = useQuery({
    queryKey: ['enrolled-programs'],
    queryFn: async () => {
      const response = await programsAPI.getEnrolledPrograms();
      return response.data;
    },
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (programId: string) => programsAPI.enrollInProgram(programId),
    onSuccess: () => {
      // Refetch enrolled programs
      queryClient.invalidateQueries({ queryKey: ['enrolled-programs'] });
      setEnrollingProgramId(null);
      
      // Show success message
      alert('Successfully enrolled in program!');
    },
    onError: (error: any) => {
      setEnrollingProgramId(null);
      const message = error.response?.data?.error?.message || 'Enrollment failed';
      alert(message);
    },
  });

  // Extract data
  const allPrograms: Program[] = allProgramsData?.data || [];
  const enrollments: Enrollment[] = enrolledData?.data || [];
  const enrolledProgramIds = new Set(enrollments.map((e) => e.program.id));

  // Get unique program types for filter tabs
  const programTypes = ['ALL', ...new Set(allPrograms.map((p) => p.programType))];

  // Filter and search logic
  const filteredPrograms = useMemo(() => {
    let filtered = allPrograms;

    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter((p) => p.programType === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allPrograms, selectedType, searchQuery]);

  // Loading state
  if (programsLoading || enrolledLoading) {
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
  if (programsError) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-400">
            <h3 className="font-semibold mb-2">Error loading programs</h3>
            <p className="text-sm">{(programsError as Error)?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle enrollment
  const handleEnroll = (programId: string) => {
    setEnrollingProgramId(programId);
    enrollMutation.mutate(programId);
  };

  // Get enrollment data for a program
  const getEnrollmentData = (programId: string) => {
    return enrollments.find((e) => e.program.id === programId);
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-semibold mb-2">All Programs</h1>
          <p className="text-gray-400">
            Explore our coaching programs and start your transformation journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1a2332] border border-[#2a3b52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5dade2] transition-colors"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {programTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${
                    selectedType === type
                      ? 'bg-[#5dade2] text-white'
                      : 'bg-[#1a2332] text-gray-400 border border-[#2a3b52] hover:border-[#5dade2]'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-[#1a2332] rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No programs found</p>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No programs available in this category'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => {
                const enrollment = getEnrollmentData(program.id);
                const isEnrolled = enrolledProgramIds.has(program.id);
                const isEnrolling = enrollingProgramId === program.id;

                return (
                  <div key={program.id} className="bg-[#1a2332] rounded-xl p-6 border border-[#2a3b52] hover:border-[#5dade2] transition-all">
                    {/* Program Title */}
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {program.name}
                    </h3>

                    {/* Program Info */}
                    <div className="text-gray-400 text-sm mb-2">
                      Week {enrollment?.currentWeek || 1}
                    </div>
                    <div className="text-gray-300 text-sm mb-6">
                      {enrollment
                        ? `${enrollment.completionPercentage}% Complete`
                        : `${program.durationWeeks} weeks`}
                    </div>

                    {/* Progress and Buttons */}
                    <div className="flex justify-between items-center">
                      {isEnrolled ? (
                        <button
                          onClick={() => navigate(`/programs/${program.id}`)}
                          className="bg-[#5dade2] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7dc8f0] transition-colors"
                        >
                          Resume ▸
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(program.id)}
                          disabled={isEnrolling}
                          className="bg-[#34c38f] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2ba87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                      )}

                      <CircularProgress 
                        value={enrollment?.completionPercentage || 0} 
                        size="md" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Summary */}
            <div className="mt-8 text-center text-gray-400 text-sm">
              Showing {filteredPrograms.length} of {allPrograms.length} programs
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-[#1a2332] rounded-xl p-8 border border-[#2a3b52]">
          <h3 className="text-white text-xl font-semibold mb-3">
            Why Choose Our Programs?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-[#5dade2] text-2xl font-bold mb-2">1,500+</div>
              <div className="text-gray-400 text-sm">Active Coaches Worldwide</div>
            </div>
            <div>
              <div className="text-[#5dade2] text-2xl font-bold mb-2">43+</div>
              <div className="text-gray-400 text-sm">Countries Represented</div>
            </div>
            <div>
              <div className="text-[#5dade2] text-2xl font-bold mb-2">AI-Powered</div>
              <div className="text-gray-400 text-sm">Personalized Coaching</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListPage;
