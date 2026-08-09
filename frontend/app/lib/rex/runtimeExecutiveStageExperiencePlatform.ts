/**
 * REX-2:7 — Runtime Executive Stage Experience Platform.
 *
 * Canonical platform boundary over REX-2:6 orchestration. Packages approved
 * Stage Experience capabilities into one coherent, deterministic, immutable,
 * consumer-ready surface.
 *
 * Canonical flow:
 *   REX-2:6 Orchestration → REX-2:7 Platform → future certification/freeze
 *
 * REX-2:6 answers: What should the Executive Stage experience become now?
 * REX-2:7 answers: What is the stable Stage Experience Platform surface?
 *
 * Platform boundary only — not a renderer, not a second Stage architecture.
 */

import {
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS,
  compareRuntimeExecutiveStageExperiencePlans,
  createRuntimeExecutiveStageExperiencePlan,
  createRuntimeExecutiveStageModel,
  resolveRuntimeExecutiveStageExperiencePlan,
  runtimeExecutiveStageExperienceOrchestrationIdentity,
  runtimeExecutiveStageExperienceOrchestrationVersion,
  verifyRuntimeExecutiveStageExperienceOrchestration,
  verifyRuntimeExecutiveStageExperiencePlan,
  type RuntimeExecutiveStageExperienceComparison,
  type RuntimeExecutiveStageExperiencePlan,
  type RuntimeExecutiveStageFocusSelectionSource,
  type RuntimeExecutiveStageModel,
  type RuntimeExecutiveStageOrchestrationInput,
  type RuntimeExecutiveStageOrchestrationStatus,
  type RuntimeExecutiveStagePresentationAttentionResult,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration";

// Additive publication for REX-2:8 / REX-2:9 — re-export approved orchestration
// models without wrappers or semantic changes. Platform remains the sole
// immediate dependency for certification/freeze and Public Index.
export { createRuntimeExecutiveStageModel };
export type {
  RuntimeExecutiveStageExperienceComparison,
  RuntimeExecutiveStageExperiencePlan,
  RuntimeExecutiveStageFocusSelectionSource,
  RuntimeExecutiveStageModel,
  RuntimeExecutiveStagePresentationAttentionResult,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageExperiencePlatformIdentity =
  "REX-2:7/RuntimeExecutiveStageExperiencePlatform" as const;

export const runtimeExecutiveStageExperiencePlatformVersion =
  "2.7.0" as const;

export const runtimeExecutiveStageExperiencePlatformNamespace =
  "nexora.rex.stage-experience.platform" as const;

export const runtimeExecutiveStageExperiencePlatformLayer = "REX" as const;

export const runtimeExecutiveStageExperiencePlatformDomain =
  "Runtime Executive Stage Experience" as const;

export const runtimeExecutiveStageExperiencePlatformPhase =
  "Platform" as const;

export const runtimeExecutiveStageExperiencePlatformRole =
  "PlatformBoundary" as const;

export const runtimeExecutiveStageExperiencePlatformArchitecturalRole =
  "RuntimeExecutiveStageExperiencePlatformBoundary" as const;

export const runtimeExecutiveStageExperiencePlatformDependencyIdentity =
  runtimeExecutiveStageExperienceOrchestrationIdentity;

export const runtimeExecutiveStageExperiencePlatformDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration" as const;

export const runtimeExecutiveStageExperiencePlatformStability =
  "PlatformEstablished" as const;

export const runtimeExecutiveStageExperiencePlatformDeterministic =
  true as const;

export const runtimeExecutiveStageExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageExperiencePlatformMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStageExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageExperiencePlatformIdentity,
    version: runtimeExecutiveStageExperiencePlatformVersion,
    namespace: runtimeExecutiveStageExperiencePlatformNamespace,
    layer: runtimeExecutiveStageExperiencePlatformLayer,
    domain: runtimeExecutiveStageExperiencePlatformDomain,
    phase: runtimeExecutiveStageExperiencePlatformPhase,
    role: runtimeExecutiveStageExperiencePlatformRole,
    architecturalRole:
      runtimeExecutiveStageExperiencePlatformArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveStageExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveStageExperiencePlatformDependencyPath,
    upstreamVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
    stabilityStatus: runtimeExecutiveStageExperiencePlatformStability,
    deterministicStatus:
      runtimeExecutiveStageExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageExperiencePlatformSideEffectPolicy,
    mutationPolicy: runtimeExecutiveStageExperiencePlatformMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRINCIPLE =
  "REX-2:7 is the platform boundary for Runtime Executive Stage Experience. It publishes orchestration results through a stable surface; it does not render, invent meaning, or replace REX-2:6." as const;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    platformAuthority: "REX-2:7" as const,
    architecturalRole:
      "RuntimeExecutiveStageExperiencePlatformBoundary" as const,
    role: "PlatformBoundary" as const,
    soleImmediateDependency:
      "REX-2:6/RuntimeExecutiveStageExperienceOrchestration" as const,
    consumesOrchestrationOnly: true as const,
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
    orchestrationAuthorityRemainsRex26: true as const,
    isFinalPublicConsumerIndex: false as const,
    mutatesInput: false as const,
    inventsExecutiveMeaning: false as const,
    calculatesKpi: false as const,
    calculatesKoi: false as const,
    rendersUi: false as const,
    executesAnimation: false as const,
  });

// ─── Capabilities / statuses / vocabularies ─────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES =
  Object.freeze([
    "runtime-stage-experience",
    "nexora-object-experience",
    "focus-experience",
    "selection-experience",
    "attention-experience",
    "connection-experience",
    "scene-experience",
    "scene-change-experience",
    "presentation-state-experience",
    "stage-orchestration",
    "experience-plan",
    "deterministic-comparison",
    "validation",
  ] as const);

export type RuntimeExecutiveStageExperiencePlatformCapability =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES)[number];

/** Platform result statuses — aligned with REX-2:6 orchestration statuses. */
export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES =
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_STATUSES;

export type RuntimeExecutiveStageExperiencePlatformStatus =
  RuntimeExecutiveStageOrchestrationStatus;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_FOCUS_ROLES;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS =
  RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS =
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS =
  RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS =
  Object.freeze([
    "Identity",
    "Capabilities",
    "Orchestration",
    "Experience",
    "Validation",
    "Compatibility",
    "Registry",
    "ConsumerInformation",
  ] as const);

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "deterministic-stage-experience",
      order: 1,
      statement: "Stage Experience is deterministic.",
    }),
    Object.freeze({
      id: "inputs-not-mutated",
      order: 2,
      statement: "Inputs are not mutated.",
    }),
    Object.freeze({
      id: "outputs-immutable",
      order: 3,
      statement: "Outputs are immutable.",
    }),
    Object.freeze({
      id: "focus-distinct-from-selection",
      order: 4,
      statement: "Focus remains distinct from selection.",
    }),
    Object.freeze({
      id: "focus-distinct-from-attention",
      order: 5,
      statement: "Focus remains distinct from attention.",
    }),
    Object.freeze({
      id: "selection-distinct-from-attention",
      order: 6,
      statement: "Selection remains distinct from attention.",
    }),
    Object.freeze({
      id: "canonical-presentation-states",
      order: 7,
      statement: "Presentation states remain minimum/report/operation.",
    }),
    Object.freeze({
      id: "connections-are-experience-not-calculation",
      order: 8,
      statement:
        "Connections remain relationship experience, not business calculations.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 9,
      statement: "REX does not calculate KPI.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 10,
      statement: "REX does not calculate KOI.",
    }),
    Object.freeze({
      id: "no-executive-decisions",
      order: 11,
      statement: "REX does not invent executive decisions.",
    }),
    Object.freeze({
      id: "no-ui-rendering",
      order: 12,
      statement: "REX does not render UI.",
    }),
    Object.freeze({
      id: "no-threejs-ownership",
      order: 13,
      statement: "REX does not own Three.js.",
    }),
    Object.freeze({
      id: "no-react-ownership",
      order: 14,
      statement: "REX does not own React.",
    }),
    Object.freeze({
      id: "renderer-neutral-plans",
      order: 15,
      statement: "Stage Experience Plans remain renderer-neutral.",
    }),
    Object.freeze({
      id: "rex-2-6-orchestration-authority",
      order: 16,
      statement: "REX-2:6 remains the orchestration authority.",
    }),
    Object.freeze({
      id: "rex-2-7-platform-boundary",
      order: 17,
      statement: "REX-2:7 remains the platform boundary.",
    }),
    Object.freeze({
      id: "upstream-meaning-preserved",
      order: 18,
      statement: "Upstream runtime meaning is preserved.",
    }),
    Object.freeze({
      id: "equivalent-input-equivalent-output",
      order: 19,
      statement: "Equivalent input produces equivalent platform output.",
    }),
    Object.freeze({
      id: "no-internal-rex-2-required",
      order: 20,
      statement:
        "Consumers do not need direct access to REX-2:1–2:6 internals when the platform surface provides the capability.",
    }),
  ] as const);

export type RuntimeExecutiveStageExperiencePlatformGuarantee =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES)[number];

// ─── Public types ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageExperiencePlatformInput {
  readonly planId: string;
  readonly model: RuntimeExecutiveStageModel;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  /** Preferred selection-driven resolution path through REX-2:6. */
  readonly selectionSubjectId?: string;
  readonly focusRequest?: { readonly primaryFocusSubjectId: string };
  readonly previousPlan?: RuntimeExecutiveStageExperiencePlan;
  readonly enableNoiseReduction?: boolean;
  readonly interactionReason?: string;
  /**
   * Alternative: supply a fully prepared orchestration input.
   * When present with presentationAttention, used instead of selectionSubjectId path.
   */
  readonly presentationAttention?: RuntimeExecutiveStagePresentationAttentionResult;
  readonly reason?: RuntimeExecutiveStageOrchestrationInput["reason"];
}

export interface RuntimeExecutiveStageExperiencePlatformValidation {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<string>;
  readonly inputValid: boolean;
  readonly planValid: boolean;
  readonly orchestrationOk: boolean;
}

export interface RuntimeExecutiveStageExperiencePlatformResult {
  readonly status: RuntimeExecutiveStageExperiencePlatformStatus;
  readonly plan: RuntimeExecutiveStageExperiencePlan;
  readonly validation: RuntimeExecutiveStageExperiencePlatformValidation;
  readonly platformIdentity: typeof runtimeExecutiveStageExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeExecutiveStageExperiencePlatformVersion;
  readonly orchestrationIdentity: typeof runtimeExecutiveStageExperienceOrchestrationIdentity;
  readonly orchestrationVersion: typeof runtimeExecutiveStageExperienceOrchestrationVersion;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reasons: RuntimeExecutiveStageExperiencePlan["reasons"];
  readonly comparison?: RuntimeExecutiveStageExperienceComparison;
}

export interface RuntimeExecutiveStageExperiencePlatformConsumerInformation {
  readonly role: "PlatformBoundary";
  readonly isFinalPublicConsumerIndex: false;
  readonly supportedImportPath: typeof runtimeExecutiveStageExperiencePlatformDependencyPath;
  readonly platformImportPath: "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform";
  readonly guidance: string;
  readonly orchestrationAuthority: typeof runtimeExecutiveStageExperienceOrchestrationIdentity;
  readonly readyForCertificationAndFreeze: true;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveStageExperiencePlatformInput(
  input: RuntimeExecutiveStageExperiencePlatformInput,
): RuntimeExecutiveStageExperiencePlatformValidation {
  const issues: string[] = [];

  if (typeof input.planId !== "string" || input.planId.length === 0) {
    issues.push("missing-plan-id");
  }
  if (input.model === undefined || input.model === null) {
    issues.push("missing-model");
  } else {
    if (
      typeof input.model.identity?.modelId !== "string" ||
      input.model.identity.modelId.length === 0
    ) {
      issues.push("invalid-model-identity");
    }
    if (
      typeof input.model.identity?.sceneId !== "string" ||
      input.model.identity.sceneId.length === 0
    ) {
      issues.push("invalid-scene-identity");
    }
    if (!Array.isArray(input.model.subjects)) {
      issues.push("invalid-subjects");
    }
    if (!Array.isArray(input.model.connections)) {
      issues.push("invalid-connections");
    }
  }

  if (
    typeof input.source !== "string" ||
    input.source.length === 0
  ) {
    issues.push("missing-source");
  }

  const hasSelectionPath =
    typeof input.selectionSubjectId === "string" &&
    input.selectionSubjectId.length > 0;
  const hasPreparedPa = input.presentationAttention !== undefined;

  if (!hasSelectionPath && !hasPreparedPa) {
    issues.push("missing-selection-or-presentation-attention");
  }

  if (hasSelectionPath && input.model !== undefined) {
    const exists = input.model.subjects.some(
      (subject) => subject.subjectId === input.selectionSubjectId,
    );
    if (!exists) {
      issues.push("unknown-selection-subject");
    }
  }

  if (
    input.focusRequest?.primaryFocusSubjectId !== undefined &&
    input.model !== undefined
  ) {
    const exists = input.model.subjects.some(
      (subject) =>
        subject.subjectId === input.focusRequest!.primaryFocusSubjectId,
    );
    if (!exists) {
      issues.push("unknown-primary-focus-subject");
    }
  }

  if (input.previousPlan !== undefined) {
    const previousOk = verifyRuntimeExecutiveStageExperiencePlan(
      input.previousPlan,
    );
    if (!previousOk.ok) {
      issues.push("invalid-previous-plan");
    }
  }

  const orchestrationOk =
    verifyRuntimeExecutiveStageExperienceOrchestration().ok;
  if (!orchestrationOk) {
    issues.push("orchestration-boundary-unhealthy");
  }

  const inputValid = issues.length === 0;

  return Object.freeze({
    ok: inputValid && orchestrationOk,
    issues: Object.freeze(issues),
    inputValid,
    planValid: false,
    orchestrationOk,
  });
}

export function validateRuntimeExecutiveStageExperiencePlatformPlan(
  plan: RuntimeExecutiveStageExperiencePlan,
): RuntimeExecutiveStageExperiencePlatformValidation {
  const planCheck = verifyRuntimeExecutiveStageExperiencePlan(plan);
  const orchestrationOk =
    verifyRuntimeExecutiveStageExperienceOrchestration().ok;
  const issues = [...planCheck.issues];
  if (!orchestrationOk) issues.push("orchestration-boundary-unhealthy");

  return Object.freeze({
    ok: planCheck.ok && orchestrationOk,
    issues: Object.freeze(issues),
    inputValid: true,
    planValid: planCheck.ok,
    orchestrationOk,
  });
}

// ─── Primary platform operation ─────────────────────────────────────────────

function createInvalidPlatformResult(
  input: RuntimeExecutiveStageExperiencePlatformInput,
  validation: RuntimeExecutiveStageExperiencePlatformValidation,
): RuntimeExecutiveStageExperiencePlatformResult {
  const sceneId = input.model?.identity?.sceneId ?? "";
  const revision = input.model?.revision ?? "";
  const modelId = input.model?.identity?.modelId ?? "";
  const reasons = Object.freeze(
    validation.issues.map((issue) =>
      Object.freeze({
        kind: "invalid-input" as const,
        detail: issue,
      }),
    ),
  );

  const plan = Object.freeze({
    planId: input.planId || "",
    status: "invalid" as const,
    sceneId,
    revision,
    modelId,
    secondaryFocusSubjectIds: Object.freeze([] as string[]),
    contextualSubjectIds: Object.freeze([] as string[]),
    selectedSubjectIds: Object.freeze([] as string[]),
    attentionSubjectIds: Object.freeze([] as string[]),
    visibleSubjectIds: Object.freeze([] as string[]),
    suppressedSubjectIds: Object.freeze(
      (input.model?.subjects ?? []).map((subject) => subject.subjectId),
    ),
    subjects: Object.freeze(
      [] as RuntimeExecutiveStageExperiencePlan["subjects"],
    ),
    connections: Object.freeze(
      [] as RuntimeExecutiveStageExperiencePlan["connections"],
    ),
    emphasizedConnectionIds: Object.freeze([] as string[]),
    stagePresentationState: "minimum" as const,
    stageAttention: "normal" as const,
    sceneTransition: Object.freeze({
      intents: Object.freeze(["initial-scene"] as const),
      currentSceneId: sceneId,
      currentRevision: revision,
      reasons,
    }),
    reasons,
    source: input.source,
    focusSelection: Object.freeze({
      status: "invalid" as const,
      selection: Object.freeze({
        status: "invalid" as const,
        kind: "preserve" as const,
        selectionChanged: false,
        source: input.source,
        reason: Object.freeze({ kind: "invalid-target" as const }),
        modelId,
        sceneId,
        revision,
        issues: Object.freeze([...validation.issues]),
      }),
      focus: Object.freeze({
        status: "invalid" as const,
        supportingSubjectIds: Object.freeze([] as string[]),
        contextualSubjectIds: Object.freeze([] as string[]),
        backgroundSubjectIds: Object.freeze([] as string[]),
        unfocusedSubjectIds: Object.freeze([] as string[]),
        assignments: Object.freeze(
          [] as RuntimeExecutiveStageExperiencePlan["focusSelection"]["assignments"],
        ),
        focusChanged: false,
        source: input.source,
        reason: Object.freeze({ kind: "invalid-target" as const }),
        modelId,
        sceneId,
        revision,
        relationshipDepth: 0,
        issues: Object.freeze([...validation.issues]),
      }),
      orderedSupportingSubjectIds: Object.freeze([] as string[]),
      orderedContextualSubjectIds: Object.freeze([] as string[]),
      orderedBackgroundSubjectIds: Object.freeze([] as string[]),
      orderedUnfocusedSubjectIds: Object.freeze([] as string[]),
      assignments: Object.freeze(
        [] as RuntimeExecutiveStageExperiencePlan["focusSelection"]["assignments"],
      ),
      selectionChanged: false,
      focusChanged: false,
      source: input.source,
      reasons: Object.freeze([] as const),
      modelId,
      sceneId,
      revision,
      consistency: Object.freeze({
        ok: false,
        modelId,
        revision,
        checks: Object.freeze([] as const),
        issues: Object.freeze([] as const),
      }),
    }),
    presentationAttention: Object.freeze({
      status: "invalid" as const,
      presentation: Object.freeze({
        status: "invalid" as const,
        assignments: Object.freeze([] as const),
        presentationChanged: false,
        source: input.source,
        reasons: Object.freeze([] as const),
        modelId,
        sceneId,
        revision,
        issues: Object.freeze([...validation.issues]),
      }),
      attention: Object.freeze({
        status: "invalid" as const,
        assignments: Object.freeze([] as const),
        attentionChanged: false,
        source: input.source,
        reasons: Object.freeze([] as const),
        modelId,
        sceneId,
        revision,
        issues: Object.freeze([...validation.issues]),
      }),
      presentationAssignments: Object.freeze([] as const),
      attentionAssignments: Object.freeze([] as const),
      presentationChanged: false,
      attentionChanged: false,
      orderedAffectedSubjectIds: Object.freeze([] as const),
      reasons: Object.freeze([] as const),
      source: input.source,
      modelId,
      sceneId,
      revision,
      consistency: Object.freeze({
        ok: false,
        issues: Object.freeze([...validation.issues]),
        modelConsistency: Object.freeze({
          ok: false,
          modelId,
          revision,
          checks: Object.freeze([] as const),
          issues: Object.freeze([] as const),
        }),
        focusSelectionOk: false,
      }),
      focusSelection: Object.freeze({
        status: "invalid" as const,
        selection: Object.freeze({
          status: "invalid" as const,
          kind: "preserve" as const,
          selectionChanged: false,
          source: input.source,
          reason: Object.freeze({ kind: "invalid-target" as const }),
          modelId,
          sceneId,
          revision,
          issues: Object.freeze([...validation.issues]),
        }),
        focus: Object.freeze({
          status: "invalid" as const,
          supportingSubjectIds: Object.freeze([] as string[]),
          contextualSubjectIds: Object.freeze([] as string[]),
          backgroundSubjectIds: Object.freeze([] as string[]),
          unfocusedSubjectIds: Object.freeze([] as string[]),
          assignments: Object.freeze(
            [] as RuntimeExecutiveStageExperiencePlan["focusSelection"]["assignments"],
          ),
          focusChanged: false,
          source: input.source,
          reason: Object.freeze({ kind: "invalid-target" as const }),
          modelId,
          sceneId,
          revision,
          relationshipDepth: 0,
          issues: Object.freeze([...validation.issues]),
        }),
        orderedSupportingSubjectIds: Object.freeze([] as string[]),
        orderedContextualSubjectIds: Object.freeze([] as string[]),
        orderedBackgroundSubjectIds: Object.freeze([] as string[]),
        orderedUnfocusedSubjectIds: Object.freeze([] as string[]),
        assignments: Object.freeze(
          [] as RuntimeExecutiveStageExperiencePlan["focusSelection"]["assignments"],
        ),
        selectionChanged: false,
        focusChanged: false,
        source: input.source,
        reasons: Object.freeze([] as const),
        modelId,
        sceneId,
        revision,
        consistency: Object.freeze({
          ok: false,
          modelId,
          revision,
          checks: Object.freeze([] as const),
          issues: Object.freeze([] as const),
        }),
      }),
    }) as RuntimeExecutiveStageExperiencePlan["presentationAttention"],
    orchestrationIdentity:
      runtimeExecutiveStageExperienceOrchestrationIdentity,
    orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
  }) as RuntimeExecutiveStageExperiencePlan;

  return Object.freeze({
    status: "invalid" as const,
    plan,
    validation: Object.freeze({
      ...validation,
      planValid: false,
    }),
    platformIdentity: runtimeExecutiveStageExperiencePlatformIdentity,
    platformVersion: runtimeExecutiveStageExperiencePlatformVersion,
    orchestrationIdentity:
      runtimeExecutiveStageExperienceOrchestrationIdentity,
    orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
    source: input.source,
    reasons,
  });
}

export function resolveRuntimeExecutiveStageExperience(
  input: RuntimeExecutiveStageExperiencePlatformInput,
): RuntimeExecutiveStageExperiencePlatformResult {
  const inputValidation =
    validateRuntimeExecutiveStageExperiencePlatformInput(input);

  if (!inputValidation.ok) {
    return createInvalidPlatformResult(input, inputValidation);
  }

  const plan =
    input.presentationAttention !== undefined
      ? createRuntimeExecutiveStageExperiencePlan({
          planId: input.planId,
          model: input.model,
          presentationAttention: input.presentationAttention,
          previousPlan: input.previousPlan,
          source: input.source,
          enableNoiseReduction: input.enableNoiseReduction,
          interactionReason: input.interactionReason,
          ...(input.reason !== undefined ? { reason: input.reason } : {}),
        })
      : resolveRuntimeExecutiveStageExperiencePlan({
          planId: input.planId,
          model: input.model,
          selectionSubjectId: input.selectionSubjectId!,
          source: input.source,
          ...(input.focusRequest !== undefined
            ? { focusRequest: input.focusRequest }
            : {}),
          previousPlan: input.previousPlan,
          enableNoiseReduction: input.enableNoiseReduction,
          interactionReason: input.interactionReason,
        });

  const planValidation = validateRuntimeExecutiveStageExperiencePlatformPlan(
    plan,
  );
  const comparison =
    input.previousPlan !== undefined
      ? compareRuntimeExecutiveStageExperiencePlans(
          input.previousPlan,
          plan,
        )
      : undefined;

  const status: RuntimeExecutiveStageExperiencePlatformStatus =
    plan.status === "accepted" && planValidation.ok
      ? "accepted"
      : plan.status === "rejected"
        ? "rejected"
        : "invalid";

  return Object.freeze({
    status,
    plan,
    validation: Object.freeze({
      ok: inputValidation.ok && planValidation.ok,
      issues: Object.freeze([
        ...inputValidation.issues,
        ...planValidation.issues,
      ]),
      inputValid: inputValidation.inputValid,
      planValid: planValidation.planValid,
      orchestrationOk: planValidation.orchestrationOk,
    }),
    platformIdentity: runtimeExecutiveStageExperiencePlatformIdentity,
    platformVersion: runtimeExecutiveStageExperiencePlatformVersion,
    orchestrationIdentity:
      runtimeExecutiveStageExperienceOrchestrationIdentity,
    orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
    source: input.source,
    reasons: plan.reasons,
    ...(comparison !== undefined ? { comparison } : {}),
  });
}

// ─── Inspection helpers ─────────────────────────────────────────────────────

export function getRuntimeExecutiveStageExperiencePlatformCapabilities():
  typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES {
  return RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES;
}

export function inspectRuntimeExecutiveStageExperiencePlatformResult(
  result: RuntimeExecutiveStageExperiencePlatformResult,
): {
  readonly status: RuntimeExecutiveStageExperiencePlatformStatus;
  readonly planId: string;
  readonly sceneId: string;
  readonly primaryFocusSubjectId?: string;
  readonly selectedSubjectIds: ReadonlyArray<string>;
  readonly attentionSubjectIds: ReadonlyArray<string>;
  readonly visibleSubjectIds: ReadonlyArray<string>;
  readonly suppressedSubjectIds: ReadonlyArray<string>;
  readonly stagePresentationState: RuntimeExecutiveStageExperiencePlan["stagePresentationState"];
  readonly stageAttention: RuntimeExecutiveStageExperiencePlan["stageAttention"];
  readonly transitionIntents: ReadonlyArray<string>;
  readonly reasonCount: number;
  readonly validationOk: boolean;
} {
  return Object.freeze({
    status: result.status,
    planId: result.plan.planId,
    sceneId: result.plan.sceneId,
    ...(result.plan.primaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: result.plan.primaryFocusSubjectId }
      : {}),
    selectedSubjectIds: result.plan.selectedSubjectIds,
    attentionSubjectIds: result.plan.attentionSubjectIds,
    visibleSubjectIds: result.plan.visibleSubjectIds,
    suppressedSubjectIds: result.plan.suppressedSubjectIds,
    stagePresentationState: result.plan.stagePresentationState,
    stageAttention: result.plan.stageAttention,
    transitionIntents: result.plan.sceneTransition.intents,
    reasonCount: result.reasons.length,
    validationOk: result.validation.ok,
  });
}

export function compareRuntimeExecutiveStageExperiencePlatformPlans(
  left: RuntimeExecutiveStageExperiencePlan,
  right: RuntimeExecutiveStageExperiencePlan,
): RuntimeExecutiveStageExperienceComparison {
  return compareRuntimeExecutiveStageExperiencePlans(left, right);
}

export function getRuntimeExecutiveStageExperiencePlatformIdentity():
  typeof runtimeExecutiveStageExperiencePlatformCanonicalIdentity {
  return runtimeExecutiveStageExperiencePlatformCanonicalIdentity;
}

// ─── Registry / consumer / platform descriptor ──────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION =
  Object.freeze({
    role: "PlatformBoundary" as const,
    isFinalPublicConsumerIndex: false as const,
    supportedImportPath:
      runtimeExecutiveStageExperiencePlatformDependencyPath,
    platformImportPath:
      "@/app/lib/rex/runtimeExecutiveStageExperiencePlatform" as const,
    guidance:
      "REX-2:7 is the platform boundary for Runtime Executive Stage Experience. Prefer this surface over internal REX-2 modules when it provides the required capability. REX-2:7 is NOT the final frozen public consumer entry — that belongs to later certification/freeze/public-index stages.",
    orchestrationAuthority:
      runtimeExecutiveStageExperienceOrchestrationIdentity,
    readyForCertificationAndFreeze: true as const,
  }) satisfies RuntimeExecutiveStageExperiencePlatformConsumerInformation;

export const runtimeExecutiveStageExperiencePlatformApiNames = Object.freeze([
  "resolveRuntimeExecutiveStageExperience",
  "validateRuntimeExecutiveStageExperiencePlatformInput",
  "validateRuntimeExecutiveStageExperiencePlatformPlan",
  "getRuntimeExecutiveStageExperiencePlatformCapabilities",
  "inspectRuntimeExecutiveStageExperiencePlatformResult",
  "compareRuntimeExecutiveStageExperiencePlatformPlans",
  "verifyRuntimeExecutiveStageExperiencePlatform",
  "getRuntimeExecutiveStageExperiencePlatformIdentity",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY =
  Object.freeze({
    identity: runtimeExecutiveStageExperiencePlatformIdentity,
    version: runtimeExecutiveStageExperiencePlatformVersion,
    namespace: runtimeExecutiveStageExperiencePlatformNamespace,
    layer: runtimeExecutiveStageExperiencePlatformLayer,
    domain: runtimeExecutiveStageExperiencePlatformDomain,
    phase: runtimeExecutiveStageExperiencePlatformPhase,
    role: runtimeExecutiveStageExperiencePlatformRole,
    immediateDependency:
      runtimeExecutiveStageExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveStageExperiencePlatformDependencyPath,
    sections: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS.length,
    capabilities: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    statuses: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES,
    statusCount: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES.length,
    presentationStates:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES.length,
    attentionLevels:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS,
    attentionLevelCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS.length,
    objectDispositions:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS,
    connectionDispositions:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS,
    sceneTransitionIntents:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS,
    guarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES,
    guaranteeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.length,
    publicApis: runtimeExecutiveStageExperiencePlatformApiNames,
    publicApiCount: runtimeExecutiveStageExperiencePlatformApiNames.length,
    consumerInformation:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION,
  });

export const runtimeExecutiveStageExperiencePlatform = Object.freeze({
  phase: "Platform" as const,
  name: "RuntimeExecutiveStageExperiencePlatform" as const,
  identity: runtimeExecutiveStageExperiencePlatformIdentity,
  version: runtimeExecutiveStageExperiencePlatformVersion,
  namespace: runtimeExecutiveStageExperiencePlatformNamespace,
  layer: runtimeExecutiveStageExperiencePlatformLayer,
  domain: runtimeExecutiveStageExperiencePlatformDomain,
  role: runtimeExecutiveStageExperiencePlatformRole,
  architecturalRole:
    runtimeExecutiveStageExperiencePlatformArchitecturalRole,
  status: runtimeExecutiveStageExperiencePlatformStability,
  upstreamDependency:
    runtimeExecutiveStageExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveStageExperiencePlatformDependencyPath,
  deterministic: runtimeExecutiveStageExperiencePlatformDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY,
  sections: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS,
  capabilities: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES,
  statuses: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_STATUSES,
  presentationStates:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES,
  attentionLevels:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS,
  focusRoles: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_FOCUS_ROLES,
  objectDispositions:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_OBJECT_DISPOSITIONS,
  connectionDispositions:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONNECTION_DISPOSITIONS,
  sceneTransitionIntents:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SCENE_TRANSITION_INTENTS,
  guarantees: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES,
  consumerInformation:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION,
  publicApiSurface: runtimeExecutiveStageExperiencePlatformApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY,
  orchestration: Object.freeze({
    authority: runtimeExecutiveStageExperienceOrchestrationIdentity,
    version: runtimeExecutiveStageExperienceOrchestrationVersion,
    remainsOrchestrationAuthority: true as const,
  }),
  architecturalStatus:
    "REX-2:7 Runtime Executive Stage Experience Platform — PlatformEstablished · Deterministic · Immutable · RendererNeutral · ReadyForCertificationAndFreeze" as const,
});

export interface RuntimeExecutiveStageExperiencePlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveStageExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveStageExperiencePlatformNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageExperiencePlatformDependencyIdentity;
  readonly role: typeof runtimeExecutiveStageExperiencePlatformRole;
  readonly capabilityCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly orchestrationBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly platformOnly: boolean;
}

export function verifyRuntimeExecutiveStageExperiencePlatform():
  RuntimeExecutiveStageExperiencePlatformVerification {
  const registry = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY;
  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_REGISTRY) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CONSUMER_INFORMATION,
    ) &&
    Object.isFrozen(runtimeExecutiveStageExperiencePlatform);

  const orchestrationBoundaryIntact =
    runtimeExecutiveStageExperiencePlatformDependencyIdentity ===
      runtimeExecutiveStageExperienceOrchestrationIdentity &&
    runtimeExecutiveStageExperiencePlatformDependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageExperienceOrchestration" &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .consumesOrchestrationOnly === true &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .orchestrationAuthorityRemainsRex26 === true &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .importsRex25Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .importsRex24Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .isFinalPublicConsumerIndex === false &&
    verifyRuntimeExecutiveStageExperienceOrchestration().ok;

  const countsAligned =
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.length &&
    registry.publicApiCount ===
      runtimeExecutiveStageExperiencePlatformApiNames.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS.length;

  const guaranteesOrdered =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.length === 20 &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const platformOnly =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY.rendersUi === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY.executesAnimation ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY.calculatesKpi ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY.calculatesKoi ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
      .inventsExecutiveMeaning === false;

  const ok =
    frozen &&
    orchestrationBoundaryIntact &&
    countsAligned &&
    guaranteesOrdered &&
    platformOnly &&
    runtimeExecutiveStageExperiencePlatformIdentity ===
      "REX-2:7/RuntimeExecutiveStageExperiencePlatform" &&
    runtimeExecutiveStageExperiencePlatformVersion === "2.7.0" &&
    runtimeExecutiveStageExperiencePlatformNamespace ===
      "nexora.rex.stage-experience.platform" &&
    runtimeExecutiveStageExperiencePlatformRole === "PlatformBoundary" &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_PRESENTATION_STATES.length ===
      3;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageExperiencePlatformIdentity,
    version: runtimeExecutiveStageExperiencePlatformVersion,
    namespace: runtimeExecutiveStageExperiencePlatformNamespace,
    dependencyIdentity:
      runtimeExecutiveStageExperiencePlatformDependencyIdentity,
    role: runtimeExecutiveStageExperiencePlatformRole,
    capabilityCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_GUARANTEES.length,
    publicApiCount: runtimeExecutiveStageExperiencePlatformApiNames.length,
    sectionCount: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_SECTIONS.length,
    frozen,
    orchestrationBoundaryIntact,
    rendererIndependent:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_BOUNDARY
        .rendererIndependent,
    platformOnly,
  });
}
