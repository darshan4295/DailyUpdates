// Local storage utilities for the daily updates app with Clerk integration
import { query } from './db';

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

const PROFILES_KEY = 'daily_updates_profiles'; // Will be removed
const UPDATES_KEY = 'daily_updates_data'; // Will be removed for updates later

// Profile management
export const getAllProfiles = async (): Promise<UserProfile[]> => {
  try {
    const res = await query('SELECT id, name, email, role, team FROM profiles');
    return res.rows;
  } catch (error) {
    console.error('Database error in getAllProfiles:', error);
    return [];
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const res = await query('SELECT id, name, email, role, team FROM profiles WHERE id = $1', [userId]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error('Database error in getUserProfile:', error);
    return null;
  }
};

export const createUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const { id, name, email, role, team } = profile;
  try {
    const res = await query(
      'INSERT INTO profiles (id, name, email, role, team) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, team',
      [id, name, email, role, team]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Database error in createUserProfile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updatedProfile: UserProfile): Promise<UserProfile> => {
  const { name, email, role, team } = updatedProfile;
  try {
    const res = await query(
      'UPDATE profiles SET name = $1, email = $2, role = $3, team = $4 WHERE id = $5 RETURNING id, name, email, role, team',
      [name, email, role, team, userId]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Database error in updateUserProfile:', error);
    throw error;
  }
};

// Updates management
export const getUpdates = async (): Promise<StorageUpdate[]> => {
  try {
    const res = await query('SELECT id, user_id, date, accomplishments, carry_forward, today_plans, created_at FROM updates');
    return res.rows.map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] }));
  } catch (error) {
    console.error('Database error in getUpdates:', error);
    return [];
  }
};

export const addUpdate = async (update: Omit<StorageUpdate, 'id' | 'created_at'>): Promise<StorageUpdate> => {
  const id = Date.now().toString(); // Generate ID
  const { user_id, date, accomplishments, carry_forward, today_plans } = update;
  try {
    const res = await query(
      'INSERT INTO updates (id, user_id, date, accomplishments, carry_forward, today_plans) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, date, accomplishments, carry_forward, today_plans, created_at',
      [id, user_id, date, accomplishments, carry_forward, today_plans]
    );
    // Ensure date is formatted as YYYY-MM-DD
    const row = res.rows[0];
    return { ...row, date: new Date(row.date).toISOString().split('T')[0] };
  } catch (error) {
    console.error('Database error in addUpdate:', error);
    throw error;
  }
};

export const getUpdatesByUserId = async (userId: string): Promise<StorageUpdate[]> => {
  try {
    const res = await query('SELECT id, user_id, date, accomplishments, carry_forward, today_plans, created_at FROM updates WHERE user_id = $1', [userId]);
    return res.rows.map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] }));
  } catch (error) {
    console.error('Database error in getUpdatesByUserId:', error);
    return [];
  }
};

export const getUpdatesByTeam = async (team: string): Promise<StorageUpdate[]> => {
  try {
    const res = await query(
      `SELECT u.id, u.user_id, u.date, u.accomplishments, u.carry_forward, u.today_plans, u.created_at
       FROM updates u
       JOIN profiles p ON u.user_id = p.id
       WHERE p.team = $1`,
      [team]
    );
    return res.rows.map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] }));
  } catch (error) {
    console.error('Database error in getUpdatesByTeam:', error);
    return [];
  }
};