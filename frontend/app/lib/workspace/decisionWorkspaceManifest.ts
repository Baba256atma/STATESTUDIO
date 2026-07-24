/** WS-4:5 — Canonical Manifest surface for Platform. */
import { DecisionWorkspaceManifestGuarantees } from "./decisionWorkspaceManifestGuarantees.ts";
import { DecisionWorkspaceManifestIdentity } from "./decisionWorkspaceManifestIdentity.ts";
import { DecisionWorkspaceManifestInventory } from "./decisionWorkspaceManifestInventory.ts";
import { DecisionWorkspaceManifestPublicApi } from "./decisionWorkspaceManifestPublicApi.ts";
import {
  DecisionWorkspaceManifestReadiness,
  DecisionWorkspaceManifestReadinessGates,
} from "./decisionWorkspaceManifestReadiness.ts";
import { DecisionWorkspaceManifestSources } from "./decisionWorkspaceManifestSources.ts";
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

export const DecisionWorkspaceManifest = Object.freeze({
  identity: DecisionWorkspaceManifestIdentity,
  validation: DecisionWorkspaceValidation,
  sources: DecisionWorkspaceManifestSources,
  inventory: DecisionWorkspaceManifestInventory,
  guarantees: DecisionWorkspaceManifestGuarantees,
  readinessGates: DecisionWorkspaceManifestReadinessGates,
  summary: DecisionWorkspaceManifestReadiness,
  publicApi: DecisionWorkspaceManifestPublicApi,
  status: "Manifest",
  readiness: "ReadyForPlatform",
  upstreamDependencies: Object.freeze([
    "WS-4:4 Decision Workspace Validation",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceManifest"]),
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  ui: false,
  validationEngine: false,
  aiBehavior: false,
  platformCompositionLogic: false,
  externalSideEffects: false,
} as const);
