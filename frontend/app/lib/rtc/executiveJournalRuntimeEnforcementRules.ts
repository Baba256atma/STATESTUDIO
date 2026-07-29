/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Rules.
 *
 * Pure deterministic translation from RTC-2:5 decisions into enforcement plans.
 * Never executes. Never mutates inputs. Fail closed.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

import { ExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import {
  ExecutiveJournalRuntimeEnforcementId,
  ExecutiveJournalRuntimeEnforcementVersion,
} from "./executiveJournalRuntimeEnforcementIdentity.ts";
import { ExecutiveJournalRuntimeEnforcementStepKinds } from "./executiveJournalRuntimeEnforcementLifecycle.ts";
import type { ExecutiveJournalRuntimePolicyObligationKind } from "./executiveJournalRuntimePolicyTypes.ts";
import type {
  ExecutiveJournalRuntimeEnforcementRequest,
  ExecutiveJournalRuntimeEnforcementResult,
  ExecutiveJournalRuntimeEnforcementStep,
  ExecutiveJournalRuntimeEnforcementStepKind,
} from "./executiveJournalRuntimeEnforcementTypes.ts";

export interface ExecutiveJournalRuntimeEnforcementRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly priority: number;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  priority: number,
  ruleKey: string,
  description: string,
): ExecutiveJournalRuntimeEnforcementRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-2:6/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    priority,
    description,
    evaluatesOnly: true as const,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalRuntimeEnforcementRules = Object.freeze([
  rule(1, "DenyBlocks", "Deny decisions always block with zero effect steps."),
  rule(2, "UnknownDecisionBlocks", "Unknown decision kinds block."),
  rule(3, "InvalidValidationBlocks", "Invalid or missing validation blocks."),
  rule(4, "AuthorityGate", "Missing, revoked, expired, or out-of-scope authority blocks."),
  rule(5, "AiBoundaryBlocks", "AI cannot receive enforceable plans for prohibited operations."),
  rule(6, "PrivateReflectionBlocks", "Private reflection cannot enter shared surfaces."),
  rule(7, "LifecycleGate", "Invalid lifecycle transitions block."),
  rule(8, "UnsupportedObligationBlocks", "Unmapped obligations block."),
  rule(9, "OpenIssueDefaultBlocks", "Plans requiring unresolved open-issue defaults block."),
  rule(10, "ConfirmationBinding", "Confirmation evidence must bind exactly or block."),
  rule(11, "AwaitConfirmation", "RequireConfirmation awaits confirmation without effect steps."),
  rule(12, "AllowEnforceable", "Allow with satisfied obligations becomes Enforceable."),
] as const);

/**
 * Immutable obligation-to-step mapping for every RTC-2:5 obligation kind.
 */
export const ExecutiveJournalRuntimeObligationStepMapping = Object.freeze({
  RequireHumanConfirmation: Object.freeze([
    "VerifyConfirmation",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireAuthorityEvidence: Object.freeze([
    "VerifyAuthority",
    "VerifyDelegation",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireEvidenceReference: Object.freeze([
    "VerifyEvidence",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequirePurposeBinding: Object.freeze([
    "VerifyPurpose",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireFieldFiltering: Object.freeze([
    "ApplyFieldFilter",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireRedaction: Object.freeze([
    "ApplyRedaction",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireDisclosureEvidence: Object.freeze([
    "PrepareDisclosureEvidence",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireExportEvidence: Object.freeze([
    "PrepareExportEvidence",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireReview: Object.freeze([
    "PrepareBreakGlassReview",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireExpiry: Object.freeze([
    "VerifyConfirmation",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireBreakGlassReview: Object.freeze([
    "PrepareBreakGlassReview",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
  RequireDispositionEvidence: Object.freeze([
    "PrepareDispositionEvidence",
  ] as const satisfies readonly ExecutiveJournalRuntimeEnforcementStepKind[]),
} as const);

const STEP_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveJournalRuntimeEnforcementStepKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveJournalRuntimeEnforcementStepKind, number>>,
);

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "" && value !== "Unknown";

const makeStep = (
  kind: ExecutiveJournalRuntimeEnforcementStepKind,
  obligationsSatisfied: readonly ExecutiveJournalRuntimePolicyObligationKind[],
  effectBearing: boolean,
  description: string,
): ExecutiveJournalRuntimeEnforcementStep =>
  Object.freeze({
    stepId: `RTC-2:6/Step/${kind}`,
    kind,
    order: STEP_ORDER[kind],
    description,
    effectBearing,
    obligationsSatisfied: Object.freeze([...obligationsSatisfied]),
    metadataOnly: true as const,
    immutable: true as const,
    executes: false as const,
  });

const orderSteps = (
  steps: readonly ExecutiveJournalRuntimeEnforcementStep[],
): readonly ExecutiveJournalRuntimeEnforcementStep[] =>
  Object.freeze([...steps].sort((left, right) => left.order - right.order));

const planIdFor = (request: ExecutiveJournalRuntimeEnforcementRequest): string =>
  [
    "RTC-2:6/Plan",
    request.requestId,
    request.policyDecision.decisionCode,
    request.policyDecision.policyVersion,
    request.operation,
    request.targetEntityId,
  ].join("/");

const resultingStateFor = (
  operation: string,
  current: string,
): string => {
  switch (operation) {
    case "Confirm":
    case "Accept":
      return "Accepted";
    case "CloseCommitment":
      return "Closed";
    case "Dispose":
      return "Disposed";
    case "Supersede":
      return "Superseded";
    case "Dispute":
      return "Disputed";
    case "ResolveDispute":
      return "Accepted";
    case "PromotePrivateReflection":
      return "Accepted";
    default:
      return current;
  }
};

const appendStepFor = (
  operation: string,
): ExecutiveJournalRuntimeEnforcementStepKind => {
  switch (operation) {
    case "Correct":
      return "PrepareCorrectionAppend";
    case "Dispute":
    case "ResolveDispute":
      return "PrepareDisputeAppend";
    case "Supersede":
      return "PrepareSupersessionAppend";
    default:
      return "PrepareEventAppend";
  }
};

const blocked = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
  reasonCode: string,
  reason: string,
  unsupportedObligation:
    | ExecutiveJournalRuntimePolicyObligationKind
    | null = null,
): ExecutiveJournalRuntimeEnforcementResult =>
  Object.freeze({
    kind: "Blocked" as const,
    reasonCode,
    reason,
    policyDecisionCode: request.policyDecision.decisionCode,
    requestId: request.requestId,
    matchingRuleIds: Object.freeze([...request.policyDecision.matchingRuleIds]),
    obligations: Object.freeze(
      request.policyDecision.obligations.map((item) => item.kind),
    ),
    steps: Object.freeze([]) as readonly [],
    plan: null,
    unsupportedObligation,
    revealsProtectedMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    executes: false as const,
  });

const mapObligations = (
  obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[],
): {
  readonly steps: readonly ExecutiveJournalRuntimeEnforcementStep[];
  readonly unsupported: ExecutiveJournalRuntimePolicyObligationKind | null;
} => {
  const byKind = new Map<
    ExecutiveJournalRuntimeEnforcementStepKind,
    {
      obligations: ExecutiveJournalRuntimePolicyObligationKind[];
      description: string;
    }
  >();
  for (const obligation of obligations) {
    const mapped = ExecutiveJournalRuntimeObligationStepMapping[obligation];
    if (!mapped) {
      return Object.freeze({
        steps: Object.freeze([]),
        unsupported: obligation,
      });
    }
    for (const kind of mapped) {
      const existing = byKind.get(kind);
      if (existing) {
        if (!existing.obligations.includes(obligation)) {
          existing.obligations.push(obligation);
        }
      } else {
        byKind.set(kind, {
          obligations: [obligation],
          description: `Satisfy obligation ${obligation} via ${kind}.`,
        });
      }
    }
  }
  const steps = [...byKind.entries()].map(([kind, value]) =>
    makeStep(
      kind,
      Object.freeze([...value.obligations]),
      false,
      value.description,
    )
  );
  return Object.freeze({
    steps: orderSteps(steps),
    unsupported: null,
  });
};

const confirmationValid = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
): boolean => {
  const evidence = request.confirmationEvidence;
  const decision = request.policyDecision;
  if (!evidence) {
    return false;
  }
  return evidence.actorId === request.actorId
    && evidence.requestId === request.requestId
    && evidence.policyDecisionCode === decision.decisionCode
    && evidence.policyVersion === decision.policyVersion
    && evidence.targetId === request.targetEntityId
    && evidence.operation === request.operation
    && evidence.proposedEffect === request.proposedEffect
    && evidence.authorityRef === (request.authorityRef ?? "")
    && evidence.singleUse === true
    && evidence.expired === false
    && isPresent(evidence.expiryMetadata)
    && isPresent(evidence.confirmationId);
};

const lifecycleBlocked = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
): string | null => {
  const { operation, lifecycleState } = request;
  if (
    (operation === "Confirm" || operation === "Accept")
    && lifecycleState !== "Proposed"
    && lifecycleState !== "Accepted"
  ) {
    return "Decision confirmation requires an allowed proposed/accepted lifecycle state.";
  }
  if (operation === "CloseCommitment" && lifecycleState === "Closed") {
    return "A closed commitment cannot be closed again.";
  }
  if (lifecycleState === "Disposed" && operation !== "Read") {
    return "A disposed record cannot return to active state through this operation.";
  }
  if (operation === "Correct" && !isPresent(request.affectedRef)) {
    return "Correction must reference an existing accepted state.";
  }
  if (operation === "Supersede" && !isPresent(request.predecessorRef)) {
    return "Supersession must preserve the predecessor.";
  }
  if (
    operation === "ResolveDispute"
    && lifecycleState !== "Disputed"
  ) {
    return "Dispute resolution must reference an active dispute.";
  }
  if (
    operation === "PromotePrivateReflection"
    && request.recordCategory !== "PrivateReflection"
  ) {
    return "Promotion source must remain a private-reflection record.";
  }
  return null;
};

const baseVerifySteps = (
  obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[],
): readonly ExecutiveJournalRuntimeEnforcementStep[] => {
  const mapped = mapObligations(obligations);
  const common = Object.freeze([
    makeStep("VerifyValidation", [], false, "Verify upstream validation evidence."),
    makeStep("VerifyPolicyDecision", [], false, "Verify RTC-2:5 policy decision reference."),
    makeStep("VerifyActor", [], false, "Verify actor reference."),
    makeStep(
      "VerifyLifecyclePrecondition",
      [],
      false,
      "Verify lifecycle precondition.",
    ),
  ]);
  return orderSteps(Object.freeze([...common, ...mapped.steps]));
};

/**
 * Plan enforcement for one policy-bound request.
 * Pure. Deterministic. Never executes.
 */
export function planExecutiveJournalRuntimeEnforcement(
  request: ExecutiveJournalRuntimeEnforcementRequest,
): ExecutiveJournalRuntimeEnforcementResult {
  const decision = request.policyDecision;

  if (
    decision.policyId !== ExecutiveJournalRuntimePolicy.identity.id
    || decision.policyVersion !== ExecutiveJournalRuntimePolicy.identity.version
  ) {
    return blocked(request, "ENF-UNKNOWN-POLICY", "Unrecognized policy identity or version.");
  }

  if (
    decision.decision !== "Allow"
    && decision.decision !== "Deny"
    && decision.decision !== "RequireConfirmation"
  ) {
    return blocked(request, "ENF-UNKNOWN-DECISION", "Unknown policy decision kind.");
  }

  if (decision.decision === "Deny") {
    return blocked(
      request,
      "ENF-DENY",
      "Policy deny produces Blocked with zero executable effect steps.",
    );
  }

  if (
    request.validationOutcome !== "Valid"
    || decision.validationOutcome !== "Valid"
  ) {
    return blocked(
      request,
      "ENF-VALIDATION",
      "Invalid or missing validation reference blocks enforcement.",
    );
  }

  if (
    !isPresent(request.authorityRef)
    || request.authorityStatus === "Revoked"
    || request.authorityStatus === "Expired"
    || request.authorityStatus === "OutOfScope"
    || request.authorityStatus === "Unknown"
  ) {
    return blocked(
      request,
      "ENF-AUTHORITY",
      "Missing, revoked, expired, unknown, or out-of-scope authority blocks enforcement.",
    );
  }

  if (request.requiresUnresolvedOpenIssueDefault) {
    return blocked(
      request,
      "ENF-OPEN-ISSUE",
      "Plan requires an unresolved open-issue default and is blocked.",
    );
  }

  const aiBlockedOps = Object.freeze([
    "Confirm",
    "Accept",
    "CloseCommitment",
    "Disclose",
    "Export",
    "ApplyRetention",
    "Dispose",
    "BreakGlassAccess",
    "PromotePrivateReflection",
  ]);
  if (
    request.actorKind === "Ai"
    && (aiBlockedOps as readonly string[]).includes(request.operation)
  ) {
    return blocked(
      request,
      "ENF-AI",
      "AI cannot receive an enforceable plan for this operation.",
    );
  }
  if (
    request.actorKind === "Ai"
    && request.operation === "Propose"
    && request.targetEntityKind === "AuthorityReference"
  ) {
    return blocked(
      request,
      "ENF-AI-AUTHORITY",
      "AI cannot create or broaden authority.",
    );
  }

  if (request.recordCategory === "PrivateReflection") {
    if (
      request.operation === "Search"
      || request.operation === "Project"
      || request.operation === "Export"
      || request.operation === "Disclose"
    ) {
      return blocked(
        request,
        "ENF-PRIVATE",
        "Private reflection cannot enter shared search, projection, export, or automation.",
      );
    }
  }

  const lifecycleReason = lifecycleBlocked(request);
  if (lifecycleReason) {
    return blocked(request, "ENF-LIFECYCLE", lifecycleReason);
  }

  const obligationKinds = decision.obligations.map((item) => item.kind);
  const mapped = mapObligations(obligationKinds);
  if (mapped.unsupported) {
    return blocked(
      request,
      "ENF-UNSUPPORTED-OBLIGATION",
      "Unsupported obligation has no enforcement mapping.",
      mapped.unsupported,
    );
  }

  if (decision.decision === "RequireConfirmation") {
    if (!confirmationValid(request)) {
      if (request.confirmationEvidence) {
        return blocked(
          request,
          "ENF-CONFIRMATION-MISMATCH",
          "Confirmation evidence does not bind exactly to the request and policy decision.",
        );
      }
      const preparation = orderSteps(
        Object.freeze([
          makeStep(
            "VerifyPolicyDecision",
            [],
            false,
            "Prepare confirmation challenge from policy decision.",
          ),
          makeStep(
            "VerifyActor",
            [],
            false,
            "Bind confirming actor for challenge.",
          ),
        ]),
      );
      return Object.freeze({
        kind: "AwaitingConfirmation" as const,
        reasonCode: "ENF-AWAIT-CONFIRMATION",
        reason:
          "Policy requires human confirmation before any effect-bearing steps.",
        policyDecisionCode: decision.decisionCode,
        requestId: request.requestId,
        matchingRuleIds: Object.freeze([...decision.matchingRuleIds]),
        obligations: Object.freeze([...obligationKinds]),
        preparationSteps: preparation,
        steps: Object.freeze([]) as readonly [],
        plan: null,
        confirmationChallenge: Object.freeze({
          requestId: request.requestId,
          policyDecisionCode: decision.decisionCode,
          policyVersion: decision.policyVersion,
          targetId: request.targetEntityId,
          operation: request.operation,
          proposedEffect: request.proposedEffect,
          requiredAuthority: request.authorityRef ?? "authority_ref_required",
          metadataOnly: true as const,
          immutable: true as const,
        }),
        revealsProtectedMetadata: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministic: true as const,
        executes: false as const,
      });
    }
  }

  if (
    decision.decision === "Allow"
    || (
      decision.decision === "RequireConfirmation"
      && confirmationValid(request)
    )
  ) {
    if (
      decision.decision === "Allow"
      && decision.confirmation !== null
      && !confirmationValid(request)
    ) {
      return blocked(
        request,
        "ENF-CONFIRMATION-OUTSTANDING",
        "Allow decision still has outstanding confirmation requirements.",
      );
    }

    if (
      (
        request.operation === "Dispose"
        || request.operation === "ApplyRetention"
        || request.operation === "BreakGlassAccess"
        || request.operation === "PromotePrivateReflection"
      )
      && !confirmationValid(request)
    ) {
      if (request.confirmationEvidence) {
        return blocked(
          request,
          "ENF-CONFIRMATION-MISMATCH",
          "Confirmation evidence does not bind exactly for retention, disposition, break-glass, or promotion.",
        );
      }
      return Object.freeze({
        kind: "AwaitingConfirmation" as const,
        reasonCode: "ENF-AWAIT-CONFIRMATION",
        reason:
          "Retention, disposition, break-glass, and private promotion require human confirmation evidence.",
        policyDecisionCode: decision.decisionCode,
        requestId: request.requestId,
        matchingRuleIds: Object.freeze([...decision.matchingRuleIds]),
        obligations: Object.freeze([...obligationKinds]),
        preparationSteps: orderSteps(
          Object.freeze([
            makeStep(
              "VerifyPolicyDecision",
              [],
              false,
              "Prepare confirmation challenge from policy decision.",
            ),
            makeStep(
              "VerifyActor",
              [],
              false,
              "Bind confirming actor for challenge.",
            ),
          ]),
        ),
        steps: Object.freeze([]) as readonly [],
        plan: null,
        confirmationChallenge: Object.freeze({
          requestId: request.requestId,
          policyDecisionCode: decision.decisionCode,
          policyVersion: decision.policyVersion,
          targetId: request.targetEntityId,
          operation: request.operation,
          proposedEffect: request.proposedEffect,
          requiredAuthority: request.authorityRef ?? "authority_ref_required",
          metadataOnly: true as const,
          immutable: true as const,
        }),
        revealsProtectedMetadata: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministic: true as const,
        executes: false as const,
      });
    }

    if (
      (
        request.operation === "Dispose"
        || request.operation === "ApplyRetention"
        || request.operation === "BreakGlassAccess"
      )
      && request.actorKind !== "Human"
    ) {
      return blocked(
        request,
        "ENF-HUMAN-REQUIRED",
        "Retention, disposition, and break-glass plans require a human actor.",
      );
    }

    const effectKind = appendStepFor(request.operation);
    const effectSteps: ExecutiveJournalRuntimeEnforcementStep[] = [
      ...baseVerifySteps(obligationKinds),
    ];

    if (request.operation === "PromotePrivateReflection") {
      effectSteps.push(
        makeStep(
          "PrepareEventAppend",
          [],
          true,
          "Prepare a new shared event; preserve original private record unchanged.",
        ),
      );
    } else if (
      request.operation === "Correct"
      || request.operation === "Dispute"
      || request.operation === "ResolveDispute"
      || request.operation === "Supersede"
      || request.operation === "Confirm"
      || request.operation === "Accept"
      || request.operation === "CreateCommitment"
      || request.operation === "CloseCommitment"
      || request.operation === "Propose"
    ) {
      effectSteps.push(
        makeStep(
          effectKind,
          [],
          true,
          `Prepare append-only ${effectKind} for ${request.operation}.`,
        ),
      );
    }

    if (
      request.operation === "Read"
      || request.operation === "Search"
      || request.operation === "Project"
      || request.operation === "Disclose"
      || request.operation === "Export"
    ) {
      effectSteps.push(
        makeStep("ApplyFieldFilter", ["RequireFieldFiltering"], false, "Apply field filtering."),
        makeStep("ApplyRedaction", ["RequireRedaction"], false, "Apply redaction constraints."),
      );
      if (request.operation === "Project") {
        effectSteps.push(
          makeStep(
            "BindProjectionScope",
            [],
            false,
            "Bind projection scope without creating authoritative facts.",
          ),
        );
      }
      if (request.operation === "Disclose") {
        effectSteps.push(
          makeStep(
            "PrepareDisclosureEvidence",
            ["RequireDisclosureEvidence"],
            false,
            "Prepare disclosure evidence without payload leakage.",
          ),
        );
      }
      if (request.operation === "Export") {
        effectSteps.push(
          makeStep(
            "PrepareExportEvidence",
            ["RequireExportEvidence"],
            false,
            "Prepare export evidence without choosing export format.",
          ),
        );
      }
    }

    if (request.operation === "ApplyRetention") {
      effectSteps.push(
        makeStep(
          "PrepareRetentionEvidence",
          [],
          true,
          "Prepare retention governance-event append without choosing a retention period.",
        ),
      );
    }
    if (request.operation === "Dispose") {
      effectSteps.push(
        makeStep(
          "PrepareDispositionEvidence",
          ["RequireDispositionEvidence"],
          true,
          "Prepare disposition governance-event append.",
        ),
      );
    }
    if (request.operation === "BreakGlassAccess") {
      effectSteps.push(
        makeStep(
          "PrepareBreakGlassReview",
          ["RequireBreakGlassReview", "RequireReview"],
          false,
          "Prepare bounded break-glass review obligations.",
        ),
      );
    }

    effectSteps.push(
      makeStep(
        "SealEnforcementPlan",
        [],
        false,
        "Seal immutable enforcement plan.",
      ),
    );

    const steps = orderSteps(Object.freeze(effectSteps));
    const plan = Object.freeze({
      planId: planIdFor(request),
      policyDecisionCode: decision.decisionCode,
      policyVersion: decision.policyVersion,
      requestId: request.requestId,
      actorId: request.actorId,
      authorityRef: request.authorityRef as string,
      purpose: request.purpose,
      targetJournalId: request.targetJournalId,
      targetEntityId: request.targetEntityId,
      operation: request.operation,
      steps,
      requiredEvidence: Object.freeze([...request.evidenceRefs]),
      lifecyclePrecondition: request.lifecycleState,
      resultingLifecycleState: resultingStateFor(
        request.operation,
        request.lifecycleState,
      ),
      privacyCategory: request.recordCategory,
      classification: request.classification,
      failureBehavior: "FailClosed" as const,
      compensationMetadata:
        request.operation === "Supersede"
          ? `predecessor:${request.predecessorRef ?? "required"}`
          : request.operation === "Correct"
          ? `affected:${request.affectedRef ?? "required"}`
          : null,
      summary: [
        ExecutiveJournalRuntimeEnforcementId,
        ExecutiveJournalRuntimeEnforcementVersion,
        decision.decisionCode,
        request.operation,
        String(steps.length),
      ].join("|"),
      metadataOnly: true as const,
      immutable: true as const,
      executes: false as const,
    });

    return Object.freeze({
      kind: "Enforceable" as const,
      reasonCode: "ENF-ENFORCEABLE",
      reason: "Policy decision is enforceable as an immutable plan.",
      policyDecisionCode: decision.decisionCode,
      requestId: request.requestId,
      matchingRuleIds: Object.freeze([...decision.matchingRuleIds]),
      obligations: Object.freeze([...obligationKinds]),
      steps,
      plan,
      revealsProtectedMetadata: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      executes: false as const,
    });
  }

  return blocked(
    request,
    "ENF-DEFAULT",
    "No enforceable plan could be produced; fail closed.",
  );
}

export function isExecutiveJournalEnforcementBlocked(
  result: ExecutiveJournalRuntimeEnforcementResult,
): boolean {
  return result.kind === "Blocked";
}

export function isExecutiveJournalEnforcementAwaitingConfirmation(
  result: ExecutiveJournalRuntimeEnforcementResult,
): boolean {
  return result.kind === "AwaitingConfirmation";
}

export function isExecutiveJournalEnforcementEnforceable(
  result: ExecutiveJournalRuntimeEnforcementResult,
): boolean {
  return result.kind === "Enforceable";
}

/** Completeness check for obligation mapping coverage. */
export function validateExecutiveJournalObligationStepMapping(): boolean {
  const kinds = ExecutiveJournalRuntimePolicy.obligationKinds;
  return kinds.every(
    (kind) => ExecutiveJournalRuntimeObligationStepMapping[kind] !== undefined,
  );
}
