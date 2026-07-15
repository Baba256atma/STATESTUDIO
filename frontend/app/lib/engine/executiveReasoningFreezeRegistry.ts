import {
  getExecutiveReasoningCertification,
  getExecutiveReasoningCertificationSummary,
} from "./executiveReasoningCertificationIndex.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  getReasoningRegistrySummary,
} from "./executiveReasoningRegistryIndex.ts";
import {
  ExecutiveReasoningModels,
  ExecutiveReasoningRelationshipModel,
  getExecutiveReasoningModelSummary,
} from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveReasoningPlatformRegistry,
  getExecutiveReasoningPlatformSummary,
} from "./executiveReasoningPlatformIndex.ts";
import {
  ExecutiveReasoningValidationManifest,
  getExecutiveReasoningValidationSummary,
} from "./executiveReasoningValidationPlatform.ts";
import { ExecutiveReasoningFreezeMetadata } from "./executiveReasoningFreezeMetadata.ts";

const registrySummary = getReasoningRegistrySummary();
const modelSummary = getExecutiveReasoningModelSummary();
const validationSummary = getExecutiveReasoningValidationSummary();
const platformSummary = getExecutiveReasoningPlatformSummary();
const certificationSummary = getExecutiveReasoningCertificationSummary();
const certification = getExecutiveReasoningCertification();

const certificationPublicApis = Object.freeze([
  "ExecutiveReasoningCertificationPlatform",
  "ExecutiveReasoningCertificationRegistry",
  "ExecutiveReasoningCertificationManifest",
  "ExecutiveReasoningCertificationSummary",
  "getExecutiveReasoningCertification",
  "getExecutiveReasoningCertificationMetadata",
  "getExecutiveReasoningCertificationSummary",
  "getExecutiveReasoningCertificationGateById",
] as const);

const platformPublicApis = Object.freeze([
  "ExecutiveReasoningPlatform",
  "ExecutiveReasoningPlatformMetadata",
  "ExecutiveReasoningPlatformRegistry",
  "ExecutiveReasoningPlatformSummary",
  "getExecutiveReasoningPlatform",
  "getExecutiveReasoningPlatformMetadata",
  "getExecutiveReasoningPlatformRegistry",
  "getExecutiveReasoningPlatformSummary",
] as const);

const frozenPublicApis = Object.freeze([
  ...ExecutiveReasoningPlatformRegistry.registeredPublicApis.map(({ name, originatingPhase }) =>
    Object.freeze({ name, originatingPhase, freezeStatus: "FROZEN" as const } as const)),
  ...platformPublicApis.map((name) =>
    Object.freeze({ name, originatingPhase: "ENG-6:6" as const, freezeStatus: "FROZEN" as const } as const)),
  ...certificationPublicApis.map((name) =>
    Object.freeze({ name, originatingPhase: "ENG-6:7" as const, freezeStatus: "FROZEN" as const } as const)),
] as const);

/**
 * Descriptive freeze registry metadata only.
 */
export const ExecutiveReasoningFreezeRegistry = Object.freeze({
  id: "eng-6-freeze-registry",
  name: "Executive Reasoning Freeze Registry",
  phase: "ENG-6:8",
  owner: "ENG-6",
  freezeId: ExecutiveReasoningFreezeMetadata.freezeId,
  certifiedPhases: Object.freeze([
    "ENG-6:1",
    "ENG-6:2",
    "ENG-6:3",
    "ENG-6:4",
    "ENG-6:5",
    "ENG-6:6",
    "ENG-6:7",
  ] as const),
  frozenPhases: Object.freeze([
    Object.freeze({ phase: "ENG-6:1", name: "Foundation", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:2", name: "Registry", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:3", name: "Model", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:4", name: "Validation", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:5", name: "Manifest", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:6", name: "Platform", freezeStatus: "FROZEN" } as const),
    Object.freeze({ phase: "ENG-6:7", name: "Certification", freezeStatus: "FROZEN" } as const),
  ] as const),
  frozenComponents: Object.freeze(
    ExecutiveReasoningComponentRegistry.map(({ id, name }) =>
      Object.freeze({ id, name, freezeStatus: "FROZEN" as const } as const)),
  ),
  frozenCapabilities: Object.freeze(
    ExecutiveReasoningCapabilityRegistry.map(({ id, name }) =>
      Object.freeze({ id, name, freezeStatus: "FROZEN" as const } as const)),
  ),
  frozenModels: Object.freeze(
    ExecutiveReasoningModels.map(({ id, name }) =>
      Object.freeze({ id, name, freezeStatus: "FROZEN" as const } as const)),
  ),
  frozenRelationships: Object.freeze(
    ExecutiveReasoningRelationshipModel.edges.map(({ id, from, to }) =>
      Object.freeze({ id, from, to, freezeStatus: "FROZEN" as const } as const)),
  ),
  frozenValidationDomains: Object.freeze(
    [...ExecutiveReasoningValidationManifest.domains].map((name) =>
      Object.freeze({ name, freezeStatus: "FROZEN" as const } as const)),
  ),
  frozenPublicApis,
  certificationReference: Object.freeze({
    certificationId: certification.metadata.certificationId,
    certificationStatus: certificationSummary.certificationStatus,
    freezeReadiness: certificationSummary.freezeReadiness,
  } as const),
  counts: Object.freeze({
    certifiedPhaseCount: 7,
    frozenPhaseCount: 7,
    frozenComponentCount: registrySummary.componentCount,
    frozenCapabilityCount: registrySummary.capabilityCount,
    frozenModelCount: modelSummary.modelCount,
    frozenRelationshipCount: modelSummary.relationshipEdgeCount,
    frozenValidationDomainCount: validationSummary.domainCount,
    frozenValidationRuleCount: validationSummary.totalRuleCount,
    frozenPublicApiCount: frozenPublicApis.length,
    platformPublicApiCount: platformSummary.totalPublicApis,
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
