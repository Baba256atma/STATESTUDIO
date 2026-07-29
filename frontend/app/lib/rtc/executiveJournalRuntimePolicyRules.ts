/**
 * RTC-2:5 — Executive Journal Runtime Policy Rules.
 *
 * Canonical ordered policy rules and pure fail-closed evaluator.
 * Precedence: Deny > RequireConfirmation > Allow. Default Deny.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

import { ExecutiveJournalRuntimeValidation } from "./executiveJournalRuntimeValidation.ts";
import {
  ExecutiveJournalRuntimePolicyId,
  ExecutiveJournalRuntimePolicyVersion,
} from "./executiveJournalRuntimePolicyIdentity.ts";
import {
  ExecutiveJournalRuntimePolicyObligationKinds,
  ExecutiveJournalRuntimePolicyOperations,
} from "./executiveJournalRuntimePolicyLifecycle.ts";
import type {
  ExecutiveJournalRuntimePolicyConfirmationRequirement,
  ExecutiveJournalRuntimePolicyDecision,
  ExecutiveJournalRuntimePolicyDecisionKind,
  ExecutiveJournalRuntimePolicyObligation,
  ExecutiveJournalRuntimePolicyObligationKind,
  ExecutiveJournalRuntimePolicyOperation,
  ExecutiveJournalRuntimePolicyRequest,
} from "./executiveJournalRuntimePolicyTypes.ts";

export interface ExecutiveJournalRuntimePolicyRuleDeclaration {
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
  readonly decision: ExecutiveJournalRuntimePolicyDecisionKind;
  readonly ruleId: string;
  readonly reason: string;
  readonly obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[];
  readonly confirmation: boolean;
};

const rule = (
  priority: number,
  ruleKey: string,
  family: string,
  description: string,
): ExecutiveJournalRuntimePolicyRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-2:5/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    family,
    priority,
    description,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalRuntimePolicyRules = Object.freeze([
  rule(1, "ValidationEvidenceRequired", "ValidationGate", "Missing validation evidence denies."),
  rule(2, "InvalidValidationDenies", "ValidationGate", "Invalid upstream validation denies."),
  rule(3, "UnknownOperationDenies", "ValidationGate", "Unknown operations deny."),
  rule(4, "AuthorityRequired", "Authority", "Consequential operations require authority_ref."),
  rule(5, "DelegationRevokedDenies", "Authority", "Revoked delegation denies."),
  rule(6, "DelegationExpiredDenies", "Authority", "Expired delegation denies."),
  rule(7, "DelegationOutOfScopeDenies", "Authority", "Out-of-scope delegation denies."),
  rule(8, "HumanConfirmationRequired", "HumanConfirmation", "Consequential human actions require confirmation."),
  rule(9, "AiCannotConfirm", "AiBoundary", "AI cannot confirm decisions."),
  rule(10, "AiCannotCreateAuthority", "AiBoundary", "AI cannot create or broaden authority."),
  rule(11, "AiCannotCloseCommitment", "AiBoundary", "AI cannot close commitments."),
  rule(12, "AiCannotDiscloseOrExport", "AiBoundary", "AI cannot disclose or export restricted material."),
  rule(13, "AiCannotAlterRetentionOrDispose", "AiBoundary", "AI cannot alter retention or dispose."),
  rule(14, "AiProposeNonAuthoritative", "AiBoundary", "AI propose remains non-authoritative."),
  rule(15, "PrivateReflectionSharedSearchDenies", "PrivateReflection", "Private reflection denied for shared search."),
  rule(16, "PrivateReflectionSharedProjectDenies", "PrivateReflection", "Private reflection denied for shared projection."),
  rule(17, "PrivateReflectionExportDenies", "PrivateReflection", "Private reflection denied for export by default."),
  rule(18, "PrivateReflectionAutomationDenies", "PrivateReflection", "Private reflection denied for automation and AI retrieval."),
  rule(19, "PrivateReflectionPromotionConfirms", "PrivateReflection", "Promotion requires human confirmation."),
  rule(20, "DisclosureFailClosed", "Disclosure", "Disclosure fails closed on missing or unknown inputs."),
  rule(21, "ExportRequiresAuthorityAndConfirmation", "Export", "Export requires authority and confirmation."),
  rule(22, "RetentionRequiresAuthorityAndConfirmation", "RetentionDisposition", "Retention change requires authority and confirmation."),
  rule(23, "DispositionRequiresAuthorityConfirmationEvidence", "RetentionDisposition", "Disposition requires authority, confirmation, and evidence."),
  rule(24, "EvidenceRequired", "Evidence", "Missing mandatory evidence denies."),
  rule(25, "JurisdictionRequired", "Jurisdiction", "Required unknown jurisdiction fails closed."),
  rule(26, "BreakGlassBounded", "BreakGlass", "Break-glass requires bounded human metadata and review."),
  rule(27, "CanonicalAllow", "AllowGate", "Explicit allow only when all mandatory gates pass."),
] as const);

const OPERATIONS = ExecutiveJournalRuntimePolicyOperations as readonly string[];

const CONSEQUENTIAL = Object.freeze([
  "Confirm",
  "Accept",
  "Correct",
  "Dispute",
  "ResolveDispute",
  "Supersede",
  "CreateCommitment",
  "CloseCommitment",
  "Disclose",
  "Export",
  "PromotePrivateReflection",
  "ApplyRetention",
  "Dispose",
  "BreakGlassAccess",
] as const);

const CONFIRMATION_OPS = Object.freeze([
  "Confirm",
  "Accept",
  "CreateCommitment",
  "CloseCommitment",
  "PromotePrivateReflection",
  "Disclose",
  "Export",
  "ApplyRetention",
  "Dispose",
  "BreakGlassAccess",
] as const);

const DISCLOSURE_OPS = Object.freeze([
  "Read",
  "Search",
  "Disclose",
  "Export",
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
): operation is ExecutiveJournalRuntimePolicyOperation =>
  OPERATIONS.includes(operation);

const obligation = (
  kind: ExecutiveJournalRuntimePolicyObligationKind,
  order: number,
  description: string,
): ExecutiveJournalRuntimePolicyObligation =>
  Object.freeze({
    obligationId: `RTC-2:5/Obligation/${kind}`,
    kind,
    description,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

const OBLIGATION_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveJournalRuntimePolicyObligationKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveJournalRuntimePolicyObligationKind, number>>,
);

const dedupeObligations = (
  kinds: readonly ExecutiveJournalRuntimePolicyObligationKind[],
): readonly ExecutiveJournalRuntimePolicyObligation[] => {
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
  decision: ExecutiveJournalRuntimePolicyDecisionKind,
  ruleKey: string,
  reason: string,
  obligations: readonly ExecutiveJournalRuntimePolicyObligationKind[] = [],
  confirmation = false,
): MatchEffect => {
  const declared = ExecutiveJournalRuntimePolicyRules.find(
    (item) => item.ruleKey === ruleKey,
  );
  return Object.freeze({
    decision,
    ruleId: declared?.ruleId ?? `RTC-2:5/Rule/${ruleKey}`,
    reason,
    obligations: Object.freeze([...obligations]),
    confirmation,
  });
};

const collectEffects = (
  request: ExecutiveJournalRuntimePolicyRequest,
): readonly MatchEffect[] => {
  const matches: MatchEffect[] = [];
  const op = request.operation;
  const actorIsAi = request.actorKind === "Ai";
  const privateReflection = request.recordCategory === "PrivateReflection";
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
  }

  // Warnings do not deny (RTC-1:5 has no warning-deny semantics for packages).
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

  if (request.delegation) {
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
    if (op === "Confirm" || op === "Accept") {
      matches.push(
        effect("Deny", "AiCannotConfirm", "AI cannot confirm decisions."),
      );
    }
    if (
      op === "Propose"
      && request.targetEntityKind === "AuthorityReference"
    ) {
      matches.push(
        effect(
          "Deny",
          "AiCannotCreateAuthority",
          "AI cannot create or broaden authority.",
        ),
      );
    }
    if (op === "CloseCommitment") {
      matches.push(
        effect(
          "Deny",
          "AiCannotCloseCommitment",
          "AI cannot close commitments.",
        ),
      );
    }
    if (op === "Disclose" || op === "Export") {
      matches.push(
        effect(
          "Deny",
          "AiCannotDiscloseOrExport",
          "AI cannot disclose or export restricted material.",
        ),
      );
    }
    if (op === "ApplyRetention" || op === "Dispose") {
      matches.push(
        effect(
          "Deny",
          "AiCannotAlterRetentionOrDispose",
          "AI cannot alter retention or dispose records.",
        ),
      );
    }
    if (op === "Propose" && !privateReflection && isPresent(request.purpose)) {
      matches.push(
        effect(
          "Allow",
          "AiProposeNonAuthoritative",
          "AI may propose non-authoritative metadata only.",
        ),
      );
    }
    if (
      (CONFIRMATION_OPS as readonly string[]).includes(op)
      && op !== "Propose"
    ) {
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
    if (op === "Search") {
      matches.push(
        effect(
          "Deny",
          "PrivateReflectionSharedSearchDenies",
          "Private reflection cannot enter shared search.",
        ),
      );
    }
    if (op === "Project") {
      matches.push(
        effect(
          "Deny",
          "PrivateReflectionSharedProjectDenies",
          "Private reflection cannot enter shared projection.",
        ),
      );
    }
    if (op === "Export" || op === "Disclose") {
      matches.push(
        effect(
          "Deny",
          "PrivateReflectionExportDenies",
          "Private reflection cannot be exported or disclosed by default.",
        ),
      );
    }
    if (
      op === "Read"
      && request.requestedScope.includes("automation")
    ) {
      matches.push(
        effect(
          "Deny",
          "PrivateReflectionAutomationDenies",
          "Private reflection cannot enter automation or AI retrieval.",
        ),
      );
    }
    if (op === "PromotePrivateReflection" && !actorIsAi) {
      matches.push(
        effect(
          "RequireConfirmation",
          "PrivateReflectionPromotionConfirms",
          "Promotion of private reflection requires human confirmation.",
          [
            "RequireHumanConfirmation",
            "RequireAuthorityEvidence",
            "RequireEvidenceReference",
          ],
          true,
        ),
      );
    }
  }

  if ((DISCLOSURE_OPS as readonly string[]).includes(op)) {
    if (
      !isPresent(request.purpose)
      || !isPresent(request.classification)
      || !isPresent(request.recordCategory)
      || request.classification === "Unknown"
      || request.purpose === "Unknown"
    ) {
      matches.push(
        effect(
          "Deny",
          "DisclosureFailClosed",
          "Disclosure denied.",
          ["RequireFieldFiltering", "RequirePurposeBinding"],
        ),
      );
    }
  }

  if (op === "Export" && !actorIsAi) {
    matches.push(
      effect(
        "RequireConfirmation",
        "ExportRequiresAuthorityAndConfirmation",
        "Export requires authority and confirmation.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireExportEvidence",
          "RequirePurposeBinding",
        ],
        true,
      ),
    );
    if (!isPresent(request.exportPolicyRef)) {
      matches.push(
        effect(
          "Deny",
          "EvidenceRequired",
          "Export requires explicit export-policy evidence reference.",
          ["RequireExportEvidence"],
        ),
      );
    }
  }

  if (op === "ApplyRetention" && !actorIsAi) {
    matches.push(
      effect(
        "RequireConfirmation",
        "RetentionRequiresAuthorityAndConfirmation",
        "Retention change requires authority and confirmation.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireEvidenceReference",
        ],
        true,
      ),
    );
    if (!isPresent(request.retentionPolicyRef)) {
      matches.push(
        effect(
          "Deny",
          "EvidenceRequired",
          "Retention change requires explicit retention-policy reference.",
          ["RequireEvidenceReference"],
        ),
      );
    }
  }

  if (op === "Dispose" && !actorIsAi) {
    matches.push(
      effect(
        "RequireConfirmation",
        "DispositionRequiresAuthorityConfirmationEvidence",
        "Disposition requires authority, confirmation, and evidence.",
        [
          "RequireHumanConfirmation",
          "RequireAuthorityEvidence",
          "RequireDispositionEvidence",
          "RequireEvidenceReference",
        ],
        true,
      ),
    );
    if (
      !isPresent(request.dispositionPolicyRef)
      || request.evidenceRefs.length === 0
    ) {
      matches.push(
        effect(
          "Deny",
          "EvidenceRequired",
          "Disposition requires disposition-policy and evidence references.",
          ["RequireDispositionEvidence"],
        ),
      );
    }
  }

  if (
    consequential
    && request.evidenceRefs.length === 0
    && (op === "Confirm" || op === "Accept" || op === "CloseCommitment")
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

  if (
    request.jurisdictionRequired
    && (!isPresent(request.jurisdictionContext)
      || request.jurisdictionContext === "Unknown")
  ) {
    matches.push(
      effect(
        "Deny",
        "JurisdictionRequired",
        "Required jurisdiction context is missing or unknown.",
      ),
    );
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
    if (privateReflection) {
      matches.push(
        effect(
          "Deny",
          "PrivateReflectionAutomationDenies",
          "Break-glass does not automatically bypass private-reflection protections.",
        ),
      );
    }
  }

  if (
    !actorIsAi
    && (CONFIRMATION_OPS as readonly string[]).includes(op)
    && op !== "Export"
    && op !== "ApplyRetention"
    && op !== "Dispose"
    && op !== "BreakGlassAccess"
    && op !== "PromotePrivateReflection"
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
    matches.every((item) => item.decision !== "Deny")
    && (
      op === "Propose"
      || op === "Read"
      || op === "Project"
      || op === "Search"
    )
    && !privateReflection
    && !actorIsAi
    && request.validation?.valid === true
    && isPresent(request.purpose)
  ) {
    matches.push(
      effect(
        "Allow",
        "CanonicalAllow",
        "Explicit allow after mandatory gates.",
        op === "Read" || op === "Search" || op === "Project"
          ? ["RequirePurposeBinding", "RequireFieldFiltering"]
          : [],
      ),
    );
  }

  if (
    matches.every((item) => item.decision !== "Deny")
    && op === "Propose"
    && actorIsAi
    && !privateReflection
    && request.validation?.valid === true
    && isPresent(request.purpose)
    && !matches.some((item) => item.ruleId.includes("AiPropose"))
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
): ExecutiveJournalRuntimePolicyDecisionKind => {
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
  decision: ExecutiveJournalRuntimePolicyDecisionKind,
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
export function evaluateExecutiveJournalRuntimePolicy(
  request: ExecutiveJournalRuntimePolicyRequest,
): ExecutiveJournalRuntimePolicyDecision {
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

  // Denied disclosure/search/export must not leak protected metadata in reason.
  const safeReason =
    decision === "Deny"
    && (DISCLOSURE_OPS as readonly string[]).includes(request.operation)
      ? "Disclosure denied."
      : reason;

  const needsConfirmation =
    decision === "RequireConfirmation"
    || selected.some((item) => item.confirmation);

  const confirmation: ExecutiveJournalRuntimePolicyConfirmationRequirement | null =
    needsConfirmation
      ? Object.freeze({
          proposedEffect: request.proposedEffect,
          confirmingActor: request.actorId,
          requiredAuthority: request.authorityRef ?? "authority_ref_required",
          evidenceToDisplay: Object.freeze([...request.evidenceRefs]),
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
    subjectId: request.actorId,
    targetId: request.targetEntityId,
    purpose: request.purpose,
    reason: safeReason,
    obligations,
    validationOutcome,
    policyId: ExecutiveJournalRuntimePolicyId,
    policyVersion: ExecutiveJournalRuntimePolicyVersion,
    evidenceRefs: Object.freeze([...request.evidenceRefs]),
    confirmation,
    revealsProtectedMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export function isExecutiveJournalPolicyAllowed(
  decision: ExecutiveJournalRuntimePolicyDecision,
): boolean {
  return decision.decision === "Allow";
}

export function isExecutiveJournalPolicyDenied(
  decision: ExecutiveJournalRuntimePolicyDecision,
): boolean {
  return decision.decision === "Deny";
}

export function isExecutiveJournalPolicyConfirmationRequired(
  decision: ExecutiveJournalRuntimePolicyDecision,
): boolean {
  return decision.decision === "RequireConfirmation";
}

/** Structural conflict-safety check for the sealed rule catalogue. */
export function validateExecutiveJournalPolicyRuleCatalogue():
  ExecutiveJournalRuntimePolicyDecision {
  const ids = ExecutiveJournalRuntimePolicyRules.map((item) => item.ruleId);
  const keys = ExecutiveJournalRuntimePolicyRules.map((item) => item.ruleKey);
  const priorities = ExecutiveJournalRuntimePolicyRules.map(
    (item) => item.priority,
  );
  const unique =
    new Set(ids).size === ids.length
    && new Set(keys).size === keys.length
    && new Set(priorities).size === priorities.length
    && ExecutiveJournalRuntimeValidation.readiness === "ReadyForManifest";

  return evaluateExecutiveJournalRuntimePolicy(
    Object.freeze({
      requestId: "RTC-2:5/catalogue-check",
      operation: "Propose",
      actorId: "system-steward",
      actorKind: "Human",
      authorityRef: "authority-catalogue",
      delegation: null,
      purpose: "catalogue-integrity",
      targetJournalId: "RTC-JRN-00000001",
      targetEntityKind: "Intent",
      targetEntityId: "catalogue",
      recordCategory: "ExecutiveRecord",
      classification: "internal",
      proposedEffect: "verify-catalogue",
      evidenceRefs: Object.freeze(["catalogue-evidence"]),
      lifecycleState: "Accepted",
      requestedScope: Object.freeze(["catalogue"]),
      jurisdictionContext: null,
      jurisdictionRequired: false,
      breakGlass: null,
      validation: Object.freeze({
        outcome: unique ? ("Valid" as const) : ("Invalid" as const),
        valid: unique,
        warningCount: 0,
        errorCount: unique ? 0 : 1,
      }),
      retentionPolicyRef: null,
      dispositionPolicyRef: null,
      exportPolicyRef: null,
      dualControlRequired: false,
    }),
  );
}
