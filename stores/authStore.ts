import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  role: string | null;
  permissions: string[];
  setAuth: (data: { accessToken: string; role: string; permissions: string[] }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  permissions: [],
  setAuth: ({ accessToken, role, permissions }) =>
    set(() => ({
      accessToken,
      role,
      permissions,
    })),
  clearAuth: () =>
    set(() => ({
      accessToken: null,
      role: null,
      permissions: [],
    })),
}));
