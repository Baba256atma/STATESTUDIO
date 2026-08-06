import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as bindingPublicIndex from "./nexoraObjectDirectorSceneBindingPublicIndex.ts";
import * as foundation from "./nexoraObjectDirectorSceneCompositionFoundation.ts";
import * as contracts from "./nexoraObjectDirectorSceneCompositionContracts.ts";
import * as validation from "./nexoraObjectDirectorSceneCompositionValidation.ts";
import * as certification from "./nexoraObjectDirectorSceneCompositionCertification.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productionPath = resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionCertification.ts");
const source = readFileSync(productionPath, "utf8");

function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}

function deepFreeze<T>(value: T, visited: object[] = []): T {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return value;
  visited.push(value as object);
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child, visited);
  return Object.freeze(value);
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

function minimalComposition() {
  return {
    identity: { compositionId: "composition-certification", kind: "scene", version: "1.0.0" },
    metadata: { title: "Certification", description: null, tags: [], source: null, createdBy: "director" },
    state: "empty", mode: "global",
    ownership: { owner: "director", sourceId: null, delegated: false },
    layers: [], relationships: [], annotations: [],
    focus: { activeUnitId: null, activeGroupId: null, activeLayerId: null, role: "none", reason: null },
    bindingCompatibility: clone(contracts.sceneCompositionBindingCompatibilityContract),
  };
}

function cleanValidation(): validation.SceneCompositionValidationResult {
  return validation.validateNexoraObjectDirectorSceneComposition(minimalComposition());
}

function completeEvidence(result = cleanValidation()): certification.SceneCompositionCertificationEvidence {
  return {
    validationResult: result, repeatedValidationResult: result,
    referenceIntegrityConfirmed: true, orderingIntegrityConfirmed: true, focusIntegrityConfirmed: true,
    placementIntegrityConfirmed: true, relationshipIntegrityConfirmed: true, annotationIntegrityConfirmed: true,
    inputWasMutated: false, inputWasFrozenByValidation: false, invalidInputHandledWithoutThrow: true,
    dependencyBoundaryConfirmed: true, registryCompatibilityConfirmed: true, bindingCompatibilityConfirmed: true,
    publicTerminologyConfirmed: true, plainDataBoundaryConfirmed: true, forbiddenBehaviorAbsent: true,
    notes: ["Supplied certification evidence"],
  };
}

function certify(evidence = completeEvidence()) {
  return certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate-1", evidence });
}

describe("NOL-7:4 Director Scene Composition Certification", () => {
  it("creates exactly the two requested NOL-7:4 files", () => {
    expect(readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionCertification")).sort()).toEqual([
      "nexoraObjectDirectorSceneCompositionCertification.test.ts", "nexoraObjectDirectorSceneCompositionCertification.ts",
    ]);
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });

  it("publishes the exact identity, lifecycle status, and canonical taxonomies", () => {
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationId).toBe("NOL-7:4/NexoraObjectDirectorSceneCompositionCertification");
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationVersion).toBe("7.4.0");
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationNamespace).toBe("nexora.nol.scene.composition.certification");
    expect(certification.sceneCompositionCertificationStatus).toEqual({ certificationLayer: true, released: true, immutable: true, deterministic: true, readiness: "ready-for-freeze" });
    expect(certification.sceneCompositionCertificationLevels).toEqual(["structural", "referential", "behavioral", "architectural", "release"]);
    expect(certification.sceneCompositionCertificationOutcomes).toEqual(["certified", "partially-certified", "rejected"]);
    expect(certification.sceneCompositionCertificationSeverities).toEqual(["info", "warning", "error", "fatal"]);
  });

  it("imports only the canonical NOL-7:3 Validation module", () => {
    expect([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation"]);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:CompositionFoundation|CompositionContracts|SceneBinding|\/runtime|\/renderer|three|react|\/ui)[^"']*["']/i);
  });

  it("publishes frozen, unique codes and all 59 ordered blocking requirements", () => {
    expect(certification.sceneCompositionCertificationCodeCount).toBe(certification.sceneCompositionCertificationCodes.length);
    expect(new Set(certification.sceneCompositionCertificationCodes).size).toBe(certification.sceneCompositionCertificationCodes.length);
    expect(certification.sceneCompositionCertificationRequirementCount).toBe(59);
    expect(certification.sceneCompositionCertificationRequirements.every((item) => item.required && item.blocking)).toBe(true);
    expect(certification.sceneCompositionCertificationRequirements.filter((item) => item.level === "structural")).toHaveLength(12);
    expect(certification.sceneCompositionCertificationRequirements.filter((item) => item.level === "referential")).toHaveLength(12);
    expect(certification.sceneCompositionCertificationRequirements.filter((item) => item.level === "behavioral")).toHaveLength(12);
    expect(certification.sceneCompositionCertificationRequirements.filter((item) => item.level === "architectural")).toHaveLength(16);
    expect(certification.sceneCompositionCertificationRequirements.filter((item) => item.level === "release")).toHaveLength(7);
    expect(deeplyFrozen(certification.sceneCompositionCertificationRequirements)).toBe(true);
  });

  it("certifies complete supplied evidence and marks it freeze eligible", () => {
    const result = certify();
    expect(result).toMatchObject({ candidateId: "candidate-1", certified: true, freezeEligible: true, outcome: "certified", passedRequirementCount: 59, failedRequirementCount: 0, passedLevelCount: 5, failedLevelCount: 0, errorCount: 0, fatalCount: 0 });
    expect(result.requirementResults).toHaveLength(59);
    expect(result.levelResults.map((item) => [item.level, item.passed])).toEqual(certification.sceneCompositionCertificationLevels.map((level) => [level, true]));
    expect(result.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_CERTIFIED");
    expect(deeplyFrozen(result)).toBe(true);
  });

  it("is deterministic, canonical, deduplicated, and does not mutate or freeze caller input", () => {
    const input = { candidateId: "candidate-1", evidence: completeEvidence() };
    const before = clone(input);
    const first = certification.certifyNexoraObjectDirectorSceneComposition(input);
    const second = certification.certifyNexoraObjectDirectorSceneComposition(input);
    expect(first).toEqual(second);
    expect(input).toEqual(before);
    expect(Object.isFrozen(input)).toBe(false);
    expect(Object.isFrozen(input.evidence)).toBe(false);
    expect(new Set(first.findings.map((finding) => JSON.stringify(finding))).size).toBe(first.findings.length);
  });

  it("partially certifies failed non-architectural evidence", () => {
    const evidence = { ...completeEvidence(), referenceIntegrityConfirmed: false };
    const result = certify(evidence);
    expect(result.outcome).toBe("partially-certified");
    expect(result.certified).toBe(false);
    expect(result.freezeEligible).toBe(false);
    expect(result.failedRequirementCount).toBeGreaterThan(0);
    expect(result.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_REFERENCE_INTEGRITY_FAILED");
  });

  it("rejects failed architectural evidence as fatal", () => {
    const result = certify({ ...completeEvidence(), dependencyBoundaryConfirmed: false });
    expect(result.outcome).toBe("rejected");
    expect(result.fatalCount).toBeGreaterThan(0);
    expect(result.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_DEPENDENCY_BOUNDARY_FAILED");
  });

  it("rejects missing, malformed, and unsupported certification inputs without throwing", () => {
    const values: unknown[] = [null, undefined, [], {}, { candidateId: " candidate ", evidence: completeEvidence() }, { candidateId: "candidate", evidence: {} }];
    for (const value of values) {
      expect(() => certification.certifyNexoraObjectDirectorSceneComposition(value)).not.toThrow();
      expect(certification.certifyNexoraObjectDirectorSceneComposition(value).outcome).toBe("rejected");
    }
    const unsupported = certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate", evidence: completeEvidence() }, { requiredLevels: ["future"] as never });
    expect(unsupported.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_CERTIFICATION_INPUT_INVALID");
  });

  it("consumes validation failures as evidence rather than rerunning validation", () => {
    const invalid = minimalComposition(); invalid.identity.compositionId = "";
    const validationResult = validation.validateNexoraObjectDirectorSceneComposition(invalid);
    const result = certify(completeEvidence(validationResult));
    expect(result.certified).toBe(false);
    expect(result.findings.some((item) => item.validationCode === "SCENE_COMPOSITION_ID_REQUIRED")).toBe(true);
    expect(result.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_VALIDATION_FAILED");
  });

  it("requires repeated deterministic evidence by default and permits an explicit opt-out", () => {
    const evidence = { ...completeEvidence() };
    delete evidence.repeatedValidationResult;
    const required = certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate", evidence });
    const optional = certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate", evidence }, { requireRepeatedValidationEvidence: false });
    expect(required.requirementResults.find((item) => item.requirementId === "deterministic-validation-results")?.passed).toBe(false);
    expect(optional.requirementResults.find((item) => item.requirementId === "deterministic-validation-results")?.passed).toBe(true);
  });

  it("detects non-equivalent repeated validation evidence", () => {
    const evidence = { ...completeEvidence(), repeatedValidationResult: validation.validateNexoraObjectDirectorSceneComposition(null) };
    const result = certify(evidence);
    expect(result.requirementResults.find((item) => item.requirementId === "summary-determinism")?.passed).toBe(false);
    expect(result.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_DETERMINISM_FAILED");
  });

  it("preserves warnings and applies the configurable warning policy", () => {
    const clean = cleanValidation();
    const warnedValidation: validation.SceneCompositionValidationResult = deepFreeze({ ...clean, findings: [{ code: "SCENE_COMPOSITION_INPUT_NOT_FROZEN", severity: "warning", message: "Input was not frozen.", path: [] }], warningCount: 1 });
    expect(validation.isNexoraObjectDirectorSceneCompositionValidationResult(warnedValidation)).toBe(true);
    const evidence = completeEvidence(warnedValidation);
    const allowed = certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate", evidence });
    const blocked = certification.certifyNexoraObjectDirectorSceneComposition({ candidateId: "candidate", evidence }, { failOnWarning: true });
    expect(allowed).toMatchObject({ outcome: "certified", certified: true, freezeEligible: true });
    expect(allowed.findings.map((item) => item.code)).toContain("SCENE_COMPOSITION_VALIDATION_WARNING_PRESENT");
    expect(blocked).toMatchObject({ outcome: "partially-certified", certified: false, freezeEligible: false });
    expect(blocked.requirementResults.find((item) => item.requirementId === "warning-policy-satisfied")?.passed).toBe(false);
  });

  it("enforces caller mutation, freezing, and invalid-input behavior evidence", () => {
    const result = certify({ ...completeEvidence(), inputWasMutated: true, inputWasFrozenByValidation: true, invalidInputHandledWithoutThrow: false });
    expect(result.findings.map((item) => item.code)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_INPUT_MUTATION_DETECTED", "SCENE_COMPOSITION_INPUT_FREEZING_DETECTED", "SCENE_COMPOSITION_INVALID_INPUT_HANDLING_FAILED"]));
  });

  it("evaluates one requirement through the public pure API", () => {
    expect(certification.evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement("reference-integrity-confirmed" as never, completeEvidence()).passed).toBe(false);
    expect(certification.evaluateNexoraObjectDirectorSceneCompositionCertificationRequirement("focus-reference-integrity", completeEvidence())).toMatchObject({ level: "referential", passed: true, blocking: true });
  });

  it("resolves certified, partially-certified, and rejected outcomes", () => {
    const clean = certify();
    const partialLevels = clean.levelResults.map((item, index) => index === 0 ? { ...item, passed: false, failedRequirementCount: 1, blockingFailureCount: 1 } : item);
    expect(certification.resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(clean.levelResults, [])).toBe("certified");
    expect(certification.resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(partialLevels, [])).toBe("partially-certified");
    expect(certification.resolveNexoraObjectDirectorSceneCompositionCertificationOutcome(clean.levelResults, [{ code: "SCENE_COMPOSITION_CERTIFICATION_REJECTED", severity: "fatal", message: "fatal", level: "release" }])).toBe("rejected");
  });

  it("validates certification results and returns an immutable dynamic summary", () => {
    const result = certify();
    expect(certification.isNexoraObjectDirectorSceneCompositionCertificationResult(result)).toBe(true);
    expect(certification.isNexoraObjectDirectorSceneCompositionCertificationResult({ ...result, candidateId: "" })).toBe(false);
    expect(certification.isNexoraObjectDirectorSceneCompositionCertificationResult({ ...result, warningCount: 99 })).toBe(false);
    const summary = certification.getNexoraObjectDirectorSceneCompositionCertificationSummary(result);
    expect(summary).toMatchObject({ candidateId: "candidate-1", status: "certified", certified: true, freezeEligible: true, passedRequirementCount: 59 });
    expect(deeplyFrozen(summary)).toBe(true);
  });

  it("publishes exactly 30 capabilities, 5 primary APIs, and 4 registry APIs", () => {
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationCapabilityCount).toBe(30);
    expect(new Set(certification.nexoraObjectDirectorSceneCompositionCertificationCapabilities).size).toBe(30);
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiCount).toBe(5);
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface).toHaveLength(5);
    for (const name of ["getNexoraObjectDirectorSceneCompositionCertificationRegistry", "getNexoraObjectDirectorSceneCompositionCertificationRegistryCount", "verifyNexoraObjectDirectorSceneCompositionCertificationRegistry", "isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen"] as const) expect(typeof certification[name]).toBe("function");
  });

  it("publishes an ordered frozen 18-section registry with a dynamic count", () => {
    const registry = certification.getNexoraObjectDirectorSceneCompositionCertificationRegistry();
    expect(registry).toBe(certification.nexoraObjectDirectorSceneCompositionCertificationRegistry);
    expect(registry).toHaveLength(18);
    expect(registry.every((item, index) => item.order === index && item.locked)).toBe(true);
    expect(certification.getNexoraObjectDirectorSceneCompositionCertificationRegistryCount()).toBe(registry.length);
    expect(certification.nexoraObjectDirectorSceneCompositionCertificationRegistryCount).toBe(registry.length);
    expect(certification.isNexoraObjectDirectorSceneCompositionCertificationRegistryFrozen()).toBe(true);
    expect(certification.verifyNexoraObjectDirectorSceneCompositionCertificationRegistry()).toMatchObject({ valid: true, ordered: true, unique: true, countValid: true, publicApisValid: true, capabilitiesValid: true, requirementsValid: true, upstreamValid: true, frozen: true, violations: [] });
    expect(deeplyFrozen(registry)).toBe(true);
  });

  it("preserves the canonical upstream NOL-7 and NOL-6 boundaries", () => {
    expect(validation.verifyNexoraObjectDirectorSceneCompositionValidationRegistry().valid).toBe(true);
    expect(contracts.verifyNexoraObjectDirectorSceneCompositionContracts().valid).toBe(true);
    expect(foundation.verifyNexoraObjectDirectorSceneCompositionFoundation().valid).toBe(true);
    expect(bindingPublicIndex.verifyNexoraObjectDirectorSceneBindingPublicIndex().valid).toBe(true);
  });

  it("contains no forbidden implementation mechanisms", () => {
    expect(source).not.toMatch(/\b(?:class|new\s+Promise|async|await|setTimeout|setInterval|document\.|window\.|addEventListener|useState|useEffect)\b/);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:three|react|canvas|svg|dom)[^"']*["']/i);
  });
});
