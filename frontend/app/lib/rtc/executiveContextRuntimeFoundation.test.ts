/**
 * RTC-1:1 — Executive Context Runtime Foundation Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./executiveContextRuntimeFoundation.ts";
import {
  ExecutiveContextRuntimeFoundation,
  ExecutiveContextRuntimeFoundationId,
  ExecutiveContextRuntimeFoundationName,
  ExecutiveContextRuntimeFoundationNamespace,
  ExecutiveContextRuntimeFoundationReadiness,
  ExecutiveContextRuntimeFoundationStatus,
  ExecutiveContextRuntimeFoundationVersion,
  getExecutiveContextRuntimeFoundationSummary,
} from "./executiveContextRuntimeFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC11_FILES = Object.freeze([
  "executiveContextRuntimeFoundation.ts",
  "executiveContextRuntimeTypes.ts",
  "executiveContextRuntimeIdentity.ts",
  "executiveContextRuntimeLifecycle.ts",
  "executiveContextRuntimeContracts.ts",
  "executiveContextRuntimeEvents.ts",
  "executiveContextRuntimeMetadata.ts",
  "executiveContextRuntimeFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeFoundationId",
  "ExecutiveContextRuntimeFoundationVersion",
  "ExecutiveContextRuntimeFoundationName",
  "ExecutiveContextRuntimeFoundationNamespace",
  "ExecutiveContextRuntimeFoundationStatus",
  "ExecutiveContextRuntimeFoundationReadiness",
  "ExecutiveContextRuntimeFoundation",
  "getExecutiveContextRuntimeFoundationSummary",
  "getExecutiveContextRuntimeFoundation",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Created",
  "Initialized",
  "Active",
  "Updated",
  "Snapshot",
  "Archived",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "ContextCreated",
  "ContextActivated",
  "ContextUpdated",
  "ContextSnapshotCreated",
  "ContextArchived",
  "ContextRestored",
] as const);

const EXPECTED_SECTIONS = Object.freeze([
  "Identity",
  "Lifecycle",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "FocusedObject",
  "Timeline",
  "Journal",
  "Stage",
  "Advisor",
  "Director",
  "Metadata",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ExecutiveContext",
  "ExecutiveContextIdentity",
  "ExecutiveContextLifecycle",
  "ExecutiveContextSnapshot",
  "ExecutiveContextActivation",
  "ExecutiveContextConsumer",
  "ExecutiveContextEvent",
  "ExecutiveContextIntegrity",
] as const);

const EXPECTED_CONSUMERS = Object.freeze([
  "DirectorRuntime",
  "ExecutiveJournalRuntime",
  "TimelineRuntime",
  "StageRuntime",
  "WorkspaceRuntime",
  "AssistantRuntime",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:1 Executive Context Runtime Foundation", () => {
  it("creates exactly eight Foundation files", () => {
    assert.equal(RTC11_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC11_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const foundationArtifacts = present.filter((name) =>
      RTC11_FILES.includes(name)
    );
    assert.equal(foundationArtifacts.length, 8);
    assert.ok(
      !RTC11_FILES.some((name) =>
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
      ExecutiveContextRuntimeFoundationId,
      "RTC-1:1/ExecutiveContextRuntimeFoundation",
    );
    assert.equal(ExecutiveContextRuntimeFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeFoundationName,
      "Executive Context Runtime Foundation",
    );
    assert.equal(
      ExecutiveContextRuntimeFoundationNamespace,
      "nexora.rtc.executive.context.foundation",
    );
    assert.equal(ExecutiveContextRuntimeFoundationStatus, "Foundation");
    assert.equal(
      ExecutiveContextRuntimeFoundationReadiness,
      "ReadyForRegistry",
    );

    const foundation = ExecutiveContextRuntimeFoundation;
    assert.equal(foundation.identity.sourcePhase, "RTC-1:1");
    assert.equal(foundation.identity.layer, "Runtime Layer");
    assert.equal(foundation.identity.architecture, "NPA-T vNext");
    assert.equal(foundation.identity.status, "Foundation");
    assert.equal(foundation.identity.readiness, "ReadyForRegistry");
    assert.equal(foundation.status, "Foundation");
    assert.equal(foundation.readiness, "ReadyForRegistry");
    assert.equal(
      foundation.nextPhase,
      "RTC-1:2 — Executive Context Runtime Registry",
    );
  });

  it("declares immutable Executive Context identity format", () => {
    const format = ExecutiveContextRuntimeFoundation.contextIdentityFormat;
    assert.equal(format.prefix, "RTC-CTX");
    assert.equal(format.example, "RTC-CTX-00000001");
    assert.equal(format.identityImmutable, true);
    assert.equal(format.stateEvolvesViaSnapshot, true);
    assert.equal(Object.isFrozen(format), true);
    assert.equal(
      ExecutiveContextRuntimeFoundation.contextIdentityImmutable,
      true,
    );
  });

  it("publishes formal lifecycle with single-active guarantee", () => {
    const { lifecycle, lifecycleStates } = ExecutiveContextRuntimeFoundation;
    assert.deepEqual([...lifecycleStates], [...EXPECTED_LIFECYCLE]);
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.singleActiveContext, true);
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.deepEqual([...lifecycle.transitions.Created], ["Initialized"]);
    assert.deepEqual([...lifecycle.transitions.Initialized], ["Active"]);
    assert.ok(lifecycle.transitions.Active.includes("Updated"));
    assert.ok(lifecycle.transitions.Active.includes("Snapshot"));
    assert.ok(lifecycle.transitions.Active.includes("Archived"));
    assert.deepEqual([...lifecycle.transitions.Archived], []);
    assertUnique([...lifecycle.states], "lifecycle states");
  });

  it("publishes complete contracts, sections, and events in deterministic order", () => {
    const foundation = ExecutiveContextRuntimeFoundation;

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

    assert.equal(foundation.sections.length, 13);
    assert.deepEqual([...foundation.sectionNames], [...EXPECTED_SECTIONS]);
    assert.ok(foundation.sections.every((item) => item.required === true));

    assert.equal(foundation.events.length, 6);
    assert.deepEqual([...foundation.eventNames], [...EXPECTED_EVENTS]);
    assert.ok(foundation.events.every((item) => item.dispatches === false));
    assert.ok(foundation.events.every((item) => item.businessEvent === false));
    assertUnique(
      foundation.events.map((item) => item.eventId),
      "event IDs",
    );
  });

  it("documents responsibilities, guarantees, consumers, and activation sources", () => {
    const foundation = ExecutiveContextRuntimeFoundation;

    assert.ok(foundation.responsibilities.includes("Context creation"));
    assert.ok(foundation.responsibilities.includes("Context activation"));
    assert.ok(foundation.responsibilities.includes("Snapshot generation"));
    assert.ok(foundation.responsibilities.includes("Context integrity"));
    assert.equal(foundation.responsibilities.length, 7);

    assert.ok(foundation.guarantees.includes("deterministic state"));
    assert.ok(foundation.guarantees.includes("immutable snapshots"));
    assert.ok(foundation.guarantees.includes("single active context"));
    assert.equal(foundation.guarantees.length, 6);

    assert.deepEqual(
      foundation.consumers.map((item) => item.consumerName),
      [...EXPECTED_CONSUMERS],
    );
    assert.ok(
      foundation.consumers.every((item) => item.accessMode === "ReadOnly"),
    );
    assert.ok(
      foundation.consumers.every((item) => item.mayMutateContext === false),
    );

    assert.equal(foundation.activationSources.length, 11);
    assert.ok(
      foundation.activationSources.some((item) =>
        item.category === "Manager" && item.action === "object-click"
      ),
    );
    assert.ok(
      foundation.activationSources.some((item) =>
        item.category === "Runtime" && item.action === "data-refresh"
      ),
    );
    assert.ok(
      foundation.activationSources.some((item) =>
        item.category === "System" && item.action === "login"
      ),
    );

    assert.equal(foundation.principles.length, 5);
    assert.equal(
      foundation.snapshotPhilosophy.enablesHistoricalReconstruction,
      true,
    );
  });

  it("is metadata-only with zero prohibited runtime and UI behaviors", () => {
    const foundation = ExecutiveContextRuntimeFoundation;
    assert.equal(Object.isFrozen(foundation), true);
    assert.equal(Object.isFrozen(foundation.identity), true);
    assert.equal(Object.isFrozen(foundation.lifecycle), true);
    assert.equal(Object.isFrozen(foundation.contracts), true);
    assert.equal(Object.isFrozen(foundation.events), true);
    assert.equal(Object.isFrozen(foundation.metadata), true);

    assert.equal(foundation.metadataOnly, true);
    assert.equal(foundation.rootRuntimePackage, true);
    assert.equal(foundation.singleActiveContext, true);
    assert.equal(foundation.executesTransitions, false);
    assert.equal(foundation.runtimeStateMachine, false);
    assert.equal(foundation.dispatchesEvents, false);
    assert.equal(foundation.uiBehavior, false);
    assert.equal(foundation.renderingBehavior, false);
    assert.equal(foundation.animationBehavior, false);
    assert.equal(foundation.reactBehavior, false);
    assert.equal(foundation.nextJsBehavior, false);
    assert.equal(foundation.businessLogicBehavior, false);
    assert.equal(foundation.aiReasoningBehavior, false);
    assert.equal(foundation.kpiCalculationBehavior, false);
    assert.equal(foundation.packOpenBehavior, false);
    assert.equal(foundation.directorControlBehavior, false);
    assert.equal(foundation.workspaceLogicBehavior, false);
    assert.equal(foundation.registryPhase, false);
    assert.equal(foundation.modelPhase, false);
    assert.equal(foundation.validationPhase, false);
    assert.equal(foundation.manifestPhase, false);
    assert.equal(foundation.platformPhase, false);

    assert.equal(foundation.ownership.rootRuntimePackage, true);
    assert.equal(foundation.ownership.downstreamRuntimeDependency, false);
    assert.equal(foundation.ownership.ownsUi, false);
    assert.equal(foundation.ownership.ownsBusinessLogic, false);
    assert.equal(foundation.boundaries.dependsOnRuntimeModules, false);
    assert.ok(
      foundation.boundaries.dependencyRules.includes("RootRuntimePackage"),
    );
    assert.ok(
      foundation.boundaries.prohibitedSurfaces.includes("calculate KPIs"),
    );
    assert.ok(foundation.boundaries.prohibitedSurfaces.includes("React"));
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = RTC11_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    }
  });

  it("preserves deterministic summary and dynamic inventory counts", () => {
    const foundation = ExecutiveContextRuntimeFoundation;
    const summaryA = getExecutiveContextRuntimeFoundationSummary();
    const summaryB = getExecutiveContextRuntimeFoundationSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ExecutiveContextRuntimeFoundationId);
    assert.equal(
      summaryA.namespace,
      "nexora.rtc.executive.context.foundation",
    );
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.sectionCount, 13);
    assert.equal(summaryA.contractCount, 8);
    assert.equal(summaryA.eventCount, 6);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.consumerCount, 6);
    assert.equal(summaryA.responsibilityCount, 7);
    assert.equal(summaryA.guaranteeCount, 6);
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:2 — Executive Context Runtime Registry",
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
  });
});
