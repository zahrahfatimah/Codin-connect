"use server";

import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const handleRegister = async (formData: FormData) => {
  const name = formData.get("name");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  const body = { name, username, email, password };

  const response = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();
  if (!responseJson) {
    const message = responseJson.error ?? "Something went wrong!";
    return redirect(`/register?error=${message}`);
  }

  return redirect("/login");
};
