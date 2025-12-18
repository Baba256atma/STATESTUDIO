"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SystemVisualScene } from "./visual/SystemVisualScene";
import type { ReplayEpisode, ReplayFrame } from "../lib/api/replayApi";
import { fetchReplayEpisode } from "../lib/api/replayApi";

type SpeedOption = 0.5 | 1 | 2 | 4;

const speeds: SpeedOption[] = [0.5, 1, 2, 4];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0.00s";
  return `${value.toFixed(2)}s`;
}

function findNearestFrame(frames: ReplayFrame[], t: number) {
  if (frames.length === 0) return 0;
  let bestIndex = 0;
  let bestDiff = Math.abs(frames[0].t - t);
  for (let i = 1; i < frames.length; i += 1) {
    const diff = Math.abs(frames[i].t - t);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function ReplayPlayer({ episodeId }: { episodeId: string }) {
  const [episode, setEpisode] = useState<ReplayEpisode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lastTick = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchReplayEpisode(episodeId)
      .then((data) => {
        if (!mounted) return;
        const sorted = [...data.frames].sort((a, b) => a.t - b.t);
        setEpisode({ ...data, frames: sorted });
        setCurrentIndex(0);
        setCurrentTime(sorted[0]?.t ?? 0);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message ?? "Replay load failed");
      });
    return () => {
      mounted = false;
    };
  }, [episodeId]);

  const duration = episode?.duration ?? 0;
  const frames = episode?.frames ?? [];

  useEffect(() => {
    if (!isPlaying) {
      lastTick.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (!lastTick.current) lastTick.current = now;
      const delta = (now - lastTick.current) / 1000;
      lastTick.current = now;
      const nextTime = currentTime + delta * speed;
      const clamped = clamp(nextTime, 0, duration);
      setCurrentTime(clamped);
      setCurrentIndex(findNearestFrame(frames, clamped));
      if (clamped >= duration) {
        setIsPlaying(false);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [currentTime, duration, frames, isPlaying, speed]);

  const currentFrame = useMemo(() => frames[currentIndex], [frames, currentIndex]);

  if (error) {
    return <div style={{ color: "white", padding: 16 }}>Replay error: {error}</div>;
  }

  if (!episode) {
    return <div style={{ color: "white", padding: 16 }}>Loading replay…</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        {currentFrame && <SystemVisualScene visual={currentFrame.visual} />}
      </Canvas>

      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          padding: "12px 14px",
          background: "rgba(12, 16, 24, 0.85)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          color: "white",
          display: "grid",
          gap: 8,
          minWidth: 260,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setIsPlaying((v) => !v)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: isPlaying ? "rgba(79, 70, 229, 0.35)" : "rgba(255,255,255,0.08)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: speed === s ? "rgba(34, 211, 238, 0.3)" : "rgba(255,255,255,0.06)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setCurrentTime(value);
              setCurrentIndex(findNearestFrame(frames, value));
            }}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 12, opacity: 0.85 }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
