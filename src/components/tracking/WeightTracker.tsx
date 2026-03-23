import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WeightEntry } from '../../types';

export function WeightTracker() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [entries, setEntries] = useStorage<WeightEntry[]>(`endurance:weight:${profileId}`, []);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sorted.map((e) => ({
    date: format(parseISO(e.date), 'MMM d'),
    value: e.value,
  }));

  function handleLog() {
    const num = parseFloat(value);
    if (!num || num <= 0) return;
    const entry: WeightEntry = {
      id: generateId(),
      profileId,
      value: num,
      unit,
      date,
    };
    setEntries((prev) => [...prev, entry]);
    setValue('');
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const recent = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Log Weight</h3>
        <div className="flex gap-2 items-end">
          <Input
            label="Weight"
            type="number"
            value={value}
            onChange={setValue}
            placeholder="0"
            className="flex-1"
            min="0"
            step="0.1"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'kg' | 'lbs')}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-primary"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={setDate}
            className="flex-1"
          />
        </div>
        <Button onClick={handleLog} className="w-full mt-3" disabled={!value}>
          Log
        </Button>
      </Card>

      {chartData.length > 1 && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3B82F6' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {recent.length > 0 && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Recent Entries</h3>
          <div className="space-y-2">
            {recent.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {entry.value} {entry.unit}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {format(parseISO(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
