import type { ActiveModeContext } from "../modes/productModesContract";
import type { EnvironmentConfig } from "../ops/environmentDeploymentContract";
import { isFeatureEnabled } from "../ops/environmentDeploymentContract";
import type { SceneJson } from "../sceneTypes";
import type { WorkspaceProjectState, WorkspaceState } from "../workspace/workspaceModel";
import { createEmptyProjectState, DEFAULT_PROJECT_ID, DEFAULT_WORKSPACE_ID } from "../workspace/workspaceModel";
import type { ScannerResult } from "../workspace/scannerContract";
import { applyScannerResultToWorkspace } from "../workspace/scannerContract";
import {
  applyExternalIntegrationToWorkspace,
  type ExternalIntegrationResult,
} from "../integration/externalIntegrationContract";
import {
  exportProjectFile,
  importProjectFileToWorkspace,
  parseImportedProjectFile,
  type NexoraProjectFile,
} from "../workspace/projectTransfer";
import {
  buildSimulationResult,
  createSimulationInputFromPrompt,
  type SimulationInputKind,
  type SimulationResult,
} from "../decision/simulationContract";
import { buildReasoningOutput, createReasoningInput, type ReasoningOutput } from "../reasoning/aiReasoningContract";
import { orchestrateMultiAgentDecision, type MultiAgentResult } from "../reasoning/multiAgentDecisionEngineContract";
import { scanSystemToScannerResult, type ScannerInput } from "../scanner/systemFragilityScanner";
import {
  createAuditEvent,
  createTrustProvenance,
  type AuditEvent,
  type ProjectGovernanceContext,
  type TrustProvenance,
} from "../governance/governanceTrustAuditContract";

export type PublicProjectHandle = {
  workspace_id: string;
  project_id: string;
  name?: string;
  domain?: string;
};

export type PublicSimulationRequest = {
  workspace_id?: string;
  project_id: string;
  text: string;
  matched_object_ids: string[];
  topics?: string[];
  kind?: SimulationInputKind;
  magnitude?: number;
};

export type PublicSimulationResult = {
  project: PublicProjectHandle;
  simulation: SimulationResult;
  provenance: TrustProvenance;
};

export type PublicReasoningRequest = {
  workspace_id?: string;
  project_id: string;
  prompt: string;
  selected_object_id?: string | null;
  semantic_objects?: any[];
  strategy_context?: {
    at_risk_kpis?: string[];
    threatened_objectives?: string[];
  };
};

export type PublicReasoningResult = {
  project: PublicProjectHandle;
  reasoning: ReasoningOutput;
  multi_agent?: MultiAgentResult | null;
  provenance: TrustProvenance;
};

export type PublicScannerRequest = {
  workspace_id?: string;
  mode?: "create" | "enrich";
  target_project_id?: string;
  source: ScannerInput["source"];
  payload: ScannerInput["payload"];
};

export type PublicScannerResult = {
  project: PublicProjectHandle;
  scanner_result: ScannerResult;
  warnings: string[];
};

export type PublicProjectSummary = {
  project: PublicProjectHandle;
  scene_object_count: number;
  relation_count: number;
  has_strategy: boolean;
  has_reasoning: boolean;
  has_simulation: boolean;
  has_cockpit: boolean;
};

export type PublicTrustAuditSummary = {
  project: PublicProjectHandle;
  governance?: ProjectGovernanceContext | null;
  trust_provenance_count: number;
  audit_event_count: number;
  latest_audit_events: AuditEvent[];
};

export type ExtensionCapability =
  | "semantic_enricher"
  | "scanner_adapter"
  | "simulation_strategy"
  | "reasoning_provider"
  | "cockpit_summary_provider"
  | "kpi_mapping_provider"
  | "visual_language_pack"
  | "enterprise_integration_adapter";

export type ExtensionRegistration = {
  id: string;
  name: string;
  version: string;
  extension_type: ExtensionCapability;
  declared_capabilities: string[];
  dependencies?: string[];
  compatibility?: {
    min_platform_version?: string;
    environments?: string[];
  };
};

export type ExtensionContext = {
  get_environment_config: () => EnvironmentConfig | null;
  get_workspace_state: () => WorkspaceState;
  get_active_mode: () => ActiveModeContext | null;
  append_audit: (event: AuditEvent) => void;
};

export type DeveloperExtension = ExtensionRegistration & {
  on_register?: (ctx: ExtensionContext) => void | Promise<void>;
};

export type NexoraApiContract = {
  create_project: (input: {
    workspace_id?: string;
    project_id?: string;
    name?: string;
    domain?: string;
    scene_json?: SceneJson | null;
  }) => Promise<PublicProjectHandle>;
  load_project: (input: { workspace_id?: string; project_id: string }) => Promise<PublicProjectHandle | null>;
  enrich_project: (input: {
    workspace_id?: string;
    scanner_result?: ScannerResult;
    external_integration_result?: ExternalIntegrationResult;
  }) => Promise<PublicProjectHandle | null>;
  import_project: (input: { workspace_id?: string; file_payload: unknown }) => Promise<PublicProjectHandle | null>;
  export_project: (input: { workspace_id?: string; project_id: string }) => Promise<NexoraProjectFile | null>;
  run_simulation: (input: PublicSimulationRequest) => Promise<PublicSimulationResult | null>;
  trigger_reasoning: (input: PublicReasoningRequest) => Promise<PublicReasoningResult | null>;
  scan_source: (input: PublicScannerRequest) => Promise<PublicScannerResult | null>;
  query_project_summary: (input: { workspace_id?: string; project_id: string }) => Promise<PublicProjectSummary | null>;
  query_trust_audit_summary: (input: { workspace_id?: string; project_id: string }) => Promise<PublicTrustAuditSummary | null>;
};

export type NexoraSdkContract = {
  api: NexoraApiContract;
  extensions: {
    register: (ext: DeveloperExtension) => Promise<void>;
    list: () => DeveloperExtension[];
  };
};

type NexoraApiDeps = {
  get_workspace_state: () => WorkspaceState;
  set_workspace_state: (next: WorkspaceState) => void;
  get_environment_config: () => EnvironmentConfig | null;
  get_active_mode: () => ActiveModeContext | null;
  append_audit?: (event: AuditEvent) => void;
};

function normalizeWorkspaceId(id?: string): string {
  return String(id || "").trim() || DEFAULT_WORKSPACE_ID;
}

function normalizeProjectId(id?: string): string {
  return String(id || "").trim().toLowerCase() || DEFAULT_PROJECT_ID;
}

function toHandle(workspace: WorkspaceState, project: WorkspaceProjectState): PublicProjectHandle {
  return {
    workspace_id: workspace.id,
    project_id: project.id,
    name: project.name,
    domain: project.domain,
  };
}

function readProject(workspace: WorkspaceState, projectId: string): WorkspaceProjectState | null {
  return workspace.projects?.[projectId] ?? null;
}

function getSceneObjectsCount(project: WorkspaceProjectState): number {
  const objs = project?.scene?.sceneJson?.scene?.objects;
  return Array.isArray(objs) ? objs.length : 0;
}

function getRelationCount(project: WorkspaceProjectState): number {
  const rel = (project?.scene?.sceneJson as any)?.scene?.relations;
  return Array.isArray(rel) ? rel.length : 0;
}

export function createNexoraApiContract(deps: NexoraApiDeps): NexoraApiContract {
  return {
    async create_project(input) {
      const workspace = deps.get_workspace_state();
      const workspaceId = normalizeWorkspaceId(input.workspace_id);
      const projectId = normalizeProjectId(input.project_id || input.name);
      const existing = readProject(workspace, projectId);
      const nextProject = existing ?? createEmptyProjectState(projectId, input.name || projectId);
      if (input.domain) nextProject.domain = input.domain;
      if (input.scene_json) nextProject.scene.sceneJson = input.scene_json;
      const nextWorkspace: WorkspaceState = {
        ...workspace,
        id: workspaceId,
        activeProjectId: projectId,
        projects: {
          ...(workspace.projects ?? {}),
          [projectId]: nextProject,
        },
      };
      deps.set_workspace_state(nextWorkspace);
      deps.append_audit?.(
        createAuditEvent({
          event_type: "project_loaded",
          category: "project_lifecycle",
          workspace_id: workspaceId,
          project_id: projectId,
          origin_type: "system",
          actor_hint: "api.create_project",
        })
      );
      return toHandle(nextWorkspace, nextProject);
    },

    async load_project(input) {
      const workspace = deps.get_workspace_state();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;
      return toHandle(workspace, project);
    },

    async enrich_project(input) {
      const workspace = deps.get_workspace_state();
      let nextWorkspace = workspace;
      let nextProject: WorkspaceProjectState | null = null;

      if (input.scanner_result) {
        const applied = applyScannerResultToWorkspace(nextWorkspace, input.scanner_result);
        nextWorkspace = applied.workspace;
        nextProject = applied.project;
      } else if (input.external_integration_result) {
        const env = deps.get_environment_config();
        if (!isFeatureEnabled(env, "enterprise_integrations")) return null;
        const applied = applyExternalIntegrationToWorkspace(nextWorkspace, input.external_integration_result);
        nextWorkspace = applied.workspace;
        nextProject = applied.project;
      }

      if (!nextProject) return null;
      deps.set_workspace_state(nextWorkspace);
      return toHandle(nextWorkspace, nextProject);
    },

    async import_project(input) {
      const workspace = deps.get_workspace_state();
      const parse = parseImportedProjectFile(input.file_payload);
      if (!parse.file) return null;
      const imported = importProjectFileToWorkspace(workspace, parse.file!);
      deps.set_workspace_state(imported.workspace);
      return toHandle(imported.workspace, imported.project);
    },

    async export_project(input) {
      const workspace = deps.get_workspace_state();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;
      return exportProjectFile(project).file;
    },

    async run_simulation(input) {
      const workspace = deps.get_workspace_state();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;
      const scene = project.scene.sceneJson;
      const objects = Array.isArray(scene?.scene?.objects) ? scene!.scene.objects! : [];
      const relations = Array.isArray((scene as any)?.scene?.relations) ? (scene as any).scene.relations : [];
      const simInput = createSimulationInputFromPrompt({
        text: input.text,
        matchedObjectIds: input.matched_object_ids,
        topics: input.topics ?? [],
        kind: input.kind ?? "decision",
        magnitude: input.magnitude,
        metadata: { source: "sdk_api" },
      });
      const simulation = buildSimulationResult({
        projectId: project.id,
        scenarioName: `SDK Scenario: ${input.text}`,
        input: simInput,
        objects: objects as any[],
        relations: relations as any[],
        riskSummary: "Simulation run via SDK/API contract.",
        timelineSteps: [
          "Immediate: direct impact observed on selected objects.",
          "Near-term: dependency propagation evaluated.",
          "Downstream: secondary effects estimated.",
        ],
        recommendation: "Evaluate mitigation alternatives against baseline.",
        confidence: 0.72,
        affectedDimensions: ["dependency_stability", "operational_pressure"],
      });
      const provenance = createTrustProvenance({
        kind: "simulation_output",
        source: {
          source_id: String(simulation.scenario.id),
          source_label: simulation.scenario.name,
          source_type: "simulation",
          subsystem: "simulation_engine",
          version: "a10",
        },
        transformation_path: ["api_request", "simulation_input", "simulation_result"],
        confidence: simulation.confidence,
      });
      return { project: toHandle(workspace, project), simulation, provenance };
    },

    async trigger_reasoning(input) {
      const workspace = deps.get_workspace_state();
      const env = deps.get_environment_config();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;

      const scene = project.scene.sceneJson;
      const semanticObjects = Array.isArray(input.semantic_objects)
        ? input.semantic_objects
        : (Array.isArray(scene?.scene?.objects) ? (scene!.scene.objects as any[]) : []);
      const reasoningInput = createReasoningInput({
        prompt: input.prompt,
        context: {
          workspace_id: input.workspace_id ?? workspace.id,
          project_id: project.id,
          project_domain: project.domain,
          selected_object_id: input.selected_object_id ?? null,
          active_mode: deps.get_active_mode(),
        },
        semanticObjects,
        strategyContext: input.strategy_context,
      });
      const reasoning = buildReasoningOutput(reasoningInput);
      const multiAgent = isFeatureEnabled(env, "multi_agent")
        ? orchestrateMultiAgentDecision({
            context: {
              workspace_id: workspace.id,
              project_id: project.id,
              project_domain: project.domain,
              prompt: input.prompt,
              selected_object_id: input.selected_object_id ?? null,
              mode_context: deps.get_active_mode(),
              matched_object_ids: reasoning.inferred_decision_input?.target_object_ids ?? [],
              reasoning,
            },
          })
        : null;
      const provenance = createTrustProvenance({
        kind: "prompt_interpretation",
        source: {
          source_id: "sdk_reasoning",
          source_label: "SDK Reasoning",
          source_type: "reasoning",
          subsystem: "ai_reasoning",
          version: "a19",
        },
        transformation_path: ["api_request", "reasoning_input", "reasoning_output"],
        confidence: reasoning.confidence.score,
        uncertainty_notes: reasoning.ambiguity_notes,
      });
      return {
        project: toHandle(workspace, project),
        reasoning,
        multi_agent: multiAgent,
        provenance,
      };
    },

    async scan_source(input) {
      const workspace = deps.get_workspace_state();
      const env = deps.get_environment_config();
      if (!isFeatureEnabled(env, "scanner_create") && !isFeatureEnabled(env, "scanner_enrich")) return null;
      const scannerResult = scanSystemToScannerResult({
        source: input.source,
        mode: input.mode,
        targetProjectId: input.target_project_id,
        payload: input.payload,
      });
      const applied = applyScannerResultToWorkspace(workspace, scannerResult);
      deps.set_workspace_state(applied.workspace);
      return {
        project: toHandle(applied.workspace, applied.project),
        scanner_result: scannerResult,
        warnings: applied.warnings,
      };
    },

    async query_project_summary(input) {
      const workspace = deps.get_workspace_state();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;
      return {
        project: toHandle(workspace, project),
        scene_object_count: getSceneObjectsCount(project),
        relation_count: getRelationCount(project),
        has_strategy: !!project.intelligence.strategyKpi,
        has_reasoning: !!project.intelligence.aiReasoning,
        has_simulation: !!(project.intelligence.responseData as any)?.decision_simulation,
        has_cockpit: !!project.intelligence.decisionCockpit,
      };
    },

    async query_trust_audit_summary(input) {
      const workspace = deps.get_workspace_state();
      const project = readProject(workspace, normalizeProjectId(input.project_id));
      if (!project) return null;
      const responseData: any = project.intelligence.responseData ?? {};
      const trust = Array.isArray(responseData?.trust_provenance) ? responseData.trust_provenance : [];
      const audit = Array.isArray(responseData?.audit_events) ? responseData.audit_events : [];
      return {
        project: toHandle(workspace, project),
        governance: (responseData?.governance_context as ProjectGovernanceContext | null) ?? null,
        trust_provenance_count: trust.length,
        audit_event_count: audit.length,
        latest_audit_events: audit.slice(-6),
      };
    },
  };
}

export function createNexoraSdkContract(deps: NexoraApiDeps): NexoraSdkContract {
  const extensions: DeveloperExtension[] = [];
  const api = createNexoraApiContract(deps);
  return {
    api,
    extensions: {
      async register(ext: DeveloperExtension): Promise<void> {
        if (!ext || !ext.id) return;
        if (extensions.some((x) => x.id === ext.id)) return;
        extensions.push(ext);
        if (ext.on_register) {
          await ext.on_register({
            get_environment_config: deps.get_environment_config,
            get_workspace_state: deps.get_workspace_state,
            get_active_mode: deps.get_active_mode,
            append_audit: (event) => deps.append_audit?.(event),
          });
        }
      },
      list() {
        return [...extensions];
      },
    },
  };
}
