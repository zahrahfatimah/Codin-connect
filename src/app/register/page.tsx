"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";
import { LuLaugh } from "react-icons/lu";
import { handleRegister } from "./action";

interface TypeError {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<TypeError>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: TypeError = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    await handleRegister(new FormData(e.target as HTMLFormElement));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full z-[20] px-5 gap-10 md:gap-20"
    >
      {/* Left Section */}
      <div className="flex flex-col gap-5 justify-center text-center md:text-start max-w-lg">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-4 md:gap-6 text-4xl md:text-6xl font-bold text-black"
        >
          <span>
            Welcome to
            <p>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                Codin Connect
              </span>
            </p>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base md:text-lg text-black my-4 md:my-5"
        >
          Create and solve programming challenges with your friends.
        </motion.p>
      </div>

      {/* Right Section */}
      <motion.div
        variants={slideInFromRight(0.8)}
        className="flex justify-center items-center mt-10 md:mt-0"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white border border-white p-10 rounded-xl">
            <div className="relative flex flex-col gap-5 bg-white rounded-lg p-8 max-w-sm border border-black">
              <div className="absolute -top-3 -right-3">
                <LuLaugh className="text-5xl fill-blue-700 stroke-gray-200 rotate-45" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center z-10"
              >
                <h1 className="text-4xl font-bold mb-2">Register</h1>
                <p className="text-gray-600 mb-6">Sign up to get started</p>

                <div className="w-full mb-4">
                  <div className="relative mb-4">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className={`pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none ${
                        errors.name && "border-red-500"
                      }`}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-xs">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="relative mb-4">
                    <i className="fas fa-user-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className={`pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none ${
                        errors.username && "border-red-500"
                      }`}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <span className="text-red-500 text-xs">
                        {errors.username}
                      </span>
                    )}
                  </div>

                  <div className="relative mb-4">
                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none ${
                        errors.email && "border-red-500"
                      }`}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="relative mb-4">
                    <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className={`pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none ${
                        errors.password && "border-red-500"
                      }`}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-xs">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div className="text-center m-6">
                    <div className="text-gray-400 text-sm">
                      Already have an account?
                      <Link href={"/login"} className="text-blue-600">
                        Login
                      </Link>
                    </div>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-2 px-6 rounded-full shadow-md">
                  Sign up
                </button>
              </form>

              <p className="text-xs pr-1 text-center mt-4">
                *By creating an account, you agree to our terms and conditions.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-center gap-2 items-center mt-5">
            <h1 className="font-medium text-sm">
              Copyright &copy; 2024 Built by{" "}
              <Link
                href={"https://github.com/geraldsimanullang/codin-connect"}
                className="font-extrabold"
              >
                CodinConnectDev
              </Link>
            </h1>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
