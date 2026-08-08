/**
 * DRI-1:5 — Director Runtime Integration Validation
 *
 * Pure structural and architectural validation for supplied DRI descriptions.
 * Valid DRI structure does not imply valid business meaning.
 */

import {
  createDirectorRuntimeBinding,
  detectDirectorRuntimeBindingConflict,
  directorRuntimeBindingRegistryCount,
  directorRuntimeBindingTransitionRuleCount,
  directorRuntimeIntegrationBindingIdentity,
  directorRuntimeIntegrationBindingMetadata,
  isDirectorRuntimeBindingLifecycleState,
  transitionDirectorRuntimeBinding,
  verifyDirectorRuntimeIntegrationBinding,
  type DirectorRuntimeBinding,
  type DirectorRuntimeBindingLifecycleState,
} from "./directorRuntimeIntegrationBinding.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationValidationIdentity =
  "DRI-1:5/DirectorRuntimeIntegrationValidation" as const;
export const directorRuntimeIntegrationValidationVersion = "1.5.0" as const;
export const directorRuntimeIntegrationValidationNamespace =
  "nexora.dri.runtime.integration.validation" as const;
export const directorRuntimeIntegrationValidationUpstream =
  directorRuntimeIntegrationBindingIdentity;

export const directorRuntimeIntegrationValidationMetadata = Object.freeze({
  identity: directorRuntimeIntegrationValidationIdentity,
  version: directorRuntimeIntegrationValidationVersion,
  namespace: directorRuntimeIntegrationValidationNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Validation" as const,
  status: "ValidationReady" as const,
  upstream: directorRuntimeIntegrationValidationUpstream,
  direction: directorRuntimeIntegrationBindingMetadata.direction,
  authority: directorRuntimeIntegrationBindingMetadata.authority,
});

// ─── Validation vocabulary ─────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_VALIDATION_LEVELS = Object.freeze([
  "foundation", "contract", "mapping", "binding", "architecture", "integration",
] as const);
export type DirectorRuntimeValidationLevel =
  (typeof DIRECTOR_RUNTIME_VALIDATION_LEVELS)[number];

export const DIRECTOR_RUNTIME_VALIDATION_SEVERITIES = Object.freeze([
  "info", "warning", "error", "fatal",
] as const);
export type DirectorRuntimeValidationSeverity =
  (typeof DIRECTOR_RUNTIME_VALIDATION_SEVERITIES)[number];

export const DIRECTOR_RUNTIME_VALIDATION_STATUSES = Object.freeze([
  "valid", "valid-with-warnings", "invalid", "fatal",
] as const);
export type DirectorRuntimeValidationStatus =
  (typeof DIRECTOR_RUNTIME_VALIDATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_VALIDATION_PROFILES = Object.freeze([
  "structural", "strict", "release",
] as const);
export type DirectorRuntimeValidationProfile =
  (typeof DIRECTOR_RUNTIME_VALIDATION_PROFILES)[number];

export const DIRECTOR_RUNTIME_VALIDATION_ISSUE_CODES = Object.freeze([
  "DRI_VALID",
  "DRI_IDENTITY_INVALID",
  "DRI_SOURCE_INVALID",
  "DRI_TARGET_INVALID",
  "DRI_PAYLOAD_INVALID",
  "DRI_MAPPING_INVALID",
  "DRI_MAPPING_UNRESOLVED",
  "DRI_MAPPING_AMBIGUOUS",
  "DRI_MAPPING_UNSUPPORTED",
  "DRI_BINDING_INVALID",
  "DRI_BINDING_CONFLICT",
  "DRI_BINDING_TRANSITION_INVALID",
  "DRI_BINDING_REVISION_CONFLICT",
  "DRI_DIRECTION_INVALID",
  "DRI_AUTHORITY_VIOLATION",
  "DRI_ORDER_VIOLATION",
  "DRI_IMMUTABILITY_VIOLATION",
  "DRI_ARCHITECTURE_VIOLATION",
] as const);
export type DirectorRuntimeValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_VALIDATION_ISSUE_CODES)[number];

export function isDirectorRuntimeValidationLevel(
  value: unknown,
): value is DirectorRuntimeValidationLevel {
  return (DIRECTOR_RUNTIME_VALIDATION_LEVELS as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeValidationSeverity(
  value: unknown,
): value is DirectorRuntimeValidationSeverity {
  return (DIRECTOR_RUNTIME_VALIDATION_SEVERITIES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeValidationStatus(
  value: unknown,
): value is DirectorRuntimeValidationStatus {
  return (DIRECTOR_RUNTIME_VALIDATION_STATUSES as readonly unknown[]).includes(value);
}
export function isDirectorRuntimeValidationProfile(
  value: unknown,
): value is DirectorRuntimeValidationProfile {
  return (DIRECTOR_RUNTIME_VALIDATION_PROFILES as readonly unknown[]).includes(value);
}

// ─── Public validation contracts ───────────────────────────────────────────

export interface DirectorRuntimeValidationIssue {
  readonly code: DirectorRuntimeValidationIssueCode;
  readonly severity: DirectorRuntimeValidationSeverity;
  readonly level: DirectorRuntimeValidationLevel;
  readonly message: string;
  readonly subjectId?: string;
}

export interface DirectorRuntimeValidationReport {
  readonly validationId: string;
  readonly status: DirectorRuntimeValidationStatus;
  readonly accepted: boolean;
  readonly issues: readonly DirectorRuntimeValidationIssue[];
  readonly checkedLevels: readonly DirectorRuntimeValidationLevel[];
  readonly infoCount: number;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly fatalCount: number;
}

export interface DirectorRuntimeValidationRequest {
  readonly validationId: string;
  readonly profile: DirectorRuntimeValidationProfile;
  readonly levels: readonly DirectorRuntimeValidationLevel[];
  readonly bindings: readonly DirectorRuntimeBinding[];
  readonly payloads?: readonly unknown[];
  readonly mappingRules?: readonly unknown[];
  readonly mappingRequests?: readonly unknown[];
  readonly mappingResolutions?: readonly unknown[];
  readonly transitions?: readonly {
    readonly binding: DirectorRuntimeBinding;
    readonly nextState: DirectorRuntimeBindingLifecycleState;
  }[];
  readonly expectedBindingOrder?: readonly string[];
}

export interface DirectorRuntimeValidationContext {
  readonly expectedDirection: "runtime-to-director";
  readonly expectedRuntimeRevision?: string | number;
  readonly allowWarnings: boolean;
  readonly runtimeAuthoritative: boolean;
  readonly forbiddenDependencies?: readonly string[];
}

export interface DirectorRuntimeValidationAcceptance {
  readonly accepted: boolean;
  readonly status: DirectorRuntimeValidationStatus;
}

type PlainObject = Record<string, unknown>;

function plain(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function issue(
  code: DirectorRuntimeValidationIssueCode,
  severity: DirectorRuntimeValidationSeverity,
  level: DirectorRuntimeValidationLevel,
  message: string,
  subjectId?: string,
): DirectorRuntimeValidationIssue {
  return Object.freeze({
    code, severity, level, message,
    ...(subjectId !== undefined ? { subjectId } : {}),
  });
}

function frozenIssues(
  issues: readonly DirectorRuntimeValidationIssue[],
): readonly DirectorRuntimeValidationIssue[] {
  return Object.freeze([...issues]);
}

// ─── Status and acceptance ─────────────────────────────────────────────────

export function resolveDirectorRuntimeValidationStatus(
  issues: readonly DirectorRuntimeValidationIssue[],
): DirectorRuntimeValidationStatus {
  if (issues.some(({ severity }) => severity === "fatal")) return "fatal";
  if (issues.some(({ severity }) => severity === "error")) return "invalid";
  if (issues.some(({ severity }) => severity === "warning")) {
    return "valid-with-warnings";
  }
  return "valid";
}

export function resolveDirectorRuntimeValidationAcceptance(
  status: DirectorRuntimeValidationStatus,
  allowWarnings: boolean,
): DirectorRuntimeValidationAcceptance {
  if (!isDirectorRuntimeValidationStatus(status)) {
    throw new TypeError("status must be a known validation status");
  }
  return Object.freeze({
    accepted: status === "valid" ||
      (status === "valid-with-warnings" && allowWarnings),
    status,
  });
}

// ─── Structural validators ─────────────────────────────────────────────────

export function validateDirectorRuntimeSource(
  source: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(source)) {
    return frozenIssues([issue("DRI_SOURCE_INVALID", "error", "contract", "Runtime source must be plain data")]);
  }
  try {
    createDirectorRuntimeBinding({
      bindingId: "validation-source",
      mapping: {
        mappingId: "validation-source-mapping",
        source: source as unknown as DirectorRuntimeBinding["source"],
        target: { targetKind: "scene", targetId: "validation-target" },
      },
      intentKind: "represent",
    });
    return Object.freeze([]);
  } catch {
    return frozenIssues([issue("DRI_SOURCE_INVALID", "error", "contract", "Runtime source contract is invalid", typeof source.sourceId === "string" ? source.sourceId : undefined)]);
  }
}

export function validateDirectorRuntimeTarget(
  target: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(target)) {
    return frozenIssues([issue("DRI_TARGET_INVALID", "error", "contract", "Director target must be plain identity data")]);
  }
  try {
    createDirectorRuntimeBinding({
      bindingId: "validation-target",
      mapping: {
        mappingId: "validation-target-mapping",
        source: { sourceKind: "runtime-context", sourceId: "validation-source", runtimeRevision: "validation-revision" },
        target: target as unknown as DirectorRuntimeBinding["target"],
      },
      intentKind: "represent",
    });
    return Object.freeze([]);
  } catch {
    return frozenIssues([issue("DRI_TARGET_INVALID", "error", "contract", "Director target contract is invalid", typeof target.targetId === "string" ? target.targetId : undefined)]);
  }
}

function validPayloadValue(value: unknown): boolean {
  if (value === null || typeof value === "boolean" || typeof value === "string") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(validPayloadValue);
  return plain(value) && Object.values(value).every(validPayloadValue);
}

export function validateDirectorRuntimeIntegrationPayload(
  payload: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  return validPayloadValue(payload)
    ? Object.freeze([])
    : frozenIssues([issue("DRI_PAYLOAD_INVALID", "error", "contract", "Payload contains an unsupported non-plain value")]);
}

export function validateDirectorRuntimeMappingRule(
  rule: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(rule)) {
    return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Mapping rule must be plain data")]);
  }
  try {
    createDirectorRuntimeBinding({
      bindingId: "validation-rule-binding",
      mapping: {
        mappingId: rule.ruleId as string,
        source: { sourceKind: rule.sourceKind as DirectorRuntimeBinding["source"]["sourceKind"], sourceId: "validation-source", runtimeRevision: "validation-revision" },
        target: { targetKind: rule.targetKind as DirectorRuntimeBinding["target"]["targetKind"], targetId: rule.targetId as string },
      },
      intentKind: rule.intentKind as DirectorRuntimeBinding["intentKind"],
    });
    if (Object.values(rule).some((value) => typeof value === "function")) throw new TypeError();
    return Object.freeze([]);
  } catch {
    return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Mapping rule contract is invalid", typeof rule.ruleId === "string" ? rule.ruleId : undefined)]);
  }
}

export function validateDirectorRuntimeMappingRequest(
  request: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(request) || typeof request.requestId !== "string" || request.requestId.length === 0) {
    return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Mapping request identity is invalid")]);
  }
  return frozenIssues([
    ...validateDirectorRuntimeSource(request.source).map((entry) => Object.freeze({ ...entry, level: "mapping" as const, code: "DRI_MAPPING_INVALID" as const })),
    ...validateDirectorRuntimeIntegrationPayload(request.payload).map((entry) => Object.freeze({ ...entry, level: "mapping" as const, code: "DRI_MAPPING_INVALID" as const })),
  ]);
}

export function validateDirectorRuntimeMappingResolution(
  resolution: unknown,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(resolution) || typeof resolution.requestId !== "string" || !Array.isArray(resolution.mappings) || !Array.isArray(resolution.matchedRuleIds)) {
    return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Mapping resolution contract is invalid")]);
  }
  const subject = resolution.requestId;
  if (resolution.status === "resolved") {
    if (resolution.mappings.length === 0) {
      return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Resolved mapping must contain at least one mapping", subject)]);
    }
    const invalid = resolution.mappings.some((mapping) => {
      if (!plain(mapping)) return true;
      return validateDirectorRuntimeSource(mapping.source).length > 0 ||
        validateDirectorRuntimeTarget(mapping.target).length > 0 ||
        typeof mapping.mappingId !== "string" || mapping.mappingId.length === 0;
    });
    return invalid
      ? frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Resolved mapping contains an invalid relationship", subject)])
      : Object.freeze([]);
  }
  if (resolution.status === "unresolved") {
    return frozenIssues([issue("DRI_MAPPING_UNRESOLVED", "warning", "mapping", "Mapping remains explicitly unresolved", subject)]);
  }
  if (resolution.status === "ambiguous") {
    return frozenIssues([issue("DRI_MAPPING_AMBIGUOUS", "error", "mapping", "Mapping ambiguity requires explicit resolution", subject)]);
  }
  if (resolution.status === "unsupported") {
    return frozenIssues([issue("DRI_MAPPING_UNSUPPORTED", "error", "mapping", "Mapping capability is unsupported", subject)]);
  }
  return frozenIssues([issue("DRI_MAPPING_INVALID", "error", "mapping", "Mapping resolution status is invalid", subject)]);
}

export function validateDirectorRuntimeBinding(
  binding: unknown,
  expectedRuntimeRevision?: string | number,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(binding)) {
    return frozenIssues([issue("DRI_BINDING_INVALID", "error", "binding", "Binding must be plain data")]);
  }
  const subject = typeof binding.bindingId === "string" ? binding.bindingId : undefined;
  if (binding.direction !== "runtime-to-director") {
    return frozenIssues([issue("DRI_DIRECTION_INVALID", "fatal", "architecture", "Binding direction must be runtime-to-director", subject)]);
  }
  try {
    createDirectorRuntimeBinding({
      bindingId: binding.bindingId as string,
      mapping: {
        mappingId: binding.mappingId as string,
        source: binding.source as DirectorRuntimeBinding["source"],
        target: binding.target as DirectorRuntimeBinding["target"],
      },
      intentKind: binding.intentKind as DirectorRuntimeBinding["intentKind"],
      lifecycle: binding.lifecycle as DirectorRuntimeBinding["lifecycle"],
      activation: binding.activation as DirectorRuntimeBinding["activation"],
      scope: binding.scope as DirectorRuntimeBinding["scope"],
      exclusivity: binding.exclusivity as DirectorRuntimeBinding["exclusivity"],
      revisionSensitive: binding.revisionSensitive === true,
      direction: "runtime-to-director",
    });
  } catch {
    return frozenIssues([issue("DRI_BINDING_INVALID", "error", "binding", "Binding structure is invalid", subject)]);
  }
  if (
    binding.activation === "enabled" &&
    ["retired", "replaced", "invalid"].includes(String(binding.lifecycle))
  ) {
    return frozenIssues([issue("DRI_BINDING_INVALID", "error", "binding", "Terminal or invalid binding cannot remain enabled", subject)]);
  }
  if (
    expectedRuntimeRevision !== undefined &&
    plain(binding.source) &&
    binding.source.runtimeRevision !== expectedRuntimeRevision
  ) {
    return frozenIssues([issue("DRI_BINDING_REVISION_CONFLICT", "error", "binding", "Runtime revision does not match the explicit expectation", subject)]);
  }
  return Object.freeze([]);
}

export function validateDirectorRuntimeBindingConflict(
  candidate: DirectorRuntimeBinding,
  existingBindings: readonly DirectorRuntimeBinding[],
): readonly DirectorRuntimeValidationIssue[] {
  const conflict = detectDirectorRuntimeBindingConflict(candidate, existingBindings);
  if (conflict === "none") return Object.freeze([]);
  return frozenIssues([issue(
    conflict === "revision-conflict"
      ? "DRI_BINDING_REVISION_CONFLICT"
      : "DRI_BINDING_CONFLICT",
    "error",
    "binding",
    `Binding conflict detected: ${conflict}`,
    candidate.bindingId,
  )]);
}

export function validateDirectorRuntimeBindingCollection(
  collection: unknown,
  expectedOrder?: readonly string[],
  expectedRuntimeRevision?: string | number,
): readonly DirectorRuntimeValidationIssue[] {
  if (!plain(collection) || typeof collection.collectionId !== "string" || !Array.isArray(collection.bindings)) {
    return frozenIssues([issue("DRI_BINDING_INVALID", "error", "binding", "Binding collection is invalid")]);
  }
  const issues: DirectorRuntimeValidationIssue[] = [];
  const bindings = collection.bindings as unknown[];
  bindings.forEach((binding, index) => {
    issues.push(...validateDirectorRuntimeBinding(binding, expectedRuntimeRevision));
    if (plain(binding)) {
      issues.push(...validateDirectorRuntimeBindingConflict(
        binding as unknown as DirectorRuntimeBinding,
        bindings.slice(0, index) as DirectorRuntimeBinding[],
      ));
    }
  });
  if (expectedOrder && !expectedOrder.every((id, index) => {
    const binding = bindings[index];
    return plain(binding) && binding.bindingId === id;
  })) {
    issues.push(issue("DRI_ORDER_VIOLATION", "error", "integration", "Binding order differs from the explicit expected order", collection.collectionId));
  }
  return frozenIssues(issues);
}

export function validateDirectorRuntimeBindingTransition(
  binding: DirectorRuntimeBinding,
  nextState: DirectorRuntimeBindingLifecycleState,
): readonly DirectorRuntimeValidationIssue[] {
  if (!isDirectorRuntimeBindingLifecycleState(nextState)) {
    return frozenIssues([issue("DRI_BINDING_TRANSITION_INVALID", "error", "binding", "Binding transition target is invalid", binding.bindingId)]);
  }
  const result = transitionDirectorRuntimeBinding(binding, nextState);
  return result.accepted
    ? Object.freeze([])
    : frozenIssues([issue("DRI_BINDING_TRANSITION_INVALID", "error", "binding", "Binding lifecycle transition is not allowed", binding.bindingId)]);
}

export function validateDirectorRuntimeIntegrationArchitecture(
  context: DirectorRuntimeValidationContext,
): readonly DirectorRuntimeValidationIssue[] {
  const issues: DirectorRuntimeValidationIssue[] = [];
  if (context.expectedDirection !== "runtime-to-director") {
    issues.push(issue("DRI_DIRECTION_INVALID", "fatal", "architecture", "Reverse or unsupported integration direction is forbidden"));
  }
  if (context.runtimeAuthoritative !== true) {
    issues.push(issue("DRI_AUTHORITY_VIOLATION", "fatal", "architecture", "Runtime must remain authoritative operational state"));
  }
  if ((context.forbiddenDependencies?.length ?? 0) > 0) {
    issues.push(issue("DRI_ARCHITECTURE_VIOLATION", "fatal", "architecture", "Forbidden implementation dependency was declared"));
  }
  if (!verifyDirectorRuntimeIntegrationBinding() || directorRuntimeBindingRegistryCount !== 11 || directorRuntimeBindingTransitionRuleCount !== 19) {
    issues.push(issue("DRI_IDENTITY_INVALID", "fatal", "foundation", "Upstream DRI binding contract verification failed"));
  }
  return frozenIssues(issues);
}

// ─── Complete integration validation ───────────────────────────────────────

const PROFILE_LEVELS = Object.freeze({
  structural: Object.freeze(["foundation", "contract", "mapping", "binding"] as const),
  strict: Object.freeze(["foundation", "contract", "mapping", "binding", "integration"] as const),
  release: DIRECTOR_RUNTIME_VALIDATION_LEVELS,
});

export function validateDirectorRuntimeIntegration(
  request: DirectorRuntimeValidationRequest,
  context: DirectorRuntimeValidationContext,
): DirectorRuntimeValidationReport {
  if (typeof request.validationId !== "string" || request.validationId.length === 0) {
    throw new TypeError("validationId must be a caller-provided opaque identifier");
  }
  if (!isDirectorRuntimeValidationProfile(request.profile)) {
    throw new TypeError("profile must be a known validation profile");
  }
  const checkedLevels = request.levels.length > 0
    ? request.levels.map((level) => {
      if (!isDirectorRuntimeValidationLevel(level)) throw new TypeError("unknown validation level");
      return level;
    })
    : [...PROFILE_LEVELS[request.profile]];
  const issues: DirectorRuntimeValidationIssue[] = [];

  for (const level of checkedLevels) {
    if (level === "foundation" && !verifyDirectorRuntimeIntegrationBinding()) {
      issues.push(issue("DRI_IDENTITY_INVALID", "fatal", level, "Upstream DRI identity verification failed"));
    }
    if (level === "contract") {
      request.bindings.forEach((binding) => {
        issues.push(...validateDirectorRuntimeSource(binding.source));
        issues.push(...validateDirectorRuntimeTarget(binding.target));
      });
      request.payloads?.forEach((payload) => {
        issues.push(...validateDirectorRuntimeIntegrationPayload(payload));
      });
    }
    if (level === "mapping") {
      request.mappingRules?.forEach((rule) => issues.push(...validateDirectorRuntimeMappingRule(rule)));
      request.mappingRequests?.forEach((mappingRequest) => issues.push(...validateDirectorRuntimeMappingRequest(mappingRequest)));
      request.mappingResolutions?.forEach((resolution) => issues.push(...validateDirectorRuntimeMappingResolution(resolution)));
    }
    if (level === "binding") {
      request.bindings.forEach((binding, index) => {
        issues.push(...validateDirectorRuntimeBinding(binding, context.expectedRuntimeRevision));
        issues.push(...validateDirectorRuntimeBindingConflict(binding, request.bindings.slice(0, index)));
      });
      request.transitions?.forEach(({ binding, nextState }) => {
        issues.push(...validateDirectorRuntimeBindingTransition(binding, nextState));
      });
    }
    if (level === "architecture") {
      issues.push(...validateDirectorRuntimeIntegrationArchitecture(context));
    }
    if (level === "integration" && request.expectedBindingOrder) {
      if (!request.expectedBindingOrder.every((id, index) => request.bindings[index]?.bindingId === id)) {
        issues.push(issue("DRI_ORDER_VIOLATION", "error", level, "Binding order differs from the explicit expected order", request.validationId));
      }
    }
  }

  const frozen = frozenIssues(issues);
  const status = resolveDirectorRuntimeValidationStatus(frozen);
  const acceptance = resolveDirectorRuntimeValidationAcceptance(status, context.allowWarnings);
  const count = (severity: DirectorRuntimeValidationSeverity) =>
    frozen.filter((entry) => entry.severity === severity).length;
  return Object.freeze({
    validationId: request.validationId,
    status,
    accepted: acceptance.accepted,
    issues: frozen,
    checkedLevels: Object.freeze([...checkedLevels]),
    infoCount: count("info"),
    warningCount: count("warning"),
    errorCount: count("error"),
    fatalCount: count("fatal"),
  });
}

// ─── Registry and verification ─────────────────────────────────────────────

export const directorRuntimeValidationRegistry = Object.freeze([
  "Validation Identity", "Validation Levels", "Validation Severity",
  "Validation Status", "Issue Contract", "Report Contract", "Source Validation",
  "Target Validation", "Payload Validation", "Mapping Validation",
  "Binding Validation", "Conflict Validation", "Lifecycle Validation",
  "Direction Validation", "Authority Validation", "Architecture Validation",
  "Determinism", "Immutability",
].map((concept, index) => Object.freeze({ order: index + 1, concept })));
export const directorRuntimeValidationRegistryCount =
  directorRuntimeValidationRegistry.length;

export function getDirectorRuntimeValidationRegistry(): typeof directorRuntimeValidationRegistry {
  return directorRuntimeValidationRegistry;
}

export function verifyDirectorRuntimeIntegrationValidation(): boolean {
  return (
    directorRuntimeIntegrationValidationMetadata.identity ===
      "DRI-1:5/DirectorRuntimeIntegrationValidation" &&
    directorRuntimeIntegrationValidationMetadata.upstream ===
      directorRuntimeIntegrationBindingIdentity &&
    directorRuntimeIntegrationValidationMetadata.direction ===
      "runtime-to-director" &&
    directorRuntimeValidationRegistryCount === directorRuntimeValidationRegistry.length &&
    verifyDirectorRuntimeIntegrationBinding()
  );
}
