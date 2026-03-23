import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { calculate1RM } from '../../lib/calc';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import type { OneRMRecord } from '../../types';

export function OneRMCalculator() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [records, setRecords] = useStorage<OneRMRecord[]>(`endurance:1rm:${profileId}`, []);

  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [result, setResult] = useState<number | null>(null);

  function handleCalculate() {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || !r || w <= 0 || r <= 0) return;
    const estimated = calculate1RM(w, r);
    setResult(estimated);
  }

  function handleSave() {
    if (result === null || !exercise.trim()) return;
    const record: OneRMRecord = {
      id: generateId(),
      profileId,
      exerciseName: exercise.trim(),
      weight: parseFloat(weight),
      reps: parseInt(reps, 10),
      estimated1RM: result,
      date: new Date().toISOString(),
    };
    setRecords((prev) => [...prev, record]);
    setExercise('');
    setWeight('');
    setReps('');
    setResult(null);
  }

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  const history = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
          1RM Calculator
        </h3>
        <div className="space-y-3">
          <Input
            label="Exercise"
            value={exercise}
            onChange={setExercise}
            placeholder="e.g., Bench Press"
          />
          <div className="flex gap-2">
            <Input
              label="Weight"
              type="number"
              value={weight}
              onChange={setWeight}
              placeholder="0"
              className="flex-1"
              min="0"
              step="0.5"
            />
            <Input
              label="Reps"
              type="number"
              value={reps}
              onChange={setReps}
              placeholder="0"
              className="flex-1"
              min="1"
              step="1"
            />
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full"
            disabled={!weight || !reps}
          >
            Calculate
          </Button>
        </div>

        {result !== null && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estimated 1RM</p>
            <p className="text-3xl font-bold text-primary">{result}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Epley Formula</p>
            <Button
              size="sm"
              className="mt-3"
              onClick={handleSave}
              disabled={!exercise.trim()}
            >
              Save to History
            </Button>
          </div>
        )}
      </Card>

      {history.length > 0 && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">History</h3>
          <div className="space-y-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {record.exerciseName}
                    </span>
                    <Badge variant="primary">{record.estimated1RM} 1RM</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {record.weight} x {record.reps} reps &middot;{' '}
                    {format(parseISO(record.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
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
