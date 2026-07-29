/**
 * EX-1:1 — Executive Stage Foundation Tests.
 *
 * Deterministic coverage for the Executive Stage Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveShellPlaceholders,
  ExecutiveStageFoundation,
  ExecutiveStageFoundationId,
  ExecutiveStageFoundationName,
  ExecutiveStageFoundationNamespace,
  ExecutiveStageFoundationReadiness,
  ExecutiveStageFoundationStatus,
  ExecutiveStageFoundationVersion,
  ExecutiveStageLayerNames,
  ExecutiveStageLayers,
  ExecutiveStageVisualStates,
} from "./executiveStageTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX11_FILES = Object.freeze([
  "executiveStageFoundation.tsx",
  "executiveShell.tsx",
  "executiveStageSurface.tsx",
  "executiveObjectLayer.tsx",
  "executiveRelationshipLayer.tsx",
  "executiveFocusLayer.tsx",
  "executiveStageTypes.ts",
  "executiveStageFoundation.test.ts",
]);

const EXPECTED_LAYERS = Object.freeze([
  "StageSurface",
  "ObjectLayer",
  "RelationshipLayer",
  "FocusLayer",
  "InteractionLayer",
  "StageOverlay",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\/rtc\/executiveContextRuntimeFoundation\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeRegistry\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeModel\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeValidation\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeManifest\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimePlatform\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeCertification\.ts["']/,
  /from ["']\.\.\/rtc\/executiveContextRuntimeFreeze\.ts["']/,
  /from ["'][^"']*\/(engine|assistant|dashboard|business)\//,
]);

describe("EX-1:1 Executive Stage Foundation", () => {
  it("creates exactly eight Foundation files", () => {
    assert.equal(EX11_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX11_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      present.filter((name) => EX11_FILES.includes(name)).length,
      8,
    );
  });

  it("publishes canonical Foundation identity and ReadyForRegistry readiness", () => {
    assert.equal(
      ExecutiveStageFoundationId,
      "EX-1:1/ExecutiveStageFoundation",
    );
    assert.equal(ExecutiveStageFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveStageFoundationName,
      "Executive Stage Foundation",
    );
    assert.equal(
      ExecutiveStageFoundationNamespace,
      "nexora.ex.executive.stage.foundation",
    );
    assert.equal(ExecutiveStageFoundationStatus, "Foundation");
    assert.equal(ExecutiveStageFoundationReadiness, "ReadyForRegistry");

    assert.equal(ExecutiveStageFoundation.identity.phaseId, "EX-1:1");
    assert.equal(ExecutiveStageFoundation.status, "Foundation");
    assert.equal(ExecutiveStageFoundation.readiness, "ReadyForRegistry");
    assert.equal(
      ExecutiveStageFoundation.identity.sourceRuntimePublicIndex,
      "RTC-1:9/ExecutiveContextRuntimePublicIndex",
    );
    assert.equal(
      ExecutiveStageFoundation.nextPhase,
      "EX-1:2 — Executive Stage Registry",
    );
  });

  it("defines six canonical Stage layers and foundational visual states", () => {
    assert.equal(ExecutiveStageLayers.length, 6);
    assert.deepEqual([...ExecutiveStageLayerNames], [...EXPECTED_LAYERS]);
    assert.deepEqual(
      ExecutiveStageLayers.map((item) => item.name),
      [...EXPECTED_LAYERS],
    );
    assert.deepEqual(
      [...ExecutiveStageVisualStates],
      ["Initializing", "Loading", "Ready", "Empty", "Error"],
    );
    assert.equal(ExecutiveStageFoundation.stageActive, true);
    assert.equal(ExecutiveStageFoundation.journalActive, false);
    assert.equal(ExecutiveStageFoundation.timelineActive, false);
  });

  it("keeps Journal and Timeline as Shell placeholders only", () => {
    assert.equal(ExecutiveShellPlaceholders.length, 2);
    assert.deepEqual(
      ExecutiveShellPlaceholders.map((item) => item.name),
      ["Executive Timeline", "Executive Journal"],
    );
    assert.ok(
      ExecutiveShellPlaceholders.every((item) => item.status === "placeholder"),
    );
    assert.ok(ExecutiveShellPlaceholders.every((item) => item.active === false));
  });

  it("is Runtime-driven projection without business or AI logic", () => {
    assert.equal(
      ExecutiveStageFoundation.runtimeDependency,
      "executiveContextRuntimePublicIndex",
    );
    assert.equal(ExecutiveStageFoundation.ownsBusinessState, false);
    assert.equal(ExecutiveStageFoundation.initiatesRuntimeChanges, false);
    assert.equal(ExecutiveStageFoundation.businessLogic, false);
    assert.equal(ExecutiveStageFoundation.aiLogic, false);
    assert.equal(ExecutiveStageFoundation.businessObjectImplementation, false);
    assert.equal(ExecutiveStageFoundation.projectionOnly, true);
    assert.ok(
      ExecutiveStageFoundation.prohibitedSurfaces.includes("business logic"),
    );
    assert.ok(ExecutiveStageFoundation.prohibitedSurfaces.includes("AI logic"));
    assert.ok(
      ExecutiveStageFoundation.designConstraints.includes(
        "avoid dashboard cards",
      ),
    );
    assert.ok(
      ExecutiveStageFoundation.accessibility.includes("semantic landmarks"),
    );
  });

  it("wires Stage and Shell to Runtime Public Index only", () => {
    const foundationSource = readFileSync(
      new URL("./executiveStageFoundation.tsx", import.meta.url),
      "utf8",
    );
    const shellSource = readFileSync(
      new URL("./executiveShell.tsx", import.meta.url),
      "utf8",
    );

    assert.match(
      foundationSource,
      /from ["']\.\.\/rtc\/executiveContextRuntimePublicIndex\.ts["']/,
    );
    assert.match(
      shellSource,
      /from ["']\.\.\/rtc\/executiveContextRuntimePublicIndex\.ts["']/,
    );
    assert.match(shellSource, /ExecutiveShell/);
    assert.match(shellSource, /ExecutiveRuntimeProvider/);
    assert.match(shellSource, /executive-timeline-placeholder/);
    assert.match(shellSource, /executive-journal-placeholder/);
    assert.match(foundationSource, /ExecutiveStage/);
    assert.match(foundationSource, /ExecutiveInteractionLayer/);
    assert.match(foundationSource, /ExecutiveStageOverlay/);
    assert.match(foundationSource, /data-layer-count/);

    for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
      assert.doesNotMatch(foundationSource, pattern);
      assert.doesNotMatch(shellSource, pattern);
    }
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EX11_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.doesNotMatch(source, /\bDate\.now\b/);
      assert.doesNotMatch(source, /\bopenai\b/i);
    }

    const implementationSources = sources.filter((name) =>
      name.endsWith(".tsx")
    );
    for (const file of implementationSources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /\bcalculateKpi\b/i);
      assert.doesNotMatch(source, /\banalyticsOverlay\b/i);
      assert.doesNotMatch(source, /\bDashboardCard\b/);
    }

    const layerSources = [
      "executiveStageSurface.tsx",
      "executiveObjectLayer.tsx",
      "executiveRelationshipLayer.tsx",
      "executiveFocusLayer.tsx",
    ];
    for (const file of layerSources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(
        source,
        /from ["']\.\.\/rtc\//,
        `${file} must not import Runtime directly`,
      );
    }
  });

  it("preserves deterministic foundation metadata", () => {
    assert.equal(Object.isFrozen(ExecutiveStageFoundation), true);
    assert.equal(Object.isFrozen(ExecutiveStageLayers), true);
    assert.equal(ExecutiveStageFoundation.principles.length, 5);
    assert.equal(ExecutiveStageFoundation.responsibilities.length, 6);
    assert.equal(ExecutiveStageFoundation.interactionKinds.length, 4);
    assert.equal(ExecutiveStageFoundation.overlayKinds.length, 4);
    assert.equal(ExecutiveStageFoundation.runtimeSyncSignals.length, 5);
    assert.deepEqual(
      ExecutiveStageLayers.map((item) => item.order),
      [1, 2, 3, 4, 5, 6],
    );
  });
});
