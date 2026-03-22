import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useStorage } from '../hooks/useStorage';
import { generateId } from '../lib/id';
import type { Profile } from '../types';

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  createProfile: (name: string) => Profile;
  deleteProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  updateProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const AVATAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useStorage<Profile[]>('endurance:profiles', []);
  const [activeProfileId, setActiveProfileId] = useStorage<string | null>('endurance:activeProfileId', null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const createProfile = useCallback((name: string) => {
    const profile: Profile = {
      id: generateId(),
      name,
      avatarColor: AVATAR_COLORS[profiles.length % AVATAR_COLORS.length],
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
      onboardingData: null,
    };
    setProfiles(prev => [...prev, profile]);
    setActiveProfileId(profile.id);
    return profile;
  }, [profiles.length, setProfiles, setActiveProfileId]);

  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  }, [activeProfileId, setProfiles, setActiveProfileId]);

  const switchProfile = useCallback((id: string) => {
    setActiveProfileId(id);
  }, [setActiveProfileId]);

  const updateProfile = useCallback((profile: Profile) => {
    setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  }, [setProfiles]);

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, createProfile, deleteProfile, switchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
}
