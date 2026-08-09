/**
 * REX-2:8 — Runtime Executive Stage Experience Certification & Freeze.
 *
 * Certifies, compatibility-checks, freezes, and locks the completed REX-2
 * Stage Experience platform before publication through REX-2:9 Public Index.
 *
 * Canonical flow:
 *   … → REX-2:7 Platform → REX-2:8 Certification & Freeze → REX-2:9 Public Index
 *
 * Introduces no new Stage behavior. Observes and freezes only.
 */

import {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES,
  compareRuntimeExecutiveStageExperiencePlatformPlans,
  getRuntimeExecutiveStageExperiencePlatformCapabilities,
  getRuntimeExecutiveStageExperiencePlatformIdentity,
  resolveRuntimeExecutiveStageExperience,
  runtimeExecutiveStageExperiencePlatform,
  runtimeExecutiveStageExperiencePlatformApiNames,
  runtimeExecutiveStageExperiencePlatformCanonicalIdentity,
  runtimeExecutiveStageExperiencePlatformIdentity,
  runtimeExecutiveStageExperiencePlatformLayer,
  runtimeExecutiveStageExperiencePlatformNamespace,
  runtimeExecutiveStageExperiencePlatformVersion,
  validateRuntimeExecutiveStageExperiencePlatformInput,
  validateRuntimeExecutiveStageExperiencePlatformPlan,
  verifyRuntimeExecutiveStageExperiencePlatform,
  createRuntimeExecutiveStageModel,
} from "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceCertificationFreezeIdentity =
  "REX-2:8/RuntimeExecutiveStageExperienceCertificationFreeze" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeVersion =
  "2.8.0" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeNamespace =
  "nexora.rex.stage-experience.certification-freeze" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeLayer =
  "REX" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeDomain =
  "Runtime Executive Stage Experience" as const;

export const runtimeExecutiveStageExperienceCertificationFreezePhase =
  "CertificationFreeze" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeRole =
  "CertificationAndFreezeBoundary" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeArchitecturalRole =
  "RuntimeExecutiveStageExperienceCertificationFreezeBoundary" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity =
  runtimeExecutiveStageExperiencePlatformIdentity;

export const runtimeExecutiveStageExperienceCertificationFreezeDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeStability =
  "CertificationFreezeReady" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeDeterministic =
  true as const;

export const runtimeExecutiveStageExperienceCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Exact immutable platform lock constant. */
export const REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED =
  "REX-2-RUNTIME-EXECUTIVE-STAGE-EXPERIENCE-PLATFORM-LOCKED" as const;

export const runtimeExecutiveStageExperienceCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveStageExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveStageExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveStageExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveStageExperienceCertificationFreezeDomain,
    phase: runtimeExecutiveStageExperienceCertificationFreezePhase,
    role: runtimeExecutiveStageExperienceCertificationFreezeRole,
    architecturalRole:
      runtimeExecutiveStageExperienceCertificationFreezeArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyPath,
    upstreamVersion: runtimeExecutiveStageExperiencePlatformVersion,
    stabilityStatus:
      runtimeExecutiveStageExperienceCertificationFreezeStability,
    deterministicStatus:
      runtimeExecutiveStageExperienceCertificationFreezeDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageExperienceCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveStageExperienceCertificationFreezeMutationPolicy,
    certificationStatus: "certified" as const,
    compatibilityStatus: "compatible" as const,
    freezeStatus: "frozen" as const,
    lockStatus: "locked" as const,
    platformLock: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    readiness: "ReadyForPublicIndex" as const,
  });

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_PRINCIPLE =
  "Certification observes and freezes the REX-2 Stage Experience platform. It does not improve, reinterpret, repair, or invent Stage behavior." as const;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    certificationAuthority: "REX-2:8" as const,
    architecturalRole:
      "RuntimeExecutiveStageExperienceCertificationFreezeBoundary" as const,
    role: "CertificationAndFreezeBoundary" as const,
    soleImmediateDependency:
      "REX-2:7/RuntimeExecutiveStageExperiencePlatform" as const,
    consumesPlatformOnly: true as const,
    importsRex26Directly: false as const,
    importsRex25Directly: false as const,
    importsRex24Directly: false as const,
    importsRex23Directly: false as const,
    importsRex22Directly: false as const,
    importsRex21Directly: false as const,
    importsRex1Directly: false as const,
    importsExDriDirectly: false as const,
    importsDriDirectly: false as const,
    importsNolDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    introducesStageBehavior: false as const,
    modifiesPlatformBehavior: false as const,
    isFinalPublicConsumerIndex: false as const,
    preparesPublicIndex: true as const,
    mutatesInput: false as const,
    calculatesKpi: false as const,
    calculatesKoi: false as const,
    inventsBusinessRelationships: false as const,
    inventsExecutiveDecisions: false as const,
    executesAnimation: false as const,
    rendersUi: false as const,
  });

// ─── Status vocabularies (aligned with REX-1:8) ─────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_STATUSES =
  Object.freeze(["certified", "failed"] as const);

export type RuntimeExecutiveStageExperienceCertificationStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_STATUSES =
  Object.freeze(["frozen", "unfrozen"] as const);

export type RuntimeExecutiveStageExperienceFreezeStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_LOCK_STATUSES =
  Object.freeze(["locked", "unlocked"] as const);

export type RuntimeExecutiveStageExperienceLockStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_LOCK_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);

export type RuntimeExecutiveStageExperienceCompatibilityStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_INDEX_READINESS =
  Object.freeze([
    "ReadyForPublicIndex",
    "NotReadyForPublicIndex",
  ] as const);

export type RuntimeExecutiveStageExperiencePublicIndexReadiness =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PUBLIC_INDEX_READINESS)[number];

// ─── Certification domains ──────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency-integrity",
    "foundation-integrity",
    "contract-integrity",
    "nexora-object-experience",
    "focus-experience",
    "selection-experience",
    "attention-experience",
    "connection-experience",
    "scene-experience",
    "presentation-state-experience",
    "scene-change-experience",
    "orchestration-integrity",
    "stage-experience-plan-integrity",
    "platform-integrity",
    "validation-integrity",
    "determinism",
    "immutability",
    "renderer-neutrality",
    "architectural-boundaries",
    "consumer-safety",
    "compatibility",
  ] as const);

export type RuntimeExecutiveStageExperienceCertificationDomain =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS)[number];

// ─── Freeze invariants ──────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "rex-2-is-stage-experience",
      order: 1,
      statement: "REX-2 is Runtime Executive Stage Experience.",
    }),
    Object.freeze({
      id: "rex-2-7-platform-boundary",
      order: 2,
      statement: "REX-2:7 is the Stage Experience Platform boundary.",
    }),
    Object.freeze({
      id: "rex-2-6-orchestration-authority",
      order: 3,
      statement: "REX-2:6 remains orchestration authority.",
    }),
    Object.freeze({
      id: "nexora-objects-are-stage-subjects",
      order: 4,
      statement: "Runtime NexoraObjects are Stage subjects.",
    }),
    Object.freeze({
      id: "focus-distinct-from-selection",
      order: 5,
      statement: "Focus is distinct from selection.",
    }),
    Object.freeze({
      id: "focus-distinct-from-attention",
      order: 6,
      statement: "Focus is distinct from attention.",
    }),
    Object.freeze({
      id: "selection-distinct-from-attention",
      order: 7,
      statement: "Selection is distinct from attention.",
    }),
    Object.freeze({
      id: "connections-first-class",
      order: 8,
      statement: "Connections are first-class Stage experience relationships.",
    }),
    Object.freeze({
      id: "connections-not-invented",
      order: 9,
      statement: "Connections are not invented by REX.",
    }),
    Object.freeze({
      id: "attention-not-executive-decision",
      order: 10,
      statement: "Attention does not make executive decisions.",
    }),
    Object.freeze({
      id: "minimum-presentation-state",
      order: 11,
      statement: "Minimum is a canonical presentation state.",
    }),
    Object.freeze({
      id: "report-presentation-state",
      order: 12,
      statement: "Report is a canonical presentation state.",
    }),
    Object.freeze({
      id: "operation-presentation-state",
      order: 13,
      statement: "Operation is a canonical presentation state.",
    }),
    Object.freeze({
      id: "plans-renderer-neutral",
      order: 14,
      statement: "Stage Experience Plans are renderer-neutral.",
    }),
    Object.freeze({
      id: "scene-changes-descriptive",
      order: 15,
      statement: "Scene changes are descriptive.",
    }),
    Object.freeze({
      id: "no-animation-execution",
      order: 16,
      statement: "REX does not execute animations.",
    }),
    Object.freeze({
      id: "no-react-ownership",
      order: 17,
      statement: "REX does not own React.",
    }),
    Object.freeze({
      id: "no-threejs-ownership",
      order: 18,
      statement: "REX does not own Three.js.",
    }),
    Object.freeze({
      id: "no-dom-ownership",
      order: 19,
      statement: "REX does not own DOM behavior.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 20,
      statement: "REX does not calculate KPI.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 21,
      statement: "REX does not calculate KOI.",
    }),
    Object.freeze({
      id: "no-business-relationship-creation",
      order: 22,
      statement: "REX does not create business relationships.",
    }),
    Object.freeze({
      id: "no-nol-replacement",
      order: 23,
      statement: "REX does not replace NOL.",
    }),
    Object.freeze({
      id: "no-dri-replacement",
      order: 24,
      statement: "REX does not replace DRI.",
    }),
    Object.freeze({
      id: "no-ex-dri-replacement",
      order: 25,
      statement: "REX does not replace EX-DRI.",
    }),
    Object.freeze({
      id: "equivalent-input-equivalent-output",
      order: 26,
      statement: "Equivalent input produces equivalent semantic output.",
    }),
    Object.freeze({
      id: "runtime-input-unmodified",
      order: 27,
      statement: "Runtime input remains unmodified.",
    }),
    Object.freeze({
      id: "frozen-structures-immutable",
      order: 28,
      statement: "Frozen platform structures remain immutable.",
    }),
    Object.freeze({
      id: "visible-context-may-be-smaller",
      order: 29,
      statement:
        "Visible executive context may be smaller than available runtime context.",
    }),
    Object.freeze({
      id: "rex-2-8-introduces-no-stage-behavior",
      order: 30,
      statement: "REX-2:8 introduces no new Stage behavior.",
    }),
    Object.freeze({
      id: "rex-2-9-depends-on-freeze",
      order: 31,
      statement:
        "REX-2:9 must consume REX-2:8 as its sole immediate dependency.",
    }),
  ] as const);

export type RuntimeExecutiveStageExperienceFreezeInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS)[number];

// ─── Frozen presentation / disposition vocabularies ─────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_OBJECT_DISPOSITIONS =
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_CONNECTION_DISPOSITIONS =
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_SCENE_TRANSITION_INTENTS =
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS;

// ─── Approved public export surface (for REX-2:9) ───────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS =
  Object.freeze([
    "runtimeExecutiveStageExperiencePlatformIdentity",
    "runtimeExecutiveStageExperiencePlatformVersion",
    "runtimeExecutiveStageExperiencePlatformNamespace",
    "runtimeExecutiveStageExperiencePlatformLayer",
    "runtimeExecutiveStageExperiencePlatformCanonicalIdentity",
    "runtimeExecutiveStageExperiencePlatform",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION",
    "runtimeExecutiveStageExperiencePlatformApiNames",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_OBJECT_DISPOSITIONS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_CONNECTION_DISPOSITIONS",
    "RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_SCENE_TRANSITION_INTENTS",
    "resolveRuntimeExecutiveStageExperience",
    "validateRuntimeExecutiveStageExperiencePlatformInput",
    "validateRuntimeExecutiveStageExperiencePlatformPlan",
    "getRuntimeExecutiveStageExperiencePlatformCapabilities",
    "inspectRuntimeExecutiveStageExperiencePlatformResult",
    "compareRuntimeExecutiveStageExperiencePlatformPlans",
    "verifyRuntimeExecutiveStageExperiencePlatform",
    "getRuntimeExecutiveStageExperiencePlatformIdentity",
    "createRuntimeExecutiveStageModel",
    "RuntimeExecutiveStageExperiencePlatformInput",
    "RuntimeExecutiveStageExperiencePlatformResult",
    "RuntimeExecutiveStageExperiencePlatformValidation",
    "RuntimeExecutiveStageExperiencePlatformCapability",
    "RuntimeExecutiveStageExperiencePlatformStatus",
    "RuntimeExecutiveStageExperiencePlatformGuarantee",
    "RuntimeExecutiveStageExperiencePlatformConsumerInformation",
    "RuntimeExecutiveStageExperiencePlan",
    "RuntimeExecutiveStageExperienceComparison",
    "RuntimeExecutiveStageModel",
    "RuntimeExecutiveStageFocusSelectionSource",
  ] as const);

export type RuntimeExecutiveStageExperienceApprovedExport =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS)[number];

// ─── Consumer / certification guarantees ────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "stable-stage-experience-identity",
      order: 1,
      statement: "Stable Stage Experience identity.",
    }),
    Object.freeze({
      id: "deterministic-platform-behavior",
      order: 2,
      statement: "Deterministic platform behavior.",
    }),
    Object.freeze({
      id: "immutable-outputs",
      order: 3,
      statement: "Immutable outputs.",
    }),
    Object.freeze({
      id: "renderer-neutral-models",
      order: 4,
      statement: "Renderer-neutral models.",
    }),
    Object.freeze({
      id: "preserved-nexora-object-identity",
      order: 5,
      statement: "Preserved NexoraObject identity.",
    }),
    Object.freeze({
      id: "preserved-focus-semantics",
      order: 6,
      statement: "Preserved focus semantics.",
    }),
    Object.freeze({
      id: "preserved-selection-semantics",
      order: 7,
      statement: "Preserved selection semantics.",
    }),
    Object.freeze({
      id: "preserved-attention-semantics",
      order: 8,
      statement: "Preserved attention semantics.",
    }),
    Object.freeze({
      id: "preserved-connection-semantics",
      order: 9,
      statement: "Preserved connection semantics.",
    }),
    Object.freeze({
      id: "preserved-scene-semantics",
      order: 10,
      statement: "Preserved scene semantics.",
    }),
    Object.freeze({
      id: "preserved-presentation-states",
      order: 11,
      statement: "Preserved Minimum/Report/Operation semantics.",
    }),
    Object.freeze({
      id: "no-business-calculation-leakage",
      order: 12,
      statement: "No business calculation leakage.",
    }),
    Object.freeze({
      id: "no-renderer-dependency",
      order: 13,
      statement: "No renderer dependency.",
    }),
    Object.freeze({
      id: "no-upstream-bypass-required",
      order: 14,
      statement: "No upstream bypass requirement.",
    }),
    Object.freeze({
      id: "certification-availability",
      order: 15,
      statement: "Certification availability.",
    }),
    Object.freeze({
      id: "compatibility-availability",
      order: 16,
      statement: "Compatibility availability.",
    }),
    Object.freeze({
      id: "freeze-lock-information",
      order: 17,
      statement: "Freeze/lock information.",
    }),
    Object.freeze({
      id: "rex-2-9-publication-readiness",
      order: 18,
      statement: "REX-2:9 publication readiness.",
    }),
  ] as const);

export type RuntimeExecutiveStageExperienceConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "depends-only-on-rex-2-7",
      order: 1,
      statement: "REX-2:8 depends only on REX-2:7.",
    }),
    Object.freeze({
      id: "no-upstream-behavior-changed",
      order: 2,
      statement: "No REX-2:1–2:7 behavior is changed.",
    }),
    Object.freeze({
      id: "certification-deterministic",
      order: 3,
      statement: "Certification is deterministic.",
    }),
    Object.freeze({
      id: "certification-checks-explicit",
      order: 4,
      statement: "Certification checks are explicit.",
    }),
    Object.freeze({
      id: "compatibility-explicit",
      order: 5,
      statement: "Compatibility is explicit.",
    }),
    Object.freeze({
      id: "freeze-state-explicit",
      order: 6,
      statement: "Freeze state is explicit.",
    }),
    Object.freeze({
      id: "lock-state-explicit",
      order: 7,
      statement: "Lock state is explicit.",
    }),
    Object.freeze({
      id: "platform-lock-immutable",
      order: 8,
      statement: "Exact platform lock is immutable.",
    }),
    Object.freeze({
      id: "approved-exports-explicit",
      order: 9,
      statement: "Approved exports are explicit.",
    }),
    Object.freeze({
      id: "approved-exports-immutable",
      order: 10,
      statement: "Approved exports are immutable.",
    }),
    Object.freeze({
      id: "freeze-invariants-immutable",
      order: 11,
      statement: "Freeze invariants are immutable.",
    }),
    Object.freeze({
      id: "platform-semantics-frozen",
      order: 12,
      statement: "Platform semantics are frozen.",
    }),
    Object.freeze({
      id: "no-direct-orchestration-bypass",
      order: 13,
      statement: "No direct REX-2:6 orchestration bypass is introduced.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 14,
      statement: "No React dependency is introduced.",
    }),
    Object.freeze({
      id: "no-threejs-dependency",
      order: 15,
      statement: "No Three.js dependency is introduced.",
    }),
    Object.freeze({
      id: "no-renderer-dependency",
      order: 16,
      statement: "No renderer dependency is introduced.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 17,
      statement: "No KPI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 18,
      statement: "No KOI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-new-stage-behavior",
      order: 19,
      statement: "No new Stage behavior is introduced.",
    }),
    Object.freeze({
      id: "rex-2-9-depends-on-freeze",
      order: 20,
      statement: "REX-2:9 must depend on this frozen layer.",
    }),
    Object.freeze({
      id: "rex-2-9-publishes-approved-exports-only",
      order: 21,
      statement: "REX-2:9 may publish only approved exports.",
    }),
    Object.freeze({
      id: "certified-yields-ready-for-public-index",
      order: 22,
      statement: "Successful certification yields ReadyForPublicIndex.",
    }),
  ] as const);

export type RuntimeExecutiveStageExperienceCertificationGuarantee =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES =
  Object.freeze([
    ...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.map((entry) =>
      Object.freeze({
        id: entry.id,
        order: entry.order,
        statement: entry.statement,
        source: "REX-2:7" as const,
      }),
    ),
    Object.freeze({
      id: "certified",
      order: 21,
      statement: "REX-2 Stage Experience platform is certified.",
      source: "REX-2:8" as const,
    }),
    Object.freeze({
      id: "compatible",
      order: 22,
      statement: "REX-2 Stage Experience platform is compatible.",
      source: "REX-2:8" as const,
    }),
    Object.freeze({
      id: "frozen",
      order: 23,
      statement: "REX-2 Stage Experience platform semantics are frozen.",
      source: "REX-2:8" as const,
    }),
    Object.freeze({
      id: "locked",
      order: 24,
      statement: "REX-2 Stage Experience platform is locked.",
      source: "REX-2:8" as const,
    }),
    Object.freeze({
      id: "ready-for-public-index",
      order: 25,
      statement: "REX-2 Stage Experience platform is ready for Public Index.",
      source: "REX-2:8" as const,
    }),
  ] as const);

export type RuntimeExecutiveStageExperienceFrozenGuarantee =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_FORBIDDEN =
  Object.freeze([
    "Public Index",
    "React integration",
    "Three.js integration",
    "Stage rendering",
    "camera control",
    "mesh/geometry ownership",
    "DOM / CSS styling",
    "animation execution",
    "KPI calculation",
    "KOI calculation",
    "business relationship creation",
    "executive decision invention",
    "NOL replacement",
    "DRI replacement",
    "EX-DRI replacement",
    "orchestration replacement",
    "platform behavior modification",
    "new Stage behavior",
    "new presentation states",
    "new focus/selection/attention rules",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "CertificationDomains",
    "CertificationChecks",
    "CertificationReport",
    "Compatibility",
    "Freeze",
    "Lock",
    "PlatformLock",
    "Invariants",
    "ApprovedExports",
    "Guarantees",
    "PublicIndexReadiness",
    "Validation",
  ] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageExperienceCertificationCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveStageExperienceCertificationDomain;
  readonly description: string;
  readonly passed: boolean;
  readonly expected?: string;
  readonly actual?: string;
  readonly reason?: string;
  readonly severity?: "blocking";
}

export interface RuntimeExecutiveStageExperienceCompatibilityReport {
  readonly overallStatus: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly dependencyCompatible: boolean;
  readonly platformIdentityCompatible: boolean;
  readonly presentationStateCompatible: boolean;
  readonly stageExperiencePlanCompatible: boolean;
  readonly orchestrationCompatible: boolean;
  readonly consumerBoundaryCompatible: boolean;
}

export interface RuntimeExecutiveStageExperienceCertificationResult {
  readonly identity: typeof runtimeExecutiveStageExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveStageExperienceCertificationFreezeVersion;
  readonly certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly domains: ReadonlyArray<RuntimeExecutiveStageExperienceCertificationDomain>;
  readonly checks: ReadonlyArray<RuntimeExecutiveStageExperienceCertificationCheck>;
  readonly domainResults: ReadonlyArray<{
    readonly domain: RuntimeExecutiveStageExperienceCertificationDomain;
    readonly passed: boolean;
    readonly checkCount: number;
    readonly failedCheckCount: number;
  }>;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly totalCheckCount: number;
  readonly failedInvariants: ReadonlyArray<string>;
  readonly compatibility: RuntimeExecutiveStageExperienceCompatibilityReport;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly freezeEligible: boolean;
  readonly lockEligible: boolean;
  readonly platformLock: typeof REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED;
  readonly certifiedPlatformIdentity: typeof runtimeExecutiveStageExperiencePlatformIdentity;
  readonly certifiedPlatformVersion: typeof runtimeExecutiveStageExperiencePlatformVersion;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
  readonly summary: string;
}

/** Alias aligned with REX-1:8 naming for freeze contract construction. */
export type RuntimeExecutiveStageExperienceCertificationReport =
  RuntimeExecutiveStageExperienceCertificationResult;

export interface RuntimeExecutiveStageExperienceFreezeContract {
  readonly certifiedIdentity: typeof runtimeExecutiveStageExperiencePlatformIdentity;
  readonly certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly platformLock: typeof REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED;
  readonly invariants: ReadonlyArray<RuntimeExecutiveStageExperienceFreezeInvariant>;
  readonly approvedExports: ReadonlyArray<RuntimeExecutiveStageExperienceApprovedExport>;
  readonly guarantees: ReadonlyArray<RuntimeExecutiveStageExperienceFrozenGuarantee>;
  readonly consumerGuarantees: ReadonlyArray<RuntimeExecutiveStageExperienceConsumerGuarantee>;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
}

export interface RuntimeExecutiveStageExperienceLockDescriptor {
  readonly lockIdentity: typeof REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED;
  readonly platformIdentity: typeof runtimeExecutiveStageExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeExecutiveStageExperiencePlatformVersion;
  readonly certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly invariantCount: number;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
  readonly publicationPolicy: "approved-exports-only";
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasGuarantee(id: string): boolean {
  return RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.some(
    (entry) => entry.id === id,
  );
}

function hasCapability(
  id: (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES)[number],
): boolean {
  return RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.includes(id);
}

function check(input: {
  readonly id: string;
  readonly domain: RuntimeExecutiveStageExperienceCertificationDomain;
  readonly description: string;
  readonly passed: boolean;
  readonly expected?: string;
  readonly actual?: string;
  readonly reason?: string;
}): RuntimeExecutiveStageExperienceCertificationCheck {
  return Object.freeze({
    id: input.id,
    domain: input.domain,
    description: input.description,
    passed: input.passed,
    severity: "blocking" as const,
    ...(input.expected !== undefined ? { expected: input.expected } : {}),
    ...(input.actual !== undefined ? { actual: input.actual } : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
  });
}

function buildCertificationChecks(): ReadonlyArray<RuntimeExecutiveStageExperienceCertificationCheck> {
  const platform = runtimeExecutiveStageExperiencePlatform;
  const boundary = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY;
  const verification = verifyRuntimeExecutiveStageExperiencePlatform();
  const presentationStates = [
    ...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES,
  ];
  const dispositions = [
    ...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS,
  ];
  const connectionDispositions = [
    ...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS,
  ];
  const transitionIntents = [
    ...RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS,
  ];

  return Object.freeze([
    // Identity
    check({
      id: "platform-identity-exact",
      domain: "identity",
      description: "exact REX-2:7 platform identity",
      passed:
        platform.identity ===
        "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
      expected: "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
      actual: platform.identity,
    }),
    check({
      id: "platform-version-exact",
      domain: "identity",
      description: "exact platform version",
      passed: platform.version === "2.7.0",
      expected: "2.7.0",
      actual: platform.version,
    }),
    check({
      id: "platform-namespace-exact",
      domain: "identity",
      description: "exact platform namespace",
      passed:
        platform.namespace === "nexora.rex.stage-experience.platform",
      expected: "nexora.rex.stage-experience.platform",
      actual: platform.namespace,
    }),
    check({
      id: "platform-role-exact",
      domain: "identity",
      description: "platform role is PlatformBoundary",
      passed: platform.role === "PlatformBoundary",
      expected: "PlatformBoundary",
      actual: platform.role,
    }),

    // Dependency integrity
    check({
      id: "certification-depends-only-on-platform",
      domain: "dependency-integrity",
      description: "REX-2:8 depends only on REX-2:7",
      passed:
        runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity ===
          "REX-2:7/RuntimeExecutiveStageExperiencePlatform" &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .consumesPlatformOnly === true,
      expected: "REX-2:7/RuntimeExecutiveStageExperiencePlatform",
      actual:
        runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity,
    }),
    check({
      id: "no-direct-rex-2-1-to-2-6-bypass",
      domain: "dependency-integrity",
      description: "no direct imports from REX-2:1–2:6",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex26Directly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex25Directly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex24Directly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex23Directly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex22Directly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex21Directly === false,
    }),
    check({
      id: "platform-chain-intact",
      domain: "dependency-integrity",
      description: "REX-2:7 verification and orchestration chain intact",
      passed:
        verification.ok === true &&
        verification.orchestrationBoundaryIntact === true &&
        platform.upstreamDependency ===
          "REX-2:6/RuntimeExecutiveStageExperienceOrchestration",
    }),

    // Foundation integrity (preserved through platform guarantees/capabilities)
    check({
      id: "foundation-semantics-preserved",
      domain: "foundation-integrity",
      description: "foundation Stage subject semantics preserved via platform",
      passed:
        hasCapability("runtime-stage-experience") &&
        hasCapability("nexora-object-experience") &&
        hasGuarantee("upstream-meaning-preserved"),
    }),
    check({
      id: "foundation-not-replaced",
      domain: "foundation-integrity",
      description: "certification does not replace foundation",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .introducesStageBehavior === false,
    }),

    // Contract integrity
    check({
      id: "platform-contracts-present",
      domain: "contract-integrity",
      description: "platform contracts and API surface present",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION !==
          undefined &&
        runtimeExecutiveStageExperiencePlatformApiNames.length > 0 &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS.length === 8,
    }),
    check({
      id: "platform-statuses-canonical",
      domain: "contract-integrity",
      description: "accepted|rejected|invalid statuses preserved",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES.length === 3 &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES.includes(
          "accepted",
        ) &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES.includes(
          "rejected",
        ) &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES.includes(
          "invalid",
        ),
    }),

    // NexoraObject experience
    check({
      id: "object-dispositions-complete",
      domain: "nexora-object-experience",
      description: "approved object dispositions remain complete",
      passed:
        dispositions.includes("primary") &&
        dispositions.includes("contextual") &&
        dispositions.includes("related") &&
        dispositions.includes("selected") &&
        dispositions.includes("attention-bearing") &&
        dispositions.includes("background") &&
        dispositions.includes("suppressed") &&
        dispositions.length === 7,
    }),
    check({
      id: "nexora-object-capability-present",
      domain: "nexora-object-experience",
      description: "nexora-object-experience capability registered",
      passed: hasCapability("nexora-object-experience"),
    }),

    // Focus
    check({
      id: "focus-capability-present",
      domain: "focus-experience",
      description: "focus-experience capability registered",
      passed: hasCapability("focus-experience"),
    }),
    check({
      id: "focus-distinct-from-selection",
      domain: "focus-experience",
      description: "focus remains distinct from selection",
      passed: hasGuarantee("focus-distinct-from-selection"),
    }),
    check({
      id: "focus-distinct-from-attention",
      domain: "focus-experience",
      description: "focus remains distinct from attention",
      passed: hasGuarantee("focus-distinct-from-attention"),
    }),
    check({
      id: "focus-roles-present",
      domain: "focus-experience",
      description: "focus roles vocabulary present",
      passed: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES.length > 0,
    }),

    // Selection
    check({
      id: "selection-capability-present",
      domain: "selection-experience",
      description: "selection-experience capability registered",
      passed: hasCapability("selection-experience"),
    }),
    check({
      id: "selection-distinct-from-attention",
      domain: "selection-experience",
      description: "selection remains distinct from attention",
      passed: hasGuarantee("selection-distinct-from-attention"),
    }),

    // Attention
    check({
      id: "attention-capability-present",
      domain: "attention-experience",
      description: "attention-experience capability registered",
      passed: hasCapability("attention-experience"),
    }),
    check({
      id: "attention-not-executive-decision",
      domain: "attention-experience",
      description: "attention does not invent executive decisions",
      passed:
        hasGuarantee("no-executive-decisions") &&
        boundary.inventsExecutiveMeaning === false,
    }),

    // Connections
    check({
      id: "connection-capability-present",
      domain: "connection-experience",
      description: "connection-experience capability registered",
      passed: hasCapability("connection-experience"),
    }),
    check({
      id: "connection-dispositions-complete",
      domain: "connection-experience",
      description: "approved connection dispositions remain complete",
      passed:
        connectionDispositions.includes("emphasized") &&
        connectionDispositions.includes("visible") &&
        connectionDispositions.includes("contextual") &&
        connectionDispositions.includes("de-emphasized") &&
        connectionDispositions.includes("suppressed") &&
        connectionDispositions.length === 5,
    }),
    check({
      id: "connections-not-business-calculation",
      domain: "connection-experience",
      description: "connections are experience, not business calculation",
      passed: hasGuarantee("connections-are-experience-not-calculation"),
    }),

    // Scene
    check({
      id: "scene-capability-present",
      domain: "scene-experience",
      description: "scene-experience capability registered",
      passed: hasCapability("scene-experience"),
    }),

    // Presentation states
    check({
      id: "presentation-states-exact",
      domain: "presentation-state-experience",
      description: "exactly minimum|report|operation",
      passed:
        presentationStates.length === 3 &&
        presentationStates[0] === "minimum" &&
        presentationStates[1] === "report" &&
        presentationStates[2] === "operation",
      expected: "minimum,report,operation",
      actual: presentationStates.join(","),
    }),
    check({
      id: "presentation-capability-present",
      domain: "presentation-state-experience",
      description: "presentation-state-experience capability registered",
      passed:
        hasCapability("presentation-state-experience") &&
        hasGuarantee("canonical-presentation-states"),
    }),
    check({
      id: "no-unauthorized-presentation-state",
      domain: "presentation-state-experience",
      description: "no fourth presentation state enters frozen registry",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES.length ===
          3 &&
        !presentationStates.includes("detail" as never) &&
        !presentationStates.includes("debug" as never),
    }),

    // Scene change
    check({
      id: "scene-change-capability-present",
      domain: "scene-change-experience",
      description: "scene-change-experience capability registered",
      passed: hasCapability("scene-change-experience"),
    }),
    check({
      id: "scene-transition-intents-complete",
      domain: "scene-change-experience",
      description: "approved scene-transition intents present",
      passed:
        transitionIntents.includes("initial-scene") &&
        transitionIntents.includes("focus-change") &&
        transitionIntents.includes("selection-change") &&
        transitionIntents.includes("attention-change") &&
        transitionIntents.includes("presentation-state-change") &&
        transitionIntents.includes("relationship-emphasis-change") &&
        transitionIntents.includes("scene-replacement") &&
        transitionIntents.includes("scene-restoration") &&
        transitionIntents.includes("noise-reduction"),
    }),
    check({
      id: "scene-changes-not-animations",
      domain: "scene-change-experience",
      description: "scene changes remain descriptive; no animation execution",
      passed:
        boundary.executesAnimation === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .executesAnimation === false,
    }),

    // Orchestration
    check({
      id: "orchestration-authority-rex-2-6",
      domain: "orchestration-integrity",
      description: "REX-2:6 remains orchestration authority",
      passed:
        platform.orchestration.remainsOrchestrationAuthority === true &&
        platform.orchestration.authority ===
          "REX-2:6/RuntimeExecutiveStageExperienceOrchestration" &&
        hasGuarantee("rex-2-6-orchestration-authority") &&
        boundary.orchestrationAuthorityRemainsRex26 === true,
    }),
    check({
      id: "stage-orchestration-capability",
      domain: "orchestration-integrity",
      description: "stage-orchestration capability registered",
      passed: hasCapability("stage-orchestration"),
    }),

    // Stage Experience Plan
    check({
      id: "experience-plan-capability",
      domain: "stage-experience-plan-integrity",
      description: "experience-plan capability registered",
      passed: hasCapability("experience-plan"),
    }),
    check({
      id: "plans-renderer-neutral",
      domain: "stage-experience-plan-integrity",
      description: "Stage Experience Plans remain renderer-neutral",
      passed:
        hasGuarantee("renderer-neutral-plans") &&
        platform.rendererIndependent === true,
    }),
    check({
      id: "comparison-capability",
      domain: "stage-experience-plan-integrity",
      description: "deterministic comparison capability registered",
      passed: hasCapability("deterministic-comparison"),
    }),

    // Platform integrity
    check({
      id: "platform-verification-ok",
      domain: "platform-integrity",
      description: "platform verification succeeds",
      passed: verification.ok === true && verification.platformOnly === true,
    }),
    check({
      id: "platform-boundary-authority",
      domain: "platform-integrity",
      description: "REX-2:7 remains platform boundary",
      passed:
        hasGuarantee("rex-2-7-platform-boundary") &&
        boundary.platformAuthority === "REX-2:7" &&
        boundary.role === "PlatformBoundary",
    }),
    check({
      id: "platform-capability-count",
      domain: "platform-integrity",
      description: "capability registry count is derived and complete",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY.capabilityCount ===
          RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.length &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.length === 13,
    }),

    // Validation
    check({
      id: "validation-capability",
      domain: "validation-integrity",
      description: "validation capability and APIs present",
      passed:
        hasCapability("validation") &&
        runtimeExecutiveStageExperiencePlatformApiNames.includes(
          "validateRuntimeExecutiveStageExperiencePlatformInput",
        ) &&
        runtimeExecutiveStageExperiencePlatformApiNames.includes(
          "validateRuntimeExecutiveStageExperiencePlatformPlan",
        ),
    }),
    check({
      id: "validation-apis-callable",
      domain: "validation-integrity",
      description: "validation APIs are functions",
      passed:
        typeof validateRuntimeExecutiveStageExperiencePlatformInput ===
          "function" &&
        typeof validateRuntimeExecutiveStageExperiencePlatformPlan ===
          "function",
    }),

    // Determinism
    check({
      id: "platform-deterministic",
      domain: "determinism",
      description: "platform declares deterministic behavior",
      passed:
        platform.deterministic === true &&
        hasGuarantee("deterministic-stage-experience") &&
        hasGuarantee("equivalent-input-equivalent-output"),
    }),
    check({
      id: "no-nondeterministic-apis",
      domain: "determinism",
      description: "no random/timestamp generation APIs on platform surface",
      passed:
        !runtimeExecutiveStageExperiencePlatformApiNames.some((name) =>
          /random|timestamp|now|uuid/i.test(name),
        ),
    }),

    // Immutability
    check({
      id: "platform-structures-frozen",
      domain: "immutability",
      description: "canonical platform structures are frozen",
      passed:
        Object.isFrozen(platform) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES,
        ) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES) &&
        verification.frozen === true,
    }),
    check({
      id: "inputs-not-mutated-guarantee",
      domain: "immutability",
      description: "inputs-not-mutated guarantee present",
      passed:
        hasGuarantee("inputs-not-mutated") &&
        hasGuarantee("outputs-immutable") &&
        boundary.mutatesInput === false,
    }),

    // Renderer neutrality
    check({
      id: "renderer-independent",
      domain: "renderer-neutrality",
      description: "platform is renderer / framework / browser independent",
      passed:
        platform.rendererIndependent === true &&
        platform.frameworkIndependent === true &&
        platform.browserIndependent === true &&
        boundary.rendererIndependent === true &&
        boundary.frameworkIndependent === true,
    }),
    check({
      id: "no-ui-or-threejs",
      domain: "renderer-neutrality",
      description: "no UI / Three.js / React ownership",
      passed:
        boundary.rendersUi === false &&
        hasGuarantee("no-ui-rendering") &&
        hasGuarantee("no-threejs-ownership") &&
        hasGuarantee("no-react-ownership"),
    }),

    // Architectural boundaries
    check({
      id: "no-kpi-koi",
      domain: "architectural-boundaries",
      description: "no KPI/KOI calculation",
      passed:
        boundary.calculatesKpi === false &&
        boundary.calculatesKoi === false &&
        hasGuarantee("no-kpi-calculation") &&
        hasGuarantee("no-koi-calculation"),
    }),
    check({
      id: "no-nol-dri-exdri-bypass",
      domain: "architectural-boundaries",
      description: "no NOL/DRI/EX-DRI replacement or direct import",
      passed:
        boundary.importsNolDirectly === false &&
        boundary.importsDriDirectly === false &&
        boundary.importsExDriDirectly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsNolDirectly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsDriDirectly === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .importsExDriDirectly === false,
    }),
    check({
      id: "no-new-stage-behavior-in-freeze",
      domain: "architectural-boundaries",
      description: "REX-2:8 introduces no Stage behavior",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .introducesStageBehavior === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .modifiesPlatformBehavior === false,
    }),
    check({
      id: "noise-reduction-supported",
      domain: "architectural-boundaries",
      description: "noise-reduction remains an approved scene-change intent",
      passed: transitionIntents.includes("noise-reduction"),
    }),

    // Consumer safety
    check({
      id: "consumer-info-not-final-index",
      domain: "consumer-safety",
      description: "platform is not yet the final public consumer index",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION
          .isFinalPublicConsumerIndex === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION
          .readyForCertificationAndFreeze === true &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .isFinalPublicConsumerIndex === false &&
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
          .preparesPublicIndex === true,
    }),
    check({
      id: "approved-exports-unique",
      domain: "consumer-safety",
      description: "approved exports are unique and non-empty",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS.length > 0 &&
        unique(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS),
    }),
    check({
      id: "resolve-api-present",
      domain: "consumer-safety",
      description: "canonical resolve API present for consumers",
      passed:
        typeof resolveRuntimeExecutiveStageExperience === "function" &&
        typeof compareRuntimeExecutiveStageExperiencePlatformPlans ===
          "function" &&
        typeof createRuntimeExecutiveStageModel === "function",
    }),

    // Compatibility
    check({
      id: "platform-identity-compatible",
      domain: "compatibility",
      description: "platform identity/version/namespace compatibility",
      passed:
        getRuntimeExecutiveStageExperiencePlatformIdentity().identity ===
          runtimeExecutiveStageExperiencePlatformIdentity &&
        getRuntimeExecutiveStageExperiencePlatformIdentity().version ===
          "2.7.0",
    }),
    check({
      id: "presentation-compatibility",
      domain: "compatibility",
      description: "presentation-state compatibility",
      passed:
        getRuntimeExecutiveStageExperiencePlatformCapabilities().includes(
          "presentation-state-experience",
        ) && presentationStates.length === 3,
    }),
    check({
      id: "orchestration-compatibility",
      domain: "compatibility",
      description: "orchestration compatibility via platform",
      passed:
        platform.orchestration.remainsOrchestrationAuthority === true &&
        verification.orchestrationBoundaryIntact === true,
    }),
    check({
      id: "consumer-boundary-compatibility",
      domain: "compatibility",
      description: "consumer boundary compatibility",
      passed:
        RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION.role ===
          "PlatformBoundary" &&
        hasGuarantee("no-internal-rex-2-required"),
    }),
  ]);
}

function buildDomainResults(
  checks: ReadonlyArray<RuntimeExecutiveStageExperienceCertificationCheck>,
): RuntimeExecutiveStageExperienceCertificationResult["domainResults"] {
  return Object.freeze(
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS.map((domain) => {
      const domainChecks = checks.filter((entry) => entry.domain === domain);
      const failedCheckCount = domainChecks.filter(
        (entry) => !entry.passed,
      ).length;
      return Object.freeze({
        domain,
        passed: domainChecks.length > 0 && failedCheckCount === 0,
        checkCount: domainChecks.length,
        failedCheckCount,
      });
    }),
  );
}

function buildCompatibilityReport(
  checks: ReadonlyArray<RuntimeExecutiveStageExperienceCertificationCheck>,
): RuntimeExecutiveStageExperienceCompatibilityReport {
  const passed = (id: string): boolean =>
    checks.find((entry) => entry.id === id)?.passed === true;

  const dependencyCompatible =
    passed("certification-depends-only-on-platform") &&
    passed("platform-chain-intact") &&
    passed("no-direct-rex-2-1-to-2-6-bypass");
  const platformIdentityCompatible = passed("platform-identity-compatible");
  const presentationStateCompatible = passed("presentation-compatibility");
  const stageExperiencePlanCompatible =
    passed("experience-plan-capability") && passed("plans-renderer-neutral");
  const orchestrationCompatible = passed("orchestration-compatibility");
  const consumerBoundaryCompatible = passed("consumer-boundary-compatibility");

  const overallStatus: RuntimeExecutiveStageExperienceCompatibilityStatus =
    dependencyCompatible &&
    platformIdentityCompatible &&
    presentationStateCompatible &&
    stageExperiencePlanCompatible &&
    orchestrationCompatible &&
    consumerBoundaryCompatible
      ? "compatible"
      : "incompatible";

  return Object.freeze({
    overallStatus,
    dependencyCompatible,
    platformIdentityCompatible,
    presentationStateCompatible,
    stageExperiencePlanCompatible,
    orchestrationCompatible,
    consumerBoundaryCompatible,
  });
}

// ─── Validation helpers ─────────────────────────────────────────────────────

export function isRuntimeExecutiveStageExperienceCertificationDomain(
  value: unknown,
): value is RuntimeExecutiveStageExperienceCertificationDomain {
  return (
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageExperienceCertificationStatus(
  value: unknown,
): value is RuntimeExecutiveStageExperienceCertificationStatus {
  return (
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageExperienceCompatibilityStatus(
  value: unknown,
): value is RuntimeExecutiveStageExperienceCompatibilityStatus {
  return (
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_COMPATIBILITY_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageExperienceFreezeStatus(
  value: unknown,
): value is RuntimeExecutiveStageExperienceFreezeStatus {
  return (
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageExperienceLockStatus(
  value: unknown,
): value is RuntimeExecutiveStageExperienceLockStatus {
  return (
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_LOCK_STATUSES as readonly unknown[]
  ).includes(value);
}

export function validateRuntimeExecutiveStageExperienceCertificationResult(
  value: unknown,
): value is RuntimeExecutiveStageExperienceCertificationResult {
  if (!isPlainObject(value)) return false;
  return (
    value.identity ===
      runtimeExecutiveStageExperienceCertificationFreezeIdentity &&
    value.version ===
      runtimeExecutiveStageExperienceCertificationFreezeVersion &&
    isRuntimeExecutiveStageExperienceCertificationStatus(
      value.certificationStatus,
    ) &&
    Array.isArray(value.checks) &&
    typeof value.passedCheckCount === "number" &&
    typeof value.failedCheckCount === "number" &&
    typeof value.totalCheckCount === "number" &&
    value.platformLock ===
      REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED
  );
}

export function validateRuntimeExecutiveStageExperienceFreezeContract(
  value: unknown,
): value is RuntimeExecutiveStageExperienceFreezeContract {
  if (!isPlainObject(value)) return false;
  return (
    value.certifiedIdentity ===
      runtimeExecutiveStageExperiencePlatformIdentity &&
    isRuntimeExecutiveStageExperienceCertificationStatus(
      value.certificationStatus,
    ) &&
    isRuntimeExecutiveStageExperienceCompatibilityStatus(
      value.compatibilityStatus,
    ) &&
    isRuntimeExecutiveStageExperienceFreezeStatus(value.freezeStatus) &&
    isRuntimeExecutiveStageExperienceLockStatus(value.lockStatus) &&
    value.platformLock ===
      REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED &&
    Array.isArray(value.invariants) &&
    Array.isArray(value.approvedExports) &&
    Array.isArray(value.guarantees) &&
    (value.readiness === "ReadyForPublicIndex" ||
      value.readiness === "NotReadyForPublicIndex")
  );
}

export function verifyRuntimeExecutiveStageExperienceApprovedExports(): {
  readonly ok: boolean;
  readonly count: number;
  readonly unique: boolean;
  readonly includesResolve: boolean;
  readonly includesPlatform: boolean;
} {
  const exportsList = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS;
  const uniqueOk = unique(exportsList);
  const includesResolve = exportsList.includes(
    "resolveRuntimeExecutiveStageExperience",
  );
  const includesPlatform = exportsList.includes(
    "runtimeExecutiveStageExperiencePlatform",
  );
  return Object.freeze({
    ok: uniqueOk && includesResolve && includesPlatform && exportsList.length > 0,
    count: exportsList.length,
    unique: uniqueOk,
    includesResolve,
    includesPlatform,
  });
}

export function verifyRuntimeExecutiveStageExperienceFreezeInvariants(): {
  readonly ok: boolean;
  readonly count: number;
  readonly ordered: boolean;
} {
  const invariants = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS;
  const ordered = invariants.every(
    (entry, index) => entry.order === index + 1,
  );
  return Object.freeze({
    ok: ordered && invariants.length === 31 && Object.isFrozen(invariants),
    count: invariants.length,
    ordered,
  });
}

// ─── Certification / freeze APIs ────────────────────────────────────────────

export function certifyRuntimeExecutiveStageExperiencePlatform():
  RuntimeExecutiveStageExperienceCertificationResult {
  const checks = buildCertificationChecks();
  const passedCheckCount = checks.filter((entry) => entry.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const domainResults = buildDomainResults(checks);
  const compatibility = buildCompatibilityReport(checks);
  const failedInvariants = Object.freeze(
    checks.filter((entry) => !entry.passed).map((entry) => entry.id),
  );

  const certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus =
    failedCheckCount === 0 ? "certified" : "failed";
  const freezeEligible =
    certificationStatus === "certified" &&
    compatibility.overallStatus === "compatible";
  const lockEligible = freezeEligible;
  const freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus =
    freezeEligible ? "frozen" : "unfrozen";
  const lockStatus: RuntimeExecutiveStageExperienceLockStatus = lockEligible
    ? "locked"
    : "unlocked";
  const readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness =
    freezeEligible && lockStatus === "locked"
      ? "ReadyForPublicIndex"
      : "NotReadyForPublicIndex";

  const summary =
    certificationStatus === "certified" &&
    compatibility.overallStatus === "compatible" &&
    freezeStatus === "frozen" &&
    lockStatus === "locked"
      ? "Certified · Compatible · Frozen · Locked · ReadyForPublicIndex"
      : "NotCertified · NotEligibleForFreeze · NotReadyForPublicIndex";

  return Object.freeze({
    identity: runtimeExecutiveStageExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveStageExperienceCertificationFreezeVersion,
    certificationStatus,
    domains: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS,
    checks,
    domainResults,
    passedCheckCount,
    failedCheckCount,
    totalCheckCount: checks.length,
    failedInvariants,
    compatibility,
    freezeStatus,
    lockStatus,
    freezeEligible,
    lockEligible,
    platformLock: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    certifiedPlatformIdentity: runtimeExecutiveStageExperiencePlatformIdentity,
    certifiedPlatformVersion: runtimeExecutiveStageExperiencePlatformVersion,
    readiness,
    summary,
  });
}

export function evaluateRuntimeExecutiveStageExperienceCompatibility():
  RuntimeExecutiveStageExperienceCompatibilityReport {
  return certifyRuntimeExecutiveStageExperiencePlatform().compatibility;
}

export function createRuntimeExecutiveStageExperienceFreezeContract(
  report?: RuntimeExecutiveStageExperienceCertificationResult,
): RuntimeExecutiveStageExperienceFreezeContract {
  const certification =
    report ?? certifyRuntimeExecutiveStageExperiencePlatform();
  const freezeEligible =
    certification.certificationStatus === "certified" &&
    certification.compatibility.overallStatus === "compatible" &&
    certification.failedCheckCount === 0;
  const freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus =
    freezeEligible ? "frozen" : "unfrozen";
  const lockStatus: RuntimeExecutiveStageExperienceLockStatus = freezeEligible
    ? "locked"
    : "unlocked";
  const readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness =
    freezeEligible ? "ReadyForPublicIndex" : "NotReadyForPublicIndex";

  return Object.freeze({
    certifiedIdentity: runtimeExecutiveStageExperiencePlatformIdentity,
    certificationStatus: freezeEligible
      ? "certified"
      : certification.certificationStatus === "certified" &&
          certification.compatibility.overallStatus !== "compatible"
        ? "failed"
        : certification.certificationStatus,
    compatibilityStatus: freezeEligible
      ? "compatible"
      : certification.compatibility.overallStatus,
    freezeStatus,
    lockStatus,
    platformLock: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    invariants: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS,
    approvedExports: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS,
    guarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES,
    consumerGuarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES,
    readiness,
  });
}

export function getRuntimeExecutiveStageExperienceLockDescriptor(
  report?: RuntimeExecutiveStageExperienceCertificationResult,
): RuntimeExecutiveStageExperienceLockDescriptor {
  const certification =
    report ?? certifyRuntimeExecutiveStageExperiencePlatform();
  const contract =
    createRuntimeExecutiveStageExperienceFreezeContract(certification);
  return Object.freeze({
    lockIdentity: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    platformIdentity: runtimeExecutiveStageExperiencePlatformIdentity,
    platformVersion: runtimeExecutiveStageExperiencePlatformVersion,
    certificationStatus: contract.certificationStatus,
    compatibilityStatus: contract.compatibilityStatus,
    freezeStatus: contract.freezeStatus,
    lockStatus: contract.lockStatus,
    invariantCount: contract.invariants.length,
    readiness: contract.readiness,
    publicationPolicy: "approved-exports-only" as const,
  });
}

export function inspectRuntimeExecutiveStageExperienceCertificationResult(
  result: RuntimeExecutiveStageExperienceCertificationResult,
): {
  readonly certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
  readonly totalCheckCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly freezeEligible: boolean;
  readonly summary: string;
} {
  return Object.freeze({
    certificationStatus: result.certificationStatus,
    compatibilityStatus: result.compatibility.overallStatus,
    freezeStatus: result.freezeStatus,
    lockStatus: result.lockStatus,
    readiness: result.readiness,
    totalCheckCount: result.totalCheckCount,
    passedCheckCount: result.passedCheckCount,
    failedCheckCount: result.failedCheckCount,
    freezeEligible: result.freezeEligible,
    summary: result.summary,
  });
}

export function verifyRuntimeExecutiveStageExperienceCertification(): {
  readonly ok: boolean;
  readonly report: RuntimeExecutiveStageExperienceCertificationResult;
  readonly allChecksPassed: boolean;
  readonly domainsCovered: boolean;
} {
  const report = certifyRuntimeExecutiveStageExperiencePlatform();
  const domainsCovered =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS.every((domain) =>
      report.checks.some((entry) => entry.domain === domain),
    );
  const allChecksPassed =
    report.failedCheckCount === 0 &&
    report.passedCheckCount === report.totalCheckCount;
  const ok =
    report.certificationStatus === "certified" &&
    allChecksPassed &&
    domainsCovered &&
    validateRuntimeExecutiveStageExperienceCertificationResult(report);

  return Object.freeze({
    ok,
    report,
    allChecksPassed,
    domainsCovered,
  });
}

export function verifyRuntimeExecutiveStageExperienceFreeze(): {
  readonly ok: boolean;
  readonly contract: RuntimeExecutiveStageExperienceFreezeContract;
  readonly certification: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly compatibility: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly platformLock: typeof REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED;
  readonly invariantCount: number;
  readonly approvedExportCount: number;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
} {
  const report = certifyRuntimeExecutiveStageExperiencePlatform();
  const contract =
    createRuntimeExecutiveStageExperienceFreezeContract(report);
  const invariantsOk =
    verifyRuntimeExecutiveStageExperienceFreezeInvariants().ok;
  const exportsOk = verifyRuntimeExecutiveStageExperienceApprovedExports().ok;
  const ok =
    contract.certificationStatus === "certified" &&
    contract.compatibilityStatus === "compatible" &&
    contract.freezeStatus === "frozen" &&
    contract.lockStatus === "locked" &&
    contract.platformLock ===
      REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED &&
    contract.invariants.length === 31 &&
    contract.approvedExports.length ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS.length &&
    contract.readiness === "ReadyForPublicIndex" &&
    validateRuntimeExecutiveStageExperienceFreezeContract(contract) &&
    invariantsOk &&
    exportsOk &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS);

  return Object.freeze({
    ok,
    contract,
    certification: contract.certificationStatus,
    compatibility: contract.compatibilityStatus,
    freezeStatus: contract.freezeStatus,
    lockStatus: contract.lockStatus,
    platformLock: contract.platformLock,
    invariantCount: contract.invariants.length,
    approvedExportCount: contract.approvedExports.length,
    readiness: contract.readiness,
  });
}

export function verifyRuntimeExecutiveStageExperiencePublicIndexReadiness(): {
  readonly ok: boolean;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
  readonly certified: boolean;
  readonly compatible: boolean;
  readonly frozen: boolean;
  readonly locked: boolean;
} {
  const report = certifyRuntimeExecutiveStageExperiencePlatform();
  const ok =
    report.readiness === "ReadyForPublicIndex" &&
    report.certificationStatus === "certified" &&
    report.compatibility.overallStatus === "compatible" &&
    report.freezeStatus === "frozen" &&
    report.lockStatus === "locked";
  return Object.freeze({
    ok,
    readiness: report.readiness,
    certified: report.certificationStatus === "certified",
    compatible: report.compatibility.overallStatus === "compatible",
    frozen: report.freezeStatus === "frozen",
    locked: report.lockStatus === "locked",
  });
}

export function getRuntimeExecutiveStageExperienceCertificationFreezeIdentity():
  typeof runtimeExecutiveStageExperienceCertificationFreezeCanonicalIdentity {
  return runtimeExecutiveStageExperienceCertificationFreezeCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceCertificationFreezeApiNames =
  Object.freeze([
    "certifyRuntimeExecutiveStageExperiencePlatform",
    "evaluateRuntimeExecutiveStageExperienceCompatibility",
    "createRuntimeExecutiveStageExperienceFreezeContract",
    "getRuntimeExecutiveStageExperienceLockDescriptor",
    "inspectRuntimeExecutiveStageExperienceCertificationResult",
    "verifyRuntimeExecutiveStageExperienceCertification",
    "verifyRuntimeExecutiveStageExperienceFreeze",
    "verifyRuntimeExecutiveStageExperienceFreezeInvariants",
    "verifyRuntimeExecutiveStageExperienceApprovedExports",
    "verifyRuntimeExecutiveStageExperiencePublicIndexReadiness",
    "isRuntimeExecutiveStageExperienceCertificationDomain",
    "isRuntimeExecutiveStageExperienceCertificationStatus",
    "isRuntimeExecutiveStageExperienceCompatibilityStatus",
    "isRuntimeExecutiveStageExperienceFreezeStatus",
    "isRuntimeExecutiveStageExperienceLockStatus",
    "validateRuntimeExecutiveStageExperienceCertificationResult",
    "validateRuntimeExecutiveStageExperienceFreezeContract",
    "verifyRuntimeExecutiveStageExperienceCertificationFreeze",
    "getRuntimeExecutiveStageExperienceCertificationFreezeIdentity",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_REGISTRY =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveStageExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveStageExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveStageExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveStageExperienceCertificationFreezeDomain,
    phase: runtimeExecutiveStageExperienceCertificationFreezePhase,
    role: runtimeExecutiveStageExperienceCertificationFreezeRole,
    dependencyIdentity:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyPath,
    sections:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS.length,
    domains: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS,
    domainCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS.length,
    invariants: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS.length,
    approvedExports: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS.length,
    certificationGuarantees:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES,
    certificationGuaranteeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES.length,
    consumerGuarantees:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES.length,
    frozenGuarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES,
    frozenGuaranteeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES.length,
    presentationStates:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES.length,
    platformLock: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    apis: runtimeExecutiveStageExperienceCertificationFreezeApiNames,
    apiCount:
      runtimeExecutiveStageExperienceCertificationFreezeApiNames.length,
  });

export const runtimeExecutiveStageExperienceCertificationFreeze =
  Object.freeze({
    phase: "CertificationFreeze" as const,
    name: "RuntimeExecutiveStageExperienceCertificationFreeze" as const,
    identity: runtimeExecutiveStageExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveStageExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveStageExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveStageExperienceCertificationFreezeLayer,
    domain: runtimeExecutiveStageExperienceCertificationFreezeDomain,
    role: runtimeExecutiveStageExperienceCertificationFreezeRole,
    architecturalRole:
      runtimeExecutiveStageExperienceCertificationFreezeArchitecturalRole,
    status: runtimeExecutiveStageExperienceCertificationFreezeStability,
    upstreamDependency:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyPath,
    deterministic:
      runtimeExecutiveStageExperienceCertificationFreezeDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    introducesStageBehavior: false as const,
    isFinalPublicConsumerIndex: false as const,
    principle:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_PRINCIPLE,
    boundary:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY,
    domains: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS,
    invariants: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS,
    approvedExports: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS,
    certificationGuarantees:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES,
    consumerGuarantees:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES,
    frozenGuarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES,
    platformLock: REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED,
    forbiddenResponsibilities:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_FORBIDDEN,
    publicApiSurface:
      runtimeExecutiveStageExperienceCertificationFreezeApiNames,
    registry:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_REGISTRY,
    platformBoundary: "REX-2:7-platform-only" as const,
    architecturalStatus:
      "REX-2:8 Runtime Executive Stage Experience Certification & Freeze — Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex" as const,
  });

export interface RuntimeExecutiveStageExperienceCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveStageExperienceCertificationFreezeVersion;
  readonly namespace: typeof runtimeExecutiveStageExperienceCertificationFreezeNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity;
  readonly certificationStatus: RuntimeExecutiveStageExperienceCertificationStatus;
  readonly compatibilityStatus: RuntimeExecutiveStageExperienceCompatibilityStatus;
  readonly freezeStatus: RuntimeExecutiveStageExperienceFreezeStatus;
  readonly lockStatus: RuntimeExecutiveStageExperienceLockStatus;
  readonly platformLock: typeof REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly invariantCount: number;
  readonly approvedExportCount: number;
  readonly consumerGuaranteeCount: number;
  readonly readiness: RuntimeExecutiveStageExperiencePublicIndexReadiness;
  readonly frozen: boolean;
  readonly platformBoundaryIntact: boolean;
  readonly introducesNoBehavior: boolean;
}

export function verifyRuntimeExecutiveStageExperienceCertificationFreeze():
  RuntimeExecutiveStageExperienceCertificationFreezeVerification {
  const freezeModule = runtimeExecutiveStageExperienceCertificationFreeze;
  const registry =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_REGISTRY;
  const certification = verifyRuntimeExecutiveStageExperienceCertification();
  const freeze = verifyRuntimeExecutiveStageExperienceFreeze();
  const report = certification.report;

  const identityOk =
    freezeModule.identity ===
      "REX-2:8/RuntimeExecutiveStageExperienceCertificationFreeze" &&
    freezeModule.version === "2.8.0" &&
    freezeModule.namespace ===
      "nexora.rex.stage-experience.certification-freeze" &&
    freezeModule.layer === "REX" &&
    freezeModule.role === "CertificationAndFreezeBoundary" &&
    freezeModule.upstreamDependency ===
      "REX-2:7/RuntimeExecutiveStageExperiencePlatform" &&
    freezeModule.upstreamDependency ===
      runtimeExecutiveStageExperiencePlatformIdentity &&
    freezeModule.platformBoundary === "REX-2:7-platform-only" &&
    freezeModule.introducesStageBehavior === false &&
    freezeModule.isFinalPublicConsumerIndex === false;

  const dependencyOk =
    freezeModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform" &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
      .consumesPlatformOnly === true &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
      .importsRex26Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_FREEZE_BOUNDARY
      .importsExDriDirectly === false;

  const countsAligned =
    registry.domainCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS.length &&
    registry.approvedExportCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS.length &&
    registry.apiCount ===
      runtimeExecutiveStageExperienceCertificationFreezeApiNames.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_REGISTRY_SECTIONS
        .length &&
    registry.consumerGuaranteeCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES.length;

  const frozen =
    Object.isFrozen(freezeModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_DOMAINS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FREEZE_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_APPROVED_EXPORTS) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CERTIFICATION_GUARANTEES,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONSUMER_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_GUARANTEES);

  const ok =
    identityOk &&
    dependencyOk &&
    countsAligned &&
    frozen &&
    certification.ok &&
    freeze.ok &&
    report.certificationStatus === "certified" &&
    report.compatibility.overallStatus === "compatible" &&
    report.freezeStatus === "frozen" &&
    report.lockStatus === "locked" &&
    report.readiness === "ReadyForPublicIndex" &&
    report.platformLock ===
      REX_2_RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_LOCKED &&
    report.failedCheckCount === 0 &&
    runtimeExecutiveStageExperiencePlatformCanonicalIdentity.identity ===
      runtimeExecutiveStageExperiencePlatformIdentity &&
    runtimeExecutiveStageExperiencePlatformLayer === "REX" &&
    runtimeExecutiveStageExperiencePlatformNamespace ===
      "nexora.rex.stage-experience.platform";

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveStageExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveStageExperienceCertificationFreezeNamespace,
    dependencyIdentity:
      runtimeExecutiveStageExperienceCertificationFreezeDependencyIdentity,
    certificationStatus: report.certificationStatus,
    compatibilityStatus: report.compatibility.overallStatus,
    freezeStatus: report.freezeStatus,
    lockStatus: report.lockStatus,
    platformLock: report.platformLock,
    domainCount: registry.domainCount,
    checkCount: report.totalCheckCount,
    passedCheckCount: report.passedCheckCount,
    failedCheckCount: report.failedCheckCount,
    invariantCount: registry.invariantCount,
    approvedExportCount: registry.approvedExportCount,
    consumerGuaranteeCount: registry.consumerGuaranteeCount,
    readiness: report.readiness,
    frozen,
    platformBoundaryIntact: dependencyOk,
    introducesNoBehavior: freezeModule.introducesStageBehavior === false,
  });
}

// ─── Approved frozen publication surface for REX-2:9 ────────────────────────
// Additive re-exports only. No wrappers. No behavioral changes.

export {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES,
  compareRuntimeExecutiveStageExperiencePlatformPlans,
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageExperiencePlatformCapabilities,
  getRuntimeExecutiveStageExperiencePlatformIdentity,
  resolveRuntimeExecutiveStageExperience,
  runtimeExecutiveStageExperiencePlatform,
  runtimeExecutiveStageExperiencePlatformApiNames,
  runtimeExecutiveStageExperiencePlatformCanonicalIdentity,
  runtimeExecutiveStageExperiencePlatformIdentity,
  runtimeExecutiveStageExperiencePlatformLayer,
  runtimeExecutiveStageExperiencePlatformNamespace,
  runtimeExecutiveStageExperiencePlatformVersion,
  validateRuntimeExecutiveStageExperiencePlatformInput,
  validateRuntimeExecutiveStageExperiencePlatformPlan,
  verifyRuntimeExecutiveStageExperiencePlatform,
};

export {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS,
  inspectRuntimeExecutiveStageExperiencePlatformResult,
} from "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform";

export type {
  RuntimeExecutiveStageExperienceComparison,
  RuntimeExecutiveStageExperiencePlan,
  RuntimeExecutiveStageExperiencePlatformCapability,
  RuntimeExecutiveStageExperiencePlatformConsumerInformation,
  RuntimeExecutiveStageExperiencePlatformGuarantee,
  RuntimeExecutiveStageExperiencePlatformInput,
  RuntimeExecutiveStageExperiencePlatformResult,
  RuntimeExecutiveStageExperiencePlatformStatus,
  RuntimeExecutiveStageExperiencePlatformValidation,
  RuntimeExecutiveStageFocusSelectionSource,
  RuntimeExecutiveStageModel,
} from "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform";
