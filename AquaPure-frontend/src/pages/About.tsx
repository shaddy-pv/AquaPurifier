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
    { label: "Direct Factory Pricing", value: "Zero Middlemen", icon: Award },
    { label: "Filtration Precision", value: "0.0001 µm", icon: Target },
    { label: "Tank Material", value: "Food-Grade ABS", icon: Shield },
    { label: "Direct Brand Warranty", value: "1-Year On-Site", icon: CheckCircle }
  ];

  const values = [
    {
      icon: <Droplets className="h-8 w-8 text-primary" />,
      title: "Purity First",
      description: "We never compromise on water quality. Every purifier is tested to eliminate heavy metals, dissolved salts, and bacteria."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Direct Customer Care",
      description: "Your family's health is our top priority. We provide direct factory engineer support and rapid 24-48 hr service dispatch."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Eco Recovery Tech",
      description: "High-recovery RO membranes designed to minimize water rejection while maintaining optimal mineral levels."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Certified Components",
      description: "Assembled exclusively with ISO 9001 tested parts, NSF standard membranes, and non-toxic virgin ABS plastic tanks."
    }
  ];

  const commitments = [
    { step: "01", title: "Direct Factory Model", desc: "We eliminate retail layers, dealer commissions, and bloated advertising overhead, giving you premium copper-alkaline technology at honest manufacturer rates." },
    { step: "02", title: "Heavy-Duty Component Engineering", desc: "Every PRAYAG RO model uses high-grade 100 GPD membranes and industrial booster pumps engineered to handle challenging borewell TDS up to 2,000 PPM." },
    { step: "03", title: "Live Doorstep Purity Verification", desc: "Our installation technician tests your raw water TDS and purified water TDS with a calibrated digital meter before you sign off on the installation." },
    { step: "04", title: "Comprehensive 1-Year On-Site AMC", desc: "Complete peace of mind with free doorstep installation, complimentary pre-filter kit worth ₹1,499, and comprehensive 12-month service warranty." }
  ];

  const certifications = [
    "ISO 9001:2015 Quality Tested",
    "NSF Standard RO Membrane",
    "Water Quality Association (WQA) Member",
    "100% Food-Grade Virgin ABS Tank",
    "CE & RoHS Certified Electricals"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            About PRAYAG RO
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Pioneering Pure Mineral Water Solutions{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Across India
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are dedicated to bringing pure, mineral-dense, copper-alkaline hydration to every Indian household. 
            With 10-stage purification technology and uncompromising standards, PRAYAG RO is your family's trusted health partner.
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
                PRAYAG RO was born with a single noble mission: "शुद्ध जल, स्वस्थ जीवन" • ensuring every family 
                enjoys 100% safe, chemical-free, and mineral-enriched drinking water. Recognizing the wide variance 
                in groundwater TDS across Indian cities and towns, our engineers developed multi-stage systems tailored 
                to ground borewells, municipal supply, and tanker water.
              </p>
              <p>
                Assembled directly in our Indian manufacturing facilities, every PRAYAG RO unit combines 
                10-stage reverse osmosis with vital Ayurvedic copper, zinc, and natural alkaline minerals, 
                supported by our 24-48 hour doorstep installation and service promise.
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

      {/* Founding Principles & Commitments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Founding Principles & Quality Promise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              How we deliver direct factory pricing without compromising on water purity
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {commitments.map((commitment, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-700 flex-shrink-0 text-sm">
                      {commitment.step}
                    </div>
                    {index < commitments.length - 1 && (
                      <div className="w-0.5 h-full bg-sky-200 mt-2"></div>
                    )}
                  </div>
                  <Card className="flex-1 border-0 shadow-soft bg-card/80 backdrop-blur-sm mb-6">
                    <CardContent className="p-6">
                      <div className="text-lg font-bold text-slate-900 mb-1.5">{commitment.title}</div>
                      <p className="text-sm text-slate-600 leading-relaxed">{commitment.desc}</p>
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
                Join the PRAYAG RO Family
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Experience the natural taste of pure, copper-infused alkaline water. Explore our certified purifiers today.
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
