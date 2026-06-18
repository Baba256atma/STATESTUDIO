import { buildExecutiveRiskSummary } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import {
  EMPTY_RISK_EXPLANATION_REGISTRY,
  RISK_EXPLANATION_ENGINE_DIAGNOSTICS,
  RISK_EXPLANATION_ENGINE_VERSION,
  type ExecutiveRiskExplanation,
  type RiskExplanationEngineBuildInput,
  type RiskExplanationRegistry,
} from "./riskExplanationEngineContract.ts";
import type { ExecutiveRiskSummaryProfile } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { RiskPropagationChain } from "../risk-intelligence/riskPropagationProfileContract.ts";

let latestRiskExplanationRegistry: RiskExplanationRegistry = EMPTY_RISK_EXPLANATION_REGISTRY;

function collectRiskReasoning(profile: ExecutiveRiskSummaryProfile): readonly string[] {
  if (profile.objectRisk) return profile.objectRisk.riskReasoning;
  if (profile.relationshipRisk) return profile.relationshipRisk.riskReasoning;
  if (profile.kpiRisk) return profile.kpiRisk.riskReasoning;
  return Object.freeze([]);
}

function resolveRiskLevel(profile: ExecutiveRiskSummaryProfile): string {
  if (profile.objectRisk) return profile.objectRisk.riskLevel;
  if (profile.riskScore >= 85) return "Critical";
  if (profile.riskScore >= 65) return "High";
  if (profile.riskScore >= 45) return "Medium";
  return "Low";
}

function riskScoreExplanation(profile: ExecutiveRiskSummaryProfile): string {
  const level = resolveRiskLevel(profile);
  return `${profile.label} (${profile.nodeKind}) risk score is ${profile.riskScore} (${level}).`;
}

function findChainsForNode(
  nodeId: string,
  chains: readonly RiskPropagationChain[]
): readonly RiskPropagationChain[] {
  return Object.freeze(
    chains.filter(
      (chain) =>
        chain.sourceId === nodeId ||
        chain.targetId === nodeId ||
        chain.steps.some((step) => step.nodeId === nodeId)
    )
  );
}

function riskChainExplanation(
  profile: ExecutiveRiskSummaryProfile,
  chains: readonly RiskPropagationChain[]
): string | null {
  const related = findChainsForNode(profile.nodeId, chains);
  if (related.length === 0) return null;

  return related
    .slice(0, 3)
    .map(
      (chain) =>
        `Risk chain ${chain.sourceId} (${chain.sourceKind}) -> ${chain.targetId} (${chain.targetKind}) with propagation score ${chain.propagationScore}.`
    )
    .join(" ");
}

function propagationExplanation(
  profile: ExecutiveRiskSummaryProfile,
  chains: readonly RiskPropagationChain[],
  propagationReasoning: readonly string[]
): string {
  const outgoing = chains.filter((chain) => chain.sourceId === profile.nodeId);
  const reasoning = propagationReasoning[0];
  if (outgoing.length === 0) {
    return reasoning
      ? `${profile.label}: ${reasoning}`
      : `${profile.label}: no active risk propagation path detected from this node.`;
  }
  const targets = outgoing
    .slice(0, 3)
    .map((chain) => `${chain.targetId} (${chain.targetKind}, score ${chain.propagationScore})`)
    .join(", ");
  return reasoning
    ? `${profile.label} propagates risk toward ${targets}. ${reasoning}`
    : `${profile.label} propagates risk toward ${targets}.`;
}

function matchVulnerability(
  profile: ExecutiveRiskSummaryProfile,
  vulnerabilities: readonly string[]
): string | null {
  const matches = vulnerabilities.filter((entry) => entry.includes(profile.nodeId));
  if (matches.length === 0) return null;
  return matches.join(" ");
}

function whatIsRisky(profile: ExecutiveRiskSummaryProfile): string {
  const level = resolveRiskLevel(profile);
  return `${profile.label} is a risky ${profile.nodeKind} node with ${level} risk at score ${profile.riskScore}.`;
}

function whyItIsRisky(profile: ExecutiveRiskSummaryProfile): string {
  const reasoning = collectRiskReasoning(profile);
  if (reasoning.length > 0) {
    return `It is risky because ${reasoning.join(" ")}`;
  }

  if (profile.relationshipRisk?.singlePointOfFailure) {
    return "It is risky because this relationship is a single point of failure.";
  }
  if (profile.relationshipRisk?.criticalDependency) {
    return "It is risky because this relationship carries a critical dependency.";
  }
  if (profile.kpiRisk?.criticalKpi) {
    return "It is risky because this KPI is classified as critical.";
  }
  if (profile.kpiRisk?.decliningKpi) {
    return "It is risky because this KPI is in decline.";
  }
  if (profile.kpiRisk?.volatileKpi) {
    return "It is risky because this KPI is volatile.";
  }

  return `It is risky because the ${profile.nodeKind} risk score ${profile.riskScore} exceeds executive monitoring thresholds.`;
}

function whereRiskPropagates(
  profile: ExecutiveRiskSummaryProfile,
  chains: readonly RiskPropagationChain[]
): string | null {
  const outgoing = chains.filter((chain) => chain.sourceId === profile.nodeId);
  if (outgoing.length === 0) return null;

  return outgoing
    .slice(0, 3)
    .map((chain) => {
      const path = chain.steps.map((step) => `${step.label} (${step.nodeKind})`).join(" -> ");
      return `Risk propagates from ${profile.label} through ${path || `${chain.sourceId} -> ${chain.targetId}`} with score ${chain.propagationScore}.`;
    })
    .join(" ");
}

function buildExecutiveSummary(
  explanation: Omit<ExecutiveRiskExplanation, "executiveSummary">
): string {
  return [
    explanation.whatIsRisky,
    explanation.whyItIsRisky,
    explanation.riskScoreExplanation,
    explanation.propagationExplanation,
    explanation.riskChainExplanation,
    explanation.vulnerabilityExplanation,
    explanation.whereRiskPropagates,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildProfileExplanation(
  profile: ExecutiveRiskSummaryProfile,
  riskIntelligence: ReturnType<typeof buildExecutiveRiskSummary>
): ExecutiveRiskExplanation {
  const chains = riskIntelligence.propagation.riskChains;
  const partial = Object.freeze({
    nodeId: profile.nodeId,
    nodeKind: profile.nodeKind,
    label: profile.label,
    riskScoreExplanation: riskScoreExplanation(profile),
    riskChainExplanation: riskChainExplanation(profile, chains),
    propagationExplanation: propagationExplanation(
      profile,
      chains,
      riskIntelligence.propagation.propagationReasoning
    ),
    vulnerabilityExplanation: matchVulnerability(profile, riskIntelligence.topVulnerabilities),
    whatIsRisky: whatIsRisky(profile),
    whyItIsRisky: whyItIsRisky(profile),
    whereRiskPropagates: whereRiskPropagates(profile, chains),
    executiveSummary: "",
  });

  return Object.freeze({
    ...partial,
    executiveSummary: buildExecutiveSummary(partial),
  });
}

function buildChainExplanation(chain: RiskPropagationChain): ExecutiveRiskExplanation {
  const path = chain.steps.map((step) => `${step.label} (${step.nodeKind})`).join(" -> ");
  const label = `${chain.sourceId} -> ${chain.targetId}`;
  const partial = Object.freeze({
    nodeId: chain.chainId,
    nodeKind: "chain" as const,
    label,
    riskScoreExplanation: `Risk chain propagation score is ${chain.propagationScore}.`,
    riskChainExplanation: `Chain links ${chain.sourceId} (${chain.sourceKind}) to ${chain.targetId} (${chain.targetKind}).`,
    propagationExplanation: path
      ? `Propagation path: ${path}.`
      : `Propagation path: ${chain.sourceId} -> ${chain.targetId}.`,
    vulnerabilityExplanation: null,
    whatIsRisky: `Risk chain ${label} is a risky high-propagation pathway with score ${chain.propagationScore}.`,
    whyItIsRisky: `It is risky because risk moves across ${chain.steps.length || 2} connected node(s) from ${chain.sourceKind} to ${chain.targetKind}.`,
    whereRiskPropagates: path
      ? `Risk propagates along ${path}.`
      : `Risk propagates from ${chain.sourceId} to ${chain.targetId}.`,
    executiveSummary: "",
  });

  return Object.freeze({
    ...partial,
    executiveSummary: buildExecutiveSummary(partial),
  });
}

function buildRegistrySummary(
  explanations: readonly ExecutiveRiskExplanation[],
  riskIntelligence: ReturnType<typeof buildExecutiveRiskSummary>
): string {
  return [
    "Executive risk explanations ready for Assistant surfaces.",
    `${explanations.length} risk explanation(s) generated from template-driven DS-6 intelligence.`,
    riskIntelligence.executiveSummary,
  ].join(" ");
}

export function buildRiskExplanationRegistry(
  input: RiskExplanationEngineBuildInput = {}
): RiskExplanationRegistry {
  const riskIntelligence = input.riskIntelligence ?? buildExecutiveRiskSummary(input);

  if (
    riskIntelligence.profiles.length === 0 &&
    riskIntelligence.propagation.riskChains.length === 0
  ) {
    latestRiskExplanationRegistry = EMPTY_RISK_EXPLANATION_REGISTRY;
    return latestRiskExplanationRegistry;
  }

  const profileExplanations = riskIntelligence.profiles.map((profile) =>
    buildProfileExplanation(profile, riskIntelligence)
  );
  const chainExplanations = riskIntelligence.propagation.riskChains
    .slice(0, 5)
    .map((chain) => buildChainExplanation(chain));
  const explanations = Object.freeze([...profileExplanations, ...chainExplanations]);

  const registry = Object.freeze({
    version: RISK_EXPLANATION_ENGINE_VERSION,
    explanationCount: explanations.length,
    explanations,
    executiveSummary: buildRegistrySummary(explanations, riskIntelligence),
    riskIntelligence,
    explanationReady: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: RISK_EXPLANATION_ENGINE_DIAGNOSTICS,
  });

  latestRiskExplanationRegistry = registry;
  return registry;
}

export function getRiskExplanationRegistry(): RiskExplanationRegistry {
  return latestRiskExplanationRegistry;
}

export function resetRiskExplanationEngineForTests(): void {
  latestRiskExplanationRegistry = EMPTY_RISK_EXPLANATION_REGISTRY;
}

export const RiskExplanationEngine = Object.freeze({
  buildRiskExplanationRegistry,
  getRiskExplanationRegistry,
  resetRiskExplanationEngineForTests,
});
