import {
  ExecutiveReasoningModelMetadata,
  ExecutiveReasoningModels,
  ExecutiveReasoningRelationshipModel,
  getExecutiveReasoningModelSummary,
} from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningRegistryMetadata,
  getReasoningRegistrySummary,
} from "./executiveReasoningRegistryIndex.ts";
import {
  ExecutiveReasoningManifest,
  getExecutiveReasoningManifestSummary,
} from "./executiveReasoningManifestPlatform.ts";
import {
  ExecutiveReasoningValidationManifest,
  ExecutiveReasoningValidationMetadata,
  getExecutiveReasoningValidationSummary,
} from "./executiveReasoningValidationPlatform.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningPlatformMetadata } from "./executiveReasoningPlatformMetadata.ts";

const registrySummary = getReasoningRegistrySummary();
const modelSummary = getExecutiveReasoningModelSummary();
const validationSummary = getExecutiveReasoningValidationSummary();
const manifestSummary = getExecutiveReasoningManifestSummary();

const priorPublicApis = Object.freeze([
  ...ExecutiveReasoningManifest.PublicSurface.apis.map(({ name, originatingPhase, namespace, version, status }) =>
    Object.freeze({ name, originatingPhase, namespace, version, status } as const)),
  Object.freeze({
    name: "ExecutiveReasoningManifestPlatform",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "ExecutiveReasoningManifest",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "ExecutiveReasoningDependencyMap",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "ExecutiveReasoningOwnershipMap",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "ExecutiveReasoningCompatibility",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "getExecutiveReasoningManifest",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "getExecutiveReasoningManifestMetadata",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
  Object.freeze({
    name: "getExecutiveReasoningManifestSummary",
    originatingPhase: "ENG-6:5",
    namespace: "nexora.engine.executive.reasoning.manifest",
    version: "1.0.0",
    status: "Published",
  } as const),
] as const);

/**
 * Descriptive platform registry metadata only.
 * Does not execute registration or mutate prior phases.
 */
export const ExecutiveReasoningPlatformRegistry = Object.freeze({
  id: "eng-6-platform-registry",
  name: "Executive Reasoning Platform Registry",
  phase: "ENG-6:6",
  owner: "ENG-6",
  registeredPhases: Object.freeze([
    Object.freeze({ phase: "ENG-6:1", name: "Foundation", publicSurface: "executiveReasoningPipelineFoundation.ts", namespace: ExecutiveReasoningPipelineFoundation.namespace } as const),
    Object.freeze({ phase: "ENG-6:2", name: "Registry", publicSurface: "executiveReasoningRegistryIndex.ts", namespace: ExecutiveReasoningRegistryMetadata.registryNamespace } as const),
    Object.freeze({ phase: "ENG-6:3", name: "Model", publicSurface: "executiveReasoningModelIndex.ts", namespace: ExecutiveReasoningModelMetadata.namespace } as const),
    Object.freeze({ phase: "ENG-6:4", name: "Validation", publicSurface: "executiveReasoningValidationPlatform.ts", namespace: ExecutiveReasoningValidationMetadata.namespace } as const),
    Object.freeze({ phase: "ENG-6:5", name: "Manifest", publicSurface: "executiveReasoningManifestPlatform.ts", namespace: "nexora.engine.executive.reasoning.manifest" } as const),
    Object.freeze({ phase: "ENG-6:6", name: "Platform", publicSurface: "executiveReasoningPlatformIndex.ts", namespace: ExecutiveReasoningPlatformMetadata.namespace } as const),
  ] as const),
  registeredModels: Object.freeze(ExecutiveReasoningModels.map(({ id, name }) => Object.freeze({ id, name } as const))),
  registeredComponents: Object.freeze(
    ExecutiveReasoningComponentRegistry.map(({ id, name }) => Object.freeze({ id, name } as const)),
  ),
  registeredCapabilities: Object.freeze(
    ExecutiveReasoningCapabilityRegistry.map(({ id, name }) => Object.freeze({ id, name } as const)),
  ),
  registeredRelationships: Object.freeze(
    ExecutiveReasoningRelationshipModel.edges.map(({ id, from, to }) => Object.freeze({ id, from, to } as const)),
  ),
  registeredValidationDomains: Object.freeze([...ExecutiveReasoningValidationManifest.domains]),
  registeredPublicApis: priorPublicApis,
  counts: Object.freeze({
    phaseCount: 6,
    modelCount: modelSummary.modelCount,
    componentCount: registrySummary.componentCount,
    capabilityCount: registrySummary.capabilityCount,
    relationshipCount: modelSummary.relationshipEdgeCount,
    validationDomainCount: validationSummary.domainCount,
    validationRuleCount: validationSummary.totalRuleCount,
    publicApiCount: priorPublicApis.length,
    manifestPublicApiCount: manifestSummary.totalPublicApis,
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
