import { createOrUpdateNewSolution } from "@/db/models/solution";
import { readPayload } from "@/lib/jwt";

export const POST = async (request: Request) => {
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

    let decodedPayload;
    try {
      decodedPayload = readPayload(token);
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();

    const { solution, challengeId, language } = data;

    if (!solution || !challengeId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newSolution = await createOrUpdateNewSolution({
      authorId: decodedPayload.id,
      challengeId,
      solution,
      language,
    });

    return new Response(
      JSON.stringify({ message: "Solution created", solution: newSolution }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating solution:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
