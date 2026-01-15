import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Wallet, Truck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { initiateRazorpayPayment, RAZORPAY_KEY } from "@/lib/razorpay";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay"
  });

  const totalPrice = getTotalPrice();
  const [shippingInfo, setShippingInfo] = useState(calculateShipping(""));
  
  useEffect(() => {
    if (formData.state) {
      const shipping = calculateShipping(formData.state);
      setShippingInfo(shipping);
    }
  }, [formData.state]);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : shippingInfo.cost;
  const subtotal = totalPrice + shippingCost;
  const gst = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + gst;

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    if (formData.paymentMethod === "razorpay") {
      try {
        await initiateRazorpayPayment({
          key: RAZORPAY_KEY,
          amount: finalTotal * 100, // Amount in paise
          currency: "INR",
          name: "AquaPure",
          description: "Water Purifier Purchase",
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#0EA5E9",
          },
          handler: (response) => {
            console.log("Payment successful:", response);
            toast.success("Payment successful!");
            clearCart();
            navigate("/order-confirmation");
          },
        });
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error("Payment failed. Please try again.");
      }
    } else {
      // Cash on Delivery
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <div className="w-24 h-1 bg-muted mx-2">
                <div className={`h-full ${step >= 2 ? "bg-primary" : ""} transition-all`}></div>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
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
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">
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

                        <div className="grid grid-cols-2 gap-4">
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
                              placeholder="Enter phone"
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
                            placeholder="Street address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
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
                              placeholder="Pincode"
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
                          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                            <RadioGroupItem value="razorpay" id="razorpay" />
                            <Label htmlFor="razorpay" className="flex items-center cursor-pointer flex-1">
                              <CreditCard className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">Razorpay</div>
                                <div className="text-sm text-muted-foreground">
                                  Credit/Debit Card, UPI, Net Banking
                                </div>
                              </div>
                            </Label>
                          </div>

                          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1">
                              <Wallet className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <div className="font-medium">Cash on Delivery</div>
                                <div className="text-sm text-muted-foreground">
                                  Pay when you receive
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    )}

                    <div className="flex gap-4">
                      {step === 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1 bg-gradient-primary hover:shadow-premium transition-all"
                      >
                        {step === 1 ? "Continue to Payment" : "Place Order"}
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

                  <div className="space-y-3 mb-4">
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

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      {shippingCost === 0 ? (
                        <span className="text-success">FREE</span>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
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
