"use client";

import { useCallback, useState } from "react";
import { readUnknownErrorMessage } from "../lib/system/nexoraErrors";

type TimelineScenario = {
  name: string;
  delta: Record<string, number>;
};

type TimelineScenarioResult = {
  name?: string;
  timeline?: Record<string, unknown>[];
  final_fragility?: { score?: number; level?: string };
  montecarlo?: { result?: { stats?: { mean?: number; p90?: number } } };
};

export type TimelineSimulationResult = {
  best_scenario?: string;
  scenarios?: TimelineScenarioResult[];
  timeline_horizon?: number;
  manager_report?: {
    insight?: string;
    warning?: string;
    recommendation?: string;
  };
};

type TimelineParams = {
  steps: number;
  scenarios: TimelineScenario[];
  montecarlo?: { n: number; sigma: number };
};

type UseTimelineSimulatorArgs = {
  backendBase: string;
  episodeId: string | null;
};

export function useTimelineSimulator({ backendBase, episodeId }: UseTimelineSimulatorArgs) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TimelineSimulationResult | null>(null);

  const runTimeline = useCallback(
    async (params: TimelineParams) => {
      if (!episodeId) {
        setError("episode_id is missing. Send one chat message first.");
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const payload = {
          episode_id: episodeId,
          scenarios: Array.isArray(params.scenarios) ? params.scenarios : [],
          timeline: { steps: Number(params.steps || 3) },
          montecarlo: {
            n: Number(params.montecarlo?.n ?? 150),
            sigma: Number(params.montecarlo?.sigma ?? 0.08),
          },
        };

        const res = await fetch(`${backendBase}/simulator/timeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            data?.detail?.error?.message ||
            data?.detail?.message ||
            data?.error?.message ||
            "Timeline simulation failed";
          throw new Error(String(msg));
        }
        const out = data?.data ?? data;
        setResult(out);
        return out;
      } catch (e: unknown) {
        setError(readUnknownErrorMessage(e, "Timeline simulation failed"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [backendBase, episodeId]
  );

  return { loading, error, result, runTimeline, setResult, setError };
}
