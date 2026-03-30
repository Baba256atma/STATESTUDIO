"use client";

import React from "react";

import { normalizeBackendSimulation } from "./normalizeBackendSimulation";

type SimulationOverlayLink = {
  source: string;
  target: string;
  weight: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function useSimulationOverlay(input: unknown): {
  highlightedIds: string[];
  links: SimulationOverlayLink[];
  intensityMap: Record<string, number>;
} {
  return React.useMemo(() => {
    const record = asRecord(input);
    const candidate =
      normalizeBackendSimulation(record?.decision_simulation ?? null) ??
      normalizeBackendSimulation(record?.simulation ?? null) ??
      null;

    if (!candidate) {
      return {
        highlightedIds: [],
        links: [],
        intensityMap: {},
      };
    }

    const intensityMap = candidate.propagation.reduce<Record<string, number>>((acc, link) => {
      acc[link.source] = Math.max(acc[link.source] ?? 0, link.weight);
      acc[link.target] = Math.max(acc[link.target] ?? 0, link.weight);
      return acc;
    }, {});

    candidate.impacted_nodes.forEach((id) => {
      intensityMap[id] = Math.max(intensityMap[id] ?? 0, 0.72);
    });

    return {
      highlightedIds: candidate.impacted_nodes,
      links: candidate.propagation,
      intensityMap,
    };
  }, [input]);
}
