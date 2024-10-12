import { readPayload } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getNextChallengeId } from "@/db/models/challenge";

export async function GET(request: NextRequest) {
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

  const nextChallengeId = await getNextChallengeId(userId);

  return NextResponse.json({ nextChallengeId });
}
