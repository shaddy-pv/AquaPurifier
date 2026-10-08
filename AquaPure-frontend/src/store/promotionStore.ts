import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PromotionState {
  announcementBar: {
    enabled: boolean;
    badgeText: string;
    message: string;
    tollFreeNumber: string;
    trustBadge1: string;
    trustBadge2: string;
  };
  heroBanner: {
    enabled: boolean;
    badgeText: string;
    headlinePrefix: string;
    brandHighlight: string;
    description: string;
    promoPrice: string;
    mrpPrice: string;
    liveTdsBadge: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    heroImage: string;
  };
  flashSale: {
    enabled: boolean;
    title: string;
    couponCode: string;
    couponDiscountText: string;
    hoursLeft: number;
    minutesLeft: number;
  };
  waterTestCampaign: {
    enabled: boolean;
    badgeText: string;
    title: string;
    description: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
  };
  catalogBanner: {
    enabled: boolean;
    bannerType: 'standard' | 'image';
    imageUrl: string;
    imageAlt: string;
    imageLink: string;
    badgeText: string;
    title: string;
    description: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
  };
  coupons: Array<{
    code: string;
    discountText: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    description: string;
    active: boolean;
  }>;
  isLoading: boolean;
  fetchPromotions: () => Promise<void>;
}

const DEFAULT_PROMOTIONS = {
  announcementBar: {
    enabled: true,
    badgeText: "FESTIVE DHAMAKA",
    message: "Flat 40% OFF + Free Doorstep Installation + 1-Year Zero-Cost Warranty!",
    tollFreeNumber: "+91 9140967681",
    trustBadge1: "Same Day Dispatch",
    trustBadge2: "ISO 9001:2015 Certified"
  },
  heroBanner: {
    enabled: true,
    badgeText: "DIRECT FACTORY INAUGURAL OFFER • FLAT 40% OFF",
    headlinePrefix: "Ab Har Boond Mein Shuddhata.",
    brandHighlight: "PRAYAG RO",
    description: "Protect your family with 10-Stage Copper & Alkaline RO Purification. Removes 99.9% harmful chemicals, heavy metals, and bacteria while restoring vital immunity minerals.",
    promoPrice: "₹14,999",
    mrpPrice: "₹22,999",
    liveTdsBadge: "Live TDS Output: 18 PPM",
    primaryCtaText: "Explore Festive Deals",
    primaryCtaLink: "/products",
    heroImage: "/assets/prayag-hero.jpg"
  },
  flashSale: {
    enabled: true,
    title: "INAUGURAL LAUNCH DEAL: PRAYAG RO Copper Alkaline",
    couponCode: "PRAYAG1000",
    couponDiscountText: "Get Extra ₹1,000 Instant Discount with Coupon: PRAYAG1000",
    hoursLeft: 9,
    minutesLeft: 24
  },
  waterTestCampaign: {
    enabled: true,
    badgeText: "100% FREE DOORSTEP SERVICE",
    title: "Get Your Home Water Tested For Free!",
    description: "Our certified water quality expert will visit your home with digital testing equipment to check TDS, hardness, and heavy metals at zero cost.",
    bullet1: "Digital TDS & Hardness Analysis on the spot",
    bullet2: "No obligation to buy • 100% free consultation",
    bullet3: "Available across 10,000+ pin codes in India"
  },
  catalogBanner: {
    enabled: true,
    bannerType: "standard" as const,
    imageUrl: "",
    imageAlt: "PRAYAG RO Pure Water Purifier Catalog Offer",
    imageLink: "",
    badgeText: "DIRECT FACTORY CATALOG • FLAT 40% OFF",
    title: "PRAYAG RO Pure Water Purifier Catalog",
    description: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage.",
    stat1Value: "40%",
    stat1Label: "Max Discount",
    stat2Value: "FREE",
    stat2Label: "Installation"
  },
  coupons: [
    {
      code: "PRAYAG1000",
      discountText: "₹1,000 OFF",
      discountType: "fixed" as const,
      discountValue: 1000,
      description: "Flat ₹1,000 off on any Purifier",
      active: true
    },
    {
      code: "FESTIVE40",
      discountText: "40% OFF",
      discountType: "percentage" as const,
      discountValue: 40,
      description: "Mega Festive Special 40% Off",
      active: true
    },
    {
      code: "FREESHIP",
      discountText: "FREE SHIP",
      discountType: "fixed" as const,
      discountValue: 0,
      description: "Free Express Doorstep Delivery",
      active: true
    }
  ]
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROMOTIONS,
      isLoading: false,

      fetchPromotions: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE_URL}/promotions`);
          if (res.ok) {
            const data = await res.json();
            if (data?.promotion) {
              set({
                announcementBar: data.promotion.announcementBar || DEFAULT_PROMOTIONS.announcementBar,
                heroBanner: data.promotion.heroBanner || DEFAULT_PROMOTIONS.heroBanner,
                flashSale: data.promotion.flashSale || DEFAULT_PROMOTIONS.flashSale,
                waterTestCampaign: data.promotion.waterTestCampaign || DEFAULT_PROMOTIONS.waterTestCampaign,
                catalogBanner: data.promotion.catalogBanner || DEFAULT_PROMOTIONS.catalogBanner,
                coupons: data.promotion.coupons || DEFAULT_PROMOTIONS.coupons,
                isLoading: false
              });
              return;
            }
          }
        } catch (err) {
          console.warn("Could not fetch promotions from API, keeping current state:", err);
        }
        set({ isLoading: false });
      }
    }),
    {
      name: "prayag-promotions-storage",
      partialize: (state) => ({
        announcementBar: state.announcementBar,
        heroBanner: state.heroBanner,
        flashSale: state.flashSale,
        waterTestCampaign: state.waterTestCampaign,
        catalogBanner: state.catalogBanner,
        coupons: state.coupons
      })
    }
  )
);
