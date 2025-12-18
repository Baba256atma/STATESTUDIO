"use client";

import React from "react";

export function TopBar({
  modeLabel,
  onToggleSettings,
  episodes,
  selectedEpisodeId,
  onEpisodeChange,
  onReloadEpisode,
  episodesLoading,
  episodeId,
  onOpenReplay,
  viewMode,
  onBackToLive,
  onReplayFromStart,
}: {
  modeLabel: string;
  onToggleSettings: () => void;
  episodes: {
    episode_id: string;
    title?: string | null;
    updated_at: string;
    duration: number;
  }[];
  selectedEpisodeId: string | null;
  onEpisodeChange: (episodeId: string | null) => void;
  onReloadEpisode: () => void;
  episodesLoading?: boolean;
  episodeId?: string | null;
  onOpenReplay?: () => void;
  viewMode: "live" | "replay";
  onBackToLive?: () => void;
  onReplayFromStart?: () => void;
}) {
  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-20 flex h-12 items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 text-sm text-white backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-white/60">Mode</span>
        <span className="font-semibold text-white/90">{modeLabel}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
          {viewMode === "replay" ? "Replay" : "Live"}
        </span>
        {episodeId && (
          <span className="text-xs text-white/60">
            Episode: {episodeId.slice(0, 8)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="hidden text-xs text-white/60 sm:block">Episode</label>
        <select
          value={selectedEpisodeId ?? ""}
          onChange={(e) => onEpisodeChange(e.target.value || null)}
          className="max-w-[180px] rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80"
        >
          <option value="">None</option>
          {episodes.map((ep) => (
            <option key={ep.episode_id} value={ep.episode_id}>
              {ep.title ? `${ep.title} · ` : ""}
              {formatDuration(ep.duration)} · {formatDate(ep.updated_at)}
            </option>
          ))}
        </select>
        <button
          onClick={onReloadEpisode}
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
          disabled={episodesLoading}
        >
          Reload
        </button>
        {viewMode === "live" && episodeId && onOpenReplay && (
          <button
            onClick={onOpenReplay}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
          >
            Open Replay
          </button>
        )}
        {viewMode === "replay" && (
          <>
            {onReplayFromStart && (
              <button
                onClick={onReplayFromStart}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              >
                Replay from start
              </button>
            )}
            {onBackToLive && (
              <button
                onClick={onBackToLive}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              >
                Back to Live
              </button>
            )}
          </>
        )}
        <button
          onClick={onToggleSettings}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
