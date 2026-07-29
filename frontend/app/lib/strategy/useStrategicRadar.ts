"use client";

import { useMemo } from "react";
import type { SceneLoop } from "../sceneTypes";
import type { StrategicState } from "../contracts";

export type { StrategicState };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useStrategicRadar(params: {
  loops: SceneLoop[];
  kpi: Record<string, unknown> | null;
  memory: Record<string, unknown> | null;
  activeLoopId?: string | null;
}): StrategicState {
  const { loops, kpi, memory, activeLoopId } = params;

  return useMemo(() => {

    const overall = kpi?.overall;
    const risk = clamp01(
      Number(
        (overall && typeof overall === "object" ? (overall as Record<string, unknown>).risk : null) ??
          kpi?.risk ??
          0
      )
    );

    const volatility = clamp01(Number(memory?.volatility ?? 0.2));

    const stability = clamp01(1 - (risk * 0.6 + volatility * 0.4));

    return {
      posture: stability >= 0.66 ? "stability" : risk >= 0.6 ? "cost" : "balanced",
      overallScore: stability,
      signals: [
        { key: "stability", label: "Stability", value: stability },
        { key: "systemicRisk", label: "Systemic Risk", value: risk },
        { key: "volatility", label: "Volatility", value: volatility },
      ],
    };
  }, [loops, kpi, memory, activeLoopId]);
}
