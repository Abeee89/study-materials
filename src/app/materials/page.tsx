import { prisma } from "@/lib/prisma";
import MaterialsClient from "./MaterialsClient";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subChapters: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const serialized = chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    sortOrder: ch.sortOrder,
    color: ch.color,
    level: ch.level,
    subChapters: ch.subChapters.map((sub) => ({
      id: sub.id,
      title: sub.title,
      objective: sub.objective,
      content: sub.content,
      source: sub.source,
      sortOrder: sub.sortOrder,
    })),
  }));

  return <MaterialsClient chapters={serialized} />;
}
