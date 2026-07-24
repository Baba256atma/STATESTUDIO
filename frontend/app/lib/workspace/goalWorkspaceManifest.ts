/** WS-3:5 — Canonical Manifest surface for Platform. */
import { GoalWorkspaceManifestGuarantees } from "./goalWorkspaceManifestGuarantees.ts";
import { GoalWorkspaceManifestIdentity } from "./goalWorkspaceManifestIdentity.ts";
import { GoalWorkspaceManifestInventory } from "./goalWorkspaceManifestInventory.ts";
import { GoalWorkspaceManifestPublicApi } from "./goalWorkspaceManifestPublicApi.ts";
import { GoalWorkspaceManifestReadiness,
  GoalWorkspaceManifestReadinessGates } from "./goalWorkspaceManifestReadiness.ts";
import { GoalWorkspaceManifestSources } from "./goalWorkspaceManifestSources.ts";
import { GoalWorkspaceValidation } from "./goalWorkspaceValidation.ts";

export const GoalWorkspaceManifest = Object.freeze({
  identity: GoalWorkspaceManifestIdentity, validation: GoalWorkspaceValidation,
  sources: GoalWorkspaceManifestSources, inventory: GoalWorkspaceManifestInventory,
  guarantees: GoalWorkspaceManifestGuarantees,
  readinessGates: GoalWorkspaceManifestReadinessGates,
  summary: GoalWorkspaceManifestReadiness,
  publicApi: GoalWorkspaceManifestPublicApi,
  status: "Manifest", readiness: "ReadyForPlatform",
  upstreamDependencies: Object.freeze(["WS-3:4 Goal Workspace Validation"]),
  publicApiSurface: Object.freeze(["GoalWorkspaceManifest"]),
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, businessLogic: false, persistence: false, ui: false,
  validationEngine: false, aiBehavior: false, platformCompositionLogic: false,
  externalSideEffects: false,
} as const);

