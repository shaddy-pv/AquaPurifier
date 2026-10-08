import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Droplets,
  ShieldCheck, 
  ChevronRight,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Operations Center", 
  description = "PRAYAG RO Enterprise Store & Inventory Control" 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuthStore();

  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:8081";

  const navItems = [
    { name: "Overview Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products & Inventory", path: "/products", icon: Package },
    { name: "Orders & Invoices", path: "/orders", icon: ShoppingCart },
    { name: "Customers & Accounts", path: "/customers", icon: Users },
    { name: "Reviews Moderation", path: "/reviews", icon: Star },
    { name: "Offers & Banners", path: "/promotions", icon: Megaphone },
    { name: "Store Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col md:flex-row antialiased text-slate-800">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-sky-100 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold shadow-soft">
            <Droplets className="h-5 w-5" />
          </div>
          <div className="flex items-center">
            <span className="font-extrabold text-base text-slate-900">PRAYAG</span>
            <span className="bg-sky-600 text-white font-black text-[10px] px-1 py-0.5 rounded ml-1">RO</span>
            <span className="text-xs text-primary font-semibold ml-1.5">Admin</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-sky-100 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-sm md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-sky-100 flex items-center justify-between bg-gradient-surface">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-soft">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-extrabold text-lg tracking-tight text-slate-900">
                <span>PRAYAG</span>
                <span className="bg-sky-600 text-white font-black text-xs px-1.5 py-0.5 rounded">RO</span>
              </div>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                Admin Operations
              </div>
            </div>
          </Link>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-2 tracking-wider">
            Store Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-sky-50 text-primary font-semibold shadow-xs border-r-4 border-primary"
                    : "text-slate-600 hover:text-primary hover:bg-sky-50/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-slate-400"}`} />
                <span className="flex-1">{item.name}</span>
                {active && <ChevronRight className="h-4 w-4 text-primary" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-sky-100">
            <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-2 tracking-wider">
              Connected Channels
            </div>
            <a
              href={storefrontUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-primary hover:bg-sky-50/60 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-400" />
              <span>Consumer Storefront</span>
            </a>
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-soft">
              {admin?.name ? admin.name[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{admin?.name || "Administrator"}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email || "admin@aquapure.com"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-sky-100 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 justify-center gap-2 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Sticky Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/90 border-b border-sky-100 backdrop-blur-md sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-1 px-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Production Active
            </Badge>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-sky-100 bg-white text-slate-700 hover:text-primary hover:bg-sky-50 shadow-xs text-xs"
            >
              <a href={storefrontUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Visit Storefront</span>
              </a>
            </Button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
