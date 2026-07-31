"use client";

import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedArticle } from "../types";

// Left-side panel that lists every article you've generated before (or, when
// the "view all users' quizzes" toggle is on, everyone's).
export interface HistorySidebarProps {
  open: boolean;
  onToggle: () => void;
  title?: string;
  articles: SavedArticle[];
  onSelectArticle: (id: number) => void;
}

export default function HistorySidebar({
  open,
  onToggle,
  title = "Түүх",
  articles,
  onSelectArticle,
}: HistorySidebarProps) {
  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-neutral-200 py-3 transition-all",
        open ? "w-56 px-3" : "w-12 items-center"
      )}
    >
      <div className={cn("flex items-center", open ? "justify-between" : "justify-center")}>
        {open && (
          <span className="text-sm font-semibold text-neutral-900">{title}</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex size-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      {open && (
        <div className="mt-2 flex flex-col overflow-y-auto">
          {articles.length === 0 && (
            <span className="px-2 py-1.5 text-xs text-neutral-400">Одоогоор өгүүлэл алга</span>
          )}
          {articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onSelectArticle(article.id)}
              title={article.summary}
              className="rounded-md px-2 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
            >
              <span className="block truncate">{article.title}</span>
              {article.author_email && (
                <span className="block truncate text-xs text-neutral-400">
                  {article.author_email}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
