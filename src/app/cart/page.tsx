"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function CartPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

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

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 20 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + deliveryFee + gst;

  const handleIncrement = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrement = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity - 1);
  };

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items from restaurants to get started</p>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="-ml-2 mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">
                  {items[0]?.restaurantName}
                </h2>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 border flex items-center justify-center ${
                              item.isVeg ? "border-green-500" : "border-red-500"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          </div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 -mt-1"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                        
                        <div className="flex items-center space-x-2 bg-[#ff4d4d] text-white rounded-lg p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-[#ff3333] text-white"
                            onClick={() => handleDecrement(item.id, item.quantity)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="font-semibold w-6 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-[#ff3333] text-white"
                            onClick={() => handleIncrement(item.id, item.quantity)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bill Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              
              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#ff4d4d] hover:bg-[#ff3333] text-white py-6 text-base font-semibold"
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing order, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}