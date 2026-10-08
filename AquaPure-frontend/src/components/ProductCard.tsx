import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ShoppingCart, Heart, ShieldCheck, Wrench } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import ProductQuickView from "./ProductQuickView";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  features?: string[];
  tag?: string;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  features = [],
  tag
}: ProductCardProps) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    toast.success("Added to Cart!", {
      description: `${name} has been added to your shopping bag.`,
    });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({ id, name, price, image });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border border-sky-100/90 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl flex flex-col h-full">
        <div className="relative overflow-hidden bg-gradient-to-b from-sky-50/50 to-white p-3 aspect-square flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {discount > 0 && (
              <span className="bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-xs tracking-wider">
                SAVE {discount}%
              </span>
            )}
            {tag && (
              <span className="bg-sky-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs uppercase">
                {tag}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 shadow-sm rounded-full backdrop-blur-xs"
              onClick={handleWishlistToggle}
              aria-label="Wishlist"
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 hover:text-sky-600 shadow-sm rounded-full backdrop-blur-xs"
              onClick={() => setShowQuickView(true)}
              aria-label="Quick View"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Certified Quality & Assurance Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>Certified RO Components</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              100% Food-Grade Virgin ABS
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${id}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug mb-2">
              {name}
            </h3>
          </Link>

          {/* Promotional Value Add: Free Installation */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mb-3 bg-emerald-50/70 border border-emerald-100 px-2 py-1 rounded-lg">
            <Wrench className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate">Free Doorstep Installation Included</span>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <ul className="text-xs text-slate-600 mb-4 space-y-1.5 flex-1">
              {features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-2 shrink-0"></div>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price & Savings */}
          <div className="pt-2 border-t border-slate-100 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Includes all taxes • 1-Year Comprehensive Warranty
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-sky-200 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl font-semibold text-xs h-9"
              asChild
            >
              <Link to={`/product/${id}`}>
                View Details
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-sm h-9 gap-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductQuickView
        open={showQuickView}
        onOpenChange={setShowQuickView}
        product={{ id, name, price, originalPrice, image, rating, reviews, features }}
      />
    </>
  );
};

export default ProductCard;