import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user, token) => {
    localStorage.setItem("z-auth-token", token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("z-auth-token");
    set({ user: null, token: null, isAuthenticated: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setUser: (user) => set({ user, isAuthenticated: !!user })
}));
