import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as { role?: string }).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error session.user.id is injected
    const teacherId = session.user.id as string;

    const rawBody: unknown = await req.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { name } = rawBody as Record<string, unknown>;
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Class name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 50) {
      return NextResponse.json({ error: "Class name must be 50 characters or less" }, { status: 400 });
    }

    // Generate unique class code
    let generatedCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await prisma.classes.findUnique({
        where: { classCode: generatedCode },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Could not generate unique code, try again" }, { status: 500 });
    }

    const newClass = await prisma.classes.create({
      data: {
        name: trimmedName,
        classCode: generatedCode,
        teacherId,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
