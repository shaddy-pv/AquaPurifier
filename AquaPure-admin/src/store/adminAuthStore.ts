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
    const data = await adminApi.auth.login(email, password);
    if (data.user.role !== "admin") {
      throw new Error("Access restricted: This account does not possess administrator privileges.");
    }
    localStorage.setItem("aquapure_admin_token", data.token);
    set({ admin: data.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("aquapure_admin_token");
    set({ admin: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ admin: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      // 5-second timeout so it never hangs indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const user = await adminApi.auth.getMe(controller.signal);
      clearTimeout(timeoutId);

      if (user && user.role === "admin") {
        set({ admin: user, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem("aquapure_admin_token");
        set({ admin: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem("aquapure_admin_token");
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// Automatically trigger checkAuth on initialization if a token is present
if (initialToken) {
  useAdminAuthStore.getState().checkAuth();
}
