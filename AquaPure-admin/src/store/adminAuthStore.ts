import { create } from "zustand";
import { adminApi, AdminUser } from "@/lib/api";

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const getStoredToken = (): string | null => {
  try {
    return typeof window !== "undefined" ? localStorage.getItem("aquapure_admin_token") : null;
  } catch {
    return null;
  }
};

const initialToken = getStoredToken();

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  // If there's no token in localStorage, we already know user is not authenticated -> isLoading = false immediately!
  isLoading: !!initialToken,

  login: async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const data = await adminApi.auth.login(cleanEmail, password);
    if (data.user.role !== "admin") {
      throw new Error("Access restricted: This account does not possess administrator privileges.");
    }
    localStorage.setItem("aquapure_admin_token", data.token);
    try {
      localStorage.setItem("aquapure_admin_user", JSON.stringify(data.user));
    } catch {
      // Ignore
    }
    set({ admin: data.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("aquapure_admin_token");
    localStorage.removeItem("aquapure_admin_user");
    set({ admin: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ admin: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      // 15-second timeout to accommodate Render / backend spin-up cold starts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const user = await adminApi.auth.getMe(controller.signal);
      clearTimeout(timeoutId);

      if (user && user.role === "admin") {
        try {
          localStorage.setItem("aquapure_admin_user", JSON.stringify(user));
        } catch {
          // Ignore
        }
        set({ admin: user, isAuthenticated: true, isLoading: false });
      } else {
        // Explicit non-admin or invalid user
        localStorage.removeItem("aquapure_admin_token");
        localStorage.removeItem("aquapure_admin_user");
        set({ admin: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err: any) {
      const isAuthError = err?.message?.includes("401") || 
                          err?.message?.includes("Unauthorized") || 
                          err?.message?.includes("jwt expired") || 
                          err?.message?.includes("invalid token");

      if (isAuthError) {
        localStorage.removeItem("aquapure_admin_token");
        localStorage.removeItem("aquapure_admin_user");
        set({ admin: null, isAuthenticated: false, isLoading: false });
      } else {
        // Network lag, cold start or offline: Keep session alive with cached admin user if available
        let cachedAdmin: AdminUser | null = null;
        try {
          const raw = localStorage.getItem("aquapure_admin_user");
          if (raw) cachedAdmin = JSON.parse(raw);
        } catch {
          // Ignore
        }
        set({ 
          admin: cachedAdmin, 
          isAuthenticated: !!cachedAdmin, 
          isLoading: false 
        });
      }
    }
  },
}));

// Automatically trigger checkAuth on initialization if a token is present
if (initialToken) {
  useAdminAuthStore.getState().checkAuth();
}
