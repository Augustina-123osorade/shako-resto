import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  number: string;
  message?: string;
}

interface SaveOrderProps {
  userId?: string | null;
  items: any[];
  customer: CustomerDetails;
  totalAmount: number;
  reference: string;
}

export async function saveOrderToFirebase({
  userId,
  items,
  customer,
  totalAmount,
  reference,
}: SaveOrderProps): Promise<boolean> {
  try {
    await addDoc(collection(db, "orders"), {
      userId: userId || null,
      items,
      customer,
      totalAmount,
      paymentReference: reference,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error saving order:", error);
    return false;
  }
}
