"use client";

import { FaGoogle } from "react-icons/fa";

type Props = {
  onGoogleLogin: () => void;
  isLogin: boolean;
};

export default function SocialLogin({ onGoogleLogin, isLogin }: Props) {
  return (
    <button
      onClick={onGoogleLogin}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100"
    >
      <FaGoogle className="w-5 h-5" />
      {isLogin ? "Sign in with Google" : "Sign up with Google"}
    </button>
  );
}
