import type { SceneLoop, SceneLoopEdge, LoopType } from "../sceneTypes";

export const clamp01 = (n: number): number => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const loopTypes: LoopType[] = [
  "quality_protection",
  "cost_compression",
  "delivery_customer",
  "risk_ignorance",
  "stability_balance",
];

function coerceEdges(input: unknown): SceneLoopEdge[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((e) => {
      const from = typeof (e as any)?.from === "string" ? (e as any).from : "";
      const to = typeof (e as any)?.to === "string" ? (e as any).to : "";
      const weight = clamp01(typeof (e as any)?.weight === "number" ? (e as any).weight : NaN);
      return { from, to, weight: Number.isFinite(weight) ? weight : undefined };
    })
    .filter((e) => e.from && e.to);
}

export function normalizeLoops(input: unknown): SceneLoop[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((raw) => {
      if (typeof raw !== "object" || raw === null) return null;
      const id = typeof (raw as any).id === "string" ? (raw as any).id : "";
      if (!id) return null;

      const typeRaw = (raw as any).type;
      const type: LoopType = loopTypes.includes(typeRaw) ? typeRaw : "stability_balance";

      const edges = coerceEdges((raw as any).edges);
      const severityRaw = typeof (raw as any).severity === "number" ? (raw as any).severity : undefined;
      const severity = clamp01(severityRaw ?? 0.35);

      const label =
        typeof (raw as any).label === "string" ? (raw as any).label : undefined;
      const status =
        typeof (raw as any).status === "string" ? (raw as any).status : undefined;
      const suggestions = Array.isArray((raw as any).suggestions)
        ? (raw as any).suggestions.filter((s: any) => typeof s === "string")
        : undefined;
      const kpis = Array.isArray((raw as any).kpis)
        ? (raw as any).kpis.filter((s: any) => typeof s === "string")
        : undefined;

      return {
        id,
        type,
        status,
        severity,
        kpis,
        edges,
        suggestions,
        label,
        polarity: typeof (raw as any).polarity === "string" ? (raw as any).polarity : undefined,
        strength: typeof (raw as any).strength === "number" ? clamp01((raw as any).strength) : undefined,
        triggered_by: (raw as any).triggered_by,
        loops_suggestions: (raw as any).loops_suggestions,
      } as SceneLoop;
    })
    .filter(Boolean) as SceneLoop[];
}
