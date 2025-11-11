"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, X } from "lucide-react";
import { auth } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import AuthForm from "./authform";
import SocialLogin from "../ui/social-login";

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Change this email to your real admin email
  const OWNER_EMAIL = "owner@restaurant.com";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        const confirmPassword = formData.get("confirmPassword") as string;
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const user = userCredential.user;

      // 🚀 Redirect based on email
      if (user.email === OWNER_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/");
      }

      setIsOpen(false);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // 🚀 Redirect based on email
      if (user.email === OWNER_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/");
      }

      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleGuestLogin() {
    setIsOpen(false);
    router.push("/"); // goes to main page
  }

  return (
    <div className="p-4">
      {/* Profile button */}
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-full">
        <User className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              {isLogin ? "Sign in" : "Create Account"}
            </h2>

            {error && (
              <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
            )}

            <AuthForm isLogin={isLogin} onSubmit={handleSubmit} />

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <SocialLogin onGoogleLogin={handleGoogleLogin} isLogin={isLogin} />

            <button
              onClick={handleGuestLogin}
              className="mt-3 w-full text-black py-2 px-4 rounded-md hover:bg-gray-200 transition"
            >
              Continue as Guest
            </button>

            <p className="mt-4 text-sm text-gray-600 text-center">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#f25336] hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
