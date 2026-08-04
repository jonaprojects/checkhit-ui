import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

/**
 * Base atomic Skeleton primitive with smooth shimmer wave and dark mode compatibility.
 */
export function Skeleton({
  className = '',
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }[variant];

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-800 shimmer-wave ${variantClasses} ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton matching the exact size and geometry of `CourseCard`.
 */
export function CourseCardSkeleton({
  variant = 'detailed',
  mode = 'student',
}: {
  variant?: 'detailed' | 'compact';
  mode?: 'student' | 'lecturer';
}) {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
        {/* Icon box */}
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-40 rounded" />
          {/* Subtitle */}
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col h-full justify-between">
      <div>
        {/* Top Header: Icon & Code pill */}
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-lg" />
        </div>

        {/* Course Title */}
        <Skeleton className="h-6 w-3/4 rounded-md mb-4" />

        {/* Content area: Mode-dependent */}
        {mode === 'student' ? (
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    </div>
  );
}

/**
 * Grid of CourseCard skeletons with responsive columns matching the pages.
 */
export function CourseGridSkeleton({
  count = 6,
  variant = 'detailed',
  mode = 'student',
}: {
  count?: number;
  variant?: 'detailed' | 'compact';
  mode?: 'student' | 'lecturer';
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CourseCardSkeleton key={idx} variant={variant} mode={mode} />
      ))}
    </div>
  );
}

/**
 * Skeleton matching single Course Details page.
 */
export function CourseDetailSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200 pb-6 space-y-4">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-16 rounded" />
          <Skeleton className="h-9 w-72 rounded-md" />
        </div>
        <Skeleton className="h-4 w-48 rounded" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments Column */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-7 w-48 rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-3/5 rounded" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Sidebar */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-40 rounded" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <Skeleton className="h-4 w-full rounded" />
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton matching the exact size and geometry of `StudentAssignmentCard`.
 */
export function AssignmentCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
      {/* Title, Badge & Subtitle */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-3">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 rounded" />
      </div>

      {/* Trailing Due Date & Action Button */}
      <div className="flex items-center gap-4 sm:gap-6 ms-2 shrink-0">
        <div className="hidden sm:block space-y-1.5 text-end">
          <Skeleton className="h-3 w-14 rounded ms-auto" />
          <Skeleton className="h-4 w-20 rounded ms-auto" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Stack of AssignmentCard skeletons.
 */
export function AssignmentListSkeleton({
  count = 4,
  responsiveLimit,
}: {
  count?: number;
  responsiveLimit?: number;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={responsiveLimit && idx >= responsiveLimit ? 'hidden md:block' : 'block'}
        >
          <AssignmentCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton matching Appeal card on appeals pages.
 */
export function AppealCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex-1 flex items-start gap-4 w-full">
        {/* Status circle icon */}
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40 rounded" />
        </div>
      </div>

      {/* Right column: grades & button */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-s md:ps-6 border-gray-100">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Stack of AppealCard skeletons.
 */
export function AppealListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <AppealCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * Skeleton matching metric / statistic cards on dashboards.
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-20 rounded" />
        <Skeleton className="h-7 w-16 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton for assignments table view.
 */
export function AssignmentTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 rounded hidden md:block" />
            <Skeleton className="h-4 w-28 rounded hidden sm:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-8 rounded text-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton matching full NotificationItem.
 */
export function NotificationCardSkeleton({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="p-4 border-b border-gray-50 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl border border-gray-100 bg-white">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
        <Skeleton className="h-3.5 w-20 rounded shrink-0 sm:ms-auto" />
      </div>
    </div>
  );
}

/**
 * Stack of NotificationCard skeletons.
 */
export function NotificationListSkeleton({ count = 4, variant = 'full' }: { count?: number; variant?: 'full' | 'compact' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <NotificationCardSkeleton key={idx} variant={variant} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Student Dashboard Recent Grades card items.
 */
export function DashboardRecentGradesSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/50">
          <div className="space-y-1.5 flex-1 me-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-44 rounded" />
          </div>
          <Skeleton className="h-6 w-10 rounded font-extrabold" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Student Dashboard Appeals in Progress card.
 */
export function DashboardAppealsSkeleton() {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2.5">
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="h-3.5 w-28 rounded" />
      <div className="pt-1">
        <Skeleton className="h-6 w-28 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Student Assignment Detail Page.
 */
export function AssignmentDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Header/Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-64 rounded" />
          <Skeleton className="h-8 w-80 rounded-lg" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] overflow-hidden shadow-xs">
        {/* Assignment Details Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>

        {/* State Placeholder Box */}
        <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl space-y-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Lecturer Dashboard Metric Card.
 */
export function LecturerMetricSkeleton() {
  return (
    <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200/80 dark:border-[#263330] p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-12 h-5 rounded-md" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Requires Attention Strip.
 */
export function RequiresAttentionStripSkeleton() {
  return (
    <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-amber-200/70 dark:border-amber-900/50 p-6 shadow-xs">
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="h-6 w-44 rounded-md" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <Skeleton className="h-5 w-3/4 rounded" />
            </div>
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-24 rounded pt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for Dashboard Analytics Charts.
 */
export function DashboardChartSkeleton() {
  return (
    <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] p-6 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
        </div>
        <Skeleton className="h-9 w-full rounded-xl mb-5" />
        <div className="flex items-center gap-6 mb-6">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <div className="h-56 flex items-end justify-between gap-3 px-4 pt-8">
        {[40, 65, 85, 95, 70, 50].map((h, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <Skeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
            <Skeleton className="h-3 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}


