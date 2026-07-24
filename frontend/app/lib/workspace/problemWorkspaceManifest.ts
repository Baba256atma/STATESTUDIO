/** WS-6:5 — Canonical Problem Workspace Manifest surface for Platform. */
import { ProblemWorkspaceManifestGuarantees } from "./problemWorkspaceManifestGuarantees.ts";
import { ProblemWorkspaceManifestIdentity } from "./problemWorkspaceManifestIdentity.ts";
import { ProblemWorkspaceManifestInventory } from "./problemWorkspaceManifestInventory.ts";
import { ProblemWorkspaceManifestPublicApi } from "./problemWorkspaceManifestPublicApi.ts";
import { ProblemWorkspaceManifestReadiness } from "./problemWorkspaceManifestReadiness.ts";
import { ProblemWorkspaceManifestSources } from "./problemWorkspaceManifestSources.ts";
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

export const ProblemWorkspaceManifest = Object.freeze({
  identity: ProblemWorkspaceManifestIdentity,
  validation: ProblemWorkspaceValidation,
  sources: ProblemWorkspaceManifestSources,
  inventory: ProblemWorkspaceManifestInventory,
  guarantees: ProblemWorkspaceManifestGuarantees,
  readinessDeclaration: ProblemWorkspaceManifestReadiness,
  publicApi: ProblemWorkspaceManifestPublicApi,
  summary: Object.freeze({
    workspaceIdentity:
      ProblemWorkspaceValidation.foundation.identity,
    phaseIdentity: ProblemWorkspaceManifestIdentity.phaseId,
    canonicalId: ProblemWorkspaceManifestIdentity.id,
    namespace: ProblemWorkspaceManifestIdentity.namespace,
    version: ProblemWorkspaceManifestIdentity.version,
    layer: ProblemWorkspaceManifestIdentity.layer,
    status: "ReadyForPlatform",
    readiness: "ReadyForPlatform",
    architectureCompleteness: "Complete",
    inventoryTotals:
      ProblemWorkspaceManifestInventory.inventoryTotals,
  }),
  dependencyChain: ProblemWorkspaceManifestSources,
  upstreamDependencies: Object.freeze([
    "WS-6:4 Problem Workspace Validation",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceManifest"]),
  canonicalInventoryRuleSatisfied: true,
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  validationEngine: false,
  reasoning: false,
  problemSolving: false,
  workflow: false,
  persistence: false,
  visualization: false,
  orchestration: false,
  networking: false,
  rendering: false,
  stateManagement: false,
  businessLogic: false,
} as const);
