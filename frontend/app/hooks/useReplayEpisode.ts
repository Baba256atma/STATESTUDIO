"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReplayEpisode } from "../lib/api/replayApi";
import { getEpisode } from "../lib/api/replayApi";

export function useReplayEpisode(episodeId: string | null): {
  loading: boolean;
  error: string | null;
  episode: ReplayEpisode | null;
  reload: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [episode, setEpisode] = useState<ReplayEpisode | null>(null);

  const load = useCallback(async () => {
    if (!episodeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEpisode(episodeId);
      const frames = [...data.frames].sort((a, b) => a.t - b.t);
      const lastT = frames[frames.length - 1]?.t ?? 0;
      const duration = Number.isFinite(data.duration) && data.duration > 0 ? data.duration : lastT;
      setEpisode({
        ...data,
        frames,
        duration: duration > 0 ? duration : 0,
      });
    } catch (err: any) {
      setEpisode(null);
      setError(err?.message ?? "Failed to load replay episode");
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    if (!episodeId) {
      setEpisode(null);
      setError(null);
      setLoading(false);
      return;
    }
    load();
  }, [episodeId, load]);

  return { loading, error, episode, reload: load };
}
