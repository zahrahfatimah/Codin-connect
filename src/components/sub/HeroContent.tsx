"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start pt-20">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl font-bold text-black max-w-[600px] w-auto h-auto"
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
          className="text-lg text-black my-5 max-w-[600px]"
        >
          Create and solve programming challenge with your friends.
        </motion.p>
        <Link href="/login">
          <motion.p
            variants={slideInFromLeft(1)}
            className="py-2 bg-blue-500 text-center text-white cursor-pointer rounded-lg max-w-[200px] px-5"
          >
            Join Now
          </motion.p>
        </Link>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      ></motion.div>
    </motion.div>
  );
};

export default HeroContent;
