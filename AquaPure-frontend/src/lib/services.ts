export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  icon: string;
  category: string;
}

export const services: Service[] = [
  {
    id: "1",
    name: "AC Service & Repair",
    slug: "ac-service-repair",
    description: "Professional AC installation, maintenance, and repair services. Expert technicians for all AC brands.",
    features: [
      "Installation & Uninstallation",
      "Gas Refilling",
      "General Service & Cleaning",
      "Cooling Issues",
      "Water Leakage Fix",
      "All Brands Supported"
    ],
    icon: "AirVent",
    category: "Cooling"
  },
  {
    id: "2",
    name: "Washing Machine Repair",
    slug: "washing-machine-repair",
    description: "Complete washing machine repair and maintenance services for all types and brands.",
    features: [
      "Not Starting Issues",
      "Drainage Problems",
      "Spin Issues",
      "Water Inlet Problems",
      "Noise & Vibration Fix",
      "All Brands Supported"
    ],
    icon: "Waves",
    category: "Appliances"
  },
  {
    id: "3",
    name: "Microwave Repair",
    slug: "microwave-repair",
    description: "Expert microwave oven repair services. Quick diagnosis and reliable solutions.",
    features: [
      "Not Heating Issues",
      "Turntable Problems",
      "Door Issues",
      "Control Panel Repair",
      "Sparking Issues",
      "All Brands Supported"
    ],
    icon: "Microwave",
    category: "Appliances"
  },
  {
    id: "4",
    name: "Electrical Repair",
    slug: "electrical-repair",
    description: "Licensed electricians for all your electrical repair and installation needs.",
    features: [
      "Wiring & Rewiring",
      "Switch & Socket Repair",
      "Fan Installation",
      "Light Fixture Setup",
      "Circuit Breaker Issues",
      "Safety Inspection"
    ],
    icon: "Zap",
    category: "Electrical"
  },
  {
    id: "5",
    name: "Refrigerator Service",
    slug: "refrigerator-service",
    description: "Professional refrigerator repair and maintenance for optimal cooling performance.",
    features: [
      "Cooling Issues",
      "Gas Refilling",
      "Compressor Repair",
      "Water Leakage",
      "Ice Maker Problems",
      "All Brands Supported"
    ],
    icon: "Refrigerator",
    category: "Cooling"
  },
  {
    id: "6",
    name: "Geyser Repair",
    slug: "geyser-repair",
    description: "Fast and reliable geyser repair services. Installation and maintenance available.",
    features: [
      "Not Heating Issues",
      "Thermostat Replacement",
      "Element Replacement",
      "Water Leakage Fix",
      "Installation Service",
      "All Brands Supported"
    ],
    icon: "Flame",
    category: "Heating"
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};
