import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '../ui/Card';
import { useWorkouts } from '../../hooks/useWorkouts';
import { getActivityData } from '../../lib/calc';

const WEEKS = 12;
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''] as const;

function getCellColor(count: number): string {
  if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
  if (count === 1) return 'bg-blue-200 dark:bg-blue-200';
  if (count === 2) return 'bg-blue-400 dark:bg-blue-400';
  return 'bg-blue-600 dark:bg-blue-600';
}

export function ActivityHeatmap() {
  const { sessions } = useWorkouts();

  const activityData = useMemo(() => getActivityData(sessions, WEEKS), [sessions]);

  // Build grid: 7 rows (days) x 12 columns (weeks)
  const grid = useMemo(() => {
    const rows: { date: string; count: number }[][] = Array.from(
      { length: 7 },
      () => [],
    );

    activityData.forEach((entry, index) => {
      const dayOfWeek = index % 7;
      rows[dayOfWeek].push(entry);
    });

    return rows;
  }, [activityData]);

  // Month labels across the top
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = '';

    for (let week = 0; week < WEEKS; week++) {
      const dayIndex = week * 7;
      if (dayIndex < activityData.length) {
        const month = format(parseISO(activityData[dayIndex].date), 'MMM');
        if (month !== lastMonth) {
          labels.push({ label: month, col: week });
          lastMonth = month;
        }
      }
    }

    return labels;
  }, [activityData]);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        Activity
      </h3>

      <div className="flex gap-1">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[3px] mr-1 pt-5">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="w-3 h-3 flex items-center justify-center text-[9px] text-slate-400 dark:text-slate-500 leading-none"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-hidden">
          {/* Month labels */}
          <div className="flex mb-1 relative h-4">
            {monthLabels.map(({ label, col }) => (
              <span
                key={`${label}-${col}`}
                className="absolute text-[10px] text-slate-400 dark:text-slate-500"
                style={{ left: `${(col / WEEKS) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Cells */}
          <div className="flex flex-col gap-[3px]">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-[3px]">
                {row.map((cell) => (
                  <div
                    key={cell.date}
                    className={`w-3 h-3 rounded-sm ${getCellColor(cell.count)}`}
                    title={`${cell.date}: ${cell.count} workout${cell.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
