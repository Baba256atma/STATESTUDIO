/**
 * D7:1:2 — Consumer-only propagation signals for state evolution (no overlay mutation).
 */

import type { PropagationNodeImpact, PropagationOverlayState } from "./propagationTypes.ts";

export interface PropagationEvolutionSignal {
  objectId: string;
  intensity: number;
  depth: number;
  role: PropagationNodeImpact["role"];
}

export function propagationSignalsFromOverlay(
  overlay: PropagationOverlayState | null | undefined
): readonly PropagationEvolutionSignal[] {
  if (!overlay?.active) return [];
  const nodes = Array.isArray(overlay.impacted_nodes) ? overlay.impacted_nodes : [];
  const out: PropagationEvolutionSignal[] = [];
  for (const node of nodes) {
    const objectId = String(node?.object_id ?? "").trim();
    if (!objectId) continue;
    const strength = Number(node?.strength ?? 0);
    const depth = Number(node?.depth ?? 0);
    out.push({
      objectId,
      intensity: Number.isFinite(strength) ? Math.min(1, Math.max(0, strength)) : 0,
      depth: Number.isFinite(depth) ? Math.max(0, depth) : 0,
      role: node?.role === "source" || node?.role === "context" ? node.role : "impacted",
    });
  }
  return out.sort((a, b) => a.objectId.localeCompare(b.objectId));
}

export function mergePropagationPressureByObject(
  signals: readonly PropagationEvolutionSignal[]
): Readonly<Record<string, number>> {
  const acc: Record<string, number> = {};
  for (const signal of signals) {
    const id = signal.objectId;
    const depthBoost = 1 + Math.min(3, signal.depth) * 0.08;
    const roleWeight = signal.role === "source" ? 1.1 : signal.role === "context" ? 0.85 : 1;
    const pressure = signal.intensity * depthBoost * roleWeight;
    acc[id] = Math.min(1, (acc[id] ?? 0) + pressure);
  }
  return acc;
}
