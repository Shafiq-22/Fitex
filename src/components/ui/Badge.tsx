import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'primary';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    primary: 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${variants[variant]}`}>
      {children}
    </span>
  );
}
