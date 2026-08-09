/**
 * NEX-CI:9 — Executive Cockpit Integration Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen NEX-CI
 * Executive Cockpit Integration platform.
 *
 * Canonical flow:
 *   REX → NEX-CI:1 → … → NEX-CI:8 Certification & Freeze → NEX-CI:9 Public Index
 *
 * Publication only. No new runtime behavior, contracts, or semantics.
 *
 * Consumers know NEX-CI:9.
 * NEX-CI:9 knows NEX-CI:8.
 * NEX-CI:8 protects the certified platform.
 */

import {
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS,
  EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
  EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY,
  EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION,
  EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
  EXECUTIVE_COCKPIT_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
  EXECUTIVE_EXPLORER_MODES,
  EXECUTIVE_LIVE_LENS_LAYERS,
  EXECUTIVE_TIMELINE_SCOPES,
  NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
  NEX_CI_INTEGRATION_IDENTITY_CHAIN,
  advisorInsightIntegrationIdentity,
  certifyExecutiveCockpitIntegration,
  cockpitInteractionOrchestrationIdentity,
  cockpitShellRuntimeBindingIdentity,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveCockpitInteractionIntent,
  createExecutiveCockpitOrchestrationSnapshot,
  createExecutiveExplorerInteractionIntent,
  createExecutiveLiveLensInteractionIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveTimelineInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  executiveCockpitIntegrationCertificationFreeze,
  executiveCockpitIntegrationCertificationFreezeApiNames,
  executiveCockpitIntegrationCertificationFreezeArchitecturalRole,
  executiveCockpitIntegrationCertificationFreezeCanonicalIdentity,
  executiveCockpitIntegrationCertificationFreezeIdentity,
  executiveCockpitIntegrationCertificationFreezeNamespace,
  executiveCockpitIntegrationCertificationFreezePhase,
  executiveCockpitIntegrationCertificationFreezeRegistry,
  executiveCockpitIntegrationCertificationFreezeVersion,
  executiveCockpitIntegrationFoundationIdentity,
  executiveStageIntegrationIdentity,
  getExecutiveCockpitIntegrationApprovedExports,
  getExecutiveCockpitIntegrationCertificationDomains,
  getExecutiveCockpitIntegrationCertificationFreeze,
  getExecutiveCockpitIntegrationCertificationFreezeIdentity,
  getExecutiveCockpitIntegrationConsumerInformation,
  getExecutiveCockpitIntegrationFreezeInvariants,
  normalizeExecutiveExplorerInteraction,
  normalizeExecutiveLiveLensInteraction,
  normalizeExecutiveTimelineInteraction,
  orchestrateExecutiveCockpitInteraction,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveContextualSurfacesIntegration,
  resolveExecutiveExplorerContext,
  resolveExecutiveLiveLensContext,
  resolveExecutiveLiveLensLayerNavigation,
  resolveExecutiveStageScene,
  resolveExecutiveTimelineContext,
  resolveExecutiveWorkspaceExperience,
  timelineExplorerLiveLensIntegrationIdentity,
  validateExecutiveCockpitIntegrationCertificationFreeze,
  verifyAdvisorInsightIntegration,
  verifyCockpitInteractionOrchestration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationCertificationFreeze,
  verifyExecutiveCockpitIntegrationCompatibility,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyTimelineExplorerLiveLensIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze";

import type {
  ExecutiveCockpitIntegrationCertificationStatus,
  ExecutiveCockpitIntegrationCompatibilityStatus,
  ExecutiveCockpitIntegrationFreezeStatus,
  ExecutiveCockpitIntegrationLockStatus,
  ExecutiveCockpitIntegrationStability,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze";

/** Exact NEX-CI:8-approved publication. Direct re-export — no wrappers. */
export {
  EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
  EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
  EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY,
  EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION,
  EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
  EXECUTIVE_COCKPIT_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
  EXECUTIVE_EXPLORER_MODES,
  EXECUTIVE_LIVE_LENS_LAYERS,
  EXECUTIVE_TIMELINE_SCOPES,
  NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
  NEX_CI_INTEGRATION_IDENTITY_CHAIN,
  advisorInsightIntegrationIdentity,
  certifyExecutiveCockpitIntegration,
  cockpitInteractionOrchestrationIdentity,
  cockpitShellRuntimeBindingIdentity,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveCockpitInteractionIntent,
  createExecutiveCockpitOrchestrationSnapshot,
  createExecutiveExplorerInteractionIntent,
  createExecutiveLiveLensInteractionIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveTimelineInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  executiveCockpitIntegrationCertificationFreeze,
  executiveCockpitIntegrationCertificationFreezeApiNames,
  executiveCockpitIntegrationCertificationFreezeArchitecturalRole,
  executiveCockpitIntegrationCertificationFreezeCanonicalIdentity,
  executiveCockpitIntegrationCertificationFreezeIdentity,
  executiveCockpitIntegrationCertificationFreezeNamespace,
  executiveCockpitIntegrationCertificationFreezePhase,
  executiveCockpitIntegrationCertificationFreezeRegistry,
  executiveCockpitIntegrationCertificationFreezeVersion,
  executiveCockpitIntegrationFoundationIdentity,
  executiveStageIntegrationIdentity,
  getExecutiveCockpitIntegrationApprovedExports,
  getExecutiveCockpitIntegrationCertificationDomains,
  getExecutiveCockpitIntegrationCertificationFreeze,
  getExecutiveCockpitIntegrationCertificationFreezeIdentity,
  getExecutiveCockpitIntegrationConsumerInformation,
  getExecutiveCockpitIntegrationFreezeInvariants,
  normalizeExecutiveExplorerInteraction,
  normalizeExecutiveLiveLensInteraction,
  normalizeExecutiveTimelineInteraction,
  orchestrateExecutiveCockpitInteraction,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveContextualSurfacesIntegration,
  resolveExecutiveExplorerContext,
  resolveExecutiveLiveLensContext,
  resolveExecutiveLiveLensLayerNavigation,
  resolveExecutiveStageScene,
  resolveExecutiveTimelineContext,
  resolveExecutiveWorkspaceExperience,
  timelineExplorerLiveLensIntegrationIdentity,
  validateExecutiveCockpitIntegrationCertificationFreeze,
  verifyAdvisorInsightIntegration,
  verifyCockpitInteractionOrchestration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationCertificationFreeze,
  verifyExecutiveCockpitIntegrationCompatibility,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyTimelineExplorerLiveLensIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
};

export type {
  ExecutiveCockpitIntegrationCertificationCheck,
  ExecutiveCockpitIntegrationCertificationDomain,
  ExecutiveCockpitIntegrationCertificationReport,
  ExecutiveCockpitIntegrationCertificationStatus,
  ExecutiveCockpitIntegrationCompatibilityIssue,
  ExecutiveCockpitIntegrationCompatibilityResult,
  ExecutiveCockpitIntegrationCompatibilityStatus,
  ExecutiveCockpitIntegrationConsumerInformation,
  ExecutiveCockpitIntegrationConsumerReadiness,
  ExecutiveCockpitIntegrationFreeze,
  ExecutiveCockpitIntegrationFreezeInvariant,
  ExecutiveCockpitIntegrationFreezeStatus,
  ExecutiveCockpitIntegrationLockStatus,
  ExecutiveCockpitIntegrationStability,
  ExecutiveCockpitInteractionIntent,
  ExecutiveCockpitOrchestrationSnapshot,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveWorkspaceReference,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveCockpitIntegrationPublicIndexIdentity =
  "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" as const;

export const executiveCockpitIntegrationPublicIndexVersion =
  "1.9.0" as const;

export const executiveCockpitIntegrationPublicIndexNamespace =
  "nexora.executive.cockpit.integration.public-index" as const;

export const executiveCockpitIntegrationPublicIndexLayer =
  "NEX-CI" as const;

export const executiveCockpitIntegrationPublicIndexPhase =
  "PublicIndex" as const;

export const executiveCockpitIntegrationPublicIndexArchitecturalRole =
  "ExecutiveCockpitIntegrationPublicIndex" as const;

export const executiveCockpitIntegrationPublicIndexConsumerRole =
  "SoleConsumerEntryPoint" as const;

export const executiveCockpitIntegrationPublicIndexDependencyIdentity =
  executiveCockpitIntegrationCertificationFreezeIdentity;

export const executiveCockpitIntegrationPublicIndexDependencyPath =
  "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze" as const;

export const executiveCockpitIntegrationPublicIndexSupportedImportPath =
  "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex" as const;

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PRINCIPLE =
  "Publication boundary only. Consumers use NEX-CI:9. NEX-CI:9 knows NEX-CI:8. NEX-CI:8 protects the certified platform." as const;

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY =
  Object.freeze({
    nexCiAuthority: "Executive-Cockpit-Integration" as const,
    publicIndexAuthority: "NEX-CI:9" as const,
    architecturalRole: "ExecutiveCockpitIntegrationPublicIndex" as const,
    consumerRole: "SoleConsumerEntryPoint" as const,
    soleImmediateDependency:
      "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze" as const,
    consumesNexCi8Only: true as const,
    implementsNexCi10: false as const,
    isPublicIndex: true as const,
    publicationOnly: true as const,
    introducesNewBehavior: false as const,
    introducesReact: false as const,
    introducesThreeJs: false as const,
    introducesAiSdk: false as const,
    ownsNetworkAccess: false as const,
    ownsPersistence: false as const,
    importsNexCi7Directly: false as const,
    importsNexCi6Directly: false as const,
    importsNexCi5Directly: false as const,
    importsNexCi4Directly: false as const,
    importsNexCi3Directly: false as const,
    importsNexCi2Directly: false as const,
    importsNexCi1Directly: false as const,
    importsNolDirectly: false as const,
    importsDriDirectly: false as const,
    importsExDriDirectly: false as const,
    importsRexInternalsDirectly: false as const,
    isSoleConsumerEntryPoint: true as const,
    publishesApprovedExportsOnly: true as const,
  });

// ─── Release vocabularies (NEX-CI:8 lowercase convention) ───────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_RELEASE_STATUSES = Object.freeze([
  "released",
  "unreleased",
] as const);

export type ExecutiveCockpitIntegrationReleaseStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_RELEASE_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_READINESS =
  Object.freeze(["ready-for-consumer", "not-ready"] as const);

export type ExecutiveCockpitIntegrationPublicConsumerReadiness =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_READINESS)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "PublicTypes",
    "Foundation",
    "ShellRuntime",
    "Stage",
    "WorkspaceDial",
    "AdvisorInsight",
    "InteractionOrchestration",
    "TimelineExplorerLiveLens",
    "Validation",
    "Certification",
    "ReleaseInformation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ] as const);

export type ExecutiveCockpitIntegrationPublicIndexRegistrySection =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS)[number];

/** Approved type-only symbol names from NEX-CI:8. */
const APPROVED_TYPE_NAMES = Object.freeze([
  "ExecutiveCockpitIntegrationCertificationCheck",
  "ExecutiveCockpitIntegrationCertificationReport",
  "ExecutiveCockpitIntegrationCertificationDomain",
  "ExecutiveCockpitIntegrationCompatibilityIssue",
  "ExecutiveCockpitIntegrationCompatibilityResult",
  "ExecutiveCockpitIntegrationFreeze",
  "ExecutiveCockpitIntegrationFreezeInvariant",
  "ExecutiveCockpitIntegrationConsumerInformation",
  "ExecutiveCockpitOrchestrationSnapshot",
  "ExecutiveCockpitInteractionIntent",
  "ExecutiveCockpitPresentationState",
  "ExecutiveCockpitSubjectReference",
  "ExecutiveCockpitSurface",
  "ExecutiveWorkspaceReference",
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES = Object.freeze([
  ...APPROVED_TYPE_NAMES,
  "ExecutiveCockpitIntegrationCertificationStatus",
  "ExecutiveCockpitIntegrationCompatibilityStatus",
  "ExecutiveCockpitIntegrationFreezeStatus",
  "ExecutiveCockpitIntegrationLockStatus",
  "ExecutiveCockpitIntegrationStability",
  "ExecutiveCockpitIntegrationConsumerReadiness",
  "ExecutiveCockpitIntegrationReleaseStatus",
  "ExecutiveCockpitIntegrationPublicConsumerReadiness",
  "ExecutiveCockpitIntegrationReleaseInformation",
  "ExecutiveCockpitIntegrationPublicConsumerInformation",
  "ExecutiveCockpitIntegrationPublicIndexVerification",
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS =
  Object.freeze([
    ...EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.filter(
      (name) => !APPROVED_TYPE_NAMES.includes(name as never),
    ),
  ] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS =
  Object.freeze([
    "getExecutiveCockpitIntegrationPublicIndexIdentity",
    "getExecutiveCockpitIntegrationPublicIndexRegistry",
    "getExecutiveCockpitIntegrationReleaseInformation",
    "getExecutiveCockpitIntegrationPublicConsumerInformation",
    "validateExecutiveCockpitIntegrationPublicIndex",
    "verifyExecutiveCockpitIntegrationPublicIndex",
  ] as const);

export const executiveCockpitIntegrationPublicIndexApiNames = Object.freeze([
  ...EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS,
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS =
  Object.freeze([
    "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation",
    "@/app/lib/nex-ci/cockpitShellRuntimeBinding",
    "@/app/lib/nex-ci/executiveStageIntegration",
    "@/app/lib/nex-ci/workspaceDialExperienceSwitching",
    "@/app/lib/nex-ci/advisorInsightIntegration",
    "@/app/lib/nex-ci/cockpitInteractionOrchestration",
    "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration",
    "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze",
  ] as const);

// ─── Consumer guarantees (spec section 35 — 14 required) ────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "sole-supported-entry",
      order: 1,
      statement: "NEX-CI:9 is the sole supported consumer entry point.",
    }),
    Object.freeze({
      id: "frozen-nex-ci-8-origin",
      order: 2,
      statement: "Public exports originate from the frozen NEX-CI:8 surface.",
    }),
    Object.freeze({
      id: "no-internal-nex-ci-imports",
      order: 3,
      statement: "Consumers do not need internal NEX-CI imports.",
    }),
    Object.freeze({
      id: "stage-renderer-neutral",
      order: 4,
      statement: "Stage contracts remain renderer-neutral.",
    }),
    Object.freeze({
      id: "dial-renderer-neutral",
      order: 5,
      statement: "Workspace Dial contracts remain renderer-neutral.",
    }),
    Object.freeze({
      id: "advisor-insight-distinct",
      order: 6,
      statement: "Advisor/Insight remain separate.",
    }),
    Object.freeze({
      id: "selection-focus-distinct",
      order: 7,
      statement: "Selection/focus remain distinct.",
    }),
    Object.freeze({
      id: "current-target-workspace-distinct",
      order: 8,
      statement: "Current/target workspace remain distinct.",
    }),
    Object.freeze({
      id: "presentation-states-canonical",
      order: 9,
      statement: "Minimum/Report/Operation remain canonical.",
    }),
    Object.freeze({
      id: "orchestration-routing",
      order: 10,
      statement: "Cockpit interactions route through orchestration.",
    }),
    Object.freeze({
      id: "contextual-surfaces-over-one-state",
      order: 11,
      statement:
        "Timeline/Explorer/Live Lens remain contextual surfaces over one Cockpit state.",
    }),
    Object.freeze({
      id: "deterministic-behavior",
      order: 12,
      statement: "Public behavior is deterministic.",
    }),
    Object.freeze({
      id: "frozen-contracts-stable",
      order: 13,
      statement: "Frozen contracts are stable for consumers.",
    }),
    Object.freeze({
      id: "no-unpublished-helpers",
      order: 14,
      statement:
        "No internal helper is part of the supported API unless explicitly published.",
    }),
  ] as const);

// ─── Public Index invariants (spec section 55 — 30 required) ────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "sole-dependency-nex-ci-8",
      order: 1,
      statement: "NEX-CI:9 immediately depends on NEX-CI:8 only.",
    }),
    Object.freeze({
      id: "publication-only",
      order: 2,
      statement: "NEX-CI:9 is publication-only.",
    }),
    Object.freeze({
      id: "approved-exports-only",
      order: 3,
      statement: "All public exports are approved by NEX-CI:8.",
    }),
    Object.freeze({
      id: "no-internal-leakage",
      order: 4,
      statement: "No internal-only symbol leaks.",
    }),
    Object.freeze({
      id: "identity-exact",
      order: 5,
      statement: "Public identity is exact.",
    }),
    Object.freeze({
      id: "version-exact",
      order: 6,
      statement: "Version is exactly 1.9.0.",
    }),
    Object.freeze({
      id: "namespace-exact",
      order: 7,
      statement: "Namespace is exact.",
    }),
    Object.freeze({
      id: "consumer-role-exact",
      order: 8,
      statement: "Consumer role is SoleConsumerEntryPoint.",
    }),
    Object.freeze({
      id: "import-path-exact",
      order: 9,
      statement: "Consumer import path is exact.",
    }),
    Object.freeze({
      id: "release-released",
      order: 10,
      statement: "Release status is released.",
    }),
    Object.freeze({
      id: "certification-certified",
      order: 11,
      statement: "Certification remains certified.",
    }),
    Object.freeze({
      id: "compatibility-compatible",
      order: 12,
      statement: "Compatibility remains compatible.",
    }),
    Object.freeze({
      id: "freeze-frozen",
      order: 13,
      statement: "Freeze remains frozen.",
    }),
    Object.freeze({
      id: "lock-locked",
      order: 14,
      statement: "Lock remains locked.",
    }),
    Object.freeze({
      id: "stability-stable",
      order: 15,
      statement: "Stability remains stable.",
    }),
    Object.freeze({
      id: "readiness-ready-for-consumer",
      order: 16,
      statement: "Consumer readiness is ready-for-consumer.",
    }),
    Object.freeze({
      id: "platform-lock-exact",
      order: 17,
      statement: "Platform lock matches NEX-CI:8 exactly.",
    }),
    Object.freeze({
      id: "selection-focus-preserved",
      order: 18,
      statement: "Selection/focus distinction remains preserved.",
    }),
    Object.freeze({
      id: "current-target-workspace-preserved",
      order: 19,
      statement: "Current/target workspace distinction remains preserved.",
    }),
    Object.freeze({
      id: "presentation-states-preserved",
      order: 20,
      statement: "Minimum/Report/Operation remain canonical.",
    }),
    Object.freeze({
      id: "advisor-insight-preserved",
      order: 21,
      statement: "Advisor/Insight remain distinct.",
    }),
    Object.freeze({
      id: "contextual-surfaces-preserved",
      order: 22,
      statement: "Timeline/Explorer/Live Lens remain distinct.",
    }),
    Object.freeze({
      id: "orchestration-canonical",
      order: 23,
      statement: "Cockpit interaction orchestration remains canonical.",
    }),
    Object.freeze({
      id: "no-new-behavior",
      order: 24,
      statement: "No new behavior exists in Public Index.",
    }),
    Object.freeze({
      id: "no-react",
      order: 25,
      statement: "No React dependency exists.",
    }),
    Object.freeze({
      id: "no-three-r3f",
      order: 26,
      statement: "No Three.js/R3F dependency exists.",
    }),
    Object.freeze({
      id: "no-ai-sdk",
      order: 27,
      statement: "No AI SDK dependency exists.",
    }),
    Object.freeze({
      id: "no-network",
      order: 28,
      statement: "No network behavior exists.",
    }),
    Object.freeze({
      id: "no-persistence",
      order: 29,
      statement: "No persistence behavior exists.",
    }),
    Object.freeze({
      id: "nex-ci-8-source-of-truth",
      order: 30,
      statement: "Frozen NEX-CI:8 surface remains the source of truth.",
    }),
  ] as const);

export type ExecutiveCockpitIntegrationPublicIndexInvariant =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS)[number];

// ─── Release gate (derived from NEX-CI:8 — not recomputed independently) ─────

function evaluateReleaseGate(forceFailure = false): Readonly<{
  readonly releaseStatus: ExecutiveCockpitIntegrationReleaseStatus;
  readonly certificationStatus: "certified" | "failed";
  readonly compatibilityStatus: "compatible" | "incompatible";
  readonly freezeStatus: "frozen" | "unfrozen";
  readonly lockStatus: "locked" | "unlocked";
  readonly stability: "stable" | "unstable";
  readonly consumerReadiness: ExecutiveCockpitIntegrationPublicConsumerReadiness;
  readonly gatePassed: boolean;
  readonly freezeReadiness: "ready-for-public-index" | "not-ready";
}> {
  const freezeVerification =
    verifyExecutiveCockpitIntegrationCertificationFreeze();
  const freeze = getExecutiveCockpitIntegrationCertificationFreeze();
  const gatePassed =
    forceFailure !== true &&
    freezeVerification.ok === true &&
    freeze.certification.status === "certified" &&
    freeze.certification.compatibility === "compatible" &&
    freeze.freezeStatus === "frozen" &&
    freeze.lockStatus === "locked" &&
    freeze.stability === "stable" &&
    freeze.consumerReadiness === "ready-for-public-index" &&
    freeze.platformLock ===
      NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED &&
    executiveCockpitIntegrationCertificationFreeze.boundary
      .introducesRuntimeBehavior === false;

  return Object.freeze({
    releaseStatus: gatePassed ? ("released" as const) : ("unreleased" as const),
    certificationStatus: gatePassed
      ? ("certified" as const)
      : ("failed" as const),
    compatibilityStatus: gatePassed
      ? ("compatible" as const)
      : ("incompatible" as const),
    freezeStatus: gatePassed ? ("frozen" as const) : ("unfrozen" as const),
    lockStatus: gatePassed ? ("locked" as const) : ("unlocked" as const),
    stability: gatePassed ? ("stable" as const) : ("unstable" as const),
    consumerReadiness: gatePassed
      ? ("ready-for-consumer" as const)
      : ("not-ready" as const),
    gatePassed,
    freezeReadiness: freeze.consumerReadiness,
  });
}

const CANONICAL_RELEASE_GATE = evaluateReleaseGate();

export interface ExecutiveCockpitIntegrationReleaseInformation {
  readonly identity: typeof executiveCockpitIntegrationPublicIndexIdentity;
  readonly releaseStatus: ExecutiveCockpitIntegrationReleaseStatus;
  readonly certificationStatus: ExecutiveCockpitIntegrationCertificationStatus;
  readonly compatibilityStatus: ExecutiveCockpitIntegrationCompatibilityStatus;
  readonly freezeStatus: ExecutiveCockpitIntegrationFreezeStatus;
  readonly lockStatus: ExecutiveCockpitIntegrationLockStatus;
  readonly stability: ExecutiveCockpitIntegrationStability;
  readonly consumerReadiness: ExecutiveCockpitIntegrationPublicConsumerReadiness;
  readonly consumerImportPath: typeof executiveCockpitIntegrationPublicIndexSupportedImportPath;
}

export interface ExecutiveCockpitIntegrationPublicConsumerInformation {
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly importPath: typeof executiveCockpitIntegrationPublicIndexSupportedImportPath;
  readonly releaseStatus: ExecutiveCockpitIntegrationReleaseStatus;
  readonly readiness: ExecutiveCockpitIntegrationPublicConsumerReadiness;
}

export const executiveCockpitIntegrationPublicIndexCanonicalIdentity =
  Object.freeze({
    identity: executiveCockpitIntegrationPublicIndexIdentity,
    version: executiveCockpitIntegrationPublicIndexVersion,
    namespace: executiveCockpitIntegrationPublicIndexNamespace,
    layer: executiveCockpitIntegrationPublicIndexLayer,
    phase: executiveCockpitIntegrationPublicIndexPhase,
    architecturalRole: executiveCockpitIntegrationPublicIndexArchitecturalRole,
    consumerRole: executiveCockpitIntegrationPublicIndexConsumerRole,
    dependencyIdentity: executiveCockpitIntegrationPublicIndexDependencyIdentity,
    dependencyPath: executiveCockpitIntegrationPublicIndexDependencyPath,
    supportedImportPath:
      executiveCockpitIntegrationPublicIndexSupportedImportPath,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  });

export const executiveCockpitIntegrationReleaseInformation =
  Object.freeze({
    identity: executiveCockpitIntegrationPublicIndexIdentity,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
    consumerImportPath: executiveCockpitIntegrationPublicIndexSupportedImportPath,
  }) satisfies ExecutiveCockpitIntegrationReleaseInformation;

export const executiveCockpitIntegrationPublicConsumerInformation =
  Object.freeze({
    consumerRole: "SoleConsumerEntryPoint" as const,
    importPath: executiveCockpitIntegrationPublicIndexSupportedImportPath,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    readiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  }) satisfies ExecutiveCockpitIntegrationPublicConsumerInformation;

// ─── Registry sections ──────────────────────────────────────────────────────

const CERTIFICATION_REPORT = certifyExecutiveCockpitIntegration();
const FREEZE_CONTRACT = getExecutiveCockpitIntegrationCertificationFreeze();

export const executiveCockpitIntegrationPublicIndexIdentitySection =
  Object.freeze({
    identity: executiveCockpitIntegrationPublicIndexIdentity,
    version: executiveCockpitIntegrationPublicIndexVersion,
    namespace: executiveCockpitIntegrationPublicIndexNamespace,
    layer: executiveCockpitIntegrationPublicIndexLayer,
    phase: executiveCockpitIntegrationPublicIndexPhase,
    architecturalRole: executiveCockpitIntegrationPublicIndexArchitecturalRole,
    consumerRole: executiveCockpitIntegrationPublicIndexConsumerRole,
    soleImmediateDependency:
      executiveCockpitIntegrationPublicIndexDependencyIdentity,
    dependencyPath: executiveCockpitIntegrationPublicIndexDependencyPath,
    supportedImportPath:
      executiveCockpitIntegrationPublicIndexSupportedImportPath,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    identityChain: NEX_CI_INTEGRATION_IDENTITY_CHAIN,
  });

export const executiveCockpitIntegrationPublicIndexPublicTypesSection =
  Object.freeze({
    typeNames: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES,
    typeCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    approvedTypeNames: APPROVED_TYPE_NAMES,
    approvedTypeCount: APPROVED_TYPE_NAMES.length,
    surfaces: EXECUTIVE_COCKPIT_SURFACES,
    contextualSurfaces: EXECUTIVE_CONTEXTUAL_SURFACES,
    timelineScopes: EXECUTIVE_TIMELINE_SCOPES,
    explorerModes: EXECUTIVE_EXPLORER_MODES,
    liveLensLayers: EXECUTIVE_LIVE_LENS_LAYERS,
    note: "Type-only exports are registered by name; no fake runtime type values are created." as const,
  });

export const executiveCockpitIntegrationPublicIndexFoundationSection =
  Object.freeze({
    foundationIdentity: executiveCockpitIntegrationFoundationIdentity,
    surfaces: EXECUTIVE_COCKPIT_SURFACES,
    surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
    createExecutiveCockpitIntegrationSnapshot,
    verifyExecutiveCockpitIntegrationFoundation,
  });

export const executiveCockpitIntegrationPublicIndexShellRuntimeSection =
  Object.freeze({
    shellRuntimeIdentity: cockpitShellRuntimeBindingIdentity,
    resolveCockpitShellRuntimeBinding,
    verifyCockpitShellRuntimeBinding,
  });

export const executiveCockpitIntegrationPublicIndexStageSection = Object.freeze({
  stageIdentity: executiveStageIntegrationIdentity,
  createExecutiveStageInteractionIntent,
  resolveExecutiveStageScene,
  verifyExecutiveStageIntegration,
});

export const executiveCockpitIntegrationPublicIndexWorkspaceDialSection =
  Object.freeze({
    workspaceDialIdentity: workspaceDialExperienceSwitchingIdentity,
    createExecutiveWorkspaceReference,
    createExecutiveWorkspaceSelectionIntent,
    resolveExecutiveWorkspaceExperience,
    verifyWorkspaceDialExperienceSwitching,
  });

export const executiveCockpitIntegrationPublicIndexAdvisorInsightSection =
  Object.freeze({
    advisorInsightIdentity: advisorInsightIntegrationIdentity,
    resolveExecutiveAdvisorInsightIntegration,
    verifyAdvisorInsightIntegration,
  });

export const executiveCockpitIntegrationPublicIndexInteractionOrchestrationSection =
  Object.freeze({
    orchestrationIdentity: cockpitInteractionOrchestrationIdentity,
    createExecutiveCockpitInteractionIntent,
    createExecutiveCockpitOrchestrationSnapshot,
    orchestrateExecutiveCockpitInteraction,
    verifyCockpitInteractionOrchestration,
  });

export const executiveCockpitIntegrationPublicIndexTimelineExplorerLiveLensSection =
  Object.freeze({
    contextualIdentity: timelineExplorerLiveLensIntegrationIdentity,
    contextualSurfaces: EXECUTIVE_CONTEXTUAL_SURFACES,
    timelineScopes: EXECUTIVE_TIMELINE_SCOPES,
    explorerModes: EXECUTIVE_EXPLORER_MODES,
    liveLensLayers: EXECUTIVE_LIVE_LENS_LAYERS,
    reactionKinds: EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
    createExecutiveTimelineInteractionIntent,
    createExecutiveExplorerInteractionIntent,
    createExecutiveLiveLensInteractionIntent,
    normalizeExecutiveTimelineInteraction,
    normalizeExecutiveExplorerInteraction,
    normalizeExecutiveLiveLensInteraction,
    resolveExecutiveTimelineContext,
    resolveExecutiveExplorerContext,
    resolveExecutiveLiveLensContext,
    resolveExecutiveLiveLensLayerNavigation,
    resolveExecutiveContextualSurfacesIntegration,
    verifyTimelineExplorerLiveLensIntegration,
  });

export const EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_VALIDATION_API_NAMES =
  Object.freeze([
    "verifyExecutiveCockpitIntegrationFoundation",
    "verifyCockpitShellRuntimeBinding",
    "verifyExecutiveStageIntegration",
    "verifyWorkspaceDialExperienceSwitching",
    "verifyAdvisorInsightIntegration",
    "verifyCockpitInteractionOrchestration",
    "verifyTimelineExplorerLiveLensIntegration",
    "validateExecutiveCockpitIntegrationPublicIndex",
    "verifyExecutiveCockpitIntegrationPublicIndex",
  ] as const);

export const executiveCockpitIntegrationPublicIndexValidationSection =
  Object.freeze({
    validationApiNames: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_VALIDATION_API_NAMES,
    validationApiCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_VALIDATION_API_NAMES.length,
    verifyExecutiveCockpitIntegrationFoundation,
    verifyCockpitShellRuntimeBinding,
    verifyExecutiveStageIntegration,
    verifyWorkspaceDialExperienceSwitching,
    verifyAdvisorInsightIntegration,
    verifyCockpitInteractionOrchestration,
    verifyTimelineExplorerLiveLensIntegration,
  });

export const executiveCockpitIntegrationPublicIndexCertificationSection =
  Object.freeze({
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    freezeReadiness: CANONICAL_RELEASE_GATE.freezeReadiness,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    domains: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
    domainCount: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS.length,
    passedCheckCount: CERTIFICATION_REPORT.passedCheckCount,
    failedCheckCount: CERTIFICATION_REPORT.failedCheckCount,
    certificationReport: CERTIFICATION_REPORT,
    freezeContract: FREEZE_CONTRACT,
    freezeInvariants: EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
    certificationApiNames: executiveCockpitIntegrationCertificationFreezeApiNames,
    certifyExecutiveCockpitIntegration,
    verifyExecutiveCockpitIntegrationCompatibility,
    verifyExecutiveCockpitIntegrationCertificationFreeze,
    validateExecutiveCockpitIntegrationCertificationFreeze,
    getExecutiveCockpitIntegrationCertificationFreeze,
    getExecutiveCockpitIntegrationCertificationFreezeIdentity,
  });

export const executiveCockpitIntegrationPublicIndexReleaseInformationSection =
  executiveCockpitIntegrationReleaseInformation;

export const executiveCockpitIntegrationPublicIndexCompatibilitySection =
  Object.freeze({
    overallStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeProvenance: executiveCockpitIntegrationCertificationFreezeIdentity,
    surfaces: EXECUTIVE_COCKPIT_SURFACES,
    contextualSurfaces: EXECUTIVE_CONTEXTUAL_SURFACES,
    verifyExecutiveCockpitIntegrationCompatibility,
    verifyExecutiveCockpitIntegrationCertificationFreeze,
  });

export const executiveCockpitIntegrationPublicIndexRegistrySection =
  Object.freeze({
    sections: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS,
    sectionCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS.length,
    approvedExportSections: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS,
    approvedExportSectionCount:
      EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS.length,
    approvedExports: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
    approvedExportCount: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length,
    publishedRuntimeSymbolCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS.length,
    publicTypeCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    metadataApiCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS.length,
    consumerGuaranteeCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.length,
    invariantCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.length,
    freeze: executiveCockpitIntegrationCertificationFreeze,
    freezeRegistry: executiveCockpitIntegrationCertificationFreezeRegistry,
  });

export const executiveCockpitIntegrationPublicIndexConsumerInformationSection =
  Object.freeze({
    ...executiveCockpitIntegrationPublicConsumerInformation,
    upstreamConsumerInformation:
      EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION,
    consumerGuarantees: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES,
    forbiddenDependencyGuidance:
      EXECUTIVE_COCKPIT_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS,
    soleEntryPolicy:
      "Consumers should use @/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex only." as const,
    dependencyPolicy:
      "NEX-CI:9 depends only on NEX-CI:8. Consumers must not import internal NEX-CI phases." as const,
  });

export const executiveCockpitIntegrationPublicIndex = Object.freeze({
  Identity: executiveCockpitIntegrationPublicIndexIdentitySection,
  PublicTypes: executiveCockpitIntegrationPublicIndexPublicTypesSection,
  Foundation: executiveCockpitIntegrationPublicIndexFoundationSection,
  ShellRuntime: executiveCockpitIntegrationPublicIndexShellRuntimeSection,
  Stage: executiveCockpitIntegrationPublicIndexStageSection,
  WorkspaceDial: executiveCockpitIntegrationPublicIndexWorkspaceDialSection,
  AdvisorInsight: executiveCockpitIntegrationPublicIndexAdvisorInsightSection,
  InteractionOrchestration:
    executiveCockpitIntegrationPublicIndexInteractionOrchestrationSection,
  TimelineExplorerLiveLens:
    executiveCockpitIntegrationPublicIndexTimelineExplorerLiveLensSection,
  Validation: executiveCockpitIntegrationPublicIndexValidationSection,
  Certification: executiveCockpitIntegrationPublicIndexCertificationSection,
  ReleaseInformation:
    executiveCockpitIntegrationPublicIndexReleaseInformationSection,
  Compatibility: executiveCockpitIntegrationPublicIndexCompatibilitySection,
  Registry: executiveCockpitIntegrationPublicIndexRegistrySection,
  ConsumerInformation:
    executiveCockpitIntegrationPublicIndexConsumerInformationSection,
});

export const executiveCockpitIntegrationPublicIndexRegistry = Object.freeze({
  identity: executiveCockpitIntegrationPublicIndexIdentity,
  version: executiveCockpitIntegrationPublicIndexVersion,
  namespace: executiveCockpitIntegrationPublicIndexNamespace,
  layer: executiveCockpitIntegrationPublicIndexLayer,
  phase: executiveCockpitIntegrationPublicIndexPhase,
  architecturalRole: executiveCockpitIntegrationPublicIndexArchitecturalRole,
  consumerRole: executiveCockpitIntegrationPublicIndexConsumerRole,
  dependencyIdentity: executiveCockpitIntegrationPublicIndexDependencyIdentity,
  dependencyPath: executiveCockpitIntegrationPublicIndexDependencyPath,
  supportedImportPath: executiveCockpitIntegrationPublicIndexSupportedImportPath,
  sections: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS,
  sectionCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS.length,
  approvedExportSections: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS,
  approvedExportSectionCount:
    EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS.length,
  approvedExportCount: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length,
  publishedRuntimeSymbolCount:
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS.length,
  publicTypeCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES.length,
  metadataApiCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_METADATA_APIS.length,
  consumerGuaranteeCount:
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.length,
  invariantCount: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.length,
  surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
  contextualSurfaceCount: EXECUTIVE_CONTEXTUAL_SURFACES.length,
  releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
  certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
  compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
  freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
  lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  stability: CANONICAL_RELEASE_GATE.stability,
  consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
});

// ─── Module bag ─────────────────────────────────────────────────────────────

export const executiveCockpitIntegrationPublicIndexModule = Object.freeze({
  phase: "PublicIndex" as const,
  name: "ExecutiveCockpitIntegrationPublicIndex" as const,
  identity: executiveCockpitIntegrationPublicIndexIdentity,
  version: executiveCockpitIntegrationPublicIndexVersion,
  namespace: executiveCockpitIntegrationPublicIndexNamespace,
  layer: executiveCockpitIntegrationPublicIndexLayer,
  architecturalRole: executiveCockpitIntegrationPublicIndexArchitecturalRole,
  consumerRole: executiveCockpitIntegrationPublicIndexConsumerRole,
  upstreamDependency: executiveCockpitIntegrationPublicIndexDependencyIdentity,
  dependencyPath: executiveCockpitIntegrationPublicIndexDependencyPath,
  supportedImportPath: executiveCockpitIntegrationPublicIndexSupportedImportPath,
  principle: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PRINCIPLE,
  boundary: EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY,
  platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
  releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
  certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
  compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
  freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
  lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  stability: CANONICAL_RELEASE_GATE.stability,
  consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  introducesNewBehavior: false as const,
  publicIndex: executiveCockpitIntegrationPublicIndex,
  registry: executiveCockpitIntegrationPublicIndexRegistry,
  architecturalStatus:
    "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer" as const,
});

// ─── Public Index metadata APIs ─────────────────────────────────────────────

export function getExecutiveCockpitIntegrationPublicIndexIdentity():
  typeof executiveCockpitIntegrationPublicIndexCanonicalIdentity {
  return executiveCockpitIntegrationPublicIndexCanonicalIdentity;
}

export function getExecutiveCockpitIntegrationPublicIndexRegistry():
  typeof executiveCockpitIntegrationPublicIndexRegistry {
  return executiveCockpitIntegrationPublicIndexRegistry;
}

export function getExecutiveCockpitIntegrationReleaseInformation():
  typeof executiveCockpitIntegrationReleaseInformation {
  return executiveCockpitIntegrationReleaseInformation;
}

export function getExecutiveCockpitIntegrationPublicConsumerInformation():
  typeof executiveCockpitIntegrationPublicConsumerInformation {
  return executiveCockpitIntegrationPublicConsumerInformation;
}

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveCockpitIntegrationPublicIndexVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveCockpitIntegrationPublicIndexIdentity;
  readonly version: typeof executiveCockpitIntegrationPublicIndexVersion;
  readonly namespace: typeof executiveCockpitIntegrationPublicIndexNamespace;
  readonly dependencyIdentity: typeof executiveCockpitIntegrationPublicIndexDependencyIdentity;
  readonly supportedImportPath: typeof executiveCockpitIntegrationPublicIndexSupportedImportPath;
  readonly consumerRole: typeof executiveCockpitIntegrationPublicIndexConsumerRole;
  readonly releaseStatus: ExecutiveCockpitIntegrationReleaseStatus;
  readonly certificationStatus: "certified" | "failed";
  readonly compatibilityStatus: "compatible" | "incompatible";
  readonly freezeStatus: "frozen" | "unfrozen";
  readonly lockStatus: "locked" | "unlocked";
  readonly stability: "stable" | "unstable";
  readonly consumerReadiness: ExecutiveCockpitIntegrationPublicConsumerReadiness;
  readonly platformLock: typeof NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED;
  readonly sectionCount: number;
  readonly namespaceOrderValid: boolean;
  readonly approvedPublicationOnly: boolean;
  readonly publicationComplete: boolean;
  readonly registryConsistent: boolean;
  readonly surfacesPreserved: boolean;
  readonly contextualSurfacesPreserved: boolean;
  readonly consumerGuaranteesPresent: boolean;
  readonly invariantsPresent: boolean;
  readonly freezeVerified: boolean;
  readonly frozen: boolean;
  readonly introducesNoBehavior: boolean;
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

function verifyPublicationCompleteness(): Readonly<{
  readonly ok: boolean;
  readonly approvedExportCount: number;
  readonly publishedRuntimeSymbolCount: number;
  readonly missingApprovedRuntimeSymbols: ReadonlyArray<string>;
  readonly namespaceSectionsPresent: boolean;
  readonly registryCountsMatch: boolean;
}> {
  const publishedRuntime = new Set(
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS,
  );
  const missingApprovedRuntimeSymbols = Object.freeze(
    EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.filter(
      (name) =>
        !APPROVED_TYPE_NAMES.includes(name as never) &&
        !publishedRuntime.has(name as never),
    ),
  );

  const namespaceSectionsPresent = exactOrder(
    Object.keys(executiveCockpitIntegrationPublicIndex),
    [...EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS],
  );

  const registry = executiveCockpitIntegrationPublicIndexRegistry;
  const registryCountsMatch =
    registry.sectionCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS.length &&
    registry.approvedExportCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length &&
    registry.publishedRuntimeSymbolCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS
        .length &&
    registry.publicTypeCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_TYPE_NAMES.length &&
    registry.consumerGuaranteeCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.length &&
    registry.invariantCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.length;

  return Object.freeze({
    ok:
      missingApprovedRuntimeSymbols.length === 0 &&
      namespaceSectionsPresent &&
      registryCountsMatch,
    approvedExportCount: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length,
    publishedRuntimeSymbolCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS.length,
    missingApprovedRuntimeSymbols,
    namespaceSectionsPresent,
    registryCountsMatch,
  });
}

export function validateExecutiveCockpitIntegrationPublicIndex(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly versionValid: boolean;
  readonly namespaceValid: boolean;
  readonly consumerRoleValid: boolean;
  readonly importPathValid: boolean;
  readonly boundaryValid: boolean;
  readonly approvedExportsUnique: boolean;
  readonly publicationComplete: boolean;
  readonly guaranteesValid: boolean;
  readonly invariantsValid: boolean;
  readonly releaseGatePassed: boolean;
}> {
  const gate = evaluateReleaseGate(options?.forceFailure === true);
  const completeness = verifyPublicationCompleteness();

  const identityValid =
    executiveCockpitIntegrationPublicIndexIdentity ===
      "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" &&
    executiveCockpitIntegrationPublicIndexArchitecturalRole ===
      "ExecutiveCockpitIntegrationPublicIndex";
  const versionValid =
    executiveCockpitIntegrationPublicIndexVersion === "1.9.0";
  const namespaceValid =
    executiveCockpitIntegrationPublicIndexNamespace ===
    "nexora.executive.cockpit.integration.public-index";
  const consumerRoleValid =
    executiveCockpitIntegrationPublicIndexConsumerRole ===
    "SoleConsumerEntryPoint";
  const importPathValid =
    executiveCockpitIntegrationPublicIndexSupportedImportPath ===
    "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex";
  const boundaryValid =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY.consumesNexCi8Only ===
      true &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY.isPublicIndex ===
      true &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY.publicationOnly ===
      true &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY
      .introducesNewBehavior === false &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY.implementsNexCi10 ===
      false;
  const approvedExportsUnique = unique([
    ...EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
  ]);
  const guaranteesValid =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.length === 14 &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.map(
        (entry) => entry.id,
      ),
    );
  const invariantsValid =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.length === 30 &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.map(
        (entry) => entry.id,
      ),
    );

  const ok =
    identityValid &&
    versionValid &&
    namespaceValid &&
    consumerRoleValid &&
    importPathValid &&
    boundaryValid &&
    approvedExportsUnique &&
    completeness.ok &&
    guaranteesValid &&
    invariantsValid &&
    gate.gatePassed;

  return Object.freeze({
    ok,
    identityValid,
    versionValid,
    namespaceValid,
    consumerRoleValid,
    importPathValid,
    boundaryValid,
    approvedExportsUnique,
    publicationComplete: completeness.ok,
    guaranteesValid,
    invariantsValid,
    releaseGatePassed: gate.gatePassed,
  });
}

export function verifyExecutiveCockpitIntegrationPublicIndex(options?: {
  readonly forceFailure?: boolean;
}): ExecutiveCockpitIntegrationPublicIndexVerification {
  const gate = evaluateReleaseGate(options?.forceFailure === true);
  const validation = validateExecutiveCockpitIntegrationPublicIndex(options);
  const completeness = verifyPublicationCompleteness();
  const freezeVerification =
    verifyExecutiveCockpitIntegrationCertificationFreeze();

  const namespaceOrderValid = exactOrder(
    Object.keys(executiveCockpitIntegrationPublicIndex),
    [...EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS],
  );

  const approvedPublicationOnly =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_PUBLISHED_RUNTIME_SYMBOLS.every(
      (name) =>
        (
          EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS as readonly string[]
        ).includes(name),
    ) &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY
      .publishesApprovedExportsOnly === true;

  const surfacesPreserved = exactOrder([...EXECUTIVE_COCKPIT_SURFACES], [
    "stage",
    "advisor",
    "insight",
    "timeline",
    "explorer",
    "live-lens",
    "workspace-dial",
    "context-bar",
    "navigation",
    "status",
  ]);
  const contextualSurfacesPreserved = exactOrder(
    [...EXECUTIVE_CONTEXTUAL_SURFACES],
    ["timeline", "explorer", "live-lens"],
  );

  const consumerGuaranteesPresent =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.length === 14 &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );
  const invariantsPresent =
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.length === 30 &&
    EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    );

  const frozen =
    Object.isFrozen(executiveCockpitIntegrationPublicIndex) &&
    Object.isFrozen(executiveCockpitIntegrationPublicIndexRegistry) &&
    Object.isFrozen(executiveCockpitIntegrationPublicIndexCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_CONSUMER_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_INVARIANTS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_BOUNDARY);

  const ok =
    validation.ok &&
    gate.gatePassed &&
    namespaceOrderValid &&
    approvedPublicationOnly &&
    completeness.ok &&
    surfacesPreserved &&
    contextualSurfacesPreserved &&
    consumerGuaranteesPresent &&
    invariantsPresent &&
    freezeVerification.ok === true &&
    frozen &&
    executiveCockpitIntegrationPublicIndexModule.introducesNewBehavior === false;

  return Object.freeze({
    ok,
    identity: executiveCockpitIntegrationPublicIndexIdentity,
    version: executiveCockpitIntegrationPublicIndexVersion,
    namespace: executiveCockpitIntegrationPublicIndexNamespace,
    dependencyIdentity: executiveCockpitIntegrationPublicIndexDependencyIdentity,
    supportedImportPath:
      executiveCockpitIntegrationPublicIndexSupportedImportPath,
    consumerRole: executiveCockpitIntegrationPublicIndexConsumerRole,
    releaseStatus: gate.releaseStatus,
    certificationStatus: gate.certificationStatus,
    compatibilityStatus: gate.compatibilityStatus,
    freezeStatus: gate.freezeStatus,
    lockStatus: gate.lockStatus,
    stability: gate.stability,
    consumerReadiness: gate.consumerReadiness,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    sectionCount:
      EXECUTIVE_COCKPIT_INTEGRATION_PUBLIC_INDEX_REGISTRY_SECTIONS.length,
    namespaceOrderValid,
    approvedPublicationOnly,
    publicationComplete: completeness.ok,
    registryConsistent: completeness.registryCountsMatch,
    surfacesPreserved,
    contextualSurfacesPreserved,
    consumerGuaranteesPresent,
    invariantsPresent,
    freezeVerified: freezeVerification.ok === true,
    frozen,
    introducesNoBehavior:
      executiveCockpitIntegrationPublicIndexModule.introducesNewBehavior ===
      false,
  });
}
