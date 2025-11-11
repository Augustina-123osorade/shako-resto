"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/context/cartcontent";

interface CheckoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CheckoutModal({ open, setOpen }: CheckoutModalProps) {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("✅ Order placed successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required placeholder="John Doe" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="johndoe@email.com" />
          </div>

          <div>
            <Label htmlFor="address">Delivery Address</Label>
            <Input id="address" required placeholder="123 Main Street, Accra" />
          </div>

          <div className="flex justify-between items-center font-semibold text-lg border-t pt-3">
            <span>Total:</span>
            <span className="text-green-600">GH₵{total.toFixed(2)}</span>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Confirm Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
