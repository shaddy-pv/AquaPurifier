import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, Download, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { api, ApiOrder } from "@/lib/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.getMyOrders()
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch orders from API:", err.message);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-success";
      case "shipped": return "bg-primary";
      case "confirmed":
      case "processing": return "bg-amber-500";
      case "cancelled": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Order{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              History
            </span>
          </h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card 
                key={order.id || order.orderNumber}
                className="border-0 shadow-soft hover:shadow-premium transition-all bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">{order.items?.length || 1} items</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">₹{order.total?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/track-order?order=${order.orderNumber}`}>
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => window.print()}>
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {orders.length === 0 && (
            <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
                <Button className="bg-gradient-primary" asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
