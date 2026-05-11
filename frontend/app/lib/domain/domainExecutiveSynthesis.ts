import { normalizeDomainId } from "./domainHelpers.ts";
import { explainExecutiveInsight } from "./domainExecutiveExplainability.ts";
import type { DomainFragilityScore } from "./domainFragilityScoring.ts";
import type { DomainRiskSignalResult, DomainRiskSeverity } from "./domainRiskSignals.ts";
import type { DomainScenario } from "./domainScenarioTypes.ts";
import type { DomainScenarioScore } from "./domainScenarioScoring.ts";
import type {
  DomainExecutiveInsight,
  ExecutiveDecisionPosture,
  ExecutivePriority,
} from "./domainExecutiveIntelligence.ts";

const MAX_INSIGHTS = 4;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function severityRank(value: DomainRiskSeverity | undefined): number {
  if (value === "critical") return 4;
  if (value === "high") return 3;
  if (value === "medium") return 2;
  if (value === "low") return 1;
  return 0;
}

function priorityFromInputs(params: {
  signalSeverity?: DomainRiskSeverity;
  fragilityScore?: number;
  scenarioScore?: number;
}): ExecutivePriority {
  if (params.signalSeverity === "critical" || (params.fragilityScore ?? 0) >= 86) return "critical";
  if (params.signalSeverity === "high" || (params.fragilityScore ?? 0) >= 66 || (params.scenarioScore ?? 0) >= 82) return "high";
  if (params.signalSeverity === "medium" || (params.fragilityScore ?? 0) >= 36 || (params.scenarioScore ?? 0) >= 50) return "medium";
  return "low";
}

function postureFromInputs(params: {
  signalSeverity?: DomainRiskSeverity;
  fragilityScore?: number;
  hasScenario: boolean;
  scenarioConfidence?: number;
}): ExecutiveDecisionPosture {
  if (params.signalSeverity === "critical" || (params.fragilityScore ?? 0) >= 86) return "critical";
  if ((params.fragilityScore ?? 0) >= 66 || params.signalSeverity === "high") return params.hasScenario ? "cautious" : "fragile";
  if ((params.fragilityScore ?? 0) >= 36 || params.signalSeverity === "medium") return "watch";
  if (params.hasScenario && (params.scenarioConfidence ?? 0) >= 0.72) return "stable";
  return "watch";
}

function scenarioScoreFor(scores: DomainScenarioScore[] | undefined, scenarioId: string): DomainScenarioScore | null {
  return scores?.find((score) => score.scenarioId === scenarioId) ?? null;
}

function bestScenarioForObject(
  scenarios: DomainScenario[],
  scores: DomainScenarioScore[] | undefined,
  objectId: string
): { scenario: DomainScenario; score: DomainScenarioScore | null } | null {
  const candidates = scenarios.filter((scenario) => scenario.relatedObjectIds.includes(objectId));
  if (!candidates.length) return null;
  const sorted = [...candidates].sort((left, right) => {
    const leftScore = scenarioScoreFor(scores, left.id)?.overallScore ?? Math.round(left.confidence * 100);
    const rightScore = scenarioScoreFor(scores, right.id)?.overallScore ?? Math.round(right.confidence * 100);
    if (rightScore !== leftScore) return rightScore - leftScore;
    return left.id.localeCompare(right.id);
  });
  const scenario = sorted[0];
  return { scenario, score: scenarioScoreFor(scores, scenario.id) };
}

function strongestSeverity(signals: DomainRiskSignalResult[]): DomainRiskSeverity | undefined {
  return signals.reduce<DomainRiskSeverity | undefined>((highest, signal) => {
    return severityRank(signal.severity) > severityRank(highest) ? signal.severity : highest;
  }, undefined);
}

function titleFor(params: {
  objectId: string;
  severity?: DomainRiskSeverity;
  hasScenario: boolean;
}): string {
  if (params.severity === "critical") return `Executive escalation around ${params.objectId}`;
  if (params.hasScenario) return `Scenario-ready pressure around ${params.objectId}`;
  return `Watch ${params.objectId} pressure`;
}

function dedupeInsights(insights: DomainExecutiveInsight[]): DomainExecutiveInsight[] {
  const seen = new Set<string>();
  const result: DomainExecutiveInsight[] = [];
  for (const insight of insights) {
    const key = `${insight.title}|${insight.relatedObjectIds.join(",")}|${insight.relatedScenarioIds?.join(",") ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(insight);
  }
  return result;
}

export function buildExecutiveInsights(params: {
  domainId: unknown;
  riskSignals?: DomainRiskSignalResult[];
  fragilityScores?: DomainFragilityScore[];
  scenarios?: DomainScenario[];
  scenarioScores?: DomainScenarioScore[];
}): DomainExecutiveInsight[] {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const riskSignals = Array.isArray(params.riskSignals) ? params.riskSignals : [];
    const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores : [];
    const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
    const scenarioScores = Array.isArray(params.scenarioScores) ? params.scenarioScores : [];
    const objectIds = Array.from(new Set([
      ...riskSignals.flatMap((signal) => signal.relatedObjectIds),
      ...fragilityScores.filter((score) => score.level !== "stable").map((score) => score.objectId),
      ...scenarios.flatMap((scenario) => scenario.relatedObjectIds),
    ])).filter(Boolean);

    if (!objectIds.length) {
      return [{
        id: `domain_exec_${domainId}_stable_watch`,
        domainId,
        title: "No executive risk concentration detected",
        summary: "Current domain signals do not show concentrated fragility.",
        posture: "stable",
        priority: "low",
        confidence: 0.42,
        relatedObjectIds: [],
        recommendedActions: ["Maintain monitoring until stronger risk or scenario evidence appears"],
        explanation: "No material risk signals, fragile nodes, or scenario pressures were available for synthesis.",
        executiveQuestions: ["What signal would change this posture?"],
        metadata: { fallback: true, source: "domain_executive_synthesis" },
      }];
    }

    const insights = objectIds.map((objectId) => {
      const objectSignals = riskSignals.filter((signal) => signal.relatedObjectIds.includes(objectId));
      const score = fragilityScores.find((fragility) => fragility.objectId === objectId);
      const bestScenario = bestScenarioForObject(scenarios, scenarioScores, objectId);
      const severity = strongestSeverity(objectSignals);
      const scenarioOverallScore = bestScenario?.score?.overallScore ?? (bestScenario ? Math.round(bestScenario.scenario.confidence * 100) : 0);
      const priority = priorityFromInputs({
        signalSeverity: severity,
        fragilityScore: score?.score,
        scenarioScore: scenarioOverallScore,
      });
      const posture = postureFromInputs({
        signalSeverity: severity,
        fragilityScore: score?.score,
        hasScenario: Boolean(bestScenario),
        scenarioConfidence: bestScenario?.scenario.confidence,
      });
      const confidence = clamp01(
        0.35 +
          Math.min(0.24, objectSignals.length * 0.06) +
          Math.min(0.2, (score?.score ?? 0) / 420) +
          Math.min(0.18, scenarioOverallScore / 500)
      );
      const recommendedActions = bestScenario
        ? bestScenario.scenario.recommendedActions.slice(0, 3)
        : [`Inspect risk concentration around ${objectId}`, "Create or compare a mitigation scenario before committing"];
      const insight: DomainExecutiveInsight = {
        id: `domain_exec_${domainId}_${normalizeIdPart(objectId)}_${posture}_${priority}`,
        domainId,
        title: titleFor({ objectId, severity, hasScenario: Boolean(bestScenario) }),
        summary: bestScenario
          ? `${objectId} has visible pressure and a scenario path: ${bestScenario.scenario.title}.`
          : `${objectId} has visible pressure but no strong mitigation scenario attached yet.`,
        posture,
        priority,
        confidence: Number(confidence.toFixed(2)),
        relatedObjectIds: [objectId],
        relatedScenarioIds: bestScenario ? [bestScenario.scenario.id] : undefined,
        relatedSignalIds: objectSignals.map((signal) => signal.id),
        recommendedActions,
        explanation: "",
        executiveQuestions: [
          bestScenario ? "What tradeoff does this scenario introduce?" : "What scenario would reduce this pressure?",
          "Which dependency should be protected first?",
        ],
        metadata: {
          source: "domain_executive_synthesis",
          fragilityScore: score?.score ?? null,
          scenarioScore: scenarioOverallScore || null,
          signalCount: objectSignals.length,
        },
      };
      return {
        ...insight,
        explanation: explainExecutiveInsight({ insight }),
      };
    });

    return dedupeInsights(insights)
      .sort((left, right) => {
        const priorityDelta = priorityWeight(right.priority) - priorityWeight(left.priority);
        if (priorityDelta !== 0) return priorityDelta;
        const confidenceDelta = right.confidence - left.confidence;
        if (confidenceDelta !== 0) return confidenceDelta;
        return left.id.localeCompare(right.id);
      })
      .slice(0, MAX_INSIGHTS);
  } catch {
    return [];
  }
}

function priorityWeight(priority: ExecutivePriority): number {
  if (priority === "critical") return 4;
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}
