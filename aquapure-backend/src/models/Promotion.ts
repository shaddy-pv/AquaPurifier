import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
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
  updatedAt: Date;
}

const PromotionSchema: Schema = new Schema(
  {
    announcementBar: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "FESTIVE DHAMAKA" },
      message: { type: String, default: "Flat 40% OFF + Free Doorstep Installation + 1-Year Zero-Cost Warranty!" },
      tollFreeNumber: { type: String, default: "+91 9140967681" },
      trustBadge1: { type: String, default: "Same Day Dispatch" },
      trustBadge2: { type: String, default: "ISO 9001:2015 Certified" }
    },
    heroBanner: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "DIRECT FACTORY INAUGURAL OFFER • FLAT 40% OFF" },
      headlinePrefix: { type: String, default: "Ab Har Boond Mein Shuddhata." },
      brandHighlight: { type: String, default: "PRAYAG RO" },
      description: { 
        type: String, 
        default: "Protect your family with 10-Stage Copper & Alkaline RO Purification. Removes 99.9% harmful chemicals, heavy metals, and bacteria while restoring vital immunity minerals." 
      },
      promoPrice: { type: String, default: "₹14,999" },
      mrpPrice: { type: String, default: "₹22,999" },
      liveTdsBadge: { type: String, default: "Live TDS Output: 18 PPM" },
      primaryCtaText: { type: String, default: "Explore Festive Deals" },
      primaryCtaLink: { type: String, default: "/products" },
      heroImage: { type: String, default: "/assets/prayag-hero.jpg" }
    },
    flashSale: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "INAUGURAL LAUNCH DEAL: PRAYAG RO Copper Alkaline" },
      couponCode: { type: String, default: "PRAYAG1000" },
      couponDiscountText: { type: String, default: "Get Extra ₹1,000 Instant Discount with Coupon: PRAYAG1000" },
      hoursLeft: { type: Number, default: 9 },
      minutesLeft: { type: Number, default: 24 }
    },
    waterTestCampaign: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "100% FREE DOORSTEP SERVICE" },
      title: { type: String, default: "Get Your Home Water Tested For Free!" },
      description: { 
        type: String, 
        default: "Our certified water quality expert will visit your home with digital testing equipment to check TDS, hardness, and heavy metals at zero cost." 
      },
      bullet1: { type: String, default: "Digital TDS & Hardness Analysis on the spot" },
      bullet2: { type: String, default: "No obligation to buy • 100% free consultation" },
      bullet3: { type: String, default: "Available across 10,000+ pin codes in India" }
    },
    catalogBanner: {
      enabled: { type: Boolean, default: true },
      bannerType: { type: String, enum: ['standard', 'image'], default: 'standard' },
      imageUrl: { type: String, default: "" },
      imageAlt: { type: String, default: "PRAYAG RO Pure Water Purifier Catalog Offer" },
      imageLink: { type: String, default: "" },
      badgeText: { type: String, default: "DIRECT FACTORY CATALOG • FLAT 40% OFF" },
      title: { type: String, default: "PRAYAG RO Pure Water Purifier Catalog" },
      description: { 
        type: String, 
        default: "Every PRAYAG RO model includes Free Doorstep Installation, Free Pre-Filter Kit worth ₹1,499, and 1-Year Zero-Cost AMC Coverage." 
      },
      stat1Value: { type: String, default: "40%" },
      stat1Label: { type: String, default: "Max Discount" },
      stat2Value: { type: String, default: "FREE" },
      stat2Label: { type: String, default: "Installation" }
    },
    coupons: [
      {
        code: { type: String, required: true },
        discountText: { type: String, required: true },
        discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
        discountValue: { type: Number, default: 1000 },
        description: { type: String, default: "" },
        active: { type: Boolean, default: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);
