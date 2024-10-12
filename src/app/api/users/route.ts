import { doRegister, searchUserByUsername } from "@/db/models/user";
import { NextResponse } from "next/server";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

const userInputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Must be email format" })
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: "Invalid email format" }
    ),
  password: z.string().min(5, { message: "Must be 5 or more characters long" }),
});

export const POST = async (request: Request) => {
  try {
    const data = await request.json();

    const parseResult = userInputSchema.safeParse(data);

    if (!parseResult.success) {
      const errorIssue = parseResult.error.issues[0];
      const errorPath = errorIssue.path[0];
      const errorMessage = errorIssue.message;

      return NextResponse.json<MyResponse<never>>(
        {
          statusCode: 400,
          error: `${errorPath} - ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    const user = await doRegister(parseResult.data);

    return NextResponse.json<MyResponse<unknown>>(
      {
        statusCode: 201,
        message: "User registered successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return NextResponse.json<MyResponse<never>>(
      {
        statusCode: 500,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await searchUserByUsername(username);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "An error occurred while searching for the user." },
      { status: 500 }
    );
  }
}
