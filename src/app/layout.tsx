import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodinConnect",
  description: "Create and solve programming challenge with your friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#ffff] overflow-y-scroll overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
