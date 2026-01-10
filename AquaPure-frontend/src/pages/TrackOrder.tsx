import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, MapPin, Clock } from "lucide-react";
import SEO from "@/components/SEO";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock tracking data
    setTrackingData({
      orderNumber: orderNumber,
      status: "In Transit",
      estimatedDelivery: "Dec 5, 2024",
      currentLocation: "Mumbai Distribution Center",
      trackingNumber: "TRK" + Date.now().toString().slice(-8),
      timeline: [
        {
          status: "Order Placed",
          date: "Dec 1, 2024 10:30 AM",
          completed: true,
          icon: Package
        },
        {
          status: "Order Confirmed",
          date: "Dec 1, 2024 11:00 AM",
          completed: true,
          icon: CheckCircle
        },
        {
          status: "Shipped",
          date: "Dec 2, 2024 09:00 AM",
          completed: true,
          icon: Truck
        },
        {
          status: "In Transit",
          date: "Dec 3, 2024 02:30 PM",
          completed: true,
          icon: MapPin,
          current: true
        },
        {
          status: "Out for Delivery",
          date: "Expected Dec 5, 2024",
          completed: false,
          icon: Truck
        },
        {
          status: "Delivered",
          date: "Expected Dec 5, 2024",
          completed: false,
          icon: CheckCircle
        }
      ]
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-12">
      <SEO
        title="Track Your Order"
        description="Track your AquaPure order in real-time. Get delivery updates and estimated arrival time."
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Track Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Order
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Enter your order number to track your delivery
            </p>
          </div>

          {/* Tracking Form */}
          <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    placeholder="Enter your order number (e.g., AQP12345678)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary"
                >
                  {isLoading ? "Tracking..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Order #{trackingData.orderNumber}
                      </h2>
                      <p className="text-muted-foreground">
                        Tracking: {trackingData.trackingNumber}
                      </p>
                    </div>
                    <Badge className="bg-primary text-lg px-4 py-2">
                      {trackingData.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-semibold">{trackingData.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Location</p>
                        <p className="font-semibold">{trackingData.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Tracking Timeline</h3>
                  
                  <div className="space-y-6">
                    {trackingData.timeline.map((event: any, index: number) => {
                      const Icon = event.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                event.completed
                                  ? event.current
                                    ? "bg-primary"
                                    : "bg-success"
                                  : "bg-muted"
                              }`}
                            >
                              <Icon
                                className={`h-6 w-6 ${
                                  event.completed ? "text-white" : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            {index < trackingData.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-12 ${
                                  event.completed ? "bg-success" : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                          
                          <div className="flex-1 pb-8">
                            <h4
                              className={`font-semibold mb-1 ${
                                event.current ? "text-primary" : ""
                              }`}
                            >
                              {event.status}
                            </h4>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Need help with your order?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline">
                      Contact Support
                    </Button>
                    <Button variant="outline">
                      Call 1800-123-AQUA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
