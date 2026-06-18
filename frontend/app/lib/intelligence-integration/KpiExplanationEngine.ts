import { buildExecutiveKpiSummary } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import {
  EMPTY_KPI_EXPLANATION_REGISTRY,
  KPI_EXPLANATION_ENGINE_DIAGNOSTICS,
  KPI_EXPLANATION_ENGINE_VERSION,
  type ExecutiveKpiExplanation,
  type KpiExplanationEngineBuildInput,
  type KpiExplanationKind,
  type KpiExplanationRegistry,
} from "./kpiExplanationEngineContract.ts";
import type { ExecutiveKpiSummaryProfile } from "../kpi-intelligence/executiveKpiSummaryContract.ts";

let latestKpiExplanationRegistry: KpiExplanationRegistry = EMPTY_KPI_EXPLANATION_REGISTRY;

function isCritical(profile: ExecutiveKpiSummaryProfile): boolean {
  return (
    profile.health?.healthState === "Critical" ||
    profile.impact?.impactLevel === "Critical" ||
    profile.dependencyScore >= 85
  );
}

function resolveKind(profile: ExecutiveKpiSummaryProfile): KpiExplanationKind {
  if (isCritical(profile)) return "critical";
  if (profile.trend?.trendDirection === "Declining") return "declining";
  if (profile.trend?.trendDirection === "Improving") return "improving";
  return "stable";
}

function healthExplanation(profile: ExecutiveKpiSummaryProfile): string {
  const health = profile.health;
  if (!health) return "KPI health intelligence is not available.";
  return `${health.label} health is ${health.healthState} with score ${health.healthScore}.`;
}

function trendExplanation(profile: ExecutiveKpiSummaryProfile): string {
  const trend = profile.trend;
  if (!trend) return "KPI trend intelligence is not available.";
  return `${trend.label} trend is ${trend.trendDirection} with strength ${trend.trendStrength}.`;
}

function impactExplanation(profile: ExecutiveKpiSummaryProfile): string {
  const impact = profile.impact;
  if (!impact) return "KPI impact intelligence is not available.";
  return `${impact.label} impact is ${impact.impactLevel} with score ${impact.impactScore}.`;
}

function confidenceExplanation(profile: ExecutiveKpiSummaryProfile): string {
  const confidence = profile.confidenceScore;
  const source = profile.intelligence?.source ?? "runtime";
  if (confidence >= 75) {
    return `Confidence is high at ${confidence} from ${source} intelligence.`;
  }
  if (confidence >= 45) {
    return `Confidence is moderate at ${confidence} from ${source} intelligence.`;
  }
  return `Confidence is low at ${confidence}; treat signals with additional review.`;
}

function whyImproving(profile: ExecutiveKpiSummaryProfile): string | null {
  if (profile.trend?.trendDirection !== "Improving" && (profile.health?.healthScore ?? 0) < 70) {
    return null;
  }
  const parts = [
    profile.trend?.trendDirection === "Improving"
      ? `Trend is improving with strength ${profile.trend.trendStrength}.`
      : null,
    (profile.health?.healthScore ?? 0) >= 70
      ? `Health score ${profile.health?.healthScore ?? 0} supports positive momentum.`
      : null,
    (profile.impact?.impactScore ?? 0) >= 60
      ? `Impact score ${profile.impact?.impactScore ?? 0} indicates meaningful business influence.`
      : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function whyDeclining(profile: ExecutiveKpiSummaryProfile): string | null {
  const decliningTrend = profile.trend?.trendDirection === "Declining";
  const warningHealth =
    profile.health?.healthState === "Warning" || profile.health?.healthState === "Critical";
  const underTarget =
    profile.intelligence !== undefined && profile.intelligence.value < profile.intelligence.target;
  const overTargetCost =
    profile.intelligence?.category === "Cost" &&
    profile.intelligence.value > profile.intelligence.target;

  if (!decliningTrend && !warningHealth && !underTarget && !overTargetCost) {
    return null;
  }

  const parts = [
    decliningTrend
      ? `Trend is declining with strength ${profile.trend!.trendStrength}.`
      : null,
    warningHealth
      ? `Health state ${profile.health!.healthState} signals deterioration pressure.`
      : null,
    underTarget
      ? `Current value ${profile.intelligence!.value} is below target ${profile.intelligence!.target}.`
      : null,
    overTargetCost
      ? `Cost value ${profile.intelligence!.value} exceeds target ${profile.intelligence!.target}.`
      : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function whyCritical(profile: ExecutiveKpiSummaryProfile): string | null {
  if (!isCritical(profile)) return null;
  const parts = [
    profile.health?.healthState === "Critical"
      ? `Health is critical at score ${profile.health.healthScore}.`
      : null,
    profile.impact?.impactLevel === "Critical"
      ? `Impact level is critical with score ${profile.impact.impactScore}.`
      : null,
    profile.dependencyScore >= 85
      ? `Dependency score ${profile.dependencyScore} creates elevated exposure.`
      : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "KPI is flagged as critical across executive intelligence signals.";
}

function buildHeadline(profile: ExecutiveKpiSummaryProfile, kind: KpiExplanationKind): string {
  if (kind === "critical") return `${profile.label} requires executive attention.`;
  if (kind === "declining") return `${profile.label} is under declining pressure.`;
  if (kind === "improving") return `${profile.label} shows improving momentum.`;
  return `${profile.label} remains within stable operating range.`;
}

function buildExecutiveSummary(profile: ExecutiveKpiExplanation): string {
  return [
    executiveSummaryLead(profile),
    profile.healthExplanation,
    profile.trendExplanation,
    profile.impactExplanation,
    profile.confidenceExplanation,
  ].join(" ");
}

function executiveSummaryLead(profile: ExecutiveKpiExplanation): string {
  if (profile.whyCritical) return profile.whyCritical;
  if (profile.whyDeclining) return profile.whyDeclining;
  if (profile.whyImproving) return profile.whyImproving;
  return profile.headline;
}

function buildExplanation(profile: ExecutiveKpiSummaryProfile): ExecutiveKpiExplanation {
  const kind = resolveKind(profile);
  const explanation = Object.freeze({
    kpiId: profile.kpiId,
    label: profile.label,
    kind,
    headline: buildHeadline(profile, kind),
    healthExplanation: healthExplanation(profile),
    trendExplanation: trendExplanation(profile),
    impactExplanation: impactExplanation(profile),
    confidenceExplanation: confidenceExplanation(profile),
    whyImproving: whyImproving(profile),
    whyDeclining: whyDeclining(profile),
    whyCritical: whyCritical(profile),
    executiveSummary: "",
  });

  return Object.freeze({
    ...explanation,
    executiveSummary: buildExecutiveSummary(explanation),
  });
}

function buildRegistrySummary(
  explanations: readonly ExecutiveKpiExplanation[],
  kpiIntelligence: ReturnType<typeof buildExecutiveKpiSummary>
): string {
  return [
    "Executive KPI explanations ready for Assistant surfaces.",
    `${explanations.length} KPI explanation(s) generated.`,
    `${explanations.filter((entry) => entry.whyImproving).length} improving signal(s).`,
    `${explanations.filter((entry) => entry.whyDeclining).length} declining signal(s).`,
    `${explanations.filter((entry) => entry.whyCritical).length} critical signal(s).`,
    kpiIntelligence.executiveSummary,
  ].join(" ");
}

export function buildKpiExplanationRegistry(
  input: KpiExplanationEngineBuildInput = {}
): KpiExplanationRegistry {
  const kpiIntelligence = input.kpiIntelligence ?? buildExecutiveKpiSummary(input);

  if (kpiIntelligence.kpiCount === 0 || kpiIntelligence.profiles.length === 0) {
    latestKpiExplanationRegistry = EMPTY_KPI_EXPLANATION_REGISTRY;
    return latestKpiExplanationRegistry;
  }

  const explanations = Object.freeze(kpiIntelligence.profiles.map(buildExplanation));
  const improvingExplanations = Object.freeze(
    explanations.filter((entry) => entry.whyImproving !== null)
  );
  const decliningExplanations = Object.freeze(
    explanations.filter((entry) => entry.whyDeclining !== null)
  );
  const criticalExplanations = Object.freeze(
    explanations.filter((entry) => entry.whyCritical !== null)
  );

  const registry = Object.freeze({
    version: KPI_EXPLANATION_ENGINE_VERSION,
    explanationCount: explanations.length,
    explanations,
    improvingExplanations,
    decliningExplanations,
    criticalExplanations,
    executiveSummary: buildRegistrySummary(explanations, kpiIntelligence),
    kpiIntelligence,
    explanationReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: KPI_EXPLANATION_ENGINE_DIAGNOSTICS,
  });

  latestKpiExplanationRegistry = registry;
  return registry;
}

export function getKpiExplanationRegistry(): KpiExplanationRegistry {
  return latestKpiExplanationRegistry;
}

export function resetKpiExplanationEngineForTests(): void {
  latestKpiExplanationRegistry = EMPTY_KPI_EXPLANATION_REGISTRY;
}

export const KpiExplanationEngine = Object.freeze({
  buildKpiExplanationRegistry,
  getKpiExplanationRegistry,
  resetKpiExplanationEngineForTests,
});
