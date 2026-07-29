import type { SceneJson, SceneLoop, SceneObject, SemanticObjectMeta } from "../sceneTypes";
import type { ScannerResult } from "./scannerContract";
import type { WorkspaceProjectState, WorkspaceState } from "./workspacePersistence";
import { createEmptyProjectState, DEFAULT_PROJECT_ID } from "./workspacePersistence";
import { normalizeScannerResult, validateScannerResult } from "./scannerContract";

export type NexoraProjectFileVersion = "1";

export type ProjectMetadata = {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  source?: {
    type?: string;
    id?: string;
    uri?: string;
    label?: string;
  };
  [key: string]: unknown;
};

export type ProjectScenePayload = {
  sceneJson: SceneJson | null;
  selection?: {
    selectedObjectId?: string | null;
    focusedId?: string | null;
    focusMode?: "all" | "selected";
    focusPinned?: boolean;
  };
  loops?: {
    activeLoopId?: string | null;
    selectedLoopId?: string | null;
    list?: SceneLoop[];
  };
  overrides?: {
    objectUxById?: Record<string, { opacity?: number; scale?: number }>;
    overrides?: Record<string, unknown>;
  };
};

export type NexoraProjectFile = {
  format: "nexora_project_file";
  version: NexoraProjectFileVersion;
  nexora_version: string;
  exported_at: string;
  project: ProjectMetadata;
  scene: ProjectScenePayload;
  semantics?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  intelligence?: WorkspaceProjectState["intelligence"];
  history?: {
    messages?: Array<{ id?: string; role: "user" | "assistant"; text: string }>;
    activeMode?: string;
    episodeId?: string | null;
  };
  scanner?: WorkspaceProjectState["scanner"] & {
    mode?: "create" | "enrich";
    source?: {
      type?: string;
      id?: string;
      uri?: string;
      label?: string;
    };
  };
  relations?: unknown[];
  loops?: unknown[];
  warnings?: string[];
  metadata?: Record<string, unknown>;
};

export type ExportResult = {
  ok: boolean;
  file: NexoraProjectFile;
  warnings: string[];
};

export type ImportResult = {
  ok: boolean;
  project: WorkspaceProjectState;
  workspace: WorkspaceState;
  activeProjectId: string;
  created: boolean;
  warnings: string[];
  errors: string[];
};

type LegacyProjectFileV1 = {
  version?: "1";
  activeMode?: string;
  sceneJson?: SceneJson | null;
  messages?: Array<{ id?: string; role: "user" | "assistant"; text: string }>;
  [key: string]: unknown;
};

function nowIso(): string {
  return new Date().toISOString();
}

function slugifyId(value: string): string {
  const v = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return v || DEFAULT_PROJECT_ID;
}

function nextAvailableProjectId(baseId: string, projects: Record<string, WorkspaceProjectState>): string {
  const safeBase = slugifyId(baseId);
  if (!projects[safeBase]) return safeBase;
  let i = 2;
  while (projects[`${safeBase}_${i}`]) i += 1;
  return `${safeBase}_${i}`;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isNexoraProjectFile(input: unknown): input is NexoraProjectFile {
  const record = readRecord(input);
  const project = readRecord(record.project);
  const scene = readRecord(record.scene);
  return (
    record.format === "nexora_project_file" &&
    typeof record.version === "string" &&
    Boolean(project && typeof record.project === "object") &&
    Boolean(scene && typeof record.scene === "object")
  );
}

function normalizeLegacyProjectFile(raw: LegacyProjectFileV1): NexoraProjectFile {
  const sceneJson = raw?.sceneJson && typeof raw.sceneJson === "object" ? (raw.sceneJson as SceneJson) : null;
  const meta = readRecord(sceneJson?.meta);
  const inferredId = slugifyId(
    String(meta.project_id ?? meta.demo_id ?? DEFAULT_PROJECT_ID)
  );
  const inferredName = String(meta.project_name ?? inferredId);

  return {
    format: "nexora_project_file",
    version: "1",
    nexora_version: "legacy-v1",
    exported_at: nowIso(),
    project: {
      id: inferredId,
      name: inferredName,
      domain: String(meta.domain ?? "").trim() || undefined,
    },
    scene: {
      sceneJson,
      selection: {
        selectedObjectId: null,
        focusedId: null,
        focusMode: "all",
        focusPinned: false,
      },
      loops: {
        activeLoopId: null,
        selectedLoopId: null,
        list: Array.isArray(sceneJson?.scene?.loops) ? sceneJson.scene.loops : [],
      },
      overrides: {
        objectUxById: {},
        overrides: {},
      },
    },
    history: {
      messages: Array.isArray(raw?.messages) ? raw.messages : [],
      activeMode: typeof raw?.activeMode === "string" ? raw.activeMode : "business",
      episodeId: null,
    },
  };
}

export function scannerResultToProjectFile(input: ScannerResult): NexoraProjectFile | null {
  const valid = validateScannerResult(input);
  if (!valid.ok) return null;
  const n = normalizeScannerResult(input);
  const pid = slugifyId(n.normalizedProjectId);
  const relations = Array.isArray(n.relations) ? n.relations : [];
  const loops = Array.isArray(n.loops) ? n.loops : [];
  const sceneJson =
    n.sceneJson && typeof n.sceneJson === "object"
      ? ({
          ...n.sceneJson,
          scene: {
            ...n.sceneJson.scene,
            objects: Array.isArray(n.sceneJson.scene?.objects) ? [...n.sceneJson.scene.objects] : n.sceneJson.scene?.objects,
          },
        } as SceneJson)
      : null;

  const scenePayload = readRecord((input as ScannerResult & { scenePayload?: unknown }).scenePayload);
  const payloadObjects = Array.isArray(scenePayload.objects)
    ? (scenePayload.objects as Array<Record<string, unknown>>).filter(
        (object): object is Record<string, unknown> & { id: string } => typeof object?.id === "string"
      )
    : Array.isArray(n.objects)
      ? n.objects.filter((object): object is SceneObject & { id: string } => typeof object?.id === "string")
      : [];

  if (sceneJson && payloadObjects.length > 0) {
    const payloadMap = new Map<
      string,
      { emphasis?: number; reason?: string | null }
    >(
      payloadObjects.map((object) => [
        object.id,
        {
          emphasis: typeof object.emphasis === "number" ? object.emphasis : 0,
          reason: typeof object.reason === "string" ? object.reason : null,
        },
      ])
    );

    const scene = sceneJson.scene;
    if (scene && Array.isArray(scene.objects)) {
      scene.objects = scene.objects.map((obj) => {
        const hit = payloadMap.get(obj.id);

        if (hit) {
          return {
            ...obj,
            scanner_highlighted: true,
            scanner_emphasis: hit.emphasis ?? 0,
            scanner_reason: hit.reason ?? null,
          } as unknown as SceneObject;
        }

        return {
          ...obj,
          scanner_highlighted: false,
          scanner_emphasis: 0,
          scanner_reason: null,
        } as unknown as SceneObject;
      });
    }
  }

  return {
    format: "nexora_project_file",
    version: "1",
    nexora_version: "scanner-bridge-v1",
    exported_at: nowIso(),
    project: {
      id: pid,
      name: String(n.project?.name ?? pid),
      domain: n.project?.domain,
      description: n.project?.description,
      source: {
        type: n.source.type,
        id: n.source.id,
        uri: n.source.uri,
        label: n.source.label,
      },
    },
    scene: {
      sceneJson,
      loops: { list: loops },
    },
    semantics: n.semanticObjectMeta,
    intelligence: {
      ...createEmptyProjectState(pid, String(n.project?.name ?? pid)).intelligence,
      riskPropagation: n.riskSeed ?? null,
      strategicAdvice: n.adviceSeed ?? null,
      responseData: {
        scanner_hints: n.intelligenceHints ?? null,
        scanner_source: n.source,
        scanner_metadata: n.metadata ?? null,
        timeline_seed: n.timelineSeed ?? null,
      },
    },
    scanner: {
      lastMode: n.mode,
      lastSource: {
        type: n.source.type,
        id: n.source.id,
        uri: n.source.uri,
        label: n.source.label,
      },
      confidence: typeof n.confidence === "number" ? n.confidence : undefined,
      warnings: n.warnings,
      unresolvedItems: n.unresolvedItems,
      lastScannedAt: nowIso(),
      mode: n.mode,
      source: n.source,
    },
    relations,
    loops,
    warnings: n.warnings,
  };
}

export function exportProjectFile(project: WorkspaceProjectState): ExportResult {
  const p = project ?? createEmptyProjectState(DEFAULT_PROJECT_ID, "Default Project");
  const file: NexoraProjectFile = {
    format: "nexora_project_file",
    version: "1",
    nexora_version: "nexora-workspace-v1",
    exported_at: nowIso(),
    project: {
      id: slugifyId(p.id),
      name: p.name || p.id,
      domain: p.domain,
      description: p.description,
      source: p.scanner?.lastSource,
      updated_at: nowIso(),
    },
    scene: {
      sceneJson: p.scene.sceneJson,
      selection: {
        selectedObjectId: p.scene.selectedObjectId,
        focusedId: p.scene.focusedId,
        focusMode: p.scene.focusMode,
        focusPinned: p.scene.focusPinned,
      },
      loops: {
        activeLoopId: p.scene.activeLoopId,
        selectedLoopId: p.scene.selectedLoopId,
        list: p.scene.loops,
      },
      overrides: {
        objectUxById: p.scene.objectUxById,
        overrides: p.scene.overrides,
      },
    },
    semantics: p.semanticObjectMeta,
    intelligence: p.intelligence,
    history: {
      messages: p.chat.messages,
      activeMode: p.chat.activeMode,
      episodeId: p.chat.episodeId,
    },
    scanner: p.scanner,
    relations: Array.isArray(p.scene.sceneJson?.scene?.relations) ? p.scene.sceneJson.scene.relations : [],
    loops: Array.isArray(p.scene.loops) ? p.scene.loops : [],
  };
  return { ok: true, file, warnings: [] };
}

export function parseImportedProjectFile(raw: unknown): {
  file: NexoraProjectFile | null;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  const input = readRecord(raw);

  if (isNexoraProjectFile(raw)) {
    const file = raw as NexoraProjectFile;
    if (file.version !== "1") warnings.push(`Unsupported file version '${file.version}', attempting best-effort import.`);
    return { file, warnings, errors };
  }

  if (input.mode === "create" || input.mode === "enrich") {
    const source = readRecord(input.source);
    if (source && Object.keys(source).length > 0) {
      const bridged = scannerResultToProjectFile(raw as ScannerResult);
      if (!bridged) {
        errors.push("Invalid scanner result payload.");
        return { file: null, warnings, errors };
      }
      warnings.push("Imported scanner result via scanner bridge.");
      return { file: bridged, warnings, errors };
    }
  }

  if (raw && typeof raw === "object" && String(input.version ?? "") === "1" && ("sceneJson" in input || "activeMode" in input)) {
    warnings.push("Imported legacy project format v1.");
    return { file: normalizeLegacyProjectFile(raw as LegacyProjectFileV1), warnings, errors };
  }

  errors.push("Unsupported project file format.");
  return { file: null, warnings, errors };
}

export function importProjectFileToWorkspace(
  workspace: WorkspaceState,
  inputFile: NexoraProjectFile,
  opts?: { activate?: boolean; collision?: "rename" | "overwrite" }
): ImportResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const projects = workspace?.projects && typeof workspace.projects === "object" ? { ...workspace.projects } : {};
  const collisionMode = opts?.collision ?? "rename";
  const activate = opts?.activate !== false;

  const baseId = slugifyId(String(inputFile?.project?.id ?? DEFAULT_PROJECT_ID));
  const projectId =
    collisionMode === "overwrite" ? baseId : nextAvailableProjectId(baseId, projects as Record<string, WorkspaceProjectState>);
  const created = !projects[projectId];
  if (!created && collisionMode === "overwrite") warnings.push(`Overwrote existing project '${projectId}'.`);
  if (projectId !== baseId) warnings.push(`Project id collision detected. Imported as '${projectId}'.`);

  const base = createEmptyProjectState(projectId, String(inputFile?.project?.name ?? projectId));
  const sceneJson = (inputFile?.scene?.sceneJson ?? null) as SceneJson | null;
  const loopsFromFile = Array.isArray(inputFile?.scene?.loops?.list)
    ? inputFile.scene.loops.list
    : Array.isArray(inputFile?.loops)
    ? inputFile.loops
    : [];

  const importedProject: WorkspaceProjectState = {
    ...base,
    id: projectId,
    name: String(inputFile?.project?.name ?? base.name),
    domain: typeof inputFile?.project?.domain === "string" ? inputFile.project.domain : undefined,
    description: typeof inputFile?.project?.description === "string" ? inputFile.project.description : undefined,
    semanticObjectMeta:
      inputFile?.semantics && typeof inputFile.semantics === "object" ? inputFile.semantics : base.semanticObjectMeta,
    scene: {
      ...base.scene,
      sceneJson,
      selectedObjectId: inputFile?.scene?.selection?.selectedObjectId ?? null,
      focusedId: inputFile?.scene?.selection?.focusedId ?? null,
      focusMode: inputFile?.scene?.selection?.focusMode === "selected" ? "selected" : "all",
      focusPinned: !!inputFile?.scene?.selection?.focusPinned,
      activeLoopId: inputFile?.scene?.loops?.activeLoopId ?? null,
      selectedLoopId: inputFile?.scene?.loops?.selectedLoopId ?? null,
      loops: loopsFromFile as WorkspaceProjectState["scene"]["loops"],
      objectUxById:
        inputFile?.scene?.overrides?.objectUxById && typeof inputFile.scene.overrides.objectUxById === "object"
          ? inputFile.scene.overrides.objectUxById
          : {},
      overrides:
        inputFile?.scene?.overrides?.overrides && typeof inputFile.scene.overrides.overrides === "object"
          ? inputFile.scene.overrides.overrides
          : {},
    },
    intelligence: {
      ...base.intelligence,
      ...(inputFile?.intelligence && typeof inputFile.intelligence === "object" ? inputFile.intelligence : {}),
      conflicts: Array.isArray(inputFile?.intelligence?.conflicts)
        ? inputFile.intelligence.conflicts
        : [],
    },
    chat: {
      ...base.chat,
      messages: Array.isArray(inputFile?.history?.messages) ? inputFile.history.messages : [],
      activeMode: typeof inputFile?.history?.activeMode === "string" ? inputFile.history.activeMode : "business",
      episodeId: typeof inputFile?.history?.episodeId === "string" ? inputFile.history.episodeId : null,
    },
    scanner:
      inputFile?.scanner && typeof inputFile.scanner === "object"
        ? {
            ...inputFile.scanner,
            lastSource: inputFile.scanner?.lastSource,
          }
        : base.scanner,
  };

  const nextWorkspace: WorkspaceState = {
    id: workspace?.id || "default_workspace",
    activeProjectId: activate ? projectId : workspace?.activeProjectId || projectId,
    projects: {
      ...projects,
      [projectId]: importedProject,
    },
  };

  return {
    ok: errors.length === 0,
    project: importedProject,
    workspace: nextWorkspace,
    activeProjectId: nextWorkspace.activeProjectId,
    created,
    warnings,
    errors,
  };
}
