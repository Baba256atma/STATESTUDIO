import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as platform from "./nexoraObjectDirectorSceneCompositionPlatform.ts";
import * as certification from "./nexoraObjectDirectorSceneCompositionAdapterCertification.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPlatform", async () => import("./nexoraObjectDirectorSceneCompositionPlatform.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFreeze", async () => import("./nexoraObjectDirectorSceneCompositionFreeze.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification", async () => import("./nexoraObjectDirectorSceneCompositionCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const directory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(directory, "nexoraObjectDirectorSceneCompositionAdapterCertification.ts"), "utf8");
function deeplyFrozen(value: unknown, visited: object[] = []): boolean { if (value === null || typeof value !== "object" || visited.includes(value as object)) return true; if (!Object.isFrozen(value)) return false; visited.push(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited)); }
function deepFreeze<T>(value: T): T { if (value !== null && typeof value === "object") { for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child); Object.freeze(value); } return value; }

const metadata = () => ({ adapterId: "adapter.scene.test", adapterName: "Scene Test Adapter", adapterVersion: "1.0.0", adapterKind: "testing-bridge" as const, description: null, vendor: null, platformId: platform.nexoraObjectDirectorSceneCompositionPlatformId, platformVersion: platform.nexoraObjectDirectorSceneCompositionPlatformVersion, platformNamespace: platform.nexoraObjectDirectorSceneCompositionPlatformNamespace, capabilities: ["composition-vocabulary-consumer", "composition-contract-consumer", "validation-surface-consumer", "certification-surface-consumer", "platform-api-consumer", "binding-compatible", "terminology-compatible", "immutable-metadata", "deterministic-declaration", "execution-free"], supportedVocabularyExports: platform.sceneCompositionPlatformVocabularySurface.map(({ exportName }) => exportName), supportedContractExports: platform.sceneCompositionPlatformContractSurface.map(({ exportName }) => exportName), supportedValidationExports: platform.sceneCompositionPlatformValidationSurface.map(({ exportName }) => exportName), supportedCertificationExports: platform.sceneCompositionPlatformCertificationSurface.map(({ exportName }) => exportName), supportedApiExports: platform.sceneCompositionPlatformApiSurface.map(({ exportName }) => exportName), declaredDependencies: [platform.nexoraObjectDirectorSceneCompositionPlatformId] });
const evidence = (repeatedMetadata: ReturnType<typeof metadata>) => ({ platformVerificationConfirmed: true, platformRegistryConfirmed: true, platformFrozenConfirmed: true, platformAdapterReadinessConfirmed: true, vocabularyCompatibilityConfirmed: true, contractCompatibilityConfirmed: true, validationSurfaceCompatibilityConfirmed: true, certificationSurfaceCompatibilityConfirmed: true, apiSurfaceCompatibilityConfirmed: true, bindingCompatibilityConfirmed: true, publicTerminologyConfirmed: true, compositionModesConfirmed: true, behaviorPreservationConfirmed: true, dependencyBoundaryConfirmed: true, plainDataBoundaryConfirmed: true, metadataDeeplyFrozen: true, callerInputWasMutated: false, callerInputWasFrozenByCertification: false, deterministicDeclarationConfirmed: true, forbiddenBehaviorAbsent: true, repeatedMetadata });
function validInput() { const adapter = deepFreeze(metadata()); return deepFreeze({ candidateId: "candidate.scene.test", adapter, evidence: evidence(metadata()) }); }

describe("NOL-7:7 Director Scene Composition Adapter Certification", () => {
  it("creates exactly two files and imports only NOL-7:6", () => {
    expect(readdirSync(directory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionAdapterCertification")).sort()).toEqual(["nexoraObjectDirectorSceneCompositionAdapterCertification.test.ts", "nexoraObjectDirectorSceneCompositionAdapterCertification.ts"]);
    expect([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPlatform"]);
  });
  it("publishes exact identity and canonical frozen collections", () => {
    expect([certification.nexoraObjectDirectorSceneCompositionAdapterCertificationId, certification.nexoraObjectDirectorSceneCompositionAdapterCertificationVersion, certification.nexoraObjectDirectorSceneCompositionAdapterCertificationNamespace]).toEqual(["NOL-7:7/NexoraObjectDirectorSceneCompositionAdapterCertification", "7.7.0", "nexora.nol.scene.composition.adapter.certification"]);
    expect(certification.sceneCompositionAdapterKinds).toEqual(["renderer-bridge", "visualization-bridge", "workspace-bridge", "presentation-bridge", "testing-bridge"]);
    expect(certification.sceneCompositionAdapterCertificationLevels).toEqual(["identity", "platform", "surface", "compatibility", "architectural", "release"]);
    expect(certification.sceneCompositionAdapterCertificationOutcomes).toEqual(["certified", "partially-certified", "rejected"]);
    expect(certification.sceneCompositionAdapterCertificationSeverities).toEqual(["info", "warning", "error", "fatal"]);
    expect([certification.sceneCompositionAdapterKinds, certification.sceneCompositionAdapterCertificationLevels, certification.sceneCompositionAdapterCertificationOutcomes, certification.sceneCompositionAdapterCertificationSeverities, certification.sceneCompositionAdapterCertificationCodes].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes all 56 ordered unique requirements and 25 capabilities", () => {
    expect(certification.sceneCompositionAdapterCertificationRequirements).toHaveLength(56);
    expect(new Set(certification.sceneCompositionAdapterCertificationRequirements.map(({ id }) => id)).size).toBe(certification.sceneCompositionAdapterCertificationRequirementCount);
    expect(certification.sceneCompositionAdapterCertificationRequirements.every(({ required, blocking }) => required && blocking)).toBe(true);
    expect(certification.sceneCompositionAdapterCertificationCapabilities).toHaveLength(25);
    expect(certification.sceneCompositionAdapterCertificationCapabilityCount).toBe(certification.sceneCompositionAdapterCertificationCapabilities.length);
    expect(deeplyFrozen(certification.sceneCompositionAdapterCertificationRequirements)).toBe(true);
  });
  it("certifies complete immutable metadata without modifying caller data", () => {
    const input = validInput(), before = JSON.stringify(input), result = certification.certifyNexoraObjectDirectorSceneCompositionAdapter(input);
    expect(result).toMatchObject({ candidateId: "candidate.scene.test", adapterId: "adapter.scene.test", certified: true, freezeEligible: true, outcome: "certified", failedLevelCount: 0, fatalCount: 0, errorCount: 0 });
    expect(result.levelResults.every(({ passed }) => passed)).toBe(true);
    expect(certification.isNexoraObjectDirectorSceneCompositionAdapterCertificationResult(result)).toBe(true);
    expect(certification.isNexoraObjectDirectorSceneCompositionAdapterCertified(result)).toBe(true);
    expect(certification.isNexoraObjectDirectorSceneCompositionAdapterFreezeEligible(result)).toBe(true);
    expect(JSON.stringify(input)).toBe(before);
    expect(deeplyFrozen(result)).toBe(true);
  });
  it("resolves partial and rejected certification deterministically", () => {
    const valid = validInput(), partialInput = { ...valid, evidence: { ...valid.evidence, apiSurfaceCompatibilityConfirmed: false } };
    const partial = certification.certifyNexoraObjectDirectorSceneCompositionAdapter(partialInput, { requiredLevels: ["identity", "platform", "surface", "compatibility", "architectural"] });
    expect(partial.outcome).toBe("partially-certified");
    expect(partial.certified).toBe(false);
    expect(partial.freezeEligible).toBe(false);
    for (const invalid of [null, {}, { candidateId: " ", adapter: {}, evidence: {} }, { ...valid, adapter: { ...valid.adapter, platformId: "wrong" } }]) {
      const first = certification.certifyNexoraObjectDirectorSceneCompositionAdapter(invalid), second = certification.certifyNexoraObjectDirectorSceneCompositionAdapter(invalid);
      expect(first).toEqual(second);
      expect(first.outcome).toBe("rejected");
      expect(first.freezeEligible).toBe(false);
    }
  });
  it("rejects duplicate declarations, unknown exports, forbidden dependencies, and non-plain data", () => {
    const base = validInput();
    const cases = [
      { ...base, adapter: { ...base.adapter, capabilities: [...base.adapter.capabilities, base.adapter.capabilities[0]] } },
      { ...base, adapter: { ...base.adapter, supportedApiExports: [...base.adapter.supportedApiExports, "internalExecuteAdapter"] } },
      { ...base, adapter: { ...base.adapter, declaredDependencies: [platform.nexoraObjectDirectorSceneCompositionPlatformId, "react"] } },
      { ...base, adapter: { ...base.adapter, callback: () => true } },
      { ...base, adapter: new (class Adapter {})() },
    ];
    for (const value of cases) expect(certification.certifyNexoraObjectDirectorSceneCompositionAdapter(value).certified).toBe(false);
  });
  it("evaluates individual requirements and resolves outcomes without mutating inputs", () => {
    const input = validInput();
    const result = certification.evaluateNexoraObjectDirectorSceneCompositionAdapterRequirement("platform-version-compatible", input.adapter, input.evidence);
    expect(result).toMatchObject({ requirementId: "platform-version-compatible", level: "platform", passed: true, blocking: true });
    expect(deeplyFrozen(result)).toBe(true);
    const levels = certification.sceneCompositionAdapterCertificationLevels.map((level) => ({ level, passed: true, requiredRequirementCount: 1, passedRequirementCount: 1, failedRequirementCount: 0, blockingFailureCount: 0 }));
    const before = JSON.stringify(levels);
    expect(certification.resolveNexoraObjectDirectorSceneCompositionAdapterCertificationOutcome(levels, [])).toBe("certified");
    expect(certification.resolveNexoraObjectDirectorSceneCompositionAdapterCertificationOutcome([{ ...levels[0], passed: false }, ...levels.slice(1)], [])).toBe("partially-certified");
    expect(certification.resolveNexoraObjectDirectorSceneCompositionAdapterCertificationOutcome(levels.map((item) => ({ ...item, passed: false })), [])).toBe("rejected");
    expect(JSON.stringify(levels)).toBe(before);
  });
  it("publishes exact policy, 21-entry registry, and dynamic summary", () => {
    expect(certification.sceneCompositionAdapterCompatibilityPolicy).toMatchObject({ certificationVersion: "7.7.0", requiredPlatformVersion: "7.6.0", adapterExecutionAllowed: false, mutationAllowed: false, platformBypassAllowed: false, freezeBypassAllowed: false });
    const registry = certification.getNexoraObjectDirectorSceneCompositionAdapterCertificationRegistry();
    expect(registry).toBe(certification.nexoraObjectDirectorSceneCompositionAdapterCertificationRegistry);
    expect(registry).toHaveLength(21);
    expect(registry.map(({ order }) => order)).toEqual([...registry.keys()]);
    expect(certification.getNexoraObjectDirectorSceneCompositionAdapterCertificationRegistryCount()).toBe(registry.length);
    expect(certification.verifyNexoraObjectDirectorSceneCompositionAdapterCertificationRegistry().valid).toBe(true);
    expect(certification.isNexoraObjectDirectorSceneCompositionAdapterCertificationRegistryFrozen()).toBe(true);
    const result = certification.certifyNexoraObjectDirectorSceneCompositionAdapter(validInput()), summary = certification.getNexoraObjectDirectorSceneCompositionAdapterCertificationSummary(result);
    expect(summary).toMatchObject({ status: "certified", certified: true, freezeEligible: true, nextPhase: "NOL-7:8" });
    expect(deeplyFrozen(summary)).toBe(true);
  });
  it("verifies NOL-7:6 and contains no forbidden implementation behavior", () => {
    expect(platform.verifyNexoraObjectDirectorSceneCompositionPlatform().valid).toBe(true);
    expect(platform.verifyNexoraObjectDirectorSceneCompositionPlatformRegistry().valid).toBe(true);
    expect(platform.isNexoraObjectDirectorSceneCompositionPlatformFrozen()).toBe(true);
    expect(platform.isNexoraObjectDirectorSceneCompositionReadyForAdapter()).toBe(true);
    expect(source).not.toMatch(/\b(?:async|Promise|setTimeout|setInterval|addEventListener|fetch|XMLHttpRequest|WebSocket|console\.)\b/);
    expect(Object.keys(certification).some((name) => /(?:executeAdapter|registerAdapter|unlock|reset|override|replace|patch)/i.test(name))).toBe(false);
  });
});
