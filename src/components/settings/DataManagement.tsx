import { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { exportProfileData, downloadJSON } from '../../lib/export';
import { clearAllData } from '../../lib/storage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DataManagement() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!profileId) return;
    setExporting(true);
    try {
      const data = await exportProfileData(profileId);
      const filename = `fitex-export-${activeProfile?.name ?? 'data'}-${new Date().toISOString().slice(0, 10)}.json`;
      downloadJSON(data, filename);
    } catch {
      // silently handle
    }
    setExporting(false);
  }

  function handleClearAll() {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  }

  return (
    <>
      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Data</h3>
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export All Data'}
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setShowClearConfirm(true)}
          >
            Clear All Data
          </Button>
          <p className="text-xs text-red-400 dark:text-red-500 text-center mt-1">
            Clearing data will permanently delete all profiles, workouts, and tracking data.
          </p>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        message="This will permanently delete ALL data including profiles, workouts, measurements, and photos. This action cannot be undone."
        confirmText="Clear Everything"
      />
    </>
  );
}
