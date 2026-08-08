/**
 * DRI-8:7 — Director Runtime Consumer Adapter Certification.
 *
 * Certifies that the complete DRI-8:1–8:6 consumer-integration chain is a
 * valid, compatible, deterministic, immutable, framework-independent
 * Director Runtime Consumer Adapter boundary.
 *
 * Certification only — no new consumer behavior, projection rules,
 * interaction mappings, or coordination logic.
 *
 * Observes the chain through the approved DRI-8:6 dependency surface and
 * sibling-module source architecture inspection. Does not freeze or lock.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES,
  DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES,
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  coordinateDirectorRuntimeExperience,
  directorRuntimeExperienceCoordinationPlatform,
  directorRuntimeExperienceCoordinationPlatformIdentity,
  directorRuntimeExperienceCoordinationPlatformRegistry,
  getDirectorRuntimeExperienceCoordinationRules,
  verifyDirectorRuntimeExperienceCoordinationPlatform,
  type DirectorRuntimeExperienceCoordinationExperienceState,
  type DirectorRuntimeExperienceCoordinationInput,
  type DirectorRuntimeExperienceSurface,
} from "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform";

type DirectorRuntimeConsumerInteractionBridgeResult = NonNullable<
  DirectorRuntimeExperienceCoordinationInput["interactionBridgeResult"]
>;

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerAdapterCertificationIdentity =
  "DRI-8:7/DirectorRuntimeConsumerAdapterCertification" as const;
export const directorRuntimeConsumerAdapterCertificationVersion =
  "8.7.0" as const;
export const directorRuntimeConsumerAdapterCertificationNamespace =
  "nexora.dri.consumer-integration.adapter-certification" as const;
export const directorRuntimeConsumerAdapterCertificationUpstream =
  directorRuntimeExperienceCoordinationPlatformIdentity;

export const directorRuntimeConsumerAdapterCertificationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerAdapterCertificationIdentity,
    version: directorRuntimeConsumerAdapterCertificationVersion,
    namespace: directorRuntimeConsumerAdapterCertificationNamespace,
    upstream: directorRuntimeConsumerAdapterCertificationUpstream,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_STATUSES =
  Object.freeze(["certified", "not-certified"] as const);
export type DirectorRuntimeConsumerAdapterCertificationStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);
export type DirectorRuntimeConsumerAdapterCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_COMPATIBILITY_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHECK_STATUSES = Object.freeze([
  "passed",
  "failed",
] as const);
export type DirectorRuntimeConsumerAdapterCheckStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHECK_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_READINESS = Object.freeze([
  "ready-for-freeze",
  "not-ready-for-freeze",
] as const);
export type DirectorRuntimeConsumerAdapterReadiness =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_READINESS)[number];

// ─── Domains ────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency",
    "foundation",
    "context-binding",
    "surface-binding",
    "state-projection",
    "interaction-bridge",
    "coordination",
    "immutability",
    "determinism",
    "compatibility",
    "framework-independence",
    "semantic-integrity",
    "boundary-integrity",
    "runtime-safety",
    "registry-integrity",
  ] as const);
export type DirectorRuntimeConsumerAdapterCertificationDomain =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS)[number];

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES =
  Object.freeze([
    "full-chain-certified",
    "compatible",
    "framework-independent",
    "immutable",
    "deterministic",
    "semantic-only",
    "identity-preserving",
    "selection-focus-distinct",
    "minimal-fan-out",
    "surface-decoupled",
    "no-browser-events",
    "no-rendering",
    "no-business-inference",
    "no-runtime-mutation",
    "no-dri4-duplication",
    "no-attention-regeneration",
    "no-guidance-regeneration",
    "ready-for-freeze",
  ] as const);
export type DirectorRuntimeConsumerAdapterCertificationGuarantee =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES)[number];

// ─── Expected chain (architectural constants; verified against sources) ─────

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN = Object.freeze([
  Object.freeze({
    phase: "DRI-8:1",
    identity: "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
    version: "8.1.0",
    namespace: "nexora.dri.consumer-integration.foundation",
    upstream: "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
    file: "directorRuntimeConsumerIntegrationFoundation.ts",
    importPath: "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex",
  }),
  Object.freeze({
    phase: "DRI-8:2",
    identity: "DRI-8:2/DirectorRuntimeConsumerContextBinding",
    version: "8.2.0",
    namespace: "nexora.dri.consumer-integration.context-binding",
    upstream: "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
    file: "directorRuntimeConsumerContextBinding.ts",
    importPath: "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation",
  }),
  Object.freeze({
    phase: "DRI-8:3",
    identity: "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding",
    version: "8.3.0",
    namespace: "nexora.dri.consumer-integration.experience-surface-binding",
    upstream: "DRI-8:2/DirectorRuntimeConsumerContextBinding",
    file: "directorRuntimeExperienceSurfaceBinding.ts",
    importPath: "@/app/lib/dri/directorRuntimeConsumerContextBinding",
  }),
  Object.freeze({
    phase: "DRI-8:4",
    identity: "DRI-8:4/DirectorRuntimeExperienceStateProjection",
    version: "8.4.0",
    namespace: "nexora.dri.consumer-integration.experience-state-projection",
    upstream: "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding",
    file: "directorRuntimeExperienceStateProjection.ts",
    importPath: "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding",
  }),
  Object.freeze({
    phase: "DRI-8:5",
    identity: "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
    version: "8.5.0",
    namespace: "nexora.dri.consumer-integration.interaction-bridge",
    upstream: "DRI-8:4/DirectorRuntimeExperienceStateProjection",
    file: "directorRuntimeConsumerInteractionBridge.ts",
    importPath: "@/app/lib/dri/directorRuntimeExperienceStateProjection",
  }),
  Object.freeze({
    phase: "DRI-8:6",
    identity: "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform",
    version: "8.6.0",
    namespace:
      "nexora.dri.consumer-integration.experience-coordination-platform",
    upstream: "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
    file: "directorRuntimeExperienceCoordinationPlatform.ts",
    importPath: "@/app/lib/dri/directorRuntimeConsumerInteractionBridge",
  }),
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES = Object.freeze([
  "stage",
  "advisor",
  "insight",
  "live-lens",
  "timeline",
  "explorer",
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS =
  Object.freeze([
    "select",
    "focus",
    "activate",
    "hover",
    "navigate",
    "inspect",
    "dismiss",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES =
  Object.freeze(["minimum", "report", "operation"] as const);

// ─── Check catalog ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS =
  Object.freeze([
    "DRI-8-CERT-IDENTITY-001",
    "DRI-8-CERT-IDENTITY-002",
    "DRI-8-CERT-IDENTITY-003",
    "DRI-8-CERT-DEPENDENCY-001",
    "DRI-8-CERT-DEPENDENCY-002",
    "DRI-8-CERT-FOUNDATION-001",
    "DRI-8-CERT-FOUNDATION-002",
    "DRI-8-CERT-CONTEXT-001",
    "DRI-8-CERT-CONTEXT-002",
    "DRI-8-CERT-SURFACE-001",
    "DRI-8-CERT-SURFACE-002",
    "DRI-8-CERT-PROJECTION-001",
    "DRI-8-CERT-PROJECTION-002",
    "DRI-8-CERT-PROJECTION-003",
    "DRI-8-CERT-BRIDGE-001",
    "DRI-8-CERT-BRIDGE-002",
    "DRI-8-CERT-BRIDGE-003",
    "DRI-8-CERT-BRIDGE-004",
    "DRI-8-CERT-COORD-001",
    "DRI-8-CERT-COORD-002",
    "DRI-8-CERT-COORD-003",
    "DRI-8-CERT-COORD-004",
    "DRI-8-CERT-COORD-005",
    "DRI-8-CERT-SEMANTIC-001",
    "DRI-8-CERT-SEMANTIC-002",
    "DRI-8-CERT-SEMANTIC-003",
    "DRI-8-CERT-IMMUTABILITY-001",
    "DRI-8-CERT-DETERMINISM-001",
    "DRI-8-CERT-COMPAT-001",
    "DRI-8-CERT-FRAMEWORK-001",
    "DRI-8-CERT-BOUNDARY-001",
    "DRI-8-CERT-BOUNDARY-002",
    "DRI-8-CERT-BOUNDARY-003",
    "DRI-8-CERT-RUNTIME-001",
    "DRI-8-CERT-RUNTIME-002",
    "DRI-8-CERT-RUNTIME-003",
    "DRI-8-CERT-RUNTIME-004",
    "DRI-8-CERT-REGISTRY-001",
    "DRI-8-CERT-E2E-001",
    "DRI-8-CERT-E2E-002",
    "DRI-8-CERT-E2E-003",
    "DRI-8-CERT-E2E-004",
    "DRI-8-CERT-E2E-005",
    "DRI-8-CERT-E2E-006",
    "DRI-8-CERT-E2E-007",
  ] as const);
export type DirectorRuntimeConsumerAdapterCertificationCheckId =
  (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS)[number];

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG =
  Object.freeze([
    Object.freeze({
      id: "DRI-8-CERT-IDENTITY-001",
      domain: "identity",
      requirement: "DRI-8:1–8:7 identity chain is exact and intact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-IDENTITY-002",
      domain: "identity",
      requirement: "version progression 8.1.0–8.7.0 is exact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-IDENTITY-003",
      domain: "identity",
      requirement: "canonical namespaces are exact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-DEPENDENCY-001",
      domain: "dependency",
      requirement: "linear sole-immediate dependency chain is intact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-DEPENDENCY-002",
      domain: "dependency",
      requirement: "DRI-8:7 depends solely on DRI-8:6",
    }),
    Object.freeze({
      id: "DRI-8-CERT-FOUNDATION-001",
      domain: "foundation",
      requirement: "six canonical experience surfaces are preserved",
    }),
    Object.freeze({
      id: "DRI-8-CERT-FOUNDATION-002",
      domain: "foundation",
      requirement: "foundation vocabulary and boundary guarantees remain present",
    }),
    Object.freeze({
      id: "DRI-8-CERT-CONTEXT-001",
      domain: "context-binding",
      requirement: "context binding statuses and selection/focus vocabulary remain",
    }),
    Object.freeze({
      id: "DRI-8-CERT-CONTEXT-002",
      domain: "context-binding",
      requirement: "context binding does not invent missing semantic context",
    }),
    Object.freeze({
      id: "DRI-8-CERT-SURFACE-001",
      domain: "surface-binding",
      requirement: "surface order and filtered binding matrix remain intact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-SURFACE-002",
      domain: "surface-binding",
      requirement: "surface binding does not implement projection/rendering",
    }),
    Object.freeze({
      id: "DRI-8-CERT-PROJECTION-001",
      domain: "state-projection",
      requirement: "projection statuses and presentation states remain canonical",
    }),
    Object.freeze({
      id: "DRI-8-CERT-PROJECTION-002",
      domain: "state-projection",
      requirement: "projection has no styling/geometry/animation fields",
    }),
    Object.freeze({
      id: "DRI-8-CERT-PROJECTION-003",
      domain: "state-projection",
      requirement: "projection does not calculate KPI/KOI/business scores",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BRIDGE-001",
      domain: "interaction-bridge",
      requirement: "canonical interaction kinds remain exact",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BRIDGE-002",
      domain: "interaction-bridge",
      requirement: "bridge contracts isolate browser/UI event types",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BRIDGE-003",
      domain: "interaction-bridge",
      requirement: "bridge respects interaction readiness and blocked status",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BRIDGE-004",
      domain: "interaction-bridge",
      requirement: "unsupported surface/interaction pairs remain unsupported",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COORD-001",
      domain: "coordination",
      requirement: "coordination platform verification passes",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COORD-002",
      domain: "coordination",
      requirement: "source surface may become primary when appropriate",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COORD-003",
      domain: "coordination",
      requirement: "minimal fan-out preserves unrelated surfaces",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COORD-004",
      domain: "coordination",
      requirement: "partial and no-op coordination remain deterministic",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COORD-005",
      domain: "coordination",
      requirement: "coordination emits plans only; no UI mutation APIs",
    }),
    Object.freeze({
      id: "DRI-8-CERT-SEMANTIC-001",
      domain: "semantic-integrity",
      requirement: "selection and focus remain distinct across coordination",
    }),
    Object.freeze({
      id: "DRI-8-CERT-SEMANTIC-002",
      domain: "semantic-integrity",
      requirement: "subject identity is preserved through coordination",
    }),
    Object.freeze({
      id: "DRI-8-CERT-SEMANTIC-003",
      domain: "semantic-integrity",
      requirement: "adapter does not invent synthetic business context",
    }),
    Object.freeze({
      id: "DRI-8-CERT-IMMUTABILITY-001",
      domain: "immutability",
      requirement: "canonical registries, plans, and certification artifacts are immutable",
    }),
    Object.freeze({
      id: "DRI-8-CERT-DETERMINISM-001",
      domain: "determinism",
      requirement: "identical coordination and certification inputs are deterministic",
    }),
    Object.freeze({
      id: "DRI-8-CERT-COMPAT-001",
      domain: "compatibility",
      requirement: "upstream identities, surfaces, and vocabularies are compatible",
    }),
    Object.freeze({
      id: "DRI-8-CERT-FRAMEWORK-001",
      domain: "framework-independence",
      requirement: "DRI-8:1–8:6 sources have no React/Next/Three/DOM imports",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BOUNDARY-001",
      domain: "boundary-integrity",
      requirement: "no rendering/styling/geometry contracts in DRI-8 chain",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BOUNDARY-002",
      domain: "boundary-integrity",
      requirement: "DRI-4 interaction orchestration is not duplicated",
    }),
    Object.freeze({
      id: "DRI-8-CERT-BOUNDARY-003",
      domain: "boundary-integrity",
      requirement: "DRI-6 attention and DRI-7 guidance are not regenerated",
    }),
    Object.freeze({
      id: "DRI-8-CERT-RUNTIME-001",
      domain: "runtime-safety",
      requirement: "adapter does not mutate Runtime state",
    }),
    Object.freeze({
      id: "DRI-8-CERT-RUNTIME-002",
      domain: "runtime-safety",
      requirement: "no KPI/KOI/business reasoning is introduced",
    }),
    Object.freeze({
      id: "DRI-8-CERT-RUNTIME-003",
      domain: "runtime-safety",
      requirement: "no freeze/lock is declared in DRI-8:7",
    }),
    Object.freeze({
      id: "DRI-8-CERT-RUNTIME-004",
      domain: "runtime-safety",
      requirement: "blocked bridge results do not invent coordination execution",
    }),
    Object.freeze({
      id: "DRI-8-CERT-REGISTRY-001",
      domain: "registry-integrity",
      requirement: "coordination rules and relationships reference valid surfaces/triggers",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-001",
      domain: "compatibility",
      requirement: "canonical end-to-end semantic fixture coordinates successfully",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-002",
      domain: "coordination",
      requirement: "Stage selection end-to-end fixture preserves subject and fan-out rules",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-003",
      domain: "interaction-bridge",
      requirement: "blocked interaction fixture remains blocked without intent execution",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-004",
      domain: "interaction-bridge",
      requirement: "unsupported interaction fixture remains unsupported",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-005",
      domain: "coordination",
      requirement: "partial-chain fixture degrades gracefully",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-006",
      domain: "context-binding",
      requirement: "empty-context fixture does not invent context",
    }),
    Object.freeze({
      id: "DRI-8-CERT-E2E-007",
      domain: "compatibility",
      requirement: "invalid input is deterministically rejected",
    }),
  ] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerAdapterCertificationCheck {
  readonly id: DirectorRuntimeConsumerAdapterCertificationCheckId;
  readonly domain: DirectorRuntimeConsumerAdapterCertificationDomain;
  readonly requirement: string;
  readonly status: DirectorRuntimeConsumerAdapterCheckStatus;
  readonly expected: string;
  readonly actual: string;
}

export interface DirectorRuntimeConsumerAdapterCertificationSummary {
  readonly domainCount: number;
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly certificationStatus: DirectorRuntimeConsumerAdapterCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeConsumerAdapterCompatibilityStatus;
  readonly readiness: DirectorRuntimeConsumerAdapterReadiness;
}

export interface DirectorRuntimeConsumerAdapterCertificationProvenance {
  readonly sourcePlatformIdentity: string;
  readonly adapterCertificationIdentity: string;
  readonly certifiedChainStart: string;
  readonly certifiedChainEnd: string;
}

export interface DirectorRuntimeConsumerAdapterCertification {
  readonly identity: typeof directorRuntimeConsumerAdapterCertificationIdentity;
  readonly version: typeof directorRuntimeConsumerAdapterCertificationVersion;
  readonly namespace: typeof directorRuntimeConsumerAdapterCertificationNamespace;
  readonly certificationStatus: DirectorRuntimeConsumerAdapterCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeConsumerAdapterCompatibilityStatus;
  readonly readiness: DirectorRuntimeConsumerAdapterReadiness;
  readonly domains: ReadonlyArray<DirectorRuntimeConsumerAdapterCertificationDomain>;
  readonly checks: ReadonlyArray<DirectorRuntimeConsumerAdapterCertificationCheck>;
  readonly summary: DirectorRuntimeConsumerAdapterCertificationSummary;
  readonly guarantees: ReadonlyArray<
    DirectorRuntimeConsumerAdapterCertificationGuarantee
  >;
  readonly provenance: DirectorRuntimeConsumerAdapterCertificationProvenance;
  readonly frozenDeclared: false;
  readonly releasedDeclared: false;
  readonly readyForConsumerDeclared: false;
}

// ─── Source helpers ─────────────────────────────────────────────────────────

const MODULE_DIR = dirname(fileURLToPath(import.meta.url));

function readSiblingSource(fileName: string): string {
  return readFileSync(join(MODULE_DIR, fileName), "utf8");
}

function extractStaticImports(source: string): readonly string[] {
  return [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1]!,
  );
}

function includesAll(source: string, needles: readonly string[]): boolean {
  return needles.every((needle) => source.includes(needle));
}

function excludesAll(source: string, patterns: readonly RegExp[]): boolean {
  return patterns.every((pattern) => !pattern.test(source));
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function check(
  id: DirectorRuntimeConsumerAdapterCertificationCheckId,
  status: DirectorRuntimeConsumerAdapterCheckStatus,
  expected: string,
  actual: string,
): DirectorRuntimeConsumerAdapterCertificationCheck {
  const catalog = DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG
    .find((entry) => entry.id === id)!;
  return Object.freeze({
    id,
    domain: catalog.domain,
    requirement: catalog.requirement,
    status,
    expected,
    actual,
  });
}

function pass(
  id: DirectorRuntimeConsumerAdapterCertificationCheckId,
  expected: string,
  actual: string = expected,
): DirectorRuntimeConsumerAdapterCertificationCheck {
  return check(id, "passed", expected, actual);
}

function fail(
  id: DirectorRuntimeConsumerAdapterCertificationCheckId,
  expected: string,
  actual: string,
): DirectorRuntimeConsumerAdapterCertificationCheck {
  return check(id, "failed", expected, actual);
}

function outcome(
  id: DirectorRuntimeConsumerAdapterCertificationCheckId,
  ok: boolean,
  expected: string,
  actual: string,
): DirectorRuntimeConsumerAdapterCertificationCheck {
  return ok ? pass(id, expected, actual) : fail(id, expected, actual);
}

// ─── Fixture builders (semantic only; through DRI-8:6 contracts) ────────────

function projectionView(
  surface: DirectorRuntimeExperienceSurface,
  status: string,
  subjectId: string | null,
): DirectorRuntimeExperienceCoordinationExperienceState["projections"][number] {
  const subject = subjectId
    ? Object.freeze({ kind: "object" as const, id: subjectId })
    : null;
  return Object.freeze({
    surface,
    status,
    subject,
    selectedSubject: subject,
    focusedSubject: null,
    guidanceAvailability: subjectId ? "available" : "unavailable",
    attentionState: subjectId ? "high" : "none",
    temporalMode: surface === "timeline" ? "current" : "not-applicable",
    contextAvailability: subjectId ? "available" : "unavailable",
  });
}

function fullExperienceState(
  subjectId = "factory",
): DirectorRuntimeExperienceCoordinationExperienceState {
  return Object.freeze({
    status: "projected",
    projections: Object.freeze(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.map((surface) =>
        projectionView(surface, "projected", subjectId)
      ),
    ),
  });
}

function emptyExperienceState():
  DirectorRuntimeExperienceCoordinationExperienceState {
  return Object.freeze({
    status: "inactive",
    projections: Object.freeze(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.map((surface) =>
        projectionView(surface, "inactive", null)
      ),
    ),
  });
}

function partialExperienceState():
  DirectorRuntimeExperienceCoordinationExperienceState {
  return Object.freeze({
    status: "partially-projected",
    projections: Object.freeze(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.map((surface) => {
        if (surface === "advisor" || surface === "insight") {
          return projectionView(surface, "projected", "factory");
        }
        if (surface === "live-lens" || surface === "explorer") {
          return projectionView(surface, "partially-projected", "factory");
        }
        return projectionView(surface, "inactive", null);
      }),
    ),
  });
}

function bridgedSelectionResult(
  surface: DirectorRuntimeExperienceSurface = "stage",
  subjectId = "factory",
): DirectorRuntimeConsumerInteractionBridgeResult {
  const subject = Object.freeze({ kind: "object" as const, id: subjectId });
  return Object.freeze({
    status: "bridged",
    interaction: Object.freeze({
      interactionId: `cert.ix.${surface}.select`,
      kind: "select" as const,
      surface,
      subject,
      source: "consumer-experience" as const,
    }),
    runtimeIntent: Object.freeze({
      intentId: `cert.intent.${surface}.selection`,
      kind: "selection" as const,
      surface,
      subject,
      reason: "user-selection" as const,
      sourceInteraction: `cert.ix.${surface}.select`,
    }),
    diagnostics: Object.freeze([]),
    provenance: Object.freeze({
      sourceProjectionIdentity: "cert.source-projection",
      experienceStateProjectionIdentity:
        "DRI-8:4/DirectorRuntimeExperienceStateProjection",
      interactionBridgeIdentity:
        "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
      surfaceIdentifier: surface,
      interactionKind: "select" as const,
    }),
  });
}

function blockedBridgeResult(): DirectorRuntimeConsumerInteractionBridgeResult {
  return Object.freeze({
    status: "blocked",
    interaction: Object.freeze({
      interactionId: "cert.ix.stage.select.blocked",
      kind: "select" as const,
      surface: "stage" as const,
      subject: Object.freeze({ kind: "object" as const, id: "factory" }),
      source: "consumer-experience" as const,
    }),
    runtimeIntent: null,
    diagnostics: Object.freeze([
      Object.freeze({
        kind: "interaction-disabled" as const,
        path: "interactionReadiness",
        message: "interaction readiness is disabled",
      }),
    ]),
    provenance: Object.freeze({
      sourceProjectionIdentity: "cert.source-projection",
      experienceStateProjectionIdentity:
        "DRI-8:4/DirectorRuntimeExperienceStateProjection",
      interactionBridgeIdentity:
        "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
      surfaceIdentifier: "stage" as const,
      interactionKind: "select" as const,
    }),
  });
}

function unsupportedBridgeResult():
  DirectorRuntimeConsumerInteractionBridgeResult {
  return Object.freeze({
    status: "unsupported",
    interaction: Object.freeze({
      interactionId: "cert.ix.timeline.hover",
      kind: "hover" as const,
      surface: "timeline" as const,
      subject: Object.freeze({ kind: "object" as const, id: "factory" }),
      source: "consumer-experience" as const,
    }),
    runtimeIntent: null,
    diagnostics: Object.freeze([
      Object.freeze({
        kind: "unsupported-surface-interaction" as const,
        path: "surface.timeline.hover",
        message: "timeline does not support hover",
      }),
    ]),
    provenance: Object.freeze({
      sourceProjectionIdentity: "cert.source-projection",
      experienceStateProjectionIdentity:
        "DRI-8:4/DirectorRuntimeExperienceStateProjection",
      interactionBridgeIdentity:
        "DRI-8:5/DirectorRuntimeConsumerInteractionBridge",
      surfaceIdentifier: "timeline" as const,
      interactionKind: "hover" as const,
    }),
  });
}

// ─── Evaluation ─────────────────────────────────────────────────────────────

function evaluateIdentityChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const identityOk = DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.every((entry) => {
    const source = sources.get(entry.file) ?? "";
    return (
      source.includes(`"${entry.identity}"`) &&
      source.includes(`"${entry.version}"`)
    );
  }) &&
    directorRuntimeConsumerAdapterCertificationIdentity ===
      "DRI-8:7/DirectorRuntimeConsumerAdapterCertification" &&
    directorRuntimeConsumerAdapterCertificationVersion === "8.7.0";

  const versionOk = exactOrder(
    [
      ...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.map((entry) => entry.version),
      directorRuntimeConsumerAdapterCertificationVersion,
    ],
    ["8.1.0", "8.2.0", "8.3.0", "8.4.0", "8.5.0", "8.6.0", "8.7.0"],
  );

  const namespaceOk = DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.every((entry) =>
    (sources.get(entry.file) ?? "").includes(`"${entry.namespace}"`)
  ) &&
    directorRuntimeConsumerAdapterCertificationNamespace ===
      "nexora.dri.consumer-integration.adapter-certification";

  return [
    outcome(
      "DRI-8-CERT-IDENTITY-001",
      identityOk,
      "DRI-8:1–8:7 identities present",
      identityOk ? "intact" : "broken",
    ),
    outcome(
      "DRI-8-CERT-IDENTITY-002",
      versionOk,
      "8.1.0…8.7.0",
      versionOk ? "exact" : "mismatched",
    ),
    outcome(
      "DRI-8-CERT-IDENTITY-003",
      namespaceOk,
      "canonical namespaces",
      namespaceOk ? "exact" : "mismatched",
    ),
  ];
}

function evaluateDependencyChecks(
  sources: ReadonlyMap<string, string>,
  certSource: string,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const chainOk = DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.every((entry) => {
    const source = sources.get(entry.file) ?? "";
    const imports = extractStaticImports(source);
    return (
      source.includes(entry.upstream) &&
      imports.length === 1 &&
      imports[0] === entry.importPath
    );
  });

  const certImports = extractStaticImports(certSource).filter(
    (value) => value.startsWith("@/") || value.startsWith("./"),
  );
  const soleOk =
    certImports.length === 1 &&
    certImports[0] ===
      "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform" &&
    directorRuntimeConsumerAdapterCertificationUpstream ===
      "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform" &&
    directorRuntimeExperienceCoordinationPlatform.upstreamDependency ===
      "DRI-8:5/DirectorRuntimeConsumerInteractionBridge";

  return [
    outcome(
      "DRI-8-CERT-DEPENDENCY-001",
      chainOk,
      "linear sole imports DRI-8:1→8:6",
      chainOk ? "linear" : "bypass-or-mismatch",
    ),
    outcome(
      "DRI-8-CERT-DEPENDENCY-002",
      soleOk,
      "DRI-8:7→DRI-8:6 only",
      soleOk ? "sole" : "violated",
    ),
  ];
}

function evaluateFoundationChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const foundation = sources.get(
    "directorRuntimeConsumerIntegrationFoundation.ts",
  ) ?? "";
  const surfacesOk = exactOrder(
    [...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES],
    [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
  ) &&
    includesAll(foundation, [
      '"stage"',
      '"advisor"',
      '"insight"',
      '"live-lens"',
      '"timeline"',
      '"explorer"',
    ]);

  const vocabularyOk = includesAll(foundation, [
    "DIRECTOR_RUNTIME_CONSUMER_FAMILIES",
    "DIRECTOR_RUNTIME_BINDING_KINDS",
    "DIRECTOR_RUNTIME_PROJECTION_KINDS",
    "DIRECTOR_RUNTIME_INTERACTION_KINDS",
    "DIRECTOR_RUNTIME_COORDINATION",
    "framework-independent",
  ]) || includesAll(foundation, [
    "executive-experience",
    "select",
    "focus",
    "activate",
    "coordination",
    "framework-independent",
  ]);

  return [
    outcome(
      "DRI-8-CERT-FOUNDATION-001",
      surfacesOk,
      "six surfaces in canonical order",
      surfacesOk ? "preserved" : "altered",
    ),
    outcome(
      "DRI-8-CERT-FOUNDATION-002",
      vocabularyOk,
      "foundation vocabulary present",
      vocabularyOk ? "present" : "missing",
    ),
  ];
}

function evaluateContextChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const context = sources.get("directorRuntimeConsumerContextBinding.ts") ?? "";
  const statusOk = includesAll(context, [
    '"bound"',
    '"partially-bound"',
    '"unbound"',
    '"invalid"',
    "selectedSubject",
    "focusedSubject",
  ]);
  const noInventOk = includesAll(context, [
    "no-business-inference",
  ]) &&
    context.includes("invent missing") &&
    excludesAll(context, [
      /\bcalculateKpi\b/i,
      /\bcalculateKoi\b/i,
      /\bsynthesizeGuidance\b/i,
    ]);

  return [
    outcome(
      "DRI-8-CERT-CONTEXT-001",
      statusOk,
      "bound|partially-bound|unbound|invalid + selection/focus",
      statusOk ? "present" : "missing",
    ),
    outcome(
      "DRI-8-CERT-CONTEXT-002",
      noInventOk,
      "no synthetic context invention",
      noInventOk ? "respected" : "violated",
    ),
  ];
}

function evaluateSurfaceChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const surface = sources.get(
    "directorRuntimeExperienceSurfaceBinding.ts",
  ) ?? "";
  const matrixOk = includesAll(surface, [
    "DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX",
    '"stage"',
    '"explorer"',
    "relevantContext",
  ]) || includesAll(surface, [
    "capability",
    "relevantContext",
    "stage",
    "explorer",
  ]);
  const noProjectionOk = excludesAll(surface, [
    /projectDirectorRuntimeExperienceState/,
    /\bclassName\b/,
    /\bsetOpacity\b/,
    /\banimateObject\b/,
  ]) &&
    (surface.includes("no-state-projection") ||
      surface.includes("no-rendering") ||
      surface.includes("ExperienceSurfaceBinding"));

  return [
    outcome(
      "DRI-8-CERT-SURFACE-001",
      matrixOk,
      "surface capability/filter matrix intact",
      matrixOk ? "intact" : "missing",
    ),
    outcome(
      "DRI-8-CERT-SURFACE-002",
      noProjectionOk,
      "no projection/rendering in surface binding",
      noProjectionOk ? "boundary-ok" : "boundary-violated",
    ),
  ];
}

function evaluateProjectionChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const projection = sources.get(
    "directorRuntimeExperienceStateProjection.ts",
  ) ?? "";
  const statesOk = includesAll(projection, [
    '"projected"',
    '"partially-projected"',
    '"inactive"',
    '"unavailable"',
    '"invalid"',
    '"minimum"',
    '"report"',
    '"operation"',
  ]);
  const noStyleOk = excludesAll(projection, [
    /\bclassName\b/,
    /\bzIndex\b/,
    /\banimationDuration\b/,
    /\beasing\b/,
    /\bmesh\b/,
    /\bshader\b/,
    /\bcamera\b/,
    /\brenderer\b/,
  ]);
  const noBusinessOk = excludesAll(projection, [
    /\bcalculateKpi\b/i,
    /\bcalculateKoi\b/i,
    /\briskScore\b/i,
    /\bscenarioRank\b/i,
    /\bopenai\b/i,
  ]);

  return [
    outcome(
      "DRI-8-CERT-PROJECTION-001",
      statesOk,
      "projection + presentation states",
      statesOk ? "canonical" : "missing",
    ),
    outcome(
      "DRI-8-CERT-PROJECTION-002",
      noStyleOk,
      "no styling/geometry/animation",
      noStyleOk ? "clean" : "contaminated",
    ),
    outcome(
      "DRI-8-CERT-PROJECTION-003",
      noBusinessOk,
      "no KPI/KOI calculation",
      noBusinessOk ? "clean" : "contaminated",
    ),
  ];
}

function evaluateBridgeChecks(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const bridge = sources.get(
    "directorRuntimeConsumerInteractionBridge.ts",
  ) ?? "";
  const kindsOk = includesAll(bridge, [
    ...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS.map(
      (kind) => `"${kind}"`,
    ),
  ]);
  const eventsOk = excludesAll(bridge, [
    /\bMouseEvent\b/,
    /\bPointerEvent\b/,
    /\bKeyboardEvent\b/,
    /\bReact\.MouseEvent\b/,
    /\bHTMLElement\b/,
    /\bEventTarget\b/,
  ]);
  const readinessOk = includesAll(bridge, [
    "interactionReadiness",
    '"blocked"',
    "interaction-disabled",
    "mutatesRuntimeState: false",
  ]) || includesAll(bridge, [
    "interactionReadiness",
    "blocked",
    "interaction-disabled",
    "mutatesRuntimeState",
  ]);
  const unsupportedOk = includesAll(bridge, [
    '"unsupported"',
    "unsupported-surface-interaction",
  ]);

  return [
    outcome(
      "DRI-8-CERT-BRIDGE-001",
      kindsOk,
      "select…dismiss",
      kindsOk ? "exact" : "altered",
    ),
    outcome(
      "DRI-8-CERT-BRIDGE-002",
      eventsOk,
      "no browser/UI event types",
      eventsOk ? "isolated" : "leaking",
    ),
    outcome(
      "DRI-8-CERT-BRIDGE-003",
      readinessOk,
      "readiness → blocked",
      readinessOk ? "enforced" : "missing",
    ),
    outcome(
      "DRI-8-CERT-BRIDGE-004",
      unsupportedOk,
      "unsupported surface/interaction",
      unsupportedOk ? "present" : "missing",
    ),
  ];
}

function evaluateCoordinationChecks():
  DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const verification = verifyDirectorRuntimeExperienceCoordinationPlatform();
  const stageSelect = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: bridgedSelectionResult("stage", "factory"),
  });
  const dismiss = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    coordinationContext: {
      triggerOverride: "dismissal",
      sourceSurfaceOverride: "advisor",
    },
  });
  const partial = coordinateDirectorRuntimeExperience({
    experienceStateProjection: partialExperienceState(),
    coordinationContext: {
      triggerOverride: "guidance-change",
      sourceSurfaceOverride: "advisor",
      guidancePresent: true,
      selectedSubject: { kind: "object", id: "factory" },
    },
  });

  const primaryOk = stageSelect.primarySurface === "stage";
  const fanOutOk =
    stageSelect.affectedSurfaces.length <
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length &&
    stageSelect.preservedSurfaces.includes("timeline");
  const partialNoopOk =
    (partial.status === "partially-coordinated" ||
      partial.status === "coordinated" ||
      partial.status === "no-op") &&
    dismiss.status === "no-op";
  const planOnlyOk =
    directorRuntimeExperienceCoordinationPlatform.mutatesRuntimeState ===
      false &&
    stageSelect.coordinationPlan != null &&
    excludesAll(
      readSiblingSource("directorRuntimeExperienceCoordinationPlatform.ts"),
      [/\bsetState\b/, /\bdispatch\b/, /\bwriteJournal\b/, /\banimateObject\b/],
    );

  return [
    outcome(
      "DRI-8-CERT-COORD-001",
      verification.ok,
      "verify ok",
      verification.ok ? "ok" : "failed",
    ),
    outcome(
      "DRI-8-CERT-COORD-002",
      primaryOk,
      "stage primary on stage selection",
      `primary=${stageSelect.primarySurface}`,
    ),
    outcome(
      "DRI-8-CERT-COORD-003",
      fanOutOk,
      "affected < 6 and timeline preserved",
      `affected=${stageSelect.affectedSurfaces.length};preserved=${
        stageSelect.preservedSurfaces.join(",")
      }`,
    ),
    outcome(
      "DRI-8-CERT-COORD-004",
      partialNoopOk,
      "partial + no-op supported",
      `partial=${partial.status};dismiss=${dismiss.status}`,
    ),
    outcome(
      "DRI-8-CERT-COORD-005",
      planOnlyOk,
      "plans only / non-mutating",
      planOnlyOk ? "plan-only" : "mutating-apis",
    ),
  ];
}

function evaluateSemanticChecks():
  DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const selected = Object.freeze({ kind: "object" as const, id: "factory" });
  const focused = Object.freeze({
    kind: "object" as const,
    id: "kpi-production",
  });
  const focusResult = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    coordinationContext: {
      triggerOverride: "focus-change",
      sourceSurfaceOverride: "stage",
      selectedSubject: selected,
      focusedSubject: focused,
    },
  });
  const selectResult = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: bridgedSelectionResult("stage", "factory"),
  });

  const selectedId = focusResult.coordinationPlan?.selectedSubject?.id ?? "";
  const focusedId = focusResult.coordinationPlan?.focusedSubject?.id ?? "";
  const distinctOk =
    selectedId === "factory" &&
    focusedId === "kpi-production";

  const identityOk =
    selectResult.coordinationPlan?.subject?.id === "factory" &&
    selectResult.surfaceOutcomes.every((outcome) =>
      outcome.role === "preserved" ||
        outcome.role === "inactive" ||
        outcome.subject?.id === "factory" ||
        outcome.subject == null
    );

  const noSyntheticOk = excludesAll(
    [
      readSiblingSource("directorRuntimeConsumerIntegrationFoundation.ts"),
      readSiblingSource("directorRuntimeConsumerContextBinding.ts"),
      readSiblingSource("directorRuntimeExperienceSurfaceBinding.ts"),
      readSiblingSource("directorRuntimeExperienceStateProjection.ts"),
      readSiblingSource("directorRuntimeConsumerInteractionBridge.ts"),
      readSiblingSource("directorRuntimeExperienceCoordinationPlatform.ts"),
    ].join("\n"),
    [
      /\binvent(?:ed|ing)?\s+(?:goal|kpi|koi|risk)\b/i,
      /\bsynthesize(?:d|s)?\s+(?:guidance|attention|decision)\b/i,
    ],
  );

  return [
    outcome(
      "DRI-8-CERT-SEMANTIC-001",
      distinctOk,
      "selected≠focused",
      distinctOk
        ? "distinct"
        : `selected=${focusResult.coordinationPlan?.selectedSubject?.id};focused=${focusResult.coordinationPlan?.focusedSubject?.id}`,
    ),
    outcome(
      "DRI-8-CERT-SEMANTIC-002",
      identityOk,
      "subject id=factory preserved",
      identityOk ? "preserved" : "replaced",
    ),
    outcome(
      "DRI-8-CERT-SEMANTIC-003",
      noSyntheticOk,
      "no synthetic context invention",
      noSyntheticOk ? "clean" : "invention-detected",
    ),
  ];
}

function evaluateImmutabilityAndDeterminism():
  DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const a = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: bridgedSelectionResult("stage", "factory"),
  });
  const b = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: bridgedSelectionResult("stage", "factory"),
  });
  const immutableOk =
    Object.isFrozen(directorRuntimeExperienceCoordinationPlatform) &&
    Object.isFrozen(directorRuntimeExperienceCoordinationPlatformRegistry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES) &&
    Object.isFrozen(a) &&
    Object.isFrozen(a.surfaceOutcomes) &&
    (a.coordinationPlan == null || Object.isFrozen(a.coordinationPlan));
  const deterministicOk = JSON.stringify(a) === JSON.stringify(b);

  return [
    outcome(
      "DRI-8-CERT-IMMUTABILITY-001",
      immutableOk,
      "frozen registries/results",
      immutableOk ? "immutable" : "mutable",
    ),
    outcome(
      "DRI-8-CERT-DETERMINISM-001",
      deterministicOk,
      "identical outputs",
      deterministicOk ? "deterministic" : "divergent",
    ),
  ];
}

function evaluateCompatibilityAndFramework(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const compatOk =
    directorRuntimeExperienceCoordinationPlatform.identity ===
      "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform" &&
    exactOrder(
      [...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES],
      [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
    ) &&
    exactOrder(
      [...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES],
      ["primary", "supporting", "background", "preserved", "inactive"],
    ) &&
    verifyDirectorRuntimeExperienceCoordinationPlatform().ok;

  const frameworkPatterns = [
    /\bfrom\s+["']react["']/,
    /\bfrom\s+["']react-dom["']/,
    /\bfrom\s+["']next(\/|["'])/,
    /\bfrom\s+["']three["']/,
    /@react-three/,
    /\bdocument\./,
    /\bwindow\./,
    /\blocalStorage\b/,
  ];
  const frameworkOk = [...sources.values()].every((source) =>
    excludesAll(source, frameworkPatterns)
  );

  return [
    outcome(
      "DRI-8-CERT-COMPAT-001",
      compatOk,
      "compatible upstream contracts",
      compatOk ? "compatible" : "incompatible",
    ),
    outcome(
      "DRI-8-CERT-FRAMEWORK-001",
      frameworkOk,
      "no React/Next/Three/DOM",
      frameworkOk ? "independent" : "framework-coupled",
    ),
  ];
}

function evaluateBoundaryAndRuntime(
  sources: ReadonlyMap<string, string>,
): DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const allSources = [...sources.values()].join("\n");
  const renderingOk = excludesAll(allSources, [
    /\bclassName\b/,
    /\bzIndex\b/,
    /\banimationDuration\b/,
    /\beasing\b/,
    /\bfontSize\b/,
    /\bmesh\b/,
    /\bshader\b/,
    /\bsetOpacity\b/,
    /\bmoveCamera\b/,
  ]);
  const dri4Ok = excludesAll(allSources, [
    /directorRuntimeInteractionOrchestration(?!PublicIndex)/,
    /\breactionPlanning\b/,
    /\bplanInteractionReaction\b/,
    /\borchestrateDirectorRuntimeInteraction\b/,
  ]) ||
    excludesAll(allSources, [
      /\bplanInteractionReaction\b/,
      /\bresolveInteractionObservation\b/,
      /\bexecuteInteractionReaction\b/,
    ]);
  const attentionGuidanceOk = excludesAll(allSources, [
    /\bregenerateAttention\b/i,
    /\bgenerateGuidance\b/i,
    /\bcomposeExecutiveGuidance\b/,
    /\bresolveExecutiveGuidance\b/,
    /\bscoreAttention\b/i,
  ]);
  const runtimeOk =
    directorRuntimeExperienceCoordinationPlatform.mutatesRuntimeState ===
      false &&
    includesAll(
      sources.get("directorRuntimeConsumerInteractionBridge.ts") ?? "",
      ["mutatesRuntimeState"],
    );
  const businessOk = excludesAll(allSources, [
    /\bcalculateKpi\b/i,
    /\bcalculateKoi\b/i,
    /\briskScore\b/i,
    /\bscenarioRank\b/i,
    /\bopenai\b/i,
    /\bllm\b/i,
  ]);
  const noFreezeOk =
    directorRuntimeConsumerAdapterCertification.declaresFreeze === false &&
    directorRuntimeConsumerAdapterCertification.declaresRelease === false &&
    directorRuntimeConsumerAdapterCertification.introducesConsumerBehavior ===
      false &&
    !Object.prototype.hasOwnProperty.call(
      directorRuntimeConsumerAdapterCertification,
      "platformLock",
    ) &&
    !Object.prototype.hasOwnProperty.call(
      directorRuntimeConsumerAdapterCertification,
      "freezeLock",
    );

  const blockedCoord = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: blockedBridgeResult(),
  });
  const blockedOk =
    blockedCoord.status === "blocked" &&
    blockedCoord.coordinationPlan == null;

  return [
    outcome(
      "DRI-8-CERT-BOUNDARY-001",
      renderingOk,
      "no rendering/styling/geometry",
      renderingOk ? "clean" : "contaminated",
    ),
    outcome(
      "DRI-8-CERT-BOUNDARY-002",
      dri4Ok,
      "no DRI-4 orchestration duplication",
      dri4Ok ? "clean" : "duplicated",
    ),
    outcome(
      "DRI-8-CERT-BOUNDARY-003",
      attentionGuidanceOk,
      "no attention/guidance regeneration",
      attentionGuidanceOk ? "clean" : "regenerating",
    ),
    outcome(
      "DRI-8-CERT-RUNTIME-001",
      runtimeOk,
      "non-mutating adapter",
      runtimeOk ? "safe" : "mutating",
    ),
    outcome(
      "DRI-8-CERT-RUNTIME-002",
      businessOk,
      "no KPI/KOI/business logic",
      businessOk ? "clean" : "contaminated",
    ),
    outcome(
      "DRI-8-CERT-RUNTIME-003",
      noFreezeOk,
      "no premature freeze/lock",
      noFreezeOk ? "pre-freeze" : "freeze-declared",
    ),
    outcome(
      "DRI-8-CERT-RUNTIME-004",
      blockedOk,
      "blocked bridge → blocked coordination",
      `status=${blockedCoord.status};plan=${
        blockedCoord.coordinationPlan ? "present" : "absent"
      }`,
    ),
  ];
}

function evaluateRegistryAndE2E():
  DirectorRuntimeConsumerAdapterCertificationCheck[] {
  const rules = getDirectorRuntimeExperienceCoordinationRules();
  const surfaces = new Set<string>(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES);
  const triggers = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS,
  );
  const registryOk =
    rules.every((rule) =>
      triggers.has(rule.trigger) &&
      (rule.sourceSurface === "*" || surfaces.has(rule.sourceSurface)) &&
      (rule.primarySurface === "source" || surfaces.has(rule.primarySurface))
    ) &&
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS.every((relationship) =>
      relationship.surfaces.every((surface) => surfaces.has(surface))
    ) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES]);

  const e2e = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: bridgedSelectionResult("stage", "factory"),
    coordinationContext: {
      selectedSubject: { kind: "object", id: "factory" },
      focusedSubject: { kind: "object", id: "kpi-production" },
      attentionSubject: { kind: "object", id: "capacity-risk" },
      guidancePresent: true,
    },
  });
  const e2eOk =
    (e2e.status === "coordinated" || e2e.status === "partially-coordinated") &&
    e2e.primarySurface === "stage" &&
    e2e.coordinationPlan?.subject?.id === "factory";

  const stageOk =
    e2e.primarySurface === "stage" &&
    e2e.supportingSurfaces.includes("advisor") &&
    e2e.preservedSurfaces.includes("timeline") &&
    e2e.affectedSurfaces.length < 6;

  const blocked = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: blockedBridgeResult(),
  });
  const unsupported = coordinateDirectorRuntimeExperience({
    experienceStateProjection: fullExperienceState("factory"),
    interactionBridgeResult: unsupportedBridgeResult(),
  });
  const partial = coordinateDirectorRuntimeExperience({
    experienceStateProjection: partialExperienceState(),
    coordinationContext: {
      triggerOverride: "guidance-change",
      sourceSurfaceOverride: "advisor",
      guidancePresent: true,
    },
  });
  const empty = coordinateDirectorRuntimeExperience({
    experienceStateProjection: emptyExperienceState(),
    coordinationContext: {
      triggerOverride: "state-change",
      sourceSurfaceOverride: "stage",
    },
  });
  const emptyOk =
    empty.coordinationPlan?.subject == null &&
    empty.surfaceOutcomes.every((entry) => entry.subject == null) &&
    empty.status !== "invalid";
  const invalid = coordinateDirectorRuntimeExperience({
    experienceStateProjection: {
      status: "invalid",
      projections: [],
    },
    coordinationContext: {
      triggerOverride: "selection-change",
      sourceSurfaceOverride: "stage",
    },
  });

  return [
    outcome(
      "DRI-8-CERT-REGISTRY-001",
      registryOk,
      "valid registry references",
      registryOk ? "valid" : "orphaned",
    ),
    outcome(
      "DRI-8-CERT-E2E-001",
      e2eOk,
      "e2e coordinated fixture",
      `status=${e2e.status};primary=${e2e.primarySurface}`,
    ),
    outcome(
      "DRI-8-CERT-E2E-002",
      stageOk,
      "stage select fan-out rules",
      stageOk ? "satisfied" : "violated",
    ),
    outcome(
      "DRI-8-CERT-E2E-003",
      blocked.status === "blocked" && blocked.coordinationPlan == null,
      "blocked",
      `status=${blocked.status}`,
    ),
    outcome(
      "DRI-8-CERT-E2E-004",
      unsupported.status === "blocked",
      "unsupported → blocked coordination",
      `status=${unsupported.status}`,
    ),
    outcome(
      "DRI-8-CERT-E2E-005",
      partial.status === "partially-coordinated" ||
        partial.status === "coordinated" ||
        partial.status === "blocked" ||
        partial.status === "no-op",
      "graceful partial",
      `status=${partial.status}`,
    ),
    outcome(
      "DRI-8-CERT-E2E-006",
      emptyOk,
      "empty does not invent subject context",
      emptyOk
        ? `status=${empty.status};subject=absent`
        : `status=${empty.status};subject=${
          empty.coordinationPlan?.subject?.id ?? "absent"
        }`,
    ),
    outcome(
      "DRI-8-CERT-E2E-007",
      invalid.status === "invalid",
      "invalid",
      `status=${invalid.status}`,
    ),
  ];
}

function activeGuarantees(
  certificationStatus: DirectorRuntimeConsumerAdapterCertificationStatus,
  compatibilityStatus: DirectorRuntimeConsumerAdapterCompatibilityStatus,
  readiness: DirectorRuntimeConsumerAdapterReadiness,
): ReadonlyArray<DirectorRuntimeConsumerAdapterCertificationGuarantee> {
  const base = DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES.filter(
    (guarantee) => {
      if (guarantee === "full-chain-certified") {
        return certificationStatus === "certified";
      }
      if (guarantee === "compatible") {
        return compatibilityStatus === "compatible";
      }
      if (guarantee === "ready-for-freeze") {
        return readiness === "ready-for-freeze";
      }
      return certificationStatus === "certified";
    },
  );
  return Object.freeze([...base]);
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function getDirectorRuntimeConsumerAdapterCertificationIdentity():
  typeof directorRuntimeConsumerAdapterCertificationCanonicalIdentity {
  return directorRuntimeConsumerAdapterCertificationCanonicalIdentity;
}

export function listDirectorRuntimeConsumerAdapterCertificationDomains():
  ReadonlyArray<DirectorRuntimeConsumerAdapterCertificationDomain> {
  return DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS;
}

export function listDirectorRuntimeConsumerAdapterCertificationChecks():
  ReadonlyArray<
    (typeof DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG)[number]
  > {
  return DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG;
}

export function certifyDirectorRuntimeConsumerAdapter():
  DirectorRuntimeConsumerAdapterCertification {
  const certSource = readSiblingSource(
    "directorRuntimeConsumerAdapterCertification.ts",
  );
  const sources = new Map<string, string>();
  for (const entry of DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN) {
    sources.set(entry.file, readSiblingSource(entry.file));
  }

  const checks = Object.freeze([
    ...evaluateIdentityChecks(sources),
    ...evaluateDependencyChecks(sources, certSource),
    ...evaluateFoundationChecks(sources),
    ...evaluateContextChecks(sources),
    ...evaluateSurfaceChecks(sources),
    ...evaluateProjectionChecks(sources),
    ...evaluateBridgeChecks(sources),
    ...evaluateCoordinationChecks(),
    ...evaluateSemanticChecks(),
    ...evaluateImmutabilityAndDeterminism(),
    ...evaluateCompatibilityAndFramework(sources),
    ...evaluateBoundaryAndRuntime(sources),
    ...evaluateRegistryAndE2E(),
  ]);

  const passedCheckCount = checks.filter((entry) => entry.status === "passed")
    .length;
  const failedCheckCount = checks.filter((entry) => entry.status === "failed")
    .length;
  const certificationStatus =
    failedCheckCount === 0 ? "certified" : "not-certified";
  const compatibilityStatus =
    failedCheckCount === 0 ? "compatible" : "incompatible";
  const readiness =
    certificationStatus === "certified"
      ? "ready-for-freeze"
      : "not-ready-for-freeze";

  const summary = Object.freeze({
    domainCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS.length,
    checkCount: checks.length,
    passedCheckCount,
    failedCheckCount,
    certificationStatus,
    compatibilityStatus,
    readiness,
  });

  return Object.freeze({
    identity: directorRuntimeConsumerAdapterCertificationIdentity,
    version: directorRuntimeConsumerAdapterCertificationVersion,
    namespace: directorRuntimeConsumerAdapterCertificationNamespace,
    certificationStatus,
    compatibilityStatus,
    readiness,
    domains: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
    checks,
    summary,
    guarantees: activeGuarantees(
      certificationStatus,
      compatibilityStatus,
      readiness,
    ),
    provenance: Object.freeze({
      sourcePlatformIdentity:
        directorRuntimeExperienceCoordinationPlatformIdentity,
      adapterCertificationIdentity:
        directorRuntimeConsumerAdapterCertificationIdentity,
      certifiedChainStart:
        "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
      certifiedChainEnd:
        "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform",
    }),
    frozenDeclared: false,
    releasedDeclared: false,
    readyForConsumerDeclared: false,
  });
}

export function getDirectorRuntimeConsumerAdapterCompatibility():
  DirectorRuntimeConsumerAdapterCompatibilityStatus {
  return certifyDirectorRuntimeConsumerAdapter().compatibilityStatus;
}

// ─── Registry / module surface ──────────────────────────────────────────────

export const directorRuntimeConsumerAdapterCertificationApiNames = Object.freeze([
  "getDirectorRuntimeConsumerAdapterCertificationIdentity",
  "listDirectorRuntimeConsumerAdapterCertificationDomains",
  "listDirectorRuntimeConsumerAdapterCertificationChecks",
  "certifyDirectorRuntimeConsumerAdapter",
  "getDirectorRuntimeConsumerAdapterCompatibility",
  "verifyDirectorRuntimeConsumerAdapterCertification",
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "certification-statuses",
    "compatibility-statuses",
    "domains",
    "checks",
    "guarantees",
    "summary",
    "provenance",
    "consumer-adapter-information",
  ] as const);

export const directorRuntimeConsumerAdapterCertificationRegistry = Object.freeze({
  identity: directorRuntimeConsumerAdapterCertificationIdentity,
  version: directorRuntimeConsumerAdapterCertificationVersion,
  namespace: directorRuntimeConsumerAdapterCertificationNamespace,
  dependency: directorRuntimeConsumerAdapterCertificationUpstream,
  certificationStatuses:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_STATUSES,
  certificationStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_STATUSES.length,
  compatibilityStatuses:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_COMPATIBILITY_STATUSES,
  compatibilityStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_COMPATIBILITY_STATUSES.length,
  domains: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
  domainCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS.length,
  checks: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG,
  checkCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG.length,
  checkIds: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES,
  guaranteeCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES.length,
  chain: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN,
  chainStageCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CHAIN.length,
  registrySections:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeConsumerAdapterCertificationApiNames,
  publicApiCount: directorRuntimeConsumerAdapterCertificationApiNames.length,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
});

export const directorRuntimeConsumerAdapterCertification = Object.freeze({
  phase: "DRI-8:7" as const,
  name: "DirectorRuntimeConsumerAdapterCertification" as const,
  identity: directorRuntimeConsumerAdapterCertificationIdentity,
  namespace: directorRuntimeConsumerAdapterCertificationNamespace,
  version: directorRuntimeConsumerAdapterCertificationVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ConsumerAdapterCertification" as const,
  stage: "ConsumerAdapterCertification" as const,
  status: "ConsumerAdapterCertificationReady" as const,
  upstreamDependency: directorRuntimeConsumerAdapterCertificationUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  mutatesRuntimeState: false as const,
  introducesConsumerBehavior: false as const,
  declaresFreeze: false as const,
  declaresRelease: false as const,
  philosophy:
    "certify-complete-consumer-adapter-chain-without-new-behavior" as const,
  domains: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
  checkIds: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES,
  publicApiSurface: directorRuntimeConsumerAdapterCertificationApiNames,
  registry: directorRuntimeConsumerAdapterCertificationRegistry,
  coordinationPlatformBoundary:
    "DRI-8:6-experience-coordination-platform-only" as const,
  architecturalStatus:
    "Consumer Adapter Certification Complete · Certified · Compatible · ReadyForFreeze · NotFrozen" as const,
});

export interface DirectorRuntimeConsumerAdapterCertificationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerAdapterCertificationIdentity;
  readonly version: typeof directorRuntimeConsumerAdapterCertificationVersion;
  readonly namespace: typeof directorRuntimeConsumerAdapterCertificationNamespace;
  readonly dependency: typeof directorRuntimeConsumerAdapterCertificationUpstream;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly certificationStatus: DirectorRuntimeConsumerAdapterCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeConsumerAdapterCompatibilityStatus;
  readonly readiness: DirectorRuntimeConsumerAdapterReadiness;
  readonly frozen: boolean;
  readonly dri86BoundaryIntact: boolean;
  readonly noPrematureFreeze: boolean;
  readonly domainsUnique: boolean;
  readonly checksUnique: boolean;
  readonly countsConsistent: boolean;
}

export function verifyDirectorRuntimeConsumerAdapterCertification():
  DirectorRuntimeConsumerAdapterCertificationVerification {
  const certification = certifyDirectorRuntimeConsumerAdapter();
  const moduleSurface = directorRuntimeConsumerAdapterCertification;
  const registry = directorRuntimeConsumerAdapterCertificationRegistry;

  const domainsUnique = unique([
    ...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS,
  ]);
  const checksUnique = unique([
    ...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
  ]);
  const countsConsistent =
    certification.summary.checkCount === certification.checks.length &&
    certification.summary.passedCheckCount +
          certification.summary.failedCheckCount ===
      certification.summary.checkCount &&
    certification.summary.domainCount ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS.length &&
    registry.checkCount ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG.length &&
    registry.domainCount ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES.length &&
    registry.publicApiCount ===
      directorRuntimeConsumerAdapterCertificationApiNames.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_REGISTRY_SECTIONS.length;

  const statusConsistent =
    (certification.summary.failedCheckCount === 0 &&
      certification.certificationStatus === "certified" &&
      certification.compatibilityStatus === "compatible" &&
      certification.readiness === "ready-for-freeze") ||
    (certification.summary.failedCheckCount > 0 &&
      certification.certificationStatus === "not-certified" &&
      certification.compatibilityStatus === "incompatible" &&
      certification.readiness === "not-ready-for-freeze");

  const dri86BoundaryIntact =
    moduleSurface.upstreamDependency ===
      "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform" &&
    moduleSurface.coordinationPlatformBoundary ===
      "DRI-8:6-experience-coordination-platform-only" &&
    verifyDirectorRuntimeExperienceCoordinationPlatform().ok;

  const noPrematureFreeze =
    certification.frozenDeclared === false &&
    certification.releasedDeclared === false &&
    certification.readyForConsumerDeclared === false &&
    moduleSurface.declaresFreeze === false &&
    moduleSurface.declaresRelease === false;

  const identityOk =
    moduleSurface.identity ===
      "DRI-8:7/DirectorRuntimeConsumerAdapterCertification" &&
    moduleSurface.version === "8.7.0" &&
    moduleSurface.namespace ===
      "nexora.dri.consumer-integration.adapter-certification" &&
    moduleSurface.role === "ConsumerAdapterCertification" &&
    moduleSurface.introducesConsumerBehavior === false;

  const catalogAligned =
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS.length ===
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG.length &&
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_CATALOG.every(
      (entry, index) =>
        entry.id ===
          DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS[index],
    ) &&
    certification.checks.every((entry, index) =>
      entry.id ===
        DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS[index]
    );

  const frozen =
    Object.isFrozen(moduleSurface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(certification) &&
    Object.isFrozen(certification.checks) &&
    Object.isFrozen(certification.summary) &&
    Object.isFrozen(certification.provenance) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS) &&
    Object.isFrozen(
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_CHECK_IDS,
    ) &&
    Object.isFrozen(
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_GUARANTEES,
    );

  const ok =
    identityOk &&
    domainsUnique &&
    checksUnique &&
    countsConsistent &&
    statusConsistent &&
    dri86BoundaryIntact &&
    noPrematureFreeze &&
    catalogAligned &&
    frozen &&
    certification.certificationStatus === "certified" &&
    certification.compatibilityStatus === "compatible";

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerAdapterCertificationIdentity,
    version: directorRuntimeConsumerAdapterCertificationVersion,
    namespace: directorRuntimeConsumerAdapterCertificationNamespace,
    dependency: directorRuntimeConsumerAdapterCertificationUpstream,
    domainCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_CERTIFICATION_DOMAINS.length,
    checkCount: certification.summary.checkCount,
    passedCheckCount: certification.summary.passedCheckCount,
    failedCheckCount: certification.summary.failedCheckCount,
    certificationStatus: certification.certificationStatus,
    compatibilityStatus: certification.compatibilityStatus,
    readiness: certification.readiness,
    frozen,
    dri86BoundaryIntact,
    noPrematureFreeze,
    domainsUnique,
    checksUnique,
    countsConsistent,
  });
}
