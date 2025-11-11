"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, Store, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/components/AdminSidebar";
import { useSession } from "@/lib/auth-client";
import { useOrderStore } from "@/store/orderStore";
import { useAdminStore } from "@/store/adminStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const orders = useOrderStore((state) => state.orders);
  const restaurants = useAdminStore((state) => state.restaurants);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/admin/login");
    }
  }, [session, isPending, router]);

  // Calculate stats
  const todayOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = orders.filter(
    (order) => order.status !== "delivered"
  ).length;

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Orders",
      value: activeOrders,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ordered: "bg-blue-100 text-blue-800",
      accepted: "bg-purple-100 text-purple-800",
      preparing: "bg-yellow-100 text-yellow-800",
      "on-the-way": "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminSidebar />
      
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user.name}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon size={24} className={stat.color} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Orders & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            Order #{order.id}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {order.items[0]?.restaurantName} • {order.items.length} items
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900 mb-2">
                            ₹{order.totalAmount}
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Store className="text-[#ff4d4d] mr-3" size={20} />
                    <span className="text-sm text-gray-600">Total Restaurants</span>
                  </div>
                  <span className="font-bold text-gray-900">{restaurants.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="text-blue-600 mr-3" size={20} />
                    <span className="text-sm text-gray-600">Today's Orders</span>
                  </div>
                  <span className="font-bold text-gray-900">{todayOrders.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="text-orange-600 mr-3" size={20} />
                    <span className="text-sm text-gray-600">Pending Orders</span>
                  </div>
                  <span className="font-bold text-gray-900">{activeOrders}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}