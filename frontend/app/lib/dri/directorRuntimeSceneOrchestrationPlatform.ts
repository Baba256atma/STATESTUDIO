/** DRI-3:7 — deterministic platform publication over authoritative certification. */

import {
  DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES,
  directorRuntimeSceneOrchestrationCertificationIdentity,
  type DirectorSceneOrchestrationCertificationCondition,
  type DirectorSceneOrchestrationCertificationRecord,
  type DirectorSceneOrchestrationPlan,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationCertification";

export type {
  DirectorSceneOrchestrationCertificationCondition,
  DirectorSceneOrchestrationCertificationRecord,
  DirectorSceneOrchestrationPlan,
};

export const directorRuntimeSceneOrchestrationPlatformIdentity =
  "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform" as const;
export const directorRuntimeSceneOrchestrationPlatformNamespace =
  "nexora.dri.scene.orchestration.platform" as const;
export const directorRuntimeSceneOrchestrationPlatformVersion = "3.7.0" as const;
export const directorRuntimeSceneOrchestrationPlatformUpstream =
  directorRuntimeSceneOrchestrationCertificationIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES = Object.freeze([
  "published", "published-with-conditions", "rejected",
] as const);
export type DirectorSceneOrchestrationPlatformStatus =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES = Object.freeze([
  "eligible", "conditionally-eligible", "ineligible",
] as const);
export type DirectorSceneOrchestrationPlatformEligibility =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES = Object.freeze([
  "focus-orchestration", "attention-orchestration", "visibility-orchestration",
  "relationship-orchestration", "path-orchestration", "preservation-orchestration",
] as const);
export type DirectorSceneOrchestrationPlatformCapability =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES = Object.freeze([
  "compatible", "conditional", "incompatible",
] as const);
export type DirectorSceneOrchestrationPlatformCompatibilityStatus =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES = Object.freeze([
  "director", "scene", "adapter", "runtime",
] as const);
export type DirectorSceneOrchestrationPlatformConsumerCategory =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES = Object.freeze([
  "inspect", "qualify", "project", "publish",
] as const);
export type DirectorSceneOrchestrationPlatformPublicationPhase =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS = Object.freeze([
  "deterministic", "stateless", "synchronous", "immutable", "json-compatible",
  "certification-gated", "renderer-independent", "business-policy-independent",
  "lineage-preserving", "condition-transparent",
] as const);

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS = Object.freeze([
  "certification-record-required", "plan-certification-identity-match",
  "certified-or-conditionally-certified-only", "conditions-preserved",
  "evidence-preserved", "deterministic-manifest-identity", "immutable-publication",
] as const);
export type DirectorSceneOrchestrationPlatformRequirementId =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS)[number];

export interface DirectorSceneOrchestrationPlatformRequirement {
  readonly requirementId: DirectorSceneOrchestrationPlatformRequirementId;
  readonly description: string;
}

export const directorSceneOrchestrationPlatformRequirements = Object.freeze(
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS.map((requirementId) => Object.freeze({
    requirementId,
    description: `Platform publication requires ${requirementId.replaceAll("-", " ")}.`,
  })),
) as readonly DirectorSceneOrchestrationPlatformRequirement[];

/** Approved DRI-3 orchestration capability → platform capability projection order. */
const PLATFORM_CAPABILITY_MAPPING = Object.freeze([
  Object.freeze({ id: "focus-orchestration" as const, source: "focus" }),
  Object.freeze({ id: "attention-orchestration" as const, source: "attention" }),
  Object.freeze({ id: "visibility-orchestration" as const, source: "visibility" }),
  Object.freeze({ id: "relationship-orchestration" as const, source: "relationship" }),
  Object.freeze({ id: "path-orchestration" as const, source: "path" }),
  Object.freeze({ id: "preservation-orchestration" as const, source: "preservation" }),
] as const);

const PLATFORM_GUARANTEE_MAPPING = Object.freeze([
  Object.freeze({ id: "certified-input-only", source: "validated-input-only" }),
  Object.freeze({ id: "certification-authoritative", source: "invalid-never-certified" }),
  Object.freeze({ id: "lineage-preserved", source: "plan-validation-identity-match" }),
  Object.freeze({ id: "conditions-preserved", source: "conditions-preserved" }),
  Object.freeze({ id: "condition-transparent", source: "evidence-preserved" }),
  Object.freeze({ id: "deterministic-publication", source: "deterministic-certification" }),
  Object.freeze({ id: "immutable-manifest", source: "immutable-certification-record" }),
  Object.freeze({ id: "no-scene-mutation", source: "no-orchestration-mutation" }),
  Object.freeze({ id: "renderer-independent", source: "renderer-independent" }),
  Object.freeze({ id: "business-policy-independent", source: "business-policy-independent" }),
] as const satisfies readonly Readonly<{
  id: string;
  source: (typeof DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES)[number];
}>[]);

/** Intrinsic platform guarantees always projected for eligible publication. */
const INTRINSIC_PLATFORM_GUARANTEES = Object.freeze([
  "ordered-capabilities",
] as const);

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES = Object.freeze([
  ...PLATFORM_GUARANTEE_MAPPING.map(({ id }) => id),
  ...INTRINSIC_PLATFORM_GUARANTEES,
] as const);
export type DirectorSceneOrchestrationPlatformGuarantee =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES)[number];

export interface DirectorSceneOrchestrationPlatformReason {
  readonly code: string;
  readonly message: string;
}

export interface DirectorSceneOrchestrationPlatformIdentity {
  readonly identity: typeof directorRuntimeSceneOrchestrationPlatformIdentity;
  readonly namespace: typeof directorRuntimeSceneOrchestrationPlatformNamespace;
  readonly version: typeof directorRuntimeSceneOrchestrationPlatformVersion;
}

export const directorSceneOrchestrationPlatformIdentityValue = Object.freeze({
  identity: directorRuntimeSceneOrchestrationPlatformIdentity,
  namespace: directorRuntimeSceneOrchestrationPlatformNamespace,
  version: directorRuntimeSceneOrchestrationPlatformVersion,
}) satisfies DirectorSceneOrchestrationPlatformIdentity;

export interface DirectorSceneOrchestrationPlatformCompatibilityEntry {
  readonly compatibilityId: string;
  readonly target: string;
  readonly status: DirectorSceneOrchestrationPlatformCompatibilityStatus;
}

export const DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS = Object.freeze([
  Object.freeze({ compatibilityId: "compat:dri-downstream-consumer",
    target: "dri-downstream-consumer" }),
  Object.freeze({ compatibilityId: "compat:nol-scene-composition",
    target: "nol-scene-composition" }),
  Object.freeze({ compatibilityId: "compat:director-integration",
    target: "director-integration" }),
  Object.freeze({ compatibilityId: "compat:renderer-adapter-boundary",
    target: "renderer-adapter-boundary" }),
] as const);

export interface DirectorSceneOrchestrationPlatformConsumerContract {
  readonly entryRole: "CertifiedSceneOrchestrationPlatform";
  readonly requiresCertifiedManifest: true;
  readonly conditionsMustRemainVisible: true;
  readonly mutationAllowed: false;
  readonly consumerCategories: typeof DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES;
  readonly rules: readonly string[];
}

export const directorSceneOrchestrationPlatformConsumerContract = Object.freeze({
  entryRole: "CertifiedSceneOrchestrationPlatform" as const,
  requiresCertifiedManifest: true as const,
  conditionsMustRemainVisible: true as const,
  mutationAllowed: false as const,
  consumerCategories: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  rules: Object.freeze([
    "consume-platform-manifest-only", "do-not-mutate-manifest",
    "do-not-reinterpret-certification-status", "do-not-remove-conditions",
    "do-not-infer-renderer-instructions", "preserve-lineage",
  ] as const),
}) satisfies DirectorSceneOrchestrationPlatformConsumerContract;

export interface DirectorSceneOrchestrationPlatformInput {
  readonly plan: DirectorSceneOrchestrationPlan;
  readonly certification: DirectorSceneOrchestrationCertificationRecord;
}

export interface DirectorSceneOrchestrationPlatformManifest {
  readonly manifestId: string;
  readonly planId: string;
  readonly certificationId: string;
  readonly validationId: string;
  readonly platformIdentity: DirectorSceneOrchestrationPlatformIdentity;
  readonly capabilities: readonly DirectorSceneOrchestrationPlatformCapability[];
  readonly guarantees: readonly DirectorSceneOrchestrationPlatformGuarantee[];
  readonly conditions: readonly DirectorSceneOrchestrationCertificationCondition[];
  readonly compatibility: readonly DirectorSceneOrchestrationPlatformCompatibilityEntry[];
  readonly consumer: DirectorSceneOrchestrationPlatformConsumerContract;
}

export interface DirectorSceneOrchestrationPlatformResult {
  readonly status: DirectorSceneOrchestrationPlatformStatus;
  readonly eligibility: DirectorSceneOrchestrationPlatformEligibility;
  readonly manifest: DirectorSceneOrchestrationPlatformManifest | null;
  readonly reasons: readonly DirectorSceneOrchestrationPlatformReason[];
}

function reason(code: string, message: string): DirectorSceneOrchestrationPlatformReason {
  return Object.freeze({ code, message });
}

function hasEvidence(certification: DirectorSceneOrchestrationCertificationRecord) {
  return Boolean(certification.certificationId?.trim()) &&
    Boolean(certification.planId?.trim()) &&
    Boolean(certification.validationId?.trim()) &&
    Boolean(certification.status);
}

function preserveConditions(
  conditions: readonly DirectorSceneOrchestrationCertificationCondition[],
) {
  return Object.freeze(conditions.map((condition) => Object.freeze({ ...condition })));
}

function projectCapabilities() {
  return Object.freeze(PLATFORM_CAPABILITY_MAPPING.map(({ id }) => id));
}

function projectGuarantees(certification: DirectorSceneOrchestrationCertificationRecord) {
  const supported = new Set<string>(certification.guarantees);
  const projected: DirectorSceneOrchestrationPlatformGuarantee[] = [
    ...PLATFORM_GUARANTEE_MAPPING
      .filter(({ source }) => supported.has(source))
      .map(({ id }) => id),
    ...INTRINSIC_PLATFORM_GUARANTEES,
  ];
  return Object.freeze(projected);
}

function resolveCompatibility(
  eligibility: DirectorSceneOrchestrationPlatformEligibility,
): readonly DirectorSceneOrchestrationPlatformCompatibilityEntry[] {
  const status: DirectorSceneOrchestrationPlatformCompatibilityStatus =
    eligibility === "conditionally-eligible" ? "conditional" : "compatible";
  return Object.freeze(DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS.map(
    ({ compatibilityId, target }) => Object.freeze({ compatibilityId, target, status }),
  ));
}

function buildManifest(
  input: DirectorSceneOrchestrationPlatformInput,
  eligibility: Exclude<DirectorSceneOrchestrationPlatformEligibility, "ineligible">,
): DirectorSceneOrchestrationPlatformManifest {
  const { plan, certification } = input;
  const conditions = eligibility === "conditionally-eligible" ?
    preserveConditions(certification.conditions) : Object.freeze([]);
  return Object.freeze({
    manifestId: `${plan.planId}:${certification.certificationId}:DRI-3:7:platform`,
    planId: plan.planId,
    certificationId: certification.certificationId,
    validationId: certification.validationId,
    platformIdentity: directorSceneOrchestrationPlatformIdentityValue,
    capabilities: projectCapabilities(),
    guarantees: projectGuarantees(certification),
    conditions,
    compatibility: resolveCompatibility(eligibility),
    consumer: directorSceneOrchestrationPlatformConsumerContract,
  });
}

function reject(
  eligibility: "ineligible",
  reasons: readonly DirectorSceneOrchestrationPlatformReason[],
): DirectorSceneOrchestrationPlatformResult {
  return Object.freeze({
    status: "rejected" as const,
    eligibility,
    manifest: null,
    reasons: Object.freeze([...reasons]),
  });
}

export function publishDirectorRuntimeSceneOrchestrationPlatform(
  input: DirectorSceneOrchestrationPlatformInput,
): DirectorSceneOrchestrationPlatformResult {
  const { plan, certification } = input;
  const reasons: DirectorSceneOrchestrationPlatformReason[] = [];

  if (!hasEvidence(certification)) {
    reasons.push(reason("certification-evidence-incomplete",
      "Required certification evidence fields are missing."));
  }
  if (certification.planId !== plan.planId) {
    reasons.push(reason("plan-certification-identity-mismatch",
      "Certification plan identity does not match the supplied plan identity."));
  }
  if (certification.status === "rejected") {
    reasons.push(reason("certification-rejected",
      "Rejected certification artifacts are not eligible for platform publication."));
  } else if (certification.status !== "certified" &&
      certification.status !== "conditionally-certified") {
    reasons.push(reason("certification-status-unsupported",
      "Certification status is not eligible for platform publication."));
  }

  if (reasons.length > 0) return reject("ineligible", reasons);

  if (certification.status === "conditionally-certified") {
    return Object.freeze({
      status: "published-with-conditions" as const,
      eligibility: "conditionally-eligible" as const,
      manifest: buildManifest(input, "conditionally-eligible"),
      reasons: Object.freeze([]),
    });
  }

  return Object.freeze({
    status: "published" as const,
    eligibility: "eligible" as const,
    manifest: buildManifest(input, "eligible"),
    reasons: Object.freeze([]),
  });
}

export function isDirectorSceneOrchestrationPlatformEligible(
  input: DirectorSceneOrchestrationPlatformInput,
) {
  const result = publishDirectorRuntimeSceneOrchestrationPlatform(input);
  return result.eligibility === "eligible" || result.eligibility === "conditionally-eligible";
}

export function isPublishedDirectorSceneOrchestrationPlatformResult(
  result: DirectorSceneOrchestrationPlatformResult,
) {
  return result.status === "published" || result.status === "published-with-conditions";
}

export const directorRuntimeSceneOrchestrationPlatformConcepts = Object.freeze([
  "Platform Input", "Platform Status", "Platform Eligibility", "Platform Reason",
  "Platform Capability", "Platform Guarantee", "Compatibility", "Consumer Contract",
  "Publication Phase", "Platform Manifest", "Platform Result", "Platform Publication",
] as const);

export const directorRuntimeSceneOrchestrationPlatformApiNames = Object.freeze([
  "publishDirectorRuntimeSceneOrchestrationPlatform",
] as const);

export const directorRuntimeSceneOrchestrationPlatformPredicateNames = Object.freeze([
  "isDirectorSceneOrchestrationPlatformEligible",
  "isPublishedDirectorSceneOrchestrationPlatformResult",
] as const);

export const directorRuntimeSceneOrchestrationPlatformRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationPlatformConcepts,
  conceptCount: directorRuntimeSceneOrchestrationPlatformConcepts.length,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES,
  statusCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES.length,
  eligibilityValues: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES,
  eligibilityValueCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES.length,
  capabilities: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES,
  capabilityCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES.length,
  guarantees: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES,
  guaranteeCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES.length,
  compatibilityStatuses: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES,
  compatibilityStatusCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES.length,
  compatibilityTargets: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS,
  compatibilityTargetCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS.length,
  consumerCategories: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  consumerCategoryCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES.length,
  publicationPhases: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES,
  publicationPhaseCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES.length,
  characteristics: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS,
  characteristicCount: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS.length,
  requirements: directorSceneOrchestrationPlatformRequirements,
  requirementCount: directorSceneOrchestrationPlatformRequirements.length,
  publicApis: directorRuntimeSceneOrchestrationPlatformApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationPlatformApiNames.length,
  predicates: directorRuntimeSceneOrchestrationPlatformPredicateNames,
  predicateCount: directorRuntimeSceneOrchestrationPlatformPredicateNames.length,
});

export const directorRuntimeSceneOrchestrationPlatform = Object.freeze({
  phase: "DRI-3:7" as const,
  name: "DirectorRuntimeSceneOrchestrationPlatform" as const,
  identity: directorRuntimeSceneOrchestrationPlatformIdentity,
  namespace: directorRuntimeSceneOrchestrationPlatformNamespace,
  version: directorRuntimeSceneOrchestrationPlatformVersion,
  layer: "DRI" as const,
  capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Platform" as const,
  immediateDependency: directorRuntimeSceneOrchestrationPlatformUpstream,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES,
  eligibilityValues: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES,
  capabilities: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES,
  guarantees: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES,
  compatibilityStatuses: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES,
  consumerCategories: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  publicationPhases: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES,
  characteristics: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS,
  requirements: directorSceneOrchestrationPlatformRequirements,
  consumerContract: directorSceneOrchestrationPlatformConsumerContract,
  publicApiSurface: directorRuntimeSceneOrchestrationPlatformApiNames,
  predicateSurface: directorRuntimeSceneOrchestrationPlatformPredicateNames,
  registry: directorRuntimeSceneOrchestrationPlatformRegistry,
});
