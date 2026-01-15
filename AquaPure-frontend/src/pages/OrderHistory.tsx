import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const orders = [
    {
      id: "AQP12345678",
      date: "2024-11-28",
      total: 22999,
      status: "Delivered",
      items: 2,
      statusColor: "bg-success"
    },
    {
      id: "AQP12345679",
      date: "2024-11-25",
      total: 18999,
      status: "Shipped",
      items: 1,
      statusColor: "bg-primary"
    },
    {
      id: "AQP12345680",
      date: "2024-11-20",
      total: 35999,
      status: "Processing",
      items: 3,
      statusColor: "bg-amber-500"
    }
  ];

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
                key={order.id}
                className="border-0 shadow-soft hover:shadow-premium transition-all bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-bold text-lg">{order.id}</p>
                    </div>
                    <Badge className={`${order.statusColor} text-white`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">{order.items} items</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                    {order.status === "Delivered" && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Review
                      </Button>
                    )}
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
