/**
 * NEX-2:7 — Product Roadmap Certification.
 *
 * Immutable Certification declarations only. No certification executes.
 */

import { ProductRoadmapCertificationCriteria } from "./productRoadmapCertificationCriteria.ts";
import { ProductRoadmapCertificationGates } from "./productRoadmapCertificationGates.ts";
import { ProductRoadmapCertificationGuarantees } from "./productRoadmapCertificationGuarantees.ts";
import { ProductRoadmapCertificationIdentity } from "./productRoadmapCertificationIdentity.ts";
import { ProductRoadmapCertificationInventory } from "./productRoadmapCertificationInventory.ts";
import {
  ProductRoadmapCertificationMetadata,
  ProductRoadmapCertificationPublicApiRegistry as PublicApiRegistry,
} from "./productRoadmapCertificationMetadata.ts";
import { ProductRoadmapPlatform } from "./productRoadmapPlatform.ts";

export const ProductRoadmapCertificationId = "NEX-2:7/ProductRoadmapCertification" as const;
export const ProductRoadmapCertificationName = "Nexora Product Roadmap Certification" as const;
export const ProductRoadmapCertificationNamespace = "nexora.nex.product-roadmap.certification" as const;
export const ProductRoadmapCertificationVersion = "1.0.0" as const;
export const ProductRoadmapCertificationStatus = "Certification" as const;
export const ProductRoadmapCertificationReadiness = "ReadyForFreeze" as const;
export const ProductRoadmapCertificationPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapCertification = Object.freeze({
  identity: ProductRoadmapCertificationIdentity,
  dependency: Object.freeze({
    id: "NEX-2:7/Dependency/NEX26Platform",
    upstreamId: ProductRoadmapPlatform.identity.id,
    upstreamPhase: "NEX-2:6",
    platformOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: ProductRoadmapCertificationInventory,
  criteria: ProductRoadmapCertificationCriteria,
  gates: ProductRoadmapCertificationGates,
  guarantees: ProductRoadmapCertificationGuarantees,
  compatibility: ProductRoadmapCertificationMetadata.compatibility,
  dependencies: ProductRoadmapCertificationMetadata.dependencies,
  readinessDeclaration: ProductRoadmapCertificationMetadata.readiness,
  lifecycle: ProductRoadmapCertificationMetadata.lifecycle,
  publication: ProductRoadmapCertificationMetadata.publication,
  versioning: ProductRoadmapCertificationMetadata.versioning,
  compliance: ProductRoadmapCertificationMetadata.compliance,
  constraints: ProductRoadmapCertificationMetadata.constraints,
  assumptions: ProductRoadmapCertificationMetadata.assumptions,
  metadata: ProductRoadmapCertificationMetadata.certificationMetadata,
  publicApiRegistry: ProductRoadmapCertificationPublicApiRegistry,
  freezeSeedMetadata: Object.freeze({
    baselineSubjects: Object.freeze([
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
      "Certification",
      "Freeze",
    ]),
    lockSubjects: Object.freeze([
      "Identity",
      "Namespace",
      "Metadata",
      "Publication",
      "Compatibility",
      "Dependency",
      "Capability",
      "Guarantee",
      "Structure",
      "Version",
      "PublicApiRegistry",
      "Architecture",
    ]),
    extensionPolicySubjects: Object.freeze([
      "PreserveFrozenMetadata",
      "ExtendFutureVersions",
      "StablePublicContracts",
      "BackwardCompatibility",
      "ImmutableCanonicalIdentity",
      "StablePublicApiRegistry",
      "PreserveMetadataIntegrity",
      "NonExecutableFreeze",
    ]),
    compatibilityDeclarations:
      ProductRoadmapPlatform.certificationSeedMetadata.compatibilityDeclarations,
    freezeEntrySubjects:
      ProductRoadmapPlatform.composition.sections,
    metadataOnly: true,
    immutable: true,
  } as const),
  status: ProductRoadmapCertificationStatus,
  readiness: ProductRoadmapCertificationReadiness,
  readyForFreeze: true,
  nextPhase: "NEX-2:8 — Product Roadmap Freeze",
  metadataOnly: true,
  immutable: true,
  executesCertification: false,
  runtimeExecution: false,
  roadmapExecution: false,
  scheduling: false,
  projectManagementExecution: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  ui: false,
  apiImplementation: false,
  services: false,
  executableValidation: false,
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
} as const);
