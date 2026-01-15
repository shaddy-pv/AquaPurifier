import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  // Mock products data
  const products = [
    {
      id: "1",
      name: "AquaPure Pro Max 9L RO Water Purifier",
      price: 18999,
      originalPrice: 24999,
      image: product1,
      rating: 4.5,
      reviews: 2847,
      features: ["9-Stage Purification", "Mineral Retention", "UV + UF Technology"]
    },
    {
      id: "2", 
      name: "AquaPure Under-Sink Compact RO System",
      price: 12999,
      originalPrice: 16999,
      image: product2,
      rating: 4.3,
      reviews: 1923,
      features: ["Space-Saving Design", "6-Stage Filtration", "Auto-Flush Technology"]
    },
    {
      id: "3",
      name: "AquaPure Smart Connect WiFi Water Purifier",
      price: 25999,
      originalPrice: 32999,
      image: product1,
      rating: 4.7,
      reviews: 1567,
      features: ["WiFi Connectivity", "Smart App Control", "Real-time Monitoring"]
    },
    {
      id: "4",
      name: "AquaPure Essential 7L RO Water Purifier",
      price: 14999,
      originalPrice: 19999,
      image: product2,
      rating: 4.2,
      reviews: 3421,
      features: ["7-Stage Purification", "Energy Efficient", "Compact Design"]
    },
    {
      id: "5",
      name: "AquaPure Premium 12L RO + UV System",
      price: 22999,
      originalPrice: 28999,
      image: product1,
      rating: 4.6,
      reviews: 987,
      features: ["12L Storage", "RO + UV + UF", "Touch Display"]
    },
    {
      id: "6",
      name: "AquaPure Commercial Grade 15L System",
      price: 35999,
      originalPrice: 42999,
      image: product2,
      rating: 4.4,
      reviews: 543,
      features: ["High Capacity", "Commercial Grade", "Dual Membrane"]
    }
  ];

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
          case "25k-35k":
            return product.price >= 25000 && product.price <= 35000;
          case "above-35k":
            return product.price > 35000;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (minRating !== "all") {
      const rating = parseFloat(minRating);
      filtered = filtered.filter(product => product.rating >= rating);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return parseInt(b.id) - parseInt(a.id);
        case "popularity":
        default:
          return b.reviews - a.reviews;
      }
    });

    return filtered;
  }, [products, searchQuery, priceRange, minRating, sortBy]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Premium Water Purifiers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of advanced RO water purification systems designed for pure, healthy water
          </p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 border-0 shadow-soft bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search water purifiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-muted"
                />
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-background/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-40 bg-background/50">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-15k">Under ₹15,000</SelectItem>
                    <SelectItem value="15k-25k">₹15,000 - ₹25,000</SelectItem>
                    <SelectItem value="25k-35k">₹25,000 - ₹35,000</SelectItem>
                    <SelectItem value="above-35k">Above ₹35,000</SelectItem>
                  </SelectContent>
                </Select>

                {/* Rating Filter */}
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="w-40 bg-background/50">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5★ & above</SelectItem>
                    <SelectItem value="4.0">4.0★ & above</SelectItem>
                    <SelectItem value="3.5">3.5★ & above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange("all");
                  setMinRating("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all shadow-soft hover:shadow-premium"
          >
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;