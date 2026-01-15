import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";

interface InvoiceProps {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

const Invoice = ({
  orderNumber,
  orderDate,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  items,
  subtotal,
  discount,
  shipping,
  tax,
  total
}: InvoiceProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    handlePrint();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4 print:hidden">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card className="border-0 shadow-premium bg-white">
        <CardContent className="p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">AquaPure</h1>
              <p className="text-sm text-muted-foreground">
                Premium Water Purifiers<br />
                Mumbai, Maharashtra, India<br />
                support@aquapure.com<br />
                1800-123-AQUA
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
              <p className="text-sm">
                <span className="font-semibold">Order #:</span> {orderNumber}<br />
                <span className="font-semibold">Date:</span> {new Date(orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Customer Details */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Bill To:</h3>
            <p className="text-sm">
              {customerName}<br />
              {customerEmail}<br />
              {customerPhone}<br />
              {customerAddress}
            </p>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Item</th>
                  <th className="text-center py-3">Qty</th>
                  <th className="text-right py-3">Price</th>
                  <th className="text-right py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.name}</td>
                    <td className="text-center py-3">{item.quantity}</td>
                    <td className="text-right py-3">₹{item.price.toLocaleString()}</td>
                    <td className="text-right py-3">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount:</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>Thank you for your purchase!</p>
            <p className="mt-2">For any queries, contact us at support@aquapure.com or call 1800-123-AQUA</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoice;
