/** DRI-2:7 — certified internal platform metadata for state/context binding. */

import {
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS,
  RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES,
  directorRuntimeStateContextBindingCertificationIdentity,
  directorRuntimeStateContextBindingCertificationVersion,
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  validateRuntimeStateContextBinding,
  type RuntimeStateContextBindingCertificationFinding,
  type RuntimeStateContextBindingCertificationRecord,
} from "@/app/lib/dri/directorRuntimeStateContextBindingCertification";

export {
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  validateRuntimeStateContextBinding,
};
export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBindingEngineInput,
  RuntimeStateContextBindingEngineOutput, RuntimeStateContextBindingInspection,
  RuntimeStateContextBindingIntegrationOutcome, RuntimeStateContextBindingIntegrationRequest,
  RuntimeStateContextBindingRequest, RuntimeStateContextBindingResult,
  RuntimeStateContextBindingScope, RuntimeStateContextBindingStatus,
  RuntimeStateContextBindingValidationReport, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingCertification";

export const directorRuntimeStateContextBindingPlatformIdentity =
  "DRI-2:7/DirectorRuntimeStateContextBindingPlatform" as const;
export const directorRuntimeStateContextBindingPlatformVersion = "2.7.0" as const;
export const directorRuntimeStateContextBindingPlatformNamespace =
  "nexora.dri.runtime.state-context-binding.platform" as const;
export const directorRuntimeStateContextBindingPlatformUpstream =
  directorRuntimeStateContextBindingCertificationIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES = Object.freeze([
  "unavailable", "eligible", "published", "published-with-conditions", "rejected",
] as const);
export type RuntimeStateContextBindingPlatformStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES = Object.freeze([
  "NotReady", "ReadyForAdapterCertification", "ReadyWithConditions", "Blocked",
] as const);
export type RuntimeStateContextBindingPlatformReadiness =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES = Object.freeze([
  "eligible", "conditionally-eligible", "ineligible",
] as const);
export type RuntimeStateContextBindingPlatformEligibilityStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES = Object.freeze([
  "adapter-certification", "freeze", "public-index-preparation", "architectural-inspection",
] as const);

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_PUBLICATION_PHASES = Object.freeze([
  "input-inspected", "certification-evaluated", "eligibility-resolved", "manifest-composed",
  "compatibility-declared", "publication-resolved",
] as const);

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CHARACTERISTICS = Object.freeze([
  "deterministic", "stateless", "synchronous", "immutable", "side-effect-free", "plain-data",
  "certification-derived", "non-owning", "non-executing", "non-persisting", "adapter-ready",
] as const);

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_REQUIREMENT_IDS = Object.freeze([
  "consume-platform-through-approved-surface", "preserve-caller-owned-identity",
  "preserve-binding-status-semantics", "preserve-bound-context-invariant",
  "preserve-determinism", "preserve-source-immutability", "preserve-plain-data-contracts",
  "do-not-own-runtime-state", "do-not-own-executive-context",
  "do-not-bypass-platform-dependency", "do-not-introduce-ui-semantics",
  "do-not-introduce-state-synchronization",
] as const);
export type RuntimeStateContextBindingPlatformRequirementId =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_REQUIREMENT_IDS)[number];

export interface RuntimeStateContextBindingPlatformRequirement {
  readonly id: RuntimeStateContextBindingPlatformRequirementId;
  readonly description: string;
}

export const runtimeStateContextBindingPlatformRequirements = Object.freeze(
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_REQUIREMENT_IDS.map((id) => Object.freeze({
    id, description: `Later platform consumers must ${id.replaceAll("-", " ")}.`,
  })),
);

const PLATFORM_GUARANTEE_MAPPING = Object.freeze([
  Object.freeze({ id: "linear-dependency-chain", source: "dependency-chain-linear" }),
  Object.freeze({ id: "deterministic-binding", source: "engine-deterministic" }),
  Object.freeze({ id: "stateless-engine", source: "engine-stateless" }),
  Object.freeze({ id: "synchronous-evaluation", source: "engine-synchronous" }),
  Object.freeze({ id: "immutable-contracts", source: "contracts-delegated" }),
  Object.freeze({ id: "plain-data-compatible", source: "plain-data-compatible" }),
  Object.freeze({ id: "caller-owned-identity", source: "identity-caller-owned" }),
  Object.freeze({ id: "non-owning-integration", source: "integration-non-owning" }),
  Object.freeze({ id: "non-mutating-validation", source: "validation-non-mutating" }),
  Object.freeze({ id: "evidence-based-certification", source: "validation-non-mutating" }),
  Object.freeze({ id: "binding-result-integrity", source: "binding-result-integrity" }),
  Object.freeze({ id: "no-runtime-store", source: "no-runtime-store" }),
  Object.freeze({ id: "no-state-synchronization", source: "no-state-synchronization" }),
  Object.freeze({ id: "no-event-system", source: "no-event-system" }),
  Object.freeze({ id: "no-ui-dependency", source: "no-ui-dependency" }),
  Object.freeze({ id: "no-director-command-execution", source: "no-director-command-execution" }),
] as const satisfies readonly Readonly<{ id: string;
  source: (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES)[number] }>[]);

export const RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_GUARANTEE_IDS = Object.freeze(
  PLATFORM_GUARANTEE_MAPPING.map(({ id }) => id),
);

export interface RuntimeStateContextBindingPlatformCondition {
  readonly conditionId: string;
  readonly sourceCertificationFindingId: string;
  readonly requirementId: string;
  readonly description: string;
  readonly blocking: false;
}

export interface RuntimeStateContextBindingPlatformCompatibility {
  readonly compatibleUpstreamIdentity: typeof directorRuntimeStateContextBindingCertificationIdentity;
  readonly minimumUpstreamVersion: typeof directorRuntimeStateContextBindingCertificationVersion;
  readonly platformVersion: typeof directorRuntimeStateContextBindingPlatformVersion;
  readonly supportedCertificationDecisions: typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS;
  readonly supportedBindingScopes: readonly ["global", "workspace", "goal", "object", "pack"];
  readonly supportedBindingStatuses: readonly ["unbound", "partial", "bound", "invalid"];
  readonly supportedCompatibilityStates: readonly ["compatible", "incomplete", "incompatible"];
  readonly consumerCategories: typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES;
}

export const runtimeStateContextBindingPlatformCompatibility = Object.freeze({
  compatibleUpstreamIdentity: directorRuntimeStateContextBindingCertificationIdentity,
  minimumUpstreamVersion: directorRuntimeStateContextBindingCertificationVersion,
  platformVersion: directorRuntimeStateContextBindingPlatformVersion,
  supportedCertificationDecisions: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS,
  supportedBindingScopes: Object.freeze(["global", "workspace", "goal", "object", "pack"] as const),
  supportedBindingStatuses: Object.freeze(["unbound", "partial", "bound", "invalid"] as const),
  supportedCompatibilityStates: Object.freeze(["compatible", "incomplete", "incompatible"] as const),
  consumerCategories: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES,
}) satisfies RuntimeStateContextBindingPlatformCompatibility;

export const runtimeStateContextBindingPlatformCompatibilityEntryNames = Object.freeze([
  "compatibleUpstreamIdentity", "minimumUpstreamVersion", "platformVersion",
  "supportedCertificationDecisions", "supportedBindingScopes", "supportedBindingStatuses",
  "supportedCompatibilityStates", "consumerCategories",
] as const);

export interface RuntimeStateContextBindingPlatformInput {
  readonly platformId: string;
  readonly certification: RuntimeStateContextBindingCertificationRecord;
}

export interface RuntimeStateContextBindingPlatformEligibility {
  readonly status: RuntimeStateContextBindingPlatformEligibilityStatus;
  readonly certificationStatus: RuntimeStateContextBindingCertificationRecord["status"];
  readonly certificationDecision: RuntimeStateContextBindingCertificationRecord["decision"];
  readonly blockingReasons: readonly string[];
  readonly conditions: readonly RuntimeStateContextBindingPlatformCondition[];
}

export interface RuntimeStateContextBindingPlatformCapability {
  readonly capabilityId: "RuntimeStateContextBinding";
  readonly capabilityName: "Runtime State & Context Binding";
  readonly capabilityVersion: typeof directorRuntimeStateContextBindingPlatformVersion;
  readonly capabilityStage: "Platform";
  readonly availability: "published" | "published-with-conditions";
  readonly guarantees: readonly string[];
  readonly requirements: readonly RuntimeStateContextBindingPlatformRequirement[];
}

export interface RuntimeStateContextBindingPlatformManifest {
  readonly platformIdentity: string;
  readonly platformVersion: typeof directorRuntimeStateContextBindingPlatformVersion;
  readonly platformNamespace: typeof directorRuntimeStateContextBindingPlatformNamespace;
  readonly capabilityIdentity: "RuntimeStateContextBinding";
  readonly platformStatus: "published" | "published-with-conditions";
  readonly platformReadiness: "ReadyForAdapterCertification" | "ReadyWithConditions";
  readonly certificationIdentity: string;
  readonly certificationStatus: RuntimeStateContextBindingCertificationRecord["status"];
  readonly certificationDecision: RuntimeStateContextBindingCertificationRecord["decision"];
  readonly certification: RuntimeStateContextBindingCertificationRecord;
  readonly approvedGuarantees: readonly string[];
  readonly platformRequirements: readonly RuntimeStateContextBindingPlatformRequirement[];
  readonly compatibility: RuntimeStateContextBindingPlatformCompatibility;
  readonly conditions: readonly RuntimeStateContextBindingPlatformCondition[];
  readonly capability: RuntimeStateContextBindingPlatformCapability;
  readonly publicPlatformApiSurface: readonly string[];
  readonly registrySummary: Readonly<{
    guaranteeCount: number; requirementCount: number; conditionCount: number;
    publicApiCount: number;
  }>;
}

interface PublishedResultBase {
  readonly eligibility: RuntimeStateContextBindingPlatformEligibility;
  readonly blockingReasons: readonly [];
}
export interface PublishedRuntimeStateContextBindingPlatformResult extends PublishedResultBase {
  readonly status: "published";
  readonly readiness: "ReadyForAdapterCertification";
  readonly manifest: RuntimeStateContextBindingPlatformManifest & {
    readonly platformStatus: "published"; readonly conditions: readonly [];
  };
}
export interface ConditionallyPublishedRuntimeStateContextBindingPlatformResult
  extends PublishedResultBase {
  readonly status: "published-with-conditions";
  readonly readiness: "ReadyWithConditions";
  readonly manifest: RuntimeStateContextBindingPlatformManifest & {
    readonly platformStatus: "published-with-conditions";
    readonly conditions: readonly [RuntimeStateContextBindingPlatformCondition,
      ...RuntimeStateContextBindingPlatformCondition[]];
  };
}
export interface RejectedRuntimeStateContextBindingPlatformResult {
  readonly status: "rejected";
  readonly readiness: "Blocked";
  readonly eligibility: RuntimeStateContextBindingPlatformEligibility;
  readonly blockingReasons: readonly string[];
}
export type RuntimeStateContextBindingPlatformPublicationResult =
  PublishedRuntimeStateContextBindingPlatformResult |
  ConditionallyPublishedRuntimeStateContextBindingPlatformResult |
  RejectedRuntimeStateContextBindingPlatformResult;

function conditionFromFinding(finding: RuntimeStateContextBindingCertificationFinding) {
  return Object.freeze({
    conditionId: `platform-condition:${finding.findingId}`,
    sourceCertificationFindingId: finding.findingId,
    requirementId: finding.requirementId,
    description: finding.message,
    blocking: false as const,
  });
}

export function evaluateRuntimeStateContextBindingPlatformEligibility(
  input: RuntimeStateContextBindingPlatformInput,
): RuntimeStateContextBindingPlatformEligibility {
  const certification = input.certification;
  const conditions = Object.freeze(certification.findings
    .filter(({ severity, blocking }) => severity === "condition" && !blocking)
    .map(conditionFromFinding));
  const blockingReasons: string[] = [];
  let status: RuntimeStateContextBindingPlatformEligibilityStatus = "ineligible";
  if (certification.status === "certified" && certification.decision === "approve" &&
      conditions.length === 0) status = "eligible";
  else if (certification.status === "certified-with-conditions" &&
      certification.decision === "approve-with-conditions" && conditions.length > 0)
    status = "conditionally-eligible";
  else if (certification.status === "rejected" && certification.decision === "reject")
    blockingReasons.push("certification-rejected");
  else blockingReasons.push("certification-status-decision-mismatch");
  if (!input.platformId.trim()) {
    status = "ineligible";
    blockingReasons.push("invalid-platform-identity");
  }
  return Object.freeze({
    status, certificationStatus: certification.status,
    certificationDecision: certification.decision,
    blockingReasons: Object.freeze(blockingReasons), conditions,
  });
}

function projectGuarantees(certification: RuntimeStateContextBindingCertificationRecord) {
  const supported = new Set<string>(certification.certificationGuarantees);
  return Object.freeze(PLATFORM_GUARANTEE_MAPPING
    .filter(({ source }) => supported.has(source)).map(({ id }) => id));
}

export function createRuntimeStateContextBindingPlatformManifest(
  input: RuntimeStateContextBindingPlatformInput,
): RuntimeStateContextBindingPlatformManifest | null {
  const eligibility = evaluateRuntimeStateContextBindingPlatformEligibility(input);
  if (eligibility.status === "ineligible") return null;
  const conditional = eligibility.status === "conditionally-eligible";
  const platformStatus = conditional ? "published-with-conditions" as const : "published" as const;
  const platformReadiness = conditional ? "ReadyWithConditions" as const :
    "ReadyForAdapterCertification" as const;
  const approvedGuarantees = projectGuarantees(input.certification);
  const capability = Object.freeze({
    capabilityId: "RuntimeStateContextBinding" as const,
    capabilityName: "Runtime State & Context Binding" as const,
    capabilityVersion: directorRuntimeStateContextBindingPlatformVersion,
    capabilityStage: "Platform" as const,
    availability: platformStatus,
    guarantees: approvedGuarantees,
    requirements: runtimeStateContextBindingPlatformRequirements,
  });
  return Object.freeze({
    platformIdentity: input.platformId,
    platformVersion: directorRuntimeStateContextBindingPlatformVersion,
    platformNamespace: directorRuntimeStateContextBindingPlatformNamespace,
    capabilityIdentity: "RuntimeStateContextBinding" as const,
    platformStatus, platformReadiness,
    certificationIdentity: input.certification.certificationIdentity,
    certificationStatus: input.certification.status,
    certificationDecision: input.certification.decision,
    certification: input.certification,
    approvedGuarantees,
    platformRequirements: runtimeStateContextBindingPlatformRequirements,
    compatibility: runtimeStateContextBindingPlatformCompatibility,
    conditions: eligibility.conditions,
    capability,
    publicPlatformApiSurface: runtimeStateContextBindingPlatformPublicApiSurface,
    registrySummary: Object.freeze({
      guaranteeCount: approvedGuarantees.length,
      requirementCount: runtimeStateContextBindingPlatformRequirements.length,
      conditionCount: eligibility.conditions.length,
      publicApiCount: runtimeStateContextBindingPlatformPublicApiSurface.length,
    }),
  });
}

export function publishRuntimeStateContextBindingPlatform(
  input: RuntimeStateContextBindingPlatformInput,
): RuntimeStateContextBindingPlatformPublicationResult {
  const eligibility = evaluateRuntimeStateContextBindingPlatformEligibility(input);
  const manifest = createRuntimeStateContextBindingPlatformManifest(input);
  if (manifest === null) return Object.freeze({
    status: "rejected" as const, readiness: "Blocked" as const, eligibility,
    blockingReasons: eligibility.blockingReasons.length > 0 ? eligibility.blockingReasons :
      Object.freeze(["platform-ineligible"]),
  });
  if (eligibility.status === "conditionally-eligible") return Object.freeze({
    status: "published-with-conditions" as const, readiness: "ReadyWithConditions" as const,
    eligibility, blockingReasons: Object.freeze([] as const), manifest,
  }) as ConditionallyPublishedRuntimeStateContextBindingPlatformResult;
  return Object.freeze({
    status: "published" as const, readiness: "ReadyForAdapterCertification" as const,
    eligibility, blockingReasons: Object.freeze([] as const), manifest,
  }) as PublishedRuntimeStateContextBindingPlatformResult;
}

export interface RuntimeStateContextBindingPlatformInspection {
  readonly platformIdentity: string | null;
  readonly status: "published" | "published-with-conditions" | "rejected";
  readonly readiness: "ReadyForAdapterCertification" | "ReadyWithConditions" | "Blocked";
  readonly certificationIdentity: string | null;
  readonly guaranteeCount: number;
  readonly conditionCount: number;
  readonly requirementCount: number;
  readonly compatibilityEntryCount: number;
}

export function inspectRuntimeStateContextBindingPlatform(
  result: RuntimeStateContextBindingPlatformPublicationResult,
): RuntimeStateContextBindingPlatformInspection {
  if ("manifest" in result) return Object.freeze({
    platformIdentity: result.manifest.platformIdentity, status: result.status,
    readiness: result.readiness, certificationIdentity: result.manifest.certificationIdentity,
    guaranteeCount: result.manifest.approvedGuarantees.length,
    conditionCount: result.manifest.conditions.length,
    requirementCount: result.manifest.platformRequirements.length,
    compatibilityEntryCount: runtimeStateContextBindingPlatformCompatibilityEntryNames.length,
  });
  return Object.freeze({
    platformIdentity: null, status: result.status, readiness: result.readiness,
    certificationIdentity: null, guaranteeCount: 0, conditionCount: 0,
    requirementCount: runtimeStateContextBindingPlatformRequirements.length,
    compatibilityEntryCount: runtimeStateContextBindingPlatformCompatibilityEntryNames.length,
  });
}

export function isRuntimeStateContextBindingPlatformPublished(
  result: RuntimeStateContextBindingPlatformPublicationResult,
): result is PublishedRuntimeStateContextBindingPlatformResult { return result.status === "published"; }
export function isRuntimeStateContextBindingPlatformPublishedWithConditions(
  result: RuntimeStateContextBindingPlatformPublicationResult,
): result is ConditionallyPublishedRuntimeStateContextBindingPlatformResult {
  return result.status === "published-with-conditions";
}
export function isRuntimeStateContextBindingPlatformRejected(
  result: RuntimeStateContextBindingPlatformPublicationResult,
): result is RejectedRuntimeStateContextBindingPlatformResult { return result.status === "rejected"; }
export function isRuntimeStateContextBindingPlatformReadyForAdapterCertification(
  result: RuntimeStateContextBindingPlatformPublicationResult,
) { return result.readiness === "ReadyForAdapterCertification"; }

export const runtimeStateContextBindingPlatformContractNames = Object.freeze([
  "RuntimeStateContextBindingPlatformInput", "RuntimeStateContextBindingPlatformEligibility",
  "RuntimeStateContextBindingPlatformRequirement", "RuntimeStateContextBindingPlatformCondition",
  "RuntimeStateContextBindingPlatformCompatibility", "RuntimeStateContextBindingPlatformCapability",
  "RuntimeStateContextBindingPlatformManifest", "RuntimeStateContextBindingPlatformPublicationResult",
  "PublishedRuntimeStateContextBindingPlatformResult",
  "ConditionallyPublishedRuntimeStateContextBindingPlatformResult",
  "RejectedRuntimeStateContextBindingPlatformResult", "RuntimeStateContextBindingPlatformInspection",
] as const);
export const runtimeStateContextBindingPlatformApiNames = Object.freeze([
  "evaluateRuntimeStateContextBindingPlatformEligibility",
  "createRuntimeStateContextBindingPlatformManifest", "publishRuntimeStateContextBindingPlatform",
  "inspectRuntimeStateContextBindingPlatform",
] as const);
export const runtimeStateContextBindingPlatformPredicateNames = Object.freeze([
  "isRuntimeStateContextBindingPlatformPublished",
  "isRuntimeStateContextBindingPlatformPublishedWithConditions",
  "isRuntimeStateContextBindingPlatformRejected",
  "isRuntimeStateContextBindingPlatformReadyForAdapterCertification",
] as const);
export const runtimeStateContextBindingPlatformPublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingPlatformApiNames, ...runtimeStateContextBindingPlatformPredicateNames,
] as const);

export const runtimeStateContextBindingPlatformApprovedRuntimeApiSurface = Object.freeze([
  Object.freeze({ name: "createRuntimeStateContextBindingRequest", category: "request-construction",
    sourceStage: "Contracts", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "executeRuntimeStateContextBindingEngine", category: "engine-execution",
    sourceStage: "Engine", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "createRuntimeStateContextBindingIntegrationRequest", category: "integration",
    sourceStage: "Integration", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "integrateRuntimeStateContextBinding", category: "integration",
    sourceStage: "Integration", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "inspectRuntimeStateContextBindingIntegrationOutcome", category: "inspection",
    sourceStage: "Integration", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "isBoundRuntimeStateContextBindingResult", category: "predicate",
    sourceStage: "Contracts", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
  Object.freeze({ name: "validateRuntimeStateContextBinding", category: "validation",
    sourceStage: "Validation", consumerApproval: "PlatformApproved", deterministic: true,
    synchronous: true, sideEffectClassification: "side-effect-free", identityPreserved: true }),
] as const);

export const directorRuntimeStateContextBindingPlatformApprovedRuntimeSurface = Object.freeze({
  identity: "DRI-2:7/ApprovedRuntimeConsumerSurface" as const,
  source: directorRuntimeStateContextBindingPlatformIdentity,
  consumerApproval: "PlatformApproved" as const,
  apiSurface: runtimeStateContextBindingPlatformApprovedRuntimeApiSurface,
  apiCount: runtimeStateContextBindingPlatformApprovedRuntimeApiSurface.length,
  identityPreserved: true,
  deterministic: true,
  synchronous: true,
  sideEffectClassification: "side-effect-free" as const,
});

export const runtimeStateContextBindingPlatformRegistry = Object.freeze({
  contractTypes: runtimeStateContextBindingPlatformContractNames,
  contractTypeCount: runtimeStateContextBindingPlatformContractNames.length,
  statuses: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES,
  statusCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES.length,
  readinessValues: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES,
  readinessValueCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES.length,
  eligibilityValues: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES,
  eligibilityValueCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES.length,
  consumerCategories: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES,
  consumerCategoryCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES.length,
  publicationPhases: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_PUBLICATION_PHASES,
  publicationPhaseCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_PUBLICATION_PHASES.length,
  characteristics: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CHARACTERISTICS,
  characteristicCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CHARACTERISTICS.length,
  guarantees: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_GUARANTEE_IDS,
  guaranteeCount: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_GUARANTEE_IDS.length,
  requirements: runtimeStateContextBindingPlatformRequirements,
  requirementCount: runtimeStateContextBindingPlatformRequirements.length,
  compatibilityEntries: runtimeStateContextBindingPlatformCompatibilityEntryNames,
  compatibilityEntryCount: runtimeStateContextBindingPlatformCompatibilityEntryNames.length,
  functionalApis: runtimeStateContextBindingPlatformApiNames,
  functionalApiCount: runtimeStateContextBindingPlatformApiNames.length,
  predicates: runtimeStateContextBindingPlatformPredicateNames,
  predicateCount: runtimeStateContextBindingPlatformPredicateNames.length,
  publicApiSurface: runtimeStateContextBindingPlatformPublicApiSurface,
  publicApiCount: runtimeStateContextBindingPlatformPublicApiSurface.length,
  approvedRuntimeApis: runtimeStateContextBindingPlatformApprovedRuntimeApiSurface,
  approvedRuntimeApiCount: runtimeStateContextBindingPlatformApprovedRuntimeApiSurface.length,
});

export const directorRuntimeStateContextBindingPlatform = Object.freeze({
  identity: directorRuntimeStateContextBindingPlatformIdentity,
  version: directorRuntimeStateContextBindingPlatformVersion,
  namespace: directorRuntimeStateContextBindingPlatformNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Platform" as const,
  immediateDependency: directorRuntimeStateContextBindingPlatformUpstream,
  platformStatuses: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_STATUSES,
  readinessValues: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_READINESS_VALUES,
  eligibilityValues: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_ELIGIBILITY_VALUES,
  consumerCategories: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES,
  publicationPhases: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_PUBLICATION_PHASES,
  characteristics: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CHARACTERISTICS,
  platformGuarantees: RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_GUARANTEE_IDS,
  platformRequirements: runtimeStateContextBindingPlatformRequirements,
  compatibility: runtimeStateContextBindingPlatformCompatibility,
  publicApiSurface: runtimeStateContextBindingPlatformPublicApiSurface,
  approvedRuntimeSurface: directorRuntimeStateContextBindingPlatformApprovedRuntimeSurface,
  registry: runtimeStateContextBindingPlatformRegistry,
});
