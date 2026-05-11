function stableString(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableString).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${key}:${stableString(entry)}`)
      .join(",")}}`;
  }
  return String(value ?? "");
}

export function buildDomainSignature(parts: unknown[]): string {
  return parts.map(stableString).join("|");
}

export function dedupeBySignature<T>(
  items: T[],
  signatureFor: (item: T) => string
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of Array.isArray(items) ? items : []) {
    const signature = signatureFor(item);
    if (!signature || seen.has(signature)) continue;
    seen.add(signature);
    result.push(item);
  }
  return result;
}

export function domainObjectDedupeSignature(value: unknown): string {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const meta = record.meta && typeof record.meta === "object" ? (record.meta as Record<string, unknown>) : {};
  const id = String(record.id ?? "").trim();
  const label = String(record.label ?? record.name ?? "").trim().toLowerCase();
  const domainId = String(meta.domainId ?? record.domain ?? "").trim();
  const templateId = String(meta.templateId ?? "").trim();
  return buildDomainSignature(["object", id, domainId, templateId, label]);
}

export function domainEdgeDedupeSignature(value: unknown): string {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const metadata = record.metadata && typeof record.metadata === "object" ? (record.metadata as Record<string, unknown>) : {};
  const relationshipType = String(metadata.relationshipType ?? record.relationshipType ?? record.kind ?? record.type ?? "")
    .replace(/^domain_/, "")
    .trim();
  return buildDomainSignature(["edge", record.from, record.to, relationshipType]);
}

export function domainActionDedupeSignature(value: unknown): string {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return buildDomainSignature(["action", record.type, record.payload]);
}

export function domainSignalDedupeSignature(value: unknown): string {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return buildDomainSignature(["signal", record.signalType, record.relatedObjectIds, record.relatedEdgeIds]);
}

export function domainScenarioDedupeSignature(value: unknown): string {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return buildDomainSignature(["scenario", record.title, record.type, record.relatedObjectIds]);
}
