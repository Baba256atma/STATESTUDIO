import type { DomainObjectTemplate } from "./domainTypes.ts";

export type DomainFragilityScore = {
  objectId: string;
  score: number;
  level:
    | "stable"
    | "watch"
    | "fragile"
    | "critical";
};

type EdgeView = {
  id?: string;
  from: string;
  to: string;
  relationshipType: string;
  weight: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectId(object: unknown): string {
  return String(asRecord(object).id ?? "").trim();
}

function objectRole(object: unknown): DomainObjectTemplate["role"] | null {
  const record = asRecord(object);
  const meta = asRecord(record.meta);
  const semantic = asRecord(record.semantic);
  const raw = String(meta.semanticRole ?? semantic.role ?? record.role ?? "").trim();
  return isDomainRole(raw) ? raw : null;
}

function isDomainRole(value: string): value is DomainObjectTemplate["role"] {
  return ["core", "input", "process", "constraint", "risk", "decision", "output", "monitor"].includes(value);
}

function edgeView(edge: unknown): EdgeView | null {
  const record = asRecord(edge);
  const metadata = asRecord(record.metadata);
  const from = String(record.from ?? "").trim();
  const to = String(record.to ?? "").trim();
  if (!from || !to) return null;
  const relationshipType = String(metadata.relationshipType ?? record.relationshipType ?? record.kind ?? record.type ?? "")
    .replace(/^domain_/, "")
    .trim();
  const weight = typeof record.weight === "number" && Number.isFinite(record.weight) ? record.weight : 0.55;
  return {
    id: String(record.id ?? "").trim() || undefined,
    from,
    to,
    relationshipType,
    weight,
  };
}

function scoreLevel(score: number): DomainFragilityScore["level"] {
  if (score >= 76) return "critical";
  if (score >= 51) return "fragile";
  if (score >= 26) return "watch";
  return "stable";
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

function roleBaseScore(role: DomainObjectTemplate["role"] | null): number {
  if (role === "risk") return 34;
  if (role === "constraint") return 28;
  if (role === "input" || role === "process") return 18;
  if (role === "output") return 16;
  if (role === "decision") return 14;
  if (role === "core") return 12;
  return 10;
}

export function calculateObjectFragilityScores(params: {
  objects: unknown[];
  edges?: unknown[];
}): DomainFragilityScore[] {
  const objects = Array.isArray(params.objects) ? params.objects : [];
  const edges = Array.isArray(params.edges) ? params.edges.map(edgeView).filter((edge): edge is EdgeView => Boolean(edge)) : [];

  return objects
    .map((object) => {
      const id = objectId(object);
      if (!id) return null;

      const role = objectRole(object);
      const connected = edges.filter((edge) => edge.from === id || edge.to === id);
      const incoming = connected.filter((edge) => edge.to === id);
      const outgoing = connected.filter((edge) => edge.from === id);
      const riskEdges = connected.filter((edge) => edge.relationshipType === "risk_path" || edge.relationshipType === "constraint");
      const bottleneckPressure = incoming.length >= 2 && outgoing.length >= 1 ? 12 : 0;
      const isolatedCriticalRole = connected.length === 0 && (role === "risk" || role === "constraint") ? 10 : 0;
      const weightedEdgePressure = connected.reduce((sum, edge) => sum + Math.min(10, edge.weight * 8), 0);
      const score = clampScore(
        roleBaseScore(role) +
          connected.length * 8 +
          riskEdges.length * 13 +
          bottleneckPressure +
          isolatedCriticalRole +
          weightedEdgePressure
      );

      return {
        objectId: id,
        score,
        level: scoreLevel(score),
      };
    })
    .filter((score): score is DomainFragilityScore => Boolean(score));
}
