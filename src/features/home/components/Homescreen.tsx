"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, LogOut, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api";
import { authHeaders, clearSession, getUser, type AuthUser } from "@/lib/auth";
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
  appName = "Асуулт Quiz Үүсгэгч",
  onGenerateSummary,
  className,
}: HomescreenProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
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

  function logout() {
    clearSession();
    router.push("/");
  }

  // Not signed in? Send them back to the login page instead of showing an
  // empty, broken screen.
  useEffect(() => {
    const current = getUser();
    if (!current) {
      router.push("/");
      return;
    }
    setUser(current);
  }, [router]);

  // Close the account dropdown when clicking anywhere outside it.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadArticles(showAll: boolean) {
    const res = await fetch(apiUrl(`/api/articles${showAll ? "?all=true" : ""}`), {
      headers: authHeaders(),
    });
    if (res.status === 401) return logout();
    if (res.ok) setArticles(await res.json());
  }

  useEffect(() => {
    if (user) loadArticles(showAllArticles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function toggleViewAllArticles() {
    const next = !showAllArticles;
    setShowAllArticles(next);
    loadArticles(next);
    setAccountMenuOpen(false);
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    onGenerateSummary?.(title, content);

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/summarize"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ title, content }),
      });
      if (res.status === 401) return logout();
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Хураангуй үүсгэхэд алдаа гарлаа.");
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
      loadArticles(showAllArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тодорхойгүй алдаа гарлаа.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function openArticle(id: number) {
    const res = await fetch(
      apiUrl(`/api/articles/${id}${showAllArticles ? "?all=true" : ""}`),
      { headers: authHeaders() }
    );
    if (res.status === 401) return logout();
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
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          quizId: detail.quizId,
          answers,
          timeSpentSeconds,
        }),
      });
      if (res.status === 401) return logout();
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Хариултыг илгээхэд алдаа гарлаа.");
      }

      setAttemptResult(data);
      setQuizPhase("submitted");
    } catch (err) {
      setAttemptError(err instanceof Error ? err.message : "Тодорхойгүй алдаа гарлаа.");
      setQuizPhase("answering");
    }
  }

  return (
    <div className={cn("flex h-screen flex-col bg-white", className)}>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-3 sm:h-16 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Image src="/logo.png" alt="Гурван Дэлгэр ХХК" width={347} height={270} className="h-9 w-auto shrink-0 sm:h-12" />
          <span className="hidden truncate text-sm font-medium text-neutral-400 sm:inline">{appName}</span>
        </div>

        <div className="relative shrink-0" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setAccountMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-neutral-100 sm:pr-3"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500 text-sm font-semibold text-white">
              {user?.email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="hidden max-w-[160px] truncate text-sm font-medium text-neutral-700 sm:inline">
              {user?.email}
            </span>
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
              <div className="border-b border-neutral-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-neutral-900">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={toggleViewAllArticles}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Users className="size-3.5" />
                {showAllArticles
                  ? "Зөвхөн өөрийнхийг харах"
                  : "Бүх хэрэглэгчийн Quiz харах"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 border-t border-neutral-100 px-3 py-2 text-left text-sm text-red-600 hover:bg-neutral-50"
              >
                <LogOut className="size-3.5" />
                Гарах
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          title={showAllArticles ? "Бүх хэрэглэгчийн Quiz" : "Түүх"}
          articles={articles}
          onSelectArticle={openArticle}
        />

        <main className="flex-1 overflow-auto bg-neutral-50 p-4 sm:p-8">
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
            <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 shrink-0 text-neutral-900" />
                <h1 className="text-base font-semibold text-neutral-900">
                   Quiz Үүсгэгч
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
