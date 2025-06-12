import { useState, useEffect } from 'react';
import { User } from '@clerk/clerk-react';
import { UserProfile } from '../types';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile,
  getAllProfiles 
} from '../lib/storage';

export const useProfile = (clerkUser: User | null | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clerkUser) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [clerkUser]);

  const loadProfile = async () => {
    if (!clerkUser) return;

    try {
      const existingProfile = getUserProfile(clerkUser.id);
      if (existingProfile) {
        setProfile(existingProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Omit<UserProfile, 'id'>) => {
    if (!clerkUser) return;

    try {
      const newProfile: UserProfile = {
        id: clerkUser.id,
        name: profileData.name,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        role: profileData.role,
        team: profileData.team,
      };

      const existingProfile = getUserProfile(clerkUser.id);
      if (existingProfile) {
        updateUserProfile(clerkUser.id, newProfile);
      } else {
        createUserProfile(newProfile);
      }

      setProfile(newProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
  };
};