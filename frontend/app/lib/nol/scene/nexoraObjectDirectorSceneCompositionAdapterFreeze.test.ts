import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as upstream from "./nexoraObjectDirectorSceneCompositionAdapterCertification.ts";
import * as freeze from "./nexoraObjectDirectorSceneCompositionAdapterFreeze.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionAdapterCertification", async () => import("./nexoraObjectDirectorSceneCompositionAdapterCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionPlatform", async () => import("./nexoraObjectDirectorSceneCompositionPlatform.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFreeze", async () => import("./nexoraObjectDirectorSceneCompositionFreeze.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification", async () => import("./nexoraObjectDirectorSceneCompositionCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const directory = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(directory, "nexoraObjectDirectorSceneCompositionAdapterFreeze.ts"), "utf8");
function deeplyFrozen(value: unknown, visited: object[] = []): boolean { if (value === null || typeof value !== "object" || visited.includes(value as object)) return true; if (!Object.isFrozen(value)) return false; visited.push(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited)); }
function executablePresent(value: unknown, visited: object[] = []): boolean { if (typeof value === "function") return true; if (value === null || typeof value !== "object" || visited.includes(value as object)) return false; visited.push(value as object); return Object.values(value as Record<string, unknown>).some((child) => executablePresent(child, visited)); }

describe("NOL-7:8 Director Scene Composition Adapter Freeze", () => {
  it("creates exactly two files and imports only NOL-7:7", () => {
    expect(readdirSync(directory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionAdapterFreeze")).sort()).toEqual(["nexoraObjectDirectorSceneCompositionAdapterFreeze.test.ts", "nexoraObjectDirectorSceneCompositionAdapterFreeze.ts"]);
    expect([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionAdapterCertification"]);
  });
  it("publishes exact identity, immutable status, lock, and upstream", () => {
    expect([freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeId, freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeVersion, freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeNamespace]).toEqual(["NOL-7:8/NexoraObjectDirectorSceneCompositionAdapterFreeze", "7.8.0", "nexora.nol.scene.composition.adapter.freeze"]);
    expect(freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeLock).toEqual({ lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-ADAPTER-LOCKED", active: true, reversible: false, scope: "director-scene-composition-adapter", version: "7.8.0" });
    expect(freeze.sceneCompositionAdapterFreezeStatus).toEqual({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-public-index" });
    expect(freeze.sceneCompositionAdapterFreezeUpstream).toEqual({ identity: upstream.nexoraObjectDirectorSceneCompositionAdapterCertificationId, version: "7.7.0", namespace: "nexora.nol.scene.composition.adapter.certification", dependencyRole: "sole-certified-adapter-upstream", requiredOutcome: "certified", requiresFreezeEligibility: true, requiredReadiness: "ready-for-adapter-freeze" });
    expect([freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeLock, freeze.sceneCompositionAdapterFreezeStatus, freeze.sceneCompositionAdapterFreezeUpstream].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("locks exactly 12 categories and 111 ordered unique invariants", () => {
    expect(freeze.sceneCompositionAdapterFreezeInvariantCategories).toEqual(["identity", "dependency", "certification", "adapter", "platform", "surface", "compatibility", "immutability", "api", "registry", "consumer", "release"]);
    expect(freeze.sceneCompositionAdapterFreezeInvariants).toHaveLength(111);
    expect(freeze.sceneCompositionAdapterFreezeInvariantCount).toBe(freeze.sceneCompositionAdapterFreezeInvariants.length);
    expect(new Set(freeze.sceneCompositionAdapterFreezeInvariants.map(({ id }) => id)).size).toBe(111);
    expect(freeze.sceneCompositionAdapterFreezeInvariants.every(({ mandatory, locked }) => mandatory && locked)).toBe(true);
    expect([freeze.sceneCompositionAdapterFreezeInvariantCategories, freeze.sceneCompositionAdapterFreezeInvariants].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("locks adapter contracts and complete certification metadata without executables", () => {
    const contracts = freeze.getNexoraObjectDirectorSceneCompositionFrozenAdapterContractSurface(), certification = freeze.getNexoraObjectDirectorSceneCompositionFrozenAdapterCertificationSurface();
    expect(contracts).toBe(freeze.sceneCompositionFrozenAdapterContractSurface);
    expect(certification).toBe(freeze.sceneCompositionFrozenAdapterCertificationSurface);
    expect([contracts.length, certification.length]).toEqual([9, 45]);
    expect(contracts.every(({ sourcePhase, locked }) => sourcePhase === "NOL-7:7" && locked)).toBe(true);
    expect(certification.every(({ sourcePhase, locked, publicIndexVisible }) => sourcePhase === "NOL-7:7" && locked && publicIndexVisible)).toBe(true);
    expect(new Set(contracts.map(({ exportName }) => exportName)).size).toBe(contracts.length);
    expect(new Set(certification.map(({ exportName }) => exportName)).size).toBe(certification.length);
    expect(executablePresent([contracts, certification])).toBe(false);
    expect([freeze.getNexoraObjectDirectorSceneCompositionFrozenAdapterContractCount(), freeze.getNexoraObjectDirectorSceneCompositionFrozenAdapterCertificationCount()]).toEqual([contracts.length, certification.length]);
    expect([contracts, certification].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("preserves adapter kinds, levels, outcomes, eligibility, and terminology", () => {
    expect(upstream.sceneCompositionAdapterKinds).toEqual(["renderer-bridge", "visualization-bridge", "workspace-bridge", "presentation-bridge", "testing-bridge"]);
    expect(upstream.sceneCompositionAdapterCertificationLevels).toEqual(["identity", "platform", "surface", "compatibility", "architectural", "release"]);
    expect(upstream.sceneCompositionAdapterCertificationOutcomes).toEqual(["certified", "partially-certified", "rejected"]);
    expect(freeze.sceneCompositionAdapterFreezeEligibilityPolicy).toEqual({ requiredOutcome: "certified", certifiedRequired: true, freezeEligibleRequired: true, releaseLevelRequired: true, allRequiredLevelsMustPass: true, fatalFindingsAllowed: false, blockingErrorsAllowed: false, partiallyCertifiedAllowed: false, rejectedAllowed: false, warningPolicyInherited: true });
    const verification = freeze.verifyNexoraObjectDirectorSceneCompositionAdapterFreeze();
    expect(verification.checkResults.find(({ checkId }) => checkId === "public-terminology")?.passed).toBe(true);
    expect(verification.checkResults.find(({ checkId }) => checkId === "binding-compatibility")?.passed).toBe(true);
  });
  it("publishes exact immutable dependency, compatibility, consumer, and handoff policies", () => {
    expect(freeze.sceneCompositionAdapterFreezeDependencyPolicy).toMatchObject({ approvedArchitecturalDependency: "NOL-7:6", certificationBoundary: "NOL-7:7", directNol7InternalDependencyAllowed: false, directNol6DependencyAllowed: false, runtimeDependencyAllowed: false, rendererDependencyAllowed: false, adapterExecutionDependencyAllowed: false });
    expect(freeze.sceneCompositionAdapterFreezeCompatibilityPolicy).toMatchObject({ semanticVersion: "7.8.0", adapterCertificationVersion: "7.7.0", platformCompatibilityRequired: true, backwardCompatibilityRequired: true, mutationAllowed: false, overrideAllowed: false, platformBypassAllowed: false, certificationBypassAllowed: false });
    expect(freeze.sceneCompositionAdapterFreezeConsumerPolicy).toEqual({ immediateAllowedConsumers: ["NOL-7:9"], finalConsumerEntry: "NOL-7:9", directFeatureConsumptionAllowed: false, directAdapterCertificationConsumptionAllowed: false, internalPhaseImportAllowed: false, mutationAllowed: false, overrideAllowed: false, alternateEntryPointAllowed: false });
    expect(freeze.sceneCompositionAdapterFreezePublicIndexHandoff).toMatchObject({ nextPhase: "NOL-7:9", role: "sole-public-index-upstream", ready: true, requiresAdapterFreezeVerification: true, alternateConsumerEntryProhibited: true });
    expect([freeze.sceneCompositionAdapterFreezeDependencyPolicy, freeze.sceneCompositionAdapterFreezeCompatibilityPolicy, freeze.sceneCompositionAdapterFreezeConsumerPolicy, freeze.sceneCompositionAdapterFreezePublicIndexHandoff].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("passes deterministic structural verification and readiness guards", () => {
    const first = freeze.verifyNexoraObjectDirectorSceneCompositionAdapterFreeze(), second = freeze.verifyNexoraObjectDirectorSceneCompositionAdapterFreeze();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, lockActive: true, certifiedUpstreamValid: true, readyForPublicIndex: true, failedCheckCount: 0 });
    expect(first.passedCheckCount).toBe(first.checkResults.length);
    expect(new Set(first.checkResults.map(({ checkId }) => checkId)).size).toBe(first.checkResults.length);
    expect(deeplyFrozen(first)).toBe(true);
    expect(freeze.isNexoraObjectDirectorSceneCompositionAdapterFrozen()).toBe(true);
    expect(freeze.isNexoraObjectDirectorSceneCompositionAdapterReadyForPublicIndex()).toBe(true);
  });
  it("publishes 35 immutable capabilities and exactly 19 registry entries", () => {
    expect(freeze.getNexoraObjectDirectorSceneCompositionAdapterFreezeCapabilities()).toBe(freeze.sceneCompositionAdapterFreezeCapabilities);
    expect(freeze.sceneCompositionAdapterFreezeCapabilities).toHaveLength(35);
    expect(freeze.getNexoraObjectDirectorSceneCompositionAdapterFreezeCapabilityCount()).toBe(freeze.sceneCompositionAdapterFreezeCapabilities.length);
    const registry = freeze.getNexoraObjectDirectorSceneCompositionAdapterFreezeRegistry();
    expect(registry).toBe(freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeRegistry);
    expect(registry.map(({ section }) => section)).toEqual(["identity", "status", "lock", "certified-upstream", "invariant-categories", "invariants", "adapter-contract-surface", "adapter-certification-surface", "freeze-eligibility", "dependency-policy", "compatibility-policy", "consumer-policy", "public-index-handoff", "verification", "capabilities", "public-apis", "dependency", "readiness", "release-information"]);
    expect(registry.map(({ order }) => order)).toEqual([...registry.keys()]);
    expect(freeze.getNexoraObjectDirectorSceneCompositionAdapterFreezeRegistryCount()).toBe(19);
    expect(freeze.verifyNexoraObjectDirectorSceneCompositionAdapterFreezeRegistry().valid).toBe(true);
    expect(freeze.isNexoraObjectDirectorSceneCompositionAdapterFreezeRegistryFrozen()).toBe(true);
    expect([freeze.sceneCompositionAdapterFreezeCapabilities, registry].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("publishes exact release lineage and a dynamic immutable summary", () => {
    expect(freeze.sceneCompositionAdapterFreezeReleaseInformation.lineage).toEqual(["NOL-6:9", "NOL-7:1", "NOL-7:2", "NOL-7:3", "NOL-7:4", "NOL-7:5", "NOL-7:6", "NOL-7:7", "NOL-7:8"]);
    const summary = freeze.getNexoraObjectDirectorSceneCompositionAdapterFreezeSummary();
    expect(summary).toMatchObject({ identity: freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeId, version: "7.8.0", readiness: "ready-for-public-index", invariantCategoryCount: freeze.sceneCompositionAdapterFreezeInvariantCategories.length, invariantCount: freeze.sceneCompositionAdapterFreezeInvariants.length, adapterContractCount: freeze.sceneCompositionFrozenAdapterContractSurface.length, adapterCertificationSurfaceCount: freeze.sceneCompositionFrozenAdapterCertificationSurface.length, capabilityCount: freeze.sceneCompositionAdapterFreezeCapabilities.length, registryEntryCount: freeze.nexoraObjectDirectorSceneCompositionAdapterFreezeRegistry.length, soleDependency: upstream.nexoraObjectDirectorSceneCompositionAdapterCertificationId, nextPhase: "NOL-7:9" });
    expect([summary, freeze.sceneCompositionAdapterFreezeReleaseInformation].every((value) => deeplyFrozen(value))).toBe(true);
  });
  it("contains no recertification, execution, framework, effect, or unlock mechanism", () => {
    expect(source).not.toMatch(/\bcertifyNexoraObjectDirectorSceneCompositionAdapter\s*\(/);
    expect(source).not.toMatch(/\b(?:async|Promise|setTimeout|setInterval|addEventListener|fetch|XMLHttpRequest|WebSocket|console\.)\b/);
    expect(Object.keys(freeze).some((name) => /(?:unlock|reset|override|replace|patch|migration|unfreeze|executeAdapter|registerAdapter)/i.test(name))).toBe(false);
  });
});
