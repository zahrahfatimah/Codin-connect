"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorMessage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  return (
    <>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-center">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
    </>
  );
}
