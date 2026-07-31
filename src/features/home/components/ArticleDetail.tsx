"use client";

import { BookOpen, FileText } from "lucide-react";
import type { ArticleDetailData } from "../types";

const CONTENT_PREVIEW_LENGTH = 220;

// Shows the summary + article text for one article, with a button to start
// its quiz. The quiz itself takes over the screen — see QuizPanel.
export interface ArticleDetailProps {
  detail: ArticleDetailData;
  showFullContent: boolean;
  onToggleFullContent: () => void;
  onStartQuiz: () => void;
}

export default function ArticleDetail({
  detail,
  showFullContent,
  onToggleFullContent,
  onStartQuiz,
}: ArticleDetailProps) {
  const isLongContent = detail.content.length > CONTENT_PREVIEW_LENGTH;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        <BookOpen className="size-3.5" />
        Summarized content
      </div>
      <h2 className="mt-2 text-lg font-semibold text-neutral-900">{detail.title}</h2>
      <p className="mt-1 text-sm text-neutral-600">{detail.summary}</p>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        <FileText className="size-3.5" />
        Article Content
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        {showFullContent || !isLongContent
          ? detail.content
          : `${detail.content.slice(0, CONTENT_PREVIEW_LENGTH)}...`}
      </p>
      {isLongContent && (
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onClick={onToggleFullContent}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            {showFullContent ? "See less" : "See more"}
          </button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onStartQuiz}
          disabled={detail.questions.length === 0}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
        >
          Take a quiz
        </button>
      </div>
    </div>
  );
}
