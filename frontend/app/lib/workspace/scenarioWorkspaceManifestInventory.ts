/** WS-5:5 — Canonical inventory obtained exclusively through Validation. */
import { ScenarioWorkspaceManifestIdentity } from "./scenarioWorkspaceManifestIdentity.ts";
import { ScenarioWorkspaceValidation } from "./scenarioWorkspaceValidation.ts";

const foundation = ScenarioWorkspaceValidation.foundation;
const registry = ScenarioWorkspaceValidation.registry;
const model = ScenarioWorkspaceValidation.model;
const identities = Object.freeze([
  foundation.identity,
  registry.identity,
  model.identity,
  ScenarioWorkspaceValidation.identity,
  ScenarioWorkspaceManifestIdentity,
]);

export const ScenarioWorkspaceManifestInventory = Object.freeze({
  identityInventory: Object.freeze({
    workspaceIdentity: foundation.identity,
    foundationIdentity: foundation.identity,
    registryIdentity: registry.identity,
    modelIdentity: model.identity,
    validationIdentity: ScenarioWorkspaceValidation.identity,
    manifestIdentity: ScenarioWorkspaceManifestIdentity,
  }),
  identities,
  namespaceChain: Object.freeze([
    foundation.identity.namespace,
    registry.identity.namespace,
    model.identity.namespace,
    ScenarioWorkspaceValidation.identity.namespace,
    ScenarioWorkspaceManifestIdentity.namespace,
  ]),
  versionChain: Object.freeze([
    foundation.identity.version,
    registry.identity.version,
    model.identity.version,
    ScenarioWorkspaceValidation.identity.version,
    ScenarioWorkspaceManifestIdentity.version,
  ]),
  readinessChain: Object.freeze([
    foundation.readiness,
    registry.readiness,
    model.readiness,
    ScenarioWorkspaceValidation.readiness,
    ScenarioWorkspaceManifestIdentity.readiness,
  ]),
  responsibilities: registry.responsibilities,
  capabilities: registry.capabilities,
  scenarioTypes: registry.scenarioTypes,
  lifecycle: registry.lifecycle,
  contracts: registry.contracts,
  boundaries: registry.boundaries,
  domainModels: model.domainModels,
  relationships: model.relationships,
  compositions: model.compositions,
  metadataModels: model.metadataModels,
  validationCategories: ScenarioWorkspaceValidation.categories,
  validationTargets: ScenarioWorkspaceValidation.targets,
  validationRules: ScenarioWorkspaceValidation.rules,
  validationOutcomes: ScenarioWorkspaceValidation.outcomes,
  validationSeverities: ScenarioWorkspaceValidation.severities,
  validationGates: ScenarioWorkspaceValidation.gates,
  validationSummary: ScenarioWorkspaceValidation.summary,
  counts: Object.freeze({
    identityCount: identities.length,
    responsibilityCount: registry.responsibilities.length,
    capabilityCount: registry.capabilities.length,
    scenarioTypeCount: registry.scenarioTypes.length,
    lifecycleCount: registry.lifecycle.length,
    contractCount: registry.contracts.length,
    boundaryCount: registry.boundaries.length,
    domainModelCount: model.domainModels.length,
    relationshipCount: model.relationships.length,
    compositionCount: model.compositions.length,
    metadataModelCount: model.metadataModels.length,
    validationCategoryCount: ScenarioWorkspaceValidation.categories.length,
    validationTargetCount: ScenarioWorkspaceValidation.targets.length,
    validationRuleCount: ScenarioWorkspaceValidation.rules.length,
    validationOutcomeCount: ScenarioWorkspaceValidation.outcomes.length,
    validationSeverityCount: ScenarioWorkspaceValidation.severities.length,
    validationGateCount: ScenarioWorkspaceValidation.gates.length,
  }),
  source: ScenarioWorkspaceValidation,
  canonicalInventoryRuleSatisfied: true,
  derived: true,
  immutable: true,
} as const);
