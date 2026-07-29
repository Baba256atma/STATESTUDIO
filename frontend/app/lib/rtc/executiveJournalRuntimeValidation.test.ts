/**
 * RTC-2:4 — Executive Journal Runtime Validation Tests.
 *
 * Deterministic coverage for pure journal validation evaluation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveJournalRuntimeModel } from "./executiveJournalRuntimeModel.ts";
import * as ValidationModule from "./executiveJournalRuntimeValidation.ts";
import {
  ExecutiveJournalRuntimeValidation,
  ExecutiveJournalRuntimeValidationId,
  ExecutiveJournalRuntimeValidationName,
  ExecutiveJournalRuntimeValidationNamespace,
  ExecutiveJournalRuntimeValidationReadiness,
  ExecutiveJournalRuntimeValidationStatus,
  ExecutiveJournalRuntimeValidationVersion,
  getExecutiveJournalRuntimeValidationSummary,
  isExecutiveJournalValidationResultValid,
  validateExecutiveJournalEntityCollection,
  validateExecutiveJournalEntityInstance,
  validateExecutiveJournalRelationships,
  validateExecutiveJournalRuntimeModel,
  validateExecutiveJournalTelemetryDescriptor,
} from "./executiveJournalRuntimeValidation.ts";
import type { ExecutiveJournalRuntimeEntityInstance } from "./executiveJournalRuntimeValidationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC24_FILES = Object.freeze([
  "executiveJournalRuntimeValidation.ts",
  "executiveJournalRuntimeValidationTypes.ts",
  "executiveJournalRuntimeValidationIdentity.ts",
  "executiveJournalRuntimeValidationLifecycle.ts",
  "executiveJournalRuntimeValidationContracts.ts",
  "executiveJournalRuntimeValidationRules.ts",
  "executiveJournalRuntimeValidationMetadata.ts",
  "executiveJournalRuntimeValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveJournalRuntimeValidationId",
  "ExecutiveJournalRuntimeValidationVersion",
  "ExecutiveJournalRuntimeValidationName",
  "ExecutiveJournalRuntimeValidationNamespace",
  "ExecutiveJournalRuntimeValidationStatus",
  "ExecutiveJournalRuntimeValidationReadiness",
  "ExecutiveJournalRuntimeValidation",
  "getExecutiveJournalRuntimeValidationSummary",
  "getExecutiveJournalRuntimeValidation",
  "validateExecutiveJournalRuntimeModel",
  "validateExecutiveJournalEntityInstance",
  "isExecutiveJournalValidationResultValid",
] as const);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  "OI-01",
  "OI-02",
  "OI-03",
  "OI-04",
  "OI-05",
  "OI-06",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const provenance = Object.freeze({
  producing_event_refs: Object.freeze(["RTC-JEVT-1"]),
  journal_id: "RTC-JRN-00000001",
  journal_sequence: "1",
  event_type: "decision.confirmed",
  event_version: "1",
  recorded_at: "2026-01-01T00:00:00Z",
  actor_ref: "actor-1",
  authority_ref: "authority-1",
  evidence_refs: Object.freeze(["evidence-1"]),
});

const instance = (
  entityKind: string,
  entityId: string,
  fields: Record<string, unknown>,
): ExecutiveJournalRuntimeEntityInstance =>
  Object.freeze({
    entityKind,
    entityId,
    fields: Object.freeze({ ...fields }),
  });

const hasCode = (
  result: ReturnType<typeof validateExecutiveJournalEntityInstance>,
  code: string,
): boolean => result.issues.some((item) => item.issueCode === code);

describe("RTC-2:4 Executive Journal Runtime Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(RTC24_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC24_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("publishes required public exports and canonical identity", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(exportName in ValidationModule, `missing ${exportName}`);
    }
    assert.equal(
      ExecutiveJournalRuntimeValidationId,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(ExecutiveJournalRuntimeValidationVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeValidationName,
      "Executive Journal Runtime Validation",
    );
    assert.equal(
      ExecutiveJournalRuntimeValidationNamespace,
      "nexora.rtc.executive.journal.validation",
    );
    assert.equal(ExecutiveJournalRuntimeValidationStatus, "Validation");
    assert.equal(
      ExecutiveJournalRuntimeValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveJournalRuntimeValidation.nextPhase,
      "RTC-2:5 — Executive Journal Runtime Policy",
    );
  });

  it("imports RTC-2:3 by reference and does not import foundation or registry", () => {
    assert.equal(
      ExecutiveJournalRuntimeValidation.model,
      ExecutiveJournalRuntimeModel,
    );
    assert.equal(
      ExecutiveJournalRuntimeValidation.importsFoundationDirectly,
      false,
    );
    assert.equal(
      ExecutiveJournalRuntimeValidation.aiMustNot,
      ExecutiveJournalRuntimeModel.aiMustNot,
    );

    const sources = RTC24_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(source, pattern, `${file} ${pattern}`);
      }
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
      assert.doesNotMatch(source, /\b(fetch|Date\.now|Math\.random)\b/);
    }
  });

  it("accepts the canonical RTC-2:3 model as Valid", () => {
    const result = validateExecutiveJournalRuntimeModel();
    assert.equal(result.outcome, "Valid");
    assert.equal(result.valid, true);
    assert.equal(isExecutiveJournalValidationResultValid(result), true);
    assert.equal(result.errorCount, 0);
  });

  it("fails missing required fields, unknown vocabulary, and malformed identity", () => {
    const missing = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-1", {
        ...provenance,
        required_fields: Object.freeze(["decision_id"]),
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(missing.valid, false);
    assert.equal(hasCode(missing, "MissingRequiredField"), true);

    const vocab = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-2", {
        ...provenance,
        decision_id: "decision-2",
        acceptance_state: "NotARealState",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(vocab, "UnknownVocabularyValue"), true);

    const malformed = validateExecutiveJournalEntityInstance(
      instance("Decision", " decision-3 ", {
        ...provenance,
        decision_id: "decision-3",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(malformed, "MalformedIdentity"), true);
  });

  it("fails duplicate identities and missing provenance", () => {
    const duplicate = validateExecutiveJournalEntityCollection([
      instance("Decision", "dup-1", {
        ...provenance,
        decision_id: "dup-1",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
      instance("Decision", "dup-1", {
        ...provenance,
        decision_id: "dup-1",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    ]);
    assert.equal(hasCode(duplicate, "DuplicateEntityIdentity"), true);

    const noProvenance = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-np", {
        decision_id: "decision-np",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
        authority_ref: "authority-1",
      }),
    );
    assert.equal(hasCode(noProvenance, "MissingProvenance"), true);
  });

  it("fails derived-as-authoritative and missing authority_ref", () => {
    const derived = validateExecutiveJournalEntityInstance(
      instance("Projection", "proj-1", {
        ...provenance,
        authority_kind: "Authoritative",
        projector_version: "1",
        source_event_ids: Object.freeze(["RTC-JEVT-1"]),
        derived: true,
      }),
    );
    assert.equal(hasCode(derived, "DerivedMarkedAuthoritative"), true);

    const noAuthority = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-na", {
        producing_event_refs: provenance.producing_event_refs,
        journal_id: provenance.journal_id,
        journal_sequence: provenance.journal_sequence,
        event_type: provenance.event_type,
        event_version: provenance.event_version,
        recorded_at: provenance.recorded_at,
        actor_ref: provenance.actor_ref,
        decision_id: "decision-na",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(noAuthority, "MissingAuthorityRef"), true);
  });

  it("fails incomplete delegation and authority substitutes", () => {
    const delegation = validateExecutiveJournalEntityInstance(
      instance("AuthorityReference", "auth-1", {
        authority_ref: "auth-1",
        delegator: "exec-1",
        grant_kind: "delegation",
      }),
    );
    assert.equal(hasCode(delegation, "IncompleteDelegation"), true);

    const substitute = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-sub", {
        ...provenance,
        decision_id: "decision-sub",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
        authority_from_title: true,
      }),
    );
    assert.equal(hasCode(substitute, "AuthoritySubstituteRejected"), true);
  });

  it("validates correction, supersession, and dispute relationships", () => {
    const goodCorrection = validateExecutiveJournalEntityInstance(
      instance("Correction", "corr-1", {
        ...provenance,
        correction_id: "corr-1",
        affected_ref: "decision-1",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
        original_retained: true,
      }),
    );
    assert.equal(hasCode(goodCorrection, "MissingAffectedReference"), false);

    const badCorrection = validateExecutiveJournalEntityInstance(
      instance("Correction", "corr-2", {
        ...provenance,
        correction_id: "corr-2",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(badCorrection, "MissingAffectedReference"), true);

    const supersession = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-sup", {
        ...provenance,
        decision_id: "decision-sup",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
        currency_state: "Superseded",
      }),
    );
    assert.equal(hasCode(supersession, "MissingPredecessor"), true);

    const dispute = validateExecutiveJournalEntityInstance(
      instance("Dispute", "dispute-1", {
        ...provenance,
        dispute_id: "dispute-1",
        affected_ref: "decision-1",
        dispute_state: "Resolved",
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(dispute, "InvalidDisputeTransition"), true);

    const relationships = validateExecutiveJournalRelationships([
      instance("Correction", "corr-rel", {
        ...provenance,
        affected_ref: "missing-target",
        affected_must_exist: true,
        acceptance_state: "Accepted",
        confirmation_source: "HumanConfirmed",
      }),
    ]);
    assert.equal(hasCode(relationships, "MissingAffectedReference"), true);
  });

  it("enforces private-reflection isolation and AI boundary", () => {
    const privacy = validateExecutiveJournalEntityInstance(
      instance("Projection", "proj-priv", {
        ...provenance,
        authority_kind: "Derived",
        projector_version: "1",
        source_event_ids: Object.freeze(["RTC-JEVT-1"]),
        includes_private_reflection: true,
      }),
    );
    assert.equal(hasCode(privacy, "PrivateReflectionInSharedProjection"), true);

    const aiDecision = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-ai", {
        ...provenance,
        decision_id: "decision-ai",
        acceptance_state: "Accepted",
        confirmation_source: "AiProposed",
      }),
    );
    assert.equal(hasCode(aiDecision, "AiConfirmDecision"), true);

    const aiAuthority = validateExecutiveJournalEntityInstance(
      instance("AuthorityReference", "auth-ai", {
        authority_ref: "auth-ai",
        grant_kind: "mandate",
        confirmation_source: "AiProposed",
        scope: "domain",
        effective_at: "t0",
        revocation_state: "Active",
        evidence_refs: Object.freeze(["e1"]),
      }),
    );
    assert.equal(hasCode(aiAuthority, "AiCreateAuthority"), true);

    const aiCommitment = validateExecutiveJournalEntityInstance(
      instance("Commitment", "commit-ai", {
        ...provenance,
        commitment_id: "commit-ai",
        acceptance_state: "Accepted",
        closure_state: "Closed",
        confirmation_source: "AiProposed",
        owner_ref: "owner-1",
      }),
    );
    assert.equal(hasCode(aiCommitment, "AiCloseCommitment"), true);

    const aiDisclosure = validateExecutiveJournalEntityInstance(
      instance("DisclosureRecord", "disc-ai", {
        ...provenance,
        disclosure_id: "disc-ai",
        purpose: "audit",
        access_decision_id: "pol-1",
        confirmation_source: "AiProposed",
      }),
    );
    assert.equal(hasCode(aiDisclosure, "AiDiscloseRestricted"), true);

    const aiDisposition = validateExecutiveJournalEntityInstance(
      instance("DispositionRecord", "disp-ai", {
        ...provenance,
        disposition_id: "disp-ai",
        affected_ref: "evt-1",
        disposition_state: "Disposed",
        disposition_proof: "proof-1",
        confirmation_source: "AiProposed",
      }),
    );
    assert.equal(hasCode(aiDisposition, "AiDisposeRecord"), true);

    const aiRetention = validateExecutiveJournalEntityInstance(
      instance("Decision", "decision-ret", {
        ...provenance,
        decision_id: "decision-ret",
        acceptance_state: "Accepted",
        confirmation_source: "AiProposed",
        alters_retention: true,
      }),
    );
    assert.equal(hasCode(aiRetention, "AiAlterRetention"), true);
  });

  it("enforces disclosure fail-closed, projection events, and telemetry payload exclusion", () => {
    const disclosure = validateExecutiveJournalEntityInstance(
      instance("DisclosureRecord", "disc-1", {
        ...provenance,
        disclosure_id: "disc-1",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(disclosure, "MissingDisclosurePolicyEvidence"), true);

    const failClosed = validateExecutiveJournalEntityInstance(
      instance("DisclosureRecord", "disc-2", {
        ...provenance,
        disclosure_id: "disc-2",
        purpose: "audit",
        access_decision_id: "pol-1",
        policy_state: "Unknown",
        disclosed_content: "secret",
        confirmation_source: "HumanConfirmed",
      }),
    );
    assert.equal(hasCode(failClosed, "DisclosureFailClosed"), true);

    const projection = validateExecutiveJournalEntityInstance(
      instance("Projection", "proj-2", {
        journal_id: "RTC-JRN-00000001",
        journal_sequence: "1",
        event_type: "projection",
        event_version: "1",
        recorded_at: "2026-01-01T00:00:00Z",
        actor_ref: "actor-1",
        authority_kind: "Derived",
      }),
    );
    assert.equal(hasCode(projection, "ProjectionMissingEvents"), true);

    const telemetry = validateExecutiveJournalTelemetryDescriptor(
      Object.freeze({
        descriptorId: "tel-1",
        fields: Object.freeze({
          event_count: 1,
          payload: "journal-body",
        }),
      }),
    );
    assert.equal(hasCode(telemetry, "TelemetryContainsPayload"), true);
  });

  it("does not mutate inputs and orders issues deterministically", () => {
    const subject = instance("Decision", "decision-ord", {
      decision_id: "decision-ord",
      acceptance_state: "NotARealState",
      confirmation_source: "AiProposed",
      authority_from_title: true,
    });
    const before = JSON.stringify(subject);
    const resultA = validateExecutiveJournalEntityInstance(subject);
    const resultB = validateExecutiveJournalEntityInstance(subject);
    assert.equal(JSON.stringify(subject), before);
    assert.deepEqual(resultA, resultB);
    assert.equal(Object.isFrozen(resultA), true);
    assert.equal(Object.isFrozen(resultA.issues), true);
    const keys = resultA.issues.map((item) => item.orderKey);
    assert.deepEqual(keys, [...keys].sort());
  });

  it("carries OI-01 through OI-06 unresolved and preserves AI prohibitions", () => {
    const issues = ExecutiveJournalRuntimeValidation.openIssues;
    assert.equal(issues.length, 6);
    for (const id of EXPECTED_OPEN_ISSUES) {
      const found = issues.find((item) => item.issueId === id);
      assert.ok(found, id);
      assert.equal(found?.resolved, false);
      assert.equal(found?.resolvedByValidation, false);
    }
    assert.equal(ExecutiveJournalRuntimeValidation.resolvesOpenIssues, false);
    assert.deepEqual(
      [...ExecutiveJournalRuntimeValidation.aiMustNot],
      [
        "confirm decisions",
        "create authority",
        "close commitments",
        "disclose restricted material",
        "alter retention state",
      ],
    );
  });

  it("preserves deterministic summary", () => {
    const summaryA = getExecutiveJournalRuntimeValidationSummary();
    const summaryB = getExecutiveJournalRuntimeValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.ruleCount, 27);
    assert.equal(summaryA.familyCount, 11);
    assert.equal(summaryA.openIssueCount, 6);
    assert.equal(
      summaryA.sourceModel,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
  });
});
