import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as { role?: string }).role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error session.user.id is injected
    const studentId = session.user.id as string;

    const rawBody: unknown = await req.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { code } = rawBody as Record<string, unknown>;
    if (typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Class code is required" }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    const targetClass = await prisma.classes.findUnique({
      where: { classCode: uppercaseCode },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Class code not found" }, { status: 404 });
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId: targetClass.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this class" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        classId: targetClass.id,
      },
      include: {
        class: true,
      },
    });

    return NextResponse.json({
      message: "Successfully enrolled",
      className: enrollment.class.name,
    }, { status: 201 });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
