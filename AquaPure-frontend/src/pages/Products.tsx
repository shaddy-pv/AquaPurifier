import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShieldCheck, Wrench, Phone, Droplets, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";
import { usePromotionStore } from "@/store/promotionStore";

import prayagHeroImg from "@/assets/prayag-hero.jpg";
import prayagCopperImg from "@/assets/prayag-copper.jpg";
import prayagGrandImg from "@/assets/prayag-grand.jpg";

interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  tag?: string;
}

const FALLBACK_PRODUCTS: DisplayProduct[] = [
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
      "Active Copper + Zinc Mineral Infuser",
      "Optimal Alkaline pH 8.0 - 8.5"
    ],
    tag: "Bestseller"
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
      "Zero-Waste Water Recovery"
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
      "In-Tank Continuous UV LED",
      "Mobile WiFi Purifier Telemetry"
    ],
    tag: "Smart Flagship"
  },
  {
    id: "4",
    name: "PRAYAG RO Under-Sink Compact Eco System",
    price: 12499,
    originalPrice: 18999,
    image: prayagGrandImg,
    rating: 4.7,
    reviews: 1420,
    features: [
      "Space-Saving Under-Counter Fit",
      "High-Pressure Hydro-Pneumatic Tank",
      "European Stainless Faucet Included"
    ],
    tag: "Space Saver"
  },
  {
    id: "5",
    name: "PRAYAG RO Premium 12L In-Tank UV + Alkaline",
    price: 18499,
    originalPrice: 27999,
    image: prayagCopperImg,
    rating: 4.8,
    reviews: 980,
    features: [
      "Massive 12 Liters Storage",
      "Ayurvedic Copper + Alkaline Boost",
      "TDS Balance Controller for Borewell"
    ],
    tag: "Large Family"
  },
  {
    id: "6",
    name: "PRAYAG RO Commercial Heavy-Duty 25L System",
    price: 28999,
    originalPrice: 42999,
    image: prayagHeroImg,
    rating: 4.7,
    reviews: 640,
    features: [
      "High Output 25L/hr Purification",
      "Dual Industrial Booster Pumps",
      "Ideal for Offices, Clinics & Cafes"
    ],
    tag: "Commercial"
  }
];

const Products = () => {
  const [products, setProducts] = useState<DisplayProduct[]>(FALLBACK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  const { catalogBanner, fetchPromotions } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    let isMounted = true;
    api.products.getAll()
      .then((data) => {
        if (!isMounted || !data?.products || data.products.length === 0) return;
        const normalized: DisplayProduct[] = data.products.map((p, idx) => {
          const imgList = [prayagCopperImg, prayagGrandImg, prayagHeroImg];
          const assignedImg = imgList[idx % imgList.length];
          return {
            id: p.id || p._id || String(idx + 1),
            name: p.name.replace(/AquaPure/gi, "PRAYAG RO"),
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.4),
            image: (p.images && p.images[0] && !p.images[0].includes("placeholder")) 
              ? p.images[0] 
              : assignedImg,
            rating: p.rating || 4.8,
            reviews: p.reviewCount || 120 + idx * 45,
            features: p.features || ["10-Stage RO Protection", "Active Copper Infusion", "Free Doorstep Installation"],
            tag: idx === 0 ? "Bestseller" : idx === 1 ? "Festive Deal" : "Verified Purity"
          };
        });
        setProducts(normalized);
      })
      .catch((err) => {
        console.warn("Could not fetch products from API, using fallback data:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(product => {
        switch (priceRange) {
          case "under-15k":
            return product.price < 15000;
          case "15k-25k":
            return product.price >= 15000 && product.price <= 25000;
          case "above-25k":
            return product.price > 25000;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (minRating !== "all") {
      const min = parseFloat(minRating);
      filtered = filtered.filter(product => product.rating >= min);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popularity":
        default:
          return b.reviews - a.reviews;
      }
    });

    return filtered;
  }, [products, searchQuery, sortBy, priceRange, minRating]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <SEO
        title="PRAYAG RO Products • Copper, Alkaline & Multi-Stage Water Purifiers"
        description="Explore the complete range of PRAYAG RO drinking water purifiers. Up to 40% OFF, free doorstep installation, free pre-filter kit, and 1-year comprehensive warranty."
        keywords="PRAYAG RO purifiers, buy RO purifier online, copper alkaline ro, water filter price india"
      />

      <div className="container mx-auto px-4">
        
        {/* Promotional Hero Banner on Products Page */}
        {catalogBanner?.enabled !== false && (
          catalogBanner?.bannerType === 'image' && catalogBanner?.imageUrl ? (
            <div className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-sky-100 relative group transition-all bg-sky-950 flex items-center justify-center">
              {catalogBanner.imageLink ? (
                <a href={catalogBanner.imageLink} className="block w-full">
                  <img 
                    src={catalogBanner.imageUrl} 
                    alt={catalogBanner.imageAlt || "PRAYAG RO Pure Water Purifier Offer"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/banners/banner-1.jpg';
                    }}
                    className="w-full h-auto max-h-[380px] object-contain rounded-3xl transition-transform duration-300 group-hover:scale-[1.01] block mx-auto" 
                  />
                </a>
              ) : (
                <img 
                  src={catalogBanner.imageUrl} 
                  alt={catalogBanner.imageAlt || "PRAYAG RO Pure Water Purifier Offer"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/banners/banner-1.jpg';
                  }}
                  className="w-full h-auto max-h-[380px] object-contain rounded-3xl block mx-auto" 
                />
              )}
            </div>
          ) : (
            <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-700 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-block bg-white/20 text-white border border-white/30 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {catalogBanner?.badgeText || "DIRECT FACTORY CATALOG • FLAT 40% OFF"}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {catalogBanner?.title || "PRAYAG RO Pure Water Purifier Catalog"}
                </h1>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  {catalogBanner?.description || (
                    <>Every PRAYAG RO model includes <strong>Free Doorstep Installation</strong>, <strong>Free Pre-Filter Kit worth ₹1,499</strong>, and <strong>1-Year Zero-Cost AMC Coverage</strong>.</>
                  )}
                </p>
              </div>

              {(catalogBanner?.stat1Value || catalogBanner?.stat2Value) && (
                <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-6 text-white text-xs font-bold">
                  {catalogBanner?.stat1Value && (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
                      <div className="text-2xl font-black text-amber-300">{catalogBanner.stat1Value}</div>
                      <div className="text-sky-100">{catalogBanner.stat1Label || "Max Discount"}</div>
                    </div>
                  )}
                  {catalogBanner?.stat2Value && (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
                      <div className="text-2xl font-black text-emerald-300">{catalogBanner.stat2Value}</div>
                      <div className="text-sky-100">{catalogBanner.stat2Label || "Installation"}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-sky-100 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by model name or feature (e.g. Copper, Alkaline, TDS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-sky-200 text-xs sm:text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px] h-11 rounded-xl border-sky-200 text-xs">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-15k">Under ₹15,000</SelectItem>
                  <SelectItem value="15k-25k">₹15k - ₹25,000</SelectItem>
                  <SelectItem value="above-25k">Above ₹25,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating Filter */}
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="w-[140px] h-11 rounded-xl border-sky-200 text-xs">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] h-11 rounded-xl border-sky-200 text-xs">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-50 text-xs">
            <span className="text-slate-400 font-medium">Quick Filters:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("Copper")}
              className={`rounded-lg h-7 text-xs border-sky-100 ${searchQuery === "Copper" ? "bg-sky-600 text-white" : ""}`}
            >
              Copper & Zinc
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("Alkaline")}
              className={`rounded-lg h-7 text-xs border-sky-100 ${searchQuery === "Alkaline" ? "bg-sky-600 text-white" : ""}`}
            >
              Alkaline pH 8.5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("TDS")}
              className={`rounded-lg h-7 text-xs border-sky-100 ${searchQuery === "TDS" ? "bg-sky-600 text-white" : ""}`}
            >
              Digital TDS Display
            </Button>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="h-7 text-xs text-red-500 hover:text-red-700"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredProducts.length}</strong> PRAYAG RO purifiers</span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Truck className="h-3.5 w-3.5 text-sky-600" />
            <span>Free Doorstep Delivery & Installation</span>
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-sky-100 p-8">
            <Droplets className="h-12 w-12 text-sky-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Purifiers Matched Your Criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter ranges to see all available PRAYAG RO models.
            </p>
            <Button 
              onClick={() => { setSearchQuery(""); setPriceRange("all"); setMinRating("all"); }}
              className="mt-4 bg-sky-600 text-white text-xs rounded-xl"
            >
              Reset All Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;