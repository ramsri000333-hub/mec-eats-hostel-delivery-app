"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import MenuItemCard from "@/components/MenuItemCard";
import { restaurants } from "@/data/restaurants";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useEffect } from "react";

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  
  const restaurant = restaurants.find((r) => r.id === params.id);

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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menu>);

  const categories = Object.keys(menuByCategory);
  const totalCartItems = getTotalItems();
  const totalCartPrice = getTotalPrice();

  // Check if cart has items from this restaurant
  const hasItemsFromThisRestaurant = items.some(
    (item) => item.restaurantId === restaurant.id
  );
  const cartRestaurant = items[0]?.restaurantName;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-64 h-48 rounded-xl overflow-hidden">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                  <Star size={16} className="fill-green-500 text-green-500" />
                  <span className="font-semibold text-green-700">{restaurant.rating}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                
                <Badge variant="outline">{restaurant.cuisine}</Badge>
              </div>

              {items.length > 0 && !hasItemsFromThisRestaurant && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  Your cart contains items from <strong>{cartRestaurant}</strong>. 
                  Adding items from this restaurant will clear your current cart.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#ff4d4d]">
                {category}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {menuByCategory[category].map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Button
              onClick={() => router.push("/cart")}
              className="w-full bg-[#ff4d4d] hover:bg-[#ff3333] text-white py-6 text-base font-semibold flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart size={20} />
                <span>{totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}</span>
              </div>
              <span>View Cart • ₹{totalCartPrice}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}