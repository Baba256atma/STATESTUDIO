/** EX-3:7 Certification criteria, decisions, boundaries, and metadata. */

import { ExecutiveTimelineExperiencePlatform } from "./executiveTimelineExperiencePlatform.ts";
import { ExecutiveTimelineExperienceCertificationContractCount } from "./executiveTimelineExperienceCertificationContracts.ts";
import {
  ExecutiveTimelineExperienceCertificationId,
  ExecutiveTimelineExperienceCertificationIdentity,
  ExecutiveTimelineExperienceCertificationNamespace,
  ExecutiveTimelineExperienceCertificationReadiness,
  ExecutiveTimelineExperienceCertificationStatus,
  ExecutiveTimelineExperienceCertificationVersion,
} from "./executiveTimelineExperienceCertificationIdentity.ts";
import type { ExecutiveTimelineExperienceCertificationCriterion } from "./executiveTimelineExperienceCertificationTypes.ts";

const criterion = (
  name: ExecutiveTimelineExperienceCertificationCriterion["name"],
  order: number,
  statement: string,
): ExecutiveTimelineExperienceCertificationCriterion =>
  Object.freeze({
    criterionId: `EX-3:7/Criterion/${name}`,
    name,
    order,
    statement,
    outcome: "Satisfied",
    descriptiveOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  });

export const ExecutiveTimelineExperienceCertificationCriteria = Object.freeze([
  criterion(
    "IdentityIntegrity",
    1,
    "Platform identity remains EX-3:6/ExecutiveTimelineExperiencePlatform.",
  ),
  criterion(
    "NamespaceIntegrity",
    2,
    "Platform namespace remains nexora.ex.executive.timeline.experience.platform.",
  ),
  criterion(
    "PlatformDependencyIntegrity",
    3,
    "Certification imports only the EX-3:6 Platform aggregate.",
  ),
  criterion(
    "CapabilityBindingCompleteness",
    4,
    "Platform publishes exactly sixteen capability bindings.",
  ),
  criterion(
    "ContractCompleteness",
    5,
    "Platform publishes exactly ten sealed contracts.",
  ),
  criterion(
    "MetadataIntegrity",
    6,
    "Platform metadata remains immutable and metadata-only.",
  ),
  criterion(
    "LifecycleIntegrity",
    7,
    "Platform lifecycle is terminal at ReadyForCertification.",
  ),
  criterion(
    "ConsumerBindingIntegrity",
    8,
    "Platform consumer binding remains immutable and NotReleased.",
  ),
  criterion(
    "EligibilityIntegrity",
    9,
    "Platform canonical eligibility remains Eligible.",
  ),
  criterion(
    "ReadinessIntegrity",
    10,
    "Platform readiness remains ReadyForCertification.",
  ),
  criterion(
    "AggregateIntegrity",
    11,
    "Platform aggregate fields remain mutually consistent and frozen.",
  ),
  criterion(
    "ArchitecturalBoundaryIntegrity",
    12,
    "Platform boundaries prohibit runtime, UI, RTC, and providers.",
  ),
  criterion(
    "DeterministicBehavior",
    13,
    "Platform eligibility and summary remain deterministic and side-effect-free.",
  ),
  criterion(
    "TypeScriptVerification",
    14,
    "Strict TypeScript typecheck completed with exit code 0.",
  ),
  criterion(
    "ESLintVerification",
    15,
    "ESLint verification for Platform package completed with exit code 0.",
  ),
  criterion(
    "PlatformVerification",
    16,
    "Platform package tests and Manifest-only dependency checks remain satisfied.",
  ),
] as const satisfies readonly ExecutiveTimelineExperienceCertificationCriterion[]);

export const ExecutiveTimelineExperienceCertificationCriteriaCount = 16 as const;

export const ExecutiveTimelineExperienceCertificationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "EX-3:7/D-37" as const,
    order: 1,
    statement:
      "Certification remains metadata-only and certifies Platform readiness." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:7/D-38" as const,
    order: 2,
    statement:
      "Exact ReadyForCertification EX-3:6 Platform is the sole upstream dependency." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:7/D-39" as const,
    order: 3,
    statement:
      "Sixteen criteria certify Platform architectural requirements descriptively." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:7/D-40" as const,
    order: 4,
    statement:
      "Evidence references remain read-only through Platform only." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:7/D-41" as const,
    order: 5,
    statement:
      "ReadyForFreeze does not authorize EX-3:8 Freeze implementation." as const,
  }),
  Object.freeze({
    decisionId: "EX-3:7/D-42" as const,
    order: 6,
    statement:
      "Rendering, RTC, persistence, and provider runtimes remain prohibited." as const,
  }),
] as const);

export const ExecutiveTimelineExperienceCertificationBoundaries = Object.freeze({
  boundariesId:
    "EX-3:7/ExecutiveTimelineExperienceCertificationBoundaries" as const,
  importsPlatformOnlyAtRuntime: true as const,
  directManifestImport: false as const,
  directValidationImport: false as const,
  directModelImport: false as const,
  directRegistryImport: false as const,
  directFoundationImport: false as const,
  rtcImport: false as const,
  sceneImport: false as const,
  uiImport: false as const,
  providerImport: false as const,
  network: false as const,
  persistence: false as const,
  telemetry: false as const,
  clock: false as const,
  randomness: false as const,
  playbackEngine: false as const,
  rendering: false as const,
  createsEx38: false as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  failClosed: true as const,
  immutable: true as const,
});

export const ExecutiveTimelineExperienceCertificationAuthorization =
  Object.freeze({
    authorizationReference:
      "EX-3:7/ReadyForFreezeDoesNotAuthorizeFreeze" as const,
    authorizationStatus: "MetadataOnlyCertificationAuthorized" as const,
    ex37ImplementationAuthorized: true as const,
    ex38Authorized: false as const,
    freezeAuthorized: false as const,
    platformRuntimeAuthorized: false as const,
    providerExecutionAuthorized: false as const,
    rtcIntegrationAuthorized: false as const,
    productionAuthorized: false as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceCertificationMetadata = Object.freeze({
  identity: ExecutiveTimelineExperienceCertificationIdentity,
  certificationIdentity: ExecutiveTimelineExperienceCertificationId,
  namespace: ExecutiveTimelineExperienceCertificationNamespace,
  version: ExecutiveTimelineExperienceCertificationVersion,
  status: ExecutiveTimelineExperienceCertificationStatus,
  readiness: ExecutiveTimelineExperienceCertificationReadiness,
  criteriaCount: ExecutiveTimelineExperienceCertificationCriteriaCount,
  contractCount: ExecutiveTimelineExperienceCertificationContractCount,
  upstreamIdentity: ExecutiveTimelineExperiencePlatform.identity.id,
  authorizationReference:
    ExecutiveTimelineExperienceCertificationAuthorization.authorizationReference,
  authorization: ExecutiveTimelineExperienceCertificationAuthorization,
  architecturalLayer: "Executive Experience (EX)" as const,
  module: "Executive Timeline Experience" as const,
  criteria: ExecutiveTimelineExperienceCertificationCriteria,
  boundaries: ExecutiveTimelineExperienceCertificationBoundaries,
  decisions: ExecutiveTimelineExperienceCertificationDecisions,
  readyForFreezeAuthorizesEx38: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  sideEffectFree: true as const,
});
