import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { MeasurementEntry, MeasurementType } from '../../types';

const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  chest: 'Chest',
  waist: 'Waist',
  hips: 'Hips',
  leftArm: 'Left Arm',
  rightArm: 'Right Arm',
  leftThigh: 'Left Thigh',
  rightThigh: 'Right Thigh',
  neck: 'Neck',
  shoulders: 'Shoulders',
};

const MEASUREMENT_TYPES = Object.keys(MEASUREMENT_LABELS) as MeasurementType[];

export function BodyMeasurements() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [entries, setEntries] = useStorage<MeasurementEntry[]>(`endurance:measurements:${profileId}`, []);
  const [editingType, setEditingType] = useState<MeasurementType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [chartType, setChartType] = useState<MeasurementType | null>(null);

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  function getLatestValue(type: MeasurementType): number | null {
    for (const entry of sorted) {
      if (entry.values[type] !== undefined) return entry.values[type]!;
    }
    return null;
  }

  function handleLog(type: MeasurementType) {
    const num = parseFloat(inputValue);
    if (!num || num <= 0) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntry = entries.find((e) => e.date === today);
    if (todayEntry) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === todayEntry.id
            ? { ...e, values: { ...e.values, [type]: num } }
            : e
        )
      );
    } else {
      const entry: MeasurementEntry = {
        id: generateId(),
        profileId,
        date: today,
        values: { [type]: num },
      };
      setEntries((prev) => [...prev, entry]);
    }
    setEditingType(null);
    setInputValue('');
  }

  function getChartData(type: MeasurementType) {
    const data: { date: string; value: number }[] = [];
    const chronological = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    for (const entry of chronological) {
      if (entry.values[type] !== undefined) {
        data.push({
          date: format(parseISO(entry.date), 'MMM d'),
          value: entry.values[type]!,
        });
      }
    }
    return data;
  }

  if (chartType) {
    const data = getChartData(chartType);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {MEASUREMENT_LABELS[chartType]} Trend
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setChartType(null)}>
            Back to Grid
          </Button>
        </div>
        <Card>
          {data.length > 1 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              Need at least 2 entries to show trend
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {MEASUREMENT_TYPES.map((type) => {
          const latest = getLatestValue(type);
          const isEditing = editingType === type;
          return (
            <Card key={type} className="!p-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {MEASUREMENT_LABELS[type]}
              </p>
              {isEditing ? (
                <div className="space-y-1.5">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="cm"
                    autoFocus
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm text-center focus:outline-none focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLog(type);
                      if (e.key === 'Escape') {
                        setEditingType(null);
                        setInputValue('');
                      }
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleLog(type)}
                      className="flex-1 text-xs text-primary font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingType(null);
                        setInputValue('');
                      }}
                      className="flex-1 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {latest !== null ? `${latest}` : '--'}
                  </p>
                  <div className="flex gap-2 justify-center mt-1.5">
                    <button
                      onClick={() => {
                        setEditingType(type);
                        setInputValue('');
                      }}
                      className="text-xs text-primary font-medium"
                    >
                      Log
                    </button>
                    <button
                      onClick={() => setChartType(type)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      Chart
                    </button>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
