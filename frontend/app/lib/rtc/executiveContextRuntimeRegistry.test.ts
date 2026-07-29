/**
 * RTC-1:2 — Executive Context Runtime Registry Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Registry.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveContextRuntimeFoundation } from "./executiveContextRuntimeFoundation.ts";
import * as RegistryModule from "./executiveContextRuntimeRegistry.ts";
import {
  ExecutiveContextRuntimeRegistry,
  ExecutiveContextRuntimeRegistryId,
  ExecutiveContextRuntimeRegistryName,
  ExecutiveContextRuntimeRegistryNamespace,
  ExecutiveContextRuntimeRegistryReadiness,
  ExecutiveContextRuntimeRegistryStatus,
  ExecutiveContextRuntimeRegistryVersion,
  getExecutiveContextRuntimeRegistrySummary,
} from "./executiveContextRuntimeRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC12_FILES = Object.freeze([
  "executiveContextRuntimeRegistry.ts",
  "executiveContextRegistry.ts",
  "executiveWorkspaceRegistry.ts",
  "executivePackRegistry.ts",
  "executiveObjectRegistry.ts",
  "executiveTimelineRegistry.ts",
  "executiveRuntimeRegistryMetadata.ts",
  "executiveContextRuntimeRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeRegistryId",
  "ExecutiveContextRuntimeRegistryVersion",
  "ExecutiveContextRuntimeRegistryName",
  "ExecutiveContextRuntimeRegistryNamespace",
  "ExecutiveContextRuntimeRegistryStatus",
  "ExecutiveContextRuntimeRegistryReadiness",
  "ExecutiveContextRuntimeRegistry",
  "getExecutiveContextRuntimeRegistrySummary",
  "getExecutiveContextRuntimeRegistry",
] as const);

const EXPECTED_CONTEXTS = Object.freeze([
  "ExecutiveContext",
  "GlobalContext",
  "ObjectContext",
  "PackContext",
  "WorkspaceContext",
] as const);

const EXPECTED_WORKSPACES = Object.freeze([
  "Global",
  "Goal",
  "Problem",
  "Scenario",
  "Decision",
  "Monitoring",
  "War Room",
] as const);

const EXPECTED_PACKS = Object.freeze([
  "Conversation",
  "Goal",
  "Problem",
  "Understanding",
  "Scenario",
  "Decision",
  "Monitoring",
  "Knowledge",
  "Archived",
] as const);

const EXPECTED_OBJECTS = Object.freeze([
  "Business Object",
  "Executive Object",
  "Knowledge Object",
  "Relationship Object",
  "Data Object",
] as const);

const EXPECTED_TIMELINES = Object.freeze([
  "Global Timeline",
  "Pack Timeline",
  "Object Timeline",
  "Snapshot Timeline",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Context",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "Object",
  "Timeline",
  "Journal",
  "Advisor",
  "Director",
  "Stage",
  "Metadata",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']\.\/executiveContextRuntime(Types|Identity|Lifecycle|Contracts|Events|Metadata)\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:2 Executive Context Runtime Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(RTC12_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC12_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const registryArtifacts = present.filter((name) =>
      RTC12_FILES.includes(name)
    );
    assert.equal(registryArtifacts.length, 8);
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in RegistryModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Registry identity and ReadyForModel readiness", () => {
    assert.equal(
      ExecutiveContextRuntimeRegistryId,
      "RTC-1:2/ExecutiveContextRuntimeRegistry",
    );
    assert.equal(ExecutiveContextRuntimeRegistryVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeRegistryName,
      "Executive Context Runtime Registry",
    );
    assert.equal(
      ExecutiveContextRuntimeRegistryNamespace,
      "nexora.rtc.executive.context.registry",
    );
    assert.equal(ExecutiveContextRuntimeRegistryStatus, "Registry");
    assert.equal(ExecutiveContextRuntimeRegistryReadiness, "ReadyForModel");

    const registry = ExecutiveContextRuntimeRegistry;
    assert.equal(registry.identity.phaseId, "RTC-1:2");
    assert.equal(registry.identity.status, "Registry");
    assert.equal(registry.identity.readiness, "ReadyForModel");
    assert.equal(
      registry.identity.sourceFoundation,
      "RTC-1:1/ExecutiveContextRuntimeFoundation",
    );
    assert.equal(registry.status, "Registry");
    assert.equal(registry.readiness, "ReadyForModel");
    assert.equal(
      registry.nextPhase,
      "RTC-1:3 — Executive Context Runtime Model",
    );
    assert.deepEqual(
      [...registry.upstreamDependencies],
      ["RTC-1:1 — Executive Context Runtime Foundation"],
    );
  });

  it("consumes RTC-1:1 Foundation and preserves foundation compatibility", () => {
    const registry = ExecutiveContextRuntimeRegistry;
    assert.equal(registry.foundation, ExecutiveContextRuntimeFoundation);
    assert.equal(
      registry.foundation.identity.foundationId,
      "RTC-1:1/ExecutiveContextRuntimeFoundation",
    );
    assert.equal(registry.metadata.foundationCompatible, true);
    assert.ok(registry.guarantees.includes("Foundation compatibility"));
  });

  it("registers all domain identities uniquely with deterministic order", () => {
    const registry = ExecutiveContextRuntimeRegistry;

    assert.deepEqual([...registry.domains], [...EXPECTED_DOMAINS]);
    assert.deepEqual(
      registry.contexts.map((item) => item.name),
      [...EXPECTED_CONTEXTS],
    );
    assert.deepEqual(
      registry.workspaces.map((item) => item.name),
      [...EXPECTED_WORKSPACES],
    );
    assert.deepEqual(
      registry.packs.map((item) => item.name),
      [...EXPECTED_PACKS],
    );
    assert.deepEqual(
      registry.objects.map((item) => item.name),
      [...EXPECTED_OBJECTS],
    );
    assert.deepEqual(
      registry.timelines.map((item) => item.name),
      [...EXPECTED_TIMELINES],
    );

    assert.equal(registry.managers.length, 4);
    assert.equal(registry.companies.length, 4);
    assert.equal(registry.journals.length, 6);
    assert.equal(registry.advisors.length, 6);
    assert.equal(registry.directors.length, 5);
    assert.equal(registry.stages.length, 5);
    assert.equal(registry.metadataCategories.length, 6);

    assertUnique(
      registry.entries.map((item) => item.id),
      "registry entry IDs",
    );
    assertUnique(
      registry.entries.map((item) => item.canonicalIdentity),
      "canonical identities",
    );

    for (const entry of registry.entries) {
      assert.equal(entry.status, "Registered");
      assert.equal(entry.immutableIdentity, true);
      assert.equal(entry.storesRuntimeValues, false);
      assert.equal(entry.executable, false);
      assert.equal(Object.isFrozen(entry), true);
    }

    assert.deepEqual(
      registry.contexts.map((item) => item.order),
      registry.contexts.map((_, index) => index + 1),
    );
  });

  it("declares identity-level relationships and registry principles", () => {
    const registry = ExecutiveContextRuntimeRegistry;
    assert.equal(registry.relationships.length, 7);
    assert.ok(
      registry.relationships.every((item) => item.from === "Context"),
    );
    assert.deepEqual(
      registry.relationships.map((item) => item.to),
      [
        "Workspace",
        "Pack",
        "Object",
        "Timeline",
        "Journal",
        "Advisor",
        "Stage",
      ],
    );
    assert.equal(registry.principles.length, 5);
    assert.ok(
      registry.principles.some((item) => item.name === "Definitions Only"),
    );
    assert.ok(registry.guarantees.includes("Unique identities"));
    assert.ok(registry.guarantees.includes("Deterministic lookup"));
  });

  it("is definition-only with zero prohibited runtime behaviors", () => {
    const registry = ExecutiveContextRuntimeRegistry;
    assert.equal(Object.isFrozen(registry), true);
    assert.equal(Object.isFrozen(registry.metadata), true);
    assert.equal(Object.isFrozen(registry.entries), true);

    assert.equal(registry.metadataOnly, true);
    assert.equal(registry.storesRuntimeValues, false);
    assert.equal(registry.holdsActiveContext, false);
    assert.equal(registry.executesTransitions, false);
    assert.equal(registry.performsValidation, false);
    assert.equal(registry.executesLifecycle, false);
    assert.equal(registry.modifiesState, false);
    assert.equal(registry.communicatesWithUi, false);
    assert.equal(registry.renderingBehavior, false);
    assert.equal(registry.processesTimeline, false);
    assert.equal(registry.businessLogicBehavior, false);
    assert.equal(registry.aiReasoningBehavior, false);
    assert.equal(registry.reactBehavior, false);
    assert.equal(registry.nextJsBehavior, false);
    assert.equal(registry.modelPhase, false);
    assert.equal(registry.validationPhase, false);
    assert.equal(registry.manifestPhase, false);
    assert.equal(registry.platformPhase, false);

    assert.ok(
      registry.prohibitedSurfaces.includes("Store runtime values"),
    );
    assert.ok(registry.prohibitedSurfaces.includes("Perform validation"));
    assert.ok(registry.prohibitedSurfaces.includes("Render Stage"));
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = RTC12_FILES.filter((name) => !name.endsWith(".test.ts"));
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

    const aggregateSource = readFileSync(
      new URL("./executiveContextRuntimeRegistry.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeFoundation\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const registry = ExecutiveContextRuntimeRegistry;
    const summaryA = getExecutiveContextRuntimeRegistrySummary();
    const summaryB = getExecutiveContextRuntimeRegistrySummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, ExecutiveContextRuntimeRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.domainCount, 12);
    assert.equal(summaryA.contextCount, 5);
    assert.equal(summaryA.workspaceCount, 7);
    assert.equal(summaryA.packCount, 9);
    assert.equal(summaryA.objectCount, 5);
    assert.equal(summaryA.timelineCount, 4);
    assert.equal(summaryA.relationshipCount, 7);
    assert.equal(
      summaryA.entryCount,
      5 + 4 + 4 + 7 + 9 + 5 + 4 + 6 + 6 + 5 + 5 + 6,
    );
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:3 — Executive Context Runtime Model",
    );

    assert.equal(registry.statistics.entryCount, registry.entries.length);
    assert.equal(registry.statistics.contextCount, registry.contexts.length);
    assert.equal(registry.statistics.packCount, registry.packs.length);
    assert.equal(
      registry.statistics.collectionCount,
      Object.keys(registry.collections).length,
    );
  });
});
