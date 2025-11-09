"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/data/restaurants";
import { useCartStore } from "@/store/cartStore";

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export default function MenuItemCard({ item, restaurantId, restaurantName }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
      restaurantId,
      restaurantName,
      image: item.image,
    });
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 border-2 flex items-center justify-center ${
                  item.isVeg ? "border-green-500" : "border-red-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {item.name}
              </h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{item.price}
            </span>
            
            {!item.isAvailable ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : quantity > 0 ? (
              <div className="flex items-center space-x-2 bg-[#ff4d4d] text-white rounded-lg p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-[#ff3333] text-white"
                  onClick={handleDecrement}
                >
                  <Minus size={14} />
                </Button>
                <span className="font-semibold w-6 text-center">{quantity}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-[#ff3333] text-white"
                  onClick={handleIncrement}
                >
                  <Plus size={14} />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-semibold"
                onClick={handleAdd}
              >
                Add
              </Button>
            )}
          </div>
        </div>
        
        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Card>
  );
}
