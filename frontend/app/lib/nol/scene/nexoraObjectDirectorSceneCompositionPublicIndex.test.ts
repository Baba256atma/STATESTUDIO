import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as adapterFreeze from "./nexoraObjectDirectorSceneCompositionAdapterFreeze.ts";
import * as publicIndex from "./nexoraObjectDirectorSceneCompositionPublicIndex.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionAdapterFreeze", async () => import("./nexoraObjectDirectorSceneCompositionAdapterFreeze.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionAdapterCertification", async () => import("./nexoraObjectDirectorSceneCompositionAdapterCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPlatform", async () => import("./nexoraObjectDirectorSceneCompositionPlatform.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFreeze", async () => import("./nexoraObjectDirectorSceneCompositionFreeze.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification", async () => import("./nexoraObjectDirectorSceneCompositionCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const directory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(directory, "nexoraObjectDirectorSceneCompositionPublicIndex.ts"), "utf8");
function deeplyFrozen(value: unknown, visited: object[] = []): boolean { if (value === null || typeof value !== "object" || visited.includes(value as object)) return true; if (!Object.isFrozen(value)) return false; visited.push(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited)); }

describe("NOL-7:9 Director Scene Composition Public Index", () => {
  it("creates exactly two files, imports only NOL-7:8, and has no default export", () => {
    expect(readdirSync(directory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionPublicIndex")).sort()).toEqual(["nexoraObjectDirectorSceneCompositionPublicIndex.test.ts", "nexoraObjectDirectorSceneCompositionPublicIndex.ts"]);
    expect(new Set([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]))).toEqual(new Set(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionAdapterFreeze"]));
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });
  it("publishes exact identity, immutable status, lock, and upstream", () => {
    expect([publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexId, publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexVersion, publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexNamespace]).toEqual(["NOL-7:9/NexoraObjectDirectorSceneCompositionPublicIndex", "7.9.0", "nexora.nol.scene.composition.public-index"]);
    expect(publicIndex.sceneCompositionPublicIndexStatus).toEqual({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-consumer" });
    expect(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexLock).toEqual({ lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-PUBLIC-INDEX-LOCKED", active: true, reversible: false, scope: "director-scene-composition-public-index", version: "7.9.0" });
    expect(publicIndex.sceneCompositionPublicIndexUpstream.identity).toBe(adapterFreeze.nexoraObjectDirectorSceneCompositionAdapterFreezeId);
    expect([publicIndex.sceneCompositionPublicIndexStatus, publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexLock, publicIndex.sceneCompositionPublicIndexUpstream].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes exactly nine namespace sections and preserves NOL-7:8 identities", () => {
    expect(publicIndex.sceneCompositionPublicIndexNamespaceSections).toEqual(["identity", "public-types", "public-apis", "validation", "certification", "release-information", "compatibility", "registry", "consumer-information"]);
    expect(publicIndex.verifyNexoraObjectDirectorSceneCompositionAdapterFreeze).toBe(adapterFreeze.verifyNexoraObjectDirectorSceneCompositionAdapterFreeze);
    expect(publicIndex.sceneCompositionAdapterFreezeStatus).toBe(adapterFreeze.sceneCompositionAdapterFreezeStatus);
    expect(deeplyFrozen(publicIndex.sceneCompositionPublicIndexNamespaceSections)).toBe(true);
  });
  it("publishes exact composition vocabulary and canonical NOL-6 terminology", () => {
    expect(publicIndex.sceneCompositionPublicVocabulary.unitKinds).toEqual(["scene", "layer", "group", "node", "relationship", "annotation"]);
    expect(publicIndex.sceneCompositionPublicVocabulary.modes).toEqual(["global", "goal", "object", "pack", "path", "comparison", "presentation"]);
    expect(publicIndex.sceneCompositionPublicVocabulary.ownershipRoles).toEqual(["director", "workspace", "runtime", "renderer", "consumer"]);
    const result = publicIndex.verifyNexoraObjectDirectorSceneCompositionPublicIndex();
    expect(result.checkResults.find(({ checkId }) => checkId === "public-terminology")?.passed).toBe(true);
    expect(deeplyFrozen(publicIndex.sceneCompositionPublicVocabulary)).toBe(true);
  });
  it("publishes immutable validation, certification, Platform, and Adapter Certification surfaces", () => {
    expect(publicIndex.sceneCompositionPublicValidationSurface).toMatchObject({ available: true, identity: "NOL-7:3/NexoraObjectDirectorSceneCompositionValidation", behaviorPreserved: true });
    expect(publicIndex.sceneCompositionPublicValidationSurface.entryPoints).toHaveLength(11);
    expect(publicIndex.sceneCompositionPublicCertificationSurface).toMatchObject({ available: true, identity: "NOL-7:4/NexoraObjectDirectorSceneCompositionCertification", requirementCount: 59, behaviorPreserved: true });
    expect(publicIndex.sceneCompositionPublicPlatformSurface).toMatchObject({ identity: "NOL-7:6/NexoraObjectDirectorSceneCompositionPlatform", readiness: "ready-for-adapter", capabilityCount: 23, vocabularyCount: 10, contractCount: 19, behaviorPreserved: true });
    expect(publicIndex.sceneCompositionPublicAdapterCertificationSurface).toMatchObject({ identity: "NOL-7:7/NexoraObjectDirectorSceneCompositionAdapterCertification", behaviorPreserved: true });
    expect(publicIndex.sceneCompositionPublicAdapterCertificationSurface.entryPoints).toHaveLength(7);
    expect([publicIndex.sceneCompositionPublicValidationSurface, publicIndex.sceneCompositionPublicCertificationSurface, publicIndex.sceneCompositionPublicPlatformSurface, publicIndex.sceneCompositionPublicAdapterCertificationSurface].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes ordered unique immutable public type and API registries", () => {
    expect(publicIndex.getNexoraObjectDirectorSceneCompositionPublicTypeRegistry()).toBe(publicIndex.sceneCompositionPublicTypeRegistry);
    expect(publicIndex.getNexoraObjectDirectorSceneCompositionPublicApiRegistry()).toBe(publicIndex.sceneCompositionPublicApiRegistry);
    expect(publicIndex.sceneCompositionPublicTypeRegistry).toHaveLength(69);
    expect(publicIndex.sceneCompositionPublicApiRegistry).toHaveLength(30);
    expect(new Set(publicIndex.sceneCompositionPublicTypeRegistry.map(({ exportName }) => exportName)).size).toBe(publicIndex.getNexoraObjectDirectorSceneCompositionPublicTypeCount());
    expect(new Set(publicIndex.sceneCompositionPublicApiRegistry.map(({ exportName }) => exportName)).size).toBe(publicIndex.getNexoraObjectDirectorSceneCompositionPublicApiCount());
    expect(publicIndex.sceneCompositionPublicTypeRegistry.every(({ consumerVisible, locked }) => consumerVisible && locked)).toBe(true);
    expect(publicIndex.sceneCompositionPublicApiRegistry.every(({ behaviorPreserved, consumerVisible, locked }) => behaviorPreserved && consumerVisible && locked)).toBe(true);
    expect([publicIndex.sceneCompositionPublicTypeRegistry, publicIndex.sceneCompositionPublicApiRegistry].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes complete release, compatibility, consumer information, and 20 rules", () => {
    expect(publicIndex.sceneCompositionPublicReleaseInformation.lineage).toEqual(["NOL-6:9", "NOL-7:1", "NOL-7:2", "NOL-7:3", "NOL-7:4", "NOL-7:5", "NOL-7:6", "NOL-7:7", "NOL-7:8", "NOL-7:9"]);
    expect(publicIndex.sceneCompositionPublicIndexCompatibility).toMatchObject({ semanticVersion: "7.9.0", mutationAllowed: false, breakingChangesAllowed: false, behaviorChangingWrappersAllowed: false, freezeBypassAllowed: false });
    expect(publicIndex.sceneCompositionPublicIndexConsumerInformation).toMatchObject({ supportedImportPath: "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPublicIndex", soleConsumerEntryPoint: true, directInternalPhaseImportsAllowed: false, alternateEntryPointAllowed: false });
    expect(publicIndex.sceneCompositionPublicIndexConsumerRules).toHaveLength(20);
    expect(new Set(publicIndex.sceneCompositionPublicIndexConsumerRules.map(({ id }) => id)).size).toBe(20);
    expect(publicIndex.sceneCompositionPublicIndexConsumerRules.every(({ mandatory, locked }) => mandatory && locked)).toBe(true);
    expect([publicIndex.sceneCompositionPublicReleaseInformation, publicIndex.sceneCompositionPublicIndexCompatibility, publicIndex.sceneCompositionPublicIndexConsumerInformation, publicIndex.sceneCompositionPublicIndexConsumerRules].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes a deeply frozen nine-section canonical namespace and registry", () => {
    expect(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndex.identity.id).toBe(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexId);
    expect(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndex.publicTypes.count).toBe(publicIndex.sceneCompositionPublicTypeRegistry.length);
    expect(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndex.publicApis.count).toBe(publicIndex.sceneCompositionPublicApiRegistry.length);
    expect(deeplyFrozen(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndex)).toBe(true);
    const registry = publicIndex.getNexoraObjectDirectorSceneCompositionPublicIndexRegistry();
    expect(registry).toBe(publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexRegistry);
    expect(registry).toHaveLength(9);
    expect(registry.map(({ order }) => order)).toEqual([...registry.keys()]);
    expect(publicIndex.getNexoraObjectDirectorSceneCompositionPublicIndexRegistryCount()).toBe(registry.length);
    expect(publicIndex.verifyNexoraObjectDirectorSceneCompositionPublicIndexRegistry().valid).toBe(true);
    expect(publicIndex.isNexoraObjectDirectorSceneCompositionPublicIndexRegistryFrozen()).toBe(true);
  });
  it("passes deterministic Public Index and consumer-entry verification", () => {
    const first = publicIndex.verifyNexoraObjectDirectorSceneCompositionPublicIndex(), second = publicIndex.verifyNexoraObjectDirectorSceneCompositionPublicIndex();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, readyForConsumer: true, soleConsumerEntryConfirmed: true, failedCheckCount: 0 });
    expect(first.passedCheckCount).toBe(first.checkResults.length);
    expect(deeplyFrozen(first)).toBe(true);
    const entry = publicIndex.verifyNexoraObjectDirectorSceneCompositionConsumerEntry();
    expect(entry).toMatchObject({ valid: true, soleConsumerEntryPoint: true, upstreamReady: true, registryValid: true, publicSurfaceFrozen: true, terminologyValid: true, bindingCompatibilityValid: true, ruleCount: 20 });
    expect(deeplyFrozen(entry)).toBe(true);
    expect(publicIndex.isNexoraObjectDirectorSceneCompositionPublicIndexFrozen()).toBe(true);
    expect(publicIndex.isNexoraObjectDirectorSceneCompositionReadyForConsumer()).toBe(true);
  });
  it("returns a dynamic immutable summary and contains no forbidden behavior", () => {
    const summary = publicIndex.getNexoraObjectDirectorSceneCompositionPublicIndexSummary();
    expect(summary).toMatchObject({ identity: publicIndex.nexoraObjectDirectorSceneCompositionPublicIndexId, version: "7.9.0", readiness: "ready-for-consumer", namespaceSectionCount: 9, publicTypeCount: publicIndex.sceneCompositionPublicTypeRegistry.length, publicApiCount: publicIndex.sceneCompositionPublicApiRegistry.length, consumerRuleCount: 20, registryEntryCount: 9, lineageCount: 10, soleDependency: adapterFreeze.nexoraObjectDirectorSceneCompositionAdapterFreezeId, supportedImportPath: "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPublicIndex" });
    expect(deeplyFrozen(summary)).toBe(true);
    expect(source).not.toMatch(/\b(?:async|Promise|setTimeout|setInterval|addEventListener|fetch|XMLHttpRequest|WebSocket|console\.)\b/);
    expect(Object.keys(publicIndex).some((name) => /(?:unlock|reset|override|replace|patch|migration|executeAdapter|registerAdapter)/i.test(name))).toBe(false);
  });
});
