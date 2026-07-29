import type { SceneLoop, SceneLoopEdge } from "../lib/sceneTypes";

export type LoopEdgePair = { from: string; to: string };

function readLoopEdges(loop: SceneLoop): SceneLoopEdge[] {
  return Array.isArray(loop.edges) ? loop.edges : [];
}

export function getLoopEdgePairs(loop: SceneLoop): LoopEdgePair[] {
  return readLoopEdges(loop)
    .map((edge) => ({ from: String(edge.from ?? ""), to: String(edge.to ?? "") }))
    .filter((pair: LoopEdgePair) => Boolean(pair.from) && Boolean(pair.to));
}

export function formatLoopLabel(loop: SceneLoop, resolveObjectLabel?: (id: string) => string): string {
  const base = loop.label ? String(loop.label) : String(loop.id ?? "loop");
  const pairs = getLoopEdgePairs(loop);
  if (!pairs.length) return base;

  const first = pairs[0];
  const fromLabel = resolveObjectLabel ? resolveObjectLabel(first.from) : first.from;
  const toLabel = resolveObjectLabel ? resolveObjectLabel(first.to) : first.to;
  const suffix = pairs.length > 1 ? ` (+${pairs.length - 1} edges)` : "";
  return `${base}: ${fromLabel} \u2192 ${toLabel}${suffix}`;
}

export function loopStrength(loop: SceneLoop | undefined): number {
  if (!loop) return 0;
  return Number(loop.strength ?? loop.weight ?? 0);
}
