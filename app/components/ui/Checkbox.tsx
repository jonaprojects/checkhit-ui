import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative flex items-center justify-center shrink-0">
          <input
            type="checkbox"
            ref={ref}
            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#00857e] checked:border-[#00857e] focus:outline-none focus:ring-2 focus:ring-[#00857e]/50 focus:ring-offset-1 transition-all cursor-pointer"
            {...props}
          />
          <Check size={14} strokeWidth={3} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
        </div>
        {label && <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
