/**
 * EIL-7 — Integration Governance Package Entry.
 *
 * Sole supported public export surface for Integration Governance
 * Foundation, Registry, Model, Validation, Manifest, Platform,
 * Certification, and Freeze phases. Consumers must import only this module.
 *
 * Ownership: EIL-7 Integration Governance package.
 */

export {
  IntegrationGovernanceFoundationCapabilities,
  IntegrationGovernanceFoundationCapabilityCatalog,
} from "./integrationGovernanceCapabilities.ts";
export { IntegrationGovernanceComplianceCategories } from "./integrationGovernanceComplianceCategories.ts";
export {
  IntegrationGovernanceFoundationContractNames,
  IntegrationGovernanceFoundationContracts,
} from "./integrationGovernanceContracts.ts";
export { IntegrationGovernanceFoundationDomains } from "./integrationGovernanceDomains.ts";
export {
  INTEGRATION_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES,
  IntegrationGovernanceFoundationLifecycle,
} from "./integrationGovernanceLifecycle.ts";
export { IntegrationGovernancePolicyCategories } from "./integrationGovernancePolicyCategories.ts";
export {
  IntegrationGovernanceFoundationCollections,
  IntegrationGovernanceFoundationId,
  IntegrationGovernanceFoundationIdentity,
  IntegrationGovernanceFoundationName,
  IntegrationGovernanceFoundationNamespace,
  IntegrationGovernanceFoundationPhaseId,
  IntegrationGovernanceFoundationPlatform,
  IntegrationGovernanceFoundationPlatformId,
  IntegrationGovernanceFoundationReadinessValue,
  IntegrationGovernanceFoundationStatusValue,
  IntegrationGovernanceFoundationSummary,
  IntegrationGovernanceFoundationVersion,
} from "./integrationGovernanceFoundation.ts";

export { IntegrationGovernanceCapabilityRegistry } from "./integrationGovernanceCapabilityRegistry.ts";
export { IntegrationGovernanceComplianceRegistry } from "./integrationGovernanceComplianceRegistry.ts";
export { IntegrationGovernanceContractRegistry } from "./integrationGovernanceContractRegistry.ts";
export { IntegrationGovernanceDomainRegistry } from "./integrationGovernanceDomainRegistry.ts";
export { IntegrationGovernanceLifecycleRegistry } from "./integrationGovernanceLifecycleRegistry.ts";
export { IntegrationGovernancePolicyRegistry } from "./integrationGovernancePolicyRegistry.ts";
export {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryCanonicalId,
  IntegrationGovernanceRegistryIdentity,
  IntegrationGovernanceRegistryInventory,
  IntegrationGovernanceRegistryName,
  IntegrationGovernanceRegistryNamespace,
  IntegrationGovernanceRegistryPhaseId,
  IntegrationGovernanceRegistryReadiness,
  IntegrationGovernanceRegistryStatusValue,
  IntegrationGovernanceRegistryVersion,
} from "./integrationGovernanceRegistry.ts";

export { IntegrationGovernanceCapabilityModels } from "./integrationGovernanceCapabilityModels.ts";
export { IntegrationGovernanceComplianceModels } from "./integrationGovernanceComplianceModels.ts";
export { IntegrationGovernanceContractModels } from "./integrationGovernanceContractModels.ts";
export { IntegrationGovernanceDomainModels } from "./integrationGovernanceDomainModels.ts";
export { IntegrationGovernanceLifecycleModels } from "./integrationGovernanceLifecycleModels.ts";
export { IntegrationGovernancePolicyModels } from "./integrationGovernancePolicyModels.ts";
export {
  IntegrationGovernanceModel,
  IntegrationGovernanceModelCanonicalId,
  IntegrationGovernanceModelIdentity,
  IntegrationGovernanceModelInventory,
  IntegrationGovernanceModelName,
  IntegrationGovernanceModelNamespace,
  IntegrationGovernanceModelPhaseId,
  IntegrationGovernanceModelReadiness,
  IntegrationGovernanceModelStatusValue,
  IntegrationGovernanceModelVersion,
  IntegrationGovernanceRelationshipModels,
  IntegrationGovernanceRelationshipTypes,
} from "./integrationGovernanceModel.ts";

export { IntegrationGovernanceValidationCategories } from "./integrationGovernanceValidationCategories.ts";
export { IntegrationGovernanceValidationGates } from "./integrationGovernanceValidationGates.ts";
export { IntegrationGovernanceValidationInventory } from "./integrationGovernanceValidationInventory.ts";
export {
  IntegrationGovernanceValidation,
  IntegrationGovernanceValidationCanonicalId,
  IntegrationGovernanceValidationIdentity,
  IntegrationGovernanceValidationName,
  IntegrationGovernanceValidationNamespace,
  IntegrationGovernanceValidationPhaseId,
  IntegrationGovernanceValidationReadiness,
  IntegrationGovernanceValidationReport,
  IntegrationGovernanceValidationStatusValue,
  IntegrationGovernanceValidationVersion,
} from "./integrationGovernanceValidation.ts";
export {
  IntegrationGovernanceValidationAggregateResult,
  IntegrationGovernanceValidationResults,
  IntegrationGovernanceValidationResultValues,
} from "./integrationGovernanceValidationResults.ts";
export { IntegrationGovernanceValidationRules } from "./integrationGovernanceValidationRules.ts";

export { IntegrationGovernanceManifestCompatibility } from "./integrationGovernanceManifestCompatibility.ts";
export { IntegrationGovernanceManifestDependencies } from "./integrationGovernanceManifestDependencies.ts";
export { IntegrationGovernanceManifestExports } from "./integrationGovernanceManifestExports.ts";
export { IntegrationGovernanceManifestGuarantees } from "./integrationGovernanceManifestGuarantees.ts";
export { IntegrationGovernanceManifestReadiness } from "./integrationGovernanceManifestReadiness.ts";
export {
  IntegrationGovernanceManifest,
  IntegrationGovernanceManifestCanonicalId,
  IntegrationGovernanceManifestIdentity,
  IntegrationGovernanceManifestName,
  IntegrationGovernanceManifestNamespace,
  IntegrationGovernanceManifestPhaseId,
  IntegrationGovernanceManifestReadinessValue,
  IntegrationGovernanceManifestStatusValue,
  IntegrationGovernanceManifestVersion,
} from "./integrationGovernanceManifest.ts";

export { IntegrationGovernancePlatformCapabilities } from "./integrationGovernancePlatformCapabilities.ts";
export { IntegrationGovernancePlatformCompatibility } from "./integrationGovernancePlatformCompatibility.ts";
export { IntegrationGovernancePlatformComposition } from "./integrationGovernancePlatformComposition.ts";
export { IntegrationGovernancePlatformDependencies } from "./integrationGovernancePlatformDependencies.ts";
export { IntegrationGovernancePlatformReadiness } from "./integrationGovernancePlatformReadiness.ts";
export {
  IntegrationGovernancePlatform,
  IntegrationGovernancePlatformCanonicalId,
  IntegrationGovernancePlatformIdentity,
  IntegrationGovernancePlatformName,
  IntegrationGovernancePlatformNamespace,
  IntegrationGovernancePlatformPhaseId,
  IntegrationGovernancePlatformReadinessValue,
  IntegrationGovernancePlatformStatusValue,
  IntegrationGovernancePlatformVersion,
} from "./integrationGovernancePlatform.ts";

export { IntegrationGovernanceCertificationCriteria } from "./integrationGovernanceCertificationCriteria.ts";
export { IntegrationGovernanceCertificationDependencies } from "./integrationGovernanceCertificationDependencies.ts";
export { IntegrationGovernanceCertificationGates } from "./integrationGovernanceCertificationGates.ts";
export { IntegrationGovernanceCertificationReadiness } from "./integrationGovernanceCertificationReadiness.ts";
export {
  IntegrationGovernanceCertificationAggregateResult,
  IntegrationGovernanceCertificationResults,
  IntegrationGovernanceCertificationResultValues,
} from "./integrationGovernanceCertificationResults.ts";
export {
  IntegrationGovernanceCertification,
  IntegrationGovernanceCertificationCanonicalId,
  IntegrationGovernanceCertificationIdentity,
  IntegrationGovernanceCertificationName,
  IntegrationGovernanceCertificationNamespace,
  IntegrationGovernanceCertificationPhaseId,
  IntegrationGovernanceCertificationReadinessValue,
  IntegrationGovernanceCertificationStatusValue,
  IntegrationGovernanceCertificationVersion,
} from "./integrationGovernanceCertification.ts";

export { IntegrationGovernanceFreezeArchitecture } from "./integrationGovernanceFreezeArchitecture.ts";
export { IntegrationGovernanceFreezeBaselines } from "./integrationGovernanceFreezeBaselines.ts";
export { IntegrationGovernanceFreezeCompatibility } from "./integrationGovernanceFreezeCompatibility.ts";
export { IntegrationGovernanceFreezeExtensions } from "./integrationGovernanceFreezeExtensions.ts";
export { IntegrationGovernanceFreezeLocks } from "./integrationGovernanceFreezeLocks.ts";
export {
  IntegrationGovernanceFreeze,
  IntegrationGovernanceFreezeCanonicalId,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
  IntegrationGovernanceFreezeName,
  IntegrationGovernanceFreezeNamespace,
  IntegrationGovernanceFreezePhaseId,
  IntegrationGovernanceFreezeReadinessValue,
  IntegrationGovernanceFreezeStatusValue,
  IntegrationGovernanceFreezeVersion,
} from "./integrationGovernanceFreeze.ts";
