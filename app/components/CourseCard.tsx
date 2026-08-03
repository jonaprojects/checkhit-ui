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
      <Link to={to} className={`group bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-lg ${accent.borderHover} transition-all duration-300 flex items-center gap-4 hover:-translate-y-1`}>
        <div className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center ${accent.groupHoverBg} group-hover:text-white transition-colors shrink-0 shadow-2xs`}>
          <GraduationCap size={24} />
        </div>
        <div className="flex-1 overflow-hidden text-start">
          <h3 className="font-bold text-gray-900 text-base mb-0.5 truncate group-hover:text-[#00857e] transition-colors">{name}</h3>
          <div className="text-xs text-gray-500 font-medium truncate">{children}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className={`group bg-white rounded-2xl border border-gray-200/80 p-6 hover:shadow-xl ${accent.borderHover} transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center ${accent.groupHoverBg} group-hover:text-white transition-all shadow-2xs`}>
          <GraduationCap size={22} />
        </div>
        <span className={`${accent.bg} ${accent.text} px-2.5 py-1 rounded-lg text-xs font-black tracking-wider border border-white/60 shadow-2xs`}>
          {code}
        </span>
      </div>
      
      <h2 className="text-lg font-black text-gray-900 mb-4 group-hover:text-[#00857e] transition-colors leading-snug line-clamp-1">{name}</h2>
      
      <div className="flex-1 mb-5">
        {children}
      </div>

      {footer && (
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {footer}
        </div>
      )}
    </Link>
  );
}
