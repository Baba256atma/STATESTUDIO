import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as freeze from "./nexoraObjectDirectorSceneCompositionFreeze.ts";
import * as platform from "./nexoraObjectDirectorSceneCompositionPlatform.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFreeze", async () => import("./nexoraObjectDirectorSceneCompositionFreeze.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification", async () => import("./nexoraObjectDirectorSceneCompositionCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionPlatform.ts"), "utf8");
function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}
function executablePresent(value: unknown, visited: object[] = []): boolean {
  if (typeof value === "function") return true;
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).some((child) => executablePresent(child, visited));
}

describe("NOL-7:6 Director Scene Composition Platform", () => {
  it("creates exactly the two requested files and imports only NOL-7:5", () => {
    expect(readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionPlatform")).sort()).toEqual(["nexoraObjectDirectorSceneCompositionPlatform.test.ts", "nexoraObjectDirectorSceneCompositionPlatform.ts"]);
    expect([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFreeze"]);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:CompositionFoundation|CompositionContracts|CompositionValidation|CompositionCertification|SceneBinding|runtime|renderer|three|react|PublicIndex)[^"']*["']/i);
  });

  it("publishes exact identity, status, metadata, and sole upstream", () => {
    expect([platform.nexoraObjectDirectorSceneCompositionPlatformId, platform.nexoraObjectDirectorSceneCompositionPlatformVersion, platform.nexoraObjectDirectorSceneCompositionPlatformNamespace]).toEqual(["NOL-7:6/NexoraObjectDirectorSceneCompositionPlatform", "7.6.0", "nexora.nol.scene.composition.platform"]);
    expect(platform.sceneCompositionPlatformStatus).toEqual({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-adapter" });
    expect(platform.sceneCompositionPlatformMetadata).toMatchObject({ identity: platform.nexoraObjectDirectorSceneCompositionPlatformId, releaseId: "NOL-7", semanticVersion: "7.6.0", compatibilityVersion: "7.x", upstreamIdentity: freeze.nexoraObjectDirectorSceneCompositionFreezeId });
    expect(platform.sceneCompositionPlatformUpstream).toEqual({ identity: freeze.nexoraObjectDirectorSceneCompositionFreezeId, version: "7.5.0", namespace: "nexora.nol.scene.composition.freeze", dependencyRole: "sole-frozen-upstream", requiredReadiness: "ready-for-platform", requiresFreezeVerification: true, requiresRegistryVerification: true });
    expect([platform.sceneCompositionPlatformStatus, platform.sceneCompositionPlatformMetadata, platform.sceneCompositionPlatformUpstream].every((value) => deeplyFrozen(value))).toBe(true);
  });

  it("exposes complete ordered immutable surfaces with dynamic counts", () => {
    const surfaces = [platform.sceneCompositionPlatformVocabularySurface, platform.sceneCompositionPlatformContractSurface, platform.sceneCompositionPlatformValidationSurface, platform.sceneCompositionPlatformCertificationSurface, platform.sceneCompositionPlatformApiSurface];
    expect(surfaces.map((surface) => surface.length)).toEqual([10, 19, 27, 31, 16]);
    for (const surface of surfaces) {
      expect(new Set(surface.map(({ exportName }) => exportName)).size).toBe(surface.length);
      expect(surface.every((entry) => entry.sourcePhase === "NOL-7:5" && entry.locked)).toBe(true);
      expect(deeplyFrozen(surface)).toBe(true);
      expect(executablePresent(surface)).toBe(false);
    }
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformVocabularySurface()).toBe(platform.sceneCompositionPlatformVocabularySurface);
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformContractSurface()).toBe(platform.sceneCompositionPlatformContractSurface);
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformValidationSurface()).toBe(platform.sceneCompositionPlatformValidationSurface);
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformCertificationSurface()).toBe(platform.sceneCompositionPlatformCertificationSurface);
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformApiSurface()).toBe(platform.sceneCompositionPlatformApiSurface);
    expect([platform.getNexoraObjectDirectorSceneCompositionPlatformVocabularyCount(), platform.getNexoraObjectDirectorSceneCompositionPlatformContractCount(), platform.getNexoraObjectDirectorSceneCompositionPlatformValidationCount(), platform.getNexoraObjectDirectorSceneCompositionPlatformCertificationCount(), platform.getNexoraObjectDirectorSceneCompositionPlatformApiCount()]).toEqual(surfaces.map((surface) => surface.length));
  });

  it("publishes all required capabilities and exact immutable policies", () => {
    expect(platform.sceneCompositionPlatformCapabilities).toHaveLength(23);
    expect(new Set(platform.sceneCompositionPlatformCapabilities).size).toBe(23);
    expect(platform.sceneCompositionPlatformIntegrationPolicy).toMatchObject({ frozenUpstreamRequired: true, registryVerificationRequired: true, runtimeExecutionProvided: false, rendererExecutionProvided: false, mutationAllowed: false });
    expect(platform.sceneCompositionPlatformAdapterPolicy).toMatchObject({ readiness: "ready-for-adapter", adapterCertificationPhase: "NOL-7:7", adapterFreezePhase: "NOL-7:8", finalPublicIndexPhase: "NOL-7:9", adapterExecutionAllowedInPlatform: false });
    expect(platform.sceneCompositionPlatformCompatibilityPolicy).toMatchObject({ semanticVersion: "7.6.0", sceneBindingCompatibilityRequired: true, additiveChangesAllowed: false, breakingChangesAllowed: false, freezeBypassAllowed: false });
    expect(platform.sceneCompositionPlatformConsumerPolicy).toEqual({ immediateAllowedConsumers: ["NOL-7:7"], finalConsumerEntry: "NOL-7:9", directFeatureConsumptionAllowed: false, internalPhaseImportAllowed: false, directFreezeImportAllowed: false, mutationAllowed: false, overrideAllowed: false, behaviorChangingWrappersAllowed: false });
    expect(platform.sceneCompositionPlatformAdapterCertificationHandoff).toMatchObject({ nextPhase: "NOL-7:7", role: "sole-adapter-certification-upstream", ready: true, adapterExecutionProhibited: true });
    expect([platform.sceneCompositionPlatformCapabilities, platform.sceneCompositionPlatformIntegrationPolicy, platform.sceneCompositionPlatformAdapterPolicy, platform.sceneCompositionPlatformCompatibilityPolicy, platform.sceneCompositionPlatformConsumerPolicy, platform.sceneCompositionPlatformAdapterCertificationHandoff].every((value) => deeplyFrozen(value))).toBe(true);
  });

  it("publishes a plain deeply frozen canonical object and deterministic verification", () => {
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatform()).toBe(platform.nexoraObjectDirectorSceneCompositionPlatform);
    expect(executablePresent(platform.nexoraObjectDirectorSceneCompositionPlatform)).toBe(false);
    expect(deeplyFrozen(platform.nexoraObjectDirectorSceneCompositionPlatform)).toBe(true);
    const first = platform.verifyNexoraObjectDirectorSceneCompositionPlatform(), second = platform.verifyNexoraObjectDirectorSceneCompositionPlatform();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, frozenUpstreamValid: true, readyForAdapter: true, failedCheckCount: 0 });
    expect(first.passedCheckCount).toBe(first.checkResults.length);
    expect(new Set(first.checkResults.map(({ checkId }) => checkId)).size).toBe(first.checkResults.length);
    expect(deeplyFrozen(first)).toBe(true);
    expect(platform.isNexoraObjectDirectorSceneCompositionPlatformFrozen()).toBe(true);
    expect(platform.isNexoraObjectDirectorSceneCompositionReadyForAdapter()).toBe(true);
  });

  it("publishes exactly 20 ordered immutable registry entries", () => {
    const registry = platform.getNexoraObjectDirectorSceneCompositionPlatformRegistry();
    expect(registry).toBe(platform.nexoraObjectDirectorSceneCompositionPlatformRegistry);
    expect(registry.map(({ section }) => section)).toEqual(["identity", "status", "metadata", "upstream", "capabilities", "vocabulary-surface", "contract-surface", "validation-surface", "certification-surface", "api-surface", "integration-policy", "adapter-policy", "compatibility", "consumer-policy", "adapter-certification-handoff", "verification", "public-apis", "dependency", "readiness", "release-information"]);
    expect(registry.map(({ order }) => order)).toEqual([...registry.keys()]);
    expect(platform.getNexoraObjectDirectorSceneCompositionPlatformRegistryCount()).toBe(registry.length);
    expect(platform.verifyNexoraObjectDirectorSceneCompositionPlatformRegistry().valid).toBe(true);
    expect(platform.isNexoraObjectDirectorSceneCompositionPlatformRegistryFrozen()).toBe(true);
    expect(deeplyFrozen(registry)).toBe(true);
  });

  it("preserves lineage, public terminology verification, and dynamic summary", () => {
    expect(platform.sceneCompositionPlatformReleaseInformation.lineage).toEqual(["NOL-6:9", "NOL-7:1", "NOL-7:2", "NOL-7:3", "NOL-7:4", "NOL-7:5", "NOL-7:6"]);
    const result = platform.verifyNexoraObjectDirectorSceneCompositionPlatform();
    expect(result.checkResults.find(({ checkId }) => checkId === "public-terminology")?.passed).toBe(true);
    expect(result.checkResults.find(({ checkId }) => checkId === "binding-compatibility")?.passed).toBe(true);
    const summary = platform.getNexoraObjectDirectorSceneCompositionPlatformSummary();
    expect(summary).toMatchObject({ identity: platform.nexoraObjectDirectorSceneCompositionPlatformId, version: "7.6.0", readiness: "ready-for-adapter", capabilityCount: platform.sceneCompositionPlatformCapabilities.length, vocabularyCount: platform.sceneCompositionPlatformVocabularySurface.length, contractCount: platform.sceneCompositionPlatformContractSurface.length, validationSurfaceCount: platform.sceneCompositionPlatformValidationSurface.length, certificationSurfaceCount: platform.sceneCompositionPlatformCertificationSurface.length, apiCount: platform.sceneCompositionPlatformApiSurface.length, registryEntryCount: platform.nexoraObjectDirectorSceneCompositionPlatformRegistry.length, soleDependency: freeze.nexoraObjectDirectorSceneCompositionFreezeId, nextPhase: "NOL-7:7", finalConsumerPhase: "NOL-7:9" });
    expect(deeplyFrozen(summary)).toBe(true);
    expect(deeplyFrozen(platform.sceneCompositionPlatformReleaseInformation)).toBe(true);
  });

  it("contains no forbidden execution mechanisms or mutation APIs", () => {
    expect(source).not.toMatch(/\b(?:async|Promise|setTimeout|setInterval|addEventListener|subscribe|fetch|XMLHttpRequest|WebSocket|console\.|class|new Date|new Map|new Set)\b/);
    expect(Object.keys(platform).some((name) => /(?:unlock|reset|override|replace|patch|migration|registerAdapter|executeAdapter)/i.test(name))).toBe(false);
  });
});
