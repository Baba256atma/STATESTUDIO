export type NexoraDomainProjectId = string;

export interface NexoraDomainProjectObject {
  id: string;
  label: string;
  coreRole?: string | null;
  domainId?: string | null;
  tags?: string[];
  sourceType?: string;
  metadata?: Record<string, any>;
}

export interface NexoraDomainProjectRelation {
  id: string;
  from: string;
  to: string;
  relationType?: string | null;
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NexoraDomainProjectLoop {
  id: string;
  label?: string;
  loopType?: string | null;
  nodes?: string[];
  domainId?: string | null;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NexoraDomainProjectKpiHint {
  id: string;
  label: string;
  domainId?: string | null;
  relatedScenarioIds?: string[];
  relatedObjectRoles?: string[];
  tags?: string[];
}

export interface NexoraDomainProjectScenarioHint {
  id: string;
  label: string;
  domainId?: string | null;
  relatedKpiIds?: string[];
  severityHint?: "low" | "moderate" | "high" | "critical";
  tags?: string[];
}

export interface NexoraDomainProjectPanelSetup {
  panelIds: string[];
  slots?: Record<string, string>;
  notes?: string[];
}

export interface NexoraDomainProjectCockpitSetup {
  layoutMode?: "compact" | "standard" | "expanded";
  panelIds?: string[];
  summaryBlockIds?: string[];
  notes?: string[];
}

export interface NexoraDomainProjectAssemblyResult {
  projectId: NexoraDomainProjectId;
  domainId?: string | null;
  label: string;
  description?: string;
  objects: NexoraDomainProjectObject[];
  relations: NexoraDomainProjectRelation[];
  loops: NexoraDomainProjectLoop[];
  scenarioHints: NexoraDomainProjectScenarioHint[];
  kpiHints: NexoraDomainProjectKpiHint[];
  panelSetup?: NexoraDomainProjectPanelSetup;
  cockpitSetup?: NexoraDomainProjectCockpitSetup;
  inferredTags?: string[];
  notes?: string[];
}

export interface NexoraDomainProjectAssemblyInput {
  projectId?: string;
  label?: string;
  description?: string;
  domainId?: string | null;
  mode?: string | null;
  domainPack?: any | null;
  panelRegistry?: Record<string, any>;
  scenarioKpiMapping?: any | null;
  adviceConfig?: any | null;
  scannerInterpretation?: any | null;
  cockpitComposition?: any | null;
  objects?: NexoraDomainProjectObject[];
  relations?: NexoraDomainProjectRelation[];
  loops?: NexoraDomainProjectLoop[];
  scenarioHints?: NexoraDomainProjectScenarioHint[];
  kpiHints?: NexoraDomainProjectKpiHint[];
  tags?: string[];
}

type ScenarioKpiMappingLike = {
  domainId?: string;
  scenarios?: Array<{
    id: string;
    label?: string;
    relatedObjectRoles?: string[];
    tags?: string[];
    severityHint?: "low" | "moderate" | "high" | "critical";
  }>;
  kpis?: Array<{
    id: string;
    label?: string;
    relatedObjectRoles?: string[];
    tags?: string[];
  }>;
  links?: Array<{
    scenarioId: string;
    kpiId: string;
  }>;
};

type ScannerInterpretationLike = {
  domainId?: string | null;
  entityMappings?: Array<{
    entityId: string;
    mappedCoreRole?: string | null;
    domainId?: string | null;
    score?: number;
    source?: string;
    notes?: string[];
  }>;
  relationMappings?: Array<{
    relationId: string;
    mappedRelationType?: string | null;
    domainId?: string | null;
    score?: number;
    source?: string;
    notes?: string[];
  }>;
  loopMappings?: Array<{
    loopId: string;
    mappedLoopType?: string | null;
    domainId?: string | null;
    score?: number;
    source?: string;
    notes?: string[];
  }>;
  inferredTags?: string[];
};

type CockpitCompositionLike = {
  layoutMode?: "compact" | "standard" | "expanded";
  panels?: Array<{ panelId?: string | null }>;
  summaryBlocks?: Array<{ id?: string | null }>;
  notes?: string[];
};

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function normalizeMetadata(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, any>) } : {};
}

function normalizeScenarioKpiMapping(input?: any | null): ScenarioKpiMappingLike | null {
  if (!input || typeof input !== "object") return null;
  return {
    domainId: typeof input.domainId === "string" ? input.domainId.trim() : undefined,
    scenarios: Array.isArray(input.scenarios)
      ? input.scenarios.map((scenario: any) => ({
          id: String(scenario.id ?? "").trim(),
          label: String(scenario.label ?? scenario.id ?? "").trim(),
          relatedObjectRoles: Array.isArray(scenario.relatedObjectRoles)
            ? uniq(scenario.relatedObjectRoles.map((value: unknown) => String(value)))
            : [],
          tags: Array.isArray(scenario.tags) ? uniq(scenario.tags.map((value: unknown) => String(value))) : [],
          severityHint: scenario.severityHint,
        }))
      : [],
    kpis: Array.isArray(input.kpis)
      ? input.kpis.map((kpi: any) => ({
          id: String(kpi.id ?? "").trim(),
          label: String(kpi.label ?? kpi.id ?? "").trim(),
          relatedObjectRoles: Array.isArray(kpi.relatedObjectRoles)
            ? uniq(kpi.relatedObjectRoles.map((value: unknown) => String(value)))
            : [],
          tags: Array.isArray(kpi.tags) ? uniq(kpi.tags.map((value: unknown) => String(value))) : [],
        }))
      : [],
    links: Array.isArray(input.links)
      ? input.links.map((link: any) => ({
          scenarioId: String(link.scenarioId ?? "").trim(),
          kpiId: String(link.kpiId ?? "").trim(),
        }))
      : [],
  };
}

function normalizeScannerInterpretation(input?: any | null): ScannerInterpretationLike | null {
  if (!input || typeof input !== "object") return null;
  return {
    domainId: typeof input.domainId === "string" ? input.domainId.trim() : input.domainId ?? null,
    entityMappings: Array.isArray(input.entityMappings)
      ? input.entityMappings.map((mapping: any) => ({
          entityId: String(mapping.entityId ?? "").trim(),
          mappedCoreRole:
            mapping.mappedCoreRole === null || mapping.mappedCoreRole === undefined
              ? null
              : String(mapping.mappedCoreRole).trim(),
          domainId:
            mapping.domainId === null || mapping.domainId === undefined
              ? null
              : String(mapping.domainId).trim(),
          score: Number.isFinite(Number(mapping.score)) ? Number(mapping.score) : 0,
          source: typeof mapping.source === "string" ? mapping.source.trim() : undefined,
          notes: Array.isArray(mapping.notes)
            ? uniq(mapping.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    relationMappings: Array.isArray(input.relationMappings)
      ? input.relationMappings.map((mapping: any) => ({
          relationId: String(mapping.relationId ?? "").trim(),
          mappedRelationType:
            mapping.mappedRelationType === null || mapping.mappedRelationType === undefined
              ? null
              : String(mapping.mappedRelationType).trim(),
          domainId:
            mapping.domainId === null || mapping.domainId === undefined
              ? null
              : String(mapping.domainId).trim(),
          score: Number.isFinite(Number(mapping.score)) ? Number(mapping.score) : 0,
          source: typeof mapping.source === "string" ? mapping.source.trim() : undefined,
          notes: Array.isArray(mapping.notes)
            ? uniq(mapping.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    loopMappings: Array.isArray(input.loopMappings)
      ? input.loopMappings.map((mapping: any) => ({
          loopId: String(mapping.loopId ?? "").trim(),
          mappedLoopType:
            mapping.mappedLoopType === null || mapping.mappedLoopType === undefined
              ? null
              : String(mapping.mappedLoopType).trim(),
          domainId:
            mapping.domainId === null || mapping.domainId === undefined
              ? null
              : String(mapping.domainId).trim(),
          score: Number.isFinite(Number(mapping.score)) ? Number(mapping.score) : 0,
          source: typeof mapping.source === "string" ? mapping.source.trim() : undefined,
          notes: Array.isArray(mapping.notes)
            ? uniq(mapping.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    inferredTags: Array.isArray(input.inferredTags)
      ? uniq(input.inferredTags.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeCockpitComposition(input?: any | null): CockpitCompositionLike | null {
  if (!input || typeof input !== "object") return null;
  return {
    layoutMode: input.layoutMode,
    panels: Array.isArray(input.panels)
      ? input.panels.map((panel: any) => ({
          panelId:
            panel.panelId === null || panel.panelId === undefined ? null : String(panel.panelId).trim(),
        }))
      : [],
    summaryBlocks: Array.isArray(input.summaryBlocks)
      ? input.summaryBlocks.map((block: any) => ({
          id: block.id === null || block.id === undefined ? null : String(block.id).trim(),
        }))
      : [],
    notes: Array.isArray(input.notes) ? uniq(input.notes.map((value: unknown) => String(value))) : [],
  };
}

export function normalizeDomainProjectObject(
  input: Partial<NexoraDomainProjectObject> & { id: string; label?: string }
): NexoraDomainProjectObject {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  return {
    id,
    label,
    ...(input.coreRole === undefined ? {} : { coreRole: input.coreRole === null ? null : String(input.coreRole).trim() }),
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    ...(typeof input.sourceType === "string" && input.sourceType.trim() ? { sourceType: input.sourceType.trim() } : {}),
    metadata: normalizeMetadata(input.metadata),
  };
}

export function normalizeDomainProjectRelation(
  input: Partial<NexoraDomainProjectRelation> & { id: string; from: string; to: string }
): NexoraDomainProjectRelation {
  return {
    id: String(input.id).trim(),
    from: String(input.from).trim(),
    to: String(input.to).trim(),
    ...(input.relationType === undefined
      ? {}
      : { relationType: input.relationType === null ? null : String(input.relationType).trim() }),
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    metadata: normalizeMetadata(input.metadata),
  };
}

export function normalizeDomainProjectLoop(
  input: Partial<NexoraDomainProjectLoop> & { id: string }
): NexoraDomainProjectLoop {
  const id = String(input.id).trim();
  return {
    id,
    ...(typeof input.label === "string" && input.label.trim() ? { label: input.label.trim() } : { label: id }),
    ...(input.loopType === undefined ? {} : { loopType: input.loopType === null ? null : String(input.loopType).trim() }),
    nodes: Array.isArray(input.nodes) ? uniq(input.nodes.map((value) => String(value))) : [],
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
    metadata: normalizeMetadata(input.metadata),
  };
}

export function normalizeDomainProjectKpiHint(
  input: Partial<NexoraDomainProjectKpiHint> & { id: string; label?: string }
): NexoraDomainProjectKpiHint {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  return {
    id,
    label,
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    relatedScenarioIds: Array.isArray(input.relatedScenarioIds)
      ? uniq(input.relatedScenarioIds.map((value) => String(value)))
      : [],
    relatedObjectRoles: Array.isArray(input.relatedObjectRoles)
      ? uniq(input.relatedObjectRoles.map((value) => String(value)))
      : [],
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
  };
}

export function normalizeDomainProjectScenarioHint(
  input: Partial<NexoraDomainProjectScenarioHint> & { id: string; label?: string }
): NexoraDomainProjectScenarioHint {
  const id = String(input.id).trim();
  const label = String(input.label ?? id).trim() || id;
  return {
    id,
    label,
    ...(input.domainId === undefined ? {} : { domainId: input.domainId === null ? null : String(input.domainId).trim() }),
    relatedKpiIds: Array.isArray(input.relatedKpiIds)
      ? uniq(input.relatedKpiIds.map((value) => String(value)))
      : [],
    ...(input.severityHint ? { severityHint: input.severityHint } : {}),
    tags: Array.isArray(input.tags) ? uniq(input.tags.map((value) => String(value))) : [],
  };
}

export function buildProjectKpiHints(
  scenarioKpiMapping?: any | null,
  domainId?: string | null
): NexoraDomainProjectKpiHint[] {
  const mapping = normalizeScenarioKpiMapping(scenarioKpiMapping);
  if (!mapping) return [];

  return (mapping.kpis ?? []).map((kpi) => ({
    id: kpi.id,
    label: kpi.label || kpi.id,
    domainId: domainId ?? mapping.domainId ?? null,
    relatedScenarioIds: uniq(
      (mapping.links ?? [])
        .filter((link) => link.kpiId === kpi.id)
        .map((link) => link.scenarioId)
    ),
    relatedObjectRoles: Array.isArray(kpi.relatedObjectRoles) ? [...kpi.relatedObjectRoles] : [],
    tags: Array.isArray(kpi.tags) ? [...kpi.tags] : [],
  }));
}

export function buildProjectScenarioHints(
  scenarioKpiMapping?: any | null,
  domainId?: string | null
): NexoraDomainProjectScenarioHint[] {
  const mapping = normalizeScenarioKpiMapping(scenarioKpiMapping);
  if (!mapping) return [];

  return (mapping.scenarios ?? []).map((scenario) => ({
    id: scenario.id,
    label: scenario.label || scenario.id,
    domainId: domainId ?? mapping.domainId ?? null,
    relatedKpiIds: uniq(
      (mapping.links ?? [])
        .filter((link) => link.scenarioId === scenario.id)
        .map((link) => link.kpiId)
    ),
    ...(scenario.severityHint ? { severityHint: scenario.severityHint } : {}),
    tags: Array.isArray(scenario.tags) ? [...scenario.tags] : [],
  }));
}

export function buildProjectPanelSetup(args: {
  domainId?: string | null;
  panelRegistry?: Record<string, any>;
}): NexoraDomainProjectPanelSetup {
  const domainId = String(args.domainId ?? "").trim();
  const panels = Object.values(args.panelRegistry ?? {})
    .map((panel: any) => ({
      id: String(panel?.id ?? "").trim(),
      domainId: String(panel?.domainId ?? "").trim(),
      slot: typeof panel?.slot === "string" ? panel.slot.trim() : "",
      priority: Number.isFinite(Number(panel?.priority)) ? Number(panel.priority) : 100,
    }))
    .filter((panel) => panel.id && (!domainId || panel.domainId === domainId))
    .sort((a, b) => (a.priority !== b.priority ? a.priority - b.priority : a.id.localeCompare(b.id)));

  const panelIds = panels.map((panel) => panel.id);
  const slots = panels.reduce<Record<string, string>>((acc, panel) => {
    if (panel.slot) acc[panel.id] = panel.slot;
    return acc;
  }, {});

  return {
    panelIds,
    slots,
    notes: panelIds.length > 0 ? [`Resolved ${panelIds.length} panel(s).`] : ["No domain panels resolved."],
  };
}

export function buildProjectCockpitSetup(
  cockpitComposition?: any | null
): NexoraDomainProjectCockpitSetup {
  const composition = normalizeCockpitComposition(cockpitComposition);
  if (!composition) {
    return {
      panelIds: [],
      summaryBlockIds: [],
      notes: ["No cockpit composition was provided."],
    };
  }

  return {
    ...(composition.layoutMode ? { layoutMode: composition.layoutMode } : {}),
    panelIds: uniq((composition.panels ?? []).map((panel) => String(panel.panelId ?? "")).filter(Boolean)),
    summaryBlockIds: uniq((composition.summaryBlocks ?? []).map((block) => String(block.id ?? "")).filter(Boolean)),
    notes: Array.isArray(composition.notes) ? [...composition.notes] : [],
  };
}

export function inferProjectTags(args: {
  domainId?: string | null;
  objects?: NexoraDomainProjectObject[];
  relations?: NexoraDomainProjectRelation[];
  loops?: NexoraDomainProjectLoop[];
  scannerInterpretation?: any | null;
  tags?: string[];
}): string[] {
  const tags: string[] = [];
  if (args.domainId) tags.push(String(args.domainId));
  tags.push(...(args.tags ?? []));

  for (const object of args.objects ?? []) {
    tags.push(...(object.tags ?? []));
    if (object.coreRole) tags.push(object.coreRole);
  }

  for (const relation of args.relations ?? []) {
    tags.push(...(relation.tags ?? []));
    if (relation.relationType) tags.push(relation.relationType);
  }

  for (const loop of args.loops ?? []) {
    tags.push(...(loop.tags ?? []));
    if (loop.loopType) tags.push(loop.loopType);
  }

  const scanner = normalizeScannerInterpretation(args.scannerInterpretation);
  tags.push(...(scanner?.inferredTags ?? []));

  return uniq(tags);
}

export function buildProjectObjectsFromScannerInterpretation(
  scannerInterpretation?: any | null,
  domainId?: string | null
): NexoraDomainProjectObject[] {
  const interpretation = normalizeScannerInterpretation(scannerInterpretation);
  if (!interpretation) return [];

  return (interpretation.entityMappings ?? []).map((mapping) =>
    normalizeDomainProjectObject({
      id: mapping.entityId,
      label: mapping.entityId,
      coreRole: mapping.mappedCoreRole ?? null,
      domainId: domainId ?? mapping.domainId ?? interpretation.domainId ?? null,
      tags: uniq([mapping.source ?? "", ...(mapping.notes ?? [])]),
      sourceType: "scanner",
      metadata: {
        score: mapping.score ?? 0,
        source: mapping.source ?? "fallback",
      },
    })
  );
}

export function buildProjectRelationsFromScannerInterpretation(
  scannerInterpretation?: any | null,
  domainId?: string | null
): NexoraDomainProjectRelation[] {
  const interpretation = normalizeScannerInterpretation(scannerInterpretation);
  if (!interpretation) return [];

  return (interpretation.relationMappings ?? []).map((mapping) =>
    normalizeDomainProjectRelation({
      id: mapping.relationId,
      from: `${mapping.relationId}_from`,
      to: `${mapping.relationId}_to`,
      relationType: mapping.mappedRelationType ?? null,
      domainId: domainId ?? mapping.domainId ?? interpretation.domainId ?? null,
      tags: uniq([mapping.source ?? "", ...(mapping.notes ?? [])]),
      metadata: {
        score: mapping.score ?? 0,
        source: mapping.source ?? "fallback",
      },
    })
  );
}

export function buildProjectLoopsFromScannerInterpretation(
  scannerInterpretation?: any | null,
  domainId?: string | null
): NexoraDomainProjectLoop[] {
  const interpretation = normalizeScannerInterpretation(scannerInterpretation);
  if (!interpretation) return [];

  return (interpretation.loopMappings ?? []).map((mapping) =>
    normalizeDomainProjectLoop({
      id: mapping.loopId,
      label: mapping.loopId,
      loopType: mapping.mappedLoopType ?? null,
      domainId: domainId ?? mapping.domainId ?? interpretation.domainId ?? null,
      nodes: [],
      tags: uniq([mapping.source ?? "", ...(mapping.notes ?? [])]),
      metadata: {
        score: mapping.score ?? 0,
        source: mapping.source ?? "fallback",
      },
    })
  );
}

export function buildDefaultProjectLabel(
  domainId?: string | null,
  projectId?: string | null
): string {
  const normalizedDomainId = String(domainId ?? "").trim();
  if (normalizedDomainId) {
    return `${normalizedDomainId.charAt(0).toUpperCase()}${normalizedDomainId.slice(1)} Project`;
  }

  const normalizedProjectId = String(projectId ?? "").trim();
  if (normalizedProjectId) return normalizedProjectId;

  return "Nexora Project";
}

export function assembleDomainProject(
  input: NexoraDomainProjectAssemblyInput
): NexoraDomainProjectAssemblyResult {
  const projectId = String(input.projectId ?? "").trim() || `project_${String(input.domainId ?? "nexora").trim() || "nexora"}`;
  const domainId = input.domainId ?? null;
  const label = String(input.label ?? "").trim() || buildDefaultProjectLabel(domainId, projectId);

  const providedObjects = Array.isArray(input.objects)
    ? input.objects.map((object) => normalizeDomainProjectObject(object))
    : [];
  const providedRelations = Array.isArray(input.relations)
    ? input.relations.map((relation) => normalizeDomainProjectRelation(relation))
    : [];
  const providedLoops = Array.isArray(input.loops)
    ? input.loops.map((loop) => normalizeDomainProjectLoop(loop))
    : [];

  const objects =
    providedObjects.length > 0
      ? providedObjects
      : buildProjectObjectsFromScannerInterpretation(input.scannerInterpretation, domainId);
  const relations =
    providedRelations.length > 0
      ? providedRelations
      : buildProjectRelationsFromScannerInterpretation(input.scannerInterpretation, domainId);
  const loops =
    providedLoops.length > 0
      ? providedLoops
      : buildProjectLoopsFromScannerInterpretation(input.scannerInterpretation, domainId);

  const scenarioHints = uniq([
    ...buildProjectScenarioHints(input.scenarioKpiMapping, domainId).map((hint) => hint.id),
    ...(Array.isArray(input.scenarioHints) ? input.scenarioHints.map((hint) => String(hint.id ?? "").trim()) : []),
  ]).map((id) => {
    const provided = (input.scenarioHints ?? []).find((hint) => String(hint.id ?? "").trim() === id);
    const mapped = buildProjectScenarioHints(input.scenarioKpiMapping, domainId).find((hint) => hint.id === id);
    return normalizeDomainProjectScenarioHint({
      ...(mapped ?? { id, label: id }),
      ...(provided ?? {}),
    });
  });
  const kpiHints = uniq([
    ...buildProjectKpiHints(input.scenarioKpiMapping, domainId).map((hint) => hint.id),
    ...(Array.isArray(input.kpiHints) ? input.kpiHints.map((hint) => String(hint.id ?? "").trim()) : []),
  ]).map((id) => {
    const provided = (input.kpiHints ?? []).find((hint) => String(hint.id ?? "").trim() === id);
    const mapped = buildProjectKpiHints(input.scenarioKpiMapping, domainId).find((hint) => hint.id === id);
    return normalizeDomainProjectKpiHint({
      ...(mapped ?? { id, label: id }),
      ...(provided ?? {}),
    });
  });
  const panelSetup = buildProjectPanelSetup({
    domainId,
    panelRegistry: input.panelRegistry,
  });
  const cockpitSetup = buildProjectCockpitSetup(input.cockpitComposition);
  const inferredTags = inferProjectTags({
    domainId,
    objects,
    relations,
    loops,
    scannerInterpretation: input.scannerInterpretation,
    tags: input.tags ?? [],
  });

  const notes: string[] = [];
  if (providedObjects.length === 0 && objects.length > 0) notes.push("Objects were assembled from scanner interpretation.");
  if (providedRelations.length === 0 && relations.length > 0) notes.push("Relations were assembled from scanner interpretation.");
  if (providedLoops.length === 0 && loops.length > 0) notes.push("Loops were assembled from scanner interpretation.");
  if (input.mode) notes.push(`Mode: ${input.mode}`);

  return {
    projectId,
    domainId,
    label,
    ...(typeof input.description === "string" && input.description.trim()
      ? { description: input.description.trim() }
      : {}),
    objects,
    relations,
    loops,
    scenarioHints,
    kpiHints,
    panelSetup,
    cockpitSetup,
    inferredTags,
    notes,
  };
}

const EXAMPLE_BUSINESS_PROJECT = assembleDomainProject({
  projectId: "business_demo",
  domainId: "business",
  label: "Business Demo Project",
  objects: [
    { id: "supplier", label: "Supplier", coreRole: "source", tags: ["upstream"] },
    { id: "inventory", label: "Inventory", coreRole: "buffer", tags: ["capacity"] },
    { id: "customer", label: "Customer", coreRole: "outcome", tags: ["trust"] },
  ],
  relations: [
    { id: "r_supplier_inventory", from: "supplier", to: "inventory", relationType: "flows_to" },
    { id: "r_inventory_customer", from: "inventory", to: "customer", relationType: "signals" },
  ],
  loops: [
    { id: "l_business_pressure", label: "Business Pressure", loopType: "pressure", nodes: ["supplier", "inventory", "customer"] },
  ],
  scenarioKpiMapping: {
    domainId: "business",
    scenarios: [
      { id: "supplier_delay", label: "Supplier Delay", severityHint: "high", tags: ["supplier"] },
      { id: "capacity_bottleneck", label: "Capacity Bottleneck", severityHint: "high", tags: ["operations"] },
      { id: "cash_pressure", label: "Cash Pressure", severityHint: "high", tags: ["cash"] },
    ],
    kpis: [
      { id: "delivery_reliability", label: "Delivery Reliability", relatedObjectRoles: ["flow", "outcome"], tags: ["service"] },
      { id: "operating_stability", label: "Operating Stability", relatedObjectRoles: ["flow", "buffer"], tags: ["continuity"] },
      { id: "customer_trust", label: "Customer Trust", relatedObjectRoles: ["outcome"], tags: ["customer"] },
    ],
    links: [
      { scenarioId: "supplier_delay", kpiId: "delivery_reliability" },
      { scenarioId: "capacity_bottleneck", kpiId: "operating_stability" },
      { scenarioId: "cash_pressure", kpiId: "customer_trust" },
    ],
  },
  panelRegistry: {
    business_overview_panel: { id: "business_overview_panel", domainId: "business", slot: "right", priority: 10 },
    business_risk_panel: { id: "business_risk_panel", domainId: "business", slot: "right", priority: 20 },
    business_operations_panel: { id: "business_operations_panel", domainId: "business", slot: "right", priority: 30 },
    business_kpi_panel: { id: "business_kpi_panel", domainId: "business", slot: "right", priority: 40 },
    business_advice_panel: { id: "business_advice_panel", domainId: "business", slot: "right", priority: 50 },
  },
  cockpitComposition: {
    layoutMode: "expanded",
    panels: [
      { panelId: "business_overview_panel" },
      { panelId: "business_risk_panel" },
      { panelId: "business_operations_panel" },
      { panelId: "business_kpi_panel" },
      { panelId: "business_advice_panel" },
    ],
    summaryBlocks: [{ id: "overview" }, { id: "fragility" }, { id: "operations" }, { id: "kpis" }, { id: "action" }],
  },
  tags: ["demo"],
});

const EXAMPLE_FINANCE_PROJECT = assembleDomainProject({
  projectId: "finance_demo",
  domainId: "finance",
  label: "Finance Demo Project",
  objects: [
    { id: "market_demand", label: "Market Demand", coreRole: "support", tags: ["flow"] },
    { id: "asset_price", label: "Asset Price", coreRole: "flow", tags: ["market"] },
    { id: "liquidity", label: "Liquidity", coreRole: "flow", tags: ["funding"] },
    { id: "portfolio_exposure", label: "Portfolio Exposure", coreRole: "node", tags: ["assets"] },
    { id: "leverage", label: "Leverage", coreRole: "constraint", tags: ["amplification"] },
    { id: "credit_pressure", label: "Credit Pressure", coreRole: "risk", tags: ["funding"] },
    { id: "capital_stability", label: "Capital Stability", coreRole: "outcome", tags: ["resilience"] },
  ],
  relations: [
    { id: "r_market_price", from: "market_demand", to: "asset_price", relationType: "signals" },
    { id: "r_liquidity_price", from: "liquidity", to: "asset_price", relationType: "flows_to" },
    { id: "r_price_exposure", from: "asset_price", to: "portfolio_exposure", relationType: "transfers_risk" },
    { id: "r_exposure_leverage", from: "portfolio_exposure", to: "leverage", relationType: "depends_on" },
    { id: "r_credit_liquidity", from: "credit_pressure", to: "liquidity", relationType: "causes" },
    { id: "r_leverage_capital", from: "leverage", to: "capital_stability", relationType: "transfers_risk" },
  ],
  loops: [
    { id: "l_finance_cascade", label: "Financial Fragility", loopType: "risk_cascade", nodes: ["liquidity", "asset_price", "portfolio_exposure", "capital_stability"] },
  ],
  scenarioKpiMapping: {
    domainId: "finance",
    scenarios: [
      { id: "liquidity_stress", label: "Liquidity Stress", severityHint: "critical", tags: ["liquidity"] },
      { id: "volatility_spike", label: "Volatility Spike", severityHint: "high", tags: ["volatility"] },
      { id: "market_selloff", label: "Market Selloff", severityHint: "critical", tags: ["selloff"] },
    ],
    kpis: [
      { id: "liquidity_health", label: "Liquidity Health", relatedObjectRoles: ["flow", "buffer"], tags: ["cash"] },
      { id: "market_stability", label: "Market Stability", relatedObjectRoles: ["flow", "outcome"], tags: ["market"] },
      { id: "capital_stability", label: "Capital Stability", relatedObjectRoles: ["outcome"], tags: ["resilience"] },
    ],
    links: [
      { scenarioId: "liquidity_stress", kpiId: "liquidity_health" },
      { scenarioId: "volatility_spike", kpiId: "market_stability" },
      { scenarioId: "market_selloff", kpiId: "capital_stability" },
    ],
  },
  panelRegistry: {
    finance_overview_panel: { id: "finance_overview_panel", domainId: "finance", slot: "right", priority: 10 },
    portfolio_risk_panel: { id: "portfolio_risk_panel", domainId: "finance", slot: "right", priority: 20 },
    liquidity_panel: { id: "liquidity_panel", domainId: "finance", slot: "right", priority: 30 },
    volatility_panel: { id: "volatility_panel", domainId: "finance", slot: "right", priority: 40 },
    financial_advice_panel: { id: "financial_advice_panel", domainId: "finance", slot: "right", priority: 50 },
  },
  cockpitComposition: {
    layoutMode: "expanded",
    panels: [
      { panelId: "finance_overview_panel" },
      { panelId: "portfolio_risk_panel" },
      { panelId: "liquidity_panel" },
      { panelId: "volatility_panel" },
      { panelId: "financial_advice_panel" },
    ],
    summaryBlocks: [{ id: "overview" }, { id: "exposure" }, { id: "liquidity" }, { id: "fragility" }, { id: "action" }],
  },
  tags: ["demo"],
});

const EXAMPLE_DEVOPS_PROJECT = assembleDomainProject({
  projectId: "devops_demo",
  domainId: "devops",
  label: "DevOps Demo Project",
  objects: [
    { id: "api_gateway", label: "API Gateway", coreRole: "flow", tags: ["edge"] },
    { id: "auth_service", label: "Auth Service", coreRole: "node", tags: ["runtime"] },
    { id: "database", label: "Database", coreRole: "dependency", tags: ["storage"] },
    { id: "queue", label: "Queue", coreRole: "buffer", tags: ["latency"] },
    { id: "worker", label: "Worker Pool", coreRole: "node", tags: ["throughput"] },
  ],
  relations: [
    { id: "r_api_auth", from: "api_gateway", to: "auth_service", relationType: "depends_on" },
    { id: "r_auth_database", from: "auth_service", to: "database", relationType: "depends_on" },
    { id: "r_auth_queue", from: "auth_service", to: "queue", relationType: "flows_to" },
    { id: "r_queue_worker", from: "queue", to: "worker", relationType: "flows_to" },
  ],
  loops: [
    { id: "l_devops_pressure", label: "Latency Pressure", loopType: "pressure", nodes: ["auth_service", "database", "queue", "worker"] },
  ],
  scenarioKpiMapping: {
    domainId: "devops",
    scenarios: [
      { id: "service_dependency_failure", label: "Service Dependency Failure", severityHint: "critical", tags: ["service"] },
      { id: "database_latency", label: "Database Latency", severityHint: "high", tags: ["database"] },
      { id: "queue_backlog", label: "Queue Backlog", severityHint: "high", tags: ["queue"] },
    ],
    kpis: [
      { id: "service_uptime", label: "Service Uptime", relatedObjectRoles: ["node", "outcome"], tags: ["availability"] },
      { id: "response_latency", label: "Response Latency", relatedObjectRoles: ["pressure", "outcome"], tags: ["latency"] },
      { id: "dependency_health", label: "Dependency Health", relatedObjectRoles: ["dependency", "node"], tags: ["resilience"] },
    ],
    links: [
      { scenarioId: "service_dependency_failure", kpiId: "service_uptime" },
      { scenarioId: "database_latency", kpiId: "response_latency" },
      { scenarioId: "queue_backlog", kpiId: "dependency_health" },
    ],
  },
  panelRegistry: {
    devops_overview_panel: { id: "devops_overview_panel", domainId: "devops", slot: "right", priority: 10 },
    service_dependency_panel: { id: "service_dependency_panel", domainId: "devops", slot: "bottom", priority: 20 },
    failure_propagation_panel: { id: "failure_propagation_panel", domainId: "devops", slot: "right", priority: 30 },
    reliability_kpi_panel: { id: "reliability_kpi_panel", domainId: "devops", slot: "right", priority: 40 },
    resilience_advice_panel: { id: "resilience_advice_panel", domainId: "devops", slot: "right", priority: 50 },
  },
  cockpitComposition: {
    layoutMode: "expanded",
    panels: [
      { panelId: "devops_overview_panel" },
      { panelId: "service_dependency_panel" },
      { panelId: "failure_propagation_panel" },
      { panelId: "reliability_kpi_panel" },
      { panelId: "resilience_advice_panel" },
    ],
    summaryBlocks: [{ id: "overview" }, { id: "dependencies" }, { id: "reliability" }, { id: "resilience" }, { id: "action" }],
  },
  tags: ["demo"],
});

const EXAMPLE_STRATEGY_PROJECT = assembleDomainProject({
  projectId: "strategy_demo",
  domainId: "strategy",
  label: "Strategy Demo Project",
  objects: [
    { id: "competitor", label: "Competitor", coreRole: "actor", tags: ["competition"] },
    { id: "market_share", label: "Market Share", coreRole: "outcome", tags: ["position"] },
    { id: "pricing_pressure", label: "Pricing Pressure", coreRole: "pressure", tags: ["margin"] },
  ],
  relations: [
    { id: "r_competitor_share", from: "competitor", to: "market_share", relationType: "competes_with" },
  ],
  loops: [
    { id: "l_strategy_response", label: "Strategic Response", loopType: "strategic_response", nodes: ["competitor", "pricing_pressure", "market_share"] },
  ],
  scenarioKpiMapping: {
    domainId: "strategy",
    scenarios: [{ id: "competitor_pricing_pressure", label: "Competitor Pricing Pressure", severityHint: "high", tags: ["pricing"] }],
    kpis: [{ id: "strategic_position", label: "Strategic Position", relatedObjectRoles: ["objective", "outcome"], tags: ["market"] }],
    links: [{ scenarioId: "competitor_pricing_pressure", kpiId: "strategic_position" }],
  },
  panelRegistry: {
    strategy_overview_panel: { id: "strategy_overview_panel", domainId: "strategy", slot: "right", priority: 10 },
    strategy_advice_panel: { id: "strategy_advice_panel", domainId: "strategy", slot: "right", priority: 20 },
  },
  cockpitComposition: {
    layoutMode: "standard",
    panels: [{ panelId: "strategy_overview_panel" }, { panelId: "strategy_advice_panel" }],
    summaryBlocks: [{ id: "overview" }, { id: "advice" }],
  },
  tags: ["demo"],
});

export const EXAMPLE_DOMAIN_PROJECT_ASSEMBLIES: Record<string, NexoraDomainProjectAssemblyResult> = {
  business: EXAMPLE_BUSINESS_PROJECT,
  finance: EXAMPLE_FINANCE_PROJECT,
  devops: EXAMPLE_DEVOPS_PROJECT,
  strategy: EXAMPLE_STRATEGY_PROJECT,
};
