/** WS-7:2 — Canonical Decision Workspace Registry surface. */
import { DecisionWorkspaceV7CapabilityRegistry } from "./decisionWorkspaceV7CapabilityRegistry.ts";
import { DecisionWorkspaceV7ConstraintImpactRegistry } from "./decisionWorkspaceV7ConstraintImpactRegistry.ts";
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";
import { DecisionWorkspaceV7GovernanceRegistry } from "./decisionWorkspaceV7GovernanceRegistry.ts";
import { DecisionWorkspaceV7IdentityRegistry } from "./decisionWorkspaceV7IdentityRegistry.ts";
import { DecisionWorkspaceV7OptionRegistry } from "./decisionWorkspaceV7OptionRegistry.ts";
import { DecisionWorkspaceV7TaxonomyRegistry } from "./decisionWorkspaceV7TaxonomyRegistry.ts";

export const DecisionWorkspaceV7Registry = Object.freeze({
  identity: DecisionWorkspaceV7IdentityRegistry,
  foundation: DecisionWorkspaceV7Foundation,
  taxonomy: DecisionWorkspaceV7TaxonomyRegistry,
  constraints: DecisionWorkspaceV7ConstraintImpactRegistry.constraintTypes,
  impacts: DecisionWorkspaceV7ConstraintImpactRegistry.impactDomains,
  optionTypes: DecisionWorkspaceV7OptionRegistry,
  capabilities: DecisionWorkspaceV7CapabilityRegistry,
  responsibilities:
    DecisionWorkspaceV7GovernanceRegistry.responsibilities,
  lifecycle: DecisionWorkspaceV7GovernanceRegistry.lifecycle,
  boundaries: DecisionWorkspaceV7GovernanceRegistry.boundaries,
  inventory: Object.freeze({
    categoryCount: DecisionWorkspaceV7TaxonomyRegistry.categories.length,
    typeCount: DecisionWorkspaceV7TaxonomyRegistry.types.length,
    statusCount: DecisionWorkspaceV7TaxonomyRegistry.statuses.length,
    priorityCount: DecisionWorkspaceV7TaxonomyRegistry.priorities.length,
    confidenceCount:
      DecisionWorkspaceV7TaxonomyRegistry.confidenceLevels.length,
    constraintCount:
      DecisionWorkspaceV7ConstraintImpactRegistry.constraintTypes.length,
    impactCount:
      DecisionWorkspaceV7ConstraintImpactRegistry.impactDomains.length,
    optionTypeCount: DecisionWorkspaceV7OptionRegistry.length,
    capabilityCount: DecisionWorkspaceV7CapabilityRegistry.length,
    responsibilityCount:
      DecisionWorkspaceV7GovernanceRegistry.responsibilities.length,
    lifecycleCount: DecisionWorkspaceV7GovernanceRegistry.lifecycle.length,
    boundaryCount: DecisionWorkspaceV7GovernanceRegistry.boundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-7:1 Decision Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Registry"]),
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "WS-7:3 — Decision Workspace Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  aiReasoning: false,
  decisionGeneration: false,
  decisionExecution: false,
  optimization: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
