import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import * as publicApi from "./executiveContextAssemblyCertification.ts";
import {
  ExecutiveContextAssemblyCertification,
  ExecutiveContextAssemblyCertificationCompatibility,
  ExecutiveContextAssemblyCertificationEvidence,
  ExecutiveContextAssemblyCertificationGates,
  ExecutiveContextAssemblyCertificationMetadata,
  ExecutiveContextAssemblyCertificationRegression,
  getExecutiveContextAssemblyCertification,
  getExecutiveContextAssemblyCertificationCompatibility,
  getExecutiveContextAssemblyCertificationCompatibilityById,
  getExecutiveContextAssemblyCertificationEvidence,
  getExecutiveContextAssemblyCertificationEvidenceById,
  getExecutiveContextAssemblyCertificationGateById,
  getExecutiveContextAssemblyCertificationGates,
  getExecutiveContextAssemblyCertificationMetadata,
  getExecutiveContextAssemblyCertificationRegression,
  getExecutiveContextAssemblyCertificationRegressionById,
  getExecutiveContextAssemblyCertificationSummary,
} from "./executiveContextAssemblyCertification.ts";
import { ExecutiveContextAssemblyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyModel, ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextAssemblyPlatform } from "./executiveContextAssemblyPlatform.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";

test("all required certification gates exist, are unique, and pass", () => {
  assert.equal(ExecutiveContextAssemblyCertificationGates.length >= 20, true);
  assert.equal(ExecutiveContextAssemblyCertificationGates.length, 20);
  assert.equal(new Set(ExecutiveContextAssemblyCertificationGates.map(({ gateId }) => gateId)).size, 20);
  assert.equal(ExecutiveContextAssemblyCertificationGates.every(({ status, runtimeFree }) => status === "Pass" && runtimeFree === true), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyCertificationGates), true);
});

test("certification result is Certified and metadata counts match collections", () => {
  assert.equal(ExecutiveContextAssemblyCertification.result.status, "Certified");
  assert.equal(ExecutiveContextAssemblyCertification.result.freezeReadiness, "ReadyForFreeze");
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.certificationResult, "Certified");
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.status.readyForFreeze, "ReadyForFreeze");
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.gateCount, ExecutiveContextAssemblyCertification.gates.length);
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.evidenceCount, ExecutiveContextAssemblyCertification.evidence.length);
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.compatibilityCount, ExecutiveContextAssemblyCertification.compatibility.length);
  assert.equal(ExecutiveContextAssemblyCertificationMetadata.regressionCount, ExecutiveContextAssemblyCertification.regression.length);
  assert.equal(getExecutiveContextAssemblyCertificationSummary().passedGateCount, 20);
  assert.equal(getExecutiveContextAssemblyCertificationSummary().guaranteeCount, 19);
});

test("evidence, compatibility, and regression IDs are unique and frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyCertification), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyCertificationEvidence), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyCertificationCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyCertificationRegression), true);
  assert.equal(new Set(ExecutiveContextAssemblyCertificationEvidence.map(({ evidenceId }) => evidenceId)).size, ExecutiveContextAssemblyCertificationEvidence.length);
  assert.equal(new Set(ExecutiveContextAssemblyCertificationCompatibility.map(({ id }) => id)).size, ExecutiveContextAssemblyCertificationCompatibility.length);
  assert.equal(new Set(ExecutiveContextAssemblyCertificationRegression.map(({ id }) => id)).size, ExecutiveContextAssemblyCertificationRegression.length);
  assert.equal(ExecutiveContextAssemblyCertificationEvidence.length, 12);
  assert.equal(ExecutiveContextAssemblyCertificationCompatibility.length, 11);
  assert.equal(ExecutiveContextAssemblyCertificationRegression.length, 12);
  assert.equal(ExecutiveContextAssemblyCertificationRegression.every(({ status }) => status === "Pass"), true);
  assert.equal(ExecutiveContextAssemblyCertificationEvidence.every(({ inspectionProhibited }) => inspectionProhibited === true), true);
});

test("ENG-1 relocation and ENG-4 specialized ownership remain certified", () => {
  const relocation = getExecutiveContextAssemblyCertificationCompatibilityById("eng-4-cert-compat-eng-1-model-relocation");
  assert.ok(relocation);
  assert.equal(relocation.status, "ApprovedCompatibility");
  assert.match(relocation.classification, /ApprovedCompatibility/);
  assert.match(relocation.classification, /OwnershipPreserved/);
  assert.match(relocation.classification, /PublicSurfaceStable/);
  assert.match(relocation.classification, /NoDuplication/);
  assert.equal(EngineExecutiveContextModel.id, "executive-context");
  assert.equal(AssemblyExecutiveContextModel.id, "eng-4-model-executive-context");
  assert.notEqual(AssemblyExecutiveContextModel.id, EngineExecutiveContextModel.id);
  assert.equal(AssemblyExecutiveContextModel.phase, "ENG-4:3");
});

test("ENG-4:1 through ENG-4:6 surfaces and inventory counts remain represented", () => {
  assert.equal(ExecutiveContextAssemblyCertification.platform, ExecutiveContextAssemblyPlatform);
  assert.deepEqual(
    Object.keys(ExecutiveContextAssemblyPlatform).filter((key) => !["metadataOnly", "immutable", "deterministic"].includes(key)),
    ["foundation", "registry", "model", "validation", "manifest", "platform"],
  );
  assert.equal(ExecutiveContextAssemblyPlatform.platform.components.length, 5);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.contextDomains, 22);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.contextSources, 8);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.capabilities, 10);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.lifecycleStages, 8);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.validationGroups, 5);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.validationRules, 43);
  assert.equal(ExecutiveContextAssemblyManifest.inventories.validationGates, 12);
  assert.equal(ExecutiveContextAssemblyValidation.validationGroups.length, 5);
  assert.equal(ExecutiveContextAssemblyValidation.validationRules.length, 43);
  assert.equal(ExecutiveContextAssemblyValidation.validationGates.length, 12);
  assert.equal(ExecutiveContextAssemblyModel.modelRegistry.length, 5);
});

test("dependencies stay public-only and exclude future freeze imports", () => {
  assert.equal(ExecutiveContextAssemblyCertification.dependencies.every(({ direction, consumption, reverseDependency, circularDependency, futurePhaseDependency }) => (
    direction === "ForwardOnly" && consumption === "PublicIndexOnly" && !reverseDependency && !circularDependency && !futurePhaseDependency
  )), true);
  assert.equal(ExecutiveContextAssemblyCertification.dependencies.every(({ target }) => !String(target).startsWith("ENG-4:8")), true);
  assert.equal(ExecutiveContextAssemblyCertification.dependencies.some(({ source, target }) => source === "ENG-4:7" && target === "ENG-4:6"), true);
});

test("helpers are deterministic and unknown IDs return undefined", () => {
  assert.equal(getExecutiveContextAssemblyCertification(), ExecutiveContextAssemblyCertification);
  assert.equal(getExecutiveContextAssemblyCertificationMetadata(), ExecutiveContextAssemblyCertificationMetadata);
  assert.equal(getExecutiveContextAssemblyCertificationGates(), ExecutiveContextAssemblyCertificationGates);
  assert.equal(getExecutiveContextAssemblyCertificationEvidence(), ExecutiveContextAssemblyCertificationEvidence);
  assert.equal(getExecutiveContextAssemblyCertificationCompatibility(), ExecutiveContextAssemblyCertificationCompatibility);
  assert.equal(getExecutiveContextAssemblyCertificationRegression(), ExecutiveContextAssemblyCertificationRegression);
  assert.equal(getExecutiveContextAssemblyCertificationSummary(), ExecutiveContextAssemblyCertification.summary);
  assert.equal(getExecutiveContextAssemblyCertificationGateById("eng-4-cert-gate-ready-for-freeze")?.status, "Pass");
  assert.equal(getExecutiveContextAssemblyCertificationGateById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyCertificationEvidenceById("eng-4-cert-evidence-platform")?.declaredCount, 5);
  assert.equal(getExecutiveContextAssemblyCertificationEvidenceById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyCertificationCompatibilityById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyCertificationRegressionById("eng-4-cert-regression-validation-counts")?.status, "Pass");
  assert.equal(getExecutiveContextAssemblyCertificationRegressionById("missing"), undefined);
});

test("public certification surface exposes approved metadata APIs with no runtime leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyCertification", "ExecutiveContextAssemblyCertificationCompatibility",
    "ExecutiveContextAssemblyCertificationEvidence", "ExecutiveContextAssemblyCertificationGates",
    "ExecutiveContextAssemblyCertificationMetadata", "ExecutiveContextAssemblyCertificationRegression",
    "getExecutiveContextAssemblyCertification", "getExecutiveContextAssemblyCertificationCompatibility",
    "getExecutiveContextAssemblyCertificationCompatibilityById", "getExecutiveContextAssemblyCertificationEvidence",
    "getExecutiveContextAssemblyCertificationEvidenceById", "getExecutiveContextAssemblyCertificationGateById",
    "getExecutiveContextAssemblyCertificationGates", "getExecutiveContextAssemblyCertificationMetadata",
    "getExecutiveContextAssemblyCertificationRegression", "getExecutiveContextAssemblyCertificationRegressionById",
    "getExecutiveContextAssemblyCertificationSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Query|Planner|Freeze|PublicIndex|Filesystem|Reflect/i.test(name)), true);
  assert.equal(ExecutiveContextAssemblyCertification.metadataOnly, true);
});
