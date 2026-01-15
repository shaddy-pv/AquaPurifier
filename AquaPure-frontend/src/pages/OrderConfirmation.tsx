import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, FileText } from "lucide-react";

const OrderConfirmation = () => {
  const orderNumber = `AQP${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>

          <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-primary">{orderNumber}</p>
                </div>
                <p className="text-muted-foreground">
                  A confirmation email has been sent to your email address with order details.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Processing</p>
                  </div>
                  <div className="text-center opacity-50">
                    <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm">Shipped</p>
                  </div>
                  <div className="text-center opacity-50">
                    <Home className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm">Delivered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary" asChild>
              <Link to="/profile/orders">
                <FileText className="mr-2 h-5 w-5" />
                View Order Details
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
