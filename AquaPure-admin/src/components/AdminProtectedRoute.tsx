import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuthStore();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    checkAuth();

    // If loading takes longer than 2.5 seconds, show fallback button
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 2500);

    // Hard timeout after 4 seconds: force isLoading to false so user is never stuck
    const hardTimeout = setTimeout(() => {
      if (useAdminAuthStore.getState().isLoading) {
        useAdminAuthStore.setState({ isLoading: false });
      }
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(hardTimeout);
    };
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-xs">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Verifying Administrator Session...</p>
          {showFallback && (
            <div className="mt-3 flex flex-col items-center gap-2 animate-in fade-in duration-300">
              <p className="text-[11px] text-slate-400">Taking longer than expected?</p>
              <Link
                to="/login"
                className="text-xs font-semibold text-primary hover:underline bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100"
              >
                Go to Administrator Login →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
