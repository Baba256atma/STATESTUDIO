import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ExecutiveDecisionCertificationPlatform } from "./executiveDecisionCertificationPlatform.ts";
import { ExecutiveDecisionFreezePlatform } from "./executiveDecisionFreezePlatform.ts";
import { ExecutiveDecisionManifestPlatform } from "./executiveDecisionManifestPlatform.ts";
import { ExecutiveDecisionModelPlatform } from "./executiveDecisionModelPlatform.ts";
import { ExecutiveDecisionPlatform } from "./executiveDecisionPlatform.ts";
import { ExecutiveDecisionFoundation } from "./executiveDecisionPublicApi.ts";
import * as publicApi from "./executiveDecisionPublicIndex.ts";
import {
  ExecutiveDecisionPlatformPublicFoundation,
  ExecutiveDecisionPublicApiRegistry,
  ExecutiveDecisionPublicIndexDescription,
  ExecutiveDecisionPublicIndexId,
  ExecutiveDecisionPublicIndexName,
  ExecutiveDecisionPublicIndexNamespace,
  ExecutiveDecisionPublicIndexStatus,
  ExecutiveDecisionPublicIndexVersion,
  getExecutiveDecisionPublicApiRegistry,
  getExecutiveDecisionPublicFoundation,
  getExecutiveDecisionPublicMetadata,
  getExecutiveDecisionReleaseSummary,
} from "./executiveDecisionPublicIndex.ts";
import { ExecutiveDecisionRegistryPlatform } from "./executiveDecisionRegistryPlatform.ts";
import { ExecutiveDecisionValidationPlatform } from "./executiveDecisionValidationPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveDecisionPublicIndex.ts",
  "executiveDecisionPublicIndex.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveDecisionPlatformPublicFoundation",
  "ExecutiveDecisionPublicApiRegistry",
  "ExecutiveDecisionPublicIndexId",
  "ExecutiveDecisionPublicIndexVersion",
  "ExecutiveDecisionPublicIndexName",
  "ExecutiveDecisionPublicIndexDescription",
  "ExecutiveDecisionPublicIndexNamespace",
  "ExecutiveDecisionPublicIndexStatus",
  "getExecutiveDecisionPublicFoundation",
  "getExecutiveDecisionPublicMetadata",
  "getExecutiveDecisionPublicApiRegistry",
  "getExecutiveDecisionReleaseSummary",
] as const);

const approvedImports = Object.freeze([
  "executiveDecisionPublicApi.ts",
  "executiveDecisionRegistryPlatform.ts",
  "executiveDecisionModelPlatform.ts",
  "executiveDecisionValidationPlatform.ts",
  "executiveDecisionManifestPlatform.ts",
  "executiveDecisionPlatform.ts",
  "executiveDecisionCertificationPlatform.ts",
  "executiveDecisionFreezePlatform.ts",
] as const);

test("exactly two ENG-7:9 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 2);
});

test("publishes exactly twelve approved public exports with exact names", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 12);
  for (const name of approvedExports) {
    assert.ok(Object.hasOwn(publicApi, name));
  }
});

test("public namespace contains exactly nine ordered deeply frozen sections", () => {
  assert.deepEqual(Object.keys(ExecutiveDecisionPlatformPublicFoundation), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
    "publicIndex",
  ]);
  assert.equal(Object.isFrozen(ExecutiveDecisionPlatformPublicFoundation), true);
  assert.equal(
    Object.values(ExecutiveDecisionPlatformPublicFoundation).every(Object.isFrozen),
    true,
  );
});

test("every section references its originating approved public surface", () => {
  const ns = ExecutiveDecisionPlatformPublicFoundation;
  assert.equal(ns.foundation, ExecutiveDecisionFoundation);
  assert.equal(ns.registry, ExecutiveDecisionRegistryPlatform);
  assert.equal(ns.model, ExecutiveDecisionModelPlatform);
  assert.equal(ns.validation, ExecutiveDecisionValidationPlatform);
  assert.equal(ns.manifest, ExecutiveDecisionManifestPlatform);
  assert.equal(ns.platform, ExecutiveDecisionPlatform);
  assert.equal(ns.certification, ExecutiveDecisionCertificationPlatform);
  assert.equal(ns.freeze, ExecutiveDecisionFreezePlatform);
  assert.equal(ns.publicIndex.apiRegistry, ExecutiveDecisionPublicApiRegistry);
  assert.equal(ns.publicIndex.sectionCount, 9);
  assert.equal(ns.publicIndex.publicApiCount, 67);
  assert.equal(ns.publicIndex.releaseStatus, "Released");
  assert.equal(ns.publicIndex.compatibilityStatus, "Compatible");
  assert.equal(ns.publicIndex.certificationStatus, "Certified");
  assert.equal(ns.publicIndex.freezeStatus, "Frozen");
});

test("public metadata reports Released Certified Frozen StableAndFrozen", () => {
  const metadata = getExecutiveDecisionPublicMetadata();
  assert.equal(ExecutiveDecisionPublicIndexId, "ENG-7:9");
  assert.equal(ExecutiveDecisionPublicIndexVersion, "1.0.0");
  assert.equal(ExecutiveDecisionPublicIndexName, "Executive Decision Public Index");
  assert.equal(
    ExecutiveDecisionPublicIndexDescription,
    "Canonical immutable public release surface for the Nexora Executive Decision Engine.",
  );
  assert.equal(
    ExecutiveDecisionPublicIndexNamespace,
    "Nexora.Engine.ExecutiveDecision.Public",
  );
  assert.equal(ExecutiveDecisionPublicIndexStatus.status, "Released");
  assert.equal(ExecutiveDecisionPublicIndexStatus.certified, "Certified");
  assert.equal(ExecutiveDecisionPublicIndexStatus.frozen, "Frozen");
  assert.equal(ExecutiveDecisionPublicIndexStatus.stableAndFrozen, "StableAndFrozen");
  assert.equal(ExecutiveDecisionPublicIndexStatus.readyForENG8, "ReadyForENG8");
  assert.equal(ExecutiveDecisionPublicIndexStatus.readyForAdvisor, "ReadyForAdvisor");
  assert.equal(metadata.id, "ENG-7:9");
  assert.equal(metadata.status, "Released");
  assert.equal(metadata.certificationStatus, "Certified");
  assert.equal(metadata.freezeStatus, "Frozen");
  assert.equal(metadata.publicApiStatus, "StableAndFrozen");
  assert.equal(metadata.releaseStatus, "Released");
  assert.equal(metadata.architectureMode, "MetadataOnly");
  assert.equal(metadata.immutability, "DeeplyFrozen");
  assert.equal(metadata.runtimeBehavior, "None");
  assert.equal(metadata.owner, "ENG-7");
  assert.equal(metadata.previousPhase, "ENG-7:8");
  assert.equal(metadata.currentPhase, "ENG-7:9");
  assert.equal(metadata.nextConsumer, "ENG-8");
  assert.equal(metadata.readyForOrchestration, true);
  assert.equal(metadata.readyForAdvisorConsumption, true);
  assert.equal(metadata.readyForSuiteAggregation, true);
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(ExecutiveDecisionPublicIndexStatus), true);
});

test("public API registry contains exactly sixty-seven unique frozen entries", () => {
  assert.equal(ExecutiveDecisionPublicApiRegistry.length, 67);
  assert.equal(Object.isFrozen(ExecutiveDecisionPublicApiRegistry), true);
  assert.equal(ExecutiveDecisionPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(
    new Set(ExecutiveDecisionPublicApiRegistry.map(({ apiId }) => apiId)).size,
    67,
  );
  assert.equal(
    new Set(ExecutiveDecisionPublicApiRegistry.map(({ exportName }) => exportName)).size,
    67,
  );
  assert.equal(
    ExecutiveDecisionPublicApiRegistry.filter(({ owningPhase }) => owningPhase !== "ENG-7:9")
      .length,
    55,
  );
  assert.equal(
    ExecutiveDecisionPublicApiRegistry.filter(({ owningPhase }) => owningPhase === "ENG-7:9")
      .length,
    12,
  );
  assert.equal(
    ExecutiveDecisionPublicApiRegistry.every(({
      metadataOnly,
      freezeState,
      owningPhase,
      publicConsumer,
    }) =>
      metadataOnly
      && freezeState === "Frozen"
      && typeof owningPhase === "string"
      && publicConsumer === true
    ),
    true,
  );
});

test("release summary values are exact declared release metadata", () => {
  const summary = getExecutiveDecisionReleaseSummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.phase, "ENG-7:9");
  assert.equal(summary.platform, "Executive Decision Engine");
  assert.equal(summary.status, "Released");
  assert.equal(summary.sections, 9);
  assert.equal(summary.completedPhases, 9);
  assert.equal(summary.priorCompletedPhases, 8);
  assert.equal(summary.representedPriorFiles, 62);
  assert.equal(summary.publicIndexFiles, 2);
  assert.equal(summary.totalRepresentedFiles, 64);
  assert.equal(summary.priorApprovedPublicApis, 55);
  assert.equal(summary.publicIndexApprovedPublicApis, 12);
  assert.equal(summary.totalApprovedPublicApis, 67);
  assert.equal(summary.foundationCapabilities, 8);
  assert.equal(summary.decisionDomains, 12);
  assert.equal(summary.decisionTypes, 16);
  assert.equal(summary.decisionCapabilities, 8);
  assert.equal(summary.decisionOutputs, 8);
  assert.equal(summary.lifecycleStates, 8);
  assert.equal(summary.canonicalModels, 10);
  assert.equal(summary.validationRules, 32);
  assert.equal(summary.validationPassing, 32);
  assert.equal(summary.validationFailing, 0);
  assert.equal(summary.certificationGates, 15);
  assert.equal(summary.certificationPassing, 15);
  assert.equal(summary.regressionDeclarations, 10);
  assert.equal(summary.regressionPassing, 10);
  assert.equal(summary.frozenComponents, 7);
  assert.equal(summary.compatibilityDeclarations, 10);
  assert.equal(summary.extensionLocks, 6);
  assert.equal(summary.blockingViolations, 0);
  assert.equal(summary.validationCertified, true);
  assert.equal(summary.manifestComplete, true);
  assert.equal(summary.platformAssembled, true);
  assert.equal(summary.certified, true);
  assert.equal(summary.frozen, true);
  assert.equal(summary.stable, true);
  assert.equal(summary.released, true);
  assert.equal(summary.readyForENG8, true);
  assert.equal(summary.readyForAdvisor, true);
});

test("helpers are deterministic and only approved phase surfaces are imported", () => {
  assert.equal(getExecutiveDecisionPublicFoundation(), ExecutiveDecisionPlatformPublicFoundation);
  assert.equal(getExecutiveDecisionPublicApiRegistry(), ExecutiveDecisionPublicApiRegistry);
  assert.equal(getExecutiveDecisionPublicMetadata(), getExecutiveDecisionPublicMetadata());
  assert.equal(getExecutiveDecisionReleaseSummary(), getExecutiveDecisionReleaseSummary());

  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "executiveDecisionPublicIndex.ts"),
    "utf8",
  );
  for (const approved of approvedImports) {
    assert.equal(source.includes(approved), true);
  }
  assert.equal(source.includes("executiveDecisionFoundation.ts"), false);
  assert.equal(source.includes("executiveDecisionDomainRegistry.ts"), false);
  assert.equal(source.includes("executiveDecisionCoreModel.ts"), false);
  assert.equal(source.includes("executiveDecisionFoundationValidation.ts"), false);
  assert.equal(source.includes("executiveDecisionPhaseManifest.ts"), false);
  assert.equal(source.includes("executiveDecisionPlatformTypes.ts"), false);
  assert.equal(source.includes("executiveDecisionCertificationTypes.ts"), false);
  assert.equal(source.includes("executiveDecisionFreezeTypes.ts"), false);
  assert.equal(source.includes("executiveDecisionFreezeRegistry.ts"), false);
  assert.equal(source.includes("executiveDecisionCertificationGateRegistry.ts"), false);
  assert.equal(/from ["'].*\/(bus|ops|scene|eve|ui|persistence|database)/i.test(source), false);
  assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Scorer|Selector|Ranker|Executor|LLM|OpenAI|Query|Reflect|Runner|Calculator|Processor|Orchestrat/i
        .test(name)
    )),
    true,
  );
  assert.equal(
    ExecutiveDecisionPlatformPublicFoundation.publicIndex.compatibility.noInternalSurfaceExposure,
    "Protected",
  );
});
