import { z } from "zod";
import { createNewChallenge } from "@/db/models/challenge";
import { readPayload } from "@/lib/jwt";

const challengeSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  functionName: z.string().nonempty("Function name is required"),
  parameters: z.string().nonempty("Parameters are required"),
  testCases: z
    .array(
      z.object({
        input: z.string().nonempty("Test case input is required"),
        expectedOutput: z.string().nonempty("Expected output is required"),
      })
    )
    .min(1, "At least one test case is required"),
});

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
    const validationResult = challengeSchema.safeParse(data);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: validationResult.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newChallenge = {
      ...data,
      authorId: decodedPayload.id,
    };

    const result = await createNewChallenge(newChallenge);

    return new Response(
      JSON.stringify({
        message: "Challenge created successfully",
        newChallengeId: result.insertedId.toString(),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating challenge:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
