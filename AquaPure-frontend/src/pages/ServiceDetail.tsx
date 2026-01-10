import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AirVent,
  Waves,
  Zap,
  Flame,
  CheckCircle,
  Clock,
  Shield,
  ArrowLeft,
  Calendar,
  Wrench
} from "lucide-react";
import { getServiceBySlug } from "@/lib/services";
import { openWhatsAppBooking, type BookingData } from "@/lib/whatsapp";
import Breadcrumbs from "@/components/Breadcrumbs";

const iconMap: Record<string, any> = {
  AirVent,
  Waves,
  Microwave: Wrench,
  Zap,
  Refrigerator: Wrench,
  Flame
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    timeSlot: "",
    notes: ""
  });

  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "12:00 PM - 3:00 PM",
    "3:00 PM - 6:00 PM",
    "6:00 PM - 9:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    const bookingData: BookingData = {
      serviceName: service.name,
      date: formData.date,
      timeSlot: formData.timeSlot,
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      notes: formData.notes
    };

    openWhatsAppBooking(bookingData);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Button asChild>
            <Link to="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Wrench;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <div>
            <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm mb-6">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <IconComponent className="h-12 w-12 text-primary" />
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>

                <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
                <p className="text-muted-foreground text-lg mb-6">
                  {service.description}
                </p>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">What We Offer:</h3>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Benefits */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Certified Experts</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Same Day Service</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">30-Day Warranty</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm sticky top-24">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Book This Service</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter your name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="bg-background/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Service Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-background/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-background/50"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeSlot">Time Slot *</Label>
                      <select
                        id="timeSlot"
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific requirements or issues"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book via WhatsApp
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to WhatsApp to confirm your booking
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
