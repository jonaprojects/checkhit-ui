import React, { useState } from 'react';

const colors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-rose-500',
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorIndex = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
};

export interface UserAvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export function UserAvatar({ name, src, size = 'md', className = '' }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials = getInitials(name);
  const colorClass = colors[getColorIndex(name)];
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 shadow-sm ${sizeClass} ${className}`}>
      {src && !imageError ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-white font-bold tracking-wider select-none ${colorClass}`}>
          {initials}
        </div>
      )}
    </div>
  );
}
