export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  icon: string;
  category: string;
  isRoService: boolean;
  delayNotice?: string;
  badge?: string;
  startingPrice?: string;
  responseTime?: string;
}

export const services: Service[] = [
  // --- CORE RO SERVICES (Primary Specialty - Priority Fast Response in Prayagraj) ---
  {
    id: "ro-repair",
    name: "RO Breakdown Repair & Quick Fix",
    slug: "ro-repair-breakdown-fix",
    description: "Urgent doorstep diagnosis and repair for all RO purifier issues in Prayagraj - pump failure, water leakage, low flow, abnormal beeping, or power loss.",
    features: [
      "Booster Pump, SMPS Adapter & Solenoid Valve Fix",
      "No Pure Water / Slow Output Flow Diagnosis",
      "Auto Cut-Off & Float Valve Water Leakage Fix",
      "All RO Brands Supported (PRAYAG RO, Kent, Aquaguard, Pureit, etc.)",
      "TDS Sensor & Electronic PCB Repair",
      "100% Genuine Certified Spares with 30-Day Service Warranty"
    ],
    icon: "Wrench",
    category: "RO Purifiers (Core Specialty)",
    isRoService: true,
    badge: "Most Booked • Quick Fix",
    startingPrice: "₹199",
    responseTime: "24-48 Hours Doorstep Response in Prayagraj"
  },
  {
    id: "ro-service",
    name: "RO Routine Service & Filter Replacement",
    slug: "ro-service-filter-replacement",
    description: "Complete 6-point periodic health check and genuine filter cartridge renewal. Restores optimal water taste, pH alkalinity, and removes mineral scale.",
    features: [
      "High-Grade 100 GPD RO Membrane Flush & Descaling",
      "Sediment Pre-Filter & Activated Carbon Block Renewal",
      "Copper & Alkaline Mineral Re-Infusion Check",
      "UV Lamp & Bio-Cid Chamber Sanitization",
      "Digital Water Quality (TDS & pH) Testing Before & After",
      "Internal Storage Tank Deep Sanitization"
    ],
    icon: "Droplets",
    category: "RO Purifiers (Core Specialty)",
    isRoService: true,
    badge: "Core Service",
    startingPrice: "₹299",
    responseTime: "24-48 Hours Doorstep Response in Prayagraj"
  },
  {
    id: "ro-installation",
    name: "RO Installation & Relocation (Fix)",
    slug: "ro-installation-uninstallation",
    description: "Professional wall-mounting, raw water plumbing hookup, drain tube management, and safe uninstallation during house relocation across Prayagraj.",
    features: [
      "Precision Wall Drilling & Secure Purifier Mounting",
      "Inlet Diverter Valve & Heavy-Duty Tube Connection",
      "Wastewater Drain Line Routing & Anti-Drip Testing",
      "Safe De-Installation & Protective Packing for Shifting",
      "Raw Borewell / Supply Water TDS Verification",
      "Initial 2-Cycle System Flush & Calibration"
    ],
    icon: "Settings2",
    category: "RO Purifiers (Core Specialty)",
    isRoService: true,
    badge: "Installation & Fix",
    startingPrice: "₹349",
    responseTime: "Same-Day / Next-Day in Prayagraj"
  },
  {
    id: "ro-amc",
    name: "PRAYAG RO 1-Year Comprehensive AMC",
    slug: "ro-annual-maintenance-contract-amc",
    description: "365 days of complete peace of mind. Includes 3 free scheduled periodic services, unlimited emergency breakdown callouts, and free consumable replacements.",
    features: [
      "3 Comprehensive Scheduled Preventive Maintenance Visits",
      "Unlimited Free Breakdown & Emergency Service Callouts",
      "Free Replacement of Sediment Filters & Carbon Cartridges",
      "Free High-Flow RO Membrane Replacement (Comprehensive Plan)",
      "Zero Visiting & Labor Charges Throughout the Year",
      "Priority VIP Technician Dispatch within 24 Hours in Prayagraj"
    ],
    icon: "ShieldCheck",
    category: "RO Purifiers (Core Specialty)",
    isRoService: true,
    badge: "Best Value AMC Plan",
    startingPrice: "₹1,499 / Year",
    responseTime: "VIP 24-Hour Priority Dispatch"
  },

  // --- OTHER APPLIANCE SERVICES (Non-Core Services - Note on Possible Delay) ---
  {
    id: "1",
    name: "AC Service & Repair",
    slug: "ac-service-repair",
    description: "Air conditioner seasonal service, cooling issues diagnosis, and gas refilling for residential split and window AC units.",
    features: [
      "Split & Window AC Servicing",
      "Cooling Coil Deep Jet Cleaning",
      "Gas Leakage Check & Refill",
      "Compressor & Fan Motor Repair",
      "Water Leakage & Drainage Fix"
    ],
    icon: "AirVent",
    category: "Cooling & Appliances",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹499",
    responseTime: "3-5 Days (Subject to technician availability)"
  },
  {
    id: "2",
    name: "Washing Machine Repair",
    slug: "washing-machine-repair",
    description: "Doorstep diagnostic and component repair for top-load and front-load washing machines.",
    features: [
      "Drum Spin & Agitator Issues",
      "Drainage & Water Pump Blockage",
      "Excess Noise & Vibration Fix",
      "Motor & Belt Replacement",
      "Control Panel / PCB Repair"
    ],
    icon: "Waves",
    category: "Home Appliances",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹349",
    responseTime: "3-5 Days (Subject to technician availability)"
  },
  {
    id: "3",
    name: "Refrigerator Service",
    slug: "refrigerator-service",
    description: "Doorstep refrigerator cooling inspection, compressor repair, and thermostat replacement.",
    features: [
      "Low / No Cooling Diagnosis",
      "Compressor Check & Gas Top-Up",
      "Thermostat & Sensor Replacement",
      "Door Gasket & Seal Alignment",
      "Frost & Defrost Timer Fix"
    ],
    icon: "Wrench",
    category: "Home Appliances",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹399",
    responseTime: "3-5 Days (Subject to technician availability)"
  },
  {
    id: "4",
    name: "Microwave Oven Repair",
    slug: "microwave-repair",
    description: "Expert repair for convection and solo microwave ovens including magnetron and touch panel fixes.",
    features: [
      "No Heating / Low Heating Issues",
      "Magnetron & High Voltage Diode Fix",
      "Glass Turntable Motor Replacement",
      "Touch Keypad & Door Switch Repair",
      "Internal Sparking Resolution"
    ],
    icon: "Wrench",
    category: "Kitchen Appliances",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹349",
    responseTime: "3-5 Days (Subject to technician availability)"
  },
  {
    id: "5",
    name: "Electrical Repair",
    slug: "electrical-repair",
    description: "Home electrical wiring, switchboard fix, MCB tripping resolution, and light fixture installations.",
    features: [
      "Short Circuit & MCB Tripping Fix",
      "Switchboard, Socket & Regulator Repair",
      "Ceiling Fan & Exhaust Fan Setup",
      "Inverter & Battery Wiring",
      "Electrical Safety Check"
    ],
    icon: "Zap",
    category: "Electrical Work",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹249",
    responseTime: "3-5 Days (Subject to technician availability)"
  },
  {
    id: "6",
    name: "Geyser & Water Heater Repair",
    slug: "geyser-repair",
    description: "Instant and storage electric geyser heating element replacement and thermostat repair.",
    features: [
      "Water Not Heating / Slow Heating",
      "Thermostat & Cut-Off Replacement",
      "Heating Element De-scaling & Change",
      "Tank Water Leakage Inspection",
      "Inlet / Outlet Pipe Setup"
    ],
    icon: "Wrench",
    category: "Home Appliances",
    isRoService: false,
    delayNotice: "Note: Is service mein aane mein thoda delay ho sakta hai kyunki hamari core primary expertise RO Water Purifiers mein hai. (Service visits may experience slight delay as this is outside our primary RO specialty.)",
    badge: "Non-Core Service",
    startingPrice: "₹299",
    responseTime: "3-5 Days (Subject to technician availability)"
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};
