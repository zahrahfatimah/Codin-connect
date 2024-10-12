"use client";

import * as z from "zod";
import Navbar from "@/components/homeComponents/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TestCase {
  input: string;
  expectedOutput: string;
}

export default function CreateChallenge() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "" },
  ]);

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleChange = (
    index: number,
    field: keyof TestCase,
    value: string
  ) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const challengeSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    functionName: z.string().nonempty("Function name is required"),
    parameters: z.string().nonempty("Parameters are required"),
    testCases: z
      .array(
        z.object({
          input: z.string().nonempty("Test case input is required"),
          expectedOutput: z.string().nonempty("Expected output is required"),
        })
      )
      .min(1, "At least one test case is required"),
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      functionName: formData.get("functionName") as string,
      parameters: formData.get("parameters") as string,
      testCases: testCases,
    };

    const validationResult = challengeSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.format());
      return;
    }

    try {
      const response = await fetch("/api/create-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Challenge created successfully");
        const result = await response.json();
        const { newChallengeId } = result;

        router.push(`/challenge/${newChallengeId}`);
      } else {
        console.error("Failed to create challenge");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Form */}
      <div className="flex-1 flex justify-center items-center">
        <form
          className="bg-white p-8 shadow-lg w-full max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 text-sm text-gray-700 rounded-lg border border-black bg-transparent focus:border-black focus:ring-black"
              name="title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2">Description</label>
            <textarea
              className="w-full p-2 text-sm text-gray-700 rounded-lg border border-black bg-transparent focus:border-black focus:ring-black"
              name="description"
              rows={5}
              required
            ></textarea>
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-lg font-bold mb-2">
                Function Name
              </label>
              <input
                type="text"
                className="w-full p-2 text-sm text-gray-700 rounded-lg border bg-transparent focus:border-black focus:ring-black border-black font-mono"
                name="functionName"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-lg font-bold mb-2">Parameters</label>
              <input
                type="text"
                className="w-full p-2 text-sm text-gray-700 rounded-lg border border-black bg-transparent focus:border-black focus:ring-black font-mono"
                name="parameters"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2">Test Cases</label>
            {testCases.map((testCase, index) => (
              <div key={index} className="flex gap-3 mb-2">
                <input
                  type="text"
                  name={`testCase${index + 1}`}
                  className="w-1/2 p-2 text-sm text-gray-700 rounded-lg border border-black bg-transparent focus:border-black focus:ring-black font-mono"
                  placeholder="Place input here. example: 1, 2"
                  value={testCase.input}
                  onChange={(e) => handleChange(index, "input", e.target.value)}
                />
                <input
                  type="text"
                  name={`expectedOutput${index + 1}`}
                  className="w-1/2 p-2 text-sm text-gray-700 rounded-lg border border-black bg-transparent focus:border-black focus:ring-black font-mono"
                  placeholder="Place expected output here. example: 3"
                  value={testCase.expectedOutput}
                  onChange={(e) =>
                    handleChange(index, "expectedOutput", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm pt-1 text-gray-500"
              onClick={addTestCase}
            >
              + Click to add other test case...
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-transparent hover:bg-black hover:text-white text-lg font-bold text-gray-700 p-2 rounded-lg transition duration-300 ease-in-out border border-black"
          >
            Post Challenge
          </button>
        </form>
      </div>
    </div>
  );
}
