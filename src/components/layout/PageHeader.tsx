import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  rightAction?: ReactNode;
}

export function PageHeader({ title, rightAction }: PageHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
