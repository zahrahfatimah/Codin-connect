
"use server"

import { cookies } from "next/headers";
import { getProfile } from "./action";

interface User {
  name: string; 
  username: string; 
}

interface Profile {
  name: string; 
  username: string; 
  following: User[]; 
  followers: User[]; 
}

const ProfileServer = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let profile: Profile | null = null;
  if (token) {
    profile = await getProfile(token); 
  }

  return profile; 
};

export default ProfileServer;
