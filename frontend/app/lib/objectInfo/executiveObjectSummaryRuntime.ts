import type { ObjectInfoHudModel } from "../scene/objectInfoHudTypes";

export const EXECUTIVE_OBJECT_SUMMARY_MAX_CHARS = 120;

const logKeys = new Set<string>();

function normalizeText(value: string | null | undefined, fallback: string): string {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function truncateSummary(text: string, maxChars = EXECUTIVE_OBJECT_SUMMARY_MAX_CHARS): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1).trimEnd()}…`;
}

export function buildExecutiveObjectSummary(model: ObjectInfoHudModel): string {
  const name = normalizeText(model.objectName, model.selectedObjectId ?? "Object");
  const provided = normalizeText(model.executiveSummary, "");
  if (provided) {
    const summary = truncateSummary(provided);
    logObjectSummary({ objectId: model.selectedObjectId, source: "provided", summary });
    return summary;
  }

  const health = normalizeText(model.healthLabel ?? model.statusLabel, "monitoring");
  const risk = normalizeText(
    model.editableObject?.riskLevel != null ? String(model.editableObject.riskLevel) : model.riskLevel,
    "moderate"
  );
  const impact =
    model.statusTone === "critical" || model.statusTone === "high"
      ? "elevated systemic impact"
      : model.statusTone === "elevated"
        ? "moderate systemic impact"
        : "stable operational context";

  const generated = truncateSummary(`${name} is ${health.toLowerCase()} with ${risk.toLowerCase()} risk and ${impact}.`);
  logObjectSummary({ objectId: model.selectedObjectId, source: "generated", summary: generated });
  return generated;
}

export function logObjectSummary(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][ObjectSummary]", payload);
}

export function resetExecutiveObjectSummaryLogsForTests(): void {
  logKeys.clear();
}
