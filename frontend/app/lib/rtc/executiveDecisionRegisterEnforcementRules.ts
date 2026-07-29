/**
 * RTC-3:6 — Executive Decision Register Enforcement Rules.
 *
 * Pure deterministic translation from RTC-3:5 decisions into enforcement plans.
 * Never executes. Never mutates inputs. Fail closed.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

import { ExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import {
  ExecutiveDecisionRegisterEnforcementId,
  ExecutiveDecisionRegisterEnforcementVersion,
} from "./executiveDecisionRegisterEnforcementIdentity.ts";
import { ExecutiveDecisionRegisterEnforcementStepKinds } from "./executiveDecisionRegisterEnforcementLifecycle.ts";
import type { ExecutiveDecisionRegisterPolicyObligationKind } from "./executiveDecisionRegisterPolicyTypes.ts";
import type {
  ExecutiveDecisionRegisterEnforcementRequest,
  ExecutiveDecisionRegisterEnforcementResult,
  ExecutiveDecisionRegisterEnforcementStep,
  ExecutiveDecisionRegisterEnforcementStepKind,
} from "./executiveDecisionRegisterEnforcementTypes.ts";

export interface ExecutiveDecisionRegisterEnforcementRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly priority: number;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const CANONICAL_VALIDATION_REF =
  "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

const rule = (
  priority: number,
  ruleKey: string,
  description: string,
): ExecutiveDecisionRegisterEnforcementRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-3:6/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    priority,
    description,
    evaluatesOnly: true as const,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterEnforcementRules = Object.freeze([
  rule(1, "DenyBlocks", "Deny decisions always block with zero effect steps."),
  rule(2, "UnknownDecisionBlocks", "Unknown decision kinds block."),
  rule(3, "InvalidValidationBlocks", "Invalid or missing validation blocks."),
  rule(4, "AuthorityGate", "Missing, revoked, expired, incomplete, mismatched, or substituted authority blocks."),
  rule(5, "AiBoundaryBlocks", "AI cannot receive enforceable plans for prohibited operations."),
  rule(6, "PrivacyBoundaryBlocks", "Private reflection, missing classification, and privacy bypasses block."),
  rule(7, "LifecycleGate", "Invalid lifecycle transitions and in-place mutation block."),
  rule(8, "UnsupportedObligationBlocks", "Unmapped obligations block."),
  rule(9, "OpenIssueDefaultBlocks", "Plans requiring unresolved open-issue defaults block."),
  rule(10, "ConfirmationBinding", "Confirmation evidence must bind exactly or block."),
  rule(11, "AwaitConfirmation", "RequireConfirmation awaits confirmation without effect steps."),
  rule(12, "AllowEnforceable", "Allow with satisfied obligations becomes Enforceable."),
] as const);

/**
 * Immutable obligation-to-step mapping for every RTC-3:5 obligation kind.
 */
export const ExecutiveDecisionRegisterObligationStepMapping = Object.freeze({
  RequireHumanConfirmation: Object.freeze([
    "VerifyConfirmation",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireAuthorityEvidence: Object.freeze([
    "VerifyAuthority",
    "VerifyEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequirePurposeBinding: Object.freeze([
    "VerifyPurpose",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireEvidenceReference: Object.freeze([
    "VerifyEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireAppendOnlyEvent: Object.freeze([
    "PrepareProposalEvent",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireProvenance: Object.freeze([
    "VerifyEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireFieldFiltering: Object.freeze([
    "ApplyFieldFilter",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireRedaction: Object.freeze([
    "ApplyRedaction",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireDisclosureEvidence: Object.freeze([
    "PrepareDisclosureEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireExportEvidence: Object.freeze([
    "PrepareExportEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireRetentionEvidence: Object.freeze([
    "PrepareRetentionEvidence",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireDispositionEvidence: Object.freeze([
    "PrepareDispositionEvent",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireReview: Object.freeze([
    "PrepareBreakGlassReview",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireExpiry: Object.freeze([
    "VerifyConfirmation",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
  RequireBreakGlassReview: Object.freeze([
    "PrepareBreakGlassReview",
  ] as const satisfies readonly ExecutiveDecisionRegisterEnforcementStepKind[]),
} as const);

const STEP_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionRegisterEnforcementStepKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveDecisionRegisterEnforcementStepKind, number>>,
);

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "" && value !== "Unknown";

const sameStringSet = (
  left: readonly string[],
  right: readonly string[],
): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

const makeStep = (
  kind: ExecutiveDecisionRegisterEnforcementStepKind,
  obligationsSatisfied: readonly ExecutiveDecisionRegisterPolicyObligationKind[],
  effectBearing: boolean,
  description: string,
): ExecutiveDecisionRegisterEnforcementStep =>
  Object.freeze({
    stepId: `RTC-3:6/Step/${kind}`,
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
  steps: readonly ExecutiveDecisionRegisterEnforcementStep[],
): readonly ExecutiveDecisionRegisterEnforcementStep[] =>
  Object.freeze([...steps].sort((left, right) => left.order - right.order));

const planIdFor = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
): string =>
  [
    "RTC-3:6/Plan",
    request.requestId,
    request.policyDecision.decisionCode,
    request.policyDecision.policyVersion,
    request.operation,
    request.targetEntityId,
  ].join("/");

const appendStepFor = (
  operation: string,
): ExecutiveDecisionRegisterEnforcementStepKind => {
  switch (operation) {
    case "ProposeDecision":
      return "PrepareProposalEvent";
    case "ConfirmDecision":
      return "PrepareConfirmationEvent";
    case "MakeDecisionEffective":
      return "PrepareEffectiveDecisionEvent";
    case "CorrectDecision":
      return "PrepareCorrectionEvent";
    case "OpenDispute":
      return "PrepareDisputeEvent";
    case "ResolveDispute":
      return "PrepareDisputeResolutionEvent";
    case "SupersedeDecision":
      return "PrepareSupersessionEvent";
    case "ReferenceOutcome":
      return "PrepareOutcomeReferenceEvent";
    case "CloseDecision":
      return "PrepareClosureEvent";
    case "DisposeDecision":
      return "PrepareDispositionEvent";
    default:
      return "PrepareProposalEvent";
  }
};

const expectedAppendOnlyEffect = (operation: string): string =>
  `append-only:${appendStepFor(operation)}`;

const blocked = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
  reasonCode: string,
  reason: string,
  unsupportedObligation:
    | ExecutiveDecisionRegisterPolicyObligationKind
    | null = null,
): ExecutiveDecisionRegisterEnforcementResult =>
  Object.freeze({
    kind: "Blocked" as const,
    reasonCode,
    reason,
    policyDecisionCode: request.policyDecision.decisionCode,
    requestId: request.requestId,
    matchingRuleIds: Object.freeze([
      ...request.policyDecision.matchingRuleIds,
    ]),
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

const awaiting = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
  reason: string,
): ExecutiveDecisionRegisterEnforcementResult => {
  const decision = request.policyDecision;
  const obligationKinds = decision.obligations.map((item) => item.kind);
  return Object.freeze({
    kind: "AwaitingConfirmation" as const,
    reasonCode: "ENF-AWAIT-CONFIRMATION",
    reason,
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
          "Bind confirming human actor for challenge.",
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
};

const mapObligations = (
  obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[],
): {
  readonly steps: readonly ExecutiveDecisionRegisterEnforcementStep[];
  readonly unsupported: ExecutiveDecisionRegisterPolicyObligationKind | null;
  readonly mapping: Readonly<
    Record<string, readonly ExecutiveDecisionRegisterEnforcementStepKind[]>
  >;
} => {
  const byKind = new Map<
    ExecutiveDecisionRegisterEnforcementStepKind,
    {
      obligations: ExecutiveDecisionRegisterPolicyObligationKind[];
      description: string;
    }
  >();
  const mappingEntries: Array<
    readonly [string, readonly ExecutiveDecisionRegisterEnforcementStepKind[]]
  > = [];
  for (const obligation of obligations) {
    const mapped = ExecutiveDecisionRegisterObligationStepMapping[obligation];
    if (!mapped) {
      return Object.freeze({
        steps: Object.freeze([]),
        unsupported: obligation,
        mapping: Object.freeze({}),
      });
    }
    mappingEntries.push(Object.freeze([obligation, mapped]));
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
    mapping: Object.freeze(Object.fromEntries(mappingEntries)),
  });
};

const confirmationValid = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
): boolean => {
  const evidence = request.confirmationEvidence;
  const decision = request.policyDecision;
  if (!evidence) {
    return false;
  }
  const decisionObligationKinds = decision.obligations.map((item) => item.kind);
  return evidence.actorKind === "Human"
    && evidence.actorId === request.actorId
    && evidence.requestId === request.requestId
    && evidence.policyDecisionCode === decision.decisionCode
    && evidence.policyDecisionId === decision.policyId
    && evidence.policyVersion === decision.policyVersion
    && evidence.targetId === request.targetEntityId
    && evidence.operation === request.operation
    && evidence.proposedEffect === request.proposedEffect
    && evidence.authorityRef === (request.authorityRef ?? "")
    && sameStringSet(evidence.evidenceSet, request.evidenceRefs)
    && sameStringSet(evidence.obligationKinds, decisionObligationKinds)
    && evidence.singleUse === true
    && evidence.expired === false
    && isPresent(evidence.expiryMetadata)
    && isPresent(evidence.confirmationId);
};

const lifecycleBlocked = (
  request: ExecutiveDecisionRegisterEnforcementRequest,
): string | null => {
  const { operation, currentLifecycleState } = request;
  if (
    operation === "ConfirmDecision"
    && currentLifecycleState !== "Proposed"
  ) {
    return "Confirming a non-proposed decision is blocked.";
  }
  if (
    operation === "MakeDecisionEffective"
    && currentLifecycleState !== "Confirmed"
  ) {
    return "Making an unconfirmed decision effective is blocked.";
  }
  if (request.inPlaceMutation === true) {
    return "In-place mutation is blocked; append-only preparation is required.";
  }
  if (
    currentLifecycleState === "Disposed"
    && request.proposedLifecycleState === "Active"
  ) {
    return "Disposed-to-active reversal is blocked.";
  }
  if (
    operation === "ResolveDispute"
    && request.activeDisputePresent !== true
  ) {
    return "Resolving a nonexistent dispute is blocked.";
  }
  if (operation === "SupersedeDecision") {
    if (
      !isPresent(request.predecessorRef)
      || !isPresent(request.successorRef)
    ) {
      return "Supersession without predecessor/successor is blocked.";
    }
    if (request.predecessorRef === request.successorRef) {
      return "Self or circular supersession is blocked.";
    }
  }
  if (
    operation === "CloseDecision"
    && request.closureMetadataPresent !== true
  ) {
    return "Closing without required closure metadata is blocked.";
  }
  if (
    operation === "DisposeDecision"
    && request.dispositionGovernanceEvidencePresent !== true
  ) {
    return "Disposition without governance evidence is blocked.";
  }
  if (
    operation === "OpenDispute"
    && !isPresent(request.challengedDecisionRef)
  ) {
    return "Opening a dispute without a challenged reference is blocked.";
  }
  return null;
};

const baseVerifySteps = (
  obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[],
): readonly ExecutiveDecisionRegisterEnforcementStep[] => {
  const mapped = mapObligations(obligations);
  const common = Object.freeze([
    makeStep(
      "VerifyValidation",
      [],
      false,
      "Verify upstream validation evidence.",
    ),
    makeStep(
      "VerifyPolicyDecision",
      [],
      false,
      "Verify RTC-3:5 policy decision reference.",
    ),
    makeStep("VerifyActor", [], false, "Verify actor reference."),
    makeStep(
      "VerifyPrivacyBoundary",
      [],
      false,
      "Verify privacy category and classification boundaries.",
    ),
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
export function planExecutiveDecisionRegisterEnforcement(
  request: ExecutiveDecisionRegisterEnforcementRequest,
): ExecutiveDecisionRegisterEnforcementResult {
  const decision = request.policyDecision;

  if (
    decision.policyId !== ExecutiveDecisionRegisterPolicy.identity.id
    || decision.policyVersion
      !== ExecutiveDecisionRegisterPolicy.identity.version
  ) {
    return blocked(
      request,
      "ENF-UNKNOWN-POLICY",
      "Unrecognized policy identity or version.",
    );
  }

  if (
    decision.decision !== "Allow"
    && decision.decision !== "Deny"
    && decision.decision !== "RequireConfirmation"
  ) {
    return blocked(
      request,
      "ENF-UNKNOWN-DECISION",
      "Unknown policy decision kind.",
    );
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
    || request.validationReference !== CANONICAL_VALIDATION_REF
    || decision.validationReference !== CANONICAL_VALIDATION_REF
  ) {
    return blocked(
      request,
      "ENF-VALIDATION",
      "Invalid or missing validation reference blocks enforcement.",
    );
  }

  if (
    !isPresent(request.authorityRef)
    || request.authorityRef !== decision.authorityRef
    || request.authorityStatus === "Revoked"
    || request.authorityStatus === "Expired"
    || request.authorityStatus === "OutOfScope"
    || request.authorityStatus === "Incomplete"
    || request.authorityStatus === "Unknown"
    || request.authoritySubstitute !== null
  ) {
    return blocked(
      request,
      "ENF-AUTHORITY",
      "Missing, revoked, expired, incomplete, mismatched, substituted, or out-of-scope authority blocks enforcement.",
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
    "ConfirmDecision",
    "MakeDecisionEffective",
    "ResolveDispute",
    "SupersedeDecision",
    "CloseDecision",
    "DiscloseDecision",
    "ExportDecision",
    "ApplyRetention",
    "DisposeDecision",
    "BreakGlassAccess",
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
    && request.operation === "ProposeDecision"
    && (
      request.targetEntityKind === "DecisionAuthority"
      || request.proposedEffect === "create-authority"
      || request.proposedEffect === "broaden-authority"
    )
  ) {
    return blocked(
      request,
      "ENF-AI-AUTHORITY",
      "AI cannot create or broaden authority.",
    );
  }

  if (
    request.privateReflectionAsDecisionRecord
    || request.privacyCategory === "PrivateReflection"
  ) {
    return blocked(
      request,
      "ENF-PRIVATE",
      "Private reflection cannot be treated as a DecisionRecord.",
    );
  }

  if (
    (
      request.privacyCategory === "RestrictedExecutiveRecord"
      || request.privacyCategory === "RegulatedOrPrivilegedRecord"
      || request.privacyCategory === "RegulatedPrivileged"
    )
    && !isPresent(request.classification)
  ) {
    return blocked(
      request,
      "ENF-CLASSIFICATION",
      "Restricted or privileged records require classification.",
    );
  }

  if (
    request.operation === "ProjectDecisionRegister"
    && (
      request.projectionCreatesAuthority
      || request.projectionHidesDispute
      || request.projectionErasesLineage
    )
  ) {
    return blocked(
      request,
      "ENF-PROJECTION",
      "Projection cannot create authority, hide disputes, or erase lineage.",
    );
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
      return awaiting(
        request,
        "Policy requires human confirmation before any effect-bearing steps.",
      );
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

    const humanRequiredOps = Object.freeze([
      "ConfirmDecision",
      "MakeDecisionEffective",
      "ResolveDispute",
      "SupersedeDecision",
      "CloseDecision",
      "ExportDecision",
      "ApplyRetention",
      "DisposeDecision",
      "BreakGlassAccess",
    ]);
    if (
      (humanRequiredOps as readonly string[]).includes(request.operation)
      && request.actorKind !== "Human"
    ) {
      return blocked(
        request,
        "ENF-HUMAN-REQUIRED",
        "This operation requires a human actor for an enforceable plan.",
      );
    }

    if (
      request.operation === "BreakGlassAccess"
      && (
        request.breakGlass === null
        || !isPresent(request.breakGlass.emergencyCategory)
        || !isPresent(request.breakGlass.reason)
        || !isPresent(request.breakGlass.narrowScope)
        || request.breakGlass.expiryRequired !== true
        || request.breakGlass.reviewRequired !== true
      )
    ) {
      return blocked(
        request,
        "ENF-BREAK-GLASS",
        "Break-glass requires emergency category, reason, narrow scope, expiry, and review.",
      );
    }

    const effectKind = appendStepFor(request.operation);
    const effectSteps: ExecutiveDecisionRegisterEnforcementStep[] = [
      ...baseVerifySteps(obligationKinds),
    ];

    const appendOps = Object.freeze([
      "ProposeDecision",
      "ConfirmDecision",
      "MakeDecisionEffective",
      "CorrectDecision",
      "OpenDispute",
      "ResolveDispute",
      "SupersedeDecision",
      "ReferenceOutcome",
      "CloseDecision",
    ]);
    if ((appendOps as readonly string[]).includes(request.operation)) {
      effectSteps.push(
        makeStep(
          effectKind,
          obligationKinds.includes("RequireAppendOnlyEvent")
            ? ["RequireAppendOnlyEvent"]
            : [],
          true,
          `Prepare append-only ${effectKind} for ${request.operation}.`,
        ),
      );
    }

    if (
      request.operation === "ReadDecision"
      || request.operation === "SearchDecisions"
      || request.operation === "ProjectDecisionRegister"
      || request.operation === "DiscloseDecision"
      || request.operation === "ExportDecision"
    ) {
      effectSteps.push(
        makeStep(
          "ApplyFieldFilter",
          ["RequireFieldFiltering"],
          false,
          "Apply field filtering.",
        ),
        makeStep(
          "ApplyRedaction",
          ["RequireRedaction"],
          false,
          "Apply redaction constraints.",
        ),
      );
      if (request.operation === "ProjectDecisionRegister") {
        effectSteps.push(
          makeStep(
            "BindProjectionScope",
            [],
            false,
            "Bind projection scope without creating authoritative facts.",
          ),
        );
      }
      if (request.operation === "DiscloseDecision") {
        effectSteps.push(
          makeStep(
            "PrepareDisclosureEvidence",
            ["RequireDisclosureEvidence"],
            false,
            "Prepare disclosure evidence without payload leakage.",
          ),
        );
      }
      if (request.operation === "ExportDecision") {
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
          ["RequireRetentionEvidence"],
          true,
          "Prepare retention governance-event append without choosing a retention period.",
        ),
      );
    }
    if (request.operation === "DisposeDecision") {
      effectSteps.push(
        makeStep(
          "PrepareDispositionEvent",
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
      policyDecisionId: decision.policyId,
      policyVersion: decision.policyVersion,
      validationReference: request.validationReference,
      requestId: request.requestId,
      actorId: request.actorId,
      authorityRef: request.authorityRef as string,
      purpose: request.purpose,
      operation: request.operation,
      targetRegister: request.targetRegister,
      targetEntityId: request.targetEntityId,
      currentLifecycleState: request.currentLifecycleState,
      proposedLifecycleState: request.proposedLifecycleState,
      steps,
      obligationToStepMap: mapped.mapping,
      requiredEvidence: Object.freeze([...request.evidenceRefs]),
      privacyCategory: request.privacyCategory,
      classification: request.classification,
      expectedAppendOnlyEffect: expectedAppendOnlyEffect(request.operation),
      failureBehavior: "FailClosed" as const,
      summary: [
        ExecutiveDecisionRegisterEnforcementId,
        ExecutiveDecisionRegisterEnforcementVersion,
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

export function isExecutiveDecisionRegisterEnforcementBlocked(
  result: ExecutiveDecisionRegisterEnforcementResult,
): boolean {
  return result.kind === "Blocked";
}

export function isExecutiveDecisionRegisterEnforcementAwaitingConfirmation(
  result: ExecutiveDecisionRegisterEnforcementResult,
): boolean {
  return result.kind === "AwaitingConfirmation";
}

export function isExecutiveDecisionRegisterEnforcementEnforceable(
  result: ExecutiveDecisionRegisterEnforcementResult,
): boolean {
  return result.kind === "Enforceable";
}

/**
 * Completeness check for obligation mapping coverage.
 * Fails closed when policy adds an unmapped obligation, when mapping
 * references an unknown obligation, when keys are duplicated ambiguously,
 * or when a mapped step is absent from the closed step vocabulary.
 */
export function verifyExecutiveDecisionRegisterObligationStepMapping():
  boolean {
  const kinds = ExecutiveDecisionRegisterPolicy.obligationKinds;
  const mappingKeys = Object.keys(
    ExecutiveDecisionRegisterObligationStepMapping,
  ) as readonly ExecutiveDecisionRegisterPolicyObligationKind[];
  const kindSet = new Set<string>(kinds);
  const mappingKeySet = new Set<string>(mappingKeys);
  if (kinds.length !== mappingKeys.length || kindSet.size !== kinds.length) {
    return false;
  }
  if (mappingKeySet.size !== mappingKeys.length) {
    return false;
  }
  for (const kind of kinds) {
    if (!mappingKeySet.has(kind)) {
      return false;
    }
  }
  for (const key of mappingKeys) {
    if (!kindSet.has(key)) {
      return false;
    }
    const steps: readonly string[] =
      ExecutiveDecisionRegisterObligationStepMapping[key];
    if (steps.length < 1) {
      return false;
    }
    for (const step of steps) {
      if (
        !(ExecutiveDecisionRegisterEnforcementStepKinds as readonly string[])
          .includes(step)
      ) {
        return false;
      }
    }
  }
  return true;
}
