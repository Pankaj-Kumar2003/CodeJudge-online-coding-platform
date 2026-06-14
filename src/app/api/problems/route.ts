import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newProblem = await prisma.problem.create({
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        category: body.category || "General",
        // Safely maps the incoming data to the exact 'starterCode' schema field
        starterCode:
          typeof body.templates === "string"
            ? body.templates
            : JSON.stringify(body.templates || {}),
        testCases:
          typeof body.testCases === "string"
            ? body.testCases
            : JSON.stringify(body.testCases || []),
      },
    });

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 },
    );
  }
}
