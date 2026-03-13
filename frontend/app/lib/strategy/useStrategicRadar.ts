"use client";

import { useMemo } from "react";
import type { StrategicState } from "../contracts";

export type { StrategicState };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function useStrategicRadar(params: {
  loops: any[];
  kpi: any;
  memory: any;
  activeLoopId?: string | null;
}): StrategicState {
  const { loops, kpi, memory, activeLoopId } = params;

  return useMemo(() => {
    const loopIntensity =
      Array.isArray(loops) && loops.length > 0
        ? clamp01(
            loops.reduce((acc: number, l: any) => {
              const i = Number(l?.intensity ?? 0);
              return acc + (Number.isFinite(i) ? i : 0);
            }, 0) / loops.length
          )
        : 0;

    const risk = clamp01(Number(kpi?.overall?.risk ?? kpi?.risk ?? 0));

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
