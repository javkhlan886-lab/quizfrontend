"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleX, RotateCcw, Save, Sparkles, X } from "lucide-react";
import type { AttemptResult, QuizPhase, QuizQuestion, SubmittedAnswer } from "../types";

// The "Quick test" card: takes over the screen while a quiz is being taken
// or just finished. Picking an option immediately answers that question and
// moves to the next one — the last question submits the whole quiz right
// away, no separate "Submit" button.
export interface QuizPanelProps {
  questions: QuizQuestion[];
  phase: QuizPhase;
  onClose: () => void;
  onSaveAndLeave: () => void;
  onSubmit: (answers: SubmittedAnswer[]) => void;
  onRetry: () => void;
  attemptResult: AttemptResult | null;
  attemptError: string | null;
}

export default function QuizPanel({
  questions,
  phase,
  onClose,
  onSaveAndLeave,
  onSubmit,
  onRetry,
  attemptResult,
  attemptError,
}: QuizPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Every time a fresh attempt starts, forget the previous picks.
  useEffect(() => {
    if (phase === "answering") {
      setCurrentIndex(0);
      setAnswers({});
      setConfirmCancel(false);
    }
  }, [phase]);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isTaking = phase === "answering" || phase === "submitting";

  function selectOption(optionId: number) {
    if (phase !== "answering") return;

    const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(nextAnswers);

    if (isLastQuestion) {
      onSubmit(
        questions.map((q) => ({ questionId: q.id, selectedOptionId: nextAnswers[q.id] }))
      );
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-neutral-900" />
          <h1 className="text-base font-semibold text-neutral-900">
            {phase === "submitted" ? "Шалгалт дууссан" : "Түргэн шалгалт"}
          </h1>
        </div>
        {isTaking && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            disabled={phase === "submitting"}
            className="flex size-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        {phase === "submitted"
          ? "Хэрхэн гүйцэтгэсэнээ харцгаая"
          : " мэдлэгээ шалгах "}
      </p>

      {isTaking && currentQuestion && (
        <div className="mt-4 rounded-lg border border-neutral-200 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              {currentQuestion.question}
            </p>
            <span className="shrink-0 text-xs text-neutral-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {attemptError && <p className="mt-2 text-sm text-red-600">{attemptError}</p>}

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option.id)}
                disabled={phase === "submitting"}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "submitted" && attemptResult && (
        <div className="mt-4 rounded-lg border border-neutral-200 p-3 sm:p-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Таны оноо: {attemptResult.correctCount}{" "}
            <span className="text-sm font-normal text-neutral-400">
              / {attemptResult.totalQuestions}
            </span>
          </h2>

          <ul className="mt-3 flex flex-col gap-3">
            {questions.map((q, i) => {
              const result = attemptResult.results.find((r) => r.questionId === q.id);
              const pickedText = q.options.find((o) => o.id === answers[q.id])?.text;
              const correctText = q.options.find(
                (o) => o.id === result?.correctOptionId
              )?.text;

              return (
                <li key={q.id} className="flex gap-2">
                  {result?.isCorrect ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-neutral-900">
                      {i + 1}. {q.question}
                    </p>
                    <p className="text-sm text-neutral-500">Таны хариулт: {pickedText}</p>
                    {!result?.isCorrect && (
                      <p className="text-sm text-emerald-600">Зөв хариулт: {correctText}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <RotateCcw className="size-3.5" />
              Дахин эхлэх
            </button>
            <button
              type="button"
              onClick={onSaveAndLeave}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <Save className="size-3.5" />
              Хадгалж гарах
            </button>
          </div>
        </div>
      )}

      {confirmCancel && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 p-4 sm:p-6">
          <div className="w-full max-w-xs rounded-lg bg-white p-4 shadow-lg">
            <h3 className="text-sm font-semibold text-neutral-900">Итгэлтэй байна уу?</h3>
            <p className="mt-1 text-sm text-red-600">
              Хэрэв &apos; цуцлах&apos; дарвал энэ quiz эхнээсээ дахин эхэлнэ.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="flex-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Буцах
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmCancel(false);
                  onClose();
                }}
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Quiz цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
