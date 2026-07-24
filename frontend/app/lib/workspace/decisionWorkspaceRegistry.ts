/** WS-4:2 — Canonical Decision Workspace Registry surface for Model. */
import { DecisionWorkspaceCapabilityRegistry } from "./decisionWorkspaceCapabilityRegistry.ts";
import { DecisionWorkspaceContractRegistry } from "./decisionWorkspaceContractRegistry.ts";
import { DecisionWorkspaceDecisionTypeRegistry } from "./decisionWorkspaceDecisionTypeRegistry.ts";
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import { DecisionWorkspaceIdentityRegistry } from "./decisionWorkspaceIdentityRegistry.ts";
import { DecisionWorkspaceLifecycleRegistry } from "./decisionWorkspaceLifecycleRegistry.ts";
import { DecisionWorkspaceResponsibilityRegistry } from "./decisionWorkspaceResponsibilityRegistry.ts";

const boundaries = Object.freeze(
  DecisionWorkspaceFoundation.boundaries.map((source, index) => Object.freeze({
    id: `WS-4:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    key: `boundary-${String(index + 1).padStart(2, "0")}`,
    name: `${source.prohibitedConcern} Boundary`,
    description: `Registers ${source.prohibitedConcern} as outside the Decision Workspace.`,
    registryCategory: "Boundary",
    source,
    sourcePhase: "WS-4:1",
    version: "1.0.0",
    stability: "Stable",
    ownership: "Decision Workspace",
    metadataOnly: true,
    immutable: true,
  })),
);

export const DecisionWorkspaceRegistry = Object.freeze({
  identity: DecisionWorkspaceIdentityRegistry,
  foundation: DecisionWorkspaceFoundation,
  responsibilities: DecisionWorkspaceResponsibilityRegistry,
  capabilities: DecisionWorkspaceCapabilityRegistry,
  decisionTypes: DecisionWorkspaceDecisionTypeRegistry,
  lifecycle: DecisionWorkspaceLifecycleRegistry,
  contracts: DecisionWorkspaceContractRegistry,
  boundaries,
  inventory: Object.freeze({
    responsibilityCount: DecisionWorkspaceResponsibilityRegistry.length,
    capabilityCount: DecisionWorkspaceCapabilityRegistry.length,
    decisionTypeCount: DecisionWorkspaceDecisionTypeRegistry.length,
    lifecycleCount: DecisionWorkspaceLifecycleRegistry.length,
    contractCount: DecisionWorkspaceContractRegistry.length,
    boundaryCount: boundaries.length,
    collectionCount: 6,
    derivedFromFoundation: true,
  }),
  rules: Object.freeze([
    "Unique Canonical Identifiers",
    "Deterministic Ordering",
    "Duplicate Registration Prevention",
    "Immutable Lookup Metadata",
    "Preserve Canonical Foundation Identities",
    "Metadata Only",
    "Implementation Independent",
  ]),
  readiness: "ReadyForModel",
  nextPhase: "WS-4:3 — Decision Workspace Model",
  upstreamDependencies: Object.freeze([
    "WS-4:1 Decision Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceRegistry"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  orchestration: false,
  aiBehavior: false,
} as const);
