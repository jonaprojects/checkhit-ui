import { Link } from 'react-router';
import { GraduationCap } from 'lucide-react';
import React from 'react';

export interface CourseAccent {
  bg: string;
  text: string;
  groupHoverBg: string;
  borderHover: string;
}

export interface CourseCardProps {
  name: string;
  code: string;
  accent: CourseAccent;
  to: string;
  variant?: 'compact' | 'detailed';
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function CourseCard({
  name,
  code,
  accent,
  to,
  variant = 'detailed',
  children,
  footer
}: CourseCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={to} className={`group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md ${accent.borderHover} transition-all duration-300 flex items-center gap-4 hover:-translate-y-1`}>
        <div className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center ${accent.groupHoverBg} group-hover:text-white transition-colors shrink-0`}>
          <GraduationCap size={24} />
        </div>
        <div className="flex-1 overflow-hidden text-start">
          <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{name}</h3>
          <div className="text-sm text-gray-500 font-medium truncate">{children}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className={`group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md ${accent.borderHover} transition-all duration-300 flex flex-col h-full hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center ${accent.groupHoverBg} group-hover:text-white transition-colors`}>
          <GraduationCap size={28} />
        </div>
        <div className={`${accent.bg} ${accent.text} px-3 py-1.5 rounded-lg text-xs font-black tracking-widest border border-white/50`}>
          {code}
        </div>
      </div>
      
      <h2 className={`text-xl font-extrabold text-gray-900 mb-1 group-hover:${accent.text} transition-colors`}>{name}</h2>
      
      {children}

      {footer && (
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          {footer}
        </div>
      )}
    </Link>
  );
}
