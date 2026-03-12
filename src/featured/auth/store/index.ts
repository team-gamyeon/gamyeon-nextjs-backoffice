import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logoutAction } from "@/featured/auth/actions";
import type { Admin } from "@/featured/auth/types";

interface AdminStore {
  admin: Admin | null;
  isAuthenticated: boolean;
  setAdmin: (admin: Admin) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      logout: async () => {
        await logoutAction();
        set({ admin: null, isAuthenticated: false });
        window.location.href = "/login";
      },
    }),
    {
      name: "admin-auth",
      skipHydration: true,
    }
  )
);
