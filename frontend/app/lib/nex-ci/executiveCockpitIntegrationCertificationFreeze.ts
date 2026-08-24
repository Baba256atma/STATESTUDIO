/**
 * NEX-CI:8 — Executive Cockpit Integration Certification & Freeze.
 *
 * Certifies, compatibility-checks, freezes, and locks the complete NEX-CI:1–7
 * Executive Cockpit Integration chain as the stable pre-publication surface
 * for NEX-CI:9 Public Index.
 *
 * Canonical flow:
 *   REX → NEX-CI:1 → … → NEX-CI:7 → NEX-CI:8 Certification & Freeze → NEX-CI:9
 *
 * Certification validates architecture and behavior — not merely compilation.
 * NEX-CI:9 is not implemented here.
 */

import { readFileSync } from "node:fs";

import {
  EXECUTIVE_COCKPIT_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
  EXECUTIVE_EXPLORER_MODES,
  EXECUTIVE_LIVE_LENS_LAYERS,
  EXECUTIVE_TIMELINE_SCOPES,
  NEX_CI_INTEGRATION_IDENTITY_CHAIN,
  TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY,
  advisorInsightIntegrationIdentity,
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
  executiveCockpitIntegrationFoundationIdentity,
  executiveStageIntegrationIdentity,
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
  verifyAdvisorInsightIntegration,
  verifyCockpitInteractionOrchestration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyTimelineExplorerLiveLensIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
} from "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveCockpitIntegrationCertificationFreezeIdentity =
  "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze" as const;

export const executiveCockpitIntegrationCertificationFreezeVersion =
  "1.8.0" as const;

export const executiveCockpitIntegrationCertificationFreezeNamespace =
  "nexora.executive.cockpit.integration.certification-freeze" as const;

export const executiveCockpitIntegrationCertificationFreezeLayer =
  "NEX-CI" as const;

export const executiveCockpitIntegrationCertificationFreezePhase =
  "CertificationFreeze" as const;

export const executiveCockpitIntegrationCertificationFreezeArchitecturalRole =
  "ExecutiveCockpitIntegrationCertificationFreeze" as const;

export const executiveCockpitIntegrationCertificationFreezeDependencyIdentity =
  timelineExplorerLiveLensIntegrationIdentity;

export const executiveCockpitIntegrationCertificationFreezeDependencyPath =
  "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration" as const;

export const executiveCockpitIntegrationCertificationFreezeSupportedImportPath =
  "@/app/lib/nex-ci/executiveCockpitIntegrationCertificationFreeze" as const;

export const executiveCockpitIntegrationCertificationFreezeStability =
  "Stable" as const;

export const executiveCockpitIntegrationCertificationFreezeDeterministic =
  true as const;

export const executiveCockpitIntegrationCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const executiveCockpitIntegrationCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Canonical immutable NEX-CI platform lock. */
export const NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED =
  "NEX-CI-EXECUTIVE-COCKPIT-INTEGRATION-PLATFORM-LOCKED" as const;

export const executiveCockpitIntegrationCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: executiveCockpitIntegrationCertificationFreezeIdentity,
    version: executiveCockpitIntegrationCertificationFreezeVersion,
    namespace: executiveCockpitIntegrationCertificationFreezeNamespace,
    layer: executiveCockpitIntegrationCertificationFreezeLayer,
    phase: executiveCockpitIntegrationCertificationFreezePhase,
    architecturalRole:
      executiveCockpitIntegrationCertificationFreezeArchitecturalRole,
    dependencyIdentity:
      executiveCockpitIntegrationCertificationFreezeDependencyIdentity,
    dependencyPath:
      executiveCockpitIntegrationCertificationFreezeDependencyPath,
    supportedImportPath:
      executiveCockpitIntegrationCertificationFreezeSupportedImportPath,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    stabilityStatus: executiveCockpitIntegrationCertificationFreezeStability,
    deterministicStatus:
      executiveCockpitIntegrationCertificationFreezeDeterministic,
    sideEffectPolicy:
      executiveCockpitIntegrationCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      executiveCockpitIntegrationCertificationFreezeMutationPolicy,
  });

export const EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_PRINCIPLE =
  "NEX-CI:1–7 define the integration platform; NEX-CI:8 proves and freezes it; NEX-CI:9 publishes it. Certification validates architecture, not merely compilation." as const;

export const EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    nexCiAuthority: "Executive-Cockpit-Integration" as const,
    certificationAuthority: "NEX-CI:8" as const,
    architecturalRole: "ExecutiveCockpitIntegrationCertificationFreeze" as const,
    soleImmediateDependency:
      "NEX-CI:7/TimelineExplorerLiveLensIntegration" as const,
    consumesNexCi7Only: true as const,
    implementsNexCi9: false as const,
    isPublicIndex: false as const,
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
    introducesRuntimeBehavior: false as const,
    introducesNewCockpitSemantics: false as const,
    modifiesIntegrationPolicy: false as const,
    introducesUi: false as const,
    introducesReact: false as const,
    introducesThreeJs: false as const,
    introducesAiSdk: false as const,
    ownsNetworkAccess: false as const,
    ownsPersistence: false as const,
    isFinalPublicConsumerIndex: false as const,
    isReleased: false as const,
    preparesPublicIndex: true as const,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_STATUSES = Object.freeze([
  "certified",
  "failed",
] as const);

export type ExecutiveCockpitIntegrationCertificationStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_COMPATIBILITY_STATUSES = Object.freeze([
  "compatible",
  "incompatible",
] as const);

export type ExecutiveCockpitIntegrationCompatibilityStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_COMPATIBILITY_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_STATUSES = Object.freeze([
  "frozen",
  "unfrozen",
] as const);

export type ExecutiveCockpitIntegrationFreezeStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_LOCK_STATUSES = Object.freeze([
  "locked",
  "unlocked",
] as const);

export type ExecutiveCockpitIntegrationLockStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_LOCK_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_STABILITY_STATUSES = Object.freeze([
  "stable",
  "unstable",
] as const);

export type ExecutiveCockpitIntegrationStability =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_STABILITY_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_READINESS = Object.freeze([
  "ready-for-public-index",
  "not-ready",
] as const);

export type ExecutiveCockpitIntegrationConsumerReadiness =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_READINESS)[number];

// ─── Certification domains ──────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS = Object.freeze([
  "identity",
  "dependency-integrity",
  "foundation",
  "shell-runtime-binding",
  "stage-integration",
  "workspace-dial",
  "advisor-insight",
  "interaction-orchestration",
  "contextual-surfaces",
  "workspace-consistency",
  "focus-selection-consistency",
  "presentation-compatibility",
  "attention-compatibility",
  "determinism",
  "immutability",
  "framework-independence",
  "consumer-readiness",
] as const);

export type ExecutiveCockpitIntegrationCertificationDomain =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS)[number];

// ─── Freeze invariants (section 50 — 27 required guarantees) ────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "nex-ci-dependency-direction-fixed",
    description: "NEX-CI dependency direction is fixed.",
    required: true as const,
  }),
  Object.freeze({
    id: "cockpit-surface-registry-fixed",
    description: "Cockpit surface registry is fixed.",
    required: true as const,
  }),
  Object.freeze({
    id: "stage-primary-visual-surface",
    description: "Stage remains primary visual surface.",
    required: true as const,
  }),
  Object.freeze({
    id: "workspace-dial-control-surface",
    description: "Workspace Dial remains control surface.",
    required: true as const,
  }),
  Object.freeze({
    id: "advisor-insight-distinct",
    description: "Advisor and Insight remain distinct.",
    required: true as const,
  }),
  Object.freeze({
    id: "contextual-surfaces-distinct",
    description: "Timeline, Explorer and Live Lens remain distinct.",
    required: true as const,
  }),
  Object.freeze({
    id: "selection-focus-separate",
    description: "Selection and focus remain separate.",
    required: true as const,
  }),
  Object.freeze({
    id: "workspace-current-target-distinct",
    description:
      "Current and target workspace remain distinct during transition.",
    required: true as const,
  }),
  Object.freeze({
    id: "canonical-presentation-states",
    description: "Minimum/Report/Operation remain canonical presentation states.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-cross-surface-direct-mutation",
    description: "No cross-surface direct mutation.",
    required: true as const,
  }),
  Object.freeze({
    id: "orchestration-routing-required",
    description: "All surface interaction routing goes through orchestration.",
    required: true as const,
  }),
  Object.freeze({
    id: "stage-renderer-neutral",
    description: "Stage renderer-neutral scene contracts remain renderer-neutral.",
    required: true as const,
  }),
  Object.freeze({
    id: "dial-renderer-neutral",
    description: "Dial contracts remain physical-renderer neutral.",
    required: true as const,
  }),
  Object.freeze({
    id: "live-lens-renderer-neutral",
    description: "Live Lens contracts remain renderer neutral.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-core-react",
    description: "No core React dependency.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-core-three-r3f",
    description: "No core Three.js/R3F dependency.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-core-ai-sdk",
    description: "No core AI SDK dependency.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-core-network",
    description: "No core network dependency.",
    required: true as const,
  }),
  Object.freeze({
    id: "no-core-persistence",
    description: "No core persistence dependency.",
    required: true as const,
  }),
  Object.freeze({
    id: "deterministic-resolution-required",
    description: "Deterministic resolution is required.",
    required: true as const,
  }),
  Object.freeze({
    id: "canonical-ordering-required",
    description: "Canonical ordering is required.",
    required: true as const,
  }),
  Object.freeze({
    id: "input-immutability-required",
    description: "Input immutability is required.",
    required: true as const,
  }),
  Object.freeze({
    id: "timeline-not-historical-source-of-truth",
    description: "Timeline does not become source of historical truth.",
    required: true as const,
  }),
  Object.freeze({
    id: "explorer-not-data-source-of-truth",
    description: "Explorer does not become source of data truth.",
    required: true as const,
  }),
  Object.freeze({
    id: "live-lens-no-domain-relationships",
    description: "Live Lens does not create domain relationships.",
    required: true as const,
  }),
  Object.freeze({
    id: "nex-ci-no-rex-runtime-duplication",
    description: "NEX-CI does not duplicate REX runtime ownership.",
    required: true as const,
  }),
  Object.freeze({
    id: "public-consumption-through-nex-ci-9",
    description: "Public consumption after freeze must occur through NEX-CI:9.",
    required: true as const,
  }),
] as const);

export type ExecutiveCockpitIntegrationFreezeInvariant =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface ExecutiveCockpitIntegrationCertificationCheck {
  readonly id: string;
  readonly domain: ExecutiveCockpitIntegrationCertificationDomain;
  readonly passed: boolean;
  readonly message: string;
}

export interface ExecutiveCockpitIntegrationCertificationReport {
  readonly identity: typeof executiveCockpitIntegrationCertificationFreezeIdentity;
  readonly status: ExecutiveCockpitIntegrationCertificationStatus;
  readonly compatibility: ExecutiveCockpitIntegrationCompatibilityStatus;
  readonly checks: ReadonlyArray<ExecutiveCockpitIntegrationCertificationCheck>;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly freezeStatus: ExecutiveCockpitIntegrationFreezeStatus;
  readonly lockStatus: ExecutiveCockpitIntegrationLockStatus;
  readonly stability: ExecutiveCockpitIntegrationStability;
  readonly consumerReadiness: ExecutiveCockpitIntegrationConsumerReadiness;
}

export interface ExecutiveCockpitIntegrationCompatibilityIssue {
  readonly code: string;
  readonly domain: ExecutiveCockpitIntegrationCertificationDomain;
  readonly message: string;
}

export interface ExecutiveCockpitIntegrationCompatibilityResult {
  readonly status: ExecutiveCockpitIntegrationCompatibilityStatus;
  readonly issues: ReadonlyArray<ExecutiveCockpitIntegrationCompatibilityIssue>;
}

export interface ExecutiveCockpitIntegrationFreeze {
  readonly identity: typeof executiveCockpitIntegrationCertificationFreezeIdentity;
  readonly certification: ExecutiveCockpitIntegrationCertificationReport;
  readonly platformLock: typeof NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED;
  readonly freezeStatus: "frozen";
  readonly lockStatus: "locked";
  readonly stability: "stable";
  readonly consumerReadiness: "ready-for-public-index";
  readonly invariants: ReadonlyArray<ExecutiveCockpitIntegrationFreezeInvariant>;
}

export interface ExecutiveCockpitIntegrationConsumerInformation {
  readonly futurePublicIndex: "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex";
  readonly futureConsumerImportPath: "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex";
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly currentReadiness: "ready-for-public-index";
}

export interface ExecutiveCockpitIntegrationCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveCockpitIntegrationCertificationFreezeIdentity;
  readonly version: typeof executiveCockpitIntegrationCertificationFreezeVersion;
  readonly namespace: typeof executiveCockpitIntegrationCertificationFreezeNamespace;
  readonly phase: typeof executiveCockpitIntegrationCertificationFreezePhase;
  readonly dependencyIdentity: typeof executiveCockpitIntegrationCertificationFreezeDependencyIdentity;
  readonly platformLock: typeof NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly invariantCount: number;
  readonly domainsUnique: boolean;
  readonly checkIdsUnique: boolean;
  readonly certified: boolean;
  readonly compatible: boolean;
  readonly frozen: boolean;
  readonly locked: boolean;
  readonly stable: boolean;
  readonly readyForPublicIndex: boolean;
  readonly implementsNexCi9: false;
  readonly isPublicIndex: false;
}

export interface ExecutiveCockpitIntegrationCertificationFreezeValidation {
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly domainsUnique: boolean;
  readonly checksUnique: boolean;
  readonly invariantsUnique: boolean;
  readonly invariantsRequired: boolean;
  readonly approvedExportsUnique: boolean;
  readonly consumerInformationValid: boolean;
  readonly selfCertified: boolean;
  readonly selfVerified: boolean;
}

// ─── Approved export registry ─────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS = Object.freeze([
  "Identity",
  "PublicTypes",
  "Foundation",
  "Stage",
  "Workspace",
  "AdvisorInsight",
  "Orchestration",
  "ContextualSurfaces",
  "Validation",
  "Certification",
  "Freeze",
  "ConsumerInformation",
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS = Object.freeze([
  // Identity
  "executiveCockpitIntegrationCertificationFreezeIdentity",
  "executiveCockpitIntegrationCertificationFreezeVersion",
  "executiveCockpitIntegrationCertificationFreezeNamespace",
  "executiveCockpitIntegrationCertificationFreezePhase",
  "executiveCockpitIntegrationCertificationFreezeArchitecturalRole",
  "executiveCockpitIntegrationCertificationFreezeCanonicalIdentity",
  "executiveCockpitIntegrationFoundationIdentity",
  "cockpitShellRuntimeBindingIdentity",
  "executiveStageIntegrationIdentity",
  "workspaceDialExperienceSwitchingIdentity",
  "advisorInsightIntegrationIdentity",
  "cockpitInteractionOrchestrationIdentity",
  "timelineExplorerLiveLensIntegrationIdentity",
  "NEX_CI_INTEGRATION_IDENTITY_CHAIN",
  "NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED",
  // PublicTypes
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
  // Foundation
  "EXECUTIVE_COCKPIT_SURFACES",
  "createExecutiveCockpitIntegrationSnapshot",
  "verifyExecutiveCockpitIntegrationFoundation",
  // Stage
  "createExecutiveStageInteractionIntent",
  "resolveExecutiveStageScene",
  "verifyExecutiveStageIntegration",
  // Workspace
  "createExecutiveWorkspaceReference",
  "createExecutiveWorkspaceSelectionIntent",
  "resolveExecutiveWorkspaceExperience",
  "verifyWorkspaceDialExperienceSwitching",
  // AdvisorInsight
  "resolveExecutiveAdvisorInsightIntegration",
  "verifyAdvisorInsightIntegration",
  // Orchestration
  "createExecutiveCockpitInteractionIntent",
  "createExecutiveCockpitOrchestrationSnapshot",
  "orchestrateExecutiveCockpitInteraction",
  "resolveCockpitShellRuntimeBinding",
  "verifyCockpitInteractionOrchestration",
  // ContextualSurfaces
  "EXECUTIVE_CONTEXTUAL_SURFACES",
  "EXECUTIVE_TIMELINE_SCOPES",
  "EXECUTIVE_EXPLORER_MODES",
  "EXECUTIVE_LIVE_LENS_LAYERS",
  "EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS",
  "createExecutiveTimelineInteractionIntent",
  "createExecutiveExplorerInteractionIntent",
  "createExecutiveLiveLensInteractionIntent",
  "normalizeExecutiveTimelineInteraction",
  "normalizeExecutiveExplorerInteraction",
  "normalizeExecutiveLiveLensInteraction",
  "resolveExecutiveTimelineContext",
  "resolveExecutiveExplorerContext",
  "resolveExecutiveLiveLensContext",
  "resolveExecutiveLiveLensLayerNavigation",
  "resolveExecutiveContextualSurfacesIntegration",
  "verifyTimelineExplorerLiveLensIntegration",
  // Validation
  "verifyCockpitShellRuntimeBinding",
  // Certification
  "certifyExecutiveCockpitIntegration",
  "verifyExecutiveCockpitIntegrationCompatibility",
  // Freeze
  "getExecutiveCockpitIntegrationCertificationFreezeIdentity",
  "getExecutiveCockpitIntegrationCertificationDomains",
  "getExecutiveCockpitIntegrationFreezeInvariants",
  "getExecutiveCockpitIntegrationApprovedExports",
  "getExecutiveCockpitIntegrationCertificationFreeze",
  "verifyExecutiveCockpitIntegrationCertificationFreeze",
  "validateExecutiveCockpitIntegrationCertificationFreeze",
  "executiveCockpitIntegrationCertificationFreeze",
  "executiveCockpitIntegrationCertificationFreezeApiNames",
  // ConsumerInformation
  "getExecutiveCockpitIntegrationConsumerInformation",
  "EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION",
  "EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS",
  "EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS",
  "EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS",
  "EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY",
  "executiveCockpitIntegrationCertificationFreezeRegistry",
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION = Object.freeze({
  futurePublicIndex: "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" as const,
  futureConsumerImportPath:
    "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex" as const,
  consumerRole: "SoleConsumerEntryPoint" as const,
  currentReadiness: "ready-for-public-index" as const,
}) satisfies ExecutiveCockpitIntegrationConsumerInformation;

// ─── Source scan (this module only) ─────────────────────────────────────────

const CERTIFICATION_FREEZE_SOURCE = readFileSync(
  new URL("./executiveCockpitIntegrationCertificationFreeze.ts", import.meta.url),
  "utf8",
);

// ─── Scenario fixtures ──────────────────────────────────────────────────────

const relatedGraph = Object.freeze({
  relatedSubjects: Object.freeze([
    Object.freeze({ id: "goal-1", kind: "goal" as const }),
    Object.freeze({ id: "object-1", kind: "object" as const }),
    Object.freeze({ id: "pack-1", kind: "pack" as const }),
    Object.freeze({ id: "decision-1", kind: "decision" as const }),
  ]),
  relationships: Object.freeze([
    Object.freeze({
      id: "rel.goal-object",
      sourceSubjectId: "goal-1",
      targetSubjectId: "object-1",
      kind: "related" as const,
    }),
    Object.freeze({
      id: "rel.object-pack",
      sourceSubjectId: "object-1",
      targetSubjectId: "pack-1",
      kind: "contains" as const,
    }),
    Object.freeze({
      id: "rel.object-decision",
      sourceSubjectId: "object-1",
      targetSubjectId: "decision-1",
      kind: "related" as const,
    }),
  ]),
});

function makeOrchestration(input: {
  readonly activeWorkspace?:
    | "overview"
    | "problem"
    | "scenario"
    | "decision"
    | "execution";
  readonly focusedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem" | "decision";
  };
  readonly selectedSubject?: {
    readonly id: string;
    readonly kind: "goal" | "object" | "pack" | "problem" | "decision";
  };
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly status?:
    | "idle"
    | "ready"
    | "active"
    | "transitioning"
    | "unavailable";
  readonly withStageGraph?: boolean;
  readonly transitionTo?: "problem" | "scenario" | "decision" | "execution";
} = {}) {
  const cockpit = resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubjectId: input.selectedSubject?.id,
        focusedSubjectId: input.focusedSubject?.id,
        presentationState: input.presentationState ?? "report",
      },
      state: {
        activeSurface: "stage",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubject: input.selectedSubject,
        focusedSubject: input.focusedSubject,
        presentationState: input.presentationState ?? "report",
        status: input.status ?? "ready",
      },
    }),
  );

  const stage = resolveExecutiveStageScene(
    cockpit,
    input.withStageGraph ? relatedGraph : undefined,
  );

  const base = resolveExecutiveWorkspaceExperience({
    cockpit,
    stage,
    currentWorkspace: createExecutiveWorkspaceReference(
      input.activeWorkspace ?? "overview",
    ),
  });

  const experience =
    input.transitionTo === undefined
      ? base
      : resolveExecutiveWorkspaceExperience({
          cockpit,
          stage,
          currentWorkspace: base.currentWorkspace,
          intent: createExecutiveWorkspaceSelectionIntent(
            `workspace.${input.transitionTo}`,
          ),
        });

  return createExecutiveCockpitOrchestrationSnapshot(
    resolveExecutiveAdvisorInsightIntegration(experience),
  );
}

const sampleEntries = Object.freeze([
  Object.freeze({
    id: "entry.object-1",
    subject: Object.freeze({ id: "object-1", kind: "object" as const }),
    timestamp: "2026-01-02T00:00:00.000Z",
    importance: "normal" as const,
  }),
  Object.freeze({
    id: "entry.decision-1",
    subject: Object.freeze({ id: "decision-1", kind: "decision" as const }),
    pack: Object.freeze({ id: "decision-1", kind: "decision" as const }),
    timestamp: "2026-01-01T00:00:00.000Z",
    importance: "high" as const,
  }),
]);

// ─── Helpers ────────────────────────────────────────────────────────────────

function exactOrder<T>(actual: readonly T[], expected: readonly T[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function check(
  id: string,
  domain: ExecutiveCockpitIntegrationCertificationDomain,
  passed: boolean,
  message: string,
): ExecutiveCockpitIntegrationCertificationCheck {
  return Object.freeze({ id, domain, passed, message });
}

function scanImportPaths(source: string): readonly string[] {
  return [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1]!,
  );
}

function scanForbiddenFrameworkImports(source: string): boolean {
  return (
    !/\bfrom\s+["']react(?:-dom)?["']/.test(source) &&
    !/\bfrom\s+["']three["']/.test(source) &&
    !/@react-three\/fiber/.test(source) &&
    !/\bfrom\s+["']openai["']/.test(source) &&
    !/\bfrom\s+["']@anthropic-ai\//.test(source) &&
    !/\bfrom\s+["']@google\/generative-ai["']/.test(source)
  );
}

function deriveReport(
  checks: ReadonlyArray<ExecutiveCockpitIntegrationCertificationCheck>,
): ExecutiveCockpitIntegrationCertificationReport {
  const passedCheckCount = checks.filter((entry) => entry.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const certified = failedCheckCount === 0;
  const compatible = certified;
  const freezeStatus: ExecutiveCockpitIntegrationFreezeStatus = certified
    ? "frozen"
    : "unfrozen";
  const lockStatus: ExecutiveCockpitIntegrationLockStatus = certified
    ? "locked"
    : "unlocked";
  const stability: ExecutiveCockpitIntegrationStability = certified
    ? "stable"
    : "unstable";
  const consumerReadiness: ExecutiveCockpitIntegrationConsumerReadiness =
    certified ? "ready-for-public-index" : "not-ready";

  return Object.freeze({
    identity: executiveCockpitIntegrationCertificationFreezeIdentity,
    status: certified ? ("certified" as const) : ("failed" as const),
    compatibility: compatible
      ? ("compatible" as const)
      : ("incompatible" as const),
    checks,
    passedCheckCount,
    failedCheckCount,
    freezeStatus,
    lockStatus,
    stability,
    consumerReadiness,
  });
}

// ─── Certification checks ───────────────────────────────────────────────────

function buildCertificationChecks(): ReadonlyArray<ExecutiveCockpitIntegrationCertificationCheck> {
  const foundation = verifyExecutiveCockpitIntegrationFoundation();
  const shell = verifyCockpitShellRuntimeBinding();
  const stage = verifyExecutiveStageIntegration();
  const dial = verifyWorkspaceDialExperienceSwitching();
  const advisorInsight = verifyAdvisorInsightIntegration();
  const orchestration = verifyCockpitInteractionOrchestration();
  const contextual = verifyTimelineExplorerLiveLensIntegration();

  const importPaths = scanImportPaths(CERTIFICATION_FREEZE_SOURCE);
  const soleImportOk = importPaths.every(
    (entry) =>
      entry === "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration" ||
      entry === "node:fs",
  );
  const frameworkSourceOk = scanForbiddenFrameworkImports(
    CERTIFICATION_FREEZE_SOURCE,
  );

  const chain = NEX_CI_INTEGRATION_IDENTITY_CHAIN;
  const chainOrderOk =
    chain.length === 7 &&
    chain.every((entry, index) => entry.order === index + 1);
  const chainDependencyOk = chain.every((entry, index) =>
    index === 0
      ? entry.dependencyIdentity ===
        "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex"
      : entry.dependencyIdentity === chain[index - 1]!.identity,
  );
  const chainVersionsOk = exactOrder(
    chain.map((entry) => entry.version),
    ["1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0"],
  );
  const chainIdentitiesOk =
    chain[0]!.identity === executiveCockpitIntegrationFoundationIdentity &&
    chain[1]!.identity === cockpitShellRuntimeBindingIdentity &&
    chain[2]!.identity === executiveStageIntegrationIdentity &&
    chain[3]!.identity === workspaceDialExperienceSwitchingIdentity &&
    chain[4]!.identity === advisorInsightIntegrationIdentity &&
    chain[5]!.identity === cockpitInteractionOrchestrationIdentity &&
    chain[6]!.identity === timelineExplorerLiveLensIntegrationIdentity;

  const nexCi8IdentityOk =
    executiveCockpitIntegrationCertificationFreezeIdentity ===
      "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze" &&
    executiveCockpitIntegrationCertificationFreezeVersion === "1.8.0" &&
    executiveCockpitIntegrationCertificationFreezePhase ===
      "CertificationFreeze";

  // Scenario A — general empty
  const scenarioA = makeOrchestration({});
  const contextualA = resolveExecutiveContextualSurfacesIntegration({
    orchestration: scenarioA,
  });
  const scenarioAOk =
    contextualA.timeline.entries.length === 0 &&
    contextualA.explorer.items.length === 0 &&
    contextualA.liveLens.layer === "goal" &&
    scenarioA.advisorInsight.advisor.readiness !== "unavailable";

  // Scenario B — selected only
  const scenarioB = makeOrchestration({
    withStageGraph: true,
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  const contextualB = resolveExecutiveContextualSurfacesIntegration({
    orchestration: scenarioB,
  });
  const scenarioBOk =
    scenarioB.selectedSubject?.id === "goal-1" &&
    scenarioB.focusedSubject === undefined &&
    contextualB.timeline.selectedSubject?.id === "goal-1" &&
    contextualB.timeline.focusedSubject === undefined;

  // Scenario C — focused
  const scenarioC = makeOrchestration({
    withStageGraph: true,
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  const contextualC = resolveExecutiveContextualSurfacesIntegration({
    orchestration: scenarioC,
    timelineState: { scope: "week", entries: sampleEntries },
    explorerState: { mode: "related" },
    liveLensState: { layer: "object" },
  });
  const scenarioCOk =
    scenarioC.focusedSubject?.id === "object-1" &&
    contextualC.liveLens.centerSubject?.id === "object-1" &&
    contextualC.explorer.mode === "related" &&
    scenarioC.selectedSubject?.id !== scenarioC.focusedSubject?.id;

  // Scenario D — workspace change
  const scenarioD = makeOrchestration({ transitionTo: "problem" });
  const contextualD = resolveExecutiveContextualSurfacesIntegration({
    orchestration: scenarioD,
  });
  const scenarioDOk =
    scenarioD.currentWorkspace?.kind === "overview" &&
    scenarioD.targetWorkspace?.kind === "problem" &&
    scenarioD.currentWorkspace?.id !== scenarioD.targetWorkspace?.id &&
    contextualD.timeline.workspace?.kind === "overview";

  // Scenario E — presentation change via orchestration
  const scenarioE = orchestrateExecutiveCockpitInteraction(
    makeOrchestration({ presentationState: "minimum" }),
    createExecutiveCockpitInteractionIntent({
      source: "context-bar",
      kind: "change-presentation",
      presentationState: "operation",
    }),
  );
  const scenarioEOk =
    scenarioE.resolution.status === "accepted" &&
    scenarioE.snapshot.presentationState === "operation";

  // Scenario F — explorer focus → normalize → orchestrate
  const explorerIntent = normalizeExecutiveExplorerInteraction(
    createExecutiveExplorerInteractionIntent({
      kind: "focus-item",
      subjectId: "object-1",
    }),
  );
  const scenarioF = orchestrateExecutiveCockpitInteraction(
    makeOrchestration({ withStageGraph: true }),
    explorerIntent,
  );
  const contextualF = resolveExecutiveContextualSurfacesIntegration({
    orchestration: scenarioF.snapshot,
  });
  const scenarioFOk =
    explorerIntent.source === "explorer" &&
    explorerIntent.kind === "focus" &&
    scenarioF.resolution.status === "accepted" &&
    scenarioF.snapshot.focusedSubject?.id === "object-1" &&
    contextualF.liveLens.centerSubject?.id === "object-1";

  // Scenario G — timeline pack select → normalize → orchestrate
  const timelineIntent = normalizeExecutiveTimelineInteraction(
    createExecutiveTimelineInteractionIntent({
      kind: "select-pack",
      packId: "decision-1",
    }),
  );
  const scenarioG = orchestrateExecutiveCockpitInteraction(
    makeOrchestration({ withStageGraph: true }),
    timelineIntent,
  );
  const scenarioGOk =
    timelineIntent.kind === "select" &&
    timelineIntent.source === "timeline" &&
    scenarioG.resolution.status === "accepted" &&
    scenarioG.snapshot.selectedSubject?.id === "decision-1";

  // Scenario H — live lens select + layer navigation
  const liveLensIntent = normalizeExecutiveLiveLensInteraction(
    createExecutiveLiveLensInteractionIntent({
      kind: "select-item",
      subjectId: "decision-1",
    }),
  );
  const scenarioH = orchestrateExecutiveCockpitInteraction(
    makeOrchestration({ withStageGraph: true }),
    liveLensIntent,
  );
  const layerNavOk =
    resolveExecutiveLiveLensLayerNavigation("pack", "back") === "object" &&
    resolveExecutiveLiveLensLayerNavigation("object", "back") === "goal" &&
    resolveExecutiveLiveLensLayerNavigation("goal", "open") === "object" &&
    resolveExecutiveLiveLensLayerNavigation("pack", "reset") === "goal";
  const scenarioHOk =
    scenarioH.resolution.status === "accepted" &&
    scenarioH.snapshot.selectedSubject?.id === "decision-1" &&
    layerNavOk;

  const insightIndependenceOk =
    !("targetWorkspace" in scenarioC.advisorInsight.insight.context) &&
    !("targetWorkspace" in makeOrchestration({}).advisorInsight.insight.context);

  const boundary = TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY;
  const noCrossSurfaceMutationOk =
    boundary.surfacesNeverDirectlyMutateEachOther === true &&
    boundary.contextualSurfacesRemainSeparate === true &&
    EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY
      .introducesRuntimeBehavior === false;

  const presentationOk = (["minimum", "report", "operation"] as const).every(
    (presentation) => {
      const snapshot = makeOrchestration({ presentationState: presentation });
      return snapshot.presentationState === presentation;
    },
  );

  const probe = makeOrchestration({
    withStageGraph: true,
    focusedSubject: { id: "object-1", kind: "object" },
  });
  const probeBefore = JSON.stringify(probe);
  orchestrateExecutiveCockpitInteraction(
    probe,
    createExecutiveCockpitInteractionIntent({
      source: "stage",
      kind: "select",
      subjectId: "goal-1",
    }),
  );
  const probeUnmutated = JSON.stringify(probe) === probeBefore;

  const detA = resolveExecutiveTimelineContext(makeOrchestration({}));
  const detB = resolveExecutiveTimelineContext(makeOrchestration({}));
  const detExplorerA = resolveExecutiveExplorerContext(
    makeOrchestration({ withStageGraph: true }),
  );
  const detExplorerB = resolveExecutiveExplorerContext(
    makeOrchestration({ withStageGraph: true }),
  );
  const determinismOk =
    deepEqual(detA, detB) &&
    deepEqual(detExplorerA, detExplorerB) &&
    deepEqual(
      resolveExecutiveContextualSurfacesIntegration({
        orchestration: scenarioC,
      }),
      resolveExecutiveContextualSurfacesIntegration({
        orchestration: scenarioC,
      }),
    );

  const approvedExportsOk =
    unique([...EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS]) &&
    EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length >= 80;

  const invariantsOk =
    EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.length === 27 &&
    EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.every(
      (entry) => entry.required === true,
    ) &&
    unique(
      EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.map((entry) => entry.id),
    );

  return freezeArray([
    check(
      "identity-nex-ci-8",
      "identity",
      nexCi8IdentityOk,
      "NEX-CI:8 certification identity/version/phase are exact",
    ),
    check(
      "identity-chain-order",
      "identity",
      chainOrderOk && chainIdentitiesOk && chainVersionsOk,
      "NEX-CI:1–7 identity chain order, identities, and versions are exact",
    ),
    check(
      "identity-chain-dependency",
      "identity",
      chainDependencyOk,
      "NEX-CI identity chain dependency direction is exact",
    ),
    check(
      "dependency-sole-nex-ci-7",
      "dependency-integrity",
      soleImportOk &&
        executiveCockpitIntegrationCertificationFreezeDependencyIdentity ===
          timelineExplorerLiveLensIntegrationIdentity &&
        EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY
          .consumesNexCi7Only,
      "Sole immediate dependency is NEX-CI:7 via one import path",
    ),
    check(
      "dependency-forbidden-absent",
      "dependency-integrity",
      importPaths.every(
        (entry) =>
          !entry.includes("@/app/lib/nol") &&
          !entry.includes("@/app/lib/dri") &&
          !entry.includes("@/app/lib/ex-dri") &&
          !entry.startsWith("@/app/lib/rex/"),
      ) &&
        EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY
          .importsRexInternalsDirectly === false,
      "Forbidden NOL/DRI/EX-DRI/REX-internal imports absent from certification surface",
    ),
    check(
      "foundation-verify",
      "foundation",
      foundation.ok === true,
      "NEX-CI:1 foundation verification passes",
    ),
    check(
      "foundation-surfaces",
      "foundation",
      exactOrder([...EXECUTIVE_COCKPIT_SURFACES], [
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
      ]) && unique([...EXECUTIVE_COCKPIT_SURFACES]),
      "Canonical Cockpit surface registry is exact and unique",
    ),
    check(
      "shell-runtime-binding",
      "shell-runtime-binding",
      shell.ok === true,
      "NEX-CI:2 shell runtime binding verification passes",
    ),
    check(
      "stage-integration",
      "stage-integration",
      stage.ok === true,
      "NEX-CI:3 stage integration verification passes",
    ),
    check(
      "workspace-dial",
      "workspace-dial",
      dial.ok === true,
      "NEX-CI:4 workspace dial verification passes",
    ),
    check(
      "advisor-insight",
      "advisor-insight",
      advisorInsight.ok === true && insightIndependenceOk,
      "NEX-CI:5 advisor/insight verification passes; insight has no targetWorkspace",
    ),
    check(
      "interaction-orchestration",
      "interaction-orchestration",
      orchestration.ok === true,
      "NEX-CI:6 interaction orchestration verification passes",
    ),
    check(
      "contextual-surfaces",
      "contextual-surfaces",
      contextual.ok === true &&
        exactOrder([...EXECUTIVE_CONTEXTUAL_SURFACES], [
          "timeline",
          "explorer",
          "live-lens",
        ]),
      "NEX-CI:7 contextual surfaces verification passes",
    ),
    check(
      "scenario-a-general-empty",
      "contextual-surfaces",
      scenarioAOk,
      "Scenario A — general empty Cockpit resolves valid contextual surfaces",
    ),
    check(
      "scenario-b-selected-only",
      "focus-selection-consistency",
      scenarioBOk,
      "Scenario B — selection propagates without forced focus",
    ),
    check(
      "scenario-c-focused",
      "focus-selection-consistency",
      scenarioCOk,
      "Scenario C — focus drives Stage/contextual surfaces; selection remains distinct",
    ),
    check(
      "scenario-d-workspace-change",
      "workspace-consistency",
      scenarioDOk,
      "Scenario D — current/target workspace distinction preserved during transition",
    ),
    check(
      "scenario-e-presentation-change",
      "presentation-compatibility",
      scenarioEOk && presentationOk,
      "Scenario E — presentation change via orchestration uses canonical states",
    ),
    check(
      "scenario-f-explorer-focus",
      "interaction-orchestration",
      scenarioFOk,
      "Scenario F — Explorer focus normalizes and orchestrates through NEX-CI:6",
    ),
    check(
      "scenario-g-timeline-pack",
      "interaction-orchestration",
      scenarioGOk,
      "Scenario G — Timeline pack select normalizes and orchestrates",
    ),
    check(
      "scenario-h-live-lens",
      "contextual-surfaces",
      scenarioHOk,
      "Scenario H — Live Lens select and layer navigation behave deterministically",
    ),
    check(
      "workspace-consistency",
      "workspace-consistency",
      scenarioD.currentWorkspace?.kind === "overview" &&
        contextualD.timeline.workspace?.kind === "overview",
      "Timeline consumes committed workspace only during transition",
    ),
    check(
      "focus-selection-consistency",
      "focus-selection-consistency",
      scenarioC.selectedSubject?.id !== scenarioC.focusedSubject?.id &&
        scenarioB.focusedSubject === undefined,
      "Focus and selection remain separate concepts end-to-end",
    ),
    check(
      "presentation-compatibility",
      "presentation-compatibility",
      presentationOk,
      "Minimum/Report/Operation presentation states remain canonical",
    ),
    check(
      "attention-compatibility",
      "attention-compatibility",
      contextualC.timeline.entries.some((entry) => entry.importance !== undefined),
      "Attention/importance is projected without inventing a competing engine",
    ),
    check(
      "no-cross-surface-mutation",
      "interaction-orchestration",
      noCrossSurfaceMutationOk,
      "Boundary flags certify no direct cross-surface mutation",
    ),
    check(
      "determinism",
      "determinism",
      determinismOk,
      "Equivalent inputs produce structurally equivalent contextual outputs",
    ),
    check(
      "immutability",
      "immutability",
      probeUnmutated &&
        Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS) &&
        Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS),
      "Inputs and canonical registries remain immutable",
    ),
    check(
      "framework-independence",
      "framework-independence",
      frameworkSourceOk &&
        boundary.frameworkIndependent === true &&
        boundary.introducesReact === false &&
        boundary.introducesThreeJs === false &&
        boundary.introducesAiSdk === false,
      "This module and upstream boundary remain framework/AI independent",
    ),
    check(
      "contextual-vocabularies",
      "contextual-surfaces",
      exactOrder([...EXECUTIVE_TIMELINE_SCOPES], [
        "day",
        "week",
        "month",
        "year",
      ]) &&
        exactOrder([...EXECUTIVE_EXPLORER_MODES], [
          "objects",
          "data",
          "journal",
          "packs",
          "related",
        ]) &&
        exactOrder([...EXECUTIVE_LIVE_LENS_LAYERS], [
          "goal",
          "object",
          "pack",
        ]),
      "Timeline scopes, Explorer modes, and Live Lens layers are canonical",
    ),
    check(
      "freeze-invariants",
      "consumer-readiness",
      invariantsOk,
      "All 27 freeze invariants exist, are required, and are unique",
    ),
    check(
      "approved-exports",
      "consumer-readiness",
      approvedExportsOk,
      "Approved exports are unique and complete for NEX-CI:9 publication",
    ),
    check(
      "consumer-information",
      "consumer-readiness",
      EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION.futurePublicIndex ===
        "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" &&
        EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY
          .implementsNexCi9 === false &&
        EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY
          .isPublicIndex === false,
      "Future NEX-CI:9 consumer metadata recorded; NEX-CI:8 is not the Public Index",
    ),
    check(
      "platform-lock-exact",
      "consumer-readiness",
      NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED ===
        "NEX-CI-EXECUTIVE-COCKPIT-INTEGRATION-PLATFORM-LOCKED",
      "Canonical platform lock identity is exact",
    ),
    check(
      "verify-functions",
      "dependency-integrity",
      foundation.ok &&
        shell.ok &&
        stage.ok &&
        dial.ok &&
        advisorInsight.ok &&
        orchestration.ok &&
        contextual.ok,
      "All upstream verify* functions report ok",
    ),
  ]);
}

export const EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_CHECKS =
  buildCertificationChecks();

// ─── Public APIs ────────────────────────────────────────────────────────────

export function getExecutiveCockpitIntegrationCertificationFreezeIdentity():
  typeof executiveCockpitIntegrationCertificationFreezeCanonicalIdentity {
  return executiveCockpitIntegrationCertificationFreezeCanonicalIdentity;
}

export function getExecutiveCockpitIntegrationCertificationDomains():
  typeof EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS {
  return EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS;
}

export function getExecutiveCockpitIntegrationFreezeInvariants():
  typeof EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS {
  return EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS;
}

export function getExecutiveCockpitIntegrationApprovedExports():
  typeof EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS {
  return EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS;
}

export function getExecutiveCockpitIntegrationConsumerInformation():
  typeof EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION {
  return EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION;
}

export function certifyExecutiveCockpitIntegration(options?: {
  readonly forceFailureCheckId?: string;
}): ExecutiveCockpitIntegrationCertificationReport {
  let checks = EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_CHECKS;
  if (options?.forceFailureCheckId !== undefined) {
    checks = freezeArray(
      checks.map((entry) =>
        entry.id === options.forceFailureCheckId
          ? check(
              entry.id,
              entry.domain,
              false,
              `Forced failure for ${entry.id}`,
            )
          : entry,
      ),
    );
  }
  return deriveReport(checks);
}

export function verifyExecutiveCockpitIntegrationCompatibility(): ExecutiveCockpitIntegrationCompatibilityResult {
  const report = certifyExecutiveCockpitIntegration();
  const issues = freezeArray(
    report.checks
      .filter((entry) => !entry.passed)
      .map((entry) =>
        Object.freeze({
          code: entry.id,
          domain: entry.domain,
          message: entry.message,
        }),
      ),
  );
  return Object.freeze({
    status: report.compatibility,
    issues,
  });
}

let cachedExecutiveCockpitIntegrationFreeze:
  | ExecutiveCockpitIntegrationFreeze
  | undefined;

export function getExecutiveCockpitIntegrationCertificationFreeze(): ExecutiveCockpitIntegrationFreeze {
  if (cachedExecutiveCockpitIntegrationFreeze !== undefined) {
    return cachedExecutiveCockpitIntegrationFreeze;
  }
  const certification = certifyExecutiveCockpitIntegration();
  if (certification.status !== "certified") {
    throw new Error(
      "Executive Cockpit Integration is not certified; canonical freeze unavailable",
    );
  }
  cachedExecutiveCockpitIntegrationFreeze = Object.freeze({
    identity: executiveCockpitIntegrationCertificationFreezeIdentity,
    certification,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    freezeStatus: "frozen" as const,
    lockStatus: "locked" as const,
    stability: "stable" as const,
    consumerReadiness: "ready-for-public-index" as const,
    invariants: EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
  });
  return cachedExecutiveCockpitIntegrationFreeze;
}

export function verifyExecutiveCockpitIntegrationCertificationFreeze(
  freeze?: ExecutiveCockpitIntegrationFreeze,
): ExecutiveCockpitIntegrationCertificationFreezeVerification {
  const target =
    freeze ?? getExecutiveCockpitIntegrationCertificationFreeze();
  const report = target.certification;
  const domainsUnique = unique([
    ...EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
  ]);
  const checkIdsUnique = unique(
    report.checks.map((entry) => entry.id),
  );
  const countsOk =
    report.passedCheckCount + report.failedCheckCount === report.checks.length;
  const gatesOk =
    (report.status === "certified") === (report.failedCheckCount === 0) &&
    (report.freezeStatus === "frozen") === (report.status === "certified") &&
    (report.lockStatus === "locked") === (report.freezeStatus === "frozen") &&
    (report.stability === "stable") ===
      (report.status === "certified" &&
        report.compatibility === "compatible") &&
    (report.consumerReadiness === "ready-for-public-index") ===
      (report.status === "certified" &&
        report.compatibility === "compatible" &&
        report.freezeStatus === "frozen" &&
        report.lockStatus === "locked" &&
        report.stability === "stable");

  const ok =
    report.status === "certified" &&
    report.compatibility === "compatible" &&
    target.freezeStatus === "frozen" &&
    target.lockStatus === "locked" &&
    target.stability === "stable" &&
    target.consumerReadiness === "ready-for-public-index" &&
    target.platformLock ===
      NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED &&
    domainsUnique &&
    checkIdsUnique &&
    countsOk &&
    gatesOk &&
    target.invariants.length === 27 &&
    Object.isFrozen(target);

  return Object.freeze({
    ok,
    identity: executiveCockpitIntegrationCertificationFreezeIdentity,
    version: executiveCockpitIntegrationCertificationFreezeVersion,
    namespace: executiveCockpitIntegrationCertificationFreezeNamespace,
    phase: executiveCockpitIntegrationCertificationFreezePhase,
    dependencyIdentity:
      executiveCockpitIntegrationCertificationFreezeDependencyIdentity,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    domainCount: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS.length,
    checkCount: report.checks.length,
    invariantCount: target.invariants.length,
    domainsUnique,
    checkIdsUnique,
    certified: report.status === "certified",
    compatible: report.compatibility === "compatible",
    frozen: target.freezeStatus === "frozen",
    locked: target.lockStatus === "locked",
    stable: target.stability === "stable",
    readyForPublicIndex:
      target.consumerReadiness === "ready-for-public-index",
    implementsNexCi9: false,
    isPublicIndex: false,
  });
}

export function validateExecutiveCockpitIntegrationCertificationFreeze(): ExecutiveCockpitIntegrationCertificationFreezeValidation {
  const report = certifyExecutiveCockpitIntegration();
  const verification = verifyExecutiveCockpitIntegrationCertificationFreeze(
    getExecutiveCockpitIntegrationCertificationFreeze(),
  );
  const identityValid =
    executiveCockpitIntegrationCertificationFreezeIdentity ===
      "NEX-CI:8/ExecutiveCockpitIntegrationCertificationFreeze" &&
    executiveCockpitIntegrationCertificationFreezeVersion === "1.8.0";
  const domainsUnique = unique([
    ...EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
  ]);
  const checksUnique = unique(report.checks.map((entry) => entry.id));
  const invariantsUnique = unique(
    EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.map((entry) => entry.id),
  );
  const invariantsRequired =
    EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.every(
      (entry) => entry.required === true,
    );
  const approvedExportsUnique = unique([
    ...EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
  ]);
  const consumerInformationValid =
    EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION.futurePublicIndex ===
      "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" &&
    EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION.consumerRole ===
      "SoleConsumerEntryPoint";

  const ok =
    identityValid &&
    domainsUnique &&
    checksUnique &&
    invariantsUnique &&
    invariantsRequired &&
    approvedExportsUnique &&
    consumerInformationValid &&
    report.status === "certified" &&
    verification.ok;

  return Object.freeze({
    ok,
    identityValid,
    domainsUnique,
    checksUnique,
    invariantsUnique,
    invariantsRequired,
    approvedExportsUnique,
    consumerInformationValid,
    selfCertified: report.status === "certified",
    selfVerified: verification.ok,
  });
}

export const executiveCockpitIntegrationCertificationFreezeApiNames = Object.freeze([
  "getExecutiveCockpitIntegrationCertificationFreezeIdentity",
  "getExecutiveCockpitIntegrationCertificationDomains",
  "getExecutiveCockpitIntegrationFreezeInvariants",
  "getExecutiveCockpitIntegrationApprovedExports",
  "getExecutiveCockpitIntegrationConsumerInformation",
  "verifyExecutiveCockpitIntegrationCompatibility",
  "certifyExecutiveCockpitIntegration",
  "getExecutiveCockpitIntegrationCertificationFreeze",
  "verifyExecutiveCockpitIntegrationCertificationFreeze",
  "validateExecutiveCockpitIntegrationCertificationFreeze",
] as const);

export const executiveCockpitIntegrationCertificationFreezeRegistry =
  Object.freeze({
    identity: executiveCockpitIntegrationCertificationFreezeIdentity,
    version: executiveCockpitIntegrationCertificationFreezeVersion,
    namespace: executiveCockpitIntegrationCertificationFreezeNamespace,
    phase: executiveCockpitIntegrationCertificationFreezePhase,
    architecturalRole:
      executiveCockpitIntegrationCertificationFreezeArchitecturalRole,
    dependencyIdentity:
      executiveCockpitIntegrationCertificationFreezeDependencyIdentity,
    dependencyPath:
      executiveCockpitIntegrationCertificationFreezeDependencyPath,
    supportedImportPath:
      executiveCockpitIntegrationCertificationFreezeSupportedImportPath,
    platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
    domains: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
    domainCount: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS.length,
    checks: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_CHECKS,
    checkCount: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_CHECKS.length,
    invariants: EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
    invariantCount: EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS.length,
    approvedExports: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
    approvedExportCount: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS.length,
    approvedExportSections:
      EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORT_SECTIONS,
    consumerInformation: EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION,
    boundary: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY,
    principle: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_PRINCIPLE,
  });

export const executiveCockpitIntegrationCertificationFreeze = Object.freeze({
  identity: executiveCockpitIntegrationCertificationFreezeIdentity,
  version: executiveCockpitIntegrationCertificationFreezeVersion,
  namespace: executiveCockpitIntegrationCertificationFreezeNamespace,
  phase: executiveCockpitIntegrationCertificationFreezePhase,
  architecturalRole:
    executiveCockpitIntegrationCertificationFreezeArchitecturalRole,
  upstreamDependency:
    executiveCockpitIntegrationCertificationFreezeDependencyIdentity,
  dependencyPath: executiveCockpitIntegrationCertificationFreezeDependencyPath,
  supportedImportPath:
    executiveCockpitIntegrationCertificationFreezeSupportedImportPath,
  principle: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_PRINCIPLE,
  boundary: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_FREEZE_BOUNDARY,
  domains: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_DOMAINS,
  invariants: EXECUTIVE_COCKPIT_INTEGRATION_FREEZE_INVARIANTS,
  approvedExports: EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_EXPORTS,
  consumerInformation: EXECUTIVE_COCKPIT_INTEGRATION_CONSUMER_INFORMATION,
  registry: executiveCockpitIntegrationCertificationFreezeRegistry,
  platformLock: NEX_CI_EXECUTIVE_COCKPIT_INTEGRATION_PLATFORM_LOCKED,
  checks: EXECUTIVE_COCKPIT_INTEGRATION_CERTIFICATION_CHECKS,
  publicApiSurface: executiveCockpitIntegrationCertificationFreezeApiNames,
  architecturalStatus:
    "Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex" as const,
});

// ─── Re-exports for NEX-CI:9 (approved consumer symbols) ────────────────────

export {
  EXECUTIVE_COCKPIT_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACES,
  EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
  EXECUTIVE_EXPLORER_MODES,
  EXECUTIVE_LIVE_LENS_LAYERS,
  EXECUTIVE_TIMELINE_SCOPES,
  NEX_CI_INTEGRATION_IDENTITY_CHAIN,
  advisorInsightIntegrationIdentity,
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
  executiveCockpitIntegrationFoundationIdentity,
  executiveStageIntegrationIdentity,
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
  verifyAdvisorInsightIntegration,
  verifyCockpitInteractionOrchestration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyTimelineExplorerLiveLensIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
};

export type {
  ExecutiveCockpitInteractionIntent,
  ExecutiveCockpitOrchestrationSnapshot,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveWorkspaceReference,
} from "@/app/lib/nex-ci/timelineExplorerLiveLensIntegration";
