"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cartcontent";
import { toast } from "sonner";
import { saveOrderToFirebase } from "@/lib/orders";
import Image from "next/image";

interface FormState {
  name: string;
  email: string;
  address: string;
  number: string;
  message: string;
}

export default function Cart() {
  const [open, setOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    address: "",
    number: "",
    message: "",
  });
  interface CartItem {
  id: string;
  name: string;
  price: string; // or number if you store numbers
  imageUrl: string;
}

  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum: number, item: CartItem) => sum + parseFloat(item.price), 0);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

  if (!publicKey) console.error("Paystack key missing in .env");

  // ✅ Load Paystack script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const reference = `${Date.now()}`; 

  const payWithPaystack = () => {
    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email: form.email,
      amount: Math.round(total * 100),
      currency: "GHS",
      ref: reference,
      channels: ["mobile_money", "card"],
      onClose: () => {
        toast.info("Payment cancelled ❌");
      },
      callback: async (response: any) => {
        toast.success("Payment successful ✅ Saving order...");

        const success = await saveOrderToFirebase({
          userId: null,
          items: cart,
          customer: form,
          totalAmount: total,
          reference: response.reference,
        });

        if (success) {
          toast.success("Order saved! 🎉");
          clearCart();
          closeModal();
        } else {
          toast.error("Payment succeeded but order failed. Contact support ⚠️");
        }
      },
    });

    handler.openIframe();
  };

  const closeModal = () => {
    setOpen(false);
    setCheckoutStep(false);
  };

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
        <ShoppingCart className="h-6 w-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </div>

      <Dialog open={open} onOpenChange={(val) => (val ? setOpen(true) : closeModal())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {checkoutStep && (
                <button onClick={() => setCheckoutStep(false)}>
                  <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-black" />
                </button>
              )}
              <DialogTitle className="text-lg font-semibold">
                {checkoutStep ? "Checkout" : `Your Cart (${cart.length})`}
              </DialogTitle>
            </div>

            <button onClick={closeModal}>
              <X className="h-5 w-5 text-gray-500 hover:text-gray-800" />
            </button>
          </DialogHeader>

          {!checkoutStep ? (
            <>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Your cart is empty 🛒</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto py-2">
                    {cart.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-green-600 font-semibold">GH₵{item.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.success(`${item.name} removed from cart.`);
                          }}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold mt-4 border-t pt-3">
                    <span>Total:</span>
                    <span className="text-green-600">GH₵{total.toFixed(2)}</span>
                  </div>

                  <DialogFooter className="mt-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setCheckoutStep(true)}
                    >
                      Proceed to Checkout
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          ) : (
            <>
              {["name", "email", "address", "number"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label>
                    {field === "number"
                      ? "Telephone Number"
                      : field === "name"
                      ? "Full Name"
                      : field === "email"
                      ? "Email"
                      : "Delivery Address"}
                  </Label>
                  <Input
                    id={field}
                    value={form[field as keyof FormState]}
                    onChange={handleChange}
                    placeholder={
                      field === "name"
                        ? "John Doe"
                        : field === "email"
                        ? "example@gmail.com"
                        : field === "address"
                        ? "123 Main Street, Accra"
                        : "+233 504 388 888"
                    }
                    required
                  />
                </div>
              ))}

              <div className="space-y-1">
                <Label>Message for Owner</Label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Add a note ..."
                  className="h-32 w-full border border-gray-300 p-2 rounded-md focus:border-black focus:ring-0"
                />
              </div>

              <div className="flex justify-between items-center font-semibold text-lg border-t pt-3">
                <span>Total:</span>
                <span className="text-green-600">GH₵{total.toFixed(2)}</span>
              </div>

              <DialogFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={payWithPaystack}
                  disabled={!form.email || !form.name || !form.number}
                >
                  Pay with Mobile Money / Card
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
