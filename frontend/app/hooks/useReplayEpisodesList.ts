"use client";

import { useCallback, useEffect, useState } from "react";
import { listEpisodes } from "../lib/api/replayApi";

type EpisodeSummary = {
  episode_id: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  duration: number;
  frame_count: number;
};

export function useReplayEpisodesList(): {
  loading: boolean;
  error: string | null;
  episodes: EpisodeSummary[];
  reload: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEpisodes();
      setEpisodes(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load episodes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, error, episodes, reload: load };
}
