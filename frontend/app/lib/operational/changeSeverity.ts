import type { OperationalChangeRecord, OperationalChangeSeverity, OperationalChangeType } from "./changeDetectionTypes.ts";

const SEVERITY_ORDER: readonly OperationalChangeSeverity[] = ["low", "medium", "high", "critical"];

/**
 * Total order for `OperationalChangeSeverity` (deterministic, UI-free).
 * Returns negative if `a` is lower than `b`, positive if greater, 0 if equal.
 */
export function compareOperationalSeverity(a: OperationalChangeSeverity, b: OperationalChangeSeverity): number {
  return SEVERITY_ORDER.indexOf(a) - SEVERITY_ORDER.indexOf(b);
}

export function isOperationalChangeCritical(change: OperationalChangeRecord): boolean {
  return change.severity === "critical";
}

function parseSeverity01(raw: string | undefined): number | undefined {
  if (raw == null || typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(1, Math.max(0, n));
}

/**
 * Maps change type + optional numeric severity context to a change severity tier.
 * Does not depend on React or external I/O.
 */
export function deriveOperationalChangeSeverity(
  change: Readonly<{
    type: OperationalChangeType;
    previousValue?: string;
    currentValue?: string;
  }>
): OperationalChangeSeverity {
  const peak = Math.max(
    parseSeverity01(change.previousValue) ?? 0,
    parseSeverity01(change.currentValue) ?? 0
  );

  switch (change.type) {
    case "stable":
    case "resolved_signal":
    case "severity_decrease":
    case "object_removed":
      return peak >= 0.85 ? "medium" : "low";

    case "trend_change":
      return peak >= 0.55 ? "high" : "medium";

    case "object_added":
    case "status_change":
    case "new_signal":
      if (peak >= 0.85) return "critical";
      if (peak >= 0.55) return "high";
      return "medium";

    case "severity_increase":
      if (peak >= 0.85) return "critical";
      if (peak >= 0.55) return "high";
      return "medium";
  }
}
