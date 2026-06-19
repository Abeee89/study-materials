import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        subChapters: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ chapters }, { status: 200 });
  } catch (error) {
    console.error("Materials API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
