import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  MoreVertical,
  DollarSign,
  Loader2,
  ChevronDown,
  ChevronRight,
  Globe,
  FolderPlus,
  Lock,
  Unlock,
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

// Category definitions - will be database-backed in future
const CATEGORIES = [
  {
    id: 'incredible-you',
    name: 'Incredible You',
    description: 'Coach training & personal development programs',
    color: '#5dade2',
    matchCodes: ['iy10', 'iyct', 'iyf', 'ciy10', 'htsm', 'ctffx', 'cffx'],
  },
  {
    id: 'secret-millionaire',
    name: 'Secret Millionaire Blueprint',
    description: 'Wealth building & money mindset programs',
    color: '#34c38f',
    matchCodes: ['smb', 'smbp', 'smbcry', 'mclg'],
  },
  {
    id: 'speak-to-fortune',
    name: 'Speak To Fortune',
    description: 'Public speaking mastery programs',
    color: '#f0ad4e',
    matchCodes: ['stfme', 'stf2', 'stf'],
  },
  {
    id: '6-figure-author',
    name: '6 Figure Author',
    description: 'Book writing & publishing system',
    color: '#e74c3c',
    matchCodes: ['btf'],
  },
];

interface Program {
  id: string;
  programId: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  duration?: string;
  status?: string;
  enrollmentCount?: number;
  completionRate?: number;
  revenue?: number;
  createdAt?: string;
  totalWeeks?: number;
  language?: string;
  _count?: {
    enrollments?: number;
    weeks?: number;
  };
}

interface ProgramCardProps {
  program: Program;
  categoryColor: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveCategory: (categoryId: string) => void;
  onToggleLock: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, categoryColor, onView, onEdit, onDelete, onMoveCategory, onToggleLock }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const status = program.status || 'published';
  const statusColors: Record<string, { bg: string; text: string }> = {
    published: { bg: `${colors.success}20`, text: colors.success },
    draft: { bg: `${colors.warning}20`, text: colors.warning },
    archived: { bg: `${colors.textMuted}20`, text: colors.textMuted },
  };
  const statusColor = statusColors[status] || statusColors.published;

  const enrollmentCount = program.enrollmentCount || program._count?.enrollments || 0;
  const totalWeeks = program.totalWeeks || program._count?.weeks || 0;

  // Detect language from programId
  const isHindi = program.language === 'HINDI';

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200 hover:border-opacity-60 relative"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      {/* Header - Full Title + Weeks */}
      <div
        className="h-32 relative flex flex-col items-center justify-center px-3 py-2"
        style={{ background: `linear-gradient(135deg, ${categoryColor}40, ${categoryColor}20)` }}
      >
        {/* Full Title */}
        <h3 
          className="text-center font-semibold text-sm leading-tight line-clamp-3 mb-2"
          style={{ color: colors.textPrimary }}
        >
          {program.title}
        </h3>
        
        {/* Weeks Badge */}
        <span 
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: `${categoryColor}30`, color: categoryColor }}
        >
          {totalWeeks} WEEKS
        </span>
        
        {/* Language Badge */}
        {isHindi && (
          <span
            className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: `${colors.warning}40`, color: colors.warning }}
          >
            <Globe size={10} />
            HI
          </span>
        )}
        
        {/* Status Badge */}
        <span
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
        >
          {status}
        </span>
      </div>

      {/* Footer - Enrolled + Price + Menu */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-1">
          <Users size={14} style={{ color: colors.textMuted }} />
          <span className="text-sm" style={{ color: colors.textMuted }}>
            {enrollmentCount}
          </span>
        </div>
        
        <span className="text-sm font-bold" style={{ color: colors.success }}>
          ${program.price || 0}
        </span>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg transition-colors hover:bg-opacity-50"
              style={{ color: colors.textMuted }}
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 bottom-full mb-1 w-40 rounded-lg shadow-xl border z-50"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <button
                  onClick={() => { onView(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                  style={{ color: colors.textPrimary }}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                  style={{ color: colors.textPrimary }}
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                  style={{ color: colors.textPrimary }}
                >
                  <FolderPlus size={14} /> Move to...
                </button>
                {showMoveMenu && (
                  <div className="border-t" style={{ borderColor: colors.border }}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { onMoveCategory(cat.id); setShowMenu(false); setShowMoveMenu(false); }}
                        className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                        style={{ color: colors.textMuted }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
                  <button
                  onClick={() => { onToggleLock(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                  style={{ color: program.status === 'locked' ? colors.success : colors.warning }}
                >
                  {program.status === 'locked' ? <Unlock size={14} /> : <Lock size={14} />}
                  {program.status === 'locked' ? 'Publish' : 'Lock'}
                </button>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                  style={{ color: colors.error }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

const ProgramManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'ENGLISH' | 'HINDI'>('all');
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'locked'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.id))
  );

  const { data: programsResponse, isLoading, isError } = useQuery({
    queryKey: ['admin', 'programs'],
    queryFn: async () => {
      const response = await api.admin.getPrograms();
      return response;
    },
  });

  const programs: Program[] = programsResponse || [];

  const togglePublishMutation = useMutation({
    mutationFn: ({ programId, isPublished }: { programId: string; isPublished: boolean }) =>
      api.admin.updateProgram(programId, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
    },
  });

  // Categorize programs
  const categorizeProgram = (program: Program): string => {
    const programId = program.programId?.toLowerCase() || '';
    
    for (const category of CATEGORIES) {
      for (const code of category.matchCodes) {
        if (programId.startsWith(code)) {
          return category.id;
        }
      }
    }
    return 'incredible-you'; // Default fallback
  };

  // Filter programs
  const filteredPrograms = programs.filter((program: Program) => {
    const matchesSearch = searchQuery === '' ||
      program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isHindi = program.language === 'HINDI';
    const matchesLanguage = languageFilter === 'all' ||
      (languageFilter === 'HINDI' && isHindi) ||
      (languageFilter === 'ENGLISH' && !isHindi);
    
    const matchesPublish = publishFilter === 'all' ||
      (publishFilter === 'published' && program.status === 'published') ||
      (publishFilter === 'locked' && program.status === 'locked');
    return matchesSearch && matchesLanguage && matchesPublish;
  });

  // Group by category
  const programsByCategory = CATEGORIES.map(category => ({
    ...category,
    programs: filteredPrograms.filter(p => categorizeProgram(p) === category.id),
  }));

  // Stats
  const totalEnrollments = programs.reduce((sum: number, p: Program) => 
    sum + (p.enrollmentCount || p._count?.enrollments || 0), 0);
  const totalRevenue = programs.reduce((sum: number, p: Program) => 
    sum + (p.revenue || 0), 0);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => setExpandedCategories(new Set(CATEGORIES.map(c => c.id)));
  const collapseAll = () => setExpandedCategories(new Set());

  const handleView = (program: Program) => {
    console.log('View program:', program);
  };

  const handleEdit = (program: Program) => {
    console.log('Edit program:', program);
  };

  const handleDelete = (program: Program) => {
    if (confirm(`Delete "${program.title}"?`)) {
      console.log('Delete program:', program);
    }
  };

  const handleToggleLock = (program: Program) => {
    togglePublishMutation.mutate({
      programId: program.id,
      isPublished: program.status === 'locked',
    });
  };

  const handleMoveCategory = (program: Program, categoryId: string) => {
    console.log('Move program:', program.title, 'to category:', categoryId);
    // TODO: API call to update program category
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: colors.accent }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p style={{ color: colors.error }}>Failed to load programs</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.accent}20` }}>
              <BookOpen size={20} style={{ color: colors.accent }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{programs.length}</p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Total Programs</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.success}20` }}>
              <Users size={20} style={{ color: colors.success }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{totalEnrollments}</p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Total Enrollments</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.warning}20` }}>
              <DollarSign size={20} style={{ color: colors.warning }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${totalRevenue.toLocaleString()}</p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.error}20` }}>
              <Globe size={20} style={{ color: colors.error }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {programs.filter(p => p.programId?.includes('-hi')).length}
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Hindi Programs</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.warning}20` }}>
              <Lock size={20} style={{ color: colors.warning }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {programs.filter((p: Program) => p.status === 'locked').length}
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Locked Programs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Language Filter */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
            {[
              { value: 'all', label: 'All' },
              { value: 'ENGLISH', label: 'English' },
              { value: 'HINDI', label: 'Hindi' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setLanguageFilter(option.value as 'all' | 'en' | 'hi')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: languageFilter === option.value ? colors.accent : colors.card,
                  color: languageFilter === option.value ? colors.background : colors.textMuted,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Publish Filter */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
            {[
              { value: 'all', label: 'All' },
              { value: 'published', label: 'Published' },
              { value: 'locked', label: 'Locked' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setPublishFilter(option.value as 'all' | 'published' | 'locked')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: publishFilter === option.value ? colors.warning : colors.card,
                  color: publishFilter === option.value ? colors.background : colors.textMuted,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={expandAll}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{ borderColor: colors.border, color: colors.textMuted, backgroundColor: colors.card }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{ borderColor: colors.border, color: colors.textMuted, backgroundColor: colors.card }}
          >
            Collapse All
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: colors.textMuted }}
            />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-64"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>

          {/* Add Program */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: colors.accent, color: colors.background }}
          >
            <Plus size={18} />
            Add Program
          </button>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-4">
        {programsByCategory.map(category => (
          <div
            key={category.id}
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <div className="flex items-center gap-3">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown size={20} style={{ color: category.color }} />
                ) : (
                  <ChevronRight size={20} style={{ color: category.color }} />
                )}
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <div className="text-left">
                  <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                    {category.name}
                  </h3>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${category.color}30`, color: category.color }}
                >
                  {category.programs.length} programs
                </span>
              </div>
            </button>

            {/* Category Content */}
            {expandedCategories.has(category.id) && (
              <div className="p-4 border-t" style={{ borderColor: colors.border }}>
                {category.programs.length === 0 ? (
                  <p className="text-center py-8" style={{ color: colors.textMuted }}>
                    No programs in this category
                    {(searchQuery || languageFilter !== 'all') && ' matching your filters'}
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {category.programs.map(program => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        categoryColor={category.color}
                        onView={() => handleView(program)}
                        onEdit={() => handleEdit(program)}
                        onDelete={() => handleDelete(program)}
                        onMoveCategory={(catId) => handleMoveCategory(program, catId)}
                        onToggleLock={() => handleToggleLock(program)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} style={{ color: colors.textMuted }} className="mx-auto mb-4 opacity-50" />
          <p style={{ color: colors.textMuted }}>No programs found</p>
          <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramManagement;
