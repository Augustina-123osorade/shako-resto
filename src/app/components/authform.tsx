"use client";

import InputWithIcon from "../ui/input-icon";
import { Mail, Lock, User, Phone } from "lucide-react";

type Props = {
  isLogin: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function AuthForm({ isLogin, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isLogin && (
        <>
          <InputWithIcon
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            required
            icon={User}
          />
          <InputWithIcon
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            required
            icon={Phone}
          />
        </>
      )}

      <InputWithIcon
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
        icon={Mail}
      />

      <InputWithIcon
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
        icon={Lock}
      />

      {!isLogin && (
        <InputWithIcon
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          required
          icon={Lock}
        />
      )}

      <button
        type="submit"
        className="w-full bg-[#f25336] text-white py-2 rounded-md hover:bg-[#f25336]"
      >
        {isLogin ? "Sign in" : "Create Account"}
      </button>
    </form>
  );
}
