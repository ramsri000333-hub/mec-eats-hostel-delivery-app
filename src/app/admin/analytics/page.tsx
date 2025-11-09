"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, DollarSign, Package, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useAdminStore } from "@/store/adminStore";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const restaurants = useAdminStore((state) => state.restaurants);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/admin/login");
    return null;
  }

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Today's stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Weekly revenue data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toDateString());
    }
    return days;
  };

  const last7Days = getLast7Days();
  const weeklyData = last7Days.map((day) => {
    const dayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === day
    );
    const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      name: new Date(day).toLocaleDateString("en-IN", { weekday: "short" }),
      revenue,
      orders: dayOrders.length,
    };
  });

  // Top selling items
  const itemSales: Record<string, { count: number; revenue: number; name: string }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemSales[item.id]) {
        itemSales[item.id] = { count: 0, revenue: 0, name: item.name };
      }
      itemSales[item.id].count += item.quantity;
      itemSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Restaurant revenue distribution
  const restaurantRevenue: Record<string, number> = {};
  orders.forEach((order) => {
    const restaurantName = order.items[0]?.restaurantName || "Unknown";
    if (!restaurantRevenue[restaurantName]) {
      restaurantRevenue[restaurantName] = 0;
    }
    restaurantRevenue[restaurantName] += order.totalAmount;
  });

  const restaurantData = Object.entries(restaurantRevenue).map(([name, value]) => ({
    name,
    value,
  }));

  // Order status distribution
  const statusDistribution = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusData = Object.entries(statusDistribution).map(([name, value]) => ({
    name: name.replace("-", " ").toUpperCase(),
    value,
  }));

  const COLORS = ["#ff4d4d", "#fb923c", "#fbbf24", "#34d399", "#60a5fa"];

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+8.2%",
    },
    {
      title: "Avg Order Value",
      value: `₹${avgOrderValue}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3.1%",
    },
    {
      title: "Active Restaurants",
      value: restaurants.length,
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "5 total",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminSidebar />
      
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Sales insights and performance metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon size={24} className={stat.color} />
                      </div>
                      <span className="text-sm text-green-600 font-semibold">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weekly Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ff4d4d"
                      strokeWidth={2}
                      name="Revenue (₹)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Orders Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#ff4d4d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Restaurant Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={restaurantData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ₹${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {restaurantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#ff4d4d] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.count} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{item.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Today's Orders</p>
                  <p className="text-3xl font-bold text-blue-900">{todayOrders.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold mb-1">Today's Revenue</p>
                  <p className="text-3xl font-bold text-green-900">₹{todayRevenue}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    Avg Order Value Today
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    ₹{todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
