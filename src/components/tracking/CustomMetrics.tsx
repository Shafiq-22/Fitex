import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmptyState } from '../ui/EmptyState';
import type { CustomMetric, CustomMetricEntry } from '../../types';

export function CustomMetrics() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [metrics, setMetrics] = useStorage<CustomMetric[]>(`endurance:customMetrics:${profileId}`, []);
  const [entries, setEntries] = useStorage<CustomMetricEntry[]>(`endurance:customEntries:${profileId}`, []);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [loggingMetric, setLoggingMetric] = useState<string | null>(null);
  const [logValue, setLogValue] = useState('');
  const [logDate, setLogDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  function handleCreate() {
    if (!newName.trim() || !newUnit.trim()) return;
    const metric: CustomMetric = {
      id: generateId(),
      profileId,
      name: newName.trim(),
      unit: newUnit.trim(),
    };
    setMetrics((prev) => [...prev, metric]);
    setNewName('');
    setNewUnit('');
    setShowCreate(false);
  }

  function handleLogEntry(metricId: string) {
    const num = parseFloat(logValue);
    if (!num) return;
    const entry: CustomMetricEntry = {
      id: generateId(),
      metricId,
      profileId,
      value: num,
      date: logDate,
    };
    setEntries((prev) => [...prev, entry]);
    setLoggingMetric(null);
    setLogValue('');
    setLogDate(format(new Date(), 'yyyy-MM-dd'));
  }

  function getMetricEntries(metricId: string) {
    return entries
      .filter((e) => e.metricId === metricId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function getLatestEntry(metricId: string): CustomMetricEntry | null {
    const sorted = entries
      .filter((e) => e.metricId === metricId)
      .sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0] || null;
  }

  function handleDeleteMetric(metricId: string) {
    setMetrics((prev) => prev.filter((m) => m.id !== metricId));
    setEntries((prev) => prev.filter((e) => e.metricId !== metricId));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant={showCreate ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? 'Cancel' : 'Create Metric'}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            New Custom Metric
          </h3>
          <div className="space-y-3">
            <Input
              label="Name"
              value={newName}
              onChange={setNewName}
              placeholder="e.g., Body Fat %"
            />
            <Input
              label="Unit"
              value={newUnit}
              onChange={setNewUnit}
              placeholder="e.g., %, cm, kg"
            />
            <Button onClick={handleCreate} className="w-full" disabled={!newName.trim() || !newUnit.trim()}>
              Create
            </Button>
          </div>
        </Card>
      )}

      {metrics.length === 0 && !showCreate ? (
        <EmptyState
          icon="📊"
          title="No custom metrics"
          description="Create a custom metric to track anything you want."
          action={
            <Button size="sm" onClick={() => setShowCreate(true)}>
              Create Metric
            </Button>
          }
        />
      ) : (
        metrics.map((metric) => {
          const latest = getLatestEntry(metric.id);
          const chartEntries = getMetricEntries(metric.id);
          const chartData = chartEntries.map((e) => ({
            date: format(parseISO(e.date), 'MMM d'),
            value: e.value,
          }));
          const isLogging = loggingMetric === metric.id;

          return (
            <Card key={metric.id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {metric.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {latest ? `Latest: ${latest.value} ${metric.unit}` : 'No entries yet'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setLoggingMetric(isLogging ? null : metric.id);
                      setLogValue('');
                    }}
                  >
                    {isLogging ? 'Cancel' : 'Log'}
                  </Button>
                  <button
                    onClick={() => handleDeleteMetric(metric.id)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isLogging && (
                <div className="flex gap-2 items-end mt-3 mb-3">
                  <Input
                    label={`Value (${metric.unit})`}
                    type="number"
                    value={logValue}
                    onChange={setLogValue}
                    placeholder="0"
                    className="flex-1"
                    min="0"
                    step="0.1"
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={logDate}
                    onChange={setLogDate}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => handleLogEntry(metric.id)} disabled={!logValue}>
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
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#8B5CF6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
