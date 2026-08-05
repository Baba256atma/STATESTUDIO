/**
 * NOL-2:7 — NexoraObject Material & Representation Certification
 *
 * Official trust gate for NOL-2 visualization packages before Freeze.
 * Observes NOL-2:6 projections only — never mutates them.
 *
 * Upstream: NOL-2:6 only.
 * Identity: NOL-2:7/NexoraObjectMaterialRepresentationCertification
 */

import {
  deserializeVisualizationProjection,
  projectDirectorPackage,
  projectVisualization,
  projectVisualizationCollection,
  serializeVisualizationProjection,
  validateNexoraObjectVisualizationProjection,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  visualizationDirectorProjectionSchemaVersion,
  type NexoraObjectDirectorPackage,
  type NexoraObjectVisualizationBatchRequest,
  type NexoraObjectVisualizationBatchResult,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjection,
  type NexoraObjectVisualizationProjectionInput,
} from "./nexoraObjectVisualizationDirectorProjectionEngine.ts";

// ─── Re-export visualization projection surface for Freeze / Public Index ───

export {
  validateNexoraObjectVisualizationProjection,
  serializeVisualizationProjection,
  deserializeVisualizationProjection,
  projectVisualization,
  projectVisualizationCollection,
  projectDirectorPackage,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  visualizationDirectorProjectionSchemaVersion,
};

export type {
  NexoraObjectVisualizationProjection,
  NexoraObjectDirectorPackage,
  NexoraObjectVisualizationProjectionInput,
  NexoraObjectVisualizationBatchRequest,
  NexoraObjectVisualizationBatchResult,
  NexoraObjectVisualizationDependencies,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const materialRepresentationCertificationIdentity =
  "NOL-2:7/NexoraObjectMaterialRepresentationCertification" as const;

export const materialRepresentationCertificationVersion = "1.0.0" as const;

export const materialRepresentationCertificationSchemaVersion =
  "1.0.0" as const;

export const NOL_MATERIAL_CERTIFICATION_IDENTITY =
  materialRepresentationCertificationIdentity;
export const NOL_MATERIAL_CERTIFICATION_VERSION =
  materialRepresentationCertificationVersion;
export const NOL_MATERIAL_CERTIFICATION_SCHEMA_VERSION =
  materialRepresentationCertificationSchemaVersion;

export const NOL_MATERIAL_CERTIFICATION_UPSTREAM = Object.freeze([
  visualizationDirectorProjectionEngineIdentity,
] as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraObjectVisualizationCertificationProfile =
  | "Development"
  | "Testing"
  | "Production"
  | "Platform"
  | "Release";

export type NexoraObjectVisualizationCertificationState =
  | "NotCertified"
  | "Pending"
  | "Certified"
  | "Expired"
  | "Revoked";

export type NexoraObjectVisualizationCompatibility =
  | "BackwardCompatible"
  | "ForwardCompatible"
  | "Breaking"
  | "Unknown";

export type NexoraObjectVisualizationCertificationCheckId =
  | "Identity"
  | "ProjectionCompleteness"
  | "Geometry"
  | "Material"
  | "Labels"
  | "Badges"
  | "Indicators"
  | "Interaction"
  | "Attention"
  | "Relationships"
  | "Animation"
  | "Picking"
  | "CameraHints"
  | "Determinism"
  | "Immutability"
  | "RendererIndependence"
  | "Consistency"
  | "Compatibility"
  | "Serialization"
  | "RenderingLevel";

export type NexoraObjectVisualizationRevocationReason =
  | "incompatible"
  | "renderer_violation"
  | "immutable_violation"
  | "unsupported_version"
  | "corruption";

export type VisualizationCertificationErrorCode =
  | "CERTIFICATION_CORRUPTED"
  | "CERTIFICATION_UNSUPPORTED_VERSION"
  | "CERTIFICATION_INVALID_TRANSITION"
  | "CERTIFICATION_INVALID_REQUEST";

export interface NexoraObjectVisualizationCertificationCheckResult {
  readonly checkId: NexoraObjectVisualizationCertificationCheckId;
  readonly passed: boolean;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectVisualizationCertificationHistoryEntry {
  readonly entryId: string;
  readonly state: NexoraObjectVisualizationCertificationState;
  readonly profile: NexoraObjectVisualizationCertificationProfile;
  readonly timestamp: string;
  readonly version: string;
  readonly score: number;
  readonly reason?: string;
}

export interface NexoraObjectVisualizationCertificationReport {
  readonly certificationId: string;
  readonly projectionId: string;
  readonly objectId: string;
  readonly profile: NexoraObjectVisualizationCertificationProfile;
  readonly state: NexoraObjectVisualizationCertificationState;
  readonly score: number;
  readonly passedChecks: readonly NexoraObjectVisualizationCertificationCheckResult[];
  readonly failedChecks: readonly NexoraObjectVisualizationCertificationCheckResult[];
  readonly warnings: readonly string[];
  readonly compatibility: NexoraObjectVisualizationCompatibility;
  readonly deterministic: boolean;
  readonly immutable: boolean;
  readonly rendererIndependent: boolean;
  readonly generatedAt: string;
  readonly version: string;
  readonly schemaVersion: string;
  readonly history: readonly NexoraObjectVisualizationCertificationHistoryEntry[];
  readonly fingerprint: string;
}

export interface NexoraObjectVisualizationCertificationComparison {
  readonly leftCertificationId: string;
  readonly rightCertificationId: string;
  readonly scoreDelta: number;
  readonly compatibilityChanged: boolean;
  readonly previousCompatibility: NexoraObjectVisualizationCompatibility;
  readonly nextCompatibility: NexoraObjectVisualizationCompatibility;
  readonly warningDifferences: readonly string[];
  readonly failedCheckDifferences: readonly string[];
  readonly stateChanged: boolean;
}

export interface NexoraObjectVisualizationCertificationDependencies {
  readonly now: () => string;
  readonly createCertificationId: () => string;
  readonly createHistoryEntryId: () => string;
}

export interface NexoraObjectVisualizationCertificationOptions {
  readonly referenceProjection?: NexoraObjectVisualizationProjection;
  readonly expectedFingerprint?: string;
  readonly forceNondeterministic?: boolean;
  readonly duplicateObjectId?: boolean;
}

export interface NexoraObjectVisualizationCollectionCertificationResult {
  readonly reports: readonly NexoraObjectVisualizationCertificationReport[];
  readonly accepted: boolean;
}

export interface NexoraObjectDirectorPackageCertificationResult {
  readonly packageId: string;
  readonly engineIdentityValid: boolean;
  readonly schemaVersionValid: boolean;
  readonly report: NexoraObjectVisualizationCertificationReport;
  readonly childReports: readonly NexoraObjectVisualizationCertificationReport[];
  readonly accepted: boolean;
}

export class VisualizationCertificationException extends Error {
  readonly code: VisualizationCertificationErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: VisualizationCertificationErrorCode,
    message: string,
    details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "VisualizationCertificationException";
    this.code = code;
    this.details = details;
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CHECK_IDS: readonly NexoraObjectVisualizationCertificationCheckId[] =
  Object.freeze([
    "Identity",
    "ProjectionCompleteness",
    "Geometry",
    "Material",
    "Labels",
    "Badges",
    "Indicators",
    "Interaction",
    "Attention",
    "Relationships",
    "Animation",
    "Picking",
    "CameraHints",
    "Determinism",
    "Immutability",
    "RendererIndependence",
    "Consistency",
    "Compatibility",
    "Serialization",
    "RenderingLevel",
  ]);

const REQUIRED_SECTIONS = Object.freeze([
  "identity",
  "representation",
  "material",
  "geometry",
  "labels",
  "badges",
  "indicators",
  "relationships",
  "interaction",
  "attention",
  "hierarchy",
  "rendering",
  "picking",
  "animation",
  "visibility",
  "cameraHints",
  "metadata",
] as const);

const LABEL_MODES = new Set(["Hidden", "Short", "Full"]);
const CAMERA_HINTS = new Set([
  "Normal",
  "Center",
  "Follow",
  "Overview",
  "Inspection",
]);
const RENDERING_LEVELS = new Set([
  "Hidden",
  "Minimal",
  "Normal",
  "Important",
  "Focused",
  "Operation",
]);
const ANIMATION_SEMANTICS = new Set([
  "Appear",
  "Disappear",
  "Expand",
  "Collapse",
  "Focus",
  "Attention",
  "Operation",
  "Historical",
  "None",
]);

const HARD_RENDERER_TOKENS = Object.freeze([
  "react",
  "jsx",
  "dom",
  "html",
  "canvas",
  "svg",
  "three",
  "mesh",
]);

const SOFT_RENDERER_TOKENS = Object.freeze(["scene", "group"]);

const CRITICAL_CHECKS = new Set<NexoraObjectVisualizationCertificationCheckId>([
  "Immutability",
  "RendererIndependence",
  "Consistency",
  "Identity",
  "ProjectionCompleteness",
]);

const SCORE_THRESHOLDS: Readonly<
  Record<NexoraObjectVisualizationCertificationProfile, number>
> = Object.freeze({
  Development: 60,
  Testing: 80,
  Production: 90,
  Platform: 90,
  Release: 95,
});

const STATE_TRANSITIONS: Readonly<
  Record<
    NexoraObjectVisualizationCertificationState,
    readonly NexoraObjectVisualizationCertificationState[]
  >
> = Object.freeze({
  NotCertified: Object.freeze(["Pending", "Certified"] as const),
  Pending: Object.freeze(["Certified", "NotCertified", "Revoked"] as const),
  Certified: Object.freeze(["Certified", "Expired", "Revoked"] as const),
  Expired: Object.freeze(["Certified", "Revoked", "Pending"] as const),
  Revoked: Object.freeze([] as const),
});

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

function isDeepFrozen(value: unknown): boolean {
  if (value === null || typeof value !== "object") return true;
  if (!Object.isFrozen(value)) return false;
  if (Array.isArray(value)) {
    return value.every((item) => isDeepFrozen(item));
  }
  return Object.keys(value as object).every((key) =>
    isDeepFrozen((value as Record<string, unknown>)[key]),
  );
}

function stableStringify(value: unknown): string {
  if (value === undefined) {
    // Match JSON.stringify: omit undefined object properties; arrays become null.
    return "null";
  }
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function defaultDependencies(): NexoraObjectVisualizationCertificationDependencies {
  let certificationSeq = 0;
  let historySeq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createCertificationId: () => {
      certificationSeq += 1;
      return `viz-cert-${certificationSeq}`;
    },
    createHistoryEntryId: () => {
      historySeq += 1;
      return `viz-hist-${historySeq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
): NexoraObjectVisualizationCertificationDependencies {
  return dependencies ?? defaultDependencies();
}

function checkResult(
  checkId: NexoraObjectVisualizationCertificationCheckId,
  passed: boolean,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectVisualizationCertificationCheckResult {
  return deepFreeze(
    details === undefined
      ? { checkId, passed, message }
      : { checkId, passed, message, details },
  );
}

function projectionSemanticPayload(
  projection: NexoraObjectVisualizationProjection,
): unknown {
  return {
    identity: {
      objectId: projection.identity.objectId,
      objectType: projection.identity.objectType,
      representationId: projection.identity.representationId,
      representationVersion: projection.identity.representationVersion,
      seedColor: projection.identity.seedColor,
      projectionVersion: projection.identity.projectionVersion,
    },
    representation: projection.representation,
    material: {
      materialStateId: projection.material.materialStateId,
      seedColor: projection.material.seedColor,
      emphasis: projection.material.emphasis,
      layer: projection.material.layer,
      glow: projection.material.glow,
      outline: projection.material.outline,
      opacity: projection.material.opacity,
      cacheKey: projection.material.cacheKey,
    },
    geometry: projection.geometry,
    labels: projection.labels,
    badges: projection.badges,
    indicators: projection.indicators,
    relationships: projection.relationships,
    interaction: projection.interaction,
    attention: projection.attention,
    hierarchy: projection.hierarchy,
    rendering: projection.rendering,
    picking: projection.picking,
    animation: projection.animation,
    visibility: projection.visibility,
    cameraHints: projection.cameraHints,
    metadata: projection.metadata,
  };
}

/** Stable hash of semantic projection content (excludes projectionId). */
export function computeVisualizationProjectionFingerprint(
  projection: NexoraObjectVisualizationProjection,
): string {
  return hashString(stableStringify(projectionSemanticPayload(projection)));
}

export function isValidVisualizationCertificationStateTransition(
  from: NexoraObjectVisualizationCertificationState,
  to: NexoraObjectVisualizationCertificationState,
): boolean {
  return STATE_TRANSITIONS[from].includes(to);
}

function assertStateTransition(
  from: NexoraObjectVisualizationCertificationState,
  to: NexoraObjectVisualizationCertificationState,
): void {
  if (!isValidVisualizationCertificationStateTransition(from, to)) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_INVALID_TRANSITION",
      `Invalid certification state transition: ${from} → ${to}`,
      { from, to },
    );
  }
}

function tokenMatches(
  candidate: string,
  tokens: readonly string[],
): string | null {
  const lower = candidate.toLowerCase();
  for (const token of tokens) {
    if (lower === token || lower.includes(token)) {
      return token;
    }
  }
  return null;
}

function scanRendererViolations(
  value: unknown,
  path = "",
): { hard: string[]; soft: string[] } {
  const hard: string[] = [];
  const soft: string[] = [];

  const visit = (node: unknown, nodePath: string): void => {
    if (node === null || node === undefined) return;
    if (typeof node === "function") {
      hard.push(nodePath || "<function>");
      return;
    }
    if (typeof node === "string") {
      const hardHit = tokenMatches(node, HARD_RENDERER_TOKENS);
      if (hardHit) hard.push(`${nodePath}=${hardHit}`);
      const softHit = tokenMatches(node, SOFT_RENDERER_TOKENS);
      if (softHit) soft.push(`${nodePath}=${softHit}`);
      return;
    }
    if (typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        visit(node[i], `${nodePath}[${i}]`);
      }
      return;
    }
    const record = node as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const keyPath = nodePath ? `${nodePath}.${key}` : key;
      const hardKey = tokenMatches(key, HARD_RENDERER_TOKENS);
      if (hardKey) hard.push(keyPath);
      const softKey = tokenMatches(key, SOFT_RENDERER_TOKENS);
      if (softKey) soft.push(keyPath);
      visit(record[key], keyPath);
    }
  };

  visit(value, path);
  return { hard, soft };
}

function profileRequiresStrictSerialization(
  profile: NexoraObjectVisualizationCertificationProfile,
): boolean {
  return (
    profile === "Production" ||
    profile === "Platform" ||
    profile === "Release"
  );
}

function profileIsStrict(
  profile: NexoraObjectVisualizationCertificationProfile,
): boolean {
  return profileRequiresStrictSerialization(profile);
}

function scoreFromChecks(
  results: readonly NexoraObjectVisualizationCertificationCheckResult[],
): number {
  if (results.length === 0) return 0;
  const passed = results.filter((item) => item.passed).length;
  return Math.round((passed / results.length) * 100);
}

function hasFailedCritical(
  failed: readonly NexoraObjectVisualizationCertificationCheckResult[],
): boolean {
  return failed.some((item) => CRITICAL_CHECKS.has(item.checkId));
}

function resolveCompatibility(
  profile: NexoraObjectVisualizationCertificationProfile,
  failedCritical: boolean,
  softFailures: boolean,
  schemaAligned: boolean,
): NexoraObjectVisualizationCompatibility {
  if (failedCritical) return "Breaking";
  if (profile === "Development" && softFailures) return "Unknown";
  if (!schemaAligned) return "Unknown";
  if (profile === "Platform" || profile === "Release") {
    return "ForwardCompatible";
  }
  return "BackwardCompatible";
}

function resolveState(
  profile: NexoraObjectVisualizationCertificationProfile,
  score: number,
  failed: readonly NexoraObjectVisualizationCertificationCheckResult[],
  compatibility: NexoraObjectVisualizationCompatibility,
): NexoraObjectVisualizationCertificationState {
  const threshold = SCORE_THRESHOLDS[profile];
  const criticalFailed = hasFailedCritical(failed);
  if (criticalFailed && profileIsStrict(profile)) {
    return "NotCertified";
  }
  if (score < threshold) return "NotCertified";
  if (failed.length > 0 && profileIsStrict(profile)) {
    return "NotCertified";
  }
  if (
    (profile === "Platform" || profile === "Release") &&
    compatibility === "Breaking"
  ) {
    return "NotCertified";
  }
  if (failed.length > 0 && profile === "Testing") {
    return "NotCertified";
  }
  if (failed.length > 0 && profile === "Development") {
    return score >= threshold ? "Certified" : "NotCertified";
  }
  return "Certified";
}

function geometryHasCoordinates(
  geometry: NexoraObjectVisualizationProjection["geometry"],
): boolean {
  const record = geometry as unknown as Record<string, unknown>;
  return (
    "x" in record ||
    "y" in record ||
    "z" in record ||
    "position" in record ||
    "coordinates" in record ||
    "worldPosition" in record
  );
}

function runChecks(
  projection: NexoraObjectVisualizationProjection,
  profile: NexoraObjectVisualizationCertificationProfile,
  fingerprint: string,
  options: NexoraObjectVisualizationCertificationOptions | undefined,
  warnings: string[],
): NexoraObjectVisualizationCertificationCheckResult[] {
  const results: NexoraObjectVisualizationCertificationCheckResult[] = [];

  // 1. Identity
  const identityOk =
    Boolean(projection.identity?.objectId) &&
    Boolean(projection.identity?.projectionVersion) &&
    Boolean(projection.identity?.representationId);
  results.push(
    checkResult(
      "Identity",
      identityOk && options?.duplicateObjectId !== true,
      identityOk && options?.duplicateObjectId !== true
        ? "Identity fields present."
        : options?.duplicateObjectId
          ? "Duplicate objectId in collection."
          : "Missing identity.objectId, projectionVersion, or representationId.",
      {
        objectId: projection.identity?.objectId,
        duplicateObjectId: options?.duplicateObjectId === true,
      },
    ),
  );

  // 2. ProjectionCompleteness
  const projectionRecord = projection as unknown as Record<string, unknown>;
  const missingSections = REQUIRED_SECTIONS.filter(
    (section) =>
      projectionRecord[section] === undefined ||
      projectionRecord[section] === null,
  );
  const structuralErrors = validateNexoraObjectVisualizationProjection(
    projection,
  ).filter(
    (error) =>
      error.code === "VISUALIZATION_INVALID_INPUT" ||
      error.code === "VISUALIZATION_INVALID_PRIORITY",
  );
  results.push(
    checkResult(
      "ProjectionCompleteness",
      missingSections.length === 0,
      missingSections.length === 0
        ? "All required projection sections present."
        : `Missing sections: ${missingSections.join(", ")}`,
      { missingSections, structuralErrorCount: structuralErrors.length },
    ),
  );

  // 3. Geometry
  const geometryOk =
    projection.geometry?.coordinatesForbidden === true &&
    !geometryHasCoordinates(projection.geometry);
  results.push(
    checkResult(
      "Geometry",
      geometryOk,
      geometryOk
        ? "Geometry is coordinate-free."
        : "Geometry must set coordinatesForbidden and omit x/y/z/position.",
    ),
  );

  // 4. Material
  const materialOk =
    Boolean(projection.material?.seedColor) &&
    Boolean(projection.material?.materialStateId);
  results.push(
    checkResult(
      "Material",
      materialOk,
      materialOk
        ? "Material seedColor and materialStateId present."
        : "Material seedColor or materialStateId missing.",
    ),
  );

  // 5. Labels
  const labelsOk = LABEL_MODES.has(projection.labels?.mode);
  results.push(
    checkResult(
      "Labels",
      labelsOk,
      labelsOk
        ? "Label mode valid."
        : `Invalid label mode: ${String(projection.labels?.mode)}`,
    ),
  );

  // 6. Badges
  const badgesOk = Array.isArray(projection.badges?.badges);
  results.push(
    checkResult(
      "Badges",
      badgesOk,
      badgesOk ? "Badges array present." : "Badges must be an array.",
    ),
  );

  // 7. Indicators
  const indicatorsOk = Boolean(projection.indicators?.mode);
  results.push(
    checkResult(
      "Indicators",
      indicatorsOk,
      indicatorsOk
        ? "Indicator mode present."
        : "Indicator mode missing.",
    ),
  );

  // 8. Interaction
  const interactionOk = Boolean(projection.interaction?.interactionState);
  results.push(
    checkResult(
      "Interaction",
      interactionOk,
      interactionOk
        ? "Interaction state present."
        : "Interaction state missing.",
    ),
  );

  // 9. Attention
  const attentionOk = Boolean(projection.attention?.attentionState);
  results.push(
    checkResult(
      "Attention",
      attentionOk,
      attentionOk
        ? "Attention state present."
        : "Attention state missing.",
    ),
  );

  // 10. Relationships
  const relationshipsOk =
    projection.relationships?.graphTraversalPerformed === false;
  results.push(
    checkResult(
      "Relationships",
      relationshipsOk,
      relationshipsOk
        ? "No graph traversal performed."
        : "graphTraversalPerformed must be false.",
    ),
  );

  // 11. Animation
  const animationOk =
    Boolean(projection.animation?.semantic) &&
    ANIMATION_SEMANTICS.has(projection.animation.semantic);
  results.push(
    checkResult(
      "Animation",
      animationOk,
      animationOk
        ? "Animation semantic present."
        : "Animation semantic missing or invalid.",
    ),
  );

  // 12. Picking
  const pickingOk =
    projection.picking?.objectId === projection.identity?.objectId;
  results.push(
    checkResult(
      "Picking",
      pickingOk,
      pickingOk
        ? "Picking objectId matches identity."
        : "Picking objectId does not match identity.",
      {
        identityObjectId: projection.identity?.objectId,
        pickingObjectId: projection.picking?.objectId,
      },
    ),
  );

  // 13. CameraHints
  const cameraOk = CAMERA_HINTS.has(projection.cameraHints?.hint);
  results.push(
    checkResult(
      "CameraHints",
      cameraOk,
      cameraOk
        ? "Camera hint valid."
        : `Invalid camera hint: ${String(projection.cameraHints?.hint)}`,
    ),
  );

  // 14. Determinism
  let determinismPassed = true;
  let determinismMessage = "Projection fingerprint is self-consistent.";
  if (options?.forceNondeterministic === true) {
    determinismPassed = false;
    determinismMessage = "Determinism forced to fail.";
  } else if (options?.expectedFingerprint !== undefined) {
    determinismPassed = options.expectedFingerprint === fingerprint;
    determinismMessage = determinismPassed
      ? "Fingerprint matches expectedFingerprint."
      : "Fingerprint does not match expectedFingerprint.";
  } else if (options?.referenceProjection !== undefined) {
    const referenceFingerprint = computeVisualizationProjectionFingerprint(
      options.referenceProjection,
    );
    determinismPassed = referenceFingerprint === fingerprint;
    determinismMessage = determinismPassed
      ? "Fingerprint matches referenceProjection."
      : "Fingerprint differs from referenceProjection.";
  } else if (profile === "Development") {
    warnings.push(
      "Determinism: no referenceProjection provided; treated as advisory in Development.",
    );
    determinismPassed = true;
    determinismMessage =
      "Development profile: determinism advisory without reference.";
  } else {
    determinismPassed = fingerprint.length > 0;
  }

  if (
    determinismPassed &&
    profileRequiresStrictSerialization(profile) &&
    options?.forceNondeterministic !== true
  ) {
    try {
      const restored = deserializeVisualizationProjection(
        serializeVisualizationProjection(projection),
      );
      const restoredFingerprint =
        computeVisualizationProjectionFingerprint(restored);
      if (restoredFingerprint !== fingerprint) {
        determinismPassed = false;
        determinismMessage =
          "Reserialized projection fingerprint does not match.";
      }
    } catch (error) {
      determinismPassed = false;
      determinismMessage =
        error instanceof Error
          ? `Determinism re-serialize failed: ${error.message}`
          : "Determinism re-serialize failed.";
    }
  }

  results.push(
    checkResult("Determinism", determinismPassed, determinismMessage, {
      fingerprint,
    }),
  );

  // 15. Immutability
  const immutable = isDeepFrozen(projection);
  results.push(
    checkResult(
      "Immutability",
      immutable,
      immutable
        ? "Projection is deeply frozen."
        : "Projection (or nested value) is not frozen.",
    ),
  );

  // 16. RendererIndependence
  const violations = scanRendererViolations(projection);
  let rendererPassed = violations.hard.length === 0;
  if (violations.soft.length > 0) {
    if (profile === "Development") {
      warnings.push(
        `Soft renderer keys/values (Development warn): ${violations.soft.join(", ")}`,
      );
    } else if (profileIsStrict(profile)) {
      rendererPassed = false;
    } else {
      warnings.push(
        `Soft renderer keys/values: ${violations.soft.join(", ")}`,
      );
    }
  }
  if (violations.hard.length > 0) {
    rendererPassed = false;
  }
  results.push(
    checkResult(
      "RendererIndependence",
      rendererPassed,
      rendererPassed
        ? "No renderer-specific keys or values detected."
        : `Renderer-specific content found: ${[...violations.hard, ...violations.soft].join(", ")}`,
      { hard: violations.hard, soft: violations.soft },
    ),
  );

  // 17. Consistency
  const objectId = projection.identity?.objectId ?? "";
  const materialLinked =
    typeof projection.material?.materialStateId === "string" &&
    projection.material.materialStateId.includes(objectId);
  const seedMatches =
    projection.identity?.seedColor === projection.material?.seedColor;
  const representationMatchesPicking =
    projection.representation?.state ===
    projection.picking?.representationState;
  const interactionLinked =
    projection.interaction?.interactionState ===
    projection.picking?.interactionState;
  const consistencyOk =
    objectId.length > 0 &&
    projection.picking?.objectId === objectId &&
    materialLinked &&
    seedMatches &&
    representationMatchesPicking &&
    interactionLinked &&
    options?.duplicateObjectId !== true;
  results.push(
    checkResult(
      "Consistency",
      consistencyOk,
      consistencyOk
        ? "Identity, material, interaction, and picking are consistent."
        : "Projection facets are inconsistent for the same object.",
      {
        materialLinked,
        seedMatches,
        representationMatchesPicking,
        interactionLinked,
        duplicateObjectId: options?.duplicateObjectId === true,
      },
    ),
  );

  // 18. Compatibility (preliminary — refined after critical/soft known)
  const schemaAligned =
    visualizationDirectorProjectionSchemaVersion === "1.0.0" &&
    visualizationDirectorProjectionEngineVersion === "1.0.0";
  results.push(
    checkResult(
      "Compatibility",
      schemaAligned,
      schemaAligned
        ? "Director projection schema versions align."
        : "Director projection schema versions misaligned.",
      {
        schemaVersion: visualizationDirectorProjectionSchemaVersion,
        engineVersion: visualizationDirectorProjectionEngineVersion,
        engineIdentity: visualizationDirectorProjectionEngineIdentity,
      },
    ),
  );

  // 19. Serialization
  let serializationPassed = false;
  let serializationMessage = "Serialization round-trip failed.";
  try {
    const first = serializeVisualizationProjection(projection);
    const restored = deserializeVisualizationProjection(first);
    const second = serializeVisualizationProjection(restored);
    const firstPayload = JSON.parse(first) as {
      projection: NexoraObjectVisualizationProjection;
    };
    const secondPayload = JSON.parse(second) as {
      projection: NexoraObjectVisualizationProjection;
    };
    const payloadsEqual =
      stableStringify(firstPayload.projection) ===
      stableStringify(secondPayload.projection);
    const restoredFingerprint =
      computeVisualizationProjectionFingerprint(restored);
    serializationPassed =
      payloadsEqual && restoredFingerprint === fingerprint;
    serializationMessage = serializationPassed
      ? "Serialize → deserialize → serialize is stable."
      : "Serialization payloads or fingerprints diverge.";
  } catch (error) {
    serializationPassed = false;
    serializationMessage =
      error instanceof Error
        ? `Serialization error: ${error.message}`
        : "Serialization error.";
    if (!profileRequiresStrictSerialization(profile)) {
      warnings.push(serializationMessage);
    }
  }
  if (
    !serializationPassed &&
    profile === "Development" &&
    !immutable
  ) {
    // Development may still record the failure; leave as failed check.
  }
  results.push(
    checkResult("Serialization", serializationPassed, serializationMessage),
  );

  // 20. RenderingLevel
  const renderingOk = RENDERING_LEVELS.has(projection.rendering?.level);
  results.push(
    checkResult(
      "RenderingLevel",
      renderingOk,
      renderingOk
        ? "Rendering level valid."
        : `Invalid rendering level: ${String(projection.rendering?.level)}`,
    ),
  );

  void CHECK_IDS;
  return results;
}

function buildReport(
  projection: NexoraObjectVisualizationProjection,
  profile: NexoraObjectVisualizationCertificationProfile,
  deps: NexoraObjectVisualizationCertificationDependencies,
  options: NexoraObjectVisualizationCertificationOptions | undefined,
  previousHistory: readonly NexoraObjectVisualizationCertificationHistoryEntry[],
  reason?: string,
): NexoraObjectVisualizationCertificationReport {
  const warnings: string[] = [];
  const fingerprint = computeVisualizationProjectionFingerprint(projection);
  const checkResults = runChecks(
    projection,
    profile,
    fingerprint,
    options,
    warnings,
  );

  // Refine Compatibility based on other outcomes
  const failedPreliminary = checkResults.filter((item) => !item.passed);
  const softFailures =
    failedPreliminary.some((item) => item.checkId === "Determinism") ||
    warnings.length > 0;
  const failedCritical = hasFailedCritical(failedPreliminary);
  const schemaAligned = checkResults.find(
    (item) => item.checkId === "Compatibility",
  )?.passed === true;
  const compatibility = resolveCompatibility(
    profile,
    failedCritical,
    softFailures,
    schemaAligned,
  );

  const refined = checkResults.map((item) => {
    if (item.checkId !== "Compatibility") return item;
    const ok =
      compatibility === "BackwardCompatible" ||
      compatibility === "ForwardCompatible";
    return checkResult(
      "Compatibility",
      ok || (profile === "Development" && compatibility === "Unknown"),
      `Compatibility: ${compatibility}.`,
      { ...(item.details ?? {}), compatibility },
    );
  });

  const passedChecks = refined.filter((item) => item.passed);
  const failedChecks = refined.filter((item) => !item.passed);
  const score = scoreFromChecks(refined);
  const state = resolveState(profile, score, failedChecks, compatibility);
  const determinismCheck = refined.find(
    (item) => item.checkId === "Determinism",
  );
  const immutabilityCheck = refined.find(
    (item) => item.checkId === "Immutability",
  );
  const rendererCheck = refined.find(
    (item) => item.checkId === "RendererIndependence",
  );

  const historyEntry: NexoraObjectVisualizationCertificationHistoryEntry =
    deepFreeze({
      entryId: deps.createHistoryEntryId(),
      state,
      profile,
      timestamp: deps.now(),
      version: materialRepresentationCertificationVersion,
      score,
      ...(reason !== undefined ? { reason } : {}),
    });

  return deepFreeze({
    certificationId: deps.createCertificationId(),
    projectionId: projection.identity.projectionId,
    objectId: projection.identity.objectId,
    profile,
    state,
    score,
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([...warnings]),
    compatibility,
    deterministic: determinismCheck?.passed === true,
    immutable: immutabilityCheck?.passed === true,
    rendererIndependent: rendererCheck?.passed === true,
    generatedAt: deps.now(),
    version: materialRepresentationCertificationVersion,
    schemaVersion: materialRepresentationCertificationSchemaVersion,
    history: Object.freeze([...previousHistory, historyEntry]),
    fingerprint,
  });
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function certifyVisualization(
  projection: NexoraObjectVisualizationProjection,
  profile: NexoraObjectVisualizationCertificationProfile,
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
  options?: NexoraObjectVisualizationCertificationOptions,
): NexoraObjectVisualizationCertificationReport {
  const deps = resolveDeps(dependencies);
  return buildReport(projection, profile, deps, options, []);
}

export function certifyVisualizationCollection(
  projections: readonly NexoraObjectVisualizationProjection[],
  profile: NexoraObjectVisualizationCertificationProfile,
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
): NexoraObjectVisualizationCollectionCertificationResult {
  const deps = resolveDeps(dependencies);
  const seen = new Map<string, number>();
  for (const projection of projections) {
    const objectId = projection.identity?.objectId ?? "";
    seen.set(objectId, (seen.get(objectId) ?? 0) + 1);
  }

  const reports = projections.map((projection) => {
    const objectId = projection.identity?.objectId ?? "";
    const duplicate = (seen.get(objectId) ?? 0) > 1;
    return buildReport(projection, profile, deps, {
      duplicateObjectId: duplicate,
    }, []);
  });

  return deepFreeze({
    reports: Object.freeze(reports),
    accepted: reports.every((report) => report.state === "Certified"),
  });
}

export function certifyDirectorPackage(
  pkg: NexoraObjectDirectorPackage,
  profile: NexoraObjectVisualizationCertificationProfile,
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
): NexoraObjectDirectorPackageCertificationResult {
  const deps = resolveDeps(dependencies);
  const engineIdentityValid =
    pkg.engineIdentity === visualizationDirectorProjectionEngineIdentity;
  const schemaVersionValid =
    pkg.schemaVersion === visualizationDirectorProjectionSchemaVersion;

  const childReports = pkg.projections.map((projection) =>
    buildReport(projection, profile, deps, undefined, []),
  );

  const childAccepted = childReports.every(
    (report) => report.state === "Certified",
  );
  const packageAccepted =
    engineIdentityValid &&
    schemaVersionValid &&
    childAccepted &&
    (profile !== "Platform" && profile !== "Release"
      ? true
      : childReports.every((report) => report.compatibility !== "Breaking"));

  const score =
    childReports.length === 0
      ? 0
      : Math.round(
          childReports.reduce((sum, report) => sum + report.score, 0) /
            childReports.length,
        );

  const failedChecks: NexoraObjectVisualizationCertificationCheckResult[] = [];
  if (!engineIdentityValid) {
    failedChecks.push(
      checkResult(
        "Identity",
        false,
        "Director package engineIdentity does not match NOL-2:6 identity.",
        { engineIdentity: pkg.engineIdentity },
      ),
    );
  }
  if (!schemaVersionValid) {
    failedChecks.push(
      checkResult(
        "Compatibility",
        false,
        "Director package schemaVersion unsupported.",
        { schemaVersion: pkg.schemaVersion },
      ),
    );
  }
  for (const child of childReports) {
    failedChecks.push(...child.failedChecks);
  }

  const passedChecks: NexoraObjectVisualizationCertificationCheckResult[] = [];
  if (engineIdentityValid) {
    passedChecks.push(
      checkResult(
        "Identity",
        true,
        "Director package engineIdentity matches NOL-2:6.",
      ),
    );
  }
  if (schemaVersionValid) {
    passedChecks.push(
      checkResult(
        "Compatibility",
        true,
        "Director package schemaVersion matches NOL-2:6.",
      ),
    );
  }

  const compatibility: NexoraObjectVisualizationCompatibility = !packageAccepted
    ? "Breaking"
    : profile === "Platform" || profile === "Release"
      ? "ForwardCompatible"
      : "BackwardCompatible";

  const state: NexoraObjectVisualizationCertificationState = packageAccepted
    ? "Certified"
    : "NotCertified";

  const historyEntry: NexoraObjectVisualizationCertificationHistoryEntry =
    deepFreeze({
      entryId: deps.createHistoryEntryId(),
      state,
      profile,
      timestamp: deps.now(),
      version: materialRepresentationCertificationVersion,
      score,
      reason: "director_package",
    });

  const report: NexoraObjectVisualizationCertificationReport = deepFreeze({
    certificationId: deps.createCertificationId(),
    projectionId: pkg.packageId,
    objectId: pkg.packageId,
    profile,
    state,
    score,
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(
      engineIdentityValid && schemaVersionValid
        ? []
        : [
            ...(!engineIdentityValid
              ? ["Package engineIdentity mismatch."]
              : []),
            ...(!schemaVersionValid
              ? ["Package schemaVersion mismatch."]
              : []),
          ],
    ),
    compatibility,
    deterministic: childReports.every((item) => item.deterministic),
    immutable: childReports.every((item) => item.immutable),
    rendererIndependent: childReports.every((item) => item.rendererIndependent),
    generatedAt: deps.now(),
    version: materialRepresentationCertificationVersion,
    schemaVersion: materialRepresentationCertificationSchemaVersion,
    history: Object.freeze([historyEntry]),
    fingerprint: hashString(
      stableStringify({
        packageId: pkg.packageId,
        engineIdentity: pkg.engineIdentity,
        schemaVersion: pkg.schemaVersion,
        childFingerprints: childReports.map((item) => item.fingerprint),
      }),
    ),
  });

  return deepFreeze({
    packageId: pkg.packageId,
    engineIdentityValid,
    schemaVersionValid,
    report,
    childReports: Object.freeze(childReports),
    accepted: packageAccepted,
  });
}

export function recertifyVisualization(
  previousReport: NexoraObjectVisualizationCertificationReport,
  projection: NexoraObjectVisualizationProjection,
  profile: NexoraObjectVisualizationCertificationProfile,
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
): NexoraObjectVisualizationCertificationReport {
  const deps = resolveDeps(dependencies);
  assertStateTransition(previousReport.state, "Certified");
  // Build candidate; if not certified, still append history with resulting state
  const next = buildReport(
    projection,
    profile,
    deps,
    undefined,
    previousReport.history,
    "recertify",
  );
  if (
    previousReport.state === "Certified" &&
    next.state === "Certified" &&
    !isValidVisualizationCertificationStateTransition("Certified", "Certified")
  ) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_INVALID_TRANSITION",
      "Recertification transition Certified → Certified rejected.",
    );
  }
  return next;
}

export function revokeVisualizationCertification(
  report: NexoraObjectVisualizationCertificationReport,
  reason: NexoraObjectVisualizationRevocationReason,
  dependencies?: NexoraObjectVisualizationCertificationDependencies,
): NexoraObjectVisualizationCertificationReport {
  const deps = resolveDeps(dependencies);
  assertStateTransition(report.state, "Revoked");

  const historyEntry: NexoraObjectVisualizationCertificationHistoryEntry =
    deepFreeze({
      entryId: deps.createHistoryEntryId(),
      state: "Revoked" as const,
      profile: report.profile,
      timestamp: deps.now(),
      version: materialRepresentationCertificationVersion,
      score: report.score,
      reason,
    });

  return deepFreeze({
    ...report,
    certificationId: deps.createCertificationId(),
    state: "Revoked" as const,
    generatedAt: deps.now(),
    history: Object.freeze([...report.history, historyEntry]),
    warnings: Object.freeze([...report.warnings, `Revoked: ${reason}`]),
  });
}

export function compareVisualizationCertifications(
  left: NexoraObjectVisualizationCertificationReport,
  right: NexoraObjectVisualizationCertificationReport,
): NexoraObjectVisualizationCertificationComparison {
  const leftFailed = new Set(
    left.failedChecks.map((item) => `${item.checkId}:${item.message}`),
  );
  const rightFailed = new Set(
    right.failedChecks.map((item) => `${item.checkId}:${item.message}`),
  );
  const failedCheckDifferences = [
    ...[...leftFailed]
      .filter((item) => !rightFailed.has(item))
      .map((item) => `- ${item}`),
    ...[...rightFailed]
      .filter((item) => !leftFailed.has(item))
      .map((item) => `+ ${item}`),
  ];

  const leftWarnings = new Set(left.warnings);
  const rightWarnings = new Set(right.warnings);
  const warningDifferences = [
    ...[...leftWarnings]
      .filter((item) => !rightWarnings.has(item))
      .map((item) => `- ${item}`),
    ...[...rightWarnings]
      .filter((item) => !leftWarnings.has(item))
      .map((item) => `+ ${item}`),
  ];

  return deepFreeze({
    leftCertificationId: left.certificationId,
    rightCertificationId: right.certificationId,
    scoreDelta: right.score - left.score,
    compatibilityChanged: left.compatibility !== right.compatibility,
    previousCompatibility: left.compatibility,
    nextCompatibility: right.compatibility,
    warningDifferences: Object.freeze(warningDifferences),
    failedCheckDifferences: Object.freeze(failedCheckDifferences),
    stateChanged: left.state !== right.state,
  });
}

export function validateVisualizationCertification(
  report: NexoraObjectVisualizationCertificationReport,
): readonly string[] {
  const errors: string[] = [];
  if (!report.certificationId) {
    errors.push("certificationId is required.");
  }
  if (!report.projectionId) {
    errors.push("projectionId is required.");
  }
  if (!report.objectId) {
    errors.push("objectId is required.");
  }
  if (!Number.isFinite(report.score) || report.score < 0 || report.score > 100) {
    errors.push("score must be between 0 and 100.");
  }
  if (!report.fingerprint) {
    errors.push("fingerprint is required.");
  }
  if (report.schemaVersion !== materialRepresentationCertificationSchemaVersion) {
    errors.push(
      `Unsupported certification schemaVersion: ${report.schemaVersion}`,
    );
  }
  if (report.version !== materialRepresentationCertificationVersion) {
    errors.push(`Unsupported certification version: ${report.version}`);
  }
  if (!Array.isArray(report.history) || report.history.length === 0) {
    errors.push("history must be a non-empty append-only array.");
  }
  if (!Object.isFrozen(report)) {
    errors.push("report must be immutable.");
  }
  return Object.freeze(errors);
}

export function serializeVisualizationCertification(
  report: NexoraObjectVisualizationCertificationReport,
): string {
  const errors = validateVisualizationCertification(report);
  if (errors.length > 0) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_CORRUPTED",
      errors[0]!,
      { errors },
    );
  }
  return JSON.stringify({
    identity: materialRepresentationCertificationIdentity,
    version: materialRepresentationCertificationVersion,
    schemaVersion: materialRepresentationCertificationSchemaVersion,
    upstream: {
      engineIdentity: visualizationDirectorProjectionEngineIdentity,
      engineVersion: visualizationDirectorProjectionEngineVersion,
      schemaVersion: visualizationDirectorProjectionSchemaVersion,
    },
    report,
  });
}

export function deserializeVisualizationCertification(
  json: string,
): NexoraObjectVisualizationCertificationReport {
  let parsed: {
    schemaVersion?: string;
    report?: NexoraObjectVisualizationCertificationReport;
  };
  try {
    parsed = JSON.parse(json) as {
      schemaVersion?: string;
      report?: NexoraObjectVisualizationCertificationReport;
    };
  } catch (error) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_CORRUPTED",
      error instanceof Error
        ? `Corrupted certification JSON: ${error.message}`
        : "Corrupted certification JSON.",
    );
  }
  if (parsed.schemaVersion !== materialRepresentationCertificationSchemaVersion) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_UNSUPPORTED_VERSION",
      `Unsupported certification schema: ${String(parsed.schemaVersion)}`,
      { schemaVersion: parsed.schemaVersion },
    );
  }
  if (!parsed.report) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_CORRUPTED",
      "Missing certification report payload.",
    );
  }
  const restored = deepFreeze(parsed.report);
  const errors = validateVisualizationCertification(restored);
  if (errors.length > 0) {
    throw new VisualizationCertificationException(
      "CERTIFICATION_CORRUPTED",
      errors[0]!,
      { errors },
    );
  }
  return restored;
}

export function getNexoraObjectMaterialRepresentationCertificationSummary() {
  return Object.freeze({
    identity: materialRepresentationCertificationIdentity,
    version: materialRepresentationCertificationVersion,
    schemaVersion: materialRepresentationCertificationSchemaVersion,
    upstream: NOL_MATERIAL_CERTIFICATION_UPSTREAM,
    observesOnly: true,
    frameworkIndependent: true,
    rendererIndependent: true,
  });
}

export const NexoraObjectMaterialRepresentationCertification = Object.freeze({
  identity: materialRepresentationCertificationIdentity,
  version: materialRepresentationCertificationVersion,
  schemaVersion: materialRepresentationCertificationSchemaVersion,
  certifyVisualization,
  certifyVisualizationCollection,
  certifyDirectorPackage,
  recertifyVisualization,
  revokeVisualizationCertification,
  compareVisualizationCertifications,
  validateVisualizationCertification,
  serializeVisualizationCertification,
  deserializeVisualizationCertification,
  summary: getNexoraObjectMaterialRepresentationCertificationSummary,
});
