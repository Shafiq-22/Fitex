import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../ui/Card';

const OPTIONS = [
  { value: 'light' as const, label: 'Light' },
  { value: 'dark' as const, label: 'Dark' },
  { value: 'system' as const, label: 'System' },
];

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Appearance</h3>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              theme === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
