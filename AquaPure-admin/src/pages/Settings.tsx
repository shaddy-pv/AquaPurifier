import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Store, 
  CreditCard, 
  Truck, 
  BellRing,
  Loader2
} from "lucide-react";
import { adminApi, AdminStoreSettings } from "@/lib/api";
import { toast } from "sonner";

const DEFAULT_SETTINGS: AdminStoreSettings = {
  storeName: "PRAYAG RO Official Store",
  supportEmail: "support@prayagro.com",
  supportPhone: "+91 9140967681",
  warehouseAddress: "PRAYAG RO, 31/3B Rajrooppur, Prayagraj, UP - 211011",
  freeShippingThreshold: 0,
  standardDeliveryFee: 0,
  taxRateGst: 18,
  maintenanceMode: false,
  enableCashOnDelivery: true,
  enableRazorpayGateway: true,
  bannerNotice: "Inaugural Launch: Free Express Delivery & Doorstep Installation on all PRAYAG RO purifiers!"
};

export default function Settings() {
  const [settings, setSettings] = useState<AdminStoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminApi.settings.get();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err: unknown) {
        console.warn("Could not load backend settings, using defaults:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.settings.update(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
      toast.success("Store configurations updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Store & Operations Settings"
      description="Configure contact channels, pricing policies, payment gateways, and system flags"
    >
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving || loading}
            className="bg-gradient-primary hover:shadow-soft text-white font-semibold text-xs flex items-center gap-2 h-10 px-5 rounded-xl"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Configuration Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Store Details */}
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-1">
                <Store className="h-5 w-5" />
                <CardTitle className="text-base text-slate-900 font-bold">General Information</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Customer-facing brand credentials shown on invoices and confirmations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Store Brand Name</Label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Toll-Free Helpline</Label>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Warehouse / Dispatch Hub</Label>
                <Input
                  value={settings.warehouseAddress}
                  onChange={(e) => setSettings({ ...settings, warehouseAddress: e.target.value })}
                  className="border-sky-100 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Billing Rules */}
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Truck className="h-5 w-5" />
                <CardTitle className="text-base text-slate-900 font-bold">Shipping & Taxation</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Define logistics costs, free freight cutoffs, and tax calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Free Shipping Threshold (₹)</Label>
                <Input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Standard Freight / Delivery Fee (₹)</Label>
                <Input
                  type="number"
                  value={settings.standardDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-700 font-semibold">GST Rate (%)</Label>
                  <span className="text-[10px] text-slate-500 font-medium">0% for exempt businesses</span>
                </div>
                <Input
                  type="number"
                  value={settings.taxRateGst}
                  onChange={(e) => setSettings({ ...settings, taxRateGst: Number(e.target.value) })}
                  className="border-sky-100 text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Keep at 0% if operating under the ₹40 Lakh annual turnover threshold without a GSTIN. Customer invoices will print as a clean Retail Bill of Supply without separate tax collection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <CreditCard className="h-5 w-5" />
                <CardTitle className="text-base text-slate-900 font-bold">Payment Methods</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Configure payment channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/50 border border-sky-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Razorpay Online Gateway</p>
                  <p className="text-xs text-slate-500">UPI, Net Banking, Credit & Debit Cards</p>
                </div>
                <Switch
                  checked={settings.enableRazorpayGateway}
                  onCheckedChange={(c) => setSettings({ ...settings, enableRazorpayGateway: c })}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/50 border border-sky-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Cash on Delivery (COD)</p>
                  <p className="text-xs text-slate-500">Payment upon doorstep delivery</p>
                </div>
                <Switch
                  checked={settings.enableCashOnDelivery}
                  onCheckedChange={(c) => setSettings({ ...settings, enableCashOnDelivery: c })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Broadcasts & Flags */}
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <BellRing className="h-5 w-5" />
                <CardTitle className="text-base text-slate-900 font-bold">Announcements & Flags</CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Storefront banner messages and controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 font-semibold">Storefront Header Banner</Label>
                <Input
                  value={settings.bannerNotice}
                  onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                  className="border-sky-100 text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Show maintenance notice on storefront</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(c) => setSettings({ ...settings, maintenanceMode: c })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </AdminLayout>
  );
}
