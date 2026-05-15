import { normalizeIdPart } from "./normalization.ts";

export function stableSignalKey(params: {
  type: string;
  relatedObjectIds?: string[];
  sourceId?: string;
}): string {
  const objects = (params.relatedObjectIds ?? []).map(String).filter(Boolean).sort().join("_");
  return [
    normalizeIdPart(params.type),
    normalizeIdPart(params.sourceId ?? ""),
    normalizeIdPart(objects),
  ].filter(Boolean).join("|");
}

export function dedupeByStableKey<T>(items: T[], getKey: (item: T) => string): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = getKey(item);
    if (!key || map.has(key)) continue;
    map.set(key, item);
  }
  return Array.from(map.values());
}

export function stableSignature(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) return `[${value.map(stableSignature).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${key}:${stableSignature(record[key])}`).join(",")}}`;
}

export function hasMaterialSignatureChange(params: {
  previousSignature?: string | null;
  nextValue: unknown;
}): boolean {
  return (params.previousSignature ?? "") !== stableSignature(params.nextValue);
}
