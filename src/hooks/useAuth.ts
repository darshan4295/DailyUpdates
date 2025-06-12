import { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  initializeStorage, 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser, 
  getUserByEmail, 
  addUser, 
  getUsers 
} from '../lib/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize storage with demo data
    initializeStorage();
    
    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Load all users
    const users = getUsers();
    setAllUsers(users);
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role: 'employee' | 'manager';
    team: string;
  }) => {
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = addUser({
        name: userData.name,
        email: email,
        role: userData.role,
        team: userData.team,
      });

      // Set as current user
      setCurrentUser(newUser);
      setUser(newUser);
      
      // Update all users list
      const users = getUsers();
      setAllUsers(users);

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create account' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const existingUser = getUserByEmail(email);
      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }

      // Set as current user
      setCurrentUser(existingUser);
      setUser(existingUser);

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  };

  const signOut = async () => {
    clearCurrentUser();
    setUser(null);
  };

  return {
    user,
    loading,
    allUsers,
    signUp,
    signIn,
    signOut,
  };
};