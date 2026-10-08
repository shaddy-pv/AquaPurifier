import express, { Request, Response } from 'express';
import Promotion from '../models/Promotion';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

const DEFAULT_PROMOTION = {
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

// GET /api/promotions (Public)
router.get('/', async (req: Request, res: Response) => {
  try {
    let promo = await Promotion.findOne();
    if (!promo) {
      promo = await Promotion.create(DEFAULT_PROMOTION);
    }
    return res.json({ success: true, promotion: promo });
  } catch (error: any) {
    console.error('Error fetching promotions:', error.message);
    return res.json({ success: true, promotion: DEFAULT_PROMOTION });
  }
});

// PUT /api/promotions (Admin only)
router.put('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    let promo = await Promotion.findOne();
    if (!promo) {
      promo = new Promotion(DEFAULT_PROMOTION);
    }

    if (req.body.announcementBar) promo.announcementBar = req.body.announcementBar;
    if (req.body.heroBanner) promo.heroBanner = req.body.heroBanner;
    if (req.body.flashSale) promo.flashSale = req.body.flashSale;
    if (req.body.waterTestCampaign) promo.waterTestCampaign = req.body.waterTestCampaign;
    if (req.body.catalogBanner) promo.catalogBanner = req.body.catalogBanner;
    if (req.body.coupons) promo.coupons = req.body.coupons;

    await promo.save();
    return res.json({ 
      success: true, 
      message: 'Promotions and marketing banners updated successfully', 
      promotion: promo 
    });
  } catch (error: any) {
    console.error('Error updating promotions:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/promotions/reset (Admin only)
router.post('/reset', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    let promo = await Promotion.findOne();
    if (promo) {
      await Promotion.deleteMany({});
    }
    const freshPromo = await Promotion.create(DEFAULT_PROMOTION);
    return res.json({ 
      success: true, 
      message: 'Promotions reset to festive campaign defaults', 
      promotion: freshPromo 
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
