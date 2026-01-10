import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Award, 
  Users, 
  Target,
  Heart,
  Shield,
  Leaf,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { label: "Happy Customers", value: "5M+", icon: Users },
    { label: "Years of Excellence", value: "15+", icon: Award },
    { label: "Service Centers", value: "500+", icon: Target },
    { label: "Products Sold", value: "10M+", icon: TrendingUp }
  ];

  const values = [
    {
      icon: <Droplets className="h-8 w-8 text-primary" />,
      title: "Purity First",
      description: "We never compromise on water quality. Every product undergoes rigorous testing to ensure 99.9% pure water."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer Care",
      description: "Your health and satisfaction are our top priorities. We provide 24/7 support and lifetime service."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Eco-Friendly",
      description: "Sustainable technology that saves water and energy while protecting the environment."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trust & Safety",
      description: "Certified by international standards with comprehensive warranties on all products."
    }
  ];

  const milestones = [
    { year: "2009", event: "AquaPure founded with a vision to provide pure water to every home" },
    { year: "2012", event: "Launched first RO water purifier with mineral retention technology" },
    { year: "2015", event: "Reached 1 million customers milestone across India" },
    { year: "2018", event: "Introduced smart WiFi-enabled water purifiers" },
    { year: "2021", event: "Expanded to 500+ service centers nationwide" },
    { year: "2024", event: "Serving 5M+ families with pure, healthy water" }
  ];

  const certifications = [
    "ISO 9001:2015 Certified",
    "NSF International Certified",
    "Water Quality Association Member",
    "BIS Certified Products",
    "Energy Star Rated"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            About AquaPure
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Pioneering Pure Water Solutions{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Since 2009
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make pure, healthy water accessible to every Indian household. 
            With cutting-edge technology and unwavering commitment to quality, we've become India's 
            most trusted water purifier brand.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="text-center border-0 shadow-soft hover:shadow-premium transition-all bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                AquaPure was born from a simple yet powerful vision: to ensure every Indian family 
                has access to pure, safe drinking water. Founded in 2009 by a team of water treatment 
                experts and engineers, we recognized the critical need for reliable water purification 
                solutions in India.
              </p>
              <p>
                What started as a small operation in Mumbai has grown into India's leading water 
                purifier brand, serving over 5 million families across the country. Our success is 
                built on three pillars: innovative technology, uncompromising quality, and exceptional 
                customer service.
              </p>
              <p>
                Today, we continue to push the boundaries of water purification technology, introducing 
                smart features, eco-friendly designs, and advanced filtration systems that not only 
                remove contaminants but also retain essential minerals for optimal health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="text-center border-0 shadow-soft hover:shadow-premium transition-all bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our mission to provide pure water
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/20 mt-2"></div>
                    )}
                  </div>
                  <Card className="flex-1 border-0 shadow-soft bg-card/80 backdrop-blur-sm mb-6">
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certifications & Standards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recognized and certified by leading international organizations
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm shadow-soft"
                >
                  <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="border-0 shadow-premium bg-gradient-hero text-white overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Join the AquaPure Family
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Experience the difference of pure, healthy water. Explore our range of 
                advanced water purifiers designed for your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/products">
                    View Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
