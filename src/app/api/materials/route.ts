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
          select: {
            id: true,
            title: true,
            objective: true,
            contentType: true,
            sortOrder: true,
            source: true,
          },
        },
        _count: { select: { subChapters: true } },
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("[GET /api/materials]", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
