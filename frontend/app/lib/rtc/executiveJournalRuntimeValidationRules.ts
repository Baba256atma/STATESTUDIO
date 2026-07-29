/**
 * RTC-2:4 — Executive Journal Runtime Validation Rules.
 *
 * Canonical rule declarations and pure deterministic evaluation.
 * Never mutates inputs. Never repairs. Never uses clock/network/randomness.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

import { ExecutiveJournalRuntimeModel } from "./executiveJournalRuntimeModel.ts";
import type {
  ExecutiveJournalRuntimeEntityInstance,
  ExecutiveJournalRuntimeTelemetryDescriptor,
  ExecutiveJournalRuntimeValidationIssue,
  ExecutiveJournalRuntimeValidationIssueCode,
  ExecutiveJournalRuntimeValidationResult,
  ExecutiveJournalRuntimeValidationRuleFamily,
  ExecutiveJournalRuntimeValidationSeverity,
  ExecutiveJournalRuntimeValidationSubjectKind,
} from "./executiveJournalRuntimeValidationTypes.ts";

const ENTITY_KINDS = ExecutiveJournalRuntimeModel.entityNames;

const ACCEPTANCE = ExecutiveJournalRuntimeModel.stateDistinctions.acceptance;
const DISPUTE = ExecutiveJournalRuntimeModel.stateDistinctions.dispute;
const CURRENCY = ExecutiveJournalRuntimeModel.stateDistinctions.currency;
const CLOSURE = ExecutiveJournalRuntimeModel.stateDistinctions.closure;
const DISPOSITION = ExecutiveJournalRuntimeModel.stateDistinctions.disposition;
const AUTHORITY_KIND = ExecutiveJournalRuntimeModel.stateDistinctions.authorityKind;
const VISIBILITY = ExecutiveJournalRuntimeModel.stateDistinctions.recordVisibility;
const CONFIRMATION =
  ExecutiveJournalRuntimeModel.stateDistinctions.confirmationSource;

const CONSEQUENTIAL_KINDS = Object.freeze([
  "Journal",
  "Intent",
  "Decision",
  "Commitment",
  "Risk",
  "Exception",
  "Outcome",
  "Correction",
  "Dispute",
  "DisclosureRecord",
  "DispositionRecord",
] as const);

const PROVENANCE_FIELDS = Object.freeze([
  "producing_event_refs",
  "journal_id",
  "journal_sequence",
  "event_type",
  "event_version",
  "recorded_at",
  "actor_ref",
  "authority_ref",
] as const);

const DELEGATION_FIELDS = Object.freeze([
  "delegator",
  "delegate",
  "scope",
  "effective_at",
  "expires_at",
  "revocation_state",
  "evidence_refs",
] as const);

const ALLOWED_TELEMETRY_FIELDS = Object.freeze([
  "entity_kind",
  "event_count",
  "sequence_position",
  "projection_version",
  "policy_result_code",
  "integrity_result",
  "correlation_identity",
] as const);

export interface ExecutiveJournalRuntimeValidationRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly family: ExecutiveJournalRuntimeValidationRuleFamily;
  readonly severity: ExecutiveJournalRuntimeValidationSeverity;
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
  family: ExecutiveJournalRuntimeValidationRuleFamily,
  severity: ExecutiveJournalRuntimeValidationSeverity,
  upstreamContract: string,
  description: string,
): ExecutiveJournalRuntimeValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-2:4/Rule/${String(executionOrder).padStart(2, "0")}`,
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
export const ExecutiveJournalRuntimeValidationRules = Object.freeze([
  rule(1, "CanonicalIdentityFormat", "Identity", "Critical", "JournalValidationResult", "Canonical identities must match RTC-2 control format without normalization."),
  rule(2, "ExactModelNamespace", "Identity", "Critical", "JournalValidationResult", "Model namespace must equal nexora.rtc.executive.journal.model."),
  rule(3, "KnownEntityKind", "Identity", "Error", "JournalValidationResult", "Entity kind must be one of the fourteen canonical kinds."),
  rule(4, "UniqueEntityIdentity", "Identity", "Error", "JournalValidationResult", "Entity identities within a collection must be unique."),
  rule(5, "RequiredFieldsPresent", "Structure", "Error", "JournalModelInvariants", "Required structural fields must be present."),
  rule(6, "ClosedVocabularyMembership", "Structure", "Error", "JournalModelInvariants", "Closed vocabulary values must be recognized."),
  rule(7, "CanonicalModelStructure", "Structure", "Critical", "JournalModelInvariants", "Canonical RTC-2:3 model must expose fourteen entities and registry-resolved foundation."),
  rule(8, "CorrectionReferencesAffected", "AppendOnly", "Error", "JournalModelCorrection", "Corrections must reference an affected event or entity."),
  rule(9, "SupersessionPreservesPredecessor", "AppendOnly", "Error", "JournalModelInvariants", "Superseded state must preserve predecessor_ref."),
  rule(10, "DispositionPreservesEvidence", "AppendOnly", "Error", "JournalModelInvariants", "Disposed state must preserve disposition evidence."),
  rule(11, "DisputeTransitionValid", "AppendOnly", "Error", "JournalModelCorrection", "Dispute resolution requires an explicit resolution_ref."),
  rule(12, "ProvenanceComplete", "Provenance", "Error", "JournalModelProvenance", "Authoritative and derived consequential states require provenance fields."),
  rule(13, "DerivedNotAuthoritative", "Provenance", "Error", "JournalModelProjection", "Derived state must not be marked Authoritative."),
  rule(14, "AuthorityRefRequired", "Authority", "Error", "JournalModelAuthority", "Consequential state requires authority_ref."),
  rule(15, "DelegationComplete", "Authority", "Error", "JournalModelDelegation", "Delegation requires delegator, delegate, scope, times, revocation, and evidence."),
  rule(16, "AuthoritySubstituteRejected", "Authority", "Critical", "JournalModelAuthority", "Title, silence, attendance, or AI confidence cannot substitute for authority."),
  rule(17, "PrivateReflectionIsolated", "Privacy", "Error", "JournalModelPrivacy", "Private reflection must not enter shared projections without promotion."),
  rule(18, "AiConfirmDecisionRejected", "AiBoundary", "Critical", "JournalModelAuthority", "AI must not confirm decisions."),
  rule(19, "AiCreateAuthorityRejected", "AiBoundary", "Critical", "JournalModelAuthority", "AI must not create or broaden authority."),
  rule(20, "AiCloseCommitmentRejected", "AiBoundary", "Critical", "JournalModelAuthority", "AI must not close commitments."),
  rule(21, "AiDiscloseRejected", "AiBoundary", "Critical", "JournalModelAuthority", "AI must not disclose restricted material."),
  rule(22, "AiRetentionOrDispositionRejected", "AiBoundary", "Critical", "JournalModelAuthority", "AI must not alter retention or dispose records."),
  rule(23, "DisclosurePolicyEvidence", "Disclosure", "Error", "JournalModelPrivacy", "Disclosure requires purpose and policy decision evidence."),
  rule(24, "DisclosureFailClosed", "Disclosure", "Critical", "JournalModelPrivacy", "Denied or unknown policy state must not disclose content."),
  rule(25, "ProjectionEventsRequired", "Projection", "Error", "JournalModelProjection", "Projections require producing events and projector version."),
  rule(26, "EvidenceReferencesTyped", "Evidence", "Error", "JournalModelProvenance", "Required evidence references must be typed and non-empty."),
  rule(27, "TelemetryPayloadExcluded", "Telemetry", "Critical", "JournalValidationResult", "Routine telemetry must not contain journal payload fields."),
] as const);

const RULE_BY_KEY = Object.freeze(
  Object.fromEntries(
    ExecutiveJournalRuntimeValidationRules.map((item) => [item.ruleKey, item]),
  ) as Readonly<
    Record<string, ExecutiveJournalRuntimeValidationRuleDeclaration>
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

const issue = (
  ruleKey: string,
  issueCode: ExecutiveJournalRuntimeValidationIssueCode,
  subjectKind: ExecutiveJournalRuntimeValidationSubjectKind,
  subjectId: string,
  message: string,
  field: string | null,
): ExecutiveJournalRuntimeValidationIssue => {
  const declared = RULE_BY_KEY[ruleKey];
  const order = declared?.executionOrder ?? 99;
  const severity = declared?.severity ?? "Error";
  const ruleId = declared?.ruleId ?? `RTC-2:4/Rule/${ruleKey}`;
  const upstreamContract = declared?.upstreamContract ?? "JournalValidationResult";
  return Object.freeze({
    ruleId,
    issueCode,
    severity,
    subjectKind,
    subjectId,
    message,
    field,
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
  left: ExecutiveJournalRuntimeValidationIssue,
  right: ExecutiveJournalRuntimeValidationIssue,
): number => {
  if (left.orderKey < right.orderKey) {
    return -1;
  }
  if (left.orderKey > right.orderKey) {
    return 1;
  }
  return 0;
};

export function finalizeExecutiveJournalValidationIssues(
  issues: readonly ExecutiveJournalRuntimeValidationIssue[],
): ExecutiveJournalRuntimeValidationResult {
  const sorted = Object.freeze([...issues].sort(compareIssues));
  const errorCount = sorted.filter(
    (item) => item.severity === "Error" || item.severity === "Critical",
  ).length;
  const warningCount = sorted.filter((item) => item.severity === "Warning").length;
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

const isKnownKind = (kind: string): boolean =>
  (ENTITY_KINDS as readonly string[]).includes(kind);

const vocabularyMembers = (field: string): readonly string[] | null => {
  switch (field) {
    case "acceptance_state":
      return ACCEPTANCE;
    case "dispute_state":
      return DISPUTE;
    case "currency_state":
      return CURRENCY;
    case "closure_state":
      return CLOSURE;
    case "disposition_state":
      return DISPOSITION;
    case "authority_kind":
      return AUTHORITY_KIND;
    case "record_visibility":
      return VISIBILITY;
    case "confirmation_source":
      return CONFIRMATION;
    case "information_category":
      return ExecutiveJournalRuntimeModel.stateDistinctions.informationCategory;
    default:
      return null;
  }
};

const requiresAuthority = (kind: string): boolean =>
  (CONSEQUENTIAL_KINDS as readonly string[]).includes(kind);

const requiresProvenance = (kind: string): boolean =>
  requiresAuthority(kind) || kind === "Projection" || kind === "Outcome";

/** Validate one entity instance. */
export function validateExecutiveJournalEntityInstance(
  instance: ExecutiveJournalRuntimeEntityInstance,
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  const subjectId = instance.entityId;
  const fields = instance.fields;
  const kind = instance.entityKind;

  if (!isWellFormedId(instance.entityId)) {
    issues.push(
      issue(
        "CanonicalIdentityFormat",
        "MalformedIdentity",
        "EntityInstance",
        String(instance.entityId),
        "Entity identity is malformed and was not normalized.",
        "entityId",
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
            "EntityInstance",
            subjectId,
            `Missing required field: ${fieldName}`,
            fieldName,
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
            "EntityInstance",
            subjectId,
            `Unknown vocabulary value for ${fieldName}: ${value}`,
            fieldName,
          ),
        );
      }
    }
  }

  if (requiresAuthority(kind) && !isPresent(fields.authority_ref)) {
    issues.push(
      issue(
        "AuthorityRefRequired",
        "MissingAuthorityRef",
        "EntityInstance",
        subjectId,
        "Consequential state requires authority_ref.",
        "authority_ref",
      ),
    );
  }

  if (
    isPresent(fields.authority_substitute)
    || fields.authority_from_title === true
    || fields.authority_from_silence === true
    || fields.authority_from_attendance === true
    || fields.authority_from_ai_confidence === true
  ) {
    issues.push(
      issue(
        "AuthoritySubstituteRejected",
        "AuthoritySubstituteRejected",
        "EntityInstance",
        subjectId,
        "Identity, title, attendance, silence, or AI confidence cannot substitute for authority.",
        "authority_substitute",
      ),
    );
  }

  if (requiresProvenance(kind)) {
    for (const fieldName of PROVENANCE_FIELDS) {
      if (kind === "Projection" && fieldName === "authority_ref") {
        continue;
      }
      if (!isPresent(fields[fieldName])) {
        issues.push(
          issue(
            "ProvenanceComplete",
            "MissingProvenance",
            "EntityInstance",
            subjectId,
            `Missing provenance field: ${fieldName}`,
            fieldName,
          ),
        );
      }
    }
  }

  if (
    asString(fields.authority_kind) === "Authoritative"
    && (kind === "Projection" || fields.derived === true)
  ) {
    issues.push(
      issue(
        "DerivedNotAuthoritative",
        "DerivedMarkedAuthoritative",
        "EntityInstance",
        subjectId,
        "Derived state must not be marked Authoritative.",
        "authority_kind",
      ),
    );
  }

  if (kind === "Correction" && !isPresent(fields.affected_ref)) {
    issues.push(
      issue(
        "CorrectionReferencesAffected",
        "MissingAffectedReference",
        "EntityInstance",
        subjectId,
        "Correction must reference an affected event or entity.",
        "affected_ref",
      ),
    );
  }

  if (
    asString(fields.currency_state) === "Superseded"
    && !isPresent(fields.predecessor_ref)
  ) {
    issues.push(
      issue(
        "SupersessionPreservesPredecessor",
        "MissingPredecessor",
        "EntityInstance",
        subjectId,
        "Superseded state must preserve predecessor_ref.",
        "predecessor_ref",
      ),
    );
  }

  if (
    (kind === "DispositionRecord" || asString(fields.disposition_state) === "Disposed")
    && !isPresent(fields.disposition_proof)
    && !isPresent(fields.disposition_evidence_ref)
  ) {
    issues.push(
      issue(
        "DispositionPreservesEvidence",
        "MissingDispositionEvidence",
        "EntityInstance",
        subjectId,
        "Disposed state must preserve disposition evidence.",
        "disposition_proof",
      ),
    );
  }

  if (
    kind === "Dispute"
    && asString(fields.dispute_state) === "Resolved"
    && !isPresent(fields.resolution_ref)
  ) {
    issues.push(
      issue(
        "DisputeTransitionValid",
        "InvalidDisputeTransition",
        "EntityInstance",
        subjectId,
        "Resolved dispute requires resolution_ref.",
        "resolution_ref",
      ),
    );
  }

  if (kind === "AuthorityReference") {
    const delegationStarted =
      isPresent(fields.delegator) || isPresent(fields.delegate);
    if (delegationStarted) {
      for (const fieldName of DELEGATION_FIELDS) {
        if (!isPresent(fields[fieldName])) {
          issues.push(
            issue(
              "DelegationComplete",
              "IncompleteDelegation",
              "EntityInstance",
              subjectId,
              `Delegation missing ${fieldName}.`,
              fieldName,
            ),
          );
        }
      }
    }
  }

  if (
    kind === "Projection"
    && (
      fields.includes_private_reflection === true
      || asString(fields.source_record_visibility) === "PrivateReflection"
    )
    && !isPresent(fields.promotion_ref)
  ) {
    issues.push(
      issue(
        "PrivateReflectionIsolated",
        "PrivateReflectionInSharedProjection",
        "EntityInstance",
        subjectId,
        "Private reflection must not enter shared projection without explicit promotion.",
        "includes_private_reflection",
      ),
    );
  }

  // AI boundary — preserve upstream prohibitions via field combinations.
  if (
    kind === "Decision"
    && asString(fields.acceptance_state) === "Accepted"
    && asString(fields.confirmation_source) === "AiProposed"
  ) {
    issues.push(
      issue(
        "AiConfirmDecisionRejected",
        "AiConfirmDecision",
        "EntityInstance",
        subjectId,
        "AI must not confirm decisions.",
        "confirmation_source",
      ),
    );
  }

  if (
    kind === "AuthorityReference"
    && asString(fields.confirmation_source) === "AiProposed"
  ) {
    issues.push(
      issue(
        "AiCreateAuthorityRejected",
        "AiCreateAuthority",
        "EntityInstance",
        subjectId,
        "AI must not create or broaden authority.",
        "confirmation_source",
      ),
    );
  }

  if (
    kind === "Commitment"
    && asString(fields.closure_state) === "Closed"
    && asString(fields.confirmation_source) === "AiProposed"
  ) {
    issues.push(
      issue(
        "AiCloseCommitmentRejected",
        "AiCloseCommitment",
        "EntityInstance",
        subjectId,
        "AI must not close commitments.",
        "confirmation_source",
      ),
    );
  }

  if (
    kind === "DisclosureRecord"
    && asString(fields.confirmation_source) === "AiProposed"
  ) {
    issues.push(
      issue(
        "AiDiscloseRejected",
        "AiDiscloseRestricted",
        "EntityInstance",
        subjectId,
        "AI must not disclose restricted material.",
        "confirmation_source",
      ),
    );
  }

  if (
    (kind === "DispositionRecord"
      || fields.alters_retention === true)
    && asString(fields.confirmation_source) === "AiProposed"
  ) {
    issues.push(
      issue(
        "AiRetentionOrDispositionRejected",
        kind === "DispositionRecord" ? "AiDisposeRecord" : "AiAlterRetention",
        "EntityInstance",
        subjectId,
        "AI must not alter retention or dispose records.",
        "confirmation_source",
      ),
    );
  }

  if (kind === "DisclosureRecord") {
    if (!isPresent(fields.purpose) || !isPresent(fields.access_decision_id)) {
      issues.push(
        issue(
          "DisclosurePolicyEvidence",
          "MissingDisclosurePolicyEvidence",
          "EntityInstance",
          subjectId,
          "Disclosure requires purpose and policy decision evidence.",
          !isPresent(fields.purpose) ? "purpose" : "access_decision_id",
        ),
      );
    }
    const policyState = asString(fields.policy_state);
    if (
      (policyState === "Unknown" || policyState === "Denied")
      && isPresent(fields.disclosed_content)
    ) {
      issues.push(
        issue(
          "DisclosureFailClosed",
          "DisclosureFailClosed",
          "EntityInstance",
          subjectId,
          "Denied or unknown policy state must not disclose content.",
          "policy_state",
        ),
      );
    }
  }

  if (kind === "Projection") {
    if (
      !isPresent(fields.producing_event_refs)
      && !isPresent(fields.source_event_ids)
    ) {
      issues.push(
        issue(
          "ProjectionEventsRequired",
          "ProjectionMissingEvents",
          "EntityInstance",
          subjectId,
          "Projection requires producing events.",
          "source_event_ids",
        ),
      );
    }
    if (!isPresent(fields.projector_version)) {
      issues.push(
        issue(
          "ProjectionEventsRequired",
          "ProjectionMissingEvents",
          "EntityInstance",
          subjectId,
          "Projection requires projector_version.",
          "projector_version",
        ),
      );
    }
  }

  if (
    (kind === "EvidenceReference" || requiresAuthority(kind))
    && fields.evidence_required === true
    && !isPresent(fields.evidence_refs)
  ) {
    issues.push(
      issue(
        "EvidenceReferencesTyped",
        "MissingProvenance",
        "EntityInstance",
        subjectId,
        "Required evidence references must be present and non-empty.",
        "evidence_refs",
      ),
    );
  }

  return finalizeExecutiveJournalValidationIssues(issues);
}

const isWellFormedId = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value === value.trim();

/** Validate an immutable entity collection. */
export function validateExecutiveJournalEntityCollection(
  instances: readonly ExecutiveJournalRuntimeEntityInstance[],
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  const seen = new Set<string>();
  for (const instance of instances) {
    const single = validateExecutiveJournalEntityInstance(instance);
    issues.push(...single.issues);
    if (seen.has(instance.entityId)) {
      issues.push(
        issue(
          "UniqueEntityIdentity",
          "DuplicateEntityIdentity",
          "EntityCollection",
          instance.entityId,
          `Duplicate entity identity: ${instance.entityId}`,
          "entityId",
        ),
      );
    } else {
      seen.add(instance.entityId);
    }
  }
  return finalizeExecutiveJournalValidationIssues(issues);
}

/** Validate cross-entity relationship constraints on a collection. */
export function validateExecutiveJournalRelationships(
  instances: readonly ExecutiveJournalRuntimeEntityInstance[],
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  const ids = new Set(instances.map((item) => item.entityId));
  for (const instance of instances) {
    const affected = asString(instance.fields.affected_ref);
    if (
      (instance.entityKind === "Correction" || instance.entityKind === "Dispute")
      && affected
      && !ids.has(affected)
      && instance.fields.affected_must_exist === true
    ) {
      issues.push(
        issue(
          "CorrectionReferencesAffected",
          "MissingAffectedReference",
          "RelationshipSet",
          instance.entityId,
          "Affected reference does not resolve within the collection.",
          "affected_ref",
        ),
      );
    }
    const predecessor = asString(instance.fields.predecessor_ref);
    if (
      asString(instance.fields.currency_state) === "Superseded"
      && predecessor
      && !ids.has(predecessor)
      && instance.fields.predecessor_must_exist === true
    ) {
      issues.push(
        issue(
          "SupersessionPreservesPredecessor",
          "MissingPredecessor",
          "RelationshipSet",
          instance.entityId,
          "Predecessor reference does not resolve within the collection.",
          "predecessor_ref",
        ),
      );
    }
  }
  return finalizeExecutiveJournalValidationIssues(issues);
}

/** Validate a telemetry descriptor. */
export function validateExecutiveJournalTelemetryDescriptor(
  descriptor: ExecutiveJournalRuntimeTelemetryDescriptor,
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  for (const fieldName of Object.keys(descriptor.fields)) {
    if (fieldName === "payload" || fieldName === "journal_payload") {
      issues.push(
        issue(
          "TelemetryPayloadExcluded",
          "TelemetryContainsPayload",
          "TelemetryDescriptor",
          descriptor.descriptorId,
          "Routine telemetry must not contain journal payload fields.",
          fieldName,
        ),
      );
    } else if (
      !(ALLOWED_TELEMETRY_FIELDS as readonly string[]).includes(fieldName)
    ) {
      issues.push(
        issue(
          "TelemetryPayloadExcluded",
          "UnknownField",
          "TelemetryDescriptor",
          descriptor.descriptorId,
          `Telemetry field is not an allowed operational metadata key: ${fieldName}`,
          fieldName,
        ),
      );
    }
  }
  return finalizeExecutiveJournalValidationIssues(issues);
}

/** Validate one model entity descriptor from RTC-2:3. */
export function validateExecutiveJournalEntityDescriptor(
  entity: (typeof ExecutiveJournalRuntimeModel.entities)[number],
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  if (!isKnownKind(entity.entityName)) {
    issues.push(
      issue(
        "KnownEntityKind",
        "UnknownEntityKind",
        "EntityDescriptor",
        entity.entityId,
        `Unknown entity kind descriptor: ${entity.entityName}`,
        "entityName",
      ),
    );
  }
  if (entity.entityId !== `RTC-2:3/Entity/${entity.entityName}`) {
    issues.push(
      issue(
        "CanonicalIdentityFormat",
        "MalformedIdentity",
        "EntityDescriptor",
        entity.entityId,
        "Entity descriptor identity does not match its kind.",
        "entityId",
      ),
    );
  }
  if (entity.fieldCount !== entity.fields.length) {
    issues.push(
      issue(
        "RequiredFieldsPresent",
        "MissingRequiredField",
        "EntityDescriptor",
        entity.entityId,
        "fieldCount does not match fields length.",
        "fieldCount",
      ),
    );
  }
  return finalizeExecutiveJournalValidationIssues(issues);
}

/** Validate the complete RTC-2:3 model aggregate. */
export function validateExecutiveJournalRuntimeModel(
  model: typeof ExecutiveJournalRuntimeModel = ExecutiveJournalRuntimeModel,
): ExecutiveJournalRuntimeValidationResult {
  const issues: ExecutiveJournalRuntimeValidationIssue[] = [];
  const subjectId = model.identity.id;

  if (model.identity.id !== "RTC-2:3/ExecutiveJournalRuntimeModel") {
    issues.push(
      issue(
        "CanonicalIdentityFormat",
        "MalformedIdentity",
        "Model",
        subjectId,
        "Model identity is not the canonical RTC-2:3 identity.",
        "identity.id",
      ),
    );
  }

  if (model.identity.namespace !== "nexora.rtc.executive.journal.model") {
    issues.push(
      issue(
        "ExactModelNamespace",
        "UnknownNamespace",
        "Model",
        subjectId,
        "Model namespace is not nexora.rtc.executive.journal.model.",
        "identity.namespace",
      ),
    );
  }

  if (model.entities.length !== 14 || model.entityNames.length !== 14) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "Canonical model must declare exactly fourteen entities.",
        "entities",
      ),
    );
  }

  if (model.root.entityName !== "Journal" || model.root.root !== true) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "Canonical root entity must be Journal.",
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
        subjectId,
        "Model must not import foundation directly.",
        "importsFoundationDirectly",
      ),
    );
  }

  if (model.resolvesFoundationViaRegistry !== true) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "Model must resolve foundation via registry.",
        "resolvesFoundationViaRegistry",
      ),
    );
  }

  if (model.foundation !== model.registry.foundation) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "Resolved foundation must be the registry foundation reference.",
        "foundation",
      ),
    );
  }

  if (
    model.aiMustNot !== model.registry.aiMustNot
    || model.aiMustNot.length !== 5
  ) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "AI prohibition list must remain the upstream reference.",
        "aiMustNot",
      ),
    );
  }

  if (model.openIssues.length !== 6 || model.resolvesOpenIssues !== false) {
    issues.push(
      issue(
        "CanonicalModelStructure",
        "ModelInvariantBroken",
        "Model",
        subjectId,
        "OI-01 through OI-06 must remain unresolved.",
        "openIssues",
      ),
    );
  }

  for (const entity of model.entities) {
    const descriptorResult = validateExecutiveJournalEntityDescriptor(entity);
    issues.push(...descriptorResult.issues);
  }

  const ids = model.entities.map((item) => item.entityId);
  if (new Set(ids).size !== ids.length) {
    issues.push(
      issue(
        "UniqueEntityIdentity",
        "DuplicateEntityIdentity",
        "Model",
        subjectId,
        "Entity descriptor identities must be unique.",
        "entities",
      ),
    );
  }

  return finalizeExecutiveJournalValidationIssues(issues);
}

export function isExecutiveJournalValidationResultValid(
  result: ExecutiveJournalRuntimeValidationResult,
): boolean {
  return result.valid === true && result.outcome === "Valid";
}
