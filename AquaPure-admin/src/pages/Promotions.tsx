import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Megaphone, 
  Timer, 
  Tag, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  ExternalLink,
  Phone,
  Truck,
  ShieldCheck,
  RefreshCw,
  Percent,
  Image as ImageIcon,
  Upload,
  Layers,
  Check,
  EyeOff
} from "lucide-react";
import { adminApi, AdminPromotion } from "@/lib/api";
import { toast } from "sonner";

import banner1 from "@/assets/banners/banner-1.jpg";
import banner2 from "@/assets/banners/banner-2.jpg";
import banner3 from "@/assets/banners/banner-3.jpg";

export default function Promotions() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "ticker" | "flash" | "lead" | "coupons">("catalog");

  // Main promotional state
  const [promoData, setPromoData] = useState<AdminPromotion>({
    announcementBar: {
      enabled: true,
      badgeText: "FESTIVE DHAMAKA",
      message: "Flat 40% OFF + Free Doorstep Installation + 1-Year Zero-Cost Warranty!",
      tollFreeNumber: "+91 9140967681",
      trustBadge1: "Same Day Dispatch",
      trustBadge2: "ISO 9001:2015 Certified"
    },
    heroBanner: {
      enabled: true,
      badgeText: "DIRECT FACTORY INAUGURAL OFFER • FLAT 40% OFF",
      headlinePrefix: "Ab Har Boond Mein Shuddhata.",
      brandHighlight: "PRAYAG RO",
      description: "Protect your family with 10-Stage Copper & Alkaline RO Purification. Removes 99.9% harmful chemicals, heavy metals, and bacteria while restoring vital immunity minerals.",
      promoPrice: "₹14,999",
      mrpPrice: "₹22,999",
      liveTdsBadge: "Live TDS Output: 18 PPM",
      primaryCtaText: "Explore Festive Deals",
      primaryCtaLink: "/products",
      heroImage: "/assets/prayag-hero.jpg"
    },
    flashSale: {
      enabled: true,
      title: "INAUGURAL LAUNCH DEAL: PRAYAG RO Copper Alkaline",
      couponCode: "PRAYAG1000",
      couponDiscountText: "Get Extra ₹1,000 Instant Discount with Coupon: PRAYAG1000",
      hoursLeft: 9,
      minutesLeft: 24
    },
    waterTestCampaign: {
      enabled: true,
      badgeText: "100% FREE DOORSTEP SERVICE",
      title: "Get Your Home Water Tested For Free!",
      description: "Our certified water quality expert will visit your home with digital testing equipment to check TDS, hardness, and heavy metals at zero cost.",
      bullet1: "Digital TDS & Hardness Analysis on the spot",
      bullet2: "No obligation to buy • 100% free consultation",
      bullet3: "Available across 10,000+ pin codes in India"
    },
    catalogBanner: {
      enabled: true,
      bannerType: "standard",
      imageUrl: "",
      imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
      imageLink: "",
      badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
      title: "PRAYAG RO Pure Water Purifier Catalog",
      description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
      stat1Value: "40%",
      stat1Label: "Max Discount",
      stat2Value: "FREE",
      stat2Label: "Installation"
    },
    coupons: [
      {
        code: "PRAYAG1000",
        discountText: "₹1,000 OFF",
        discountType: "fixed",
        discountValue: 1000,
        description: "Flat ₹1,000 off on any Purifier",
        active: true
      },
      {
        code: "FESTIVE40",
        discountText: "40% OFF",
        discountType: "percentage",
        discountValue: 40,
        description: "Mega Festive Special 40% Off",
        active: true
      },
      {
        code: "FREESHIP",
        discountText: "FREE SHIP",
        discountType: "fixed",
        discountValue: 0,
        description: "Free Express Doorstep Delivery",
        active: true
      }
    ]
  });

  // New Coupon Modal State
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountText: "",
    discountType: "fixed" as "fixed" | "percentage",
    discountValue: 500,
    description: "",
    active: true
  });

  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:8081";

  // Load from backend
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.promotions.get();
      if (data?.promotion) {
        setPromoData(data.promotion);
      }
    } catch (err: any) {
      console.warn("Could not load promotions, using defaults:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.promotions.update(promoData);
      toast.success("Marketing Banners & Offers Published!", {
        description: "Live storefront has been updated with your new promotional settings."
      });
    } catch (err: any) {
      toast.error("Failed to save promotions", {
        description: err.message || "Please check backend connection."
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset to factory festive defaults
  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all promotional banners & offers to default festive campaign settings?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await adminApi.promotions.reset();
      if (res?.promotion) {
        setPromoData(res.promotion);
      }
      toast.success("Promotions reset to festive defaults!");
    } catch (err: any) {
      toast.error("Failed to reset promotions: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Coupon Handlers
  const handleAddCoupon = () => {
    if (!newCoupon.code.trim()) {
      toast.error("Please enter a valid coupon code");
      return;
    }
    const cleanCode = newCoupon.code.toUpperCase().replace(/\s+/g, "");
    const updated = [
      ...promoData.coupons,
      {
        ...newCoupon,
        code: cleanCode,
        discountText: newCoupon.discountText || `${newCoupon.discountType === 'percentage' ? `${newCoupon.discountValue}% OFF` : `₹${newCoupon.discountValue} OFF`}`
      }
    ];
    setPromoData({ ...promoData, coupons: updated });
    setCouponModalOpen(false);
    setNewCoupon({
      code: "",
      discountText: "",
      discountType: "fixed",
      discountValue: 500,
      description: "",
      active: true
    });
    toast.success(`Coupon ${cleanCode} added! Click 'Save & Publish' to push live.`);
  };

  const handleDeleteCoupon = (index: number) => {
    const updated = promoData.coupons.filter((_, i) => i !== index);
    setPromoData({ ...promoData, coupons: updated });
    toast.info("Coupon removed. Remember to save changes.");
  };

  const handleToggleCoupon = (index: number) => {
    const updated = [...promoData.coupons];
    updated[index].active = !updated[index].active;
    setPromoData({ ...promoData, coupons: updated });
  };

  return (
    <AdminLayout
      title="Offers, Sales & Banner Control"
      description="Manage live promotional tickers, festive hero posters, countdown deals, and coupon codes displayed on the PRAYAG RO storefront"
    >
      <div className="space-y-6">
        {/* Top Header Bar with Live Storefront link & Save Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-sky-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-soft">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base">Campaign Manager</h2>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  Live Storefront Connected
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Changes saved here reflect immediately on the customer portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={saving || loading}
              className="border-sky-100 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs rounded-xl"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Defaults
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm gap-1.5 px-4"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save & Publish Live</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "catalog"
                ? "bg-white text-sky-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Catalog Banner (/products)</span>
          </button>

          <button
            onClick={() => setActiveTab("ticker")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "ticker"
                ? "bg-white text-sky-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>Announcement Ticker</span>
          </button>

          <button
            onClick={() => setActiveTab("flash")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "flash"
                ? "bg-white text-sky-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            <span>Flash Deal & Timer</span>
          </button>

          <button
            onClick={() => setActiveTab("lead")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "lead"
                ? "bg-white text-sky-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Water Test Campaign</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "coupons"
                ? "bg-white text-sky-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Coupons & Discount Codes ({promoData.coupons.length})</span>
          </button>
        </div>

        {/* TAB 1: ANNOUNCEMENT TICKER */}
        {activeTab === "ticker" && (
          <div className="space-y-6">
            <Card className="border-sky-100 bg-white shadow-xs">
              <CardHeader className="pb-4 border-b border-sky-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900">Top Header Announcement Bar</CardTitle>
                    <CardDescription className="text-xs">
                      Controls the top marquee promotional message shown across all storefront pages
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ticker-toggle" className="text-xs font-bold text-slate-700">
                      {promoData.announcementBar.enabled ? "Active on Site" : "Disabled"}
                    </Label>
                    <Switch
                      id="ticker-toggle"
                      checked={promoData.announcementBar.enabled}
                      onCheckedChange={(val) => 
                        setPromoData({
                          ...promoData,
                          announcementBar: { ...promoData.announcementBar, enabled: val }
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Badge Text (Short Callout)</Label>
                    <Input
                      value={promoData.announcementBar.badgeText}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        announcementBar: { ...promoData.announcementBar, badgeText: e.target.value }
                      })}
                      placeholder="e.g. FESTIVE DHAMAKA, DIWALI SALE"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Highlighted in vibrant yellow pill</p>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Helpline / Toll-Free Number</Label>
                    <Input
                      value={promoData.announcementBar.tollFreeNumber}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        announcementBar: { ...promoData.announcementBar, tollFreeNumber: e.target.value }
                      })}
                      placeholder="e.g. +91 9140967681"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Displayed with click-to-dial phone link</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Main Offer Message</Label>
                  <Input
                    value={promoData.announcementBar.message}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      announcementBar: { ...promoData.announcementBar, message: e.target.value }
                    })}
                    placeholder="e.g. Flat 40% OFF + Free Doorstep Installation + 1-Year Zero-Cost Warranty!"
                    className="mt-1.5 border-sky-200 text-xs rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Trust Tag 1</Label>
                    <Input
                      value={promoData.announcementBar.trustBadge1}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        announcementBar: { ...promoData.announcementBar, trustBadge1: e.target.value }
                      })}
                      placeholder="e.g. Same Day Dispatch"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Trust Tag 2</Label>
                    <Input
                      value={promoData.announcementBar.trustBadge2}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        announcementBar: { ...promoData.announcementBar, trustBadge2: e.target.value }
                      })}
                      placeholder="e.g. ISO 9001:2015 Certified"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="pt-4 border-t border-sky-50">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Live Storefront Ticker Preview
                  </p>
                  <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-900 text-white text-xs py-2 px-4 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                        {promoData.announcementBar.badgeText || "PROMO"}
                      </span>
                      <span className="font-medium text-sky-100 truncate">
                        {promoData.announcementBar.message}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-sky-200 text-xs font-semibold">
                      <span>{promoData.announcementBar.trustBadge1}</span>
                      <span>•</span>
                      <span className="text-white font-bold">{promoData.announcementBar.tollFreeNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}



        {/* TAB: CATALOG PAGE BANNER (/products) */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <Card className="border-sky-100 bg-white shadow-xs">
              <CardHeader className="pb-4 border-b border-sky-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base text-slate-900">Products Catalog Header Banner (/products)</CardTitle>
                      {(promoData.catalogBanner?.enabled ?? true) ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          Live on Store
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                          Hidden / Deleted
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      Controls the top promotional banner on the RO Purifiers Catalog page. Display either your custom graphic image flyer OR the classic dynamic gradient text card.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {(promoData.catalogBanner?.enabled ?? true) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPromoData(prev => ({
                            ...prev,
                            catalogBanner: {
                              ...(prev.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              enabled: false
                            }
                          }));
                          toast.warning("Catalog banner hidden/deleted! Storefront will not show any banner on /products.");
                        }}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs rounded-xl h-8 gap-1.5"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Delete / Hide Banner from Store</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPromoData(prev => ({
                            ...prev,
                            catalogBanner: {
                              ...(prev.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              enabled: true
                            }
                          }));
                          toast.success("Catalog banner restored! Click 'Save & Publish Live' to update storefront.");
                        }}
                        className="border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs rounded-xl h-8 gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Restore / Enable Banner</span>
                      </Button>
                    )}

                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                      <Label htmlFor="catalog-toggle" className="text-xs font-bold text-slate-700 sr-only">
                        Toggle Banner
                      </Label>
                      <Switch
                        id="catalog-toggle"
                        checked={promoData.catalogBanner?.enabled ?? true}
                        onCheckedChange={(val) => 
                          setPromoData(prev => ({
                            ...prev,
                            catalogBanner: {
                              ...(prev.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              enabled: val
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Banner Disabled Alert Notice */}
                {(promoData.catalogBanner?.enabled === false) && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <EyeOff className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-950">Catalog Banner is Currently Hidden / Deleted from /products</p>
                        <p className="text-[11px] text-amber-700">Customers browsing the catalog will see pure product listings without any top promotional header.</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setPromoData(prev => ({
                          ...prev,
                          catalogBanner: {
                            ...(prev.catalogBanner || {
                              enabled: true,
                              bannerType: "standard",
                              imageUrl: "",
                              imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                              imageLink: "",
                              badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                              title: "PRAYAG RO Pure Water Purifier Catalog",
                              description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                              stat1Value: "40%",
                              stat1Label: "Max Discount",
                              stat2Value: "FREE",
                              stat2Label: "Installation"
                            }),
                            enabled: true
                          }
                        }));
                        toast.success("Catalog banner restored! Click 'Save & Publish Live' to update storefront.");
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0"
                    >
                      Restore / Show Banner
                    </Button>
                  </div>
                )}

                {/* Banner Style Selector Cards */}
                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-2 block">Choose Banner Format</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Mode 1: Custom Graphic Image Banner */}
                    <div
                      onClick={() => {
                        setPromoData({
                          ...promoData,
                          catalogBanner: {
                            ...(promoData.catalogBanner || {
                              enabled: true,
                              bannerType: "standard",
                              imageUrl: "",
                              imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                              imageLink: "",
                              badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                              title: "PRAYAG RO Pure Water Purifier Catalog",
                              description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                              stat1Value: "40%",
                              stat1Label: "Max Discount",
                              stat2Value: "FREE",
                              stat2Label: "Installation"
                            }),
                            bannerType: "image"
                          }
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        promoData.catalogBanner?.bannerType === "image"
                          ? "border-sky-500 bg-sky-50/60 ring-2 ring-sky-200"
                          : "border-slate-200 bg-slate-50/50 hover:border-sky-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-7 w-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Custom Graphic Image Banner</span>
                        {promoData.catalogBanner?.bannerType === "image" && (
                          <Badge className="ml-auto bg-sky-600 text-white text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Upload your custom graphic poster / flyer (PNG, JPG, WebP) designed in Canva or Photoshop.
                      </p>
                    </div>

                    {/* Mode 2: Standard Dynamic Text Banner */}
                    <div
                      onClick={() => {
                        setPromoData({
                          ...promoData,
                          catalogBanner: {
                            ...(promoData.catalogBanner || {
                              enabled: true,
                              bannerType: "standard",
                              imageUrl: "",
                              imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                              imageLink: "",
                              badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                              title: "PRAYAG RO Pure Water Purifier Catalog",
                              description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                              stat1Value: "40%",
                              stat1Label: "Max Discount",
                              stat2Value: "FREE",
                              stat2Label: "Installation"
                            }),
                            bannerType: "standard"
                          }
                        });
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        (promoData.catalogBanner?.bannerType ?? "standard") === "standard"
                          ? "border-sky-500 bg-sky-50/60 ring-2 ring-sky-200"
                          : "border-slate-200 bg-slate-50/50 hover:border-sky-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Layers className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Standard Dynamic Text Banner</span>
                        {(promoData.catalogBanner?.bannerType ?? "standard") === "standard" && (
                          <Badge className="ml-auto bg-indigo-600 text-white text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Classic sleek gradient blue card with editable headline, badge text, description, and discount pills.
                      </p>
                    </div>

                  </div>
                </div>

                {/* FORM FOR MODE 1: CUSTOM IMAGE BANNER */}
                {promoData.catalogBanner?.bannerType === "image" && (
                  <div className="space-y-4 p-5 rounded-2xl bg-sky-50/40 border border-sky-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Upload className="h-4 w-4 text-sky-600" />
                        <span>Upload or Choose Graphic Banner</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        {promoData.catalogBanner?.imageUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPromoData(prev => ({
                                ...prev,
                                catalogBanner: {
                                  ...(prev.catalogBanner || {
                                    enabled: true,
                                    bannerType: "standard",
                                    imageUrl: "",
                                    imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                    imageLink: "",
                                    badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                    title: "PRAYAG RO Pure Water Purifier Catalog",
                                    description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                    stat1Value: "40%",
                                    stat1Label: "Max Discount",
                                    stat2Value: "FREE",
                                    stat2Label: "Installation"
                                  }),
                                  imageUrl: "",
                                  bannerType: "standard"
                                }
                              }));
                              toast.info("Banner image cleared. Switched to standard dynamic text banner.");
                            }}
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-xl h-7 gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete / Clear Banner Image</span>
                          </Button>
                        )}
                        <span className="text-[11px] text-slate-400">16:9 Landscape (1600×400 or 1200×320 px)</span>
                      </div>
                    </div>

                    {/* File Upload Zone */}
                    <div className="border-2 border-dashed border-sky-200 hover:border-sky-400 transition-colors rounded-2xl p-6 text-center bg-white cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            toast.error("Please upload a valid image file (PNG, JPG, WebP)");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement("canvas");
                              const MAX_WIDTH = 1600;
                              let width = img.width;
                              let height = img.height;
                              if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext("2d");
                              if (ctx) {
                                ctx.drawImage(img, 0, 0, width, height);
                                const compressed = canvas.toDataURL("image/jpeg", 0.85);
                                setPromoData(prev => ({
                                  ...prev,
                                  catalogBanner: {
                                    ...(prev.catalogBanner || {
                                      enabled: true,
                                      bannerType: "image",
                                      imageUrl: "",
                                      imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                      imageLink: "",
                                      badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                      title: "PRAYAG RO Pure Water Purifier Catalog",
                                      description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                      stat1Value: "40%",
                                      stat1Label: "Max Discount",
                                      stat2Value: "FREE",
                                      stat2Label: "Installation"
                                    }),
                                    imageUrl: compressed,
                                    bannerType: "image",
                                    enabled: true
                                  }
                                }));
                                toast.success("Banner image loaded! Click 'Save & Publish Live' to update storefront.");
                              }
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                          <Upload className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drag & drop banner image from your computer
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          PNG, JPG, or WebP. Auto-optimized for blazing fast storefront loading.
                        </p>
                      </div>
                    </div>

                    {/* Or URL input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Image URL (Direct Path or CDN)</Label>
                        <Input
                          value={promoData.catalogBanner?.imageUrl || ""}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "image",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              imageUrl: e.target.value
                            }
                          })}
                          placeholder="e.g. /assets/prayag-hero.jpg or https://cdn..."
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-slate-700">Click-through Destination Link (Optional)</Label>
                        <Input
                          value={promoData.catalogBanner?.imageLink || ""}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "image",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              imageLink: e.target.value
                            }
                          })}
                          placeholder="e.g. /products, /contact, or leave blank"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-slate-700">Image Alt / Caption (For SEO & Screen Readers)</Label>
                      <Input
                        value={promoData.catalogBanner?.imageAlt || ""}
                        onChange={(e) => setPromoData({
                          ...promoData,
                          catalogBanner: {
                            ...(promoData.catalogBanner || {
                              enabled: true,
                              bannerType: "image",
                              imageUrl: "",
                              imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                              imageLink: "",
                              badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                              title: "PRAYAG RO Pure Water Purifier Catalog",
                              description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                              stat1Value: "40%",
                              stat1Label: "Max Discount",
                              stat2Value: "FREE",
                              stat2Label: "Installation"
                            }),
                            imageAlt: e.target.value
                          }
                        })}
                        placeholder="PRAYAG RO Pure Water Purifier Catalog Inaugural Offer"
                        className="mt-1.5 border-sky-200 text-xs rounded-xl"
                      />
                    </div>

                    {/* Visual Preset Cards Grid */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          Ready-Made PRAYAG RO Presets (Click to Apply)
                        </span>
                        <span className="text-[11px] text-slate-400">Official 16:9 Widescreen Landscape</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Preset 1: Flagship */}
                        <div
                          onClick={() => {
                            setPromoData(prev => ({
                              ...prev,
                              catalogBanner: {
                                ...(prev.catalogBanner || {
                                  enabled: true,
                                  bannerType: "image",
                                  imageUrl: "",
                                  imageAlt: "PRAYAG RO Flagship Water Purifier Offer",
                                  imageLink: "/products",
                                  badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                  title: "PRAYAG RO Pure Water Purifier Catalog",
                                  description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                  stat1Value: "40%",
                                  stat1Label: "Max Discount",
                                  stat2Value: "FREE",
                                  stat2Label: "Installation"
                                }),
                                enabled: true,
                                bannerType: "image",
                                imageUrl: "/assets/banners/banner-1.jpg",
                                imageAlt: "PRAYAG RO Flagship Water Purifier Offer",
                                imageLink: "/products"
                              }
                            }));
                            toast.success("Applied Preset 1: PRAYAG RO Flagship Banner!");
                          }}
                          className={`group cursor-pointer rounded-2xl border-2 p-3 transition-all bg-white hover:shadow-md ${
                            promoData.catalogBanner?.imageUrl?.includes("banner-1")
                              ? "border-sky-500 ring-2 ring-sky-200 shadow-sm"
                              : "border-slate-200 hover:border-sky-300"
                          }`}
                        >
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                            <img
                              src={banner1}
                              alt="Preset 1: PRAYAG RO Flagship"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {promoData.catalogBanner?.imageUrl?.includes("banner-1") && (
                              <div className="absolute top-2 right-2 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Check className="h-3 w-3" /> Selected
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-sky-600 transition-colors">
                                Preset 1: PRAYAG RO Flagship
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-sky-200 text-sky-700 bg-sky-50">
                                Best Seller
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              "Drink Pure. Live Healthy." • RO + UV + UF + Mineralizer
                            </p>
                          </div>
                        </div>

                        {/* Preset 2: Copper Alkaline */}
                        <div
                          onClick={() => {
                            setPromoData(prev => ({
                              ...prev,
                              catalogBanner: {
                                ...(prev.catalogBanner || {
                                  enabled: true,
                                  bannerType: "image",
                                  imageUrl: "",
                                  imageAlt: "PRAYAG RO Copper Alkaline Purifier Offer",
                                  imageLink: "/products",
                                  badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                  title: "PRAYAG RO Pure Water Purifier Catalog",
                                  description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                  stat1Value: "40%",
                                  stat1Label: "Max Discount",
                                  stat2Value: "FREE",
                                  stat2Label: "Installation"
                                }),
                                enabled: true,
                                bannerType: "image",
                                imageUrl: "/assets/banners/banner-2.jpg",
                                imageAlt: "PRAYAG RO Copper Alkaline Purifier Offer",
                                imageLink: "/products"
                              }
                            }));
                            toast.success("Applied Preset 2: PRAYAG RO Copper Alkaline Banner!");
                          }}
                          className={`group cursor-pointer rounded-2xl border-2 p-3 transition-all bg-white hover:shadow-md ${
                            promoData.catalogBanner?.imageUrl?.includes("banner-2")
                              ? "border-sky-500 ring-2 ring-sky-200 shadow-sm"
                              : "border-slate-200 hover:border-sky-300"
                          }`}
                        >
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                            <img
                              src={banner2}
                              alt="Preset 2: PRAYAG RO Copper Alkaline"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {promoData.catalogBanner?.imageUrl?.includes("banner-2") && (
                              <div className="absolute top-2 right-2 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Check className="h-3 w-3" /> Selected
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-sky-600 transition-colors">
                                Preset 2: PRAYAG RO Copper
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-200 text-amber-700 bg-amber-50">
                                Immunity
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              "Copper Alkaline Enrichment" • Active Minerals & pH 8.5+
                            </p>
                          </div>
                        </div>

                        {/* Preset 3: Grand Heavy Duty */}
                        <div
                          onClick={() => {
                            setPromoData(prev => ({
                              ...prev,
                              catalogBanner: {
                                ...(prev.catalogBanner || {
                                  enabled: true,
                                  bannerType: "image",
                                  imageUrl: "",
                                  imageAlt: "PRAYAG RO Grand Heavy Duty Offer",
                                  imageLink: "/products",
                                  badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                  title: "PRAYAG RO Pure Water Purifier Catalog",
                                  description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                  stat1Value: "40%",
                                  stat1Label: "Max Discount",
                                  stat2Value: "FREE",
                                  stat2Label: "Installation"
                                }),
                                enabled: true,
                                bannerType: "image",
                                imageUrl: "/assets/banners/banner-3.jpg",
                                imageAlt: "PRAYAG RO Grand Heavy Duty Offer",
                                imageLink: "/products"
                              }
                            }));
                            toast.success("Applied Preset 3: PRAYAG RO Grand Banner!");
                          }}
                          className={`group cursor-pointer rounded-2xl border-2 p-3 transition-all bg-white hover:shadow-md ${
                            promoData.catalogBanner?.imageUrl?.includes("banner-3")
                              ? "border-sky-500 ring-2 ring-sky-200 shadow-sm"
                              : "border-slate-200 hover:border-sky-300"
                          }`}
                        >
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                            <img
                              src={banner3}
                              alt="Preset 3: PRAYAG RO Grand"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {promoData.catalogBanner?.imageUrl?.includes("banner-3") && (
                              <div className="absolute top-2 right-2 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Check className="h-3 w-3" /> Selected
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-sky-600 transition-colors">
                                Preset 3: PRAYAG RO Grand
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-indigo-200 text-indigo-700 bg-indigo-50">
                                High Flow
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              "Grand RO Water Purifier" • Healthy & Refreshing Living
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview of Image Banner */}
                    {(() => {
                      const isPreset1 = promoData.catalogBanner?.imageUrl?.includes("banner-1");
                      const isPreset2 = promoData.catalogBanner?.imageUrl?.includes("banner-2");
                      const isPreset3 = promoData.catalogBanner?.imageUrl?.includes("banner-3");
                      const previewSrc = isPreset1
                        ? banner1
                        : isPreset2
                        ? banner2
                        : isPreset3
                        ? banner3
                        : promoData.catalogBanner?.imageUrl || "";

                      return (
                        <div className="pt-4 border-t border-sky-100 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Live Storefront Preview (/products)
                              </p>
                              {previewSrc && (
                                <Badge className="bg-sky-100 text-sky-700 border-sky-200 text-[10px]">
                                  {isPreset1
                                    ? "Preset 1 Active"
                                    : isPreset2
                                    ? "Preset 2 Active"
                                    : isPreset3
                                    ? "Preset 3 Active"
                                    : "Custom Upload Active"}
                                </Badge>
                              )}
                            </div>
                            {previewSrc && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPromoData(prev => ({
                                    ...prev,
                                    catalogBanner: {
                                      ...(prev.catalogBanner || {
                                        enabled: true,
                                        bannerType: "standard",
                                        imageUrl: "",
                                        imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                        imageLink: "",
                                        badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                        title: "PRAYAG RO Pure Water Purifier Catalog",
                                        description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                        stat1Value: "40%",
                                        stat1Label: "Max Discount",
                                        stat2Value: "FREE",
                                        stat2Label: "Installation"
                                      }),
                                      imageUrl: "",
                                      bannerType: "standard"
                                    }
                                  }));
                                  toast.info("Banner image cleared. Switched to standard dynamic text banner.");
                                }}
                                className="border-red-200 text-red-600 hover:bg-red-50 text-xs rounded-xl h-7 gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete / Clear Banner Image</span>
                              </Button>
                            )}
                          </div>

                          {previewSrc ? (
                            <div className="rounded-2xl overflow-hidden border border-sky-200 shadow-md bg-slate-950 p-1 flex items-center justify-center">
                              <img
                                src={previewSrc}
                                alt={promoData.catalogBanner?.imageAlt || "Banner Preview"}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = banner1;
                                }}
                                className="w-full h-auto max-h-[320px] object-contain rounded-xl block"
                              />
                            </div>
                          ) : (
                            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-sky-200 bg-white/70">
                              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                              <p className="text-xs font-bold text-slate-700">No Custom Banner Image Active</p>
                              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                                Select one of the 3 ready presets above, or upload a custom image flyer to display on /products.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* FORM FOR MODE 2: STANDARD DYNAMIC TEXT BANNER */}
                {(promoData.catalogBanner?.bannerType ?? "standard") === "standard" && (
                  <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-indigo-600" />
                      <span>Customize Dynamic Gradient Banner Texts</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Badge Text (Top Pill)</Label>
                        <Input
                          value={promoData.catalogBanner?.badgeText || "DIRECT FACTORY CATALOG • FLAT 40% OFF"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              badgeText: e.target.value
                            }
                          })}
                          placeholder="DIRECT FACTORY CATALOG • FLAT 40% OFF"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-slate-700">Catalog Main Headline</Label>
                        <Input
                          value={promoData.catalogBanner?.title || "PRAYAG RO Pure Water Purifier Catalog"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              title: e.target.value
                            }
                          })}
                          placeholder="PRAYAG RO Pure Water Purifier Catalog"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-bold text-slate-700">Description / Free Inclusions Text</Label>
                      <Textarea
                        rows={2}
                        value={promoData.catalogBanner?.description || "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage."}
                        onChange={(e) => setPromoData({
                          ...promoData,
                          catalogBanner: {
                            ...(promoData.catalogBanner || {
                              enabled: true,
                              bannerType: "standard",
                              imageUrl: "",
                              imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                              imageLink: "",
                              badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                              title: "PRAYAG RO Pure Water Purifier Catalog",
                              description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                              stat1Value: "40%",
                              stat1Label: "Max Discount",
                              stat2Value: "FREE",
                              stat2Label: "Installation"
                            }),
                            description: e.target.value
                          }
                        })}
                        placeholder="Mention free installation, pre-filter, AMC coverage..."
                        className="mt-1.5 border-sky-200 text-xs rounded-xl"
                      />
                    </div>

                    {/* Stat Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Stat 1 Value</Label>
                        <Input
                          value={promoData.catalogBanner?.stat1Value || "40%"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              stat1Value: e.target.value
                            }
                          })}
                          placeholder="40%"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Stat 1 Label</Label>
                        <Input
                          value={promoData.catalogBanner?.stat1Label || "Max Discount"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              stat1Label: e.target.value
                            }
                          })}
                          placeholder="Max Discount"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Stat 2 Value</Label>
                        <Input
                          value={promoData.catalogBanner?.stat2Value || "FREE"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              stat2Value: e.target.value
                            }
                          })}
                          placeholder="FREE"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Stat 2 Label</Label>
                        <Input
                          value={promoData.catalogBanner?.stat2Label || "Installation"}
                          onChange={(e) => setPromoData({
                            ...promoData,
                            catalogBanner: {
                              ...(promoData.catalogBanner || {
                                enabled: true,
                                bannerType: "standard",
                                imageUrl: "",
                                imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
                                imageLink: "",
                                badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
                                title: "PRAYAG RO Pure Water Purifier Catalog",
                                description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
                                stat1Value: "40%",
                                stat1Label: "Max Discount",
                                stat2Value: "FREE",
                                stat2Label: "Installation"
                              }),
                              stat2Label: e.target.value
                            }
                          })}
                          placeholder="Installation"
                          className="mt-1.5 border-sky-200 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Live Preview of Standard Banner */}
                    <div className="pt-4 border-t border-indigo-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Live Storefront Preview (/products)
                      </p>
                      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-700 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 max-w-xl space-y-2">
                          <div className="inline-block bg-white/20 text-white border border-white/30 backdrop-blur-sm px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                            {promoData.catalogBanner?.badgeText || "DIRECT FACTORY CATALOG • FLAT 40% OFF"}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                            {promoData.catalogBanner?.title || "PRAYAG RO Pure Water Purifier Catalog"}
                          </h3>
                          <p className="text-xs text-sky-100 leading-relaxed">
                            {promoData.catalogBanner?.description || "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage."}
                          </p>
                        </div>
                        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-4 text-white text-xs font-bold">
                          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[80px]">
                            <div className="text-xl font-black text-amber-300">
                              {promoData.catalogBanner?.stat1Value || "40%"}
                            </div>
                            <div className="text-[10px] text-sky-100">
                              {promoData.catalogBanner?.stat1Label || "Max Discount"}
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[80px]">
                            <div className="text-xl font-black text-emerald-300">
                              {promoData.catalogBanner?.stat2Value || "FREE"}
                            </div>
                            <div className="text-[10px] text-sky-100">
                              {promoData.catalogBanner?.stat2Label || "Installation"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: FLASH DEAL & TIMER */}
        {activeTab === "flash" && (
          <div className="space-y-6">
            <Card className="border-sky-100 bg-white shadow-xs">
              <CardHeader className="pb-4 border-b border-sky-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900">Flash Deal of the Day Bar</CardTitle>
                    <CardDescription className="text-xs">
                      Controls the high-converting urgency bar with ticking countdown clock and instant coupon
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="flash-toggle" className="text-xs font-bold text-slate-700">
                      {promoData.flashSale.enabled ? "Active on Site" : "Disabled"}
                    </Label>
                    <Switch
                      id="flash-toggle"
                      checked={promoData.flashSale.enabled}
                      onCheckedChange={(val) => 
                        setPromoData({
                          ...promoData,
                          flashSale: { ...promoData.flashSale, enabled: val }
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Flash Deal Title</Label>
                  <Input
                    value={promoData.flashSale.title}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      flashSale: { ...promoData.flashSale, title: e.target.value }
                    })}
                    placeholder="INAUGURAL LAUNCH DEAL: PRAYAG RO Copper Alkaline"
                    className="mt-1.5 border-sky-200 text-xs rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Coupon Code To Highlight</Label>
                    <Input
                      value={promoData.flashSale.couponCode}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        flashSale: { ...promoData.flashSale, couponCode: e.target.value }
                      })}
                      placeholder="PRAYAG1000"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl font-mono uppercase"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Discount Description</Label>
                    <Input
                      value={promoData.flashSale.couponDiscountText}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        flashSale: { ...promoData.flashSale, couponDiscountText: e.target.value }
                      })}
                      placeholder="Get Extra ₹1,000 Instant Discount with Coupon: PRAYAG1000"
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Timer Hours Left</Label>
                    <Input
                      type="number"
                      min={0}
                      max={72}
                      value={promoData.flashSale.hoursLeft}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        flashSale: { ...promoData.flashSale, hoursLeft: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Timer Minutes Left</Label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={promoData.flashSale.minutesLeft}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        flashSale: { ...promoData.flashSale, minutesLeft: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-sky-50">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Flash Bar Live Preview
                  </p>
                  <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-950 text-white p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-amber-300" />
                      <div>
                        <p className="text-xs font-bold">{promoData.flashSale.title}</p>
                        <p className="text-[11px] text-sky-200">{promoData.flashSale.couponDiscountText}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-amber-300 font-extrabold text-xs">
                      <span className="bg-slate-950 px-2 py-1 rounded">{String(promoData.flashSale.hoursLeft).padStart(2, "0")}h</span>
                      <span>:</span>
                      <span className="bg-slate-950 px-2 py-1 rounded">{String(promoData.flashSale.minutesLeft).padStart(2, "0")}m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: WATER TEST CAMPAIGN */}
        {activeTab === "lead" && (
          <div className="space-y-6">
            <Card className="border-sky-100 bg-white shadow-xs">
              <CardHeader className="pb-4 border-b border-sky-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900">Free Doorstep Water Test Campaign</CardTitle>
                    <CardDescription className="text-xs">
                      Controls the home water testing promotional banner and appointment lead generator
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="lead-toggle" className="text-xs font-bold text-slate-700">
                      {promoData.waterTestCampaign.enabled ? "Active on Site" : "Disabled"}
                    </Label>
                    <Switch
                      id="lead-toggle"
                      checked={promoData.waterTestCampaign.enabled}
                      onCheckedChange={(val) => 
                        setPromoData({
                          ...promoData,
                          waterTestCampaign: { ...promoData.waterTestCampaign, enabled: val }
                        })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Campaign Badge Text</Label>
                    <Input
                      value={promoData.waterTestCampaign.badgeText}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        waterTestCampaign: { ...promoData.waterTestCampaign, badgeText: e.target.value }
                      })}
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Headline</Label>
                    <Input
                      value={promoData.waterTestCampaign.title}
                      onChange={(e) => setPromoData({
                        ...promoData,
                        waterTestCampaign: { ...promoData.waterTestCampaign, title: e.target.value }
                      })}
                      className="mt-1.5 border-sky-200 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Campaign Description</Label>
                  <Textarea
                    rows={2}
                    value={promoData.waterTestCampaign.description}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      waterTestCampaign: { ...promoData.waterTestCampaign, description: e.target.value }
                    })}
                    className="mt-1.5 border-sky-200 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-700">Key Trust Bullets</Label>
                  <Input
                    value={promoData.waterTestCampaign.bullet1}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      waterTestCampaign: { ...promoData.waterTestCampaign, bullet1: e.target.value }
                    })}
                    placeholder="Bullet 1"
                    className="border-sky-200 text-xs rounded-xl"
                  />
                  <Input
                    value={promoData.waterTestCampaign.bullet2}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      waterTestCampaign: { ...promoData.waterTestCampaign, bullet2: e.target.value }
                    })}
                    placeholder="Bullet 2"
                    className="border-sky-200 text-xs rounded-xl"
                  />
                  <Input
                    value={promoData.waterTestCampaign.bullet3}
                    onChange={(e) => setPromoData({
                      ...promoData,
                      waterTestCampaign: { ...promoData.waterTestCampaign, bullet3: e.target.value }
                    })}
                    placeholder="Bullet 3"
                    className="border-sky-200 text-xs rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: COUPONS & PROMO CODES */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <Card className="border-sky-100 bg-white shadow-xs">
              <CardHeader className="pb-4 border-b border-sky-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-900">Promotional Coupons & Vouchers</CardTitle>
                    <CardDescription className="text-xs">
                      Manage discount coupon codes valid on customer cart & checkout
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setCouponModalOpen(true)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Coupon</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="divide-y divide-sky-100">
                  {promoData.coupons.map((coupon, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Percent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {coupon.code}
                            </span>
                            <Badge className={`text-[10px] ${coupon.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                              {coupon.active ? "Active" : "Disabled"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {coupon.description || coupon.discountText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right mr-2">
                          <span className="text-sm font-extrabold text-sky-700">{coupon.discountText}</span>
                          <p className="text-[10px] text-slate-400 capitalize">{coupon.discountType} discount</p>
                        </div>

                        <Switch
                          checked={coupon.active}
                          onCheckedChange={() => handleToggleCoupon(idx)}
                          aria-label="Toggle coupon status"
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCoupon(idx)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Floating Quick Action Footer */}
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-100 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>All edits are draft until you click <strong>Save & Publish Live</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-sky-200 text-slate-700 hover:text-sky-600 text-xs rounded-xl"
            >
              <a href={storefrontUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Storefront</span>
              </a>
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 px-5"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save & Publish Live</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Coupon Dialog */}
      <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-sky-100 shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-slate-900">
              Create New Promotional Coupon
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold text-slate-700">Coupon Code</Label>
              <Input
                placeholder="e.g. SUMMER2026, PRAYAG500"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="mt-1 border-sky-200 font-mono text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Discount Type</Label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                  className="w-full mt-1 h-9 rounded-xl border border-sky-200 bg-white text-xs px-3 text-slate-800"
                >
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Discount Value</Label>
                <Input
                  type="number"
                  min={1}
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) || 0 })}
                  className="mt-1 border-sky-200 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Display Offer Text</Label>
              <Input
                placeholder="e.g. ₹500 OFF, 15% OFF"
                value={newCoupon.discountText}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountText: e.target.value })}
                className="mt-1 border-sky-200 text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Description</Label>
              <Input
                placeholder="e.g. Special festive discount on all models"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="mt-1 border-sky-200 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCouponModalOpen(false)}
              className="rounded-xl border-sky-200 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddCoupon}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs"
            >
              Add Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
