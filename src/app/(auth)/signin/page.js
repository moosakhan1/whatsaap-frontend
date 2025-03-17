"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import "./globals.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Redirect, signIn } from "@/app/Action/authAction";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { loginAction } from "@/app/redux/features/auth/auth";
import { toast, Toaster } from "sonner";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const onSubmit = async (obj) => {
    try {
      // console.log(obj);
      const Data = await signIn(obj);
      if (Data.ok) {
        const { data } = await Data.json();
        const user = JSON.stringify(data);
        dispatch(loginAction(data));
        Cookies.set("User", user);
        router.push("/");

        return console.log("good hogia");
      }
      if (!Data.ok) {
        const { error } = await Data.json();
        toast.error(error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#202c33] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#e9edef]">
          Sign In to WhatsApp
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#aebac1]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 bg-[#2a3942] border border-[#394855] rounded-md text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#aebac1]"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                {...register("password")}
                className="block w-full px-3 py-2 bg-[#2a3942] border border-[#394855] rounded-md text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                placeholder="Enter your password"
                required
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-[#aebac1]" />
                ) : (
                  <Eye className="h-5 w-5 text-[#aebac1]" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00a884] hover:bg-[#00bf97] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a884]"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#aebac1]">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#00a884] hover:text-[#00bf97]"
          >
            Sign up
          </Link>
        </p>
        <p className="text-center text-sm text-[#aebac1]">
          Verify your account{" "}
          <Link
            href="/signup"
            className="font-medium text-[#00a884] hover:text-[#00bf97]"
          >
            here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
