/**
 * EX-1:6 — Executive Stage Platform Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Platform.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PlatformModule from "./executiveStagePlatform.ts";
import {
  attachRuntime,
  createStage,
  detachRuntime,
  disposeStage,
  ExecutiveStagePlatform,
  ExecutiveStagePlatformId,
  ExecutiveStagePlatformName,
  ExecutiveStagePlatformNamespace,
  ExecutiveStagePlatformReadiness,
  ExecutiveStagePlatformStatus,
  ExecutiveStagePlatformVersion,
  getPlatformHealth,
  getExecutiveStagePlatform,
  getExecutiveStagePlatformSummary,
  initializeStage,
  inspectStage,
  refreshStage,
} from "./executiveStagePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX16_FILES = Object.freeze([
  "executiveStagePlatform.ts",
  "executiveStagePlatformService.ts",
  "executiveStageLifecycleService.ts",
  "executiveStageRuntimeBridge.ts",
  "executiveStageEventBus.ts",
  "executiveStageInspectionService.ts",
  "executiveStagePlatformMetadata.ts",
  "executiveStagePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStagePlatformId",
  "ExecutiveStagePlatformVersion",
  "ExecutiveStagePlatformName",
  "ExecutiveStagePlatformNamespace",
  "ExecutiveStagePlatformStatus",
  "ExecutiveStagePlatformReadiness",
  "ExecutiveStagePlatform",
  "getExecutiveStagePlatformSummary",
  "getExecutiveStagePlatform",
  "ExecutiveStagePlatformIdentity",
  "ExecutiveStagePlatformNextPhase",
  "createStage",
  "initializeStage",
  "attachRuntime",
  "detachRuntime",
  "refreshStage",
  "disposeStage",
  "inspectStage",
  "getPlatformHealth",
] as const);

const EXPECTED_SERVICES = Object.freeze([
  "ExecutiveStagePlatformService",
  "StageLifecycleService",
  "RuntimeBridgeService",
  "StageRenderingService",
  "StageInteractionService",
  "StageInspectionService",
  "PlatformMetadataService",
  "PlatformHealthService",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Created",
  "Initializing",
  "Loading Runtime",
  "Ready",
  "Updating",
  "Suspended",
  "Disposed",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "StageCreated",
  "StageInitialized",
  "RuntimeAttached",
  "RuntimeUpdated",
  "FocusChanged",
  "WorkspaceChanged",
  "TimelineChanged",
  "StageDisposed",
] as const);

const EXPECTED_APIS = Object.freeze([
  "createStage",
  "initializeStage",
  "attachRuntime",
  "detachRuntime",
  "refreshStage",
  "disposeStage",
  "inspectStage",
  "getPlatformHealth",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']\.\/executive(StageFoundation|Shell|StageSurface|ObjectLayer|RelationshipLayer|FocusLayer)\.tsx["']/,
  /from ["']\.\/executiveStageTypes\.ts["']/,
  /from ["']\.\/executiveStageRegistry\.ts["']/,
  /from ["']\.\/executiveStageModel\.ts["']/,
  /from ["']\.\/executiveStageValidation\.ts["']/,
  /from ["']\.\/executiveStageManifest\.ts["']/,
  /from ["']\.\/executiveStage(Manifest|Validation|Registry|Model)/,
  /from ["']\.\.\/rtc\/executiveContextRuntime(Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)\.ts["']/,
]);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bcreateElement\b/,
  /\buseState\b/,
  /\buseEffect\b/,
  /\bjsx\b/i,
  /\brequestAnimationFrame\b/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("EX-1:6 Executive Stage Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(EX16_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX16_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX16_FILES.includes(name)).length,
      8,
    );
    assert.ok(
      !EX16_FILES.some((name) => /Certification|Freeze|PublicIndex/i.test(name)),
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
    assert.equal(ExecutiveStagePlatformId, "EX-1:6/ExecutiveStagePlatform");
    assert.equal(ExecutiveStagePlatformName, "Executive Stage Platform");
    assert.equal(ExecutiveStagePlatformVersion, "1.0.0");
    assert.equal(
      ExecutiveStagePlatformNamespace,
      "nexora.ex.executive.stage.platform",
    );
    assert.equal(ExecutiveStagePlatformStatus, "Platform");
    assert.equal(ExecutiveStagePlatformReadiness, "ReadyForCertification");
    assert.equal(ExecutiveStagePlatform.identity.status, "Platform");
    assert.equal(
      ExecutiveStagePlatform.identity.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveStagePlatform.identity.sourceManifest,
      "EX-1:5/ExecutiveStageManifest",
    );
    assert.equal(
      ExecutiveStagePlatform.nextPhase,
      "EX-1:7 — Executive Stage Certification",
    );
  });

  it("defines eight services, seven lifecycle states, and eight events", () => {
    assert.deepEqual(
      [...ExecutiveStagePlatform.serviceNames],
      [...EXPECTED_SERVICES],
    );
    assert.deepEqual(
      [...ExecutiveStagePlatform.lifecycleStateNames],
      [...EXPECTED_LIFECYCLE],
    );
    assert.deepEqual(
      [...ExecutiveStagePlatform.eventNames],
      [...EXPECTED_EVENTS],
    );
    assert.equal(ExecutiveStagePlatform.baselines.platformServices, 8);
    assert.equal(ExecutiveStagePlatform.baselines.lifecycleStates, 7);
    assert.equal(ExecutiveStagePlatform.baselines.eventTypes, 8);
    assert.equal(ExecutiveStagePlatform.baselines.runtimeBridges, 1);
  });

  it("Runtime Bridge consumes only the Runtime Public Index", () => {
    const bridge = ExecutiveStagePlatform.runtimeBridge;
    assert.equal(bridge.bridgeCount, 1);
    assert.equal(bridge.runtimeDependency, "executiveContextRuntimePublicIndex");
    assert.equal(
      bridge.runtimePublicIndexId,
      "RTC-1:9/ExecutiveContextRuntimePublicIndex",
    );
    assert.equal(bridge.mutatesRuntime, false);
    assert.equal(bridge.ownsRuntimeState, false);
    assert.equal(bridge.importsManifest, false);
    assert.equal(bridge.importsValidation, false);
    assert.equal(bridge.importsModel, false);
    assert.equal(bridge.statePropagationDirection, "RuntimeToStage");

    const bridgeSource = readFileSync(
      `${HERE}/executiveStageRuntimeBridge.ts`,
      "utf8",
    );
    assert.match(
      bridgeSource,
      /from ["']\.\.\/rtc\/executiveContextRuntimePublicIndex\.ts["']/,
    );
    assert.doesNotMatch(
      bridgeSource,
      /from ["']\.\/executiveStage(Manifest|Validation|Model|Registry)/,
    );

    for (const file of EX16_FILES) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) {
        continue;
      }
      if (file === "executiveStageRuntimeBridge.ts") {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      assert.doesNotMatch(
        source,
        /from ["']\.\.\/rtc\//,
        `${file} must not import RTC modules directly`,
      );
    }
  });

  it("publishes eight public APIs and read-only inspection/health baselines", () => {
    assert.deepEqual(
      [...ExecutiveStagePlatform.publicApiNames],
      [...EXPECTED_APIS],
    );
    assert.equal(ExecutiveStagePlatform.baselines.publicApis, 8);
    assert.equal(ExecutiveStagePlatform.baselines.inspectionCapabilities, 6);
    assert.equal(ExecutiveStagePlatform.baselines.healthCategories, 5);
    assert.equal(ExecutiveStagePlatform.inspection.readOnly, true);
    assert.equal(ExecutiveStagePlatform.health.interruptsExecution, false);

    assert.equal(createStage().operation, "createStage");
    assert.equal(initializeStage().contractsOnly, true);
    assert.equal(
      attachRuntime().runtimeDependency,
      "executiveContextRuntimePublicIndex",
    );
    assert.equal(detachRuntime().executed, false);
    assert.equal(refreshStage().businessLogic, false);
    assert.equal(disposeStage().ownsRuntimeState, false);
    assert.equal(inspectStage().readOnly, true);
    assert.equal(getPlatformHealth().interruptsExecution, false);
  });

  it("remains free of business, Workspace, and AI behaviour", () => {
    assert.equal(ExecutiveStagePlatform.businessLogicBehavior, false);
    assert.equal(ExecutiveStagePlatform.aiExecutionBehavior, false);
    assert.equal(ExecutiveStagePlatform.workspaceOrchestrationBehavior, false);
    assert.equal(ExecutiveStagePlatform.kpiCalculationBehavior, false);
    assert.equal(ExecutiveStagePlatform.ownsRuntimeState, false);
    assert.equal(ExecutiveStagePlatform.modifiesExecutiveContext, false);
    assert.ok(
      ExecutiveStagePlatform.prohibitedSurfaces.includes(
        "execute business decisions",
      ),
    );
    assert.ok(
      ExecutiveStagePlatform.prohibitedSurfaces.includes("generate AI responses"),
    );

    const summary = getExecutiveStagePlatformSummary();
    assert.equal(summary.readiness, "ReadyForCertification");
    assert.equal(summary.runtimeDependency, "executiveContextRuntimePublicIndex");
    assert.equal(getExecutiveStagePlatform(), ExecutiveStagePlatform);

    assertUnique(
      ExecutiveStagePlatform.services.map((item) => item.serviceId),
      "service ids",
    );
    assertUnique(
      ExecutiveStagePlatform.events.map((item) => item.eventId),
      "event ids",
    );
  });

  it("forbids React and prohibited upstream imports in Platform sources", () => {
    for (const file of EX16_FILES) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
      for (const pattern of PROHIBITED_SOURCE_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
    }
  });
});
