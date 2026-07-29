/**
 * RTC-3:4 — Executive Decision Register Validation Rules.
 *
 * Canonical rule declarations and pure deterministic evaluation.
 * Never mutates inputs. Never repairs. Never uses clock/network/randomness.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

import { ExecutiveDecisionRegisterModel } from "./executiveDecisionRegisterModel.ts";
import { isWellFormedDecisionRegisterValidationIdentity } from "./executiveDecisionRegisterValidationIdentity.ts";
import type {
  ExecutiveDecisionRegisterEntityInstance,
  ExecutiveDecisionRegisterRelationshipInstance,
  ExecutiveDecisionRegisterTelemetryDescriptor,
  ExecutiveDecisionRegisterValidationIssue,
  ExecutiveDecisionRegisterValidationIssueCode,
  ExecutiveDecisionRegisterValidationResult,
  ExecutiveDecisionRegisterValidationRuleFamily,
  ExecutiveDecisionRegisterValidationSeverity,
  ExecutiveDecisionRegisterValidationSubjectKind,
} from "./executiveDecisionRegisterValidationTypes.ts";

const ENTITY_KINDS = ExecutiveDecisionRegisterModel.entityNames;
const AUTHORITY = ExecutiveDecisionRegisterModel.stateDistinctions.authority;
const ORIGIN = ExecutiveDecisionRegisterModel.stateDistinctions.origin;
const LIFECYCLE =
  ExecutiveDecisionRegisterModel.stateDistinctions.decisionLifecycle;
const CURRENCY = ExecutiveDecisionRegisterModel.stateDistinctions.currency;
const DISPUTE = ExecutiveDecisionRegisterModel.stateDistinctions.dispute;
const CLOSURE = ExecutiveDecisionRegisterModel.stateDistinctions.closure;
const DISPOSITION = ExecutiveDecisionRegisterModel.stateDistinctions.disposition;
const EVIDENCE = ExecutiveDecisionRegisterModel.stateDistinctions.evidence;
const PRIVACY = ExecutiveDecisionRegisterModel.stateDistinctions.privacy;
const RELATIONSHIPS = ExecutiveDecisionRegisterModel.relationshipKinds;

const DELEGATION_FIELDS = Object.freeze([
  "delegator",
  "delegate",
  "scope",
  "effective_point",
  "expiry",
  "revocation_state",
  "evidence_reference",
] as const);

const ALLOWED_TELEMETRY_FIELDS = Object.freeze([
  "entity_kind",
  "lifecycle_state",
  "event_count",
  "sequence_position",
  "projection_version",
  "validation_result_code",
  "policy_result_code",
  "integrity_result_code",
  "correlation_identity",
] as const);

const FORBIDDEN_TELEMETRY_FIELDS = Object.freeze([
  "decision_claim",
  "rationale",
  "evidence_content",
  "private_content",
  "privileged_content",
  "restricted_title",
  "restricted_snippet",
  "export_content",
  "decrypted_value",
  "payload",
] as const);

export interface ExecutiveDecisionRegisterValidationRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly family: ExecutiveDecisionRegisterValidationRuleFamily;
  readonly severity: ExecutiveDecisionRegisterValidationSeverity;
  readonly executionOrder: number;
  readonly upstreamContract: string;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly mutatesState: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  executionOrder: number,
  ruleKey: string,
  family: ExecutiveDecisionRegisterValidationRuleFamily,
  severity: ExecutiveDecisionRegisterValidationSeverity,
  upstreamContract: string,
  description: string,
): ExecutiveDecisionRegisterValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-3:4/Rule/${String(executionOrder).padStart(2, "0")}`,
    ruleKey,
    family,
    severity,
    executionOrder,
    upstreamContract,
    description,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Canonical ordered rule catalogue. */
export const ExecutiveDecisionRegisterValidationRules = Object.freeze([
  rule(1, "CanonicalIdentityFormat", "Identity", "Critical", "DecisionRegisterValidationResult", "Canonical identities must be well-formed without normalization."),
  rule(2, "ExactModelNamespace", "Identity", "Critical", "DecisionRegisterValidationResult", "Model namespace must equal nexora.rtc.executive.decision.register.model."),
  rule(3, "KnownEntityKind", "Identity", "Error", "DecisionRegisterValidationResult", "Entity kind must be one of the fourteen canonical kinds."),
  rule(4, "UniqueEntityIdentity", "Identity", "Error", "DecisionRegisterValidationResult", "Entity identities within a collection must be unique."),
  rule(5, "KnownSubjectKind", "Identity", "Error", "DecisionRegisterValidationResult", "Unknown validation subjects fail closed."),
  rule(6, "RequiredFieldsPresent", "Structure", "Error", "DecisionRegisterModelEntity", "Required structural fields must be present."),
  rule(7, "ClosedVocabularyMembership", "Structure", "Error", "DecisionRegisterModelEntity", "Closed vocabulary values must be recognized."),
  rule(8, "CanonicalModelStructure", "Structure", "Critical", "DecisionRegisterModelEntity", "Canonical RTC-3:3 model must expose fourteen entities and registry-resolved foundation."),
  rule(9, "ProposedNonAuthoritative", "Lifecycle", "Error", "DecisionRegisterModelEntity", "Proposed state must remain NonAuthoritative."),
  rule(10, "ConfirmedRequiresAuthorityAndHuman", "Lifecycle", "Error", "DecisionRegisterModelConfirmation", "Confirmed state requires authority and human confirmation."),
  rule(11, "EffectiveRequiresConfirmedAuthority", "Lifecycle", "Error", "DecisionRegisterModelAuthority", "Effective state requires confirmed authoritative decision."),
  rule(12, "DisputedRequiresChallengedRef", "Lifecycle", "Error", "DecisionRegisterModelLineage", "Disputed state requires challenged reference."),
  rule(13, "SupersededRequiresPredecessor", "Lifecycle", "Error", "DecisionRegisterModelLineage", "Superseded state requires predecessor reference."),
  rule(14, "ClosedRequiresClosureMetadata", "Lifecycle", "Error", "DecisionRegisterModelEntity", "Closed state requires explicit closure metadata."),
  rule(15, "DisposedRequiresGovernanceEvidence", "Disposition", "Error", "DecisionRegisterModelLineage", "Disposed state requires governance evidence."),
  rule(16, "DisposedToActiveRejected", "Disposition", "Critical", "DecisionRegisterModelLineage", "Disposed-to-active reversal is rejected."),
  rule(17, "AuthorityRefRequired", "Authority", "Error", "DecisionRegisterModelAuthority", "Consequential authoritative state requires authority_ref."),
  rule(18, "DelegationComplete", "Authority", "Error", "DecisionRegisterModelAuthority", "Delegation requires delegator, delegate, scope, times, revocation, and evidence."),
  rule(19, "DelegationRevocationAndExpiry", "Authority", "Error", "DecisionRegisterModelAuthority", "Revoked or expired delegation cannot authorize."),
  rule(20, "AuthoritySubstituteRejected", "Authority", "Critical", "DecisionRegisterModelAuthority", "Identity, title, role, attendance, silence, or AI confidence cannot substitute for authority."),
  rule(21, "HumanConfirmationRequired", "Confirmation", "Error", "DecisionRegisterModelConfirmation", "Authoritative confirmation requires a human confirmer."),
  rule(22, "ConfirmationBindingExact", "Confirmation", "Error", "DecisionRegisterModelConfirmation", "Confirmation must bind exact proposal, effect, authority, and evidence."),
  rule(23, "CorrectionPreservesOriginal", "AppendOnly", "Error", "DecisionRegisterModelLineage", "Corrections must preserve original decision and affected event references."),
  rule(24, "DisputePreservesChallenged", "AppendOnly", "Error", "DecisionRegisterModelLineage", "Disputes must preserve challenged references; resolutions preserve dispute refs."),
  rule(25, "SupersessionLineage", "AppendOnly", "Error", "DecisionRegisterModelLineage", "Supersession must preserve distinct predecessor and successor without cycles."),
  rule(26, "ReopenRequiresNewEvent", "AppendOnly", "Error", "DecisionRegisterModelLineage", "Reopening requires a new event relationship."),
  rule(27, "ProvenanceComplete", "Provenance", "Error", "DecisionRegisterModelProvenance", "Authoritative and derived states require producing-event provenance."),
  rule(28, "DerivedNotAuthoritative", "Provenance", "Error", "DecisionRegisterModelProjection", "Derived state must not be marked Authoritative."),
  rule(29, "EvidenceCategoryClosed", "Evidence", "Error", "DecisionRegisterModelEvidence", "Evidence category must be closed and complete for its kind."),
  rule(30, "ProjectionConstraints", "Projection", "Error", "DecisionRegisterModelProjection", "Projections require source events/derivation and cannot create authority or hide disputes."),
  rule(31, "PrivateReflectionOutsideModel", "Privacy", "Critical", "DecisionRegisterModelPrivacy", "Private reflection must not be represented as a DecisionRecord."),
  rule(32, "RestrictedClassificationRequired", "Privacy", "Error", "DecisionRegisterModelPrivacy", "Restricted/regulated records require classification."),
  rule(33, "AiBoundaryRejected", "AiBoundary", "Critical", "DecisionRegisterModelAiBoundary", "AI must not confirm, authorize, resolve, supersede, close, disclose, retain, dispose, or satisfy confirmation."),
  rule(34, "TelemetryPayloadExcluded", "Telemetry", "Critical", "DecisionRegisterModelTelemetry", "Routine telemetry must exclude claims, rationale, evidence content, private values, and decrypted content."),
  rule(35, "KnownRelationshipKind", "Structure", "Error", "DecisionRegisterModelLineage", "Relationship kinds must be canonical."),
] as const);

const RULE_BY_KEY = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionRegisterValidationRules.map((item) => [item.ruleKey, item]),
  ) as Readonly<
    Record<string, ExecutiveDecisionRegisterValidationRuleDeclaration>
  >,
);

const isPresent = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
};

const asString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const observedSafe = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    return value.length > 64 ? `${value.slice(0, 64)}…` : value;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return `array(${value.length})`;
  }
  return "object";
};

const issue = (
  ruleKey: string,
  issueCode: ExecutiveDecisionRegisterValidationIssueCode,
  subjectKind: ExecutiveDecisionRegisterValidationSubjectKind,
  subjectId: string,
  message: string,
  field: string | null,
  expected: string | null = null,
  observed: string | null = null,
): ExecutiveDecisionRegisterValidationIssue => {
  const declared = RULE_BY_KEY[ruleKey];
  const order = declared?.executionOrder ?? 99;
  const severity = declared?.severity ?? "Error";
  const ruleId = declared?.ruleId ?? `RTC-3:4/Rule/${ruleKey}`;
  const upstreamContract =
    declared?.upstreamContract ?? "DecisionRegisterValidationResult";
  return Object.freeze({
    ruleId,
    issueCode,
    severity,
    subjectKind,
    subjectId,
    message,
    field,
    expected,
    observed,
    upstreamContract,
    orderKey: [
      String(order).padStart(2, "0"),
      subjectKind,
      subjectId,
      issueCode,
      field ?? "-",
    ].join("|"),
    metadataOnly: true as const,
    immutable: true as const,
  });
};

const compareIssues = (
  left: ExecutiveDecisionRegisterValidationIssue,
  right: ExecutiveDecisionRegisterValidationIssue,
): number => {
  if (left.orderKey < right.orderKey) {
    return -1;
  }
  if (left.orderKey > right.orderKey) {
    return 1;
  }
  return 0;
};

export function finalizeExecutiveDecisionRegisterValidationIssues(
  issues: readonly ExecutiveDecisionRegisterValidationIssue[],
): ExecutiveDecisionRegisterValidationResult {
  const sorted = Object.freeze([...issues].sort(compareIssues));
  const errorCount = sorted.filter(
    (item) => item.severity === "Error" || item.severity === "Critical",
  ).length;
  const warningCount = sorted.filter((item) => item.severity === "Warning")
    .length;
  if (errorCount > 0) {
    return Object.freeze({
      outcome: "Invalid" as const,
      valid: false as const,
      issues: sorted,
      errorCount,
      warningCount,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }
  return Object.freeze({
    outcome: "Valid" as const,
    valid: true as const,
    issues: sorted,
    errorCount: 0 as const,
    warningCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export function isExecutiveDecisionRegisterValidationResultValid(
  result: ExecutiveDecisionRegisterValidationResult,
): boolean {
  return result.valid === true;
}

const isKnownKind = (kind: string): boolean =>
  (ENTITY_KINDS as readonly string[]).includes(kind);

const SUBJECT_KINDS = Object.freeze([
  "Model",
  "EntityDescriptor",
  "EntityInstance",
  "EntityCollection",
  "Relationship",
  "RelationshipSet",
  "TelemetryDescriptor",
  ...ENTITY_KINDS,
] as const);

export function isCanonicalDecisionRegisterValidationSubjectKind(
  value: unknown,
): value is ExecutiveDecisionRegisterValidationSubjectKind {
  return typeof value === "string"
    && (SUBJECT_KINDS as readonly string[]).includes(value);
}

const vocabularyMembers = (field: string): readonly string[] | null => {
  switch (field) {
    case "authority_state":
      return AUTHORITY;
    case "origin_state":
      return ORIGIN;
    case "decision_state":
      return LIFECYCLE;
    case "currency_state":
      return CURRENCY;
    case "dispute_state":
    case "resolution_state":
      return DISPUTE;
    case "closure_state":
      return CLOSURE;
    case "disposition_state":
      return DISPOSITION;
    case "evidence_category":
      return EVIDENCE;
    case "privacy_category":
    case "record_category":
      return PRIVACY;
    case "relationship_kind":
      return RELATIONSHIPS;
    default:
      return null;
  }
};

const subjectForKind = (
  kind: string,
): ExecutiveDecisionRegisterValidationSubjectKind =>
  isKnownKind(kind)
    ? (kind as ExecutiveDecisionRegisterValidationSubjectKind)
    : "EntityInstance";

/** Validate one entity instance / candidate decision record. */
export function validateExecutiveDecisionRegisterEntityInstance(
  instance: ExecutiveDecisionRegisterEntityInstance,
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  const subjectId = String(instance.entityId);
  const fields = instance.fields;
  const kind = instance.entityKind;
  const subjectKind = subjectForKind(kind);

  if (!isWellFormedDecisionRegisterValidationIdentity(instance.entityId)) {
    issues.push(
      issue(
        "CanonicalIdentityFormat",
        "MalformedIdentity",
        "EntityInstance",
        subjectId,
        "Entity identity is malformed and was not normalized.",
        "entityId",
        "non-empty trimmed string",
        observedSafe(instance.entityId),
      ),
    );
  }

  if (!isKnownKind(kind)) {
    issues.push(
      issue(
        "KnownEntityKind",
        "UnknownEntityKind",
        "EntityInstance",
        subjectId,
        `Unknown entity kind: ${kind}`,
        "entityKind",
        "one of 14 canonical kinds",
        kind,
      ),
    );
  }

  const requiredFields = fields.required_fields;
  if (Array.isArray(requiredFields)) {
    for (const fieldName of requiredFields) {
      if (typeof fieldName === "string" && !isPresent(fields[fieldName])) {
        issues.push(
          issue(
            "RequiredFieldsPresent",
            "MissingRequiredField",
            subjectKind,
            subjectId,
            `Missing required field: ${fieldName}`,
            fieldName,
            "present",
            "missing",
          ),
        );
      }
    }
  }

  for (const [fieldName, value] of Object.entries(fields)) {
    const members = vocabularyMembers(fieldName);
    if (members && isPresent(value) && typeof value === "string") {
      if (!(members as readonly string[]).includes(value)) {
        issues.push(
          issue(
            "ClosedVocabularyMembership",
            "UnknownVocabularyValue",
            subjectKind,
            subjectId,
            `Unknown vocabulary value for ${fieldName}: ${value}`,
            fieldName,
            members.join("|"),
            value,
          ),
        );
      }
    }
  }

  const authorityState = asString(fields.authority_state);
  const originState = asString(fields.origin_state);
  const decisionState = asString(fields.decision_state);
  const confirmationSource = asString(fields.confirmation_source);
  const actorKind = asString(fields.actor_kind);

  if (
    decisionState === "Proposed"
    && authorityState === "Authoritative"
  ) {
    issues.push(
      issue(
        "ProposedNonAuthoritative",
        "ProposedMarkedAuthoritative",
        subjectKind,
        subjectId,
        "Proposed state must remain NonAuthoritative.",
        "authority_state",
        "NonAuthoritative",
        authorityState,
      ),
    );
  }

  if (decisionState === "Confirmed") {
    if (!isPresent(fields.authority_ref)) {
      issues.push(
        issue(
          "ConfirmedRequiresAuthorityAndHuman",
          "MissingAuthorityRef",
          subjectKind,
          subjectId,
          "Confirmed state requires authority_ref.",
          "authority_ref",
        ),
      );
    }
    if (
      !isPresent(fields.confirmation_ref)
      && confirmationSource !== "HumanConfirmed"
      && actorKind !== "human"
    ) {
      issues.push(
        issue(
          "ConfirmedRequiresAuthorityAndHuman",
          "MissingHumanConfirmation",
          subjectKind,
          subjectId,
          "Confirmed state requires human confirmation.",
          "confirmation_ref",
        ),
      );
    }
  }

  if (
    decisionState === "Effective"
    && (
      authorityState !== "Authoritative"
      || (
        !isPresent(fields.confirmation_ref)
        && confirmationSource !== "HumanConfirmed"
      )
      || !isPresent(fields.authority_ref)
    )
  ) {
    issues.push(
      issue(
        "EffectiveRequiresConfirmedAuthority",
        "EffectiveWithoutConfirmedAuthority",
        subjectKind,
        subjectId,
        "Effective state requires confirmed authoritative decision.",
        "decision_state",
      ),
    );
  }

  if (
    (decisionState === "Disputed" || kind === "DecisionDispute")
    && !isPresent(fields.challenged_decision_ref)
    && !isPresent(fields.challenged_ref)
  ) {
    issues.push(
      issue(
        "DisputedRequiresChallengedRef",
        "MissingChallengedReference",
        subjectKind,
        subjectId,
        "Disputed state requires challenged decision reference.",
        "challenged_decision_ref",
      ),
    );
  }

  if (
    (decisionState === "Superseded" || kind === "DecisionSupersession")
    && !isPresent(fields.predecessor_decision)
    && !isPresent(fields.predecessor_ref)
  ) {
    issues.push(
      issue(
        "SupersededRequiresPredecessor",
        "MissingPredecessor",
        subjectKind,
        subjectId,
        "Superseded state requires predecessor reference.",
        "predecessor_decision",
      ),
    );
  }

  if (
    decisionState === "Closed"
    && !isPresent(fields.closure_metadata)
    && !isPresent(fields.closure_event_ref)
  ) {
    issues.push(
      issue(
        "ClosedRequiresClosureMetadata",
        "MissingClosureMetadata",
        subjectKind,
        subjectId,
        "Closed state requires explicit closure metadata.",
        "closure_metadata",
      ),
    );
  }

  if (
    decisionState === "Disposed"
    || asString(fields.disposition_state) === "Disposed"
    || kind === "DecisionDisposition"
  ) {
    if (
      !isPresent(fields.governance_evidence_refs)
      && !isPresent(fields.governance_event_ref)
      && !isPresent(fields.disposition_evidence_ref)
    ) {
      issues.push(
        issue(
          "DisposedRequiresGovernanceEvidence",
          "MissingDispositionEvidence",
          subjectKind,
          subjectId,
          "Disposed state requires governance evidence.",
          "governance_evidence_refs",
        ),
      );
    }
  }

  if (
    fields.disposed_to_active === true
    || (
      asString(fields.prior_disposition_state) === "Disposed"
      && asString(fields.disposition_state) === "Active"
    )
  ) {
    issues.push(
      issue(
        "DisposedToActiveRejected",
        "DisposedToActiveReversal",
        subjectKind,
        subjectId,
        "Disposed-to-active reversal is rejected.",
        "disposition_state",
      ),
    );
  }

  if (
    authorityState === "Authoritative"
    && !isPresent(fields.authority_ref)
  ) {
    issues.push(
      issue(
        "AuthorityRefRequired",
        "MissingAuthorityRef",
        subjectKind,
        subjectId,
        "Authoritative state requires authority_ref.",
        "authority_ref",
      ),
    );
  }

  if (
    isPresent(fields.authority_substitute)
    || fields.authority_from_identity === true
    || fields.authority_from_title === true
    || fields.authority_from_role === true
    || fields.authority_from_attendance === true
    || fields.authority_from_silence === true
    || fields.authority_from_ai_confidence === true
    || fields.authority_from_prior_access === true
    || fields.authority_from_client_assertion === true
    || fields.confirmation_from_attendance === true
    || fields.confirmation_from_silence === true
  ) {
    issues.push(
      issue(
        "AuthoritySubstituteRejected",
        "AuthoritySubstituteRejected",
        subjectKind,
        subjectId,
        "Identity, title, role, attendance, silence, prior access, client assertion, or AI confidence cannot substitute for authority or confirmation.",
        "authority_substitute",
      ),
    );
  }

  if (kind === "DecisionAuthority") {
    const delegationStarted =
      isPresent(fields.delegator) || isPresent(fields.delegate);
    if (delegationStarted) {
      for (const fieldName of DELEGATION_FIELDS) {
        if (!isPresent(fields[fieldName])) {
          issues.push(
            issue(
              "DelegationComplete",
              "IncompleteDelegation",
              subjectKind,
              subjectId,
              `Delegation missing ${fieldName}.`,
              fieldName,
            ),
          );
        }
      }
      if (asString(fields.revocation_state) === "Revoked") {
        issues.push(
          issue(
            "DelegationRevocationAndExpiry",
            "RevokedDelegation",
            subjectKind,
            subjectId,
            "Revoked delegation cannot authorize.",
            "revocation_state",
          ),
        );
      }
      if (fields.delegation_expired === true || fields.expired === true) {
        issues.push(
          issue(
            "DelegationRevocationAndExpiry",
            "ExpiredDelegation",
            subjectKind,
            subjectId,
            "Expired delegation cannot authorize.",
            "expiry",
          ),
        );
      }
    }
  }

  if (kind === "DecisionConfirmation") {
    if (actorKind === "ai" || confirmationSource === "AiProposed") {
      issues.push(
        issue(
          "HumanConfirmationRequired",
          "AiConfirmationRejected",
          subjectKind,
          subjectId,
          "AI cannot satisfy confirmation.",
          "actor_kind",
        ),
      );
    }
    if (
      isPresent(fields.expected_proposal_ref)
      && isPresent(fields.decision_proposal)
      && fields.expected_proposal_ref !== fields.decision_proposal
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "ConfirmationMismatch",
          subjectKind,
          subjectId,
          "Confirmation proposal reference mismatch.",
          "decision_proposal",
        ),
      );
    }
    if (
      isPresent(fields.expected_effect)
      && isPresent(fields.exact_proposed_decision_effect)
      && fields.expected_effect !== fields.exact_proposed_decision_effect
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "ConfirmationMismatch",
          subjectKind,
          subjectId,
          "Confirmation effect mismatch.",
          "exact_proposed_decision_effect",
        ),
      );
    }
    if (
      actorKind === "human"
      && confirmationSource === "HumanConfirmed"
      && isPresent(fields.decision_proposal)
      && isPresent(fields.exact_proposed_decision_effect)
      && isPresent(fields.authority_ref)
      && isPresent(fields.evidence_set)
      && isPresent(fields.confirmation_identity)
    ) {
      // Valid human confirmation path — no issue.
    } else if (
      actorKind === "human"
      && (
        !isPresent(fields.decision_proposal)
        || !isPresent(fields.authority_ref)
        || !isPresent(fields.evidence_set)
      )
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "MissingRequiredField",
          subjectKind,
          subjectId,
          "Human confirmation requires proposal, authority, and evidence bindings.",
          "confirmation_identity",
        ),
      );
    }
  }

  if (kind === "DecisionCorrection") {
    if (
      !isPresent(fields.corrected_decision_ref)
      && !isPresent(fields.original_decision_ref)
    ) {
      issues.push(
        issue(
          "CorrectionPreservesOriginal",
          "MissingOriginalReference",
          subjectKind,
          subjectId,
          "Correction must preserve original decision reference.",
          "corrected_decision_ref",
        ),
      );
    }
    if (
      !isPresent(fields.affected_event_ref)
      && !isPresent(fields.correction_of_event_ref)
    ) {
      issues.push(
        issue(
          "CorrectionPreservesOriginal",
          "MissingAffectedReference",
          subjectKind,
          subjectId,
          "Correction must preserve affected event reference.",
          "affected_event_ref",
        ),
      );
    }
  }

  if (kind === "DecisionDispute") {
    if (
      asString(fields.resolution_state) === "Resolved"
      && !isPresent(fields.active_dispute_ref)
      && !isPresent(fields.dispute_identity)
      && !isPresent(fields.resolution_event)
    ) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "MissingDisputeReference",
          subjectKind,
          subjectId,
          "Dispute resolution must preserve dispute reference.",
          "active_dispute_ref",
        ),
      );
    }
  }

  if (kind === "DecisionSupersession") {
    const predecessor =
      asString(fields.predecessor_decision) ?? asString(fields.predecessor_ref);
    const successor =
      asString(fields.successor_decision) ?? asString(fields.successor_ref);
    if (!isPresent(predecessor)) {
      issues.push(
        issue(
          "SupersessionLineage",
          "MissingPredecessor",
          subjectKind,
          subjectId,
          "Supersession requires predecessor.",
          "predecessor_decision",
        ),
      );
    }
    if (!isPresent(successor)) {
      issues.push(
        issue(
          "SupersessionLineage",
          "MissingSuccessor",
          subjectKind,
          subjectId,
          "Supersession requires successor.",
          "successor_decision",
        ),
      );
    }
    if (
      isPresent(predecessor)
      && isPresent(successor)
      && predecessor === successor
    ) {
      issues.push(
        issue(
          "SupersessionLineage",
          "CircularSupersession",
          subjectKind,
          subjectId,
          "Predecessor and successor must differ.",
          "successor_decision",
        ),
      );
    }
    if (fields.circular_supersession === true) {
      issues.push(
        issue(
          "SupersessionLineage",
          "CircularSupersession",
          subjectKind,
          subjectId,
          "Circular supersession is rejected.",
          "supersession_graph",
        ),
      );
    }
  }

  if (
    fields.reopened === true
    && !isPresent(fields.new_lifecycle_event_ref)
    && !isPresent(fields.reopen_event_ref)
  ) {
    issues.push(
      issue(
        "ReopenRequiresNewEvent",
        "MissingReopenEvent",
        subjectKind,
        subjectId,
        "Reopening requires a new event relationship.",
        "new_lifecycle_event_ref",
      ),
    );
  }

  if (
    authorityState === "Authoritative"
    || fields.derived === true
    || kind === "DecisionProjection"
    || kind === "DecisionRecord"
  ) {
    if (
      (authorityState === "Authoritative" || fields.derived === true)
      && !isPresent(fields.producing_event_refs)
      && !isPresent(fields.producing_event)
    ) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingProvenance",
          subjectKind,
          subjectId,
          "Authoritative/derived state requires producing-event provenance.",
          "producing_event_refs",
        ),
      );
    }
    if (
      (fields.derived === true || kind === "DecisionProjection")
      && !isPresent(fields.derivation_version)
    ) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingDerivationVersion",
          subjectKind,
          subjectId,
          "Derived state requires derivation version.",
          "derivation_version",
        ),
      );
    }
  }

  if (
    (fields.derived === true || kind === "DecisionProjection")
    && authorityState === "Authoritative"
  ) {
    issues.push(
      issue(
        "DerivedNotAuthoritative",
        "DerivedMarkedAuthoritative",
        subjectKind,
        subjectId,
        "Derived state must not be marked Authoritative.",
        "authority_state",
      ),
    );
  }

  if (kind === "DecisionEvidence") {
    const category = asString(fields.evidence_category);
    if (category && !(EVIDENCE as readonly string[]).includes(category)) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "UnknownEvidenceCategory",
          subjectKind,
          subjectId,
          `Unknown evidence category: ${category}`,
          "evidence_category",
        ),
      );
    }
    if (
      category === "VersionPinned"
      && !isPresent(fields.version_or_digest_ref)
      && !isPresent(fields.version_ref)
    ) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingEvidenceVersion",
          subjectKind,
          subjectId,
          "VersionPinned evidence requires version reference.",
          "version_or_digest_ref",
        ),
      );
    }
    if (
      category === "ContentAddressed"
      && !isPresent(fields.version_or_digest_ref)
      && !isPresent(fields.digest_ref)
    ) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingEvidenceDigest",
          subjectKind,
          subjectId,
          "ContentAddressed evidence requires digest reference.",
          "version_or_digest_ref",
        ),
      );
    }
  }

  if (kind === "DecisionProjection") {
    if (
      !isPresent(fields.producing_event_refs)
      && !isPresent(fields.source_event_refs)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingEvents",
          subjectKind,
          subjectId,
          "Projection requires producing-event references.",
          "producing_event_refs",
        ),
      );
    }
    if (
      fields.creates_authoritative_fact === true
      || fields.creates_authority === true
      || fields.confirms_decision === true
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionCreatesAuthority",
          subjectKind,
          subjectId,
          "Projection cannot create authoritative facts, authority, or confirmation.",
          "authority_limitations",
        ),
      );
    }
    if (fields.hides_dispute_status === true) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionHidesDispute",
          subjectKind,
          subjectId,
          "Projection cannot hide dispute status.",
          "cannot_hide_dispute_status",
        ),
      );
    }
  }

  if (
    kind === "DecisionRecord"
    && (
      fields.private_reflection === true
      || asString(fields.record_category) === "PrivateReflection"
      || asString(fields.privacy_category) === "PrivateReflection"
    )
  ) {
    issues.push(
      issue(
        "PrivateReflectionOutsideModel",
        "PrivateReflectionAsDecisionRecord",
        subjectKind,
        subjectId,
        "Private reflection must not be represented as a DecisionRecord.",
        "record_category",
      ),
    );
  }

  if (
    (
      asString(fields.record_category) === "RestrictedExecutiveRecord"
      || asString(fields.record_category) === "RegulatedOrPrivilegedRecord"
      || asString(fields.privacy_category) === "RestrictedExecutiveRecord"
      || asString(fields.privacy_category) === "RegulatedOrPrivilegedRecord"
    )
    && !isPresent(fields.classification)
  ) {
    issues.push(
      issue(
        "RestrictedClassificationRequired",
        "MissingClassification",
        subjectKind,
        subjectId,
        "Restricted/regulated records require classification.",
        "classification",
      ),
    );
  }

  // AI boundary — field combinations representing prohibited AI authority.
  if (
    originState === "AiProposed"
    && authorityState === "Authoritative"
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiMakeAuthoritative",
        subjectKind,
        subjectId,
        "AI proposal must remain NonAuthoritative.",
        "authority_state",
      ),
    );
  }
  if (
    confirmationSource === "AiProposed"
    || fields.ai_confirmed === true
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiConfirmDecision",
        subjectKind,
        subjectId,
        "AI must not confirm decisions.",
        "confirmation_source",
      ),
    );
  }
  if (
    kind === "DecisionAuthority"
    && (originState === "AiProposed" || fields.ai_created_authority === true)
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiCreateAuthority",
        subjectKind,
        subjectId,
        "AI must not create or broaden authority.",
        "origin_state",
      ),
    );
  }
  if (
    kind === "DecisionDispute"
    && asString(fields.resolution_state) === "Resolved"
    && (originState === "AiProposed" || fields.ai_resolved === true)
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiResolveDispute",
        subjectKind,
        subjectId,
        "AI must not resolve disputes.",
        "resolution_state",
      ),
    );
  }
  if (
    kind === "DecisionSupersession"
    && (originState === "AiProposed" || fields.ai_superseded === true)
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiSupersedeDecision",
        subjectKind,
        subjectId,
        "AI must not supersede effective decisions.",
        "origin_state",
      ),
    );
  }
  if (
    decisionState === "Closed"
    && (originState === "AiProposed" || fields.ai_closed === true)
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiCloseDecision",
        subjectKind,
        subjectId,
        "AI must not close decisions.",
        "decision_state",
      ),
    );
  }
  if (fields.ai_disclosed_restricted === true) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiDiscloseRestricted",
        subjectKind,
        subjectId,
        "AI must not disclose restricted material.",
        "ai_disclosed_restricted",
      ),
    );
  }
  if (fields.ai_changed_retention === true) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiChangeRetention",
        subjectKind,
        subjectId,
        "AI must not change retention.",
        "ai_changed_retention",
      ),
    );
  }
  if (
    kind === "DecisionDisposition"
    && (originState === "AiProposed" || fields.ai_disposed === true)
  ) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiDisposeRecord",
        subjectKind,
        subjectId,
        "AI must not dispose records.",
        "origin_state",
      ),
    );
  }
  if (fields.ai_satisfied_confirmation === true) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiSatisfyConfirmation",
        subjectKind,
        subjectId,
        "AI must not satisfy human confirmation.",
        "ai_satisfied_confirmation",
      ),
    );
  }

  if (kind === "DecisionOutcomeReference") {
    if (!isPresent(fields.decision_identity) && !isPresent(fields.decision_ref)) {
      issues.push(
        issue(
          "RequiredFieldsPresent",
          "MissingRequiredField",
          subjectKind,
          subjectId,
          "Outcome reference requires decision identity.",
          "decision_identity",
        ),
      );
    }
    if (
      !isPresent(fields.outcome_identity_or_ref)
      && !isPresent(fields.outcome_ref)
    ) {
      issues.push(
        issue(
          "RequiredFieldsPresent",
          "MissingOutcomeReference",
          subjectKind,
          subjectId,
          "Outcome reference requires outcome identity.",
          "outcome_identity_or_ref",
        ),
      );
    }
    if (!isPresent(fields.producing_event) && !isPresent(fields.producing_event_refs)) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingProducingEvent",
          subjectKind,
          subjectId,
          "Outcome reference requires producing event.",
          "producing_event",
        ),
      );
    }
    if (
      fields.require_outcome_completeness === true
      && !isPresent(fields.evidence)
      && !isPresent(fields.evidence_refs)
    ) {
      issues.push(
        issue(
          "RequiredFieldsPresent",
          "MissingRequiredField",
          subjectKind,
          subjectId,
          "Outcome reference requires evidence when completeness is asserted.",
          "evidence",
        ),
      );
    }
    if (
      fields.require_outcome_completeness === true
      && !isPresent(fields.provenance)
    ) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingProvenance",
          subjectKind,
          subjectId,
          "Outcome reference requires provenance when completeness is asserted.",
          "provenance",
        ),
      );
    }
    if (
      fields.require_outcome_completeness === true
      && !isPresent(fields.closure_relevance)
    ) {
      issues.push(
        issue(
          "RequiredFieldsPresent",
          "MissingRequiredField",
          subjectKind,
          subjectId,
          "Outcome reference requires explicit closure relevance.",
          "closure_relevance",
        ),
      );
    }
  }

  // --- Expanded fail-closed checks for RTC-3:4 verification coverage ---

  if (
    isPresent(fields.subject_kind)
    && !isCanonicalDecisionRegisterValidationSubjectKind(fields.subject_kind)
  ) {
    issues.push(
      issue(
        "KnownSubjectKind",
        "UnknownSubjectKind",
        "EntityInstance",
        subjectId,
        `Unknown validation subject: ${String(fields.subject_kind)}`,
        "subject_kind",
      ),
    );
  }

  if (
    isPresent(fields.declared_entity_kind)
    && asString(fields.declared_entity_kind) !== kind
  ) {
    issues.push(
      issue(
        "KnownEntityKind",
        "EntityKindMismatch",
        subjectKind,
        subjectId,
        "Entity kind does not match descriptor declaration.",
        "declared_entity_kind",
      ),
    );
  }

  if (
    fields.require_ordering_metadata === true
    && !isPresent(fields.deterministic_order)
    && !isPresent(fields.sequence_position)
  ) {
    issues.push(
      issue(
        "RequiredFieldsPresent",
        "MissingOrderingMetadata",
        subjectKind,
        subjectId,
        "Deterministic ordering metadata is required.",
        "deterministic_order",
      ),
    );
  }

  if (
    (kind === "DecisionRecord" || authorityState === "Authoritative")
    && fields.require_authority_completeness === true
  ) {
    if (!isPresent(fields.actor_ref) && !isPresent(fields.actor)) {
      issues.push(
        issue(
          "AuthorityRefRequired",
          "MissingActorRef",
          subjectKind,
          subjectId,
          "Authoritative state requires actor reference.",
          "actor_ref",
        ),
      );
    }
    if (!isPresent(fields.purpose)) {
      issues.push(
        issue(
          "AuthorityRefRequired",
          "MissingPurpose",
          subjectKind,
          subjectId,
          "Authoritative state requires purpose.",
          "purpose",
        ),
      );
    }
    if (!isPresent(fields.authority_scope) && !isPresent(fields.scope)) {
      issues.push(
        issue(
          "AuthorityRefRequired",
          "MissingAuthorityScope",
          subjectKind,
          subjectId,
          "Authoritative state requires authority scope.",
          "authority_scope",
        ),
      );
    }
    if (
      !isPresent(fields.authority_evidence_ref)
      && !isPresent(fields.evidence_reference)
      && !isPresent(fields.evidence_refs)
    ) {
      issues.push(
        issue(
          "AuthorityRefRequired",
          "MissingAuthorityEvidence",
          subjectKind,
          subjectId,
          "Authoritative state requires authority evidence.",
          "authority_evidence_ref",
        ),
      );
    }
  }

  if (kind === "DecisionConfirmation") {
    if (actorKind === "system" || originState === "SystemDerived") {
      issues.push(
        issue(
          "HumanConfirmationRequired",
          "SystemDerivedConfirmer",
          subjectKind,
          subjectId,
          "System-derived actor cannot satisfy confirmation.",
          "actor_kind",
        ),
      );
    }
    if (fields.unauthorized_confirmer === true) {
      issues.push(
        issue(
          "HumanConfirmationRequired",
          "UnauthorizedConfirmer",
          subjectKind,
          subjectId,
          "Unauthorized human confirmer is rejected.",
          "human_confirmer",
        ),
      );
    }
    if (
      isPresent(fields.expected_authority_ref)
      && isPresent(fields.authority_ref)
      && fields.expected_authority_ref !== fields.authority_ref
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "ConfirmationMismatch",
          subjectKind,
          subjectId,
          "Confirmation authority reference mismatch.",
          "authority_ref",
        ),
      );
    }
    if (
      isPresent(fields.expected_evidence_set)
      && isPresent(fields.evidence_set)
      && JSON.stringify(fields.expected_evidence_set)
        !== JSON.stringify(fields.evidence_set)
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "ConfirmationMismatch",
          subjectKind,
          subjectId,
          "Confirmation evidence-set mismatch.",
          "evidence_set",
        ),
      );
    }
    if (
      fields.require_confirmation_completeness === true
      && !isPresent(fields.confirmation_identity)
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "MissingConfirmationIdentity",
          subjectKind,
          subjectId,
          "Confirmation identity is required.",
          "confirmation_identity",
        ),
      );
    }
    if (
      fields.require_confirmation_completeness === true
      && fields.single_use !== true
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "MissingSingleUse",
          subjectKind,
          subjectId,
          "Confirmation requires single-use requirement.",
          "single_use",
        ),
      );
    }
    if (
      fields.policy_version_required === true
      && !isPresent(fields.policy_version_ref)
    ) {
      issues.push(
        issue(
          "ConfirmationBindingExact",
          "MissingPolicyVersion",
          subjectKind,
          subjectId,
          "Policy-version reference is required where applicable.",
          "policy_version_ref",
        ),
      );
    }
  }

  if (kind === "DecisionCorrection") {
    if (
      fields.require_correction_completeness === true
      && !isPresent(fields.new_producing_event_ref)
      && !isPresent(fields.producing_event_refs)
    ) {
      issues.push(
        issue(
          "CorrectionPreservesOriginal",
          "MissingProducingEvent",
          subjectKind,
          subjectId,
          "Correction requires a new producing-event reference.",
          "new_producing_event_ref",
        ),
      );
    }
    if (
      fields.in_place_replacement === true
      || fields.original_history_retained === false
    ) {
      issues.push(
        issue(
          "CorrectionPreservesOriginal",
          "InPlaceReplacement",
          subjectKind,
          subjectId,
          "Correction must not represent in-place historical replacement.",
          "original_history_retained",
        ),
      );
    }
  }

  if (kind === "DecisionDispute") {
    if (
      fields.require_dispute_completeness === true
      && !isPresent(fields.challenged_event_or_claim_ref)
      && !isPresent(fields.challenged_event_ref)
    ) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "MissingChallengedEvent",
          subjectKind,
          subjectId,
          "Dispute requires challenged event or claim reference.",
          "challenged_event_or_claim_ref",
        ),
      );
    }
    if (fields.require_dispute_completeness === true && !isPresent(fields.initiator)) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "MissingInitiator",
          subjectKind,
          subjectId,
          "Dispute requires initiator.",
          "initiator",
        ),
      );
    }
    if (fields.require_dispute_completeness === true && !isPresent(fields.basis)) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "MissingBasis",
          subjectKind,
          subjectId,
          "Dispute requires basis.",
          "basis",
        ),
      );
    }
    if (
      fields.require_dispute_completeness === true
      && !isPresent(fields.review_owner)
    ) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "MissingReviewOwner",
          subjectKind,
          subjectId,
          "Dispute requires review owner.",
          "review_owner",
        ),
      );
    }
    if (
      asString(fields.resolution_state) === "Resolved"
      && fields.require_resolution_completeness === true
    ) {
      if (!isPresent(fields.resolution_event)) {
        issues.push(
          issue(
            "DisputePreservesChallenged",
            "MissingDisputeReference",
            subjectKind,
            subjectId,
            "Resolved dispute requires resolution event.",
            "resolution_event",
          ),
        );
      }
      if (!isPresent(fields.resolution_authority)) {
        issues.push(
          issue(
            "DisputePreservesChallenged",
            "MissingResolutionAuthority",
            subjectKind,
            subjectId,
            "Resolved dispute requires resolution authority.",
            "resolution_authority",
          ),
        );
      }
      if (!isPresent(fields.evidence_refs) && !isPresent(fields.resolution_evidence)) {
        issues.push(
          issue(
            "DisputePreservesChallenged",
            "MissingResolutionEvidence",
            subjectKind,
            subjectId,
            "Resolved dispute requires evidence.",
            "evidence_refs",
          ),
        );
      }
    }
    if (fields.dispute_erased === true || fields.erases_dispute === true) {
      issues.push(
        issue(
          "DisputePreservesChallenged",
          "DisputeErased",
          subjectKind,
          subjectId,
          "Resolution must not erase the dispute.",
          "dispute_retained_on_resolution",
        ),
      );
    }
  }

  if (
    kind === "DecisionSupersession"
    && fields.require_supersession_completeness === true
  ) {
    if (!isPresent(fields.effective_point)) {
      issues.push(
        issue(
          "SupersessionLineage",
          "MissingEffectivePoint",
          subjectKind,
          subjectId,
          "Supersession requires effective point.",
          "effective_point",
        ),
      );
    }
    if (!isPresent(fields.authority_ref)) {
      issues.push(
        issue(
          "SupersessionLineage",
          "MissingSupersessionAuthority",
          subjectKind,
          subjectId,
          "Supersession requires authority.",
          "authority_ref",
        ),
      );
    }
    if (
      !isPresent(fields.rationale_or_evidence_ref)
      && !isPresent(fields.evidence_reference)
    ) {
      issues.push(
        issue(
          "SupersessionLineage",
          "MissingSupersessionEvidence",
          subjectKind,
          subjectId,
          "Supersession requires evidence/rationale reference.",
          "rationale_or_evidence_ref",
        ),
      );
    }
  }

  if (kind === "DecisionEvidence" && fields.require_evidence_completeness === true) {
    if (!isPresent(fields.evidence_identity)) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingEvidenceIdentity",
          subjectKind,
          subjectId,
          "Evidence identity is required.",
          "evidence_identity",
        ),
      );
    }
    if (!isPresent(fields.evidence_type)) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingEvidenceType",
          subjectKind,
          subjectId,
          "Evidence type is required.",
          "evidence_type",
        ),
      );
    }
    if (!isPresent(fields.availability_state)) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingAvailabilityState",
          subjectKind,
          subjectId,
          "Availability state is required.",
          "availability_state",
        ),
      );
    }
    if (!isPresent(fields.classification)) {
      issues.push(
        issue(
          "RestrictedClassificationRequired",
          "MissingClassification",
          subjectKind,
          subjectId,
          "Evidence classification is required.",
          "classification",
        ),
      );
    }
    if (!isPresent(fields.integrity_requirement)) {
      issues.push(
        issue(
          "EvidenceCategoryClosed",
          "MissingIntegrityRequirement",
          subjectKind,
          subjectId,
          "Integrity requirement is required.",
          "integrity_requirement",
        ),
      );
    }
  }

  if (
    (authorityState === "Authoritative" || fields.derived === true)
    && fields.require_provenance_completeness === true
  ) {
    if (!isPresent(fields.source_register) && !isPresent(fields.register_id)) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingSourceRegister",
          subjectKind,
          subjectId,
          "Provenance requires source register.",
          "source_register",
        ),
      );
    }
    if (
      !isPresent(fields.event_version)
      && !isPresent(fields.sequence_position)
      && !isPresent(fields.journal_sequence)
    ) {
      issues.push(
        issue(
          "ProvenanceComplete",
          "MissingEventVersionOrSequence",
          subjectKind,
          subjectId,
          "Provenance requires event version or sequence metadata.",
          "event_version",
        ),
      );
    }
  }

  if (kind === "DecisionProjection") {
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.projection_identity)
      && !isPresent(fields.projection_version)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingIdentity",
          subjectKind,
          subjectId,
          "Projection requires identity/version.",
          "projection_identity",
        ),
      );
    }
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.source_register)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingSourceRegister",
          subjectKind,
          subjectId,
          "Projection requires source register.",
          "source_register",
        ),
      );
    }
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.source_sequence_position_or_range)
      && !isPresent(fields.sequence_position)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingSequence",
          subjectKind,
          subjectId,
          "Projection requires sequence position or range.",
          "source_sequence_position_or_range",
        ),
      );
    }
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.staleness_metadata)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingStaleness",
          subjectKind,
          subjectId,
          "Projection requires staleness metadata.",
          "staleness_metadata",
        ),
      );
    }
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.authority_limitations)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionMissingAuthorityLimitations",
          subjectKind,
          subjectId,
          "Projection requires authority limitations.",
          "authority_limitations",
        ),
      );
    }
    if (
      fields.require_projection_completeness === true
      && !isPresent(fields.provenance)
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "MissingProvenance",
          subjectKind,
          subjectId,
          "Projection requires provenance.",
          "provenance",
        ),
      );
    }
    if (fields.confirms_decision === true) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionConfirmsDecisions",
          subjectKind,
          subjectId,
          "Projection cannot confirm decisions.",
          "cannot_confirm_decisions",
        ),
      );
    }
    if (
      fields.erases_historical_lineage === true
      || fields.cannot_erase_historical_lineage === false
    ) {
      issues.push(
        issue(
          "ProjectionConstraints",
          "ProjectionErasesLineage",
          subjectKind,
          subjectId,
          "Projection cannot erase historical lineage.",
          "cannot_erase_historical_lineage",
        ),
      );
    }
  }

  if (
    isPresent(fields.privacy_category)
    && typeof fields.privacy_category === "string"
    && !(PRIVACY as readonly string[]).includes(fields.privacy_category)
  ) {
    issues.push(
      issue(
        "ClosedVocabularyMembership",
        "UnknownPrivacyCategory",
        subjectKind,
        subjectId,
        `Unknown privacy category: ${fields.privacy_category}`,
        "privacy_category",
      ),
    );
  }

  if (fields.automatic_private_reflection_promotion === true) {
    issues.push(
      issue(
        "PrivateReflectionOutsideModel",
        "AutomaticPromotion",
        subjectKind,
        subjectId,
        "Automatic private-reflection promotion is rejected.",
        "automatic_private_reflection_promotion",
      ),
    );
  }

  if (
    fields.cross_category_conversion === true
    && !isPresent(fields.new_authorized_event_ref)
  ) {
    issues.push(
      issue(
        "PrivateReflectionOutsideModel",
        "CrossCategoryConversion",
        subjectKind,
        subjectId,
        "Cross-category conversion requires a new authorized event reference.",
        "new_authorized_event_ref",
      ),
    );
  }

  if (kind === "DecisionDisposition") {
    if (
      fields.require_disposition_completeness === true
      && !isPresent(fields.actor)
      && !isPresent(fields.actor_ref)
      && actorKind !== "human"
    ) {
      issues.push(
        issue(
          "DisposedRequiresGovernanceEvidence",
          "MissingDispositionActor",
          subjectKind,
          subjectId,
          "Disposition requires a human actor.",
          "actor",
        ),
      );
    }
    if (
      fields.require_disposition_completeness === true
      && !isPresent(fields.authority_ref)
    ) {
      issues.push(
        issue(
          "DisposedRequiresGovernanceEvidence",
          "MissingDispositionAuthority",
          subjectKind,
          subjectId,
          "Disposition requires authority.",
          "authority_ref",
        ),
      );
    }
    if (
      fields.require_disposition_completeness === true
      && !isPresent(fields.record_category)
      && !isPresent(fields.privacy_category)
    ) {
      issues.push(
        issue(
          "RestrictedClassificationRequired",
          "MissingClassification",
          subjectKind,
          subjectId,
          "Disposition requires record category.",
          "record_category",
        ),
      );
    }
    if (
      fields.historical_erasure === true
      || fields.history_retained === false
    ) {
      issues.push(
        issue(
          "DisposedRequiresGovernanceEvidence",
          "HistoricalErasure",
          subjectKind,
          subjectId,
          "Disposition must not represent historical erasure.",
          "history_retained",
        ),
      );
    }
  }

  if (fields.ai_broadened_authority === true) {
    issues.push(
      issue(
        "AiBoundaryRejected",
        "AiBroadenAuthority",
        subjectKind,
        subjectId,
        "AI must not broaden authority.",
        "ai_broadened_authority",
      ),
    );
  }

  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Validate an immutable candidate collection. */
export function validateExecutiveDecisionRegisterEntityCollection(
  instances: readonly ExecutiveDecisionRegisterEntityInstance[],
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  const seen = new Map<string, string>();
  for (const instance of instances) {
    const result = validateExecutiveDecisionRegisterEntityInstance(instance);
    issues.push(...result.issues);
    const key = `${instance.entityKind}:${instance.entityId}`;
    const prior = seen.get(key);
    if (prior !== undefined) {
      issues.push(
        issue(
          "UniqueEntityIdentity",
          "DuplicateEntityIdentity",
          "EntityCollection",
          String(instance.entityId),
          `Duplicate entity identity: ${key}`,
          "entityId",
        ),
      );
    } else {
      seen.set(key, instance.entityId);
    }
  }
  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Validate cross-entity relationships. */
export function validateExecutiveDecisionRegisterRelationships(
  relationships: readonly ExecutiveDecisionRegisterRelationshipInstance[],
  knownIds: readonly string[] = [],
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  const idSet = new Set(knownIds);
  for (const rel of relationships) {
    if (
      !(RELATIONSHIPS as readonly string[]).includes(rel.relationshipKind)
    ) {
      issues.push(
        issue(
          "KnownRelationshipKind",
          "UnknownRelationshipKind",
          "Relationship",
          rel.relationshipId,
          `Unknown relationship kind: ${rel.relationshipKind}`,
          "relationshipKind",
        ),
      );
    }
    if (
      knownIds.length > 0
      && (!idSet.has(rel.fromRef) || !idSet.has(rel.toRef))
    ) {
      issues.push(
        issue(
          "RequiredFieldsPresent",
          "MissingRequiredField",
          "Relationship",
          rel.relationshipId,
          "Relationship endpoints must exist in the candidate set.",
          "fromRef",
        ),
      );
    }
    if (
      rel.relationshipKind === "Supersedes"
      && rel.fields?.circular_supersession === true
    ) {
      issues.push(
        issue(
          "SupersessionLineage",
          "CircularSupersession",
          "Relationship",
          rel.relationshipId,
          "Circular supersession is rejected.",
          "supersession_graph",
        ),
      );
    }
  }
  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Validate one model entity descriptor. */
export function validateExecutiveDecisionRegisterEntityDescriptor(
  descriptor: (typeof ExecutiveDecisionRegisterModel.entities)[number],
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  if (!isKnownKind(descriptor.entityName)) {
    issues.push(
      issue(
        "KnownEntityKind",
        "UnknownEntityKind",
        "EntityDescriptor",
        descriptor.entityId,
        `Unknown entity kind: ${descriptor.entityName}`,
        "entityName",
      ),
    );
  }
  if (descriptor.executable !== false || descriptor.storesRuntimeValues !== false) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "EntityDescriptor",
        descriptor.entityId,
        "Entity descriptors must remain non-executable metadata.",
        "executable",
      ),
    );
  }
  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Validate telemetry descriptor. */
export function validateExecutiveDecisionRegisterTelemetryDescriptor(
  descriptor: ExecutiveDecisionRegisterTelemetryDescriptor,
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  for (const [fieldName, value] of Object.entries(descriptor.fields)) {
    if (
      (FORBIDDEN_TELEMETRY_FIELDS as readonly string[]).includes(fieldName)
      || value === true && fieldName.includes("payload")
    ) {
      issues.push(
        issue(
          "TelemetryPayloadExcluded",
          "TelemetryContainsPayload",
          "TelemetryDescriptor",
          descriptor.descriptorId,
          `Telemetry field excluded: ${fieldName}`,
          fieldName,
        ),
      );
    } else if (
      !(ALLOWED_TELEMETRY_FIELDS as readonly string[]).includes(fieldName)
      && fieldName !== "metadata_only"
    ) {
      issues.push(
        issue(
          "TelemetryPayloadExcluded",
          "TelemetryContainsPayload",
          "TelemetryDescriptor",
          descriptor.descriptorId,
          `Telemetry field not in allowed metadata set: ${fieldName}`,
          fieldName,
        ),
      );
    }
  }
  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Validate the complete canonical model contract. */
export function validateExecutiveDecisionRegisterModel(
  model: typeof ExecutiveDecisionRegisterModel = ExecutiveDecisionRegisterModel,
): ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];

  if (model.readiness !== "ReadyForValidation") {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "UpstreamNotReady",
        "Model",
        model.identity.id,
        "Upstream model readiness must be ReadyForValidation.",
        "readiness",
        "ReadyForValidation",
        String(model.readiness),
      ),
    );
  }

  if (
    model.identity.namespace
      !== "nexora.rtc.executive.decision.register.model"
  ) {
    issues.push(
      issue(
        "ExactModelNamespace",
        "UnknownNamespace",
        "Model",
        model.identity.id,
        "Model namespace mismatch.",
        "namespace",
      ),
    );
  }

  if (model.entities.length !== 14 || model.entityNames.length !== 14) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Canonical model must expose exactly fourteen entities.",
        "entities",
      ),
    );
  }

  if (model.root.entityName !== "DecisionRegister" || model.root.root !== true) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Root entity must be DecisionRegister.",
        "root",
      ),
    );
  }

  if (model.importsFoundationDirectly !== false) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Model must not import foundation directly.",
        "importsFoundationDirectly",
      ),
    );
  }

  if (model.foundation !== model.registry.foundation) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Foundation reference must equal registry.foundation.",
        "foundation",
      ),
    );
  }
  if (
    model.foundationEntry !== model.registry.canonicalEntry
  ) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Foundation entry reference must equal registry.canonicalEntry.",
        "foundationEntry",
      ),
    );
  }

  if (model.aiMustNot !== model.registry.aiMustNot) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "AI prohibition reference must be preserved exactly.",
        "aiMustNot",
      ),
    );
  }

  if (model.openIssues.length !== 6) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        model.identity.id,
        "Open issues OI-01 through OI-06 must remain six unresolved items.",
        "openIssues",
      ),
    );
  }

  for (const entity of model.entities) {
    const descriptorResult =
      validateExecutiveDecisionRegisterEntityDescriptor(entity);
    issues.push(...descriptorResult.issues);
  }

  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}

/** Verify canonical rule completeness. */
export function verifyExecutiveDecisionRegisterValidationRuleCompleteness():
  ExecutiveDecisionRegisterValidationResult {
  const issues: ExecutiveDecisionRegisterValidationIssue[] = [];
  const ids = new Set<string>();
  const keys = new Set<string>();
  for (const declared of ExecutiveDecisionRegisterValidationRules) {
    if (ids.has(declared.ruleId)) {
      issues.push(
        issue(
          "CanonicalModelStructure",
          "ModelInvariantBroken",
          "Model",
          declared.ruleId,
          "Duplicate rule ID.",
          "ruleId",
        ),
      );
    }
    ids.add(declared.ruleId);
    if (keys.has(declared.ruleKey)) {
      issues.push(
        issue(
          "CanonicalModelStructure",
          "ModelInvariantBroken",
          "Model",
          declared.ruleKey,
          "Duplicate rule key.",
          "ruleKey",
        ),
      );
    }
    keys.add(declared.ruleKey);
  }
  if (ExecutiveDecisionRegisterValidationRules.length < 30) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        "RTC-3:4",
        "Rule catalogue incomplete.",
        "rules",
      ),
    );
  }
  return finalizeExecutiveDecisionRegisterValidationIssues(issues);
}
