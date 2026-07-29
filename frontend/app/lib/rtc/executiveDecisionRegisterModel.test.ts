/**
 * RTC-3:3 — Executive Decision Register Model Tests.
 *
 * Deterministic coverage for the immutable Executive Decision Register Model.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./executiveDecisionRegisterModel.ts";
import {
  ExecutiveDecisionRegisterModel,
  ExecutiveDecisionRegisterModelId,
  ExecutiveDecisionRegisterModelName,
  ExecutiveDecisionRegisterModelNamespace,
  ExecutiveDecisionRegisterModelReadiness,
  ExecutiveDecisionRegisterModelStatus,
  ExecutiveDecisionRegisterModelVersion,
  getExecutiveDecisionRegisterModelSummary,
  isCanonicalDecisionRegisterAuthorityState,
  isCanonicalDecisionRegisterClosureState,
  isCanonicalDecisionRegisterCurrencyState,
  isCanonicalDecisionRegisterDecisionLifecycleState,
  isCanonicalDecisionRegisterDispositionState,
  isCanonicalDecisionRegisterDisputeState,
  isCanonicalDecisionRegisterEntityKind,
  isCanonicalDecisionRegisterEvidenceCategory,
  isCanonicalDecisionRegisterOriginState,
  isCanonicalDecisionRegisterPrivacyCategory,
  isCanonicalDecisionRegisterRelationshipKind,
} from "./executiveDecisionRegisterModel.ts";
import { ExecutiveDecisionRegisterEntityNames } from "./executiveDecisionRegisterModelEntities.ts";
import { ExecutiveDecisionRegisterRegistry } from "./executiveDecisionRegisterRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC33_FILES = Object.freeze([
  "executiveDecisionRegisterModel.ts",
  "executiveDecisionRegisterModelTypes.ts",
  "executiveDecisionRegisterModelIdentity.ts",
  "executiveDecisionRegisterModelLifecycle.ts",
  "executiveDecisionRegisterModelContracts.ts",
  "executiveDecisionRegisterModelEntities.ts",
  "executiveDecisionRegisterModelMetadata.ts",
  "executiveDecisionRegisterModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveDecisionRegisterModelId",
  "ExecutiveDecisionRegisterModelVersion",
  "ExecutiveDecisionRegisterModelName",
  "ExecutiveDecisionRegisterModelNamespace",
  "ExecutiveDecisionRegisterModelStatus",
  "ExecutiveDecisionRegisterModelReadiness",
  "ExecutiveDecisionRegisterModel",
  "getExecutiveDecisionRegisterModelSummary",
  "getExecutiveDecisionRegisterModel",
  "ExecutiveDecisionRegisterModelIdentity",
  "ExecutiveDecisionRegisterModelNextPhase",
] as const);

const EXPECTED_ENTITY_NAMES = Object.freeze([
  "DecisionRegister",
  "DecisionRecord",
  "DecisionProposal",
  "DecisionAuthority",
  "DecisionConfirmation",
  "DecisionAlternative",
  "DecisionConstraint",
  "DecisionEvidence",
  "DecisionCorrection",
  "DecisionDispute",
  "DecisionSupersession",
  "DecisionOutcomeReference",
  "DecisionProjection",
  "DecisionDisposition",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "ProposedFrom",
  "ConfirmedBy",
  "Corrects",
  "Disputes",
  "ResolvesDispute",
  "Supersedes",
  "ReferencesOutcome",
  "DerivedFrom",
  "DisposedBy",
] as const);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  Object.freeze({
    issueId: "OI-01",
    accountableOwner: "Records / legal",
  }),
  Object.freeze({
    issueId: "OI-02",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-03",
    accountableOwner: "Journal steward",
  }),
  Object.freeze({
    issueId: "OI-04",
    accountableOwner: "Privacy + legal",
  }),
  Object.freeze({
    issueId: "OI-05",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-06",
    accountableOwner: "Architecture authority",
  }),
]);

const EXPECTED_AI_MUST_NOT = Object.freeze([
  "Confirm a decision",
  "Create or broaden authority",
  "Make a proposal authoritative",
  "Resolve a dispute",
  "Supersede an effective decision",
  "Close a decision",
  "Disclose restricted material",
  "Change retention",
  "Dispose a record",
  "Satisfy human confirmation",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs["']/,
]);

const sourceFiles = () =>
  RTC33_FILES.filter((name) => !name.endsWith(".test.ts"));

const fieldNames = (entityName: string): readonly string[] => {
  const entity = ExecutiveDecisionRegisterModel.entities.find(
    (item) => item.entityName === entityName,
  );
  assert.ok(entity, `missing entity ${entityName}`);
  return entity.fields.map((field) => field.fieldName);
};

const contractFields = (contractName: string): readonly string[] => {
  const contract = ExecutiveDecisionRegisterModel.contracts.find(
    (item) => item.contractName === contractName,
  );
  assert.ok(contract, `missing contract ${contractName}`);
  return contract.fields;
};

describe("RTC-3:3 Executive Decision Register Model", () => {
  describe("Package and identity", () => {
    it("creates exactly eight Model files", () => {
      assert.equal(RTC33_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of RTC33_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      const artifacts = present.filter((name) => RTC33_FILES.includes(name));
      assert.equal(artifacts.length, 8);
    });

    it("publishes required public exports", () => {
      for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
        assert.ok(
          exportName in ModelModule,
          `missing public export ${exportName}`,
        );
      }
    });

    it("has exact RTC-3:3 identity", () => {
      assert.equal(
        ExecutiveDecisionRegisterModelId,
        "RTC-3:3/ExecutiveDecisionRegisterModel",
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.identity.id,
        "RTC-3:3/ExecutiveDecisionRegisterModel",
      );
    });

    it("has exact model namespace", () => {
      assert.equal(
        ExecutiveDecisionRegisterModelNamespace,
        "nexora.rtc.executive.decision.register.model",
      );
    });

    it("status is Model and readiness is ReadyForValidation", () => {
      assert.equal(ExecutiveDecisionRegisterModelStatus, "Model");
      assert.equal(ExecutiveDecisionRegisterModel.status, "Model");
      assert.equal(
        ExecutiveDecisionRegisterModelReadiness,
        "ReadyForValidation",
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.readiness,
        "ReadyForValidation",
      );
      assert.equal(ExecutiveDecisionRegisterModelVersion, "1.0.0");
      assert.equal(
        ExecutiveDecisionRegisterModelName,
        "Executive Decision Register Model",
      );
    });

    it("nextPhase points only to RTC-3:4 Validation metadata", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.nextPhase,
        "RTC-3:4 — Executive Decision Register Validation",
      );
      assert.equal(ExecutiveDecisionRegisterModel.validationPhase, false);
    });
  });

  describe("Upstream chain", () => {
    it("imports RTC-3:2 by exact reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.registry,
        ExecutiveDecisionRegisterRegistry,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.registry.readiness,
        "ReadyForModel",
      );
    });

    it("resolves RTC-3:1 through RTC-3:2 and preserves exact entry/foundation", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.resolvesFoundationViaRegistry,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.importsFoundationDirectly,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundationEntry,
        ExecutiveDecisionRegisterRegistry.canonicalEntry,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation,
        ExecutiveDecisionRegisterRegistry.foundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundationEntry.foundation,
        ExecutiveDecisionRegisterModel.foundation,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation.readiness,
        "ReadyForRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation.identity.foundationId,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
    });

    it("has no direct RTC-3:1 runtime import", () => {
      for (const file of sourceFiles()) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        assert.doesNotMatch(
          source,
          /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
          `${file} must not runtime-import RTC-3:1 foundation`,
        );
      }
      const aggregate = readFileSync(
        new URL("executiveDecisionRegisterModel.ts", import.meta.url),
        "utf8",
      );
      const metadata = readFileSync(
        new URL("executiveDecisionRegisterModelMetadata.ts", import.meta.url),
        "utf8",
      );
      assert.match(
        aggregate,
        /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
      );
      assert.match(
        metadata,
        /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
      );
    });
  });

  describe("Entities", () => {
    it("root entity is exactly DecisionRegister", () => {
      assert.equal(ExecutiveDecisionRegisterModel.root.entityName, "DecisionRegister");
      assert.equal(ExecutiveDecisionRegisterModel.root.root, true);
      assert.equal(
        getExecutiveDecisionRegisterModelSummary().rootEntity,
        "DecisionRegister",
      );
    });

    it("all 14 canonical entity kinds exist exactly once", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterEntityNames],
        [...EXPECTED_ENTITY_NAMES],
      );
      assert.equal(ExecutiveDecisionRegisterModel.entities.length, 14);
      const names = ExecutiveDecisionRegisterModel.entities.map(
        (item) => item.entityName,
      );
      assert.deepEqual(names, [...EXPECTED_ENTITY_NAMES]);
      assert.equal(new Set(names).size, 14);
    });

    it("entity ordering is deterministic and descriptors are immutable", () => {
      const first = ExecutiveDecisionRegisterModel.entities.map(
        (item) => item.deterministicOrder,
      );
      const second = ExecutiveDecisionRegisterModel.entities.map(
        (item) => item.deterministicOrder,
      );
      assert.deepEqual(first, second);
      assert.deepEqual(first, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      assert.equal(Object.isFrozen(ExecutiveDecisionRegisterModel.entities), true);
      for (const entity of ExecutiveDecisionRegisterModel.entities) {
        assert.equal(Object.isFrozen(entity), true);
        assert.equal(Object.isFrozen(entity.fields), true);
        assert.equal(entity.executable, false);
        assert.equal(entity.storesRuntimeValues, false);
        assert.equal(entity.aiMayCreateAuthoritative, false);
        assert.equal(entity.allowsPrivateReflection, false);
      }
    });

    it("unknown entity kinds fail closed", () => {
      assert.equal(isCanonicalDecisionRegisterEntityKind("DecisionRegister"), true);
      assert.equal(isCanonicalDecisionRegisterEntityKind("Journal"), false);
      assert.equal(isCanonicalDecisionRegisterEntityKind("decisionregister"), false);
      assert.equal(isCanonicalDecisionRegisterEntityKind(""), false);
      assert.equal(isCanonicalDecisionRegisterEntityKind(null), false);
    });

    it("aggregate exposes exact canonical entity references", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionRegister,
        ExecutiveDecisionRegisterModel.entities[0],
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionRecord,
        ExecutiveDecisionRegisterModel.entities[1],
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionProjection,
        ExecutiveDecisionRegisterModel.entities[12],
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionDisposition,
        ExecutiveDecisionRegisterModel.entities[13],
      );
    });
  });

  describe("Closed state distinctions", () => {
    it("authority states are closed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.authority],
        ["NonAuthoritative", "Authoritative"],
      );
      assert.equal(isCanonicalDecisionRegisterAuthorityState("Authoritative"), true);
      assert.equal(isCanonicalDecisionRegisterAuthorityState("Maybe"), false);
    });

    it("origin states are closed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.origin],
        ["HumanAuthored", "AiProposed", "SystemDerived"],
      );
      assert.equal(isCanonicalDecisionRegisterOriginState("AiProposed"), true);
      assert.equal(isCanonicalDecisionRegisterOriginState("Bot"), false);
    });

    it("lifecycle states are closed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.decisionLifecycle],
        [
          "Proposed",
          "Confirmed",
          "Effective",
          "Disputed",
          "Superseded",
          "Closed",
          "Disposed",
        ],
      );
      assert.equal(
        isCanonicalDecisionRegisterDecisionLifecycleState("Effective"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterDecisionLifecycleState("Accepted"),
        false,
      );
    });

    it("currency, dispute, closure, and disposition states are closed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.currency],
        ["Current", "Superseded"],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.dispute],
        ["Undisputed", "Disputed", "Resolved"],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.closure],
        ["Open", "Closed"],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.disposition],
        ["Active", "Disposed"],
      );
      assert.equal(isCanonicalDecisionRegisterCurrencyState("Current"), true);
      assert.equal(isCanonicalDecisionRegisterCurrencyState("Old"), false);
      assert.equal(isCanonicalDecisionRegisterDisputeState("Resolved"), true);
      assert.equal(isCanonicalDecisionRegisterDisputeState("Pending"), false);
      assert.equal(isCanonicalDecisionRegisterClosureState("Open"), true);
      assert.equal(isCanonicalDecisionRegisterClosureState("Maybe"), false);
      assert.equal(isCanonicalDecisionRegisterDispositionState("Active"), true);
      assert.equal(isCanonicalDecisionRegisterDispositionState("Deleted"), false);
    });

    it("security-sensitive distinctions are closed vocabularies not optional booleans", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.stateDistinctions
          .authoritativeRequiresAuthorityAndHumanConfirmation,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.stateDistinctions
          .aiProposedRemainsNonAuthoritative,
        true,
      );
      assert.ok(
        Array.isArray(ExecutiveDecisionRegisterModel.stateDistinctions.authority),
      );
      assert.ok(
        Array.isArray(ExecutiveDecisionRegisterModel.stateDistinctions.origin),
      );
    });
  });

  describe("Authority and confirmation", () => {
    it("authoritative decision requires authority_ref and human confirmation", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionRecord.requiresAuthorityRef,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionRecord.requiresHumanConfirmation,
        true,
      );
      assert.ok(fieldNames("DecisionRecord").includes("authority_ref"));
      assert.ok(fieldNames("DecisionRecord").includes("confirmation_ref"));
      assert.ok(
        contractFields("DecisionRegisterModelAuthority").includes("authority_ref"),
      );
      assert.ok(
        contractFields("DecisionRegisterModelConfirmation").includes(
          "human_confirmer",
        ),
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation
          .confirmedRequiresHumanAndAuthority,
        true,
      );
    });

    it("proposal remains non-authoritative and AI proposal remains AiProposed", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionProposal.requiresAuthorityRef,
        false,
      );
      assert.ok(fieldNames("DecisionProposal").includes("authority_state"));
      assert.ok(fieldNames("DecisionProposal").includes("origin_state"));
      assert.ok(
        fieldNames("DecisionProposal").includes(
          "requires_separate_human_confirmation",
        ),
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.stateDistinctions
          .aiProposedRemainsNonAuthoritative,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation.proposedIsNonAuthoritative,
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterOriginState("AiProposed"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterAuthorityState("NonAuthoritative"),
        true,
      );
    });

    it("identity, role, attendance, silence, and AI cannot satisfy authority or confirmation", () => {
      const authority = contractFields("DecisionRegisterModelAuthority");
      const confirmation = contractFields("DecisionRegisterModelConfirmation");
      assert.ok(authority.includes("identity_not_authority"));
      assert.ok(authority.includes("role_not_authority"));
      assert.ok(confirmation.includes("ai_cannot_confirm"));
      assert.ok(confirmation.includes("identity_alone_insufficient"));
      assert.ok(confirmation.includes("title_insufficient"));
      assert.ok(confirmation.includes("role_alone_insufficient"));
      assert.ok(confirmation.includes("attendance_insufficient"));
      assert.ok(confirmation.includes("silence_insufficient"));
      assert.ok(fieldNames("DecisionConfirmation").includes("ai_cannot_satisfy"));
    });

    it("delegation requires all mandatory fields and no live authority registry", () => {
      const authority = contractFields("DecisionRegisterModelAuthority");
      for (const required of [
        "delegator",
        "delegate",
        "scope",
        "effective_point",
        "expiry",
        "revocation_state",
        "evidence_reference",
        "no_live_authority_registry",
      ]) {
        assert.ok(authority.includes(required), `missing ${required}`);
      }
      assert.ok(fieldNames("DecisionAuthority").includes("delegator"));
      assert.ok(fieldNames("DecisionAuthority").includes("delegate"));
      assert.ok(
        fieldNames("DecisionAuthority").includes("selects_live_authority_registry"),
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.selectsLiveAuthorityRegistry,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.ownership.selectsLiveAuthorityRegistry,
        false,
      );
    });
  });

  describe("Append-only lineage", () => {
    it("relationship kinds are closed and exact", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.relationshipKinds],
        [...EXPECTED_RELATIONSHIPS],
      );
      for (const kind of EXPECTED_RELATIONSHIPS) {
        assert.equal(isCanonicalDecisionRegisterRelationshipKind(kind), true);
      }
      assert.equal(
        isCanonicalDecisionRegisterRelationshipKind("MutatesInPlace"),
        false,
      );
    });

    it("correction, dispute, supersession, outcome, and disposition preserve lineage", () => {
      assert.ok(
        fieldNames("DecisionCorrection").includes("corrected_decision_ref"),
      );
      assert.ok(
        fieldNames("DecisionCorrection").includes("affected_event_ref"),
      );
      assert.ok(
        fieldNames("DecisionCorrection").includes("original_history_retained"),
      );
      assert.ok(
        fieldNames("DecisionDispute").includes("challenged_decision_ref"),
      );
      assert.ok(
        fieldNames("DecisionDispute").includes("dispute_retained_on_resolution"),
      );
      assert.ok(
        fieldNames("DecisionSupersession").includes("predecessor_decision"),
      );
      assert.ok(
        fieldNames("DecisionSupersession").includes("no_silent_replacement"),
      );
      assert.ok(
        fieldNames("DecisionOutcomeReference").includes("decision_identity"),
      );
      assert.ok(
        fieldNames("DecisionDisposition").includes("governance_evidence_refs"),
      );
      assert.ok(fieldNames("DecisionDisposition").includes("history_retained"));
      const lineage = contractFields("DecisionRegisterModelLineage");
      assert.ok(lineage.includes("correction_preserves_original"));
      assert.ok(lineage.includes("dispute_preserves_challenged"));
      assert.ok(lineage.includes("resolution_preserves_dispute"));
      assert.ok(lineage.includes("supersession_preserves_predecessor"));
      assert.ok(lineage.includes("disposition_preserves_governance_evidence"));
      assert.ok(lineage.includes("reopen_requires_new_event_relationship"));
    });

    it("reopening requires a new event relationship and derived state preserves provenance", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.lifecycle.reopenRequiresNewEventRelationship,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.stateDistinctions
          .reopenRequiresNewEventRelationship,
        true,
      );
      const provenance = contractFields("DecisionRegisterModelProvenance");
      assert.ok(provenance.includes("producing_event_refs"));
      assert.ok(provenance.includes("derived_retains_producing_events"));
      assert.ok(provenance.includes("derivation_version"));
      assert.equal(
        ExecutiveDecisionRegisterModel.decisionProjection.mayBeDerived,
        true,
      );
      assert.ok(
        fieldNames("DecisionProjection").includes("producing_event_refs"),
      );
      assert.ok(
        fieldNames("DecisionProjection").includes("derivation_version"),
      );
    });
  });

  describe("Evidence, provenance, and projection", () => {
    it("evidence categories are closed and unavailable is distinguishable", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.evidence],
        [
          "Referenced",
          "VersionPinned",
          "ContentAddressed",
          "Unavailable",
          "Disputed",
        ],
      );
      assert.equal(
        isCanonicalDecisionRegisterEvidenceCategory("Unavailable"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterEvidenceCategory("Accepted"),
        false,
      );
      assert.ok(
        fieldNames("DecisionEvidence").includes("unavailable_not_silently_accepted"),
      );
      assert.ok(
        contractFields("DecisionRegisterModelEvidence").includes(
          "unavailable_not_silently_accepted",
        ),
      );
      const oi03 = ExecutiveDecisionRegisterModel.openIssues.find(
        (item) => item.issueId === "OI-03",
      );
      assert.ok(oi03);
      assert.equal(oi03.resolved, false);
    });

    it("projection requires source metadata and cannot create authority or hide disputes", () => {
      const projectionFields = fieldNames("DecisionProjection");
      for (const required of [
        "projection_identity",
        "projection_version",
        "source_register",
        "source_sequence_position_or_range",
        "producing_event_refs",
        "derivation_version",
        "provenance",
        "staleness_metadata",
        "authority_limitations",
        "cannot_create_authoritative_facts",
        "cannot_create_authority",
        "cannot_confirm_decisions",
        "cannot_hide_dispute_status",
        "cannot_erase_historical_lineage",
      ]) {
        assert.ok(projectionFields.includes(required), `missing ${required}`);
      }
      const projectionContract = contractFields(
        "DecisionRegisterModelProjection",
      );
      assert.ok(projectionContract.includes("cannot_create_authoritative_facts"));
      assert.ok(projectionContract.includes("cannot_hide_dispute_status"));
    });
  });

  describe("Privacy and AI", () => {
    it("privacy categories are closed and private reflection is outside the model", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.stateDistinctions.privacy],
        [
          "SharedExecutiveRecord",
          "RestrictedExecutiveRecord",
          "RegulatedOrPrivilegedRecord",
        ],
      );
      assert.equal(
        isCanonicalDecisionRegisterPrivacyCategory("SharedExecutiveRecord"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterPrivacyCategory("PrivateReflection"),
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.privateReflectionOutsideModel,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.stateDistinctions
          .privateReflectionOutsideModel,
        true,
      );
      for (const entity of ExecutiveDecisionRegisterModel.entities) {
        assert.equal(entity.allowsPrivateReflection, false);
      }
    });

    it("preserves every upstream AI prohibition by exact reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.aiMustNot,
        ExecutiveDecisionRegisterRegistry.aiMustNot,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.aiMustNot,
        ExecutiveDecisionRegisterModel.foundation.aiMustNot,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterModel.aiMustNot],
        [...EXPECTED_AI_MUST_NOT],
      );
      // Upstream maps create/broaden as one canonical control.
      assert.ok(
        ExecutiveDecisionRegisterModel.aiMustNot.includes(
          "Create or broaden authority",
        ),
      );
      assert.equal(ExecutiveDecisionRegisterModel.aiAuthorityBehavior, false);
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation.aiOutputNonAuthoritative,
        true,
      );
    });

    for (
      const prohibition of ExecutiveDecisionRegisterModel.foundation.aiMustNot
    ) {
      it(`AI MUST NOT: ${prohibition}`, () => {
        assert.ok(
          ExecutiveDecisionRegisterModel.aiMustNot.includes(prohibition),
        );
      });
    }
  });

  describe("Telemetry", () => {
    it("routine telemetry excludes claims, rationale, evidence, private, and decrypted content", () => {
      const telemetry = contractFields("DecisionRegisterModelTelemetry");
      for (const excluded of [
        "exclude_decision_claims",
        "exclude_rationale",
        "exclude_evidence_content",
        "exclude_private_privileged",
        "exclude_restricted_titles",
        "exclude_export_content",
        "exclude_decrypted_values",
      ]) {
        assert.ok(telemetry.includes(excluded), `missing ${excluded}`);
      }
      for (const allowed of [
        "allow_entity_kind",
        "allow_lifecycle_state",
        "allow_event_count",
        "allow_sequence_position",
        "allow_projection_version",
        "allow_result_codes",
        "allow_correlation_identity",
      ]) {
        assert.ok(telemetry.includes(allowed), `missing ${allowed}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterModel.foundation.telemetryForbidden,
        ExecutiveDecisionRegisterRegistry.foundation.telemetryForbidden,
      );
    });
  });

  describe("Decisions and open issues", () => {
    it("records D-13 through D-18 exactly once", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterModel.decisions.map((item) => item.decisionId),
        ["D-13", "D-14", "D-15", "D-16", "D-17", "D-18"],
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-13")
          ?.statement.includes("DecisionRegister"),
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-14")
          ?.statement.includes("authority"),
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-15")
          ?.statement.includes("append-only"),
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-16")
          ?.statement.includes("non-authoritative"),
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-17")
          ?.statement.includes("cannot create authority"),
      );
      assert.ok(
        ExecutiveDecisionRegisterModel.decisions
          .find((item) => item.decisionId === "D-18")
          ?.statement.includes("RTC-3:2"),
      );
    });

    it("preserves D-01 through D-12 unchanged by upstream reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterModel.upstreamFoundationDecisions,
        ExecutiveDecisionRegisterRegistry.upstreamDecisions,
      );
      assert.equal(
        ExecutiveDecisionRegisterModel.upstreamRegistryDecisions,
        ExecutiveDecisionRegisterRegistry.decisions,
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterModel.upstreamFoundationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterModel.upstreamRegistryDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-07", "D-08", "D-09", "D-10", "D-11", "D-12"],
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterModel.decisions),
        true,
      );
      assert.equal(
        Object.isFrozen(ExecutiveDecisionRegisterModel.upstreamFoundationDecisions),
        true,
      );
    });

    it("carries OI-01 through OI-06 unresolved with declared owners", () => {
      assert.equal(ExecutiveDecisionRegisterModel.openIssues.length, 6);
      for (const expected of EXPECTED_OPEN_ISSUES) {
        const found = ExecutiveDecisionRegisterModel.openIssues.find(
          (item) => item.issueId === expected.issueId,
        );
        assert.ok(found, `missing ${expected.issueId}`);
        assert.equal(found.accountableOwner, expected.accountableOwner);
        assert.equal(found.resolved, false);
        assert.equal(found.resolvedByModel, false);
      }
      assert.equal(ExecutiveDecisionRegisterModel.resolvesOpenIssues, false);
      assert.equal(Object.isFrozen(ExecutiveDecisionRegisterModel.openIssues), true);
    });
  });

  describe("Aggregate, summary, and dependency boundaries", () => {
    it("summary is deterministic and mutation-safe", () => {
      const first = getExecutiveDecisionRegisterModelSummary();
      const second = getExecutiveDecisionRegisterModelSummary();
      assert.deepEqual(first, second);
      assert.equal(Object.isFrozen(first), true);
      assert.equal(Object.isFrozen(ExecutiveDecisionRegisterModel), true);
      assert.equal(first.entityCount, 14);
      assert.equal(first.relationshipKindCount, 9);
      assert.equal(first.openIssueCount, 6);
      assert.equal(first.readiness, "ReadyForValidation");
      assert.equal(
        first.sourceRegistry,
        "RTC-3:2/ExecutiveDecisionRegisterRegistry",
      );
    });

    it("has no prohibited runtime imports", () => {
      assert.equal(ExecutiveDecisionRegisterModel.importsRtc2, false);
      assert.equal(ExecutiveDecisionRegisterModel.importsRtc1, false);
      assert.equal(ExecutiveDecisionRegisterModel.importsApp8, false);

      for (const file of sourceFiles()) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.doesNotMatch(
            source,
            pattern,
            `${file} must not match ${pattern}`,
          );
        }
        assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
        assert.doesNotMatch(source, /\b(setTimeout|setInterval)\b/);
        assert.doesNotMatch(source, /\bclass\b/);
        assert.doesNotMatch(source, /\basync\s+function\b/);
        assert.doesNotMatch(source, /decision-journal/);
        assert.doesNotMatch(source, /executiveJournalRuntime/);
        assert.doesNotMatch(
          source,
          /from ["'][^"']*PublicIndex[^"']*["']/,
        );
      }
    });
  });
});
