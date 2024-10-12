"use client";

import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  username: string;
}

interface FollowButtonProps {
  followUserId: string;
  fetchProfile: () => void;
  currentFollowers: User[];
  ownId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  followUserId,
  fetchProfile,
  currentFollowers,
  ownId,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const isAlreadyFollowing = currentFollowers.some(
      (follower) => follower._id === ownId
    );
    setIsFollowing(isAlreadyFollowing);
  }, [currentFollowers, ownId]);

  const handleFollow = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followUserId }),
        credentials: "include",
      });

      if (response.ok) {
        setIsFollowing((prev) => !prev);
        fetchProfile();
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (followUserId && ownId && followUserId !== ownId) {
    return (
      <button
        onClick={handleFollow}
        className={`px-3 py-1 text-white text-sm font-bold rounded ${
          isFollowing ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    );
  }

  return null;
};

export default FollowButton;
