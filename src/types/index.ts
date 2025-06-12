export interface UserProfile {
  id: string; // Clerk user ID
  name: string;
  email: string;
  role: 'employee' | 'manager';
  team: string;
}

export interface DailyUpdate {
  id: string;
  user_id: string;
  user_name: string;
  team: string;
  date: string;
  accomplishments: string;
  carry_forward: string;
  today_plans: string;
  created_at: string;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  team: string;
  user: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}