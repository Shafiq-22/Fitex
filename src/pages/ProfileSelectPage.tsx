import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

export default function ProfileSelectPage() {
  const { profiles, switchProfile, createProfile, deleteProfile } = useProfile();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSelect = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return;
    switchProfile(profileId);
    if (profile.onboardingComplete) {
      navigate('/');
    } else {
      navigate('/onboarding');
    }
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const profile = createProfile(trimmed);
    setNewName('');
    setShowCreate(false);
    navigate('/onboarding');
    // profile is already set as active by createProfile
    void profile;
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setConfirmDeleteId(null);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface-secondary dark:bg-surface-dark">
      {/* Header */}
      <div className="px-5 pt-[max(env(safe-area-inset-top),2rem)] pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Endurance
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose a profile to continue.
        </p>
      </div>

      {/* Profile list */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="flex flex-col gap-3">
          {profiles.length === 0 && !showCreate && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No profiles yet. Create one to get started.
              </p>
            </div>
          )}

          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => handleSelect(profile.id)}
                className="w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.99]"
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {profile.name}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Created {formatDate(profile.createdAt)}
                    {!profile.onboardingComplete && (
                      <span className="ml-2 text-amber-500">Setup incomplete</span>
                    )}
                  </span>
                </div>

                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Delete section */}
              {confirmDeleteId === profile.id ? (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-900/20">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Delete this profile?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(profile.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white rounded-lg bg-red-500 hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end px-4 py-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(profile.id);
                    }}
                    className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Create new profile */}
          {showCreate ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 animate-fade-in">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                Profile name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Enter a name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setNewName('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all active:scale-[0.99]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create New Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
