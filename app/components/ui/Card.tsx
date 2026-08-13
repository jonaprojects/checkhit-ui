import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white dark:bg-[#17211f] border border-gray-200 dark:border-[#263330] rounded-xl overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-5 border-b border-gray-100 dark:border-[#263330] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`font-extrabold text-xl text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 bg-gray-50/50 dark:bg-[#0e1514]/50 border-t border-gray-100 dark:border-[#263330] flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}
