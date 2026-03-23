import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { SkillEntry } from '../../types';

interface SkillDef {
  name: string;
  unit: string;
}

const PRESET_SKILLS: SkillDef[] = [
  { name: 'Pull-ups', unit: 'reps' },
  { name: 'Push-ups', unit: 'reps' },
  { name: 'Plank', unit: 'seconds' },
  { name: 'Sprint 100m', unit: 'seconds' },
];

export function SkillTracker() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [entries, setEntries] = useStorage<SkillEntry[]>(`endurance:skills:${profileId}`, []);
  const [loggingSkill, setLoggingSkill] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  function getSkillEntries(skill: string) {
    return entries
      .filter((e) => e.skill === skill)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function getLatestValue(skill: string): number | null {
    const skillEntries = getSkillEntries(skill);
    return skillEntries.length > 0 ? skillEntries[skillEntries.length - 1].value : null;
  }

  function handleLog(skill: string) {
    const num = parseFloat(value);
    if (!num || num <= 0) return;
    const entry: SkillEntry = {
      id: generateId(),
      profileId,
      skill,
      value: num,
      date,
    };
    setEntries((prev) => [...prev, entry]);
    setLoggingSkill(null);
    setValue('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
  }

  function getChartData(skill: string) {
    return getSkillEntries(skill).map((e) => ({
      date: format(parseISO(e.date), 'MMM d'),
      value: e.value,
    }));
  }

  return (
    <div className="space-y-4">
      {PRESET_SKILLS.map((skill) => {
        const latest = getLatestValue(skill.name);
        const chartData = getChartData(skill.name);
        const isLogging = loggingSkill === skill.name;

        return (
          <Card key={skill.name}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {skill.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {latest !== null ? `Latest: ${latest} ${skill.unit}` : 'No entries yet'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setLoggingSkill(isLogging ? null : skill.name);
                  setValue('');
                }}
              >
                {isLogging ? 'Cancel' : 'Log New'}
              </Button>
            </div>

            {isLogging && (
              <div className="flex gap-2 items-end mt-3 mb-3">
                <Input
                  label={`Value (${skill.unit})`}
                  type="number"
                  value={value}
                  onChange={setValue}
                  placeholder="0"
                  className="flex-1"
                  min="0"
                  step="0.1"
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={setDate}
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleLog(skill.name)} disabled={!value}>
                  Save
                </Button>
              </div>
            )}

            {chartData.length > 1 && (
              <div className="h-28 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" width={30} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '10px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 2, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
