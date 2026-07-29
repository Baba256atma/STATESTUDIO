/**
 * RTC-3:5 — Executive Decision Register Policy Rules.
 *
 * Canonical ordered policy rules and pure fail-closed evaluator.
 * Precedence: Deny > RequireConfirmation > Allow. Default Deny.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

import { ExecutiveDecisionRegisterValidation } from "./executiveDecisionRegisterValidation.ts";
import {
  ExecutiveDecisionRegisterPolicyId,
  ExecutiveDecisionRegisterPolicyVersion,
} from "./executiveDecisionRegisterPolicyIdentity.ts";
import {
  ExecutiveDecisionRegisterPolicyObligationKinds,
  ExecutiveDecisionRegisterPolicyOperations,
} from "./executiveDecisionRegisterPolicyLifecycle.ts";
import type {
  ExecutiveDecisionRegisterPolicyConfirmationRequirement,
  ExecutiveDecisionRegisterPolicyDecision,
  ExecutiveDecisionRegisterPolicyDecisionKind,
  ExecutiveDecisionRegisterPolicyObligation,
  ExecutiveDecisionRegisterPolicyObligationKind,
  ExecutiveDecisionRegisterPolicyOperation,
  ExecutiveDecisionRegisterPolicyRequest,
} from "./executiveDecisionRegisterPolicyTypes.ts";

export interface ExecutiveDecisionRegisterPolicyRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly family: string;
  readonly priority: number;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly mutatesState: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

type MatchEffect = {
  readonly decision: ExecutiveDecisionRegisterPolicyDecisionKind;
  readonly ruleId: string;
  readonly reason: string;
  readonly obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[];
  readonly confirmation: boolean;
};

const CANONICAL_VALIDATION_REF =
  "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

const rule = (
  priority: number,
  ruleKey: string,
  family: string,
  description: string,
): ExecutiveDecisionRegisterPolicyRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-3:5/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    family,
    priority,
    description,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterPolicyRules = Object.freeze([
  rule(1, "ValidationEvidenceRequired", "ValidationGate", "Missing validation evidence denies."),
  rule(2, "InvalidValidationDenies", "ValidationGate", "Invalid upstream validation denies."),
  rule(3, "MismatchedValidationRefDenies", "ValidationGate", "Mismatched validation reference denies."),
  rule(4, "UnknownOperationDenies", "ValidationGate", "Unknown operations deny."),
  rule(5, "AuthorityRequired", "Authority", "Consequential operations require authority_ref."),
  rule(6, "AuthoritySubstituteRejected", "Authority", "Identity, title, role, attendance, silence, AI confidence, prior access, or client assertion cannot substitute for authority."),
  rule(7, "IncompleteDelegationDenies", "Authority", "Incomplete delegation denies."),
  rule(8, "DelegationRevokedDenies", "Authority", "Revoked delegation denies."),
  rule(9, "DelegationExpiredDenies", "Authority", "Expired delegation denies."),
  rule(10, "DelegationOutOfScopeDenies", "Authority", "Out-of-scope delegation denies."),
  rule(11, "AiCannotConfirm", "AiBoundary", "AI cannot confirm decisions or satisfy human confirmation."),
  rule(12, "AiCannotCreateOrBroadenAuthority", "AiBoundary", "AI cannot create or broaden authority."),
  rule(13, "AiCannotMakeAuthoritativeOrEffective", "AiBoundary", "AI cannot make proposals authoritative or decisions effective."),
  rule(14, "AiCannotResolveOrSupersede", "AiBoundary", "AI cannot resolve disputes or supersede effective decisions."),
  rule(15, "AiCannotCloseDiscloseOrExport", "AiBoundary", "AI cannot close, disclose, or export restricted material."),
  rule(16, "AiCannotRetainDisposeOrBreakGlass", "AiBoundary", "AI cannot alter retention, dispose records, or exercise break-glass."),
  rule(17, "AiProposeNonAuthoritative", "AiBoundary", "AI propose remains non-authoritative."),
  rule(18, "PrivateReflectionDenied", "Privacy", "Private reflection is outside RTC-3 and cannot be treated as a DecisionRecord."),
  rule(19, "RestrictedClassificationRequired", "Privacy", "Restricted or privileged records require classification."),
  rule(20, "PrivacyBypassDenied", "Privacy", "Automatic promotion and cross-category conversion without a new authorized event deny."),
  rule(21, "LifecycleConfirmRequiresProposed", "Lifecycle", "Confirming a non-proposed decision denies."),
  rule(22, "LifecycleEffectiveRequiresConfirmed", "Lifecycle", "Making an unconfirmed decision effective denies."),
  rule(23, "DisposedToActiveDenied", "Lifecycle", "Returning a disposed decision to active state denies."),
  rule(24, "InPlaceMutationDenied", "AppendOnly", "In-place mutation, overwrite, deletion, or reopen without a new event denies."),
  rule(25, "DisputeRequiresChallengedRef", "Dispute", "Opening a dispute without a challenged reference denies."),
  rule(26, "ResolveRequiresActiveDispute", "Dispute", "Resolving without an active dispute or evidence denies."),
  rule(27, "SupersessionLineageRequired", "Supersession", "Supersession without predecessor, successor, or effective point denies."),
  rule(28, "CircularSupersessionDenied", "Supersession", "Circular or self-supersession denies."),
  rule(29, "EvidenceRequired", "Evidence", "Missing mandatory evidence references denies."),
  rule(30, "ProjectionConstraints", "Projection", "Projections require provenance and cannot create authority, hide disputes, or erase lineage."),
  rule(31, "DisclosureFailClosed", "Disclosure", "Read, search, and disclosure fail closed on missing or unknown inputs."),
  rule(32, "ExportRequiresConfirmation", "Export", "Export requires authority, confirmation, purpose, classification, scope, and export evidence."),
  rule(33, "RetentionDispositionRequiresConfirmation", "RetentionDisposition", "Retention and disposition require human authority, confirmation, and evidence."),
  rule(34, "ClosureRequiresConfirmation", "OutcomeClosure", "Closing a decision requires human authority, confirmation, and closure metadata."),
  rule(35, "BreakGlassBounded", "BreakGlass", "Break-glass requires bounded human metadata, authority, confirmation, expiry, and review."),
  rule(36, "HumanConfirmationRequired", "HumanConfirmation", "Consequential human actions require confirmation."),
  rule(37, "CanonicalAllow", "AllowGate", "Explicit allow only when all mandatory gates pass."),
] as const);

const OPERATIONS = ExecutiveDecisionRegisterPolicyOperations as readonly string[];

const CONSEQUENTIAL = Object.freeze([
  "ConfirmDecision",
  "MakeDecisionEffective",
  "CorrectDecision",
  "OpenDispute",
  "ResolveDispute",
  "SupersedeDecision",
  "CloseDecision",
  "DiscloseDecision",
  "ExportDecision",
  "ApplyRetention",
  "DisposeDecision",
  "BreakGlassAccess",
] as const);

const CONFIRMATION_OPS = Object.freeze([
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
] as const);

const DISCLOSURE_OPS = Object.freeze([
  "ReadDecision",
  "SearchDecisions",
  "DiscloseDecision",
  "ExportDecision",
] as const);

const EVIDENCE_OPS = Object.freeze([
  "ConfirmDecision",
  "CorrectDecision",
  "OpenDispute",
  "ResolveDispute",
  "SupersedeDecision",
  "CloseDecision",
  "ReferenceOutcome",
  "DiscloseDecision",
  "ExportDecision",
  "ApplyRetention",
  "DisposeDecision",
] as const);

const isPresent = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.length > 0 && value !== "Unknown";
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
};

const isKnownOperation = (
  operation: string,
): operation is ExecutiveDecisionRegisterPolicyOperation =>
  OPERATIONS.includes(operation);

const obligation = (
  kind: ExecutiveDecisionRegisterPolicyObligationKind,
  order: number,
  description: string,
): ExecutiveDecisionRegisterPolicyObligation =>
  Object.freeze({
    obligationId: `RTC-3:5/Obligation/${kind}`,
    kind,
    description,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

const OBLIGATION_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionRegisterPolicyObligationKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveDecisionRegisterPolicyObligationKind, number>>,
);

const dedupeObligations = (
  kinds: readonly ExecutiveDecisionRegisterPolicyObligationKind[],
): readonly ExecutiveDecisionRegisterPolicyObligation[] => {
  const unique = [...new Set(kinds)].sort(
    (left, right) => OBLIGATION_ORDER[left] - OBLIGATION_ORDER[right],
  );
  return Object.freeze(
    unique.map((kind) =>
      obligation(
        kind,
        OBLIGATION_ORDER[kind],
        `Policy obligation: ${kind}`,
      )
    ),
  );
};

const effect = (
  decision: ExecutiveDecisionRegisterPolicyDecisionKind,
  ruleKey: string,
  reason: string,
  obligations: readonly ExecutiveDecisionRegisterPolicyObligationKind[] = [],
  confirmation = false,
): MatchEffect => {
  const declared = ExecutiveDecisionRegisterPolicyRules.find(
    (item) => item.ruleKey === ruleKey,
  );
  return Object.freeze({
    decision,
    ruleId: declared?.ruleId ?? `RTC-3:5/Rule/${ruleKey}`,
    reason,
    obligations: Object.freeze([...obligations]),
    confirmation,
  });
};

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

const collectEffects = (
  request: ExecutiveDecisionRegisterPolicyRequest,
): readonly MatchEffect[] => {
  const matches: MatchEffect[] = [];
  const op = request.operation;
  const actorIsAi = request.actorKind === "Ai";
  const privateReflection =
    request.privacyCategory === "PrivateReflection"
    || request.privateReflectionAsDecisionRecord === true;
  const restricted =
    request.privacyCategory === "RestrictedExecutiveRecord"
    || request.privacyCategory === "RegulatedPrivileged";
  const consequential = (CONSEQUENTIAL as readonly string[]).includes(op);

  if (request.validation === null) {
    matches.push(
      effect("Deny", "ValidationEvidenceRequired", "Missing validation evidence."),
    );
  } else if (
    request.validation.valid !== true
    || request.validation.outcome !== "Valid"
    || request.validation.errorCount > 0
  ) {
    matches.push(
      effect("Deny", "InvalidValidationDenies", "Upstream validation is invalid."),
    );
  } else if (
    request.validation.validationResultRef !== CANONICAL_VALIDATION_REF
  ) {
    matches.push(
      effect(
        "Deny",
        "MismatchedValidationRefDenies",
        "Validation reference does not match RTC-3:4.",
      ),
    );
  }

  if (!isKnownOperation(op)) {
    matches.push(
      effect("Deny", "UnknownOperationDenies", "Unknown operation."),
    );
    return Object.freeze(matches);
  }

  if (consequential && !isPresent(request.authorityRef)) {
    matches.push(
      effect(
        "Deny",
        "AuthorityRequired",
        "Consequential operation requires authority_ref.",
        ["RequireAuthorityEvidence"],
      ),
    );
  }

  if (request.authoritySubstitute !== null) {
    matches.push(
      effect(
        "Deny",
        "AuthoritySubstituteRejected",
        "Authority substitute rejected.",
        ["RequireAuthorityEvidence"],
      ),
    );
  }

  if (request.delegation) {
    if (
      request.delegation.status === "Incomplete"
      || !isPresent(request.delegation.scope)
      || !isPresent(request.delegation.evidenceRef)
    ) {
      matches.push(
        effect("Deny", "IncompleteDelegationDenies", "Delegation is incomplete."),
      );
    }
    if (request.delegation.status === "Revoked") {
      matches.push(
        effect("Deny", "DelegationRevokedDenies", "Delegation is revoked."),
      );
    }
    if (request.delegation.status === "Expired") {
      matches.push(
        effect("Deny", "DelegationExpiredDenies", "Delegation is expired."),
      );
    }
    if (request.delegation.status === "OutOfScope") {
      matches.push(
        effect(
          "Deny",
          "DelegationOutOfScopeDenies",
          "Delegation is out of scope.",
        ),
      );
    }
  }

  if (actorIsAi) {
    if (
      op === "ConfirmDecision"
      || request.confirmationContext?.humanConfirmer === false
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotConfirm",
          "AI cannot confirm decisions or satisfy human confirmation.",
        ),
      );
    }
    if (
      op === "ProposeDecision"
      && (
        request.targetEntityKind === "DecisionAuthority"
        || request.proposedEffect === "create-authority"
        || request.proposedEffect === "broaden-authority"
      )
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotCreateOrBroadenAuthority",
          "AI cannot create or broaden authority.",
        ),
      );
    }
    if (
      request.authorityState === "Authoritative"
      || op === "MakeDecisionEffective"
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotMakeAuthoritativeOrEffective",
          "AI cannot make proposals authoritative or decisions effective.",
        ),
      );
    }
    if (op === "ResolveDispute" || op === "SupersedeDecision") {
      matches.push(
        effect(
          "Deny",
          "AiCannotResolveOrSupersede",
          "AI cannot resolve disputes or supersede effective decisions.",
        ),
      );
    }
    if (
      op === "CloseDecision"
      || op === "DiscloseDecision"
      || op === "ExportDecision"
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotCloseDiscloseOrExport",
          "AI cannot close, disclose, or export restricted material.",
        ),
      );
    }
    if (
      op === "ApplyRetention"
      || op === "DisposeDecision"
      || op === "BreakGlassAccess"
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotRetainDisposeOrBreakGlass",
          "AI cannot alter retention, dispose records, or exercise break-glass.",
        ),
      );
    }
    if ((CONFIRMATION_OPS as readonly string[]).includes(op)) {
      matches.push(
        effect(
          "Deny",
          "AiCannotConfirm",
          "AI cannot satisfy human confirmation requirements.",
        ),
      );
    }
  }

  if (privateReflection) {
    matches.push(
      effect(
        "Deny",
        "PrivateReflectionDenied",
        "Private reflection is outside RTC-3.",
      ),
    );
  }

  if (restricted && !isPresent(request.classification)) {
    matches.push(
      effect(
        "Deny",
        "RestrictedClassificationRequired",
        "Restricted or privileged records require classification.",
      ),
    );
  }

  if (
    request.automaticPrivateReflectionPromotion === true
    || request.crossCategoryConversionWithoutEvent === true
  ) {
    matches.push(
      effect(
        "Deny",
        "PrivacyBypassDenied",
        "Privacy bypass without a new authorized event is denied.",
      ),
    );
  }

  if (
    op === "ConfirmDecision"
    && request.currentLifecycleState !== "Proposed"
  ) {
    matches.push(
      effect(
        "Deny",
        "LifecycleConfirmRequiresProposed",
        "Only proposed decisions may be confirmed.",
      ),
    );
  }

  if (
    op === "MakeDecisionEffective"
    && request.currentLifecycleState !== "Confirmed"
  ) {
    matches.push(
      effect(
        "Deny",
        "LifecycleEffectiveRequiresConfirmed",
        "Only confirmed decisions may become effective.",
      ),
    );
  }

  if (
    request.currentLifecycleState === "Disposed"
    && request.proposedLifecycleState === "Active"
  ) {
    matches.push(
      effect(
        "Deny",
        "DisposedToActiveDenied",
        "Disposed-to-active reversal is denied.",
      ),
    );
  }

  if (
    request.inPlaceMutation === true
    || request.historicalOverwrite === true
    || request.historicalDeletion === true
    || request.reopeningWithoutEvent === true
  ) {
    matches.push(
      effect(
        "Deny",
        "InPlaceMutationDenied",
        "In-place mutation and historical erasure are denied.",
        ["RequireAppendOnlyEvent"],
      ),
    );
  }

  if (op === "OpenDispute" && !isPresent(request.challengedDecisionRef)) {
    matches.push(
      effect(
        "Deny",
        "DisputeRequiresChallengedRef",
        "Dispute requires a challenged decision reference.",
      ),
    );
  }

  if (op === "ResolveDispute") {
    if (
      request.activeDisputePresent !== true
      || request.evidenceRefs.length === 0
    ) {
      matches.push(
        effect(
          "Deny",
          "ResolveRequiresActiveDispute",
          "Resolution requires an active dispute and evidence.",
          ["RequireEvidenceReference"],
        ),
      );
    }
  }

  if (op === "SupersedeDecision") {
    if (
      !isPresent(request.predecessorDecisionRef)
      || !isPresent(request.successorDecisionRef)
      || !isPresent(request.supersessionEffectivePoint)
    ) {
      matches.push(
        effect(
          "Deny",
          "SupersessionLineageRequired",
          "Supersession requires predecessor, successor, and effective point.",
          ["RequireAppendOnlyEvent", "RequireEvidenceReference"],
        ),
      );
    } else if (
      request.predecessorDecisionRef === request.successorDecisionRef
    ) {
      matches.push(
        effect(
          "Deny",
          "CircularSupersessionDenied",
          "Circular or self-supersession is denied.",
        ),
      );
    }
  }

  if (
    (EVIDENCE_OPS as readonly string[]).includes(op)
    && request.evidenceRefs.length === 0
  ) {
    matches.push(
      effect(
        "Deny",
        "EvidenceRequired",
        "Mandatory evidence references are missing.",
        ["RequireEvidenceReference"],
      ),
    );
  }

  if (op === "DisposeDecision" && !request.dispositionGovernanceEvidencePresent) {
    matches.push(
      effect(
        "Deny",
        "EvidenceRequired",
        "Disposition requires governance evidence.",
        ["RequireDispositionEvidence"],
      ),
    );
  }

  if (op === "ProjectDecisionRegister") {
    if (
      !request.projectionSourceRegisterPresent
      || !request.projectionProvenancePresent
      || request.projectionCreatesAuthority
      || request.projectionHidesDispute
      || request.projectionErasesLineage
      || request.projectionNonAuthoritative !== true
    ) {
      matches.push(
        effect(
          "Deny",
          "ProjectionConstraints",
          "Projection constraints failed.",
          ["RequireProvenance", "RequireFieldFiltering"],
        ),
      );
    }
  }

  if ((DISCLOSURE_OPS as readonly string[]).includes(op)) {
    if (
      !isPresent(request.purpose)
      || !isPresent(request.classification)
      || !isPresent(request.privacyCategory)
      || request.classification === "Unknown"
      || request.purpose === "Unknown"
      || request.requestedScope.length === 0
    ) {
      matches.push(
        effect(
          "Deny",
          "DisclosureFailClosed",
          "Disclosure denied.",
          ["RequireFieldFiltering", "RequirePurposeBinding", "RequireRedaction"],
        ),
      );
    }
  }

  if (op === "ExportDecision" && !actorIsAi) {
    matches.push(
      effect(
        "RequireConfirmation",
        "ExportRequiresConfirmation",
        "Export requires authority and confirmation.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireExportEvidence",
          "RequirePurposeBinding",
          "RequireDisclosureEvidence",
        ],
        true,
      ),
    );
    if (
      !isPresent(request.exportPolicyRef)
      || !isPresent(request.purpose)
      || !isPresent(request.classification)
      || request.requestedScope.length === 0
    ) {
      matches.push(
        effect(
          "Deny",
          "ExportRequiresConfirmation",
          "Export requires purpose, classification, scope, and export evidence.",
          ["RequireExportEvidence"],
        ),
      );
    }
  }

  if (
    (op === "ApplyRetention" || op === "DisposeDecision")
    && !actorIsAi
  ) {
    matches.push(
      effect(
        "RequireConfirmation",
        "RetentionDispositionRequiresConfirmation",
        "Retention or disposition requires authority and confirmation.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireEvidenceReference",
          "RequireAppendOnlyEvent",
          op === "ApplyRetention"
            ? "RequireRetentionEvidence"
            : "RequireDispositionEvidence",
        ],
        true,
      ),
    );
    if (
      op === "ApplyRetention"
      && !isPresent(request.retentionPolicyRef)
    ) {
      matches.push(
        effect(
          "Deny",
          "RetentionDispositionRequiresConfirmation",
          "Retention requires an explicit policy reference.",
          ["RequireRetentionEvidence"],
        ),
      );
    }
    if (
      op === "DisposeDecision"
      && !isPresent(request.dispositionPolicyRef)
    ) {
      matches.push(
        effect(
          "Deny",
          "RetentionDispositionRequiresConfirmation",
          "Disposition requires an explicit policy reference.",
          ["RequireDispositionEvidence"],
        ),
      );
    }
  }

  if (op === "CloseDecision" && !actorIsAi) {
    matches.push(
      effect(
        "RequireConfirmation",
        "ClosureRequiresConfirmation",
        "Closure requires human authority and confirmation.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireEvidenceReference",
          "RequireAppendOnlyEvent",
        ],
        true,
      ),
    );
    if (!request.closureMetadataPresent) {
      matches.push(
        effect(
          "Deny",
          "ClosureRequiresConfirmation",
          "Closure requires explicit closure metadata.",
        ),
      );
    }
  }

  if (op === "BreakGlassAccess") {
    const bg = request.breakGlass;
    if (
      actorIsAi
      || bg === null
      || !isPresent(bg.emergencyCategory)
      || !isPresent(bg.reason)
      || !isPresent(bg.narrowScope)
      || bg.expiryRequired !== true
      || bg.reviewRequired !== true
      || !isPresent(request.authorityRef)
    ) {
      matches.push(
        effect(
          "Deny",
          "BreakGlassBounded",
          "Break-glass requires bounded human metadata, authority, expiry, and review.",
          ["RequireBreakGlassReview", "RequireExpiry", "RequireReview"],
        ),
      );
    } else {
      matches.push(
        effect(
          "RequireConfirmation",
          "BreakGlassBounded",
          "Break-glass requires confirmation, expiry, and review obligations.",
          [
            "RequireHumanConfirmation",
            "RequireAuthorityEvidence",
            "RequireBreakGlassReview",
            "RequireExpiry",
            "RequireReview",
            "RequireEvidenceReference",
          ],
          true,
        ),
      );
    }
    if (privateReflection || restricted && !isPresent(request.classification)) {
      matches.push(
        effect(
          "Deny",
          "PrivacyBypassDenied",
          "Break-glass does not bypass privacy boundaries.",
        ),
      );
    }
  }

  if (
    op === "ConfirmDecision"
    && request.confirmationContext !== null
    && !actorIsAi
  ) {
    const ctx = request.confirmationContext;
    if (
      ctx.humanConfirmer !== true
      || ctx.proposalRef !== ctx.expectedProposalRef
      || ctx.proposedEffect !== ctx.expectedEffect
      || ctx.authorityRef !== ctx.expectedAuthorityRef
      || !sameStringSet(ctx.evidenceSet, ctx.expectedEvidenceSet)
      || !isPresent(ctx.policyVersionRef)
      || ctx.singleUse !== true
    ) {
      matches.push(
        effect(
          "Deny",
          "HumanConfirmationRequired",
          "Confirmation binding mismatch or incomplete confirmation context.",
          ["RequireHumanConfirmation"],
        ),
      );
    }
  }

  if (
    !actorIsAi
    && (CONFIRMATION_OPS as readonly string[]).includes(op)
    && op !== "ExportDecision"
    && op !== "ApplyRetention"
    && op !== "DisposeDecision"
    && op !== "BreakGlassAccess"
    && op !== "CloseDecision"
  ) {
    matches.push(
      effect(
        "RequireConfirmation",
        "HumanConfirmationRequired",
        "Human confirmation is required for this consequential operation.",
        ["RequireHumanConfirmation", "RequireAuthorityEvidence"],
        true,
      ),
    );
  }

  if (
    !actorIsAi
    && op === "CorrectDecision"
    && matches.every((item) => item.decision !== "Deny")
    && request.validation?.valid === true
    && isPresent(request.purpose)
    && request.evidenceRefs.length > 0
  ) {
    matches.push(
      effect(
        "RequireConfirmation",
        "HumanConfirmationRequired",
        "Append-only correction requires confirmation and append-only event.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireAppendOnlyEvent",
          "RequireEvidenceReference",
          "RequireProvenance",
        ],
        true,
      ),
    );
  }

  if (
    matches.every((item) => item.decision !== "Deny")
    && (
      op === "ProposeDecision"
      || op === "ReadDecision"
      || op === "SearchDecisions"
      || op === "ProjectDecisionRegister"
      || op === "ReferenceOutcome"
      || op === "OpenDispute"
    )
    && !privateReflection
    && !actorIsAi
    && request.validation?.valid === true
    && isPresent(request.purpose)
    && request.authorityState !== "Authoritative"
  ) {
    const obligations: ExecutiveDecisionRegisterPolicyObligationKind[] =
      op === "ReadDecision"
      || op === "SearchDecisions"
      || op === "ProjectDecisionRegister"
        ? ["RequirePurposeBinding", "RequireFieldFiltering"]
        : op === "OpenDispute" || op === "ReferenceOutcome"
          ? ["RequireAppendOnlyEvent", "RequireEvidenceReference", "RequireProvenance"]
          : [];
    if (
      op !== "ProjectDecisionRegister"
      || (
        request.projectionSourceRegisterPresent
        && request.projectionProvenancePresent
        && request.projectionNonAuthoritative
        && !request.projectionCreatesAuthority
        && !request.projectionHidesDispute
        && !request.projectionErasesLineage
      )
    ) {
      matches.push(
        effect(
          "Allow",
          "CanonicalAllow",
          "Explicit allow after mandatory gates.",
          obligations,
        ),
      );
    }
  }

  if (
    matches.every((item) => item.decision !== "Deny")
    && op === "ProposeDecision"
    && actorIsAi
    && !privateReflection
    && request.validation?.valid === true
    && isPresent(request.purpose)
    && request.authorityState === "NonAuthoritative"
    && request.originState === "AiProposed"
    && request.targetEntityKind !== "DecisionAuthority"
    && request.proposedEffect !== "create-authority"
    && request.proposedEffect !== "broaden-authority"
  ) {
    matches.push(
      effect(
        "Allow",
        "AiProposeNonAuthoritative",
        "AI may propose non-authoritative metadata only.",
      ),
    );
  }

  return Object.freeze(matches);
};

const resolveDecision = (
  matches: readonly MatchEffect[],
): ExecutiveDecisionRegisterPolicyDecisionKind => {
  if (matches.some((item) => item.decision === "Deny")) {
    return "Deny";
  }
  if (matches.some((item) => item.decision === "RequireConfirmation")) {
    return "RequireConfirmation";
  }
  if (matches.some((item) => item.decision === "Allow")) {
    return "Allow";
  }
  return "Deny";
};

const decisionCodeFor = (
  decision: ExecutiveDecisionRegisterPolicyDecisionKind,
): string => {
  switch (decision) {
    case "Allow":
      return "POL-ALLOW";
    case "RequireConfirmation":
      return "POL-CONFIRM";
    case "Deny":
      return "POL-DENY";
  }
};

/**
 * Evaluate one policy request.
 * Pure, deterministic, fail-closed. Never mutates the request.
 */
export function evaluateExecutiveDecisionRegisterPolicy(
  request: ExecutiveDecisionRegisterPolicyRequest,
): ExecutiveDecisionRegisterPolicyDecision {
  const matches = collectEffects(request);
  const decision = resolveDecision(matches);
  const selected = matches.filter((item) => {
    if (decision === "Deny") {
      return item.decision === "Deny";
    }
    if (decision === "RequireConfirmation") {
      return item.decision === "RequireConfirmation";
    }
    return item.decision === "Allow";
  });

  const matchingRuleIds = Object.freeze(
    [...new Set(selected.map((item) => item.ruleId))].sort(),
  );
  const obligationKinds = selected.flatMap((item) => item.obligations);
  const obligations = dedupeObligations(obligationKinds);

  const reason = selected.length > 0
    ? selected.map((item) => item.reason).join(" ")
    : "No explicit allow rule matched.";

  const safeReason =
    decision === "Deny"
    && (DISCLOSURE_OPS as readonly string[]).includes(request.operation)
      ? "Disclosure denied."
      : reason;

  const needsConfirmation =
    decision === "RequireConfirmation"
    || selected.some((item) => item.confirmation);

  const confirmation: ExecutiveDecisionRegisterPolicyConfirmationRequirement | null =
    needsConfirmation
      ? Object.freeze({
          proposedEffect: request.proposedEffect,
          confirmingActor: request.actorId,
          requiredAuthority: request.authorityRef ?? "authority_ref_required",
          evidenceToDisplay: Object.freeze([...request.evidenceRefs]),
          policyVersionRequired: true as const,
          singleUseRequired: true as const,
          expiryRequired: true as const,
          dualControlRequired: request.dualControlRequired === true,
          metadataOnly: true as const,
          immutable: true as const,
        })
      : null;

  const validationOutcome =
    request.validation === null
      ? ("Missing" as const)
      : request.validation.outcome;

  return Object.freeze({
    decision,
    decisionCode: decisionCodeFor(decision),
    matchingRuleIds,
    requestId: request.requestId,
    actorRef: request.actorId,
    authorityRef: request.authorityRef,
    purpose: request.purpose,
    operation: request.operation,
    targetId: request.targetEntityId,
    reason: safeReason,
    obligations,
    validationOutcome,
    validationReference: request.validation?.validationResultRef ?? null,
    policyId: ExecutiveDecisionRegisterPolicyId,
    policyVersion: ExecutiveDecisionRegisterPolicyVersion,
    evidenceRefs: Object.freeze([...request.evidenceRefs]),
    confirmation,
    revealsProtectedMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export function isExecutiveDecisionRegisterPolicyAllowed(
  decision: ExecutiveDecisionRegisterPolicyDecision,
): boolean {
  return decision.decision === "Allow";
}

export function isExecutiveDecisionRegisterPolicyDenied(
  decision: ExecutiveDecisionRegisterPolicyDecision,
): boolean {
  return decision.decision === "Deny";
}

export function isExecutiveDecisionRegisterPolicyConfirmationRequired(
  decision: ExecutiveDecisionRegisterPolicyDecision,
): boolean {
  return decision.decision === "RequireConfirmation";
}

export function getExecutiveDecisionRegisterPolicyObligations(
  decision: ExecutiveDecisionRegisterPolicyDecision,
): readonly ExecutiveDecisionRegisterPolicyObligation[] {
  return decision.obligations;
}

/** Structural conflict-safety check for the sealed rule catalogue. */
export function verifyExecutiveDecisionRegisterPolicyRuleCompleteness():
  ExecutiveDecisionRegisterPolicyDecision {
  const ids = ExecutiveDecisionRegisterPolicyRules.map((item) => item.ruleId);
  const keys = ExecutiveDecisionRegisterPolicyRules.map((item) => item.ruleKey);
  const priorities = ExecutiveDecisionRegisterPolicyRules.map(
    (item) => item.priority,
  );
  const unique =
    new Set(ids).size === ids.length
    && new Set(keys).size === keys.length
    && new Set(priorities).size === priorities.length
    && ExecutiveDecisionRegisterValidation.readiness === "ReadyForPolicy";

  return evaluateExecutiveDecisionRegisterPolicy(
    Object.freeze({
      requestId: "RTC-3:5/catalogue-check",
      operation: "ProposeDecision",
      actorId: "system-steward",
      actorKind: "Human",
      authorityRef: "authority-catalogue",
      delegation: null,
      purpose: "catalogue-integrity",
      targetRegister: "RTC-EDR-00000001",
      targetEntityKind: "DecisionProposal",
      targetEntityId: "catalogue",
      currentLifecycleState: "Proposed",
      proposedLifecycleState: null,
      authorityState: "NonAuthoritative",
      originState: "HumanAuthored",
      privacyCategory: "ExecutiveRecord",
      classification: "internal",
      proposedEffect: "verify-catalogue",
      evidenceRefs: Object.freeze(["catalogue-evidence"]),
      validation: Object.freeze({
        outcome: unique ? ("Valid" as const) : ("Invalid" as const),
        valid: unique,
        warningCount: 0,
        errorCount: unique ? 0 : 1,
        validationResultRef: CANONICAL_VALIDATION_REF,
      }),
      requestedScope: Object.freeze(["catalogue"]),
      confirmationContext: null,
      jurisdictionContext: null,
      jurisdictionRequired: false,
      breakGlass: null,
      authoritySubstitute: null,
      inPlaceMutation: false,
      historicalOverwrite: false,
      historicalDeletion: false,
      reopeningWithoutEvent: false,
      privateReflectionAsDecisionRecord: false,
      automaticPrivateReflectionPromotion: false,
      crossCategoryConversionWithoutEvent: false,
      activeDisputePresent: false,
      challengedDecisionRef: null,
      predecessorDecisionRef: null,
      successorDecisionRef: null,
      supersessionEffectivePoint: null,
      closureMetadataPresent: false,
      dispositionGovernanceEvidencePresent: false,
      projectionSourceRegisterPresent: false,
      projectionProvenancePresent: false,
      projectionCreatesAuthority: false,
      projectionHidesDispute: false,
      projectionErasesLineage: false,
      projectionNonAuthoritative: true,
      retentionPolicyRef: null,
      dispositionPolicyRef: null,
      exportPolicyRef: null,
      dualControlRequired: false,
    }),
  );
}
