import { getOverlayRuntimeVisibility } from "../overlay/overlayRuntime";
import { readSceneRelationships } from "../relationships/relationshipRuntime";
import { readSystemBlueprint } from "../systemModeling/systemModelRuntime";
import { readPropagationPaths } from "../propagation/propagationAuthoringRuntime";
import { captureActiveScenarioSnapshot, readScenarioWorkspaceState } from "../scenario/scenarioAuthoringRuntime";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes";
import { vectorToPlacementPosition, type SceneObjectPlacement } from "../modeling/objectPlacementRuntime";
import { readStoredHudPreferences } from "../ui/hudPreferencesStore";
import { getWorkspaceViewMode } from "../workspace/workspaceViewModeRuntime";
import { getExecutiveFocusModeSnapshot } from "../workspace/executiveFocusModeRuntime";
import { readStoredThemeMode } from "../ui/nexoraUiTheme";
import { readStoredWorkspaceLayoutPreset } from "../ui/workspaceLayoutStore";
import type {
  SavedWorkspace,
  SavedWorkspaceObject,
  SavedWorkspaceRelationship,
  SavedWorkspaceViewPreferences,
  SaveWorkspaceRequest,
  SerializedWorkspaceEnvelope,
} from "./workspacePersistenceTypes";
import { getWorkspacePersistenceVersion } from "./workspaceVersioning";
import { logWorkspaceSerialized } from "./workspacePersistenceInstrumentation";

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function sceneObjects(scene: SceneJson): SceneObject[] {
  return Array.isArray(scene.scene.objects) ? scene.scene.objects : [];
}

function objectPosition(object: SceneObject): Vector3Tuple | undefined {
  const pos = object.position ?? (object as { pos?: Vector3Tuple }).pos;
  if (!Array.isArray(pos) || pos.length < 3) return undefined;
  return [Number(pos[0]) || 0, Number(pos[1]) || 0, Number(pos[2]) || 0];
}

function objectPlacement(object: SceneObject): SceneObjectPlacement | undefined {
  const position = objectPosition(object);
  if (!position) return undefined;
  return {
    id: String(object.id ?? "").trim(),
    objectType: String(object.type ?? object.role ?? object.category ?? "object"),
    position: vectorToPlacementPosition(position),
    scale: typeof object.scale === "number" ? object.scale : undefined,
  };
}

function objectCategory(object: SceneObject): string | undefined {
  const category = object.category ?? object.semantic?.category;
  return category ? String(category) : undefined;
}

export function collectCurrentViewPreferences(): SavedWorkspaceViewPreferences {
  const focus = getExecutiveFocusModeSnapshot();
  return {
    themeMode: readStoredThemeMode(),
    layoutPreset: readStoredWorkspaceLayoutPreset(),
    overlayVisibility: getOverlayRuntimeVisibility(),
    hudPreferences: readStoredHudPreferences(),
    workspaceViewMode: getWorkspaceViewMode(),
    focusModeEnabled: focus.enabled,
    focusProfile: focus.profile,
  };
}

export function serializeWorkspaceObject(object: SceneObject): SavedWorkspaceObject {
  const meta = (object.meta as Record<string, unknown> | undefined) ?? {};
  const placement = objectPlacement(object);
  return {
    id: String(object.id ?? "").trim(),
    label: String(object.label ?? object.name ?? object.id ?? "").trim(),
    category: objectCategory(object),
    position: placement?.position,
    placement,
    metadata: {
      ...meta,
      type: object.type,
      role: object.role,
      scale: object.scale,
      emphasis: object.emphasis,
      description: object.description,
      business_meaning: object.business_meaning,
      status: object.status,
      importance: object.importance,
      riskLevel: object.riskLevel,
      risk_level: object.risk_level,
      tags: object.tags,
      semantic: object.semantic,
      ux: object.ux,
      domain: object.domain,
    },
  };
}

export function serializeWorkspaceRelationship(
  relationship: ReturnType<typeof readSceneRelationships>[number]
): SavedWorkspaceRelationship {
  return {
    id: relationship.id,
    sourceId: relationship.sourceId,
    targetId: relationship.targetId,
    type: relationship.type,
    direction: relationship.direction,
    metadata: relationship.metadata,
  };
}

export function resolveDefaultWorkspaceName(sceneJson: unknown): string {
  const blueprint = readSystemBlueprint(sceneJson);
  if (blueprint?.templateName) return blueprint.templateName;
  const domain = (sceneJson as SceneJson | null)?.meta?.domain;
  if (typeof domain === "string" && domain.trim()) return `${domain.trim()} Workspace`;
  return `Executive Workspace ${new Date().toLocaleDateString()}`;
}

export function serializeWorkspace(request: SaveWorkspaceRequest): SerializedWorkspaceEnvelope | null {
  if (!isSceneJson(request.sceneJson)) return null;

  const scenarioScene = captureActiveScenarioSnapshot(request.sceneJson);
  const now = new Date().toISOString();
  const objects = sceneObjects(scenarioScene).map(serializeWorkspaceObject).filter((item) => item.id);
  const relationships = readSceneRelationships(scenarioScene).map(serializeWorkspaceRelationship);
  const propagationPaths = readPropagationPaths(scenarioScene);
  const scenarios = readScenarioWorkspaceState(scenarioScene);
  const blueprint = readSystemBlueprint(scenarioScene);
  const workspaceId = `ws_${Date.now().toString(36)}`;
  const name = (request.name ?? resolveDefaultWorkspaceName(request.sceneJson)).trim() || "Executive Workspace";

  const workspace: SavedWorkspace = {
    id: workspaceId,
    name,
    version: getWorkspacePersistenceVersion(),
    createdAt: now,
    updatedAt: now,
    objects,
    relationships,
    propagationPaths,
    scenarios,
    metadata: {
      source: "executive_workspace",
      templateId: blueprint?.templateId ?? null,
      templateName: blueprint?.templateName ?? null,
      activeDomainTemplate: scenarioScene.meta?.activeDomainTemplate ?? null,
      systemBlueprint: blueprint ?? null,
      objectCount: objects.length,
      relationshipCount: relationships.length,
      propagationPathCount: propagationPaths.length,
      scenarioCount: scenarios.scenarios.length,
      activeScenarioId: scenarios.activeScenarioId,
    },
    viewPreferences: request.viewPreferences ?? collectCurrentViewPreferences(),
  };

  logWorkspaceSerialized({
    workspaceId: workspace.id,
    objectCount: objects.length,
    relationshipCount: relationships.length,
  });

  return {
    schemaVersion: getWorkspacePersistenceVersion(),
    workspace,
  };
}

export function serializeWorkspaceForUpdate(
  existing: SavedWorkspace,
  request: SaveWorkspaceRequest
): SerializedWorkspaceEnvelope | null {
  const envelope = serializeWorkspace(request);
  if (!envelope) return null;
  return {
    schemaVersion: envelope.schemaVersion,
    workspace: {
      ...envelope.workspace,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      name: (request.name ?? existing.name).trim() || existing.name,
    },
  };
}
