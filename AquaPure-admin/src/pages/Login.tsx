import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, ShieldCheck, Lock, Mail, ArrowRight, Key } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@aquapure.com");
  const [password, setPassword] = useState("Admin@AquaPure2025!");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Administrator!");
      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-white to-sky-100/60 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border border-sky-100 shadow-premium bg-white/95 backdrop-blur-md rounded-2xl relative z-10">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-gradient-primary text-white flex items-center justify-center shadow-soft">
            <Droplets className="h-8 w-8" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Security Portal</span>
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1.5">
            <span>PRAYAG</span>
            <span className="bg-sky-600 text-white font-black text-sm px-1.5 py-0.5 rounded">RO</span>
            <span className="text-slate-800 text-xl font-bold ml-1">Admin</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Sign in with authorized administrator credentials
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Administrator Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aquapure.com"
                  className="pl-10 text-sm border-sky-100 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10 text-sm border-sky-100 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Credentials Info */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-primary">
                <Key className="h-3.5 w-3.5" />
                <span>Default Admin Credentials:</span>
              </p>
              <p><span className="text-slate-500">Email:</span> <code className="font-mono font-semibold">admin@aquapure.com</code></p>
              <p><span className="text-slate-500">Password:</span> <code className="font-mono font-semibold">Admin@AquaPure2025!</code></p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary hover:shadow-premium text-white font-semibold text-sm h-11 transition-all rounded-xl mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
