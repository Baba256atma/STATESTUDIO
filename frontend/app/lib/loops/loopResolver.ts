import type { SceneLoop, SceneLoopEdge, SceneObject } from "../sceneTypes";

export type SceneObjectLite = {
  id: string;
  name?: string;
  label?: string;
  type?: string;
  tags?: string[];
  role?: string;
  domain_hints?: Record<string, unknown>;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function normalizeText(s: string): string {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ");
}

export function buildObjectIndex(objects: readonly unknown[]) {
  const ids: string[] = [];
  const byId: Record<string, SceneObjectLite> = {};
  const tokensById: Record<string, string[]> = {};

  objects.forEach((rawValue) => {
    const raw = rawValue as SceneObject | Record<string, unknown> | null | undefined;
    if (!raw || typeof raw !== "object") return;
    const id = raw.id ?? raw.name;
    if (!id || typeof id !== "string") return;
    const entry: SceneObjectLite = {
      id,
      name: typeof raw.name === "string" ? raw.name : undefined,
      label: typeof raw.label === "string" ? raw.label : undefined,
      type: typeof raw.type === "string" ? raw.type : undefined,
      tags: Array.isArray(raw.tags)
        ? raw.tags.filter((tag): tag is string => typeof tag === "string")
        : undefined,
      role: typeof raw.role === "string" ? raw.role : undefined,
      domain_hints:
        raw.domain_hints && typeof raw.domain_hints === "object" && !Array.isArray(raw.domain_hints)
          ? (raw.domain_hints as Record<string, unknown>)
          : undefined,
    };
    ids.push(id);
    byId[id] = entry;
    const tokenSrc: string[] = [];
    tokenSrc.push(id, entry.name ?? "", entry.label ?? "", entry.type ?? "", entry.role ?? "");
    if (entry.tags) tokenSrc.push(...entry.tags);
    if (entry.domain_hints && typeof entry.domain_hints === "object") {
      Object.values(entry.domain_hints).forEach((value) => {
        if (Array.isArray(value)) tokenSrc.push(...value.map((entryValue) => String(entryValue ?? "")));
      });
    }
    const tokens = tokenSrc
      .join(" ")
      .split(/[^a-zA-Z0-9]+/)
      .map(normalizeText)
      .filter((t) => t.length >= 2);
    tokensById[id] = tokens;
  });

  return { ids, byId, tokensById };
}

export function isPlaceholderId(id: string): boolean {
  const normalized = normalizeText(id).replace(/\s+/g, "_");
  return (
    normalized.startsWith("obj_quality") ||
    normalized.startsWith("obj_cost") ||
    normalized.startsWith("obj_delivery") ||
    normalized.startsWith("obj_customer") ||
    normalized.startsWith("obj_risk") ||
    normalized.startsWith("obj_stability")
  );
}

export function placeholderToKeywords(id: string): string[] {
  const key = normalizeText(id);
  if (key.includes("quality")) return ["quality", "qa", "defect", "reliability"];
  if (key.includes("cost")) return ["cost", "expense", "budget", "margin", "burn"];
  if (key.includes("delivery")) return ["delivery", "ship", "shipping", "lead", "delay", "eta"];
  if (key.includes("customer")) return ["customer", "client", "support", "nps", "satisfaction"];
  if (key.includes("risk")) return ["risk", "volatility", "anomaly", "uncertainty", "threat"];
  if (key.includes("stability")) return ["stability", "balance", "stress", "resilience"];
  return [];
}

export function scoreMatch(keywords: string[], tokens: string[]): number {
  let score = 0;
  keywords.forEach((kw) => {
    tokens.forEach((tk) => {
      if (!kw || !tk) return;
      if (kw === tk) score += 2;
      else if (kw.includes(tk) || tk.includes(kw)) score += 1;
    });
  });
  return score;
}

export function resolveObjectId(rawId: string, index: ReturnType<typeof buildObjectIndex>): string {
  if (!rawId || typeof rawId !== "string") return rawId;
  if (!isPlaceholderId(rawId)) return rawId;

  const keywords = placeholderToKeywords(rawId);
  if (keywords.length === 0) return rawId;

  let bestId = rawId;
  let bestScore = -Infinity;
  index.ids.forEach((id) => {
    const tokens = index.tokensById[id] ?? [];
    const score = scoreMatch(keywords, tokens);
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  });

  // require at least a modest score to replace
  if (bestScore >= 2) return bestId;
  return rawId;
}

export function resolveLoopPlaceholders(loops: SceneLoop[], objects: readonly unknown[]): SceneLoop[] {
  const index = buildObjectIndex(Array.isArray(objects) ? objects : []);
  return loops.map((loop) => {
    const edges = Array.isArray(loop?.edges) ? loop.edges : [];
    const resolvedEdges: SceneLoopEdge[] = edges.flatMap((edge) => {
      const record = edge as SceneLoopEdge;
      const fromId = resolveObjectId(String(record?.from ?? ""), index);
      const toId = resolveObjectId(String(record?.to ?? ""), index);
      if (!fromId || !toId) return [];
      return [
        {
          from: fromId,
          to: toId,
          kind: typeof record.kind === "string" ? record.kind : undefined,
          label: typeof record.label === "string" ? record.label : undefined,
          polarity: typeof record.polarity === "string" ? record.polarity : undefined,
          weight: typeof record.weight === "number" ? clamp01(record.weight) : undefined,
        },
      ];
    });

    return {
      ...loop,
      edges: resolvedEdges,
    };
  });
}
