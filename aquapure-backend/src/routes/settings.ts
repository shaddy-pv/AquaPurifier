import express from 'express';
import Settings from '../models/Settings';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

const DEFAULT_SETTINGS = {
  storeName: 'PRAYAG RO Official Store',
  supportEmail: 'support@prayagro.com',
  supportPhone: '+91 9140967681',
  warehouseAddress: 'PRAYAG RO, 31/3B Rajrooppur, Prayagraj, UP - 211011',
  freeShippingThreshold: 0,
  standardDeliveryFee: 0,
  taxRateGst: 0,
  maintenanceMode: false,
  enableCashOnDelivery: true,
  enableRazorpayGateway: true,
  bannerNotice: 'Inaugural Launch: Free Express Delivery & Doorstep Installation on all PRAYAG RO purifiers!'
};

// GET /api/settings - Public store settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(DEFAULT_SETTINGS);
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
});

// PUT /api/settings - Update store settings (Admin only)
router.put('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const updateData = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({ ...DEFAULT_SETTINGS, ...updateData });
      await settings.save();
    } else {
      Object.assign(settings, updateData);
      await settings.save();
    }

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      settings
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
});

export default router;
