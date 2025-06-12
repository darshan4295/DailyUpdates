// Local storage utilities for the daily updates app with Clerk integration

export interface UserProfile {
  id: string; // Clerk user ID
  name: string;
  email: string;
  role: 'employee' | 'manager';
  team: string;
}

export interface StorageUpdate {
  id: string;
  user_id: string;
  date: string;
  accomplishments: string;
  carry_forward: string;
  today_plans: string;
  created_at: string;
}

const PROFILES_KEY = 'daily_updates_profiles';
const UPDATES_KEY = 'daily_updates_data';

// Profile management
export const getAllProfiles = (): UserProfile[] => {
  const profiles = localStorage.getItem(PROFILES_KEY);
  return profiles ? JSON.parse(profiles) : [];
};

export const getUserProfile = (userId: string): UserProfile | null => {
  const profiles = getAllProfiles();
  return profiles.find(profile => profile.id === userId) || null;
};

export const createUserProfile = (profile: UserProfile): UserProfile => {
  const profiles = getAllProfiles();
  profiles.push(profile);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  return profile;
};

export const updateUserProfile = (userId: string, updatedProfile: UserProfile): UserProfile => {
  const profiles = getAllProfiles();
  const index = profiles.findIndex(profile => profile.id === userId);
  if (index !== -1) {
    profiles[index] = updatedProfile;
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
  return updatedProfile;
};

// Updates management
export const getUpdates = (): StorageUpdate[] => {
  const updates = localStorage.getItem(UPDATES_KEY);
  return updates ? JSON.parse(updates) : [];
};

export const addUpdate = (update: Omit<StorageUpdate, 'id' | 'created_at'>): StorageUpdate => {
  const updates = getUpdates();
  const newUpdate: StorageUpdate = {
    ...update,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  updates.push(newUpdate);
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
  return newUpdate;
};

export const getUpdatesByUserId = (userId: string): StorageUpdate[] => {
  const updates = getUpdates();
  return updates.filter(update => update.user_id === userId);
};

export const getUpdatesByTeam = (team: string): StorageUpdate[] => {
  const updates = getUpdates();
  const profiles = getAllProfiles();
  const teamUserIds = profiles.filter(profile => profile.team === team).map(profile => profile.id);
  return updates.filter(update => teamUserIds.includes(update.user_id));
};