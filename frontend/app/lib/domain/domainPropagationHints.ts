export type DomainPropagationHint = {
  sourceObjectId: string;
  targetObjectId: string;
  propagationStrength: number;
  propagationType:
    | "risk"
    | "delay"
    | "dependency"
    | "confidence";
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function propagationTypeFor(edge: unknown): DomainPropagationHint["propagationType"] {
  const record = asRecord(edge);
  const metadata = asRecord(record.metadata);
  const raw = String(metadata.relationshipType ?? record.relationshipType ?? record.kind ?? record.type ?? "")
    .replace(/^domain_/, "")
    .toLowerCase();
  if (raw.includes("risk")) return "risk";
  if (raw.includes("constraint") || raw.includes("dependency")) return "dependency";
  if (raw.includes("decision") || raw.includes("feedback")) return "confidence";
  return "delay";
}

export function deriveDomainPropagationHints(params: {
  objects: unknown[];
  edges?: unknown[];
}): DomainPropagationHint[] {
  const objectIds = new Set(
    (Array.isArray(params.objects) ? params.objects : [])
      .map((object) => String(asRecord(object).id ?? "").trim())
      .filter(Boolean)
  );
  const edges = Array.isArray(params.edges) ? params.edges : [];
  const hints: DomainPropagationHint[] = [];
  const seen = new Set<string>();

  for (const edge of edges) {
    const record = asRecord(edge);
    const from = String(record.from ?? "").trim();
    const to = String(record.to ?? "").trim();
    if (!from || !to || !objectIds.has(from) || !objectIds.has(to)) continue;

    const propagationType = propagationTypeFor(edge);
    const key = `${from}|${to}|${propagationType}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const weight = typeof record.weight === "number" && Number.isFinite(record.weight) ? record.weight : 0.55;
    const typeBoost = propagationType === "risk" ? 0.16 : propagationType === "dependency" ? 0.08 : 0;
    hints.push({
      sourceObjectId: from,
      targetObjectId: to,
      propagationStrength: Number(clamp01(weight + typeBoost).toFixed(2)),
      propagationType,
    });
  }

  return hints;
}
