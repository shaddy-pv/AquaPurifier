import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Plus, 
  ArrowUpRight,
  Clock,
  AlertTriangle,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi, AdminOrder, AdminProduct } from "@/lib/api";

export default function Dashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminApi.orders.getAll().catch(() => ({ orders: [] })),
      adminApi.products.getAll().catch(() => ({ products: [] })),
      adminApi.users.getAll().catch(() => ({ users: [] }))
    ]).then(([ordersData, productsData, usersData]) => {
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
      setUserCount(usersData.users?.length || 2);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, ord) => sum + (ord.status !== "cancelled" ? ord.total : 0), 
    0
  );
  const pendingCount = orders.filter((o) => ["pending", "processing"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  const stats = [
    {
      title: "Total Sales Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      sub: "Active lifetime order volume",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Orders Received",
      value: orders.length.toString(),
      sub: `${pendingCount} requiring fulfillment`,
      icon: ShoppingCart,
      color: "text-primary bg-sky-50 border-sky-100"
    },
    {
      title: "Purifier Catalog",
      value: products.length.toString(),
      sub: `${lowStockProducts.length} low stock warnings`,
      icon: Package,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Registered Customers",
      value: userCount.toString(),
      sub: "Active consumer accounts",
      icon: Users,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    }
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout 
      title="Store Operations Dashboard" 
      description="Live sales revenue, customer transactions, and warehouse stock tracking"
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border border-sky-100/80 bg-white hover:shadow-premium transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1 truncate">{stat.value}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{stat.sub}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-xs ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-sky-100 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild className="bg-gradient-primary hover:shadow-soft text-white text-xs h-9">
              <Link to="/products" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Publish New Purifier</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-sky-100 text-slate-700 hover:text-primary hover:bg-sky-50 text-xs h-9">
              <Link to="/orders" className="flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span>Process Orders ({pendingCount})</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-sky-100 text-slate-700 hover:text-primary hover:bg-sky-50 text-xs h-9">
              <Link to="/customers" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Customer Directory</span>
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="text-slate-500 hover:text-primary text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders (Span 2) */}
          <Card className="lg:col-span-2 border border-sky-100 bg-white">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-900 font-bold">Recent Customer Checkouts</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Real-time orders awaiting warehouse dispatch</p>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:text-primary-dark">
                <Link to="/orders" className="flex items-center gap-1">
                  <span>View All Orders</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Loading orders...
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No orders placed yet.
                </div>
              ) : (
                <div className="divide-y divide-sky-50">
                  {recentOrders.map((ord) => (
                    <div key={ord.id || ord._id} className="p-4 flex items-center justify-between hover:bg-sky-50/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 text-primary flex items-center justify-center shrink-0">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{ord.orderNumber}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {ord.shippingAddress?.name || "Customer"} • {ord.items.length} item(s)
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-900">₹{ord.total?.toLocaleString()}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 capitalize ${
                            ord.status === "delivered" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : ord.status === "cancelled" 
                              ? "bg-red-50 text-red-700 border-red-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {ord.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fulfillment Summary & Inventory Warnings */}
          <div className="space-y-6">
            <Card className="border border-sky-100 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900 font-bold">Fulfillment Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-slate-700 flex items-center gap-2 text-xs font-medium">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Pending / Processing
                  </span>
                  <span className="font-bold text-amber-700">{pendingCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-slate-700 flex items-center gap-2 text-xs font-medium">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Delivered Orders
                  </span>
                  <span className="font-bold text-emerald-700">{deliveredCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-700 flex items-center gap-2 text-xs font-medium">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Low Stock Alerts
                  </span>
                  <span className="font-bold text-orange-600">{lowStockProducts.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Low Inventory Warnings */}
            <Card className="border border-sky-100 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>Low Stock Warning</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {lowStockProducts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    All inventory levels are healthy (&ge; 10 units).
                  </div>
                ) : (
                  <div className="divide-y divide-sky-50">
                    {lowStockProducts.slice(0, 3).map((prod) => (
                      <div key={prod.id || prod._id} className="p-3.5 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{prod.name}</p>
                          <p className="text-xs text-slate-400">₹{prod.price?.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs shrink-0">
                          {prod.stock} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
