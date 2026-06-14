import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problemId, code, language, isRunOnly } = body;

    // 1. Fetch the target problem definition schema details
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Target problem context profile not found" },
        { status: 404 },
      );
    }

    // Safely parse out our test cases array structure
    const testCases =
      typeof problem.testCases === "string"
        ? JSON.parse(problem.testCases)
        : problem.testCases;

    // 2. Simulated grading matrix validation processor
    // Maps over your test suite matrices to generate mock sandbox execution instances
    const results = testCases.map(
      (tc: { stdin: string; expectedOutput: string }, index: number) => {
        return {
          case: index + 1,
          status: "Accepted",
          passed: true,
          stdout: tc.expectedOutput,
        };
      },
    );

    // If the request flag specifies this was a 'Run Code' validation call,
    // immediately return the results array without logging anything to PostgreSQL.
    if (isRunOnly) {
      return NextResponse.json({ success: true, results }, { status: 200 });
    }

    // 3. User Resolution Layer
    // Fetch a user or instantiate a fallback profile that matches required schema conditions
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "amit",
          email: "amit@example.com",
          emailVerified: true, // 💡 FIX: Fulfills the strict required boolean validation rule
        },
      });
    }

    // 4. Save the compiled code history directly into the Submission tracking table
    await prisma.submission.create({
      data: {
        problemId: problem.id,
        userId: user.id,
        language: language,
        code: code,
        status: "Accepted",
        runtime: Math.floor(Math.random() * 60) + 15,
        memory: Math.floor(Math.random() * 2000) + 24000,
      },
    });

    return NextResponse.json({ success: true, results }, { status: 201 });
  } catch (error) {
    console.error("Execution Pipeline Crash Error:", error);
    return NextResponse.json(
      { error: "Internal grading pipeline execution fallback error." },
      { status: 500 },
    );
  }
}
