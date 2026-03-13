"use client";

import React from "react";

export function InsightCard({
  isOpen,
  onToggle,
  focusId,
  insight,
  onSelectLever,
}: {
  isOpen: boolean;
  onToggle: () => void;
  focusId: string | null;
  insight: {
    title: string;
    summary: string;
    why: string[];
    lever: { label: string; hint: string } | null;
    confidence?: number;
  } | null;
  onSelectLever?: () => void;
}) {
  if (!insight) {
    return (
      <div className="fixed right-4 top-14 z-20 w-72 max-w-[80vw] rounded-lg border border-white/10 bg-slate-900/70 text-sm text-white backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-xs uppercase tracking-widest text-white/60">Insight</span>
          <button
            onClick={onToggle}
            className="text-xs text-white/70 hover:text-white"
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
        </div>
        {isOpen && (
          <div className="px-3 py-3 text-xs text-white/65">No current frame.</div>
        )}
      </div>
    );
  }

  const clampedConfidence =
    typeof insight.confidence === "number"
      ? Math.min(1, Math.max(0, insight.confidence))
      : null;
  const whyList = insight.why.slice(0, 3);

  return (
    <div className="fixed right-4 top-14 z-20 w-72 max-w-[80vw] rounded-lg border border-white/10 bg-slate-900/70 text-sm text-white backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs uppercase tracking-widest text-white/60">Insight</span>
        <button
          onClick={onToggle}
          className="text-xs text-white/70 hover:text-white"
        >
          {isOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      {isOpen && (
        <div className="grid gap-3 px-3 py-3">
          <div>
            <div className="text-xs text-white/60">Active pattern</div>
            <div className="font-semibold text-white/90">Active pattern: {insight.title}</div>
            {focusId && (
              <div className="mt-1 text-xs text-white/50">Focused: {focusId}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-white/60">Summary</div>
            <div className="text-white/80">{insight.summary}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Why this is happening</div>
            <ul className="list-disc space-y-1 pl-4 text-white/80">
              {whyList.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
          {insight.lever && (
            <button
              type="button"
              onClick={onSelectLever}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
            >
              <div className="text-xs text-white/60">Suggested lever</div>
              <div className="font-semibold text-white/90">{insight.lever.label}</div>
              <div className="text-xs text-white/70">{insight.lever.hint}</div>
            </button>
          )}
          {clampedConfidence !== null && (
            <div>
              <div className="text-xs text-white/60">Confidence</div>
              <div className="mt-1 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-300/60"
                  style={{ width: `${clampedConfidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
