import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  warehouseAddress: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  taxRateGst: number;
  maintenanceMode: boolean;
  enableCashOnDelivery: boolean;
  enableRazorpayGateway: boolean;
  bannerNotice: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: 'PRAYAG RO Official Store' },
    supportEmail: { type: String, default: 'support@prayagro.com' },
    supportPhone: { type: String, default: '+91 9140967681' },
    warehouseAddress: { type: String, default: 'PRAYAG RO, 31/3B Rajrooppur, Prayagraj, UP - 211011' },
    freeShippingThreshold: { type: Number, default: 0 },
    standardDeliveryFee: { type: Number, default: 0 },
    taxRateGst: { type: Number, default: 0 },
    maintenanceMode: { type: Boolean, default: false },
    enableCashOnDelivery: { type: Boolean, default: true },
    enableRazorpayGateway: { type: Boolean, default: true },
    bannerNotice: { type: String, default: 'Inaugural Offer: Free Delivery & Doorstep Installation on all PRAYAG RO purifiers!' }
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
