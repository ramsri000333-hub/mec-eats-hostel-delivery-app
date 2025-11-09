"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ChefHat, Bike, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore, OrderStatus } from "@/store/orderStore";

const statusSteps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "ordered", label: "Order Placed", icon: CheckCircle2 },
  { status: "accepted", label: "Accepted", icon: Clock },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "on-the-way", label: "On The Way", icon: Bike },
  { status: "delivered", label: "Delivered", icon: Home },
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const [order, setOrder] = useState(getOrderById(params.id));

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Auto-update order status for demo
  useEffect(() => {
    if (order.status === "delivered") return;

    const statusProgression: OrderStatus[] = ["ordered", "accepted", "preparing", "on-the-way", "delivered"];
    const currentIndex = statusProgression.indexOf(order.status);
    
    if (currentIndex < statusProgression.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusProgression[currentIndex + 1];
        updateOrderStatus(params.id, nextStatus);
        setOrder(getOrderById(params.id));
      }, 5000); // Update every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [order.status, params.id, updateOrderStatus, getOrderById]);

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {order.status === "delivered" ? "Order Delivered!" : "Order Placed Successfully!"}
          </h1>
          <p className="text-gray-600">
            Order ID: <span className="font-semibold">#{order.id}</span>
          </p>
        </div>

        {/* Order Status Timeline */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
          
          <div className="relative">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.status} className="flex items-start mb-8 last:mb-0">
                  {/* Timeline Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-6 top-12 w-0.5 h-16 ${
                        isCompleted ? "bg-[#ff4d4d]" : "bg-gray-300"
                      }`}
                    />
                  )}
                  
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      isCompleted
                        ? "bg-[#ff4d4d] border-[#ff4d4d] text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-[#ff4d4d]/20" : ""}`}
                  >
                    <Icon size={20} />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <h3
                      className={`font-semibold ${
                        isCompleted ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <p className="text-sm text-[#ff4d4d] mt-1">
                        {step.status === "ordered" && "Your order has been placed"}
                        {step.status === "accepted" && "Restaurant is preparing your order"}
                        {step.status === "preparing" && "Your food is being cooked"}
                        {step.status === "on-the-way" && "Delivery person is on the way"}
                        {step.status === "delivered" && "Order has been delivered"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  <div
                    className={`w-3 h-3 mt-1 border flex items-center justify-center ${
                      item.isVeg ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="font-semibold">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">Hostel Block:</span> {order.deliveryAddress.hostelBlock}
            </p>
            <p>
              <span className="font-semibold">Room Number:</span> {order.deliveryAddress.roomNumber}
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {order.paymentMethod === "cash" && "Cash on Delivery"}
              {order.paymentMethod === "upi" && "UPI"}
              {order.paymentMethod === "card" && "Card"}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            className="flex-1"
          >
            View All Orders
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-[#ff4d4d] hover:bg-[#ff3333]"
          >
            Order Again
          </Button>
        </div>
      </div>
    </div>
  );
}
