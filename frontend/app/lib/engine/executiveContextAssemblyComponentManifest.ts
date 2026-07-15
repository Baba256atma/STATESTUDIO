import {
  ExecutiveContextAssemblyCapabilities,
  ExecutiveContextAssemblyContracts,
  ExecutiveContextAssemblyDomains,
  ExecutiveContextAssemblyLifecycle,
} from "./executiveContextAssemblyFoundation.ts";
import {
  ExecutiveContextAssemblyModel,
  ExecutiveContextCompositionModel,
  ExecutiveContextDomainModel,
  ExecutiveContextMetadataModel,
  ExecutiveContextModel,
  ExecutiveContextSnapshotModel,
} from "./executiveContextAssemblyModel.ts";
import {
  ExecutiveContextCapabilityRegistry,
  ExecutiveContextDomainRegistry,
  ExecutiveContextLifecycleRegistry,
  ExecutiveContextOwnershipRegistry,
  ExecutiveContextSourceRegistry,
} from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";
import type {
  ExecutiveContextManifestComponent,
  ExecutiveContextManifestInventory,
} from "./executiveContextAssemblyManifestTypes.ts";

const component = (
  id: string,
  name: string,
  category: string,
  phaseId: ExecutiveContextManifestComponent["phaseId"],
  count: number,
  publicSurface: string,
  artifactReference: object,
) => Object.freeze({
  id, name, category, phaseId, count, owner: "ENG-4", publicSurface, artifactReference,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextManifestComponent);

const foundationHelpers = Object.freeze([
  "getExecutiveContextAssemblyFoundation", "getExecutiveContextAssemblyContracts",
  "getExecutiveContextAssemblyCapabilities", "getExecutiveContextAssemblyLifecycle",
  "getExecutiveContextAssemblyMetadata", "getExecutiveContextAssemblySummary",
] as const);
const registryHelpers = Object.freeze([
  "getExecutiveContextAssemblyRegistry", "getExecutiveContextDomainRegistry",
  "getExecutiveContextSourceRegistry", "getExecutiveContextCapabilityRegistry",
  "getExecutiveContextLifecycleRegistry", "getExecutiveContextOwnershipRegistry",
  "getExecutiveContextAssemblyRegistrySummary",
] as const);
const modelHelpers = Object.freeze([
  "getExecutiveContextAssemblyModel", "getExecutiveContextModel",
  "getExecutiveContextDomainModel", "getExecutiveContextSnapshotModel",
  "getExecutiveContextCompositionModel", "getExecutiveContextMetadataModel",
  "getExecutiveContextAssemblyModelSummary",
] as const);
const validationHelpers = Object.freeze([
  "getExecutiveContextAssemblyValidation", "getExecutiveContextFoundationValidation",
  "getExecutiveContextRegistryValidation", "getExecutiveContextModelValidation",
  "getExecutiveContextOwnershipValidation", "getExecutiveContextPublicApiValidation",
  "getExecutiveContextAssemblyValidationRules", "getExecutiveContextAssemblyValidationSummary",
  "getExecutiveContextAssemblyValidationGate",
] as const);

export const ExecutiveContextAssemblyPublicHelperApis = Object.freeze([
  ...foundationHelpers, ...registryHelpers, ...modelHelpers, ...validationHelpers,
] as const);

export const ExecutiveContextAssemblyComponentManifest = Object.freeze([
  component("eng-4-component-foundation-contracts", "Foundation Contracts", "Foundation", "ENG-4:1", ExecutiveContextAssemblyContracts.length, "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyContracts),
  component("eng-4-component-context-domains", "Context Domains", "Domain", "ENG-4:1", ExecutiveContextAssemblyDomains.length, "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyDomains),
  component("eng-4-component-context-sources", "Context Sources", "Source", "ENG-4:2", ExecutiveContextSourceRegistry.entries.length, "executiveContextAssemblyRegistry.ts", ExecutiveContextSourceRegistry),
  component("eng-4-component-context-capabilities", "Context Capabilities", "Capability", "ENG-4:1", ExecutiveContextAssemblyCapabilities.length, "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyCapabilities),
  component("eng-4-component-lifecycle-stages", "Lifecycle Stages", "Lifecycle", "ENG-4:1", ExecutiveContextAssemblyLifecycle.length, "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyLifecycle),
  component("eng-4-component-ownership-groups", "Ownership Groups", "Ownership", "ENG-4:2", ExecutiveContextOwnershipRegistry.entries.length, "executiveContextAssemblyRegistry.ts", ExecutiveContextOwnershipRegistry),
  component("eng-4-component-domain-registry", "Domain Registry", "Registry", "ENG-4:2", ExecutiveContextDomainRegistry.entries.length, "executiveContextAssemblyRegistry.ts", ExecutiveContextDomainRegistry),
  component("eng-4-component-capability-registry", "Capability Registry", "Registry", "ENG-4:2", ExecutiveContextCapabilityRegistry.entries.length, "executiveContextAssemblyRegistry.ts", ExecutiveContextCapabilityRegistry),
  component("eng-4-component-lifecycle-registry", "Lifecycle Registry", "Registry", "ENG-4:2", ExecutiveContextLifecycleRegistry.entries.length, "executiveContextAssemblyRegistry.ts", ExecutiveContextLifecycleRegistry),
  component("eng-4-component-model-definitions", "Model Definitions", "Model", "ENG-4:3", 5, "executiveContextAssemblyModel.ts", Object.freeze([ExecutiveContextModel, ExecutiveContextDomainModel, ExecutiveContextSnapshotModel, ExecutiveContextCompositionModel, ExecutiveContextMetadataModel])),
  component("eng-4-component-model-registry", "Model Registry", "Model", "ENG-4:3", ExecutiveContextAssemblyModel.modelRegistry.length, "executiveContextAssemblyModel.ts", ExecutiveContextAssemblyModel.modelRegistry),
  component("eng-4-component-validation-groups", "Validation Groups", "Validation", "ENG-4:4", ExecutiveContextAssemblyValidation.validationGroups.length, "executiveContextAssemblyValidation.ts", ExecutiveContextAssemblyValidation.validationGroups),
  component("eng-4-component-validation-rules", "Validation Rules", "Validation", "ENG-4:4", ExecutiveContextAssemblyValidation.validationRules.length, "executiveContextAssemblyValidation.ts", ExecutiveContextAssemblyValidation.validationRules),
  component("eng-4-component-validation-gates", "Validation Gates", "Validation", "ENG-4:4", ExecutiveContextAssemblyValidation.validationGates.length, "executiveContextAssemblyValidation.ts", ExecutiveContextAssemblyValidation.validationGates),
  component("eng-4-component-public-helper-apis", "Public Helper APIs", "PublicApi", "ENG-4:4", ExecutiveContextAssemblyPublicHelperApis.length, "ENG-4:1–ENG-4:4 public surfaces", ExecutiveContextAssemblyPublicHelperApis),
] as const);

export const ExecutiveContextAssemblyManifestInventories = Object.freeze({
  foundationContracts: ExecutiveContextAssemblyContracts.length,
  contextDomains: ExecutiveContextDomainRegistry.entries.length,
  contextSources: ExecutiveContextSourceRegistry.entries.length,
  capabilities: ExecutiveContextCapabilityRegistry.entries.length,
  lifecycleStages: ExecutiveContextLifecycleRegistry.entries.length,
  ownershipGroups: ExecutiveContextOwnershipRegistry.entries.length,
  modelDefinitions: 5,
  modelRegistry: ExecutiveContextAssemblyModel.modelRegistry.length,
  validationGroups: ExecutiveContextAssemblyValidation.validationGroups.length,
  validationRules: ExecutiveContextAssemblyValidation.validationRules.length,
  validationGates: ExecutiveContextAssemblyValidation.validationGates.length,
  publicHelperApis: ExecutiveContextAssemblyPublicHelperApis.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextManifestInventory);
