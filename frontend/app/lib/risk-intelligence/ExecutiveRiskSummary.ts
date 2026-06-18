import { buildObjectRiskRegistry } from "./ObjectRiskEngine.ts";
import { buildRelationshipRiskRegistry } from "./RelationshipRiskEngine.ts";
import { buildKpiRiskRegistry } from "./KpiRiskEngine.ts";
import { buildRiskPropagationProfile } from "./RiskPropagationEngine.ts";
import {
  EMPTY_EXECUTIVE_RISK_SUMMARY,
  EXEC_RISK_SUMMARY_DIAGNOSTICS,
  EXEC_RISK_SUMMARY_VERSION,
  type ExecutiveRiskAttention,
  type ExecutiveRiskAttentionLevel,
  type ExecutiveRiskNodeKind,
  type ExecutiveRiskSummary,
  type ExecutiveRiskSummaryBuildInput,
  type ExecutiveRiskSummaryProfile,
} from "./executiveRiskSummaryContract.ts";
import type { KpiRiskProfile } from "./kpiRiskProfileContract.ts";
import type { ObjectRiskProfile } from "./objectRiskContract.ts";
import type { RelationshipRiskProfile } from "./relationshipRiskProfileContract.ts";
import type { RiskPropagationChain, RiskPropagationProfile } from "./riskPropagationProfileContract.ts";

type UnifiedRiskEntry = Readonly<{
  nodeId: string;
  nodeKind: Exclude<ExecutiveRiskNodeKind, "chain">;
  label: string;
  riskScore: number;
  summary: string;
  profile: ExecutiveRiskSummaryProfile;
}>;

let latestExecutiveRiskSummary: ExecutiveRiskSummary = EMPTY_EXECUTIVE_RISK_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveObjectLabel(objectId: string, objects: readonly unknown[]): string {
  for (const raw of objects) {
    if (!raw || typeof raw !== "object") continue;
    const record = raw as Record<string, unknown>;
    const id = readString(record.id) || readString(record.objectId) || readString(record.name);
    if (id !== objectId) continue;
    return readString(record.label) || readString(record.name) || objectId;
  }
  return objectId;
}

function collectRiskLayers(input: ExecutiveRiskSummaryBuildInput): Readonly<{
  objectProfiles: readonly ObjectRiskProfile[];
  relationshipProfiles: readonly RelationshipRiskProfile[];
  kpiProfiles: readonly KpiRiskProfile[];
  propagation: RiskPropagationProfile;
}> {
  const propagationInput = Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects,
    relationships: input.relationships,
    kpis: input.kpis,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
  });

  const objectProfiles =
    input.objectRiskProfiles ??
    buildObjectRiskRegistry({
      sceneJson: input.sceneJson,
      sceneObjects: input.objects ?? input.sceneObjects,
      dataSourceObjects: input.dataSourceObjects,
    }).profiles;
  const relationshipProfiles =
    input.relationshipRiskProfiles ??
    buildRelationshipRiskRegistry({
      sceneJson: input.sceneJson,
      relationships: input.relationships,
      objects: input.objects ?? input.sceneObjects,
    }).profiles;
  const kpiProfiles =
    input.kpiRiskProfiles ??
    buildKpiRiskRegistry({
      sceneJson: input.sceneJson,
      kpis: input.kpis,
      dataSourceKpis: input.dataSourceKpis,
      historicalSnapshots: input.historicalSnapshots,
    }).profiles;
  const propagation = input.propagationProfile ?? buildRiskPropagationProfile(propagationInput);

  return Object.freeze({ objectProfiles, relationshipProfiles, kpiProfiles, propagation });
}

function buildUnifiedRiskEntries(
  layers: Readonly<{
    objectProfiles: readonly ObjectRiskProfile[];
    relationshipProfiles: readonly RelationshipRiskProfile[];
    kpiProfiles: readonly KpiRiskProfile[];
  }>,
  objects: readonly unknown[]
): readonly UnifiedRiskEntry[] {
  const entries: UnifiedRiskEntry[] = [
    ...layers.objectProfiles.map((profile): UnifiedRiskEntry => {
      const label = resolveObjectLabel(profile.objectId, objects);
      return Object.freeze({
        nodeId: profile.objectId,
        nodeKind: "object",
        label,
        riskScore: profile.riskScore,
        summary: `object ${profile.objectId}: ${profile.riskLevel} risk ${profile.riskScore}`,
        profile: Object.freeze({
          nodeId: profile.objectId,
          nodeKind: "object",
          label,
          riskScore: profile.riskScore,
          objectRisk: profile,
        }),
      });
    }),
    ...layers.relationshipProfiles.map((profile): UnifiedRiskEntry => {
      const label = `${profile.sourceId} -> ${profile.targetId}`;
      return Object.freeze({
        nodeId: profile.relationshipId,
        nodeKind: "relationship",
        label,
        riskScore: profile.relationshipRiskScore,
        summary: `relationship ${profile.relationshipId}: risk ${profile.relationshipRiskScore}`,
        profile: Object.freeze({
          nodeId: profile.relationshipId,
          nodeKind: "relationship",
          label,
          riskScore: profile.relationshipRiskScore,
          relationshipRisk: profile,
        }),
      });
    }),
    ...layers.kpiProfiles.map((profile): UnifiedRiskEntry => {
      return Object.freeze({
        nodeId: profile.kpiId,
        nodeKind: "kpi",
        label: profile.label,
        riskScore: profile.kpiRiskScore,
        summary: `kpi ${profile.kpiId}: risk ${profile.kpiRiskScore}`,
        profile: Object.freeze({
          nodeId: profile.kpiId,
          nodeKind: "kpi",
          label: profile.label,
          riskScore: profile.kpiRiskScore,
          kpiRisk: profile,
        }),
      });
    }),
  ];

  return Object.freeze(entries.sort((a, b) => b.riskScore - a.riskScore));
}

function topRisks(entries: readonly UnifiedRiskEntry[]): readonly string[] {
  return Object.freeze(entries.slice(0, 5).map((entry) => entry.summary));
}

function topRiskChains(chains: readonly RiskPropagationChain[]): readonly string[] {
  return Object.freeze(
    [...chains]
      .sort((a, b) => b.propagationScore - a.propagationScore)
      .slice(0, 5)
      .map(
        (chain) =>
          `${chain.sourceId} (${chain.sourceKind}) -> ${chain.targetId} (${chain.targetKind}): propagation ${chain.propagationScore}`
      )
  );
}

function topVulnerabilities(
  layers: Readonly<{
    objectProfiles: readonly ObjectRiskProfile[];
    relationshipProfiles: readonly RelationshipRiskProfile[];
    kpiProfiles: readonly KpiRiskProfile[];
  }>
): readonly string[] {
  const vulnerabilities: Array<{ score: number; summary: string }> = [];

  for (const profile of layers.relationshipProfiles) {
    if (profile.singlePointOfFailure) {
      vulnerabilities.push({
        score: profile.relationshipRiskScore + 20,
        summary: `single point of failure ${profile.relationshipId}: ${profile.sourceId} -> ${profile.targetId}`,
      });
    }
    if (profile.criticalDependency) {
      vulnerabilities.push({
        score: profile.relationshipRiskScore + 10,
        summary: `critical dependency ${profile.relationshipId}: ${profile.sourceId} -> ${profile.targetId}`,
      });
    }
  }

  for (const profile of layers.kpiProfiles) {
    if (profile.criticalKpi) {
      vulnerabilities.push({
        score: profile.kpiRiskScore + 15,
        summary: `critical KPI ${profile.kpiId}: ${profile.label}`,
      });
    }
    if (profile.volatileKpi) {
      vulnerabilities.push({
        score: profile.kpiRiskScore + 8,
        summary: `volatile KPI ${profile.kpiId}: ${profile.label}`,
      });
    }
    if (profile.decliningKpi) {
      vulnerabilities.push({
        score: profile.kpiRiskScore + 5,
        summary: `declining KPI ${profile.kpiId}: ${profile.label}`,
      });
    }
  }

  for (const profile of layers.objectProfiles) {
    if (profile.riskLevel === "Critical" || profile.riskLevel === "High") {
      vulnerabilities.push({
        score: profile.riskScore,
        summary: `object vulnerability ${profile.objectId}: ${profile.riskLevel} risk ${profile.riskScore}`,
      });
    }
  }

  return Object.freeze(
    vulnerabilities
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.summary)
  );
}

function attentionLevelForEntry(entry: UnifiedRiskEntry): ExecutiveRiskAttentionLevel {
  if (entry.riskScore >= 85) return "immediate";
  if (entry.riskScore >= 65) return "prioritize";
  if (entry.riskScore >= 45) return "review";
  return "monitor";
}

function attentionLevelForChain(chain: RiskPropagationChain): ExecutiveRiskAttentionLevel {
  if (chain.propagationScore >= 85) return "immediate";
  if (chain.propagationScore >= 65) return "prioritize";
  if (chain.propagationScore >= 45) return "review";
  return "monitor";
}

function recommendedAttention(
  entries: readonly UnifiedRiskEntry[],
  chains: readonly RiskPropagationChain[]
): readonly ExecutiveRiskAttention[] {
  const rank: Record<ExecutiveRiskAttentionLevel, number> = {
    immediate: 0,
    prioritize: 1,
    review: 2,
    monitor: 3,
  };

  const fromEntries = entries.map(
    (entry): ExecutiveRiskAttention =>
      Object.freeze({
        nodeId: entry.nodeId,
        nodeKind: entry.nodeKind,
        attentionLevel: attentionLevelForEntry(entry),
        reason: `${entry.label} carries ${entry.nodeKind} risk score ${entry.riskScore}.`,
      })
  );

  const fromChains = chains.map(
    (chain): ExecutiveRiskAttention =>
      Object.freeze({
        nodeId: chain.chainId,
        nodeKind: "chain",
        attentionLevel: attentionLevelForChain(chain),
        reason: `Risk chain ${chain.sourceId} -> ${chain.targetId} propagation score ${chain.propagationScore}.`,
      })
  );

  return Object.freeze(
    [...fromEntries, ...fromChains]
      .filter((entry) => entry.attentionLevel !== "monitor")
      .sort((a, b) => rank[a.attentionLevel] - rank[b.attentionLevel])
      .slice(0, 8)
  );
}

function buildExecutiveSummaryText(input: {
  objectRiskCount: number;
  relationshipRiskCount: number;
  kpiRiskCount: number;
  propagationScore: number;
  topRiskCount: number;
  topChainCount: number;
  vulnerabilityCount: number;
  attentionCount: number;
}): string {
  if (
    input.objectRiskCount + input.relationshipRiskCount + input.kpiRiskCount === 0
  ) {
    return "No executive risk intelligence is available.";
  }
  return `Executive risk intelligence covers ${input.objectRiskCount} object(s), ${input.relationshipRiskCount} relationship(s), and ${input.kpiRiskCount} KPI(s) with top propagation score ${input.propagationScore}; ${input.topRiskCount} top risk(s), ${input.topChainCount} risk chain(s), ${input.vulnerabilityCount} vulnerability signal(s), and ${input.attentionCount} attention recommendation(s).`;
}

export function buildExecutiveRiskSummary(
  input: ExecutiveRiskSummaryBuildInput = {}
): ExecutiveRiskSummary {
  const objects = input.objects ?? input.sceneObjects ?? [];
  const layers = collectRiskLayers(input);
  const entries = buildUnifiedRiskEntries(layers, objects);

  if (entries.length === 0 && layers.propagation.chainCount === 0) {
    latestExecutiveRiskSummary = EMPTY_EXECUTIVE_RISK_SUMMARY;
    return latestExecutiveRiskSummary;
  }

  const risks = topRisks(entries);
  const chains = topRiskChains(layers.propagation.riskChains);
  const vulnerabilities = topVulnerabilities(layers);
  const attention = recommendedAttention(entries, layers.propagation.riskChains);

  latestExecutiveRiskSummary = Object.freeze({
    version: EXEC_RISK_SUMMARY_VERSION,
    executiveSummary: buildExecutiveSummaryText({
      objectRiskCount: layers.objectProfiles.length,
      relationshipRiskCount: layers.relationshipProfiles.length,
      kpiRiskCount: layers.kpiProfiles.length,
      propagationScore: layers.propagation.propagationScore,
      topRiskCount: risks.length,
      topChainCount: chains.length,
      vulnerabilityCount: vulnerabilities.length,
      attentionCount: attention.length,
    }),
    objectRiskCount: layers.objectProfiles.length,
    relationshipRiskCount: layers.relationshipProfiles.length,
    kpiRiskCount: layers.kpiProfiles.length,
    propagationScore: layers.propagation.propagationScore,
    averageObjectRiskScore: average(layers.objectProfiles.map((profile) => profile.riskScore)),
    averageRelationshipRiskScore: average(
      layers.relationshipProfiles.map((profile) => profile.relationshipRiskScore)
    ),
    averageKpiRiskScore: average(layers.kpiProfiles.map((profile) => profile.kpiRiskScore)),
    topRisks: risks,
    topRiskChains: chains,
    topVulnerabilities: vulnerabilities,
    recommendedAttention: attention,
    propagation: layers.propagation,
    profiles: Object.freeze(entries.map((entry) => entry.profile)),
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    simulation: false,
    diagnostics: EXEC_RISK_SUMMARY_DIAGNOSTICS,
  });

  return latestExecutiveRiskSummary;
}

export function getExecutiveRiskSummary(): ExecutiveRiskSummary {
  return latestExecutiveRiskSummary;
}

export function resetExecutiveRiskSummaryForTests(): void {
  latestExecutiveRiskSummary = EMPTY_EXECUTIVE_RISK_SUMMARY;
}

export const ExecutiveRiskSummaryEngine = Object.freeze({
  buildExecutiveRiskSummary,
  getExecutiveRiskSummary,
});
