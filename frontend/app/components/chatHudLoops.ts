import type { SceneLoop } from "../lib/sceneTypes";

export type LoopEdgePair = { from: string; to: string };

export function getLoopEdgePairs(loop: SceneLoop): LoopEdgePair[] {
  // Defensive parsing: edges may arrive with loose typing from backend.
  const rawEdges: unknown = (loop as any)?.edges;
  const edges: any[] = Array.isArray(rawEdges) ? rawEdges : [];

  return edges
    .map((e: any) => ({ from: String(e?.from ?? ""), to: String(e?.to ?? "") }))
    .filter((p: LoopEdgePair) => Boolean(p.from) && Boolean(p.to));
}

export function formatLoopLabel(loop: SceneLoop, resolveObjectLabel?: (id: string) => string): string {
  const base = (loop as any)?.label ? String((loop as any).label) : String((loop as any)?.id ?? "loop");
  const pairs = getLoopEdgePairs(loop);
  if (!pairs.length) return base;

  const first = pairs[0];
  const fromLabel = resolveObjectLabel ? resolveObjectLabel(first.from) : first.from;
  const toLabel = resolveObjectLabel ? resolveObjectLabel(first.to) : first.to;
  const suffix = pairs.length > 1 ? ` (+${pairs.length - 1} edges)` : "";
  return `${base}: ${fromLabel} \u2192 ${toLabel}${suffix}`;
}

export function loopStrength(loop: SceneLoop | undefined): number {
  return Number((loop as any)?.strength ?? (loop as any)?.weight ?? 0);
}
