import { NextResponse, NextRequest } from "next/server";
import { followUser } from "@/db/models/follow";
import { readPayload } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie ? tokenCookie.value : null;
    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const payload = readPayload(token);
    const userId = payload.id;

    const { followUserId } = await request.json();

    if (!followUserId) {
      return NextResponse.json(
        { error: "userId dan followUserId diperlukan" },
        { status: 400 }
      );
    }

    await followUser(userId, followUserId);

    return NextResponse.json(
      { message: "Berhasil mengikuti pengguna" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan" },
      { status: 500 }
    );
  }
}
