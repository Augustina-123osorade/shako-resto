"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Dish {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  inStock: boolean;
  favorite: boolean;
}

interface CartContextType {
  cart: Dish[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Dish[]>([]);

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === dish.id);
      return exists ? prev : [...prev, dish];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
