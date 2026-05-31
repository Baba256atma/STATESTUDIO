/** E2:27 — Executive workspace persistence contracts. */

import type { OverlayRuntimeVisibility } from "../overlay/overlayContracts";
import type { HudPreferences } from "../ui/hudPreferencesTypes";
import type { ThemeMode } from "../ui/nexoraUiTheme";
import type { WorkspaceLayoutPreset } from "../ui/workspaceLayoutTypes";
import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import type { FocusModeProfileId } from "../workspace/focusModeProfiles";
import type { Vector3Tuple } from "../sceneTypes";
import type { SceneObjectPlacement } from "../modeling/objectPlacementRuntime";
import type { PropagationPath } from "../propagation/propagationAuthoringRuntime";
import type { ScenarioWorkspaceState } from "../scenario/scenarioAuthoringRuntime";

export interface SavedWorkspaceObject {
  id: string;
  label: string;
  category?: string;
  position?: Vector3Tuple | SceneObjectPlacement["position"];
  placement?: SceneObjectPlacement;
  metadata?: Record<string, unknown>;
}

export interface SavedWorkspaceRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  direction: "uni" | "bi";
  metadata?: Record<string, unknown>;
}

export interface SavedWorkspaceViewPreferences {
  themeMode?: ThemeMode;
  layoutPreset?: WorkspaceLayoutPreset;
  overlayVisibility?: OverlayRuntimeVisibility;
  hudPreferences?: HudPreferences;
  workspaceViewMode?: WorkspaceViewMode;
  focusModeEnabled?: boolean;
  focusProfile?: FocusModeProfileId;
}

export interface SavedWorkspace {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  objects: SavedWorkspaceObject[];
  relationships: SavedWorkspaceRelationship[];
  propagationPaths?: PropagationPath[];
  scenarios?: ScenarioWorkspaceState;
  metadata?: Record<string, unknown>;
  viewPreferences?: SavedWorkspaceViewPreferences;
}

export type SavedWorkspaceSummary = {
  id: string;
  name: string;
  objectCount: number;
  relationshipCount: number;
  createdAt: string;
  updatedAt: string;
  version: string;
};

export type WorkspacePersistenceValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type SaveWorkspaceRequest = {
  sceneJson: unknown;
  name?: string;
  viewPreferences?: SavedWorkspaceViewPreferences;
};

export type SaveWorkspaceResult = {
  success: boolean;
  workspace?: SavedWorkspace;
  errors?: string[];
  warnings?: string[];
  durationMs?: number;
};

export type LoadWorkspaceResult = {
  success: boolean;
  workspace?: SavedWorkspace;
  nextScene?: import("../sceneTypes").SceneJson;
  viewPreferences?: SavedWorkspaceViewPreferences;
  errors?: string[];
  warnings?: string[];
  durationMs?: number;
};

export type SerializedWorkspaceEnvelope = {
  schemaVersion: string;
  workspace: SavedWorkspace;
};
