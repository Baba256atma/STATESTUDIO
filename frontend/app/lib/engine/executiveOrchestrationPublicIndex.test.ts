import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ExecutiveOrchestrationFreezePlatform,
} from "./executiveOrchestrationFreezePlatform.ts";
import * as publicApi from "./executiveOrchestrationPublicIndex.ts";
import {
  ExecutiveOrchestrationPlatformPublicFoundation,
  ExecutiveOrchestrationPublicApiRegistry,
  ExecutiveOrchestrationPublicIndexId,
  ExecutiveOrchestrationPublicIndexName,
  ExecutiveOrchestrationPublicIndexNamespace,
  ExecutiveOrchestrationPublicIndexReadiness,
  ExecutiveOrchestrationPublicIndexStatus,
  ExecutiveOrchestrationPublicIndexVersion,
  getExecutiveOrchestrationPublicApiById,
  getExecutiveOrchestrationPublicApiRegistry,
  getExecutiveOrchestrationPublicFoundation,
  getExecutiveOrchestrationPublicIndexSummary,
} from "./executiveOrchestrationPublicIndex.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationPublicIndex.ts",
  "executiveOrchestrationPublicIndex.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationPlatformPublicFoundation",
  "ExecutiveOrchestrationPublicApiRegistry",
  "ExecutiveOrchestrationPublicIndexId",
  "ExecutiveOrchestrationPublicIndexVersion",
  "ExecutiveOrchestrationPublicIndexName",
  "ExecutiveOrchestrationPublicIndexNamespace",
  "ExecutiveOrchestrationPublicIndexStatus",
  "ExecutiveOrchestrationPublicIndexReadiness",
  "getExecutiveOrchestrationPublicFoundation",
  "getExecutiveOrchestrationPublicApiRegistry",
  "getExecutiveOrchestrationPublicIndexSummary",
  "getExecutiveOrchestrationPublicApiById",
] as const);

const requiredSectionOrder = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "platform",
  "certification",
  "freeze",
  "publicIndex",
] as const);

const sectionOwners = Object.freeze({
  foundation: "ENG-8:1",
  registry: "ENG-8:2",
  model: "ENG-8:3",
  validation: "ENG-8:4",
  manifest: "ENG-8:5",
  platform: "ENG-8:6",
  certification: "ENG-8:7",
  freeze: "ENG-8:8",
  publicIndex: "ENG-8:9",
} as const);

test("exactly two ENG-8:9 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 2);
});

test("publishes exactly twelve approved public exports with no additional exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 12);
});

test("ENG-8:9 consumes only the ENG-8:8 freeze public surface", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const source = readFileSync(join(dir, "executiveOrchestrationPublicIndex.ts"), "utf8");
  const importStatements = source.match(/import\s+(?:type\s+)?[\s\S]*?from\s+["'][^"']+["']/g) ?? [];
  assert.equal(importStatements.length > 0, true);
  assert.equal(
    importStatements.every((statement) =>
      /from\s+["']\.\/executiveOrchestrationFreezePlatform\.ts["']/.test(statement)
    ),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.freeze,
    ExecutiveOrchestrationFreezePlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.certification,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.platform,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.foundation,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform.foundation,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.registry,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform.registry,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.model,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform.model,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.validation,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform.validation,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.manifest,
    ExecutiveOrchestrationFreezePlatform.certifiedPlatform.certifiedPlatform.manifest,
  );
  assert.deepEqual(
    ExecutiveOrchestrationPlatformPublicFoundation.publicIndex.consumedSurfaces,
    { freeze: "executiveOrchestrationFreezePlatform.ts" },
  );
});

test("public foundation contains exactly nine ordered sections", () => {
  assert.deepEqual(
    Object.keys(ExecutiveOrchestrationPlatformPublicFoundation),
    [...requiredSectionOrder],
  );
  assert.equal(requiredSectionOrder.length, 9);
});

test("every section preserves its canonical phase owner", () => {
  const ns = ExecutiveOrchestrationPlatformPublicFoundation;
  assert.equal(ns.publicIndex.owner, sectionOwners.publicIndex);
  assert.equal(ns.freeze.metadata.id, sectionOwners.freeze);
  assert.equal(ns.certification.metadata.id, sectionOwners.certification);
  assert.deepEqual(ns.publicIndex.ownership, {
    foundation: "ENG-8:1",
    registry: "ENG-8:2",
    model: "ENG-8:3",
    validation: "ENG-8:4",
    manifest: "ENG-8:5",
    platform: "ENG-8:6",
    certification: "ENG-8:7",
    freeze: "ENG-8:8",
    publicIndex: "ENG-8:9",
    antiDuplication: {
      eng8OwnsCoordinationOnly: true,
      busOwnsBusinessDomainIntelligence: true,
      opsOwnsOperationalExecutionArchitecture: true,
      advisorOwnsConversationalPresentation: true,
      noDualPhaseApiOwnership: true,
      noArchitecturalResponsibilityDuplication: true,
    },
    metadataOnly: true,
    immutable: true,
  });
  for (const [section, owner] of Object.entries(sectionOwners)) {
    assert.equal(
      ns.publicIndex.ownership[section as keyof typeof ns.publicIndex.ownership],
      owner,
    );
  }
  assert.equal(
    ns.publicIndex.apiRegistry.every(({ phase, section }) =>
      Object.hasOwn(sectionOwners, section)
      && sectionOwners[section as keyof typeof sectionOwners] === phase
    ),
    true,
  );
});

test("release metadata is Released Certified Frozen Stable MetadataOnly ReadyForConsumer", () => {
  const index = ExecutiveOrchestrationPlatformPublicFoundation.publicIndex;
  assert.equal(ExecutiveOrchestrationPublicIndexId, "ENG-8:9");
  assert.equal(ExecutiveOrchestrationPublicIndexVersion, "1.0.0");
  assert.equal(
    ExecutiveOrchestrationPublicIndexName,
    "Executive Orchestration Public Index",
  );
  assert.equal(
    ExecutiveOrchestrationPublicIndexNamespace,
    "nexora.engine.executive.orchestration",
  );
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.status, "Released");
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.stability, "Stable");
  assert.equal(
    ExecutiveOrchestrationPublicIndexStatus.architectureMode,
    "MetadataOnly",
  );
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.runtimeBehavior, "None");
  assert.equal(ExecutiveOrchestrationPublicIndexStatus.immutability, "DeeplyFrozen");
  assert.equal(
    ExecutiveOrchestrationPublicIndexStatus.publicApiStatus,
    "StableAndFrozen",
  );
  assert.equal(ExecutiveOrchestrationPublicIndexReadiness, "ReadyForConsumer");
  assert.equal(index.releaseStatus, "Released");
  assert.equal(index.certificationStatus, "Certified");
  assert.equal(index.freezeStatus, "Frozen");
  assert.equal(index.stability, "Stable");
  assert.equal(index.architectureMode, "MetadataOnly");
  assert.equal(index.runtimeBehavior, "None");
  assert.equal(index.readiness, "ReadyForConsumer");
  assert.equal(index.nextConsumer, "ReadyForNextEngineConsumer");
});

test("public API registry IDs and names are unique with single owning phases", () => {
  assert.equal(ExecutiveOrchestrationPublicApiRegistry.length, 74);
  assert.equal(
    new Set(ExecutiveOrchestrationPublicApiRegistry.map(({ id }) => id)).size,
    74,
  );
  assert.equal(
    new Set(ExecutiveOrchestrationPublicApiRegistry.map(({ name }) => name)).size,
    74,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.every(({ phase }) =>
      typeof phase === "string" && phase.startsWith("ENG-8:")
    ),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.filter(({ phase }) => phase !== "ENG-8:9")
      .length,
    62,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.filter(({ phase }) => phase === "ENG-8:9")
      .length,
    12,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.every(({
      visibility,
      stability,
      metadataOnly,
      runtimeFree,
      deprecated,
      frozen,
      phase,
      status,
    }) =>
      visibility === "Public"
      && stability === "Stable"
      && metadataOnly === true
      && runtimeFree === true
      && deprecated === false
      && (phase === "ENG-8:9"
        ? status === "Released" && frozen === false
        : status === "Stable" && frozen === true)
    ),
    true,
  );
});

test("no internal, runtime, or deprecated APIs appear in the registry", () => {
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.every(({ visibility, deprecated }) =>
      visibility === "Public" && deprecated === false
    ),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.every(({ runtimeFree, name }) =>
      runtimeFree === true
      && !/Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer/i
        .test(name)
    ),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPublicApiRegistry.every(({ name }) =>
      !name.startsWith("_") && !/Internal|Private/i.test(name)
    ),
    true,
  );
});

test("public foundation, registry, and summary are deeply frozen and deterministic", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPlatformPublicFoundation), true);
  assert.equal(
    Object.values(ExecutiveOrchestrationPlatformPublicFoundation).every(Object.isFrozen),
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveOrchestrationPublicApiRegistry), true);
  assert.equal(ExecutiveOrchestrationPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(
    Object.isFrozen(
      ExecutiveOrchestrationPlatformPublicFoundation.publicIndex.consumerImportPolicy,
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(
      ExecutiveOrchestrationPlatformPublicFoundation.publicIndex
        .consumerImportPolicy.prohibitedDirectImports,
    ),
    true,
  );

  const summary = getExecutiveOrchestrationPublicIndexSummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary, getExecutiveOrchestrationPublicIndexSummary());
  assert.equal(summary.phaseCount, 9);
  assert.equal(summary.sectionCount, 9);
  assert.equal(summary.publicApiCount, 74);
  assert.equal(summary.releasedApiCount, 12);
  assert.equal(summary.frozenApiCount, 62);
  assert.equal(summary.certifiedApiCount, 74);
  assert.equal(summary.runtimeApiCount, 0);
  assert.equal(summary.deprecatedApiCount, 0);
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.stability, "Stable");
  assert.equal(summary.readiness, "ReadyForConsumer");
});

test("API lookup helpers and consumer import policy are correct", () => {
  assert.equal(
    getExecutiveOrchestrationPublicFoundation(),
    ExecutiveOrchestrationPlatformPublicFoundation,
  );
  assert.equal(
    getExecutiveOrchestrationPublicApiRegistry(),
    ExecutiveOrchestrationPublicApiRegistry,
  );

  const known = ExecutiveOrchestrationPublicApiRegistry[0];
  assert.equal(getExecutiveOrchestrationPublicApiById(known.id), known);
  assert.equal(
    getExecutiveOrchestrationPublicApiById("ENG-8:9:ExecutiveOrchestrationPublicIndexId"),
    ExecutiveOrchestrationPublicApiRegistry.find(
      ({ id }) => id === "ENG-8:9:ExecutiveOrchestrationPublicIndexId",
    ),
  );
  assert.equal(getExecutiveOrchestrationPublicApiById("unknown-api"), undefined);
  assert.equal(getExecutiveOrchestrationPublicApiById(""), undefined);

  const policy =
    ExecutiveOrchestrationPlatformPublicFoundation.publicIndex.consumerImportPolicy;
  assert.equal(policy.requiredEntryPoint, "executiveOrchestrationPublicIndex.ts");
  assert.deepEqual([...policy.prohibitedDirectImports], [
    "executiveOrchestrationFoundation.ts",
    "executiveOrchestrationRegistryPlatform.ts",
    "executiveOrchestrationModelPlatform.ts",
    "executiveOrchestrationValidationRunner.ts",
    "executiveOrchestrationManifestPlatform.ts",
    "executiveOrchestrationPlatform.ts",
    "executiveOrchestrationCertificationPlatform.ts",
    "executiveOrchestrationFreezePlatform.ts",
  ]);
});

test("no runtime orchestration behavior is introduced in public exports", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer|executeOrchestration/i
        .test(name)
    )),
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.publicIndex.runtimeBehavior,
    "None",
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.publicIndex.metadataOnly,
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.freeze.metadataOnly,
    true,
  );
  assert.equal(
    ExecutiveOrchestrationPlatformPublicFoundation.certification.metadataOnly,
    true,
  );
});
