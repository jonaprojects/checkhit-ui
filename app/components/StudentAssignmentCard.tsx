import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface StudentAssignmentCardProps {
  title: string;
  course: string;
  dueDate: string;
  actionText: string;
  linkTo: string;
  statusBadge: React.ReactNode;
}

export function StudentAssignmentCard({
  title,
  course,
  dueDate,
  actionText,
  linkTo,
  statusBadge
}: StudentAssignmentCardProps) {
  return (
    <Link to={linkTo} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-sm transition-all group">
      <div className="text-start flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-3 mb-1">
          <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl group-hover:text-[#00857e] transition-colors truncate max-w-full">
            {title}
          </h3>
          {statusBadge}
        </div>
        <p className="text-sm text-gray-500 font-medium truncate">{course}</p>
      </div>
      <div className="text-end flex items-center gap-4 sm:gap-6 ms-2 shrink-0">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-400 font-bold mb-1">הגשה עד</p>
          <p className="font-black text-gray-900">{dueDate}</p>
        </div>
        <button className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm group-hover:bg-[#00857e] group-hover:border-[#00857e] group-hover:text-white transition-colors flex items-center gap-2">
          {actionText} <ArrowLeft size={16} />
        </button>
      </div>
    </Link>
  );
}
