/**
 * S:1 — Scenario Draft Registry contract.
 *
 * Persists scenario drafts only. No simulation results or intelligence
 * mutation authority.
 */

import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";

export const SCENARIO_DRAFT_REGISTRY_DIAGNOSTIC = "[SCENARIO_DRAFT_REGISTRY]" as const;

export const SCENARIO_DRAFT_REGISTRY_READY_DIAGNOSTIC = "[SCENARIO_DRAFT_REGISTRY_READY]" as const;

export const S1_REGISTRY_COMPLETE_TAG = "[S1_REGISTRY_COMPLETE]" as const;

export const SCENARIO_DRAFT_REGISTRY_VERSION = "1.0.0" as const;

export type ScenarioDraftRegistryStatus = "active" | "archived";

export type ScenarioDraftRegistryEntry = Readonly<{
  draft: ScenarioDraft;
  registryStatus: ScenarioDraftRegistryStatus;
  archivedAt: string | null;
  draftsOnly: true;
  simulationActive: false;
  simulationResultsStored: false;
  dsMutation: false;
  intelligenceMutation: false;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  topologyMutation: false;
}>;

export type ScenarioDraftRegistrySnapshot = Readonly<{
  version: typeof SCENARIO_DRAFT_REGISTRY_VERSION;
  updatedAt: string | null;
  draftCount: number;
  activeCount: number;
  archivedCount: number;
  entries: readonly ScenarioDraftRegistryEntry[];
  draftsOnly: true;
  simulationActive: false;
  simulationResultsStored: false;
  dsMutation: false;
  intelligenceMutation: false;
}>;

export type ScenarioDraftRegistryPersistenceAdapter = Readonly<{
  load(): ScenarioDraftRegistrySnapshot | null;
  save(snapshot: ScenarioDraftRegistrySnapshot): void;
  clear(): void;
}>;

export type CreateScenarioDraftRegistryInput = Readonly<{
  draft: ScenarioDraft;
}>;

export type UpdateScenarioDraftRegistryInput = Readonly<{
  draftId: string;
  draft: ScenarioDraft;
}>;

export type ArchiveScenarioDraftRegistryInput = Readonly<{
  draftId: string;
}>;

export type ReadScenarioDraftRegistryInput = Readonly<{
  draftId: string;
  includeArchived?: boolean;
}>;

export type ScenarioDraftRegistryMutationReason =
  | "created"
  | "updated"
  | "archived"
  | "duplicate_draft"
  | "invalid_draft"
  | "simulation_payload_rejected"
  | "missing_draft_id"
  | "draft_not_found"
  | "already_archived"
  | "registry_integrity_failure";

export type ScenarioDraftRegistryMutationResult = Readonly<{
  success: boolean;
  entry: ScenarioDraftRegistryEntry | null;
  reason: ScenarioDraftRegistryMutationReason | string;
  registryIntegrityPreserved: boolean;
  draftsOnly: true;
  simulationActive: false;
  simulationResultsStored: false;
  dsMutation: false;
  intelligenceMutation: false;
}>;

export const SCENARIO_DRAFT_REGISTRY_DIAGNOSTICS = Object.freeze([
  SCENARIO_DRAFT_REGISTRY_DIAGNOSTIC,
  SCENARIO_DRAFT_REGISTRY_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_DRAFT_REGISTRY_SNAPSHOT: ScenarioDraftRegistrySnapshot = Object.freeze({
  version: SCENARIO_DRAFT_REGISTRY_VERSION,
  updatedAt: null,
  draftCount: 0,
  activeCount: 0,
  archivedCount: 0,
  entries: Object.freeze([]),
  draftsOnly: true,
  simulationActive: false,
  simulationResultsStored: false,
  dsMutation: false,
  intelligenceMutation: false,
});
