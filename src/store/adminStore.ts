import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restaurants, Restaurant, MenuItem } from '@/data/restaurants';

interface AdminState {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addMenuItem: (restaurantId: string, item: MenuItem) => void;
  updateMenuItem: (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;
  toggleMenuItemAvailability: (restaurantId: string, itemId: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      restaurants: restaurants,
      
      addRestaurant: (restaurant) => {
        set({ restaurants: [...get().restaurants, restaurant] });
      },
      
      updateRestaurant: (id, updates) => {
        set({
          restaurants: get().restaurants.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        });
      },
      
      deleteRestaurant: (id) => {
        set({
          restaurants: get().restaurants.filter((r) => r.id !== id),
        });
      },
      
      addMenuItem: (restaurantId, item) => {
        set({
          restaurants: get().restaurants.map((r) =>
            r.id === restaurantId
              ? { ...r, menu: [...r.menu, item] }
              : r
          ),
        });
      },
      
      updateMenuItem: (restaurantId, itemId, updates) => {
        set({
          restaurants: get().restaurants.map((r) =>
            r.id === restaurantId
              ? {
                  ...r,
                  menu: r.menu.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : r
          ),
        });
      },
      
      deleteMenuItem: (restaurantId, itemId) => {
        set({
          restaurants: get().restaurants.map((r) =>
            r.id === restaurantId
              ? { ...r, menu: r.menu.filter((item) => item.id !== itemId) }
              : r
          ),
        });
      },
      
      toggleMenuItemAvailability: (restaurantId, itemId) => {
        set({
          restaurants: get().restaurants.map((r) =>
            r.id === restaurantId
              ? {
                  ...r,
                  menu: r.menu.map((item) =>
                    item.id === itemId
                      ? { ...item, isAvailable: !item.isAvailable }
                      : item
                  ),
                }
              : r
          ),
        });
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
