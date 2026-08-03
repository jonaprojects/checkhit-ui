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
import { Award, TrendingUp, CheckCircle, BarChart3, Filter } from 'lucide-react';

interface GradeBucket {
  rangeKey: string;
  label: string;
  count: number;
  color: string;
  darkColor: string;
}

interface CourseStats {
  id: string;
  name: string;
  code: string;
  average: number;
  median: number;
  passRate: number;
  totalStudents: number;
  data: GradeBucket[];
}

const COURSES_DATA: Record<string, CourseStats> = {
  all: {
    id: 'all',
    name: 'All Courses',
    code: 'ALL',
    average: 83.6,
    median: 85.0,
    passRate: 94.2,
    totalStudents: 235,
    data: [
      { rangeKey: 'rangeBelow60', label: '<60', count: 14, color: '#f43f5e', darkColor: '#fb7185' },
      { rangeKey: 'range60_69', label: '60-69', count: 28, color: '#f59e0b', darkColor: '#fbbf24' },
      { rangeKey: 'range70_79', label: '70-79', count: 52, color: '#3b82f6', darkColor: '#60a5fa' },
      { rangeKey: 'range80_89', label: '80-89', count: 86, color: '#0d9488', darkColor: '#2dd4bf' },
      { rangeKey: 'range90_100', label: '90-100', count: 55, color: '#10b981', darkColor: '#34d399' },
    ],
  },
  cs101: {
    id: 'cs101',
    name: 'Data Structures & Algorithms',
    code: 'CS101',
    average: 81.4,
    median: 83.0,
    passRate: 92.5,
    totalStudents: 120,
    data: [
      { rangeKey: 'rangeBelow60', label: '<60', count: 9, color: '#f43f5e', darkColor: '#fb7185' },
      { rangeKey: 'range60_69', label: '60-69', count: 16, color: '#f59e0b', darkColor: '#fbbf24' },
      { rangeKey: 'range70_79', label: '70-79', count: 29, color: '#3b82f6', darkColor: '#60a5fa' },
      { rangeKey: 'range80_89', label: '80-89', count: 44, color: '#0d9488', darkColor: '#2dd4bf' },
      { rangeKey: 'range90_100', label: '90-100', count: 22, color: '#10b981', darkColor: '#34d399' },
    ],
  },
  cs303: {
    id: 'cs303',
    name: 'Object Oriented Programming',
    code: 'CS303',
    average: 86.8,
    median: 88.0,
    passRate: 96.5,
    totalStudents: 85,
    data: [
      { rangeKey: 'rangeBelow60', label: '<60', count: 3, color: '#f43f5e', darkColor: '#fb7185' },
      { rangeKey: 'range60_69', label: '60-69', count: 8, color: '#f59e0b', darkColor: '#fbbf24' },
      { rangeKey: 'range70_79', label: '70-79', count: 16, color: '#3b82f6', darkColor: '#60a5fa' },
      { rangeKey: 'range80_89', label: '80-89', count: 34, color: '#0d9488', darkColor: '#2dd4bf' },
      { rangeKey: 'range90_100', label: '90-100', count: 24, color: '#10b981', darkColor: '#34d399' },
    ],
  },
};

export function GradeDistributionChart() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const currentStats = COURSES_DATA[selectedCourse] || COURSES_DATA.all;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = Math.round((data.count / currentStats.totalStudents) * 100);
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-start min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-extrabold text-sm text-gray-900 dark:text-white">
              {String(t(`lecturerDashboard.gradeDistribution.${data.rangeKey}`, data.label))}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#00857e] dark:text-teal-300">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {t('lecturerDashboard.gradeDistribution.title')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('lecturerDashboard.gradeDistribution.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Filter size={16} className="text-gray-400 hidden sm:block" />
          <select
            aria-label={t('lecturerDashboard.gradeDistribution.allCourses')}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-800 dark:text-white rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer transition-colors"
          >
            <option value="all">{t('lecturerDashboard.gradeDistribution.allCourses')}</option>
            <option value="cs101">CS101 - {isEn ? "Data Structures" : "מבני נתונים"}</option>
            <option value="cs303">CS303 - {isEn ? "OOP" : "תכנות מונחה עצמים"}</option>
          </select>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-teal-100/60 text-[#00857e] dark:text-teal-300 rounded-lg">
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-gray-500">
              {t('lecturerDashboard.gradeDistribution.average')}
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-white">
              {currentStats.average}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-100/60 text-blue-600 dark:text-blue-300 rounded-lg">
            <Award size={16} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-gray-500">
              {t('lecturerDashboard.gradeDistribution.median')}
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-white">
              {currentStats.median}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-100/60 text-emerald-600 dark:text-emerald-300 rounded-lg">
            <CheckCircle size={16} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-gray-500">
              {t('lecturerDashboard.gradeDistribution.passRate')}
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-300">
              {currentStats.passRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentStats.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              {currentStats.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
