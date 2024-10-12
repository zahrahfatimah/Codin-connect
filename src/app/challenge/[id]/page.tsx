"use client";

import { getChallengeById } from "@/db/models/challenge";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/homeComponents/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ObjectId } from "mongodb";

export type TestCaseModel = {
  input: string;
  expectedOutput: string;
};

export type ChallengeModel = {
  _id: ObjectId;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  testCases: TestCaseModel[];
  author: string;
};

export default function Challenge() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeModel | undefined>(
    undefined
  );

  const getChallenge = async () => {
    try {
      const fetchedChallenge = await getChallengeById(id);
      if (!fetchedChallenge) {
        throw new Error("Challenge not found");
      }
      setChallenge(fetchedChallenge);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChallenge();
  }, [id]);

  return (
    <>
      {challenge ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex justify-center bg-gray-100">
            <div className="max-w-7xl w-full p-8 flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{challenge.title}</h1>
                <Link href={`/solve/${id}`}>
                  <button className="bg-black text-white px-6 py-2 rounded-md">
                    Solve
                  </button>
                </Link>
              </div>
              {/* Menambahkan nama penulis di sini */}
              <div className="text-xs text-gray-500 mb-5">
                <strong></strong> {challenge.author || "Unknown"}
              </div>
              <p className="text-lg mb-6">{challenge.description}</p>
              <h2 className="text-xl font-semibold mb-2">Test Cases:</h2>
              <div className="space-y-4">
                {challenge.testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow rounded-md border border-gray-200"
                  >
                    <p className="font-medium font-title">
                      <span className="text-gray-500 font-title">Input:</span>{" "}
                      {testCase.input}
                    </p>
                    <p className="font-medium font-title">
                      <span className="text-gray-500 font-title">
                        Expected Output:
                      </span>{" "}
                      {testCase.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen flex-col">
            <Image
              src="/loading.svg"
              alt=""
              width={100}
              height={0}
              style={{ height: "auto" }}
            />
            <p className=" font-semibold text-gray-700">
              Loading challanges....
            </p>
          </div>
        </>
      )}
    </>
  );
}
