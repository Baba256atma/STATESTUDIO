/** WS-4:8 — Canonical frozen surface for Public Index. */
import { DecisionWorkspaceCertification } from "./decisionWorkspaceCertification.ts";
import { DecisionWorkspaceFreezeCompatibility } from "./decisionWorkspaceFreezeCompatibility.ts";
import { DecisionWorkspaceFreezeExtensions } from "./decisionWorkspaceFreezeExtensions.ts";
import { DecisionWorkspaceFreezeIdentity } from "./decisionWorkspaceFreezeIdentity.ts";
import { DecisionWorkspaceFreezeInventory } from "./decisionWorkspaceFreezeInventory.ts";
import { DecisionWorkspaceFreezeLock } from "./decisionWorkspaceFreezeLock.ts";
import { DecisionWorkspaceFreezePublicApi } from "./decisionWorkspaceFreezePublicApi.ts";

export const DecisionWorkspaceFreeze = Object.freeze({
  identity: DecisionWorkspaceFreezeIdentity,
  certification: DecisionWorkspaceCertification,
  inventory: DecisionWorkspaceFreezeInventory,
  compatibility: DecisionWorkspaceFreezeCompatibility,
  extensions: DecisionWorkspaceFreezeExtensions,
  lock: DecisionWorkspaceFreezeLock,
  publicApi: DecisionWorkspaceFreezePublicApi,
  summary: Object.freeze({
    freezeStatus: "Frozen",
    certificationStatus: "Certified",
    releaseStatus: "Released",
    architectureLock: DecisionWorkspaceFreezeLock.id,
    readiness: "ReadyForPublicIndex",
    inventoryEntryCount: Object.keys(
      DecisionWorkspaceFreezeInventory,
    ).length,
    compatibilityCount: DecisionWorkspaceFreezeCompatibility.length,
    extensionCount: DecisionWorkspaceFreezeExtensions.length,
    publicApiCount: DecisionWorkspaceFreezePublicApi.length,
  }),
  status: "Frozen",
  releaseStatus: "Released",
  readiness: "ReadyForPublicIndex",
  upstreamDependencies: Object.freeze([
    "WS-4:7 Decision Workspace Certification",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceFreeze"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  decisionExecution: false,
  workflowExecution: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  networking: false,
  rendering: false,
  aiBehavior: false,
  orchestration: false,
} as const);
