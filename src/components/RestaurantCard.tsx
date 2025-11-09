"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Restaurant } from "@/data/restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const vegItemsCount = restaurant.menu.filter((item) => item.isVeg).length;
  const hasNonVeg = restaurant.menu.some((item) => !item.isVeg);

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                {vegItemsCount} Veg
              </Badge>
              {hasNonVeg && (
                <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Non-Veg
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <span className="text-xs text-gray-500 font-medium">
              {restaurant.cuisine}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
