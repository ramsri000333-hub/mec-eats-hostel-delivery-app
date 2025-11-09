"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { Restaurant } from "@/data/restaurants";

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useAdminStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    rating: 4.0,
    deliveryTime: "20-25 min",
    cuisine: "",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/admin/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRestaurant) {
      updateRestaurant(editingRestaurant.id, formData);
      setEditingRestaurant(null);
    } else {
      const newRestaurant: Restaurant = {
        id: Date.now().toString(),
        ...formData,
        menu: [],
      };
      addRestaurant(newRestaurant);
      setIsAddDialogOpen(false);
    }
    
    setFormData({
      name: "",
      description: "",
      image: "",
      rating: 4.0,
      deliveryTime: "20-25 min",
      cuisine: "",
    });
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      cuisine: restaurant.cuisine,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      deleteRestaurant(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminSidebar />
      
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants</h1>
              <p className="text-gray-600">Manage food stalls and restaurants</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ff4d4d] hover:bg-[#ff3333]">
                  <Plus size={20} className="mr-2" />
                  Add Restaurant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Restaurant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Input
                      id="cuisine"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Input
                        id="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                        placeholder="20-25 min"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-[#ff4d4d] hover:bg-[#ff3333]">
                    Add Restaurant
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={!!editingRestaurant} onOpenChange={(open) => !open && setEditingRestaurant(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Restaurant</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Restaurant Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-cuisine">Cuisine Type</Label>
                  <Input
                    id="edit-cuisine"
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-rating">Rating</Label>
                    <Input
                      id="edit-rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-deliveryTime">Delivery Time</Label>
                    <Input
                      id="edit-deliveryTime"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-[#ff4d4d] hover:bg-[#ff3333]">
                  Update Restaurant
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⭐ {restaurant.rating}</span>
                    <span>{restaurant.deliveryTime}</span>
                    <span className="font-semibold">{restaurant.cuisine}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                    >
                      <Eye size={16} className="mr-2" />
                      Menu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(restaurant)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(restaurant.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
