export interface NexoraRuntimeObjectState {
  id: string;
  label?: string;
  coreRole?: string | null;
  domainId?: string | null;
  activityLevel?: number;
  riskLevel?: number;
  stabilityLevel?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NexoraRuntimeRelationState {
  id: string;
  from: string;
  to: string;
  relationType?: string | null;
  domainId?: string | null;
  strength?: number;
  volatility?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NexoraRuntimeLoopState {
  id: string;
  label?: string;
  loopType?: string | null;
  nodes?: string[];
  intensity?: number;
  stability?: number;
  domainId?: string | null;
  tags?: string[];
}

export interface NexoraRuntimeKpiState {
  id: string;
  label: string;
  value?: number;
  trend?: "up" | "down" | "stable";
  domainId?: string | null;
}

export interface NexoraRuntimeScenarioState {
  id: string;
  label: string;
  severity?: "low" | "moderate" | "high" | "critical";
  active?: boolean;
  domainId?: string | null;
}

export interface NexoraDomainRuntimeModel {
  projectId: string;
  domainId?: string | null;
  objects: NexoraRuntimeObjectState[];
  relations: NexoraRuntimeRelationState[];
  loops: NexoraRuntimeLoopState[];
  scenarios: NexoraRuntimeScenarioState[];
  kpis: NexoraRuntimeKpiState[];
  tags?: string[];
}

export interface NexoraDomainRuntimeContext {
  mode?: string | null;
  timestamp?: number;
  chaosLevel?: number;
  systemVolatility?: number;
  activeScenarioIds?: string[];
  selectedObjectId?: string | null;
  metadata?: Record<string, any>;
}

export interface NexoraDomainRuntimeIntegrationResult {
  runtimeModel: NexoraDomainRuntimeModel;
  runtimeContext: NexoraDomainRuntimeContext;
  cockpitHints?: Record<string, any>;
  adviceHints?: Record<string, any>;
  notes?: string[];
}

type ProjectObjectLike = {
  id: string;
  label?: string;
  coreRole?: string | null;
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, any>;
};

type ProjectRelationLike = {
  id: string;
  from: string;
  to: string;
  relationType?: string | null;
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, any>;
};

type ProjectLoopLike = {
  id: string;
  label?: string;
  loopType?: string | null;
  nodes?: string[];
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, any>;
};

type ProjectScenarioLike = {
  id: string;
  label?: string;
  severityHint?: "low" | "moderate" | "high" | "critical";
  domainId?: string | null;
  tags?: string[];
};

type ProjectKpiLike = {
  id: string;
  label?: string;
  domainId?: string | null;
  tags?: string[];
};

type ProjectLike = {
  projectId?: string;
  domainId?: string | null;
  label?: string;
  objects?: ProjectObjectLike[];
  relations?: ProjectRelationLike[];
  loops?: ProjectLoopLike[];
  scenarioHints?: ProjectScenarioLike[];
  kpiHints?: ProjectKpiLike[];
  inferredTags?: string[];
};

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

function normalizeProject(input: any): ProjectLike {
  return {
    projectId: String(input?.projectId ?? "").trim(),
    domainId:
      input?.domainId === null || input?.domainId === undefined
        ? null
        : String(input.domainId).trim(),
    label: typeof input?.label === "string" ? input.label.trim() : undefined,
    objects: Array.isArray(input?.objects)
      ? input.objects.map((item: any) => ({
          id: String(item?.id ?? "").trim(),
          label: typeof item?.label === "string" ? item.label.trim() : undefined,
          coreRole:
            item?.coreRole === null || item?.coreRole === undefined ? null : String(item.coreRole).trim(),
          domainId:
            item?.domainId === null || item?.domainId === undefined ? null : String(item.domainId).trim(),
          tags: Array.isArray(item?.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
          metadata: normalizeMetadata(item?.metadata),
        }))
      : [],
    relations: Array.isArray(input?.relations)
      ? input.relations.map((item: any) => ({
          id: String(item?.id ?? "").trim(),
          from: String(item?.from ?? "").trim(),
          to: String(item?.to ?? "").trim(),
          relationType:
            item?.relationType === null || item?.relationType === undefined
              ? null
              : String(item.relationType).trim(),
          domainId:
            item?.domainId === null || item?.domainId === undefined ? null : String(item.domainId).trim(),
          tags: Array.isArray(item?.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
          metadata: normalizeMetadata(item?.metadata),
        }))
      : [],
    loops: Array.isArray(input?.loops)
      ? input.loops.map((item: any) => ({
          id: String(item?.id ?? "").trim(),
          label: typeof item?.label === "string" ? item.label.trim() : undefined,
          loopType:
            item?.loopType === null || item?.loopType === undefined ? null : String(item.loopType).trim(),
          nodes: Array.isArray(item?.nodes) ? uniq(item.nodes.map((value: unknown) => String(value))) : [],
          domainId:
            item?.domainId === null || item?.domainId === undefined ? null : String(item.domainId).trim(),
          tags: Array.isArray(item?.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
          metadata: normalizeMetadata(item?.metadata),
        }))
      : [],
    scenarioHints: Array.isArray(input?.scenarioHints)
      ? input.scenarioHints.map((item: any) => ({
          id: String(item?.id ?? "").trim(),
          label: typeof item?.label === "string" ? item.label.trim() : undefined,
          severityHint: item?.severityHint,
          domainId:
            item?.domainId === null || item?.domainId === undefined ? null : String(item.domainId).trim(),
          tags: Array.isArray(item?.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
        }))
      : [],
    kpiHints: Array.isArray(input?.kpiHints)
      ? input.kpiHints.map((item: any) => ({
          id: String(item?.id ?? "").trim(),
          label: typeof item?.label === "string" ? item.label.trim() : undefined,
          domainId:
            item?.domainId === null || item?.domainId === undefined ? null : String(item.domainId).trim(),
          tags: Array.isArray(item?.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
        }))
      : [],
    inferredTags: Array.isArray(input?.inferredTags)
      ? uniq(input.inferredTags.map((value: unknown) => String(value)))
      : [],
  };
}

export function buildRuntimeObjectsFromProject(
  project: any
): NexoraRuntimeObjectState[] {
  const normalized = normalizeProject(project);
  return (normalized.objects ?? []).map((object) => ({
    id: object.id,
    ...(object.label ? { label: object.label } : {}),
    ...(object.coreRole !== undefined ? { coreRole: object.coreRole } : {}),
    ...(object.domainId !== undefined ? { domainId: object.domainId } : {}),
    activityLevel: 0.5,
    riskLevel: 0.2,
    stabilityLevel: 0.8,
    tags: Array.isArray(object.tags) ? [...object.tags] : [],
    metadata: normalizeMetadata(object.metadata),
  }));
}

export function buildRuntimeRelationsFromProject(
  project: any
): NexoraRuntimeRelationState[] {
  const normalized = normalizeProject(project);
  return (normalized.relations ?? []).map((relation) => ({
    id: relation.id,
    from: relation.from,
    to: relation.to,
    ...(relation.relationType !== undefined ? { relationType: relation.relationType } : {}),
    ...(relation.domainId !== undefined ? { domainId: relation.domainId } : {}),
    strength: 0.6,
    volatility: 0.3,
    tags: Array.isArray(relation.tags) ? [...relation.tags] : [],
    metadata: normalizeMetadata(relation.metadata),
  }));
}

export function buildRuntimeLoopsFromProject(
  project: any
): NexoraRuntimeLoopState[] {
  const normalized = normalizeProject(project);
  return (normalized.loops ?? []).map((loop) => ({
    id: loop.id,
    ...(loop.label ? { label: loop.label } : {}),
    ...(loop.loopType !== undefined ? { loopType: loop.loopType } : {}),
    nodes: Array.isArray(loop.nodes) ? [...loop.nodes] : [],
    intensity: 0.5,
    stability: 0.7,
    ...(loop.domainId !== undefined ? { domainId: loop.domainId } : {}),
    tags: Array.isArray(loop.tags) ? [...loop.tags] : [],
  }));
}

export function buildRuntimeScenarios(
  project: any
): NexoraRuntimeScenarioState[] {
  const normalized = normalizeProject(project);
  return (normalized.scenarioHints ?? []).map((scenario) => ({
    id: scenario.id,
    label: scenario.label || scenario.id,
    ...(scenario.severityHint ? { severity: scenario.severityHint } : {}),
    active: false,
    ...(scenario.domainId !== undefined ? { domainId: scenario.domainId } : {}),
  }));
}

export function buildRuntimeKpis(
  project: any
): NexoraRuntimeKpiState[] {
  const normalized = normalizeProject(project);
  return (normalized.kpiHints ?? []).map((kpi) => ({
    id: kpi.id,
    label: kpi.label || kpi.id,
    value: 0.5,
    trend: "stable",
    ...(kpi.domainId !== undefined ? { domainId: kpi.domainId } : {}),
  }));
}

export function buildInitialRuntimeContext(args: {
  mode?: string | null;
  domainId?: string | null;
}): NexoraDomainRuntimeContext {
  return {
    ...(args.mode !== undefined ? { mode: args.mode } : {}),
    timestamp: Date.now(),
    chaosLevel: 0.2,
    systemVolatility: 0.3,
    activeScenarioIds: [],
    selectedObjectId: null,
    metadata: {
      ...(args.domainId ? { domainId: args.domainId } : {}),
    },
  };
}

export function integrateDomainProjectIntoRuntime(args: {
  project: any;
  mode?: string | null;
}): NexoraDomainRuntimeIntegrationResult {
  const project = normalizeProject(args.project);
  const runtimeObjects = buildRuntimeObjectsFromProject(project);
  const runtimeRelations = buildRuntimeRelationsFromProject(project);
  const runtimeLoops = buildRuntimeLoopsFromProject(project);
  const runtimeScenarios = buildRuntimeScenarios(project);
  const runtimeKpis = buildRuntimeKpis(project);
  const runtimeContext = buildInitialRuntimeContext({
    mode: args.mode,
    domainId: project.domainId ?? null,
  });

  const runtimeModel: NexoraDomainRuntimeModel = {
    projectId: project.projectId || "runtime_project",
    ...(project.domainId !== undefined ? { domainId: project.domainId } : {}),
    objects: runtimeObjects,
    relations: runtimeRelations,
    loops: runtimeLoops,
    scenarios: runtimeScenarios,
    kpis: runtimeKpis,
    tags: Array.isArray(project.inferredTags) ? [...project.inferredTags] : [],
  };

  return {
    runtimeModel,
    runtimeContext,
    cockpitHints: {
      objectCount: runtimeObjects.length,
      relationCount: runtimeRelations.length,
      loopCount: runtimeLoops.length,
      scenarioCount: runtimeScenarios.length,
      kpiCount: runtimeKpis.length,
    },
    adviceHints: {
      activeScenarioIds: runtimeContext.activeScenarioIds ?? [],
      elevatedRiskObjectIds: runtimeObjects.filter((object) => (object.riskLevel ?? 0) >= 0.5).map((object) => object.id),
    },
    notes: [
      "Runtime model initialized from domain project.",
      ...(args.mode ? [`Mode: ${args.mode}`] : []),
    ],
  };
}

export function updateRuntimeObjectState(
  object: NexoraRuntimeObjectState,
  updates: Partial<NexoraRuntimeObjectState>
): NexoraRuntimeObjectState {
  return {
    ...object,
    ...updates,
    ...(updates.activityLevel !== undefined ? { activityLevel: clamp01(updates.activityLevel) } : {}),
    ...(updates.riskLevel !== undefined ? { riskLevel: clamp01(updates.riskLevel) } : {}),
    ...(updates.stabilityLevel !== undefined ? { stabilityLevel: clamp01(updates.stabilityLevel) } : {}),
    tags: Array.isArray(updates.tags) ? uniq(updates.tags.map((value) => String(value))) : object.tags ?? [],
    metadata: {
      ...normalizeMetadata(object.metadata),
      ...normalizeMetadata(updates.metadata),
    },
  };
}

export function updateRuntimeRelationState(
  relation: NexoraRuntimeRelationState,
  updates: Partial<NexoraRuntimeRelationState>
): NexoraRuntimeRelationState {
  return {
    ...relation,
    ...updates,
    ...(updates.strength !== undefined ? { strength: clamp01(updates.strength) } : {}),
    ...(updates.volatility !== undefined ? { volatility: clamp01(updates.volatility) } : {}),
    tags: Array.isArray(updates.tags) ? uniq(updates.tags.map((value) => String(value))) : relation.tags ?? [],
    metadata: {
      ...normalizeMetadata(relation.metadata),
      ...normalizeMetadata(updates.metadata),
    },
  };
}

export function updateRuntimeLoopState(
  loop: NexoraRuntimeLoopState,
  updates: Partial<NexoraRuntimeLoopState>
): NexoraRuntimeLoopState {
  return {
    ...loop,
    ...updates,
    ...(updates.intensity !== undefined ? { intensity: clamp01(updates.intensity) } : {}),
    ...(updates.stability !== undefined ? { stability: clamp01(updates.stability) } : {}),
    nodes: Array.isArray(updates.nodes) ? uniq(updates.nodes.map((value) => String(value))) : loop.nodes ?? [],
    tags: Array.isArray(updates.tags) ? uniq(updates.tags.map((value) => String(value))) : loop.tags ?? [],
  };
}

export function buildRuntimeSnapshot(
  runtimeModel: NexoraDomainRuntimeModel
): Record<string, any> {
  return {
    projectId: runtimeModel.projectId,
    domainId: runtimeModel.domainId ?? null,
    objectCount: runtimeModel.objects.length,
    relationCount: runtimeModel.relations.length,
    loopCount: runtimeModel.loops.length,
    scenarioCount: runtimeModel.scenarios.length,
    kpiCount: runtimeModel.kpis.length,
    objects: runtimeModel.objects.map((object) => ({
      id: object.id,
      activityLevel: object.activityLevel ?? 0,
      riskLevel: object.riskLevel ?? 0,
      stabilityLevel: object.stabilityLevel ?? 0,
    })),
    relations: runtimeModel.relations.map((relation) => ({
      id: relation.id,
      strength: relation.strength ?? 0,
      volatility: relation.volatility ?? 0,
    })),
    loops: runtimeModel.loops.map((loop) => ({
      id: loop.id,
      intensity: loop.intensity ?? 0,
      stability: loop.stability ?? 0,
    })),
    scenarios: runtimeModel.scenarios.map((scenario) => ({
      id: scenario.id,
      active: scenario.active ?? false,
      severity: scenario.severity ?? null,
    })),
    kpis: runtimeModel.kpis.map((kpi) => ({
      id: kpi.id,
      value: kpi.value ?? 0,
      trend: kpi.trend ?? "stable",
    })),
    tags: Array.isArray(runtimeModel.tags) ? [...runtimeModel.tags] : [],
  };
}

const EXAMPLE_BUSINESS_RUNTIME = integrateDomainProjectIntoRuntime({
  project: {
    projectId: "business_demo",
    domainId: "business",
    objects: [
      { id: "supplier", label: "Supplier", coreRole: "source", tags: ["upstream"] },
      { id: "inventory", label: "Inventory", coreRole: "buffer", tags: ["capacity"] },
    ],
    relations: [
      { id: "r1", from: "supplier", to: "inventory", relationType: "flows_to" },
    ],
    loops: [
      { id: "l1", label: "Business Pressure", loopType: "pressure", nodes: ["supplier", "inventory"] },
    ],
    scenarioHints: [
      { id: "supplier_delay", label: "Supplier Delay", severityHint: "high" },
    ],
    kpiHints: [
      { id: "delivery_reliability", label: "Delivery Reliability" },
    ],
    inferredTags: ["business", "demo"],
  },
  mode: "manager",
});

const EXAMPLE_FINANCE_RUNTIME = integrateDomainProjectIntoRuntime({
  project: {
    projectId: "finance_demo",
    domainId: "finance",
    objects: [
      { id: "portfolio", label: "Portfolio", coreRole: "node", tags: ["assets"] },
      { id: "liquidity", label: "Liquidity", coreRole: "flow", tags: ["funding"] },
    ],
    relations: [
      { id: "r1", from: "portfolio", to: "liquidity", relationType: "transfers_risk" },
    ],
    loops: [
      { id: "l1", label: "Liquidity Constraint", loopType: "constraint", nodes: ["portfolio", "liquidity"] },
    ],
    scenarioHints: [
      { id: "liquidity_stress", label: "Liquidity Stress", severityHint: "critical" },
    ],
    kpiHints: [
      { id: "liquidity_health", label: "Liquidity Health" },
    ],
    inferredTags: ["finance", "demo"],
  },
  mode: "analyst",
});

const EXAMPLE_DEVOPS_RUNTIME = integrateDomainProjectIntoRuntime({
  project: {
    projectId: "devops_demo",
    domainId: "devops",
    objects: [
      { id: "service", label: "Service", coreRole: "node", tags: ["runtime"] },
      { id: "database", label: "Database", coreRole: "dependency", tags: ["storage"] },
    ],
    relations: [
      { id: "r1", from: "service", to: "database", relationType: "depends_on" },
    ],
    loops: [
      { id: "l1", label: "Latency Pressure", loopType: "pressure", nodes: ["service", "database"] },
    ],
    scenarioHints: [
      { id: "service_dependency_failure", label: "Service Dependency Failure", severityHint: "critical" },
    ],
    kpiHints: [
      { id: "service_uptime", label: "Service Uptime" },
    ],
    inferredTags: ["devops", "demo"],
  },
  mode: "analyst",
});

const EXAMPLE_STRATEGY_RUNTIME = integrateDomainProjectIntoRuntime({
  project: {
    projectId: "strategy_demo",
    domainId: "strategy",
    objects: [
      { id: "competitor", label: "Competitor", coreRole: "actor", tags: ["competition"] },
      { id: "market_share", label: "Market Share", coreRole: "outcome", tags: ["position"] },
    ],
    relations: [
      { id: "r1", from: "competitor", to: "market_share", relationType: "competes_with" },
    ],
    loops: [
      { id: "l1", label: "Strategic Response", loopType: "strategic_response", nodes: ["competitor", "market_share"] },
    ],
    scenarioHints: [
      { id: "competitor_pricing_pressure", label: "Competitor Pricing Pressure", severityHint: "high" },
    ],
    kpiHints: [
      { id: "strategic_position", label: "Strategic Position" },
    ],
    inferredTags: ["strategy", "demo"],
  },
  mode: "manager",
});

export const EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS: Record<string, NexoraDomainRuntimeIntegrationResult> = {
  business: EXAMPLE_BUSINESS_RUNTIME,
  finance: EXAMPLE_FINANCE_RUNTIME,
  devops: EXAMPLE_DEVOPS_RUNTIME,
  strategy: EXAMPLE_STRATEGY_RUNTIME,
};
