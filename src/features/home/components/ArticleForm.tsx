"use client";

import { FileText } from "lucide-react";

// The "type or paste an article" form that starts a new summary + quiz.
export interface ArticleFormProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  error: string | null;
}

export default function ArticleForm({
  title,
  content,
  onTitleChange,
  onContentChange,
  onGenerate,
  isGenerating,
  canGenerate,
  error,
}: ArticleFormProps) {
  return (
    <>
      <p className="mt-1 text-sm text-neutral-500">
        Доор мэдээллээ буулгаад хураангуй, quiz асуулт шууд үүсгээрэй.
        Нийтлэлүүд чинь Түүх хэсэгт хадгалагдаж, дараа хэзээ ч эргэж харах
        боломжтой.
      </p>

      <div className="mt-5 flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <FileText className="size-3.5" />
          Гарчиг
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Гарчгаа бичээрэй..."
          className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <FileText className="size-3.5" />
          Агуулга
        </label>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Текстээ энд буулгаарай..."
          rows={5}
          className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors disabled:cursor-not-allowed enabled:bg-violet-600 enabled:text-white enabled:hover:bg-violet-700 sm:w-auto"
        >
          {isGenerating ? "Үүсгэж байна..." : "Quiz үүсгэх"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </>
  );
}
