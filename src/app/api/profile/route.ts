import { getProfileById } from "@/db/models/user";
import { NextResponse } from "next/server";
import { readPayload } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export const GET = async (request: Request) => {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token otorisasi diperlukan" },
        { status: 401 }
      );
    }

    const payload: JwtPayload = readPayload(token);
    const userId = payload.id;

    const userProfile = await getProfileById(userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};
