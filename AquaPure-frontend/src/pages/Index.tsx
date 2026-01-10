import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { 
  ArrowRight, 
  Shield, 
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
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-purifier.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

const Index = () => {
  const featuredProducts = [
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
      name: "AquaPure Smart Connect WiFi System",
      price: 25999,
      originalPrice: 32999,
      image: product1,
      rating: 4.7,
      reviews: 1567,
      features: ["WiFi Connectivity", "Smart App Control", "Real-time Monitoring"]
    }
  ];

  const benefits = [
    {
      icon: <Droplets className="h-8 w-8 text-primary" />,
      title: "99.9% Pure Water",
      description: "Advanced RO technology removes all harmful contaminants while retaining essential minerals"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Energy Efficient",
      description: "Smart power management reduces electricity consumption by up to 50%"
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Easy Installation",
      description: "Professional installation service included with free maintenance for 1 year"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Comprehensive Warranty",
      description: "1-year comprehensive warranty with 3-year membrane protection guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      comment: "The water taste has improved dramatically! My family loves the pure, clean water. Installation was quick and professional.",
      avatar: "PS"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      rating: 5,
      comment: "Best investment for our home. The smart features and mobile app make it so convenient to monitor water quality.",
      avatar: "RK"
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad, Gujarat",
      rating: 4,
      comment: "Excellent build quality and great customer service. The minerals in the water are perfectly balanced.",
      avatar: "AP"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Premium Water Purifiers - Pure Water, Pure Health"
        description="India's #1 water purifier brand. Advanced RO technology for pure, safe, and mineral-rich water. Free installation, 1-year warranty. Shop now!"
        keywords="water purifier, RO water purifier, water filter, aquapure, water purification, drinking water"
        type="website"
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  ✨ India's #1 Water Purifier Brand
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Pure Water,{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Pure Health
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience the ultimate in water purification with our advanced RO technology. 
                  Clean, safe, and mineral-rich water for your family's health and wellbeing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-floating transition-all group"
                  asChild
                >
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Expert
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5M+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Purity Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <img
                src={heroImage}
                alt="Premium RO Water Purifier"
                className="relative z-10 w-full h-auto rounded-2xl shadow-floating"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our best-selling water purifiers designed for every home and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all"
              asChild
            >
              <Link to="/products">
                View All Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose AquaPure?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets uncompromising quality for the purest water experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group text-center border-0 shadow-soft hover:shadow-premium transition-all duration-300 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join millions of satisfied customers who trust AquaPure for their water needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="border-0 shadow-soft hover:shadow-premium transition-all duration-300 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Quote className="h-8 w-8 text-primary/20" />
                  
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready for Pure, Healthy Water?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get expert consultation and find the perfect water purifier for your home today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-floating transition-all group"
                asChild
              >
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Get Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/90 backdrop-blur-sm border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <Droplets className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AquaPure
                </span>
              </Link>
              <p className="text-muted-foreground">
                India's leading water purifier brand, committed to providing pure, safe, and healthy water for every home.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Award className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Products</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/products" className="hover:text-primary transition-colors">RO Water Purifiers</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">UV Water Purifiers</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Alkaline Purifiers</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Commercial Systems</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/support" className="hover:text-primary transition-colors">Customer Service</Link></li>
                <li><Link to="/warranty" className="hover:text-primary transition-colors">Warranty</Link></li>
                <li><Link to="/installation" className="hover:text-primary transition-colors">Installation</Link></li>
                <li><Link to="/maintenance" className="hover:text-primary transition-colors">Maintenance</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1800-123-AQUA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@aquapure.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Available Pan India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 AquaPure. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
