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
  CheckCircle,
  Clock,
  Shield,
  ArrowLeft,
  Calendar,
  Wrench,
  Droplets,
  Settings2,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Sparkles,
  MapPin
} from "lucide-react";
import { getServiceBySlug } from "@/lib/services";
import { openWhatsAppBooking, type BookingData } from "@/lib/whatsapp";
import Breadcrumbs from "@/components/Breadcrumbs";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AirVent,
  Waves,
  Zap,
  Wrench,
  Droplets,
  Settings2,
  ShieldCheck
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
    "9:00 AM - 12:00 PM (Morning)",
    "12:00 PM - 3:00 PM (Afternoon)",
    "3:00 PM - 6:00 PM (Evening)",
    "6:00 PM - 8:30 PM (Late Slot)"
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
      notes: `${formData.notes || ""}${!service.isRoService ? " [Customer acknowledges potential non-RO service delay]" : ""}`
    };

    openWhatsAppBooking(bookingData);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-slate-900">Service Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">
            The requested service could not be found or has been updated.
          </p>
          <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
            <Link to="/services">Back to All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Wrench;
  const isRo = service.isRoService;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900" asChild>
            <Link to="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>

          {/* Quick Call Button */}
          <Button
            size="sm"
            asChild
            className="bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 font-bold text-xs rounded-xl gap-1.5"
          >
            <a href="tel:+919140967681">
              <Phone className="h-3.5 w-3.5 text-sky-600" />
              <span>Call Helpline: +91 9140967681</span>
            </a>
          </Button>
        </div>

        {/* NON-RO DELAY NOTICE BANNER (Displayed only on non-RO services) */}
        {!isRo && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-amber-900 mb-0.5">
                Notice: Service Visit May Experience Delays (Non-Core Specialty)
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Is service ke technician aane mein thoda delay ho sakta hai kyunki hamari primary expertise RO Water Purifiers mein hai. (Service visits may experience delays as this is outside our primary RO water purification expertise. We appreciate your patience!)
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Details */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${
                    isRo ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    <IconComponent className="h-10 w-10" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant="secondary" className="font-bold text-xs">
                      {service.category}
                    </Badge>
                    {isRo ? (
                      <Badge className="bg-sky-600 text-white border-0 text-[10px] font-bold">
                        Core RO Specialty
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-[10px]">
                        Delay Possible
                      </Badge>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                  {service.name}
                </h1>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Priority Dispatch Reassurance (Only for RO) */}
                {isRo && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-emerald-950">Fast 24-48h Doorstep Response</h4>
                      <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                        Priority technician dispatch in Prayagraj. Equipped with digital TDS meters, NSF/ISO compliant parts, and 30-day service warranty.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-base text-slate-900">What This Service Covers:</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle className={`h-4 w-4 mr-2.5 mt-0.5 shrink-0 ${
                          isRo ? "text-sky-600" : "text-slate-500"
                        }`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Highlights / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-sky-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-900">Verified Technicians</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Trained & Identity Checked</p>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-sky-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-900">
                    {isRo ? "24-48h Doorstep" : "3-5 Days Schedule"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isRo ? "Fast Prayagraj Dispatch" : "Subject to slots"}
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-sky-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-900">30-Day Guarantee</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Service Re-visit Promise</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Direct Booking Form */}
          <div className="lg:col-span-5">
            <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white p-5">
                <h2 className="text-lg font-bold">Book Doorstep Appointment</h2>
                <p className="text-xs text-sky-100 mt-0.5">
                  Confirm your details below to schedule via WhatsApp or Call
                </p>
              </div>

              <CardContent className="p-6">
                {/* Notice for non-RO right in form */}
                {!isRo && (
                  <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Please note: Visit date may have a slight delay for non-RO items.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerName" className="text-xs font-bold text-slate-700">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="rounded-xl border-slate-200 text-xs h-10"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. 9140967681"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl border-slate-200 text-xs h-10"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. ramesh@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl border-slate-200 text-xs h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-slate-700">Complete Address in Prayagraj *</Label>
                    <Textarea
                      id="address"
                      placeholder="House No., Street, Landmark, Area (e.g. Rajrooppur / Civil Lines / Katra), Prayagraj"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-xl border-slate-200 text-xs min-h-[70px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-xs font-bold text-slate-700">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="rounded-xl border-slate-200 text-xs h-10"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="timeSlot" className="text-xs font-bold text-slate-700">Preferred Time Slot *</Label>
                      <select
                        id="timeSlot"
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      >
                        <option value="">Select slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Purifier Brand / Problem Details</Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g. PRAYAG RO / Kent, water leaking from bottom, continuous beep"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="rounded-xl border-slate-200 text-xs min-h-[60px]"
                    />
                  </div>

                  {/* Submit via WhatsApp */}
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl text-sm h-11 shadow-sm gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Book via WhatsApp (+91 9140967681)
                  </Button>

                  {/* Direct Dial Alternative */}
                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-slate-400 mb-2">Or connect instantly via phone call</p>
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="w-full border-sky-300 text-sky-800 hover:bg-sky-50 font-bold rounded-xl text-xs h-10 gap-2"
                    >
                      <a href="tel:+919140967681">
                        <Phone className="h-4 w-4 text-sky-600" />
                        Call Technician Directly: 9140967681
                      </a>
                    </Button>
                  </div>
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
