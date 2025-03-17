"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import { Toaster, toast } from "sonner";

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Avatar from "@/app/conponents/Avatar";
import "./globals.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signUp } from "@/app/Action/authAction";
import VerifyModale from "@/app/conponents/verifyModale";
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hover, setHover] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleAvatarUpload = (file) => {
    const reader = new FileReader();
    console.log(file);
    setFile(file);
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const showAntdModal = (Email) => {
    NiceModal.show(VerifyModale, { email: Email });
  };

  const submitData = async (obj) => {
    try {
      const formData = new FormData();
      const File = file;
      const firstName = obj.firstName;
      const email = obj.email;
      const password = obj.password;
      formData.append("fileName", File.name);
      formData.append("fileInput", file);
      formData.append("firstName", firstName);
      formData.append("password", password);
      formData.append("email", email);
      const res = await signUp(formData);
      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error);
      }
      toast.success("We have sent you email");
      return showAntdModal(email);
    } catch (errr) {
      toast.error("Upload Image");
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
          Create a WhatsApp Account
        </h2>
        <form onSubmit={handleSubmit(submitData)} className="space-y-4">
          <div className="flex justify-center   ">
            <div
              className="relative rounded-full   overflow-hidden"
              style={{ width: 50, height: 50 }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={avatar || `/placeholder.svg`}
                alt={"asad"}
                className="w-full h-full object-cover "
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${
                  hover ? "opacity-100" : "opacity-0"
                }`}
              >
                <Plus className="text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#aebac1]"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="firstName"
              {...register("firstName")}
              // value={name}
              // onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2a3942] border border-[#394855] rounded-md text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              placeholder="Enter your name"
              required
            />
          </div>
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
                placeholder="Create a password"
                required
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                // onClick={() => setShowPassword(!showPassword)}
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#aebac1]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#00a884] hover:text-[#00bf97]"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
