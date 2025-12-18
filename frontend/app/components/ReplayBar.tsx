"use client";

import React from "react";

type SpeedOption = 0.5 | 1 | 2 | 4;

const speedOptions: SpeedOption[] = [0.5, 1, 2, 4];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  const clamped = Math.max(0, value);
  const minutes = Math.floor(clamped / 60);
  const seconds = Math.floor(clamped % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ReplayBar({
  duration,
  currentTime,
  isPlaying,
  speed,
  onPlayPause,
  onSpeedChange,
  onScrub,
  onStep,
  hasFrames,
  loading,
}: {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  speed: SpeedOption;
  onPlayPause: () => void;
  onSpeedChange: (next: SpeedOption) => void;
  onScrub: (nextTime: number) => void;
  onStep?: (deltaFrames: number) => void;
  hasFrames?: boolean;
  loading?: boolean;
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const disablePlayback = !hasFrames || safeDuration <= 0 || !!loading;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            disabled={disablePlayback}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading…" : isPlaying ? "Pause" : "Play"}
          </button>
          {onStep && (
            <>
              <button
                onClick={() => onStep(-1)}
                disabled={disablePlayback}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Prev
              </button>
              <button
                onClick={() => onStep(1)}
                disabled={disablePlayback}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </>
          )}
        </div>

        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value) as SpeedOption)}
          disabled={disablePlayback}
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {speedOptions.map((option) => (
            <option key={option} value={option}>
              {option}x
            </option>
          ))}
        </select>

        <input
          type="range"
          min={0}
          max={safeDuration}
          step={0.01}
          value={Math.min(currentTime, safeDuration)}
          onChange={(e) => onScrub(parseFloat(e.target.value))}
          disabled={disablePlayback}
          className="flex-1 disabled:cursor-not-allowed"
        />

        <div className="text-xs text-white/60">
          {formatTime(currentTime)} / {formatTime(safeDuration)}
        </div>
        {!hasFrames && !loading && (
          <div className="text-xs text-white/50">No frames recorded yet</div>
        )}
        {loading && <div className="text-xs text-white/60">Loading replay…</div>}
      </div>
      {!hasFrames && !loading && (
        <div className="mt-1 text-[11px] text-white/50">
          Switch to Live or start a demo to record frames.
        </div>
      )}
    </div>
  );
}
