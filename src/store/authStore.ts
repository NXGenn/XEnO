import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ isAuthenticated: true, user: data.user });
    return data;
  },
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null });
  },
}));