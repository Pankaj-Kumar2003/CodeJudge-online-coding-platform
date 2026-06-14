import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json(
        { error: "Missing problemId parameter" },
        { status: 400 },
      );
    }

    // Grab the current user (using our mock development user profile for consistency)
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    // Query all matching historical logs from database storage sorted by newest first
    const history = await prisma.submission.findMany({
      where: {
        problemId: problemId,
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("Failed to read submission history cluster log:", error);
    return NextResponse.json(
      { error: "Internal Server Error history logs" },
      { status: 500 },
    );
  }
}
