/**
 * DRI-1:6 — Director Runtime Integration Certification
 *
 * Deterministic certification derived from DRI-1:5 release validation and
 * explicit implementation evidence. This module performs no live behavior.
 */

import {
  directorRuntimeIntegrationValidationIdentity,
  directorRuntimeIntegrationValidationMetadata,
  validateDirectorRuntimeIntegration,
  verifyDirectorRuntimeIntegrationValidation,
  type DirectorRuntimeValidationContext,
  type DirectorRuntimeValidationProfile,
  type DirectorRuntimeValidationRequest,
  type DirectorRuntimeValidationReport,
} from "./directorRuntimeIntegrationValidation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationCertificationIdentity =
  "DRI-1:6/DirectorRuntimeIntegrationCertification" as const;
export const directorRuntimeIntegrationCertificationVersion = "1.6.0" as const;
export const directorRuntimeIntegrationCertificationNamespace =
  "nexora.dri.runtime.integration.certification" as const;
export const directorRuntimeIntegrationCertificationUpstream =
  directorRuntimeIntegrationValidationIdentity;

export const directorRuntimeIntegrationCertificationMetadata = Object.freeze({
  identity: directorRuntimeIntegrationCertificationIdentity,
  version: directorRuntimeIntegrationCertificationVersion,
  namespace: directorRuntimeIntegrationCertificationNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Certification" as const,
  status: "CertificationReady" as const,
  upstream: directorRuntimeIntegrationCertificationUpstream,
  direction: directorRuntimeIntegrationValidationMetadata.direction,
  authority: directorRuntimeIntegrationValidationMetadata.authority,
});

// ─── Certification vocabulary ──────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS = Object.freeze([
  "identity", "dependency", "foundation", "contracts", "mapping", "binding",
  "validation", "authority", "determinism", "immutability", "architecture",
  "readiness",
] as const);
export type DirectorRuntimeCertificationDomain =
  (typeof DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS)[number];

export const DIRECTOR_RUNTIME_CERTIFICATION_CHECK_STATUSES = Object.freeze([
  "passed", "failed", "blocked", "not-applicable",
] as const);
export type DirectorRuntimeCertificationCheckStatus =
  (typeof DIRECTOR_RUNTIME_CERTIFICATION_CHECK_STATUSES)[number];

export const DIRECTOR_RUNTIME_CERTIFICATION_STATUSES = Object.freeze([
  "certified", "certified-with-notes", "not-certified", "blocked",
] as const);
export type DirectorRuntimeCertificationStatus =
  (typeof DIRECTOR_RUNTIME_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_CERTIFICATION_REQUIREMENT_LEVELS = Object.freeze([
  "required", "recommended", "informational",
] as const);
export type DirectorRuntimeCertificationRequirementLevel =
  (typeof DIRECTOR_RUNTIME_CERTIFICATION_REQUIREMENT_LEVELS)[number];

export const DIRECTOR_RUNTIME_CERTIFICATION_PROFILES = Object.freeze([
  "core", "strict", "platform",
] as const);
export type DirectorRuntimeCertificationProfile =
  (typeof DIRECTOR_RUNTIME_CERTIFICATION_PROFILES)[number];

export function isDirectorRuntimeCertificationDomain(
  value: unknown,
): value is DirectorRuntimeCertificationDomain {
  return (DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeCertificationCheckStatus(
  value: unknown,
): value is DirectorRuntimeCertificationCheckStatus {
  return (DIRECTOR_RUNTIME_CERTIFICATION_CHECK_STATUSES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeCertificationStatus(
  value: unknown,
): value is DirectorRuntimeCertificationStatus {
  return (DIRECTOR_RUNTIME_CERTIFICATION_STATUSES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeCertificationRequirementLevel(
  value: unknown,
): value is DirectorRuntimeCertificationRequirementLevel {
  return (DIRECTOR_RUNTIME_CERTIFICATION_REQUIREMENT_LEVELS as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeCertificationProfile(
  value: unknown,
): value is DirectorRuntimeCertificationProfile {
  return (DIRECTOR_RUNTIME_CERTIFICATION_PROFILES as readonly unknown[]).includes(value);
}

// ─── Public contracts ──────────────────────────────────────────────────────

export interface DirectorRuntimeCertificationEvidence {
  readonly evidenceId: string;
  readonly sourceStage: string;
  readonly subject: string;
  readonly result: "pass" | "fail";
  readonly detail: string;
}

export interface DirectorRuntimeCertificationCheck {
  readonly checkId: string;
  readonly domain: DirectorRuntimeCertificationDomain;
  readonly requirementLevel: DirectorRuntimeCertificationRequirementLevel;
  readonly status: DirectorRuntimeCertificationCheckStatus;
  readonly message: string;
  readonly evidenceIds: readonly string[];
}

export interface DirectorRuntimeCertificationNote {
  readonly code: string;
  readonly message: string;
  readonly domain: DirectorRuntimeCertificationDomain;
}

export interface DirectorRuntimeCertificationStageEvidence {
  readonly identity: string;
  readonly version: string;
  readonly namespace: string;
  readonly upstream?: string;
  readonly layer: string;
  readonly phase: string;
}

export interface DirectorRuntimeCertificationImplementationEvidence {
  readonly stages: readonly DirectorRuntimeCertificationStageEvidence[];
  readonly foundationComplete?: boolean;
  readonly contractsComplete?: boolean;
  readonly mappingComplete?: boolean;
  readonly bindingComplete?: boolean;
  readonly validationComplete?: boolean;
  readonly runtimeAuthoritative?: boolean;
  readonly directionPreserved?: boolean;
  readonly deterministic?: boolean;
  readonly immutable?: boolean;
  readonly registriesOrdered?: boolean;
  readonly architectureSafe?: boolean;
  readonly businessIsolated?: boolean;
  readonly renderingIsolated?: boolean;
  readonly synchronizationIsolated?: boolean;
  readonly publicApisComplete?: boolean;
  readonly platformReady?: boolean;
}

export interface DirectorRuntimeCertificationRequest {
  readonly certificationId: string;
  readonly profile: DirectorRuntimeCertificationProfile;
  readonly domains: readonly DirectorRuntimeCertificationDomain[];
  readonly validationProfile: DirectorRuntimeValidationProfile;
  readonly includeRecommendedChecks: boolean;
  readonly validationRequest: DirectorRuntimeValidationRequest;
  readonly validationContext: DirectorRuntimeValidationContext;
  readonly implementationEvidence: DirectorRuntimeCertificationImplementationEvidence;
  readonly suppliedEvidence?: readonly DirectorRuntimeCertificationEvidence[];
}

export interface DirectorRuntimeCertificationDecision {
  readonly certified: boolean;
  readonly status: DirectorRuntimeCertificationStatus;
  readonly readyForPlatform: boolean;
}

export interface DirectorRuntimeCertificationReport {
  readonly certificationId: string;
  readonly status: DirectorRuntimeCertificationStatus;
  readonly checks: readonly DirectorRuntimeCertificationCheck[];
  readonly evidence: readonly DirectorRuntimeCertificationEvidence[];
  readonly notes: readonly DirectorRuntimeCertificationNote[];
  readonly certifiedDomains: readonly DirectorRuntimeCertificationDomain[];
  readonly validationReport: DirectorRuntimeValidationReport;
  readonly decision: DirectorRuntimeCertificationDecision;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly blockedCount: number;
  readonly notApplicableCount: number;
  readonly requiredCheckCount: number;
  readonly recommendedCheckCount: number;
}

function opaque(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function deepFreezeClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => deepFreezeClone(item))) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, deepFreezeClone(item)]),
    )) as T;
  }
  return value;
}

export function createDirectorRuntimeCertificationEvidence(
  input: DirectorRuntimeCertificationEvidence,
): DirectorRuntimeCertificationEvidence {
  if (!opaque(input.evidenceId) || !opaque(input.sourceStage) || !opaque(input.subject) ||
    !opaque(input.detail) || !["pass", "fail"].includes(input.result)) {
    throw new TypeError("certification evidence must be deterministic plain data");
  }
  return Object.freeze({ ...input });
}

export function createDirectorRuntimeCertificationCheck(
  input: DirectorRuntimeCertificationCheck,
): DirectorRuntimeCertificationCheck {
  if (!opaque(input.checkId) || !isDirectorRuntimeCertificationDomain(input.domain) ||
    !isDirectorRuntimeCertificationRequirementLevel(input.requirementLevel) ||
    !isDirectorRuntimeCertificationCheckStatus(input.status) || !opaque(input.message) ||
    input.evidenceIds.some((id) => !opaque(id))) {
    throw new TypeError("certification check is invalid");
  }
  return Object.freeze({ ...input, evidenceIds: Object.freeze([...input.evidenceIds]) });
}

export function createDirectorRuntimeCertificationNote(
  input: DirectorRuntimeCertificationNote,
): DirectorRuntimeCertificationNote {
  if (!opaque(input.code) || !opaque(input.message) ||
    !isDirectorRuntimeCertificationDomain(input.domain)) {
    throw new TypeError("certification note is invalid");
  }
  return Object.freeze({ ...input });
}

export function createDirectorRuntimeCertificationRequest(
  input: DirectorRuntimeCertificationRequest,
): DirectorRuntimeCertificationRequest {
  if (!opaque(input.certificationId) ||
    !isDirectorRuntimeCertificationProfile(input.profile) ||
    input.domains.some((domain) => !isDirectorRuntimeCertificationDomain(domain))) {
    throw new TypeError("certification request is invalid");
  }
  return Object.freeze({
    ...input,
    domains: Object.freeze([...input.domains]),
    validationRequest: deepFreezeClone(input.validationRequest),
    validationContext: deepFreezeClone(input.validationContext),
    implementationEvidence: deepFreezeClone(input.implementationEvidence),
    ...(input.suppliedEvidence
      ? { suppliedEvidence: Object.freeze(input.suppliedEvidence.map(createDirectorRuntimeCertificationEvidence)) }
      : {}),
  });
}

// ─── Status and decision ───────────────────────────────────────────────────

export function resolveDirectorRuntimeCertificationStatus(
  checks: readonly DirectorRuntimeCertificationCheck[],
  notes: readonly DirectorRuntimeCertificationNote[],
): DirectorRuntimeCertificationStatus {
  if (checks.some((check) => check.requirementLevel === "required" && check.status === "failed")) {
    return "not-certified";
  }
  if (checks.some((check) => check.requirementLevel === "required" && check.status === "blocked")) {
    return "blocked";
  }
  if (notes.length > 0 || checks.some((check) =>
    check.requirementLevel === "recommended" && check.status === "failed")) {
    return "certified-with-notes";
  }
  return "certified";
}

export function resolveDirectorRuntimeCertificationDecision(
  status: DirectorRuntimeCertificationStatus,
  platformChecksPassed: boolean,
): DirectorRuntimeCertificationDecision {
  if (!isDirectorRuntimeCertificationStatus(status)) {
    throw new TypeError("unknown certification status");
  }
  const certified = status === "certified" || status === "certified-with-notes";
  return Object.freeze({
    certified,
    status,
    readyForPlatform: certified && platformChecksPassed,
  });
}

// ─── Canonical evidence policy ─────────────────────────────────────────────

const EXPECTED_STAGES = Object.freeze([
  Object.freeze({ identity: "DRI-1:1/DirectorRuntimeIntegrationFoundation", version: "1.1.0", namespace: "nexora.dri.runtime.integration.foundation", upstream: undefined }),
  Object.freeze({ identity: "DRI-1:2/DirectorRuntimeIntegrationContracts", version: "1.2.0", namespace: "nexora.dri.runtime.integration.contracts", upstream: "DRI-1:1/DirectorRuntimeIntegrationFoundation" }),
  Object.freeze({ identity: "DRI-1:3/DirectorRuntimeIntegrationMapping", version: "1.3.0", namespace: "nexora.dri.runtime.integration.mapping", upstream: "DRI-1:2/DirectorRuntimeIntegrationContracts" }),
  Object.freeze({ identity: "DRI-1:4/DirectorRuntimeIntegrationBinding", version: "1.4.0", namespace: "nexora.dri.runtime.integration.binding", upstream: "DRI-1:3/DirectorRuntimeIntegrationMapping" }),
  Object.freeze({ identity: "DRI-1:5/DirectorRuntimeIntegrationValidation", version: "1.5.0", namespace: "nexora.dri.runtime.integration.validation", upstream: "DRI-1:4/DirectorRuntimeIntegrationBinding" }),
  Object.freeze({ identity: "DRI-1:6/DirectorRuntimeIntegrationCertification", version: "1.6.0", namespace: "nexora.dri.runtime.integration.certification", upstream: "DRI-1:5/DirectorRuntimeIntegrationValidation" }),
] as const);

const PROFILE_DOMAINS = Object.freeze({
  core: Object.freeze(DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS.slice(0, 7)),
  strict: Object.freeze(DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS.slice(0, 11)),
  platform: DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS,
});

function stageIdentityPass(stages: readonly DirectorRuntimeCertificationStageEvidence[]): boolean | undefined {
  if (stages.length !== EXPECTED_STAGES.length) return false;
  return EXPECTED_STAGES.every((expected, index) => {
    const actual = stages[index];
    return actual !== undefined && actual.identity === expected.identity &&
      actual.version === expected.version && actual.namespace === expected.namespace &&
      actual.layer === "DRI" && actual.phase === "DRI-1";
  });
}

function dependencyPass(stages: readonly DirectorRuntimeCertificationStageEvidence[]): boolean | undefined {
  if (stages.length !== EXPECTED_STAGES.length) return false;
  return EXPECTED_STAGES.every((expected, index) =>
    index === 0 || stages[index]?.upstream === expected.upstream);
}

function evaluatedStatus(result: boolean | undefined): DirectorRuntimeCertificationCheckStatus {
  return result === undefined ? "blocked" : result ? "passed" : "failed";
}

function domainResult(
  domain: DirectorRuntimeCertificationDomain,
  implementation: DirectorRuntimeCertificationImplementationEvidence,
  validationReport: DirectorRuntimeValidationReport,
  validationContext: DirectorRuntimeValidationContext,
): boolean | undefined {
  switch (domain) {
    case "identity": return stageIdentityPass(implementation.stages);
    case "dependency": return dependencyPass(implementation.stages);
    case "foundation": return implementation.foundationComplete;
    case "contracts": return implementation.contractsComplete;
    case "mapping": return implementation.mappingComplete;
    case "binding": return implementation.bindingComplete;
    case "validation": return implementation.validationComplete === undefined
      ? undefined
      : implementation.validationComplete && validationReport.status === "valid" && validationReport.accepted;
    case "authority": return implementation.runtimeAuthoritative === undefined || implementation.directionPreserved === undefined
      ? undefined
      : implementation.runtimeAuthoritative && implementation.directionPreserved &&
        validationContext.runtimeAuthoritative && validationContext.expectedDirection === "runtime-to-director";
    case "determinism": return implementation.deterministic === undefined || implementation.registriesOrdered === undefined
      ? undefined
      : implementation.deterministic && implementation.registriesOrdered;
    case "immutability": return implementation.immutable;
    case "architecture": return [implementation.architectureSafe, implementation.businessIsolated,
      implementation.renderingIsolated, implementation.synchronizationIsolated]
      .some((value) => value === undefined)
      ? undefined
      : implementation.architectureSafe === true && implementation.businessIsolated === true &&
        implementation.renderingIsolated === true && implementation.synchronizationIsolated === true &&
        (validationContext.forbiddenDependencies?.length ?? 0) === 0;
    case "readiness": return implementation.publicApisComplete === undefined || implementation.platformReady === undefined
      ? undefined
      : implementation.publicApisComplete && implementation.platformReady &&
        validationReport.status === "valid" && validationReport.accepted;
  }
}

// ─── Primary certification ─────────────────────────────────────────────────

export function certifyDirectorRuntimeIntegration(
  input: DirectorRuntimeCertificationRequest,
): DirectorRuntimeCertificationReport {
  const request = createDirectorRuntimeCertificationRequest(input);
  const domains = request.domains.length > 0
    ? request.domains
    : PROFILE_DOMAINS[request.profile];
  const validationRequest = Object.freeze({
    ...request.validationRequest,
    profile: request.validationProfile,
  });
  const validationReport = validateDirectorRuntimeIntegration(
    validationRequest,
    request.validationContext,
  );
  const checks: DirectorRuntimeCertificationCheck[] = [];
  const evidence: DirectorRuntimeCertificationEvidence[] = [
    ...(request.suppliedEvidence ?? []),
  ];
  const notes: DirectorRuntimeCertificationNote[] = [];

  for (const domain of domains) {
    const result = domainResult(
      domain,
      request.implementationEvidence,
      validationReport,
      request.validationContext,
    );
    const evidenceId = `certification-evidence:${domain}`;
    const status = evaluatedStatus(result);
    evidence.push(createDirectorRuntimeCertificationEvidence({
      evidenceId,
      sourceStage: domain === "validation"
        ? directorRuntimeIntegrationValidationIdentity
        : directorRuntimeIntegrationCertificationIdentity,
      subject: domain,
      result: status === "passed" ? "pass" : "fail",
      detail: status === "blocked"
        ? `Required ${domain} evidence is missing`
        : `Certification ${domain} check ${status}`,
    }));
    checks.push(createDirectorRuntimeCertificationCheck({
      checkId: `certification-check:${domain}`,
      domain,
      requirementLevel: "required",
      status,
      message: `DRI-1 ${domain} certification ${status}`,
      evidenceIds: [evidenceId],
    }));
  }

  if (request.includeRecommendedChecks) {
    const status = request.profile === "platform" ? "passed" : "not-applicable";
    const evidenceId = "certification-evidence:platform-observation";
    evidence.push(createDirectorRuntimeCertificationEvidence({
      evidenceId,
      sourceStage: directorRuntimeIntegrationCertificationIdentity,
      subject: "readiness",
      result: "pass",
      detail: "Platform responsibility observation recorded",
    }));
    checks.push(createDirectorRuntimeCertificationCheck({
      checkId: "certification-check:platform-observation",
      domain: "readiness",
      requirementLevel: "recommended",
      status,
      message: "Future Platform responsibilities remain outside Certification execution",
      evidenceIds: [evidenceId],
    }));
  }

  const frozenChecks = Object.freeze(checks);
  const frozenEvidence = Object.freeze(evidence);
  const frozenNotes = Object.freeze(notes);
  const status = resolveDirectorRuntimeCertificationStatus(frozenChecks, frozenNotes);
  const platformChecksPassed = request.profile === "platform" &&
    frozenChecks.filter((check) => check.requirementLevel === "required")
      .every((check) => check.status === "passed") &&
    domains.includes("readiness");
  const decision = resolveDirectorRuntimeCertificationDecision(status, platformChecksPassed);
  const countStatus = (value: DirectorRuntimeCertificationCheckStatus) =>
    frozenChecks.filter((check) => check.status === value).length;
  const countLevel = (value: DirectorRuntimeCertificationRequirementLevel) =>
    frozenChecks.filter((check) => check.requirementLevel === value).length;
  const certifiedDomains = Object.freeze(domains.filter((domain) =>
    frozenChecks.filter((check) => check.domain === domain && check.requirementLevel === "required")
      .every((check) => check.status === "passed")));

  return Object.freeze({
    certificationId: request.certificationId,
    status,
    checks: frozenChecks,
    evidence: frozenEvidence,
    notes: frozenNotes,
    certifiedDomains,
    validationReport,
    decision,
    passedCount: countStatus("passed"),
    failedCount: countStatus("failed"),
    blockedCount: countStatus("blocked"),
    notApplicableCount: countStatus("not-applicable"),
    requiredCheckCount: countLevel("required"),
    recommendedCheckCount: countLevel("recommended"),
  });
}

// ─── Manifest, guarantees, registry, canonical fixture ─────────────────────

export const directorRuntimeIntegrationCertificationManifest = Object.freeze({
  ...directorRuntimeIntegrationCertificationMetadata,
  supportedProfiles: DIRECTOR_RUNTIME_CERTIFICATION_PROFILES,
  domains: DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS,
  authorityGuarantee: "Runtime is authoritative operational and business state" as const,
  integrationDirection: "runtime-to-director" as const,
  readinessTarget: "DRI-1:7/DirectorRuntimeIntegrationPlatform" as const,
});

export const directorRuntimeCertifiedGuarantees = Object.freeze([
  "Exact DRI-1 identity chain", "Immediate dependency discipline",
  "Runtime authority preserved", "Runtime-to-Director direction preserved",
  "Plain immutable contracts", "Deterministic mapping",
  "Explicit binding lifecycle", "Explicit conflict detection",
  "Complete release validation", "Stable collection ordering",
  "No hidden identity generation", "No business semantics",
  "No live synchronization", "No rendering dependency",
  "No reverse Runtime mutation", "Platform readiness",
] as const);
export const directorRuntimeCertifiedGuaranteeCount =
  directorRuntimeCertifiedGuarantees.length;

export const directorRuntimeCertificationRegistry = Object.freeze([
  "Certification Identity", "Certification Domains", "Requirement Levels",
  "Check Statuses", "Overall Statuses", "Certification Profiles",
  "Evidence Contract", "Check Contract", "Report Contract",
  "Identity Certification", "Dependency Certification", "Authority Certification",
  "Determinism Certification", "Immutability Certification",
  "Architecture Certification", "Validation Evidence", "Platform Readiness",
].map((concept, index) => Object.freeze({ order: index + 1, concept })));
export const directorRuntimeCertificationRegistryCount =
  directorRuntimeCertificationRegistry.length;

const CANONICAL_BINDING = Object.freeze({
  bindingId: "dri-certification-binding",
  source: Object.freeze({ sourceKind: "runtime-object" as const, sourceId: "dri-certification-source", runtimeRevision: "dri-certification-revision" }),
  target: Object.freeze({ targetKind: "node" as const, targetId: "dri-certification-target" }),
  mappingId: "dri-certification-mapping",
  intentKind: "represent" as const,
  lifecycle: "declared" as const,
  activation: "disabled" as const,
  scope: "global" as const,
  exclusivity: "shared" as const,
  revisionSensitive: false,
  direction: "runtime-to-director" as const,
});

export const directorRuntimeCanonicalCertificationFixture = Object.freeze({
  certificationId: "dri-1:6-canonical-certification",
  profile: "platform" as const,
  domains: DIRECTOR_RUNTIME_CERTIFICATION_DOMAINS,
  validationProfile: "release" as const,
  includeRecommendedChecks: true,
  validationRequest: Object.freeze({
    validationId: "dri-1:6-canonical-validation",
    profile: "release" as const,
    levels: Object.freeze([]),
    bindings: Object.freeze([CANONICAL_BINDING]),
    payloads: Object.freeze([{ value: 71 }]),
    expectedBindingOrder: Object.freeze([CANONICAL_BINDING.bindingId]),
  }),
  validationContext: Object.freeze({
    expectedDirection: "runtime-to-director" as const,
    expectedRuntimeRevision: "dri-certification-revision",
    allowWarnings: false,
    runtimeAuthoritative: true,
    forbiddenDependencies: Object.freeze([]),
  }),
  implementationEvidence: Object.freeze({
    stages: Object.freeze(EXPECTED_STAGES.map((stage) => Object.freeze({
      ...stage, layer: "DRI", phase: "DRI-1",
    }))),
    foundationComplete: true, contractsComplete: true, mappingComplete: true,
    bindingComplete: true, validationComplete: true, runtimeAuthoritative: true,
    directionPreserved: true, deterministic: true, immutable: true,
    registriesOrdered: true, architectureSafe: true, businessIsolated: true,
    renderingIsolated: true, synchronizationIsolated: true,
    publicApisComplete: true, platformReady: true,
  }),
} satisfies DirectorRuntimeCertificationRequest);

export function getDirectorRuntimeCertificationRegistry(): typeof directorRuntimeCertificationRegistry {
  return directorRuntimeCertificationRegistry;
}

export function verifyDirectorRuntimeIntegrationCertification(): boolean {
  const report = certifyDirectorRuntimeIntegration(
    directorRuntimeCanonicalCertificationFixture,
  );
  return directorRuntimeIntegrationCertificationMetadata.identity ===
    "DRI-1:6/DirectorRuntimeIntegrationCertification" &&
    directorRuntimeIntegrationCertificationMetadata.upstream ===
      directorRuntimeIntegrationValidationIdentity &&
    directorRuntimeIntegrationCertificationManifest.readinessTarget ===
      "DRI-1:7/DirectorRuntimeIntegrationPlatform" &&
    directorRuntimeCertificationRegistryCount === directorRuntimeCertificationRegistry.length &&
    directorRuntimeCertifiedGuaranteeCount === directorRuntimeCertifiedGuarantees.length &&
    verifyDirectorRuntimeIntegrationValidation() &&
    report.status === "certified" && report.decision.readyForPlatform;
}
