"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartcontent"; // ✅ Global Cart Context
import Image from "next/image";

interface Dish {
  id: string;
  name: string;
  price: string;
  inStock: boolean;
  favorite: boolean;
  imageUrl: string;
}

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // ✅ Access global cart from context
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dishes"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Dish[];
        setDishes(data);
      } catch (error) {
        console.error("❌ Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // ❤️ Toggle favorite
  const toggleFavorite = (id: string) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === id ? { ...dish, favorite: !dish.favorite } : dish
      )
    );
  };

  // 🛒 Add to cart and show toast
  const handleAddToCart = (dish: Dish) => {
    const exists = cart.some((item) => item.id === dish.id);
    if (!exists) {
      addToCart(dish); // ✅ use global function
      toast.success(`${dish.name} added to cart 🛒`);
    } else {
      toast.info(`${dish.name} is already in your cart.`);
    }
    setSelectedDish(null); // Close modal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🍽️ Available Dishes
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading dishes...</p>
      ) : dishes.length === 0 ? (
        <p className="text-center text-gray-500">No dishes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-lg overflow-hidden relative"
            >
              {/* ❤️ Favorite Icon */}
              <button
                onClick={() => toggleFavorite(dish.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition z-10"
              >
                <Heart
                  className={`h-5 w-5 ${
                    dish.favorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>

              {/* 🖼️ Dish image - opens modal */}
              <div
                className="relative w-full h-52 overflow-hidden cursor-pointer"
                onClick={() => setSelectedDish(dish)}
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* 📝 Dish details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{dish.name}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  {dish.inStock ? "Available" : "Out of stock"}
                </p>
                <p className="text-green-600 font-semibold text-lg">
                  GH₵{dish.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🍽️ Dish Modal */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedDish.name}
                </DialogTitle>
              </DialogHeader>

              <div className="relative w-full h-64 rounded-md overflow-hidden mb-4">
                <Image
                  src={selectedDish.imageUrl}
                  alt={selectedDish.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <p className="text-lg font-medium text-green-600">
                GH₵{selectedDish.price}
              </p>
              <p
                className={`text-sm mt-1 ${
                  selectedDish.inStock ? "text-green-500" : "text-red-500"
                }`}
              >
                {selectedDish.inStock ? "In stock" : "Out of stock"}
              </p>

              <DialogFooter className="mt-4">
                <Button
                  disabled={!selectedDish.inStock}
                  onClick={() => handleAddToCart(selectedDish)}
                >
                  🛒 Add to Cart
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
