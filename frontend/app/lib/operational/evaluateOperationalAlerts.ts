import type {
  OperationalAlertEvaluationResult,
  OperationalAlertRecord,
  OperationalAlertRule,
} from "./alertRuleTypes.ts";
import type { OperationalChangeSummary } from "./changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "./monitoringTypes.ts";
import type { OperationalPropagationPreview } from "./propagationPreviewTypes.ts";
import type { OperationalRiskExposureLevel, OperationalRiskImpactMap } from "./riskImpactTypes.ts";
import { clamp01 } from "../intelligence/shared/normalization.ts";
import { buildOperationalAlertRecordSignature, compareOperationalAlerts, dedupeOperationalAlerts } from "./alertDeduplication.ts";
import { propagationLevelToScore01, normalizeOperationalRisk } from "./riskImpactScoring.ts";

export type EvaluateOperationalAlertsInput = Readonly<{
  monitoringSnapshot: OperationalMonitoringSnapshot | null;
  operationalChangeSummary: OperationalChangeSummary | null;
  propagationPreview: OperationalPropagationPreview | null;
  operationalRiskImpactMap: OperationalRiskImpactMap | null;
  rules: readonly OperationalAlertRule[];
}>;

function pickLatestIso(values: readonly (string | null | undefined)[]): string {
  let best = "";
  for (const v of values) {
    if (v == null || v === "") continue;
    if (v > best) best = v;
  }
  return best === "" ? "1970-01-01T00:00:00.000Z" : best;
}

function exposureLevelScore(level: OperationalRiskExposureLevel): number {
  switch (level) {
    case "critical":
      return 0.9;
    case "high":
      return 0.62;
    case "elevated":
      return 0.35;
    case "minimal":
    default:
      return 0.08;
  }
}

function stableAlertId(ruleId: string, objectId: string | undefined, triggeredBy: string): string {
  const sig = buildOperationalAlertRecordSignature({ ruleId, objectId, triggeredBy });
  const compact = sig.replace(/[^a-z0-9|]+/gi, "_").slice(0, 200);
  return `nx_d3_op_alert_${compact}`;
}

function inTargetSet(rule: OperationalAlertRule, objectId: string | undefined): boolean {
  const targets = rule.targetObjectIds;
  if (targets == null || targets.length === 0) return true;
  if (objectId == null || objectId === "") return false;
  return targets.includes(objectId);
}

function maxSignalSeverityForObject(snapshot: OperationalMonitoringSnapshot | null, objectId: string): number {
  if (snapshot == null) return 0;
  let m = 0;
  for (const s of snapshot.signals) {
    if (s.objectId !== objectId) continue;
    m = Math.max(m, clamp01(s.severity));
  }
  return m;
}

function createRecord(input: Readonly<{
  rule: OperationalAlertRule;
  title: string;
  message: string;
  triggeredBy: string;
  objectId?: string;
  createdAt: string;
}>): OperationalAlertRecord {
  return {
    id: stableAlertId(input.rule.id, input.objectId, input.triggeredBy),
    severity: input.rule.severity,
    objectId: input.objectId,
    ruleId: input.rule.id,
    title: input.title,
    message: input.message,
    triggeredBy: input.triggeredBy,
    acknowledged: false,
    createdAt: input.createdAt,
  };
}

function evaluateRule(
  rule: OperationalAlertRule,
  ctx: Readonly<{
    monitoringSnapshot: OperationalMonitoringSnapshot | null;
    operationalChangeSummary: OperationalChangeSummary | null;
    propagationPreview: OperationalPropagationPreview | null;
    operationalRiskImpactMap: OperationalRiskImpactMap | null;
    generatedAt: string;
  }>
): OperationalAlertRecord[] {
  const out: OperationalAlertRecord[] = [];
  const { monitoringSnapshot, operationalChangeSummary, propagationPreview, operationalRiskImpactMap, generatedAt } = ctx;
  if (!rule.enabled) return out;

  const tRaw = Number.isFinite(rule.threshold) ? rule.threshold : 0;

  switch (rule.ruleType) {
    case "severity_threshold": {
      if (monitoringSnapshot == null) break;
      const thr = normalizeOperationalRisk(clamp01(tRaw));
      const hot = monitoringSnapshot.signals.filter((s) => {
        if (!inTargetSet(rule, s.objectId)) return false;
        return clamp01(s.severity) >= thr - 1e-9;
      });
      if (hot.length === 0) break;
      const peak = Math.max(...hot.map((s) => clamp01(s.severity)));
      const ids = [...new Set(hot.map((s) => s.objectId).filter((x): x is string => Boolean(x)))].sort().slice(0, 8);
      const triggeredBy = `severity_threshold|peak=${peak.toFixed(3)}|n=${hot.length}`;
      out.push(
        createRecord({
          rule,
          title: rule.label,
          message: `Peak operational signal severity ${(peak * 100).toFixed(0)}% meets or exceeds the ${(thr * 100).toFixed(0)}% rule. Affected objects: ${ids.length ? ids.join(", ") : "unscoped"}.`,
          triggeredBy,
          objectId: ids[0],
          createdAt: generatedAt,
        })
      );
      break;
    }
    case "propagation_threshold": {
      if (propagationPreview == null) break;
      const thr = normalizeOperationalRisk(clamp01(tRaw));
      const nodes = propagationPreview.propagationNodes.filter((n) => inTargetSet(rule, n.objectId));
      const worstNode = nodes.reduce<{ id: string; score: number } | null>((acc, n) => {
        const sc = normalizeOperationalRisk(n.propagationScore);
        if (sc < thr - 1e-9) return acc;
        if (acc == null || sc > acc.score) return { id: n.objectId, score: sc };
        return acc;
      }, null);
      const levelScore = propagationLevelToScore01(propagationPreview.highestRiskLevel);
      const hasScope =
        propagationPreview.propagationNodes.length > 0 ||
        propagationPreview.affectedObjectIds.length > 0 ||
        propagationPreview.sourceObjectIds.length > 0;
      const levelHits = worstNode == null && hasScope && levelScore >= thr - 1e-9;
      if (worstNode == null && !levelHits) break;
      const top =
        worstNode ??
        ({
          id:
            propagationPreview.sourceObjectIds[0] ??
            propagationPreview.affectedObjectIds[0] ??
            propagationPreview.propagationNodes[0]?.objectId ??
            "",
          score: levelScore,
        } as const);
      const triggeredBy = `propagation_threshold|score=${top.score.toFixed(3)}|level=${propagationPreview.highestRiskLevel}`;
      out.push(
        createRecord({
          rule,
          title: rule.label,
          message: `Propagation stress on ${top.id || "downstream"} is elevated (score ${(top.score * 100).toFixed(0)}%). Review cascade paths before load increases.`,
          triggeredBy,
          objectId: top.id || undefined,
          createdAt: generatedAt,
        })
      );
      break;
    }
    case "fragility_threshold": {
      if (operationalRiskImpactMap == null) break;
      const thr = normalizeOperationalRisk(clamp01(tRaw));
      const fragile = operationalRiskImpactMap.nodes.filter(
        (n) => n.fragilityScore != null && inTargetSet(rule, n.objectId) && normalizeOperationalRisk(n.fragilityScore) >= thr - 1e-9
      );
      if (fragile.length === 0) break;
      fragile.sort((a, b) => normalizeOperationalRisk(b.fragilityScore ?? 0) - normalizeOperationalRisk(a.fragilityScore ?? 0));
      const top = fragile[0]!;
      const triggeredBy = `fragility_threshold|score=${normalizeOperationalRisk(top.fragilityScore ?? 0).toFixed(3)}`;
      out.push(
        createRecord({
          rule,
          title: rule.label,
          message: `Structural fragility on ${top.objectId} is elevated relative to live operational load. Coordinate resilience review for this object.`,
          triggeredBy,
          objectId: top.objectId,
          createdAt: generatedAt,
        })
      );
      break;
    }
    case "risk_exposure_threshold": {
      if (operationalRiskImpactMap == null) break;
      const thr = normalizeOperationalRisk(clamp01(tRaw));
      const score = exposureLevelScore(operationalRiskImpactMap.highestExposureLevel);
      if (score < thr - 1e-9) break;
      const triggeredBy = `risk_exposure_threshold|level=${operationalRiskImpactMap.highestExposureLevel}|score=${score.toFixed(3)}`;
      out.push(
        createRecord({
          rule,
          title: rule.label,
          message: `Executive risk map shows ${operationalRiskImpactMap.highestExposureLevel} exposure (${operationalRiskImpactMap.executiveRiskHeadline}).`,
          triggeredBy,
          createdAt: generatedAt,
        })
      );
      break;
    }
    case "operational_degradation": {
      if (operationalChangeSummary == null) break;
      if (tRaw >= 100) {
        const minCritical = Math.max(1, Math.floor(tRaw - 99));
        if (operationalChangeSummary.criticalChanges < minCritical) break;
        const triggeredBy = `operational_degradation|criticalChanges=${operationalChangeSummary.criticalChanges}|min=${minCritical}`;
        out.push(
          createRecord({
            rule,
            title: rule.label,
            message: `${operationalChangeSummary.criticalChanges} critical operational change event(s) detected in the current window. Validate owners and rollback posture.`,
            triggeredBy,
            objectId: operationalChangeSummary.topChange?.objectId,
            createdAt: generatedAt,
          })
        );
      } else {
        const minWorsen = Math.max(1, Math.ceil(tRaw));
        if (operationalChangeSummary.worseningCount < minWorsen) break;
        const triggeredBy = `operational_degradation|worsening=${operationalChangeSummary.worseningCount}|min=${minWorsen}`;
        out.push(
          createRecord({
            rule,
            title: rule.label,
            message: `Operational trajectory is worsening on ${operationalChangeSummary.worseningCount} signal(s); minimum rule threshold is ${minWorsen}.`,
            triggeredBy,
            createdAt: generatedAt,
          })
        );
      }
      break;
    }
    case "critical_object": {
      const topId = monitoringSnapshot?.topRiskObjectId;
      if (topId == null || topId === "" || !inTargetSet(rule, topId)) break;
      const node = operationalRiskImpactMap?.nodes.find((n) => n.objectId === topId);
      const sev = node != null ? normalizeOperationalRisk(node.operationalSeverity) : maxSignalSeverityForObject(monitoringSnapshot, topId);
      const thr = normalizeOperationalRisk(clamp01(tRaw));
      if (sev < thr - 1e-9) break;
      const triggeredBy = `critical_object|top=${topId}|severity=${sev.toFixed(3)}`;
      out.push(
        createRecord({
          rule,
          title: rule.label,
          message: `Top risk object ${topId} is carrying elevated operational severity (${(sev * 100).toFixed(0)}%) versus the executive monitoring baseline.`,
          triggeredBy,
          objectId: topId,
          createdAt: generatedAt,
        })
      );
      break;
    }
    case "custom": {
      if (rule.id === "default_monitoring_status_critical") {
        if (monitoringSnapshot?.status !== "critical") break;
        const triggeredBy = `custom|snapshot_status=critical`;
        out.push(
          createRecord({
            rule,
            title: rule.label,
            message: `Live monitoring aggregate is critical: ${monitoringSnapshot.summary}`,
            triggeredBy,
            objectId: monitoringSnapshot.topRiskObjectId,
            createdAt: generatedAt,
          })
        );
      }
      break;
    }
    default:
      break;
  }

  return out;
}

export function evaluateOperationalAlerts(input: EvaluateOperationalAlertsInput): OperationalAlertEvaluationResult {
  const rules = input.rules ?? [];
  const generatedAt = pickLatestIso([
    input.monitoringSnapshot?.updatedAt,
    input.operationalChangeSummary?.generatedAt,
    input.propagationPreview?.generatedAt,
    input.operationalRiskImpactMap?.generatedAt,
  ]);

  const raw: OperationalAlertRecord[] = [];
  for (const rule of rules) {
    raw.push(
      ...evaluateRule(rule, {
        monitoringSnapshot: input.monitoringSnapshot,
        operationalChangeSummary: input.operationalChangeSummary,
        propagationPreview: input.propagationPreview,
        operationalRiskImpactMap: input.operationalRiskImpactMap,
        generatedAt,
      })
    );
  }

  const alerts = dedupeOperationalAlerts(raw);
  const triggeredRuleIds = [...new Set(alerts.map((a) => a.ruleId))].sort();
  let criticalAlertCount = 0;
  let warningAlertCount = 0;
  for (const a of alerts) {
    if (a.severity === "critical") criticalAlertCount += 1;
    else if (a.severity === "warning" || a.severity === "high") warningAlertCount += 1;
  }

  return {
    alerts,
    triggeredRuleIds,
    criticalAlertCount,
    warningAlertCount,
    generatedAt,
  };
}

export function topOperationalAlert(alerts: readonly OperationalAlertRecord[]): OperationalAlertRecord | null {
  if (alerts.length === 0) return null;
  const sorted = [...alerts].sort(compareOperationalAlerts);
  return sorted[0] ?? null;
}
