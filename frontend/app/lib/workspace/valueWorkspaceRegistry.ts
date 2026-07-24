/** WS-9:2 — Canonical Value Workspace Registry surface. */
import {
  ValueWorkspaceCapabilityRegistry,
} from "./valueWorkspaceCapabilityRegistry.ts";
import {
  ValueWorkspaceEvidenceImpactRegistry,
} from "./valueWorkspaceEvidenceImpactRegistry.ts";
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";
import {
  ValueWorkspaceGovernanceRegistry,
} from "./valueWorkspaceGovernanceRegistry.ts";
import {
  ValueWorkspaceIdentityRegistry,
} from "./valueWorkspaceIdentityRegistry.ts";
import {
  ValueWorkspaceOutcomeRoiRegistry,
} from "./valueWorkspaceOutcomeRoiRegistry.ts";
import {
  ValueWorkspaceTaxonomyRegistry,
} from "./valueWorkspaceTaxonomyRegistry.ts";

export const ValueWorkspaceRegistry = Object.freeze({
  identity: ValueWorkspaceIdentityRegistry,
  foundation: ValueWorkspaceFoundation,
  valueCategories: ValueWorkspaceTaxonomyRegistry.valueCategories,
  valueDimensions: ValueWorkspaceTaxonomyRegistry.valueDimensions,
  outcomeTypes: ValueWorkspaceOutcomeRoiRegistry.outcomeTypes,
  roiTypes: ValueWorkspaceOutcomeRoiRegistry.roiTypes,
  measurementTypes: ValueWorkspaceEvidenceImpactRegistry.measurementTypes,
  evidenceTypes: ValueWorkspaceEvidenceImpactRegistry.evidenceTypes,
  impactDomains: ValueWorkspaceEvidenceImpactRegistry.impactDomains,
  capabilities: ValueWorkspaceCapabilityRegistry,
  responsibilities: ValueWorkspaceGovernanceRegistry.responsibilities,
  lifecycle: ValueWorkspaceGovernanceRegistry.lifecycle,
  boundaries: ValueWorkspaceGovernanceRegistry.boundaries,
  inventory: Object.freeze({
    valueCategoryCount: ValueWorkspaceTaxonomyRegistry.valueCategories.length,
    valueDimensionCount: ValueWorkspaceTaxonomyRegistry.valueDimensions.length,
    outcomeTypeCount: ValueWorkspaceOutcomeRoiRegistry.outcomeTypes.length,
    roiTypeCount: ValueWorkspaceOutcomeRoiRegistry.roiTypes.length,
    measurementTypeCount:
      ValueWorkspaceEvidenceImpactRegistry.measurementTypes.length,
    evidenceTypeCount: ValueWorkspaceEvidenceImpactRegistry.evidenceTypes.length,
    impactDomainCount: ValueWorkspaceEvidenceImpactRegistry.impactDomains.length,
    capabilityCount: ValueWorkspaceCapabilityRegistry.length,
    responsibilityCount:
      ValueWorkspaceGovernanceRegistry.responsibilities.length,
    lifecycleCount: ValueWorkspaceGovernanceRegistry.lifecycle.length,
    boundaryCount: ValueWorkspaceGovernanceRegistry.boundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-9:1 Value Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspaceRegistry"]),
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "WS-9:3 — Value Workspace Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  valueCalculation: false,
  roiCalculation: false,
  financialAnalysis: false,
  aiReasoning: false,
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
