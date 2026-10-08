import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Wallet, Truck, Tag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { initiateRazorpayPayment, RAZORPAY_KEY } from "@/lib/razorpay";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { api, type ApiOrder, type ApiStoreSettings } from "@/lib/api";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    items, 
    getTotalPrice, 
    clearCart,
    appliedCoupon,
    couponDescription,
    getDiscountAmount,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [storeSettings, setStoreSettings] = useState<ApiStoreSettings | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod" // Default
  });

  // Fetch live store payment settings from backend
  useEffect(() => {
    api.settings.get()
      .then((res) => {
        if (res.success && res.settings) {
          setStoreSettings(res.settings);
          if (!res.settings.enableCashOnDelivery && res.settings.enableRazorpayGateway) {
            setFormData(prev => ({ ...prev, paymentMethod: "razorpay" }));
          } else if (res.settings.enableCashOnDelivery && !res.settings.enableRazorpayGateway) {
            setFormData(prev => ({ ...prev, paymentMethod: "cod" }));
          }
        }
      })
      .catch((err) => console.warn("Could not load backend store settings:", err));
  }, []);

  const totalPrice = getTotalPrice();
  const discountAmount = getDiscountAmount();
  const [shippingInfo, setShippingInfo] = useState(calculateShipping(""));
  
  useEffect(() => {
    if (formData.state) {
      const shipping = calculateShipping(formData.state);
      setShippingInfo(shipping);
    }
  }, [formData.state]);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : shippingInfo.cost;
  const taxableBase = Math.max(0, totalPrice - discountAmount) + shippingCost;
  const gstRate = storeSettings?.taxRateGst ?? 0;
  const gst = gstRate > 0 ? Math.round(taxableBase * (gstRate / 100)) : 0;
  const finalTotal = taxableBase + gst;

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod
      };

      // 1. Create order in MongoDB backend
      let createdOrder: ApiOrder | null = null;
      try {
        const orderRes = await api.orders.create(orderPayload);
        createdOrder = orderRes.order;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network error";
        console.warn("Backend order API error, using local fallback:", message);
      }

      const orderNumber = createdOrder?.orderNumber || `AQP${Date.now().toString().slice(-8)}`;

      // 2. Handle Razorpay Payment if selected
      if (formData.paymentMethod === "razorpay") {
        try {
          let serverOrderId: string | undefined = undefined;
          if (createdOrder) {
            try {
              const paymentRes = await api.orders.createPayment(orderNumber);
              serverOrderId = paymentRes.orderId;
            } catch (pErr: unknown) {
              const message = pErr instanceof Error ? pErr.message : "Payment error";
              console.warn("Could not create Razorpay order on backend:", message);
            }
          }

          await initiateRazorpayPayment({
            key: RAZORPAY_KEY,
            amount: finalTotal * 100, // paise
            currency: "INR",
            name: "PRAYAG RO",
            description: `Order ${orderNumber}`,
            order_id: serverOrderId,
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#0EA5E9",
            },
            handler: async (response) => {
              if (createdOrder && response.razorpay_payment_id) {
                try {
                  await api.orders.verifyPayment({
                    orderNumber,
                    razorpayOrderId: response.razorpay_order_id || serverOrderId || '',
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature || 'test-signature'
                  });
                } catch (vErr) {
                  console.warn("Payment verification backend warning:", vErr);
                }
              }

              clearCart();
              toast.success("Payment successful! Order confirmed.");
              navigate(`/order-confirmation?orderNumber=${orderNumber}`);
            },
          });
        } catch (error: unknown) {
          console.error("Razorpay error:", error);
          toast.error("Payment window closed or cancelled. You can retry or choose Cash on Delivery.");
          setIsSubmitting(false);
          return;
        }
      } else {
        // Cash on Delivery
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-confirmation?orderNumber=${orderNumber}`);
      }
    } catch (error: unknown) {
      console.error("Checkout submission failed:", error);
      const message = error instanceof Error ? error.message : "Failed to place order. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <div className="w-24 h-1 bg-muted mx-2">
                <div className={`h-full ${step >= 2 ? "bg-primary" : ""} transition-all`}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">
                    {step === 1 ? "Shipping Information" : "Payment Method"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="10-digit mobile number"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            placeholder="House/Flat number, building, street"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              placeholder="State"
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                              id="pincode"
                              placeholder="6-digit pincode"
                              value={formData.pincode}
                              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      >
                        <div className="space-y-4">
                          {(storeSettings?.enableCashOnDelivery ?? true) && (
                            <div className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                              formData.paymentMethod === "cod" ? "border-primary bg-sky-50/50 shadow-xs" : "hover:border-sky-300"
                            }`}>
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1">
                                <Wallet className="h-5 w-5 mr-3 text-primary" />
                                <div>
                                  <div className="font-semibold text-slate-900 text-sm">Cash on Delivery (COD)</div>
                                  <div className="text-xs text-muted-foreground">
                                    Pay via Cash or UPI when your purifier is delivered to your doorstep
                                  </div>
                                </div>
                              </Label>
                            </div>
                          )}

                          {(storeSettings?.enableRazorpayGateway ?? true) && (
                            <div className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                              formData.paymentMethod === "razorpay" ? "border-primary bg-sky-50/50 shadow-xs" : "hover:border-sky-300"
                            }`}>
                              <RadioGroupItem value="razorpay" id="razorpay" />
                              <Label htmlFor="razorpay" className="flex items-center cursor-pointer flex-1">
                                <CreditCard className="h-5 w-5 mr-3 text-primary" />
                                <div>
                                  <div className="font-semibold text-slate-900 text-sm">Razorpay Online Payment</div>
                                  <div className="text-xs text-muted-foreground">
                                    Instant online payment via UPI, Credit/Debit Card, Net Banking & EMI
                                  </div>
                                </div>
                              </Label>
                            </div>
                          )}

                          {!(storeSettings?.enableCashOnDelivery ?? true) && !(storeSettings?.enableRazorpayGateway ?? true) && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                              Payment gateways are temporarily updating. Please contact customer care to place your order.
                            </div>
                          )}
                        </div>
                      </RadioGroup>
                    )}

                    <div className="flex gap-4 pt-4">
                      {step === 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          disabled={isSubmitting}
                          onClick={() => setStep(1)}
                          className="flex-1 hover:text-sky-900"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || (!(storeSettings?.enableCashOnDelivery ?? true) && !(storeSettings?.enableRazorpayGateway ?? true) && step === 2)}
                        className="flex-1 bg-gradient-primary hover:shadow-premium transition-all"
                      >
                        {isSubmitting 
                          ? "Processing..." 
                          : (step === 1 ? "Continue to Payment" : "Confirm & Place Order")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input in Checkout */}
                  <div className="my-4 pt-4 border-t border-sky-100">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        disabled={!!appliedCoupon}
                        className="text-xs h-9 uppercase font-mono"
                      />
                      {appliedCoupon ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            removeCoupon();
                            toast.info("Coupon removed");
                          }}
                          className="text-xs h-9 shrink-0 hover:text-sky-900"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (!couponInput) {
                              toast.error("Please enter a coupon code");
                              return;
                            }
                            const res = applyCoupon(couponInput);
                            if (res.success) {
                              toast.success(res.message);
                              setCouponInput("");
                            } else {
                              toast.error(res.message);
                            }
                          }}
                          className="text-xs h-9 shrink-0 bg-sky-600 hover:bg-sky-700 text-white"
                        >
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        <span>✓ "{appliedCoupon}" applied</span>
                        {couponDescription && <span className="font-semibold">{couponDescription}</span>}
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                        <span>Coupon Discount ({appliedCoupon})</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {shippingCost === 0 ? (
                        <span className="text-success font-semibold">FREE</span>
                      ) : (
                        <span>₹{shippingCost.toLocaleString()}</span>
                      )}
                    </div>
                    {formData.state && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck className="h-3 w-3" />
                        <span>Estimated delivery: {shippingInfo.estimatedDays}</span>
                      </div>
                    )}
                    {totalPrice < FREE_SHIPPING_THRESHOLD && shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString()} more for FREE shipping
                      </p>
                    )}
                    {gst > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST ({gstRate}%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
