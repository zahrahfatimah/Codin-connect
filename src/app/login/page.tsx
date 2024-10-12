"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";
import { LuLaugh } from "react-icons/lu";
import { doLogin } from "./action";
import ErrorMessage from "./ClientFlashComponent";
import { Suspense } from "react";

const Login = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full z-[20] px-5 gap-10 md:gap-20"
    >
      {/* Left Section */}
      <div className="flex flex-col gap-5 justify-center text-center md:text-start">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-4 md:gap-6 text-4xl md:text-6xl font-bold text-black max-w-full md:max-w-[600px] w-auto"
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
          className="text-base md:text-lg text-black my-4 md:my-5 max-w-full md:max-w-[600px]"
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

              {/* Tampilkan Error Message */}
              <Suspense>
                <ErrorMessage />
              </Suspense>
              <form
                action={doLogin}
                className="flex flex-col items-center z-10"
              >
                <h1 className="text-4xl font-bold mb-2">Hello</h1>
                <p className="text-gray-600 mb-6">Sign in to your account</p>

                <div className="w-80 mb-4">
                  <div className="relative mb-4">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Email or Username"
                      className="pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none"
                      name="loginField"
                    />
                  </div>

                  <div className="relative mb-2">
                    <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      className="pl-10 pr-4 py-2 w-full rounded-full shadow-md focus:outline-none"
                      name="password"
                    />
                  </div>

                  <div className="text-center m-6">
                    <div className="text-gray-400 text-sm">
                      Don&apos;t have an account?{" "}
                      <Link href={"/register"} className="text-blue-600">
                        Register
                      </Link>
                    </div>
                  </div>
                </div>

                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-2 px-6 rounded-full shadow-md"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col text-center gap-2 items-center mt-5">
            <h1 className="font-medium text-sm">
              Copyright &copy; 2024 Built by{" "}
              <Link
                href={"https://github.com/geraldsimanullang/codin-connect"}
                className="font-extrabold"
              >
                CodinConnect
              </Link>
            </h1>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
