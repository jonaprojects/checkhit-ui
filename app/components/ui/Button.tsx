import React from 'react';
import { Link } from 'react-router';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#00857e] text-white hover:bg-teal-700 border border-transparent shadow-sm',
  secondary: 'bg-teal-50 text-[#00857e] hover:bg-teal-100 border border-transparent',
  outline: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-transparent',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
  icon: 'p-2 rounded-lg',
};

const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-colors shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#00857e]/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
LinkButton.displayName = 'LinkButton';
