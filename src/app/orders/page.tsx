"use client";

import { useRouter } from "next/navigation";
import { Package, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import { useOrderStore } from "@/store/orderStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const orders = useOrderStore((state) => state.getUserOrders());
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ordered":
        return <Badge className="bg-blue-500">Ordered</Badge>;
      case "accepted":
        return <Badge className="bg-purple-500">Accepted</Badge>;
      case "preparing":
        return <Badge className="bg-yellow-500">Preparing</Badge>;
      case "on-the-way":
        return <Badge className="bg-orange-500">On The Way</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Add all items from the order to cart
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        image: item.image,
      });
    });

    router.push("/cart");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h1>
            <p className="text-gray-600 mb-6">Start ordering delicious food from your favorite restaurants</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#ff4d4d] hover:bg-[#ff3333]"
            >
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and reorder from your past orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ff4d4d]/10 p-3 rounded-lg">
                    <ShoppingBag className="text-[#ff4d4d]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {order.items[0]?.restaurantName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock size={14} className="mr-1" />
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <span className="text-sm text-gray-500">
                        Order #{order.id}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{order.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/order/${order.id}`)}
                    >
                      Track
                    </Button>
                    {order.status === "delivered" && (
                      <Button
                        onClick={() => handleReorder(order.id)}
                        className="bg-[#ff4d4d] hover:bg-[#ff3333]"
                      >
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center text-sm text-gray-600">
                      <div
                        className={`w-2 h-2 mr-2 ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Delivered to:</span>{" "}
                  {order.deliveryAddress.hostelBlock}, Room {order.deliveryAddress.roomNumber}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}