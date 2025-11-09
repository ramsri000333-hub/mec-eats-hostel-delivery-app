import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

// Mock user database
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'user@meceats.com',
    password: 'password123',
    name: 'John Doe',
    phone: '9876543210',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@meceats.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '3',
    email: 'sriramthanapal@gmail.com',
    password: 'qwerty123',
    name: 'Sriram Thanapal',
    phone: '9876543211',
    role: 'user',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: '3',
        email: 'sriramthanapal@gmail.com',
        name: 'Sriram Thanapal',
        phone: '9876543211',
        role: 'user',
      },
      isAuthenticated: true,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password && u.role === 'user'
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      signup: async (email: string, password: string, name: string, phone?: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email);
        if (existingUser) {
          return false;
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          phone,
          role: 'user',
        };
        
        mockUsers.push({ ...newUser, password });
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      adminLogin: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const admin = mockUsers.find(
          (u) => u.email === email && u.password === password && u.role === 'admin'
        );
        
        if (admin) {
          const { password: _, ...adminWithoutPassword } = admin;
          set({ user: adminWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);