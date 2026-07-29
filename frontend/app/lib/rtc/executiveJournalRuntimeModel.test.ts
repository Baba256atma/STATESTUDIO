/**
 * RTC-2:3 — Executive Journal Runtime Model Tests.
 *
 * Deterministic coverage for the immutable Executive Journal Runtime Model.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveJournalRuntimeRegistry } from "./executiveJournalRuntimeRegistry.ts";
import * as ModelModule from "./executiveJournalRuntimeModel.ts";
import {
  ExecutiveJournalRuntimeModel,
  ExecutiveJournalRuntimeModelId,
  ExecutiveJournalRuntimeModelName,
  ExecutiveJournalRuntimeModelNamespace,
  ExecutiveJournalRuntimeModelReadiness,
  ExecutiveJournalRuntimeModelStatus,
  ExecutiveJournalRuntimeModelVersion,
  getExecutiveJournalRuntimeModelSummary,
} from "./executiveJournalRuntimeModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC23_FILES = Object.freeze([
  "executiveJournalRuntimeModel.ts",
  "executiveJournalRuntimeModelTypes.ts",
  "executiveJournalRuntimeModelIdentity.ts",
  "executiveJournalRuntimeModelLifecycle.ts",
  "executiveJournalRuntimeModelContracts.ts",
  "executiveJournalRuntimeModelEntities.ts",
  "executiveJournalRuntimeModelMetadata.ts",
  "executiveJournalRuntimeModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveJournalRuntimeModelId",
  "ExecutiveJournalRuntimeModelVersion",
  "ExecutiveJournalRuntimeModelName",
  "ExecutiveJournalRuntimeModelNamespace",
  "ExecutiveJournalRuntimeModelStatus",
  "ExecutiveJournalRuntimeModelReadiness",
  "ExecutiveJournalRuntimeModel",
  "getExecutiveJournalRuntimeModelSummary",
  "getExecutiveJournalRuntimeModel",
  "ExecutiveJournalRuntimeModelIdentity",
  "ExecutiveJournalRuntimeModelNextPhase",
] as const);

const EXPECTED_ENTITY_NAMES = Object.freeze([
  "Journal",
  "Intent",
  "Decision",
  "Commitment",
  "Risk",
  "Exception",
  "Outcome",
  "EvidenceReference",
  "AuthorityReference",
  "Correction",
  "Dispute",
  "Projection",
  "DisclosureRecord",
  "DispositionRecord",
] as const);

const EXPECTED_OPEN_ISSUES = Object.freeze([
  Object.freeze({ issueId: "OI-01", accountableOwner: "Records / legal" }),
  Object.freeze({ issueId: "OI-02", accountableOwner: "Privacy + legal" }),
  Object.freeze({ issueId: "OI-03", accountableOwner: "Executive governance" }),
  Object.freeze({ issueId: "OI-04", accountableOwner: "Privacy + security" }),
  Object.freeze({ issueId: "OI-05", accountableOwner: "Journal steward" }),
  Object.freeze({ issueId: "OI-06", accountableOwner: "Policy authority" }),
]);

const EXPECTED_AI_MUST_NOT = Object.freeze([
  "confirm decisions",
  "create authority",
  "close commitments",
  "disclose restricted material",
  "alter retention state",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-2:3 Executive Journal Runtime Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(RTC23_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC23_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const artifacts = present.filter((name) => RTC23_FILES.includes(name));
    assert.equal(artifacts.length, 8);
    assert.ok(
      !RTC23_FILES.some((name) =>
        /Validation|Manifest|Platform|Certification|Freeze/i.test(name)
      ),
      "Model artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in ModelModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Model identity and ReadyForValidation readiness", () => {
    assert.equal(
      ExecutiveJournalRuntimeModelId,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(ExecutiveJournalRuntimeModelVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeModelName,
      "Executive Journal Runtime Model",
    );
    assert.equal(
      ExecutiveJournalRuntimeModelNamespace,
      "nexora.rtc.executive.journal.model",
    );
    assert.equal(ExecutiveJournalRuntimeModelStatus, "Model");
    assert.equal(
      ExecutiveJournalRuntimeModelReadiness,
      "ReadyForValidation",
    );

    const model = ExecutiveJournalRuntimeModel;
    assert.equal(model.identity.phaseId, "RTC-2:3");
    assert.equal(model.identity.status, "Model");
    assert.equal(model.identity.readiness, "ReadyForValidation");
    assert.equal(
      model.identity.sourceRegistry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(model.status, "Model");
    assert.equal(model.readiness, "ReadyForValidation");
    assert.equal(
      model.nextPhase,
      "RTC-2:4 — Executive Journal Runtime Validation",
    );
  });

  it("consumes RTC-2:2 registry and resolves RTC-2:1 foundation through it", () => {
    const model = ExecutiveJournalRuntimeModel;
    assert.equal(model.registry, ExecutiveJournalRuntimeRegistry);
    assert.equal(model.importsFoundationDirectly, false);
    assert.equal(model.resolvesFoundationViaRegistry, true);
    assert.equal(
      model.foundationEntry,
      ExecutiveJournalRuntimeRegistry.canonicalEntry,
    );
    assert.equal(
      model.foundation,
      ExecutiveJournalRuntimeRegistry.foundation,
    );
    assert.equal(
      model.foundation,
      model.foundationEntry.foundation,
    );
    assert.equal(model.foundation.readiness, "ReadyForRegistry");
    assert.equal(model.foundation.appendOnly, true);
    assert.equal(model.foundation.correctionsDoNotErase, true);

    const sources = RTC23_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(
        source,
        /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
        `${file} must not import foundation directly`,
      );
    }
  });

  it("defines fourteen canonical entities with Journal as root", () => {
    const model = ExecutiveJournalRuntimeModel;
    assert.equal(model.entities.length, 14);
    assert.deepEqual([...model.entityNames], [...EXPECTED_ENTITY_NAMES]);
    assert.equal(model.root.entityName, "Journal");
    assert.equal(model.root.root, true);
    assert.equal(model.root.entityId, "RTC-2:3/Entity/Journal");
    assert.equal(model.root.allowsPrivateReflection, true);
    assert.ok(model.root.fields.some((item) => item.fieldName === "record_visibility"));
    assert.ok(
      model.root.fields.some((item) => item.fieldName === "authority_ref"),
    );
    assertUnique(
      model.entities.map((item) => item.entityId),
      "entity IDs",
    );
    assert.ok(model.entities.every((item) => item.executable === false));
    assert.ok(model.entities.every((item) => item.storesRuntimeValues === false));
  });

  it("distinguishes closed state vocabularies without optional security booleans", () => {
    const distinctions = ExecutiveJournalRuntimeModel.stateDistinctions;
    assert.deepEqual([...distinctions.acceptance], ["Proposed", "Accepted"]);
    assert.deepEqual(
      [...distinctions.dispute],
      ["Undisputed", "Disputed", "Resolved"],
    );
    assert.deepEqual([...distinctions.currency], ["Current", "Superseded"]);
    assert.deepEqual([...distinctions.closure], ["Open", "Closed"]);
    assert.deepEqual([...distinctions.disposition], ["Active", "Disposed"]);
    assert.deepEqual(
      [...distinctions.authorityKind],
      ["Authoritative", "Derived"],
    );
    assert.deepEqual(
      [...distinctions.recordVisibility],
      ["SharedExecutiveRecord", "PrivateReflection"],
    );
    assert.deepEqual(
      [...distinctions.confirmationSource],
      ["HumanConfirmed", "AiProposed"],
    );

    assert.ok(
      modelHasField("Decision", "dispute_state"),
    );
    assert.ok(modelHasField("Projection", "authority_kind"));
    assert.ok(modelHasField("AuthorityReference", "delegator"));
    assert.ok(modelHasField("AuthorityReference", "delegate"));
    assert.ok(modelHasField("AuthorityReference", "scope"));
    assert.ok(modelHasField("AuthorityReference", "revocation_state"));
    assert.equal(
      ExecutiveJournalRuntimeModel.projection.mayBeDerived,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeModel.projection.requiresAuthorityRef,
      false,
    );
  });

  it("preserves append-only, provenance, authority, and AI controls", () => {
    const model = ExecutiveJournalRuntimeModel;
    assert.equal(model.lifecycle.appendOnlyAcceptedHistory, true);
    assert.equal(model.lifecycle.reopenCreatesNewTransition, true);
    assert.ok(
      model.invariants.includes("Accepted history is append-only"),
    );
    assert.ok(
      model.invariants.includes("Corrections do not erase or replace historical evidence"),
    );
    assert.ok(
      model.invariants.includes("Consequential state requires authority_ref"),
    );
    assert.ok(
      model.invariants.includes(
        "Derived projection state is not authoritative by display",
      ),
    );

    const provenance = model.contracts.find(
      (item) => item.contractName === "JournalModelProvenance",
    );
    assert.ok(provenance?.fields.includes("producing_event_refs"));
    assert.ok(provenance?.fields.includes("authority_ref"));
    assert.ok(provenance?.fields.includes("journal_sequence"));

    assert.deepEqual([...model.aiMustNot], [...EXPECTED_AI_MUST_NOT]);
    assert.equal(
      model.aiMustNot,
      ExecutiveJournalRuntimeRegistry.aiMustNot,
    );
    assert.equal(model.invokesAi, false);
    assert.equal(model.aiAuthorityBehavior, false);
  });

  it("carries OI-01 through OI-06 unresolved with required owners", () => {
    const issues = ExecutiveJournalRuntimeModel.openIssues;
    assert.equal(issues.length, 6);
    for (const expected of EXPECTED_OPEN_ISSUES) {
      const found = issues.find((item) => item.issueId === expected.issueId);
      assert.ok(found, `missing ${expected.issueId}`);
      assert.equal(found?.accountableOwner, expected.accountableOwner);
      assert.equal(found?.resolved, false);
      assert.equal(found?.resolvedByModel, false);
    }
    assert.equal(ExecutiveJournalRuntimeModel.resolvesOpenIssues, false);
    assert.equal(
      ExecutiveJournalRuntimeModel.boundaries.openIssuesUnresolved,
      true,
    );
  });

  it("is metadata-only with zero prohibited runtime behaviors and imports", () => {
    const model = ExecutiveJournalRuntimeModel;
    assert.equal(Object.isFrozen(model), true);
    assert.equal(Object.isFrozen(model.entities), true);
    assert.equal(Object.isFrozen(model.contracts), true);
    assert.equal(model.metadataOnly, true);
    assert.equal(model.storesRuntimeValues, false);
    assert.equal(model.executesTransitions, false);
    assert.equal(model.performsValidation, false);
    assert.equal(model.mutatesRuntimeState, false);
    assert.equal(model.reactBehavior, false);
    assert.equal(model.nextJsBehavior, false);
    assert.equal(model.accessesDatabases, false);
    assert.equal(model.managesPersistence, false);
    assert.equal(model.validationPhase, false);

    const sources = RTC23_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.doesNotMatch(source, /decision-journal/);
    }

    const modelSource = readFileSync(
      new URL("executiveJournalRuntimeModel.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      modelSource,
      /from ["']\.\/executiveJournalRuntimeRegistry\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const summaryA = getExecutiveJournalRuntimeModelSummary();
    const summaryB = getExecutiveJournalRuntimeModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, ExecutiveJournalRuntimeModelId);
    assert.equal(summaryA.rootEntity, "Journal");
    assert.equal(summaryA.entityCount, 14);
    assert.equal(summaryA.contractCount, 7);
    assert.equal(summaryA.invariantCount, 10);
    assert.equal(summaryA.openIssueCount, 6);
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(
      summaryA.sourceRegistry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeModel.statistics.entityCount,
      ExecutiveJournalRuntimeModel.entities.length,
    );
  });
});

function modelHasField(entityName: string, fieldName: string): boolean {
  const entity = ExecutiveJournalRuntimeModel.entities.find(
    (item) => item.entityName === entityName,
  );
  return entity?.fields.some((field) => field.fieldName === fieldName) === true;
}
