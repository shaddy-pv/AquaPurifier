import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone,
  Droplets,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Settings2,
  AirVent,
  Waves,
  Zap,
  Shield,
  MapPin
} from "lucide-react";
import { services } from "@/lib/services";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Droplets,
  Settings2,
  ShieldCheck,
  AirVent,
  Waves,
  Zap
};

const Services = () => {
  const [filter, setFilter] = useState<"all" | "ro" | "other">("all");

  const benefits = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-sky-600" />,
      title: "Certified RO Technicians",
      description: "Trained experts equipped with digital TDS meters"
    },
    {
      icon: <Clock className="h-5 w-5 text-sky-600" />,
      title: "24-48h Doorstep Response",
      description: "Fast visit across Prayagraj city and nearby areas"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-sky-600" />,
      title: "100% Genuine Spares",
      description: "Original certified RO membranes, filters, and pumps"
    },
    {
      icon: <Shield className="h-5 w-5 text-sky-600" />,
      title: "30-Day Service Warranty",
      description: "Post-service satisfaction guarantee on all RO fixes"
    }
  ];

  const filteredServices = services.filter((service) => {
    if (filter === "ro") return service.isRoService;
    if (filter === "other") return !service.isRoService;
    return true;
  });

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Section */}
      <section className="relative py-7 sm:py-9 bg-gradient-to-b from-sky-50/70 via-white to-background border-b border-sky-100 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-sky-600 text-white border-0 mb-2 px-3 py-0.5 font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-xs">
            Doorstep RO Care • Prayagraj
          </Badge>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-slate-900 tracking-tight">
            PRAYAG RO Repair, Service &{" "}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Doorstep AMC
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
            Expert RO breakdown repair, regular filter replacements, wall-mount installation, and 1-Year Comprehensive AMC plans in Prayagraj. Call or WhatsApp our direct service desk for quick booking.
          </p>

          {/* Quick Direct Helpline Banner - Sleek Single Row */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 bg-white p-1.5 sm:p-2 rounded-2xl border border-sky-200/90 shadow-xs mx-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 text-xs font-semibold whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Doorstep across Prayagraj</span>
            </div>
            
            <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0"></div>

            <Button
              size="sm"
              asChild
              className="h-8 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <a href="tel:+919140967681">
                <Phone className="h-3.5 w-3.5 text-white" />
                <span>Call: +91 9140967681</span>
              </a>
            </Button>

            <Button
              size="sm"
              asChild
              className="h-8 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs rounded-xl gap-1.5 shadow-xs whitespace-nowrap shrink-0"
            >
              <a href="https://wa.me/919140967681?text=Hello%20PRAYAG%20RO,%20I%20want%20to%20book%20a%20doorstep%20service." target="_blank" rel="noreferrer">
                <Waves className="h-3.5 w-3.5 text-white" />
                <span>WhatsApp Us</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Benefits Bar */}
      <section className="py-5 sm:py-6 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="p-2 rounded-xl bg-sky-50 shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">{benefit.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-5 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Available Services & Plans</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your required service or choose our popular 1-Year Comprehensive RO AMC
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({services.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("ro")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === "ro"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-sky-700 hover:text-sky-900"
                }`}
              >
                RO & AMC (Core)
              </button>
              <button
                type="button"
                onClick={() => setFilter("other")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === "other"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Other Appliances
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              const isRo = service.isRoService;

              return (
                <Card 
                  key={service.id}
                  className={`group relative flex flex-col transition-all duration-200 rounded-3xl border overflow-hidden ${
                    isRo 
                      ? "border-sky-300 bg-gradient-to-b from-sky-50/30 via-white to-white shadow-xs hover:shadow-md hover:border-sky-400" 
                      : "border-slate-200 bg-white shadow-xs hover:shadow-sm"
                  }`}
                >
                  {/* Top Ribbon Accent - Clean Typography, No Emojis */}
                  {isRo ? (
                    <div className="bg-sky-600 text-white text-[11px] font-bold px-3 py-1 text-center tracking-wide">
                      {service.badge || "Core RO Specialty"}
                    </div>
                  ) : (
                    <div className="bg-amber-100/90 text-amber-900 text-[11px] font-semibold px-3 py-0.5 text-center border-b border-amber-200/50">
                      Non-Core Service • Delay Possible
                    </div>
                  )}

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Icon & Category Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-2xl shrink-0 ${
                          isRo ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-[11px] font-semibold ${
                            isRo ? "bg-sky-100/80 text-sky-800 border-sky-200/60" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {service.category}
                        </Badge>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-sky-600 transition-colors leading-snug">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 text-xs mb-3 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* Single-Line Reassurance / Status Tag (Not dense) */}
                      {isRo ? (
                        <div className="mb-3.5 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/90 px-2.5 py-1 rounded-xl border border-emerald-200/80">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold">Doorstep visit within 24-48 hrs in Prayagraj</span>
                        </div>
                      ) : (
                        <div className="mb-3.5 flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1 rounded-xl border border-amber-200/80">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="font-semibold">Notice: Visit delay possible (Non-core service)</span>
                        </div>
                      )}

                      {/* Clean 3-Item Features List without bulky header */}
                      <ul className="space-y-1.5 mb-4">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-slate-600">
                            <span className={`h-1.5 w-1.5 rounded-full mr-2 shrink-0 ${
                              isRo ? "bg-sky-500" : "bg-slate-400"
                            }`} />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & Proportionate Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Starting at
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          {service.startingPrice || "Free"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild
                          className="h-9 px-3 border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded-xl font-semibold text-xs transition-colors"
                        >
                          <a href="tel:+919140967681" title="Call directly: +91 9140967681">
                            <Phone className="mr-1.5 h-3.5 w-3.5 text-sky-600" />
                            <span>Call</span>
                          </a>
                        </Button>

                        <Button 
                          size="sm"
                          asChild
                          className={`h-9 px-3.5 font-bold text-xs rounded-xl shadow-xs transition-all ${
                            isRo 
                              ? "bg-sky-600 hover:bg-sky-700 text-white" 
                              : "bg-slate-800 hover:bg-slate-900 text-white"
                          }`}
                        >
                          <Link to={`/services/${service.slug}`}>
                            Book Now
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Call & WhatsApp Section */}
      <section className="mt-10 sm:mt-12 container mx-auto px-4">
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-md border border-sky-800">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/30 uppercase text-[11px] font-bold px-3 py-0.5">
              Prayagraj Doorstep Assistance Desk
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Need Immediate RO Repair or AMC Consultation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Facing sudden RO water purifier breakdown, leak, or slow filtration? Call our technician directly at <strong>+91 9140967681</strong> or chat on WhatsApp for fast scheduling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button 
                size="sm"
                asChild
                className="h-9 px-4 w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs gap-1.5 shadow-sm"
              >
                <a href="tel:+919140967681">
                  <Phone className="h-3.5 w-3.5 text-slate-950" />
                  Call Now: 9140967681
                </a>
              </Button>
              <Button 
                size="sm"
                asChild
                className="h-9 px-4 w-full sm:w-auto bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm"
              >
                <a 
                  href="https://wa.me/919140967681?text=Hello%20PRAYAG%20RO,%20I%20need%20urgent%20doorstep%20RO%20repair%20service." 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Waves className="h-3.5 w-3.5 text-white" />
                  WhatsApp: 9140967681
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
