import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  DollarSign,
  Activity,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const AdminDashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12,45,890",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Total Customers",
      value: "5,678",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Products Sold",
      value: "2,456",
      change: "+10.1%",
      icon: Package,
      color: "text-orange-600"
    }
  ];

  const recentOrders = [
    { id: "AQP12345678", customer: "John Doe", amount: 18999, status: "Processing" },
    { id: "AQP12345679", customer: "Jane Smith", amount: 25999, status: "Shipped" },
    { id: "AQP12345680", customer: "Bob Johnson", amount: 12999, status: "Delivered" },
  ];

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <SEO title="Admin Dashboard" description="AquaPure Admin Dashboard" />

      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/products">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline">
                View Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-success">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Orders</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Low Stock Items</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Reviews</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service Requests</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
