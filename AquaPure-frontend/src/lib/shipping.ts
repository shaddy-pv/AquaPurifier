export interface ShippingZone {
  name: string;
  states: string[];
  cost: number;
  estimatedDays: string;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    name: "Metro Cities",
    states: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal"],
    cost: 0, // Free shipping
    estimatedDays: "2-3 days"
  },
  {
    name: "North Zone",
    states: ["Punjab", "Haryana", "Uttar Pradesh", "Uttarakhand", "Himachal Pradesh", "Jammu and Kashmir"],
    cost: 0,
    estimatedDays: "3-5 days"
  },
  {
    name: "South Zone",
    states: ["Kerala", "Andhra Pradesh", "Telangana", "Puducherry"],
    cost: 0,
    estimatedDays: "3-5 days"
  },
  {
    name: "East Zone",
    states: ["Bihar", "Jharkhand", "Odisha", "Assam", "Sikkim"],
    cost: 0,
    estimatedDays: "4-6 days"
  },
  {
    name: "West Zone",
    states: ["Gujarat", "Rajasthan", "Goa", "Madhya Pradesh"],
    cost: 0,
    estimatedDays: "3-5 days"
  },
  {
    name: "Remote Areas",
    states: ["Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura"],
    cost: 200,
    estimatedDays: "5-7 days"
  }
];

export const calculateShipping = (state: string): ShippingZone => {
  const zone = SHIPPING_ZONES.find(z => 
    z.states.some(s => s.toLowerCase() === state.toLowerCase())
  );
  
  return zone || {
    name: "Standard",
    states: [],
    cost: 100,
    estimatedDays: "5-7 days"
  };
};

export const FREE_SHIPPING_THRESHOLD = 10000; // Free shipping above ₹10,000
