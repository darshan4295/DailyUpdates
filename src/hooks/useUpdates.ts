import { useState, useEffect } from 'react';
import { DailyUpdate, FilterOptions, UserProfile } from '../types';
import { 
  getUpdates, 
  addUpdate, 
  getUserProfile, 
  getUpdatesByUserId, 
  getUpdatesByTeam,
  getAllProfiles
} from '../lib/storage';

export const useUpdates = (profile: UserProfile | null) => {
  const [updates, setUpdates] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (profile) {
      fetchUpdates();
      fetchAllUsers();
    }
  }, [profile]);

  const fetchAllUsers = () => {
    const users = getAllProfiles();
    setAllUsers(users);
  };

  const fetchUpdates = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      let rawUpdates;
      
      // If user is employee, only fetch their updates
      if (profile.role === 'employee') {
        rawUpdates = getUpdatesByUserId(profile.id);
      } else {
        // If user is manager, fetch all team updates
        rawUpdates = getUpdatesByTeam(profile.team);
      }

      // Transform updates to include user information
      const formattedUpdates: DailyUpdate[] = rawUpdates.map(update => {
        const updateUser = getUserProfile(update.user_id);
        return {
          id: update.id,
          user_id: update.user_id,
          user_name: updateUser?.name || 'Unknown User',
          team: updateUser?.team || 'Unknown Team',
          date: update.date,
          accomplishments: update.accomplishments,
          carry_forward: update.carry_forward,
          today_plans: update.today_plans,
          created_at: update.created_at,
        };
      });

      // Sort by date (newest first)
      formattedUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Error in fetchUpdates:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUpdate = async (updateData: {
    date: string;
    accomplishments: string;
    carry_forward: string;
    today_plans: string;
  }) => {
    if (!profile) return { success: false, error: 'User not authenticated' };

    try {
      const newUpdate = addUpdate({
        user_id: profile.id,
        date: updateData.date,
        accomplishments: updateData.accomplishments,
        carry_forward: updateData.carry_forward,
        today_plans: updateData.today_plans,
      });

      // Add to local state
      const formattedUpdate: DailyUpdate = {
        id: newUpdate.id,
        user_id: newUpdate.user_id,
        user_name: profile.name,
        team: profile.team,
        date: newUpdate.date,
        accomplishments: newUpdate.accomplishments,
        carry_forward: newUpdate.carry_forward,
        today_plans: newUpdate.today_plans,
        created_at: newUpdate.created_at,
      };

      setUpdates(prev => [formattedUpdate, ...prev]);

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error saving update:', error);
      return { success: false, error: error.message || 'Failed to save update' };
    }
  };

  const filterUpdates = (filters: FilterOptions): DailyUpdate[] => {
    return updates.filter(update => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const updateDate = new Date(update.date);
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          if (updateDate < startDate) return false;
        }
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          if (updateDate > endDate) return false;
        }
      }

      // Team filter
      if (filters.team && update.team !== filters.team) {
        return false;
      }

      // User filter
      if (filters.user && update.user_id !== filters.user) {
        return false;
      }

      return true;
    });
  };

  return {
    updates,
    loading,
    allUsers,
    saveUpdate,
    filterUpdates,
    refetch: fetchUpdates,
  };
};