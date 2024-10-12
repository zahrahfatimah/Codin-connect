"use client";
import Link from "next/link";
import React from "react";
import { logout } from "@/app/login/action";
import Image from "next/image";
import Search from "./search";

const NavbarComponent: React.FC = () => {
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout();
  };

  return (
    <div className="bg-white h-20 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between border backdrop-blur-md z-50 shadow-md">
      {/* Logo */}
      <div className="flex items-center mb-4 md:mb-0">
        <Link href="/">
          <Image
            src="/logo-coding-connect.png"
            alt="Logo"
            height={50}
            width={150}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Search Component */}
      <Search />

      {/* Navigation */}
      <div className="flex space-x-4 md:space-x-8 items-center">
        <Link href="/global-challenges">
          <span className="cursor-pointer transition-all hover:text-blue-600">
            Explore
          </span>
        </Link>
        <Link href="/profile">
          <span className="cursor-pointer transition-all hover:text-blue-600">
            Profile
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer transition-all hover:text-red-500 text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavbarComponent;
