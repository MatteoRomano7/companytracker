import { create } from 'zustand';

interface SimpleUser {
  id: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: SimpleUser | null;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (data: { user: SimpleUser }) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStoreType = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  ...initialState,

  setAuth: ({ user }) => set({ user, isLoading: false }),

  clearAuth: () => set({ user: null, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),
}));

export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.user !== null;

export const selectDisplayName = (state: AuthState): string | null =>
  state.user?.displayName || null;

export const selectUserEmail = (state: AuthState): string | null =>
  state.user?.email || null;
