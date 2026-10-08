import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  Droplets, 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings, 
  Package,
  Phone,
  ShieldCheck,
  Truck
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { usePromotionStore } from "@/store/promotionStore";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();
  const { announcementBar, fetchPromotions } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top Promotional Bar */}
      {announcementBar.enabled && (
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-900 text-white text-[11px] sm:text-xs py-1.5 px-4 transition-all duration-300">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
            <div className="flex items-center gap-2 truncate">
              {announcementBar.badgeText && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide animate-pulse">
                  {announcementBar.badgeText}
                </span>
              )}
              <span className="font-medium text-sky-100 truncate">
                {announcementBar.message}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-sky-200 text-xs shrink-0">
              {announcementBar.trustBadge1 && (
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-cyan-300" />
                  <span>{announcementBar.trustBadge1}</span>
                </span>
              )}
              {announcementBar.trustBadge2 && (
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                  <span>{announcementBar.trustBadge2}</span>
                </span>
              )}
              {announcementBar.tollFreeNumber && (
                <a 
                  href={`tel:${announcementBar.tollFreeNumber.replace(/[^0-9]/g, "") || announcementBar.tollFreeNumber}`} 
                  className="flex items-center gap-1 font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-300" />
                  <span>Toll Free: {announcementBar.tollFreeNumber}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-sky-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18 py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="relative">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded-sm shadow-xs">
                  RO
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                    PRAYAG
                  </span>
                  <span className="bg-sky-600 text-white font-black text-xs px-1.5 py-0.5 rounded tracking-wider">
                    RO
                  </span>
                </div>
                <span className="text-[10px] text-sky-700 font-semibold tracking-wider mt-0.5 uppercase">
                  शुद्ध जल • स्वस्थ जीवन
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              <Link
                to="/"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 ${
                  isActive("/") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 flex items-center gap-1 ${
                  isActive("/products") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                <span>RO Purifiers</span>
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                  SALE
                </span>
              </Link>
              <Link
                to="/services"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 ${
                  isActive("/services") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                AMC & Service
              </Link>
              <Link
                to="/track-order"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 ${
                  isActive("/track-order") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                Track Order
              </Link>
              <Link
                to="/about"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 ${
                  isActive("/about") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                About Brand
              </Link>
              <Link
                to="/contact"
                className={`font-semibold text-sm transition-colors hover:text-sky-600 ${
                  isActive("/contact") ? "text-sky-600" : "text-slate-700"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Call to Book Demo button */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden xl:flex border-sky-200 bg-sky-50/80 hover:bg-sky-100 text-sky-800 font-semibold text-xs rounded-xl shadow-xs"
              >
                <a href="tel:+919140967681">
                  <Phone className="mr-1.5 h-3.5 w-3.5 text-sky-600" />
                  Free TDS Water Test
                </a>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="border-sky-200 hover:border-sky-400 bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-900 relative rounded-xl h-10 px-3.5 shadow-xs transition-colors group"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4 text-sky-600 group-hover:text-sky-700 mr-1.5 transition-colors" />
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-sky-900 transition-colors">Cart</span>
                  {totalItems > 0 && (
                    <Badge 
                      className="ml-1.5 h-5 min-w-5 flex items-center justify-center p-1 text-[11px] font-bold bg-sky-600 text-white rounded-full"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-sky-100 hover:bg-sky-50 text-slate-700 rounded-xl h-10 px-3 flex items-center gap-2"
                    >
                      <div className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                        {user?.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <span className="text-xs font-semibold max-w-[80px] truncate">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border-sky-100 shadow-premium">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-sky-100" />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer text-slate-700 hover:text-sky-600">
                        <Settings className="mr-2 h-4 w-4 text-sky-600" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/orders" className="cursor-pointer text-slate-700 hover:text-sky-600">
                        <ShoppingCart className="mr-2 h-4 w-4 text-sky-600" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/track-order" className="cursor-pointer text-slate-700 hover:text-sky-600">
                        <Package className="mr-2 h-4 w-4 text-sky-600" />
                        Track Shipment
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-sky-100" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-700 hover:text-sky-600 font-semibold text-xs" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm px-4" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Right Bar: Cart Icon + Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="relative p-2 h-9 w-9 rounded-xl border-sky-100 text-slate-800"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5 text-sky-600" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 p-0.5 flex items-center justify-center text-[10px] bg-red-600 text-white font-bold rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-9 w-9 text-slate-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X className="h-6 w-6 text-sky-600" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-sky-100 bg-white/98 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
              {/* Quick promotional call banner inside mobile menu */}
              <div className="mb-3 p-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border border-sky-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Need Help Choosing RO?</p>
                  <p className="text-[11px] text-sky-700">Helpline: +91 9140967681</p>
                </div>
                <Button size="sm" asChild className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-8">
                  <a href="tel:+919140967681">Call Now</a>
                </Button>
              </div>

              <nav className="flex flex-col space-y-1.5">
                <Link
                  to="/"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive("/") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-between ${
                    isActive("/products") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>RO Purifiers</span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    UP TO 40% OFF
                  </span>
                </Link>
                <Link
                  to="/services"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive("/services") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  AMC & Filter Service
                </Link>
                <Link
                  to="/track-order"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive("/track-order") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  to="/about"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive("/about") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About PRAYAG RO
                </Link>
                <Link
                  to="/contact"
                  className={`px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isActive("/contact") ? "bg-sky-50 text-sky-600 font-bold" : "text-slate-700 hover:bg-sky-50/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Support
                </Link>

                {/* Mobile Auth Section */}
                <div className="pt-3 mt-2 border-t border-sky-100">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-3.5 py-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                        <p className="font-bold text-sm text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild className="rounded-xl border-sky-200">
                          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                            My Account
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="rounded-xl border-sky-200">
                          <Link to="/profile/orders" onClick={() => setIsMenuOpen(false)}>
                            My Orders
                          </Link>
                        </Button>
                      </div>

                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleLogout} 
                        className="w-full rounded-xl"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button variant="outline" size="sm" asChild className="rounded-xl border-sky-200">
                        <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl" asChild>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;