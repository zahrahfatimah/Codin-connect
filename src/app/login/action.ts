"use server";

import { getUserByEmail, getUserByUsername } from "@/db/models/user";
import { redirect } from "next/navigation";
import { z } from "zod";
import { comparePasswordWithHash } from "@/db/utils/bcrypt";
import { createToken } from "@/lib/jwt";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const logout = async () => {
  const cookieStore = cookies();
  cookieStore.delete("token");

  return redirect("/login");
};

export const doLogin = async (formdata: FormData) => {
  const loginInputSchema = z.object({
    loginField: z.string(),
    password: z.string(),
  });

  const loginField = formdata.get("loginField")?.toString() || "";
  const password = formdata.get("password");

  const parseData = loginInputSchema.safeParse({
    loginField,
    password,
  });

  if (!parseData.success) {
    const errorPath = parseData.error.issues[0].path[0];
    const errorMessage = parseData.error.issues[0].message;
    const errorFinalMessage = `${errorPath} - ${errorMessage}`;

    return redirect(`${url}/login?error=${errorFinalMessage}`);
  }

  let user = null;

  user =
    (await getUserByEmail(parseData.data.loginField)) ||
    (await getUserByUsername(parseData.data.loginField));

  if (
    !user ||
    !comparePasswordWithHash(parseData.data.password, user.password)
  ) {
    return redirect(`${url}/login?error=Invalid%20credentials`);
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = createToken(payload);

  cookies().set("token", token, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    sameSite: "strict",
  });

  return redirect(`${url}`);
};
