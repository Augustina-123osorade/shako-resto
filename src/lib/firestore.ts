import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Dish {
  name: string;
  price: string;
  inStock: boolean;
  favorite: boolean;
  imageUrl: string;
}

const COLLECTION_NAME = "dishes";

export async function addDish(dish: Dish) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), dish);
  return { id: docRef.id, ...dish };
}

export async function getAllDishes() {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Dish & { id: string })[];
}

export async function updateDish(id: string, dish: Partial<Dish>) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, dish);
}

export async function deleteDish(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}