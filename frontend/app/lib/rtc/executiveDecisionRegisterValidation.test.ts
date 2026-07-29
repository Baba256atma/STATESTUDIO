/**
 * RTC-3:4 — Executive Decision Register Validation Tests.
 *
 * Expanded verification with rule-to-test traceability for all 35 canonical rules.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveDecisionRegisterModel } from "./executiveDecisionRegisterModel.ts";
import * as ValidationModule from "./executiveDecisionRegisterValidation.ts";
import {
  ExecutiveDecisionRegisterValidation,
  ExecutiveDecisionRegisterValidationId,
  ExecutiveDecisionRegisterValidationNamespace,
  ExecutiveDecisionRegisterValidationReadiness,
  ExecutiveDecisionRegisterValidationStatus,
  getExecutiveDecisionRegisterValidationSummary,
  isCanonicalDecisionRegisterValidationSubjectKind,
  isExecutiveDecisionRegisterValidationResultValid,
  validateExecutiveDecisionRegisterEntityCollection,
  validateExecutiveDecisionRegisterEntityInstance,
  validateExecutiveDecisionRegisterModel,
  validateExecutiveDecisionRegisterRelationships,
  validateExecutiveDecisionRegisterTelemetryDescriptor,
  verifyExecutiveDecisionRegisterValidationRuleCompleteness,
} from "./executiveDecisionRegisterValidation.ts";
import { ExecutiveDecisionRegisterValidationRules } from "./executiveDecisionRegisterValidationRules.ts";
import type {
  ExecutiveDecisionRegisterEntityInstance,
  ExecutiveDecisionRegisterValidationIssueCode,
  ExecutiveDecisionRegisterValidationResult,
} from "./executiveDecisionRegisterValidationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC34_FILES = Object.freeze([
  "executiveDecisionRegisterValidation.ts",
  "executiveDecisionRegisterValidationTypes.ts",
  "executiveDecisionRegisterValidationIdentity.ts",
  "executiveDecisionRegisterValidationLifecycle.ts",
  "executiveDecisionRegisterValidationContracts.ts",
  "executiveDecisionRegisterValidationRules.ts",
  "executiveDecisionRegisterValidationMetadata.ts",
  "executiveDecisionRegisterValidation.test.ts",
]);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  Object.freeze({ issueId: "OI-01", accountableOwner: "Records / legal" }),
  Object.freeze({ issueId: "OI-02", accountableOwner: "Executive governance" }),
  Object.freeze({ issueId: "OI-03", accountableOwner: "Journal steward" }),
  Object.freeze({ issueId: "OI-04", accountableOwner: "Privacy + legal" }),
  Object.freeze({ issueId: "OI-05", accountableOwner: "Executive governance" }),
  Object.freeze({ issueId: "OI-06", accountableOwner: "Architecture authority" }),
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs["']/,
]);

const instance = (
  entityKind: string,
  entityId: string,
  fields: Readonly<Record<string, unknown>>,
): ExecutiveDecisionRegisterEntityInstance =>
  Object.freeze({ entityKind, entityId, fields: Object.freeze({ ...fields }) });

const hasCode = (
  result: ExecutiveDecisionRegisterValidationResult,
  code: ExecutiveDecisionRegisterValidationIssueCode,
): boolean => result.issues.some((item) => item.issueCode === code);

const hasRule = (
  result: ExecutiveDecisionRegisterValidationResult,
  ruleId: string,
): boolean => result.issues.some((item) => item.ruleId === ruleId);

const assertInvalidCode = (
  result: ExecutiveDecisionRegisterValidationResult,
  code: ExecutiveDecisionRegisterValidationIssueCode,
  ruleId?: string,
): void => {
  assert.equal(result.valid, false, `expected Invalid for ${code}`);
  assert.ok(hasCode(result, code), `missing issue code ${code}`);
  if (ruleId !== undefined) {
    assert.ok(hasRule(result, ruleId), `missing ruleId ${ruleId}`);
  }
};

type RuleCoverage = {
  readonly ruleKey: string;
  readonly ruleId: string;
  readonly expectedCode: ExecutiveDecisionRegisterValidationIssueCode | "Valid";
  readonly run: () => ExecutiveDecisionRegisterValidationResult;
};

/**
 * Immutable rule-to-test traceability table.
 * Every canonical rule MUST appear exactly once.
 * Completeness assertion fails if a future rule is added without coverage.
 */
const RULE_COVERAGE: readonly RuleCoverage[] = Object.freeze([
  Object.freeze({
    ruleKey: "CanonicalIdentityFormat",
    ruleId: "RTC-3:4/Rule/01",
    expectedCode: "MalformedIdentity" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", " bad ", {}),
      ),
  }),
  Object.freeze({
    ruleKey: "ExactModelNamespace",
    ruleId: "RTC-3:4/Rule/02",
    expectedCode: "Valid" as const,
    run: () => validateExecutiveDecisionRegisterModel(),
  }),
  Object.freeze({
    ruleKey: "KnownEntityKind",
    ruleId: "RTC-3:4/Rule/03",
    expectedCode: "UnknownEntityKind" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("Journal", "RTC-X-1", {}),
      ),
  }),
  Object.freeze({
    ruleKey: "UniqueEntityIdentity",
    ruleId: "RTC-3:4/Rule/04",
    expectedCode: "DuplicateEntityIdentity" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityCollection([
        instance("DecisionProposal", "P1", {
          authority_state: "NonAuthoritative",
          origin_state: "HumanAuthored",
        }),
        instance("DecisionProposal", "P1", {
          authority_state: "NonAuthoritative",
          origin_state: "HumanAuthored",
        }),
      ]),
  }),
  Object.freeze({
    ruleKey: "KnownSubjectKind",
    ruleId: "RTC-3:4/Rule/05",
    expectedCode: "UnknownSubjectKind" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-SUB", {
          subject_kind: "UnknownSubject",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "RequiredFieldsPresent",
    ruleId: "RTC-3:4/Rule/06",
    expectedCode: "MissingRequiredField" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-REQ", {
          required_fields: ["authority_ref"],
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ClosedVocabularyMembership",
    ruleId: "RTC-3:4/Rule/07",
    expectedCode: "UnknownVocabularyValue" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-VOC", {
          decision_state: "Accepted",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "CanonicalModelStructure",
    ruleId: "RTC-3:4/Rule/08",
    expectedCode: "Valid" as const,
    run: () => validateExecutiveDecisionRegisterModel(),
  }),
  Object.freeze({
    ruleKey: "ProposedNonAuthoritative",
    ruleId: "RTC-3:4/Rule/09",
    expectedCode: "ProposedMarkedAuthoritative" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-P", {
          decision_state: "Proposed",
          authority_state: "Authoritative",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ConfirmedRequiresAuthorityAndHuman",
    ruleId: "RTC-3:4/Rule/10",
    expectedCode: "MissingAuthorityRef" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-C", {
          decision_state: "Confirmed",
          confirmation_source: "HumanConfirmed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "EffectiveRequiresConfirmedAuthority",
    ruleId: "RTC-3:4/Rule/11",
    expectedCode: "EffectiveWithoutConfirmedAuthority" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-E", {
          decision_state: "Effective",
          authority_state: "NonAuthoritative",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisputedRequiresChallengedRef",
    ruleId: "RTC-3:4/Rule/12",
    expectedCode: "MissingChallengedReference" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDispute", "DSP-1", {
          decision_state: "Disputed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "SupersededRequiresPredecessor",
    ruleId: "RTC-3:4/Rule/13",
    expectedCode: "MissingPredecessor" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionSupersession", "SUP-1", {
          successor_decision: "D2",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ClosedRequiresClosureMetadata",
    ruleId: "RTC-3:4/Rule/14",
    expectedCode: "MissingClosureMetadata" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-CL", {
          decision_state: "Closed",
          authority_state: "Authoritative",
          authority_ref: "A1",
          confirmation_ref: "C1",
          producing_event_refs: ["E1"],
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisposedRequiresGovernanceEvidence",
    ruleId: "RTC-3:4/Rule/15",
    expectedCode: "MissingDispositionEvidence" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDisposition", "DIS-1", {
          disposition_state: "Disposed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisposedToActiveRejected",
    ruleId: "RTC-3:4/Rule/16",
    expectedCode: "DisposedToActiveReversal" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-REV", {
          prior_disposition_state: "Disposed",
          disposition_state: "Active",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthorityRefRequired",
    ruleId: "RTC-3:4/Rule/17",
    expectedCode: "MissingAuthorityRef" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-A", {
          authority_state: "Authoritative",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DelegationComplete",
    ruleId: "RTC-3:4/Rule/18",
    expectedCode: "IncompleteDelegation" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionAuthority", "AUTH-D", {
          delegator: "A",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DelegationRevocationAndExpiry",
    ruleId: "RTC-3:4/Rule/19",
    expectedCode: "RevokedDelegation" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionAuthority", "AUTH-R", {
          delegator: "A",
          delegate: "B",
          scope: "s",
          effective_point: "t0",
          expiry: "t1",
          revocation_state: "Revoked",
          evidence_reference: "E1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthoritySubstituteRejected",
    ruleId: "RTC-3:4/Rule/20",
    expectedCode: "AuthoritySubstituteRejected" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-SUBA", {
          authority_from_title: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "HumanConfirmationRequired",
    ruleId: "RTC-3:4/Rule/21",
    expectedCode: "AiConfirmationRejected" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionConfirmation", "CONF-AI", {
          actor_kind: "ai",
          confirmation_source: "AiProposed",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ConfirmationBindingExact",
    ruleId: "RTC-3:4/Rule/22",
    expectedCode: "ConfirmationMismatch" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionConfirmation", "CONF-MM", {
          actor_kind: "human",
          confirmation_source: "HumanConfirmed",
          decision_proposal: "P1",
          expected_proposal_ref: "P2",
          exact_proposed_decision_effect: "E1",
          authority_ref: "A1",
          evidence_set: ["EV1"],
          confirmation_identity: "C1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "CorrectionPreservesOriginal",
    ruleId: "RTC-3:4/Rule/23",
    expectedCode: "MissingOriginalReference" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionCorrection", "COR-1", {
          affected_event_ref: "EVT-1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DisputePreservesChallenged",
    ruleId: "RTC-3:4/Rule/24",
    expectedCode: "MissingDisputeReference" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDispute", "DSP-R", {
          challenged_decision_ref: "D1",
          resolution_state: "Resolved",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "SupersessionLineage",
    ruleId: "RTC-3:4/Rule/25",
    expectedCode: "CircularSupersession" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionSupersession", "SUP-C", {
          predecessor_decision: "D1",
          successor_decision: "D1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ReopenRequiresNewEvent",
    ruleId: "RTC-3:4/Rule/26",
    expectedCode: "MissingReopenEvent" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-RE", {
          reopened: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ProvenanceComplete",
    ruleId: "RTC-3:4/Rule/27",
    expectedCode: "MissingProvenance" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-PV", {
          authority_state: "Authoritative",
          authority_ref: "A1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "DerivedNotAuthoritative",
    ruleId: "RTC-3:4/Rule/28",
    expectedCode: "DerivedMarkedAuthoritative" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionProjection", "PRJ-D", {
          derived: true,
          authority_state: "Authoritative",
          producing_event_refs: ["E1"],
          derivation_version: "1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "EvidenceCategoryClosed",
    ruleId: "RTC-3:4/Rule/29",
    expectedCode: "UnknownEvidenceCategory" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionEvidence", "EV-U", {
          evidence_category: "PinnedMaybe",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ProjectionConstraints",
    ruleId: "RTC-3:4/Rule/30",
    expectedCode: "ProjectionMissingEvents" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionProjection", "PRJ-M", {
          derivation_version: "1",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "PrivateReflectionOutsideModel",
    ruleId: "RTC-3:4/Rule/31",
    expectedCode: "PrivateReflectionAsDecisionRecord" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-PRIV", {
          private_reflection: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "RestrictedClassificationRequired",
    ruleId: "RTC-3:4/Rule/32",
    expectedCode: "MissingClassification" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-REST", {
          record_category: "RestrictedExecutiveRecord",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AiBoundaryRejected",
    ruleId: "RTC-3:4/Rule/33",
    expectedCode: "AiMakeAuthoritative" as const,
    run: () =>
      validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionProposal", "PROP-AI", {
          origin_state: "AiProposed",
          authority_state: "Authoritative",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "TelemetryPayloadExcluded",
    ruleId: "RTC-3:4/Rule/34",
    expectedCode: "TelemetryContainsPayload" as const,
    run: () =>
      validateExecutiveDecisionRegisterTelemetryDescriptor(
        Object.freeze({
          descriptorId: "TEL-1",
          fields: Object.freeze({ decision_claim: "x" }),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "KnownRelationshipKind",
    ruleId: "RTC-3:4/Rule/35",
    expectedCode: "UnknownRelationshipKind" as const,
    run: () =>
      validateExecutiveDecisionRegisterRelationships([
        Object.freeze({
          relationshipKind: "MutatesInPlace",
          relationshipId: "REL-X",
          fromRef: "A",
          toRef: "B",
        }),
      ]),
  }),
]);

describe("RTC-3:4 Executive Decision Register Validation", () => {
  describe("Rule traceability", () => {
    it("covers every canonical rule exactly once", () => {
      assert.equal(ExecutiveDecisionRegisterValidationRules.length, 35);
      assert.equal(RULE_COVERAGE.length, 35);
      const coveredKeys = RULE_COVERAGE.map((item) => item.ruleKey);
      const canonicalKeys = ExecutiveDecisionRegisterValidationRules.map(
        (item) => item.ruleKey,
      );
      assert.deepEqual([...coveredKeys].sort(), [...canonicalKeys].sort());
      assert.equal(new Set(coveredKeys).size, 35);
      for (const declared of ExecutiveDecisionRegisterValidationRules) {
        const coverage = RULE_COVERAGE.find(
          (item) => item.ruleKey === declared.ruleKey,
        );
        assert.ok(coverage, `missing coverage for ${declared.ruleKey}`);
        assert.equal(coverage.ruleId, declared.ruleId);
      }
    });

    for (const coverage of RULE_COVERAGE) {
      it(`direct coverage: ${coverage.ruleId} ${coverage.ruleKey}`, () => {
        const result = coverage.run();
        if (coverage.expectedCode === "Valid") {
          assert.equal(result.valid, true);
          assert.equal(result.outcome, "Valid");
          return;
        }
        assertInvalidCode(result, coverage.expectedCode, coverage.ruleId);
        const matched = result.issues.find(
          (item) => item.issueCode === coverage.expectedCode,
        );
        assert.ok(matched);
        assert.equal(typeof matched.subjectKind, "string");
        assert.equal(typeof matched.subjectId, "string");
      });
    }
  });

  describe("Identity and upstream", () => {
    it("has exact RTC-3:4 identity and ReadyForPolicy readiness", () => {
      assert.equal(
        ExecutiveDecisionRegisterValidationId,
        "RTC-3:4/ExecutiveDecisionRegisterValidation",
      );
      assert.equal(
        ExecutiveDecisionRegisterValidationNamespace,
        "nexora.rtc.executive.decision.register.validation",
      );
      assert.equal(ExecutiveDecisionRegisterValidationStatus, "Validation");
      assert.equal(
        ExecutiveDecisionRegisterValidationReadiness,
        "ReadyForPolicy",
      );
      assert.equal(
        ExecutiveDecisionRegisterValidation.nextPhase,
        "RTC-3:5 — Executive Decision Register Policy",
      );
      assert.equal(ExecutiveDecisionRegisterValidation.policyPhase, false);
      const present = readdirSync(HERE);
      for (const file of RTC34_FILES) {
        assert.ok(present.includes(file));
      }
      assert.equal(
        ExecutiveDecisionRegisterValidation.nextPhase.startsWith("RTC-3:5"),
        true,
      );
    });

    it("preserves RTC-3:3 chain and bans direct upstream imports", () => {
      assert.equal(
        ExecutiveDecisionRegisterValidation.model,
        ExecutiveDecisionRegisterModel,
      );
      assert.equal(
        ExecutiveDecisionRegisterValidation.foundation,
        ExecutiveDecisionRegisterModel.foundation,
      );
      for (const file of RTC34_FILES.filter((n) => !n.endsWith(".test.ts"))) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.doesNotMatch(source, pattern);
        }
      }
    });
  });

  describe("Positive canonical paths", () => {
    it("canonical model validation returns Valid", () => {
      const result = validateExecutiveDecisionRegisterModel();
      assert.equal(result.outcome, "Valid");
      assert.equal(isExecutiveDecisionRegisterValidationResultValid(result), true);
    });

    it("valid proposed decision remains non-authoritative", () => {
      const result = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionProposal", "PROP-OK", {
          authority_state: "NonAuthoritative",
          origin_state: "HumanAuthored",
          intended_decision_effect: "approve",
          producing_event_refs: ["E1"],
          requires_separate_human_confirmation: true,
        }),
      );
      assert.equal(result.valid, true);
    });

    it("valid authoritative decision with authority and human confirmation passes", () => {
      const result = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-OK", {
          decision_state: "Confirmed",
          authority_state: "Authoritative",
          origin_state: "HumanAuthored",
          authority_ref: "A1",
          confirmation_ref: "C1",
          confirmation_source: "HumanConfirmed",
          producing_event_refs: ["E1"],
          actor_ref: "H1",
          purpose: "approve",
        }),
      );
      assert.equal(result.valid, true);
    });

    it("complete delegation passes", () => {
      const result = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionAuthority", "AUTH-OK", {
          authority_ref: "A1",
          authority_kind: "mandate",
          issuing_authority: "CEO",
          subject_actor: "U1",
          scope: "finance",
          decision_domain: "budget",
          effective_point: "t0",
          expiry: "t1",
          revocation_state: "Active",
          delegator: "A",
          delegate: "B",
          evidence_reference: "E1",
          selects_live_authority_registry: false,
        }),
      );
      assert.equal(result.valid, true);
    });

    it("valid correction, dispute/resolution, supersession, outcome, and projection pass", () => {
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionCorrection", "COR-OK", {
            corrected_decision_ref: "D1",
            affected_event_ref: "E1",
            authority_ref: "A1",
            evidence_reference: "EV1",
            new_producing_event_ref: "E2",
            original_history_retained: true,
          }),
        ).valid,
        true,
      );
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionDispute", "DSP-OK", {
            challenged_decision_ref: "D1",
            challenged_event_or_claim_ref: "E1",
            initiator: "I1",
            basis: "error",
            review_owner: "R1",
            resolution_state: "Resolved",
            resolution_event: "RE1",
            resolution_authority: "A1",
            evidence_refs: ["EV1"],
            dispute_identity: "DSP-OK",
          }),
        ).valid,
        true,
      );
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionSupersession", "SUP-OK", {
            predecessor_decision: "D1",
            successor_decision: "D2",
            supersession_event: "SE1",
            effective_point: "t0",
            actor: "H1",
            authority_ref: "A1",
            rationale_or_evidence_ref: "EV1",
            no_silent_replacement: true,
          }),
        ).valid,
        true,
      );
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionOutcomeReference", "OUT-OK", {
            decision_identity: "D1",
            outcome_identity_or_ref: "O1",
            producing_event: "E1",
            evidence: "EV1",
            relationship_kind: "ReferencesOutcome",
            closure_relevance: "related",
            provenance: "p",
          }),
        ).valid,
        true,
      );
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-OK", {
            projection_identity: "P1",
            projection_version: "1",
            source_register: "R1",
            source_sequence_position_or_range: "1-2",
            producing_event_refs: ["E1"],
            derivation_version: "1",
            provenance: "p",
            staleness_metadata: "fresh",
            authority_limitations: "derived-only",
            authority_state: "NonAuthoritative",
          }),
        ).valid,
        true,
      );
    });

    it("valid metadata-only telemetry and explicit unavailable evidence pass", () => {
      assert.equal(
        validateExecutiveDecisionRegisterTelemetryDescriptor(
          Object.freeze({
            descriptorId: "TEL-OK",
            fields: Object.freeze({
              entity_kind: "DecisionRecord",
              lifecycle_state: "Proposed",
              event_count: 1,
              sequence_position: 1,
              validation_result_code: "Valid",
              correlation_identity: "c1",
            }),
          }),
        ).valid,
        true,
      );
      assert.equal(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionEvidence", "EV-UNA", {
            evidence_category: "Unavailable",
            availability_state: "Unavailable",
            evidence_identity: "E",
            evidence_type: "doc",
            related_entity_ref: "D1",
            provenance: "p",
            classification: "c",
            integrity_requirement: "i",
            unavailable_not_silently_accepted: true,
          }),
        ).valid,
        true,
      );
    });

    it("repeated validation is equivalent, non-mutating, and mutation-safe", () => {
      const fields = Object.freeze({
        authority_state: "NonAuthoritative" as const,
        origin_state: "HumanAuthored" as const,
      });
      const candidate = instance("DecisionProposal", "PROP-DET", fields);
      const before = JSON.stringify(candidate);
      const first = validateExecutiveDecisionRegisterEntityInstance(candidate);
      const second = validateExecutiveDecisionRegisterEntityInstance(candidate);
      assert.deepEqual(first, second);
      assert.equal(JSON.stringify(candidate), before);
      assert.equal(Object.isFrozen(first), true);
      assert.equal(Object.isFrozen(first.issues), true);
      assert.equal(Object.isFrozen(ExecutiveDecisionRegisterValidation.rules), true);
      const summaryA = getExecutiveDecisionRegisterValidationSummary();
      const summaryB = getExecutiveDecisionRegisterValidationSummary();
      assert.deepEqual(summaryA, summaryB);
      assert.equal(Object.isFrozen(summaryA), true);
      assert.equal(
        verifyExecutiveDecisionRegisterValidationRuleCompleteness().valid,
        true,
      );
    });
  });

  describe("Identity and structural failures", () => {
    it("rejects malformed, partial, case-modified, and whitespace identities", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "", {}),
        ),
        "MalformedIdentity",
        "RTC-3:4/Rule/01",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", " leading", {}),
        ),
        "MalformedIdentity",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "trailing ", {}),
        ),
        "MalformedIdentity",
      );
      // Case-changed kind is unknown (no case normalization).
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("decisionrecord", "RTC-DEC-CASE", {}),
        ),
        "UnknownEntityKind",
      );
    });

    it("rejects unknown subject, entity kind mismatch, ordering, and relationship failures", () => {
      assert.equal(
        isCanonicalDecisionRegisterValidationSubjectKind("NotASubject"),
        false,
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "RTC-DEC-MIS", {
            declared_entity_kind: "DecisionProposal",
          }),
        ),
        "EntityKindMismatch",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "RTC-DEC-ORD", {
            require_ordering_metadata: true,
          }),
        ),
        "MissingOrderingMetadata",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterRelationships([
          Object.freeze({
            relationshipKind: "DeletesHistory",
            relationshipId: "R1",
            fromRef: "A",
            toRef: "B",
          }),
        ]),
        "UnknownRelationshipKind",
      );
    });
  });

  describe("Lifecycle failures", () => {
    it("rejects confirmed without human confirmation", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "RTC-DEC-NH", {
            decision_state: "Confirmed",
            authority_ref: "A1",
          }),
        ),
        "MissingHumanConfirmation",
        "RTC-3:4/Rule/10",
      );
    });
  });

  describe("Authority and delegation failures", () => {
    it("rejects missing actor, purpose, scope, and authority evidence", () => {
      const result = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "RTC-DEC-AC", {
          authority_state: "Authoritative",
          authority_ref: "A1",
          producing_event_refs: ["E1"],
          require_authority_completeness: true,
        }),
      );
      assert.equal(result.valid, false);
      assert.ok(hasCode(result, "MissingActorRef"));
      assert.ok(hasCode(result, "MissingPurpose"));
      assert.ok(hasCode(result, "MissingAuthorityScope"));
      assert.ok(hasCode(result, "MissingAuthorityEvidence"));
    });

    it("rejects expired delegation and authority substitutes", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionAuthority", "AUTH-EX", {
            delegator: "A",
            delegate: "B",
            scope: "s",
            effective_point: "t0",
            expiry: "t1",
            revocation_state: "Active",
            evidence_reference: "E1",
            delegation_expired: true,
          }),
        ),
        "ExpiredDelegation",
        "RTC-3:4/Rule/19",
      );
      for (const field of [
        "authority_from_identity",
        "authority_from_role",
        "authority_from_attendance",
        "authority_from_silence",
        "authority_from_ai_confidence",
        "confirmation_from_attendance",
        "confirmation_from_silence",
      ] as const) {
        assertInvalidCode(
          validateExecutiveDecisionRegisterEntityInstance(
            instance("DecisionRecord", `RTC-DEC-${field}`, {
              [field]: true,
            }),
          ),
          "AuthoritySubstituteRejected",
          "RTC-3:4/Rule/20",
        );
      }
    });
  });

  describe("Confirmation failures", () => {
    it("rejects system-derived, unauthorized, mismatched, and incomplete confirmations", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionConfirmation", "CONF-SYS", {
            actor_kind: "system",
            origin_state: "SystemDerived",
          }),
        ),
        "SystemDerivedConfirmer",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionConfirmation", "CONF-UN", {
            actor_kind: "human",
            unauthorized_confirmer: true,
          }),
        ),
        "UnauthorizedConfirmer",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionConfirmation", "CONF-AUTH", {
            actor_kind: "human",
            confirmation_source: "HumanConfirmed",
            decision_proposal: "P1",
            exact_proposed_decision_effect: "e",
            authority_ref: "A1",
            expected_authority_ref: "A2",
            evidence_set: ["E1"],
            confirmation_identity: "C1",
          }),
        ),
        "ConfirmationMismatch",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionConfirmation", "CONF-EV", {
            actor_kind: "human",
            confirmation_source: "HumanConfirmed",
            decision_proposal: "P1",
            exact_proposed_decision_effect: "e",
            authority_ref: "A1",
            evidence_set: ["E1"],
            expected_evidence_set: ["E2"],
            confirmation_identity: "C1",
          }),
        ),
        "ConfirmationMismatch",
      );
      const incomplete = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionConfirmation", "CONF-INC", {
          actor_kind: "human",
          confirmation_source: "HumanConfirmed",
          decision_proposal: "P1",
          exact_proposed_decision_effect: "e",
          authority_ref: "A1",
          evidence_set: ["E1"],
          require_confirmation_completeness: true,
          policy_version_required: true,
        }),
      );
      assert.ok(hasCode(incomplete, "MissingConfirmationIdentity"));
      assert.ok(hasCode(incomplete, "MissingSingleUse"));
      assert.ok(hasCode(incomplete, "MissingPolicyVersion"));
    });
  });

  describe("AI-boundary failures", () => {
    it("rejects each canonical AI prohibition independently", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "AI-CONF", {
            ai_confirmed: true,
          }),
        ),
        "AiConfirmDecision",
        "RTC-3:4/Rule/33",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionAuthority", "AI-CREATE", {
            origin_state: "AiProposed",
          }),
        ),
        "AiCreateAuthority",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionAuthority", "AI-BROAD", {
            ai_broadened_authority: true,
          }),
        ),
        "AiBroadenAuthority",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProposal", "AI-AUTH", {
            origin_state: "AiProposed",
            authority_state: "Authoritative",
          }),
        ),
        "AiMakeAuthoritative",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionDispute", "AI-RES", {
            challenged_decision_ref: "D1",
            resolution_state: "Resolved",
            resolution_event: "E1",
            dispute_identity: "AI-RES",
            ai_resolved: true,
          }),
        ),
        "AiResolveDispute",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionSupersession", "AI-SUP", {
            predecessor_decision: "D1",
            successor_decision: "D2",
            ai_superseded: true,
          }),
        ),
        "AiSupersedeDecision",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "AI-CLOSE", {
            decision_state: "Closed",
            closure_metadata: "c",
            authority_state: "Authoritative",
            authority_ref: "A",
            confirmation_ref: "C",
            producing_event_refs: ["E"],
            ai_closed: true,
          }),
        ),
        "AiCloseDecision",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "AI-DISCL", {
            ai_disclosed_restricted: true,
          }),
        ),
        "AiDiscloseRestricted",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "AI-RET", {
            ai_changed_retention: true,
          }),
        ),
        "AiChangeRetention",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionDisposition", "AI-DISP", {
            disposition_state: "Disposed",
            governance_evidence_refs: ["G1"],
            ai_disposed: true,
          }),
        ),
        "AiDisposeRecord",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionConfirmation", "AI-SAT", {
            ai_satisfied_confirmation: true,
          }),
        ),
        "AiSatisfyConfirmation",
      );
      assert.equal(
        ExecutiveDecisionRegisterValidation.aiMustNot,
        ExecutiveDecisionRegisterModel.aiMustNot,
      );
    });
  });

  describe("Append-only failures", () => {
    it("rejects incomplete corrections and in-place replacement", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionCorrection", "COR-EVT", {
            corrected_decision_ref: "D1",
          }),
        ),
        "MissingAffectedReference",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionCorrection", "COR-NEW", {
            corrected_decision_ref: "D1",
            affected_event_ref: "E1",
            require_correction_completeness: true,
          }),
        ),
        "MissingProducingEvent",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionCorrection", "COR-IP", {
            corrected_decision_ref: "D1",
            affected_event_ref: "E1",
            in_place_replacement: true,
          }),
        ),
        "InPlaceReplacement",
      );
    });

    it("rejects incomplete dispute/resolution and supersession lineage", () => {
      const dispute = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDispute", "DSP-INC", {
          challenged_decision_ref: "D1",
          require_dispute_completeness: true,
          resolution_state: "Disputed",
        }),
      );
      assert.ok(hasCode(dispute, "MissingChallengedEvent"));
      assert.ok(hasCode(dispute, "MissingInitiator"));
      assert.ok(hasCode(dispute, "MissingBasis"));
      assert.ok(hasCode(dispute, "MissingReviewOwner"));
      const resolved = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDispute", "DSP-RES", {
          challenged_decision_ref: "D1",
          challenged_event_or_claim_ref: "E1",
          initiator: "I",
          basis: "b",
          review_owner: "R",
          resolution_state: "Resolved",
          dispute_identity: "DSP-RES",
          require_resolution_completeness: true,
        }),
      );
      assert.ok(hasCode(resolved, "MissingDisputeReference"));
      assert.ok(hasCode(resolved, "MissingResolutionAuthority"));
      assert.ok(hasCode(resolved, "MissingResolutionEvidence"));
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionDispute", "DSP-ER", {
            challenged_decision_ref: "D1",
            dispute_erased: true,
          }),
        ),
        "DisputeErased",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionSupersession", "SUP-MISS", {
            predecessor_decision: "D1",
          }),
        ),
        "MissingSuccessor",
      );
      const sup = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionSupersession", "SUP-INC", {
          predecessor_decision: "D1",
          successor_decision: "D2",
          require_supersession_completeness: true,
        }),
      );
      assert.ok(hasCode(sup, "MissingEffectivePoint"));
      assert.ok(hasCode(sup, "MissingSupersessionAuthority"));
      assert.ok(hasCode(sup, "MissingSupersessionEvidence"));
    });

    it("rejects disposition historical erasure", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionDisposition", "DIS-ER", {
            disposition_state: "Disposed",
            governance_evidence_refs: ["G1"],
            historical_erasure: true,
          }),
        ),
        "HistoricalErasure",
      );
    });
  });

  describe("Evidence and provenance failures", () => {
    it("rejects incomplete evidence and provenance metadata", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionEvidence", "EV-VP", {
            evidence_category: "VersionPinned",
          }),
        ),
        "MissingEvidenceVersion",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionEvidence", "EV-CA", {
            evidence_category: "ContentAddressed",
          }),
        ),
        "MissingEvidenceDigest",
      );
      const evidence = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionEvidence", "EV-INC", {
          evidence_category: "Referenced",
          require_evidence_completeness: true,
        }),
      );
      assert.ok(hasCode(evidence, "MissingEvidenceIdentity"));
      assert.ok(hasCode(evidence, "MissingEvidenceType"));
      assert.ok(hasCode(evidence, "MissingAvailabilityState"));
      assert.ok(hasCode(evidence, "MissingClassification"));
      assert.ok(hasCode(evidence, "MissingIntegrityRequirement"));
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-DV", {
            derived: true,
            producing_event_refs: ["E1"],
          }),
        ),
        "MissingDerivationVersion",
      );
      const prov = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionRecord", "DEC-PROV", {
          authority_state: "Authoritative",
          authority_ref: "A1",
          producing_event_refs: ["E1"],
          require_provenance_completeness: true,
        }),
      );
      assert.ok(hasCode(prov, "MissingSourceRegister"));
      assert.ok(hasCode(prov, "MissingEventVersionOrSequence"));
    });
  });

  describe("Outcome and projection failures", () => {
    it("rejects incomplete outcome references without deciding closure sufficiency", () => {
      const outcome = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionOutcomeReference", "OUT-INC", {
          require_outcome_completeness: true,
        }),
      );
      assert.ok(hasCode(outcome, "MissingRequiredField"));
      assert.ok(hasCode(outcome, "MissingOutcomeReference"));
      assert.ok(hasCode(outcome, "MissingProducingEvent"));
      assert.ok(
        ExecutiveDecisionRegisterValidation.openIssues.some(
          (item) => item.issueId === "OI-05" && item.resolved === false,
        ),
      );
    });

    it("rejects incomplete projections and prohibited projection effects", () => {
      const projection = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionProjection", "PRJ-INC", {
          producing_event_refs: ["E1"],
          derivation_version: "1",
          require_projection_completeness: true,
        }),
      );
      assert.ok(hasCode(projection, "ProjectionMissingIdentity"));
      assert.ok(hasCode(projection, "ProjectionMissingSourceRegister"));
      assert.ok(hasCode(projection, "ProjectionMissingSequence"));
      assert.ok(hasCode(projection, "ProjectionMissingStaleness"));
      assert.ok(hasCode(projection, "ProjectionMissingAuthorityLimitations"));
      assert.ok(hasCode(projection, "MissingProvenance"));
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-AUTH", {
            producing_event_refs: ["E1"],
            derivation_version: "1",
            creates_authority: true,
          }),
        ),
        "ProjectionCreatesAuthority",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-CONF", {
            producing_event_refs: ["E1"],
            derivation_version: "1",
            confirms_decision: true,
          }),
        ),
        "ProjectionConfirmsDecisions",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-HIDE", {
            producing_event_refs: ["E1"],
            derivation_version: "1",
            hides_dispute_status: true,
          }),
        ),
        "ProjectionHidesDispute",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionProjection", "PRJ-ERASE", {
            producing_event_refs: ["E1"],
            derivation_version: "1",
            erases_historical_lineage: true,
          }),
        ),
        "ProjectionErasesLineage",
      );
    });
  });

  describe("Privacy and disposition failures", () => {
    it("rejects unknown privacy, automatic promotion, and cross-category conversion", () => {
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "PRIV-U", {
            privacy_category: "PrivateReflection",
          }),
        ),
        "UnknownPrivacyCategory",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "PRIV-AUTO", {
            automatic_private_reflection_promotion: true,
          }),
        ),
        "AutomaticPromotion",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "PRIV-X", {
            cross_category_conversion: true,
          }),
        ),
        "CrossCategoryConversion",
      );
      assertInvalidCode(
        validateExecutiveDecisionRegisterEntityInstance(
          instance("DecisionRecord", "PRIV-REG", {
            record_category: "RegulatedOrPrivilegedRecord",
          }),
        ),
        "MissingClassification",
      );
    });

    it("rejects incomplete disposition metadata", () => {
      const disposition = validateExecutiveDecisionRegisterEntityInstance(
        instance("DecisionDisposition", "DIS-INC", {
          disposition_state: "Disposed",
          governance_evidence_refs: ["G1"],
          require_disposition_completeness: true,
        }),
      );
      assert.ok(hasCode(disposition, "MissingDispositionActor"));
      assert.ok(hasCode(disposition, "MissingDispositionAuthority"));
      assert.ok(hasCode(disposition, "MissingClassification"));
    });
  });

  describe("Telemetry failures", () => {
    it("rejects each forbidden telemetry content class", () => {
      for (const field of [
        "decision_claim",
        "rationale",
        "evidence_content",
        "private_content",
        "privileged_content",
        "restricted_title",
        "restricted_snippet",
        "export_content",
        "decrypted_value",
      ] as const) {
        assertInvalidCode(
          validateExecutiveDecisionRegisterTelemetryDescriptor(
            Object.freeze({
              descriptorId: `TEL-${field}`,
              fields: Object.freeze({ [field]: "x" }),
            }),
          ),
          "TelemetryContainsPayload",
          "RTC-3:4/Rule/34",
        );
      }
    });
  });

  describe("Decisions, open issues, and package exports", () => {
    it("preserves D-01 through D-24 and unresolved OI-01 through OI-06", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterValidation.decisions.map((d) => d.decisionId),
        ["D-19", "D-20", "D-21", "D-22", "D-23", "D-24"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterValidation.upstreamFoundationDecisions.map(
          (d) => d.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterValidation.upstreamRegistryDecisions.map(
          (d) => d.decisionId,
        ),
        ["D-07", "D-08", "D-09", "D-10", "D-11", "D-12"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterValidation.upstreamModelDecisions.map(
          (d) => d.decisionId,
        ),
        ["D-13", "D-14", "D-15", "D-16", "D-17", "D-18"],
      );
      const allIds = [
        ...ExecutiveDecisionRegisterValidation.upstreamFoundationDecisions,
        ...ExecutiveDecisionRegisterValidation.upstreamRegistryDecisions,
        ...ExecutiveDecisionRegisterValidation.upstreamModelDecisions,
        ...ExecutiveDecisionRegisterValidation.decisions,
      ].map((d) => d.decisionId);
      assert.equal(new Set(allIds).size, 24);
      for (const expected of EXPECTED_OPEN_ISSUES) {
        const found = ExecutiveDecisionRegisterValidation.openIssues.find(
          (item) => item.issueId === expected.issueId,
        );
        assert.ok(found);
        assert.equal(found.accountableOwner, expected.accountableOwner);
        assert.equal(found.resolved, false);
      }
      assert.ok("ExecutiveDecisionRegisterValidation" in ValidationModule);
      assert.equal(ExecutiveDecisionRegisterValidation.importsRtc2, false);
      assert.equal(ExecutiveDecisionRegisterValidation.importsRtc1, false);
      assert.equal(ExecutiveDecisionRegisterValidation.importsApp8, false);
      assert.equal(
        ExecutiveDecisionRegisterValidation.importsRegistryDirectly,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterValidation.importsFoundationDirectly,
        false,
      );
    });
  });
});
