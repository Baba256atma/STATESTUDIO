import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  CERTIFICATION_GATE_KEYS,
  KNL_CERTIFICATION_PHASE_KEYS,
  KNL_PHASE_CERTIFICATION_TARGETS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PRINCIPLES,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY,
} from "./knowledgePlatformCertificationCatalog.ts";
import {
  KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES,
  KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  KnowledgePlatformCertificationContract,
  getKnowledgePlatformCertificationManifest,
  resolveCertificationProfileExample,
  validateKnowledgePlatformCertification,
} from "./knowledgePlatformCertificationContracts.ts";
import {
  KnowledgePlatformCertificationFacade,
  getKnowledgePlatformCertificationReport,
  resetKnowledgePlatformCertificationPlatformForTests,
  runKnowledgePlatformCertification,
} from "./knowledgePlatformCertification.ts";
import type { CertificationCheck } from "./knowledgePlatformCertificationTypes.ts";
import {
  hasDuplicateGateKeys,
  hasDuplicateProfileIds,
  validateKnowledgePlatformCertificationNamespaceFormat,
  validateKnowledgePlatformCertificationVersionFormat,
  validatePhasePlatformReference,
  validatePhaseVersionReference,
} from "./knowledgePlatformCertificationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgePlatformCertificationPlatformForTests();
});

test("exports KNL/14 knowledge platform certification contract vocabulary", () => {
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "KNL/14");
  assert.equal(KNL_CERTIFICATION_PHASE_KEYS.length, 13);
  assert.equal(CERTIFICATION_GATE_KEYS.length, 22);
});

test("runs knowledge platform certification across KNL/1 through KNL/13", () => {
  const result = runKnowledgePlatformCertification(FIXED_TIME);
  assert.equal(result.success, true, result.reason);
  assert.equal(result.passedPhases, 13);
  assert.equal(result.totalPhases, 13);
  assert.equal(result.passedGates, result.totalGates);
  const report = getKnowledgePlatformCertificationReport();
  assert.ok(report);
  assert.equal(report?.passed, true);
  assert.equal(report?.profiles.length, 13);
  assert.equal(report?.results.every((entry) => entry.passed), true);
});

test("certification report includes all phase profiles gates and checks", () => {
  runKnowledgePlatformCertification(FIXED_TIME);
  const report = getKnowledgePlatformCertificationReport();
  assert.ok(report);
  assert.equal(report?.gates.length, CERTIFICATION_GATE_KEYS.length);
  assert.equal(report?.checks.length, 13 * 4);
  assert.equal(report?.evidence.length, 13);
  for (const target of KNL_PHASE_CERTIFICATION_TARGETS) {
    assert.ok(report?.profiles.some((entry) => entry.phaseKey === target.key));
    assert.ok(report?.results.some((entry) => entry.phaseKey === target.key && entry.passed));
  }
});

test("validates certification version namespace and phase references", () => {
  assert.equal(validateKnowledgePlatformCertificationVersionFormat("KNL/14").valid, true);
  assert.equal(validateKnowledgePlatformCertificationVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgePlatformCertificationNamespaceFormat("knowledge-platform-certification").valid, true);
  assert.equal(validateKnowledgePlatformCertificationNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validatePhasePlatformReference("knl_foundation", "knowledge-platform").valid, true);
  assert.equal(validatePhaseVersionReference("knl_graph", "KNL/4").valid, true);
  assert.equal(hasDuplicateProfileIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateGateKeys(["a", "b", "a"]), true);
});

test("resolves immutable certification contract examples", () => {
  assert.equal(Object.isFrozen(resolveCertificationProfileExample(FIXED_TIME)), true);
  assert.equal(resolveCertificationProfileExample(FIXED_TIME).phaseKey, "knl_foundation");
  assert.equal(resolveCertificationProfileExample(FIXED_TIME).version, "KNL/14");
});

test("builds immutable knowledge platform certification manifest", () => {
  runKnowledgePlatformCertification(FIXED_TIME);
  const manifest = getKnowledgePlatformCertificationManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/14");
  assert.equal(manifest.governanceDependency, "KNL/13");
  assert.equal(manifest.certifiedPhases.length, 13);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge platform certification platform report", () => {
  const report = validateKnowledgePlatformCertification(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.governanceValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.certificationValid, true);
  assert.equal(report.identityValid, true);
});

test("validates KNL/14 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgePlatformCertification.ts",
    allowedFiles: KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES.noRuntimeValidation, true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES.noPlatformFreeze, true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN.includes("platform_freeze"), true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN.includes("runtime_validation"), true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_PRINCIPLES.includes("knl_14_consumes_knl_1_through_knl_13_only"), true);
});

test("exports knowledge platform certification contract bundle", () => {
  assert.equal(KnowledgePlatformCertificationContract.version, "KNL/14");
  assert.equal(typeof KnowledgePlatformCertificationContract.validateKnowledgePlatformCertification, "function");
  assert.equal(typeof KnowledgePlatformCertificationContract.getKnowledgePlatformCertificationManifest, "function");
});

test("KnowledgePlatformCertificationFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgePlatformCertificationFacade.runKnowledgePlatformCertification, "function");
  assert.equal(typeof KnowledgePlatformCertificationFacade.getKnowledgePlatformCertificationManifest, "function");
  assert.equal(typeof KnowledgePlatformCertificationFacade.validateKnowledgePlatformCertification, "function");
  assert.equal(typeof KnowledgePlatformCertificationFacade.getKnowledgePlatformCertificationReport, "function");
  assert.equal(KnowledgePlatformCertificationFacade.version, "KNL/14");
});

test("public API registry includes required certification exports", () => {
  assert.ok(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY.includes("runKnowledgePlatformCertification"));
  assert.ok(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY.includes("getKnowledgePlatformCertificationManifest"));
  assert.ok(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY.includes("validateKnowledgePlatformCertification"));
  assert.ok(KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY.includes("getKnowledgePlatformCertificationReport"));
});

test("future phase registry reserves platform freeze without implementation", () => {
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS.includes("platform_freeze"), true);
  assert.equal(KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS.includes("knowledge_platform_integration"), true);
});

test("certification gates include dependency chain and boundary validation", () => {
  runKnowledgePlatformCertification(FIXED_TIME);
  const report = getKnowledgePlatformCertificationReport();
  assert.ok(report);
  const dependencyGate = report?.gates.find((entry) => entry.gateKey === "O_dependency_chain");
  const boundaryGate = report?.gates.find((entry) => entry.gateKey === "Q_boundary_rules");
  const readinessGate = report?.gates.find((entry) => entry.gateKey === "Z_platform_readiness");
  assert.equal(dependencyGate?.passed, true);
  assert.equal(boundaryGate?.passed, true);
  assert.equal(readinessGate?.passed, true);
});

test("certification scope covers all KNL platform phases", () => {
  runKnowledgePlatformCertification(FIXED_TIME);
  const required = ["knl_foundation", "knl_graph", "knl_retrieval", "knl_governance"] as const;
  const report = getKnowledgePlatformCertificationReport();
  for (const key of required) {
    const result = report?.results.find((entry) => entry.phaseKey === key);
    assert.ok(result);
    assert.equal(result?.passed, true);
  }
});

test("getKnowledgePlatformCertificationReport returns last certification run", () => {
  assert.equal(getKnowledgePlatformCertificationReport(), null);
  runKnowledgePlatformCertification(FIXED_TIME);
  const report = getKnowledgePlatformCertificationReport();
  assert.ok(report);
  assert.equal(report?.contractVersion, "KNL/14");
  assert.equal(report?.totalPhases, 13);
});

test("certification checks validate manifest public api and boundary per phase", () => {
  runKnowledgePlatformCertification(FIXED_TIME);
  const report = getKnowledgePlatformCertificationReport();
  assert.ok(report);
  const checks: readonly CertificationCheck[] = report.checks;
  for (const target of KNL_PHASE_CERTIFICATION_TARGETS) {
    const phaseChecks = checks.filter((entry) => entry.phaseKey === target.key);
    const manifestCheck = phaseChecks.find((entry) => entry.checkType === "manifest");
    const apiCheck = phaseChecks.find((entry) => entry.checkType === "public_api");
    const boundaryCheck = phaseChecks.find((entry) => entry.checkType === "boundary");
    assert.equal(manifestCheck?.passed, true, `${target.key} manifest`);
    assert.equal(apiCheck?.passed, true, `${target.key} public api`);
    assert.equal(boundaryCheck?.passed, true, `${target.key} boundary`);
  }
});

test("platform readiness gate requires all phases certified", () => {
  const result = runKnowledgePlatformCertification(FIXED_TIME);
  assert.equal(result.passedPhases, 13);
  const report = getKnowledgePlatformCertificationReport();
  const readiness = report?.gates.find((entry) => entry.gateKey === "Z_platform_readiness");
  assert.equal(readiness?.passed, true);
  assert.match(readiness?.evidence ?? "", /13\/13/);
});
