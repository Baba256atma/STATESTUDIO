export type NexoraScenarioEventType =
  | "shock"
  | "pressure"
  | "failure"
  | "recovery"
  | "stabilization"
  | "intervention"
  | "trend_shift";

export type NexoraScenarioTargetType =
  | "object"
  | "relation"
  | "loop"
  | "kpi"
  | "system";

export interface NexoraScenarioEvent {
  id: string;
  label: string;
  type: NexoraScenarioEventType;
  targetType: NexoraScenarioTargetType;
  targetId?: string | null;
  intensity?: number;
  weight?: number;
  direction?: "increase" | "decrease" | "mixed";
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NexoraScenarioDefinition {
  id: string;
  label: string;
  description?: string;
  domainId?: string | null;
  events: NexoraScenarioEvent[];
  tags?: string[];
  severity?: "low" | "moderate" | "high" | "critical";
  metadata?: Record<string, any>;
}

export interface NexoraSimulationStep {
  index: number;
  label?: string;
  affectedObjectIds?: string[];
  affectedRelationIds?: string[];
  affectedLoopIds?: string[];
  affectedKpiIds?: string[];
  notes?: string[];
}

export interface NexoraSimulationKpiImpact {
  id: string;
  label: string;
  before?: number;
  after?: number;
  delta?: number;
  trend?: "up" | "down" | "stable";
  notes?: string[];
}

export interface NexoraSimulationObjectImpact {
  objectId: string;
  beforeRisk?: number;
  afterRisk?: number;
  beforeActivity?: number;
  afterActivity?: number;
  beforeStability?: number;
  afterStability?: number;
  notes?: string[];
}

export interface NexoraSimulationSnapshot {
  stepIndex: number;
  objectStates: Record<string, Record<string, any>>;
  relationStates: Record<string, Record<string, any>>;
  loopStates: Record<string, Record<string, any>>;
  kpiStates: Record<string, Record<string, any>>;
}

export interface NexoraScenarioOutcome {
  scenarioId: string;
  label: string;
  domainId?: string | null;
  objectImpacts: NexoraSimulationObjectImpact[];
  kpiImpacts: NexoraSimulationKpiImpact[];
  steps: NexoraSimulationStep[];
  snapshots: NexoraSimulationSnapshot[];
  overallRisk?: "low" | "moderate" | "high" | "critical";
  summary?: string;
  notes?: string[];
}

export interface NexoraSimulationEngineInput {
  runtimeModel: any;
  runtimeContext?: any;
  scenario: NexoraScenarioDefinition;
  maxSteps?: number;
}

type ObjectStateMap = Record<string, Record<string, any>>;
type RelationStateMap = Record<string, Record<string, any>>;
type LoopStateMap = Record<string, Record<string, any>>;
type KpiStateMap = Record<string, Record<string, any>>;

function clamp01(value: number | undefined): number {
  if (!Number.isFinite(Number(value))) return 0;
  const numeric = Number(value);
  if (numeric <= 0) return 0;
  if (numeric >= 1) return 1;
  return numeric;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function normalizeMetadata(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, any>) } : {};
}

function sortIds(values: string[]): string[] {
  return uniq(values).sort((a, b) => a.localeCompare(b));
}

function cloneStateMap<T extends Record<string, Record<string, any>>>(stateMap: T): T {
  return Object.keys(stateMap).reduce((acc, key) => {
    acc[key as keyof T] = { ...stateMap[key] } as T[keyof T];
    return acc;
  }, {} as T);
}

function severityRank(value?: "low" | "moderate" | "high" | "critical" | null): number {
  switch (value) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function trendFromDelta(delta: number): "up" | "down" | "stable" {
  if (delta > 0.02) return "up";
  if (delta < -0.02) return "down";
  return "stable";
}

function inferObjectDeltaForEvent(event: NexoraScenarioEvent): {
  riskDelta: number;
  activityDelta: number;
  stabilityDelta: number;
} {
  const intensity = clamp01(event.intensity ?? 0.5);
  const weight = clamp01(event.weight ?? 0.5);
  const magnitude = intensity * weight;
  const direction = event.direction ?? "increase";

  switch (event.type) {
    case "shock":
    case "failure":
      return {
        riskDelta: magnitude * 0.8,
        activityDelta: direction === "decrease" ? magnitude * 0.4 : -magnitude * 0.4,
        stabilityDelta: -magnitude * 0.7,
      };
    case "pressure":
      return {
        riskDelta: magnitude * 0.6,
        activityDelta: direction === "decrease" ? -magnitude * 0.2 : magnitude * 0.2,
        stabilityDelta: -magnitude * 0.4,
      };
    case "recovery":
    case "stabilization":
      return {
        riskDelta: -magnitude * 0.5,
        activityDelta: magnitude * 0.2,
        stabilityDelta: magnitude * 0.6,
      };
    case "intervention":
      return {
        riskDelta: direction === "increase" ? magnitude * 0.2 : -magnitude * 0.4,
        activityDelta: magnitude * 0.15,
        stabilityDelta: magnitude * 0.35,
      };
    case "trend_shift":
      return {
        riskDelta: direction === "decrease" ? -magnitude * 0.2 : magnitude * 0.2,
        activityDelta: direction === "decrease" ? -magnitude * 0.2 : magnitude * 0.2,
        stabilityDelta: direction === "mixed" ? 0 : direction === "decrease" ? -magnitude * 0.1 : magnitude * 0.1,
      };
    default:
      return {
        riskDelta: 0,
        activityDelta: 0,
        stabilityDelta: 0,
      };
  }
}

export function normalizeScenarioEvent(
  input: Partial<NexoraScenarioEvent> & {
    id: string;
    label?: string;
    type: NexoraScenarioEventType;
    targetType: NexoraScenarioTargetType;
  }
): NexoraScenarioEvent {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  return {
    id,
    label,
    type: input.type,
    targetType: input.targetType,
    ...(input.targetId === undefined ? {} : { targetId: input.targetId === null ? null : String(input.targetId).trim() }),
    intensity: clamp01(input.intensity ?? 0.5),
    weight: clamp01(input.weight ?? 0.5),
    ...(input.direction ? { direction: input.direction } : {}),
    ...(typeof input.description === "string" && input.description.trim()
      ? { description: input.description.trim() }
      : {}),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    metadata: normalizeMetadata(input.metadata),
  };
}

export function normalizeScenarioDefinition(
  input: Partial<NexoraScenarioDefinition> & { id: string; label?: string }
): NexoraScenarioDefinition {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  return {
    id,
    label,
    ...(typeof input.description === "string" && input.description.trim()
      ? { description: input.description.trim() }
      : {}),
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    events: Array.isArray(input.events) ? input.events.map((event) => normalizeScenarioEvent(event as any)) : [],
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    ...(input.severity ? { severity: input.severity } : {}),
    metadata: normalizeMetadata(input.metadata),
  };
}

export function buildBaselineObjectStateMap(runtimeModel: any): Record<string, Record<string, any>> {
  const objects = Array.isArray(runtimeModel?.objects) ? runtimeModel.objects : [];
  return objects.reduce<ObjectStateMap>((acc, object) => {
    const id = String(object?.id ?? "").trim();
    if (!id) return acc;
    acc[id] = {
      id,
      label: typeof object?.label === "string" ? object.label : id,
      coreRole: object?.coreRole ?? null,
      domainId: object?.domainId ?? null,
      activityLevel: clamp01(object?.activityLevel ?? 0.5),
      riskLevel: clamp01(object?.riskLevel ?? 0.2),
      stabilityLevel: clamp01(object?.stabilityLevel ?? 0.8),
      tags: Array.isArray(object?.tags) ? uniq(object.tags.map((value: unknown) => String(value))) : [],
      metadata: normalizeMetadata(object?.metadata),
    };
    return acc;
  }, {});
}

export function buildBaselineRelationStateMap(runtimeModel: any): Record<string, Record<string, any>> {
  const relations = Array.isArray(runtimeModel?.relations) ? runtimeModel.relations : [];
  return relations.reduce<RelationStateMap>((acc, relation) => {
    const id = String(relation?.id ?? "").trim();
    if (!id) return acc;
    acc[id] = {
      id,
      from: String(relation?.from ?? "").trim(),
      to: String(relation?.to ?? "").trim(),
      relationType: relation?.relationType ?? null,
      domainId: relation?.domainId ?? null,
      strength: clamp01(relation?.strength ?? 0.6),
      volatility: clamp01(relation?.volatility ?? 0.3),
      tags: Array.isArray(relation?.tags) ? uniq(relation.tags.map((value: unknown) => String(value))) : [],
      metadata: normalizeMetadata(relation?.metadata),
    };
    return acc;
  }, {});
}

export function buildBaselineLoopStateMap(runtimeModel: any): Record<string, Record<string, any>> {
  const loops = Array.isArray(runtimeModel?.loops) ? runtimeModel.loops : [];
  return loops.reduce<LoopStateMap>((acc, loop) => {
    const id = String(loop?.id ?? "").trim();
    if (!id) return acc;
    acc[id] = {
      id,
      label: typeof loop?.label === "string" ? loop.label : id,
      loopType: loop?.loopType ?? null,
      nodes: Array.isArray(loop?.nodes) ? uniq(loop.nodes.map((value: unknown) => String(value))) : [],
      intensity: clamp01(loop?.intensity ?? 0.5),
      stability: clamp01(loop?.stability ?? 0.7),
      domainId: loop?.domainId ?? null,
      tags: Array.isArray(loop?.tags) ? uniq(loop.tags.map((value: unknown) => String(value))) : [],
    };
    return acc;
  }, {});
}

export function buildBaselineKpiStateMap(runtimeModel: any): Record<string, Record<string, any>> {
  const kpis = Array.isArray(runtimeModel?.kpis) ? runtimeModel.kpis : [];
  return kpis.reduce<KpiStateMap>((acc, kpi) => {
    const id = String(kpi?.id ?? "").trim();
    if (!id) return acc;
    acc[id] = {
      id,
      label: typeof kpi?.label === "string" ? kpi.label : id,
      value: clamp01(kpi?.value ?? 0.5),
      trend: kpi?.trend ?? "stable",
      domainId: kpi?.domainId ?? null,
    };
    return acc;
  }, {});
}

export function applyScenarioEventToObjectState(
  state: Record<string, any>,
  event: NexoraScenarioEvent
): Record<string, any> {
  const delta = inferObjectDeltaForEvent(event);
  return {
    ...state,
    riskLevel: clamp01((state.riskLevel ?? 0) + delta.riskDelta),
    activityLevel: clamp01((state.activityLevel ?? 0) + delta.activityDelta),
    stabilityLevel: clamp01((state.stabilityLevel ?? 0) + delta.stabilityDelta),
  };
}

export function applyScenarioEventToRelationState(
  state: Record<string, any>,
  event: NexoraScenarioEvent
): Record<string, any> {
  const intensity = clamp01(event.intensity ?? 0.5);
  const weight = clamp01(event.weight ?? 0.5);
  const delta = intensity * weight;

  switch (event.type) {
    case "shock":
    case "failure":
    case "pressure":
      return {
        ...state,
        volatility: clamp01((state.volatility ?? 0) + delta * 0.5),
        strength: clamp01((state.strength ?? 0) - delta * 0.2),
      };
    case "recovery":
    case "stabilization":
    case "intervention":
      return {
        ...state,
        volatility: clamp01((state.volatility ?? 0) - delta * 0.4),
        strength: clamp01((state.strength ?? 0) + delta * 0.2),
      };
    default:
      return { ...state };
  }
}

export function applyScenarioEventToLoopState(
  state: Record<string, any>,
  event: NexoraScenarioEvent
): Record<string, any> {
  const intensity = clamp01(event.intensity ?? 0.5);
  const weight = clamp01(event.weight ?? 0.5);
  const delta = intensity * weight;

  switch (event.type) {
    case "shock":
    case "pressure":
    case "failure":
      return {
        ...state,
        intensity: clamp01((state.intensity ?? 0) + delta * 0.4),
        stability: clamp01((state.stability ?? 0) - delta * 0.3),
      };
    case "recovery":
    case "stabilization":
    case "intervention":
      return {
        ...state,
        intensity: clamp01((state.intensity ?? 0) - delta * 0.2),
        stability: clamp01((state.stability ?? 0) + delta * 0.3),
      };
    default:
      return { ...state };
  }
}

export function applyScenarioEventToKpiState(
  state: Record<string, any>,
  event: NexoraScenarioEvent
): Record<string, any> {
  const intensity = clamp01(event.intensity ?? 0.5);
  const weight = clamp01(event.weight ?? 0.5);
  const delta = intensity * weight;
  const direction = event.direction ?? "mixed";

  let nextValue = state.value ?? 0.5;
  if (event.type === "recovery" || event.type === "stabilization" || event.type === "intervention") {
    nextValue += delta * 0.15;
  } else if (direction === "decrease") {
    nextValue += delta * 0.05;
  } else {
    nextValue -= delta * 0.12;
  }

  const clamped = clamp01(nextValue);
  return {
    ...state,
    value: clamped,
    trend: trendFromDelta(clamped - (state.value ?? 0.5)),
  };
}

export function propagateScenarioAcrossRelations(args: {
  objectStates: Record<string, Record<string, any>>;
  relationStates: Record<string, Record<string, any>>;
}): Record<string, Record<string, any>> {
  const nextObjectStates = cloneStateMap(args.objectStates);
  const relationIds = Object.keys(args.relationStates).sort((a, b) => a.localeCompare(b));

  for (const relationId of relationIds) {
    const relation = args.relationStates[relationId];
    const fromId = String(relation.from ?? "").trim();
    const toId = String(relation.to ?? "").trim();
    const sourceObject = nextObjectStates[fromId];
    const targetObject = nextObjectStates[toId];
    if (!sourceObject || !targetObject) continue;

    const strength = clamp01(relation.strength ?? 0.5);
    const volatility = clamp01(relation.volatility ?? 0.3);
    const riskPush = clamp01((sourceObject.riskLevel ?? 0) * strength * 0.18);
    const activityPush = ((sourceObject.activityLevel ?? 0.5) - 0.5) * strength * 0.15;
    const stabilityDrag = clamp01((sourceObject.riskLevel ?? 0) * volatility * 0.12);

    nextObjectStates[toId] = {
      ...targetObject,
      riskLevel: clamp01((targetObject.riskLevel ?? 0) + riskPush),
      activityLevel: clamp01((targetObject.activityLevel ?? 0.5) + activityPush),
      stabilityLevel: clamp01((targetObject.stabilityLevel ?? 0.5) - stabilityDrag),
    };
  }

  return nextObjectStates;
}

export function applyLoopInfluenceToObjectStates(args: {
  objectStates: Record<string, Record<string, any>>;
  loopStates: Record<string, Record<string, any>>;
}): Record<string, Record<string, any>> {
  const nextObjectStates = cloneStateMap(args.objectStates);
  const loopIds = Object.keys(args.loopStates).sort((a, b) => a.localeCompare(b));

  for (const loopId of loopIds) {
    const loop = args.loopStates[loopId];
    const nodes = Array.isArray(loop.nodes) ? loop.nodes.map((value: unknown) => String(value)) : [];
    const intensity = clamp01(loop.intensity ?? 0.5);
    const stability = clamp01(loop.stability ?? 0.5);
    const loopType = String(loop.loopType ?? "").trim();

    for (const nodeId of nodes) {
      const current = nextObjectStates[nodeId];
      if (!current) continue;

      let riskDelta = 0;
      let stabilityDelta = 0;

      if (loopType === "reinforcing") {
        riskDelta += intensity * 0.08;
        stabilityDelta -= intensity * 0.05;
      } else if (loopType === "pressure" || loopType === "risk_cascade") {
        riskDelta += intensity * 0.1;
        stabilityDelta -= intensity * 0.06;
      } else if (loopType === "balancing" || loopType === "buffer_recovery") {
        riskDelta -= stability * 0.06;
        stabilityDelta += stability * 0.08;
      } else if (loopType === "strategic_response") {
        riskDelta -= stability * 0.05;
        stabilityDelta += stability * 0.05;
      }

      nextObjectStates[nodeId] = {
        ...current,
        riskLevel: clamp01((current.riskLevel ?? 0) + riskDelta),
        stabilityLevel: clamp01((current.stabilityLevel ?? 0.5) + stabilityDelta),
      };
    }
  }

  return nextObjectStates;
}

export function deriveKpiImpactsFromRuntimeState(args: {
  baselineKpis: Record<string, Record<string, any>>;
  finalKpis: Record<string, Record<string, any>>;
}): NexoraSimulationKpiImpact[] {
  const ids = sortIds([...Object.keys(args.baselineKpis), ...Object.keys(args.finalKpis)]);
  return ids.map((id) => {
    const before = clamp01(args.baselineKpis[id]?.value ?? 0.5);
    const after = clamp01(args.finalKpis[id]?.value ?? before);
    const delta = Number((after - before).toFixed(4));
    return {
      id,
      label: String(args.finalKpis[id]?.label ?? args.baselineKpis[id]?.label ?? id),
      before,
      after,
      delta,
      trend: trendFromDelta(delta),
      notes: delta === 0 ? ["No material KPI change detected."] : [],
    };
  });
}

export function deriveObjectImpactsFromRuntimeState(args: {
  baselineObjects: Record<string, Record<string, any>>;
  finalObjects: Record<string, Record<string, any>>;
}): NexoraSimulationObjectImpact[] {
  const ids = sortIds([...Object.keys(args.baselineObjects), ...Object.keys(args.finalObjects)]);
  return ids.map((id) => {
    const before = args.baselineObjects[id] ?? {};
    const after = args.finalObjects[id] ?? before;
    const notes: string[] = [];
    if ((after.riskLevel ?? 0) > (before.riskLevel ?? 0)) notes.push("Risk increased.");
    if ((after.stabilityLevel ?? 0) < (before.stabilityLevel ?? 0)) notes.push("Stability declined.");
    return {
      objectId: id,
      beforeRisk: clamp01(before.riskLevel ?? 0),
      afterRisk: clamp01(after.riskLevel ?? 0),
      beforeActivity: clamp01(before.activityLevel ?? 0.5),
      afterActivity: clamp01(after.activityLevel ?? 0.5),
      beforeStability: clamp01(before.stabilityLevel ?? 0.5),
      afterStability: clamp01(after.stabilityLevel ?? 0.5),
      notes,
    };
  });
}

export function inferScenarioOutcomeRisk(args: {
  objectImpacts: NexoraSimulationObjectImpact[];
  kpiImpacts: NexoraSimulationKpiImpact[];
}): "low" | "moderate" | "high" | "critical" {
  const maxObjectRisk = args.objectImpacts.reduce((acc, impact) => Math.max(acc, impact.afterRisk ?? 0), 0);
  const maxNegativeKpiDelta = Math.abs(
    args.kpiImpacts.reduce((acc, impact) => Math.min(acc, impact.delta ?? 0), 0)
  );
  const score = Math.max(maxObjectRisk, maxNegativeKpiDelta * 1.5);

  if (score >= 0.75) return "critical";
  if (score >= 0.5) return "high";
  if (score >= 0.25) return "moderate";
  return "low";
}

export function buildScenarioOutcomeSummary(args: {
  scenario: NexoraScenarioDefinition;
  overallRisk: "low" | "moderate" | "high" | "critical";
  objectImpacts: NexoraSimulationObjectImpact[];
  kpiImpacts: NexoraSimulationKpiImpact[];
}): string {
  const topObject = [...args.objectImpacts]
    .sort((a, b) => (b.afterRisk ?? 0) - (a.afterRisk ?? 0))
    .find((impact) => (impact.afterRisk ?? 0) > 0);
  const topKpi = [...args.kpiImpacts]
    .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];

  const objectText = topObject
    ? `${topObject.objectId} absorbed the most visible system stress`
    : "object impacts remained contained";
  const kpiText = topKpi
    ? `${topKpi.label} moved ${topKpi.trend ?? "stable"}`
    : "KPI effects remained limited";

  return `${args.scenario.label} produced a ${args.overallRisk} risk outcome; ${objectText}, and ${kpiText}.`;
}

function buildSnapshot(stepIndex: number, objectStates: ObjectStateMap, relationStates: RelationStateMap, loopStates: LoopStateMap, kpiStates: KpiStateMap): NexoraSimulationSnapshot {
  return {
    stepIndex,
    objectStates: cloneStateMap(objectStates),
    relationStates: cloneStateMap(relationStates),
    loopStates: cloneStateMap(loopStates),
    kpiStates: cloneStateMap(kpiStates),
  };
}

function updateKpisFromObjectStates(
  kpiStates: KpiStateMap,
  objectStates: ObjectStateMap
): KpiStateMap {
  const nextKpis = cloneStateMap(kpiStates);
  const objectValues = Object.values(objectStates);
  if (objectValues.length === 0) return nextKpis;

  const averageRisk =
    objectValues.reduce((acc, object) => acc + clamp01(object.riskLevel ?? 0), 0) / objectValues.length;
  const averageStability =
    objectValues.reduce((acc, object) => acc + clamp01(object.stabilityLevel ?? 0.5), 0) / objectValues.length;

  for (const id of Object.keys(nextKpis).sort((a, b) => a.localeCompare(b))) {
    const current = nextKpis[id];
    const nextValue = clamp01((current.value ?? 0.5) - averageRisk * 0.12 + averageStability * 0.05);
    nextKpis[id] = {
      ...current,
      value: nextValue,
      trend: trendFromDelta(nextValue - (current.value ?? 0.5)),
    };
  }

  return nextKpis;
}

export function runDomainScenarioSimulation(
  input: NexoraSimulationEngineInput
): NexoraScenarioOutcome {
  const scenario = normalizeScenarioDefinition(input.scenario);
  const maxSteps = Number.isFinite(Number(input.maxSteps)) ? Math.max(1, Math.floor(Number(input.maxSteps))) : 4;

  const baselineObjects = buildBaselineObjectStateMap(input.runtimeModel);
  const baselineRelations = buildBaselineRelationStateMap(input.runtimeModel);
  const baselineLoops = buildBaselineLoopStateMap(input.runtimeModel);
  const baselineKpis = buildBaselineKpiStateMap(input.runtimeModel);

  let workingObjects = cloneStateMap(baselineObjects);
  let workingRelations = cloneStateMap(baselineRelations);
  let workingLoops = cloneStateMap(baselineLoops);
  let workingKpis = cloneStateMap(baselineKpis);

  const steps: NexoraSimulationStep[] = [];
  const snapshots: NexoraSimulationSnapshot[] = [
    buildSnapshot(0, workingObjects, workingRelations, workingLoops, workingKpis),
  ];

  const limitedEvents = scenario.events.slice(0, maxSteps);

  limitedEvents.forEach((event, index) => {
    const affectedObjectIds: string[] = [];
    const affectedRelationIds: string[] = [];
    const affectedLoopIds: string[] = [];
    const affectedKpiIds: string[] = [];
    const normalizedEvent = normalizeScenarioEvent(event);

    if (normalizedEvent.targetType === "object") {
      const targetIds =
        normalizedEvent.targetId && workingObjects[normalizedEvent.targetId]
          ? [normalizedEvent.targetId]
          : Object.keys(workingObjects);
      for (const id of targetIds) {
        workingObjects[id] = applyScenarioEventToObjectState(workingObjects[id], normalizedEvent);
        affectedObjectIds.push(id);
      }
    } else if (normalizedEvent.targetType === "relation") {
      const targetIds =
        normalizedEvent.targetId && workingRelations[normalizedEvent.targetId]
          ? [normalizedEvent.targetId]
          : Object.keys(workingRelations);
      for (const id of targetIds) {
        workingRelations[id] = applyScenarioEventToRelationState(workingRelations[id], normalizedEvent);
        affectedRelationIds.push(id);
      }
    } else if (normalizedEvent.targetType === "loop") {
      const targetIds =
        normalizedEvent.targetId && workingLoops[normalizedEvent.targetId]
          ? [normalizedEvent.targetId]
          : Object.keys(workingLoops);
      for (const id of targetIds) {
        workingLoops[id] = applyScenarioEventToLoopState(workingLoops[id], normalizedEvent);
        affectedLoopIds.push(id);
      }
    } else if (normalizedEvent.targetType === "kpi") {
      const targetIds =
        normalizedEvent.targetId && workingKpis[normalizedEvent.targetId]
          ? [normalizedEvent.targetId]
          : Object.keys(workingKpis);
      for (const id of targetIds) {
        workingKpis[id] = applyScenarioEventToKpiState(workingKpis[id], normalizedEvent);
        affectedKpiIds.push(id);
      }
    } else {
      for (const id of Object.keys(workingObjects)) {
        workingObjects[id] = applyScenarioEventToObjectState(workingObjects[id], normalizedEvent);
        affectedObjectIds.push(id);
      }
      for (const id of Object.keys(workingRelations)) {
        workingRelations[id] = applyScenarioEventToRelationState(workingRelations[id], normalizedEvent);
        affectedRelationIds.push(id);
      }
      for (const id of Object.keys(workingLoops)) {
        workingLoops[id] = applyScenarioEventToLoopState(workingLoops[id], normalizedEvent);
        affectedLoopIds.push(id);
      }
      for (const id of Object.keys(workingKpis)) {
        workingKpis[id] = applyScenarioEventToKpiState(workingKpis[id], normalizedEvent);
        affectedKpiIds.push(id);
      }
    }

    workingObjects = propagateScenarioAcrossRelations({
      objectStates: workingObjects,
      relationStates: workingRelations,
    });

    workingObjects = applyLoopInfluenceToObjectStates({
      objectStates: workingObjects,
      loopStates: workingLoops,
    });

    workingKpis = updateKpisFromObjectStates(workingKpis, workingObjects);

    steps.push({
      index: index + 1,
      label: normalizedEvent.label,
      affectedObjectIds: sortIds(affectedObjectIds),
      affectedRelationIds: sortIds(affectedRelationIds),
      affectedLoopIds: sortIds(affectedLoopIds),
      affectedKpiIds: sortIds(affectedKpiIds),
      notes: [`Applied ${normalizedEvent.type} event.`],
    });

    snapshots.push(buildSnapshot(index + 1, workingObjects, workingRelations, workingLoops, workingKpis));
  });

  const objectImpacts = deriveObjectImpactsFromRuntimeState({
    baselineObjects,
    finalObjects: workingObjects,
  });

  const kpiImpacts = deriveKpiImpactsFromRuntimeState({
    baselineKpis,
    finalKpis: workingKpis,
  });

  const overallRisk = inferScenarioOutcomeRisk({
    objectImpacts,
    kpiImpacts,
  });

  const summary = buildScenarioOutcomeSummary({
    scenario,
    overallRisk,
    objectImpacts,
    kpiImpacts,
  });

  return {
    scenarioId: scenario.id,
    label: scenario.label,
    ...(scenario.domainId === undefined ? {} : { domainId: scenario.domainId }),
    objectImpacts,
    kpiImpacts,
    steps,
    snapshots,
    overallRisk,
    summary,
    notes: [
      `Simulation executed with ${limitedEvents.length} event(s).`,
      ...(scenario.severity ? [`Scenario severity: ${scenario.severity}.`] : []),
    ],
  };
}

const BUSINESS_SCENARIOS: NexoraScenarioDefinition[] = [
  normalizeScenarioDefinition({
    id: "supplier_delay",
    label: "Supplier Delay",
    domainId: "business",
    severity: "high",
    events: [
      { id: "e1", label: "Supplier shock", type: "shock", targetType: "object", targetId: "supplier", intensity: 0.8, weight: 0.7 },
      { id: "e2", label: "Flow pressure", type: "pressure", targetType: "relation", targetId: null, intensity: 0.6, weight: 0.5 },
    ],
    tags: ["supplier", "delay"],
  }),
  normalizeScenarioDefinition({
    id: "demand_spike",
    label: "Demand Spike",
    domainId: "business",
    severity: "moderate",
    events: [
      { id: "e1", label: "Demand pressure", type: "pressure", targetType: "system", intensity: 0.7, weight: 0.6 },
      { id: "e2", label: "Buffer strain", type: "failure", targetType: "object", targetId: "inventory", intensity: 0.5, weight: 0.5 },
    ],
    tags: ["demand", "spike"],
  }),
];

const FINANCE_SCENARIOS: NexoraScenarioDefinition[] = [
  normalizeScenarioDefinition({
    id: "liquidity_stress",
    label: "Liquidity Stress",
    domainId: "finance",
    severity: "critical",
    events: [
      { id: "e1", label: "Funding shock", type: "shock", targetType: "object", targetId: "liquidity", intensity: 0.85, weight: 0.8 },
      { id: "e2", label: "Constraint loop", type: "pressure", targetType: "loop", targetId: null, intensity: 0.6, weight: 0.7 },
    ],
    tags: ["liquidity", "stress"],
  }),
  normalizeScenarioDefinition({
    id: "drawdown_risk",
    label: "Drawdown Risk",
    domainId: "finance",
    severity: "high",
    events: [
      { id: "e1", label: "Portfolio decline", type: "failure", targetType: "object", targetId: "portfolio", intensity: 0.7, weight: 0.6 },
      { id: "e2", label: "Risk transfer", type: "trend_shift", targetType: "relation", targetId: null, intensity: 0.5, weight: 0.5, direction: "increase" },
    ],
    tags: ["drawdown", "risk"],
  }),
];

const DEVOPS_SCENARIOS: NexoraScenarioDefinition[] = [
  normalizeScenarioDefinition({
    id: "database_latency",
    label: "Database Latency",
    domainId: "devops",
    severity: "high",
    events: [
      { id: "e1", label: "Latency pressure", type: "pressure", targetType: "object", targetId: "database", intensity: 0.75, weight: 0.6 },
      { id: "e2", label: "Dependency strain", type: "failure", targetType: "relation", targetId: null, intensity: 0.55, weight: 0.5 },
    ],
    tags: ["database", "latency"],
  }),
  normalizeScenarioDefinition({
    id: "service_failure",
    label: "Service Failure",
    domainId: "devops",
    severity: "critical",
    events: [
      { id: "e1", label: "Service outage", type: "failure", targetType: "object", targetId: "service", intensity: 0.9, weight: 0.8 },
      { id: "e2", label: "Recovery intervention", type: "intervention", targetType: "loop", targetId: null, intensity: 0.4, weight: 0.5, direction: "decrease" },
    ],
    tags: ["service", "failure"],
  }),
];

const STRATEGY_SCENARIOS: NexoraScenarioDefinition[] = [
  normalizeScenarioDefinition({
    id: "competitor_pricing_pressure",
    label: "Competitor Pricing Pressure",
    domainId: "strategy",
    severity: "high",
    events: [
      { id: "e1", label: "Competitive shock", type: "shock", targetType: "object", targetId: "competitor", intensity: 0.7, weight: 0.6 },
      { id: "e2", label: "Position pressure", type: "pressure", targetType: "system", intensity: 0.55, weight: 0.5 },
    ],
    tags: ["competitor", "pricing"],
  }),
  normalizeScenarioDefinition({
    id: "execution_bottleneck",
    label: "Execution Bottleneck",
    domainId: "strategy",
    severity: "moderate",
    events: [
      { id: "e1", label: "Execution failure", type: "failure", targetType: "object", targetId: "execution", intensity: 0.6, weight: 0.5 },
      { id: "e2", label: "Strategic response", type: "intervention", targetType: "loop", targetId: null, intensity: 0.45, weight: 0.4, direction: "decrease" },
    ],
    tags: ["execution", "bottleneck"],
  }),
];

export const DEFAULT_SIMULATION_SCENARIOS: Record<string, NexoraScenarioDefinition[]> = {
  business: BUSINESS_SCENARIOS,
  finance: FINANCE_SCENARIOS,
  devops: DEVOPS_SCENARIOS,
  strategy: STRATEGY_SCENARIOS,
};
