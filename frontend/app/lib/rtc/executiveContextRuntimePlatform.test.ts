/**
 * RTC-1:6 — Executive Context Runtime Platform Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Platform.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveContextRuntimeManifest } from "./executiveContextRuntimeManifest.ts";
import * as PlatformModule from "./executiveContextRuntimePlatform.ts";
import {
  ExecutiveContextRuntimePlatform,
  ExecutiveContextRuntimePlatformId,
  ExecutiveContextRuntimePlatformName,
  ExecutiveContextRuntimePlatformNamespace,
  ExecutiveContextRuntimePlatformReadiness,
  ExecutiveContextRuntimePlatformStatus,
  ExecutiveContextRuntimePlatformVersion,
  getExecutiveContextRuntimePlatformSummary,
} from "./executiveContextRuntimePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC16_FILES = Object.freeze([
  "executiveContextRuntimePlatform.ts",
  "executiveContextPlatformServices.ts",
  "executiveContextPlatformEvents.ts",
  "executiveContextPlatformLifecycle.ts",
  "executiveContextPlatformInspection.ts",
  "executiveContextPlatformHealth.ts",
  "executiveContextPlatformMetadata.ts",
  "executiveContextRuntimePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimePlatformId",
  "ExecutiveContextRuntimePlatformVersion",
  "ExecutiveContextRuntimePlatformName",
  "ExecutiveContextRuntimePlatformNamespace",
  "ExecutiveContextRuntimePlatformStatus",
  "ExecutiveContextRuntimePlatformReadiness",
  "ExecutiveContextRuntimePlatform",
  "getExecutiveContextRuntimePlatformSummary",
  "getExecutiveContextRuntimePlatform",
  "ExecutiveContextPlatformIdentity",
  "ExecutiveContextRuntimePlatformNextPhase",
] as const);

const EXPECTED_SERVICES = Object.freeze([
  "ExecutiveContextService",
  "ExecutiveContextRegistryService",
  "ExecutiveContextLifecycleService",
  "ExecutiveContextSnapshotService",
  "ExecutiveContextEventService",
  "ExecutiveContextMetadataService",
  "ExecutiveContextInspectionService",
  "ExecutiveContextPlatformService",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "ContextInitialized",
  "ContextActivated",
  "ContextUpdated",
  "ContextSnapshotCreated",
  "ContextArchived",
  "ContextRestored",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Initialize",
  "Activate",
  "Update",
  "Archive",
  "Restore",
  "Inspect",
] as const);

const EXPECTED_HEALTH = Object.freeze([
  "Initializing",
  "Ready",
  "Updating",
  "Recovering",
  "Archived",
  "Error",
] as const);

const EXPECTED_INSPECTION = Object.freeze([
  "RuntimeIdentity",
  "PlatformVersion",
  "ActiveContext",
  "SnapshotCount",
  "ValidationStatus",
  "RuntimeStatus",
  "PlatformReadiness",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']\.\/executiveContextRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveContextRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveContextRuntimeModel\.ts["']/,
  /from ["']\.\/executiveContextRuntimeValidation\.ts["']/,
  /from ["']\.\/executiveContextManifest(Identity|Dependencies|Capabilities|Guarantees|Metadata|Registry)\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:6 Executive Context Runtime Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(RTC16_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC16_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => RTC16_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !RTC16_FILES.some((name) => /Certification|Freeze|PublicIndex/i.test(name)),
      "Platform artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in PlatformModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Platform identity and ReadyForCertification readiness", () => {
    assert.equal(
      ExecutiveContextRuntimePlatformId,
      "RTC-1:6/ExecutiveContextRuntimePlatform",
    );
    assert.equal(ExecutiveContextRuntimePlatformVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimePlatformName,
      "Executive Context Runtime Platform",
    );
    assert.equal(
      ExecutiveContextRuntimePlatformNamespace,
      "nexora.rtc.executive.context.platform",
    );
    assert.equal(ExecutiveContextRuntimePlatformStatus, "Platform");
    assert.equal(
      ExecutiveContextRuntimePlatformReadiness,
      "ReadyForCertification",
    );

    const platform = ExecutiveContextRuntimePlatform;
    assert.equal(platform.identity.phaseId, "RTC-1:6");
    assert.equal(platform.identity.status, "Platform");
    assert.equal(platform.identity.readiness, "ReadyForCertification");
    assert.equal(
      platform.identity.sourceManifest,
      "RTC-1:5/ExecutiveContextRuntimeManifest",
    );
    assert.equal(platform.status, "Platform");
    assert.equal(platform.readiness, "ReadyForCertification");
    assert.equal(
      platform.nextPhase,
      "RTC-1:7 — Executive Context Runtime Certification",
    );
  });

  it("consumes RTC-1:5 Manifest and exposes eight canonical services", () => {
    const platform = ExecutiveContextRuntimePlatform;
    assert.equal(platform.manifest, ExecutiveContextRuntimeManifest);
    assert.equal(platform.services.length, 8);
    assert.deepEqual([...platform.serviceNames], [...EXPECTED_SERVICES]);
    assert.ok(platform.services.every((item) => item.contractsOnly === true));
    assert.ok(
      platform.services.every((item) => item.consumerMayMutateContext === false),
    );
    assert.deepEqual(
      [...platform.accessModel.operations],
      ["Read", "Snapshot", "Inspect", "Replace"],
    );
    assert.equal(platform.accessModel.consumersMutateContextDirectly, false);
    assertUnique(
      platform.services.map((item) => item.serviceId),
      "service IDs",
    );
  });

  it("declares lifecycle operations, events, health, and inspection baselines", () => {
    const platform = ExecutiveContextRuntimePlatform;

    assert.deepEqual(
      [...platform.lifecycleOperationNames],
      [...EXPECTED_LIFECYCLE],
    );
    assert.equal(platform.lifecycle.businessTransitionRules, false);
    assert.equal(platform.lifecycle.snapshot.storageOutsidePhase, true);

    assert.deepEqual([...platform.eventNames], [...EXPECTED_EVENTS]);
    assert.equal(platform.eventChannel.transportImplemented, false);
    assert.ok(
      platform.events.every((item) => item.transportImplemented === false),
    );

    assert.deepEqual([...platform.healthStateNames], [...EXPECTED_HEALTH]);
    assert.ok(platform.healthStates.every((item) => item.informational === true));
    assert.equal(platform.health.informationalOnly, true);

    assert.deepEqual(
      [...platform.inspectionCategoryNames],
      [...EXPECTED_INSPECTION],
    );
    assert.ok(
      platform.inspectionCategories.every((item) => item.modifiesRuntime === false),
    );
    assert.equal(platform.inspection.readOnly, true);

    assert.deepEqual(
      { ...platform.baselines },
      {
        platformServices: 8,
        lifecycleOperations: 6,
        runtimeEvents: 6,
        healthStates: 6,
        inspectionCategories: 7,
        runtimeConsumers: 6,
        platformGuarantees: 8,
      },
    );
  });

  it("declares consumers, guarantees, boundaries, and immutable metadata", () => {
    const platform = ExecutiveContextRuntimePlatform;

    assert.equal(platform.consumers.length, 6);
    assert.ok(
      platform.consumers.every((item) => item.accessMode === "ReadOnly"),
    );
    assert.ok(
      platform.consumers.some((item) => item.name === "Executive Journal Runtime"),
    );
    assert.ok(
      platform.consumers.some((item) => item.name === "Director Runtime"),
    );

    assert.equal(platform.guarantees.length, 8);
    assert.ok(platform.guarantees.includes("single Runtime entry point"));
    assert.ok(platform.guarantees.includes("read-only consumer access"));

    assert.ok(platform.boundaries.includes("Business reasoning"));
    assert.ok(platform.boundaries.includes("Rendering"));
    assert.ok(platform.boundaries.includes("React"));
    assert.ok(platform.boundaries.includes("KPI calculations"));

    assert.equal(platform.principles.length, 5);
    assert.equal(platform.responsibilities.length, 8);
    assert.equal(platform.extensionStrategy.mayRenamePublicServices, false);
    assert.equal(platform.extensionStrategy.mayRemoveExistingContracts, false);
    assert.equal(platform.extensionStrategy.mayAlterServiceIdentities, false);

    assert.equal(platform.metadata.architectureVersion, "NPA-T vNext");
    assert.equal(
      platform.metadata.generatedTimestamp,
      "2026-07-25T00:00:00.000Z",
    );
    assert.equal(platform.metadata.readOnly, true);
    assert.equal(Object.isFrozen(platform.metadata), true);
  });

  it("is contract-only with zero prohibited runtime and UI behaviors", () => {
    const platform = ExecutiveContextRuntimePlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.services), true);
    assert.equal(Object.isFrozen(platform.events), true);

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.contractsOnly, true);
    assert.equal(platform.singleRuntimeEntryPoint, true);
    assert.equal(platform.consumersMutateContextDirectly, false);
    assert.equal(platform.businessLogicBehavior, false);
    assert.equal(platform.aiExecutionBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.renderingBehavior, false);
    assert.equal(platform.visualTransitionBehavior, false);
    assert.equal(platform.workflowExecutionBehavior, false);
    assert.equal(platform.externalCommunicationBehavior, false);
    assert.equal(platform.kpiCalculationBehavior, false);
    assert.equal(platform.scenarioEngineBehavior, false);
    assert.equal(platform.decisionEngineBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.nextJsBehavior, false);
    assert.equal(platform.eventTransportImplemented, false);
    assert.equal(platform.snapshotStorageImplemented, false);
    assert.equal(platform.certificationPhase, false);
    assert.equal(platform.freezePhase, false);
    assert.equal(platform.publicIndexPhase, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = RTC16_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.doesNotMatch(source, /\bDate\.now\b/);
      assert.doesNotMatch(source, /\bfrom ["']react/);
      assert.doesNotMatch(source, /\bfrom ["']next/);
    }

    const aggregateSource = readFileSync(
      new URL("./executiveContextRuntimePlatform.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeManifest\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const platform = ExecutiveContextRuntimePlatform;
    const summaryA = getExecutiveContextRuntimePlatformSummary();
    const summaryB = getExecutiveContextRuntimePlatformSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, ExecutiveContextRuntimePlatformId);
    assert.equal(summaryA.status, "Platform");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.serviceCount, 8);
    assert.equal(summaryA.lifecycleOperationCount, 6);
    assert.equal(summaryA.eventCount, 6);
    assert.equal(summaryA.healthStateCount, 6);
    assert.equal(summaryA.inspectionCategoryCount, 7);
    assert.equal(summaryA.consumerCount, 6);
    assert.equal(summaryA.guaranteeCount, 8);
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:7 — Executive Context Runtime Certification",
    );

    assert.equal(platform.statistics.serviceCount, platform.services.length);
    assert.equal(platform.statistics.eventCount, platform.events.length);
    assert.equal(
      platform.statistics.lifecycleOperationCount,
      platform.lifecycleOperations.length,
    );
    assert.deepEqual(
      [...platform.compositionLayers],
      [
        "Foundation",
        "Registry",
        "Model",
        "Validation",
        "Manifest",
        "Platform",
      ],
    );
  });
});
