/**
 * REX-1:7 — Runtime-enabled Executive Experience Platform.
 *
 * Composes approved REX-1:1–1:6 capabilities into one deterministic,
 * framework-neutral Runtime-enabled Executive Experience platform surface.
 *
 * Canonical flow:
 *   … → REX-1:6 Adaptive Presentation Binding → REX-1:7 Platform
 *
 * Composes and exposes. Does not render, reinvent runtime semantics, or add AI.
 */

import {
  EXECUTIVE_RUNTIME_PRESENTATION_SURFACES,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
  validateExecutiveRuntimeExperiencePresentationBinding,
  type ExecutiveRuntimeAdaptivePresentationBindingResult,
  type ExecutiveRuntimeAdvisorPresentationBinding,
  type ExecutiveRuntimeAttentionPresentation,
  type ExecutiveRuntimeExperiencePresentationBinding,
  type ExecutiveRuntimeExplorerPresentationBinding,
  type ExecutiveRuntimeFocusPresentation,
  type ExecutiveRuntimeInsightPresentationBinding,
  type ExecutiveRuntimeInteractionPresentation,
  type ExecutiveRuntimePresentationAuthority,
  type ExecutiveRuntimePresentationReadiness,
  type ExecutiveRuntimePresentationSnapshot,
  type ExecutiveRuntimePresentationState,
  type ExecutiveRuntimePresentationSubjectReference,
  type ExecutiveRuntimePresentationSurface,
  type ExecutiveRuntimeStagePresentationBinding,
  type ExecutiveRuntimeSurfacePresentationBinding,
  type ExecutiveRuntimeTimelinePresentationBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperiencePlatformIdentity =
  "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform" as const;

export const runtimeEnabledExecutiveExperiencePlatformVersion =
  "1.7.0" as const;

export const runtimeEnabledExecutiveExperiencePlatformNamespace =
  "nexora.rex.runtime-enabled-executive-experience.platform" as const;

export const runtimeEnabledExecutiveExperiencePlatformLayer = "REX" as const;

export const runtimeEnabledExecutiveExperiencePlatformPhase = "REX-1" as const;

export const runtimeEnabledExecutiveExperiencePlatformStage =
  "Platform" as const;

export const runtimeEnabledExecutiveExperiencePlatformArchitecturalRole =
  "RuntimeEnabledExecutiveExperiencePlatformBoundary" as const;

export const runtimeEnabledExecutiveExperiencePlatformDependencyIdentity =
  runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;

export const runtimeEnabledExecutiveExperiencePlatformDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding" as const;

export const runtimeEnabledExecutiveExperiencePlatformStability =
  "PlatformReady" as const;

export const runtimeEnabledExecutiveExperiencePlatformDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperiencePlatformMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    version: runtimeEnabledExecutiveExperiencePlatformVersion,
    namespace: runtimeEnabledExecutiveExperiencePlatformNamespace,
    layer: runtimeEnabledExecutiveExperiencePlatformLayer,
    phase: runtimeEnabledExecutiveExperiencePlatformPhase,
    stage: runtimeEnabledExecutiveExperiencePlatformStage,
    architecturalRole:
      runtimeEnabledExecutiveExperiencePlatformArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeEnabledExecutiveExperiencePlatformDependencyPath,
    stabilityStatus: runtimeEnabledExecutiveExperiencePlatformStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperiencePlatformSideEffectPolicy,
    mutationPolicy: runtimeEnabledExecutiveExperiencePlatformMutationPolicy,
  });

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_PRINCIPLE =
  "Composed Runtime-enabled Executive Experience Capability. The Platform composes; it does not become a second runtime engine." as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    platformAuthority: "REX-1:7" as const,
    architecturalRole:
      "RuntimeEnabledExecutiveExperiencePlatformBoundary" as const,
    soleImmediateDependency: "REX-1:6/AdaptivePresentationBinding" as const,
    consumesPresentationBindingOnly: true as const,
    importsInteractionBindingDirectly: false as const,
    importsSceneBindingDirectly: false as const,
    importsStateBindingDirectly: false as const,
    importsContractsDirectly: false as const,
    importsFoundationDirectly: false as const,
    importsExDriDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    composesRatherThanReinvents: true as const,
    recalculatesFocus: false as const,
    recalculatesAttention: false as const,
    independentlyResolvesPresentation: false as const,
    executesInteraction: false as const,
    calculatesSceneLayout: false as const,
    fabricatesActiveSubject: false as const,
    fabricatesActiveSurface: false as const,
    isFinalPublicConsumerIndex: false as const,
  });

// ─── Capabilities / status / issues ─────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES =
  Object.freeze([
    "runtime-context",
    "runtime-state",
    "scene-binding",
    "interaction-binding",
    "adaptive-presentation",
    "surface-readiness",
    "subject-readiness",
    "runtime-authority",
    "experience-snapshot",
  ] as const);

export type RuntimeEnabledExecutiveExperiencePlatformCapability =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES =
  EXECUTIVE_RUNTIME_PRESENTATION_SURFACES;

export type RuntimeEnabledExecutiveExperiencePlatformSurface =
  ExecutiveRuntimePresentationSurface;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES =
  Object.freeze([
    "ready",
    "partial",
    "unavailable",
    "invalid",
  ] as const);

export type RuntimeEnabledExecutiveExperiencePlatformStatus =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES =
  Object.freeze([
    "missing-presentation-binding",
    "missing-runtime-authority",
    "missing-active-context",
    "surface-unavailable",
    "scene-unavailable",
    "interaction-unavailable",
    "presentation-unavailable",
    "readiness-incomplete",
    "invalid-surface-state",
    "invalid-platform-input",
  ] as const);

export type RuntimeEnabledExecutiveExperiencePlatformIssueCode =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES)[number];

export interface RuntimeEnabledExecutiveExperiencePlatformIssue {
  readonly code: RuntimeEnabledExecutiveExperiencePlatformIssueCode;
  readonly message: string;
  readonly path?: string;
}

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ORDERING_RULE =
  "preserve-upstream-collection-order" as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPOSITION_RULE =
  "compose-already-approved-rex-behavior" as const;

// ─── Capability registry vocabulary ─────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY =
  Object.freeze([
    "RuntimeContext",
    "RuntimeState",
    "SurfaceState",
    "Scene",
    "Interaction",
    "Presentation",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "CrossSurfaceContext",
    "Readiness",
    "RuntimeAuthority",
    "Snapshot",
    "Validation",
  ] as const);

export type RuntimeEnabledExecutiveExperiencePlatformCapabilityRegistryEntry =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES =
  Object.freeze([
    "composeRuntimeEnabledExecutiveExperiencePlatform",
    "resolveRuntimeEnabledExecutiveExperiencePlatformReadiness",
    "createRuntimeEnabledExecutiveExperiencePlatformSnapshot",
    "bindRuntimeEnabledExecutiveSurfacePlatformState",
    "validateRuntimeEnabledExecutiveExperiencePlatformInput",
    "validateRuntimeEnabledExecutiveExperiencePlatform",
    "isRuntimeEnabledExecutiveExperiencePlatformCapability",
    "verifyRuntimeEnabledExecutiveExperiencePlatform",
    "getRuntimeEnabledExecutiveExperiencePlatformIdentity",
  ] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export type RuntimeEnabledExecutivePlatformAuthority =
  ExecutiveRuntimePresentationAuthority;

export interface RuntimeEnabledExecutiveExperiencePlatformReadiness {
  readonly runtimeReady: boolean;
  readonly contextReady: boolean;
  readonly stateReady: boolean;
  readonly sceneReady: boolean;
  readonly interactionReady: boolean;
  readonly presentationReady: boolean;
  readonly surfacesReady: boolean;
  readonly subjectReady: boolean;
  readonly authorityReady: boolean;
  readonly overallReady: boolean;
}

export interface RuntimeEnabledExecutiveSurfacePlatformState {
  readonly surface: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly activation?: "inactive" | "eligible" | "activated";
  readonly availability?: "unavailable" | "available" | "ready";
  readonly readiness: boolean;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly sceneRelationship?: "stage-scene" | "none";
  readonly interactionRelationship?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationRelationship?: ExecutiveRuntimeSurfacePresentationBinding;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveStagePlatform {
  readonly surface: "stage";
  readonly readiness: boolean;
  readonly scenePresent: boolean;
  readonly activeSceneSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly focus?: ExecutiveRuntimeFocusPresentation;
  readonly attention?: ExecutiveRuntimeAttentionPresentation;
  readonly interaction?: ExecutiveRuntimeInteractionPresentation;
  readonly presentation?: ExecutiveRuntimeStagePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveAdvisorPlatform {
  readonly surface: "advisor";
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly contextId?: string;
  readonly interactionAvailable: boolean;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly presentation?: ExecutiveRuntimeAdvisorPresentationBinding;
  readonly readiness: boolean;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveInsightPlatform {
  readonly surface: "insight";
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly selectedMetricId?: string;
  readonly interaction?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly presentation?: ExecutiveRuntimeInsightPresentationBinding;
  readonly readiness: boolean;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveTimelinePlatform {
  readonly surface: "timeline";
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly interaction?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly presentation?: ExecutiveRuntimeTimelinePresentationBinding;
  readonly readiness: boolean;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveExplorerPlatform {
  readonly surface: "explorer";
  readonly collectionContextId?: string;
  readonly selectedSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly interaction?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly presentation?: ExecutiveRuntimeExplorerPresentationBinding;
  readonly readiness: boolean;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}

export interface RuntimeEnabledExecutiveCrossSurfaceContext {
  readonly activeSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly sourceSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly targetSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly sharedSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly interactionRelationship?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationRelationship?: ExecutiveRuntimeSurfacePresentationBinding;
  readonly runtimeContextReference?: string;
  readonly readiness: boolean;
}

export interface RuntimeEnabledExecutiveExperiencePlatformCompatibility {
  readonly upstreamRexIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly upstreamRexVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
  readonly runtimeAuthorityRelationship: "EX-DRI → REX";
  readonly surfaces: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformSurface>;
  readonly presentationCompatible: true;
  readonly interactionCompatible: true;
  readonly sceneCompatible: true;
  readonly frameworkNeutral: true;
}

export interface RuntimeEnabledExecutiveExperiencePlatformConsumerContract {
  readonly supportedPlatformIdentity: typeof runtimeEnabledExecutiveExperiencePlatformIdentity;
  readonly supportedVersion: typeof runtimeEnabledExecutiveExperiencePlatformVersion;
  readonly capabilities: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformCapability>;
  readonly canonicalSurfaces: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformSurface>;
  readonly runtimeAuthoritySource: "EX-DRI → REX";
  readonly frameworkNeutral: true;
  readonly consumerRole: "PlatformConsumerSurface";
  readonly isFinalPublicConsumerIndex: false;
}

export interface RuntimeEnabledExecutiveExperiencePlatformInput {
  readonly presentationSnapshot?: ExecutiveRuntimePresentationSnapshot;
  readonly presentationBindingResult?: ExecutiveRuntimeAdaptivePresentationBindingResult;
  readonly experiencePresentation?: ExecutiveRuntimeExperiencePresentationBinding;
}

export interface RuntimeEnabledExecutiveExperiencePlatform {
  readonly identity: typeof runtimeEnabledExecutiveExperiencePlatformIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperiencePlatformVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperiencePlatformNamespace;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
  readonly readiness: RuntimeEnabledExecutiveExperiencePlatformReadiness;
  readonly experiencePresentation: ExecutiveRuntimeExperiencePresentationBinding;
  readonly surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationBinding>;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly presentationSnapshot?: ExecutiveRuntimePresentationSnapshot;
  readonly surfaceStates: ReadonlyArray<RuntimeEnabledExecutiveSurfacePlatformState>;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly activeSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly stage?: RuntimeEnabledExecutiveStagePlatform;
  readonly advisor?: RuntimeEnabledExecutiveAdvisorPlatform;
  readonly insight?: RuntimeEnabledExecutiveInsightPlatform;
  readonly timeline?: RuntimeEnabledExecutiveTimelinePlatform;
  readonly explorer?: RuntimeEnabledExecutiveExplorerPlatform;
  readonly crossSurfaceContext?: RuntimeEnabledExecutiveCrossSurfaceContext;
  readonly capabilities: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformCapability>;
  readonly capabilityRegistry: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformCapabilityRegistryEntry>;
  readonly compatibility: RuntimeEnabledExecutiveExperiencePlatformCompatibility;
  readonly consumerContract: RuntimeEnabledExecutiveExperiencePlatformConsumerContract;
  readonly upstreamIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly upstreamVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
  readonly sourceVersion: RuntimeEnabledExecutivePlatformAuthority["sourceVersion"];
}

export interface RuntimeEnabledExecutiveExperiencePlatformResult {
  readonly status: RuntimeEnabledExecutiveExperiencePlatformStatus;
  readonly platform?: RuntimeEnabledExecutiveExperiencePlatform;
  readonly issues: ReadonlyArray<RuntimeEnabledExecutiveExperiencePlatformIssue>;
  readonly readiness: RuntimeEnabledExecutiveExperiencePlatformReadiness;
  readonly sourceIdentity: typeof runtimeEnabledExecutiveExperiencePlatformIdentity;
  readonly sourceVersion: typeof runtimeEnabledExecutiveExperiencePlatformVersion;
  readonly upstreamIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly upstreamVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
}

export interface RuntimeEnabledExecutiveExperiencePlatformSnapshot {
  readonly snapshotId: string;
  readonly platformIdentity: typeof runtimeEnabledExecutiveExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeEnabledExecutiveExperiencePlatformVersion;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly activeSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly experiencePresentation: ExecutiveRuntimeExperiencePresentationBinding;
  readonly surfaceStates: ReadonlyArray<RuntimeEnabledExecutiveSurfacePlatformState>;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly presentationSnapshot?: ExecutiveRuntimePresentationSnapshot;
  readonly readiness: RuntimeEnabledExecutiveExperiencePlatformReadiness;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
  readonly sourceVersion: RuntimeEnabledExecutivePlatformAuthority["sourceVersion"];
  readonly crossSurfaceContext?: RuntimeEnabledExecutiveCrossSurfaceContext;
  readonly timestampIso?: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "depends-only-on-rex-1-6",
      order: 1,
      statement: "REX-1:7 depends only on REX-1:6.",
    }),
    Object.freeze({
      id: "composes-rather-than-reinvents",
      order: 2,
      statement: "The platform composes rather than reinvents upstream semantics.",
    }),
    Object.freeze({
      id: "runtime-authority-ex-dri-originated",
      order: 3,
      statement: "Runtime authority remains EX-DRI-originated.",
    }),
    Object.freeze({
      id: "focus-never-recalculated",
      order: 4,
      statement: "Focus is never recalculated.",
    }),
    Object.freeze({
      id: "attention-never-recalculated",
      order: 5,
      statement: "Attention is never recalculated.",
    }),
    Object.freeze({
      id: "presentation-never-independently-resolved",
      order: 6,
      statement: "Presentation is never independently resolved.",
    }),
    Object.freeze({
      id: "interactions-never-executed",
      order: 7,
      statement: "Interactions are never executed.",
    }),
    Object.freeze({
      id: "scene-layout-never-calculated",
      order: 8,
      statement: "Scene layout is never calculated.",
    }),
    Object.freeze({
      id: "active-subject-never-fabricated",
      order: 9,
      statement: "Active subject is never fabricated.",
    }),
    Object.freeze({
      id: "active-surface-never-fabricated",
      order: 10,
      statement: "Active surface is never fabricated.",
    }),
    Object.freeze({
      id: "readiness-from-explicit-bound-state",
      order: 11,
      statement: "Platform readiness is based only on explicit bound state.",
    }),
    Object.freeze({
      id: "canonical-surface-order-preserved",
      order: 12,
      statement: "Canonical surface order is preserved.",
    }),
    Object.freeze({
      id: "subject-identity-preserved",
      order: 13,
      statement: "Subject identity is preserved.",
    }),
    Object.freeze({
      id: "surface-identity-preserved",
      order: 14,
      statement: "Surface identity is preserved.",
    }),
    Object.freeze({
      id: "cross-surface-representational",
      order: 15,
      statement: "Cross-surface context remains representational.",
    }),
    Object.freeze({
      id: "platform-functions-deterministic",
      order: 16,
      statement: "Platform functions are deterministic.",
    }),
    Object.freeze({
      id: "no-caller-input-mutation",
      order: 17,
      statement: "Caller-owned inputs are never mutated.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 18,
      statement: "No React dependency is introduced.",
    }),
    Object.freeze({
      id: "no-threejs-dependency",
      order: 19,
      statement: "No Three.js dependency is introduced.",
    }),
    Object.freeze({
      id: "no-renderer-dependency",
      order: 20,
      statement: "No renderer dependency is introduced.",
    }),
    Object.freeze({
      id: "no-navigation",
      order: 21,
      statement: "No navigation is introduced.",
    }),
    Object.freeze({
      id: "no-ai-reasoning",
      order: 22,
      statement: "No AI reasoning is introduced.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 23,
      statement: "No KPI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 24,
      statement: "No KOI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-persistence",
      order: 25,
      statement: "No persistence is introduced.",
    }),
    Object.freeze({
      id: "no-networking",
      order: 26,
      statement: "No networking is introduced.",
    }),
    Object.freeze({
      id: "no-global-store",
      order: 27,
      statement: "No global store is introduced.",
    }),
    Object.freeze({
      id: "no-event-bus",
      order: 28,
      statement: "No event bus is introduced.",
    }),
    Object.freeze({
      id: "framework-neutral",
      order: 29,
      statement: "The platform remains framework-neutral.",
    }),
    Object.freeze({
      id: "not-final-public-consumer-index",
      order: 30,
      statement: "REX-1:7 is not yet the final public consumer index.",
    }),
  ] as const);

export type RuntimeEnabledExecutiveExperiencePlatformGuarantee =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React integration",
    "Executive Stage renderer",
    "Three.js scene integration",
    "object positioning",
    "camera behavior",
    "animation",
    "pointer/click handling",
    "Live Lens",
    "Advisor AI behavior",
    "Insight chart generation",
    "Timeline replay",
    "Explorer data fetching",
    "scenario workflow",
    "decision workflow",
    "execution workflow",
    "agents",
    "external data connectors",
    "Director behavior",
    "focus recalculation",
    "attention recalculation",
    "presentation resolution",
    "interaction execution",
    "KPI calculation",
    "KOI calculation",
    "persistence",
    "networking",
    "global store",
    "event bus",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Capabilities",
    "Platform",
    "Input",
    "Result",
    "Status",
    "Readiness",
    "SurfaceState",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "CrossSurfaceContext",
    "RuntimeAuthority",
    "Compatibility",
    "Snapshot",
    "APIs",
    "Issues",
    "Validation",
    "ConsumerContract",
    "Guarantees",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY =
  Object.freeze({
    upstreamRexIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    upstreamRexVersion:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    runtimeAuthorityRelationship: "EX-DRI → REX" as const,
    surfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
    presentationCompatible: true as const,
    interactionCompatible: true as const,
    sceneCompatible: true as const,
    frameworkNeutral: true as const,
  });

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT =
  Object.freeze({
    supportedPlatformIdentity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    supportedVersion: runtimeEnabledExecutiveExperiencePlatformVersion,
    capabilities: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
    canonicalSurfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
    runtimeAuthoritySource: "EX-DRI → REX" as const,
    frameworkNeutral: true as const,
    consumerRole: "PlatformConsumerSurface" as const,
    isFinalPublicConsumerIndex: false as const,
  });

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: RuntimeEnabledExecutiveExperiencePlatformIssueCode,
  message: string,
  path?: string,
): RuntimeEnabledExecutiveExperiencePlatformIssue {
  return Object.freeze({
    code,
    message,
    ...(path !== undefined ? { path } : {}),
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezeSubject(
  subject: ExecutiveRuntimePresentationSubjectReference,
): ExecutiveRuntimePresentationSubjectReference {
  return Object.freeze({
    kind: subject.kind,
    id: subject.id,
    ...(subject.label !== undefined ? { label: subject.label } : {}),
    ...(subject.parentId !== undefined ? { parentId: subject.parentId } : {}),
    ...(subject.sourceVersion !== undefined
      ? { sourceVersion: subject.sourceVersion }
      : {}),
  });
}

function resolvePresentationContext(
  input: RuntimeEnabledExecutiveExperiencePlatformInput,
): {
  readonly snapshot?: ExecutiveRuntimePresentationSnapshot;
  readonly result?: ExecutiveRuntimeAdaptivePresentationBindingResult;
  readonly experience?: ExecutiveRuntimeExperiencePresentationBinding;
  readonly surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationBinding>;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly activeSurface?: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly authority?: RuntimeEnabledExecutivePlatformAuthority;
  readonly presentationReadiness?: ExecutiveRuntimePresentationReadiness;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
} {
  const snapshot = input.presentationSnapshot;
  const result = input.presentationBindingResult;
  const experience =
    input.experiencePresentation ??
    snapshot?.experiencePresentation ??
    result?.experiencePresentation;
  const surfacePresentations =
    snapshot?.surfacePresentations ??
    result?.surfacePresentations ??
    experience?.surfacePresentations ??
    [];
  return {
    snapshot,
    result,
    experience,
    surfacePresentations,
    activeSubject:
      snapshot?.activeSubject ?? experience?.activeSubject,
    activeSurface:
      snapshot?.activeSurface ?? experience?.activeSurface,
    authority: snapshot?.authority ?? experience?.authority,
    presentationReadiness: snapshot?.readiness ?? experience?.readiness,
    interactionPresentation:
      snapshot?.interactionPresentation ?? experience?.interactionPresentation,
    focusPresentation:
      snapshot?.focusPresentation ?? experience?.focusPresentation,
    attentionPresentation:
      snapshot?.attentionPresentation ?? experience?.attentionPresentation,
  };
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function isRuntimeEnabledExecutiveExperiencePlatformCapability(
  value: unknown,
): value is RuntimeEnabledExecutiveExperiencePlatformCapability {
  return (
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeEnabledExecutiveExperiencePlatformStatus(
  value: unknown,
): value is RuntimeEnabledExecutiveExperiencePlatformStatus {
  return (
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES as readonly unknown[]
  ).includes(value);
}

export function validateRuntimeEnabledExecutiveExperiencePlatformInput(
  value: unknown,
): value is RuntimeEnabledExecutiveExperiencePlatformInput {
  if (!isPlainObject(value)) return false;
  const hasSnapshot = value.presentationSnapshot !== undefined;
  const hasResult = value.presentationBindingResult !== undefined;
  const hasExperience = value.experiencePresentation !== undefined;
  if (!hasSnapshot && !hasResult && !hasExperience) return false;
  if (
    hasExperience &&
    !validateExecutiveRuntimeExperiencePresentationBinding(
      value.experiencePresentation,
    )
  ) {
    return false;
  }
  if (
    hasSnapshot &&
    (!isPlainObject(value.presentationSnapshot) ||
      !isNonEmptyString(
        (value.presentationSnapshot as { snapshotId?: unknown }).snapshotId,
      ))
  ) {
    return false;
  }
  return true;
}

export function validateRuntimeEnabledExecutiveExperiencePlatform(
  value: unknown,
): value is RuntimeEnabledExecutiveExperiencePlatform {
  if (!isPlainObject(value)) return false;
  return (
    value.identity === runtimeEnabledExecutiveExperiencePlatformIdentity &&
    value.version === runtimeEnabledExecutiveExperiencePlatformVersion &&
    value.namespace === runtimeEnabledExecutiveExperiencePlatformNamespace &&
    value.authority !== undefined &&
    isPlainObject(value.readiness) &&
    validateExecutiveRuntimeExperiencePresentationBinding(
      value.experiencePresentation,
    ) &&
    Array.isArray(value.surfaceStates) &&
    Array.isArray(value.capabilities)
  );
}

// ─── Readiness / surface binding ────────────────────────────────────────────

export function resolveRuntimeEnabledExecutiveExperiencePlatformReadiness(input: {
  readonly presentationReadiness?: ExecutiveRuntimePresentationReadiness;
  readonly authorityReady: boolean;
  readonly experiencePresent: boolean;
  readonly subjectReady: boolean;
  readonly surfacesReady: boolean;
  readonly sceneReady: boolean;
  readonly interactionReady: boolean;
  readonly presentationReady: boolean;
}): RuntimeEnabledExecutiveExperiencePlatformReadiness {
  const runtimeReady = input.presentationReadiness?.runtimeReady === true;
  const contextReady = input.presentationReadiness?.contextReady === true;
  const stateReady = input.experiencePresent;
  const overallReady =
    runtimeReady &&
    contextReady &&
    stateReady &&
    input.authorityReady &&
    input.presentationReady &&
    input.sceneReady &&
    input.interactionReady;

  return Object.freeze({
    runtimeReady,
    contextReady,
    stateReady,
    sceneReady: input.sceneReady,
    interactionReady: input.interactionReady,
    presentationReady: input.presentationReady,
    surfacesReady: input.surfacesReady,
    subjectReady: input.subjectReady,
    authorityReady: input.authorityReady,
    overallReady,
  });
}

export function bindRuntimeEnabledExecutiveSurfacePlatformState(input: {
  readonly surface: RuntimeEnabledExecutiveExperiencePlatformSurface;
  readonly presentation?: ExecutiveRuntimeSurfacePresentationBinding;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveSurfacePlatformState {
  if (
    !(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES as readonly string[]
    ).includes(input.surface)
  ) {
    throw new TypeError("surface is not a canonical Executive Experience surface");
  }

  // Do not invent activation/availability — REX-1:6 does not carry those
  // surface lifecycle fields. Readiness reflects explicit presentation presence.
  const presentationPresent = input.presentation !== undefined;
  const interactionTouchesSurface =
    input.interactionPresentation !== undefined &&
    (input.interactionPresentation.sourceSurface === input.surface ||
      input.interactionPresentation.targetSurface === input.surface);

  return Object.freeze({
    surface: input.surface,
    readiness: presentationPresent,
    authority: input.authority,
    sceneRelationship:
      input.surface === "stage" ? ("stage-scene" as const) : ("none" as const),
    ...(input.activeSubject !== undefined ||
    input.presentation?.activeSubject !== undefined
      ? {
          activeSubject: freezeSubject(
            input.activeSubject ?? input.presentation!.activeSubject!,
          ),
        }
      : {}),
    ...(interactionTouchesSurface
      ? { interactionRelationship: input.interactionPresentation }
      : {}),
    ...(input.presentation !== undefined
      ? { presentationRelationship: input.presentation }
      : {}),
    ...(input.presentation?.presentationState !== undefined
      ? { presentationState: input.presentation.presentationState }
      : {}),
  });
}

function bindStagePlatform(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveStagePlatform {
  const stage = input.experience.stage;
  return Object.freeze({
    surface: "stage" as const,
    readiness: stage?.readiness.overallReady === true || stage !== undefined,
    scenePresent: stage !== undefined,
    authority: input.authority,
    ...(stage?.activeSubjectPresentation?.subject !== undefined
      ? {
          activeSceneSubject: freezeSubject(
            stage.activeSubjectPresentation.subject,
          ),
        }
      : input.experience.activeSubject !== undefined
        ? { activeSceneSubject: freezeSubject(input.experience.activeSubject) }
        : {}),
    ...(input.experience.focusPresentation !== undefined
      ? { focus: input.experience.focusPresentation }
      : {}),
    ...(input.experience.attentionPresentation !== undefined
      ? { attention: input.experience.attentionPresentation }
      : {}),
    ...(input.experience.interactionPresentation !== undefined
      ? { interaction: input.experience.interactionPresentation }
      : {}),
    ...(stage !== undefined ? { presentation: stage } : {}),
  });
}

function bindAdvisorPlatform(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveAdvisorPlatform {
  const advisor = input.experience.advisor;
  return Object.freeze({
    surface: "advisor" as const,
    interactionAvailable: advisor?.interactionReady === true,
    readiness: advisor?.readiness.overallReady === true || advisor !== undefined,
    authority: input.authority,
    ...(advisor?.activeSubject !== undefined
      ? { activeSubject: freezeSubject(advisor.activeSubject) }
      : input.experience.activeSubject !== undefined
        ? { activeSubject: freezeSubject(input.experience.activeSubject) }
        : {}),
    ...(advisor?.contextId !== undefined ? { contextId: advisor.contextId } : {}),
    ...(advisor?.presentationState !== undefined
      ? { presentationState: advisor.presentationState }
      : {}),
    ...(advisor !== undefined ? { presentation: advisor } : {}),
  });
}

function bindInsightPlatform(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveInsightPlatform {
  const insight = input.experience.insight;
  return Object.freeze({
    surface: "insight" as const,
    readiness: insight?.readiness.overallReady === true || insight !== undefined,
    authority: input.authority,
    ...(insight?.activeSubject !== undefined
      ? { activeSubject: freezeSubject(insight.activeSubject) }
      : input.experience.activeSubject !== undefined
        ? { activeSubject: freezeSubject(input.experience.activeSubject) }
        : {}),
    ...(insight?.selectedMetricId !== undefined
      ? { selectedMetricId: insight.selectedMetricId }
      : {}),
    ...(input.experience.interactionPresentation !== undefined
      ? { interaction: input.experience.interactionPresentation }
      : {}),
    ...(insight?.presentationState !== undefined
      ? { presentationState: insight.presentationState }
      : {}),
    ...(insight !== undefined ? { presentation: insight } : {}),
  });
}

function bindTimelinePlatform(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveTimelinePlatform {
  const timeline = input.experience.timeline;
  return Object.freeze({
    surface: "timeline" as const,
    readiness:
      timeline?.readiness.overallReady === true || timeline !== undefined,
    authority: input.authority,
    ...(timeline?.temporalContextId !== undefined
      ? { temporalContextId: timeline.temporalContextId }
      : {}),
    ...(timeline?.selectedPackId !== undefined
      ? { selectedPackId: timeline.selectedPackId }
      : {}),
    ...(input.experience.interactionPresentation !== undefined
      ? { interaction: input.experience.interactionPresentation }
      : {}),
    ...(timeline?.presentationState !== undefined
      ? { presentationState: timeline.presentationState }
      : {}),
    ...(timeline !== undefined ? { presentation: timeline } : {}),
  });
}

function bindExplorerPlatform(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly authority: RuntimeEnabledExecutivePlatformAuthority;
}): RuntimeEnabledExecutiveExplorerPlatform {
  const explorer = input.experience.explorer;
  return Object.freeze({
    surface: "explorer" as const,
    readiness:
      explorer?.readiness.overallReady === true || explorer !== undefined,
    authority: input.authority,
    ...(explorer?.collectionContextId !== undefined
      ? { collectionContextId: explorer.collectionContextId }
      : {}),
    ...(explorer?.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(explorer.selectedSubject) }
      : input.experience.activeSubject !== undefined
        ? { selectedSubject: freezeSubject(input.experience.activeSubject) }
        : {}),
    ...(input.experience.interactionPresentation !== undefined
      ? { interaction: input.experience.interactionPresentation }
      : {}),
    ...(explorer?.presentationState !== undefined
      ? { presentationState: explorer.presentationState }
      : {}),
    ...(explorer !== undefined ? { presentation: explorer } : {}),
  });
}

function bindCrossSurfaceContext(input: {
  readonly experience: ExecutiveRuntimeExperiencePresentationBinding;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
}): RuntimeEnabledExecutiveCrossSurfaceContext {
  const activeSurface = input.experience.activeSurface;
  const sourceSurface = input.interactionPresentation?.sourceSurface;
  const targetSurface = input.interactionPresentation?.targetSurface;
  const sharedSubject = input.experience.activeSubject;
  const presentationRelationship = input.experience.surfacePresentations.find(
    (entry) => entry.surface === activeSurface,
  );

  return Object.freeze({
    readiness:
      activeSurface !== undefined ||
      input.interactionPresentation !== undefined,
    ...(activeSurface !== undefined ? { activeSurface } : {}),
    ...(sourceSurface !== undefined ? { sourceSurface } : {}),
    ...(targetSurface !== undefined ? { targetSurface } : {}),
    ...(sharedSubject !== undefined
      ? { sharedSubject: freezeSubject(sharedSubject) }
      : {}),
    ...(input.interactionPresentation !== undefined
      ? { interactionRelationship: input.interactionPresentation }
      : {}),
    ...(presentationRelationship !== undefined
      ? { presentationRelationship }
      : {}),
    ...(input.interactionPresentation?.interactionId !== undefined
      ? {
          runtimeContextReference:
            input.interactionPresentation.interactionId,
        }
      : {}),
  });
}

// ─── Composition ────────────────────────────────────────────────────────────

export function composeRuntimeEnabledExecutiveExperiencePlatform(
  input: RuntimeEnabledExecutiveExperiencePlatformInput,
): RuntimeEnabledExecutiveExperiencePlatformResult {
  const context = resolvePresentationContext(input);
  const issues: RuntimeEnabledExecutiveExperiencePlatformIssue[] = [];

  if (
    context.snapshot === undefined &&
    context.result === undefined &&
    context.experience === undefined
  ) {
    issues.push(
      issue(
        "missing-presentation-binding",
        "presentation snapshot, binding result, or experience presentation is required",
        "presentationSnapshot",
      ),
    );
    issues.push(
      issue(
        "invalid-platform-input",
        "platform input does not contain an approved REX-1:6 structure",
        "input",
      ),
    );
  }

  if (
    context.authority === undefined ||
    context.authority.relationship !== "EX-DRI → REX"
  ) {
    issues.push(
      issue(
        "missing-runtime-authority",
        "runtime authority must preserve EX-DRI → REX",
        "authority",
      ),
    );
  }

  if (
    context.experience !== undefined &&
    !validateExecutiveRuntimeExperiencePresentationBinding(context.experience)
  ) {
    issues.push(
      issue(
        "invalid-platform-input",
        "experience presentation binding is structurally invalid",
        "experiencePresentation",
      ),
    );
  }

  const emptyReadiness = Object.freeze({
    runtimeReady: false,
    contextReady: false,
    stateReady: false,
    sceneReady: false,
    interactionReady: false,
    presentationReady: false,
    surfacesReady: false,
    subjectReady: false,
    authorityReady: false,
    overallReady: false,
  });

  if (
    issues.some((entry) =>
      (
        [
          "missing-presentation-binding",
          "missing-runtime-authority",
          "invalid-platform-input",
        ] as readonly RuntimeEnabledExecutiveExperiencePlatformIssueCode[]
      ).includes(entry.code),
    )
  ) {
    return Object.freeze({
      status: "invalid" as const,
      issues: Object.freeze(issues),
      readiness: emptyReadiness,
      sourceIdentity: runtimeEnabledExecutiveExperiencePlatformIdentity,
      sourceVersion: runtimeEnabledExecutiveExperiencePlatformVersion,
      upstreamIdentity:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
      upstreamVersion:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    });
  }

  const experience = context.experience!;
  const authority = context.authority!;

  if (context.activeSubject === undefined && context.activeSurface === undefined) {
    issues.push(
      issue(
        "missing-active-context",
        "neither active subject nor active surface was available",
        "activeContext",
      ),
    );
  }

  if (experience.stage === undefined) {
    issues.push(
      issue(
        "scene-unavailable",
        "Stage/scene presentation was not available on experience presentation",
        "stage",
      ),
    );
  }

  if (context.interactionPresentation === undefined) {
    issues.push(
      issue(
        "interaction-unavailable",
        "interaction presentation was not available",
        "interactionPresentation",
      ),
    );
  }

  if (experience.presentationState === undefined) {
    issues.push(
      issue(
        "presentation-unavailable",
        "experience presentation state was not available",
        "presentationState",
      ),
    );
  }

  const surfaceStates = Object.freeze(
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES.map((surface) => {
      const presentation = context.surfacePresentations.find(
        (entry) => entry.surface === surface,
      );
      if (presentation === undefined) {
        issues.push(
          issue(
            "surface-unavailable",
            `surface presentation unavailable for ${surface}`,
            `surfaceStates.${surface}`,
          ),
        );
      } else if (
        presentation.surface !== surface ||
        presentation.authority.relationship !== "EX-DRI → REX"
      ) {
        issues.push(
          issue(
            "invalid-surface-state",
            `surface state for ${surface} is structurally inconsistent`,
            `surfaceStates.${surface}`,
          ),
        );
      }
      return bindRuntimeEnabledExecutiveSurfacePlatformState({
        surface,
        presentation,
        interactionPresentation: context.interactionPresentation,
        activeSubject: context.activeSubject,
        authority,
      });
    }),
  );

  if (
    issues.some((entry) => entry.code === "invalid-surface-state")
  ) {
    return Object.freeze({
      status: "invalid" as const,
      issues: Object.freeze(issues),
      readiness: emptyReadiness,
      sourceIdentity: runtimeEnabledExecutiveExperiencePlatformIdentity,
      sourceVersion: runtimeEnabledExecutiveExperiencePlatformVersion,
      upstreamIdentity:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
      upstreamVersion:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    });
  }

  const sceneReady = experience.stage !== undefined;
  const interactionReady =
    context.presentationReadiness?.interactionReady === true ||
    context.interactionPresentation !== undefined;
  const presentationReady =
    context.presentationReadiness?.presentationReady === true ||
    experience.presentationState !== undefined;
  const surfacesReady = surfaceStates.every((entry) => entry.readiness);
  const subjectReady = context.activeSubject !== undefined;
  const authorityReady = authority.relationship === "EX-DRI → REX";

  const readiness = resolveRuntimeEnabledExecutiveExperiencePlatformReadiness({
    presentationReadiness: context.presentationReadiness,
    authorityReady,
    experiencePresent: true,
    subjectReady,
    surfacesReady,
    sceneReady,
    interactionReady,
    presentationReady,
  });

  if (!readiness.overallReady) {
    issues.push(
      issue(
        "readiness-incomplete",
        "one or more required platform readiness fields are not explicitly ready",
        "readiness",
      ),
    );
  }

  const stage = bindStagePlatform({ experience, authority });
  const advisor = bindAdvisorPlatform({ experience, authority });
  const insight = bindInsightPlatform({ experience, authority });
  const timeline = bindTimelinePlatform({ experience, authority });
  const explorer = bindExplorerPlatform({ experience, authority });
  const crossSurfaceContext = bindCrossSurfaceContext({
    experience,
    interactionPresentation: context.interactionPresentation,
  });

  const platform: RuntimeEnabledExecutiveExperiencePlatform = Object.freeze({
    identity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    version: runtimeEnabledExecutiveExperiencePlatformVersion,
    namespace: runtimeEnabledExecutiveExperiencePlatformNamespace,
    authority,
    readiness,
    experiencePresentation: experience,
    surfacePresentations: Object.freeze([...context.surfacePresentations]),
    surfaceStates,
    capabilities: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
    capabilityRegistry:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
    compatibility: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
    consumerContract:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
    upstreamIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    upstreamVersion:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    sourceVersion: authority.sourceVersion,
    stage,
    advisor,
    insight,
    timeline,
    explorer,
    crossSurfaceContext,
    ...(context.interactionPresentation !== undefined
      ? { interactionPresentation: context.interactionPresentation }
      : {}),
    ...(context.focusPresentation !== undefined
      ? { focusPresentation: context.focusPresentation }
      : {}),
    ...(context.attentionPresentation !== undefined
      ? { attentionPresentation: context.attentionPresentation }
      : {}),
    ...(context.snapshot !== undefined
      ? { presentationSnapshot: context.snapshot }
      : {}),
    ...(context.activeSubject !== undefined
      ? { activeSubject: freezeSubject(context.activeSubject) }
      : {}),
    ...(context.activeSurface !== undefined
      ? { activeSurface: context.activeSurface }
      : {}),
  });

  const runtimeUnavailable =
    context.presentationReadiness?.runtimeReady === false ||
    context.result?.status === "unavailable";

  const status: RuntimeEnabledExecutiveExperiencePlatformStatus =
    runtimeUnavailable
      ? "unavailable"
      : !readiness.overallReady || issues.length > 0
        ? "partial"
        : "ready";

  return Object.freeze({
    status,
    platform,
    issues: Object.freeze(issues),
    readiness,
    sourceIdentity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    sourceVersion: runtimeEnabledExecutiveExperiencePlatformVersion,
    upstreamIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    upstreamVersion:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
  });
}

export function createRuntimeEnabledExecutiveExperiencePlatformSnapshot(input: {
  readonly snapshotId: string;
  readonly result: RuntimeEnabledExecutiveExperiencePlatformResult;
  readonly timestampIso?: string;
}): RuntimeEnabledExecutiveExperiencePlatformSnapshot {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  if (
    input.result.platform === undefined ||
    !validateRuntimeEnabledExecutiveExperiencePlatform(input.result.platform)
  ) {
    throw new TypeError("platform is required for snapshot creation");
  }

  const platform = input.result.platform;
  return Object.freeze({
    snapshotId: input.snapshotId,
    platformIdentity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    platformVersion: runtimeEnabledExecutiveExperiencePlatformVersion,
    experiencePresentation: platform.experiencePresentation,
    surfaceStates: platform.surfaceStates,
    readiness: platform.readiness,
    authority: platform.authority,
    sourceVersion: platform.sourceVersion,
    ...(platform.activeSubject !== undefined
      ? { activeSubject: platform.activeSubject }
      : {}),
    ...(platform.activeSurface !== undefined
      ? { activeSurface: platform.activeSurface }
      : {}),
    ...(platform.interactionPresentation !== undefined
      ? { interactionPresentation: platform.interactionPresentation }
      : {}),
    ...(platform.focusPresentation !== undefined
      ? { focusPresentation: platform.focusPresentation }
      : {}),
    ...(platform.attentionPresentation !== undefined
      ? { attentionPresentation: platform.attentionPresentation }
      : {}),
    ...(platform.presentationSnapshot !== undefined
      ? { presentationSnapshot: platform.presentationSnapshot }
      : {}),
    ...(platform.crossSurfaceContext !== undefined
      ? { crossSurfaceContext: platform.crossSurfaceContext }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperiencePlatformIdentity():
  typeof runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity {
  return runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperiencePlatformRegistry = Object.freeze({
  identity: runtimeEnabledExecutiveExperiencePlatformIdentity,
  version: runtimeEnabledExecutiveExperiencePlatformVersion,
  namespace: runtimeEnabledExecutiveExperiencePlatformNamespace,
  layer: runtimeEnabledExecutiveExperiencePlatformLayer,
  phase: runtimeEnabledExecutiveExperiencePlatformPhase,
  stage: runtimeEnabledExecutiveExperiencePlatformStage,
  dependencyIdentity:
    runtimeEnabledExecutiveExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeEnabledExecutiveExperiencePlatformDependencyPath,
  sections: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS.length,
  capabilities: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
  capabilityCount:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
  capabilityRegistry:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
  capabilityRegistryCount:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY.length,
  surfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
  surfaceCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES.length,
  statuses: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
  statusCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES.length,
  issueCodes: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES,
  issueCodeCount:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES.length,
  apis: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES,
  apiCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES.length,
  guarantees: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES,
  guaranteeCount:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.length,
  compatibility: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
  consumerContract:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
  orderingRule: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ORDERING_RULE,
  compositionRule:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPOSITION_RULE,
});

export const runtimeEnabledExecutiveExperiencePlatform = Object.freeze({
  phase: "REX-1" as const,
  name: "RuntimeEnabledExecutiveExperiencePlatform" as const,
  identity: runtimeEnabledExecutiveExperiencePlatformIdentity,
  version: runtimeEnabledExecutiveExperiencePlatformVersion,
  namespace: runtimeEnabledExecutiveExperiencePlatformNamespace,
  layer: runtimeEnabledExecutiveExperiencePlatformLayer,
  stage: runtimeEnabledExecutiveExperiencePlatformStage,
  architecturalRole:
    runtimeEnabledExecutiveExperiencePlatformArchitecturalRole,
  role: "Platform" as const,
  status: runtimeEnabledExecutiveExperiencePlatformStability,
  upstreamDependency:
    runtimeEnabledExecutiveExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeEnabledExecutiveExperiencePlatformDependencyPath,
  deterministic: runtimeEnabledExecutiveExperiencePlatformDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  composedPlatform: true as const,
  isFinalPublicConsumerIndex: false as const,
  principle: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_PRINCIPLE,
  boundary: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY,
  capabilities: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
  statuses: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
  issueCodes: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES,
  guarantees: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES,
  forbiddenResponsibilities:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_FORBIDDEN_RESPONSIBILITIES,
  capabilityRegistry:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
  publicApiSurface: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES,
  compatibility: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
  consumerContract:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
  orderingRule: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ORDERING_RULE,
  compositionRule:
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPOSITION_RULE,
  registry: runtimeEnabledExecutiveExperiencePlatformRegistry,
  presentationBindingBoundary: "REX-1:6-adaptive-presentation-binding-only" as const,
  architecturalStatus:
    "Runtime-enabled Executive Experience Platform Complete · Deterministic · Immutable · Framework-Independent · ReadyForCertificationFreeze" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeEnabledExecutiveExperiencePlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperiencePlatformIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperiencePlatformVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperiencePlatformNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperiencePlatformLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperiencePlatformPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperiencePlatformStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperiencePlatformArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperiencePlatformDependencyIdentity;
  readonly capabilityCount: number;
  readonly capabilityRegistryCount: number;
  readonly apiCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly frozen: boolean;
  readonly presentationBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly guaranteesPresent: boolean;
  readonly compositionRuleValid: boolean;
  readonly notFinalPublicIndex: boolean;
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

export function verifyRuntimeEnabledExecutiveExperiencePlatform():
  RuntimeEnabledExecutiveExperiencePlatformVerification {
  const runtimeModule = runtimeEnabledExecutiveExperiencePlatform;
  const registry = runtimeEnabledExecutiveExperiencePlatformRegistry;

  const identityOk =
    runtimeModule.identity ===
      "REX-1:7/RuntimeEnabledExecutiveExperiencePlatform" &&
    runtimeModule.version === "1.7.0" &&
    runtimeModule.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.platform" &&
    runtimeModule.layer === "REX" &&
    runtimeModule.phase === "REX-1" &&
    runtimeModule.stage === "Platform" &&
    runtimeModule.architecturalRole ===
      "RuntimeEnabledExecutiveExperiencePlatformBoundary" &&
    runtimeModule.upstreamDependency === "REX-1:6/AdaptivePresentationBinding" &&
    runtimeModule.upstreamDependency ===
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity &&
    runtimeModule.presentationBindingBoundary ===
      "REX-1:6-adaptive-presentation-binding-only" &&
    runtimeModule.isFinalPublicConsumerIndex === false;

  const dependencyOk =
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding" &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY
      .consumesPresentationBindingOnly === true &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY
      .importsInteractionBindingDirectly === false &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY
      .importsExDriDirectly === false;

  const capabilitiesOk = exactOrder(
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
    [
      "runtime-context",
      "runtime-state",
      "scene-binding",
      "interaction-binding",
      "adaptive-presentation",
      "surface-readiness",
      "subject-readiness",
      "runtime-authority",
      "experience-snapshot",
    ],
  );

  const statusesOk = exactOrder(
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
    ["ready", "partial", "unavailable", "invalid"],
  );

  const guaranteesPresent =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.length === 30 &&
    exactOrder(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.map(
        (entry) => entry.id,
      ),
      [
        "depends-only-on-rex-1-6",
        "composes-rather-than-reinvents",
        "runtime-authority-ex-dri-originated",
        "focus-never-recalculated",
        "attention-never-recalculated",
        "presentation-never-independently-resolved",
        "interactions-never-executed",
        "scene-layout-never-calculated",
        "active-subject-never-fabricated",
        "active-surface-never-fabricated",
        "readiness-from-explicit-bound-state",
        "canonical-surface-order-preserved",
        "subject-identity-preserved",
        "surface-identity-preserved",
        "cross-surface-representational",
        "platform-functions-deterministic",
        "no-caller-input-mutation",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-renderer-dependency",
        "no-navigation",
        "no-ai-reasoning",
        "no-kpi-calculation",
        "no-koi-calculation",
        "no-persistence",
        "no-networking",
        "no-global-store",
        "no-event-bus",
        "framework-neutral",
        "not-final-public-consumer-index",
      ],
    ) &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const compositionRuleValid =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPOSITION_RULE ===
    "compose-already-approved-rex-behavior";

  const immutabilityOk =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
    ) &&
    Object.isFrozen(RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES) &&
    Object.isFrozen(RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES) &&
    Object.isFrozen(RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
    ) &&
    Object.isFrozen(RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS,
    );

  const uniquenessOk =
    unique([...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES]) &&
    unique([...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_ISSUE_CODES]) &&
    unique(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.map(
        (entry) => entry.id,
      ),
    ) &&
    unique([
      ...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
    ]);

  const presentationBindingBoundaryIntact =
    runtimeModule.boundary.soleImmediateDependency ===
      "REX-1:6/AdaptivePresentationBinding" &&
    runtimeModule.boundary.consumesPresentationBindingOnly === true &&
    runtimeModule.boundary.composesRatherThanReinvents === true &&
    runtimeModule.boundary.recalculatesFocus === false &&
    runtimeModule.boundary.executesInteraction === false &&
    runtimeModule.boundary.isFinalPublicConsumerIndex === false;

  const frameworkIndependent =
    runtimeModule.frameworkIndependent === true &&
    runtimeModule.rendererIndependent === true &&
    runtimeModule.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    capabilitiesOk &&
    statusesOk &&
    guaranteesPresent &&
    compositionRuleValid &&
    immutabilityOk &&
    uniquenessOk &&
    presentationBindingBoundaryIntact &&
    frameworkIndependent &&
    runtimeModule.principle ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperiencePlatformIdentity,
    version: runtimeEnabledExecutiveExperiencePlatformVersion,
    namespace: runtimeEnabledExecutiveExperiencePlatformNamespace,
    layer: runtimeEnabledExecutiveExperiencePlatformLayer,
    phase: runtimeEnabledExecutiveExperiencePlatformPhase,
    stage: runtimeEnabledExecutiveExperiencePlatformStage,
    architecturalRole:
      runtimeEnabledExecutiveExperiencePlatformArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperiencePlatformDependencyIdentity,
    capabilityCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    capabilityRegistryCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY.length,
    apiCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES.length,
    guaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES.length,
    registrySectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_REGISTRY_SECTIONS.length,
    frozen: immutabilityOk,
    presentationBindingBoundaryIntact,
    frameworkIndependent,
    guaranteesPresent,
    compositionRuleValid,
    notFinalPublicIndex: runtimeModule.isFinalPublicConsumerIndex === false,
  });
}
