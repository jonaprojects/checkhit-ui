import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Layers, ArrowUpRight, CheckCircle2, Maximize2 } from 'lucide-react';
import { Link } from 'react-router';
import { DashboardChartSkeleton } from '../ui/Skeleton';
import { ChartModal } from '../ui/ChartModal';
import type { AssignmentCompletionItem } from '../../lib/api/types';

export interface AssignmentCompletionChartProps {
  completionData?: AssignmentCompletionItem[];
  isLoading?: boolean;
}

const DEFAULT_PROGRESS_DATA: AssignmentCompletionItem[] = [
  {
    assignmentId: '1',
    name: 'HW1 - Recursion',
    code: 'CS101',
    graded: 95,
    aiChecking: 12,
    submitted: 8,
    missing: 5,
    total: 120,
  },
  {
    assignmentId: '2',
    name: 'HW2 - BST Trees',
    code: 'CS101',
    graded: 45,
    aiChecking: 48,
    submitted: 18,
    missing: 9,
    total: 120,
  },
  {
    assignmentId: '3',
    name: 'Lab 1 - OOP Design',
    code: 'CS303',
    graded: 72,
    aiChecking: 8,
    submitted: 3,
    missing: 2,
    total: 85,
  },
  {
    assignmentId: '4',
    name: 'Midterm Project',
    code: 'CS303',
    graded: 10,
    aiChecking: 35,
    submitted: 32,
    missing: 8,
    total: 85,
  },
];

export function AssignmentCompletionChart({ completionData, isLoading }: AssignmentCompletionChartProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (isLoading) {
    return <DashboardChartSkeleton />;
  }

  const chartData = completionData !== undefined ? completionData : DEFAULT_PROGRESS_DATA;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const assignment = chartData.find((a) => a.name === label);
      return (
        <div className="bg-white dark:bg-[#17211f] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-3.5 text-start max-w-xs min-w-[200px] z-50">
          <div className="font-extrabold text-sm text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-1.5 flex justify-between items-start gap-2">
            <span className="leading-snug">{label}</span>
            {assignment?.code && (
              <span className="text-[10px] px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 font-bold rounded shrink-0">
                {assignment.code}
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}:</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderYAxisTick = (isExpanded: boolean) => ({ x = 0, y = 0, payload }: any) => {
    if (!payload?.value) return null;
    const fullText = String(payload.value);
    const maxLen = isExpanded ? 32 : 17;
    const truncated = fullText.length > maxLen ? `${fullText.slice(0, maxLen - 2)}...` : fullText;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-8}
          y={4}
          textAnchor="end"
          className="fill-gray-700 dark:fill-gray-300 text-[11px] sm:text-xs font-bold select-none"
        >
          <title>{fullText}</title>
          {truncated}
        </text>
      </g>
    );
  };

  const renderLegendBadges = () => (
    <div className="flex flex-wrap gap-2 my-2 text-[11px] font-semibold">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-100 dark:border-emerald-900/60">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        {t('lecturerDashboard.assignmentTracker.graded')}
      </span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-100 dark:border-teal-900/60">
        <span className="w-2 h-2 rounded-full bg-[#00857e]"></span>
        {t('lecturerDashboard.assignmentTracker.aiChecking')}
      </span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-100 dark:border-amber-900/60">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        {t('lecturerDashboard.assignmentTracker.submitted')}
      </span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        {t('lecturerDashboard.assignmentTracker.missing')}
      </span>
    </div>
  );

  const renderChart = (isExpanded = false, heightClass = 'h-64') => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center space-y-2 mt-2">
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {isEn ? 'No active assignment pipeline data' : 'אין נתוני הגשות פעילים כרגע'}
          </p>
        </div>
      );
    }

    return (
      <div className={`${heightClass} w-full mt-2`} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="var(--color-gray-200, #e5e7eb)"
              opacity={0.7}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={{ stroke: 'var(--color-gray-300, #e5e7eb)' }}
              tick={{ fill: 'var(--color-gray-500, #9ca8a5)', fontSize: 11 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={isExpanded ? 180 : 105}
              tick={renderYAxisTick(isExpanded)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 133, 126, 0.06)' }} />
            <Bar
              dataKey="graded"
              name={t('lecturerDashboard.assignmentTracker.graded')}
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="aiChecking"
              name={t('lecturerDashboard.assignmentTracker.aiChecking')}
              stackId="a"
              fill="#00857e"
              radius={[0, 0, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="submitted"
              name={t('lecturerDashboard.assignmentTracker.submitted')}
              stackId="a"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="missing"
              name={t('lecturerDashboard.assignmentTracker.missing')}
              stackId="a"
              fill="#94a3b8"
              radius={[0, 6, 6, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] p-6 flex flex-col justify-between shadow-xs transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-4">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 shrink-0 mt-0.5">
              <Layers size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">
                {t('lecturerDashboard.assignmentTracker.title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
                {t('lecturerDashboard.assignmentTracker.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <Link
              to="/lecturer/courses"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#00857e] dark:text-teal-300 hover:underline"
            >
              <span>{t('lecturerDashboard.allCourses')}</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title={t('lecturerDashboard.expandView', 'Full View')}
              aria-label={t('lecturerDashboard.expandView', 'Full View')}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Legend Badges */}
        {renderLegendBadges()}

        {/* Stacked Bar Chart */}
        {renderChart(false, 'h-64')}

        {/* Footer */}
        <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{t('lecturerDashboard.assignmentsProgress')}</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {chartData.length} {t('lecturerDashboard.activeAssignments')}
          </span>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('lecturerDashboard.assignmentTracker.title')}
        subtitle={t('lecturerDashboard.assignmentTracker.subtitle')}
        icon={<Layers size={20} />}
      >
        <div className="space-y-4">
          {renderLegendBadges()}
          {renderChart(true, 'h-80 sm:h-96 md:h-[420px]')}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{t('lecturerDashboard.assignmentsProgress')}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {chartData.length} {t('lecturerDashboard.activeAssignments')}
            </span>
          </div>
        </div>
      </ChartModal>
    </>
  );
}
