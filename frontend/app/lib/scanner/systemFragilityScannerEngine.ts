import { isAmplifyingLoop, isStabilizingLoop, type NexoraLoopType } from "../loops/coreLoopSystem";

export type NexoraFragilityFindingType =
  | "loop_fragility"
  | "bottleneck"
  | "cascade_risk"
  | "single_point_of_failure"
  | "structural_imbalance";

export interface NexoraFragilityScannerInput {
  runtimeModel?: any;
  runtimeContext?: any;
  stateVector?: Record<string, unknown> | null;
  domain?: string | null;
}

export interface NexoraFragilityFinding {
  id: string;
  type: NexoraFragilityFindingType;
  label: string;
  score: number;
  objectIds: string[];
  relationIds: string[];
  loopIds: string[];
  kpiIds: string[];
  affectedComponents: string[];
  why: string;
  notes?: string[];
}

export interface NexoraFragilityMap {
  fragileObjects: string[];
  fragileLoops: string[];
  cascadePaths: Array<{ relationIds: string[]; objectIds: string[]; score: number }>;
  bottlenecks: string[];
}

export interface NexoraSystemFragilityScannerResult {
  fragilityScore: number;
  findings: NexoraFragilityFinding[];
  fragileObjects: NexoraFragilityFinding[];
  fragileLoops: NexoraFragilityFinding[];
  bottlenecks: NexoraFragilityFinding[];
  cascadePaths: NexoraFragilityFinding[];
  singlePointsOfFailure: NexoraFragilityFinding[];
  structuralImbalances: NexoraFragilityFinding[];
  fragilityMap: NexoraFragilityMap;
  riskPropagationHints: {
    sources: string[];
    edges: Array<{ from: string; to: string; relationId?: string; weight: number }>;
    summary: string;
  };
  scenarioExplorationHints: {
    fragileObjectIds: string[];
    fragileLoopIds: string[];
    bottleneckRelationIds: string[];
    vulnerableKpiIds: string[];
  };
  explainability: {
    topDrivers: string[];
    affectedKpis: string[];
  };
  sourceSupport: {
    supportedInputSources: string[];
    notes: string[];
  };
  notes: string[];
}

type NormalizedRuntimeModel = {
  domainId?: string | null;
  objects: Array<{
    id: string;
    label: string;
    riskLevel: number;
    stabilityLevel: number;
    activityLevel: number;
    tags: string[];
  }>;
  relations: Array<{
    id: string;
    from: string;
    to: string;
    relationType: string;
    strength: number;
    volatility: number;
    tags: string[];
  }>;
  loops: Array<{
    id: string;
    label: string;
    loopType: string;
    nodes: string[];
    intensity: number;
    stability: number;
    tags: string[];
  }>;
  kpis: Array<{
    id: string;
    label: string;
    value: number;
    trend: string;
  }>;
};

function normalizeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean)));
}

function clamp01(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric <= 0) return 0;
  if (numeric >= 1) return 1;
  return numeric;
}

function safeList(value: unknown): string[] {
  return Array.isArray(value) ? uniq(value.map((entry) => String(entry))) : [];
}

function normalizeRuntimeModel(runtimeModel?: any): NormalizedRuntimeModel {
  return {
    domainId:
      runtimeModel?.domainId === null || runtimeModel?.domainId === undefined
        ? null
        : normalizeText(runtimeModel.domainId),
    objects: Array.isArray(runtimeModel?.objects)
      ? runtimeModel.objects
          .map((object: any) => ({
            id: normalizeText(object?.id ?? ""),
            label: normalizeText(object?.label ?? object?.id ?? ""),
            riskLevel: clamp01(object?.riskLevel ?? 0.2),
            stabilityLevel: clamp01(object?.stabilityLevel ?? 0.8),
            activityLevel: clamp01(object?.activityLevel ?? 0.5),
            tags: safeList(object?.tags),
          }))
          .filter((object) => object.id)
      : [],
    relations: Array.isArray(runtimeModel?.relations)
      ? runtimeModel.relations
          .map((relation: any) => ({
            id: normalizeText(relation?.id ?? ""),
            from: normalizeText(relation?.from ?? ""),
            to: normalizeText(relation?.to ?? ""),
            relationType: normalizeText(relation?.relationType ?? ""),
            strength: clamp01(relation?.strength ?? 0.6),
            volatility: clamp01(relation?.volatility ?? 0.3),
            tags: safeList(relation?.tags),
          }))
          .filter((relation) => relation.id && relation.from && relation.to)
      : [],
    loops: Array.isArray(runtimeModel?.loops)
      ? runtimeModel.loops
          .map((loop: any) => ({
            id: normalizeText(loop?.id ?? ""),
            label: normalizeText(loop?.label ?? loop?.id ?? ""),
            loopType: normalizeText(loop?.loopType ?? "reinforcing"),
            nodes: safeList(loop?.nodes),
            intensity: clamp01(loop?.intensity ?? 0.5),
            stability: clamp01(loop?.stability ?? 0.7),
            tags: safeList(loop?.tags),
          }))
          .filter((loop) => loop.id)
      : [],
    kpis: Array.isArray(runtimeModel?.kpis)
      ? runtimeModel.kpis
          .map((kpi: any) => ({
            id: normalizeText(kpi?.id ?? ""),
            label: normalizeText(kpi?.label ?? kpi?.id ?? ""),
            value: clamp01(kpi?.value ?? 0.5),
            trend: normalizeText(kpi?.trend ?? "stable"),
          }))
          .filter((kpi) => kpi.id)
      : [],
  };
}

function relationPropagationFactor(relationType: string): number {
  switch (relationType) {
    case "transfers_risk":
      return 0.95;
    case "amplifies":
      return 0.9;
    case "depends_on":
    case "blocks":
      return 0.85;
    case "flows_to":
      return 0.72;
    case "signals":
    case "competes_with":
      return 0.55;
    case "stabilizes":
    case "reduces":
      return 0.25;
    default:
      return 0.5;
  }
}

function findingSort(a: NexoraFragilityFinding, b: NexoraFragilityFinding): number {
  const delta = b.score - a.score;
  if (delta !== 0) return delta;
  return a.id.localeCompare(b.id);
}

function buildFinding(input: {
  id: string;
  type: NexoraFragilityFindingType;
  label: string;
  score: number;
  objectIds?: string[];
  relationIds?: string[];
  loopIds?: string[];
  kpiIds?: string[];
  why: string;
  notes?: string[];
}): NexoraFragilityFinding {
  return {
    id: normalizeText(input.id),
    type: input.type,
    label: normalizeText(input.label),
    score: clamp01(input.score),
    objectIds: safeList(input.objectIds),
    relationIds: safeList(input.relationIds),
    loopIds: safeList(input.loopIds),
    kpiIds: safeList(input.kpiIds),
    affectedComponents: uniq([
      ...safeList(input.objectIds),
      ...safeList(input.relationIds),
      ...safeList(input.loopIds),
      ...safeList(input.kpiIds),
    ]),
    why: normalizeText(input.why),
    notes: Array.isArray(input.notes) ? uniq(input.notes) : [],
  };
}

function detectLoopFragility(runtimeModel: NormalizedRuntimeModel): NexoraFragilityFinding[] {
  const kpiIds = runtimeModel.kpis
    .slice()
    .sort((a, b) => a.value - b.value || a.id.localeCompare(b.id))
    .slice(0, 2)
    .map((kpi) => kpi.id);

  return runtimeModel.loops
    .filter((loop) => isAmplifyingLoop((loop.loopType || "reinforcing") as NexoraLoopType) || loop.loopType === "pressure")
    .map((loop) => {
      const score = clamp01(loop.intensity * 0.55 + (1 - loop.stability) * 0.45);
      return buildFinding({
        id: `loop_fragility_${loop.id}`,
        type: "loop_fragility",
        label: `${loop.label || loop.id} loop fragility`,
        score,
        objectIds: loop.nodes,
        loopIds: [loop.id],
        kpiIds,
        why: `${loop.label || loop.id} is an amplifying loop with high intensity and limited stabilizing capacity.`,
        notes: [`Loop type: ${loop.loopType || "reinforcing"}.`],
      });
    })
    .filter((finding) => finding.score >= 0.45)
    .sort(findingSort);
}

function detectBottlenecks(runtimeModel: NormalizedRuntimeModel): NexoraFragilityFinding[] {
  const inbound = new Map<string, number>();
  const relationIdsByTarget = new Map<string, string[]>();

  runtimeModel.relations.forEach((relation) => {
    inbound.set(relation.to, (inbound.get(relation.to) ?? 0) + 1);
    relationIdsByTarget.set(relation.to, [...(relationIdsByTarget.get(relation.to) ?? []), relation.id]);
  });

  return runtimeModel.objects
    .map((object) => {
      const dependencyLoad = (inbound.get(object.id) ?? 0) / Math.max(1, runtimeModel.objects.length - 1);
      const score = clamp01(
        dependencyLoad * 0.45 + object.riskLevel * 0.3 + (1 - object.stabilityLevel) * 0.25
      );
      return buildFinding({
        id: `bottleneck_${object.id}`,
        type: "bottleneck",
        label: `${object.label || object.id} bottleneck`,
        score,
        objectIds: [object.id],
        relationIds: relationIdsByTarget.get(object.id) ?? [],
        why: `${object.label || object.id} carries concentrated dependency load and elevated local fragility.`,
        notes: [`Inbound dependencies: ${String(inbound.get(object.id) ?? 0)}.`],
      });
    })
    .filter((finding) => finding.score >= 0.42)
    .sort(findingSort);
}

function detectCascadeRisks(runtimeModel: NormalizedRuntimeModel): NexoraFragilityFinding[] {
  const objectIndex = new Map(runtimeModel.objects.map((object) => [object.id, object]));
  const outgoing = new Map<string, NormalizedRuntimeModel["relations"]>();

  runtimeModel.relations.forEach((relation) => {
    outgoing.set(relation.from, [...(outgoing.get(relation.from) ?? []), relation]);
  });

  return runtimeModel.relations
    .map((relation) => {
      const source = objectIndex.get(relation.from);
      const target = objectIndex.get(relation.to);
      const depth = (outgoing.get(relation.to) ?? []).length;
      const propagation = relationPropagationFactor(relation.relationType);
      const score = clamp01(
        relation.volatility * 0.35 +
          (1 - relation.strength) * 0.2 +
          propagation * 0.2 +
          clamp01(depth / Math.max(1, runtimeModel.objects.length - 1)) * 0.15 +
          clamp01(((source?.riskLevel ?? 0) + (target?.riskLevel ?? 0)) / 2) * 0.1
      );
      return buildFinding({
        id: `cascade_${relation.id}`,
        type: "cascade_risk",
        label: `${relation.id} cascade risk`,
        score,
        objectIds: uniq([relation.from, relation.to]),
        relationIds: [relation.id],
        why: `${relation.id} can propagate disruption across the runtime graph because it is volatile and structurally important.`,
        notes: [`Relation type: ${relation.relationType || "unspecified"}.`, `Propagation depth hint: ${String(depth)}.`],
      });
    })
    .filter((finding) => finding.score >= 0.45)
    .sort(findingSort);
}

function detectSinglePointsOfFailure(
  runtimeModel: NormalizedRuntimeModel,
  cascades: NexoraFragilityFinding[]
): NexoraFragilityFinding[] {
  const exposureByObject = new Map<string, number>();
  cascades.forEach((finding) => {
    finding.objectIds.forEach((objectId) => {
      exposureByObject.set(objectId, (exposureByObject.get(objectId) ?? 0) + finding.score);
    });
  });

  return runtimeModel.objects
    .map((object) => {
      const relationCoverage = runtimeModel.relations.filter(
        (relation) => relation.from === object.id || relation.to === object.id
      ).length;
      const coverageFactor = clamp01(relationCoverage / Math.max(1, runtimeModel.relations.length));
      const score = clamp01(
        object.riskLevel * 0.35 +
          (1 - object.stabilityLevel) * 0.25 +
          clamp01((exposureByObject.get(object.id) ?? 0) / Math.max(1, cascades.length)) * 0.25 +
          coverageFactor * 0.15
      );
      return buildFinding({
        id: `spof_${object.id}`,
        type: "single_point_of_failure",
        label: `${object.label || object.id} single point of failure`,
        score,
        objectIds: [object.id],
        relationIds: runtimeModel.relations
          .filter((relation) => relation.from === object.id || relation.to === object.id)
          .map((relation) => relation.id),
        why: `${object.label || object.id} connects multiple system paths and its failure would destabilize adjacent components.`,
        notes: [`Connected relations: ${String(relationCoverage)}.`],
      });
    })
    .filter((finding) => finding.score >= 0.48)
    .sort(findingSort);
}

function detectStructuralImbalances(
  runtimeModel: NormalizedRuntimeModel,
  loopFindings: NexoraFragilityFinding[]
): NexoraFragilityFinding[] {
  const stabilizingLoops = new Set(
    runtimeModel.loops
      .filter((loop) => isStabilizingLoop((loop.loopType || "balancing") as NexoraLoopType))
      .flatMap((loop) => loop.nodes)
  );

  return loopFindings
    .map((finding) => {
      const unbalancedNodes = finding.objectIds.filter((objectId) => !stabilizingLoops.has(objectId));
      const score = clamp01(finding.score * 0.7 + clamp01(unbalancedNodes.length / Math.max(1, finding.objectIds.length)) * 0.3);
      return buildFinding({
        id: `imbalance_${finding.id}`,
        type: "structural_imbalance",
        label: `${finding.label} structural imbalance`,
        score,
        objectIds: unbalancedNodes,
        loopIds: finding.loopIds,
        kpiIds: finding.kpiIds,
        why: `${finding.label} lacks nearby balancing mechanisms, so amplification has limited structural resistance.`,
        notes: unbalancedNodes.length > 0 ? [`Unbalanced nodes: ${unbalancedNodes.join(", ")}.`] : ["No balancing loop overlap found."],
      });
    })
    .filter((finding) => finding.score >= 0.4)
    .sort(findingSort);
}

function pickVulnerableKpiIds(runtimeModel: NormalizedRuntimeModel): string[] {
  return runtimeModel.kpis
    .slice()
    .sort((a, b) => a.value - b.value || a.id.localeCompare(b.id))
    .slice(0, 3)
    .map((kpi) => kpi.id);
}

export function runSystemFragilityScanner(
  input: NexoraFragilityScannerInput
): NexoraSystemFragilityScannerResult {
  const runtimeModel = normalizeRuntimeModel(input.runtimeModel);
  const loopFindings = detectLoopFragility(runtimeModel);
  const bottlenecks = detectBottlenecks(runtimeModel);
  const cascades = detectCascadeRisks(runtimeModel);
  const singlePointsOfFailure = detectSinglePointsOfFailure(runtimeModel, cascades);
  const structuralImbalances = detectStructuralImbalances(runtimeModel, loopFindings);

  const findings = [
    ...loopFindings,
    ...bottlenecks,
    ...cascades,
    ...singlePointsOfFailure,
    ...structuralImbalances,
  ].sort(findingSort);

  const vulnerableKpiIds = pickVulnerableKpiIds(runtimeModel);
  const fragileObjectIds = uniq(
    findings
      .filter((finding) => finding.type !== "loop_fragility")
      .flatMap((finding) => finding.objectIds)
  );
  const fragileLoopIds = uniq(loopFindings.flatMap((finding) => finding.loopIds));
  const bottleneckIds = uniq(bottlenecks.flatMap((finding) => finding.objectIds));

  const fragilityScore = clamp01(
    findings.length === 0
      ? 0
      : findings.slice(0, 6).reduce((sum, finding) => sum + finding.score, 0) / Math.min(findings.length, 6)
  );

  const topDrivers = findings.slice(0, 3).map((finding) => `${finding.label}: ${finding.why}`);
  const riskEdges = cascades.slice(0, 8).map((finding) => ({
    from: finding.objectIds[0] ?? "",
    to: finding.objectIds[1] ?? "",
    relationId: finding.relationIds[0] ?? undefined,
    weight: clamp01(finding.score),
  }));

  return {
    fragilityScore,
    findings,
    fragileObjects: [...bottlenecks, ...singlePointsOfFailure].sort(findingSort),
    fragileLoops: loopFindings,
    bottlenecks,
    cascadePaths: cascades,
    singlePointsOfFailure,
    structuralImbalances,
    fragilityMap: {
      fragileObjects: fragileObjectIds,
      fragileLoops: fragileLoopIds,
      cascadePaths: cascades.slice(0, 6).map((finding) => ({
        relationIds: finding.relationIds,
        objectIds: finding.objectIds,
        score: finding.score,
      })),
      bottlenecks: bottleneckIds,
    },
    riskPropagationHints: {
      sources: uniq([...fragileObjectIds.slice(0, 4), ...fragileLoopIds.slice(0, 2)]),
      edges: riskEdges.filter((edge) => edge.from && edge.to),
      summary:
        riskEdges.length > 0
          ? "Structural fragility suggests elevated downstream propagation risk."
          : "No significant structural cascade path detected.",
    },
    scenarioExplorationHints: {
      fragileObjectIds: fragileObjectIds.slice(0, 5),
      fragileLoopIds: fragileLoopIds.slice(0, 4),
      bottleneckRelationIds: uniq(bottlenecks.flatMap((finding) => finding.relationIds)).slice(0, 5),
      vulnerableKpiIds,
    },
    explainability: {
      topDrivers,
      affectedKpis: vulnerableKpiIds,
    },
    sourceSupport: {
      supportedInputSources: ["runtime_model", "text_analysis", "pdf_report", "repository", "dataset", "api_integration"],
      notes: ["Future source connectors should map into the runtime model before scanner execution."],
    },
    notes: [
      "System fragility scanner executed on runtime model.",
      "Scanner is platform-level and domain-agnostic.",
      ...(runtimeModel.objects.length === 0 ? ["Runtime model had no objects; findings are limited."] : []),
    ],
  };
}

