/**
 * RTC-1:3 — Executive Context Runtime Model Tests.
 *
 * Deterministic coverage for the immutable Executive Context Runtime Model.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./executiveContextRuntimeModel.ts";
import {
  ExecutiveContextRuntimeModel,
  ExecutiveContextRuntimeModelId,
  ExecutiveContextRuntimeModelName,
  ExecutiveContextRuntimeModelNamespace,
  ExecutiveContextRuntimeModelReadiness,
  ExecutiveContextRuntimeModelStatus,
  ExecutiveContextRuntimeModelVersion,
  getExecutiveContextRuntimeModelSummary,
} from "./executiveContextRuntimeModel.ts";
import { ExecutiveContextRuntimeRegistry } from "./executiveContextRuntimeRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC13_FILES = Object.freeze([
  "executiveContextRuntimeModel.ts",
  "executiveContextModel.ts",
  "executiveWorkspaceModel.ts",
  "executivePackModel.ts",
  "executiveTimelineModel.ts",
  "executiveStageModel.ts",
  "executiveRuntimeRelationships.ts",
  "executiveContextRuntimeModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveContextRuntimeModelId",
  "ExecutiveContextRuntimeModelVersion",
  "ExecutiveContextRuntimeModelName",
  "ExecutiveContextRuntimeModelNamespace",
  "ExecutiveContextRuntimeModelStatus",
  "ExecutiveContextRuntimeModelReadiness",
  "ExecutiveContextRuntimeModel",
  "getExecutiveContextRuntimeModelSummary",
  "getExecutiveContextRuntimeModel",
  "ExecutiveContextRuntimeModelIdentity",
  "ExecutiveContextRuntimeModelNextPhase",
] as const);

const EXPECTED_ENTITY_NAMES = Object.freeze([
  "Identity",
  "Lifecycle",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "Focus",
  "Timeline",
  "Journal",
  "Stage",
  "Advisor",
  "Director",
  "Metadata",
] as const);

const EXPECTED_CONTEXT_TYPES = Object.freeze([
  "Global Context",
  "Workspace Context",
  "Pack Context",
  "Object Context",
  "Timeline Context",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea)\//,
  /from ["']\.\/executiveContextRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveContextRuntime(Types|Identity|Lifecycle|Contracts|Events|Metadata)\.ts["']/,
  /from ["']\.\/executive(Context|Workspace|Pack|Object|Timeline)Registry\.ts["']/,
  /from ["']\.\/executiveRuntimeRegistryMetadata\.ts["']/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("RTC-1:3 Executive Context Runtime Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(RTC13_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC13_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const modelArtifacts = present.filter((name) => RTC13_FILES.includes(name));
    assert.equal(modelArtifacts.length, 8);
    assert.ok(
      !RTC13_FILES.some((name) =>
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
      ExecutiveContextRuntimeModelId,
      "RTC-1:3/ExecutiveContextRuntimeModel",
    );
    assert.equal(ExecutiveContextRuntimeModelVersion, "1.0.0");
    assert.equal(
      ExecutiveContextRuntimeModelName,
      "Executive Context Runtime Model",
    );
    assert.equal(
      ExecutiveContextRuntimeModelNamespace,
      "nexora.rtc.executive.context.model",
    );
    assert.equal(ExecutiveContextRuntimeModelStatus, "Model");
    assert.equal(
      ExecutiveContextRuntimeModelReadiness,
      "ReadyForValidation",
    );

    const model = ExecutiveContextRuntimeModel;
    assert.equal(model.identity.phaseId, "RTC-1:3");
    assert.equal(model.identity.status, "Model");
    assert.equal(model.identity.readiness, "ReadyForValidation");
    assert.equal(
      model.identity.sourceRegistry,
      "RTC-1:2/ExecutiveContextRuntimeRegistry",
    );
    assert.equal(model.status, "Model");
    assert.equal(model.readiness, "ReadyForValidation");
    assert.equal(
      model.nextPhase,
      "RTC-1:4 — Executive Context Runtime Validation",
    );
  });

  it("consumes RTC-1:2 Registry and defines one canonical ExecutiveContext root", () => {
    const model = ExecutiveContextRuntimeModel;
    assert.equal(model.registry, ExecutiveContextRuntimeRegistry);
    assert.equal(model.root.entityName, "ExecutiveContext");
    assert.equal(model.root.root, true);
    assert.equal(model.root.stableIdentity, true);
    assert.equal(model.root.entityId, "RTC-1:3/Entity/ExecutiveContext");
    assert.equal(model.root.fieldCount, 13);
    assert.deepEqual(
      model.root.fields.map((item) => item.fieldName),
      [
        "identity",
        "lifecycle",
        "manager",
        "company",
        "workspace",
        "pack",
        "focus",
        "timeline",
        "journal",
        "stage",
        "advisor",
        "director",
        "metadata",
      ],
    );
  });

  it("defines all runtime entities with immutable identities and explicit fields", () => {
    const model = ExecutiveContextRuntimeModel;

    assert.deepEqual([...model.entityNames], [...EXPECTED_ENTITY_NAMES]);
    assert.deepEqual(
      model.contextTypes.map((item) => item.name),
      [...EXPECTED_CONTEXT_TYPES],
    );

    assert.equal(model.workspace.entityName, "Workspace");
    assert.deepEqual(
      model.workspace.fields.map((item) => item.fieldName),
      ["workspaceId", "type", "status", "origin", "metadata"],
    );

    assert.equal(model.pack.entityName, "Pack");
    assert.ok(
      model.pack.fields.some((item) => item.fieldName === "workspaceReference"),
    );
    assert.ok(
      model.pack.fields.some((item) => item.fieldName === "lifecycleReference"),
    );

    assert.equal(model.timeline.entityName, "Timeline");
    assert.ok(
      model.timeline.fields.some((item) => item.fieldName === "snapshotReference"),
    );

    assert.equal(model.stage.entityName, "Stage");
    assert.ok(
      model.stage.fields.some((item) => item.fieldName === "visibleObjects"),
    );

    assert.equal(model.focus.entityName, "Focus");
    assert.deepEqual(
      model.focus.fields.map((item) => item.fieldName),
      ["focusId", "targetType", "targetId", "reason", "timestamp"],
    );

    assertUnique(
      model.entities.map((item) => item.entityId),
      "entity IDs",
    );
    assert.ok(model.entities.every((item) => item.stableIdentity === true));
    assert.ok(model.entities.every((item) => item.storesRuntimeValues === false));
    assert.ok(model.entities.every((item) => Object.isFrozen(item)));
    assert.ok(
      model.entities.every((item) =>
        item.fields.every((field) => Object.isFrozen(field))
      ),
    );
  });

  it("declares ownership hierarchy, relationships, and invariants", () => {
    const model = ExecutiveContextRuntimeModel;

    assert.equal(model.ownership.root, "ExecutiveContext");
    assert.deepEqual(
      [...model.ownership.ownedByRoot],
      ["Workspace", "Pack", "Timeline", "Journal", "Stage", "Focus"],
    );
    assert.equal(model.ownership.childNeverOwnsContext, true);
    assert.equal(model.ownership.circularOwnershipPermitted, false);

    assert.equal(model.relationships.length, 11);
    assert.ok(
      model.relationships.some(
        (item) =>
          item.from === "ExecutiveContext" &&
          item.to === "Workspace" &&
          item.kind === "Owns",
      ),
    );
    assert.ok(
      model.relationships.some(
        (item) =>
          item.from === "Workspace" &&
          item.to === "Pack" &&
          item.kind === "Owns",
      ),
    );
    assert.ok(model.relationships.every((item) => item.directional === true));
    assert.ok(
      model.relationships.every(
        (item) => item.circularOwnershipPermitted === false,
      ),
    );

    assert.equal(model.invariants.length, 7);
    assert.ok(
      model.invariants.some((item) =>
        item.name === "One active Executive Context"
      ),
    );
    assert.ok(
      model.invariants.some((item) => item.name === "Zero or one active Pack"),
    );
    assert.equal(model.relationshipCatalog.validatesInvariants, false);

    assert.equal(model.referenceRules.length, 4);
    assert.equal(model.principles.length, 5);
    assert.equal(model.extensionStrategy.mayRenameIdentities, false);
    assert.equal(model.extensionStrategy.mayRemoveRootEntities, false);
    assert.equal(model.extensionStrategy.mayChangeOwnershipHierarchy, false);
  });

  it("is structure-only with zero prohibited runtime behaviors", () => {
    const model = ExecutiveContextRuntimeModel;
    assert.equal(Object.isFrozen(model), true);
    assert.equal(Object.isFrozen(model.root), true);
    assert.equal(Object.isFrozen(model.relationships), true);

    assert.equal(model.metadataOnly, true);
    assert.equal(model.storesRuntimeValues, false);
    assert.equal(model.executesTransitions, false);
    assert.equal(model.performsValidation, false);
    assert.equal(model.mutatesRuntimeState, false);
    assert.equal(model.renderingBehavior, false);
    assert.equal(model.calculatesMetrics, false);
    assert.equal(model.invokesAi, false);
    assert.equal(model.accessesDatabases, false);
    assert.equal(model.managesPersistence, false);
    assert.equal(model.reactBehavior, false);
    assert.equal(model.nextJsBehavior, false);
    assert.equal(model.validationPhase, false);
    assert.equal(model.manifestPhase, false);
    assert.equal(model.platformPhase, false);

    assert.ok(model.prohibitedSurfaces.includes("perform validation"));
    assert.ok(model.prohibitedSurfaces.includes("render UI"));
    assert.ok(model.prohibitedSurfaces.includes("invoke AI"));
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = RTC13_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      new URL("./executiveContextRuntimeModel.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregateSource,
      /from ["']\.\/executiveContextRuntimeRegistry\.ts["']/,
    );
  });

  it("preserves deterministic summary and dynamic statistics", () => {
    const model = ExecutiveContextRuntimeModel;
    const summaryA = getExecutiveContextRuntimeModelSummary();
    const summaryB = getExecutiveContextRuntimeModelSummary();

    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, ExecutiveContextRuntimeModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.rootEntity, "ExecutiveContext");
    assert.equal(summaryA.entityCount, 14);
    assert.equal(summaryA.firstLevelEntityCount, 13);
    assert.equal(summaryA.contextTypeCount, 5);
    assert.equal(summaryA.relationshipCount, 11);
    assert.equal(summaryA.invariantCount, 7);
    assert.equal(
      summaryA.nextPhase,
      "RTC-1:4 — Executive Context Runtime Validation",
    );

    assert.equal(model.statistics.entityCount, model.entities.length);
    assert.equal(
      model.statistics.relationshipCount,
      model.relationships.length,
    );
    assert.equal(model.statistics.invariantCount, model.invariants.length);
    assert.equal(model.statistics.rootFieldCount, model.root.fieldCount);
  });
});
