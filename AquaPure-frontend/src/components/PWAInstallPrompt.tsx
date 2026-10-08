import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, WifiOff, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { setupNetworkListeners } from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Listen for PWA Install Prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Don't show immediately if user recently dismissed
      const dismissedUntil = localStorage.getItem("aquapure_pwa_dismissed");
      if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 2. Listen for installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      toast.success("PRAYAG RO App installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 3. Network listener
    const cleanupNetwork = setupNetworkListeners(
      () => {
        setIsOffline(false);
        toast.success("Back online!");
      },
      () => {
        setIsOffline(true);
        toast.warning("You are currently browsing offline. Cached features available.");
      }
    );

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (cleanupNetwork) cleanupNetwork();
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Dismiss for 24 hours
    localStorage.setItem("aquapure_pwa_dismissed", (Date.now() + 86400000).toString());
  };

  return (
    <>
      {/* Offline Toast Banner */}
      {isOffline && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="h-4 w-4" />
          <span>You are offline. Product catalog and previous orders remain accessible.</span>
        </div>
      )}

      {/* PWA Install Floating Banner */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-slate-950/95 border border-sky-500/30 backdrop-blur-lg rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Install PRAYAG RO App</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  1-tap checkout, filter alerts, and offline access
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-500 hover:text-slate-300 p-1"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold h-9"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Install Free App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="border-slate-800 text-slate-400 hover:text-slate-200 text-xs h-9"
            >
              Not Now
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
