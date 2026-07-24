/** WS-3:5 — Canonical inventory obtained exclusively through Validation. */
import { GoalWorkspaceValidation } from "./goalWorkspaceValidation.ts";
import { GoalWorkspaceManifestIdentity } from "./goalWorkspaceManifestIdentity.ts";
const foundation = GoalWorkspaceValidation.foundation;
const registry = GoalWorkspaceValidation.registry;
const model = GoalWorkspaceValidation.model;
const identities = Object.freeze([foundation.identity, registry.identity, model.identity,
  GoalWorkspaceValidation.identity, GoalWorkspaceManifestIdentity]);
export const GoalWorkspaceManifestInventory = Object.freeze({
  identities,
  namespaceChain: Object.freeze([foundation.identity.namespace, registry.identity.namespace,
    model.identity.namespace, GoalWorkspaceValidation.identity.namespace,
    GoalWorkspaceManifestIdentity.namespace]),
  versionChain: Object.freeze([foundation.identity.version, registry.identity.version,
    model.identity.version, GoalWorkspaceValidation.identity.version,
    GoalWorkspaceManifestIdentity.version]),
  readinessChain: Object.freeze([foundation.readiness, registry.readiness, model.readiness,
    GoalWorkspaceValidation.readiness, GoalWorkspaceManifestIdentity.readiness]),
  responsibilities: registry.responsibilities, capabilities: registry.capabilities,
  goalTypes: registry.goalTypes, lifecycle: registry.lifecycle, contracts: registry.contracts,
  boundaries: registry.boundaries, domainModels: model.domainModels,
  relationships: model.relationships, compositions: model.compositions,
  metadataModels: model.metadataModels,
  validationCategories: GoalWorkspaceValidation.categories,
  validationTargets: GoalWorkspaceValidation.targets,
  validationRules: GoalWorkspaceValidation.rules,
  validationOutcomes: GoalWorkspaceValidation.outcomes,
  validationSeverities: GoalWorkspaceValidation.severities,
  validationGates: GoalWorkspaceValidation.gates,
  validationSummary: GoalWorkspaceValidation.summary,
  counts: Object.freeze({
    identityCount: identities.length, responsibilityCount: registry.responsibilities.length,
    capabilityCount: registry.capabilities.length, goalTypeCount: registry.goalTypes.length,
    lifecycleCount: registry.lifecycle.length, contractCount: registry.contracts.length,
    boundaryCount: registry.boundaries.length, domainModelCount: model.domainModels.length,
    relationshipCount: model.relationships.length, compositionCount: model.compositions.length,
    metadataModelCount: model.metadataModels.length,
    validationCategoryCount: GoalWorkspaceValidation.categories.length,
    validationTargetCount: GoalWorkspaceValidation.targets.length,
    validationRuleCount: GoalWorkspaceValidation.rules.length,
    validationOutcomeCount: GoalWorkspaceValidation.outcomes.length,
    validationSeverityCount: GoalWorkspaceValidation.severities.length,
    validationGateCount: GoalWorkspaceValidation.gates.length,
  }),
  source: GoalWorkspaceValidation, canonicalInventoryRuleSatisfied: true,
  derived: true, immutable: true,
} as const);
