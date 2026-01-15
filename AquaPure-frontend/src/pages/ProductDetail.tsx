import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Shield, 
  Truck, 
  RotateCcw,
  CheckCircle,
  Droplets,
  Zap,
  Award
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import ProductQA from "@/components/ProductQA";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Mock product data
  const product = {
    id: "1",
    name: "AquaPure Pro Max 9L RO Water Purifier",
    price: 18999,
    originalPrice: 24999,
    rating: 4.5,
    reviews: 2847,
    images: [product1, product2, product1],
    inStock: true,
    features: [
      "9-Stage Advanced Purification Process",
      "Mineral Retention Technology",
      "UV + UF + RO Triple Protection",
      "9 Liters Storage Capacity",
      "Digital Display with Filter Alerts",
      "Energy Efficient Operation"
    ],
    specifications: {
      "Storage Capacity": "9 Liters",
      "Purification Technology": "RO + UV + UF",
      "Purification Stages": "9 Stages",
      "Power Consumption": "60 Watts",
      "Dimensions": "330 x 520 x 480 mm",
      "Weight": "12.5 kg",
      "Warranty": "1 Year Comprehensive + 3 Years on RO Membrane"
    },
    description: "The AquaPure Pro Max features advanced 9-stage purification that removes all harmful contaminants while retaining essential minerals. With UV sterilization and UF membrane, it ensures 100% safe drinking water for your family."
  };

  const relatedProducts = [
    {
      id: "2",
      name: "AquaPure Under-Sink Compact RO System",
      price: 12999,
      originalPrice: 16999,
      image: product2,
      rating: 4.3,
      reviews: 1923,
      features: ["Space-Saving Design", "6-Stage Filtration"]
    },
    {
      id: "3",
      name: "AquaPure Smart Connect WiFi System",
      price: 25999,
      originalPrice: 32999,
      image: product1,
      rating: 4.7,
      reviews: 1567,
      features: ["WiFi Connectivity", "Smart App Control"]
    }
  ];

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-premium bg-card/80 backdrop-blur-sm">
              <CardContent 
                className="p-0 relative cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover transition-transform duration-200"
                  style={
                    isZoomed
                      ? {
                          transform: "scale(2)",
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }
                      : {}
                  }
                />
              </CardContent>
            </Card>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary shadow-soft" 
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="destructive">-{discount}% OFF</Badge>
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  In Stock
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                <span className="text-2xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-gradient-primary hover:shadow-premium transition-all"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">1 Year Warranty</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12 border-0 shadow-soft bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                      <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-4 rounded-lg bg-muted/30">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ProductReviews productId={product.id} />
              </TabsContent>
              
              <TabsContent value="qa" className="mt-6">
                <ProductQA productId={product.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;