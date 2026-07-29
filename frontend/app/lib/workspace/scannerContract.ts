import type { SceneJson, SceneLoop, SceneObject, SemanticObjectMeta } from "../sceneTypes";
import {
  appendAuditEvents,
  appendTrustProvenance,
  createAuditEvent,
  createTrustProvenance,
} from "../governance/governanceTrustAuditContract";
import {
  createEmptyProjectState,
  DEFAULT_PROJECT_ID,
  type WorkspaceProjectState,
  type WorkspaceState,
} from "./workspacePersistence";

export type ScannerMode = "create" | "enrich";

export type ScannerSourceDescriptor = {
  type: string;
  id?: string;
  uri?: string;
  label?: string;
  metadata?: Record<string, unknown>;
};

export type ScannerRelation = {
  from: string;
  to: string;
  type?: string;
  weight?: number;
  label?: string;
  metadata?: Record<string, unknown>;
};

export type ScannerIntelligenceHints = {
  critical_objects?: string[];
  risk_nodes?: string[];
  dependency_chains?: string[][];
  categories?: Record<string, string>;
  roles?: Record<string, string>;
  domain_hints?: Record<string, string[]>;
  fragility_markers?: string[];
  [key: string]: unknown;
};

export type ScannerProjectDescriptor = {
  id?: string;
  name?: string;
  domain?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type ScannerResult = {
  mode: ScannerMode;
  source: ScannerSourceDescriptor;
  project?: ScannerProjectDescriptor;
  targetProjectId?: string;
  sceneJson?: SceneJson | null;
  objects?: SceneObject[];
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  relations?: ScannerRelation[];
  loops?: SceneLoop[];
  intelligenceHints?: ScannerIntelligenceHints;
  riskSeed?: unknown;
  timelineSeed?: unknown;
  adviceSeed?: unknown;
  warnings?: string[];
  confidence?: number;
  unresolvedItems?: string[];
  metadata?: Record<string, unknown>;
};

export type ScannerValidationResult = {
  ok: boolean;
  errors: string[];
};

export type ScannerApplyResult = {
  workspace: WorkspaceState;
  activeProjectId: string;
  project: WorkspaceProjectState;
  created: boolean;
  warnings: string[];
};

type NormalizedScannerResult = ScannerResult & {
  normalizedProjectId: string;
};

function slugifyProjectId(value: string): string {
  const v = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return v || DEFAULT_PROJECT_ID;
}

function ensureSceneJson(scene: SceneJson | null | undefined): SceneJson {
  if (scene && typeof scene === "object" && scene.scene && scene.state_vector) return scene;
  return {
    meta: { version: "scanner-contract-v1", generated_at: new Date().toISOString() },
    domain_model: {},
    state_vector: {},
    scene: {
      objects: [],
      loops: [],
    },
  };
}

function mergeObjects(existing: SceneObject[], incoming: SceneObject[]): SceneObject[] {
  const map = new Map<string, SceneObject>();
  (Array.isArray(existing) ? existing : []).forEach((o, idx) => {
    const id = String(o?.id ?? o?.name ?? `obj_${idx}`);
    map.set(id, o);
  });
  (Array.isArray(incoming) ? incoming : []).forEach((o, idx) => {
    const id = String(o?.id ?? o?.name ?? `obj_${idx}`);
    const prev = map.get(id);
    map.set(id, prev ? { ...prev, ...o, id } : { ...o, id });
  });
  return Array.from(map.values());
}

function mergeRelations(
  existing: ScannerRelation[] | undefined,
  incoming: ScannerRelation[] | undefined
): ScannerRelation[] {
  const list = Array.isArray(existing) ? [...existing] : [];
  const seen = new Set(list.map((relation) => `${String(relation.from)}|${String(relation.to)}|${String(relation.type ?? "")}`));
  (Array.isArray(incoming) ? incoming : []).forEach((r) => {
    const key = `${String(r?.from ?? "")}|${String(r?.to ?? "")}|${String(r?.type ?? "")}`;
    if (!r?.from || !r?.to || seen.has(key)) return;
    seen.add(key);
    list.push({
      from: String(r.from),
      to: String(r.to),
      type: typeof r.type === "string" ? r.type : "dependency",
      weight: typeof r.weight === "number" ? r.weight : undefined,
      label: typeof r.label === "string" ? r.label : undefined,
      metadata: r.metadata && typeof r.metadata === "object" ? r.metadata : undefined,
    });
  });
  return list;
}

function mergeLoops(existing: SceneLoop[] | undefined, incoming: SceneLoop[] | undefined): SceneLoop[] {
  const byId = new Map<string, SceneLoop>();
  (Array.isArray(existing) ? existing : []).forEach((l, idx) => {
    const id = String(l?.id ?? `loop_${idx}`);
    byId.set(id, { ...l, id });
  });
  (Array.isArray(incoming) ? incoming : []).forEach((l, idx) => {
    const id = String(l?.id ?? `loop_${idx}`);
    const prev = byId.get(id);
    byId.set(id, prev ? { ...prev, ...l, id } : { ...l, id });
  });
  return Array.from(byId.values());
}

function mergeSemanticMeta(
  existing: Record<string, SemanticObjectMeta | Record<string, unknown>> | undefined,
  incoming: Record<string, SemanticObjectMeta | Record<string, unknown>> | undefined
): Record<string, SemanticObjectMeta | Record<string, unknown>> {
  return {
    ...(existing && typeof existing === "object" ? existing : {}),
    ...(incoming && typeof incoming === "object" ? incoming : {}),
  };
}

function pickSemanticString(
  meta: SemanticObjectMeta | Record<string, unknown>,
  obj: SceneObject,
  key: keyof SemanticObjectMeta
): string | undefined {
  const metaValue = meta[key];
  const objValue = obj[key];
  const merged = String(metaValue ?? objValue ?? "").trim();
  return merged || (typeof objValue === "string" ? objValue : undefined);
}

function pickSemanticStringArray(
  meta: SemanticObjectMeta | Record<string, unknown>,
  obj: SceneObject,
  key: "keywords" | "dependencies" | "related_terms"
): string[] | undefined {
  const metaValue = meta[key];
  const objValue = obj[key];
  if (Array.isArray(metaValue)) return metaValue.filter((item): item is string => typeof item === "string");
  if (Array.isArray(objValue)) return objValue.filter((item): item is string => typeof item === "string");
  return undefined;
}

function applySemanticToObjects(
  objects: SceneObject[],
  semantic: Record<string, SemanticObjectMeta | Record<string, unknown>> | undefined
): SceneObject[] {
  if (!semantic || typeof semantic !== "object") return objects;
  return objects.map((obj) => {
    const id = String(obj.id ?? "");
    const meta = semantic[id];
    if (!meta || typeof meta !== "object") return obj;
    const mergedSemantic: SemanticObjectMeta = {
      ...(obj.semantic ?? {}),
      ...meta,
    };
    return {
      ...obj,
      semantic: mergedSemantic,
      canonical_name: pickSemanticString(mergedSemantic, obj, "canonical_name"),
      display_label: pickSemanticString(mergedSemantic, obj, "display_label"),
      category: pickSemanticString(mergedSemantic, obj, "category"),
      role: pickSemanticString(mergedSemantic, obj, "role"),
      domain: pickSemanticString(mergedSemantic, obj, "domain"),
      keywords: pickSemanticStringArray(mergedSemantic, obj, "keywords"),
      dependencies: pickSemanticStringArray(mergedSemantic, obj, "dependencies"),
      risk_kind: pickSemanticString(mergedSemantic, obj, "risk_kind"),
      related_terms: pickSemanticStringArray(mergedSemantic, obj, "related_terms"),
      business_meaning: pickSemanticString(mergedSemantic, obj, "business_meaning"),
    };
  });
}

export function validateScannerResult(input: unknown): ScannerValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    errors.push("Scanner result must be an object.");
    return { ok: false, errors };
  }
  const x = input as ScannerResult;
  const mode = String(x.mode ?? "").trim();
  if (mode !== "create" && mode !== "enrich") errors.push("mode must be 'create' or 'enrich'.");
  if (!x.source || typeof x.source !== "object") errors.push("source descriptor is required.");
  if (x.mode === "enrich" && !String(x.targetProjectId ?? x.project?.id ?? "").trim()) {
    errors.push("enrich mode requires targetProjectId or project.id.");
  }
  return { ok: errors.length === 0, errors };
}

export function normalizeScannerResult(input: ScannerResult): NormalizedScannerResult {
  const mode: ScannerMode = input.mode === "enrich" ? "enrich" : "create";
  const source: ScannerSourceDescriptor = {
    type: String(input?.source?.type ?? "custom").trim() || "custom",
    id: typeof input?.source?.id === "string" ? input.source.id : undefined,
    uri: typeof input?.source?.uri === "string" ? input.source.uri : undefined,
    label: typeof input?.source?.label === "string" ? input.source.label : undefined,
    metadata: input?.source?.metadata && typeof input.source.metadata === "object" ? input.source.metadata : undefined,
  };
  const seedId =
    input?.project?.id ??
    input?.targetProjectId ??
    input?.source?.id ??
    input?.source?.label ??
    DEFAULT_PROJECT_ID;
  const normalizedProjectId = slugifyProjectId(String(seedId));
  return {
    ...input,
    mode,
    source,
    normalizedProjectId,
    warnings: Array.isArray(input?.warnings) ? input.warnings : [],
    unresolvedItems: Array.isArray(input?.unresolvedItems) ? input.unresolvedItems : [],
  };
}

export function applyScannerResultToWorkspace(
  workspace: WorkspaceState,
  result: ScannerResult
): ScannerApplyResult {
  const valid = validateScannerResult(result);
  if (!valid.ok) {
    const fallbackProject =
      workspace.projects[workspace.activeProjectId] ??
      workspace.projects[Object.keys(workspace.projects)[0] ?? DEFAULT_PROJECT_ID] ??
      createEmptyProjectState(DEFAULT_PROJECT_ID, "Default Project");
    return {
      workspace,
      activeProjectId: workspace.activeProjectId,
      project: fallbackProject,
      created: false,
      warnings: valid.errors,
    };
  }

  const normalized = normalizeScannerResult(result);
  const currentProjects =
    workspace?.projects && typeof workspace.projects === "object" ? workspace.projects : {};

  const targetProjectId =
    normalized.mode === "create"
      ? normalized.normalizedProjectId
      : slugifyProjectId(
          String(normalized.targetProjectId ?? normalized.project?.id ?? normalized.normalizedProjectId)
        );

  const baseProject =
    currentProjects[targetProjectId] ??
    createEmptyProjectState(targetProjectId, normalized.project?.name ?? targetProjectId);
  const created = !currentProjects[targetProjectId];

  const nextProject: WorkspaceProjectState = {
    ...baseProject,
    id: targetProjectId,
    name: String(normalized.project?.name ?? baseProject.name ?? targetProjectId),
    domain: normalized.project?.domain ?? baseProject.domain,
    description: normalized.project?.description ?? baseProject.description,
    semanticObjectMeta: mergeSemanticMeta(baseProject.semanticObjectMeta, normalized.semanticObjectMeta),
  };

  const baseScene = ensureSceneJson(baseProject.scene.sceneJson ?? normalized.sceneJson ?? null);
  const incomingScene = normalized.sceneJson ? ensureSceneJson(normalized.sceneJson) : null;

  const mergedObjects = mergeObjects(
    Array.isArray(baseScene.scene?.objects) ? (baseScene.scene.objects as SceneObject[]) : [],
    incomingScene?.scene?.objects ??
      (Array.isArray(normalized.objects) ? (normalized.objects as SceneObject[]) : [])
  );
  const objectsWithSemantic = applySemanticToObjects(
    mergedObjects,
    mergeSemanticMeta(nextProject.semanticObjectMeta, normalized.semanticObjectMeta)
  );

  const baseRelations = Array.isArray(baseScene.scene?.relations)
    ? (baseScene.scene.relations as ScannerRelation[])
    : undefined;
  const mergedRelations = mergeRelations(baseRelations, normalized.relations);
  const mergedLoops = mergeLoops(
    Array.isArray(baseScene.scene?.loops) ? (baseScene.scene.loops as SceneLoop[]) : [],
    normalized.loops
  );

  const sceneJson: SceneJson = {
    ...(incomingScene ?? baseScene),
    scene: {
      ...(incomingScene?.scene ?? baseScene.scene),
      objects: objectsWithSemantic,
      loops: mergedLoops,
      relations: mergedRelations,
    },
  };

  nextProject.scene = {
    ...baseProject.scene,
    sceneJson,
    loops: mergedLoops,
  };
  const scannerProvenance = createTrustProvenance({
    kind: "scanner_update",
    source: {
      source_id: String(normalized.source?.id ?? normalized.source?.label ?? "scanner_source"),
      source_label: normalized.source?.label,
      source_type: normalized.source?.type,
      subsystem: "scanner_integration",
      version: "a8-a22",
    },
    transformation_path: ["scanner_result", "normalization", "project_merge"],
    confidence: typeof normalized.confidence === "number" ? normalized.confidence : undefined,
    uncertainty_notes: Array.isArray(normalized.unresolvedItems) ? normalized.unresolvedItems : undefined,
  });
  const scannerAuditEvent = createAuditEvent({
    event_type: "scanner_enrichment_applied",
    category: "scanner_integration",
    workspace_id: workspace?.id,
    project_id: targetProjectId,
    origin_type: "scanner",
    actor_hint: "scanner_contract",
    affected_entity: targetProjectId,
    provenance_ref_id: scannerProvenance.id,
    explanation_notes: Array.isArray(normalized.warnings) ? normalized.warnings : undefined,
  });

  const existingResponseData =
    baseProject.intelligence.responseData && typeof baseProject.intelligence.responseData === "object"
      ? (baseProject.intelligence.responseData as Record<string, unknown>)
      : null;

  nextProject.intelligence = {
    ...baseProject.intelligence,
    memoryInsights: {
      ...(baseProject.intelligence.memoryInsights && typeof baseProject.intelligence.memoryInsights === "object"
        ? baseProject.intelligence.memoryInsights
        : {}),
      scanner_scan: {
        scanned_at: new Date().toISOString(),
        source: normalized.source,
        hints: normalized.intelligenceHints ?? null,
      },
    },
    riskPropagation:
      normalized.riskSeed !== undefined ? normalized.riskSeed : baseProject.intelligence.riskPropagation,
    strategicAdvice:
      normalized.adviceSeed !== undefined ? normalized.adviceSeed : baseProject.intelligence.strategicAdvice,
    responseData: {
      ...(baseProject.intelligence.responseData && typeof baseProject.intelligence.responseData === "object"
        ? baseProject.intelligence.responseData
        : {}),
      scanner_hints: normalized.intelligenceHints ?? null,
      scanner_source: normalized.source,
      scanner_metadata: normalized.metadata ?? null,
      trust_provenance: appendTrustProvenance(existingResponseData?.trust_provenance, [scannerProvenance]),
      audit_events: appendAuditEvents(existingResponseData?.audit_events, [scannerAuditEvent]),
      timeline_seed:
        normalized.timelineSeed !== undefined ? normalized.timelineSeed : undefined,
    },
  };

  nextProject.scanner = {
    ...(baseProject.scanner ?? {}),
    lastMode: normalized.mode,
    lastSource: {
      type: normalized.source.type,
      id: normalized.source.id,
      uri: normalized.source.uri,
      label: normalized.source.label,
    },
    confidence:
      typeof normalized.confidence === "number" ? normalized.confidence : baseProject.scanner?.confidence,
    warnings: Array.isArray(normalized.warnings) ? normalized.warnings : [],
    unresolvedItems: Array.isArray(normalized.unresolvedItems) ? normalized.unresolvedItems : [],
    lastScannedAt: new Date().toISOString(),
  };

  const nextWorkspace: WorkspaceState = {
    ...workspace,
    activeProjectId: targetProjectId,
    projects: {
      ...currentProjects,
      [targetProjectId]: nextProject,
    },
  };

  return {
    workspace: nextWorkspace,
    activeProjectId: targetProjectId,
    project: nextProject,
    created,
    warnings: Array.isArray(normalized.warnings) ? normalized.warnings : [],
  };
}
