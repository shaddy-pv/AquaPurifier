import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Printer, 
  ShoppingCart, 
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";
import { adminApi, AdminOrder } from "@/lib/api";
import { toast } from "sonner";

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.orders.getAll(statusFilter !== "all" ? { status: statusFilter } : undefined);
      setOrders(data.orders || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.orders.updateStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) => 
        prev.map((o) => ((o.id === orderId || o._id === orderId) ? { ...o, status: newStatus as AdminOrder['status'] } : o))
      );
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as AdminOrder['status'] });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update order status";
      toast.error(message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      (order.shippingAddress?.name || "").toLowerCase().includes(q) ||
      (order.shippingAddress?.email || "").toLowerCase().includes(q) ||
      (order.shippingAddress?.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout
      title="Orders & Shipments"
      description="Track fulfillment pipelines, update delivery milestones, and inspect invoices"
    >
      <div className="space-y-6">
        {/* Filter Toolbar */}
        <Card className="border border-sky-100 bg-white">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base text-slate-900 font-bold">Fulfillment Queue</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search order ID, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs border-sky-100"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 text-xs border-sky-100">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadOrders}
                disabled={loading}
                className="border-sky-100 text-slate-600 hover:text-primary"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-sky-50/60 text-xs uppercase tracking-wider text-slate-500 border-b border-sky-100">
                  <tr>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Items</th>
                    <th className="py-3.5 px-6">Total Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const ordId = order.id || order._id || "ord";
                      return (
                        <tr key={ordId} className="hover:bg-sky-50/30 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {order.orderNumber}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-slate-800">{order.shippingAddress?.name || "Customer"}</p>
                            <p className="text-xs text-slate-500">{order.shippingAddress?.phone}</p>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Today"}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                            {order.items?.length || 1} purifier(s)
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ₹{order.total?.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="outline" className={`text-xs capitalize ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <Select
                              value={order.status}
                              onValueChange={(val) => handleStatusChange(ordId, val)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs inline-flex border-sky-100 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 text-xs text-primary hover:text-primary-dark hover:bg-sky-50"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-sky-50">
              {filteredOrders.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No orders found.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const ordId = order.id || order._id || "ord";
                  return (
                    <div key={ordId} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-slate-500">
                            {order.shippingAddress?.name || "Customer"} • {order.items?.length || 1} item(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-sm">₹{order.total?.toLocaleString()}</p>
                          <Badge variant="outline" className={`text-xs mt-1 capitalize ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(ordId, val)}
                        >
                          <SelectTrigger className="flex-1 h-8 text-xs border-sky-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 text-xs border-sky-100 text-primary hover:bg-sky-50"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="border border-sky-100 bg-white max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-premium">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <div>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                      Tax Invoice: {selectedOrder.orderNumber}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-1">
                      Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : "Today"}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className={`capitalize ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 text-xs pt-2">
                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Customer Delivery Address
                  </h4>
                  <p className="font-semibold text-slate-900">{selectedOrder.shippingAddress?.name}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress?.street}</p>
                  <p className="text-slate-600">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-slate-500">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {selectedOrder.shippingAddress?.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {selectedOrder.shippingAddress?.email}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-sky-100 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Items Breakdown
                  </h4>
                  <div className="divide-y divide-sky-50">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-slate-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                        </div>
                        <p className="font-bold text-slate-900">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax (GST):</span>
                      <span>₹{selectedOrder.tax?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Charges:</span>
                    <span>{selectedOrder.shipping === 0 ? "FREE" : `₹${selectedOrder.shipping}`}</span>
                  </div>
                  <div className="border-t border-sky-200/80 pt-2 flex justify-between text-slate-900 font-bold text-sm">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 flex flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="border-sky-100 text-slate-700 hover:text-primary text-xs flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Tax Invoice
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gradient-primary text-white text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
