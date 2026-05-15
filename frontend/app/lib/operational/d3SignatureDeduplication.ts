import type { OperationalAlertEvaluationResult } from "./alertRuleTypes.ts";
import { buildOperationalAlertRecordSignature } from "./alertDeduplication.ts";
import type { OperationalChangeSummary } from "./changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "./monitoringTypes.ts";
import type { OperationalPropagationPreview } from "./propagationPreviewTypes.ts";
import type { OperationalRiskImpactMap } from "./riskImpactTypes.ts";
import { stableSignature } from "../intelligence/shared/dedupe.ts";

/** Lexicographic compare for signatures (stable ordering). */
export function compareD3Signatures(a: string, b: string): number {
  return String(a ?? "").localeCompare(String(b ?? ""));
}

export function buildD3MonitoringSignature(snapshot: OperationalMonitoringSnapshot | null): string {
  if (snapshot == null) return "m:null";
  const sigSignals = snapshot.signals.map((s) => ({
    id: s.id,
    oid: s.objectId ?? "",
    sev: typeof s.severity === "number" && Number.isFinite(s.severity) ? Number(s.severity.toFixed(4)) : 0,
    tr: s.trend,
  }));
  sigSignals.sort((x, y) => x.id.localeCompare(y.id));
  return stableSignature({
    id: snapshot.id,
    st: snapshot.status,
    tr: snapshot.trend,
    u: snapshot.updatedAt,
    aff: [...snapshot.affectedObjectIds].sort((x, y) => x.localeCompare(y)),
    top: snapshot.topRiskObjectId ?? "",
    sig: sigSignals,
  });
}

export function buildOperationalChangeSignature(summary: OperationalChangeSummary | null): string {
  if (summary == null) return "chg:null";
  return stableSignature({
    t: summary.totalChanges,
    c: summary.criticalChanges,
    w: summary.worseningCount,
    i: summary.improvingCount,
    s: summary.stableCount,
    g: summary.generatedAt,
    aff: [...summary.affectedObjectIds].sort((a, b) => a.localeCompare(b)),
    top: summary.topChange?.id ?? "",
  });
}

export function buildPropagationSignature(preview: OperationalPropagationPreview | null): string {
  if (preview == null) return "prop:null";
  const nodes = preview.propagationNodes.map((n) => ({
    o: n.objectId,
    s: n.sourceObjectId,
    sc: typeof n.propagationScore === "number" && Number.isFinite(n.propagationScore) ? Number(n.propagationScore.toFixed(4)) : 0,
    rl: n.riskLevel,
  }));
  nodes.sort((a, b) => a.o.localeCompare(b.o));
  return stableSignature({
    id: preview.id,
    h: preview.highestRiskLevel,
    g: preview.generatedAt,
    src: [...preview.sourceObjectIds].sort((a, b) => a.localeCompare(b)),
    aff: [...preview.affectedObjectIds].sort((a, b) => a.localeCompare(b)),
    nodes,
  });
}

export function buildOperationalRiskSignature(map: OperationalRiskImpactMap | null): string {
  if (map == null) return "risk:null";
  const nodes = map.nodes.map((n) => ({
    o: n.objectId,
    ex: n.exposureLevel,
    os: Number(n.operationalSeverity.toFixed(4)),
    ps: Number(n.propagationScore.toFixed(4)),
    fs: n.fragilityScore == null ? null : Number(n.fragilityScore.toFixed(4)),
  }));
  nodes.sort((a, b) => a.o.localeCompare(b.o));
  return stableSignature({
    id: map.id,
    hi: map.highestExposureLevel,
    g: map.generatedAt,
    aff: [...map.affectedObjectIds].sort((a, b) => a.localeCompare(b)),
    mf: map.mostFragileObjectId ?? "",
    nodes,
  });
}

/** Bundle signature for alert evaluation (post-dedupe list). */
export function buildOperationalAlertSignature(result: OperationalAlertEvaluationResult | null): string {
  if (result == null) return "alerts:null";
  const parts = [...result.alerts]
    .map((a) =>
      buildOperationalAlertRecordSignature({
        ruleId: a.ruleId,
        objectId: a.objectId,
        triggeredBy: a.triggeredBy,
      })
    )
    .sort((x, y) => x.localeCompare(y));
  return stableSignature({
    g: result.generatedAt,
    cc: result.criticalAlertCount,
    wc: result.warningAlertCount,
    rules: [...result.triggeredRuleIds].sort((a, b) => a.localeCompare(b)),
    parts,
  });
}
