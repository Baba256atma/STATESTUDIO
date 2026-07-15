import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextAssemblyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyModel, ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import * as publicApi from "./executiveContextAssemblyPlatform.ts";
import {
  ExecutiveContextAssemblyPlatform,
  ExecutiveContextAssemblyPlatformCompatibility,
  ExecutiveContextAssemblyPlatformComponents,
  ExecutiveContextAssemblyPlatformMetadata,
  ExecutiveContextAssemblyPlatformReadiness,
  getExecutiveContextAssemblyPlatform,
  getExecutiveContextAssemblyPlatformCompatibility,
  getExecutiveContextAssemblyPlatformCompatibilityById,
  getExecutiveContextAssemblyPlatformComponentById,
  getExecutiveContextAssemblyPlatformComponents,
  getExecutiveContextAssemblyPlatformMetadata,
  getExecutiveContextAssemblyPlatformReadiness,
  getExecutiveContextAssemblyPlatformReadinessGateById,
  getExecutiveContextAssemblyPlatformSummary,
} from "./executiveContextAssemblyPlatform.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";

test("platform aggregate has exactly six ordered primary sections and is frozen", () => {
  assert.deepEqual(
    Object.keys(ExecutiveContextAssemblyPlatform).filter((key) => !["metadataOnly", "immutable", "deterministic"].includes(key)),
    ["foundation", "registry", "model", "validation", "manifest", "platform"],
  );
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatform), true);
  assert.equal(Object.values(ExecutiveContextAssemblyPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatform.platform), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatformComponents), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatformReadiness), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatformCompatibility), true);
});

test("exactly five canonical components reference approved prior phases", () => {
  assert.equal(ExecutiveContextAssemblyPlatformComponents.length, 5);
  assert.deepEqual(ExecutiveContextAssemblyPlatformComponents.map(({ phase }) => phase), [
    "ENG-4:1", "ENG-4:2", "ENG-4:3", "ENG-4:4", "ENG-4:5",
  ]);
  assert.equal(new Set(ExecutiveContextAssemblyPlatformComponents.map(({ componentId }) => componentId)).size, 5);
  assert.deepEqual(ExecutiveContextAssemblyPlatformComponents.map(({ publicSurface }) => publicSurface), [
    "executiveContextAssemblyFoundation.ts",
    "executiveContextAssemblyRegistry.ts",
    "executiveContextAssemblyModel.ts",
    "executiveContextAssemblyValidation.ts",
    "executiveContextAssemblyManifest.ts",
  ]);
  assert.equal(ExecutiveContextAssemblyPlatform.foundation, ExecutiveContextAssemblyFoundation);
  assert.equal(ExecutiveContextAssemblyPlatform.registry, ExecutiveContextAssemblyRegistry);
  assert.equal(ExecutiveContextAssemblyPlatform.model, ExecutiveContextAssemblyModel);
  assert.equal(ExecutiveContextAssemblyPlatform.validation, ExecutiveContextAssemblyValidation);
  assert.equal(ExecutiveContextAssemblyPlatform.manifest, ExecutiveContextAssemblyManifest);
});

test("platform metadata counts match actual collections", () => {
  const { platform } = ExecutiveContextAssemblyPlatform;
  assert.equal(platform.metadata, ExecutiveContextAssemblyPlatformMetadata);
  assert.equal(platform.metadata.componentCount, platform.components.length);
  assert.equal(platform.metadata.sectionCount, 6);
  assert.equal(platform.metadata.dependencyCount, platform.dependencies.length);
  assert.equal(platform.metadata.compatibilityCount, platform.compatibility.length);
  assert.equal(platform.metadata.guaranteeCount, platform.guarantees.length);
  assert.equal(platform.metadata.readinessGateCount, platform.readiness.length);
  assert.equal(platform.metadata.status.readyForCertification, "ReadyForCertification");
  assert.equal(platform.metadata.status.manifestComplete, "ManifestComplete");
  assert.equal(platform.summary.componentCount, 5);
  assert.equal(platform.summary.status, "ReadyForCertification");
});

test("all readiness gates pass and guarantees are complete", () => {
  assert.equal(ExecutiveContextAssemblyPlatformReadiness.length, 16);
  assert.equal(ExecutiveContextAssemblyPlatformReadiness.every(({ status }) => status === "Pass" || status === "Ready"), true);
  assert.equal(ExecutiveContextAssemblyPlatformReadiness.at(-1)?.status, "Ready");
  assert.equal(ExecutiveContextAssemblyPlatform.platform.guarantees.length, 16);
  assert.equal(ExecutiveContextAssemblyPlatform.platform.guarantees.every(({ status }) => status === "Guaranteed"), true);
});

test("compatibility is unique and ENG-1 relocation remains approved", () => {
  assert.equal(new Set(ExecutiveContextAssemblyPlatformCompatibility.map(({ id }) => id)).size, ExecutiveContextAssemblyPlatformCompatibility.length);
  const relocation = getExecutiveContextAssemblyPlatformCompatibilityById("eng-4-platform-compat-eng-1-model-relocation");
  assert.ok(relocation);
  assert.equal(relocation.status, "ApprovedCompatibility");
  assert.match(relocation.classification, /ApprovedCompatibility/);
  assert.match(relocation.classification, /OwnershipPreserved/);
  assert.match(relocation.classification, /PublicSurfaceStable/);
  assert.match(relocation.classification, /NoDuplication/);
  assert.equal(EngineExecutiveContextModel.id, "executive-context");
  assert.equal(AssemblyExecutiveContextModel.id, "eng-4-model-executive-context");
  assert.notEqual(AssemblyExecutiveContextModel.id, EngineExecutiveContextModel.id);
  assert.equal(ExecutiveContextAssemblyPlatform.platform.ownership.some(({ artifact, owner }) => artifact === "executiveContextModel.ts" && owner === "ENG-4"), true);
  assert.equal(ExecutiveContextAssemblyPlatform.platform.ownership.some(({ artifact, owner }) => artifact === "Executive Engine model registry" && owner === "ENG-1"), true);
});

test("dependencies remain public-only, forward-only, and free of future or cyclic edges", () => {
  const { dependencies } = ExecutiveContextAssemblyPlatform.platform;
  assert.equal(dependencies.every(({ direction, consumption, reverseDependency, circularDependency, futurePhaseDependency }) => (
    direction === "ForwardOnly" && consumption === "PublicIndexOnly" && !reverseDependency && !circularDependency && !futurePhaseDependency
  )), true);
  assert.equal(dependencies.every(({ target }) => !String(target).startsWith("ENG-4:7")), true);
  assert.equal(dependencies, ExecutiveContextAssemblyManifest.dependencies);
});

test("helpers are deterministic and unknown IDs return undefined", () => {
  assert.equal(getExecutiveContextAssemblyPlatform(), ExecutiveContextAssemblyPlatform);
  assert.equal(getExecutiveContextAssemblyPlatformMetadata(), ExecutiveContextAssemblyPlatformMetadata);
  assert.equal(getExecutiveContextAssemblyPlatformComponents(), ExecutiveContextAssemblyPlatformComponents);
  assert.equal(getExecutiveContextAssemblyPlatformCompatibility(), ExecutiveContextAssemblyPlatformCompatibility);
  assert.equal(getExecutiveContextAssemblyPlatformReadiness(), ExecutiveContextAssemblyPlatformReadiness);
  assert.equal(getExecutiveContextAssemblyPlatformSummary(), ExecutiveContextAssemblyPlatform.platform.summary);
  assert.equal(getExecutiveContextAssemblyPlatformComponentById("eng-4-platform-component-model")?.phase, "ENG-4:3");
  assert.equal(getExecutiveContextAssemblyPlatformComponentById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyPlatformReadinessGateById("eng-4-platform-readiness-ready-for-certification")?.status, "Ready");
  assert.equal(getExecutiveContextAssemblyPlatformReadinessGateById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyPlatformCompatibilityById("missing"), undefined);
});

test("manifest counts remain unchanged and no runtime behavior is exposed", () => {
  assert.equal(ExecutiveContextAssemblyManifest.inventories.validationRules, 43);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.validationGates, 12);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.contextDomains, 22);
  assert.equal(ExecutiveContextAssemblyManifest.summary.status, "ReadyForPlatform");
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Query|Planner|Advisor|Certification|Freeze|PublicIndex/i.test(name)), true);
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyPlatform", "ExecutiveContextAssemblyPlatformCompatibility",
    "ExecutiveContextAssemblyPlatformComponents", "ExecutiveContextAssemblyPlatformGuarantees",
    "ExecutiveContextAssemblyPlatformMetadata", "ExecutiveContextAssemblyPlatformReadiness",
    "getExecutiveContextAssemblyPlatform", "getExecutiveContextAssemblyPlatformCompatibility",
    "getExecutiveContextAssemblyPlatformCompatibilityById", "getExecutiveContextAssemblyPlatformComponentById",
    "getExecutiveContextAssemblyPlatformComponents", "getExecutiveContextAssemblyPlatformMetadata",
    "getExecutiveContextAssemblyPlatformReadiness", "getExecutiveContextAssemblyPlatformReadinessGateById",
    "getExecutiveContextAssemblyPlatformSummary",
  ].sort());
});
