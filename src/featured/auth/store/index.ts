import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin } from "@/featured/auth/types";

interface AdminStore {
  admin: Admin | null;
  isAuthenticated: boolean;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
      logout: () => {
        document.cookie =
          "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
