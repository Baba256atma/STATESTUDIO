/** WS-4:5 — Canonical inventory obtained exclusively through Validation. */
import { DecisionWorkspaceManifestIdentity } from "./decisionWorkspaceManifestIdentity.ts";
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

const foundation = DecisionWorkspaceValidation.foundation;
const registry = DecisionWorkspaceValidation.registry;
const model = DecisionWorkspaceValidation.model;
const identities = Object.freeze([
  foundation.identity,
  registry.identity,
  model.identity,
  DecisionWorkspaceValidation.identity,
  DecisionWorkspaceManifestIdentity,
]);

export const DecisionWorkspaceManifestInventory = Object.freeze({
  identityInventory: Object.freeze({
    workspaceIdentity: foundation.identity,
    foundationIdentity: foundation.identity,
    registryIdentity: registry.identity,
    modelIdentity: model.identity,
    validationIdentity: DecisionWorkspaceValidation.identity,
    manifestIdentity: DecisionWorkspaceManifestIdentity,
  }),
  identities,
  namespaceChain: Object.freeze([
    foundation.identity.namespace,
    registry.identity.namespace,
    model.identity.namespace,
    DecisionWorkspaceValidation.identity.namespace,
    DecisionWorkspaceManifestIdentity.namespace,
  ]),
  versionChain: Object.freeze([
    foundation.identity.version,
    registry.identity.version,
    model.identity.version,
    DecisionWorkspaceValidation.identity.version,
    DecisionWorkspaceManifestIdentity.version,
  ]),
  readinessChain: Object.freeze([
    foundation.readiness,
    registry.readiness,
    model.readiness,
    DecisionWorkspaceValidation.readiness,
    DecisionWorkspaceManifestIdentity.readiness,
  ]),
  responsibilities: registry.responsibilities,
  capabilities: registry.capabilities,
  decisionTypes: registry.decisionTypes,
  lifecycle: registry.lifecycle,
  contracts: registry.contracts,
  boundaries: registry.boundaries,
  domainModels: model.domainModels,
  relationships: model.relationships,
  compositions: model.compositions,
  metadataModels: model.metadataModels,
  validationCategories: DecisionWorkspaceValidation.categories,
  validationTargets: DecisionWorkspaceValidation.targets,
  validationRules: DecisionWorkspaceValidation.rules,
  validationOutcomes: DecisionWorkspaceValidation.outcomes,
  validationSeverities: DecisionWorkspaceValidation.severities,
  validationGates: DecisionWorkspaceValidation.gates,
  validationSummary: DecisionWorkspaceValidation.summary,
  counts: Object.freeze({
    identityCount: identities.length,
    responsibilityCount: registry.responsibilities.length,
    capabilityCount: registry.capabilities.length,
    decisionTypeCount: registry.decisionTypes.length,
    lifecycleCount: registry.lifecycle.length,
    contractCount: registry.contracts.length,
    boundaryCount: registry.boundaries.length,
    domainModelCount: model.domainModels.length,
    relationshipCount: model.relationships.length,
    compositionCount: model.compositions.length,
    metadataModelCount: model.metadataModels.length,
    validationCategoryCount: DecisionWorkspaceValidation.categories.length,
    validationTargetCount: DecisionWorkspaceValidation.targets.length,
    validationRuleCount: DecisionWorkspaceValidation.rules.length,
    validationOutcomeCount: DecisionWorkspaceValidation.outcomes.length,
    validationSeverityCount: DecisionWorkspaceValidation.severities.length,
    validationGateCount: DecisionWorkspaceValidation.gates.length,
  }),
  source: DecisionWorkspaceValidation,
  canonicalInventoryRuleSatisfied: true,
  derived: true,
  immutable: true,
} as const);
