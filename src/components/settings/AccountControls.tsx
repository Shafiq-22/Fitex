import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function AccountControls() {
  const navigate = useNavigate();
  const { activeProfile, updateProfile } = useProfile();
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  function handleRegenerate() {
    if (!activeProfile) return;
    updateProfile({
      ...activeProfile,
      onboardingComplete: false,
    });
    setShowRegenConfirm(false);
    navigate('/onboarding');
  }

  return (
    <>
      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Account</h3>
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/profile-select')}
          >
            Switch Profile
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowRegenConfirm(true)}
          >
            Regenerate Workout Plan
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showRegenConfirm}
        onClose={() => setShowRegenConfirm(false)}
        onConfirm={handleRegenerate}
        title="Regenerate Plan"
        message="This will restart the onboarding process to create a new workout plan based on your updated preferences. Your existing data will be kept."
        confirmText="Regenerate"
      />
    </>
  );
}
