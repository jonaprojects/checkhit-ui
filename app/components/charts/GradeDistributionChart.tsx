import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Award, TrendingUp, CheckCircle, BarChart3, Filter, ChevronDown, Maximize2 } from 'lucide-react';
import { DashboardChartSkeleton } from '../ui/Skeleton';
import { ChartModal } from '../ui/ChartModal';
import type { LecturerGradeDistribution, CourseGradeStats, GradeDistributionBucket } from '../../lib/api/types';

export interface GradeDistributionChartProps {
  distributionData?: LecturerGradeDistribution;
  isLoading?: boolean;
}

const DEFAULT_BUCKET_COLORS: Record<string, { color: string; darkColor: string }> = {
  rangeBelow60: { color: '#f43f5e', darkColor: '#fb7185' },
  range60_69: { color: '#f59e0b', darkColor: '#fbbf24' },
  range70_79: { color: '#3b82f6', darkColor: '#60a5fa' },
  range80_89: { color: '#0d9488', darkColor: '#2dd4bf' },
  range90_100: { color: '#10b981', darkColor: '#34d399' },
};

export function GradeDistributionChart({ distributionData, isLoading }: GradeDistributionChartProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (isLoading) {
    return <DashboardChartSkeleton />;
  }

  // Build the lookup only from server-provided data.
  const courseOptions: { id: string; label: string }[] = [];
  const statsMap: Record<string, CourseGradeStats> = {};

  if (distributionData) {
    if (distributionData.all) {
      courseOptions.push({
        id: 'all',
        label: t('lecturerDashboard.gradeDistribution.allCourses'),
      });
      statsMap.all = distributionData.all;
    }
    if (Array.isArray(distributionData.byCourse)) {
      distributionData.byCourse.forEach((c) => {
        const id = c.courseId;
        const codeLabel = c.code ? `${c.code} - ${c.courseName}` : c.courseName;
        courseOptions.push({ id, label: codeLabel });
        statsMap[id] = c;
      });
    }
  }

  const fallbackCourseId = courseOptions[0]?.id;
  const selectedCourseId = statsMap[selectedCourse] ? selectedCourse : fallbackCourseId;
  const currentStats = selectedCourseId ? statsMap[selectedCourseId] : undefined;

  if (!currentStats || currentStats.totalStudents === 0 || currentStats.data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] p-6 shadow-xs transition-colors">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 shrink-0">
            <BarChart3 size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {t('lecturerDashboard.gradeDistribution.title')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('lecturerDashboard.gradeDistribution.subtitle')}
            </p>
          </div>
        </div>
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
          <BarChart3 className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('lecturerDashboard.gradeDistribution.empty')}
          </p>
        </div>
      </div>
    );
  }

  // Ensure bucket colors are populated
  const chartBuckets: GradeDistributionBucket[] = (currentStats.data || []).map((bucket) => {
    const fallbackColors = DEFAULT_BUCKET_COLORS[bucket.rangeKey] || { color: '#0d9488', darkColor: '#2dd4bf' };
    return {
      ...bucket,
      color: bucket.color || fallbackColors.color,
      darkColor: bucket.darkColor || fallbackColors.darkColor,
    };
  });

  const studentsTotal =
    chartBuckets.reduce((sum, bucket) => sum + (bucket.count || 0), 0) ||
    currentStats.totalStudents ||
    1;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = Math.round((data.count / studentsTotal) * 100);
      return (
        <div className="bg-white dark:bg-[#17211f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-3 text-start min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-extrabold text-sm text-gray-900 dark:text-white">
              {String(t(`lecturerDashboard.gradeDistribution.${data.rangeKey}`, data.label))}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between gap-4">
            <span>{t('lecturerDashboard.gradeDistribution.studentsCount')}:</span>
            <span className="font-bold text-gray-800 dark:text-white">
              {data.count} ({pct}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStatsCards = (isLarge = false) => (
    <div className={`grid grid-cols-3 gap-3 ${isLarge ? 'p-4 sm:p-5 mb-6' : 'p-3.5 mb-6'} bg-gray-50/80 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800`}>
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-teal-100/60 dark:bg-teal-900/60 text-[#00857e] dark:text-teal-300 rounded-lg">
          <TrendingUp size={isLarge ? 18 : 16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {t('lecturerDashboard.gradeDistribution.average')}
          </div>
          <div className={`${isLarge ? 'text-xl' : 'text-lg'} font-black text-gray-900 dark:text-white`}>
            {currentStats.average}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-blue-100/60 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-lg">
          <Award size={isLarge ? 18 : 16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {t('lecturerDashboard.gradeDistribution.median')}
          </div>
          <div className={`${isLarge ? 'text-xl' : 'text-lg'} font-black text-gray-900 dark:text-white`}>
            {currentStats.median}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-100/60 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 rounded-lg">
          <CheckCircle size={isLarge ? 18 : 16} />
        </div>
        <div>
          <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {t('lecturerDashboard.gradeDistribution.passRate')}
          </div>
          <div className={`${isLarge ? 'text-xl' : 'text-lg'} font-black text-emerald-600 dark:text-emerald-300`}>
            {currentStats.passRate}%
          </div>
        </div>
      </div>
    </div>
  );

  const renderDropdown = () => (
    <div className="relative w-full mb-5">
      <Filter
        size={15}
        className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <select
        aria-label={t('lecturerDashboard.gradeDistribution.allCourses')}
        value={selectedCourseId}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-full ps-9.5 pe-9 py-2 bg-gray-50 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-white rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer transition-all shadow-2xs appearance-none"
      >
        {courseOptions.map((opt) => (
          <option key={opt.id} value={opt.id} className="text-gray-900 dark:text-gray-100 py-1">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );

  const renderBarChart = (heightClass = 'h-56') => (
    <div className={`${heightClass} w-full`} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-gray-200, #e5e7eb)"
            opacity={0.7}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: 'var(--color-gray-300, #e5e7eb)' }}
            tick={{ fill: 'var(--color-gray-500, #9ca8a5)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-gray-500, #9ca8a5)', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 133, 126, 0.06)' }} />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          >
            {chartBuckets.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] p-6 flex flex-col justify-between shadow-xs transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 shrink-0">
              <BarChart3 size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {t('lecturerDashboard.gradeDistribution.title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t('lecturerDashboard.gradeDistribution.subtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            title={t('lecturerDashboard.expandView', 'Full View')}
            aria-label={t('lecturerDashboard.expandView', 'Full View')}
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Course Filter Dropdown Row (Separate Line) */}
        {renderDropdown()}

        {/* KPI Stats Strip */}
        {renderStatsCards(false)}

        {/* Chart Canvas */}
        {renderBarChart('h-56')}
      </div>

      {/* Fullscreen Modal View */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('lecturerDashboard.gradeDistribution.title')}
        subtitle={t('lecturerDashboard.gradeDistribution.subtitle')}
        icon={<BarChart3 size={20} />}
      >
        <div className="space-y-4">
          {renderDropdown()}
          {renderStatsCards(true)}
          {renderBarChart('h-80 sm:h-96 md:h-[400px]')}
        </div>
      </ChartModal>
    </>
  );
}
