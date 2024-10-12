"use client";

import { useState, useEffect } from "react";
import ProfileServer from "./profileServer";
import Link from "next/link";
import Navbar from "@/components/homeComponents/Navbar";
import Image from "next/image";

interface User {
  name: string;
  username: string;
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  testCases: string[];
}

interface Solution {
  _id: string;
  solution: string;
  language: string;
  createdAt: string;
  challenge: Challenge;
}

interface Profile {
  name: string;
  username: string;
  following: User[];
  followers: User[];
  userChallenges: Challenge[];
  userSolutions: Solution[];
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const [showModal, setshowModal] = useState(false);
  const [modalType, setModaltype] = useState<"following" | "followers" | null>(
    null
  );
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await ProfileServer();

      setProfile(fetchedProfile as Profile);
    };
    fetchProfile();
  }, []);

  const handleShowFollowing = () => {
    setModaltype("following");
    setshowModal(true);
  };

  const handleShowFollowers = () => {
    setModaltype("followers");
    setshowModal(true);
  };

  const closeModal = () => {
    setshowModal(false);
    setModaltype(null);
  };

  if (!profile)
    return (
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
            Fetching your profile...
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-8">
          {/* Profile Section */}
          <div className="flex items-center mb-8 gap-6">
            <div className="w-24 h-24 border-[0.5px] border-gray-300 rounded-md bg-gray-100">
              {/* Placeholder for user photo */}
              <img
                src="/default-avatar.jpg"
                alt="Profile Photo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Nama dan Stats */}
            <div className="flex h-24 flex-grow justify-between items-center">
              <h2 className="text-2xl font-bold">{profile.name}</h2>

              {/* Stats Section */}
              <div className="mt-2 flex space-x-8 pr-8">
                <div className="text-center">
                  <div className="font-semibold">
                    {profile.userChallenges.length}
                  </div>
                  <div>Challenges</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {profile.userSolutions?.length || "0"}
                  </div>
                  <div>Solutions</div>
                </div>
                <div
                  onClick={handleShowFollowing}
                  className="cursor-pointer text-center"
                >
                  <div className="font-semibold">
                    {profile.following.length}
                  </div>
                  <div>Following</div>
                </div>
                <div
                  onClick={handleShowFollowers}
                  className="cursor-pointer text-center"
                >
                  <div className="font-semibold">
                    {profile.followers.length}
                  </div>
                  <div>Followers</div>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-4 w-11/12 max-w-md relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
                >
                  X
                </button>
                <h2 className="font-semibold mb-4">
                  {modalType === "following" ? "Following" : "Followers"} (
                  {modalType === "following"
                    ? profile.following.length
                    : profile.followers.length}
                  )
                </h2>
                <ul>
                  {(modalType === "following"
                    ? profile.following
                    : profile.followers
                  ).map((user, index) => (
                    <li key={user.username} className="mb-2">
                      <Link href={`/profile/${user.username}`}>
                        <span className="text-black font-semibold">
                          {" "}
                          {user.name}
                        </span>{" "}
                        <span className="text-gray-600 text-sm">
                          ({user.username})
                        </span>
                      </Link>
                      {index <
                        (modalType === "following"
                          ? profile.following
                          : profile.followers
                        ).length -
                          1 && <hr className="my-2 border-gray-300" />}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tabs for Challenges and Solutions */}
          <div className="mt-8">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-4">
                <button
                  onClick={() => setActiveTab("challenges")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "challenges"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  User Challenges
                </button>
                <button
                  onClick={() => setActiveTab("solutions")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "solutions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  User Solutions
                </button>
              </nav>
            </div>

            {/* User Challenges */}
            {activeTab === "challenges" && (
              <div>
                {profile.userChallenges.length === 0 ? (
                  <p>{`You have not created any challenge`}</p>
                ) : (
                  <ul>
                    {profile.userChallenges.map((challenge) => (
                      <div
                        key={challenge._id}
                        className="mt-2 w-full border-[0.5px] border-gray-200 p-2 rounded-sm"
                      >
                        <Link href={`/challenge/${challenge._id}`}>
                          <strong>{challenge.title}</strong>
                        </Link>
                        <p className="font-mono">{challenge.description}</p>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* User Solutions */}
            {activeTab === "solutions" && (
              <div>
                {profile?.userSolutions?.length === 0 ? (
                  <p>{`You have not solved any challenge`}</p>
                ) : (
                  <ul>
                    {profile?.userSolutions?.map((solution) => (
                      <li
                        key={solution._id}
                        className="mt-2 px-2 border-[0.5px] border-gray-200 rounded-md"
                      >
                        <Link href={`/challenge/${solution.challenge._id}`}>
                          <strong>{solution.challenge.title}</strong>
                        </Link>
                        <p className="text-sm text-gray-700">
                          Language: {solution.language}
                        </p>{" "}
                        <br />
                        <pre className="border-slate-200 border-[0.5px]">
                          {solution.solution}
                        </pre>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
