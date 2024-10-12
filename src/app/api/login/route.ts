import { doLogin } from "@/db/models/user";
import { NextResponse } from "next/server";
import { createToken } from "@/lib/jwt";

export const POST = async (request: Request) => {
  try {
    const { usernameOrEmail, password } = await request.json(); 

    const user = await doLogin(usernameOrEmail, password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ id: user._id, email: user.email });
    return NextResponse.json({ token }, { status: 200 });
    
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};