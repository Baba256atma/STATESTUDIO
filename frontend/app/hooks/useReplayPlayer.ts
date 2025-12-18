"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReplayFrame } from "../lib/api/replayApi";

type SpeedOption = 0.5 | 1 | 2 | 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function findFrameIndex(frames: ReplayFrame[], t: number) {
  if (frames.length === 0) return 0;
  let bestIndex = 0;
  for (let i = 0; i < frames.length; i += 1) {
    if (frames[i].t <= t) {
      bestIndex = i;
    } else {
      break;
    }
  }
  return bestIndex;
}

export function useReplayPlayer(frames: ReplayFrame[] | null, duration: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastTick = useRef<number | null>(null);

  const sortedFrames = useMemo(() => {
    return frames ? [...frames].sort((a, b) => a.t - b.t) : [];
  }, [frames]);

  const currentFrame = useMemo(() => {
    return sortedFrames[currentIndex] ?? null;
  }, [sortedFrames, currentIndex]);

  useEffect(() => {
    setCurrentTime(0);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [duration, sortedFrames.length]);

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
      setCurrentTime((prev) => {
        const next = clamp(prev + delta * speed, 0, duration);
        const nextIndex = findFrameIndex(sortedFrames, next);
        setCurrentIndex(nextIndex);
        if (next >= duration) setIsPlaying(false);
        return next;
      });
      if (isPlaying) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, isPlaying, sortedFrames, speed]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);

  const handleSetSpeed = useCallback((next: SpeedOption) => {
    setSpeed(next);
  }, []);

  const scrub = useCallback(
    (t: number) => {
      const clamped = clamp(t, 0, duration);
      setCurrentTime(clamped);
      setCurrentIndex(findFrameIndex(sortedFrames, clamped));
    },
    [duration, sortedFrames]
  );

  const step = useCallback(
    (deltaFrames: number) => {
      const nextIndex = clamp(currentIndex + deltaFrames, 0, sortedFrames.length - 1);
      setCurrentIndex(nextIndex);
      const nextTime = sortedFrames[nextIndex]?.t ?? 0;
      setCurrentTime(nextTime);
    },
    [currentIndex, sortedFrames]
  );

  return {
    isPlaying,
    speed,
    currentTime,
    currentIndex,
    currentFrame,
    play,
    pause,
    togglePlay,
    setSpeed: handleSetSpeed,
    scrub,
    step,
  };
}
