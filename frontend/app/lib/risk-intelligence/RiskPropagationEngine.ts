import type { KpiHistoricalSnapshot } from "../kpi-intelligence/kpiTrendContract.ts";
import { buildObjectRiskRegistry } from "./ObjectRiskEngine.ts";
import { buildRelationshipRiskRegistry } from "./RelationshipRiskEngine.ts";
import { buildKpiRiskRegistry } from "./KpiRiskEngine.ts";
import type { KpiRiskProfile } from "./kpiRiskProfileContract.ts";
import type { ObjectRiskProfile } from "./objectRiskContract.ts";
import type { RelationshipRiskProfile } from "./relationshipRiskProfileContract.ts";
import {
  EMPTY_RISK_PROPAGATION_PROFILE,
  EMPTY_RISK_PROPAGATION_REGISTRY,
  RISK_PROPAGATION_DIAGNOSTICS,
  RISK_PROPAGATION_ENGINE_VERSION,
  type RiskPropagationBuildInput,
  type RiskPropagationChain,
  type RiskPropagationChainStep,
  type RiskPropagationNodeKind,
  type RiskPropagationProfile,
  type RiskPropagationRegistry,
} from "./riskPropagationProfileContract.ts";

type RecordMap = Readonly<Record<string, unknown>>;

const SOURCE_RISK_THRESHOLD = 60;
const TARGET_RISK_THRESHOLD = 35;
const MAX_CHAIN_DEPTH = 5;

let latestRiskPropagationRegistry: RiskPropagationRegistry = EMPTY_RISK_PROPAGATION_REGISTRY;

function asRecord(value: unknown): RecordMap | null {
  return value && typeof value === "object" ? (value as RecordMap) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  if (Array.isArray(scene.kpiBoard)) return scene.kpiBoard;
  return [];
}

function readSceneSnapshots(sceneJson: unknown): readonly KpiHistoricalSnapshot[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  const snapshots = scene?.kpiSnapshots ?? scene?.historicalKpis ?? scene?.kpiHistory;
  if (!Array.isArray(snapshots)) return Object.freeze([]);
  return Object.freeze(
    snapshots
      .filter((snapshot): snapshot is KpiHistoricalSnapshot => {
        const record = snapshot as Partial<KpiHistoricalSnapshot>;
        return typeof record.kpiId === "string" && typeof record.value === "number";
      })
      .map((snapshot) => Object.freeze({ ...snapshot }))
  );
}

type GraphEdge = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  relationshipRiskScore: number;
}>;

function buildKpiLinksByObjectId(kpis: readonly unknown[]): Readonly<Record<string, readonly string[]>> {
  const links: Record<string, string[]> = {};
  kpis.forEach((raw, index) => {
    const record = asRecord(raw);
    if (!record) return;
    const kpiId =
      readString(record.kpiId) || readString(record.id) || readString(record.key) || `scene:kpi:${index + 1}`;
    const objectIds = [
      readString(record.objectId),
      readString(record.linkedObjectId),
      ...(Array.isArray(record.objectIds)
        ? record.objectIds.map((value) => readString(value)).filter(Boolean)
        : []),
    ].filter(Boolean);
    for (const objectId of objectIds) {
      links[objectId] = [...(links[objectId] ?? []), kpiId];
    }
  });
  return Object.freeze(
    Object.entries(links).reduce<Record<string, readonly string[]>>((registry, [objectId, kpiIds]) => {
      registry[objectId] = Object.freeze([...new Set(kpiIds)]);
      return registry;
    }, {})
  );
}

function resolveObjectLabel(objectId: string, objects: readonly unknown[]): string {
  for (const raw of objects) {
    const record = asRecord(raw);
    if (!record) continue;
    const id = readString(record.id) || readString(record.objectId) || readString(record.name);
    if (id !== objectId) continue;
    return readString(record.label) || readString(record.name) || objectId;
  }
  return objectId;
}

function resolveKpiLabel(kpiId: string, kpis: readonly unknown[]): string {
  for (const raw of kpis) {
    const record = asRecord(raw);
    if (!record) continue;
    const id =
      readString(record.kpiId) || readString(record.id) || readString(record.key);
    if (id !== kpiId) continue;
    return readString(record.label) || readString(record.name) || kpiId;
  }
  return kpiId;
}

function isObjectRiskSource(profile: ObjectRiskProfile): boolean {
  return profile.riskScore >= SOURCE_RISK_THRESHOLD || profile.riskLevel === "High" || profile.riskLevel === "Critical";
}

function isRelationshipRiskSource(profile: RelationshipRiskProfile): boolean {
  return (
    profile.relationshipRiskScore >= SOURCE_RISK_THRESHOLD ||
    profile.singlePointOfFailure ||
    profile.criticalDependency
  );
}

function isKpiRiskSource(profile: KpiRiskProfile): boolean {
  return profile.kpiRiskScore >= SOURCE_RISK_THRESHOLD - 10 || profile.criticalKpi || profile.decliningKpi;
}

function computePathPropagationScore(stepScores: readonly number[]): number {
  if (stepScores.length === 0) return 0;
  if (stepScores.length === 1) return stepScores[0] ?? 0;
  let propagated = stepScores[0] ?? 0;
  for (let index = 1; index < stepScores.length; index += 1) {
    const stepScore = stepScores[index] ?? 0;
    propagated = clampScore(propagated * 0.72 + stepScore * 0.28);
  }
  return propagated;
}

function buildChainId(sourceId: string, targetId: string, stepIds: readonly string[]): string {
  return `chain:${sourceId}->${targetId}:${stepIds.join(">")}`;
}

function appendKpiExtensions(
  baseChain: RiskPropagationChain,
  objectId: string,
  kpiLinksByObjectId: Readonly<Record<string, readonly string[]>>,
  kpiRiskById: Readonly<Record<string, KpiRiskProfile>>,
  kpis: readonly unknown[]
): readonly RiskPropagationChain[] {
  const linkedKpis = kpiLinksByObjectId[objectId] ?? Object.freeze([]);
  if (linkedKpis.length === 0) return Object.freeze([baseChain]);

  return Object.freeze(
    linkedKpis.map((kpiId): RiskPropagationChain => {
      const kpiProfile = kpiRiskById[kpiId];
      const kpiStep: RiskPropagationChainStep = Object.freeze({
        nodeId: kpiId,
        nodeKind: "kpi",
        label: kpiProfile?.label ?? resolveKpiLabel(kpiId, kpis),
        riskScore: kpiProfile?.kpiRiskScore ?? 0,
      });
      const steps = Object.freeze([...baseChain.steps, kpiStep]);
      const stepScores = steps.map((step) => step.riskScore);
      return Object.freeze({
        chainId: buildChainId(
          baseChain.sourceId,
          kpiId,
          steps.map((step) => step.nodeId)
        ),
        sourceId: baseChain.sourceId,
        sourceKind: baseChain.sourceKind,
        targetId: kpiId,
        targetKind: "kpi",
        steps,
        propagationScore: computePathPropagationScore(stepScores),
      });
    })
  );
}

function traverseObjectGraph(
  sourceObjectId: string,
  sourceProfile: ObjectRiskProfile,
  edges: readonly GraphEdge[],
  relationshipRiskById: Readonly<Record<string, RelationshipRiskProfile>>,
  objectRiskById: Readonly<Record<string, ObjectRiskProfile>>,
  objects: readonly unknown[],
  kpiLinksByObjectId: Readonly<Record<string, readonly string[]>>,
  kpiRiskById: Readonly<Record<string, KpiRiskProfile>>,
  kpis: readonly unknown[]
): readonly RiskPropagationChain[] {
  const chains: RiskPropagationChain[] = [];
  const visited = new Set<string>();

  type QueueItem = Readonly<{
    currentObjectId: string;
    steps: readonly RiskPropagationChainStep[];
    depth: number;
  }>;

  const sourceStep: RiskPropagationChainStep = Object.freeze({
    nodeId: sourceObjectId,
    nodeKind: "object",
    label: resolveObjectLabel(sourceObjectId, objects),
    riskScore: sourceProfile.riskScore,
  });

  const queue: QueueItem[] = [
    {
      currentObjectId: sourceObjectId,
      steps: Object.freeze([sourceStep]),
      depth: 0,
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (current.depth >= MAX_CHAIN_DEPTH) continue;

    const outgoing = edges.filter((edge) => edge.sourceId === current.currentObjectId);
    for (const edge of outgoing) {
      const visitKey = `${current.currentObjectId}->${edge.targetId}:${current.depth + 1}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);

      const relationshipProfile = relationshipRiskById[edge.relationshipId];
      const relationshipStep: RiskPropagationChainStep = Object.freeze({
        nodeId: edge.relationshipId,
        nodeKind: "relationship",
        label: edge.relationshipType,
        riskScore: relationshipProfile?.relationshipRiskScore ?? edge.relationshipRiskScore,
      });
      const targetProfile = objectRiskById[edge.targetId];
      const targetStep: RiskPropagationChainStep = Object.freeze({
        nodeId: edge.targetId,
        nodeKind: "object",
        label: targetProfile ? resolveObjectLabel(edge.targetId, objects) : edge.targetId,
        riskScore: targetProfile?.riskScore ?? 0,
      });
      const steps = Object.freeze([...current.steps, relationshipStep, targetStep]);
      const propagationScore = computePathPropagationScore(steps.map((step) => step.riskScore));
      const baseChain: RiskPropagationChain = Object.freeze({
        chainId: buildChainId(
          sourceObjectId,
          edge.targetId,
          steps.map((step) => step.nodeId)
        ),
        sourceId: sourceObjectId,
        sourceKind: "object",
        targetId: edge.targetId,
        targetKind: "object",
        steps,
        propagationScore,
      });

      if (edge.targetId !== sourceObjectId && propagationScore >= TARGET_RISK_THRESHOLD) {
        chains.push(...appendKpiExtensions(baseChain, edge.targetId, kpiLinksByObjectId, kpiRiskById, kpis));
      }

      queue.push({
        currentObjectId: edge.targetId,
        steps,
        depth: current.depth + 1,
      });
    }
  }

  return Object.freeze(chains);
}

function buildRelationshipOriginChains(
  relationshipProfile: RelationshipRiskProfile,
  objectRiskById: Readonly<Record<string, ObjectRiskProfile>>,
  objects: readonly unknown[],
  kpiLinksByObjectId: Readonly<Record<string, readonly string[]>>,
  kpiRiskById: Readonly<Record<string, KpiRiskProfile>>,
  kpis: readonly unknown[]
): readonly RiskPropagationChain[] {
  const sourceStep: RiskPropagationChainStep = Object.freeze({
    nodeId: relationshipProfile.relationshipId,
    nodeKind: "relationship",
    label: relationshipProfile.relationshipType,
    riskScore: relationshipProfile.relationshipRiskScore,
  });
  const targetProfile = objectRiskById[relationshipProfile.targetId];
  const targetStep: RiskPropagationChainStep = Object.freeze({
    nodeId: relationshipProfile.targetId,
    nodeKind: "object",
    label: resolveObjectLabel(relationshipProfile.targetId, objects),
    riskScore: targetProfile?.riskScore ?? 0,
  });
  const steps = Object.freeze([sourceStep, targetStep]);
  const baseChain: RiskPropagationChain = Object.freeze({
    chainId: buildChainId(
      relationshipProfile.relationshipId,
      relationshipProfile.targetId,
      steps.map((step) => step.nodeId)
    ),
    sourceId: relationshipProfile.relationshipId,
    sourceKind: "relationship",
    targetId: relationshipProfile.targetId,
    targetKind: "object",
    steps,
    propagationScore: computePathPropagationScore(steps.map((step) => step.riskScore)),
  });
  return appendKpiExtensions(
    baseChain,
    relationshipProfile.targetId,
    kpiLinksByObjectId,
    kpiRiskById,
    kpis
  );
}

function buildKpiOriginChains(
  kpiProfile: KpiRiskProfile,
  kpiLinksByObjectId: Readonly<Record<string, readonly string[]>>,
  objectRiskById: Readonly<Record<string, ObjectRiskProfile>>,
  objects: readonly unknown[]
): readonly RiskPropagationChain[] {
  const linkedObjectId = Object.entries(kpiLinksByObjectId).find(([, kpiIds]) =>
    kpiIds.includes(kpiProfile.kpiId)
  )?.[0];
  if (!linkedObjectId) return Object.freeze([]);

  const sourceStep: RiskPropagationChainStep = Object.freeze({
    nodeId: kpiProfile.kpiId,
    nodeKind: "kpi",
    label: kpiProfile.label,
    riskScore: kpiProfile.kpiRiskScore,
  });
  const targetProfile = objectRiskById[linkedObjectId];
  const targetStep: RiskPropagationChainStep = Object.freeze({
    nodeId: linkedObjectId,
    nodeKind: "object",
    label: resolveObjectLabel(linkedObjectId, objects),
    riskScore: targetProfile?.riskScore ?? 0,
  });
  const steps = Object.freeze([sourceStep, targetStep]);
  return Object.freeze([
    Object.freeze({
      chainId: buildChainId(
        kpiProfile.kpiId,
        linkedObjectId,
        steps.map((step) => step.nodeId)
      ),
      sourceId: kpiProfile.kpiId,
      sourceKind: "kpi" as RiskPropagationNodeKind,
      targetId: linkedObjectId,
      targetKind: "object" as RiskPropagationNodeKind,
      steps,
      propagationScore: computePathPropagationScore(steps.map((step) => step.riskScore)),
    }),
  ]);
}

function dedupeChains(chains: readonly RiskPropagationChain[]): readonly RiskPropagationChain[] {
  const byId = new Map<string, RiskPropagationChain>();
  for (const chain of chains) {
    const existing = byId.get(chain.chainId);
    if (!existing || chain.propagationScore > existing.propagationScore) {
      byId.set(chain.chainId, chain);
    }
  }
  return Object.freeze([...byId.values()].sort((a, b) => b.propagationScore - a.propagationScore));
}

function buildPropagationReasoning(
  profile: Omit<RiskPropagationProfile, "propagationReasoning">
): readonly string[] {
  return Object.freeze([
    `Traversed ${profile.objectCount} objects, ${profile.relationshipCount} relationships, and ${profile.kpiCount} KPIs.`,
    `Detected ${profile.riskSources.length} risk source(s) and ${profile.riskTargets.length} risk target(s).`,
    `Built ${profile.chainCount} risk chain(s) with top propagation score ${profile.propagationScore}.`,
  ]);
}

export function buildRiskPropagationProfile(input: RiskPropagationBuildInput = {}): RiskPropagationProfile {
  const objects = input.objects ?? input.sceneObjects ?? readSceneObjects(input.sceneJson);
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const kpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const snapshots = input.historicalSnapshots ?? readSceneSnapshots(input.sceneJson);

  const objectRiskRegistry = buildObjectRiskRegistry({
    sceneJson: input.sceneJson,
    sceneObjects: objects,
    dataSourceObjects: input.dataSourceObjects,
  });
  const relationshipRiskRegistry = buildRelationshipRiskRegistry({
    sceneJson: input.sceneJson,
    relationships,
    objects,
  });
  const kpiRiskRegistry = buildKpiRiskRegistry({
    sceneJson: input.sceneJson,
    kpis,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: snapshots,
  });

  const objectRiskById = objectRiskRegistry.riskByObjectId;
  const relationshipRiskById = relationshipRiskRegistry.riskByRelationshipId;
  const kpiRiskById = kpiRiskRegistry.riskByKpiId;
  const kpiLinksByObjectId = buildKpiLinksByObjectId(kpis);

  const edges: GraphEdge[] = relationshipRiskRegistry.profiles.map((profile) =>
    Object.freeze({
      relationshipId: profile.relationshipId,
      sourceId: profile.sourceId,
      targetId: profile.targetId,
      relationshipType: profile.relationshipType,
      relationshipRiskScore: profile.relationshipRiskScore,
    })
  );

  const chains: RiskPropagationChain[] = [];
  const riskSources = new Set<string>();

  for (const objectProfile of objectRiskRegistry.profiles) {
    if (!isObjectRiskSource(objectProfile)) continue;
    riskSources.add(objectProfile.objectId);
    chains.push(
      ...traverseObjectGraph(
        objectProfile.objectId,
        objectProfile,
        edges,
        relationshipRiskById,
        objectRiskById,
        objects,
        kpiLinksByObjectId,
        kpiRiskById,
        kpis
      )
    );
  }

  for (const relationshipProfile of relationshipRiskRegistry.profiles) {
    if (!isRelationshipRiskSource(relationshipProfile)) continue;
    riskSources.add(relationshipProfile.relationshipId);
    chains.push(
      ...buildRelationshipOriginChains(
        relationshipProfile,
        objectRiskById,
        objects,
        kpiLinksByObjectId,
        kpiRiskById,
        kpis
      )
    );
  }

  for (const kpiProfile of kpiRiskRegistry.profiles) {
    if (!isKpiRiskSource(kpiProfile)) continue;
    riskSources.add(kpiProfile.kpiId);
    chains.push(
      ...buildKpiOriginChains(kpiProfile, kpiLinksByObjectId, objectRiskById, objects)
    );
  }

  const dedupedChains = dedupeChains(chains);
  const riskTargets = Object.freeze([
    ...new Set(
      dedupedChains
        .filter((chain) => chain.propagationScore >= TARGET_RISK_THRESHOLD)
        .map((chain) => chain.targetId)
    ),
  ]);
  const propagationScore =
    dedupedChains.length > 0 ? dedupedChains[0]?.propagationScore ?? 0 : 0;

  const baseProfile = Object.freeze({
    propagationId: "business-graph-propagation",
    riskSources: Object.freeze([...riskSources]),
    riskTargets,
    riskChains: dedupedChains,
    propagationScore,
    objectCount: objectRiskRegistry.objectCount,
    relationshipCount: relationshipRiskRegistry.relationshipCount,
    kpiCount: kpiRiskRegistry.kpiCount,
    chainCount: dedupedChains.length,
  });

  return Object.freeze({
    ...baseProfile,
    propagationReasoning: buildPropagationReasoning(baseProfile),
  });
}

export function buildRiskPropagationRegistry(
  input: RiskPropagationBuildInput = {}
): RiskPropagationRegistry {
  const profile = buildRiskPropagationProfile(input);
  latestRiskPropagationRegistry = Object.freeze({
    version: RISK_PROPAGATION_ENGINE_VERSION,
    profile,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    simulation: false,
    diagnostics: RISK_PROPAGATION_DIAGNOSTICS,
  });
  return latestRiskPropagationRegistry;
}

export function getRiskPropagationRegistry(): RiskPropagationRegistry {
  return latestRiskPropagationRegistry;
}

export function resetRiskPropagationEngineForTests(): void {
  latestRiskPropagationRegistry = EMPTY_RISK_PROPAGATION_REGISTRY;
}

export const RiskPropagationEngine = Object.freeze({
  buildRiskPropagationProfile,
  buildRiskPropagationRegistry,
  getRiskPropagationRegistry,
});
