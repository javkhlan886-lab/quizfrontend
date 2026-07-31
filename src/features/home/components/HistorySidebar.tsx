"use client";

import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedArticle } from "../types";

// Left-side panel that lists every article you've generated before.
export interface HistorySidebarProps {
  open: boolean;
  onToggle: () => void;
  articles: SavedArticle[];
  onSelectArticle: (id: number) => void;
}

export default function HistorySidebar({
  open,
  onToggle,
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
          <span className="text-sm font-semibold text-neutral-900">History</span>
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
            <span className="px-2 py-1.5 text-xs text-neutral-400">No articles yet</span>
          )}
          {articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onSelectArticle(article.id)}
              title={article.summary}
              className="truncate rounded-md px-2 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {article.title}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
