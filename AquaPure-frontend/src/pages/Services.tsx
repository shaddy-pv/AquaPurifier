import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AirVent,
  Waves,
  Zap,
  Flame,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Wrench
} from "lucide-react";
import { services } from "@/lib/services";

const iconMap: Record<string, any> = {
  AirVent,
  Waves,
  Microwave: Wrench,
  Zap,
  Refrigerator: Wrench,
  Flame
};

const Services = () => {
  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Certified Technicians",
      description: "Trained and verified professionals"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Same Day Service",
      description: "Quick response and resolution"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Quality Guarantee",
      description: "30-day service warranty"
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "All Brands",
      description: "Support for all major brands"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Home Services
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Professional{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Home Services
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert repair and maintenance services for all your home appliances. 
            Book instantly via WhatsApp and get same-day service.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of professional home services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              
              return (
                <Card 
                  key={service.id}
                  className="group border-0 shadow-soft hover:shadow-premium transition-all bg-card/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-premium transition-all"
                      asChild
                    >
                      <Link to={`/services/${service.slug}`}>
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contact us directly on WhatsApp for instant booking and support
            </p>
            <Button 
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={() => window.open("https://wa.me/919598353650", "_blank")}
            >
              <Waves className="mr-2 h-5 w-5" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
