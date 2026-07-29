/**
 * RTC-3:1 — Executive Decision Register Foundation Tests.
 *
 * Explicit independent evidence for ReadyForRegistry foundation controls.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./executiveDecisionRegisterFoundation.ts";
import {
  ExecutiveDecisionRegisterApprovedIdentities,
  ExecutiveDecisionRegisterConsequentialStates,
  ExecutiveDecisionRegisterFoundation,
  ExecutiveDecisionRegisterFoundationAliases,
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationName,
  ExecutiveDecisionRegisterFoundationNamespace,
  ExecutiveDecisionRegisterFoundationReadiness,
  ExecutiveDecisionRegisterFoundationStatus,
  ExecutiveDecisionRegisterFoundationVersion,
  getExecutiveDecisionRegisterFoundationSummary,
  isApprovedDecisionRegisterIdentity,
  isCanonicalDecisionRegisterEventName,
  isCanonicalDecisionRegisterLifecycleState,
  isWellFormedDecisionRegisterIdentity,
} from "./executiveDecisionRegisterFoundation.ts";
import {
  ExecutiveDecisionRegisterIdentity,
  ExecutiveDecisionRegisterIdentityFormat,
} from "./executiveDecisionRegisterIdentity.ts";
import {
  EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
  ExecutiveDecisionRegisterLifecycle,
} from "./executiveDecisionRegisterLifecycle.ts";
import {
  ExecutiveDecisionRegisterEventNames,
  ExecutiveDecisionRegisterEvents,
} from "./executiveDecisionRegisterEvents.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC31_SOURCE_FILES = Object.freeze([
  "executiveDecisionRegisterFoundation.ts",
  "executiveDecisionRegisterTypes.ts",
  "executiveDecisionRegisterIdentity.ts",
  "executiveDecisionRegisterLifecycle.ts",
  "executiveDecisionRegisterContracts.ts",
  "executiveDecisionRegisterEvents.ts",
  "executiveDecisionRegisterMetadata.ts",
]);

const EXPECTED_STATES = Object.freeze([
  "Proposed",
  "Confirmed",
  "Effective",
  "Disputed",
  "Superseded",
  "Closed",
  "Disposed",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "DecisionProposed",
  "DecisionConfirmed",
  "DecisionBecameEffective",
  "DecisionCorrected",
  "DecisionDisputed",
  "DecisionDisputeResolved",
  "DecisionSuperseded",
  "DecisionClosed",
  "DecisionOutcomeReferenced",
  "DecisionDisposed",
] as const);

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
] as const);

const EXPECTED_OWNERS = Object.freeze([
  "Records / legal",
  "Executive governance",
  "Journal steward",
  "Privacy + legal",
  "Executive governance",
  "Architecture authority",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:crypto["']/,
  /from ["']fs["']/,
  /from ["']path["']/,
  /from ["']@?prisma/,
  /from ["'][^"']*vitest["']/,
]);

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-3:1 Executive Decision Register Foundation", () => {
  describe("Identity", () => {
    it("identity is exactly RTC-3:1/ExecutiveDecisionRegisterFoundation", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationId,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.identity.foundationId,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
    });

    it("namespace is exactly nexora.rtc.executive.decision.register.foundation", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationNamespace,
        "nexora.rtc.executive.decision.register.foundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.identity.foundationNamespace,
        "nexora.rtc.executive.decision.register.foundation",
      );
    });

    it("status is exactly Foundation", () => {
      assert.equal(ExecutiveDecisionRegisterFoundationStatus, "Foundation");
      assert.equal(ExecutiveDecisionRegisterFoundation.status, "Foundation");
    });

    it("readiness is exactly ReadyForRegistry", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundationReadiness,
        "ReadyForRegistry",
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.readiness,
        "ReadyForRegistry",
      );
    });

    it("aliases and guards accept only approved identities", () => {
      assert.deepEqual([...ExecutiveDecisionRegisterFoundationAliases], [
        "ExecutiveDecisionRegisterFoundation",
        "RTC-3:1",
      ]);
      assert.ok(
        isApprovedDecisionRegisterIdentity(
          "RTC-3:1/ExecutiveDecisionRegisterFoundation",
        ),
      );
      assert.ok(
        isApprovedDecisionRegisterIdentity(
          "nexora.rtc.executive.decision.register.foundation",
        ),
      );
      assert.ok(isApprovedDecisionRegisterIdentity("RTC-3:1"));
      assert.ok(
        isApprovedDecisionRegisterIdentity(
          "ExecutiveDecisionRegisterFoundation",
        ),
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.isApprovedIdentity,
        isApprovedDecisionRegisterIdentity,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.approvedIdentities],
        [...ExecutiveDecisionRegisterApprovedIdentities],
      );
    });

    it("unknown, malformed, case-changed, whitespace, and partial identities fail closed", () => {
      assert.equal(isApprovedDecisionRegisterIdentity(null), false);
      assert.equal(isApprovedDecisionRegisterIdentity(undefined), false);
      assert.equal(isApprovedDecisionRegisterIdentity(""), false);
      assert.equal(isApprovedDecisionRegisterIdentity("   "), false);
      assert.equal(
        isApprovedDecisionRegisterIdentity(
          " rtc-3:1/executivedecisionregisterfoundation ",
        ),
        false,
      );
      assert.equal(
        isApprovedDecisionRegisterIdentity(
          "RTC-3:1/ExecutiveDecisionRegisterFoundation ",
        ),
        false,
      );
      assert.equal(
        isApprovedDecisionRegisterIdentity(
          "rtc-3:1/ExecutiveDecisionRegisterFoundation",
        ),
        false,
      );
      assert.equal(
        isApprovedDecisionRegisterIdentity(
          "RTC-3:1/ExecutiveDecisionRegister",
        ),
        false,
      );
      assert.equal(isApprovedDecisionRegisterIdentity("RTC-3"), false);
      assert.equal(isApprovedDecisionRegisterIdentity("RTC-2:1"), false);
      assert.equal(
        isWellFormedDecisionRegisterIdentity(" padded "),
        false,
      );
      assert.equal(isWellFormedDecisionRegisterIdentity("ok"), true);
      assert.equal(isApprovedDecisionRegisterIdentity("ok"), false);
    });
  });

  describe("Lifecycle", () => {
    it("every canonical lifecycle state exists exactly once", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.lifecycleStates],
        [...EXPECTED_STATES],
      );
      assert.deepEqual(
        [...EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES],
        [...EXPECTED_STATES],
      );
      assertUnique(
        [...ExecutiveDecisionRegisterFoundation.lifecycleStates],
        "lifecycle states",
      );
      assert.equal(ExecutiveDecisionRegisterLifecycle.stateCount, 7);
    });

    it("lifecycle ordering is deterministic", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.lifecycle.states],
        [...EXPECTED_STATES],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.lifecycleStates],
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
    });

    it("unknown lifecycle states are rejected", () => {
      assert.equal(isCanonicalDecisionRegisterLifecycleState("Proposed"), true);
      assert.equal(isCanonicalDecisionRegisterLifecycleState("Accepted"), false);
      assert.equal(isCanonicalDecisionRegisterLifecycleState("proposed"), false);
      assert.equal(isCanonicalDecisionRegisterLifecycleState(""), false);
      assert.equal(isCanonicalDecisionRegisterLifecycleState(null), false);
      assert.equal(
        ExecutiveDecisionRegisterFoundation.isCanonicalLifecycleState(
          "Effective",
        ),
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.isCanonicalLifecycleState(
          "Unknown",
        ),
        false,
      );
    });

    it("Proposed remains non-authoritative", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.proposedIsNonAuthoritative,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.proposedIsNonAuthoritative,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterLifecycle.stateSemantics.Proposed
          .includes("Non-authoritative"),
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterConsequentialStates],
        [
          "Confirmed",
          "Effective",
          "Disputed",
          "Superseded",
          "Closed",
          "Disposed",
        ],
      );
    });

    it("Confirmed requires explicit human confirmation and authority", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.confirmedRequiresHumanAndAuthority,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.confirmedRequiresHumanAndAuthority,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterLifecycle.stateSemantics.Confirmed
          .includes("human confirmation and authority"),
      );
      assert.ok(
        ExecutiveDecisionRegisterConsequentialStates.includes("Confirmed"),
      );
    });

    it("Superseded requires a predecessor reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.supersessionRequiresPredecessorRef,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterLifecycle.stateSemantics.Superseded
          .includes("predecessor"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("predecessor_ref"),
      );
    });

    it("Disputed preserves the challenged-decision reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle
          .disputePreservesChallengedDecisionRef,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterLifecycle.stateSemantics.Disputed
          .includes("original decision"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("dispute_refs"),
      );
    });

    it("Disposed preserves governance-evidence requirements", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle
          .dispositionPreservesGovernanceEvidence,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterLifecycle.stateSemantics.Disposed
          .includes("Governance disposition evidence"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Disposition preserves governance evidence.",
        ),
      );
    });
  });

  describe("Events", () => {
    it("every canonical event exists exactly once", () => {
      assert.equal(ExecutiveDecisionRegisterEvents.length, 10);
      assert.deepEqual(
        [...ExecutiveDecisionRegisterEventNames],
        [...EXPECTED_EVENTS],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterEvents.map((item) => item.eventName),
        [...EXPECTED_EVENTS],
      );
      assertUnique(
        ExecutiveDecisionRegisterEvents.map((item) => item.eventId),
        "event IDs",
      );
      assertUnique(
        ExecutiveDecisionRegisterEvents.map((item) => item.eventName),
        "event names",
      );
    });

    it("event ordering is deterministic", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterEvents.map((item) => item.deterministicOrder),
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.eventNames],
        [...EXPECTED_EVENTS],
      );
    });

    it("unknown event types fail closed", () => {
      assert.equal(
        isCanonicalDecisionRegisterEventName("DecisionProposed"),
        true,
      );
      assert.equal(
        isCanonicalDecisionRegisterEventName("DecisionAccepted"),
        false,
      );
      assert.equal(
        isCanonicalDecisionRegisterEventName("decisionproposed"),
        false,
      );
      assert.equal(isCanonicalDecisionRegisterEventName(""), false);
      assert.equal(isCanonicalDecisionRegisterEventName(null), false);
      assert.equal(
        ExecutiveDecisionRegisterFoundation.isCanonicalEventName(
          "DecisionDisposed",
        ),
        true,
      );
    });

    it("event descriptors are immutable", () => {
      assert.equal(mutateFrozen(ExecutiveDecisionRegisterEvents), false);
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterEvents[0]!),
        false,
      );
      assert.ok(
        ExecutiveDecisionRegisterEvents.every(
          (item) => item.immutable === true && item.dispatches === false,
        ),
      );
    });
  });

  describe("Append-only controls", () => {
    it("corrections require the original decision/event reference", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Corrections require the original decision and event references.",
        ),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("original_decision_ref"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("correction_of_event_ref"),
      );
    });

    it("corrections do not erase the original record", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.correctionsDoNotErase,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Corrections do not erase original claims.",
        ),
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.historyRewriteBehavior,
        false,
      );
    });

    it("supersession preserves the predecessor relationship", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Supersession preserves predecessor relationships.",
        ),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("predecessor_ref"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("supersession_ref"),
      );
    });

    it("dispute resolution preserves the active dispute reference", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Resolution preserves the active dispute reference.",
        ),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("active_dispute_ref"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.eventNames.includes(
          "DecisionDisputeResolved",
        ),
      );
    });

    it("reopening is a new lifecycle event, not in-place mutation", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.reopeningRequiresNewLifecycleEvent,
        true,
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Reopening creates a new lifecycle event.",
        ),
      );
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.executesTransitions,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterLifecycle.runtimeStateMachine,
        false,
      );
    });

    it("disposition preserves append-only governance evidence", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Disposition preserves governance evidence.",
        ),
      );
      assert.equal(ExecutiveDecisionRegisterFoundation.appendOnly, true);
      assert.ok(
        ExecutiveDecisionRegisterFoundation.eventNames.includes(
          "DecisionDisposed",
        ),
      );
    });
  });

  describe("Authority and confirmation", () => {
    it("consequential decision states require authority_ref", () => {
      assert.equal(
        ExecutiveDecisionRegisterLifecycle
          .consequentialStatesRequireAuthorityRef,
        true,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterConsequentialStates],
        [
          "Confirmed",
          "Effective",
          "Disputed",
          "Superseded",
          "Closed",
          "Disposed",
        ],
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("authority_ref"),
      );
      const authority = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionAuthority",
      );
      assert.ok(authority?.fields.includes("authority_ref"));
    });

    it("confirmation requires a human actor", () => {
      const confirmation = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionConfirmation",
      );
      assert.ok(confirmation);
      assert.ok(confirmation.fields.includes("human_only"));
      assert.ok(confirmation.fields.includes("actor_kind"));
      assert.ok(
        confirmation.description.includes(
          "Only an authorized human may confirm",
        ),
      );
    });

    it("identity alone does not satisfy authority", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.authorityNonSubstitutes
          .includes("Identity"),
      );
    });

    it("job title or organizational role alone does not satisfy authority", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.authorityNonSubstitutes
          .includes("Job title"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.authorityNonSubstitutes
          .includes("Organizational role alone"),
      );
    });

    it("delegation requires full bounded authority fields", () => {
      const authority = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionAuthority",
      );
      assert.ok(authority);
      for (const field of [
        "delegator_ref",
        "delegate_ref",
        "scope",
        "effective_point",
        "expiry",
        "revocation_state",
        "evidence_ref",
      ]) {
        assert.ok(
          authority.fields.includes(field),
          `missing delegation field ${field}`,
        );
      }
    });

    it("RTC-3:1 does not select or import a live authority-registry implementation", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries
          .selectsLiveAuthorityRegistry,
        false,
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.ownership.doesNotOwn.includes(
          "Authority-registry implementation",
        ),
      );
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*authority.?registry/i.test(source),
          false,
          `${file} must not import an authority registry`,
        );
      }
    });
  });

  describe("AI boundary", () => {
    for (const prohibition of EXPECTED_AI_MUST_NOT) {
      it(`AI MUST NOT: ${prohibition}`, () => {
        assert.ok(
          ExecutiveDecisionRegisterFoundation.aiMustNot.includes(prohibition),
          `missing AI prohibition: ${prohibition}`,
        );
      });
    }

    it("AI proposals remain explicitly non-authoritative", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.aiOutputNonAuthoritative,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.aiAuthorityBehavior,
        false,
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.aiMay.includes(
          "Produce non-authoritative derived material",
        ),
      );
      const aiContract = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionAiBoundary",
      );
      assert.ok(aiContract?.fields.includes("ai_output_non_authoritative"));
    });
  });

  describe("Privacy", () => {
    it("shared, restricted, and regulated/privileged categories are closed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.boundaries.privacyCategories],
        [
          "SharedExecutiveRecord",
          "RestrictedExecutiveRecord",
          "RegulatedOrPrivilegedRecord",
        ],
      );
      assertUnique(
        [...ExecutiveDecisionRegisterFoundation.boundaries.privacyCategories],
        "privacy categories",
      );
    });

    it("private reflection is not silently treated as a Decision Register record", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries
          .privateReflectionSilentPromotionForbidden,
        true,
      );
      const privacy = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionPrivacy",
      );
      assert.ok(
        privacy?.fields.includes(
          "private_reflection_silent_promotion_forbidden",
        ),
      );
    });

    it("private-reflection promotion requires selection, human, authority, event, provenance", () => {
      assert.deepEqual(
        [
          ...ExecutiveDecisionRegisterFoundation
            .privateReflectionPromotionRequirements,
        ],
        [
          "Explicit selection",
          "Human confirmation",
          "Authority",
          "New shared event",
          "Preserved source provenance",
        ],
      );
    });

    it("RTC-3:1 does not import or access RTC-2 private-reflection data", () => {
      assert.equal(ExecutiveDecisionRegisterFoundation.importsRtc2, false);
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*executiveJournalRuntime/.test(source),
          false,
          `${file} must not import RTC-2`,
        );
        assert.equal(
          /PrivateReflection/.test(source)
            && /from ["'][^"']*executiveJournal/.test(source),
          false,
        );
      }
    });
  });

  describe("Evidence and provenance", () => {
    it("evidence categories distinguish referenced, pinned, content-addressed, unavailable, disputed", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.boundaries.evidenceKinds],
        [
          "EvidenceReference",
          "VersionPinnedEvidence",
          "ContentAddressedEvidence",
          "UnavailableEvidence",
          "DisputedEvidence",
        ],
      );
    });

    it("authoritative state requires producing-event provenance", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFieldNames
          .includes("producing_event_refs"),
      );
      const provenance = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionProvenance",
      );
      assert.ok(provenance?.fields.includes("producing_event_refs"));
    });

    it("derived state retains producing-event provenance", () => {
      const projection = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionProjection",
      );
      assert.ok(
        projection?.fields.includes("producing_event_provenance_required"),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.appendOnlyRules.includes(
          "Current-state projections remain derivable from event history.",
        ),
      );
    });

    it("projection declarations cannot create authoritative facts", () => {
      const projection = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionProjection",
      );
      assert.ok(projection?.fields.includes("cannot_create_authority"));
      assert.ok(projection?.fields.includes("derived_only"));
      assert.ok(
        projection?.fields.includes("not_implemented_in_foundation"),
      );
    });

    it("missing or unavailable evidence is not silently accepted", () => {
      const evidence = ExecutiveDecisionRegisterFoundation.contracts.find(
        (item) => item.contractName === "DecisionEvidence",
      );
      assert.ok(evidence?.fields.includes("unavailable"));
      assert.ok(evidence?.fields.includes("missing_visible"));
      assert.ok(evidence?.fields.includes("disputed"));
      assert.ok(
        evidence?.description.includes("Missing evidence remains visible"),
      );
    });
  });

  describe("Telemetry", () => {
    it("routine telemetry excludes decision claim payloads", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.telemetryForbidden.includes(
          "Decision claim payload",
        ),
      );
    });

    it("routine telemetry excludes rationale and evidence content", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.telemetryForbidden.includes(
          "Rationale payload",
        ),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.telemetryForbidden.includes(
          "Evidence content",
        ),
      );
    });

    it("routine telemetry excludes private or decrypted values", () => {
      assert.ok(
        ExecutiveDecisionRegisterFoundation.telemetryForbidden.includes(
          "Private content",
        ),
      );
      assert.ok(
        ExecutiveDecisionRegisterFoundation.telemetryForbidden.includes(
          "Decrypted values",
        ),
      );
    });

    it("allowed telemetry remains metadata-only", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterFoundation.telemetryAllowed],
        [
          "Event kind",
          "Decision state",
          "Entity count",
          "Sequence position",
          "Validation-result code",
          "Policy-result code",
          "Integrity-result code",
          "Correlation identity",
        ],
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.decisionDescriptorFields
          .containsDecisionPayload,
        false,
      );
    });
  });

  describe("Architecture decisions", () => {
    it("D-01 exists and declares append-only history", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-01");
      assert.ok(decision);
      assert.ok(decision.statement.includes("append-only"));
    });

    it("D-02 exists and requires human authority for confirmation", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-02");
      assert.ok(decision);
      assert.ok(decision.statement.includes("human authority"));
    });

    it("D-03 exists and preserves correction/supersession lineage", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-03");
      assert.ok(decision);
      assert.ok(decision.statement.includes("lineage"));
    });

    it("D-04 exists and keeps AI proposals non-authoritative", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-04");
      assert.ok(decision);
      assert.ok(decision.statement.includes("non-authoritative"));
    });

    it("D-05 exists and preserves projection provenance", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-05");
      assert.ok(decision);
      assert.ok(decision.statement.includes("provenance"));
    });

    it("D-06 exists and declares no RTC-2 runtime dependency", () => {
      const decision = ExecutiveDecisionRegisterFoundation.foundationDecisions
        .find((item) => item.decisionId === "D-06");
      assert.ok(decision);
      assert.ok(decision.statement.includes("no runtime dependency on RTC-2"));
    });

    it("decision IDs are unique, immutable, and deterministically ordered", () => {
      const ids = ExecutiveDecisionRegisterFoundation.foundationDecisions.map(
        (item) => item.decisionId,
      );
      assert.deepEqual(ids, ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"]);
      assertUnique(ids, "decision IDs");
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterFoundation.foundationDecisions),
        false,
      );
    });
  });

  describe("Open issues", () => {
    it("OI-01 through OI-06 all exist unresolved with declared owners", () => {
      const issues = ExecutiveDecisionRegisterFoundation.openIssues;
      assert.deepEqual(
        issues.map((item) => item.issueId),
        ["OI-01", "OI-02", "OI-03", "OI-04", "OI-05", "OI-06"],
      );
      assert.ok(issues.every((item) => item.resolved === false));
      assert.deepEqual(
        issues.map((item) => item.accountableOwner),
        [...EXPECTED_OWNERS],
      );
    });

    it("open-issue IDs are unique, immutable, and deterministically ordered", () => {
      const ids = ExecutiveDecisionRegisterFoundation.openIssues.map(
        (item) => item.issueId,
      );
      assertUnique(ids, "open-issue IDs");
      assert.deepEqual(ids, [
        "OI-01",
        "OI-02",
        "OI-03",
        "OI-04",
        "OI-05",
        "OI-06",
      ]);
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterFoundation.openIssues),
        false,
      );
    });
  });

  describe("Dependency boundaries", () => {
    it("has no RTC-2 module imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*executiveJournalRuntime/.test(source),
          false,
          `${file} imports RTC-2`,
        );
      }
      assert.equal(ExecutiveDecisionRegisterFoundation.importsRtc2, false);
    });

    it("has no RTC-1 module or Public Index imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*executiveContext/.test(source),
          false,
          `${file} imports RTC-1`,
        );
        assert.equal(
          /from ["'][^"']*PublicIndex/.test(source),
          false,
          `${file} imports Public Index`,
        );
      }
      assert.equal(ExecutiveDecisionRegisterFoundation.importsRtc1, false);
    });

    it("has no APP-8 decision-journal imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*decision-journal/.test(source),
          false,
          `${file} imports APP-8`,
        );
      }
      assert.equal(ExecutiveDecisionRegisterFoundation.importsApp8, false);
    });

    it("has no React or Next.js imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(/from ["']react["']/.test(source), false, file);
        assert.equal(/from ["']next["']/.test(source), false, file);
        assert.equal(/from ["']next\//.test(source), false, file);
      }
      assert.equal(ExecutiveDecisionRegisterFoundation.reactBehavior, false);
      assert.equal(ExecutiveDecisionRegisterFoundation.nextJsBehavior, false);
    });

    it("has no Executive UI, component, hook, or store imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        assert.equal(
          /from ["'][^"']*\/(ex|components|hooks|stores)\//.test(source),
          false,
          `${file} imports UI surfaces`,
        );
      }
      assert.equal(ExecutiveDecisionRegisterFoundation.uiBehavior, false);
    });

    it("has no network, persistence, telemetry SDK, clock, or randomness imports", () => {
      for (const file of RTC31_SOURCE_FILES) {
        const source = readFileSync(`${HERE}/${file}`, "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.equal(
            pattern.test(source),
            false,
            `${file} matches ${pattern}`,
          );
        }
      }
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries.usesNetwork,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries.usesPersistence,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries.usesSystemClock,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.boundaries.usesRandomness,
        false,
      );
    });
  });

  describe("Aggregate and summary", () => {
    it("aggregate preserves exact canonical object references", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.identity,
        ExecutiveDecisionRegisterIdentity,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.identityFormat,
        ExecutiveDecisionRegisterIdentityFormat,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.lifecycle,
        ExecutiveDecisionRegisterLifecycle,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.events,
        ExecutiveDecisionRegisterEvents,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.lifecycleStates,
        EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
      );
    });

    it("deterministic summary is stable across repeated access", () => {
      const first = getExecutiveDecisionRegisterFoundationSummary();
      const second = getExecutiveDecisionRegisterFoundationSummary();
      assert.deepEqual(first, second);
      assert.equal(first.version, ExecutiveDecisionRegisterFoundationVersion);
      assert.equal(
        first.name,
        ExecutiveDecisionRegisterFoundationName,
      );
    });

    it("summary collections are mutation-safe", () => {
      const summary = getExecutiveDecisionRegisterFoundationSummary();
      assert.equal(mutateFrozen(summary), false);
      assert.equal(mutateFrozen(ExecutiveDecisionRegisterFoundation), false);
    });

    it("aggregate exposes required contracts, decisions, issues, states, and events", () => {
      assert.equal(RTC31_SOURCE_FILES.length + 1, 8);
      const present = readdirSync(HERE);
      for (const file of [
        ...RTC31_SOURCE_FILES,
        "executiveDecisionRegisterFoundation.test.ts",
      ]) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterFoundation.contracts.length,
        9,
      );
      assert.equal(
        ExecutiveDecisionRegisterFoundation.foundationDecisions.length,
        6,
      );
      assert.equal(ExecutiveDecisionRegisterFoundation.openIssues.length, 6);
      assert.equal(
        ExecutiveDecisionRegisterFoundation.lifecycleStates.length,
        7,
      );
      assert.equal(ExecutiveDecisionRegisterFoundation.events.length, 10);
      assert.ok(
        "getExecutiveDecisionRegisterFoundationSummary" in FoundationModule,
      );
    });

    it("nextPhase points only to RTC-3:2 Decision Register Registry", () => {
      assert.equal(
        ExecutiveDecisionRegisterFoundation.nextPhase,
        "RTC-3:2 — Executive Decision Register Registry",
      );
      assert.equal(
        getExecutiveDecisionRegisterFoundationSummary().nextPhase,
        "RTC-3:2 — Executive Decision Register Registry",
      );
      assert.equal(ExecutiveDecisionRegisterFoundation.registryPhase, false);
    });
  });
});
