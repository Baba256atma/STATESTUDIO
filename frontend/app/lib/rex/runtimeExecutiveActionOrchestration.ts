/**
 * REX-5:6 — Runtime Executive Action Orchestration.
 *
 * Coordinates the deterministic runtime progression of an Executive Action
 * across REX-5 gates without external delivery or execution.
 *
 * Canonical flow:
 *   REX-5:5 Confirmation & Safety → REX-5:6 Orchestration → later Platform
 *
 * Answers:
 *   What canonical runtime path should this action follow?
 *   What phase is it in, what is required next, and what downstream
 *   orchestration output may be emitted after successful confirmation?
 *
 * Orchestration ≠ External Execution.
 * Confirmed ≠ Delivered.
 * Dispatch Request ≠ Dispatch Completion.
 *
 * No UI, no AI, no provider routing, no recipient resolution, no dispatch.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canConfirmRuntimeExecutiveAction,
  createRuntimeExecutiveActionConfirmationFingerprint,
  createRuntimeExecutiveActionConfirmationScope,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  hasRuntimeExecutiveActionChangedSincePreview,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionConfirmationSafetyIdentity,
  runtimeExecutiveActionConfirmationSafetySupportedImportPath,
  runtimeExecutiveActionConfirmationSafetyVersion,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionPresentationPreviewIdentity,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionPresentationPreview,
  type RuntimeExecutiveActionAcknowledgment,
  type RuntimeExecutiveActionConfirmation,
  type RuntimeExecutiveActionConfirmationResult,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionIntentContextRequest,
  type RuntimeExecutiveActionIntentContextResult,
  type RuntimeExecutiveActionPreparationResult,
  type RuntimeExecutiveActionPreviewResult,
  type RuntimeExecutiveActionProposalContract,
  type RuntimeExecutiveActionSafetyIssue,
} from "@/app/lib/rex/runtimeExecutiveActionConfirmationSafety";

// ─── Transitively published REX-5 chain surface (for REX-5:7+) ───────────────
// Additive publication: platform consumes the complete REX-5 chain through REX-5:6.

export {
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_MODES,
  RUNTIME_EXECUTIVE_ACTION_CONFIRMATION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  RUNTIME_EXECUTIVE_ACTION_SAFETY_STATUSES,
  canConfirmRuntimeExecutiveAction,
  createRuntimeExecutiveActionConfirmationFingerprint,
  createRuntimeExecutiveActionConfirmationScope,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionConfirmationReadiness,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  evaluateRuntimeExecutiveActionSafety,
  hasRuntimeExecutiveActionChangedSincePreview,
  resolveRuntimeExecutiveActionConfirmation,
  resolveRuntimeExecutiveActionIntentContext,
  resolveRuntimeExecutiveActionPreview,
  runtimeExecutiveActionConfirmationSafetyIdentity,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionPresentationPreviewIdentity,
  verifyRuntimeExecutiveActionConfirmationSafety,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  verifyRuntimeExecutiveActionPresentationPreview,
};

export type {
  RuntimeExecutiveActionAcknowledgment,
  RuntimeExecutiveActionConfirmation,
  RuntimeExecutiveActionConfirmationResult,
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionIntentContextRequest,
  RuntimeExecutiveActionIntentContextResult,
  RuntimeExecutiveActionPreparationResult,
  RuntimeExecutiveActionPreviewResult,
  RuntimeExecutiveActionProposalContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionOrchestrationIdentity =
  "REX-5:6/RuntimeExecutiveActionOrchestration" as const;

export const runtimeExecutiveActionOrchestrationVersion = "5.6.0" as const;

export const runtimeExecutiveActionOrchestrationNamespace =
  "nexora.rex.action-experience.orchestration" as const;

export const runtimeExecutiveActionOrchestrationLayer = "REX" as const;

export const runtimeExecutiveActionOrchestrationCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionOrchestrationPhase =
  "Orchestration" as const;

export const runtimeExecutiveActionOrchestrationStatus =
  "OrchestrationReady" as const;

export const runtimeExecutiveActionOrchestrationArchitecturalRole =
  "ExecutiveActionRuntimeOrchestrator" as const;

export const runtimeExecutiveActionOrchestrationDependencyIdentity =
  runtimeExecutiveActionConfirmationSafetyIdentity;

export const runtimeExecutiveActionOrchestrationDependencyPath =
  runtimeExecutiveActionConfirmationSafetySupportedImportPath;

export const runtimeExecutiveActionOrchestrationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionOrchestration" as const;

export const runtimeExecutiveActionOrchestrationStability =
  "OrchestrationReady" as const;

export const runtimeExecutiveActionOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveActionOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionOrchestrationIdentity,
    version: runtimeExecutiveActionOrchestrationVersion,
    namespace: runtimeExecutiveActionOrchestrationNamespace,
    layer: runtimeExecutiveActionOrchestrationLayer,
    capability: runtimeExecutiveActionOrchestrationCapability,
    phase: runtimeExecutiveActionOrchestrationPhase,
    status: runtimeExecutiveActionOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveActionOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionOrchestrationDependencyIdentity,
    dependencyPath: runtimeExecutiveActionOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionOrchestrationSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionConfirmationSafetyVersion,
    stabilityStatus: runtimeExecutiveActionOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveActionOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionOrchestrationSideEffectPolicy,
    mutationPolicy: runtimeExecutiveActionOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PRINCIPLE =
  "Orchestration ≠ External Execution. Confirmed ≠ Delivered. Dispatch Request ≠ Dispatch Completion. REX-5:6 coordinates runtime gates and produces provider-neutral downstream eligibility only." as const;

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  orchestrationAuthority: "REX-5:6" as const,
  architecturalRole: "ExecutiveActionRuntimeOrchestrator" as const,
  soleImmediateDependency:
    "REX-5:5/RuntimeExecutiveActionConfirmationSafety" as const,
  consumesConfirmationSafetyOnly: true as const,
  importsRex54Directly: false as const,
  importsRex53Directly: false as const,
  importsRex52Directly: false as const,
  importsRex51Directly: false as const,
  importsRex4Directly: false as const,
  importsRex3Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  transportIndependent: true as const,
  providerIndependent: true as const,
  providerNeutral: true as const,
  aiIndependent: true as const,
  introducesDispatch: false as const,
  introducesExternalExecution: false as const,
  introducesUiBehavior: false as const,
  introducesRendering: false as const,
  introducesRecipientResolution: false as const,
  introducesProviderRouting: false as const,
  introducesRetryEngine: false as const,
  introducesScheduling: false as const,
  autoConfirmationForbidden: true as const,
  noPhaseSkipping: true as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES = Object.freeze([
  "proposal",
  "contract",
  "intent-context",
  "preview",
  "confirmation",
  "prepared-for-dispatch",
  "terminal",
] as const);

export type RuntimeExecutiveActionOrchestrationPhase =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES = Object.freeze([
  "idle",
  "in-progress",
  "waiting",
  "blocked",
  "ready",
  "completed",
  "cancelled",
  "rejected",
] as const);

export type RuntimeExecutiveActionOrchestrationStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS = Object.freeze([
  "prepare",
  "evaluate-contract",
  "resolve-intent-context",
  "build-preview",
  "evaluate-confirmation",
  "confirm",
  "decline",
  "cancel",
  "advance",
] as const);

export type RuntimeExecutiveActionOrchestrationOperation =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_RESULT_STATUSES =
  Object.freeze([
    "advanced",
    "waiting",
    "blocked",
    "completed",
    "cancelled",
    "rejected",
  ] as const);

export type RuntimeExecutiveActionOrchestrationResultStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_RESULT_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASE_OUTCOMES =
  Object.freeze([
    "passed",
    "waiting",
    "blocked",
    "rejected",
    "terminal",
  ] as const);

export type RuntimeExecutiveActionOrchestrationPhaseOutcome =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASE_OUTCOMES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS =
  Object.freeze([
    "provide-missing-information",
    "resolve-intent",
    "resolve-context",
    "resolve-recipient",
    "review-preview",
    "acknowledge-warning",
    "confirm",
    "none",
  ] as const);

export type RuntimeExecutiveActionNextOperation =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES =
  Object.freeze([
    "contract",
    "intent-context",
    "preview",
    "confirmation-safety",
    "orchestration",
  ] as const);

export type RuntimeExecutiveActionOrchestrationIssueSource =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES = Object.freeze([
  "invalid-orchestration-transition",
  "phase-skipped",
  "phase-mismatch",
  "confirmation-required",
  "orchestration-already-terminal",
  "downstream-not-eligible",
  "missing-proposal",
  "missing-confirmation-input",
] as const);

export type RuntimeExecutiveActionOrchestrationIssueCode =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES)[number];

export const RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY = Object.freeze([
  "not-eligible",
  "eligible",
] as const);

export type RuntimeExecutiveActionDownstreamEligibility =
  (typeof RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY)[number];

export const RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES = Object.freeze([
  "prepared-for-dispatch",
  "declined",
  "cancelled",
  "rejected",
] as const);

export type RuntimeExecutiveActionTerminalOutcome =
  (typeof RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES = Object.freeze([
  "deterministic",
  "immutable",
  "confirmation-gated",
  "safety-preserving",
  "scope-stable",
  "phase-ordered",
  "no-phase-skipping",
  "issue-preserving",
  "explicit-input-driven",
  "auto-confirmation-forbidden",
  "provider-neutral",
  "renderer-independent",
  "transport-independent",
  "side-effect-free",
  "external-dispatch-free",
] as const);

export type RuntimeExecutiveActionOrchestrationGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Phases",
    "Statuses",
    "Operations",
    "PhaseOutcomes",
    "Transitions",
    "IssueSources",
    "IssueCodes",
    "NextOperations",
    "DownstreamEligibility",
    "TerminalOutcomes",
    "Policy",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionOrchestrationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_REGISTRY_SECTIONS)[number];

// ─── Transition graph / policy ──────────────────────────────────────────────

export interface RuntimeExecutiveActionOrchestrationTransitionRule {
  readonly from: RuntimeExecutiveActionOrchestrationPhase;
  readonly to: RuntimeExecutiveActionOrchestrationPhase;
  readonly via: ReadonlyArray<RuntimeExecutiveActionOrchestrationOperation>;
}

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES =
  Object.freeze([
    Object.freeze({
      from: "proposal",
      to: "contract",
      via: Object.freeze([
        "evaluate-contract",
        "advance",
      ] as const),
    }),
    Object.freeze({
      from: "contract",
      to: "intent-context",
      via: Object.freeze([
        "resolve-intent-context",
        "advance",
      ] as const),
    }),
    Object.freeze({
      from: "intent-context",
      to: "preview",
      via: Object.freeze(["build-preview", "advance"] as const),
    }),
    Object.freeze({
      from: "preview",
      to: "confirmation",
      via: Object.freeze([
        "evaluate-confirmation",
        "advance",
      ] as const),
    }),
    Object.freeze({
      from: "confirmation",
      to: "prepared-for-dispatch",
      via: Object.freeze(["confirm"] as const),
    }),
    Object.freeze({
      from: "confirmation",
      to: "terminal",
      via: Object.freeze(["decline", "cancel"] as const),
    }),
    Object.freeze({
      from: "proposal",
      to: "terminal",
      via: Object.freeze(["cancel"] as const),
    }),
    Object.freeze({
      from: "contract",
      to: "terminal",
      via: Object.freeze(["cancel"] as const),
    }),
    Object.freeze({
      from: "intent-context",
      to: "terminal",
      via: Object.freeze(["cancel"] as const),
    }),
    Object.freeze({
      from: "preview",
      to: "terminal",
      via: Object.freeze(["cancel"] as const),
    }),
  ] as const satisfies ReadonlyArray<RuntimeExecutiveActionOrchestrationTransitionRule>);

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY = Object.freeze({
  identity: "REX-5:6/CanonicalOrchestrationPolicy" as const,
  phaseOrder: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  transitions: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES,
  transitionCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.length,
  requiredGates: Object.freeze([
    "contract",
    "intent-context",
    "preview",
    "confirmation",
  ] as const),
  confirmationRequiredForDispatch: true as const,
  autoConfirmationForbidden: true as const,
  noPhaseSkipping: true as const,
  providerNeutralDispatchEnvelope: true as const,
});

export interface RuntimeExecutiveActionOrchestrationPolicyRule {
  readonly id: string;
  readonly description: string;
}

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY_RULES = Object.freeze([
  Object.freeze({
    id: "phase-ordered-advancement",
    description: "Phases advance only along the canonical ordered graph",
  }),
  Object.freeze({
    id: "no-phase-skipping",
    description: "Skipping gates is rejected",
  }),
  Object.freeze({
    id: "contract-gate",
    description: "Contract evaluation must pass before intent-context",
  }),
  Object.freeze({
    id: "intent-context-gate",
    description: "Ambiguous/unresolved/rejected intent cannot silently advance",
  }),
  Object.freeze({
    id: "preview-gate",
    description: "Preview readiness gates confirmation eligibility",
  }),
  Object.freeze({
    id: "confirmation-gate",
    description: "Only accepted confirmed actions become dispatch-eligible",
  }),
  Object.freeze({
    id: "auto-confirmation-forbidden",
    description: "Safe preview never auto-confirms",
  }),
  Object.freeze({
    id: "scope-stable-dispatch",
    description: "Dispatch envelope must match confirmation scope fingerprint",
  }),
  Object.freeze({
    id: "terminal-non-dispatch",
    description: "Declined/cancelled/rejected never produce eligibility",
  }),
  Object.freeze({
    id: "provider-neutral-envelope",
    description: "Dispatch request contains no provider-specific routing",
  }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionOrchestrationPolicyRule>);

// ─── Domain models ──────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionOrchestrationIssue {
  readonly code: string;
  readonly source: RuntimeExecutiveActionOrchestrationIssueSource;
  readonly severity: "info" | "caution" | "high" | "blocking";
  readonly blocking: boolean;
  readonly message: string;
  readonly field?: string;
}

export interface RuntimeExecutiveActionOrchestrationTransition {
  readonly from: RuntimeExecutiveActionOrchestrationPhase;
  readonly to: RuntimeExecutiveActionOrchestrationPhase;
  readonly operation: RuntimeExecutiveActionOrchestrationOperation;
  readonly status: RuntimeExecutiveActionOrchestrationResultStatus;
  readonly reason: string;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
}

export interface RuntimeExecutiveActionOrchestrationHistoryEntry {
  readonly sequence: number;
  readonly phase: RuntimeExecutiveActionOrchestrationPhase;
  readonly operation: RuntimeExecutiveActionOrchestrationOperation;
  readonly status: RuntimeExecutiveActionOrchestrationStatus;
  readonly reason: string;
}

export interface RuntimeExecutiveActionOrchestrationSnapshot {
  readonly actionId?: string;
  readonly title?: string;
  readonly phase: RuntimeExecutiveActionOrchestrationPhase;
  readonly status: RuntimeExecutiveActionOrchestrationStatus;
  readonly lifecycle?: string;
  readonly nextOperation: RuntimeExecutiveActionNextOperation;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
  readonly confirmationStatus?: string;
  readonly downstreamEligibility: RuntimeExecutiveActionDownstreamEligibility;
  readonly terminalOutcome?: RuntimeExecutiveActionTerminalOutcome;
  readonly phaseOutcome: RuntimeExecutiveActionOrchestrationPhaseOutcome;
}

export interface RuntimeExecutiveActionDispatchRequest {
  readonly identity: "REX-5:6/RuntimeExecutiveActionDispatchRequest";
  readonly version: typeof runtimeExecutiveActionOrchestrationVersion;
  readonly actionId?: string;
  readonly actionKind?: string;
  readonly subject?: Readonly<{
    readonly id?: string;
    readonly label?: string;
    readonly kind?: string;
  }>;
  readonly target?: Readonly<{
    readonly id?: string;
    readonly label?: string;
    readonly kind?: string;
  }>;
  readonly recipient?: Readonly<{
    readonly id?: string;
    readonly label?: string;
    readonly kind?: string;
  }>;
  readonly intent?: string;
  readonly priority?: string;
  readonly reason?: string;
  readonly consequence?: string;
  readonly lifecycle?: string;
  readonly title?: string;
  readonly confirmationScope: RuntimeExecutiveActionConfirmation["scope"];
  readonly confirmationFingerprint: string;
  readonly contextReferences: ReadonlyArray<string>;
  readonly origin?: Readonly<{
    readonly kind?: string;
    readonly referenceId?: string;
  }>;
  readonly orchestrationPhase: "prepared-for-dispatch";
  readonly downstreamEligibility: "eligible";
  readonly providerNeutral: true;
  readonly externalDispatch: false;
}

export interface RuntimeExecutiveActionOrchestration {
  readonly actionId?: string;
  readonly proposal?: RuntimeExecutiveActionProposalContract;
  readonly phase: RuntimeExecutiveActionOrchestrationPhase;
  readonly lifecycle?: string;
  readonly status: RuntimeExecutiveActionOrchestrationStatus;
  readonly phaseOutcome: RuntimeExecutiveActionOrchestrationPhaseOutcome;
  readonly nextOperation: RuntimeExecutiveActionNextOperation;
  readonly contractResult?: RuntimeExecutiveActionPreparationResult;
  readonly intentContextResult?: RuntimeExecutiveActionIntentContextResult;
  readonly previewResult?: RuntimeExecutiveActionPreviewResult;
  readonly confirmationResult?: RuntimeExecutiveActionConfirmationResult;
  readonly confirmation?: RuntimeExecutiveActionConfirmation;
  readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
  readonly history: ReadonlyArray<RuntimeExecutiveActionOrchestrationHistoryEntry>;
  readonly downstreamEligibility: RuntimeExecutiveActionDownstreamEligibility;
  readonly terminalOutcome?: RuntimeExecutiveActionTerminalOutcome;
  readonly dispatchRequest?: RuntimeExecutiveActionDispatchRequest;
  readonly lastTransition?: RuntimeExecutiveActionOrchestrationTransition;
  readonly sequence: number;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly identity: typeof runtimeExecutiveActionOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveActionOrchestrationVersion;
}

export interface RuntimeExecutiveActionOrchestrationRequest {
  readonly proposal?: RuntimeExecutiveActionIntentContextRequest;
  readonly state?: RuntimeExecutiveActionOrchestration;
  readonly operation: RuntimeExecutiveActionOrchestrationOperation;
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly presentationDensity?: "compact" | "standard" | "expanded";
  readonly confirmationDecision?: "evaluate" | "confirm" | "decline" | "cancel";
  readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
  readonly expectedFingerprint?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly sequence?: number;
}

export type RuntimeExecutiveActionOrchestrationResult =
  | {
      readonly status: "advanced";
      readonly orchestration: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "waiting";
      readonly orchestration: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "blocked";
      readonly orchestration: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "completed";
      readonly orchestration: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "cancelled";
      readonly orchestration: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "rejected";
      readonly orchestration?: RuntimeExecutiveActionOrchestration;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    };

// ─── Helpers ────────────────────────────────────────────────────────────────

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function issue(
  code: string,
  source: RuntimeExecutiveActionOrchestrationIssueSource,
  severity: RuntimeExecutiveActionOrchestrationIssue["severity"],
  blocking: boolean,
  message: string,
  field?: string,
): RuntimeExecutiveActionOrchestrationIssue {
  return Object.freeze(
    field === undefined
      ? { code, source, severity, blocking, message }
      : { code, source, severity, blocking, message, field },
  );
}

function mapContractIssues(
  preparation: RuntimeExecutiveActionPreparationResult,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue> {
  return freezeArray(
    preparation.issues.map((entry) =>
      issue(
        entry.code,
        "contract",
        entry.severity === "error" ? "blocking" : "caution",
        entry.severity === "error" || preparation.status === "incomplete",
        entry.message,
        entry.field,
      ),
    ),
  );
}

function mapIntentIssues(
  result: RuntimeExecutiveActionIntentContextResult,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue> {
  const mapped = result.issues.map((entry) =>
    issue(
      entry.code,
      "intent-context",
      result.status === "rejected" ||
        result.status === "ambiguous" ||
        result.status === "unresolved"
        ? "blocking"
        : "caution",
      result.status === "rejected" ||
        result.status === "ambiguous" ||
        result.status === "unresolved",
      entry.message,
      entry.field,
    ),
  );

  if (
    mapped.length === 0 &&
    (result.status === "ambiguous" || result.status === "unresolved")
  ) {
    mapped.push(
      issue(
        result.status === "ambiguous" ? "intent-ambiguous" : "intent-unresolved",
        "intent-context",
        "blocking",
        true,
        result.status === "ambiguous"
          ? "Intent remains ambiguous"
          : "Intent remains unresolved",
        "intent",
      ),
    );
  }

  return freezeArray(mapped);
}

function mapPreviewIssues(
  result: RuntimeExecutiveActionPreviewResult,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue> {
  const fromIssues = result.issues.map((entry) =>
    issue(
      entry.code,
      "preview",
      result.status === "rejected" || result.status === "blocked"
        ? "blocking"
        : "caution",
      result.status === "rejected" || result.status === "blocked",
      entry.message,
    ),
  );
  const fromWarnings = result.warnings.map((entry) =>
    issue(
      entry.code,
      "preview",
      entry.severity === "blocking"
        ? "blocking"
        : entry.severity === "warning"
          ? "high"
          : entry.severity === "caution"
            ? "caution"
            : "info",
      entry.severity === "blocking",
      entry.message,
      entry.field,
    ),
  );
  return freezeArray([...fromIssues, ...fromWarnings]);
}

function mapSafetyIssues(
  issues: ReadonlyArray<RuntimeExecutiveActionSafetyIssue>,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue> {
  return freezeArray(
    issues.map((entry) =>
      issue(
        entry.code,
        "confirmation-safety",
        entry.severity,
        entry.blocking,
        entry.message,
        entry.field,
      ),
    ),
  );
}

function appendHistory(
  history: ReadonlyArray<RuntimeExecutiveActionOrchestrationHistoryEntry>,
  entry: RuntimeExecutiveActionOrchestrationHistoryEntry,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationHistoryEntry> {
  return freezeArray([...history, Object.freeze(entry)]);
}

function idleOrchestration(
  metadata?: Readonly<Record<string, string>>,
): RuntimeExecutiveActionOrchestration {
  return Object.freeze({
    phase: "proposal",
    status: "idle",
    phaseOutcome: "waiting",
    nextOperation: "provide-missing-information",
    issues: Object.freeze([]),
    history: Object.freeze([]),
    downstreamEligibility: "not-eligible",
    sequence: 0,
    ...(metadata !== undefined
      ? { metadata: Object.freeze({ ...metadata }) }
      : {}),
    identity: runtimeExecutiveActionOrchestrationIdentity,
    version: runtimeExecutiveActionOrchestrationVersion,
  });
}

function buildSnapshot(
  orchestration: RuntimeExecutiveActionOrchestration,
): RuntimeExecutiveActionOrchestrationSnapshot {
  return Object.freeze({
    ...(orchestration.actionId !== undefined
      ? { actionId: orchestration.actionId }
      : {}),
    ...(orchestration.proposal?.title !== undefined
      ? { title: orchestration.proposal.title }
      : {}),
    phase: orchestration.phase,
    status: orchestration.status,
    ...(orchestration.lifecycle !== undefined
      ? { lifecycle: orchestration.lifecycle }
      : {}),
    nextOperation: orchestration.nextOperation,
    issues: orchestration.issues,
    ...(orchestration.confirmation?.status !== undefined
      ? { confirmationStatus: orchestration.confirmation.status }
      : {}),
    downstreamEligibility: orchestration.downstreamEligibility,
    ...(orchestration.terminalOutcome !== undefined
      ? { terminalOutcome: orchestration.terminalOutcome }
      : {}),
    phaseOutcome: orchestration.phaseOutcome,
  });
}

// ─── Transition helpers ─────────────────────────────────────────────────────

export function getAllowedRuntimeExecutiveActionOrchestrationTransitions(
  from: RuntimeExecutiveActionOrchestrationPhase,
): ReadonlyArray<RuntimeExecutiveActionOrchestrationTransitionRule> {
  return freezeArray(
    RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.filter(
      (rule) => rule.from === from,
    ),
  );
}

export function canTransitionRuntimeExecutiveActionOrchestration(input: {
  readonly from: RuntimeExecutiveActionOrchestrationPhase;
  readonly to: RuntimeExecutiveActionOrchestrationPhase;
  readonly operation: RuntimeExecutiveActionOrchestrationOperation;
}): boolean {
  return RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.some(
    (rule) =>
      rule.from === input.from &&
      rule.to === input.to &&
      (rule.via as readonly string[]).includes(input.operation),
  );
}

function rejectedResult(
  issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>,
  orchestration?: RuntimeExecutiveActionOrchestration,
): RuntimeExecutiveActionOrchestrationResult {
  return Object.freeze({
    status: "rejected",
    ...(orchestration !== undefined ? { orchestration } : {}),
    issues,
  });
}

function resultForStatus(
  orchestration: RuntimeExecutiveActionOrchestration,
): RuntimeExecutiveActionOrchestrationResult {
  if (orchestration.status === "cancelled") {
    return Object.freeze({
      status: "cancelled",
      orchestration,
      issues: orchestration.issues,
    });
  }
  if (
    orchestration.status === "completed" ||
    orchestration.phase === "prepared-for-dispatch"
  ) {
    return Object.freeze({
      status: "completed",
      orchestration,
      issues: orchestration.issues,
    });
  }
  if (orchestration.status === "rejected") {
    return Object.freeze({
      status: "rejected",
      orchestration,
      issues: orchestration.issues,
    });
  }
  if (orchestration.status === "blocked") {
    return Object.freeze({
      status: "blocked",
      orchestration,
      issues: orchestration.issues,
    });
  }
  if (orchestration.status === "waiting") {
    return Object.freeze({
      status: "waiting",
      orchestration,
      issues: orchestration.issues,
    });
  }
  return Object.freeze({
    status: "advanced",
    orchestration,
    issues: orchestration.issues,
  });
}

// ─── Gate application ───────────────────────────────────────────────────────

function applyContractGate(
  proposalInput: RuntimeExecutiveActionIntentContextRequest,
  base: RuntimeExecutiveActionOrchestration,
  operation: RuntimeExecutiveActionOrchestrationOperation,
  sequence: number,
): RuntimeExecutiveActionOrchestration {
  let draft: RuntimeExecutiveActionProposalContract;
  try {
    draft = createRuntimeExecutiveActionProposalContract({
      ...(proposalInput.kind !== undefined ? { kind: proposalInput.kind } : {}),
      ...(proposalInput.subject !== undefined
        ? { subject: proposalInput.subject }
        : {}),
      ...(proposalInput.target !== undefined
        ? { target: proposalInput.target }
        : {}),
      ...(proposalInput.recipient !== undefined
        ? { recipient: proposalInput.recipient }
        : {}),
      ...(proposalInput.intent !== undefined
        ? { intent: proposalInput.intent }
        : {}),
      ...(proposalInput.title !== undefined
        ? { title: proposalInput.title }
        : {}),
      ...(proposalInput.summary !== undefined
        ? { summary: proposalInput.summary }
        : {}),
      ...(proposalInput.reason !== undefined
        ? {
            reason:
              typeof proposalInput.reason === "string"
                ? proposalInput.reason
                : proposalInput.reason.text,
          }
        : {}),
      ...(proposalInput.context !== undefined
        ? { context: proposalInput.context }
        : {}),
      ...(proposalInput.proposal ?? {}),
    });
  } catch (error) {
    const issues = freezeArray([
      issue(
        "missing-proposal",
        "contract",
        "blocking",
        true,
        error instanceof Error
          ? error.message
          : "Proposal could not be normalized",
        "proposal",
      ),
    ]);
    return Object.freeze({
      ...base,
      phase: "contract",
      status: "rejected",
      phaseOutcome: "rejected",
      nextOperation: "provide-missing-information",
      issues,
      history: appendHistory(base.history, {
        sequence,
        phase: "contract",
        operation,
        status: "rejected",
        reason: "Contract rejected",
      }),
      downstreamEligibility: "not-eligible",
      terminalOutcome: "rejected",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "contract",
        operation,
        status: "rejected",
        reason: "Contract rejected",
        issues,
      }),
    });
  }

  const contractResult = evaluateRuntimeExecutiveActionPreparationContract({
    draft: Object.freeze({
      ...draft,
      lifecycle:
        draft.lifecycle === "pending-confirmation" ||
        draft.lifecycle === "confirmed" ||
        draft.lifecycle === "cancelled"
          ? "draft"
          : draft.lifecycle,
    }),
    ...(proposalInput.context !== undefined
      ? { context: proposalInput.context }
      : {}),
    requestedLifecycle: "prepared",
    requireResolvedRecipient: false,
  });

  const issues = mapContractIssues(contractResult);
  const history = appendHistory(base.history, {
    sequence,
    phase: "contract",
    operation,
    status:
      contractResult.status === "rejected"
        ? "rejected"
        : contractResult.status === "incomplete"
          ? "waiting"
          : "ready",
    reason: `Contract evaluation: ${contractResult.status}`,
  });

  if (contractResult.status === "rejected") {
    return Object.freeze({
      ...base,
      proposal: draft,
      phase: "contract",
      status: "rejected",
      phaseOutcome: "rejected",
      nextOperation: "provide-missing-information",
      contractResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      terminalOutcome: "rejected",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "contract",
        operation,
        status: "rejected",
        reason: "Contract rejected",
        issues,
      }),
    });
  }

  // Incomplete ≠ invalid. Progressive construction may continue to intent-context
  // so ambiguity/unresolved intent can be discovered at the correct gate.
  const acceptedProposal = Object.freeze({
    ...(contractResult.value ?? draft),
    lifecycle: "pending-confirmation" as const,
  });

  if (contractResult.status === "incomplete") {
    return Object.freeze({
      ...base,
      proposal: acceptedProposal,
      actionId: acceptedProposal.actionId ?? base.actionId,
      lifecycle: acceptedProposal.lifecycle,
      phase: "contract",
      status: "waiting",
      phaseOutcome: "waiting",
      nextOperation: "resolve-intent",
      contractResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "contract",
        operation,
        status: "waiting",
        reason: "Contract incomplete but structurally valid",
        issues,
      }),
    });
  }

  return Object.freeze({
    ...base,
    proposal: acceptedProposal,
    actionId: acceptedProposal.actionId ?? base.actionId,
    lifecycle: acceptedProposal.lifecycle,
    phase: "contract",
    status: "ready",
    phaseOutcome: "passed",
    nextOperation: "resolve-intent",
    contractResult,
    issues,
    history,
    downstreamEligibility: "not-eligible",
    sequence,
    lastTransition: Object.freeze({
      from: base.phase,
      to: "contract",
      operation,
      status: "advanced",
      reason: "Contract accepted",
      issues,
    }),
  });
}

function applyIntentContextGate(
  proposalInput: RuntimeExecutiveActionIntentContextRequest,
  base: RuntimeExecutiveActionOrchestration,
  operation: RuntimeExecutiveActionOrchestrationOperation,
  sequence: number,
): RuntimeExecutiveActionOrchestration {
  const intentContextResult =
    resolveRuntimeExecutiveActionIntentContext(proposalInput);
  const issues = mapIntentIssues(intentContextResult);
  const history = appendHistory(base.history, {
    sequence,
    phase: "intent-context",
    operation,
    status:
      intentContextResult.status === "rejected"
        ? "rejected"
        : intentContextResult.status === "ambiguous" ||
            intentContextResult.status === "unresolved"
          ? "blocked"
          : intentContextResult.status === "partially-resolved"
            ? "waiting"
            : "ready",
    reason: `Intent/context: ${intentContextResult.status}`,
  });

  if (intentContextResult.status === "rejected") {
    return Object.freeze({
      ...base,
      proposal: intentContextResult.proposal ?? base.proposal,
      phase: "intent-context",
      status: "rejected",
      phaseOutcome: "rejected",
      nextOperation: "provide-missing-information",
      intentContextResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      terminalOutcome: "rejected",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "intent-context",
        operation,
        status: "rejected",
        reason: "Intent/context rejected",
        issues,
      }),
    });
  }

  if (
    intentContextResult.status === "ambiguous" ||
    intentContextResult.status === "unresolved"
  ) {
    return Object.freeze({
      ...base,
      proposal: intentContextResult.proposal ?? base.proposal,
      phase: "intent-context",
      status: "blocked",
      phaseOutcome: "blocked",
      nextOperation: "resolve-intent",
      intentContextResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "intent-context",
        operation,
        status: "blocked",
        reason: "Intent/context blocked",
        issues,
      }),
    });
  }

  if (intentContextResult.status === "partially-resolved") {
    const hasUnresolvedRecipient =
      intentContextResult.proposal?.recipient?.kind === "unresolved";
    return Object.freeze({
      ...base,
      proposal: intentContextResult.proposal ?? base.proposal,
      phase: "intent-context",
      status: "waiting",
      phaseOutcome: "waiting",
      nextOperation: hasUnresolvedRecipient
        ? "resolve-recipient"
        : "resolve-context",
      intentContextResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "intent-context",
        operation,
        status: "waiting",
        reason: "Intent/context partially resolved",
        issues,
      }),
    });
  }

  return Object.freeze({
    ...base,
    proposal: intentContextResult.proposal ?? base.proposal,
    phase: "intent-context",
    status: "ready",
    phaseOutcome: "passed",
    nextOperation: "review-preview",
    intentContextResult,
    issues,
    history,
    downstreamEligibility: "not-eligible",
    sequence,
    lastTransition: Object.freeze({
      from: base.phase,
      to: "intent-context",
      operation,
      status: "advanced",
      reason: "Intent/context resolved",
      issues,
    }),
  });
}

function applyPreviewGate(
  base: RuntimeExecutiveActionOrchestration,
  operation: RuntimeExecutiveActionOrchestrationOperation,
  sequence: number,
  presentationState?: "minimum" | "report" | "operation",
  presentationDensity?: "compact" | "standard" | "expanded",
): RuntimeExecutiveActionOrchestration {
  if (base.intentContextResult === undefined) {
    const issues = freezeArray([
      issue(
        "phase-mismatch",
        "orchestration",
        "blocking",
        true,
        "Preview requires a resolved intent-context result",
        "intentContextResult",
      ),
    ]);
    return Object.freeze({
      ...base,
      status: "rejected",
      phaseOutcome: "rejected",
      issues,
      sequence,
    });
  }

  const previewResult = resolveRuntimeExecutiveActionPreview({
    intentContext: base.intentContextResult,
    ...(presentationState !== undefined
      ? { requestedPresentationState: presentationState }
      : {}),
    ...(presentationDensity !== undefined
      ? { requestedDensity: presentationDensity }
      : {}),
  });

  const issues = mapPreviewIssues(previewResult);
  const unresolvedRecipient =
    previewResult.presentation?.recipient?.unresolved === true;

  const history = appendHistory(base.history, {
    sequence,
    phase: "preview",
    operation,
    status:
      previewResult.status === "rejected"
        ? "rejected"
        : previewResult.status === "blocked"
          ? "blocked"
          : previewResult.status === "partial"
            ? "waiting"
            : "ready",
    reason: `Preview: ${previewResult.status}`,
  });

  if (previewResult.status === "rejected") {
    return Object.freeze({
      ...base,
      phase: "preview",
      status: "rejected",
      phaseOutcome: "rejected",
      nextOperation: "provide-missing-information",
      previewResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      terminalOutcome: "rejected",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "preview",
        operation,
        status: "rejected",
        reason: "Preview rejected",
        issues,
      }),
    });
  }

  if (previewResult.status === "blocked") {
    return Object.freeze({
      ...base,
      phase: "preview",
      status: "blocked",
      phaseOutcome: "blocked",
      nextOperation: unresolvedRecipient
        ? "resolve-recipient"
        : "review-preview",
      previewResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "preview",
        operation,
        status: "blocked",
        reason: "Preview blocked",
        issues,
      }),
    });
  }

  if (previewResult.status === "partial") {
    return Object.freeze({
      ...base,
      phase: "preview",
      status: "waiting",
      phaseOutcome: "waiting",
      nextOperation: unresolvedRecipient
        ? "resolve-recipient"
        : "review-preview",
      previewResult,
      issues,
      history,
      downstreamEligibility: "not-eligible",
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "preview",
        operation,
        status: "waiting",
        reason: "Preview partial",
        issues,
      }),
    });
  }

  return Object.freeze({
    ...base,
    phase: "preview",
    status: "ready",
    phaseOutcome: "passed",
    nextOperation: "confirm",
    previewResult,
    issues,
    history,
    downstreamEligibility: "not-eligible",
    sequence,
    lastTransition: Object.freeze({
      from: base.phase,
      to: "preview",
      operation,
      status: "advanced",
      reason: "Preview ready",
      issues,
    }),
  });
}

function applyConfirmationEvaluation(
  base: RuntimeExecutiveActionOrchestration,
  operation: RuntimeExecutiveActionOrchestrationOperation,
  sequence: number,
  acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>,
  expectedFingerprint?: string,
): RuntimeExecutiveActionOrchestration {
  if (base.previewResult === undefined) {
    const issues = freezeArray([
      issue(
        "phase-mismatch",
        "orchestration",
        "blocking",
        true,
        "Confirmation requires a preview result",
        "previewResult",
      ),
    ]);
    return Object.freeze({
      ...base,
      status: "rejected",
      phaseOutcome: "rejected",
      issues,
      sequence,
    });
  }

  const safety = evaluateRuntimeExecutiveActionSafety({
    previewResult: base.previewResult,
    acknowledgments,
    expectedFingerprint,
  });
  const readiness = evaluateRuntimeExecutiveActionConfirmationReadiness({
    previewResult: base.previewResult,
    safety,
    acknowledgments,
  });
  const confirmationResult = resolveRuntimeExecutiveActionConfirmation({
    previewResult: base.previewResult,
    decision: "evaluate",
    acknowledgments,
    expectedFingerprint,
  });

  const issues = mapSafetyIssues(safety.issues);
  const needsAck = readiness.reviewRequirements.some(
    (requirement) =>
      !acknowledgments?.some(
        (entry) =>
          entry.kind === requirement.requiredAcknowledgment &&
          entry.acknowledged === true,
      ),
  );

  let status: RuntimeExecutiveActionOrchestrationStatus = "waiting";
  let phaseOutcome: RuntimeExecutiveActionOrchestrationPhaseOutcome = "waiting";
  let nextOperation: RuntimeExecutiveActionNextOperation = "confirm";

  if (safety.status === "blocked" || readiness.state === "not-ready") {
    status = "blocked";
    phaseOutcome = "blocked";
    if (
      safety.issues.some(
        (entry) =>
          entry.code === "intent-ambiguous" ||
          entry.code === "intent-unresolved",
      )
    ) {
      nextOperation = "resolve-intent";
    } else if (
      safety.issues.some((entry) => entry.code === "recipient-unresolved")
    ) {
      nextOperation = "resolve-recipient";
    } else {
      nextOperation = "review-preview";
    }
  } else if (needsAck || readiness.state === "review-required") {
    status = "waiting";
    phaseOutcome = "waiting";
    nextOperation = "acknowledge-warning";
  } else {
    status = "waiting";
    phaseOutcome = "waiting";
    nextOperation = "confirm";
  }

  const history = appendHistory(base.history, {
    sequence,
    phase: "confirmation",
    operation,
    status,
    reason: `Confirmation evaluation: readiness=${readiness.state}`,
  });

  return Object.freeze({
    ...base,
    phase: "confirmation",
    status,
    phaseOutcome,
    nextOperation,
    confirmationResult,
    confirmation: confirmationResult.confirmation,
    issues,
    history,
    downstreamEligibility: "not-eligible",
    sequence,
    lastTransition: Object.freeze({
      from: base.phase,
      to: "confirmation",
      operation,
      status: status === "blocked" ? "blocked" : "waiting",
      reason: "Awaiting explicit confirmation",
      issues,
    }),
  });
}

// ─── Dispatch request ───────────────────────────────────────────────────────

export function createRuntimeExecutiveActionDispatchRequest(input: {
  readonly orchestration: RuntimeExecutiveActionOrchestration;
  readonly expectedFingerprint?: string;
}):
  | {
      readonly status: "accepted";
      readonly dispatchRequest: RuntimeExecutiveActionDispatchRequest;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    }
  | {
      readonly status: "rejected";
      readonly dispatchRequest?: undefined;
      readonly issues: ReadonlyArray<RuntimeExecutiveActionOrchestrationIssue>;
    } {
  const orchestration = input.orchestration;
  const confirmation = orchestration.confirmation;
  const confirmationResult = orchestration.confirmationResult;
  const preview = orchestration.previewResult?.presentation;

  if (
    orchestration.phase !== "prepared-for-dispatch" ||
    orchestration.downstreamEligibility !== "eligible" ||
    confirmationResult?.status !== "accepted" ||
    confirmation?.status !== "confirmed"
  ) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "downstream-not-eligible",
          "orchestration",
          "blocking",
          true,
          "Dispatch request requires prepared-for-dispatch after accepted confirmation",
        ),
      ]),
    });
  }

  if (preview === undefined) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "confirmation-required",
          "orchestration",
          "blocking",
          true,
          "Dispatch request requires a confirmed preview presentation",
        ),
      ]),
    });
  }

  const scope = createRuntimeExecutiveActionConfirmationScope(preview);
  const fingerprint = createRuntimeExecutiveActionConfirmationFingerprint(scope);

  if (
    fingerprint.value !== confirmation.fingerprint.value ||
    hasRuntimeExecutiveActionChangedSincePreview({
      expectedFingerprint:
        input.expectedFingerprint ?? confirmation.fingerprint.value,
      currentFingerprint: fingerprint,
    })
  ) {
    return Object.freeze({
      status: "rejected",
      issues: freezeArray([
        issue(
          "confirmation-scope-changed",
          "confirmation-safety",
          "blocking",
          true,
          "Confirmation scope changed; new confirmation cycle required",
          "fingerprint",
        ),
      ]),
    });
  }

  const contextReferences = freezeArray(
    [
      ...(preview.context.primary.map((entry) => entry.id) ?? []),
      ...(preview.context.supporting.map((entry) => entry.id) ?? []),
    ].filter((value, index, all) => all.indexOf(value) === index),
  );

  const dispatchRequest: RuntimeExecutiveActionDispatchRequest = Object.freeze({
    identity: "REX-5:6/RuntimeExecutiveActionDispatchRequest" as const,
    version: runtimeExecutiveActionOrchestrationVersion,
    ...(confirmation.actionId !== undefined
      ? { actionId: confirmation.actionId }
      : {}),
    ...(scope.actionKind !== undefined ? { actionKind: scope.actionKind } : {}),
    ...(preview.subject !== undefined
      ? {
          subject: Object.freeze({
            id: preview.subject.id,
            label: preview.subject.label,
            kind: preview.subject.kind,
          }),
        }
      : {}),
    ...(preview.target !== undefined
      ? {
          target: Object.freeze({
            id: preview.target.id,
            label: preview.target.label,
            kind: preview.target.kind,
          }),
        }
      : {}),
    ...(preview.recipient !== undefined
      ? {
          recipient: Object.freeze({
            ...(preview.recipient.id !== undefined
              ? { id: preview.recipient.id }
              : {}),
            label: preview.recipient.label,
            kind: preview.recipient.kind,
          }),
        }
      : {}),
    ...(scope.intent !== undefined ? { intent: scope.intent } : {}),
    ...(scope.priority !== undefined ? { priority: scope.priority } : {}),
    ...(scope.reason !== undefined ? { reason: scope.reason } : {}),
    ...(scope.consequence !== undefined
      ? { consequence: scope.consequence }
      : {}),
    ...(scope.lifecycle !== undefined ? { lifecycle: scope.lifecycle } : {}),
    ...(scope.title !== undefined ? { title: scope.title } : {}),
    confirmationScope: confirmation.scope,
    confirmationFingerprint: confirmation.fingerprint.value,
    contextReferences,
    ...(preview.origin !== undefined
      ? {
          origin: Object.freeze({
            kind: preview.origin.kind,
            ...(preview.origin.referenceId !== undefined
              ? { referenceId: preview.origin.referenceId }
              : {}),
          }),
        }
      : {}),
    orchestrationPhase: "prepared-for-dispatch",
    downstreamEligibility: "eligible",
    providerNeutral: true,
    externalDispatch: false,
  });

  return Object.freeze({
    status: "accepted",
    dispatchRequest,
    issues: Object.freeze([]),
  });
}

// ─── Advancement / orchestration APIs ───────────────────────────────────────

export function createRuntimeExecutiveActionOrchestrationSnapshot(
  orchestration: RuntimeExecutiveActionOrchestration,
): RuntimeExecutiveActionOrchestrationSnapshot {
  return buildSnapshot(orchestration);
}

export function advanceRuntimeExecutiveActionOrchestration(
  request: RuntimeExecutiveActionOrchestrationRequest,
): RuntimeExecutiveActionOrchestrationResult {
  return orchestrateRuntimeExecutiveAction(request);
}

/**
 * Single-step deterministic orchestration.
 * Never auto-confirms. Never performs external dispatch.
 */
export function orchestrateRuntimeExecutiveAction(
  request: RuntimeExecutiveActionOrchestrationRequest,
): RuntimeExecutiveActionOrchestrationResult {
  if (
    request === undefined ||
    !(
      RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS as readonly string[]
    ).includes(request.operation)
  ) {
    return rejectedResult(
      freezeArray([
        issue(
          "invalid-orchestration-transition",
          "orchestration",
          "blocking",
          true,
          "Orchestration operation is not canonical",
          "operation",
        ),
      ]),
    );
  }

  const base = request.state ?? idleOrchestration(request.metadata);
  const sequence =
    request.sequence ??
    (base.history.length > 0
      ? base.history[base.history.length - 1]!.sequence + 1
      : base.sequence + 1);

  if (
    base.phase === "terminal" ||
    base.phase === "prepared-for-dispatch" ||
    base.status === "cancelled" ||
    (base.terminalOutcome !== undefined &&
      request.operation !== "prepare")
  ) {
    if (
      base.phase === "prepared-for-dispatch" &&
      request.operation === "advance"
    ) {
      return resultForStatus(base);
    }
    if (
      base.phase === "terminal" ||
      base.status === "cancelled" ||
      base.terminalOutcome === "declined" ||
      base.terminalOutcome === "cancelled" ||
      base.terminalOutcome === "rejected"
    ) {
      return rejectedResult(
        freezeArray([
          issue(
            "orchestration-already-terminal",
            "orchestration",
            "blocking",
            true,
            "Orchestration is already terminal",
            "phase",
          ),
        ]),
        base,
      );
    }
  }

  // prepare
  if (request.operation === "prepare") {
    if (request.proposal === undefined) {
      return rejectedResult(
        freezeArray([
          issue(
            "missing-proposal",
            "orchestration",
            "blocking",
            true,
            "Prepare requires an action proposal",
            "proposal",
          ),
        ]),
      );
    }
    let proposal: RuntimeExecutiveActionProposalContract;
    try {
      proposal = createRuntimeExecutiveActionProposalContract({
        ...(request.proposal.kind !== undefined
          ? { kind: request.proposal.kind }
          : {}),
        ...(request.proposal.subject !== undefined
          ? { subject: request.proposal.subject }
          : {}),
        ...(request.proposal.target !== undefined
          ? { target: request.proposal.target }
          : {}),
        ...(request.proposal.recipient !== undefined
          ? { recipient: request.proposal.recipient }
          : {}),
        ...(request.proposal.intent !== undefined
          ? { intent: request.proposal.intent }
          : {}),
        ...(request.proposal.title !== undefined
          ? { title: request.proposal.title }
          : {}),
        ...(request.proposal.summary !== undefined
          ? { summary: request.proposal.summary }
          : {}),
        ...(request.proposal.reason !== undefined
          ? {
              reason:
                typeof request.proposal.reason === "string"
                  ? request.proposal.reason
                  : request.proposal.reason.text,
            }
          : {}),
        ...(request.proposal.context !== undefined
          ? { context: request.proposal.context }
          : {}),
        ...(request.proposal.proposal ?? {}),
      });
    } catch (error) {
      return rejectedResult(
        freezeArray([
          issue(
            "missing-proposal",
            "orchestration",
            "blocking",
            true,
            error instanceof Error
              ? error.message
              : "Proposal could not be prepared",
            "proposal",
          ),
        ]),
      );
    }
    const history = appendHistory(Object.freeze([]), {
      sequence,
      phase: "proposal",
      operation: "prepare",
      status: "ready",
      reason: "Proposal prepared for orchestration",
    });
    const orchestration = Object.freeze({
      ...idleOrchestration(request.metadata),
      actionId: proposal.actionId,
      proposal,
      phase: "proposal" as const,
      lifecycle: proposal.lifecycle,
      status: "ready" as const,
      phaseOutcome: "passed" as const,
      nextOperation: "provide-missing-information" as const,
      history,
      sequence,
      lastTransition: Object.freeze({
        from: "proposal" as const,
        to: "proposal" as const,
        operation: "prepare" as const,
        status: "advanced" as const,
        reason: "Prepared proposal",
        issues: Object.freeze([]),
      }),
    });
    return resultForStatus(orchestration);
  }

  // cancel from non-confirmation phases
  if (request.operation === "cancel" && base.phase !== "confirmation") {
    if (
      !canTransitionRuntimeExecutiveActionOrchestration({
        from: base.phase,
        to: "terminal",
        operation: "cancel",
      })
    ) {
      return rejectedResult(
        freezeArray([
          issue(
            "invalid-orchestration-transition",
            "orchestration",
            "blocking",
            true,
            `Cannot cancel from phase ${base.phase}`,
            "phase",
          ),
        ]),
        base,
      );
    }
    const history = appendHistory(base.history, {
      sequence,
      phase: "terminal",
      operation: "cancel",
      status: "cancelled",
      reason: "Orchestration cancelled",
    });
    const orchestration = Object.freeze({
      ...base,
      phase: "terminal" as const,
      status: "cancelled" as const,
      phaseOutcome: "terminal" as const,
      nextOperation: "none" as const,
      history,
      downstreamEligibility: "not-eligible" as const,
      terminalOutcome: "cancelled" as const,
      sequence,
      lastTransition: Object.freeze({
        from: base.phase,
        to: "terminal" as const,
        operation: "cancel" as const,
        status: "cancelled" as const,
        reason: "Cancelled",
        issues: Object.freeze([]),
      }),
    });
    return resultForStatus(orchestration);
  }

  // Prefer the evolving orchestration proposal once gates have enriched it
  // (e.g. lifecycle promotion). Caller proposal seeds prepare only.
  const proposalInput: RuntimeExecutiveActionIntentContextRequest | undefined =
    base.proposal !== undefined
      ? {
          ...(request.proposal ?? {}),
          proposal: base.proposal,
          kind: base.proposal.kind ?? request.proposal?.kind,
          intent: base.proposal.intent ?? request.proposal?.intent,
          subject: base.proposal.subject ?? request.proposal?.subject,
          target: base.proposal.target ?? request.proposal?.target,
          recipient: base.proposal.recipient ?? request.proposal?.recipient,
          title: base.proposal.title ?? request.proposal?.title,
          summary: base.proposal.summary ?? request.proposal?.summary,
          reason: base.proposal.reason ?? request.proposal?.reason,
          context: base.proposal.context ?? request.proposal?.context,
          ...(request.proposal?.origin !== undefined
            ? { origin: request.proposal.origin }
            : {}),
          ...(request.proposal?.selectedSubject !== undefined
            ? { selectedSubject: request.proposal.selectedSubject }
            : {}),
          ...(request.proposal?.focusedSubject !== undefined
            ? { focusedSubject: request.proposal.focusedSubject }
            : {}),
          ...(request.proposal?.supportingReferences !== undefined
            ? { supportingReferences: request.proposal.supportingReferences }
            : {}),
          ...(request.proposal?.primarySubjects !== undefined
            ? { primarySubjects: request.proposal.primarySubjects }
            : {}),
        }
      : request.proposal;

  // evaluate-contract
  if (
    request.operation === "evaluate-contract" ||
    (request.operation === "advance" && base.phase === "proposal")
  ) {
    if (proposalInput === undefined) {
      return rejectedResult(
        freezeArray([
          issue(
            "missing-proposal",
            "orchestration",
            "blocking",
            true,
            "Contract evaluation requires a proposal",
          ),
        ]),
        base,
      );
    }
    if (
      !canTransitionRuntimeExecutiveActionOrchestration({
        from: "proposal",
        to: "contract",
        operation:
          request.operation === "advance" ? "advance" : "evaluate-contract",
      }) &&
      base.phase !== "proposal"
    ) {
      return rejectedResult(
        freezeArray([
          issue(
            "phase-skipped",
            "orchestration",
            "blocking",
            true,
            "Cannot evaluate contract from the current phase",
            "phase",
          ),
        ]),
        base,
      );
    }
    if (base.phase !== "proposal") {
      return rejectedResult(
        freezeArray([
          issue(
            "phase-mismatch",
            "orchestration",
            "blocking",
            true,
            "evaluate-contract requires proposal phase",
            "phase",
          ),
        ]),
        base,
      );
    }
    return resultForStatus(
      applyContractGate(
        proposalInput,
        base,
        request.operation === "advance" ? "advance" : "evaluate-contract",
        sequence,
      ),
    );
  }

  // resolve-intent-context
  if (
    request.operation === "resolve-intent-context" ||
    (request.operation === "advance" &&
      base.phase === "contract" &&
      (base.phaseOutcome === "passed" ||
        (base.phaseOutcome === "waiting" &&
          base.contractResult?.valid === true)))
  ) {
    const contractAdvanceable =
      base.phase === "contract" &&
      (base.phaseOutcome === "passed" ||
        (base.phaseOutcome === "waiting" &&
          base.contractResult?.valid === true));
    if (!contractAdvanceable) {
      return rejectedResult(
        freezeArray([
          issue(
            base.phase === "proposal" ? "phase-skipped" : "phase-mismatch",
            "orchestration",
            "blocking",
            true,
            "Intent/context requires a valid contract gate",
            "phase",
          ),
        ]),
        base,
      );
    }
    if (proposalInput === undefined) {
      return rejectedResult(
        freezeArray([
          issue(
            "missing-proposal",
            "orchestration",
            "blocking",
            true,
            "Intent/context requires a proposal",
          ),
        ]),
        base,
      );
    }
    return resultForStatus(
      applyIntentContextGate(
        proposalInput,
        base,
        request.operation === "advance" ? "advance" : "resolve-intent-context",
        sequence,
      ),
    );
  }

  // build-preview
  if (
    request.operation === "build-preview" ||
    (request.operation === "advance" &&
      base.phase === "intent-context" &&
      base.phaseOutcome === "passed")
  ) {
    if (base.phase !== "intent-context" || base.phaseOutcome !== "passed") {
      return rejectedResult(
        freezeArray([
          issue(
            "phase-skipped",
            "orchestration",
            "blocking",
            true,
            "Preview requires a passed intent-context gate",
            "phase",
          ),
        ]),
        base,
      );
    }
    return resultForStatus(
      applyPreviewGate(
        base,
        request.operation === "advance" ? "advance" : "build-preview",
        sequence,
        request.presentationState,
        request.presentationDensity,
      ),
    );
  }

  // evaluate-confirmation / advance from preview
  if (
    request.operation === "evaluate-confirmation" ||
    (request.operation === "advance" &&
      base.phase === "preview" &&
      base.phaseOutcome === "passed")
  ) {
    if (base.phase !== "preview" || base.phaseOutcome !== "passed") {
      // Allow re-evaluate while already in confirmation.
      if (
        request.operation === "evaluate-confirmation" &&
        base.phase === "confirmation"
      ) {
        return resultForStatus(
          applyConfirmationEvaluation(
            base,
            "evaluate-confirmation",
            sequence,
            request.acknowledgments,
            request.expectedFingerprint,
          ),
        );
      }
      return rejectedResult(
        freezeArray([
          issue(
            "phase-skipped",
            "orchestration",
            "blocking",
            true,
            "Confirmation evaluation requires a ready preview",
            "phase",
          ),
        ]),
        base,
      );
    }
    return resultForStatus(
      applyConfirmationEvaluation(
        base,
        request.operation === "advance" ? "advance" : "evaluate-confirmation",
        sequence,
        request.acknowledgments,
        request.expectedFingerprint,
      ),
    );
  }

  // Forbidden: advance from confirmation without explicit confirm
  if (request.operation === "advance" && base.phase === "confirmation") {
    return rejectedResult(
      freezeArray([
        issue(
          "confirmation-required",
          "orchestration",
          "blocking",
          true,
          "Explicit confirmation is required; auto-confirmation is forbidden",
          "operation",
        ),
      ]),
      base,
    );
  }

  // Forbidden: skip to prepared-for-dispatch
  if (
    request.operation === "advance" &&
    base.phase !== "confirmation" &&
    base.phase !== "prepared-for-dispatch"
  ) {
    // handled above per-phase; remaining advances are invalid
    return rejectedResult(
      freezeArray([
        issue(
          "phase-skipped",
          "orchestration",
          "blocking",
          true,
          "Cannot advance from the current phase outcome",
          "phase",
        ),
      ]),
      base,
    );
  }

  // confirm / decline / cancel at confirmation
  if (
    request.operation === "confirm" ||
    request.operation === "decline" ||
    request.operation === "cancel"
  ) {
    if (base.phase !== "confirmation") {
      return rejectedResult(
        freezeArray([
          issue(
            "phase-mismatch",
            "orchestration",
            "blocking",
            true,
            `${request.operation} requires confirmation phase`,
            "phase",
          ),
        ]),
        base,
      );
    }
    if (base.previewResult === undefined) {
      return rejectedResult(
        freezeArray([
          issue(
            "confirmation-required",
            "orchestration",
            "blocking",
            true,
            "Confirmation requires a preview result",
          ),
        ]),
        base,
      );
    }

    const decision =
      request.confirmationDecision ??
      (request.operation === "confirm"
        ? "confirm"
        : request.operation === "decline"
          ? "decline"
          : "cancel");

    const confirmationResult = resolveRuntimeExecutiveActionConfirmation({
      previewResult: base.previewResult,
      decision,
      acknowledgments: request.acknowledgments,
      expectedFingerprint: request.expectedFingerprint,
      metadata: request.metadata,
    });

    if (confirmationResult.status === "declined") {
      const issues = mapSafetyIssues(confirmationResult.issues);
      const history = appendHistory(base.history, {
        sequence,
        phase: "terminal",
        operation: "decline",
        status: "completed",
        reason: "Executive declined confirmation",
      });
      const orchestration = Object.freeze({
        ...base,
        phase: "terminal" as const,
        status: "completed" as const,
        phaseOutcome: "terminal" as const,
        nextOperation: "none" as const,
        confirmationResult,
        confirmation: confirmationResult.confirmation,
        issues,
        history,
        downstreamEligibility: "not-eligible" as const,
        terminalOutcome: "declined" as const,
        sequence,
        lastTransition: Object.freeze({
          from: "confirmation" as const,
          to: "terminal" as const,
          operation: "decline" as const,
          status: "completed" as const,
          reason: "Declined",
          issues,
        }),
      });
      return resultForStatus(orchestration);
    }

    if (confirmationResult.status === "cancelled") {
      const issues = mapSafetyIssues(confirmationResult.issues);
      const history = appendHistory(base.history, {
        sequence,
        phase: "terminal",
        operation: "cancel",
        status: "cancelled",
        reason: "Confirmation cancelled",
      });
      const orchestration = Object.freeze({
        ...base,
        phase: "terminal" as const,
        status: "cancelled" as const,
        phaseOutcome: "terminal" as const,
        nextOperation: "none" as const,
        confirmationResult,
        confirmation: confirmationResult.confirmation,
        issues,
        history,
        downstreamEligibility: "not-eligible" as const,
        terminalOutcome: "cancelled" as const,
        sequence,
        lastTransition: Object.freeze({
          from: "confirmation" as const,
          to: "terminal" as const,
          operation: "cancel" as const,
          status: "cancelled" as const,
          reason: "Cancelled",
          issues,
        }),
      });
      return resultForStatus(orchestration);
    }

    if (
      confirmationResult.status !== "accepted" ||
      confirmationResult.confirmation?.status !== "confirmed"
    ) {
      const issues = mapSafetyIssues(confirmationResult.issues);
      const history = appendHistory(base.history, {
        sequence,
        phase: "confirmation",
        operation: "confirm",
        status: "blocked",
        reason: "Confirmation blocked",
      });
      const orchestration = Object.freeze({
        ...base,
        phase: "confirmation" as const,
        status: "blocked" as const,
        phaseOutcome: "blocked" as const,
        nextOperation: issues.some(
          (entry) =>
            entry.code === "high-risk-explicit-acknowledgment-required" ||
            entry.code === "review-acknowledgment-required",
        )
          ? ("acknowledge-warning" as const)
          : ("confirm" as const),
        confirmationResult,
        confirmation: confirmationResult.confirmation,
        issues,
        history,
        downstreamEligibility: "not-eligible" as const,
        sequence,
        lastTransition: Object.freeze({
          from: "confirmation" as const,
          to: "confirmation" as const,
          operation: "confirm" as const,
          status: "blocked" as const,
          reason: "Confirmation not accepted",
          issues,
        }),
      });
      return resultForStatus(orchestration);
    }

    // Accepted confirmation → prepared-for-dispatch
    const preparedBase = Object.freeze({
      ...base,
      phase: "prepared-for-dispatch" as const,
      status: "completed" as const,
      phaseOutcome: "passed" as const,
      nextOperation: "none" as const,
      confirmationResult,
      confirmation: confirmationResult.confirmation,
      issues: Object.freeze([]),
      history: appendHistory(base.history, {
        sequence,
        phase: "prepared-for-dispatch",
        operation: "confirm",
        status: "completed",
        reason: "Confirmation accepted; prepared for dispatch",
      }),
      downstreamEligibility: "eligible" as const,
      terminalOutcome: "prepared-for-dispatch" as const,
      sequence,
      lastTransition: Object.freeze({
        from: "confirmation" as const,
        to: "prepared-for-dispatch" as const,
        operation: "confirm" as const,
        status: "completed" as const,
        reason: "Confirmed",
        issues: Object.freeze([]),
      }),
    });

    const dispatch = createRuntimeExecutiveActionDispatchRequest({
      orchestration: preparedBase,
      expectedFingerprint: request.expectedFingerprint,
    });

    const orchestration = Object.freeze({
      ...preparedBase,
      ...(dispatch.status === "accepted"
        ? { dispatchRequest: dispatch.dispatchRequest }
        : {
            status: "blocked" as const,
            phaseOutcome: "blocked" as const,
            downstreamEligibility: "not-eligible" as const,
            issues: dispatch.issues,
            terminalOutcome: undefined,
            phase: "confirmation" as const,
          }),
    });

    return resultForStatus(orchestration);
  }

  return rejectedResult(
    freezeArray([
      issue(
        "invalid-orchestration-transition",
        "orchestration",
        "blocking",
        true,
        "Requested orchestration operation could not be applied",
        "operation",
      ),
    ]),
    base,
  );
}

/**
 * Evaluates how far an action can safely progress from supplied inputs.
 * Never auto-confirms. Stops at confirmation waiting for explicit confirm.
 */
export function evaluateRuntimeExecutiveActionOrchestration(
  request: Omit<RuntimeExecutiveActionOrchestrationRequest, "operation"> & {
    readonly acknowledgments?: ReadonlyArray<RuntimeExecutiveActionAcknowledgment>;
  },
): RuntimeExecutiveActionOrchestrationResult {
  if (request.proposal === undefined) {
    return rejectedResult(
      freezeArray([
        issue(
          "missing-proposal",
          "orchestration",
          "blocking",
          true,
          "Evaluation requires a proposal",
        ),
      ]),
    );
  }

  let current = orchestrateRuntimeExecutiveAction({
    ...request,
    operation: "prepare",
  });
  if (current.status === "rejected" || current.orchestration === undefined) {
    return current;
  }

  const steps: RuntimeExecutiveActionOrchestrationOperation[] = [
    "evaluate-contract",
    "resolve-intent-context",
    "build-preview",
    "evaluate-confirmation",
  ];

  for (const operation of steps) {
    const state = current.orchestration;
    if (
      state.status === "blocked" ||
      state.status === "rejected" ||
      state.status === "cancelled" ||
      state.status === "completed"
    ) {
      return current;
    }

    const contractAdvanceable =
      state.phase === "contract" &&
      state.contractResult?.valid === true &&
      (state.phaseOutcome === "passed" || state.phaseOutcome === "waiting") &&
      operation === "resolve-intent-context";

    // Stop on waiting gates except progressive contract → intent-context.
    // Never auto-confirm.
    if (
      state.phaseOutcome !== "passed" &&
      !(state.phase === "proposal" && operation === "evaluate-contract") &&
      !contractAdvanceable
    ) {
      return current;
    }

    current = orchestrateRuntimeExecutiveAction({
      ...request,
      state,
      operation,
    });
    if (current.orchestration === undefined) {
      return current;
    }
  }

  return current;
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionOrchestrationIdentity():
  typeof runtimeExecutiveActionOrchestrationCanonicalIdentity {
  return runtimeExecutiveActionOrchestrationCanonicalIdentity;
}

export function getRuntimeExecutiveActionOrchestrationGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES;
}

export function getRuntimeExecutiveActionOrchestrationRegistry():
  typeof runtimeExecutiveActionOrchestrationRegistry {
  return runtimeExecutiveActionOrchestrationRegistry;
}

export function getRuntimeExecutiveActionOrchestrationPolicy():
  typeof RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY {
  return RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionOrchestrationApiNames = Object.freeze([
  "getRuntimeExecutiveActionOrchestrationIdentity",
  "getRuntimeExecutiveActionOrchestrationRegistry",
  "getRuntimeExecutiveActionOrchestrationGuarantees",
  "getRuntimeExecutiveActionOrchestrationPolicy",
  "getAllowedRuntimeExecutiveActionOrchestrationTransitions",
  "canTransitionRuntimeExecutiveActionOrchestration",
  "createRuntimeExecutiveActionOrchestrationSnapshot",
  "createRuntimeExecutiveActionDispatchRequest",
  "advanceRuntimeExecutiveActionOrchestration",
  "orchestrateRuntimeExecutiveAction",
  "evaluateRuntimeExecutiveActionOrchestration",
  "verifyRuntimeExecutiveActionOrchestration",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionOrchestrationPhase",
    "RuntimeExecutiveActionOrchestrationStatus",
    "RuntimeExecutiveActionOrchestrationOperation",
    "RuntimeExecutiveActionOrchestrationResultStatus",
    "RuntimeExecutiveActionOrchestrationPhaseOutcome",
    "RuntimeExecutiveActionNextOperation",
    "RuntimeExecutiveActionOrchestrationIssueSource",
    "RuntimeExecutiveActionOrchestrationIssueCode",
    "RuntimeExecutiveActionDownstreamEligibility",
    "RuntimeExecutiveActionTerminalOutcome",
    "RuntimeExecutiveActionOrchestrationGuarantee",
    "RuntimeExecutiveActionOrchestrationRegistrySection",
    "RuntimeExecutiveActionOrchestrationTransitionRule",
    "RuntimeExecutiveActionOrchestrationPolicyRule",
    "RuntimeExecutiveActionOrchestrationIssue",
    "RuntimeExecutiveActionOrchestrationTransition",
    "RuntimeExecutiveActionOrchestrationHistoryEntry",
    "RuntimeExecutiveActionOrchestrationSnapshot",
    "RuntimeExecutiveActionDispatchRequest",
    "RuntimeExecutiveActionOrchestration",
    "RuntimeExecutiveActionOrchestrationRequest",
    "RuntimeExecutiveActionOrchestrationResult",
    "RuntimeExecutiveActionOrchestrationVerification",
  ] as const);

export const runtimeExecutiveActionOrchestrationRegistry = Object.freeze({
  identity: runtimeExecutiveActionOrchestrationIdentity,
  version: runtimeExecutiveActionOrchestrationVersion,
  namespace: runtimeExecutiveActionOrchestrationNamespace,
  layer: runtimeExecutiveActionOrchestrationLayer,
  capability: runtimeExecutiveActionOrchestrationCapability,
  phase: runtimeExecutiveActionOrchestrationPhase,
  status: runtimeExecutiveActionOrchestrationStatus,
  architecturalRole: runtimeExecutiveActionOrchestrationArchitecturalRole,
  dependencyIdentity: runtimeExecutiveActionOrchestrationDependencyIdentity,
  dependencyPath: runtimeExecutiveActionOrchestrationDependencyPath,
  supportedImportPath: runtimeExecutiveActionOrchestrationSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_REGISTRY_SECTIONS.length,
  phases: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  phaseCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES.length,
  statuses: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES,
  statusCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES.length,
  operations: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS,
  operationCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS.length,
  phaseOutcomes: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASE_OUTCOMES,
  phaseOutcomeCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASE_OUTCOMES.length,
  transitions: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES,
  transitionCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.length,
  issueSources: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES,
  issueSourceCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES.length,
  issueCodes: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES,
  issueCodeCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES.length,
  nextOperations: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS,
  nextOperationCount:
    RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS.length,
  downstreamEligibility: RUNTIME_EXECUTIVE_ACTION_DOWNSTREAM_ELIGIBILITY,
  terminalOutcomes: RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES,
  terminalOutcomeCount: RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES.length,
  policy: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY,
  policyRules: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY_RULES,
  policyRuleCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY_RULES.length,
  guarantees: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveActionOrchestrationApiNames,
  publicApiCount: runtimeExecutiveActionOrchestrationApiNames.length,
});

export const runtimeExecutiveActionOrchestration = Object.freeze({
  phase: "Orchestration" as const,
  name: "RuntimeExecutiveActionOrchestration" as const,
  identity: runtimeExecutiveActionOrchestrationIdentity,
  version: runtimeExecutiveActionOrchestrationVersion,
  namespace: runtimeExecutiveActionOrchestrationNamespace,
  layer: runtimeExecutiveActionOrchestrationLayer,
  capability: runtimeExecutiveActionOrchestrationCapability,
  architecturalRole: runtimeExecutiveActionOrchestrationArchitecturalRole,
  role: "Orchestration" as const,
  status: runtimeExecutiveActionOrchestrationStatus,
  upstreamDependency: runtimeExecutiveActionOrchestrationDependencyIdentity,
  dependencyPath: runtimeExecutiveActionOrchestrationDependencyPath,
  supportedImportPath: runtimeExecutiveActionOrchestrationSupportedImportPath,
  deterministic: runtimeExecutiveActionOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  confirmationGated: true as const,
  safetyPreserving: true as const,
  scopeStable: true as const,
  phaseOrdered: true as const,
  noPhaseSkipping: true as const,
  autoConfirmationForbidden: true as const,
  providerNeutral: true as const,
  rendererIndependent: true as const,
  transportIndependent: true as const,
  aiIndependent: true as const,
  externalDispatchFree: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_BOUNDARY,
  phases: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES,
  statuses: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES,
  operations: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS,
  guarantees: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES,
  policy: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY,
  publicTypeNames: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionOrchestrationApiNames,
  registry: runtimeExecutiveActionOrchestrationRegistry,
  confirmationSafetyBoundary: "REX-5:5-confirmation-safety-only" as const,
  architecturalStatus:
    "REX-5:6 Runtime Executive Action Orchestration — OrchestrationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveActionOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveActionOrchestrationNamespace;
  readonly phase: typeof runtimeExecutiveActionOrchestrationPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionOrchestrationArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionOrchestrationDependencyIdentity;
  readonly phaseCount: number;
  readonly statusCount: number;
  readonly operationCount: number;
  readonly transitionCount: number;
  readonly nextOperationCount: number;
  readonly issueSourceCount: number;
  readonly issueCodeCount: number;
  readonly terminalOutcomeCount: number;
  readonly policyRuleCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly confirmationSafetyBoundaryIntact: boolean;
  readonly noPhaseSkipping: boolean;
  readonly autoConfirmationForbidden: boolean;
  readonly confirmationGated: boolean;
  readonly providerNeutral: boolean;
  readonly rendererIndependent: boolean;
  readonly aiIndependent: boolean;
  readonly externalDispatchFree: boolean;
  readonly upstreamConfirmationSafetyOk: boolean;
}

export function verifyRuntimeExecutiveActionOrchestration():
  RuntimeExecutiveActionOrchestrationVerification {
  const module = runtimeExecutiveActionOrchestration;
  const registry = runtimeExecutiveActionOrchestrationRegistry;
  const upstream = verifyRuntimeExecutiveActionConfirmationSafety();

  const identityOk =
    module.identity === "REX-5:6/RuntimeExecutiveActionOrchestration" &&
    module.version === "5.6.0" &&
    module.namespace === "nexora.rex.action-experience.orchestration" &&
    module.phase === "Orchestration" &&
    module.architecturalRole === "ExecutiveActionRuntimeOrchestrator" &&
    module.upstreamDependency ===
      "REX-5:5/RuntimeExecutiveActionConfirmationSafety" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionConfirmationSafety";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES], [
      "proposal",
      "contract",
      "intent-context",
      "preview",
      "confirmation",
      "prepared-for-dispatch",
      "terminal",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES], [
      "idle",
      "in-progress",
      "waiting",
      "blocked",
      "ready",
      "completed",
      "cancelled",
      "rejected",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS], [
      "prepare",
      "evaluate-contract",
      "resolve-intent-context",
      "build-preview",
      "evaluate-confirmation",
      "confirm",
      "decline",
      "cancel",
      "advance",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES], [
      "deterministic",
      "immutable",
      "confirmation-gated",
      "safety-preserving",
      "scope-stable",
      "phase-ordered",
      "no-phase-skipping",
      "issue-preserving",
      "explicit-input-driven",
      "auto-confirmation-forbidden",
      "provider-neutral",
      "renderer-independent",
      "transport-independent",
      "side-effect-free",
      "external-dispatch-free",
    ]);

  const skipBlocked = !canTransitionRuntimeExecutiveActionOrchestration({
    from: "proposal",
    to: "prepared-for-dispatch",
    operation: "advance",
  });
  const confirmOnly = canTransitionRuntimeExecutiveActionOrchestration({
    from: "confirmation",
    to: "prepared-for-dispatch",
    operation: "confirm",
  });
  const noAdvanceConfirm = !canTransitionRuntimeExecutiveActionOrchestration({
    from: "confirmation",
    to: "prepared-for-dispatch",
    operation: "advance",
  });

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES) &&
    Object.isFrozen(runtimeExecutiveActionOrchestrationCanonicalIdentity) &&
    Object.isFrozen(runtimeExecutiveActionOrchestrationRegistry) &&
    Object.isFrozen(runtimeExecutiveActionOrchestration);

  const ok =
    identityOk &&
    vocabOk &&
    skipBlocked &&
    confirmOnly &&
    noAdvanceConfirm &&
    frozen &&
    module.noPhaseSkipping === true &&
    module.autoConfirmationForbidden === true &&
    module.confirmationGated === true &&
    module.providerNeutral === true &&
    module.externalDispatchFree === true &&
    registry.transitionCount ===
      RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.length &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionOrchestrationIdentity,
    version: runtimeExecutiveActionOrchestrationVersion,
    namespace: runtimeExecutiveActionOrchestrationNamespace,
    phase: runtimeExecutiveActionOrchestrationPhase,
    architecturalRole: runtimeExecutiveActionOrchestrationArchitecturalRole,
    dependencyIdentity: runtimeExecutiveActionOrchestrationDependencyIdentity,
    phaseCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PHASES.length,
    statusCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_STATUSES.length,
    operationCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_OPERATIONS.length,
    transitionCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_TRANSITION_RULES.length,
    nextOperationCount:
      RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_NEXT_OPERATIONS.length,
    issueSourceCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_SOURCES.length,
    issueCodeCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_ISSUE_CODES.length,
    terminalOutcomeCount: RUNTIME_EXECUTIVE_ACTION_TERMINAL_OUTCOMES.length,
    policyRuleCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_POLICY_RULES.length,
    guaranteeCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_GUARANTEES.length,
    sectionCount: RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveActionOrchestrationApiNames.length,
    frozen,
    confirmationSafetyBoundaryIntact:
      module.confirmationSafetyBoundary ===
      "REX-5:5-confirmation-safety-only",
    noPhaseSkipping: skipBlocked && module.noPhaseSkipping === true,
    autoConfirmationForbidden: noAdvanceConfirm && module.autoConfirmationForbidden,
    confirmationGated: confirmOnly && module.confirmationGated === true,
    providerNeutral: module.providerNeutral === true,
    rendererIndependent: module.rendererIndependent === true,
    aiIndependent: module.aiIndependent === true,
    externalDispatchFree: module.externalDispatchFree === true,
    upstreamConfirmationSafetyOk: upstream.ok === true,
  });
}
