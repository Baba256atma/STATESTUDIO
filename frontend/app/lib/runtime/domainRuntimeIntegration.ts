export interface NexoraRuntimeObjectState {
  id: string;
  label?: string;
  coreRole?: string | null;
  domainId?: string | null;
  activityLevel?: number;
  riskLevel?: number;
  stabilityLevel?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
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
  metadata?: Record<string, unknown>;
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
  metadata?: Record<string, unknown>;
}

export interface NexoraDomainRuntimeIntegrationResult {
  runtimeModel: NexoraDomainRuntimeModel;
  runtimeContext: NexoraDomainRuntimeContext;
  cockpitHints?: Record<string, unknown>;
  adviceHints?: Record<string, unknown>;
  notes?: string[];
}

type ProjectObjectLike = {
  id: string;
  label?: string;
  coreRole?: string | null;
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

type ProjectRelationLike = {
  id: string;
  from: string;
  to: string;
  relationType?: string | null;
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

type ProjectLoopLike = {
  id: string;
  label?: string;
  loopType?: string | null;
  nodes?: string[];
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
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

function normalizeMetadata(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : {};
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeProject(input: unknown): ProjectLike {
  const record = readRecord(input);
  return {
    projectId: String(record.projectId ?? "").trim(),
    domainId:
      record.domainId === null || record.domainId === undefined
        ? null
        : String(record.domainId).trim(),
    label: typeof record.label === "string" ? record.label.trim() : undefined,
    objects: Array.isArray(record.objects)
      ? record.objects.map((item) => {
          const entry = readRecord(item);
          return {
            id: String(entry.id ?? "").trim(),
            label: typeof entry.label === "string" ? entry.label.trim() : undefined,
            coreRole:
              entry.coreRole === null || entry.coreRole === undefined ? null : String(entry.coreRole).trim(),
            domainId:
              entry.domainId === null || entry.domainId === undefined ? null : String(entry.domainId).trim(),
            tags: Array.isArray(entry.tags) ? uniq(entry.tags.map((value: unknown) => String(value))) : [],
            metadata: normalizeMetadata(entry.metadata),
          };
        })
      : [],
    relations: Array.isArray(record.relations)
      ? record.relations.map((item) => {
          const entry = readRecord(item);
          return {
            id: String(entry.id ?? "").trim(),
            from: String(entry.from ?? "").trim(),
            to: String(entry.to ?? "").trim(),
            relationType:
              entry.relationType === null || entry.relationType === undefined
                ? null
                : String(entry.relationType).trim(),
            domainId:
              entry.domainId === null || entry.domainId === undefined ? null : String(entry.domainId).trim(),
            tags: Array.isArray(entry.tags) ? uniq(entry.tags.map((value: unknown) => String(value))) : [],
            metadata: normalizeMetadata(entry.metadata),
          };
        })
      : [],
    loops: Array.isArray(record.loops)
      ? record.loops.map((item) => {
          const entry = readRecord(item);
          return {
            id: String(entry.id ?? "").trim(),
            label: typeof entry.label === "string" ? entry.label.trim() : undefined,
            loopType:
              entry.loopType === null || entry.loopType === undefined ? null : String(entry.loopType).trim(),
            nodes: Array.isArray(entry.nodes) ? uniq(entry.nodes.map((value: unknown) => String(value))) : [],
            domainId:
              entry.domainId === null || entry.domainId === undefined ? null : String(entry.domainId).trim(),
            tags: Array.isArray(entry.tags) ? uniq(entry.tags.map((value: unknown) => String(value))) : [],
            metadata: normalizeMetadata(entry.metadata),
          };
        })
      : [],
    scenarioHints: Array.isArray(record.scenarioHints)
      ? record.scenarioHints.map((item) => {
          const entry = readRecord(item);
          return {
            id: String(entry.id ?? "").trim(),
            label: typeof entry.label === "string" ? entry.label.trim() : undefined,
            severityHint: entry.severityHint as ProjectScenarioLike["severityHint"],
            domainId:
              entry.domainId === null || entry.domainId === undefined ? null : String(entry.domainId).trim(),
            tags: Array.isArray(entry.tags) ? uniq(entry.tags.map((value: unknown) => String(value))) : [],
          };
        })
      : [],
    kpiHints: Array.isArray(record.kpiHints)
      ? record.kpiHints.map((item) => {
          const entry = readRecord(item);
          return {
            id: String(entry.id ?? "").trim(),
            label: typeof entry.label === "string" ? entry.label.trim() : undefined,
            domainId:
              entry.domainId === null || entry.domainId === undefined ? null : String(entry.domainId).trim(),
            tags: Array.isArray(entry.tags) ? uniq(entry.tags.map((value: unknown) => String(value))) : [],
          };
        })
      : [],
    inferredTags: Array.isArray(record.inferredTags)
      ? uniq(record.inferredTags.map((value: unknown) => String(value)))
      : [],
  };
}

export function buildRuntimeObjectsFromProject(
  project: unknown
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
  project: unknown
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
  project: unknown
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
  project: unknown
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
  project: unknown
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
  project: unknown;
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
): Record<string, unknown> {
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
