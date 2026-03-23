import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { useWorkouts } from '../../hooks/useWorkouts';
import { getWeeklyVolume } from '../../lib/calc';

export function WorkoutVolume() {
  const { sessions } = useWorkouts();
  const data = useMemo(() => getWeeklyVolume(sessions), [sessions]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        This Week
      </h3>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              domain={[0, maxCount]}
              allowDecimals={false}
              hide
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
