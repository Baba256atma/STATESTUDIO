import type { SceneLoop, SceneLoopEdge, LoopType, LoopStatus } from "../sceneTypes";

export const clamp01 = (n: number): number => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const loopStatuses: LoopStatus[] = ["active", "warning", "paused", "resolved"];

const loopTypes: LoopType[] = [
  "quality_protection",
  "cost_compression",
  "delivery_customer",
  "risk_ignorance",
  "stability_balance",
];

type RawLoopEdge = Record<string, unknown>;

function readStringField(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? String(record[key]) : "";
}

function readNumberField(record: Record<string, unknown>, key: string): number | undefined {
  return typeof record[key] === "number" ? Number(record[key]) : undefined;
}

function coerceEdges(input: unknown): SceneLoopEdge[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((edge): SceneLoopEdge | null => {
      if (!edge || typeof edge !== "object") return null;
      const raw = edge as RawLoopEdge;
      const from = readStringField(raw, "from");
      const to = readStringField(raw, "to");
      const weight = clamp01(readNumberField(raw, "weight") ?? NaN);
      if (!from || !to) return null;
      return { from, to, weight: Number.isFinite(weight) ? weight : undefined };
    })
    .filter((edge): edge is SceneLoopEdge => edge !== null);
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === "string");
  return strings.length > 0 ? strings : undefined;
}

export function normalizeLoops(input: unknown): SceneLoop[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((raw): SceneLoop | null => {
      if (typeof raw !== "object" || raw === null) return null;
      const record = raw as Record<string, unknown>;
      const id = readStringField(record, "id");
      if (!id) return null;

      const typeRaw = record.type;
      const type: LoopType = typeof typeRaw === "string" && loopTypes.includes(typeRaw as LoopType)
        ? (typeRaw as LoopType)
        : "stability_balance";

      const edges = coerceEdges(record.edges);
      const severity = clamp01(readNumberField(record, "severity") ?? 0.35);
      const label = typeof record.label === "string" ? record.label : undefined;
      const status =
        typeof record.status === "string" && loopStatuses.includes(record.status as LoopStatus)
          ? (record.status as LoopStatus)
          : undefined;
      const suggestions = readStringArray(record.suggestions);
      const kpis = readStringArray(record.kpis);
      const strengthRaw = readNumberField(record, "strength");

      return {
        id,
        type,
        status,
        severity,
        kpis,
        edges,
        suggestions,
        label,
        polarity: typeof record.polarity === "string" ? record.polarity : undefined,
        strength: strengthRaw !== undefined ? clamp01(strengthRaw) : undefined,
        triggered_by: record.triggered_by,
        loops_suggestions: record.loops_suggestions,
      };
    })
    .filter((loop): loop is SceneLoop => loop !== null);
}
