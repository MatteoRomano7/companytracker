import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  company_name: string;
  notes: string | null;
  added_at: string;
  updated_at: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
}

interface WatchlistActions {
  fetchWatchlist: () => Promise<void>;
  addItem: (dto: { symbol: string; companyName: string; notes?: string }) => Promise<void>;
  updateItem: (id: string, dto: { notes?: string }) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearWatchlist: () => void;
  setError: (error: string | null) => void;
}

type WatchlistStoreType = WatchlistState & WatchlistActions;

const initialState: WatchlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useWatchlistStore = create<WatchlistStoreType>((set, get) => ({
  ...initialState,

  fetchWatchlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      set({ items: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch watchlist';
      set({ error: message, isLoading: false });
    }
  },

  addItem: async (dto) => {
    set({ error: null });
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          symbol: dto.symbol,
          company_name: dto.companyName,
          notes: dto.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ items: [data, ...state.items] }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item';
      set({ error: message });
    }
  },

  updateItem: async (id, dto) => {
    set({ error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('watchlist')
        .update({ notes: dto.notes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? data : item)),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      set({ error: message });
    }
  },

  updateNotes: async (id, notes) => {
    await get().updateItem(id, { notes });
  },

  removeItem: async (id) => {
    set({ error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase.from('watchlist').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      set({ error: message });
    }
  },

  clearWatchlist: () => set(initialState),

  setError: (error) => set({ error }),
}));

export const selectIsSymbolInWatchlist = (symbol: string) => (state: WatchlistState): boolean =>
  state.items.some((item) => item.symbol.toUpperCase() === symbol.toUpperCase());

export const selectWatchlistCount = (state: WatchlistState): number =>
  state.items.length;

export const selectIsWatchlistEmpty = (state: WatchlistState): boolean =>
  state.items.length === 0;
