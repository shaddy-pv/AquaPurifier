import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    appliedCoupon,
    applyCoupon: storeApplyCoupon,
    removeCoupon: storeRemoveCoupon,
    getDiscountAmount,
    couponDescription
  } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [storeSettings, setStoreSettings] = useState<{ taxRateGst?: number } | null>(null);

  useEffect(() => {
    api.settings.get()
      .then((res) => {
        if (res.success && res.settings) {
          setStoreSettings(res.settings);
        }
      })
      .catch((err) => console.warn("Could not load backend store settings in cart:", err));
  }, []);
  
  const totalPrice = getTotalPrice();
  const discount = getDiscountAmount();
  const subtotal = Math.max(0, totalPrice - discount);
  const gstRate = storeSettings?.taxRateGst ?? 0;
  const gst = gstRate > 0 ? Math.round(subtotal * (gstRate / 100)) : 0;
  const finalTotal = subtotal + gst;

  const handleApplyCoupon = () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    const result = storeApplyCoupon(couponCode);
    if (result.success) {
      toast.success(result.message);
      setCouponCode("");
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    storeRemoveCoupon();
    toast.info("Coupon removed");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some products to get started
          </p>
          <Button size="lg" className="bg-gradient-primary" asChild>
            <Link to="/products">
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">
          Shopping{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Cart
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card 
                key={item.id}
                className="border-0 shadow-soft bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                    />
                    
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-base sm:text-lg mb-1">{item.name}</h3>
                      <p className="text-xl sm:text-2xl font-bold text-primary mb-3">
                        ₹{item.price.toLocaleString()}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-9 w-9 p-0"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-9 w-9 p-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive text-xs h-9"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-muted">
                      <p className="text-xs text-muted-foreground sm:mb-1">Subtotal</p>
                      <p className="text-lg sm:text-xl font-bold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <Button variant="outline" onClick={handleRemoveCoupon}>
                        Remove
                      </Button>
                    ) : (
                      <Button onClick={handleApplyCoupon}>
                        <Tag className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 mt-2">
                      <span>✓ Coupon "{appliedCoupon}" applied!</span>
                      {couponDescription && <span className="font-semibold">{couponDescription}</span>}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-success">FREE</span>
                  </div>
                  {gst > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({gstRate}% GST)</span>
                      <span className="font-medium">₹{gst.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-gradient-primary hover:shadow-premium transition-all mb-4"
                  asChild
                >
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
