/**
 * NOL-3:7 — NexoraObject Director Integration Certification
 *
 * Trust gate for Director Integration artifacts validated by NOL-3:6.
 * Certification grants platform use; validation checks correctness.
 *
 * Upstream: NOL-3:6 only.
 * Identity: NOL-3:7/NexoraObjectDirectorIntegrationCertification
 */

import {
  validateDirectorIntegration,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
  nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
  serializeNexoraDirectorValidationReport,
  deserializeNexoraDirectorValidationReport,
  type NexoraDirectorValidationReport,
  type NexoraDirectorValidationProfile,
  type NexoraDirectorIntegrationValidationInput,
} from "./nexoraObjectDirectorIntegrationValidationIntegrityEngine.ts";

// Re-export validation types required by the certified public surface / Freeze.
export type {
  NexoraDirectorValidationReport,
  NexoraDirectorValidationProfile,
  NexoraDirectorIntegrationValidationInput,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorIntegrationCertificationIdentity =
  "NOL-3:7/NexoraObjectDirectorIntegrationCertification" as const;

export const directorIntegrationCertificationVersion = "1.0.0" as const;

export const directorIntegrationCertificationSchemaVersion =
  "1.0.0" as const;

export const NOL_DIRECTOR_CERTIFICATION_IDENTITY =
  directorIntegrationCertificationIdentity;
export const NOL_DIRECTOR_CERTIFICATION_VERSION =
  directorIntegrationCertificationVersion;
export const NOL_DIRECTOR_CERTIFICATION_SCHEMA_VERSION =
  directorIntegrationCertificationSchemaVersion;

export const NOL_DIRECTOR_CERTIFICATION_UPSTREAM = Object.freeze([
  nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
] as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraDirectorCertificationProfile =
  | "Development"
  | "Testing"
  | "Production"
  | "Platform"
  | "Release";

export type NexoraDirectorCertificationStatus =
  | "NotCertified"
  | "Pending"
  | "Certified"
  | "Expired"
  | "Revoked";

export interface NexoraDirectorCertificationStamp {
  readonly certificationId: string;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly status: NexoraDirectorCertificationStatus;
  readonly validationReportId: string;
  readonly validationProfile: NexoraDirectorValidationProfile;
  readonly integrityScore: number;
  readonly certifiedAt?: string;
  readonly expiresAt?: string;
  readonly certifiedBy: string;
  readonly engineVersion: string;
  readonly schemaVersion: string;
}

export interface NexoraDirectorCertificationHistoryEntry {
  readonly timestamp: string;
  readonly previousStatus: NexoraDirectorCertificationStatus;
  readonly newStatus: NexoraDirectorCertificationStatus;
  readonly reason: string;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly validationReportId: string;
}

export type NexoraDirectorCertificationWarningCode =
  | "DIRECTOR_CERT_LOW_SCORE"
  | "DIRECTOR_CERT_NEAR_EXPIRY"
  | "DIRECTOR_CERT_OLDER_ENGINE"
  | "DIRECTOR_CERT_COMPATIBILITY_WARNING"
  | "DIRECTOR_CERT_RECERTIFICATION_REQUIRED";

export type NexoraDirectorCertificationErrorCode =
  | "DIRECTOR_CERT_VALIDATION_FAILED"
  | "DIRECTOR_CERT_SCORE_TOO_LOW"
  | "DIRECTOR_CERT_UNSUPPORTED_VERSION"
  | "DIRECTOR_CERT_SCHEMA_INVALID"
  | "DIRECTOR_CERT_ALREADY_REVOKED"
  | "DIRECTOR_CERT_ALREADY_EXPIRED"
  | "DIRECTOR_CERT_POLICY_REJECTED"
  | "DIRECTOR_CERT_INVALID_PROFILE";

export interface NexoraDirectorCertificationWarning {
  readonly code: NexoraDirectorCertificationWarningCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorCertificationError {
  readonly code: NexoraDirectorCertificationErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorCertificationReport {
  readonly reportId: string;
  readonly accepted: boolean;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly status: NexoraDirectorCertificationStatus;
  readonly stamp?: NexoraDirectorCertificationStamp;
  readonly validationReport: NexoraDirectorValidationReport;
  readonly warnings: readonly NexoraDirectorCertificationWarning[];
  readonly errors: readonly NexoraDirectorCertificationError[];
  readonly history: readonly NexoraDirectorCertificationHistoryEntry[];
  readonly createdAt: string;
}

export interface NexoraDirectorCertificationPolicy {
  readonly minimumIntegrityScore: number;
  readonly requiredValidationProfile: NexoraDirectorValidationProfile;
  readonly defaultExpiresInMs?: number;
  readonly allowExpiredRecertification: boolean;
  readonly allowRevokedRecertification: boolean;
}

export type NexoraDirectorCertificationProjectionKind =
  | "Consumer"
  | "Platform"
  | "Release"
  | "Diagnostics";

export interface NexoraDirectorCertificationDependencies {
  readonly now: () => string;
  readonly createReportId: () => string;
  readonly createCertificationId: () => string;
}

export interface NexoraDirectorCertificationRequest {
  readonly profile: NexoraDirectorCertificationProfile;
  readonly input?: NexoraDirectorIntegrationValidationInput;
  readonly validationReport?: NexoraDirectorValidationReport;
  readonly certifiedBy?: string;
  readonly policy?: Partial<NexoraDirectorCertificationPolicy>;
  readonly expiresAt?: string;
  readonly previousReport?: NexoraDirectorCertificationReport;
}

export interface NexoraDirectorCertificationPolicyEvaluation {
  readonly accepted: boolean;
  readonly status: NexoraDirectorCertificationStatus;
  readonly warnings: readonly NexoraDirectorCertificationWarning[];
  readonly errors: readonly NexoraDirectorCertificationError[];
  readonly effectivePolicy: NexoraDirectorCertificationPolicy;
}

export interface NexoraDirectorCertificationComparison {
  readonly sameProfile: boolean;
  readonly sameStatus: boolean;
  readonly sameValidationReportId: boolean;
  readonly integrityScoreDelta: number;
  readonly previousIntegrityScore: number;
  readonly nextIntegrityScore: number;
  readonly previousStatus: NexoraDirectorCertificationStatus;
  readonly nextStatus: NexoraDirectorCertificationStatus;
  readonly historyLengthDelta: number;
  readonly schemaVersionMatch: boolean;
  readonly engineVersionMatch: boolean;
}

export interface NexoraDirectorCertificationConsumerProjection {
  readonly kind: "Consumer";
  readonly status: NexoraDirectorCertificationStatus;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly accepted: boolean;
  readonly stampSummary?: Readonly<{
    readonly certificationId: string;
    readonly status: NexoraDirectorCertificationStatus;
    readonly certifiedAt?: string;
    readonly expiresAt?: string;
  }>;
}

export interface NexoraDirectorCertificationPlatformProjection {
  readonly kind: "Platform";
  readonly status: NexoraDirectorCertificationStatus;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly accepted: boolean;
  readonly integrityScore: number;
  readonly validationProfile: NexoraDirectorValidationProfile;
  readonly expiresAt?: string;
  readonly stampSummary?: Readonly<{
    readonly certificationId: string;
    readonly status: NexoraDirectorCertificationStatus;
    readonly certifiedAt?: string;
    readonly expiresAt?: string;
  }>;
}

export interface NexoraDirectorCertificationReleaseProjection {
  readonly kind: "Release";
  readonly rejected: boolean;
  readonly status: NexoraDirectorCertificationStatus;
  readonly profile: NexoraDirectorCertificationProfile;
  readonly accepted: boolean;
  readonly certificationId?: string;
  readonly integrityScore?: number;
  readonly expiresAt?: string;
  readonly rejectionReason?: string;
}

export interface NexoraDirectorCertificationDiagnosticsProjection {
  readonly kind: "Diagnostics";
  readonly report: NexoraDirectorCertificationReport;
  readonly historyLength: number;
  readonly warningCount: number;
  readonly errorCount: number;
}

export type NexoraDirectorCertificationProjection =
  | NexoraDirectorCertificationConsumerProjection
  | NexoraDirectorCertificationPlatformProjection
  | NexoraDirectorCertificationReleaseProjection
  | NexoraDirectorCertificationDiagnosticsProjection;

export type NexoraDirectorCertificationExceptionDetails = {
  readonly code: NexoraDirectorCertificationErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export class NexoraDirectorIntegrationCertificationException extends Error {
  readonly code: NexoraDirectorCertificationErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorCertificationExceptionDetails) {
    super(error.message);
    this.name = "NexoraDirectorIntegrationCertificationException";
    this.code = error.code;
    this.details = error.details;
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CERTIFICATION_PROFILES = Object.freeze([
  "Development",
  "Testing",
  "Production",
  "Platform",
  "Release",
] as const satisfies readonly NexoraDirectorCertificationProfile[]);

const DEFAULT_MINIMUM_INTEGRITY_SCORES: Readonly<
  Record<NexoraDirectorCertificationProfile, number>
> = Object.freeze({
  Development: 60,
  Testing: 75,
  Production: 85,
  Platform: 90,
  Release: 95,
});

const DEFAULT_REQUIRED_VALIDATION_PROFILES: Readonly<
  Record<NexoraDirectorCertificationProfile, NexoraDirectorValidationProfile>
> = Object.freeze({
  Development: "Standard",
  Testing: "Standard",
  Production: "Strict",
  Platform: "Certification",
  Release: "Certification",
});

const VALIDATION_PROFILE_RANK: Readonly<
  Record<NexoraDirectorValidationProfile, number>
> = Object.freeze({
  Minimal: 0,
  Standard: 1,
  Strict: 2,
  Certification: 3,
});

const NEAR_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const LOW_SCORE_MARGIN = 5;

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function warning(
  code: NexoraDirectorCertificationWarningCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraDirectorCertificationWarning {
  return deepFreeze({ code, message, ...(details ? { details } : {}) });
}

function error(
  code: NexoraDirectorCertificationErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraDirectorCertificationError {
  return deepFreeze({ code, message, ...(details ? { details } : {}) });
}

function throwCertification(
  details: NexoraDirectorCertificationExceptionDetails,
): never {
  throw new NexoraDirectorIntegrationCertificationException(details);
}

export function defaultDeps(): NexoraDirectorCertificationDependencies {
  let seq = 0;
  return Object.freeze({
    now: (): string => new Date().toISOString(),
    createReportId: (): string => {
      seq += 1;
      return `dir-cert-report:${seq}`;
    },
    createCertificationId: (): string => {
      seq += 1;
      return `dir-cert:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationDependencies {
  if (!dependencies) return defaultDeps();
  return Object.freeze({
    now: dependencies.now,
    createReportId: dependencies.createReportId,
    createCertificationId: dependencies.createCertificationId,
  });
}

function isCertificationProfile(
  profile: string,
): profile is NexoraDirectorCertificationProfile {
  return (CERTIFICATION_PROFILES as readonly string[]).includes(profile);
}

function validationProfileMeetsRequired(
  actual: NexoraDirectorValidationProfile,
  required: NexoraDirectorValidationProfile,
): boolean {
  return VALIDATION_PROFILE_RANK[actual] >= VALIDATION_PROFILE_RANK[required];
}

function resolveEffectivePolicy(
  profile: NexoraDirectorCertificationProfile,
  overrides?: Partial<NexoraDirectorCertificationPolicy>,
): NexoraDirectorCertificationPolicy {
  return deepFreeze({
    minimumIntegrityScore: DEFAULT_MINIMUM_INTEGRITY_SCORES[profile],
    requiredValidationProfile: DEFAULT_REQUIRED_VALIDATION_PROFILES[profile],
    allowExpiredRecertification: false,
    allowRevokedRecertification: false,
    ...overrides,
  });
}

function extractReportMetadata(
  validationReport: NexoraDirectorValidationReport,
): {
  readonly engineVersion?: string;
  readonly schemaVersion?: string;
} {
  const metadata = validationReport.metadata;
  const engineVersion =
    typeof metadata.engineVersion === "string"
      ? metadata.engineVersion
      : undefined;
  const schemaVersion =
    typeof metadata.schemaVersion === "string"
      ? metadata.schemaVersion
      : undefined;
  return { engineVersion, schemaVersion };
}

function computeExpiresAt(
  certifiedAt: string,
  policy: NexoraDirectorCertificationPolicy,
  explicitExpiresAt?: string,
): string | undefined {
  if (explicitExpiresAt !== undefined) return explicitExpiresAt;
  if (policy.defaultExpiresInMs === undefined) return undefined;
  const base = Date.parse(certifiedAt);
  if (Number.isNaN(base)) return undefined;
  return new Date(base + policy.defaultExpiresInMs).toISOString();
}

function isExpired(
  expiresAt: string | undefined,
  nowIso: string,
): boolean {
  if (!expiresAt) return false;
  const expiresMs = Date.parse(expiresAt);
  const nowMs = Date.parse(nowIso);
  if (Number.isNaN(expiresMs) || Number.isNaN(nowMs)) return false;
  return nowMs >= expiresMs;
}

function stampSummary(
  stamp: NexoraDirectorCertificationStamp | undefined,
): NexoraDirectorCertificationConsumerProjection["stampSummary"] {
  if (!stamp) return undefined;
  return deepFreeze({
    certificationId: stamp.certificationId,
    status: stamp.status,
    certifiedAt: stamp.certifiedAt,
    expiresAt: stamp.expiresAt,
  });
}

function resolveValidationReport(
  request: NexoraDirectorCertificationRequest,
  requiredProfile: NexoraDirectorValidationProfile,
  deps: NexoraDirectorCertificationDependencies,
): NexoraDirectorValidationReport {
  if (request.validationReport) {
    return request.validationReport;
  }
  if (!request.input) {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message:
        "Certification request must provide validationReport or input.",
    });
  }
  return validateDirectorIntegration(request.input, requiredProfile, {
    now: deps.now,
    createReportId: deps.createReportId,
    createSuggestionId: (): string => "dir-cert-val-suggestion",
    elapsedMs: (): number => 0,
  });
}

function normalizeStamp(
  raw: NexoraDirectorCertificationStamp,
): NexoraDirectorCertificationStamp {
  return deepFreeze({
    certificationId: raw.certificationId,
    profile: raw.profile,
    status: raw.status,
    validationReportId: raw.validationReportId,
    validationProfile: raw.validationProfile,
    integrityScore: raw.integrityScore,
    certifiedAt: raw.certifiedAt,
    expiresAt: raw.expiresAt,
    certifiedBy: raw.certifiedBy,
    engineVersion: raw.engineVersion,
    schemaVersion: raw.schemaVersion,
  });
}

function appendHistory(
  previous: readonly NexoraDirectorCertificationHistoryEntry[],
  entry: NexoraDirectorCertificationHistoryEntry,
): readonly NexoraDirectorCertificationHistoryEntry[] {
  return Object.freeze([...previous, entry]);
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function evaluateDirectorCertificationPolicy(
  validationReport: NexoraDirectorValidationReport,
  profile: NexoraDirectorCertificationProfile,
  policyOverrides?: Partial<NexoraDirectorCertificationPolicy>,
): NexoraDirectorCertificationPolicyEvaluation {
  if (!isCertificationProfile(profile)) {
    return deepFreeze({
      accepted: false,
      status: "NotCertified",
      warnings: Object.freeze([]),
      errors: Object.freeze([
        error(
          "DIRECTOR_CERT_INVALID_PROFILE",
          `Invalid certification profile: ${profile}`,
        ),
      ]),
      effectivePolicy: resolveEffectivePolicy("Development", policyOverrides),
    });
  }

  const effectivePolicy = resolveEffectivePolicy(profile, policyOverrides);
  const warnings: NexoraDirectorCertificationWarning[] = [];
  const errors: NexoraDirectorCertificationError[] = [];

  if (!validationReport.passed) {
    errors.push(
      error(
        "DIRECTOR_CERT_VALIDATION_FAILED",
        "Validation report did not pass.",
        { errorCount: validationReport.errors.length },
      ),
    );
  }

  if (
    !validationProfileMeetsRequired(
      validationReport.profile,
      effectivePolicy.requiredValidationProfile,
    )
  ) {
    errors.push(
      error(
        "DIRECTOR_CERT_POLICY_REJECTED",
        `Validation profile ${validationReport.profile} does not meet required ${effectivePolicy.requiredValidationProfile}.`,
        {
          actual: validationReport.profile,
          required: effectivePolicy.requiredValidationProfile,
        },
      ),
    );
  }

  if (validationReport.score < effectivePolicy.minimumIntegrityScore) {
    errors.push(
      error(
        "DIRECTOR_CERT_SCORE_TOO_LOW",
        `Integrity score ${validationReport.score} is below minimum ${effectivePolicy.minimumIntegrityScore}.`,
        {
          score: validationReport.score,
          minimum: effectivePolicy.minimumIntegrityScore,
        },
      ),
    );
  } else if (
    validationReport.score <
    effectivePolicy.minimumIntegrityScore + LOW_SCORE_MARGIN
  ) {
    warnings.push(
      warning(
        "DIRECTOR_CERT_LOW_SCORE",
        `Integrity score ${validationReport.score} is near the minimum threshold.`,
        {
          score: validationReport.score,
          minimum: effectivePolicy.minimumIntegrityScore,
        },
      ),
    );
  }

  const { engineVersion, schemaVersion } = extractReportMetadata(validationReport);
  if (
    schemaVersion !== undefined &&
    schemaVersion !==
      nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion
  ) {
    errors.push(
      error(
        "DIRECTOR_CERT_UNSUPPORTED_VERSION",
        `Unsupported validation schema version: ${schemaVersion}.`,
        { schemaVersion },
      ),
    );
  }
  if (
    engineVersion !== undefined &&
    engineVersion !==
      nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion
  ) {
    warnings.push(
      warning(
        "DIRECTOR_CERT_OLDER_ENGINE",
        `Validation engine version ${engineVersion} differs from current ${nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion}.`,
        { engineVersion },
      ),
    );
  }

  if (validationReport.warnings.length > 0) {
    warnings.push(
      warning(
        "DIRECTOR_CERT_COMPATIBILITY_WARNING",
        "Validation report contains compatibility warnings.",
        { warningCount: validationReport.warnings.length },
      ),
    );
  }

  const accepted = errors.length === 0;
  const status: NexoraDirectorCertificationStatus = accepted
    ? "Certified"
    : validationReport.passed
      ? "Pending"
      : "NotCertified";

  return deepFreeze({
    accepted,
    status,
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze([...errors]),
    effectivePolicy,
  });
}

export function createDirectorCertificationStamp(
  validationReport: NexoraDirectorValidationReport,
  profile: NexoraDirectorCertificationProfile,
  options: {
    readonly accepted: boolean;
    readonly certifiedBy: string;
    readonly expiresAt?: string;
    readonly defaultExpiresInMs?: number;
    readonly certificationId?: string;
  },
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationStamp {
  const resolved = resolveDeps(deps);
  const certifiedAt = resolved.now();
  const expiresAt = computeExpiresAt(certifiedAt, {
    minimumIntegrityScore: DEFAULT_MINIMUM_INTEGRITY_SCORES[profile],
    requiredValidationProfile: DEFAULT_REQUIRED_VALIDATION_PROFILES[profile],
    defaultExpiresInMs: options.defaultExpiresInMs,
    allowExpiredRecertification: false,
    allowRevokedRecertification: false,
  }, options.expiresAt);

  return deepFreeze({
    certificationId:
      options.certificationId ?? resolved.createCertificationId(),
    profile,
    status: options.accepted ? ("Certified" as const) : ("Pending" as const),
    validationReportId: validationReport.reportId,
    validationProfile: validationReport.profile,
    integrityScore: validationReport.score,
    certifiedAt: options.accepted ? certifiedAt : undefined,
    expiresAt: options.accepted ? expiresAt : undefined,
    certifiedBy: options.certifiedBy,
    engineVersion: directorIntegrationCertificationVersion,
    schemaVersion: directorIntegrationCertificationSchemaVersion,
  });
}

export function certifyDirectorIntegration(
  request: NexoraDirectorCertificationRequest,
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationReport {
  const resolved = resolveDeps(deps);

  if (!isCertificationProfile(request.profile)) {
    const emptyValidation = resolveValidationReport(
      { ...request, input: request.input ?? {} },
      "Minimal",
      resolved,
    );
    return deepFreeze({
      reportId: resolved.createReportId(),
      accepted: false,
      profile: request.profile,
      status: "NotCertified",
      validationReport: emptyValidation,
      warnings: Object.freeze([]),
      errors: Object.freeze([
        error(
          "DIRECTOR_CERT_INVALID_PROFILE",
          `Invalid certification profile: ${String(request.profile)}`,
        ),
      ]),
      history: Object.freeze([]),
      createdAt: resolved.now(),
    });
  }

  const effectivePolicy = resolveEffectivePolicy(
    request.profile,
    request.policy,
  );
  const validationReport = resolveValidationReport(
    request,
    effectivePolicy.requiredValidationProfile,
    resolved,
  );
  const evaluation = evaluateDirectorCertificationPolicy(
    validationReport,
    request.profile,
    request.policy,
  );

  const previousStatus: NexoraDirectorCertificationStatus =
    request.previousReport?.status ?? "NotCertified";
  const previousHistory = request.previousReport?.history ?? Object.freeze([]);

  const historyEntry: NexoraDirectorCertificationHistoryEntry = deepFreeze({
    timestamp: resolved.now(),
    previousStatus,
    newStatus: evaluation.accepted ? "Certified" : evaluation.status,
    reason: evaluation.accepted
      ? "Certification accepted."
      : "Certification rejected by policy.",
    profile: request.profile,
    validationReportId: validationReport.reportId,
  });

  const stamp = evaluation.accepted
    ? createDirectorCertificationStamp(
        validationReport,
        request.profile,
        {
          accepted: true,
          certifiedBy: request.certifiedBy ?? "system",
          expiresAt: request.expiresAt,
          defaultExpiresInMs: effectivePolicy.defaultExpiresInMs,
        },
        resolved,
      )
    : undefined;

  const warnings = [...evaluation.warnings];
  if (
    stamp?.expiresAt &&
    !Number.isNaN(Date.parse(stamp.expiresAt)) &&
    !Number.isNaN(Date.parse(resolved.now()))
  ) {
    const remaining =
      Date.parse(stamp.expiresAt) - Date.parse(resolved.now());
    if (remaining >= 0 && remaining <= NEAR_EXPIRY_MS) {
      warnings.push(
        warning(
          "DIRECTOR_CERT_NEAR_EXPIRY",
          "Certification is near expiry.",
          { expiresAt: stamp.expiresAt, remainingMs: remaining },
        ),
      );
    }
  }

  return deepFreeze({
    reportId: resolved.createReportId(),
    accepted: evaluation.accepted,
    profile: request.profile,
    status: evaluation.accepted ? "Certified" : evaluation.status,
    stamp,
    validationReport,
    warnings: Object.freeze(warnings),
    errors: evaluation.errors,
    history: appendHistory(previousHistory, historyEntry),
    createdAt: resolved.now(),
  });
}

export function recertifyDirectorIntegration(
  previousReport: NexoraDirectorCertificationReport,
  request: Omit<NexoraDirectorCertificationRequest, "previousReport">,
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationReport {
  const resolved = resolveDeps(deps);
  const effectivePolicy = resolveEffectivePolicy(
    request.profile,
    request.policy,
  );

  if (
    previousReport.status === "Revoked" &&
    !effectivePolicy.allowRevokedRecertification
  ) {
    return deepFreeze({
      reportId: resolved.createReportId(),
      accepted: false,
      profile: request.profile,
      status: "Revoked",
      validationReport: previousReport.validationReport,
      warnings: Object.freeze([
        warning(
          "DIRECTOR_CERT_RECERTIFICATION_REQUIRED",
          "Recertification of revoked certification is not allowed by policy.",
        ),
      ]),
      errors: Object.freeze([
        error(
          "DIRECTOR_CERT_ALREADY_REVOKED",
          "Cannot recertify a revoked certification without allowRevokedRecertification.",
        ),
      ]),
      history: previousReport.history,
      createdAt: resolved.now(),
    });
  }

  if (
    previousReport.status === "Expired" &&
    !effectivePolicy.allowExpiredRecertification
  ) {
    return deepFreeze({
      reportId: resolved.createReportId(),
      accepted: false,
      profile: request.profile,
      status: "Expired",
      validationReport: previousReport.validationReport,
      warnings: Object.freeze([
        warning(
          "DIRECTOR_CERT_RECERTIFICATION_REQUIRED",
          "Recertification of expired certification is not allowed by policy.",
        ),
      ]),
      errors: Object.freeze([
        error(
          "DIRECTOR_CERT_ALREADY_EXPIRED",
          "Cannot recertify an expired certification without allowExpiredRecertification.",
        ),
      ]),
      history: previousReport.history,
      createdAt: resolved.now(),
    });
  }

  return certifyDirectorIntegration(
    {
      ...request,
      previousReport,
    },
    deps,
  );
}

export function revokeDirectorCertification(
  report: NexoraDirectorCertificationReport,
  reason: string,
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationReport {
  const resolved = resolveDeps(deps);

  if (report.status === "Revoked") {
    return deepFreeze({
      ...report,
      accepted: false,
      status: "Revoked",
      errors: Object.freeze([
        ...report.errors,
        error(
          "DIRECTOR_CERT_ALREADY_REVOKED",
          "Certification is already revoked.",
        ),
      ]),
      createdAt: resolved.now(),
    });
  }

  const historyEntry: NexoraDirectorCertificationHistoryEntry = deepFreeze({
    timestamp: resolved.now(),
    previousStatus: report.status,
    newStatus: "Revoked",
    reason,
    profile: report.profile,
    validationReportId: report.validationReport.reportId,
  });

  const stamp = report.stamp
    ? deepFreeze({
        ...report.stamp,
        status: "Revoked" as const,
      })
    : undefined;

  return deepFreeze({
    reportId: resolved.createReportId(),
    accepted: false,
    profile: report.profile,
    status: "Revoked",
    stamp,
    validationReport: report.validationReport,
    warnings: report.warnings,
    errors: report.errors,
    history: appendHistory(report.history, historyEntry),
    createdAt: resolved.now(),
  });
}

export function expireDirectorCertification(
  report: NexoraDirectorCertificationReport,
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationReport {
  const resolved = resolveDeps(deps);

  if (report.status === "Revoked") {
    return deepFreeze({
      ...report,
      accepted: false,
      errors: Object.freeze([
        ...report.errors,
        error(
          "DIRECTOR_CERT_ALREADY_REVOKED",
          "Cannot expire a revoked certification.",
        ),
      ]),
      createdAt: resolved.now(),
    });
  }

  if (report.status === "Expired") {
    return deepFreeze({
      ...report,
      accepted: false,
      errors: Object.freeze([
        ...report.errors,
        error(
          "DIRECTOR_CERT_ALREADY_EXPIRED",
          "Certification is already expired.",
        ),
      ]),
      createdAt: resolved.now(),
    });
  }

  const historyEntry: NexoraDirectorCertificationHistoryEntry = deepFreeze({
    timestamp: resolved.now(),
    previousStatus: report.status,
    newStatus: "Expired",
    reason: "Certification expired.",
    profile: report.profile,
    validationReportId: report.validationReport.reportId,
  });

  const stamp = report.stamp
    ? deepFreeze({
        ...report.stamp,
        status: "Expired" as const,
      })
    : undefined;

  return deepFreeze({
    reportId: resolved.createReportId(),
    accepted: false,
    profile: report.profile,
    status: "Expired",
    stamp,
    validationReport: report.validationReport,
    warnings: report.warnings,
    errors: report.errors,
    history: appendHistory(report.history, historyEntry),
    createdAt: resolved.now(),
  });
}

export function compareDirectorCertifications(
  a: NexoraDirectorCertificationReport,
  b: NexoraDirectorCertificationReport,
): NexoraDirectorCertificationComparison {
  const aEngine = a.stamp?.engineVersion ?? directorIntegrationCertificationVersion;
  const bEngine = b.stamp?.engineVersion ?? directorIntegrationCertificationVersion;
  const aSchema = a.stamp?.schemaVersion ?? directorIntegrationCertificationSchemaVersion;
  const bSchema = b.stamp?.schemaVersion ?? directorIntegrationCertificationSchemaVersion;

  return deepFreeze({
    sameProfile: a.profile === b.profile,
    sameStatus: a.status === b.status,
    sameValidationReportId:
      a.validationReport.reportId === b.validationReport.reportId,
    integrityScoreDelta:
      b.validationReport.score - a.validationReport.score,
    previousIntegrityScore: a.validationReport.score,
    nextIntegrityScore: b.validationReport.score,
    previousStatus: a.status,
    nextStatus: b.status,
    historyLengthDelta: b.history.length - a.history.length,
    schemaVersionMatch: aSchema === bSchema,
    engineVersionMatch: aEngine === bEngine,
  });
}

export function projectDirectorCertification(
  report: NexoraDirectorCertificationReport,
  kind: NexoraDirectorCertificationProjectionKind,
  deps?: NexoraDirectorCertificationDependencies,
): NexoraDirectorCertificationProjection {
  const resolved = resolveDeps(deps);
  const nowIso = resolved.now();
  const expired = isExpired(report.stamp?.expiresAt, nowIso);

  switch (kind) {
    case "Consumer":
      return deepFreeze({
        kind: "Consumer",
        status: report.status,
        profile: report.profile,
        accepted: report.accepted,
        stampSummary: stampSummary(report.stamp),
      });
    case "Platform":
      return deepFreeze({
        kind: "Platform",
        status: report.status,
        profile: report.profile,
        accepted: report.accepted,
        integrityScore: report.validationReport.score,
        validationProfile: report.validationReport.profile,
        expiresAt: report.stamp?.expiresAt,
        stampSummary: stampSummary(report.stamp),
      });
    case "Release": {
      const rejected =
        report.status !== "Certified" ||
        report.profile !== "Release" ||
        expired ||
        !report.accepted;
      let rejectionReason: string | undefined;
      if (report.status !== "Certified") {
        rejectionReason = `Status is ${report.status}, expected Certified.`;
      } else if (report.profile !== "Release") {
        rejectionReason = `Profile is ${report.profile}, expected Release.`;
      } else if (expired) {
        rejectionReason = "Certification has expired.";
      } else if (!report.accepted) {
        rejectionReason = "Certification was not accepted.";
      }
      return deepFreeze({
        kind: "Release",
        rejected,
        status: report.status,
        profile: report.profile,
        accepted: report.accepted,
        certificationId: rejected ? undefined : report.stamp?.certificationId,
        integrityScore: rejected ? undefined : report.validationReport.score,
        expiresAt: rejected ? undefined : report.stamp?.expiresAt,
        rejectionReason,
      });
    }
    case "Diagnostics":
      return deepFreeze({
        kind: "Diagnostics",
        report,
        historyLength: report.history.length,
        warningCount: report.warnings.length,
        errorCount: report.errors.length,
      });
    default: {
      const _exhaustive: never = kind;
      void _exhaustive;
      return deepFreeze({
        kind: "Consumer",
        status: report.status,
        profile: report.profile,
        accepted: report.accepted,
      });
    }
  }
}

export function validateDirectorCertification(
  stamp: NexoraDirectorCertificationStamp,
): readonly NexoraDirectorCertificationError[] {
  const errors: NexoraDirectorCertificationError[] = [];

  if (!stamp.certificationId) {
    errors.push(
      error(
        "DIRECTOR_CERT_SCHEMA_INVALID",
        "Certification stamp is missing certificationId.",
      ),
    );
  }
  if (stamp.schemaVersion !== directorIntegrationCertificationSchemaVersion) {
    errors.push(
      error(
        "DIRECTOR_CERT_UNSUPPORTED_VERSION",
        `Unsupported stamp schema version: ${stamp.schemaVersion}.`,
        { schemaVersion: stamp.schemaVersion },
      ),
    );
  }
  if (!isCertificationProfile(stamp.profile)) {
    errors.push(
      error(
        "DIRECTOR_CERT_INVALID_PROFILE",
        `Invalid stamp profile: ${stamp.profile}.`,
      ),
    );
  }

  return Object.freeze(errors);
}

export function validateDirectorCertificationReport(
  report: NexoraDirectorCertificationReport,
): readonly NexoraDirectorCertificationError[] {
  const errors: NexoraDirectorCertificationError[] = [];

  if (!report.reportId) {
    errors.push(
      error(
        "DIRECTOR_CERT_SCHEMA_INVALID",
        "Certification report is missing reportId.",
      ),
    );
  }
  if (!isCertificationProfile(report.profile)) {
    errors.push(
      error(
        "DIRECTOR_CERT_INVALID_PROFILE",
        `Invalid report profile: ${report.profile}.`,
      ),
    );
  }
  if (report.stamp) {
    errors.push(...validateDirectorCertification(report.stamp));
  }
  if (report.accepted && !report.stamp) {
    errors.push(
      error(
        "DIRECTOR_CERT_SCHEMA_INVALID",
        "Accepted certification report must include a stamp.",
      ),
    );
  }

  return Object.freeze(errors);
}

export function assertDirectorCertificationInvariants(
  report: NexoraDirectorCertificationReport,
): void {
  const issues = validateDirectorCertificationReport(report);
  if (issues.length > 0) {
    const first = issues[0]!;
    throwCertification({
      code: first.code,
      message: first.message,
      details: first.details,
    });
  }
  if (!isDeeplyFrozen(report)) {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: "Certification report must be deeply immutable.",
    });
  }
}

export function serializeDirectorCertification(
  stamp: NexoraDirectorCertificationStamp,
): string {
  return JSON.stringify({
    identity: directorIntegrationCertificationIdentity,
    version: directorIntegrationCertificationVersion,
    schemaVersion: directorIntegrationCertificationSchemaVersion,
    kind: "certificationStamp",
    stamp,
  });
}

export function deserializeDirectorCertification(
  json: string,
): NexoraDirectorCertificationStamp {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: "Certification stamp JSON is corrupted.",
    });
  }
  if (
    parsed.schemaVersion !== directorIntegrationCertificationSchemaVersion
  ) {
    throwCertification({
      code: "DIRECTOR_CERT_UNSUPPORTED_VERSION",
      message: `Unsupported certification stamp schema: ${String(parsed.schemaVersion)}.`,
      details: { schemaVersion: parsed.schemaVersion },
    });
  }
  if (parsed.kind !== "certificationStamp") {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: `Expected envelope kind certificationStamp, received ${String(parsed.kind)}.`,
    });
  }
  if (parsed.identity !== directorIntegrationCertificationIdentity) {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: "Certification stamp identity is corrupted.",
      details: { identity: parsed.identity },
    });
  }
  const raw = parsed.stamp as NexoraDirectorCertificationStamp;
  return normalizeStamp(raw);
}

export function serializeDirectorCertificationReport(
  report: NexoraDirectorCertificationReport,
): string {
  return JSON.stringify({
    identity: directorIntegrationCertificationIdentity,
    version: directorIntegrationCertificationVersion,
    schemaVersion: directorIntegrationCertificationSchemaVersion,
    kind: "certificationReport",
    report: {
      ...report,
      validationReport: JSON.parse(
        serializeNexoraDirectorValidationReport(report.validationReport),
      ),
    },
  });
}

export function deserializeDirectorCertificationReport(
  json: string,
): NexoraDirectorCertificationReport {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: "Certification report JSON is corrupted.",
    });
  }
  if (
    parsed.schemaVersion !== directorIntegrationCertificationSchemaVersion
  ) {
    throwCertification({
      code: "DIRECTOR_CERT_UNSUPPORTED_VERSION",
      message: `Unsupported certification report schema: ${String(parsed.schemaVersion)}.`,
      details: { schemaVersion: parsed.schemaVersion },
    });
  }
  if (parsed.kind !== "certificationReport") {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: `Expected envelope kind certificationReport, received ${String(parsed.kind)}.`,
    });
  }
  if (parsed.identity !== directorIntegrationCertificationIdentity) {
    throwCertification({
      code: "DIRECTOR_CERT_SCHEMA_INVALID",
      message: "Certification report identity is corrupted.",
      details: { identity: parsed.identity },
    });
  }

  const envelope = parsed.report as Record<string, unknown>;
  const validationReport = deserializeNexoraDirectorValidationReport(
    JSON.stringify(envelope.validationReport),
  );
  const rawReport = envelope as Omit<
    NexoraDirectorCertificationReport,
    "validationReport" | "stamp"
  > & {
    readonly stamp?: NexoraDirectorCertificationStamp;
  };

  return deepFreeze({
    ...rawReport,
    stamp: rawReport.stamp ? normalizeStamp(rawReport.stamp) : undefined,
    validationReport,
  } as NexoraDirectorCertificationReport);
}

export function getNexoraObjectDirectorIntegrationCertificationSummary() {
  return Object.freeze({
    identity: directorIntegrationCertificationIdentity,
    version: directorIntegrationCertificationVersion,
    schemaVersion: directorIntegrationCertificationSchemaVersion,
    upstream: NOL_DIRECTOR_CERTIFICATION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    sideEffectFree: true,
  });
}

export const NexoraObjectDirectorIntegrationCertification = Object.freeze({
  identity: directorIntegrationCertificationIdentity,
  version: directorIntegrationCertificationVersion,
  schemaVersion: directorIntegrationCertificationSchemaVersion,
  evaluateDirectorCertificationPolicy,
  createDirectorCertificationStamp,
  certifyDirectorIntegration,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  expireDirectorCertification,
  compareDirectorCertifications,
  projectDirectorCertification,
  validateDirectorCertification,
  validateDirectorCertificationReport,
  assertDirectorCertificationInvariants,
  serializeDirectorCertification,
  deserializeDirectorCertification,
  serializeDirectorCertificationReport,
  deserializeDirectorCertificationReport,
  summary: getNexoraObjectDirectorIntegrationCertificationSummary,
});
