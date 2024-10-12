"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  authorId: string;
  author?: string;
  authorUsername: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

const FollowedChallengeCard: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`/api/followed-challenge`);
      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }
      const data: Challenge[] = await response.json();
      setChallenges(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
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
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Image src="/loading.svg" alt="loading" width={100} height={100} />
        <p className="font-semibold text-gray-700">Loading challenges...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center">Error: {error}</p>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen p-4 bg-gray-100">
        {/* Container untuk teks dan tombol, lebar sama dengan card */}
        <div className="flex justify-between items-center mb-4 max-w-[1200px] w-full mx-auto px-4">
          <h1 className="text-2xl font-bold text-black">Feeds</h1>
          <Link href="/create-challenge">
            <button className="bg-blue-700 text-white text-sm rounded px-4 py-2 shadow-md font-mono">
              Create a Challenge
            </button>
          </Link>
        </div>

        {/* Container untuk card, dengan lebar yang sama */}
        <div className="grid grid-cols-1 gap-4 max-w-[1200px] w-full mx-auto mt-2 px-4">
          {challenges.length === 0 ? (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4 font-mono">
                  No challenges created by your followed users.
                </p>
                <Link href="/global-challenges">
                  <button className="bg-blue-700 text-white text-sm rounded px-4 py-2 shadow-md font-mono">
                    Go to Global Challenges
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            challenges.map((challenge) => (
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
                  <Link href={`/profile/${challenge.authorUsername}` || ""}>
                    <strong className="hover:text-blue-800 transition duration-200">
                      {challenge.author || "Unknown"}
                    </strong>
                  </Link>
                </div>
                <p className="text-gray-700 mb-4 font-mono">
                  {challenge.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FollowedChallengeCard;
