import { buildExecutiveRiskSummary } from "./ExecutiveRiskSummary.ts";
import {
  EMPTY_RISK_VISUALIZATION_REGISTRY,
  RISK_VISUALIZATION_CONTRACT_VERSION,
  RISK_VISUALIZATION_DIAGNOSTICS,
  type RiskVisualizationBuildInput,
  type RiskVisualizationContract,
  type RiskVisualizationLevel,
  type RiskVisualizationPriority,
  type RiskVisualizationPropagation,
  type RiskVisualizationRegistry,
} from "./riskVisualizationContract.ts";
import type { ExecutiveRiskSummary } from "./executiveRiskSummaryContract.ts";
import type { RiskPropagationChain } from "./riskPropagationProfileContract.ts";

let latestRiskVisualizationRegistry: RiskVisualizationRegistry = EMPTY_RISK_VISUALIZATION_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function resolveRiskLevel(riskScore: number): RiskVisualizationLevel {
  if (riskScore >= 85) return "Critical";
  if (riskScore >= 65) return "High";
  if (riskScore >= 40) return "Medium";
  return "Low";
}

function resolvePropagationRole(
  nodeId: string,
  chain: RiskPropagationChain
): "source" | "target" | "intermediate" {
  if (chain.sourceId === nodeId) return "source";
  if (chain.targetId === nodeId) return "target";
  return "intermediate";
}

function resolvePropagationForNode(
  nodeId: string,
  chains: readonly RiskPropagationChain[]
): RiskVisualizationPropagation | null {
  const matching = chains
    .filter(
      (chain) =>
        chain.sourceId === nodeId ||
        chain.targetId === nodeId ||
        chain.steps.some((step) => step.nodeId === nodeId)
    )
    .sort((a, b) => b.propagationScore - a.propagationScore);

  const chain = matching[0];
  if (!chain) return null;

  return Object.freeze({
    chainId: chain.chainId,
    propagationScore: chain.propagationScore,
    sourceId: chain.sourceId,
    targetId: chain.targetId,
    sourceKind: chain.sourceKind,
    targetKind: chain.targetKind,
    role: resolvePropagationRole(nodeId, chain),
  });
}

function resolvePriority(
  nodeId: string,
  summary: ExecutiveRiskSummary
): RiskVisualizationPriority {
  const attention = summary.recommendedAttention.find((entry) => entry.nodeId === nodeId);
  if (attention) return attention.attentionLevel;

  const profile = summary.profiles.find((entry) => entry.nodeId === nodeId);
  if (!profile) return "monitor";
  if (profile.riskScore >= 85) return "immediate";
  if (profile.riskScore >= 65) return "prioritize";
  if (profile.riskScore >= 45) return "review";
  return "monitor";
}

function buildVisualizationEntry(
  summary: ExecutiveRiskSummary
): (profile: ExecutiveRiskSummary["profiles"][number]) => RiskVisualizationContract {
  const chains = summary.propagation.riskChains;
  return (profile) =>
    Object.freeze({
      nodeId: profile.nodeId,
      nodeKind: profile.nodeKind,
      label: profile.label,
      riskScore: clampScore(profile.riskScore),
      riskLevel:
        profile.objectRisk?.riskLevel ??
        resolveRiskLevel(profile.riskScore),
      riskPropagation: resolvePropagationForNode(profile.nodeId, chains),
      riskPriority: resolvePriority(profile.nodeId, summary),
    });
}

export function buildRiskVisualizationRegistry(
  input: RiskVisualizationBuildInput = {}
): RiskVisualizationRegistry {
  const summary = buildExecutiveRiskSummary({
    sceneJson: input.sceneJson,
    objects: input.objects,
    relationships: input.relationships,
    kpis: input.kpis,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
  });

  const toEntry = buildVisualizationEntry(summary);
  const entries = Object.freeze(summary.profiles.map((profile) => toEntry(profile)));
  const entryByNodeId = Object.freeze(
    entries.reduce<Record<string, RiskVisualizationContract>>((registry, entry) => {
      registry[entry.nodeId] = entry;
      return registry;
    }, {})
  );

  latestRiskVisualizationRegistry = Object.freeze({
    version: RISK_VISUALIZATION_CONTRACT_VERSION,
    entries,
    entryByNodeId,
    entryCount: entries.length,
    sceneMutation: false,
    dashboardMutation: false,
    renderingMutation: false,
    readOnly: true,
    diagnostics: RISK_VISUALIZATION_DIAGNOSTICS,
  });

  return latestRiskVisualizationRegistry;
}

export function getRiskVisualizationRegistry(): RiskVisualizationRegistry {
  return latestRiskVisualizationRegistry;
}

export function resetRiskVisualizationContractForTests(): void {
  latestRiskVisualizationRegistry = EMPTY_RISK_VISUALIZATION_REGISTRY;
}

export const RiskVisualizationContractRuntime = Object.freeze({
  buildRiskVisualizationRegistry,
  getRiskVisualizationRegistry,
  resolveRiskLevel,
});
