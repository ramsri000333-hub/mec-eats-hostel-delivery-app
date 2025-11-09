"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants } from "@/data/restaurants";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    
    const query = searchQuery.toLowerCase();
    return restaurants.filter((restaurant) => {
      const nameMatch = restaurant.name.toLowerCase().includes(query);
      const cuisineMatch = restaurant.cuisine.toLowerCase().includes(query);
      const menuMatch = restaurant.menu.some((item) =>
        item.name.toLowerCase().includes(query)
      );
      return nameMatch || cuisineMatch || menuMatch;
    });
  }, [searchQuery]);

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
      <Navbar />
      
      {/* Top Center Title */}
      <div className="bg-white border-b-2 border-gray-200 py-4">
        <h1 className="text-center text-3xl font-bold text-[#ff4d4d]">
          MEC EAT
        </h1>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ff4d4d] to-[#ff7b7b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
              <span className="text-sm font-semibold">🎉 Let's Have Some Fun!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              Good Food. Good Mood.
            </h1>
            <p className="text-xl sm:text-2xl font-medium">
              Delivered in Yor Tung.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base bg-white border-0 shadow-lg focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results (${filteredRestaurants.length})` : "All Restaurants"}
          </h2>
          <p className="text-gray-600">
            Order from your favorite food stalls on campus
          </p>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No restaurants found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}