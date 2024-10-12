import { getChallenges } from "@/db/models/challenge";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  try {
    const cookieHeader = request.headers.get("cookie");

    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const challenges = await getChallenges();

    return new Response(JSON.stringify(challenges), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
