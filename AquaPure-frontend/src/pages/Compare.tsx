import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

const Compare = () => {
  const { items, removeItem, clearComparison } = useComparisonStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
    toast.success("Added to cart!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No Products to Compare</h2>
          <p className="text-muted-foreground mb-8">
            Add products to comparison from the products page
          </p>
          <Button size="lg" className="bg-gradient-primary" asChild>
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            Compare{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max">
            {items.map((item) => (
              <Card key={item.id} className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-8 w-8 p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-3 line-clamp-2">{item.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">{item.rating}</span>
                      </div>
                    </div>

                    {item.features && item.features.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Features</p>
                        <ul className="space-y-1">
                          {item.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-primary"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/product/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {items.length < 3 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              You can compare up to 3 products. Add more products to compare.
            </p>
            <Button variant="outline" asChild>
              <Link to="/products">Add More Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
