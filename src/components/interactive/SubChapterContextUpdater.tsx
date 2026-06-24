"use client";

import { useEffect } from "react";

interface SubChapterContextUpdaterProps {
  chapterTitle: string;
  subChapterTitle: string;
  subChapterObjective: string;
}

export function SubChapterContextUpdater({
  chapterTitle,
  subChapterTitle,
  subChapterObjective,
}: SubChapterContextUpdaterProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__antigravityContext = {
        chapterTitle,
        subChapterTitle,
        subChapterObjective,
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__antigravityContext = undefined;
      }
    };
  }, [chapterTitle, subChapterTitle, subChapterObjective]);

  return null;
}
