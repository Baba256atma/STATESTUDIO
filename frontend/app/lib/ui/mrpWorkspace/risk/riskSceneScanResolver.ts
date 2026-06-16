/**
 * MRP:4C:2 / 4C:4 — Shared read-only scene risk scan utilities.
 */

export type RiskBand = "none" | "elevated" | "critical";

export type ScannedRiskObject = Readonly<{
  objectId: string | null;
  label: string;
  band: RiskBand;
  category: string;
  severityLabel: string;
  impact: string;
}>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readSceneField(obj: unknown, keys: readonly string[]): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  for (const key of keys) {
    for (const source of [record, semantic, meta]) {
      if (!source) continue;
      const raw = source[key];
      if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
      const text = normalizeText(raw);
      if (text) return text;
    }
  }
  return "";
}

export function readObjectHaystack(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  return [
    record.severity,
    record.scanner_severity,
    record.state,
    record.status,
    record.label,
    record.name,
    record.type,
    record.role,
    record.category,
    semantic?.category,
    semantic?.role,
    meta?.category,
  ]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

export function classifyRiskBand(haystack: string): RiskBand {
  if (!haystack) return "none";
  if (/\bcritical\b|severity:\s*critical/.test(haystack)) return "critical";
  if (
    /\bwarning\b|\bhigh\b|\belevated\b|\brisk\b|\bpressure\b|\bdelayed\b|\bdelay\b|\bfragil|\bunstable\b|\bmoderate\b/.test(
      haystack
    )
  ) {
    return "elevated";
  }
  return "none";
}

export function readObjectRiskCategory(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "General";
  const semantic = asRecord(record.semantic);
  return (
    normalizeText(semantic?.category) ||
    normalizeText(record.category) ||
    normalizeText(record.role) ||
    normalizeText(record.type) ||
    normalizeText(record.label) ||
    "General"
  );
}

export function readObjectRiskLabel(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "Unknown risk";
  return (
    normalizeText(record.label) ||
    normalizeText(record.name) ||
    normalizeText(record.type) ||
    normalizeText(record.id) ||
    "Unknown risk"
  );
}

export function readObjectSeverityLabel(obj: unknown, band: RiskBand): string {
  const explicit =
    readSceneField(obj, ["severity", "scanner_severity", "risk_status"]) ||
    readSceneField(obj, ["state", "status"]);
  if (explicit) return explicit;
  if (band === "critical") return "Critical";
  if (band === "elevated") return "Elevated";
  return "None";
}

export function readObjectImpactLabel(obj: unknown, category: string): string {
  return (
    readSceneField(obj, ["impact", "risk_impact", "downstream_impact"]) ||
    category ||
    "Local scope"
  );
}

export function scanSceneRiskObjects(objects: unknown[]): readonly ScannedRiskObject[] {
  const rows: ScannedRiskObject[] = [];

  for (const obj of objects) {
    const band = classifyRiskBand(readObjectHaystack(obj));
    if (band === "none") continue;
    const category = readObjectRiskCategory(obj);
    const record = asRecord(obj);
    rows.push(
      Object.freeze({
        objectId: normalizeText(record?.id) || null,
        label: readObjectRiskLabel(obj),
        band,
        category,
        severityLabel: readObjectSeverityLabel(obj, band),
        impact: readObjectImpactLabel(obj, category),
      })
    );
  }

  return Object.freeze(
    rows.sort((left, right) => {
      if (left.band === right.band) return left.label.localeCompare(right.label);
      if (left.band === "critical") return -1;
      if (right.band === "critical") return 1;
      return 0;
    })
  );
}
