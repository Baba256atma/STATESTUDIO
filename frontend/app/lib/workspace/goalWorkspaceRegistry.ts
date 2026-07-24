/** WS-3:2 — Canonical Goal Workspace Registry surface for Model. */
import { GoalWorkspaceCapabilityRegistry } from "./goalWorkspaceCapabilityRegistry.ts";
import { GoalWorkspaceContractRegistry } from "./goalWorkspaceContractRegistry.ts";
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import { GoalWorkspaceGoalTypeRegistry } from "./goalWorkspaceGoalTypeRegistry.ts";
import { GoalWorkspaceIdentityRegistry } from "./goalWorkspaceIdentityRegistry.ts";
import { GoalWorkspaceLifecycleRegistry } from "./goalWorkspaceLifecycleRegistry.ts";
import { GoalWorkspaceResponsibilityRegistry } from "./goalWorkspaceResponsibilityRegistry.ts";

const boundaries = Object.freeze(GoalWorkspaceFoundation.boundaries.map((source, index) => Object.freeze({
  id: `WS-3:2/Boundary/${String(index + 1).padStart(2, "0")}`,
  key: `boundary-${String(index + 1).padStart(2, "0")}`,
  name: `${source.prohibitedConcern} Boundary`,
  description: `Registers ${source.prohibitedConcern} as outside the Goal Workspace.`,
  registryCategory: "Boundary", source, sourcePhase: "WS-3:1",
  version: "1.0.0", stability: "Stable", ownership: "Goal Workspace",
  metadataOnly: true, immutable: true,
})));

export const GoalWorkspaceRegistry = Object.freeze({
  identity: GoalWorkspaceIdentityRegistry,
  foundation: GoalWorkspaceFoundation,
  responsibilities: GoalWorkspaceResponsibilityRegistry,
  capabilities: GoalWorkspaceCapabilityRegistry,
  goalTypes: GoalWorkspaceGoalTypeRegistry,
  lifecycle: GoalWorkspaceLifecycleRegistry,
  contracts: GoalWorkspaceContractRegistry,
  boundaries,
  inventory: Object.freeze({
    responsibilityCount: GoalWorkspaceResponsibilityRegistry.length,
    capabilityCount: GoalWorkspaceCapabilityRegistry.length,
    goalTypeCount: GoalWorkspaceGoalTypeRegistry.length,
    lifecycleCount: GoalWorkspaceLifecycleRegistry.length,
    contractCount: GoalWorkspaceContractRegistry.length,
    boundaryCount: boundaries.length,
    collectionCount: 6,
    derivedFromFoundation: true,
  }),
  rules: Object.freeze([
    "Unique Canonical Identifiers", "Deterministic Ordering",
    "Duplicate Registration Prevention", "Immutable Lookup Metadata",
    "Metadata Only", "Implementation Independent",
  ]),
  readiness: "ReadyForModel",
  nextPhase: "WS-3:3 — Goal Workspace Model",
  upstreamDependencies: Object.freeze(["WS-3:1 Goal Workspace Foundation"]),
  publicApiSurface: Object.freeze(["GoalWorkspaceRegistry"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, businessLogic: false, persistence: false, ui: false, aiBehavior: false,
} as const);

