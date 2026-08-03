import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Layers, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

interface AssignmentProgressData {
  name: string;
  code: string;
  graded: number;
  aiChecking: number;
  submitted: number;
  missing: number;
  total: number;
}

const PROGRESS_DATA: AssignmentProgressData[] = [
  {
    name: 'HW1 - Recursion',
    code: 'CS101',
    graded: 95,
    aiChecking: 12,
    submitted: 8,
    missing: 5,
    total: 120,
  },
  {
    name: 'HW2 - BST Trees',
    code: 'CS101',
    graded: 45,
    aiChecking: 48,
    submitted: 18,
    missing: 9,
    total: 120,
  },
  {
    name: 'Lab 1 - OOP Design',
    code: 'CS303',
    graded: 72,
    aiChecking: 8,
    submitted: 3,
    missing: 2,
    total: 85,
  },
  {
    name: 'Midterm Project',
    code: 'CS303',
    graded: 10,
    aiChecking: 35,
    submitted: 32,
    missing: 8,
    total: 85,
  },
];

export function AssignmentCompletionChart() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const assignment = PROGRESS_DATA.find((a) => a.name === label);
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-start min-w-[160px]">
          <div className="font-extrabold text-sm text-gray-900 dark:text-white mb-2 border-b border-gray-100 pb-1 flex justify-between items-center">
            <span>{label}</span>
            {assignment && (
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                {assignment.code}
              </span>
            )}
          </div>
          <div className="space-y-1 text-xs">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}:</span>
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-[#00857e] dark:text-teal-300">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {t('lecturerDashboard.assignmentTracker.title')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('lecturerDashboard.assignmentTracker.subtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/lecturer/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00857e] dark:text-teal-300 hover:underline"
        >
          <span>{t('lecturerDashboard.allCourses')}</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Legend Badges */}
      <div className="flex flex-wrap gap-2 my-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {t('lecturerDashboard.assignmentTracker.graded')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-100">
          <span className="w-2 h-2 rounded-full bg-[#00857e]"></span>
          {t('lecturerDashboard.assignmentTracker.aiChecking')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-100">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {t('lecturerDashboard.assignmentTracker.submitted')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 dark:text-white rounded-lg border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          {t('lecturerDashboard.assignmentTracker.missing')}
        </span>
      </div>

      {/* Stacked Horizontal/Vertical Bar Chart */}
      <div className="h-64 w-full mt-2" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={PROGRESS_DATA}
            layout="vertical"
            margin={{ top: 10, right: 15, left: isEn ? 15 : 0, bottom: 0 }}
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
              width={110}
              tick={{
                fill: 'var(--color-gray-700, #e2eae8)',
                fontSize: 11,
                fontWeight: 700,
              }}
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

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{t('lecturerDashboard.assignmentsProgress')}</span>
        <span className="font-semibold text-gray-700 dark:text-white">
          4 {t('lecturerDashboard.activeAssignments')}
        </span>
      </div>
    </div>
  );
}
