/**
 * REX-3:7 — Runtime Executive Advisor Experience Platform.
 *
 * Assembles REX-3:6 Experience Orchestration into one canonical platform
 * boundary for certification, freeze, and eventual consumer publication.
 *
 * Canonical flow:
 *   REX-3:6 Experience Orchestration
 *     → Platform Assembly
 *     → Platform APIs
 *     → Compatibility + Guarantees
 *     → Consumer-ready Platform Surface
 *     → Ready for REX-3:8 Certification & Freeze
 *
 * Assembly only — no new business, AI, Stage, or orchestration semantics.
 */

import {
  RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY,
  RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS,
  RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS,
  RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES,
  RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES,
  RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS,
  isRuntimeExecutiveAdvisorExperienceStable,
  resolveRuntimeExecutiveAdvisorExperienceOrchestration,
  runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
  runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
  runtimeExecutiveAdvisorExperienceOrchestrationVersion,
  validateRuntimeExecutiveAdvisorExperienceOrchestration,
  verifyRuntimeExecutiveAdvisorExperienceOrchestration,
  type RuntimeExecutiveAdvisorExperienceOrchestrationResult,
  type RuntimeExecutiveAdvisorOrchestrationInput,
  type RuntimeExecutiveAdvisorOrchestrationMode,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperienceOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperiencePlatformIdentity =
  "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" as const;

export const runtimeExecutiveAdvisorExperiencePlatformVersion =
  "3.7.0" as const;

export const runtimeExecutiveAdvisorExperiencePlatformNamespace =
  "nexora.rex.advisor-experience.platform" as const;

export const runtimeExecutiveAdvisorExperiencePlatformLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorExperiencePlatformDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorExperiencePlatformPhase =
  "Platform" as const;

export const runtimeExecutiveAdvisorExperiencePlatformArchitecturalRole =
  "RuntimeExecutiveAdvisorExperiencePlatformBoundary" as const;

export const runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity =
  runtimeExecutiveAdvisorExperienceOrchestrationIdentity;

export const runtimeExecutiveAdvisorExperiencePlatformDependencyPath =
  runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath;

export const runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePlatform" as const;

export const runtimeExecutiveAdvisorExperiencePlatformStability =
  "PlatformReady" as const;

export const runtimeExecutiveAdvisorExperiencePlatformDeterministic =
  true as const;

export const runtimeExecutiveAdvisorExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorExperiencePlatformMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
    version: runtimeExecutiveAdvisorExperiencePlatformVersion,
    namespace: runtimeExecutiveAdvisorExperiencePlatformNamespace,
    layer: runtimeExecutiveAdvisorExperiencePlatformLayer,
    domain: runtimeExecutiveAdvisorExperiencePlatformDomain,
    phase: runtimeExecutiveAdvisorExperiencePlatformPhase,
    architecturalRole:
      runtimeExecutiveAdvisorExperiencePlatformArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity,
    dependencyPath: runtimeExecutiveAdvisorExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorExperienceOrchestrationVersion,
    stabilityStatus: runtimeExecutiveAdvisorExperiencePlatformStability,
    deterministicStatus:
      runtimeExecutiveAdvisorExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorExperiencePlatformSideEffectPolicy,
    mutationPolicy: runtimeExecutiveAdvisorExperiencePlatformMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PRINCIPLE =
  "Platform assembly exposes one stable Advisor runtime boundary. No new business, AI, Stage, or orchestration semantics — only coherent contracts, guarantees, and consumer policy." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  platformAuthority: "REX-3:7" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorExperiencePlatformBoundary" as const,
  soleImmediateDependency:
    "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" as const,
  consumesOrchestrationOnly: true as const,
  importsRex35Directly: false as const,
  importsRex34Directly: false as const,
  importsRex33Directly: false as const,
  importsRex32Directly: false as const,
  importsRex31Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  executesActions: false as const,
  mutatesStageState: false as const,
  ownsStage: false as const,
  navigatesApplication: false as const,
  rendersUi: false as const,
  forgesManagerConfirmation: false as const,
  inventsUpstreamBehavior: false as const,
  generatesProse: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES = Object.freeze([
  "idle",
  "ready",
  "active",
  "degraded",
  "blocked",
] as const);

export type RuntimeExecutiveAdvisorPlatformState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES = Object.freeze([
  "observe-only",
  "response",
  "guidance",
  "coordinated",
] as const);

export type RuntimeExecutiveAdvisorPlatformExecutionMode =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH = Object.freeze([
  "healthy",
  "degraded",
  "blocked",
] as const);

export type RuntimeExecutiveAdvisorPlatformHealth =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY = Object.freeze([
  "compatible",
  "incompatible",
] as const);

export type RuntimeExecutiveAdvisorPlatformCompatibility =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES = Object.freeze([
  "sole-immediate-dependency",
  "deterministic-resolution",
  "immutable-inputs",
  "immutable-results",
  "manager-authority-preservation",
  "stage-ownership-preservation",
  "no-direct-stage-mutation",
  "no-hidden-action-execution",
  "no-ai-dependency",
  "no-ui-dependency",
  "guidance-traceability",
  "coordination-traceability",
  "context-safety",
  "stale-context-protection",
  "confirmation-preservation",
  "presentation-state-compatibility",
  "stable-ordering",
  "stable-platform-contract",
] as const);

export type RuntimeExecutiveAdvisorPlatformGuarantee =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES =
  Object.freeze([
    "consume-platform-only",
    "do-not-import-rex-3-internals",
    "do-not-mutate-platform-results",
    "do-not-bypass-manager-confirmation",
    "do-not-execute-stage-actions-directly",
    "do-not-infer-causality-beyond-response",
    "do-not-rewrite-presentation-semantics",
    "do-not-assume-ai-provider",
  ] as const);

export type RuntimeExecutiveAdvisorPlatformConsumerPolicy =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES = Object.freeze([
  "advisor-runtime-foundation",
  "context-subject-grounding",
  "structured-response",
  "executive-guidance",
  "executive-action-options",
  "stage-coordination",
  "experience-orchestration",
  "manager-authority-protection",
  "context-freshness-protection",
  "confirmation-aware-actions",
  "stage-safe-coordination",
  "presentation-intent",
  "guidance-visibility",
  "action-visibility",
  "platform-health",
  "platform-compatibility",
  "platform-validation",
  "platform-readiness",
] as const);

export type RuntimeExecutiveAdvisorPlatformCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "PlatformStates",
    "ExecutionModes",
    "Health",
    "Compatibility",
    "PublicAPIs",
    "Capabilities",
    "Guarantees",
    "Validation",
    "ConsumerPolicy",
    "CertificationReadiness",
  ] as const);

export type RuntimeExecutiveAdvisorPlatformRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_VALIDATION_CODES = Object.freeze([
  "invalid-input",
  "invalid-orchestration",
  "incompatible-orchestration",
  "invalid-platform-state",
  "invalid-health-state",
  "invalid-readiness",
  "invalid-operational-state",
  "invalid-registry",
  "invalid-consumer-policy",
] as const);

export type RuntimeExecutiveAdvisorPlatformValidationCode =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_VALIDATION_CODES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_MODE_MAPPINGS = Object.freeze([
  Object.freeze({
    orchestrationMode: "passive" as const,
    executionMode: "observe-only" as const,
  }),
  Object.freeze({
    orchestrationMode: "responsive" as const,
    executionMode: "response" as const,
  }),
  Object.freeze({
    orchestrationMode: "guidance" as const,
    executionMode: "guidance" as const,
  }),
  Object.freeze({
    orchestrationMode: "coordinated" as const,
    executionMode: "coordinated" as const,
  }),
]);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorPlatformInput {
  readonly orchestrationInput: RuntimeExecutiveAdvisorOrchestrationInput;
}

export interface RuntimeExecutiveAdvisorPlatformMetadata {
  readonly identity: typeof runtimeExecutiveAdvisorExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorExperiencePlatformNamespace;
  readonly status: typeof runtimeExecutiveAdvisorExperiencePlatformStability;
}

export interface RuntimeExecutiveAdvisorExperiencePlatformResult {
  readonly state: RuntimeExecutiveAdvisorPlatformState;
  readonly executionMode: RuntimeExecutiveAdvisorPlatformExecutionMode;
  readonly orchestration: RuntimeExecutiveAdvisorExperienceOrchestrationResult;
  readonly health: RuntimeExecutiveAdvisorPlatformHealth;
  readonly compatibility: RuntimeExecutiveAdvisorPlatformCompatibility;
  readonly isReady: boolean;
  readonly isOperational: boolean;
  readonly metadata: RuntimeExecutiveAdvisorPlatformMetadata;
}

export interface RuntimeExecutiveAdvisorPlatformIssue {
  readonly code: RuntimeExecutiveAdvisorPlatformValidationCode | string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorPlatformValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorPlatformIssue>;
}

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER = Object.freeze({
  role: "RuntimeExecutiveAdvisorPlatformConsumer" as const,
  supportedDependencyBoundary:
    "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" as const,
  mayImportLowerRex3Phases: false as const,
  finalPublicEntry: false as const,
  finalPublicEntryBelongsTo: "REX-3:9/PublicIndex" as const,
});

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "sole-rex-36-dependency",
    order: 1,
    statement: "REX-3:7 imports only REX-3:6.",
  }),
  Object.freeze({
    id: "no-semantic-alteration",
    order: 2,
    statement: "Platform assembly does not alter REX-3:6 semantics.",
  }),
  Object.freeze({
    id: "deterministic-results",
    order: 3,
    statement: "Platform results remain deterministic.",
  }),
  Object.freeze({
    id: "immutable-inputs",
    order: 4,
    statement: "Platform inputs remain immutable.",
  }),
  Object.freeze({
    id: "no-forged-confirmation",
    order: 5,
    statement: "Manager confirmation is never synthesized.",
  }),
  Object.freeze({
    id: "manager-authority",
    order: 6,
    statement: "Manager authority is never weakened.",
  }),
  Object.freeze({
    id: "stage-ownership-external",
    order: 7,
    statement: "Stage ownership remains outside Advisor.",
  }),
  Object.freeze({
    id: "no-ai-required",
    order: 8,
    statement: "No AI provider is required.",
  }),
  Object.freeze({
    id: "no-ui-required",
    order: 9,
    statement: "No UI renderer is required.",
  }),
  Object.freeze({
    id: "no-hidden-execution",
    order: 10,
    statement: "No hidden action execution exists.",
  }),
  Object.freeze({
    id: "explicit-compatibility",
    order: 11,
    statement: "Platform compatibility is explicit.",
  }),
  Object.freeze({
    id: "consumer-platform-only",
    order: 12,
    statement: "Consumer APIs do not require lower REX-3 imports.",
  }),
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN = Object.freeze([
  "new guidance kinds",
  "new action kinds",
  "new coordination behavior",
  "new orchestration phases",
  "new presentation semantics",
  "new authority semantics",
  "new manager-confirmation rules",
  "setStageFocus()",
  "setStageSelection()",
  "changeStageScene()",
  "select()",
  "focus()",
  "highlight()",
  "navigate()",
  "openScenario()",
  "dispatch()",
  "LLM calls",
  "prompt templates",
  "React components",
  "useState",
  "useEffect",
  "JSX",
  "window",
  "document",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function issue(
  code: RuntimeExecutiveAdvisorPlatformValidationCode | string,
  message: string,
  path?: string,
): RuntimeExecutiveAdvisorPlatformIssue {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

function includesString(
  collection: ReadonlyArray<string>,
  value: unknown,
): boolean {
  return typeof value === "string" && collection.includes(value);
}

// ─── Type guards ────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorPlatformState(
  value: unknown,
): value is RuntimeExecutiveAdvisorPlatformState {
  return includesString(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES, value);
}

export function isRuntimeExecutiveAdvisorPlatformExecutionMode(
  value: unknown,
): value is RuntimeExecutiveAdvisorPlatformExecutionMode {
  return includesString(
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES,
    value,
  );
}

export function isRuntimeExecutiveAdvisorPlatformHealth(
  value: unknown,
): value is RuntimeExecutiveAdvisorPlatformHealth {
  return includesString(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH, value);
}

export function isRuntimeExecutiveAdvisorPlatformCompatibility(
  value: unknown,
): value is RuntimeExecutiveAdvisorPlatformCompatibility {
  return includesString(
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY,
    value,
  );
}

// ─── Empty / metadata ───────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA: RuntimeExecutiveAdvisorPlatformMetadata =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
    version: runtimeExecutiveAdvisorExperiencePlatformVersion,
    namespace: runtimeExecutiveAdvisorExperiencePlatformNamespace,
    status: runtimeExecutiveAdvisorExperiencePlatformStability,
  });

// ─── Resolvers ──────────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveAdvisorPlatformExecutionMode(
  mode: RuntimeExecutiveAdvisorOrchestrationMode,
): RuntimeExecutiveAdvisorPlatformExecutionMode {
  const mapping = RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_MODE_MAPPINGS.find(
    (entry) => entry.orchestrationMode === mode,
  );
  return mapping?.executionMode ?? "observe-only";
}

export function resolveRuntimeExecutiveAdvisorPlatformCompatibility(
  orchestration: RuntimeExecutiveAdvisorExperienceOrchestrationResult,
): RuntimeExecutiveAdvisorPlatformCompatibility {
  const plan = orchestration.plan;
  const planValidation =
    validateRuntimeExecutiveAdvisorExperienceOrchestration(plan);

  if (!planValidation.ok) {
    return "incompatible";
  }

  if (
    !includesString(RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES, plan.state)
  ) {
    return "incompatible";
  }
  if (
    !includesString(RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES, plan.mode)
  ) {
    return "incompatible";
  }
  if (
    !includesString(RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS, plan.freshness)
  ) {
    return "incompatible";
  }

  for (const step of plan.steps) {
    if (
      !includesString(
        RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS,
        step.presentationIntent,
      ) ||
      !includesString(
        RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY,
        step.guidanceVisibility,
      ) ||
      !includesString(
        RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY,
        step.actionVisibility,
      ) ||
      !includesString(
        RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS,
        step.coordinationExecutionIntent,
      )
    ) {
      return "incompatible";
    }

    // Confirmation must never appear ready.
    if (
      step.actionVisibility === "confirmation-required" &&
      step.coordinationExecutionIntent === "ready"
    ) {
      return "incompatible";
    }
  }

  if (plan.freshness === "stale" && plan.state === "active") {
    return "incompatible";
  }
  if (plan.state === "blocked" && plan.isExecutable === true) {
    return "incompatible";
  }
  if (
    plan.orchestrationIdentity !==
      runtimeExecutiveAdvisorExperienceOrchestrationIdentity ||
    plan.orchestrationVersion !==
      runtimeExecutiveAdvisorExperienceOrchestrationVersion
  ) {
    return "incompatible";
  }

  return "compatible";
}

export function resolveRuntimeExecutiveAdvisorPlatformState(input: {
  readonly orchestration: RuntimeExecutiveAdvisorExperienceOrchestrationResult;
  readonly compatibility: RuntimeExecutiveAdvisorPlatformCompatibility;
}): RuntimeExecutiveAdvisorPlatformState {
  const { orchestration, compatibility } = input;
  const plan = orchestration.plan;

  if (compatibility === "incompatible") {
    return "blocked";
  }

  if (plan.state === "blocked") {
    // Partially usable when guidance/response remains visible.
    const retainsContext = plan.steps.some(
      (step) =>
        step.guidanceVisibility !== "hidden" ||
        step.presentationIntent === "summary" ||
        step.presentationIntent === "guidance",
    );
    return retainsContext ? "degraded" : "blocked";
  }

  if (plan.state === "suspended") {
    return "degraded";
  }

  if (plan.state === "idle" && plan.mode === "passive" && plan.steps.length === 0) {
    return "idle";
  }

  if (plan.state === "completed" && plan.mode === "passive") {
    return "idle";
  }

  if (
    plan.state === "active" &&
    (plan.mode === "guidance" ||
      plan.mode === "coordinated" ||
      plan.mode === "responsive")
  ) {
    return "active";
  }

  if (plan.state === "prepared" || plan.state === "active") {
    return plan.mode === "passive" ? "ready" : "active";
  }

  if (plan.isStable && plan.steps.length === 0) {
    return "idle";
  }

  return "ready";
}

export function resolveRuntimeExecutiveAdvisorPlatformHealth(input: {
  readonly state: RuntimeExecutiveAdvisorPlatformState;
  readonly compatibility: RuntimeExecutiveAdvisorPlatformCompatibility;
  readonly orchestration: RuntimeExecutiveAdvisorExperienceOrchestrationResult;
}): RuntimeExecutiveAdvisorPlatformHealth {
  if (input.compatibility === "incompatible" || input.state === "blocked") {
    return "blocked";
  }
  if (input.state === "degraded" || input.orchestration.plan.state === "blocked") {
    return "degraded";
  }
  if (input.orchestration.plan.state === "suspended") {
    return "degraded";
  }
  // Preserve orchestration stability signal without inventing a second model.
  if (
    input.orchestration.plan.state === "active" &&
    !isRuntimeExecutiveAdvisorExperienceStable(input.orchestration.plan) &&
    input.orchestration.plan.stability === "unstable"
  ) {
    return "degraded";
  }
  return "healthy";
}

export function isRuntimeExecutiveAdvisorPlatformReady(
  result: RuntimeExecutiveAdvisorExperiencePlatformResult,
): boolean {
  return (
    result.isReady === true &&
    result.compatibility === "compatible" &&
    result.health !== "blocked" &&
    result.state !== "blocked"
  );
}

export function isRuntimeExecutiveAdvisorPlatformOperational(
  result: RuntimeExecutiveAdvisorExperiencePlatformResult,
): boolean {
  if (result.compatibility === "incompatible" || result.state === "blocked") {
    return false;
  }
  if (result.health === "blocked") {
    return false;
  }
  // Degraded remains partially usable when repository semantics allow.
  if (result.state === "degraded" && result.health === "degraded") {
    return true;
  }
  return (
    result.isOperational === true &&
    (result.health === "healthy" || result.health === "degraded") &&
    (result.state === "ready" ||
      result.state === "active" ||
      result.state === "degraded")
  );
}

/**
 * Primary REX-3:7 entry: assemble a platform result from REX-3:6 orchestration.
 */
export function resolveRuntimeExecutiveAdvisorExperiencePlatform(
  input: RuntimeExecutiveAdvisorPlatformInput,
): RuntimeExecutiveAdvisorExperiencePlatformResult {
  const orchestration = resolveRuntimeExecutiveAdvisorExperienceOrchestration(
    input.orchestrationInput,
  );
  const compatibility =
    resolveRuntimeExecutiveAdvisorPlatformCompatibility(orchestration);
  const executionMode = resolveRuntimeExecutiveAdvisorPlatformExecutionMode(
    orchestration.plan.mode,
  );
  const state = resolveRuntimeExecutiveAdvisorPlatformState({
    orchestration,
    compatibility,
  });
  const health = resolveRuntimeExecutiveAdvisorPlatformHealth({
    state,
    compatibility,
    orchestration,
  });

  const isReady =
    compatibility === "compatible" &&
    health !== "blocked" &&
    state !== "blocked";

  // Idle is structurally ready but not currently operational.
  const isOperational =
    isReady &&
    state !== "idle" &&
    (state === "active" || state === "ready" || state === "degraded");

  return Object.freeze({
    state,
    executionMode,
    orchestration,
    health,
    compatibility,
    isReady,
    isOperational,
    metadata: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorExperiencePlatform(
  value: unknown,
): RuntimeExecutiveAdvisorPlatformValidationResult {
  const issues: RuntimeExecutiveAdvisorPlatformIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-input", "platform result must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorPlatformState(value.state)) {
    issues.push(
      issue("invalid-platform-state", "platform state invalid", "state"),
    );
  }
  if (!isRuntimeExecutiveAdvisorPlatformExecutionMode(value.executionMode)) {
    issues.push(
      issue(
        "invalid-platform-state",
        "executionMode invalid",
        "executionMode",
      ),
    );
  }
  if (!isRuntimeExecutiveAdvisorPlatformHealth(value.health)) {
    issues.push(
      issue("invalid-health-state", "health invalid", "health"),
    );
  }
  if (!isRuntimeExecutiveAdvisorPlatformCompatibility(value.compatibility)) {
    issues.push(
      issue(
        "incompatible-orchestration",
        "compatibility invalid",
        "compatibility",
      ),
    );
  }
  if (typeof value.isReady !== "boolean") {
    issues.push(
      issue("invalid-readiness", "isReady must be boolean", "isReady"),
    );
  }
  if (typeof value.isOperational !== "boolean") {
    issues.push(
      issue(
        "invalid-operational-state",
        "isOperational must be boolean",
        "isOperational",
      ),
    );
  }

  if (!isPlainObject(value.orchestration)) {
    issues.push(
      issue(
        "invalid-orchestration",
        "orchestration result required",
        "orchestration",
      ),
    );
  } else if (!isPlainObject(value.orchestration.plan)) {
    issues.push(
      issue(
        "invalid-orchestration",
        "orchestration.plan required",
        "orchestration.plan",
      ),
    );
  } else {
    const planValidation = validateRuntimeExecutiveAdvisorExperienceOrchestration(
      value.orchestration.plan,
    );
    if (!planValidation.ok && value.compatibility === "compatible") {
      issues.push(
        issue(
          "incompatible-orchestration",
          "compatible platform cannot wrap invalid orchestration",
          "compatibility",
        ),
      );
    }
  }

  if (value.state === "blocked" && value.isOperational === true) {
    issues.push(
      issue(
        "invalid-operational-state",
        "blocked platform cannot be operational",
        "isOperational",
      ),
    );
  }
  if (value.state === "idle" && value.isOperational === true) {
    issues.push(
      issue(
        "invalid-operational-state",
        "idle platform is not operational",
        "isOperational",
      ),
    );
  }
  if (value.health === "blocked" && value.isReady === true) {
    issues.push(
      issue(
        "invalid-readiness",
        "blocked health cannot be ready",
        "isReady",
      ),
    );
  }
  if (value.state === "degraded" && value.health === "healthy") {
    issues.push(
      issue(
        "invalid-health-state",
        "degraded state should not report healthy",
        "health",
      ),
    );
  }
  if (
    value.compatibility === "incompatible" &&
    value.health === "healthy" &&
    value.isReady === true
  ) {
    issues.push(
      issue(
        "incompatible-orchestration",
        "incompatible platform cannot be ready/healthy",
        "compatibility",
      ),
    );
  }

  if (!isPlainObject(value.metadata)) {
    issues.push(
      issue("invalid-registry", "metadata required", "metadata"),
    );
  } else if (
    value.metadata.identity !==
      runtimeExecutiveAdvisorExperiencePlatformIdentity ||
    value.metadata.version !==
      runtimeExecutiveAdvisorExperiencePlatformVersion ||
    value.metadata.namespace !==
      runtimeExecutiveAdvisorExperiencePlatformNamespace ||
    value.metadata.status !==
      runtimeExecutiveAdvisorExperiencePlatformStability
  ) {
    issues.push(
      issue(
        "invalid-registry",
        "platform metadata identity/version/namespace/status invalid",
        "metadata",
      ),
    );
  }

  // Mode mapping consistency with orchestration when compatible.
  if (
    isPlainObject(value.orchestration) &&
    isPlainObject(value.orchestration.plan) &&
    typeof value.orchestration.plan.mode === "string" &&
    isRuntimeExecutiveAdvisorPlatformExecutionMode(value.executionMode) &&
    value.compatibility === "compatible"
  ) {
    const expected = resolveRuntimeExecutiveAdvisorPlatformExecutionMode(
      value.orchestration.plan.mode as RuntimeExecutiveAdvisorOrchestrationMode,
    );
    if (value.executionMode !== expected) {
      issues.push(
        issue(
          "invalid-platform-state",
          "executionMode inconsistent with orchestration mode",
          "executionMode",
        ),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function isRuntimeExecutiveAdvisorPlatformCertificationReady(): boolean {
  const verification = verifyRuntimeExecutiveAdvisorExperiencePlatform();
  return (
    verification.ok === true &&
    verification.orchestrationOk === true &&
    verification.noStageMutation === true &&
    verification.noAi === true &&
    verification.noUi === true &&
    verification.guaranteeCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length &&
    verification.capabilityCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES.length &&
    verification.consumerPolicyCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length
  );
}

export function isRuntimeExecutiveAdvisorPlatformFreezeReady(): boolean {
  return (
    isRuntimeExecutiveAdvisorPlatformCertificationReady() &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY.inventsUpstreamBehavior ===
      false &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY.soleImmediateDependency ===
      "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY.executesActions === false &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY.ownsStage === false
  );
}

export function getRuntimeExecutiveAdvisorExperiencePlatformIdentity():
  typeof runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity {
  return runtimeExecutiveAdvisorExperiencePlatformCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperiencePlatformApiNames = Object.freeze([
  "resolveRuntimeExecutiveAdvisorExperiencePlatform",
  "resolveRuntimeExecutiveAdvisorPlatformState",
  "resolveRuntimeExecutiveAdvisorPlatformExecutionMode",
  "resolveRuntimeExecutiveAdvisorPlatformHealth",
  "resolveRuntimeExecutiveAdvisorPlatformCompatibility",
  "isRuntimeExecutiveAdvisorPlatformReady",
  "isRuntimeExecutiveAdvisorPlatformOperational",
  "validateRuntimeExecutiveAdvisorExperiencePlatform",
  "isRuntimeExecutiveAdvisorPlatformCertificationReady",
  "isRuntimeExecutiveAdvisorPlatformFreezeReady",
  "verifyRuntimeExecutiveAdvisorExperiencePlatform",
  "getRuntimeExecutiveAdvisorExperiencePlatformIdentity",
  "isRuntimeExecutiveAdvisorPlatformState",
  "isRuntimeExecutiveAdvisorPlatformExecutionMode",
  "isRuntimeExecutiveAdvisorPlatformHealth",
  "isRuntimeExecutiveAdvisorPlatformCompatibility",
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorPlatformState",
    "RuntimeExecutiveAdvisorPlatformExecutionMode",
    "RuntimeExecutiveAdvisorPlatformHealth",
    "RuntimeExecutiveAdvisorPlatformCompatibility",
    "RuntimeExecutiveAdvisorPlatformGuarantee",
    "RuntimeExecutiveAdvisorPlatformConsumerPolicy",
    "RuntimeExecutiveAdvisorPlatformCapability",
    "RuntimeExecutiveAdvisorPlatformRegistrySection",
    "RuntimeExecutiveAdvisorPlatformValidationCode",
    "RuntimeExecutiveAdvisorPlatformInput",
    "RuntimeExecutiveAdvisorPlatformMetadata",
    "RuntimeExecutiveAdvisorExperiencePlatformResult",
    "RuntimeExecutiveAdvisorPlatformIssue",
    "RuntimeExecutiveAdvisorPlatformValidationResult",
    "RuntimeExecutiveAdvisorExperiencePlatformVerification",
  ] as const);

export const runtimeExecutiveAdvisorExperiencePlatformRegistry = Object.freeze({
  identity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
  version: runtimeExecutiveAdvisorExperiencePlatformVersion,
  namespace: runtimeExecutiveAdvisorExperiencePlatformNamespace,
  layer: runtimeExecutiveAdvisorExperiencePlatformLayer,
  domain: runtimeExecutiveAdvisorExperiencePlatformDomain,
  phase: runtimeExecutiveAdvisorExperiencePlatformPhase,
  dependencyIdentity:
    runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorExperiencePlatformDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS.length,
  platformStates: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES,
  platformStateCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES.length,
  executionModes: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES,
  executionModeCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES.length,
  health: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH,
  healthCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH.length,
  compatibility: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY,
  compatibilityCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY.length,
  publicApis: runtimeExecutiveAdvisorExperiencePlatformApiNames,
  publicApiCount: runtimeExecutiveAdvisorExperiencePlatformApiNames.length,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES.length,
  guarantees: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length,
  consumerPolicies: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES,
  consumerPolicyCount:
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length,
  publicTypes: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES,
  publicTypeCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES.length,
  validationCodes: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_VALIDATION_CODES,
  validationCodeCount:
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_VALIDATION_CODES.length,
});

export const runtimeExecutiveAdvisorExperiencePlatform = Object.freeze({
  phase: "Platform" as const,
  name: "RuntimeExecutiveAdvisorExperiencePlatform" as const,
  identity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
  version: runtimeExecutiveAdvisorExperiencePlatformVersion,
  namespace: runtimeExecutiveAdvisorExperiencePlatformNamespace,
  layer: runtimeExecutiveAdvisorExperiencePlatformLayer,
  domain: runtimeExecutiveAdvisorExperiencePlatformDomain,
  architecturalRole:
    runtimeExecutiveAdvisorExperiencePlatformArchitecturalRole,
  role: "Platform" as const,
  status: runtimeExecutiveAdvisorExperiencePlatformStability,
  upstreamDependency:
    runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorExperiencePlatformDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorExperiencePlatformSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorExperiencePlatformDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_BOUNDARY,
  platformStates: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES,
  executionModes: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES,
  health: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH,
  compatibility: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES,
  guarantees: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES,
  consumerPolicies: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES,
  consumer: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER,
  metadata: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_INVARIANTS,
  forbiddenResponsibilities: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_FORBIDDEN,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorExperiencePlatformApiNames,
  registry: runtimeExecutiveAdvisorExperiencePlatformRegistry,
  orchestrationBoundary: "REX-3:6-experience-orchestration-only" as const,
  architecturalStatus:
    "REX-3:7 Platform Complete — Ready for REX-3:8 Certification & Freeze" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorExperiencePlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorExperiencePlatformNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity;
  readonly platformStateCount: number;
  readonly executionModeCount: number;
  readonly healthCount: number;
  readonly compatibilityCount: number;
  readonly capabilityCount: number;
  readonly guaranteeCount: number;
  readonly consumerPolicyCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly orchestrationBoundaryIntact: boolean;
  readonly noStageMutation: boolean;
  readonly noNavigation: boolean;
  readonly noUi: boolean;
  readonly noAutoExecution: boolean;
  readonly orchestrationOk: boolean;
  readonly noAi: boolean;
  readonly noNewBehavior: boolean;
}

export function verifyRuntimeExecutiveAdvisorExperiencePlatform():
  RuntimeExecutiveAdvisorExperiencePlatformVerification {
  const module = runtimeExecutiveAdvisorExperiencePlatform;
  const registry = runtimeExecutiveAdvisorExperiencePlatformRegistry;
  const orchestrationOk =
    verifyRuntimeExecutiveAdvisorExperienceOrchestration();

  const identityOk =
    module.identity ===
      "REX-3:7/RuntimeExecutiveAdvisorExperiencePlatform" &&
    module.version === "3.7.0" &&
    module.namespace === "nexora.rex.advisor-experience.platform" &&
    module.status === "PlatformReady" &&
    module.upstreamDependency ===
      "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorExperienceOrchestration" &&
    module.orchestrationBoundary ===
      "REX-3:6-experience-orchestration-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES], [
      "idle",
      "ready",
      "active",
      "degraded",
      "blocked",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES], [
      "observe-only",
      "response",
      "guidance",
      "coordinated",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS],
      [
        "Identity",
        "PlatformStates",
        "ExecutionModes",
        "Health",
        "Compatibility",
        "PublicAPIs",
        "Capabilities",
        "Guarantees",
        "Validation",
        "ConsumerPolicy",
        "CertificationReadiness",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length === 18 &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length === 8 &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES.length === 18 &&
    RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_MODE_MAPPINGS.length === 4;

  const modeMapOk =
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("passive") ===
      "observe-only" &&
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("responsive") ===
      "response" &&
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("guidance") ===
      "guidance" &&
    resolveRuntimeExecutiveAdvisorPlatformExecutionMode("coordinated") ===
      "coordinated";

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_METADATA);

  const orchestrationBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" &&
    module.boundary.consumesOrchestrationOnly === true &&
    module.boundary.importsRex35Directly === false &&
    module.boundary.importsRex34Directly === false &&
    module.boundary.executesActions === false &&
    module.boundary.mutatesStageState === false &&
    module.boundary.ownsStage === false &&
    module.boundary.rendersUi === false &&
    module.boundary.inventsUpstreamBehavior === false;

  const countIntegrity =
    registry.platformStateCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES.length &&
    registry.executionModeCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES.length &&
    registry.publicApiCount ===
      runtimeExecutiveAdvisorExperiencePlatformApiNames.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length &&
    registry.consumerPolicyCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length;

  const ok =
    identityOk &&
    vocabOk &&
    modeMapOk &&
    frozen &&
    orchestrationBoundaryIntact &&
    countIntegrity &&
    orchestrationOk.ok === true &&
    module.boundary.aiProviderIndependent === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorExperiencePlatformIdentity,
    version: runtimeExecutiveAdvisorExperiencePlatformVersion,
    namespace: runtimeExecutiveAdvisorExperiencePlatformNamespace,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperiencePlatformDependencyIdentity,
    platformStateCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_STATES.length,
    executionModeCount:
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_EXECUTION_MODES.length,
    healthCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_HEALTH.length,
    compatibilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_COMPATIBILITY.length,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CAPABILITIES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_GUARANTEES.length,
    consumerPolicyCount:
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_CONSUMER_POLICIES.length,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_PLATFORM_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveAdvisorExperiencePlatformApiNames.length,
    frozen,
    orchestrationBoundaryIntact,
    noStageMutation: module.boundary.mutatesStageState === false,
    noNavigation: module.boundary.navigatesApplication === false,
    noUi: module.boundary.rendersUi === false,
    noAutoExecution: module.boundary.executesActions === false,
    orchestrationOk: orchestrationOk.ok === true,
    noAi: module.boundary.aiProviderIndependent === true,
    noNewBehavior: module.boundary.inventsUpstreamBehavior === false,
  });
}
