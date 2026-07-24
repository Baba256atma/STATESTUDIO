/** WS-6:2 — Canonical Problem Workspace Registry surface for Model. */
import { ProblemWorkspaceAnalysisDomainRegistry } from "./problemWorkspaceAnalysisDomainRegistry.ts";
import { ProblemWorkspaceCapabilityRegistry } from "./problemWorkspaceCapabilityRegistry.ts";
import { ProblemWorkspaceEvidenceRegistry } from "./problemWorkspaceEvidenceRegistry.ts";
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";
import { ProblemWorkspaceGovernanceRegistry } from "./problemWorkspaceGovernanceRegistry.ts";
import { ProblemWorkspaceIdentityRegistry } from "./problemWorkspaceIdentityRegistry.ts";
import { ProblemWorkspaceTaxonomyRegistry } from "./problemWorkspaceTaxonomyRegistry.ts";

export const ProblemWorkspaceRegistry = Object.freeze({
  identity: ProblemWorkspaceIdentityRegistry,
  foundation: ProblemWorkspaceFoundation,
  taxonomy: ProblemWorkspaceTaxonomyRegistry,
  evidence: ProblemWorkspaceEvidenceRegistry,
  analysisDomains: ProblemWorkspaceAnalysisDomainRegistry,
  capabilities: ProblemWorkspaceCapabilityRegistry,
  responsibilities: ProblemWorkspaceGovernanceRegistry.responsibilities,
  lifecycle: ProblemWorkspaceGovernanceRegistry.lifecycle,
  contracts: ProblemWorkspaceGovernanceRegistry.contracts,
  boundaries: ProblemWorkspaceGovernanceRegistry.boundaries,
  inventory: Object.freeze({
    categoryCount: ProblemWorkspaceTaxonomyRegistry.categories.length,
    severityCount: ProblemWorkspaceTaxonomyRegistry.severities.length,
    statusCount: ProblemWorkspaceTaxonomyRegistry.statuses.length,
    evidenceTypeCount: ProblemWorkspaceEvidenceRegistry.evidenceTypes.length,
    constraintTypeCount:
      ProblemWorkspaceEvidenceRegistry.constraintTypes.length,
    assumptionTypeCount:
      ProblemWorkspaceEvidenceRegistry.assumptionTypes.length,
    impactDomainCount:
      ProblemWorkspaceAnalysisDomainRegistry.impactDomains.length,
    rootCauseDomainCount:
      ProblemWorkspaceAnalysisDomainRegistry.rootCauseDomains.length,
    capabilityCount: ProblemWorkspaceCapabilityRegistry.length,
    responsibilityCount:
      ProblemWorkspaceGovernanceRegistry.responsibilities.length,
    lifecycleCount: ProblemWorkspaceGovernanceRegistry.lifecycle.length,
    contractCount: ProblemWorkspaceGovernanceRegistry.contracts.length,
    boundaryCount: ProblemWorkspaceGovernanceRegistry.boundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-6:1 Problem Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceRegistry"]),
  readiness: "ReadyForModel",
  nextPhase: "WS-6:3 — Problem Workspace Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  reasoning: false,
  ai: false,
  orchestration: false,
  workflow: false,
  persistence: false,
  visualization: false,
  execution: false,
  businessLogic: false,
} as const);
