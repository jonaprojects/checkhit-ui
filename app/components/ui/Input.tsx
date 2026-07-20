import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`block w-full bg-gray-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#00857e] focus:ring-teal-100'} rounded-xl text-gray-900 focus:bg-white focus:ring-2 transition-all outline-none ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`block w-full bg-gray-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#00857e] focus:ring-teal-100'} rounded-xl text-gray-900 focus:bg-white focus:ring-2 transition-all outline-none ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`block w-full bg-gray-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#00857e] focus:ring-teal-100'} rounded-xl text-gray-900 focus:bg-white focus:ring-2 transition-all outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-sm font-bold text-gray-700 mb-2 ${className}`}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';
