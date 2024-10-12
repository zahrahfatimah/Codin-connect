"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import NavbarComponent from "@/components/homeComponents/Navbar";

interface UserData {
  username: string;
  name: string;
  avatarUrl?: string;
}

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/profile/search/user?username=${username}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserData(data[0]);
        } else {
          setError(data.message || "User not found");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Image
          src="/loading.svg"
          alt="loading"
          width={100}
          height={0}
          style={{ height: "auto" }}
        />
        <p className=" font-semibold text-gray-700">Loading...</p>
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="p-4 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Search Results</h1>

        {userData ? (
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
            {/* Avatar */}
            <Image
              src={"/default-avatar.jpg"}
              alt={`${userData.username}'s avatar`}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {/* User Info */}
            <div className="text-center sm:text-left">
              <p className="text-gray-800 text-lg font-semibold">
                <Link href={`/profile/${userData.username}`}>
                  <i>{userData.name}</i>
                </Link>
              </p>
              <p className="text-gray-500 mt-1">
                <Link href={`/profile/${userData.username}`}>
                  @{userData.username}
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No user found.</p>
        )}
      </div>
    </div>
  );
};

const SearchPage: React.FC = () => {
  return (
    <div>
      <NavbarComponent />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen flex-col">
            <Image
              src="/loading.svg"
              alt="loading"
              width={100}
              height={0}
              style={{ height: "auto" }}
            />
            <p className="font-semibold text-gray-700">Loading...</p>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
};

export default SearchPage;
