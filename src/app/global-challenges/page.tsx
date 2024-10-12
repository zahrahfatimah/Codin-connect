"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavbarComponent from "@/components/homeComponents/Navbar";
import Image from "next/image";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  authorId: string;
  author?: {
    name: string;
    username: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

const ChallengeCard: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`/api/challenge`);
      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }
      const data: Challenge[] = await response.json();

      setChallenges(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unexpected error", err);
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <>
        <NavbarComponent />
        <div className="flex items-center justify-center min-h-screen flex-col">
          <Image src="/loading.svg" alt="Loading..." width={100} height={100} />
          <p className="font-semibold text-gray-700">Loading challenges...</p>
        </div>
      </>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col min-h-screen p-4 bg-gray-100">
        {/* Container untuk teks dan tombol, lebar sama dengan card */}
        <div className="flex justify-between items-center mb-4 max-w-[1200px] w-full mx-auto px-4">
          <h1 className="text-2xl font-bold text-black">Global challenges</h1>
          <Link href="/create-challenge">
            <button className="bg-blue-700 text-white text-sm rounded px-4 py-2 shadow-md font-mono">
              Create a Challenge
            </button>
          </Link>
        </div>

        {/* Container untuk card, dengan lebar yang sama */}
        <div className="grid grid-cols-1 gap-4 max-w-[1200px] w-full mx-auto mt-2 px-4">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="card bg-white shadow-lg rounded-lg p-6 transition-transform"
            >
              <Link href={`/challenge/${challenge._id}`}>
                <h2 className="text-xl font-bold text-black hover:text-blue-800 transition duration-200">
                  {challenge.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-600 mb-2">
                <Link href={`/profile/${challenge.author?.username}`}>
                  <strong className="hover:text-blue-800 transition duration-200">
                    {challenge.author?.name || "Unknown"}
                  </strong>
                </Link>
              </div>
              <p className="text-gray-700 mb-4 font-mono">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChallengeCard;
