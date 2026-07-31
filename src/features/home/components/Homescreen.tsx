"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api";
import HistorySidebar from "./HistorySidebar";
import ArticleForm from "./ArticleForm";
import ArticleDetail from "./ArticleDetail";
import QuizPanel from "./QuizPanel";
import type {
  ArticleDetailData,
  AttemptResult,
  QuizPhase,
  SavedArticle,
  SubmittedAnswer,
} from "../types";

export interface HomescreenProps {
  appName?: string;
  onGenerateSummary?: (title: string, content: string) => void;
  className?: string;
}

// The main screen: paste an article, generate a summary + quiz, and browse
// past articles from the History sidebar. This file only holds state and
// wiring — the actual UI pieces live in HistorySidebar, ArticleForm,
// ArticleDetail and QuizPanel.
export default function Homescreen({
  appName = "Quiz app",
  onGenerateSummary,
  className,
}: HomescreenProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<SavedArticle[]>([]);

  const [detail, setDetail] = useState<ArticleDetailData | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const [quizPhase, setQuizPhase] = useState<QuizPhase>("closed");
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);

  const canGenerate =
    title.trim().length > 0 && content.trim().length > 0 && !isGenerating;

  async function loadArticles() {
    const res = await fetch(apiUrl("/api/articles"));
    if (res.ok) setArticles(await res.json());
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleGenerate() {
    if (!canGenerate) return;
    onGenerateSummary?.(title, content);

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/summarize"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary.");
      }

      setDetail({
        id: data.articleId,
        quizId: data.quizId,
        title,
        content,
        summary: data.summary,
        questions: data.questions,
      });
      setShowFullContent(false);
      resetQuiz();
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function openArticle(id: number) {
    const res = await fetch(apiUrl(`/api/articles/${id}`));
    if (!res.ok) return;
    const data = await res.json();
    setDetail(data);
    setShowFullContent(false);
    resetQuiz();
  }

  function resetQuiz() {
    setQuizPhase("closed");
    setAttemptResult(null);
    setAttemptError(null);
    setQuizStartedAt(null);
  }

  function backToForm() {
    setDetail(null);
    resetQuiz();
  }

  function startQuiz() {
    setQuizPhase("answering");
    setAttemptResult(null);
    setAttemptError(null);
    setQuizStartedAt(Date.now());
  }

  async function submitAttempt(answers: SubmittedAnswer[]) {
    if (!detail?.quizId) return;

    setQuizPhase("submitting");
    setAttemptError(null);

    try {
      const timeSpentSeconds = quizStartedAt
        ? Math.round((Date.now() - quizStartedAt) / 1000)
        : undefined;

      const res = await fetch(apiUrl("/api/quiz-attempts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: detail.quizId,
          answers,
          timeSpentSeconds,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit answer.");
      }

      setAttemptResult(data);
      setQuizPhase("submitted");
    } catch (err) {
      setAttemptError(err instanceof Error ? err.message : "Something went wrong.");
      setQuizPhase("answering");
    }
  }

  return (
    <div className={cn("flex h-screen flex-col bg-white", className)}>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Гурван Дэлгэр ХХК" width={347} height={270} className="h-12 w-auto" />
          <span className="text-sm font-medium text-neutral-400">{appName}</span>
        </div>
        <div className="size-8 rounded-full bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          articles={articles}
          onSelectArticle={openArticle}
        />

        <main className="flex-1 overflow-auto bg-neutral-50 p-8">
          {detail && quizPhase === "closed" && (
            <button
              type="button"
              onClick={backToForm}
              className="mb-3 flex size-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-200"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}

          {quizPhase !== "closed" && detail ? (
            <QuizPanel
              questions={detail.questions}
              phase={quizPhase}
              onClose={resetQuiz}
              onSaveAndLeave={backToForm}
              onSubmit={submitAttempt}
              onRetry={startQuiz}
              attemptResult={attemptResult}
              attemptError={attemptError}
            />
          ) : (
            <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-neutral-900" />
                <h1 className="text-base font-semibold text-neutral-900">
                  Article Quiz Generator
                </h1>
              </div>

              {!detail && (
                <ArticleForm
                  title={title}
                  content={content}
                  onTitleChange={setTitle}
                  onContentChange={setContent}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  canGenerate={canGenerate}
                  error={error}
                />
              )}

              {detail && (
                <ArticleDetail
                  detail={detail}
                  showFullContent={showFullContent}
                  onToggleFullContent={() => setShowFullContent((v) => !v)}
                  onStartQuiz={startQuiz}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
