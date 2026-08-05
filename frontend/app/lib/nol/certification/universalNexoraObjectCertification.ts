/**
 * NOL-1:7 — Universal NexoraObject Certification
 *
 * Official trust gate for every NexoraObject. Certification is separate from
 * validation: validation checks correctness; certification grants platform use.
 *
 * Upstream: NOL-1:1 … NOL-1:6 only.
 * Identity: NOL-1:7/UniversalNexoraObjectCertification
 */

import {
  NOL_FOUNDATION_VERSION,
} from "../foundation/universalNexoraObjectFoundation.ts";
import {
  NOL_CONTRACT_VERSION,
  NOL_SCHEMA_VERSION,
  isNexoraObject,
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";
import { NOL_RUNTIME_SCHEMA_VERSION } from "../runtime/universalNexoraObjectRuntimeModel.ts";
import { NOL_STE_STATE_SCHEMA_VERSION } from "../state/universalNexoraObjectStateTransitionEngine.ts";
import { NOL_RELATIONSHIP_SCHEMA_VERSION } from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";
import {
  NOL_VALIDATION_IDENTITY,
  NOL_VALIDATION_SCHEMA_VERSION,
  createValidationReport,
  validateNexoraObject,
  type NexoraObjectValidationResult,
  type NexoraValidationLevel,
  type NexoraValidationOptions,
  type NexoraValidationReport,
} from "../validation/universalNexoraObjectValidationIntegrityEngine.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const NOL_CERTIFICATION_IDENTITY =
  "NOL-1:7/UniversalNexoraObjectCertification" as const;

export const NOL_CERTIFICATION_ENGINE_VERSION = "1.0.0" as const;

export const NOL_CERTIFICATION_SCHEMA_VERSION = "1.0.0" as const;

export const certificationIdentity = NOL_CERTIFICATION_IDENTITY;
export const certificationEngineVersion = NOL_CERTIFICATION_ENGINE_VERSION;
export const certificationSchemaVersion = NOL_CERTIFICATION_SCHEMA_VERSION;

export const NOL_CERTIFICATION_TAGS = Object.freeze([
  "[NOL-1:7]",
  "[UNIVERSAL_NEXORA_OBJECT_CERTIFICATION]",
  "[TRUST_GATE]",
  "[SEPARATE_FROM_VALIDATION]",
  "[APPEND_ONLY_HISTORY]",
] as const);

export const NOL_CERTIFICATION_UPSTREAM = Object.freeze([
  "NOL-1:1/UniversalNexoraObjectFoundation",
  "NOL-1:2/UniversalNexoraObjectContractModel",
  "NOL-1:3/UniversalNexoraObjectRuntimeModel",
  "NOL-1:4/UniversalNexoraObjectStateTransitionEngine",
  "NOL-1:5/UniversalNexoraObjectRelationshipDependencyEngine",
  "NOL-1:6/UniversalNexoraObjectValidationIntegrityEngine",
] as const);

// ─── Lifecycle & profiles ───────────────────────────────────────────────────

export type NexoraCertificationState =
  | "NotCertified"
  | "Pending"
  | "Certified"
  | "Expired"
  | "Revoked";

export type NexoraCertificationProfile =
  | "Development"
  | "Testing"
  | "Production"
  | "Platform"
  | "Release";

export type NexoraCertificationErrorCode =
  | "CERTIFICATION_NOT_FOUND"
  | "CERTIFICATION_VALIDATION_FAILED"
  | "CERTIFICATION_POLICY_REJECTED"
  | "CERTIFICATION_SCORE_TOO_LOW"
  | "CERTIFICATION_BLOCKING_WARNINGS"
  | "CERTIFICATION_UNRESOLVED_REPAIRS"
  | "CERTIFICATION_EXPIRED"
  | "CERTIFICATION_REVOKED"
  | "CERTIFICATION_UNSUPPORTED_VERSION"
  | "CERTIFICATION_INVALID_REQUEST"
  | "CERTIFICATION_IDENTITY_REQUIRED";

export type NexoraCertificationIssue = {
  readonly code: NexoraCertificationErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type NexoraCertificationEventType =
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed"
  | "CertificationRevoked"
  | "CertificationExpired"
  | "RecertificationCompleted";

export type NexoraCertificationEvent = {
  readonly eventId: string;
  readonly type: NexoraCertificationEventType;
  readonly objectId: string;
  readonly certificationId?: string;
  readonly profile?: NexoraCertificationProfile;
  readonly occurredAt: string;
  readonly payload: Readonly<Record<string, unknown>>;
};

export type NexoraCertificationPolicy = {
  readonly policyId: string;
  readonly profile: NexoraCertificationProfile;
  readonly minimumIntegrityScore: number;
  readonly maximumWarningCount: number;
  readonly requireZeroErrors: boolean;
  readonly requireZeroBlockingWarnings: boolean;
  readonly requireNoRepairSuggestions: boolean;
  readonly requiredValidationLevel: NexoraValidationLevel;
  readonly expirationDurationMs: number | null;
  readonly acceptedSchemaVersions: readonly string[];
};

export type NexoraCertificationStamp = {
  readonly certificationId: string;
  readonly certificationProfile: NexoraCertificationProfile;
  readonly integrityScore: number;
  readonly objectId: string;
  readonly objectType: string;
  readonly objectVersion: number;
  readonly schemaVersion: string;
  readonly foundationVersion: string;
  readonly contractVersion: string;
  readonly runtimeVersion: string;
  readonly stateVersion: string;
  readonly relationshipVersion: string;
  readonly validationVersion: string;
  readonly certificationSchemaVersion: typeof NOL_CERTIFICATION_SCHEMA_VERSION;
  readonly issuedAt: string;
  readonly expiresAt: string | null;
  readonly certifiedBy: string;
};

export type NexoraCertificationRecord = {
  readonly certificationId: string;
  readonly objectId: string;
  readonly profile: NexoraCertificationProfile;
  readonly state: NexoraCertificationState;
  readonly integrityScore: number;
  readonly certificationVersion: number;
  readonly issuedAt: string;
  readonly expiresAt: string | null;
  readonly certifiedBy: string;
  readonly reason?: string;
  readonly revokedAt?: string;
  readonly revocationReason?: string;
  readonly stamp: NexoraCertificationStamp;
  readonly validationReportId: string;
  readonly warningCount: number;
  readonly errorCount: number;
};

export type NexoraCertificationRequest = {
  readonly object: unknown;
  readonly profile: NexoraCertificationProfile;
  readonly validationLevel?: NexoraValidationLevel;
  readonly requestedBy: string;
  readonly reason?: string;
  readonly options?: {
    readonly validationOptions?: NexoraValidationOptions;
    readonly now?: () => string;
    readonly createCertificationId?: () => string;
    readonly createEventId?: () => string;
    readonly createReportId?: () => string;
    readonly expirationDurationMs?: number | null;
  };
};

export type NexoraCertificationResult = {
  readonly certified: boolean;
  readonly certificationState: NexoraCertificationState;
  readonly certificationProfile: NexoraCertificationProfile;
  readonly certificationId: string | null;
  readonly certificationVersion: number;
  readonly integrityScore: number;
  readonly validationReport: NexoraValidationReport | null;
  readonly stamp: NexoraCertificationStamp | null;
  readonly warnings: readonly NexoraCertificationIssue[];
  readonly errors: readonly NexoraCertificationIssue[];
  readonly issuedAt: string | null;
  readonly expiresAt: string | null;
  readonly certifiedBy: string | null;
  readonly events: readonly NexoraCertificationEvent[];
  readonly objectId?: string;
};

export type NexoraCertificationProjection = {
  readonly objectId: string;
  readonly certificationState: NexoraCertificationState;
  readonly certificationProfile: NexoraCertificationProfile | null;
  readonly certificationId: string | null;
  readonly integrityScore: number | null;
  readonly stamp: NexoraCertificationStamp | null;
  readonly issuedAt: string | null;
  readonly expiresAt: string | null;
  readonly certificationVersion: number;
  readonly historyCount: number;
  readonly engineIdentity: typeof NOL_CERTIFICATION_IDENTITY;
};

export type NexoraCertificationReport = {
  readonly reportId: string;
  readonly summary: string;
  readonly result: NexoraCertificationResult;
  readonly createdAt: string;
};

export type NexoraCertificationComparison = {
  readonly sameObject: boolean;
  readonly sameProfile: boolean;
  readonly sameScore: boolean;
  readonly scoreDelta: number;
  readonly versionDelta: number;
  readonly warningCountDelta: number;
  readonly errorCountDelta: number;
  readonly differences: readonly string[];
};

type ObjectRegistryEntry = {
  current: NexoraCertificationRecord | null;
  history: NexoraCertificationRecord[];
  events: NexoraCertificationEvent[];
  certificationVersion: number;
};

const registry = new Map<string, ObjectRegistryEntry>();
let defaultCertSeq = 0;
let defaultEventSeq = 0;
let defaultReportSeq = 0;

export function resetNexoraCertificationStoreForTests(): void {
  registry.clear();
  defaultCertSeq = 0;
  defaultEventSeq = 0;
  defaultReportSeq = 0;
}

// ─── Default policies ───────────────────────────────────────────────────────

const ACCEPTED_SCHEMAS = Object.freeze([
  NOL_SCHEMA_VERSION,
  NOL_RUNTIME_SCHEMA_VERSION,
  NOL_STE_STATE_SCHEMA_VERSION,
  NOL_RELATIONSHIP_SCHEMA_VERSION,
  NOL_VALIDATION_SCHEMA_VERSION,
  NOL_CERTIFICATION_SCHEMA_VERSION,
]);

/** Day durations for expiration (null = never expires). */
const DAY_MS = 24 * 60 * 60 * 1000;

export const NEXORA_CERTIFICATION_POLICIES: Readonly<
  Record<NexoraCertificationProfile, NexoraCertificationPolicy>
> = Object.freeze({
  Development: Object.freeze({
    policyId: "cert-policy-development",
    profile: "Development",
    minimumIntegrityScore: 70,
    maximumWarningCount: Number.POSITIVE_INFINITY,
    requireZeroErrors: true,
    requireZeroBlockingWarnings: false,
    requireNoRepairSuggestions: false,
    requiredValidationLevel: "Standard",
    expirationDurationMs: 90 * DAY_MS,
    acceptedSchemaVersions: ACCEPTED_SCHEMAS,
  }),
  Testing: Object.freeze({
    policyId: "cert-policy-testing",
    profile: "Testing",
    minimumIntegrityScore: 85,
    maximumWarningCount: 5,
    requireZeroErrors: true,
    requireZeroBlockingWarnings: false,
    requireNoRepairSuggestions: false,
    requiredValidationLevel: "Strict",
    expirationDurationMs: 60 * DAY_MS,
    acceptedSchemaVersions: ACCEPTED_SCHEMAS,
  }),
  Production: Object.freeze({
    policyId: "cert-policy-production",
    profile: "Production",
    minimumIntegrityScore: 90,
    maximumWarningCount: 2,
    requireZeroErrors: true,
    requireZeroBlockingWarnings: false,
    requireNoRepairSuggestions: false,
    requiredValidationLevel: "Strict",
    expirationDurationMs: 180 * DAY_MS,
    acceptedSchemaVersions: ACCEPTED_SCHEMAS,
  }),
  Platform: Object.freeze({
    policyId: "cert-policy-platform",
    profile: "Platform",
    minimumIntegrityScore: 95,
    maximumWarningCount: 0,
    requireZeroErrors: true,
    requireZeroBlockingWarnings: true,
    requireNoRepairSuggestions: false,
    requiredValidationLevel: "Certification",
    expirationDurationMs: 365 * DAY_MS,
    acceptedSchemaVersions: ACCEPTED_SCHEMAS,
  }),
  Release: Object.freeze({
    policyId: "cert-policy-release",
    profile: "Release",
    minimumIntegrityScore: 98,
    maximumWarningCount: 0,
    requireZeroErrors: true,
    requireZeroBlockingWarnings: true,
    requireNoRepairSuggestions: true,
    requiredValidationLevel: "Certification",
    expirationDurationMs: 365 * DAY_MS,
    acceptedSchemaVersions: ACCEPTED_SCHEMAS,
  }),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function err(
  code: NexoraCertificationErrorCode,
  message: string,
  objectId?: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraCertificationIssue {
  return Object.freeze({ code, message, objectId, details });
}

function freezeStamp(stamp: NexoraCertificationStamp): NexoraCertificationStamp {
  return Object.freeze({ ...stamp });
}

function freezeRecord(
  record: NexoraCertificationRecord,
): NexoraCertificationRecord {
  return Object.freeze({
    ...record,
    stamp: freezeStamp(record.stamp),
  });
}

function freezeEvent(
  event: NexoraCertificationEvent,
): NexoraCertificationEvent {
  return Object.freeze({
    ...event,
    payload: Object.freeze({ ...event.payload }),
  });
}

function asObject(
  value: unknown,
): ReadonlyNexoraObject | MutableNexoraObject | null {
  return isNexoraObject(value) ? value : null;
}

function getOrCreateEntry(objectId: string): ObjectRegistryEntry {
  let entry = registry.get(objectId);
  if (!entry) {
    entry = {
      current: null,
      history: [],
      events: [],
      certificationVersion: 0,
    };
    registry.set(objectId, entry);
  }
  return entry;
}

function resolveNow(request: NexoraCertificationRequest): string {
  return request.options?.now?.() ?? new Date().toISOString();
}

function resolveCertId(request: NexoraCertificationRequest): string {
  if (request.options?.createCertificationId) {
    return request.options.createCertificationId();
  }
  defaultCertSeq += 1;
  return `ncert-${defaultCertSeq}`;
}

function resolveEventId(request: NexoraCertificationRequest): string {
  if (request.options?.createEventId) {
    return request.options.createEventId();
  }
  defaultEventSeq += 1;
  return `ncert-evt-${defaultEventSeq}`;
}

function resolveReportId(request: NexoraCertificationRequest): string {
  if (request.options?.createReportId) {
    return request.options.createReportId();
  }
  defaultReportSeq += 1;
  return `ncert-report-${defaultReportSeq}`;
}

function isExpired(
  record: NexoraCertificationRecord,
  nowIso: string,
): boolean {
  if (!record.expiresAt) return false;
  return Date.parse(nowIso) > Date.parse(record.expiresAt);
}

function effectiveState(
  entry: ObjectRegistryEntry,
  nowIso: string,
): NexoraCertificationState {
  if (!entry.current) return "NotCertified";
  if (entry.current.state === "Revoked") return "Revoked";
  if (entry.current.state === "Certified" && isExpired(entry.current, nowIso)) {
    return "Expired";
  }
  return entry.current.state;
}

function appendEvent(
  entry: ObjectRegistryEntry,
  event: NexoraCertificationEvent,
): void {
  entry.events.push(freezeEvent(event));
}

function buildStamp(input: {
  readonly certificationId: string;
  readonly profile: NexoraCertificationProfile;
  readonly integrityScore: number;
  readonly object: ReadonlyNexoraObject | MutableNexoraObject;
  readonly issuedAt: string;
  readonly expiresAt: string | null;
  readonly certifiedBy: string;
}): NexoraCertificationStamp {
  return freezeStamp({
    certificationId: input.certificationId,
    certificationProfile: input.profile,
    integrityScore: input.integrityScore,
    objectId: input.object.identity.id,
    objectType: input.object.identity.type,
    objectVersion: input.object.identity.version,
    schemaVersion: input.object.schemaVersion,
    foundationVersion: input.object.foundationVersion,
    contractVersion: input.object.contractVersion,
    runtimeVersion: NOL_RUNTIME_SCHEMA_VERSION,
    stateVersion: NOL_STE_STATE_SCHEMA_VERSION,
    relationshipVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
    validationVersion: NOL_VALIDATION_SCHEMA_VERSION,
    certificationSchemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    certifiedBy: input.certifiedBy,
  });
}

function failedResult(
  profile: NexoraCertificationProfile,
  state: NexoraCertificationState,
  errors: readonly NexoraCertificationIssue[],
  warnings: readonly NexoraCertificationIssue[],
  events: readonly NexoraCertificationEvent[],
  extras?: Partial<NexoraCertificationResult>,
): NexoraCertificationResult {
  return Object.freeze({
    certified: false,
    certificationState: state,
    certificationProfile: profile,
    certificationId: extras?.certificationId ?? null,
    certificationVersion: extras?.certificationVersion ?? 0,
    integrityScore: extras?.integrityScore ?? 0,
    validationReport: extras?.validationReport ?? null,
    stamp: extras?.stamp ?? null,
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze([...errors]),
    issuedAt: extras?.issuedAt ?? null,
    expiresAt: extras?.expiresAt ?? null,
    certifiedBy: extras?.certifiedBy ?? null,
    events: Object.freeze([...events]),
    objectId: extras?.objectId,
  });
}

function evaluatePolicy(
  policy: NexoraCertificationPolicy,
  validation: NexoraObjectValidationResult,
  objectId: string,
): readonly NexoraCertificationIssue[] {
  const errors: NexoraCertificationIssue[] = [];

  if (policy.requireZeroErrors && validation.errors.length > 0) {
    errors.push(
      err(
        "CERTIFICATION_VALIDATION_FAILED",
        `Validation reported ${validation.errors.length} error(s).`,
        objectId,
        { delegatedTo: NOL_VALIDATION_IDENTITY },
      ),
    );
  }

  if (validation.score < policy.minimumIntegrityScore) {
    errors.push(
      err(
        "CERTIFICATION_SCORE_TOO_LOW",
        `Integrity score ${validation.score} is below required ${policy.minimumIntegrityScore} for ${policy.profile}.`,
        objectId,
        {
          score: validation.score,
          minimumIntegrityScore: policy.minimumIntegrityScore,
        },
      ),
    );
  }

  if (validation.warnings.length > policy.maximumWarningCount) {
    errors.push(
      err(
        "CERTIFICATION_POLICY_REJECTED",
        `Warning count ${validation.warnings.length} exceeds maximum ${policy.maximumWarningCount} for ${policy.profile}.`,
        objectId,
        {
          warningCount: validation.warnings.length,
          maximumWarningCount: policy.maximumWarningCount,
        },
      ),
    );
  }

  if (
    policy.requireZeroBlockingWarnings &&
    validation.warnings.length > 0
  ) {
    errors.push(
      err(
        "CERTIFICATION_BLOCKING_WARNINGS",
        `${policy.profile} profile rejects blocking warnings.`,
        objectId,
        { warningCount: validation.warnings.length },
      ),
    );
  }

  if (
    policy.requireNoRepairSuggestions &&
    validation.repairSuggestions.length > 0
  ) {
    errors.push(
      err(
        "CERTIFICATION_UNRESOLVED_REPAIRS",
        `${policy.profile} profile requires zero unresolved repair suggestions.`,
        objectId,
        { repairCount: validation.repairSuggestions.length },
      ),
    );
  }

  if (!validation.valid) {
    errors.push(
      err(
        "CERTIFICATION_VALIDATION_FAILED",
        "Upstream validation did not pass.",
        objectId,
        { delegatedTo: NOL_VALIDATION_IDENTITY, score: validation.score },
      ),
    );
  }

  // Deduplicate by code+message
  const seen = new Set<string>();
  const unique: NexoraCertificationIssue[] = [];
  for (const issue of errors) {
    const key = `${issue.code}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(issue);
  }
  return Object.freeze(unique);
}

// ─── Public query APIs ──────────────────────────────────────────────────────

export function getNexoraCertificationPolicy(
  profile: NexoraCertificationProfile,
): NexoraCertificationPolicy {
  return NEXORA_CERTIFICATION_POLICIES[profile];
}

export function getNexoraCertificationState(
  objectId: string,
  now: () => string = () => new Date().toISOString(),
): NexoraCertificationState {
  const entry = registry.get(objectId);
  if (!entry) return "NotCertified";
  const state = effectiveState(entry, now());
  // Materialize expiration into current record state for projections.
  if (
    state === "Expired" &&
    entry.current &&
    entry.current.state === "Certified"
  ) {
    const expired = freezeRecord({
      ...entry.current,
      state: "Expired",
    });
    entry.current = expired;
    appendEvent(
      entry,
      freezeEvent({
        eventId: `ncert-evt-auto-${++defaultEventSeq}`,
        type: "CertificationExpired",
        objectId,
        certificationId: expired.certificationId,
        profile: expired.profile,
        occurredAt: now(),
        payload: Object.freeze({ expiresAt: expired.expiresAt }),
      }),
    );
  }
  return state;
}

export function getNexoraCertificationHistory(
  objectId: string,
): readonly NexoraCertificationRecord[] {
  const entry = registry.get(objectId);
  if (!entry) return Object.freeze([]);
  return Object.freeze([...entry.history, ...(entry.current ? [entry.current] : [])]);
}

export function listNexoraCertificationEvents(
  objectId: string,
): readonly NexoraCertificationEvent[] {
  const entry = registry.get(objectId);
  if (!entry) return Object.freeze([]);
  return Object.freeze([...entry.events]);
}

// ─── Certify ────────────────────────────────────────────────────────────────

export function certifyNexoraObject(
  request: NexoraCertificationRequest,
): NexoraCertificationResult {
  const now = resolveNow(request);
  const profile = request.profile;
  const policy = NEXORA_CERTIFICATION_POLICIES[profile];
  const events: NexoraCertificationEvent[] = [];

  if (!request.requestedBy?.trim()) {
    return failedResult(
      profile,
      "NotCertified",
      [
        err(
          "CERTIFICATION_INVALID_REQUEST",
          "requestedBy is required for certification.",
        ),
      ],
      [],
      events,
    );
  }

  const object = asObject(request.object);
  if (!object) {
    return failedResult(
      profile,
      "NotCertified",
      [
        err(
          "CERTIFICATION_IDENTITY_REQUIRED",
          "Certification requires a NexoraObject contract handle.",
        ),
      ],
      [],
      events,
    );
  }

  const objectId = object.identity.id;
  const identityBefore = Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    createdAt: object.identity.createdAt,
    version: object.identity.version,
  });

  const entry = getOrCreateEntry(objectId);
  const started = freezeEvent({
    eventId: resolveEventId(request),
    type: "CertificationStarted",
    objectId,
    profile,
    occurredAt: now,
    payload: Object.freeze({
      requestedBy: request.requestedBy,
      reason: request.reason ?? null,
      validationLevel:
        request.validationLevel ?? policy.requiredValidationLevel,
    }),
  });
  events.push(started);
  appendEvent(entry, started);

  // Mark pending during evaluation (not persisted as current certified record).
  const pendingState: NexoraCertificationState = "Pending";

  const validationLevel =
    request.validationLevel ?? policy.requiredValidationLevel;

  // Delegate to NOL-1:6 — never reimplement validation rules.
  const validation = validateNexoraObject({
    object,
    level: validationLevel,
    options: request.options?.validationOptions,
  });

  const validationReport = createValidationReport(
    validation,
    resolveReportId(request),
  );

  const policyErrors = evaluatePolicy(policy, validation, objectId);
  if (policyErrors.length > 0) {
    const failed = freezeEvent({
      eventId: resolveEventId(request),
      type: "CertificationFailed",
      objectId,
      profile,
      occurredAt: resolveNow(request),
      payload: Object.freeze({
        errorCodes: policyErrors.map((e) => e.code),
        integrityScore: validation.score,
        delegatedTo: NOL_VALIDATION_IDENTITY,
      }),
    });
    events.push(failed);
    appendEvent(entry, failed);

    // Identity must remain unchanged.
    if (
      object.identity.id !== identityBefore.id ||
      object.identity.type !== identityBefore.type ||
      object.identity.createdAt !== identityBefore.createdAt ||
      object.identity.version !== identityBefore.version
    ) {
      throw new Error("Certification mutated object identity.");
    }

    return failedResult(
      profile,
      getNexoraCertificationState(objectId, () => resolveNow(request)) ===
        "NotCertified"
        ? "NotCertified"
        : pendingState === "Pending"
          ? getNexoraCertificationState(objectId, () => resolveNow(request))
          : "NotCertified",
      policyErrors,
      Object.freeze(
        validation.warnings.map((w) =>
          err(
            "CERTIFICATION_POLICY_REJECTED",
            w.message,
            objectId,
            { validationCode: w.code },
          ),
        ),
      ),
      events,
      {
        integrityScore: validation.score,
        validationReport,
        objectId,
        certificationVersion: entry.certificationVersion,
      },
    );
  }

  const issuedAt = resolveNow(request);
  const expirationMs =
    request.options?.expirationDurationMs !== undefined
      ? request.options.expirationDurationMs
      : policy.expirationDurationMs;
  const expiresAt =
    expirationMs == null
      ? null
      : new Date(Date.parse(issuedAt) + expirationMs).toISOString();

  const certificationId = resolveCertId(request);
  entry.certificationVersion += 1;
  const stamp = buildStamp({
    certificationId,
    profile,
    integrityScore: validation.score,
    object,
    issuedAt,
    expiresAt,
    certifiedBy: request.requestedBy,
  });

  const record = freezeRecord({
    certificationId,
    objectId,
    profile,
    state: "Certified",
    integrityScore: validation.score,
    certificationVersion: entry.certificationVersion,
    issuedAt,
    expiresAt,
    certifiedBy: request.requestedBy,
    reason: request.reason,
    stamp,
    validationReportId: validationReport.reportId,
    warningCount: validation.warnings.length,
    errorCount: validation.errors.length,
  });

  // Append previous current into history (append-only).
  if (entry.current) {
    entry.history.push(entry.current);
  }
  entry.current = record;

  const passed = freezeEvent({
    eventId: resolveEventId(request),
    type: "CertificationPassed",
    objectId,
    certificationId,
    profile,
    occurredAt: issuedAt,
    payload: Object.freeze({
      integrityScore: validation.score,
      certificationVersion: record.certificationVersion,
      expiresAt,
    }),
  });
  events.push(passed);
  appendEvent(entry, passed);

  // Identity must remain unchanged.
  if (
    object.identity.id !== identityBefore.id ||
    object.identity.type !== identityBefore.type ||
    object.identity.createdAt !== identityBefore.createdAt ||
    object.identity.version !== identityBefore.version
  ) {
    throw new Error("Certification mutated object identity.");
  }

  return Object.freeze({
    certified: true,
    certificationState: "Certified",
    certificationProfile: profile,
    certificationId,
    certificationVersion: record.certificationVersion,
    integrityScore: validation.score,
    validationReport,
    stamp,
    warnings: Object.freeze([]),
    errors: Object.freeze([]),
    issuedAt,
    expiresAt,
    certifiedBy: request.requestedBy,
    events: Object.freeze(events),
    objectId,
  });
}

// ─── Recertify / revoke ─────────────────────────────────────────────────────

export function recertifyNexoraObject(
  request: NexoraCertificationRequest,
): NexoraCertificationResult {
  const object = asObject(request.object);
  if (!object) {
    return failedResult(
      request.profile,
      "NotCertified",
      [
        err(
          "CERTIFICATION_IDENTITY_REQUIRED",
          "Recertification requires a NexoraObject contract handle.",
        ),
      ],
      [],
      [],
    );
  }

  const objectId = object.identity.id;
  const entry = getOrCreateEntry(objectId);
  const previousId = entry.current?.certificationId ?? null;

  const result = certifyNexoraObject(request);
  if (result.certified && result.certificationId) {
    const completed = freezeEvent({
      eventId: resolveEventId(request),
      type: "RecertificationCompleted",
      objectId,
      certificationId: result.certificationId,
      profile: request.profile,
      occurredAt: resolveNow(request),
      payload: Object.freeze({
        previousCertificationId: previousId,
        newCertificationId: result.certificationId,
      }),
    });
    appendEvent(entry, completed);
    return Object.freeze({
      ...result,
      events: Object.freeze([...result.events, completed]),
    });
  }
  return result;
}

export function revokeNexoraObjectCertification(
  objectId: string,
  reason: string,
  revokedBy: string,
  options?: {
    readonly now?: () => string;
    readonly createEventId?: () => string;
  },
): NexoraCertificationResult {
  const now = options?.now?.() ?? new Date().toISOString();
  const entry = registry.get(objectId);
  if (!entry?.current) {
    return failedResult(
      "Development",
      "NotCertified",
      [
        err(
          "CERTIFICATION_NOT_FOUND",
          `No certification found for object ${objectId}.`,
          objectId,
        ),
      ],
      [],
      [],
      { objectId },
    );
  }

  if (!reason?.trim()) {
    return failedResult(
      entry.current.profile,
      entry.current.state,
      [
        err(
          "CERTIFICATION_INVALID_REQUEST",
          "Revocation requires a reason.",
          objectId,
        ),
      ],
      [],
      [],
      {
        objectId,
        certificationId: entry.current.certificationId,
        certificationVersion: entry.current.certificationVersion,
        stamp: entry.current.stamp,
      },
    );
  }

  // Preserve history: push current snapshot, then set revoked current.
  entry.history.push(entry.current);
  const revoked = freezeRecord({
    ...entry.current,
    state: "Revoked",
    revokedAt: now,
    revocationReason: reason,
  });
  entry.current = revoked;

  const eventId =
    options?.createEventId?.() ?? `ncert-evt-${++defaultEventSeq}`;
  const event = freezeEvent({
    eventId,
    type: "CertificationRevoked",
    objectId,
    certificationId: revoked.certificationId,
    profile: revoked.profile,
    occurredAt: now,
    payload: Object.freeze({ reason, revokedBy }),
  });
  appendEvent(entry, event);

  return Object.freeze({
    certified: false,
    certificationState: "Revoked",
    certificationProfile: revoked.profile,
    certificationId: revoked.certificationId,
    certificationVersion: revoked.certificationVersion,
    integrityScore: revoked.integrityScore,
    validationReport: null,
    stamp: revoked.stamp,
    warnings: Object.freeze([]),
    errors: Object.freeze([
      err(
        "CERTIFICATION_REVOKED",
        `Certification revoked: ${reason}`,
        objectId,
        { revokedBy },
      ),
    ]),
    issuedAt: revoked.issuedAt,
    expiresAt: revoked.expiresAt,
    certifiedBy: revoked.certifiedBy,
    events: Object.freeze([event]),
    objectId,
  });
}

// ─── Compare / project / report ─────────────────────────────────────────────

export function compareCertification(
  left: NexoraCertificationRecord | NexoraCertificationStamp,
  right: NexoraCertificationRecord | NexoraCertificationStamp,
): NexoraCertificationComparison {
  const leftScore = left.integrityScore;
  const rightScore = right.integrityScore;
  const leftProfile =
    "profile" in left
      ? left.profile
      : (left as NexoraCertificationStamp).certificationProfile;
  const rightProfile =
    "profile" in right
      ? right.profile
      : (right as NexoraCertificationStamp).certificationProfile;
  const leftObjectId =
    "objectId" in left ? left.objectId : (left as NexoraCertificationStamp).objectId;
  const rightObjectId =
    "objectId" in right
      ? right.objectId
      : (right as NexoraCertificationStamp).objectId;
  const leftVersion =
    "certificationVersion" in left ? left.certificationVersion : 0;
  const rightVersion =
    "certificationVersion" in right ? right.certificationVersion : 0;
  const leftWarnings = "warningCount" in left ? left.warningCount : 0;
  const rightWarnings = "warningCount" in right ? right.warningCount : 0;
  const leftErrors = "errorCount" in left ? left.errorCount : 0;
  const rightErrors = "errorCount" in right ? right.errorCount : 0;

  const differences: string[] = [];
  if (leftObjectId !== rightObjectId) differences.push("objectId");
  if (leftProfile !== rightProfile) differences.push("profile");
  if (leftScore !== rightScore) differences.push("integrityScore");
  if (leftVersion !== rightVersion) differences.push("certificationVersion");
  if (leftWarnings !== rightWarnings) differences.push("warningCount");
  if (leftErrors !== rightErrors) differences.push("errorCount");

  const leftId =
    "certificationId" in left
      ? left.certificationId
      : (left as NexoraCertificationStamp).certificationId;
  const rightId =
    "certificationId" in right
      ? right.certificationId
      : (right as NexoraCertificationStamp).certificationId;
  if (leftId !== rightId) differences.push("certificationId");

  return Object.freeze({
    sameObject: leftObjectId === rightObjectId,
    sameProfile: leftProfile === rightProfile,
    sameScore: leftScore === rightScore,
    scoreDelta: rightScore - leftScore,
    versionDelta: rightVersion - leftVersion,
    warningCountDelta: rightWarnings - leftWarnings,
    errorCountDelta: rightErrors - leftErrors,
    differences: Object.freeze(differences),
  });
}

export function projectCertification(
  objectId: string,
  now: () => string = () => new Date().toISOString(),
): NexoraCertificationProjection {
  const state = getNexoraCertificationState(objectId, now);
  const entry = registry.get(objectId);
  const current = entry?.current ?? null;

  // Projection must never expose policy objects.
  return Object.freeze({
    objectId,
    certificationState: state,
    certificationProfile: current?.profile ?? null,
    certificationId: current?.certificationId ?? null,
    integrityScore: current?.integrityScore ?? null,
    stamp: current?.stamp ?? null,
    issuedAt: current?.issuedAt ?? null,
    expiresAt: current?.expiresAt ?? null,
    certificationVersion: entry?.certificationVersion ?? 0,
    historyCount: entry
      ? entry.history.length + (entry.current ? 1 : 0)
      : 0,
    engineIdentity: NOL_CERTIFICATION_IDENTITY,
  });
}

export function createCertificationReport(
  result: NexoraCertificationResult,
  reportId?: string,
): NexoraCertificationReport {
  defaultReportSeq += 1;
  const id = reportId?.trim() || `ncert-report-${defaultReportSeq}`;
  return Object.freeze({
    reportId: id,
    summary: result.certified
      ? `Certified under ${result.certificationProfile} with score ${result.integrityScore}.`
      : `Certification failed under ${result.certificationProfile} (${result.errors.length} error(s)).`,
    result,
    createdAt: new Date().toISOString(),
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeCertification(objectId: string): string {
  const entry = registry.get(objectId);
  if (!entry) {
    return JSON.stringify({
      engineIdentity: NOL_CERTIFICATION_IDENTITY,
      certificationSchemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
      engineVersion: NOL_CERTIFICATION_ENGINE_VERSION,
      objectId,
      certificationVersion: 0,
      current: null,
      history: [],
      events: [],
    });
  }

  return JSON.stringify({
    engineIdentity: NOL_CERTIFICATION_IDENTITY,
    certificationSchemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
    engineVersion: NOL_CERTIFICATION_ENGINE_VERSION,
    objectId,
    certificationVersion: entry.certificationVersion,
    current: entry.current,
    history: entry.history,
    events: entry.events,
  });
}

export function deserializeCertification(json: string): NexoraCertificationProjection {
  const parsed = JSON.parse(json) as {
    readonly engineIdentity?: string;
    readonly certificationSchemaVersion?: string;
    readonly objectId: string;
    readonly certificationVersion: number;
    readonly current: NexoraCertificationRecord | null;
    readonly history: readonly NexoraCertificationRecord[];
    readonly events?: readonly NexoraCertificationEvent[];
  };

  if (
    parsed.certificationSchemaVersion !== NOL_CERTIFICATION_SCHEMA_VERSION
  ) {
    throw Object.assign(
      new Error(
        `Unsupported certification schema version: ${String(
          parsed.certificationSchemaVersion,
        )}`,
      ),
      { code: "CERTIFICATION_UNSUPPORTED_VERSION" as const },
    );
  }

  if (
    parsed.engineIdentity &&
    parsed.engineIdentity !== NOL_CERTIFICATION_IDENTITY
  ) {
    throw Object.assign(
      new Error(
        `Unsupported certification engine identity: ${parsed.engineIdentity}`,
      ),
      { code: "CERTIFICATION_UNSUPPORTED_VERSION" as const },
    );
  }

  const entry: ObjectRegistryEntry = {
    current: parsed.current ? freezeRecord(parsed.current) : null,
    history: (parsed.history ?? []).map((r) => freezeRecord(r)),
    events: (parsed.events ?? []).map((e) => freezeEvent(e)),
    certificationVersion: parsed.certificationVersion ?? 0,
  };
  registry.set(parsed.objectId, entry);
  return projectCertification(parsed.objectId);
}

export function exportNexoraObjectCertification(objectId: string): {
  readonly json: string;
  readonly projection: NexoraCertificationProjection;
} {
  return Object.freeze({
    json: serializeCertification(objectId),
    projection: projectCertification(objectId),
  });
}

export function importNexoraObjectCertification(
  json: string,
): NexoraCertificationProjection {
  return deserializeCertification(json);
}

export function getNexoraObjectCertificationSummary() {
  return Object.freeze({
    identity: NOL_CERTIFICATION_IDENTITY,
    engineVersion: NOL_CERTIFICATION_ENGINE_VERSION,
    schemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
    upstream: NOL_CERTIFICATION_UPSTREAM,
    profiles: Object.freeze([
      "Development",
      "Testing",
      "Production",
      "Platform",
      "Release",
    ] as const),
    validationUpstream: NOL_VALIDATION_IDENTITY,
    foundationVersion: NOL_FOUNDATION_VERSION,
    contractVersion: NOL_CONTRACT_VERSION,
    separateFromValidation: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectCertification = Object.freeze({
  identity: NOL_CERTIFICATION_IDENTITY,
  engineVersion: NOL_CERTIFICATION_ENGINE_VERSION,
  schemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
  tags: NOL_CERTIFICATION_TAGS,
  policies: NEXORA_CERTIFICATION_POLICIES,
  certify: certifyNexoraObject,
  recertify: recertifyNexoraObject,
  revoke: revokeNexoraObjectCertification,
  compare: compareCertification,
  project: projectCertification,
  serialize: serializeCertification,
  deserialize: deserializeCertification,
  createReport: createCertificationReport,
  summary: getNexoraObjectCertificationSummary,
});
