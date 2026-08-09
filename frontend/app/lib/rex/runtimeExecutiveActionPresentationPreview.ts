/**
 * REX-5:4 — Runtime Executive Action Presentation & Preview.
 *
 * Converts REX-5:3 Intent & Context results into a stable, renderer-independent
 * presentation and preview model for executive review before confirmation.
 *
 * Canonical flow:
 *   REX-5:3 Intent & Context → REX-5:4 Presentation & Preview → later Confirmation
 *
 * Answers: What should the executive see before confirming an action?
 *
 * Presentation/preview only. No confirmation, dispatch, UI components,
 * recipient lookup, permissions, AI copy generation, or provider integration.
 */

import {
  RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS,
  RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES,
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  runtimeExecutiveActionIntentContextSupportedImportPath,
  runtimeExecutiveActionIntentContextVersion,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
  type RuntimeExecutiveActionContextBinding,
  type RuntimeExecutiveActionDraft,
  type RuntimeExecutiveActionIntentContextRequest,
  type RuntimeExecutiveActionIntentContextResult,
  type RuntimeExecutiveActionIntentResolution,
  type RuntimeExecutiveActionOrigin,
  type RuntimeExecutiveActionOriginKind,
  type RuntimeExecutiveActionPreparationResult,
  type RuntimeExecutiveActionProposalContract,
} from "@/app/lib/rex/runtimeExecutiveActionIntentContext";

// ─── Transitively published Intent/Contracts/Foundation surface (for REX-5:5+)
// Additive publication: later phases obtain upstream gates through REX-5:4.

export {
  RUNTIME_EXECUTIVE_ACTION_INTENT_KINDS,
  RUNTIME_EXECUTIVE_ACTION_KINDS,
  RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_STATES,
  RUNTIME_EXECUTIVE_ACTION_PRIORITIES,
  createRuntimeExecutiveActionDraft,
  createRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionPreparationContract,
  evaluateRuntimeExecutiveActionProposalContract,
  evaluateRuntimeExecutiveActionReadiness,
  resolveRuntimeExecutiveActionIntentContext,
  runtimeExecutiveActionExperienceContractsIdentity,
  runtimeExecutiveActionExperienceFoundationIdentity,
  runtimeExecutiveActionIntentContextIdentity,
  verifyRuntimeExecutiveActionExperienceContracts,
  verifyRuntimeExecutiveActionExperienceFoundation,
  verifyRuntimeExecutiveActionIntentContext,
};

export type {
  RuntimeExecutiveActionDraft,
  RuntimeExecutiveActionIntentContextRequest,
  RuntimeExecutiveActionIntentContextResult,
  RuntimeExecutiveActionPreparationResult,
  RuntimeExecutiveActionProposalContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveActionPresentationPreviewIdentity =
  "REX-5:4/RuntimeExecutiveActionPresentationPreview" as const;

export const runtimeExecutiveActionPresentationPreviewVersion =
  "5.4.0" as const;

export const runtimeExecutiveActionPresentationPreviewNamespace =
  "nexora.rex.action-experience.presentation-preview" as const;

export const runtimeExecutiveActionPresentationPreviewLayer = "REX" as const;

export const runtimeExecutiveActionPresentationPreviewCapability =
  "RuntimeExecutiveActionExperience" as const;

export const runtimeExecutiveActionPresentationPreviewPhase =
  "PresentationPreview" as const;

export const runtimeExecutiveActionPresentationPreviewStatus =
  "PresentationPreviewReady" as const;

export const runtimeExecutiveActionPresentationPreviewArchitecturalRole =
  "ExecutiveActionPresentationPreviewRuntime" as const;

export const runtimeExecutiveActionPresentationPreviewDependencyIdentity =
  runtimeExecutiveActionIntentContextIdentity;

export const runtimeExecutiveActionPresentationPreviewDependencyPath =
  runtimeExecutiveActionIntentContextSupportedImportPath;

export const runtimeExecutiveActionPresentationPreviewSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveActionPresentationPreview" as const;

export const runtimeExecutiveActionPresentationPreviewStability =
  "PresentationPreviewReady" as const;

export const runtimeExecutiveActionPresentationPreviewDeterministic =
  true as const;

export const runtimeExecutiveActionPresentationPreviewSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveActionPresentationPreviewMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveActionPresentationPreviewCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveActionPresentationPreviewIdentity,
    version: runtimeExecutiveActionPresentationPreviewVersion,
    namespace: runtimeExecutiveActionPresentationPreviewNamespace,
    layer: runtimeExecutiveActionPresentationPreviewLayer,
    capability: runtimeExecutiveActionPresentationPreviewCapability,
    phase: runtimeExecutiveActionPresentationPreviewPhase,
    status: runtimeExecutiveActionPresentationPreviewStatus,
    architecturalRole:
      runtimeExecutiveActionPresentationPreviewArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionPresentationPreviewDependencyIdentity,
    dependencyPath:
      runtimeExecutiveActionPresentationPreviewDependencyPath,
    supportedImportPath:
      runtimeExecutiveActionPresentationPreviewSupportedImportPath,
    upstreamVersion: runtimeExecutiveActionIntentContextVersion,
    stabilityStatus: runtimeExecutiveActionPresentationPreviewStability,
    deterministicStatus:
      runtimeExecutiveActionPresentationPreviewDeterministic,
    sideEffectPolicy:
      runtimeExecutiveActionPresentationPreviewSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveActionPresentationPreviewMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PRINCIPLE =
  "REX-5:4 describes what the executive should see before confirming an action — not whether it is approved, dispatched, or delivered." as const;

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    presentationAuthority: "REX-5:4" as const,
    architecturalRole: "ExecutiveActionPresentationPreviewRuntime" as const,
    soleImmediateDependency:
      "REX-5:3/RuntimeExecutiveActionIntentContext" as const,
    consumesIntentContextOnly: true as const,
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
    aiIndependent: true as const,
    introducesConfirmationBehavior: false as const,
    introducesDispatch: false as const,
    introducesUiBehavior: false as const,
    introducesRendering: false as const,
    introducesRecipientResolution: false as const,
    introducesPermissionChecks: false as const,
    introducesLlmGeneration: false as const,
    introducesExternalIntegration: false as const,
    introducesPersistence: false as const,
  });

// ─── Inherited upstream vocabularies ────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_ACTION_KINDS =
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_ACTION_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_INTENT_KINDS =
  RUNTIME_EXECUTIVE_ACTION_INTENT_CONTEXT_INTENT_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_ORIGIN_KINDS =
  RUNTIME_EXECUTIVE_ACTION_ORIGIN_KINDS;
export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_BINDING_STRENGTHS =
  RUNTIME_EXECUTIVE_ACTION_BINDING_STRENGTHS;
export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_CONTEXT_COMPLETENESS =
  RUNTIME_EXECUTIVE_ACTION_CONTEXT_COMPLETENESS_VALUES;
export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_INTENT_STATUSES =
  RUNTIME_EXECUTIVE_ACTION_INTENT_RESOLUTION_STATUSES;

export type RuntimeExecutiveActionPresentationActionKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_ACTION_KINDS)[number];
export type RuntimeExecutiveActionPresentationIntentKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_INTENT_KINDS)[number];

// ─── Presentation vocabularies ──────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

export type RuntimeExecutiveActionPresentationState =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES = Object.freeze([
  "compact",
  "standard",
  "expanded",
] as const);

export type RuntimeExecutiveActionPresentationDensity =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES)[number];

/**
 * Canonical preview section kinds.
 * Built-section order follows ACTION→…→LIFECYCLE (see SECTION_ORDER).
 */
export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS = Object.freeze([
  "identity",
  "action",
  "subject",
  "target",
  "recipient",
  "intent",
  "priority",
  "reason",
  "origin",
  "context",
  "consequence",
  "readiness",
  "warnings",
  "lifecycle",
] as const);

export type RuntimeExecutiveActionPreviewSectionKind =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS)[number];

/** Deterministic built-section order for executive preview. */
export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER = Object.freeze([
  "action",
  "subject",
  "target",
  "recipient",
  "intent",
  "priority",
  "reason",
  "origin",
  "context",
  "consequence",
  "readiness",
  "warnings",
  "lifecycle",
] as const satisfies ReadonlyArray<RuntimeExecutiveActionPreviewSectionKind>);

export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_VISIBILITY = Object.freeze([
  "visible",
  "optional",
  "hidden",
] as const);

export type RuntimeExecutiveActionPreviewSectionVisibility =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_VISIBILITY)[number];

export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_IMPORTANCE = Object.freeze([
  "primary",
  "secondary",
  "supporting",
  "warning",
] as const);

export type RuntimeExecutiveActionPreviewImportance =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_IMPORTANCE)[number];

export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES = Object.freeze([
  "info",
  "caution",
  "warning",
  "blocking",
] as const);

export type RuntimeExecutiveActionPreviewWarningSeverity =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES = Object.freeze([
  "recipient-unresolved",
  "intent-ambiguous",
  "intent-unresolved",
  "target-missing",
  "context-conflict",
  "reason-missing",
  "lifecycle-invalid",
  "action-incomplete",
  "critical-priority",
] as const);

export type RuntimeExecutiveActionPreviewWarningCode =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES = Object.freeze([
  "ready",
  "partial",
  "blocked",
  "rejected",
] as const);

export type RuntimeExecutiveActionPreviewStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_READINESS_PRESENTATION_STATUSES =
  Object.freeze(["ready", "incomplete", "blocked"] as const);

export type RuntimeExecutiveActionReadinessPresentationStatus =
  (typeof RUNTIME_EXECUTIVE_ACTION_READINESS_PRESENTATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PRIORITY_PRESENTATION_VALUES =
  Object.freeze(["low", "normal", "high", "critical"] as const);

export type RuntimeExecutiveActionPriorityPresentationValue =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRIORITY_PRESENTATION_VALUES)[number];

export const RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_PRESENTATION_VALUES =
  Object.freeze([
    "draft",
    "prepared",
    "pending-confirmation",
    "confirmed",
    "cancelled",
  ] as const);

export type RuntimeExecutiveActionLifecyclePresentationValue =
  (typeof RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_PRESENTATION_VALUES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES =
  Object.freeze([
    "deterministic",
    "immutable",
    "intent-context-aligned",
    "renderer-independent",
    "presentation-state-aware",
    "density-aware",
    "warning-aware",
    "ambiguity-preserving",
    "context-preserving",
    "recipient-resolution-safe",
    "lifecycle-aware",
    "provider-independent",
    "transport-independent",
    "side-effect-free",
    "dispatch-free",
  ] as const);

export type RuntimeExecutiveActionPresentationPreviewGuarantee =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "PresentationStates",
    "PresentationDensities",
    "PreviewSections",
    "SectionVisibility",
    "SectionImportance",
    "WarningSeverities",
    "WarningCodes",
    "PreviewStatuses",
    "TitleRules",
    "ConsequenceRules",
    "PublicAPIs",
    "Guarantees",
  ] as const);

export type RuntimeExecutiveActionPresentationPreviewRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_REGISTRY_SECTIONS)[number];

// ─── Title / consequence rule tables ────────────────────────────────────────

export interface RuntimeExecutiveActionTitleRule {
  readonly id: string;
  readonly actionKind: RuntimeExecutiveActionPresentationActionKind;
  readonly intentKind?: RuntimeExecutiveActionPresentationIntentKind;
  readonly title: string;
  readonly precedence: number;
}

export const RUNTIME_EXECUTIVE_ACTION_TITLE_RULES = Object.freeze([
  Object.freeze({
    id: "request-request-information",
    actionKind: "request",
    intentKind: "request-information",
    title: "Request Update",
    precedence: 1,
  }),
  Object.freeze({
    id: "send-request-information",
    actionKind: "send",
    intentKind: "request-information",
    title: "Request Update",
    precedence: 1,
  }),
  Object.freeze({
    id: "assign-delegate",
    actionKind: "assign",
    intentKind: "delegate",
    title: "Assign Responsibility",
    precedence: 1,
  }),
  Object.freeze({
    id: "approve-approve",
    actionKind: "approve",
    intentKind: "approve",
    title: "Approve Decision",
    precedence: 1,
  }),
  Object.freeze({
    id: "review-review",
    actionKind: "review",
    intentKind: "review",
    title: "Review",
    precedence: 1,
  }),
  Object.freeze({
    id: "escalate-escalate",
    actionKind: "escalate",
    intentKind: "escalate",
    title: "Escalate",
    precedence: 1,
  }),
  Object.freeze({
    id: "follow-up-follow-up",
    actionKind: "follow-up",
    intentKind: "follow-up",
    title: "Follow Up",
    precedence: 1,
  }),
  Object.freeze({
    id: "send-inform",
    actionKind: "send",
    intentKind: "inform",
    title: "Send Information",
    precedence: 1,
  }),
  Object.freeze({
    id: "send-coordinate",
    actionKind: "send",
    intentKind: "coordinate",
    title: "Coordinate",
    precedence: 1,
  }),
  Object.freeze({
    id: "request-request-action",
    actionKind: "request",
    intentKind: "request-action",
    title: "Request Action",
    precedence: 1,
  }),
  Object.freeze({
    id: "kind-request",
    actionKind: "request",
    title: "Request",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-assign",
    actionKind: "assign",
    title: "Assign",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-send",
    actionKind: "send",
    title: "Send",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-approve",
    actionKind: "approve",
    title: "Approve",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-review",
    actionKind: "review",
    title: "Review",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-escalate",
    actionKind: "escalate",
    title: "Escalate",
    precedence: 10,
  }),
  Object.freeze({
    id: "kind-follow-up",
    actionKind: "follow-up",
    title: "Follow Up",
    precedence: 10,
  }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionTitleRule>);

export interface RuntimeExecutiveActionConsequenceRule {
  readonly id: string;
  readonly intentKind: RuntimeExecutiveActionPresentationIntentKind;
  readonly statement: string;
}

export const RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES = Object.freeze([
  Object.freeze({
    id: "request-information",
    intentKind: "request-information",
    statement:
      "This action will request an update from the selected recipient.",
  }),
  Object.freeze({
    id: "request-action",
    intentKind: "request-action",
    statement:
      "This action will request action from the selected recipient.",
  }),
  Object.freeze({
    id: "delegate",
    intentKind: "delegate",
    statement:
      "Responsibility will be requested from the selected recipient.",
  }),
  Object.freeze({
    id: "inform",
    intentKind: "inform",
    statement:
      "This action will send information to the selected recipient.",
  }),
  Object.freeze({
    id: "review",
    intentKind: "review",
    statement: "This action will request review from the selected recipient.",
  }),
  Object.freeze({
    id: "approve",
    intentKind: "approve",
    statement: "This action will approve a prepared decision.",
  }),
  Object.freeze({
    id: "reject",
    intentKind: "reject",
    statement: "This action will reject a prepared decision.",
  }),
  Object.freeze({
    id: "escalate",
    intentKind: "escalate",
    statement: "This action will escalate attention to the selected recipient.",
  }),
  Object.freeze({
    id: "coordinate",
    intentKind: "coordinate",
    statement: "This action will coordinate with the selected recipient.",
  }),
  Object.freeze({
    id: "follow-up",
    intentKind: "follow-up",
    statement: "This action will create a follow-up intention.",
  }),
] as const satisfies ReadonlyArray<RuntimeExecutiveActionConsequenceRule>);

// ─── Domain models ──────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionSubjectPresentation {
  readonly kind: string;
  readonly id: string;
  readonly label: string;
  readonly caption?: string;
}

export interface RuntimeExecutiveActionTargetPresentation {
  readonly kind: string;
  readonly id: string;
  readonly label: string;
  readonly caption?: string;
}

export interface RuntimeExecutiveActionRecipientPresentation {
  readonly kind: string;
  readonly id?: string;
  readonly label: string;
  readonly unresolved: boolean;
  readonly statusLabel: string;
}

export interface RuntimeExecutiveActionIntentPresentation {
  readonly status: (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_INTENT_STATUSES)[number];
  readonly resolvedIntent?: RuntimeExecutiveActionPresentationIntentKind;
  readonly label: string;
  readonly candidates: ReadonlyArray<RuntimeExecutiveActionPresentationIntentKind>;
  readonly evidenceSummary?: string;
  readonly ambiguous: boolean;
}

export interface RuntimeExecutiveActionPriorityPresentation {
  readonly value: RuntimeExecutiveActionPriorityPresentationValue;
  readonly label: string;
}

export interface RuntimeExecutiveActionOriginPresentation {
  readonly kind: RuntimeExecutiveActionOriginKind;
  readonly label: string;
  readonly referenceId?: string;
}

export interface RuntimeExecutiveActionContextPresentation {
  readonly origin?: RuntimeExecutiveActionOriginPresentation;
  readonly primary: ReadonlyArray<{ readonly id: string; readonly label: string; readonly role: string }>;
  readonly supporting: ReadonlyArray<{ readonly id: string; readonly label: string; readonly role: string }>;
  readonly ambient: ReadonlyArray<{ readonly id: string; readonly label: string; readonly role: string }>;
  readonly completeness: (typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_CONTEXT_COMPLETENESS)[number];
  readonly summary: string;
}

export interface RuntimeExecutiveActionReadinessPresentation {
  readonly status: RuntimeExecutiveActionReadinessPresentationStatus;
  readonly label: string;
  readonly confirmationRelevant: boolean;
}

export interface RuntimeExecutiveActionLifecyclePresentation {
  readonly state: RuntimeExecutiveActionLifecyclePresentationValue;
  readonly label: string;
}

export interface RuntimeExecutiveActionPreviewWarning {
  readonly code: RuntimeExecutiveActionPreviewWarningCode;
  readonly severity: RuntimeExecutiveActionPreviewWarningSeverity;
  readonly message: string;
  readonly field?: string;
}

export interface RuntimeExecutiveActionConsequencePreview {
  readonly statement: string;
  readonly semanticOnly: true;
}

export interface RuntimeExecutiveActionPreviewSection {
  readonly kind: RuntimeExecutiveActionPreviewSectionKind;
  readonly label: string;
  readonly value: string;
  readonly visibility: RuntimeExecutiveActionPreviewSectionVisibility;
  readonly importance: RuntimeExecutiveActionPreviewImportance;
  readonly order: number;
  readonly status?: string;
  readonly referenceId?: string;
}

export interface RuntimeExecutiveActionPresentation {
  readonly actionId?: string;
  readonly title: string;
  readonly summary: string;
  readonly actionKind?: RuntimeExecutiveActionPresentationActionKind;
  readonly intent: RuntimeExecutiveActionIntentPresentation;
  readonly priority?: RuntimeExecutiveActionPriorityPresentation;
  readonly subject?: RuntimeExecutiveActionSubjectPresentation;
  readonly target?: RuntimeExecutiveActionTargetPresentation;
  readonly recipient?: RuntimeExecutiveActionRecipientPresentation;
  readonly reason?: string;
  readonly origin?: RuntimeExecutiveActionOriginPresentation;
  readonly context: RuntimeExecutiveActionContextPresentation;
  readonly lifecycle?: RuntimeExecutiveActionLifecyclePresentation;
  readonly readiness: RuntimeExecutiveActionReadinessPresentation;
  readonly resolutionState: RuntimeExecutiveActionIntentContextResult["status"];
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
  readonly presentationState: RuntimeExecutiveActionPresentationState;
  readonly density: RuntimeExecutiveActionPresentationDensity;
  readonly consequence?: RuntimeExecutiveActionConsequencePreview;
  readonly reviewSemantics: ReadonlyArray<string>;
  readonly identity: typeof runtimeExecutiveActionPresentationPreviewIdentity;
  readonly version: typeof runtimeExecutiveActionPresentationPreviewVersion;
}

export interface RuntimeExecutiveActionPreview {
  readonly title: string;
  readonly summary: string;
  readonly presentationState: RuntimeExecutiveActionPresentationState;
  readonly density: RuntimeExecutiveActionPresentationDensity;
  readonly sections: ReadonlyArray<RuntimeExecutiveActionPreviewSection>;
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
  readonly readiness: RuntimeExecutiveActionReadinessPresentation;
  readonly consequence?: RuntimeExecutiveActionConsequencePreview;
  readonly presentation: RuntimeExecutiveActionPresentation;
}

export interface RuntimeExecutiveActionPreviewRequest {
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
  readonly requestedPresentationState?: RuntimeExecutiveActionPresentationState;
  readonly requestedDensity?: RuntimeExecutiveActionPresentationDensity;
  readonly preferExpandedOnWarnings?: boolean;
}

export interface RuntimeExecutiveActionPreviewResult {
  readonly status: RuntimeExecutiveActionPreviewStatus;
  readonly preview?: RuntimeExecutiveActionPreview;
  readonly presentation?: RuntimeExecutiveActionPresentation;
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
  readonly issues: ReadonlyArray<{ readonly code: string; readonly message: string }>;
  readonly identity: typeof runtimeExecutiveActionPresentationPreviewIdentity;
  readonly version: typeof runtimeExecutiveActionPresentationPreviewVersion;
}

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

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function titleCaseWords(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function labelOrId(label: string | undefined, id: string): string {
  return isNonEmptyString(label) ? label.trim() : id;
}

function isPresentationState(
  value: unknown,
): value is RuntimeExecutiveActionPresentationState {
  return (
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

function isPresentationDensity(
  value: unknown,
): value is RuntimeExecutiveActionPresentationDensity {
  return (
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES as readonly unknown[]
  ).includes(value);
}

function isPriorityValue(
  value: unknown,
): value is RuntimeExecutiveActionPriorityPresentationValue {
  return (
    RUNTIME_EXECUTIVE_ACTION_PRIORITY_PRESENTATION_VALUES as readonly unknown[]
  ).includes(value);
}

function isLifecycleValue(
  value: unknown,
): value is RuntimeExecutiveActionLifecyclePresentationValue {
  return (
    RUNTIME_EXECUTIVE_ACTION_LIFECYCLE_PRESENTATION_VALUES as readonly unknown[]
  ).includes(value);
}

function originLabel(kind: RuntimeExecutiveActionOriginKind): string {
  switch (kind) {
    case "manual":
      return "Manual";
    case "stage":
      return "Stage";
    case "advisor":
      return "Advisor";
    case "insight":
      return "Insight";
    case "decision":
      return "Decision";
    case "scenario":
      return "Scenario";
    case "execution":
      return "Execution";
    case "workspace":
      return "Workspace";
    case "system":
      return "System";
    case "agent":
      return "Agent";
    default:
      return titleCaseWords(kind);
  }
}

function lifecycleLabel(
  state: RuntimeExecutiveActionLifecyclePresentationValue,
): string {
  switch (state) {
    case "draft":
      return "Draft";
    case "prepared":
      return "Prepared";
    case "pending-confirmation":
      return "Pending Confirmation";
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default:
      return titleCaseWords(state);
  }
}

function priorityLabel(
  value: RuntimeExecutiveActionPriorityPresentationValue,
): string {
  switch (value) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "normal":
      return "Normal";
    case "low":
      return "Low";
    default:
      return titleCaseWords(value);
  }
}

function intentLabel(
  intent?: RuntimeExecutiveActionPresentationIntentKind,
): string {
  if (intent === undefined) return "Unresolved";
  switch (intent) {
    case "request-information":
      return "Request Information";
    case "request-action":
      return "Request Action";
    case "follow-up":
      return "Follow Up";
    default:
      return titleCaseWords(intent);
  }
}

function warning(
  code: RuntimeExecutiveActionPreviewWarningCode,
  severity: RuntimeExecutiveActionPreviewWarningSeverity,
  message: string,
  field?: string,
): RuntimeExecutiveActionPreviewWarning {
  return Object.freeze(
    field === undefined
      ? { code, severity, message }
      : { code, severity, message, field },
  );
}

function section(
  kind: RuntimeExecutiveActionPreviewSectionKind,
  label: string,
  value: string,
  visibility: RuntimeExecutiveActionPreviewSectionVisibility,
  importance: RuntimeExecutiveActionPreviewImportance,
  order: number,
  extras?: { readonly status?: string; readonly referenceId?: string },
): RuntimeExecutiveActionPreviewSection {
  return Object.freeze({
    kind,
    label,
    value,
    visibility,
    importance,
    order,
    ...(extras?.status !== undefined ? { status: extras.status } : {}),
    ...(extras?.referenceId !== undefined
      ? { referenceId: extras.referenceId }
      : {}),
  });
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveActionPresentationState(
  value: unknown,
): value is RuntimeExecutiveActionPresentationState {
  return isPresentationState(value);
}

export function isRuntimeExecutiveActionPresentationDensity(
  value: unknown,
): value is RuntimeExecutiveActionPresentationDensity {
  return isPresentationDensity(value);
}

export function isRuntimeExecutiveActionPreviewSectionKind(
  value: unknown,
): value is RuntimeExecutiveActionPreviewSectionKind {
  return (
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionPreviewWarningCode(
  value: unknown,
): value is RuntimeExecutiveActionPreviewWarningCode {
  return (
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionPreviewStatus(
  value: unknown,
): value is RuntimeExecutiveActionPreviewStatus {
  return (
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveActionPreviewWarningSeverity(
  value: unknown,
): value is RuntimeExecutiveActionPreviewWarningSeverity {
  return (
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES as readonly unknown[]
  ).includes(value);
}

// ─── Title / summary / consequence ──────────────────────────────────────────

export function resolveRuntimeExecutiveActionPresentationTitle(input: {
  readonly actionKind?: RuntimeExecutiveActionPresentationActionKind;
  readonly intentKind?: RuntimeExecutiveActionPresentationIntentKind;
  readonly suppliedTitle?: string;
}): string {
  if (isNonEmptyString(input.suppliedTitle)) {
    return input.suppliedTitle.trim();
  }
  if (input.actionKind === undefined) {
    return "Executive Action";
  }
  const matches = RUNTIME_EXECUTIVE_ACTION_TITLE_RULES.filter((rule) => {
    if (rule.actionKind !== input.actionKind) return false;
    if (rule.intentKind === undefined) return true;
    return rule.intentKind === input.intentKind;
  }).slice().sort((a, b) => a.precedence - b.precedence);

  const exact = matches.find((rule) => rule.intentKind !== undefined);
  if (exact) return exact.title;
  const fallback = matches.find((rule) => rule.intentKind === undefined);
  return fallback?.title ?? titleCaseWords(input.actionKind);
}

export function resolveRuntimeExecutiveActionPresentationSummary(input: {
  readonly intentKind?: RuntimeExecutiveActionPresentationIntentKind;
  readonly subjectLabel?: string;
  readonly recipientLabel?: string;
  readonly ambiguous?: boolean;
}): string {
  const subject = input.subjectLabel ?? "the selected subject";
  const recipient = input.recipientLabel ?? "the selected recipient";

  if (input.ambiguous === true || input.intentKind === undefined) {
    return `Review the proposed action about ${subject}.`;
  }

  switch (input.intentKind) {
    case "request-information":
      return `Request an update from ${recipient} about ${subject}.`;
    case "request-action":
      return `Request action from ${recipient} regarding ${subject}.`;
    case "delegate":
      return `Assign responsibility to ${recipient} for ${subject}.`;
    case "inform":
      return `Send information about ${subject} to ${recipient}.`;
    case "review":
      return `Request review from ${recipient} of ${subject}.`;
    case "approve":
      return `Approve the prepared decision for ${subject}.`;
    case "reject":
      return `Reject the prepared decision for ${subject}.`;
    case "escalate":
      return `Escalate attention on ${subject} to ${recipient}.`;
    case "coordinate":
      return `Coordinate with ${recipient} about ${subject}.`;
    case "follow-up":
      return `Create a follow-up intention about ${subject}.`;
    default:
      return `Review the proposed action about ${subject}.`;
  }
}

export function resolveRuntimeExecutiveActionConsequencePreview(input: {
  readonly intentKind?: RuntimeExecutiveActionPresentationIntentKind;
  readonly ambiguous?: boolean;
}): RuntimeExecutiveActionConsequencePreview | undefined {
  if (input.ambiguous === true || input.intentKind === undefined) {
    return Object.freeze({
      statement:
        "Consequence depends on resolving intent before confirmation.",
      semanticOnly: true as const,
    });
  }
  const rule = RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES.find(
    (entry) => entry.intentKind === input.intentKind,
  );
  if (rule === undefined) {
    return Object.freeze({
      statement: "This action expresses an executive intention for later review.",
      semanticOnly: true as const,
    });
  }
  return Object.freeze({
    statement: rule.statement,
    semanticOnly: true as const,
  });
}

// ─── Warnings ───────────────────────────────────────────────────────────────

export function buildRuntimeExecutiveActionPreviewWarnings(input: {
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
}): ReadonlyArray<RuntimeExecutiveActionPreviewWarning> {
  const proposal = input.intentContext.proposal;
  const intent = input.intentContext.intentResolution;
  const collected: RuntimeExecutiveActionPreviewWarning[] = [];

  if (proposal?.recipient?.kind === "unresolved") {
    collected.push(
      warning(
        "recipient-unresolved",
        "blocking",
        "Recipient remains unresolved",
        "recipient",
      ),
    );
  }

  if (intent.status === "ambiguous") {
    collected.push(
      warning(
        "intent-ambiguous",
        "blocking",
        "Intent remains ambiguous",
        "intent",
      ),
    );
  } else if (intent.status === "unresolved") {
    collected.push(
      warning(
        "intent-unresolved",
        "blocking",
        "Intent could not be resolved",
        "intent",
      ),
    );
  }

  if (proposal?.target === undefined) {
    collected.push(
      warning(
        "target-missing",
        "caution",
        "Target is not supplied",
        "target",
      ),
    );
  }

  if (input.intentContext.contextBinding.conflicts.length > 0) {
    collected.push(
      warning(
        "context-conflict",
        "warning",
        "Context conflict detected",
        "context",
      ),
    );
  }

  if (!isNonEmptyString(input.intentContext.reason?.reason) &&
    !isNonEmptyString(
      typeof proposal?.reason === "string"
        ? proposal.reason
        : proposal?.reason?.text,
    )
  ) {
    collected.push(
      warning("reason-missing", "info", "Reason is not supplied", "reason"),
    );
  }

  if (proposal?.lifecycle === "cancelled") {
    collected.push(
      warning(
        "lifecycle-invalid",
        "blocking",
        "Cancelled actions are not confirmation-ready",
        "lifecycle",
      ),
    );
  }

  if (
    input.intentContext.status === "partially-resolved" ||
    input.intentContext.status === "unresolved" ||
    input.intentContext.suitability === "insufficient"
  ) {
    collected.push(
      warning(
        "action-incomplete",
        "warning",
        "Action information is incomplete",
        "action",
      ),
    );
  }

  if (proposal?.priority === "critical") {
    collected.push(
      warning(
        "critical-priority",
        "caution",
        "Action priority is critical",
        "priority",
      ),
    );
  }

  // Canonical order: blocking → warning → caution → info, then warning-code order.
  const severityRank = new Map(
    (["blocking", "warning", "caution", "info"] as const).map(
      (value, index) => [value, index],
    ),
  );
  const codeRank = new Map(
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES.map((value, index) => [
      value,
      index,
    ]),
  );

  const ordered = [...collected].sort((a, b) => {
    const severityDelta =
      (severityRank.get(a.severity) ?? 99) - (severityRank.get(b.severity) ?? 99);
    if (severityDelta !== 0) return severityDelta;
    return (codeRank.get(a.code) ?? 0) - (codeRank.get(b.code) ?? 0);
  });

  return freezeArray(ordered);
}

// ─── Component presentation builders ────────────────────────────────────────

function buildSubjectPresentation(
  subject: NonNullable<RuntimeExecutiveActionIntentContextResult["proposal"]>["subject"],
): RuntimeExecutiveActionSubjectPresentation | undefined {
  if (subject === undefined) return undefined;
  return Object.freeze({
    kind: subject.kind,
    id: subject.id,
    label: labelOrId(subject.label, subject.id),
    ...(subject.referenceId !== undefined
      ? { caption: subject.referenceId }
      : {}),
  });
}

function buildTargetPresentation(
  target: NonNullable<RuntimeExecutiveActionIntentContextResult["proposal"]>["target"],
): RuntimeExecutiveActionTargetPresentation | undefined {
  if (target === undefined) return undefined;
  return Object.freeze({
    kind: target.kind,
    id: target.id,
    label: labelOrId(target.label, target.id),
    ...(target.referenceId !== undefined
      ? { caption: target.referenceId }
      : {}),
  });
}

function buildRecipientPresentation(
  recipient: NonNullable<RuntimeExecutiveActionIntentContextResult["proposal"]>["recipient"],
): RuntimeExecutiveActionRecipientPresentation | undefined {
  if (recipient === undefined) return undefined;
  const unresolved = recipient.kind === "unresolved";
  return Object.freeze({
    kind: recipient.kind,
    ...(recipient.id !== undefined ? { id: recipient.id } : {}),
    label: labelOrId(
      recipient.label,
      unresolved ? "Unresolved" : recipient.id ?? "Recipient",
    ),
    unresolved,
    statusLabel: unresolved ? "Unresolved" : "Resolved",
  });
}

function buildIntentPresentation(
  resolution: RuntimeExecutiveActionIntentResolution,
): RuntimeExecutiveActionIntentPresentation {
  const ambiguous = resolution.status === "ambiguous";
  const unresolved = resolution.status === "unresolved";
  const label = ambiguous
    ? "Ambiguous"
    : unresolved
      ? "Unresolved"
      : intentLabel(resolution.resolvedIntent);

  const evidenceSummary =
    resolution.evidence.length > 0
      ? resolution.evidence
          .map((entry) => entry.contribution)
          .slice(0, 3)
          .join("; ")
      : undefined;

  return Object.freeze({
    status: resolution.status,
    ...(resolution.resolvedIntent !== undefined
      ? { resolvedIntent: resolution.resolvedIntent }
      : {}),
    label,
    candidates: freezeArray([...resolution.candidates]),
    ...(evidenceSummary !== undefined ? { evidenceSummary } : {}),
    ambiguous,
  });
}

function buildPriorityPresentation(
  priority: unknown,
): RuntimeExecutiveActionPriorityPresentation | undefined {
  if (!isPriorityValue(priority)) return undefined;
  return Object.freeze({
    value: priority,
    label: priorityLabel(priority),
  });
}

function buildOriginPresentation(
  origin: RuntimeExecutiveActionOrigin | undefined,
): RuntimeExecutiveActionOriginPresentation | undefined {
  if (origin === undefined) return undefined;
  return Object.freeze({
    kind: origin.kind,
    label: originLabel(origin.kind),
    ...(origin.referenceId !== undefined
      ? { referenceId: origin.referenceId }
      : {}),
  });
}

function buildContextPresentation(
  binding: RuntimeExecutiveActionContextBinding,
  origin: RuntimeExecutiveActionOriginPresentation | undefined,
): RuntimeExecutiveActionContextPresentation {
  const mapRefs = (
    refs: RuntimeExecutiveActionContextBinding["primary"],
  ) =>
    freezeArray(
      refs.map((entry) =>
        Object.freeze({
          id: entry.id,
          label: labelOrId(entry.label, entry.id),
          role: entry.role,
        }),
      ),
    );

  const primary = mapRefs(binding.primary);
  const supporting = mapRefs(binding.supporting);
  const ambient = mapRefs(binding.ambient);

  const parts: string[] = [];
  if (origin !== undefined) parts.push(`Origin: ${origin.label}`);
  if (primary[0] !== undefined) {
    parts.push(`Primary Context: ${primary[0].label}`);
  }
  if (supporting[0] !== undefined) {
    parts.push(`Supporting Context: ${supporting[0].label}`);
  }
  if (ambient[0] !== undefined) {
    parts.push(`Ambient Context: ${ambient[0].label}`);
  }

  return Object.freeze({
    ...(origin !== undefined ? { origin } : {}),
    primary,
    supporting,
    ambient,
    completeness: binding.completeness,
    summary: parts.length > 0 ? parts.join(" · ") : "No additional context",
  });
}

function buildReadinessPresentation(input: {
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
}): RuntimeExecutiveActionReadinessPresentation {
  const hasBlocking = input.warnings.some(
    (entry) => entry.severity === "blocking",
  );
  if (hasBlocking || input.intentContext.status === "rejected") {
    return Object.freeze({
      status: "blocked",
      label: "Blocked",
      confirmationRelevant: true,
    });
  }
  if (
    input.intentContext.status === "partially-resolved" ||
    input.intentContext.status === "ambiguous" ||
    input.intentContext.status === "unresolved" ||
    input.intentContext.suitability === "insufficient" ||
    input.warnings.some((entry) => entry.code === "action-incomplete")
  ) {
    return Object.freeze({
      status: "incomplete",
      label: "Incomplete",
      confirmationRelevant: true,
    });
  }
  return Object.freeze({
    status: "ready",
    label: "Ready",
    confirmationRelevant: true,
  });
}

function buildLifecyclePresentation(
  lifecycle: unknown,
): RuntimeExecutiveActionLifecyclePresentation | undefined {
  if (!isLifecycleValue(lifecycle)) return undefined;
  return Object.freeze({
    state: lifecycle,
    label: lifecycleLabel(lifecycle),
  });
}

// ─── State / density resolvers ──────────────────────────────────────────────

export function resolveRuntimeExecutiveActionPresentationState(input: {
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
  readonly requestedPresentationState?: RuntimeExecutiveActionPresentationState;
  readonly warnings?: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
}): RuntimeExecutiveActionPresentationState {
  if (
    input.requestedPresentationState !== undefined &&
    isPresentationState(input.requestedPresentationState)
  ) {
    return input.requestedPresentationState;
  }

  const lifecycle = input.intentContext.proposal?.lifecycle;
  if (lifecycle === "pending-confirmation" || lifecycle === "confirmed") {
    return "operation";
  }

  const warnings =
    input.warnings ??
    buildRuntimeExecutiveActionPreviewWarnings({
      intentContext: input.intentContext,
    });
  const hasBlocking = warnings.some((entry) => entry.severity === "blocking");
  if (hasBlocking) {
    return "report";
  }

  if (
    input.intentContext.status === "resolved" &&
    (input.intentContext.suitability === "sufficient" ||
      input.intentContext.suitability === "strong")
  ) {
    return "report";
  }

  return "minimum";
}

export function resolveRuntimeExecutiveActionPresentationDensity(input: {
  readonly presentationState: RuntimeExecutiveActionPresentationState;
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
  readonly requestedDensity?: RuntimeExecutiveActionPresentationDensity;
  readonly preferExpandedOnWarnings?: boolean;
}): RuntimeExecutiveActionPresentationDensity {
  if (
    input.requestedDensity !== undefined &&
    isPresentationDensity(input.requestedDensity)
  ) {
    return input.requestedDensity;
  }

  if (input.presentationState === "minimum") {
    return "compact";
  }

  const warningHeavy = input.warnings.length >= 2;
  const rich =
    input.intentContext.contextBinding.completeness === "rich";

  if (
    input.presentationState === "operation" &&
    (warningHeavy || input.preferExpandedOnWarnings === true || rich)
  ) {
    return "expanded";
  }

  if (input.presentationState === "report" && rich) {
    return "expanded";
  }

  return "standard";
}

// ─── Section builders ───────────────────────────────────────────────────────

function buildSections(input: {
  readonly presentationState: RuntimeExecutiveActionPresentationState;
  readonly presentation: RuntimeExecutiveActionPresentation;
}): ReadonlyArray<RuntimeExecutiveActionPreviewSection> {
  const { presentationState, presentation } = input;
  const built: RuntimeExecutiveActionPreviewSection[] = [];
  const orderIndex = new Map(
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER.map((kind, index) => [
      kind,
      index + 1,
    ]),
  );

  const include = (
    kind: RuntimeExecutiveActionPreviewSectionKind,
    requiredIn: ReadonlyArray<RuntimeExecutiveActionPresentationState>,
  ) => requiredIn.includes(presentationState);

  // action
  if (
    include("action", ["minimum", "report", "operation"]) &&
    presentation.title
  ) {
    built.push(
      section(
        "action",
        "Action",
        presentationState === "operation"
          ? presentation.title.toUpperCase()
          : presentation.title,
        "visible",
        "primary",
        orderIndex.get("action") ?? 1,
      ),
    );
  }

  // subject
  if (presentation.subject) {
    const visibility: RuntimeExecutiveActionPreviewSectionVisibility =
      include("subject", ["minimum", "report", "operation"])
        ? "visible"
        : "hidden";
    if (visibility === "visible") {
      built.push(
        section(
          "subject",
          "Subject",
          presentation.subject.label,
          "visible",
          "primary",
          orderIndex.get("subject") ?? 2,
          { referenceId: presentation.subject.id },
        ),
      );
    }
  }

  // target
  if (presentation.target) {
    if (include("target", ["report", "operation"])) {
      built.push(
        section(
          "target",
          "Target",
          presentation.target.label,
          "visible",
          "secondary",
          orderIndex.get("target") ?? 3,
          { referenceId: presentation.target.id },
        ),
      );
    }
  } else if (include("target", ["report", "operation"])) {
    built.push(
      section(
        "target",
        "Target",
        "Not supplied",
        "optional",
        "supporting",
        orderIndex.get("target") ?? 3,
        { status: "missing" },
      ),
    );
  }

  // recipient — never silently remove unresolved
  if (presentation.recipient) {
    if (include("recipient", ["report", "operation"])) {
      built.push(
        section(
          "recipient",
          "Recipient",
          presentation.recipient.unresolved
            ? `${presentation.recipient.label} (Unresolved)`
            : presentation.recipient.label,
          "visible",
          presentation.recipient.unresolved ? "warning" : "secondary",
          orderIndex.get("recipient") ?? 4,
          {
            status: presentation.recipient.statusLabel,
            ...(presentation.recipient.id !== undefined
              ? { referenceId: presentation.recipient.id }
              : {}),
          },
        ),
      );
    }
  }

  // intent
  if (include("intent", ["report", "operation"])) {
    const value =
      presentation.intent.ambiguous && presentation.intent.candidates.length > 0
        ? `Ambiguous (${presentation.intent.candidates.map(intentLabel).join(", ")})`
        : presentation.intent.label;
    built.push(
      section(
        "intent",
        "Intent",
        value,
        "visible",
        presentation.intent.ambiguous ? "warning" : "secondary",
        orderIndex.get("intent") ?? 5,
        { status: presentation.intent.status },
      ),
    );
  }

  // priority
  if (presentation.priority) {
    if (include("priority", ["minimum", "report", "operation"])) {
      built.push(
        section(
          "priority",
          "Priority",
          presentationState === "minimum"
            ? `${presentation.priority.label} Priority`
            : presentation.priority.label,
          "visible",
          presentation.priority.value === "critical" ? "warning" : "secondary",
          orderIndex.get("priority") ?? 6,
        ),
      );
    }
  }

  // reason
  if (presentation.reason && include("reason", ["report", "operation"])) {
    built.push(
      section(
        "reason",
        "Reason",
        presentation.reason,
        "visible",
        "supporting",
        orderIndex.get("reason") ?? 7,
      ),
    );
  }

  // origin
  if (presentation.origin && include("origin", ["report", "operation"])) {
    built.push(
      section(
        "origin",
        "Origin",
        presentation.origin.label,
        "visible",
        "supporting",
        orderIndex.get("origin") ?? 8,
        presentation.origin.referenceId !== undefined
          ? { referenceId: presentation.origin.referenceId }
          : undefined,
      ),
    );
  }

  // context
  if (include("context", ["report", "operation"])) {
    built.push(
      section(
        "context",
        "Context",
        presentation.context.summary,
        presentation.context.summary === "No additional context"
          ? "optional"
          : "visible",
        "supporting",
        orderIndex.get("context") ?? 9,
        { status: presentation.context.completeness },
      ),
    );
  }

  // consequence
  if (presentation.consequence && include("consequence", ["operation"])) {
    built.push(
      section(
        "consequence",
        "Consequence",
        presentation.consequence.statement,
        "visible",
        "secondary",
        orderIndex.get("consequence") ?? 10,
      ),
    );
  }

  // readiness
  if (include("readiness", ["minimum", "report", "operation"])) {
    built.push(
      section(
        "readiness",
        "Status",
        presentation.readiness.label,
        "visible",
        presentation.readiness.status === "blocked" ? "warning" : "secondary",
        orderIndex.get("readiness") ?? 11,
        { status: presentation.readiness.status },
      ),
    );
  }

  // warnings — always surface blocking even in minimum
  const blocking = presentation.warnings.filter(
    (entry) => entry.severity === "blocking",
  );
  const warnValue =
    presentationState === "minimum"
      ? blocking.map((entry) => entry.message).join("; ")
      : presentation.warnings.map((entry) => entry.message).join("; ");
  if (
    (presentationState === "minimum" && blocking.length > 0) ||
    (include("warnings", ["report", "operation"]) &&
      presentation.warnings.length > 0)
  ) {
    built.push(
      section(
        "warnings",
        "Warnings",
        warnValue,
        "visible",
        "warning",
        orderIndex.get("warnings") ?? 12,
        {
          status: String(
            presentationState === "minimum"
              ? blocking.length
              : presentation.warnings.length,
          ),
        },
      ),
    );
  }

  // lifecycle
  if (
    presentation.lifecycle &&
    include("lifecycle", ["report", "operation"])
  ) {
    built.push(
      section(
        "lifecycle",
        "Lifecycle",
        presentation.lifecycle.label,
        "visible",
        "supporting",
        orderIndex.get("lifecycle") ?? 13,
        { status: presentation.lifecycle.state },
      ),
    );
  }

  return freezeArray([...built].sort((a, b) => a.order - b.order));
}

// ─── Presentation / preview resolution ──────────────────────────────────────

function buildPresentation(input: {
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
  readonly presentationState: RuntimeExecutiveActionPresentationState;
  readonly density: RuntimeExecutiveActionPresentationDensity;
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
}): RuntimeExecutiveActionPresentation {
  const proposal = input.intentContext.proposal;
  const intent = buildIntentPresentation(input.intentContext.intentResolution);
  const subject = buildSubjectPresentation(proposal?.subject);
  const target = buildTargetPresentation(proposal?.target);
  const recipient = buildRecipientPresentation(proposal?.recipient);
  const priority = buildPriorityPresentation(proposal?.priority);
  const origin = buildOriginPresentation(input.intentContext.origin);
  const context = buildContextPresentation(
    input.intentContext.contextBinding,
    origin,
  );
  const lifecycle = buildLifecyclePresentation(proposal?.lifecycle);
  const readiness = buildReadinessPresentation({
    warnings: input.warnings,
    intentContext: input.intentContext,
  });

  const reasonTextValue =
    input.intentContext.reason?.reason ??
    (typeof proposal?.reason === "string"
      ? proposal.reason
      : proposal?.reason?.text);

  const title = resolveRuntimeExecutiveActionPresentationTitle({
    actionKind: proposal?.kind,
    intentKind: intent.resolvedIntent,
    suppliedTitle: proposal?.title,
  });

  const summary = resolveRuntimeExecutiveActionPresentationSummary({
    intentKind: intent.resolvedIntent,
    subjectLabel: subject?.label,
    recipientLabel: recipient?.label,
    ambiguous: intent.ambiguous,
  });

  const consequence = resolveRuntimeExecutiveActionConsequencePreview({
    intentKind: intent.resolvedIntent,
    ambiguous: intent.ambiguous,
  });

  const reviewSemantics = freezeArray(
    [
      "executive-review",
      readiness.confirmationRelevant ? "confirmation-relevant" : undefined,
      intent.ambiguous ? "intent-ambiguous" : undefined,
      recipient?.unresolved === true ? "recipient-unresolved" : undefined,
      readiness.status === "ready" ? "ready-for-confirmation" : undefined,
    ].filter((value): value is string => value !== undefined),
  );

  return Object.freeze({
    ...(proposal?.actionId !== undefined ? { actionId: proposal.actionId } : {}),
    title,
    summary,
    ...(proposal?.kind !== undefined ? { actionKind: proposal.kind } : {}),
    intent,
    ...(priority !== undefined ? { priority } : {}),
    ...(subject !== undefined ? { subject } : {}),
    ...(target !== undefined ? { target } : {}),
    ...(recipient !== undefined ? { recipient } : {}),
    ...(isNonEmptyString(reasonTextValue)
      ? { reason: reasonTextValue.trim() }
      : {}),
    ...(origin !== undefined ? { origin } : {}),
    context,
    ...(lifecycle !== undefined ? { lifecycle } : {}),
    readiness,
    resolutionState: input.intentContext.status,
    warnings: input.warnings,
    presentationState: input.presentationState,
    density: input.density,
    ...(consequence !== undefined ? { consequence } : {}),
    reviewSemantics,
    identity: runtimeExecutiveActionPresentationPreviewIdentity,
    version: runtimeExecutiveActionPresentationPreviewVersion,
  });
}

function assessPreviewStatus(input: {
  readonly intentContext: RuntimeExecutiveActionIntentContextResult;
  readonly readiness: RuntimeExecutiveActionReadinessPresentation;
  readonly warnings: ReadonlyArray<RuntimeExecutiveActionPreviewWarning>;
}): RuntimeExecutiveActionPreviewStatus {
  if (input.intentContext.status === "rejected") {
    return "rejected";
  }
  if (input.readiness.status === "blocked") {
    return "blocked";
  }
  if (
    input.readiness.status === "incomplete" ||
    input.warnings.some(
      (entry) =>
        entry.severity === "warning" || entry.severity === "caution",
    )
  ) {
    return "partial";
  }
  return "ready";
}

/**
 * Resolve an executive-facing action preview from an Intent & Context result.
 * Pure and deterministic. Never confirms, dispatches, or renders UI.
 */
export function resolveRuntimeExecutiveActionPreview(
  request: RuntimeExecutiveActionPreviewRequest,
): RuntimeExecutiveActionPreviewResult {
  const intentContext = request.intentContext;

  if (
    intentContext === undefined ||
    intentContext.identity !== runtimeExecutiveActionIntentContextIdentity
  ) {
    return Object.freeze({
      status: "rejected",
      warnings: Object.freeze([]),
      issues: Object.freeze([
        Object.freeze({
          code: "invalid-intent-context",
          message: "preview requires a valid REX-5:3 intent/context result",
        }),
      ]),
      identity: runtimeExecutiveActionPresentationPreviewIdentity,
      version: runtimeExecutiveActionPresentationPreviewVersion,
    });
  }

  if (intentContext.status === "rejected") {
    return Object.freeze({
      status: "rejected",
      warnings: Object.freeze([]),
      issues: freezeArray(
        intentContext.issues.map((entry) =>
          Object.freeze({ code: entry.code, message: entry.message }),
        ),
      ),
      identity: runtimeExecutiveActionPresentationPreviewIdentity,
      version: runtimeExecutiveActionPresentationPreviewVersion,
    });
  }

  const warnings = buildRuntimeExecutiveActionPreviewWarnings({ intentContext });
  const presentationState = resolveRuntimeExecutiveActionPresentationState({
    intentContext,
    requestedPresentationState: request.requestedPresentationState,
    warnings,
  });
  const density = resolveRuntimeExecutiveActionPresentationDensity({
    presentationState,
    intentContext,
    warnings,
    requestedDensity: request.requestedDensity,
    preferExpandedOnWarnings: request.preferExpandedOnWarnings,
  });

  const presentation = buildPresentation({
    intentContext,
    presentationState,
    density,
    warnings,
  });

  const sections = buildSections({ presentationState, presentation });
  const preview = Object.freeze({
    title: presentation.title,
    summary: presentation.summary,
    presentationState,
    density,
    sections,
    warnings,
    readiness: presentation.readiness,
    ...(presentation.consequence !== undefined
      ? { consequence: presentation.consequence }
      : {}),
    presentation,
  });

  const status = assessPreviewStatus({
    intentContext,
    readiness: presentation.readiness,
    warnings,
  });

  return Object.freeze({
    status,
    preview,
    presentation,
    warnings,
    issues: Object.freeze([]),
    identity: runtimeExecutiveActionPresentationPreviewIdentity,
    version: runtimeExecutiveActionPresentationPreviewVersion,
  });
}

// ─── Identity / registry getters ────────────────────────────────────────────

export function getRuntimeExecutiveActionPresentationPreviewIdentity():
  typeof runtimeExecutiveActionPresentationPreviewCanonicalIdentity {
  return runtimeExecutiveActionPresentationPreviewCanonicalIdentity;
}

export function getRuntimeExecutiveActionPresentationPreviewGuarantees():
  typeof RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES {
  return RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES;
}

export function getRuntimeExecutiveActionPresentationPreviewRegistry():
  typeof runtimeExecutiveActionPresentationPreviewRegistry {
  return runtimeExecutiveActionPresentationPreviewRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveActionPresentationPreviewApiNames = Object.freeze([
  "getRuntimeExecutiveActionPresentationPreviewIdentity",
  "getRuntimeExecutiveActionPresentationPreviewRegistry",
  "getRuntimeExecutiveActionPresentationPreviewGuarantees",
  "isRuntimeExecutiveActionPresentationState",
  "isRuntimeExecutiveActionPresentationDensity",
  "isRuntimeExecutiveActionPreviewSectionKind",
  "isRuntimeExecutiveActionPreviewWarningCode",
  "isRuntimeExecutiveActionPreviewWarningSeverity",
  "isRuntimeExecutiveActionPreviewStatus",
  "resolveRuntimeExecutiveActionPresentationTitle",
  "resolveRuntimeExecutiveActionPresentationSummary",
  "resolveRuntimeExecutiveActionConsequencePreview",
  "buildRuntimeExecutiveActionPreviewWarnings",
  "resolveRuntimeExecutiveActionPresentationState",
  "resolveRuntimeExecutiveActionPresentationDensity",
  "resolveRuntimeExecutiveActionPreview",
  "verifyRuntimeExecutiveActionPresentationPreview",
] as const);

export const RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveActionPresentationState",
    "RuntimeExecutiveActionPresentationDensity",
    "RuntimeExecutiveActionPreviewSectionKind",
    "RuntimeExecutiveActionPreviewSectionVisibility",
    "RuntimeExecutiveActionPreviewImportance",
    "RuntimeExecutiveActionPreviewWarningSeverity",
    "RuntimeExecutiveActionPreviewWarningCode",
    "RuntimeExecutiveActionPreviewStatus",
    "RuntimeExecutiveActionReadinessPresentationStatus",
    "RuntimeExecutiveActionPriorityPresentationValue",
    "RuntimeExecutiveActionLifecyclePresentationValue",
    "RuntimeExecutiveActionPresentationPreviewGuarantee",
    "RuntimeExecutiveActionPresentationPreviewRegistrySection",
    "RuntimeExecutiveActionTitleRule",
    "RuntimeExecutiveActionConsequenceRule",
    "RuntimeExecutiveActionSubjectPresentation",
    "RuntimeExecutiveActionTargetPresentation",
    "RuntimeExecutiveActionRecipientPresentation",
    "RuntimeExecutiveActionIntentPresentation",
    "RuntimeExecutiveActionPriorityPresentation",
    "RuntimeExecutiveActionOriginPresentation",
    "RuntimeExecutiveActionContextPresentation",
    "RuntimeExecutiveActionReadinessPresentation",
    "RuntimeExecutiveActionLifecyclePresentation",
    "RuntimeExecutiveActionPreviewWarning",
    "RuntimeExecutiveActionConsequencePreview",
    "RuntimeExecutiveActionPreviewSection",
    "RuntimeExecutiveActionPresentation",
    "RuntimeExecutiveActionPreview",
    "RuntimeExecutiveActionPreviewRequest",
    "RuntimeExecutiveActionPreviewResult",
    "RuntimeExecutiveActionPresentationPreviewVerification",
  ] as const);

export const runtimeExecutiveActionPresentationPreviewRegistry = Object.freeze({
  identity: runtimeExecutiveActionPresentationPreviewIdentity,
  version: runtimeExecutiveActionPresentationPreviewVersion,
  namespace: runtimeExecutiveActionPresentationPreviewNamespace,
  layer: runtimeExecutiveActionPresentationPreviewLayer,
  capability: runtimeExecutiveActionPresentationPreviewCapability,
  phase: runtimeExecutiveActionPresentationPreviewPhase,
  status: runtimeExecutiveActionPresentationPreviewStatus,
  architecturalRole:
    runtimeExecutiveActionPresentationPreviewArchitecturalRole,
  dependencyIdentity:
    runtimeExecutiveActionPresentationPreviewDependencyIdentity,
  dependencyPath: runtimeExecutiveActionPresentationPreviewDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionPresentationPreviewSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_REGISTRY_SECTIONS.length,
  presentationStates: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  presentationStateCount: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES.length,
  presentationDensities: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES,
  presentationDensityCount:
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES.length,
  previewSectionKinds: RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS,
  previewSectionKindCount:
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS.length,
  previewSectionOrder: RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER,
  sectionVisibility: RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_VISIBILITY,
  sectionVisibilityCount:
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_VISIBILITY.length,
  sectionImportance: RUNTIME_EXECUTIVE_ACTION_PREVIEW_IMPORTANCE,
  sectionImportanceCount: RUNTIME_EXECUTIVE_ACTION_PREVIEW_IMPORTANCE.length,
  warningSeverities: RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES,
  warningSeverityCount:
    RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES.length,
  warningCodes: RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES,
  warningCodeCount: RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES.length,
  previewStatuses: RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  previewStatusCount: RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES.length,
  titleRules: RUNTIME_EXECUTIVE_ACTION_TITLE_RULES,
  titleRuleCount: RUNTIME_EXECUTIVE_ACTION_TITLE_RULES.length,
  consequenceRules: RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES,
  consequenceRuleCount: RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES.length,
  guarantees: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES,
  guaranteeCount: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveActionPresentationPreviewApiNames,
  publicApiCount: runtimeExecutiveActionPresentationPreviewApiNames.length,
});

export const runtimeExecutiveActionPresentationPreview = Object.freeze({
  phase: "PresentationPreview" as const,
  name: "RuntimeExecutiveActionPresentationPreview" as const,
  identity: runtimeExecutiveActionPresentationPreviewIdentity,
  version: runtimeExecutiveActionPresentationPreviewVersion,
  namespace: runtimeExecutiveActionPresentationPreviewNamespace,
  layer: runtimeExecutiveActionPresentationPreviewLayer,
  capability: runtimeExecutiveActionPresentationPreviewCapability,
  architecturalRole:
    runtimeExecutiveActionPresentationPreviewArchitecturalRole,
  role: "PresentationPreview" as const,
  status: runtimeExecutiveActionPresentationPreviewStatus,
  upstreamDependency:
    runtimeExecutiveActionPresentationPreviewDependencyIdentity,
  dependencyPath: runtimeExecutiveActionPresentationPreviewDependencyPath,
  supportedImportPath:
    runtimeExecutiveActionPresentationPreviewSupportedImportPath,
  deterministic: runtimeExecutiveActionPresentationPreviewDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  intentContextAligned: true as const,
  rendererIndependent: true as const,
  presentationStateAware: true as const,
  densityAware: true as const,
  warningAware: true as const,
  ambiguityPreserving: true as const,
  contextPreserving: true as const,
  recipientResolutionSafe: true as const,
  lifecycleAware: true as const,
  providerIndependent: true as const,
  transportIndependent: true as const,
  aiIndependent: true as const,
  dispatchFree: true as const,
  confirmationBehaviorAbsent: true as const,
  principle: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_BOUNDARY,
  presentationStates: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  presentationDensities: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES,
  previewSectionKinds: RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS,
  previewSectionOrder: RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER,
  warningCodes: RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES,
  previewStatuses: RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES,
  titleRules: RUNTIME_EXECUTIVE_ACTION_TITLE_RULES,
  consequenceRules: RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES,
  guarantees: RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES,
  publicTypeNames:
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveActionPresentationPreviewApiNames,
  registry: runtimeExecutiveActionPresentationPreviewRegistry,
  intentContextBoundary: "REX-5:3-intent-context-only" as const,
  architecturalStatus:
    "REX-5:4 Runtime Executive Action Presentation & Preview — PresentationPreviewReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveActionPresentationPreviewVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveActionPresentationPreviewIdentity;
  readonly version: typeof runtimeExecutiveActionPresentationPreviewVersion;
  readonly namespace: typeof runtimeExecutiveActionPresentationPreviewNamespace;
  readonly phase: typeof runtimeExecutiveActionPresentationPreviewPhase;
  readonly architecturalRole: typeof runtimeExecutiveActionPresentationPreviewArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeExecutiveActionPresentationPreviewDependencyIdentity;
  readonly presentationStateCount: number;
  readonly presentationDensityCount: number;
  readonly previewSectionKindCount: number;
  readonly warningCodeCount: number;
  readonly previewStatusCount: number;
  readonly titleRuleCount: number;
  readonly consequenceRuleCount: number;
  readonly guaranteeCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly intentContextBoundaryIntact: boolean;
  readonly ambiguityPreserving: boolean;
  readonly recipientResolutionSafe: boolean;
  readonly contextPreserving: boolean;
  readonly lifecycleAware: boolean;
  readonly rendererIndependent: boolean;
  readonly aiIndependent: boolean;
  readonly providerIndependent: boolean;
  readonly transportIndependent: boolean;
  readonly dispatchFree: boolean;
  readonly confirmationBehaviorAbsent: boolean;
  readonly upstreamIntentContextOk: boolean;
}

export function verifyRuntimeExecutiveActionPresentationPreview():
  RuntimeExecutiveActionPresentationPreviewVerification {
  const module = runtimeExecutiveActionPresentationPreview;
  const registry = runtimeExecutiveActionPresentationPreviewRegistry;
  const upstream = verifyRuntimeExecutiveActionIntentContext();

  const identityOk =
    module.identity ===
      "REX-5:4/RuntimeExecutiveActionPresentationPreview" &&
    module.version === "5.4.0" &&
    module.namespace ===
      "nexora.rex.action-experience.presentation-preview" &&
    module.phase === "PresentationPreview" &&
    module.architecturalRole ===
      "ExecutiveActionPresentationPreviewRuntime" &&
    module.upstreamDependency ===
      "REX-5:3/RuntimeExecutiveActionIntentContext" &&
    module.upstreamDependency ===
      runtimeExecutiveActionIntentContextIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveActionIntentContext" &&
    module.intentContextBoundary === "REX-5:3-intent-context-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES], [
      "compact",
      "standard",
      "expanded",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER], [
      "action",
      "subject",
      "target",
      "recipient",
      "intent",
      "priority",
      "reason",
      "origin",
      "context",
      "consequence",
      "readiness",
      "warnings",
      "lifecycle",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_SEVERITIES], [
      "info",
      "caution",
      "warning",
      "blocking",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES], [
      "recipient-unresolved",
      "intent-ambiguous",
      "intent-unresolved",
      "target-missing",
      "context-conflict",
      "reason-missing",
      "lifecycle-invalid",
      "action-incomplete",
      "critical-priority",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES], [
      "ready",
      "partial",
      "blocked",
      "rejected",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES],
      [
        "deterministic",
        "immutable",
        "intent-context-aligned",
        "renderer-independent",
        "presentation-state-aware",
        "density-aware",
        "warning-aware",
        "ambiguity-preserving",
        "context-preserving",
        "recipient-resolution-safe",
        "lifecycle-aware",
        "provider-independent",
        "transport-independent",
        "side-effect-free",
        "dispatch-free",
      ],
    );

  const sample = resolveRuntimeExecutiveActionIntentContext({
    kind: "request",
    intent: { kind: "request-information" },
    subject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
    target: {
      kind: "team",
      id: "team.engineering",
      label: "Engineering Team",
    },
    recipient: {
      kind: "role",
      id: "role.engineering-lead",
      label: "Engineering Lead",
    },
    title: "Request Update",
    reason: "Schedule risk increasing",
    origin: { kind: "insight", referenceId: "insight.schedule-risk" },
    context: {
      workspaceId: "workspace.operations",
      insightId: "insight.schedule-risk",
      focusedSubjectId: "object.project-alpha",
    },
    selectedSubject: {
      kind: "object",
      id: "object.project-alpha",
      label: "Project Alpha",
    },
  });

  const withPriority = Object.freeze({
    ...sample,
    proposal: sample.proposal
      ? Object.freeze({
          ...sample.proposal,
          priority: "high" as const,
          lifecycle: "draft" as const,
        })
      : sample.proposal,
  }) as RuntimeExecutiveActionIntentContextResult;

  const reportPreview = resolveRuntimeExecutiveActionPreview({
    intentContext: withPriority,
    requestedPresentationState: "report",
  });

  const ambiguousPreview = resolveRuntimeExecutiveActionPreview({
    intentContext: resolveRuntimeExecutiveActionIntentContext({
      kind: "send",
      subject: {
        kind: "object",
        id: "object.project-alpha",
        label: "Project Alpha",
      },
      recipient: { kind: "unresolved", label: "ops manager" },
      title: "Send",
    }),
    requestedPresentationState: "operation",
  });

  const titleOk =
    resolveRuntimeExecutiveActionPresentationTitle({
      actionKind: "request",
      intentKind: "request-information",
    }) === "Request Update" &&
    resolveRuntimeExecutiveActionPresentationTitle({
      actionKind: "assign",
      intentKind: "delegate",
    }) === "Assign Responsibility";

  const ambiguityOk =
    ambiguousPreview.presentation?.intent.ambiguous === true &&
    ambiguousPreview.presentation?.recipient?.unresolved === true &&
    ambiguousPreview.warnings.some(
      (entry) => entry.code === "recipient-unresolved",
    ) &&
    ambiguousPreview.warnings.some(
      (entry) => entry.code === "intent-ambiguous",
    );

  const sectionOrderOk =
    reportPreview.preview !== undefined &&
    reportPreview.preview.sections.every((entry, index, all) =>
      index === 0 ? true : entry.order >= all[index - 1]!.order,
    );

  const countsOk =
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES.length &&
    registry.presentationDensityCount ===
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES.length &&
    registry.previewSectionKindCount ===
      RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS.length &&
    registry.warningCodeCount ===
      RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES.length &&
    registry.titleRuleCount === RUNTIME_EXECUTIVE_ACTION_TITLE_RULES.length &&
    registry.consequenceRuleCount ===
      RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES.length &&
    registry.guaranteeCount ===
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES.length &&
    registry.publicApiCount ===
      runtimeExecutiveActionPresentationPreviewApiNames.length &&
    unique([...RUNTIME_EXECUTIVE_ACTION_TITLE_RULES.map((rule) => rule.id)]);

  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_ORDER) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_TITLE_RULES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES) &&
    Object.isFrozen(
      runtimeExecutiveActionPresentationPreviewCanonicalIdentity,
    ) &&
    Object.isFrozen(runtimeExecutiveActionPresentationPreviewRegistry) &&
    Object.isFrozen(runtimeExecutiveActionPresentationPreview);

  const ok =
    identityOk &&
    vocabOk &&
    countsOk &&
    frozen &&
    titleOk &&
    ambiguityOk &&
    sectionOrderOk &&
    reportPreview.status !== "rejected" &&
    module.ambiguityPreserving === true &&
    module.recipientResolutionSafe === true &&
    module.contextPreserving === true &&
    module.lifecycleAware === true &&
    module.rendererIndependent === true &&
    module.aiIndependent === true &&
    module.providerIndependent === true &&
    module.transportIndependent === true &&
    module.dispatchFree === true &&
    module.confirmationBehaviorAbsent === true &&
    upstream.ok === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveActionPresentationPreviewIdentity,
    version: runtimeExecutiveActionPresentationPreviewVersion,
    namespace: runtimeExecutiveActionPresentationPreviewNamespace,
    phase: runtimeExecutiveActionPresentationPreviewPhase,
    architecturalRole:
      runtimeExecutiveActionPresentationPreviewArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveActionPresentationPreviewDependencyIdentity,
    presentationStateCount:
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES.length,
    presentationDensityCount:
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_DENSITIES.length,
    previewSectionKindCount:
      RUNTIME_EXECUTIVE_ACTION_PREVIEW_SECTION_KINDS.length,
    warningCodeCount: RUNTIME_EXECUTIVE_ACTION_PREVIEW_WARNING_CODES.length,
    previewStatusCount: RUNTIME_EXECUTIVE_ACTION_PREVIEW_STATUSES.length,
    titleRuleCount: RUNTIME_EXECUTIVE_ACTION_TITLE_RULES.length,
    consequenceRuleCount: RUNTIME_EXECUTIVE_ACTION_CONSEQUENCE_RULES.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_GUARANTEES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ACTION_PRESENTATION_PREVIEW_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveActionPresentationPreviewApiNames.length,
    frozen,
    intentContextBoundaryIntact:
      module.intentContextBoundary === "REX-5:3-intent-context-only",
    ambiguityPreserving: ambiguityOk,
    recipientResolutionSafe:
      ambiguousPreview.presentation?.recipient?.unresolved === true,
    contextPreserving: module.contextPreserving === true,
    lifecycleAware: module.lifecycleAware === true,
    rendererIndependent: module.rendererIndependent === true,
    aiIndependent: module.aiIndependent === true,
    providerIndependent: module.providerIndependent === true,
    transportIndependent: module.transportIndependent === true,
    dispatchFree: module.dispatchFree === true,
    confirmationBehaviorAbsent: module.confirmationBehaviorAbsent === true,
    upstreamIntentContextOk: upstream.ok === true,
  });
}
