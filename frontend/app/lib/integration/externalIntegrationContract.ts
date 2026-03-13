import type { SceneJson, SceneLoop, SceneObject, SemanticObjectMeta } from "../sceneTypes";
import type { WorkspaceState, WorkspaceProjectState } from "../workspace/workspaceModel";
import {
  appendAuditEvents,
  appendTrustProvenance,
  createAuditEvent,
  createTrustProvenance,
} from "../governance/governanceTrustAuditContract";
import {
  applyScannerResultToWorkspace,
  type ScannerApplyResult,
  type ScannerIntelligenceHints,
  type ScannerRelation,
  type ScannerResult,
} from "../workspace/scannerContract";

export type IntegrationMode = "create" | "enrich" | "sync";

export type ExternalSourceCategory =
  | "api"
  | "database"
  | "data_export"
  | "document_report"
  | "architecture_description"
  | "event_stream"
  | "enterprise_tool"
  | "operational_system"
  | "custom";

export type SourceProvenance = {
  source_id: string;
  source_label?: string;
  source_category: ExternalSourceCategory | string;
  captured_at: string;
  mapping_version?: string;
  mapping_notes?: string[];
  raw_reference?: string;
};

export type IntegrationUpdatePolicy = {
  refresh_mode: "one_time" | "manual_refresh" | "periodic_sync" | "event_driven";
  update_scope: "full_project" | "semantics_only" | "kpi_only" | "memory_only" | "simulation_baseline";
  max_frequency_minutes?: number;
  overwrite_policy?: "conservative_merge" | "source_authoritative";
};

export type ExternalSourceDescriptor = {
  id: string;
  label: string;
  source_category: ExternalSourceCategory | string;
  domain_hint?: string;
  connection_type?: "pull" | "push" | "hybrid";
  connection_metadata?: Record<string, unknown>;
  auth_config_hint?: Record<string, unknown>;
  refresh_policy?: IntegrationUpdatePolicy;
  trust_priority?: "low" | "medium" | "high";
  mapping_hints?: Record<string, unknown>;
};

export type IntegrationMappingResult = {
  status: "mapped" | "partial" | "failed";
  mapped_counts?: {
    objects?: number;
    relations?: number;
    semantic_fields?: number;
    kpi_values?: number;
    memory_signals?: number;
  };
  warnings?: string[];
  unresolved_items?: string[];
  provenance: SourceProvenance;
};

export type ProjectExternalBinding = {
  binding_id: string;
  source: ExternalSourceDescriptor;
  mode: IntegrationMode;
  target_project_id?: string;
  update_policy: IntegrationUpdatePolicy;
  last_sync_at?: string;
  mapping_status: IntegrationMappingResult["status"];
  confidence?: number;
};

export type ExternalIntegrationResult = {
  mode: IntegrationMode;
  source: ExternalSourceDescriptor;
  target_project_id?: string;
  project_meta?: {
    id?: string;
    name?: string;
    domain?: string;
    description?: string;
  };
  normalized_payload?: {
    scene_json?: SceneJson | null;
    objects?: SceneObject[];
    semantic_object_meta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
    relations?: ScannerRelation[];
    loops?: SceneLoop[];
    strategy_kpi_seed?: unknown;
    memory_seed?: unknown;
    risk_seed?: unknown;
    timeline_seed?: unknown;
    advice_seed?: unknown;
  };
  mapping: IntegrationMappingResult;
  update_policy?: IntegrationUpdatePolicy;
  confidence?: number;
  integration_scope?: Array<"project" | "semantics" | "simulation" | "kpi" | "memory" | "reasoning" | "cockpit">;
  raw_payload?: unknown;
};

export type EnterpriseIntegrationContext = {
  workspace_id: string;
  active_project_id: string;
  mode_context?: {
    mode_id?: string;
    mode_label?: string;
  } | null;
  project_domain?: string;
};

export type ExternalIntegrationAdapter = {
  id: string;
  label: string;
  source_category: ExternalSourceCategory | string;
  canHandle: (source: ExternalSourceDescriptor) => boolean;
  fetch?: (source: ExternalSourceDescriptor, context?: EnterpriseIntegrationContext) => Promise<unknown> | unknown;
  normalize: (params: {
    source: ExternalSourceDescriptor;
    raw_payload: unknown;
    context?: EnterpriseIntegrationContext;
  }) => Promise<ExternalIntegrationResult> | ExternalIntegrationResult;
};

export type ExternalIntegrationApplyResult = ScannerApplyResult & {
  integration: {
    binding: ProjectExternalBinding;
    mapping: IntegrationMappingResult;
  };
};

const DEFAULT_UPDATE_POLICY: IntegrationUpdatePolicy = {
  refresh_mode: "manual_refresh",
  update_scope: "full_project",
  overwrite_policy: "conservative_merge",
};

const ADAPTERS: ExternalIntegrationAdapter[] = [];

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function normalizeMode(mode: IntegrationMode): IntegrationMode {
  if (mode === "sync") return "sync";
  if (mode === "enrich") return "enrich";
  return "create";
}

function toScannerMode(mode: IntegrationMode): "create" | "enrich" {
  return mode === "create" ? "create" : "enrich";
}

function buildScannerHints(input: ExternalIntegrationResult): ScannerIntelligenceHints {
  const mappingWarnings = Array.isArray(input.mapping?.warnings) ? input.mapping.warnings : [];
  const unresolved = Array.isArray(input.mapping?.unresolved_items) ? input.mapping.unresolved_items : [];
  const memorySeed = input.normalized_payload?.memory_seed as any;
  return {
    domain_hints: input.source?.domain_hint ? { [input.source.domain_hint]: ["integration_source"] } : undefined,
    fragility_markers: Array.isArray(memorySeed?.fragility_markers) ? memorySeed.fragility_markers : [],
    external_source_category: input.source.source_category,
    mapping_status: input.mapping.status,
    mapping_warnings: mappingWarnings,
    unresolved_items: unresolved,
  } as ScannerIntelligenceHints;
}

export function validateExternalIntegrationResult(input: unknown): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const x = input as ExternalIntegrationResult;
  if (!x || typeof x !== "object") errors.push("External integration result must be an object.");
  const mode = String((x as any)?.mode ?? "").trim();
  if (!["create", "enrich", "sync"].includes(mode)) errors.push("mode must be create|enrich|sync.");
  if (!(x as any)?.source || typeof (x as any)?.source !== "object") errors.push("source descriptor is required.");
  if (!(x as any)?.mapping || typeof (x as any)?.mapping !== "object") errors.push("mapping result is required.");
  return { ok: errors.length === 0, errors };
}

export function externalIntegrationResultToScannerResult(input: ExternalIntegrationResult): ScannerResult {
  const mode = normalizeMode(input.mode);
  const payload = input.normalized_payload ?? {};
  const mappingWarnings = Array.isArray(input.mapping?.warnings) ? input.mapping.warnings : [];
  const unresolvedItems = Array.isArray(input.mapping?.unresolved_items) ? input.mapping.unresolved_items : [];

  return {
    mode: toScannerMode(mode),
    source: {
      type: String(input.source?.source_category ?? "external"),
      id: input.source?.id,
      uri: String(input.source?.connection_metadata?.uri ?? "").trim() || undefined,
      label: input.source?.label,
      metadata: {
        connection_type: input.source?.connection_type,
        trust_priority: input.source?.trust_priority,
      },
    },
    project: {
      id: input.project_meta?.id,
      name: input.project_meta?.name,
      domain: input.project_meta?.domain ?? input.source?.domain_hint,
      description: input.project_meta?.description,
      metadata: {
        integration_source_id: input.source?.id,
        integration_source_category: input.source?.source_category,
      },
    },
    targetProjectId: input.target_project_id,
    sceneJson: payload.scene_json ?? null,
    objects: payload.objects,
    semanticObjectMeta: payload.semantic_object_meta,
    relations: payload.relations,
    loops: payload.loops,
    intelligenceHints: buildScannerHints(input),
    riskSeed: payload.risk_seed,
    timelineSeed: payload.timeline_seed,
    adviceSeed: payload.advice_seed,
    warnings: uniq(mappingWarnings),
    unresolvedItems: uniq(unresolvedItems),
    confidence: typeof input.confidence === "number" ? input.confidence : undefined,
    metadata: {
      external_integration: {
        mode,
        source_id: input.source?.id,
        source_category: input.source?.source_category,
        integration_scope: input.integration_scope ?? [],
        mapping_status: input.mapping?.status,
        update_policy: input.update_policy ?? input.source?.refresh_policy ?? DEFAULT_UPDATE_POLICY,
        provenance: input.mapping?.provenance,
      },
    },
  };
}

function appendExternalBinding(
  project: WorkspaceProjectState,
  binding: ProjectExternalBinding
): WorkspaceProjectState {
  const scanner = project.scanner ?? {};
  const existing = Array.isArray((scanner as any).external_bindings) ? (scanner as any).external_bindings : [];
  const filtered = existing.filter((b: any) => String(b?.binding_id ?? "") !== binding.binding_id);
  return {
    ...project,
    scanner: {
      ...scanner,
      external_bindings: [...filtered, binding].slice(-20),
      last_external_source_id: binding.source.id,
      last_external_sync_at: binding.last_sync_at,
    },
  };
}

export function applyExternalIntegrationToWorkspace(
  workspace: WorkspaceState,
  input: ExternalIntegrationResult
): ExternalIntegrationApplyResult {
  const scannerResult = externalIntegrationResultToScannerResult(input);
  const applied = applyScannerResultToWorkspace(workspace, scannerResult);

  const binding: ProjectExternalBinding = {
    binding_id: `${input.source.id}:${Date.now()}`,
    source: input.source,
    mode: normalizeMode(input.mode),
    target_project_id: input.target_project_id ?? applied.activeProjectId,
    update_policy: input.update_policy ?? input.source.refresh_policy ?? DEFAULT_UPDATE_POLICY,
    last_sync_at: new Date().toISOString(),
    mapping_status: input.mapping.status,
    confidence: typeof input.confidence === "number" ? input.confidence : undefined,
  };

  const patchedProject = appendExternalBinding(applied.project, binding);
  const integrationProvenance = createTrustProvenance({
    kind: "external_integration",
    source: {
      source_id: input.source.id,
      source_label: input.source.label,
      source_type: String(input.source.source_category),
      subsystem: "external_integration",
      version: "a24",
    },
    transformation_path: ["external_payload", "normalization_mapping", "scanner_bridge", "workspace_apply"],
    confidence: typeof input.confidence === "number" ? input.confidence : undefined,
    uncertainty_notes: input.mapping?.unresolved_items,
  });
  const integrationAuditEvent = createAuditEvent({
    event_type: "external_integration_applied",
    category: "scanner_integration",
    workspace_id: workspace?.id,
    project_id: patchedProject.id,
    origin_type: "integration",
    actor_hint: "external_integration_contract",
    affected_entity: input.source.id,
    provenance_ref_id: integrationProvenance.id,
    explanation_notes: input.mapping?.warnings,
  });
  const patchedProjectWithAudit: WorkspaceProjectState = {
    ...patchedProject,
    intelligence: {
      ...patchedProject.intelligence,
      responseData: {
        ...(patchedProject.intelligence.responseData && typeof patchedProject.intelligence.responseData === "object"
          ? patchedProject.intelligence.responseData
          : {}),
        external_integration: {
          source_id: input.source.id,
          source_label: input.source.label,
          source_category: input.source.source_category,
          mode: input.mode,
          mapping_status: input.mapping?.status,
          update_policy: input.update_policy ?? input.source.refresh_policy ?? DEFAULT_UPDATE_POLICY,
        },
        trust_provenance: appendTrustProvenance(
          (patchedProject.intelligence.responseData as any)?.trust_provenance,
          [integrationProvenance]
        ),
        audit_events: appendAuditEvents((patchedProject.intelligence.responseData as any)?.audit_events, [
          integrationAuditEvent,
        ]),
      },
    },
  };
  const patchedWorkspace: WorkspaceState = {
    ...applied.workspace,
    projects: {
      ...applied.workspace.projects,
      [patchedProjectWithAudit.id]: patchedProjectWithAudit,
    },
  };

  return {
    ...applied,
    workspace: patchedWorkspace,
    project: patchedProjectWithAudit,
    integration: {
      binding,
      mapping: input.mapping,
    },
  };
}

export function registerExternalIntegrationAdapter(adapter: ExternalIntegrationAdapter): void {
  if (!adapter || typeof adapter !== "object") return;
  if (ADAPTERS.some((a) => a.id === adapter.id)) return;
  ADAPTERS.unshift(adapter);
}

export function listExternalIntegrationAdapters(): ExternalIntegrationAdapter[] {
  return [...ADAPTERS];
}

export async function runExternalIntegrationAdapter(params: {
  source: ExternalSourceDescriptor;
  context?: EnterpriseIntegrationContext;
  raw_payload?: unknown;
}): Promise<ExternalIntegrationResult | null> {
  const adapter = ADAPTERS.find((a) => a.canHandle(params.source));
  if (!adapter) return null;
  const raw =
    params.raw_payload !== undefined
      ? params.raw_payload
      : adapter.fetch
      ? await adapter.fetch(params.source, params.context)
      : null;
  return await adapter.normalize({
    source: params.source,
    raw_payload: raw,
    context: params.context,
  });
}
