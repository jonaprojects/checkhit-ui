import React from 'react';
import { BookOpen, Scale, Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'assignment' | 'appeal' | 'system' | 'success' | 'warning' | 'info';

export interface NotificationItemProps {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: NotificationType;
  variant?: 'full' | 'compact';
  onClick?: () => void;
}

const typeConfig = {
  assignment: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  appeal: { icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50' },
  system: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' },
  success: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  warning: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
  info: { icon: Info, color: 'text-[#00857e]', bg: 'bg-teal-50' },
};

export function NotificationItem({
  title,
  desc,
  time,
  unread,
  type,
  variant = 'full',
  onClick
}: NotificationItemProps) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick}
        className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors relative ${unread ? 'bg-teal-50/30' : ''}`}
      >
        {unread && (
          <span className="absolute top-5 start-2 w-2 h-2 bg-[#00857e] rounded-full"></span>
        )}
        <div className="ps-3">
          <h4 className={`text-sm ${unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{desc}</p>
          <span className="text-xs text-gray-400 mt-2 block">{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-6 transition-all cursor-pointer group relative rounded-2xl border
        ${unread ? 'bg-teal-50/10 border-teal-100 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5'}
      `}
    >
      {unread && (
        <span className="absolute top-1/2 -translate-y-1/2 start-2 w-2 h-2 bg-[#00857e] rounded-full"></span>
      )}
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
        <Icon size={20} />
      </div>
      
      <div className="flex-1 text-start flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex-1">
          <h3 className={`text-base ${unread ? 'font-extrabold text-gray-900' : 'font-bold text-gray-700'}`}>
            {title}
          </h3>
          <p className={`text-sm mt-0.5 ${unread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
            {desc}
          </p>
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap shrink-0 sm:ms-auto font-medium">{time}</span>
      </div>
    </div>
  );
}
