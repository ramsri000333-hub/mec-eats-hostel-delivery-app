"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, ChefHat, Bike, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore, OrderStatus } from "@/store/orderStore";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [notification, setNotification] = useState<string | null>(null);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/admin/login");
    return null;
  }

  // Simulate new order notifications
  useEffect(() => {
    const newOrders = orders.filter(
      (order) =>
        order.status === "ordered" &&
        new Date(order.createdAt).getTime() > Date.now() - 10000
    );

    if (newOrders.length > 0) {
      setNotification(`${newOrders.length} new order(s) received!`);
      
      // Play notification sound (simulated)
      setTimeout(() => setNotification(null), 5000);
    }
  }, [orders]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const activeOrders = orders.filter((order) => order.status !== "delivered");

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "ordered":
        return <Clock size={18} className="text-blue-600" />;
      case "accepted":
        return <CheckCircle size={18} className="text-purple-600" />;
      case "preparing":
        return <ChefHat size={18} className="text-yellow-600" />;
      case "on-the-way":
        return <Bike size={18} className="text-orange-600" />;
      case "delivered":
        return <CheckCircle size={18} className="text-green-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-purple-100 text-purple-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "on-the-way":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const statusProgression: Record<OrderStatus, OrderStatus | null> = {
    ordered: "accepted",
    accepted: "preparing",
    preparing: "on-the-way",
    "on-the-way": "delivered",
    delivered: null,
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminSidebar />
      
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Notification Banner */}
          {notification && (
            <div className="mb-6 bg-[#ff4d4d] text-white p-4 rounded-lg flex items-center justify-between animate-pulse">
              <div className="flex items-center">
                <Bell size={20} className="mr-3" />
                <span className="font-semibold">{notification}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-[#ff3333]"
                onClick={() => setNotification(null)}
              >
                Dismiss
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Orders</h1>
              <p className="text-gray-600">
                {activeOrders.length} active orders • {orders.length} total orders
              </p>
            </div>

            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="on-the-way">On The Way</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const nextStatus = statusProgression[order.status];
                
                return (
                  <Card key={order.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(order.status)}
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Restaurant</p>
                            <p className="font-semibold">{order.items[0]?.restaurantName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order Time</p>
                            <p className="font-semibold">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Delivery Address</p>
                            <p className="font-semibold">
                              {order.deliveryAddress.hostelBlock}, Room{" "}
                              {order.deliveryAddress.roomNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-semibold capitalize">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 mr-2 ${
                                      item.isVeg ? "bg-green-500" : "bg-red-500"
                                    }`}
                                  />
                                  <span className="text-gray-700">
                                    {item.name} × {item.quantity}
                                  </span>
                                </div>
                                <span className="font-semibold text-gray-900">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-3 pt-3 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total Amount</span>
                            <span className="text-xl font-bold text-[#ff4d4d]">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {nextStatus && (
                          <Button
                            onClick={() => handleStatusChange(order.id, nextStatus)}
                            className="bg-[#ff4d4d] hover:bg-[#ff3333] w-full"
                          >
                            {nextStatus === "accepted" && "Accept Order"}
                            {nextStatus === "preparing" && "Start Preparing"}
                            {nextStatus === "on-the-way" && "Mark Out for Delivery"}
                            {nextStatus === "delivered" && "Mark as Delivered"}
                          </Button>
                        )}

                        {order.status === "delivered" && (
                          <Badge className="bg-green-500 text-white text-center py-2">
                            Order Completed
                          </Badge>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => router.push(`/order/${order.id}`)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-16 text-center">
                <div className="text-gray-400 mb-4">
                  <Clock size={64} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    {filter === "all"
                      ? "No orders have been placed yet"
                      : `No orders with status "${filter}"`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
