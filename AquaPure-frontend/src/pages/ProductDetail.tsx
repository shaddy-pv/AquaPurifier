import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Droplets, 
  Award,
  ArrowLeft,
  Wrench,
  Phone
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import ProductQA from "@/components/ProductQA";
import SEO from "@/components/SEO";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { api } from "@/lib/api";
import { toast } from "sonner";

import prayagHeroImg from "@/assets/prayag-hero.jpg";
import prayagCopperImg from "@/assets/prayag-copper.jpg";
import prayagGrandImg from "@/assets/prayag-grand.jpg";

interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  images: string[];
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  description: string;
}

const DEFAULT_PRODUCTS: Record<string, ProductData> = {
  "1": {
    id: "1",
    name: "PRAYAG RO Copper & Zinc Alkaline 10L Purifier",
    price: 14999,
    originalPrice: 22999,
    rating: 4.9,
    reviews: 3420,
    images: [prayagCopperImg, prayagHeroImg, prayagGrandImg],
    inStock: true,
    features: [
      "10-Stage Active Purification Process",
      "Active Copper & Zinc Mineral Enrichment",
      "Natural Alkaline pH 8.0 - 8.5 Balancer",
      "In-Tank Continuous UV LED Sterilization",
      "10 Liters Food-Grade Anti-Bacterial Tank",
      "TDS Balance Controller for High-Salinity Borewells"
    ],
    specifications: {
      "Storage Capacity": "10 Liters Tank",
      "Purification Technology": "RO + UV + UF + Alkaline + Copper Charge",
      "Filtration Stages": "10 Active Barrier Stages",
      "Applicable Water TDS": "Up to 2,000 PPM",
      "TDS Reduction Rate": "95% - 98%",
      "Power Consumption": "50 Watts (Energy Saver)",
      "Tank Material": "100% Food-Grade Virgin ABS Plastic",
      "Country of Origin": "India",
      "Generic Name": "Household Water Purifier (RO+UV+UF+Alkaline)",
      "Net Quantity": "1 Unit (Includes Purifier, Pre-Filter Kit, Installation Kit, Warranty Card)",
      "Manufacturer & Packer": "PRAYAG RO Appliances, 31/3B Rajrooppur, Prayagraj, UP - 211011",
      "HSN / Tariff Code": "84212190",
      "Customer Helpline": "Helpline: +91 9140967681 | support@prayagro.com",
      "Warranty": "1-Year Comprehensive Zero-Cost On-Site AMC"
    },
    description: "The flagship PRAYAG RO Copper & Zinc Alkaline purifier combines cutting-edge 10-stage reverse osmosis with traditional Ayurvedic copper benefits. It neutralizes water acidity by restoring alkaline minerals (pH 8.0 - 8.5) and infuses immune-boosting copper and zinc into every sip. Comes with a complimentary pre-filter kit and free expert doorstep installation."
  },
  "2": {
    id: "2",
    name: "PRAYAG RO Grand 10L Multi-Stage Wall Mount",
    price: 11499,
    originalPrice: 17999,
    rating: 4.8,
    reviews: 2150,
    images: [prayagGrandImg, prayagCopperImg, prayagHeroImg],
    inStock: true,
    features: [
      "High-Flow RO + UV + UF Triple Defense",
      "Transparent 10L Water Level Window",
      "Zero-Drip Chrome Dispenser Faucet",
      "Auto Membrane Flushing Technology",
      "Energy Efficient 40W Pump"
    ],
    specifications: {
      "Storage Capacity": "10 Liters",
      "Purification Technology": "RO + UV + UF + TDS Balance",
      "Filtration Stages": "8 Stages",
      "Applicable Water TDS": "Up to 1,500 PPM",
      "Power Consumption": "45 Watts",
      "Country of Origin": "India",
      "Generic Name": "Household Water Purifier (RO+UV+UF)",
      "Net Quantity": "1 Unit (Includes Purifier, Pre-Filter Kit, Installation Kit, Warranty Card)",
      "Manufacturer & Packer": "PRAYAG RO Appliances, 31/3B Rajrooppur, Prayagraj, UP - 211011",
      "HSN / Tariff Code": "84212190",
      "Customer Helpline": "Helpline: +91 9140967681 | support@prayagro.com",
      "Warranty": "1 Year Comprehensive On-Site AMC"
    },
    description: "Designed for compact modern kitchens, the PRAYAG RO Grand features a panoramic water tank display and an ergonomic dispenser faucet. Its multi-stage purification removes 99.9% bacteria, dissolved salts, and impurities while retaining essential minerals."
  },
  "3": {
    id: "3",
    name: "PRAYAG RO Smart Touch Pro with Live TDS Display",
    price: 16999,
    originalPrice: 25999,
    rating: 4.9,
    reviews: 1890,
    images: [prayagHeroImg, prayagCopperImg, prayagGrandImg],
    inStock: true,
    features: [
      "Real-Time Digital TDS Display",
      "In-Tank Continuous UV LED Disinfection",
      "Filter Life Telemetry & Replacement Alerts",
      "Dual Dispense Mode (Ambient & Chilled Ready)",
      "Ultra-Modern Sleek Countertop / Wall-Mount Design"
    ],
    specifications: {
      "Storage Capacity": "10 Liters Storage + Digital Gauge",
      "Purification Technology": "Smart RO + UV LED + Alkaline + Active Carbon",
      "Filtration Stages": "10 Stages",
      "Applicable Water TDS": "Up to 2,500 PPM",
      "Power Consumption": "60 Watts",
      "Country of Origin": "India",
      "Generic Name": "Household Water Purifier (Smart Touch RO+UV+Alkaline)",
      "Net Quantity": "1 Unit (Includes Purifier, Pre-Filter Kit, Installation Kit, Warranty Card)",
      "Manufacturer & Packer": "PRAYAG RO Appliances, 31/3B Rajrooppur, Prayagraj, UP - 211011",
      "HSN / Tariff Code": "84212190",
      "Customer Helpline": "Helpline: +91 9140967681 | support@prayagro.com",
      "Warranty": "1-Year Comprehensive Zero-Cost On-Site AMC"
    },
    description: "Experience total peace of mind with PRAYAG RO Smart Touch Pro. The built-in digital display reveals your incoming and purified drinking water TDS in real-time, proving water purity with every glass you pour."
  }
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductData>(() => DEFAULT_PRODUCTS[id || "1"] || DEFAULT_PRODUCTS["1"]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  useEffect(() => {
    if (!id) return;

    if (DEFAULT_PRODUCTS[id]) {
      setProduct(DEFAULT_PRODUCTS[id]);
      setSelectedImage(0);
      return;
    }

    api.products.getById(id)
      .then((data) => {
        if (!data) return;
        const specs: Record<string, string> = {};
        if (data.specifications && typeof data.specifications === 'object') {
          Object.assign(specs, data.specifications);
        }
        if (Object.keys(specs).length === 0) {
          specs["Technology"] = "RO + UV + Alkaline + Copper";
          specs["Warranty"] = "1 Year Comprehensive Zero-Cost AMC";
          specs["Installation"] = "Free Doorstep Installation by Certified Engineer";
        }

        const fallbackImgs = [prayagCopperImg, prayagGrandImg, prayagHeroImg];
        const images = (data.images && data.images.length > 0 && !data.images[0].includes('placeholder'))
          ? data.images
          : fallbackImgs;

        setProduct({
          id: data.id || data._id || id,
          name: data.name.replace(/AquaPure/gi, "PRAYAG RO"),
          price: data.price,
          originalPrice: data.originalPrice || Math.round(data.price * 1.35),
          rating: data.rating || 4.8,
          reviews: data.reviewCount || 140,
          images,
          inStock: data.stock > 0,
          features: data.features?.length > 0 ? data.features : [
            "10-Stage Active Purification",
            "Active Copper & Zinc Infusion",
            "Free Doorstep Installation Included"
          ],
          specifications: specs,
          description: data.description || "State-of-the-art PRAYAG RO purifier providing 100% pure, healthy and mineral-rich drinking water for Indian homes."
        });
        setSelectedImage(0);
      })
      .catch((err) => {
        console.warn("Could not fetch product detail from API, using fallback data:", err.message);
      });
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || prayagCopperImg,
      });
    }
    toast.success("Added to Cart!", {
      description: `${quantity}x ${product.name} added to your shopping cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || prayagCopperImg,
      });
      toast.success("Added to wishlist!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on PRAYAG RO!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const relatedProducts = [
    {
      id: "2",
      name: "PRAYAG RO Grand 10L Multi-Stage Wall Mount",
      price: 11499,
      originalPrice: 17999,
      image: prayagGrandImg,
      rating: 4.8,
      reviews: 2150,
      features: ["High-Flow RO + UV + UF", "Transparent Tank", "Free Installation"]
    },
    {
      id: "3",
      name: "PRAYAG RO Smart Touch Pro with Live TDS Display",
      price: 16999,
      originalPrice: 25999,
      image: prayagHeroImg,
      rating: 4.9,
      reviews: 1890,
      features: ["Live Digital TDS Display", "In-Tank UV LED", "WiFi Connectivity"]
    }
  ];

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <SEO
        title={`${product.name} • PRAYAG RO Official Store`}
        description={product.description.slice(0, 160)}
        keywords={`${product.name}, PRAYAG RO, best ro water purifier, copper alkaline purifier`}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild className="text-slate-600 hover:text-sky-600 gap-1.5 text-xs font-semibold">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Purifiers</span>
            </Link>
          </Button>

          <a href="tel:+919140967681" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-100/70 px-3 py-1.5 rounded-full hover:bg-sky-200 transition-colors">
            <Phone className="h-3.5 w-3.5 text-sky-600" />
            <span>Need advice? Call Helpline: +91 9140967681</span>
          </a>
        </div>

        {/* Main Product Display Card */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-md p-6 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Product Images */}
            <div className="lg:col-span-6 space-y-4">
              <div 
                className="relative bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-sky-100 p-6 flex items-center justify-center overflow-hidden cursor-zoom-in aspect-square shadow-sm"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[selectedImage] || prayagCopperImg}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={
                    isZoomed
                      ? {
                          transform: "scale(2)",
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }
                      : {}
                  }
                />

                {/* Badges on Main Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  {discount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                      SAVE {discount}% OFF
                    </span>
                  )}
                  <span className="bg-sky-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    AUTHENTIC PRAYAG RO
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-20 w-20 rounded-xl border-2 p-1.5 bg-sky-50/40 shrink-0 transition-all ${
                      selectedImage === idx
                        ? "border-sky-600 ring-2 ring-sky-300 shadow-sm"
                        : "border-sky-100 hover:border-sky-300"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 text-xs font-semibold py-0.5">
                    Direct Factory Supply
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-0.5">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    In Stock for Immediate Dispatch
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">Prayagraj Doorstep Delivery</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  Multi-Stage Active Purification with Ayurvedic Copper & Zinc Enrichment
                </p>
              </div>

              {/* Price & Festive Savings */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-sky-50/50 to-white border border-sky-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    You Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Inclusive of all taxes • No Cost EMI starting from ₹1,250/month
                </p>
              </div>

              {/* Free Benefits Included (Value Add) */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Free Bundled Benefits With This Order:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-800 font-semibold">
                    <Wrench className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Free Doorstep Installation (₹800 Value)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-sky-50/70 border border-sky-100 rounded-xl text-sky-800 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Free Pre-Filter Kit (₹1,499 Value)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-sky-50/70 border border-sky-100 rounded-xl text-sky-800 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>1-Year Zero-Cost AMC Service</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-800 font-semibold">
                    <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Express 24-48hr Home Delivery</span>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Purification Highlights:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-sky-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-sky-200 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-9 w-9 flex items-center justify-center font-bold text-slate-700 hover:bg-sky-50 rounded-l-xl"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-9 w-9 flex items-center justify-center font-bold text-slate-700 hover:bg-sky-50 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm h-12 rounded-2xl shadow-lg shadow-sky-600/20 gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Shopping Cart</span>
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-sky-200 hover:bg-sky-50 text-slate-700 rounded-2xl h-12 px-4"
                      onClick={handleToggleWishlist}
                    >
                      <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-sky-200 hover:bg-sky-50 text-slate-700 rounded-2xl h-12 px-4"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl h-10 gap-2"
                >
                  <a href="tel:+919140967681">
                    <Phone className="h-4 w-4 text-sky-600" />
                    <span>Order by Phone: +91 9140967681 (Direct Helpline)</span>
                  </a>
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Tabs: Description, Specs, Q&A, Reviews */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 sm:p-8 mb-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-12 bg-sky-50 p-1 rounded-2xl">
              <TabsTrigger value="specifications" className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm">
                Detailed Overview
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm">
                Customer Reviews
              </TabsTrigger>
              <TabsTrigger value="qa" className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm">
                Q&A & Assistance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3.5 rounded-xl bg-sky-50/40 border border-sky-100">
                    <span className="font-bold text-slate-800">{key}:</span>
                    <span className="text-slate-600 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="description" className="pt-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 text-xs text-slate-700 space-y-2">
                <h5 className="font-bold text-slate-900">Why choose PRAYAG RO multi-stage technology?</h5>
                <p>
                  Unlike standard purifiers that strip essential electrolytes, PRAYAG RO's patented mineral retention chamber balances calcium, magnesium, and natural alkaline minerals, ensuring pure hydration that supports daily vitality and digestion.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <ProductReviews productId={product.id} />
            </TabsContent>

            <TabsContent value="qa" className="pt-6">
              <ProductQA productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Purifiers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Other Popular PRAYAG RO Models
            </h3>
            <Link to="/products" className="text-xs font-bold text-sky-600 hover:underline">
              View All Purifiers →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;