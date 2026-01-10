import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Eye, ShoppingCart, Heart } from "lucide-react";
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
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  features = []
}: ProductCardProps) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    toast.success("Added to cart!", {
      description: `${name} has been added to your cart.`,
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
      <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-premium transition-all duration-300 bg-card/80 backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm font-medium">
            -{discount}%
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0"
            onClick={() => setShowQuickView(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">({reviews})</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        {features.length > 0 && (
          <ul className="text-sm text-muted-foreground mb-3 space-y-1">
            {features.slice(0, 2).map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            asChild
          >
            <Link to={`/product/${id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-primary hover:shadow-premium transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
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