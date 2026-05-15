import type { OperationalAlertRecord } from "./alertRuleTypes.ts";

function sanitizeSignaturePart(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\|+/g, "_")
    .slice(0, 256);
}

/** Stable signature for a single alert record (rule + optional object + trigger class). */
export function buildOperationalAlertRecordSignature(input: Readonly<{ ruleId: string; objectId?: string; triggeredBy: string }>): string {
  const oid = input.objectId == null || input.objectId === "" ? "_" : sanitizeSignaturePart(input.objectId);
  return `${sanitizeSignaturePart(input.ruleId)}|${oid}|${sanitizeSignaturePart(input.triggeredBy)}`;
}

function severityRank(severity: OperationalAlertRecord["severity"]): number {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "warning":
      return 2;
    case "info":
    default:
      return 1;
  }
}

/** Deterministic ordering: severity desc, ruleId, objectId, id. */
export function compareOperationalAlerts(a: OperationalAlertRecord, b: OperationalAlertRecord): number {
  const rs = severityRank(b.severity) - severityRank(a.severity);
  if (rs !== 0) return rs;
  const rt = a.ruleId.localeCompare(b.ruleId);
  if (rt !== 0) return rt;
  const oa = (a.objectId ?? "").localeCompare(b.objectId ?? "");
  if (oa !== 0) return oa;
  return a.id.localeCompare(b.id);
}

export function dedupeOperationalAlerts(alerts: readonly OperationalAlertRecord[]): readonly OperationalAlertRecord[] {
  const bySig = new Map<string, OperationalAlertRecord>();
  for (const alert of alerts) {
    const sig = buildOperationalAlertRecordSignature({
      ruleId: alert.ruleId,
      objectId: alert.objectId,
      triggeredBy: alert.triggeredBy,
    });
    const prev = bySig.get(sig);
    if (prev == null) {
      bySig.set(sig, alert);
      continue;
    }
    if (compareOperationalAlerts(alert, prev) < 0) {
      bySig.set(sig, alert);
    }
  }
  const out = [...bySig.values()];
  out.sort(compareOperationalAlerts);
  return out;
}
