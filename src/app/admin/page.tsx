"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { uploadImage } from "@/lib/cloudinary";
import { addDish, getAllDishes, updateDish, deleteDish } from "@/lib/firestore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";


interface Dish {
  id?: string;
  name: string;
  price: string;
  inStock: boolean;
  favorite: boolean;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string | null;
  items: any[];
  totalAmount: number;
  customer: {
    name: string;
    email: string;
    address: string;
    number: string;
    message?: string;
  };
  paymentReference: string;
  status: string;
  createdAt?: any;
}

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dishName, setDishName] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadDishes();
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const orderList: Order[] = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Order)
      );
      setOrders(orderList);
    } catch (error) {
      console.error("❌ Failed to load orders:", error);
    }
  };

  // ✅ Load dishes from Firestore
  const loadDishes = async () => {
    try {
      const fetchedDishes = await getAllDishes();
      setDishes(fetchedDishes);
    } catch (error) {
      console.error("❌ Failed to load dishes:", error);
      alert("Failed to load dishes from database");
    }
  };

  // ✅ Add new dish
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    if (file.size > 10 * 1024 * 1024) { // 10MB
  alert("File is too large! Please upload an image smaller than 10MB.");
  return;
}

    try {
      // Upload image to Cloudinary
      const compressedFile = await imageCompression(file, {
      maxSizeMB: 1, // target max size (1MB)
      maxWidthOrHeight: 1024, // resize large images down
      useWebWorker: true, // faster & non-blocking
    });

    // ✅ Step 2: Upload compressed image instead
    const imageUrl = await uploadImage(compressedFile);

      // Create new dish object
      const newDish: Dish = {
        name: dishName,
        price,
        inStock,
        favorite: false,
        imageUrl,
      };

      // Save to Firestore
      const savedDish = await addDish(newDish);

      // Update local state
      setDishes((prev) => [...prev, savedDish]);

      // Reset form
      setDishName("");
      setPrice("");
      setFile(null);
      setOpen(false);

      alert("Dish added successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Failed to add dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit dish
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.id) return;
    setLoading(true);

    try {
      let imageUrl = editingDish.imageUrl;

      // If new image is selected, upload to Cloudinary
      if (editFile) {
        imageUrl = await uploadImage(editFile);
      }

      const updatedData = {
        name: editingDish.name,
        price: editingDish.price,
        inStock: editingDish.inStock,
        imageUrl,
      };

      // Update in Firestore
      await updateDish(editingDish.id, updatedData);

      // Update local state
      setDishes((prev) =>
        prev.map((d) =>
          d.id === editingDish.id ? { ...d, ...updatedData } : d
        )
      );

      setEditingDish(null);
      setEditFile(null);
      alert("Dish updated successfully!");
    } catch (error) {
      console.error("❌ Edit failed:", error);
      alert("Failed to update dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle favorite
  const toggleFavorite = async (index: number) => {
    const dish = dishes[index];
    if (!dish.id) return;

    try {
      const newFavoriteStatus = !dish.favorite;

      // Update in Firestore
      await updateDish(dish.id, { favorite: newFavoriteStatus });

      // Update local state
      setDishes((prev) =>
        prev.map((d, i) =>
          i === index ? { ...d, favorite: newFavoriteStatus } : d
        )
      );
    } catch (error) {
      console.error("❌ Failed to toggle favorite:", error);
      alert("Failed to update favorite status");
    }
  };

  // ✅ Delete dish
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((d) => d.id !== id));
      alert("Dish deleted successfully!");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Failed to delete dish");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-4 max-w-6xl mx-auto">
        {/* ✅ Add (+) Button */}
        <div className="flex flex-col gap-5 items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to Admin Page</h1>
          <p className="text-gray-600">Upload Your Images</p>
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> Add Dish
          </Button>
        </div>

        {/* ✅ Modal for Upload Form */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Dish</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="text"
                placeholder="Dish name"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span>In Stock</span>
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Uploading..." : "Save Dish"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ✅ Edit Dish Modal */}
        {editingDish && (
          <Dialog open={true} onOpenChange={() => setEditingDish(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Dish</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleEdit} className="space-y-4">
                <input
                  type="text"
                  value={editingDish.name}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, name: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                  required
                />

                <input
                  type="number"
                  value={editingDish.price}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, price: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                  required
                />

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingDish.inStock}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        inStock: e.target.checked,
                      })
                    }
                  />
                  <span>In Stock</span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-gray-500">
                  Leave empty to keep current image
                </p>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Update Dish"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* ✅ Display Uploaded Dishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish, index) => (
            <div
              key={dish.id}
              className="border rounded-lg p-4 shadow-md flex flex-col items-center relative"
            >
              {/* Image + Favorite toggle overlay */}
              <div className="relative w-full h-40 flex justify-center">
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  width={160}
                  height={160}
                  className="h-40 w-40 object-cover rounded-md"
                  priority
                />
                <button
                  onClick={() => toggleFavorite(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md"
                >
                  <Star
                    size={20}
                    className={
                      dish.favorite
                        ? "text-red-800 fill-red-800"
                        : "text-gray-400"
                    }
                  />
                </button>
              </div>

              <h3 className="mt-2 text-lg font-semibold">{dish.name}</h3>
              <p className="text-gray-700">GH₵{dish.price}</p>
              <p
                className={`text-sm ${
                  dish.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {dish.inStock ? "In Stock" : "Out of Stock"}
              </p>

              <div className="flex gap-2 mt-3 w-full">
                <Button
                  onClick={() => setEditingDish(dish)}
                  className="flex-1"
                  variant="outline"
                >
                  Edit
                </Button>

                <Button
                  onClick={() => dish.id && handleDelete(dish.id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 mb-10">
          <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{order.customer?.name}</td>
                    <td className="p-2">{order.customer?.number}</td>
                    <td className="p-2 font-bold">GH₵{order.totalAmount}</td>
                    <td className="p-2 capitalize text-blue-600">
                      {order.status}
                    </td>
                    <td className="p-2 text-xs">{order.paymentReference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
