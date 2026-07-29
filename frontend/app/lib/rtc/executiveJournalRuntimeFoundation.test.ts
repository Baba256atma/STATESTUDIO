/**
 * RTC-2:1 — Executive Journal Runtime Foundation Tests.
 *
 * Deterministic coverage for the immutable Executive Journal Runtime Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./executiveJournalRuntimeFoundation.ts";
import {
  ExecutiveJournalRuntimeFoundation,
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationName,
  ExecutiveJournalRuntimeFoundationNamespace,
  ExecutiveJournalRuntimeFoundationReadiness,
  ExecutiveJournalRuntimeFoundationStatus,
  ExecutiveJournalRuntimeFoundationVersion,
  getExecutiveJournalRuntimeFoundationSummary,
} from "./executiveJournalRuntimeFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC21_FILES = Object.freeze([
  "executiveJournalRuntimeFoundation.ts",
  "executiveJournalRuntimeTypes.ts",
  "executiveJournalRuntimeIdentity.ts",
  "executiveJournalRuntimeLifecycle.ts",
  "executiveJournalRuntimeContracts.ts",
  "executiveJournalRuntimeEvents.ts",
  "executiveJournalRuntimeMetadata.ts",
  "executiveJournalRuntimeFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveJournalRuntimeFoundationId",
  "ExecutiveJournalRuntimeFoundationVersion",
  "ExecutiveJournalRuntimeFoundationName",
  "ExecutiveJournalRuntimeFoundationNamespace",
  "ExecutiveJournalRuntimeFoundationStatus",
  "ExecutiveJournalRuntimeFoundationReadiness",
  "ExecutiveJournalRuntimeFoundation",
  "getExecutiveJournalRuntimeFoundationSummary",
  "getExecutiveJournalRuntimeFoundation",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Proposed",
  "Accepted",
  "Disputed",
  "Superseded",
  "Closed",
  "Disposed",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "Propose",
  "Evaluate",
  "Confirm",
  "Commit",
  "Project",
  "Notify",
  "Review",
  "Dispose",
] as const);

const EXPECTED_SECTIONS = Object.freeze([
  "CaptureAdapters",
  "PolicyAuthorityGate",
  "EventWriter",
  "CanonicalEventStore",
  "ProjectionEngine",
  "QueryExportPlane",
  "OperationsPlane",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "JournalEventEnvelope",
  "JournalAuthority",
  "JournalInformationClass",
  "JournalProjection",
  "JournalDisclosure",
  "JournalCorrection",
  "JournalIntegrity",
  "JournalAiBoundary",
] as const);

const EXPECTED_CONSUMERS = Object.freeze([
  "DecisionRegister",
  "CommitmentLedger",
  "RiskExceptionRegister",
  "OutcomeTimeline",
  "ControlEvidence",
  "ExecutiveExperience",
  "IndependentAssurance",
] as const);

const EXPECTED_ENVELOPE_FIELDS = Object.freeze([
  "event_id",
  "journal_id",
  "sequence",
  "event_type",
  "version",
  "occurred_at",
  "recorded_at",
  "actor",
  "on_behalf_of",
  "authority_ref",
  "classification",
  "purpose",
  "payload",
  "evidence_refs",
  "causation",
  "correlation",
  "integrity",
  "idempotency_key",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-2:1 Executive Journal Runtime Foundation", () => {
  it("creates exactly eight Foundation files", () => {
    assert.equal(RTC21_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC21_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const foundationArtifacts = present.filter((name) =>
      RTC21_FILES.includes(name)
    );
    assert.equal(foundationArtifacts.length, 8);
    assert.ok(
      !RTC21_FILES.some((name) =>
        /Registry|Model|Validation|Manifest|Platform/i.test(name)
      ),
      "Foundation artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in FoundationModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("has canonical identity, namespace, version, Foundation status, and ReadyForRegistry", () => {
    assert.equal(
      ExecutiveJournalRuntimeFoundationId,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(ExecutiveJournalRuntimeFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeFoundationName,
      "Executive Journal Runtime Foundation",
    );
    assert.equal(
      ExecutiveJournalRuntimeFoundationNamespace,
      "nexora.rtc.executive.journal.foundation",
    );
    assert.equal(ExecutiveJournalRuntimeFoundationStatus, "Foundation");
    assert.equal(
      ExecutiveJournalRuntimeFoundationReadiness,
      "ReadyForRegistry",
    );

    const foundation = ExecutiveJournalRuntimeFoundation;
    assert.equal(foundation.identity.sourcePhase, "RTC-2:1");
    assert.equal(foundation.identity.layer, "Runtime Layer");
    assert.equal(foundation.identity.architecture, "NPA-T vNext");
    assert.equal(foundation.identity.status, "Foundation");
    assert.equal(foundation.identity.readiness, "ReadyForRegistry");
    assert.equal(foundation.status, "Foundation");
    assert.equal(foundation.readiness, "ReadyForRegistry");
    assert.equal(
      foundation.nextPhase,
      "RTC-2:2 — Executive Journal Runtime Registry",
    );
  });

  it("declares append-only journal identity format", () => {
    const format = ExecutiveJournalRuntimeFoundation.journalIdentityFormat;
    assert.equal(format.journalPrefix, "RTC-JRN");
    assert.equal(format.eventPrefix, "RTC-JEVT");
    assert.equal(format.journalExample, "RTC-JRN-00000001");
    assert.equal(format.eventIdNeverReused, true);
    assert.equal(format.sequenceAssignedByWriterOnly, true);
    assert.equal(format.appendOnly, true);
    assert.equal(Object.isFrozen(format), true);
    assert.equal(ExecutiveJournalRuntimeFoundation.appendOnly, true);
  });

  it("publishes journal lifecycle with append-only and non-erase guarantees", () => {
    const { lifecycle, lifecycleStates } = ExecutiveJournalRuntimeFoundation;
    assert.deepEqual([...lifecycleStates], [...EXPECTED_LIFECYCLE]);
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.appendOnly, true);
    assert.equal(lifecycle.correctionsDoNotErase, true);
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.deepEqual([...lifecycle.transitions.Proposed], [
      "Accepted",
      "Disposed",
    ]);
    assert.ok(lifecycle.transitions.Accepted.includes("Disputed"));
    assert.ok(lifecycle.transitions.Accepted.includes("Superseded"));
    assert.ok(lifecycle.transitions.Accepted.includes("Closed"));
    assert.deepEqual([...lifecycle.transitions.Closed], []);
    assert.deepEqual([...lifecycle.transitions.Disposed], []);
    assertUnique([...lifecycle.states], "lifecycle states");
  });

  it("publishes complete contracts, sections, and events in deterministic order", () => {
    const foundation = ExecutiveJournalRuntimeFoundation;

    assert.equal(foundation.contracts.length, 8);
    assert.deepEqual([...foundation.contractNames], [...EXPECTED_CONTRACTS]);
    assert.deepEqual(
      foundation.contracts.map((item) => item.contractName),
      [...EXPECTED_CONTRACTS],
    );
    assert.ok(foundation.contracts.every((item) => item.executable === false));
    assert.ok(
      foundation.contracts.every((item) => item.runtimeBehavior === "None"),
    );
    assertUnique(
      foundation.contracts.map((item) => item.contractId),
      "contract IDs",
    );

    const envelope = foundation.contracts.find(
      (item) => item.contractName === "JournalEventEnvelope",
    );
    assert.ok(envelope);
    for (const field of EXPECTED_ENVELOPE_FIELDS) {
      assert.ok(
        envelope.fields.includes(field),
        `envelope missing required field ${field}`,
      );
    }
    assert.ok(envelope.fields.includes("authority_ref"));

    assert.equal(foundation.sections.length, 7);
    assert.deepEqual([...foundation.sectionNames], [...EXPECTED_SECTIONS]);
    assert.ok(foundation.sections.every((item) => item.required === true));

    assert.equal(foundation.events.length, 8);
    assert.deepEqual([...foundation.eventNames], [...EXPECTED_EVENTS]);
    assert.ok(foundation.events.every((item) => item.dispatches === false));
    assert.ok(foundation.events.every((item) => item.businessEvent === false));
    assertUnique(
      foundation.events.map((item) => item.eventId),
      "event IDs",
    );
  });

  it("documents principles, guarantees, families, classes, decisions, and open issues", () => {
    const foundation = ExecutiveJournalRuntimeFoundation;

    assert.equal(foundation.responsibilities.length, 6);
    assert.ok(foundation.responsibilities.includes("Capture"));
    assert.ok(foundation.responsibilities.includes("Validate"));
    assert.ok(foundation.responsibilities.includes("Persist"));
    assert.ok(foundation.responsibilities.includes("Project"));
    assert.ok(foundation.responsibilities.includes("Disclose"));
    assert.ok(foundation.responsibilities.includes("Recover"));

    assert.equal(foundation.guarantees.length, 7);
    assert.ok(foundation.guarantees.includes("Durability"));
    assert.ok(foundation.guarantees.includes("Integrity"));
    assert.ok(foundation.guarantees.includes("Determinism"));
    assert.ok(foundation.guarantees.includes("Traceability"));
    assert.ok(foundation.guarantees.includes("Recoverability"));

    assert.equal(foundation.principles.length, 6);
    assert.ok(
      foundation.principles.some((item) =>
        item.name === "Authority before automation"
      ),
    );
    assert.ok(
      foundation.principles.some((item) =>
        item.name === "Private by construction"
      ),
    );

    assert.equal(foundation.eventFamilies.length, 6);
    assert.deepEqual(
      foundation.eventFamilies.map((item) => item.familyName),
      [
        "Intent",
        "Decision",
        "Commitment",
        "RiskException",
        "Outcome",
        "Governance",
      ],
    );

    assert.equal(foundation.informationClasses.length, 4);
    assert.ok(
      foundation.informationClasses.some((item) =>
        item.className === "PrivateReflection"
      ),
    );

    assert.equal(foundation.foundationDecisions.length, 6);
    assert.ok(
      foundation.foundationDecisions.some((item) => item.decisionId === "D-01"),
    );
    assert.ok(
      foundation.foundationDecisions.some((item) => item.decisionId === "D-04"),
    );

    assert.equal(foundation.openIssues.length, 6);
    assert.ok(
      foundation.openIssues.every((item) => item.accountableOwner.length > 0),
    );

    assert.deepEqual(
      foundation.consumers.map((item) => item.consumerName),
      [...EXPECTED_CONSUMERS],
    );
    assert.ok(
      foundation.consumers.every((item) => item.accessMode === "ReadOnly"),
    );
    assert.ok(
      foundation.consumers.every((item) => item.mayMutateJournal === false),
    );

    assert.equal(foundation.captureSources.length, 6);
    assert.ok(
      foundation.captureSources.every((item) =>
        item.mayAcceptAsDecision === false
      ),
    );
    assert.equal(
      foundation.evidencePhilosophy.currentStateRebuildableFromAcceptedEvents,
      true,
    );
  });

  it("is metadata-only with zero prohibited runtime and UI behaviors", () => {
    const foundation = ExecutiveJournalRuntimeFoundation;
    assert.equal(Object.isFrozen(foundation), true);
    assert.equal(Object.isFrozen(foundation.identity), true);
    assert.equal(Object.isFrozen(foundation.lifecycle), true);
    assert.equal(Object.isFrozen(foundation.contracts), true);
    assert.equal(Object.isFrozen(foundation.events), true);
    assert.equal(Object.isFrozen(foundation.metadata), true);

    assert.equal(foundation.metadataOnly, true);
    assert.equal(foundation.rootRuntimePackage, true);
    assert.equal(foundation.appendOnly, true);
    assert.equal(foundation.correctionsDoNotErase, true);
    assert.equal(foundation.privateReflectionSeparateClass, true);
    assert.equal(foundation.executesTransitions, false);
    assert.equal(foundation.runtimeStateMachine, false);
    assert.equal(foundation.dispatchesEvents, false);
    assert.equal(foundation.uiBehavior, false);
    assert.equal(foundation.renderingBehavior, false);
    assert.equal(foundation.animationBehavior, false);
    assert.equal(foundation.reactBehavior, false);
    assert.equal(foundation.nextJsBehavior, false);
    assert.equal(foundation.businessLogicBehavior, false);
    assert.equal(foundation.aiAuthorityBehavior, false);
    assert.equal(foundation.autonomousCommitmentBehavior, false);
    assert.equal(foundation.historyRewriteBehavior, false);
    assert.equal(foundation.covertCaptureBehavior, false);
    assert.equal(foundation.registryPhase, false);
    assert.equal(foundation.modelPhase, false);
    assert.equal(foundation.validationPhase, false);
    assert.equal(foundation.manifestPhase, false);
    assert.equal(foundation.platformPhase, false);

    assert.equal(foundation.ownership.rootRuntimePackage, true);
    assert.equal(foundation.ownership.downstreamRuntimeDependency, false);
    assert.equal(foundation.ownership.ownsUi, false);
    assert.equal(foundation.ownership.ownsAiAuthority, false);
    assert.equal(
      foundation.ownership.declaredUpstream,
      "RTC-1 Executive Context Runtime Public Index",
    );
    assert.equal(foundation.boundaries.failClosedOnPolicyUnavailable, true);
    assert.ok(
      foundation.boundaries.dependencyRules.includes(
        "NoDecisionJournalApp8Imports",
      ),
    );
    assert.ok(
      foundation.boundaries.aiMustNot.includes("confirm decisions"),
    );
    assert.ok(
      foundation.boundaries.prohibitedSurfaces.includes(
        "edit history in place",
      ),
    );
    assert.ok(foundation.boundaries.prohibitedSurfaces.includes("React"));
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = RTC21_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
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
      assert.doesNotMatch(source, /\bfrom ["']react/);
      assert.doesNotMatch(source, /\bfrom ["']next/);
      assert.doesNotMatch(source, /decision-journal/);
    }
  });

  it("preserves deterministic summary and dynamic inventory counts", () => {
    const foundation = ExecutiveJournalRuntimeFoundation;
    const summaryA = getExecutiveJournalRuntimeFoundationSummary();
    const summaryB = getExecutiveJournalRuntimeFoundationSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ExecutiveJournalRuntimeFoundationId);
    assert.equal(
      summaryA.namespace,
      "nexora.rtc.executive.journal.foundation",
    );
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.sectionCount, 7);
    assert.equal(summaryA.contractCount, 8);
    assert.equal(summaryA.eventCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.consumerCount, 7);
    assert.equal(summaryA.responsibilityCount, 6);
    assert.equal(summaryA.guaranteeCount, 7);
    assert.equal(
      summaryA.nextPhase,
      "RTC-2:2 — Executive Journal Runtime Registry",
    );

    assert.equal(
      foundation.inventory.contractCount,
      foundation.contracts.length,
    );
    assert.equal(foundation.inventory.eventCount, foundation.events.length);
    assert.equal(
      foundation.constants.contractCount,
      foundation.contracts.length,
    );
    assert.equal(foundation.constants.eventCount, foundation.events.length);
    assert.equal(foundation.inventory.openIssueCount, 6);
    assert.equal(foundation.inventory.decisionCount, 6);
  });
});
