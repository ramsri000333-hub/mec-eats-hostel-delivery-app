"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const createOrder = useOrderStore((state) => state.createOrder);
  
  const [hostelBlock, setHostelBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!isPending && items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, isPending, router]);

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

  if (items.length === 0) {
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 20;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  const handlePlaceOrder = async () => {
    if (!hostelBlock.trim() || !roomNumber.trim()) {
      toast.error("Please enter hostel block and room number");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = createOrder(
      items,
      total,
      { hostelBlock, roomNumber },
      paymentMethod
    );

    clearCart();
    setIsProcessing(false);
    toast.success("Order placed successfully!");
    router.push(`/order/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="-ml-2 mb-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hostelBlock">Hostel Block</Label>
                  <Input
                    id="hostelBlock"
                    placeholder="e.g., A Block, B Block, C Block"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    placeholder="e.g., 101, 202, 303"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center flex-1 cursor-pointer">
                      <Banknote className="mr-3 text-green-600" size={24} />
                      <div>
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">Pay with cash when order arrives</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center flex-1 cursor-pointer">
                      <Wallet className="mr-3 text-purple-600" size={24} />
                      <div>
                        <div className="font-semibold">UPI</div>
                        <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                      <CreditCard className="mr-3 text-blue-600" size={24} />
                      <div>
                        <div className="font-semibold">Credit / Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({items.length})</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (5%)</span>
                  <span className="font-semibold">₹{gst}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-600">
                <div className="mb-1">
                  <strong>Delivery to:</strong>
                </div>
                {hostelBlock && roomNumber ? (
                  <div>{hostelBlock}, Room {roomNumber}</div>
                ) : (
                  <div className="text-gray-400">Enter delivery address above</div>
                )}
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !hostelBlock.trim() || !roomNumber.trim()}
                className="w-full bg-[#ff4d4d] hover:bg-[#ff3333] text-white py-6 text-base font-semibold"
              >
                {isProcessing ? "Processing..." : `Place Order • ₹${total}`}
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