// =============================================================================
// Authentication & User Types
// Integrated with Supabase Auth
// =============================================================================

import type { User, Session } from '@supabase/supabase-js';

/**
 * Extended user profile stored in the Supabase `profiles` table.
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Global authentication state managed by Zustand.
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth store actions exposed by the Zustand auth slice.
 */
export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  reset: () => void;
}

/**
 * Combined auth store type (state + actions).
 */
export type AuthStore = AuthState & AuthActions;
