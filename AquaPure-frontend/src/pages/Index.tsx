import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Wrench, 
  Clock,
  Star,
  Quote,
  ChevronRight,
  Droplets,
  Zap,
  Heart,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Truck,
  RotateCcw,
  Check,
  ShieldAlert,
  Percent,
  Timer,
  Tag,
  Copy
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { usePromotionStore } from "@/store/promotionStore";
import { toast } from "sonner";

// New High-Res Commercial Assets
import prayagHeroImg from "@/assets/prayag-hero.jpg";
import prayagCopperImg from "@/assets/prayag-copper.jpg";
import prayagGrandImg from "@/assets/prayag-grand.jpg";

export default function Index() {
  const { heroBanner, flashSale, waterTestCampaign, coupons, fetchPromotions } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Flash Sale Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ 
    hours: flashSale.hoursLeft || 9, 
    minutes: flashSale.minutesLeft || 24, 
    seconds: 45 
  });

  useEffect(() => {
    if (flashSale.hoursLeft !== undefined && flashSale.minutesLeft !== undefined) {
      setTimeLeft(prev => ({
        ...prev,
        hours: flashSale.hoursLeft,
        minutes: flashSale.minutesLeft
      }));
    }
  }, [flashSale.hoursLeft, flashSale.minutesLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Water Doctor Interactive Selector
  const [selectedWaterType, setSelectedWaterType] = useState<"municipal" | "borewell" | "tanker">("borewell");

  // Free Water Test Form State
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    city: "",
    waterSource: "borewell"
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      toast.error("Please fill in your name and mobile number");
      return;
    }
    setLeadSubmitted(true);
    toast.success("Free Home Water Test Booked!", {
      description: `Thank you ${leadForm.name}! A PRAYAG RO certified technician will call you within 15 minutes to confirm your doorstep appointment.`,
    });
  };

  const featuredProducts = [
    {
      id: "1",
      name: "PRAYAG RO Copper & Zinc Alkaline 10L Purifier",
      price: 14999,
      originalPrice: 22999,
      image: prayagCopperImg,
      rating: 4.9,
      reviews: 3420,
      features: [
        "10-Stage Active Purification",
        "Active Copper + Zinc Mineral Booster",
        "Natural Alkaline pH 8.0 - 8.5"
      ],
      tag: "Best Seller"
    },
    {
      id: "2",
      name: "PRAYAG RO Grand 10L Multi-Stage Wall Mount",
      price: 11499,
      originalPrice: 17999,
      image: prayagGrandImg,
      rating: 4.8,
      reviews: 2150,
      features: [
        "High-Flow RO + UV + UF Membrane",
        "Transparent 10L Water Level Window",
        "Zero-Waste Water Recovery System"
      ],
      tag: "Festive Deal"
    },
    {
      id: "3",
      name: "PRAYAG RO Smart Touch Pro with Live TDS Display",
      price: 16999,
      originalPrice: 25999,
      image: prayagHeroImg,
      rating: 4.9,
      reviews: 1890,
      features: [
        "Real-Time Digital TDS Display",
        "In-Tank UV LED Disinfection",
        "Mobile App Water Telemetry"
      ],
      tag: "Smart Flagship"
    }
  ];

  const waterTypesInfo = {
    municipal: {
      title: "Municipal / Tap Water (Jal Board)",
      tds: "TDS 100 - 250 PPM",
      recommendedModel: "PRAYAG RO Grand UV + UF Mineral",
      price: "₹9,999",
      inputTds: 220,
      outputTds: 35,
      features: "Retains essential calcium & magnesium while eliminating 100% bacteria, chlorine & rust pipes contamination."
    },
    borewell: {
      title: "Underground Borewell / Tube-Well Water",
      tds: "TDS 300 - 1500 PPM",
      recommendedModel: "PRAYAG RO Copper & Zinc Alkaline 10L",
      price: "₹14,999",
      inputTds: 850,
      outputTds: 45,
      features: "Heavy-duty 0.0001 micron RO membrane strips toxic lead, arsenic & heavy salts, then infuses pure Ayurvedic Copper & Zinc."
    },
    tanker: {
      title: "Mixed Tanker / Hard High-Salinity Water",
      tds: "TDS 1500 - 2500 PPM",
      recommendedModel: "PRAYAG RO Smart Touch Pro 10-Stage",
      price: "₹16,999",
      inputTds: 1800,
      outputTds: 50,
      features: "Equipped with dual anti-scalant chambers, industrial high-pressure booster pump, and micro-TDS balance controller."
    }
  };

  const comparisonData = [
    {
      parameter: "Active Copper & Zinc Infusion",
      prayag: "Yes • 24/7 Ayurvedic Immunity Boost",
      ordinary: "No • Strips all minerals completely"
    },
    {
      parameter: "Alkaline pH Balance",
      prayag: "Optimal pH 8.0 - 8.5 (Neutralizes Acidity)",
      ordinary: "Acidic Water (pH 5.5 - 6.5)"
    },
    {
      parameter: "In-Tank Secondary Sterilization",
      prayag: "Continuous UV LED In-Tank Protection",
      ordinary: "Stagnant tank vulnerable to algae"
    },
    {
      parameter: "Custom TDS Balance Controller",
      prayag: "Yes • Adjust sweet taste as per family preference",
      ordinary: "Fixed non-adjustable cartridge"
    },
    {
      parameter: "Free Doorstep Installation",
      prayag: "100% Free by Certified Engineers",
      ordinary: "₹500 - ₹800 Extra Labor Charge"
    },
    {
      parameter: "Annual Maintenance & Warranty",
      prayag: "1-Year Zero-Cost AMC + 3-Yr Membrane Warranty",
      ordinary: "Paid service visits after 30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SEO
        title="PRAYAG RO | India's Certified RO Water Purifiers • Pure & Mineral-Rich Water"
        description="PRAYAG RO - India's leading Copper & Alkaline RO water purifiers. 10-stage purification, digital TDS balance, free doorstep installation, and 1-year zero-cost warranty. Shop now!"
        keywords="PRAYAG RO, prayag water purifier, copper ro purifier, alkaline water purifier, ro filter, best ro in india"
        type="website"
      />

      {/* Promotional Top Hero Section */}
      {heroBanner.enabled && (
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-sky-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Promotional Copy */}
              <div className="lg:col-span-7 space-y-6">
                {/* Promotional Badge */}
                {heroBanner.badgeText && (
                  <div className="inline-block bg-sky-100 text-sky-800 border border-sky-200 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
                    {heroBanner.badgeText}
                  </div>
                )}

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                  {heroBanner.headlinePrefix}{" "}
                  <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 bg-clip-text text-transparent">
                    {heroBanner.brandHighlight}
                  </span>
                </h1>

                {/* Tagline */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  {heroBanner.description}
                </p>

                {/* Value Add Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <ShieldCheck className="h-5 w-5 text-sky-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Active Copper + Zinc</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <Droplets className="h-5 w-5 text-cyan-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Alkaline pH 8.5+</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-sky-100 shadow-xs col-span-2 sm:col-span-1">
                    <Wrench className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">Free Installation</span>
                  </div>
                </div>

                {/* Price & CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-base h-13 px-8 rounded-2xl shadow-lg shadow-sky-600/25 group gap-2"
                    asChild
                  >
                    <Link to={heroBanner.primaryCtaLink || "/products"}>
                      <span>{heroBanner.primaryCtaText || "Explore Festive Deals"}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-sky-300 hover:bg-sky-50 text-sky-800 font-bold text-base h-13 px-6 rounded-2xl bg-white shadow-xs gap-2"
                    onClick={() => {
                      const el = document.getElementById("water-test-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Droplets className="h-5 w-5 text-sky-600" />
                    <span>Book Free Water Test</span>
                  </Button>
                </div>

                {/* Direct Manufacturer Trust Strip */}
                <div className="pt-4 border-t border-sky-200/60 flex flex-wrap items-center gap-6 text-slate-700 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-sky-900 bg-sky-100/70 px-2.5 py-1 rounded-lg border border-sky-200">
                    <Award className="h-4 w-4 text-sky-600 shrink-0" />
                    <span className="font-bold">Direct Factory Pricing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>ISO 9001 Tested Components</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Truck className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Free Delivery & Installation</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <RotateCcw className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>7-Day Replacement Policy</span>
                  </div>
                </div>
              </div>

              {/* Right Promotional Product Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Glow ring */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/30 to-cyan-300/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
                  
                  {/* Product Card Container */}
                  <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-sky-100 overflow-hidden relative">
                    <img
                      src={heroBanner.heroImage && heroBanner.heroImage.startsWith("http") ? heroBanner.heroImage : prayagHeroImg}
                      alt="PRAYAG RO Smart Water Purifier"
                      className="w-full h-auto object-cover rounded-2xl shadow-sm"
                    />

                    {/* Floating Promo Tag on Image */}
                    {heroBanner.liveTdsBadge && (
                      <div className="absolute top-6 left-6 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-bold">{heroBanner.liveTdsBadge}</span>
                      </div>
                    )}

                    {/* Floating Special Price Tag */}
                    {(heroBanner.promoPrice || heroBanner.mrpPrice) && (
                      <div className="absolute bottom-6 right-6 bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2 rounded-2xl shadow-xl flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100">Festive Price</span>
                        <span className="text-xl sm:text-2xl font-black">{heroBanner.promoPrice}</span>
                        {heroBanner.mrpPrice && (
                          <span className="text-[10px] text-sky-200 line-through">MRP {heroBanner.mrpPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Promotional Flash Deal Countdown Bar */}
      {flashSale.enabled && (
        <section className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-950 text-white py-4 px-4 shadow-md">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <Timer className="h-6 w-6" />
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base tracking-wide">
                  {flashSale.title}
                </p>
                <p className="text-xs text-sky-200">
                  {flashSale.couponDiscountText}
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-300 uppercase font-bold mr-1">Offer Ends In:</span>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg font-mono font-extrabold text-amber-300 text-sm border border-sky-800">
                {String(timeLeft.hours).padStart(2, "0")}h
              </div>
              <span className="font-bold text-amber-300">:</span>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg font-mono font-extrabold text-amber-300 text-sm border border-sky-800">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </div>
              <span className="font-bold text-amber-300">:</span>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg font-mono font-extrabold text-amber-300 text-sm border border-sky-800">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </div>

              {flashSale.couponCode && (
                <Button 
                  size="sm" 
                  className="ml-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(flashSale.couponCode);
                    toast.success(`Coupon code ${flashSale.couponCode} copied!`, {
                      description: "Apply at checkout for instant discount."
                    });
                  }}
                >
                  Copy {flashSale.couponCode}
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Active Store Coupons Strip */}
      {coupons && coupons.filter(c => c.active).length > 0 && (
        <section className="bg-sky-50/70 border-b border-sky-100 py-3 px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="font-bold text-sky-900 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-sky-600" />
              <span>Active Festive Coupons:</span>
            </span>
            {coupons.filter(c => c.active).map((coupon) => (
              <button
                key={coupon.code}
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  toast.success(`Coupon ${coupon.code} copied!`, {
                    description: `${coupon.description || coupon.discountText} will apply at checkout.`
                  });
                }}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-sky-100/80 border border-dashed border-sky-300 text-slate-800 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs transition-colors group cursor-pointer"
                title={`Click to copy ${coupon.code}`}
              >
                <span className="font-mono font-bold text-sky-700">{coupon.code}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {coupon.discountText}
                </span>
                <Copy className="h-3 w-3 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Feature Highlights */}
      <section className="py-12 bg-white border-b border-sky-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">1-Year Zero-Cost AMC</h4>
                <p className="text-xs text-slate-500 mt-0.5">Free filter replacements & maintenance</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="h-10 w-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Free Doorstep Install</h4>
                <p className="text-xs text-slate-500 mt-0.5">Installed within 24-48 hrs of delivery</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ayurvedic Copper Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5">Infuses health minerals in every drop</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="h-10 w-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Free Pre-Filter Kit</h4>
                <p className="text-xs text-slate-500 mt-0.5">Worth ₹1,499 bundled completely free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Widget: "PRAYAG Water Doctor" (TDS & Source Selector) */}
      <section className="py-16 bg-gradient-to-b from-white to-sky-50/60 border-b border-sky-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-2 mb-10">
            <Badge className="bg-sky-100 text-sky-800 border-sky-200 font-bold px-3 py-1 inline-flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-sky-600" />
              <span>PRAYAG SMART WATER DOCTOR</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              Which Purifier Is Right For Your Home?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Select your drinking water source to see the recommended PRAYAG RO model and expected purity level.
            </p>
          </div>

          {/* Interactive Source Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setSelectedWaterType("municipal")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedWaterType === "municipal"
                  ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-400/20"
                  : "bg-white/60 border-sky-100 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Municipal Tap Water</span>
                {selectedWaterType === "municipal" && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">Jal Board / Municipal Corporation</p>
              <span className="inline-block mt-2 text-[11px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                TDS: 100 - 250 PPM
              </span>
            </button>

            <button
              onClick={() => setSelectedWaterType("borewell")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedWaterType === "borewell"
                  ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-400/20"
                  : "bg-white/60 border-sky-100 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Underground Borewell</span>
                {selectedWaterType === "borewell" && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">Tube-well / Hard Underground Water</p>
              <span className="inline-block mt-2 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                TDS: 300 - 1500 PPM (Most Common)
              </span>
            </button>

            <button
              onClick={() => setSelectedWaterType("tanker")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedWaterType === "tanker"
                  ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-400/20"
                  : "bg-white/60 border-sky-100 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Tanker / High Salinity</span>
                {selectedWaterType === "tanker" && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">High Saline / Heavy Hard Minerals</p>
              <span className="inline-block mt-2 text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                TDS: 1500 - 2500 PPM
              </span>
            </button>
          </div>

          {/* Dynamic Result Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Recommended Match</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">99.9% Purity Guaranteed</Badge>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {waterTypesInfo[selectedWaterType].recommendedModel}
                </h3>
                <p className="text-sm text-slate-600">
                  {waterTypesInfo[selectedWaterType].features}
                </p>

                {/* TDS Comparison Meter */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-500">
                      Raw Tap Water: <strong className="text-red-600">{waterTypesInfo[selectedWaterType].inputTds} PPM</strong>
                    </span>
                    <span className="text-sky-700">
                      PRAYAG Pure Water: <strong className="text-emerald-600 font-extrabold">{waterTypesInfo[selectedWaterType].outputTds} PPM (Sweet & Healthy)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[15%]" title="Safe Minerals (15%)"></div>
                    <div className="bg-slate-200 h-full w-[85%]" title="Filtered Contaminants"></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Reduces hardness by up to 96% while maintaining pH 8.0+ natural alkalinity.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Offer Price</span>
                    <div className="text-2xl font-black text-slate-900">{waterTypesInfo[selectedWaterType].price}</div>
                  </div>
                  <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md">
                    <Link to="/products">
                      View Model Specs & Offers
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 w-full max-w-xs text-center space-y-3">
                  <div className="h-44 w-full flex items-center justify-center">
                    <img 
                      src={selectedWaterType === "borewell" ? prayagCopperImg : selectedWaterType === "tanker" ? prayagHeroImg : prayagGrandImg} 
                      alt="Recommended PRAYAG RO"
                      className="max-h-full object-contain drop-shadow-md rounded-xl"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Includes Free 1-Year Zero-Cost AMC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white border-b border-sky-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Flagship Catalog</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                PRAYAG RO Top Bestsellers
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Engineered with Indian water conditions in mind • 100% genuine copper & food-grade tanks
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl font-bold text-xs h-10 shrink-0"
              asChild
            >
              <Link to="/products">
                View All Models ({featuredProducts.length}+)
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why PRAYAG RO Beats Ordinary Purifiers (Comparison Table) */}
      <section className="py-16 bg-gradient-to-b from-sky-50/50 to-white border-b border-sky-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-2 mb-12">
            <Badge className="bg-sky-100 text-sky-800 border-sky-200 font-bold px-3 py-1 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
              <span>TECHNOLOGY SPECIFICATIONS</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              Why PRAYAG RO Is The Smarter Choice
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Ordinary RO filters strip good minerals leaving water dead and acidic. PRAYAG RO enriches your water with vital copper, zinc, and natural alkaline minerals.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-sky-900 text-white font-bold text-xs sm:text-sm p-4">
              <div className="col-span-5 sm:col-span-4">Feature / Specification</div>
              <div className="col-span-4 sm:col-span-4 text-sky-300 font-extrabold flex items-center gap-1">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>PRAYAG RO Technology</span>
              </div>
              <div className="col-span-3 sm:col-span-4 text-slate-300">Ordinary RO Purifiers</div>
            </div>

            <div className="divide-y divide-sky-100 text-xs sm:text-sm">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-sky-50/40 transition-colors">
                  <div className="col-span-5 sm:col-span-4 font-bold text-slate-900">
                    {row.parameter}
                  </div>
                  <div className="col-span-4 sm:col-span-4 font-bold text-sky-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{row.prayag}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-slate-500 flex items-center gap-1.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{row.ordinary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book Free Doorstep Water Test Lead Form */}
      {waterTestCampaign.enabled && (
        <section id="water-test-section" className="py-16 bg-white border-b border-sky-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-cyan-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Background design */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-6 space-y-4">
                  {waterTestCampaign.badgeText && (
                    <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      {waterTestCampaign.badgeText}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                    {waterTestCampaign.title}
                  </h3>
                  <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
                    {waterTestCampaign.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {waterTestCampaign.bullet1 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-100">
                        <Check className="h-4 w-4 text-amber-300" />
                        <span>{waterTestCampaign.bullet1}</span>
                      </div>
                    )}
                    {waterTestCampaign.bullet2 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-100">
                        <Check className="h-4 w-4 text-amber-300" />
                        <span>{waterTestCampaign.bullet2}</span>
                      </div>
                    )}
                    {waterTestCampaign.bullet3 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-100">
                        <Check className="h-4 w-4 text-amber-300" />
                        <span>{waterTestCampaign.bullet3}</span>
                      </div>
                    )}
                  </div>
                </div>

              {/* Form Box */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 text-slate-900 shadow-xl">
                  {leadSubmitted ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Appointment Scheduled!</h4>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        Thank you {leadForm.name}. Our local PRAYAG RO service engineer will call your number ({leadForm.phone}) within 15 minutes.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setLeadSubmitted(false)}
                      >
                        Book Another Test
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <h4 className="font-extrabold text-lg text-slate-900">
                        Book Your Free Water Test Slot
                      </h4>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                        <Input
                          placeholder="e.g. Ramesh Kumar"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          className="rounded-xl border-sky-200 h-10 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (For Confirmation)</label>
                        <Input
                          placeholder="e.g. +91 9140967681"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                          className="rounded-xl border-sky-200 h-10 text-xs"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City / Pin Code</label>
                          <Input
                            placeholder="e.g. Lucknow, 226001"
                            value={leadForm.city}
                            onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                            className="rounded-xl border-sky-200 h-10 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Water Source</label>
                          <select 
                            value={leadForm.waterSource}
                            onChange={(e) => setLeadForm({ ...leadForm, waterSource: e.target.value })}
                            className="w-full h-10 rounded-xl border border-sky-200 bg-white text-xs px-3 text-slate-800"
                          >
                            <option value="borewell">Underground Borewell</option>
                            <option value="municipal">Municipal Tap Water</option>
                            <option value="tanker">Mixed Tanker Water</option>
                          </select>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs h-11 rounded-xl shadow-md"
                      >
                        Confirm Free Doorstep Visit Slot
                      </Button>
                      <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-sky-600 inline shrink-0" />
                        <span>Your phone number is strictly confidential for appointment confirmation.</span>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Direct Manufacturer Quality Standards & Assurance */}
      <section className="py-16 bg-white border-b border-sky-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <Badge className="bg-sky-100 text-sky-800 border-sky-200 font-bold px-3 py-1 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>FACTORY-DIRECT QUALITY ASSURANCE</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
              Built With Integrity. Delivered Direct From Factory.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              We are committed to complete transparency: zero middleman commissions, certified food-grade materials, and live TDS demonstration at your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-sky-100 bg-gradient-to-b from-sky-50/40 to-white p-6 rounded-2xl shadow-xs hover:border-sky-300 transition-all">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Certified Multi-Stage Filtration</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Equipped with high-flow 100 GPD RO membranes that filter down to 0.0001 microns, eliminating heavy metals, arsenic, and bacteria. Stored in 100% food-grade non-toxic virgin ABS tanks.
                </p>
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Quality Standard</span>
                  <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 text-[11px] font-bold">
                    ISO 9001:2015 Tested
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-100 bg-gradient-to-b from-sky-50/40 to-white p-6 rounded-2xl shadow-xs hover:border-sky-300 transition-all">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Droplets className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Doorstep Live TDS Demonstration</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our certified technician tests raw inlet water TDS and pure output water directly in front of your eyes using a calibrated digital meter. Verify the sweet taste and mineral balance before sign-off.
                </p>
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Transparency</span>
                  <Badge variant="outline" className="bg-cyan-50 text-cyan-800 border-cyan-200 text-[11px] font-bold">
                    100% Live Proof
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-100 bg-gradient-to-b from-sky-50/40 to-white p-6 rounded-2xl shadow-xs hover:border-sky-300 transition-all">
              <CardContent className="p-0 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Wrench className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">1-Year Direct Brand Warranty</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every purifier includes zero-cost doorstep installation, complimentary pre-filter kit (₹1,499 value), and full 1-year comprehensive AMC service with direct factory engineer support.
                </p>
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Service Coverage</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] font-bold">
                    Zero-Cost On-Site AMC
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* National Certifications & Brand Trust Bar */}
      <section className="py-8 bg-sky-50/80 border-b border-sky-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-600 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-800">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              ISO 9001:2015 Quality Certified
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <Award className="h-4 w-4 text-sky-600" />
              Water Quality Association (WQA) Member
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              CE & RoHS Certified Components
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <Droplets className="h-4 w-4 text-sky-600" />
              100% Food-Grade Non-Toxic ABS
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Direct Indian Manufacturing
            </span>
          </div>
        </div>
      </section>

      {/* Professional Promotional Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-sky-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold">
                  <Droplets className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-extrabold text-xl text-white tracking-tight">PRAYAG</span>
                  <span className="bg-sky-600 text-white font-black text-xs px-1.5 py-0.5 rounded ml-1">RO</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                PRAYAG RO is India's premier manufacturer and distributor of multi-stage Copper & Alkaline drinking water purification systems. Ensuring pure, mineral-dense hydration for healthier homes.
              </p>
              <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-amber-400" />
                  <span>Helpline / Service: <strong>+91 9140967681</strong> (9 AM - 9 PM)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-sky-400" />
                  <span>Support: support@prayagro.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Store & Service Desk: PRAYAG RO, 31/3B Rajrooppur, Prayagraj, UP - 211011, India</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm uppercase tracking-wider">Purifiers</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Copper + Alkaline RO</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Under-Sink Purifiers</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Smart Digital TDS Models</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Commercial RO Systems</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Replacement Filter Cartridges</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm uppercase tracking-wider">Customer Care</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/services" className="hover:text-white transition-colors">Book RO Service / Repair</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Annual Maintenance (AMC)</Link></li>
                <li><Link to="/track-order" className="hover:text-white transition-colors">Track Shipment</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Locate Nearest Service Center</Link></li>
              </ul>
            </div>

            {/* Legal & Trust */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-sm uppercase tracking-wider">Trust & Policies</h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Warranty & Return Policy</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Certifications</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} PRAYAG RO. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for Pure Indian Homes</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
