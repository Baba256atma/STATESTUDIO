import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as bindingPublicIndex from "./nexoraObjectDirectorSceneBindingPublicIndex.ts";
import * as foundation from "./nexoraObjectDirectorSceneCompositionFoundation.ts";
import * as contracts from "./nexoraObjectDirectorSceneCompositionContracts.ts";
import * as validation from "./nexoraObjectDirectorSceneCompositionValidation.ts";
import * as certification from "./nexoraObjectDirectorSceneCompositionCertification.ts";
import * as freeze from "./nexoraObjectDirectorSceneCompositionFreeze.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification", async () => import("./nexoraObjectDirectorSceneCompositionCertification.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionValidation", async () => import("./nexoraObjectDirectorSceneCompositionValidation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productionPath = resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionFreeze.ts");
const source = readFileSync(productionPath, "utf8");

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

describe("NOL-7:5 Director Scene Composition Freeze", () => {
  it("creates exactly the two requested NOL-7:5 files", () => {
    expect(readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionFreeze")).sort()).toEqual(["nexoraObjectDirectorSceneCompositionFreeze.test.ts", "nexoraObjectDirectorSceneCompositionFreeze.ts"]);
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });

  it("publishes the exact identity and immutable release status", () => {
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeId).toBe("NOL-7:5/NexoraObjectDirectorSceneCompositionFreeze");
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeVersion).toBe("7.5.0");
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeNamespace).toBe("nexora.nol.scene.composition.freeze");
    expect(freeze.sceneCompositionFreezeStatus).toEqual({ released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-platform" });
    expect(deeplyFrozen(freeze.sceneCompositionFreezeStatus)).toBe(true);
  });

  it("imports only the canonical NOL-7:4 Certification dependency", () => {
    expect([...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionCertification"]);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:CompositionValidation|CompositionContracts|CompositionFoundation|SceneBinding|\/runtime|\/renderer|three|react|\/ui|Platform|PublicIndex)[^"']*["']/i);
  });

  it("publishes the exact active irreversible lock and no mutation API", () => {
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeLock).toEqual({ lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-LOCKED", active: true, reversible: false, scope: "director-scene-composition", version: "7.5.0" });
    expect(deeplyFrozen(freeze.nexoraObjectDirectorSceneCompositionFreezeLock)).toBe(true);
    const exportedNames = Object.keys(freeze);
    expect(exportedNames.some((name) => /(?:unlock|reset|override|replace|patch|migration)/i.test(name))).toBe(false);
  });

  it("locks the structurally verified NOL-7:4 upstream identity", () => {
    expect(freeze.sceneCompositionFrozenUpstream).toEqual({ identity: certification.nexoraObjectDirectorSceneCompositionCertificationId, version: "7.4.0", namespace: "nexora.nol.scene.composition.certification", dependencyRole: "sole-certified-upstream", requiredOutcome: "certified", requiresFreezeEligibility: true, requiredReadiness: "ready-for-freeze" });
    expect(deeplyFrozen(freeze.sceneCompositionFrozenUpstream)).toBe(true);
  });

  it("publishes ten canonical invariant categories and all 91 locked invariants", () => {
    expect(freeze.sceneCompositionFreezeInvariantCategories).toEqual(["identity", "dependency", "certification", "composition", "compatibility", "immutability", "api", "registry", "consumer", "release"]);
    expect(freeze.sceneCompositionFreezeInvariantCount).toBe(91);
    expect(freeze.sceneCompositionFreezeInvariantCount).toBe(freeze.sceneCompositionFreezeInvariants.length);
    expect(new Set(freeze.sceneCompositionFreezeInvariants.map((item) => item.id)).size).toBe(91);
    expect(freeze.sceneCompositionFreezeInvariants.every((item) => item.mandatory && item.locked)).toBe(true);
    expect(freeze.sceneCompositionFreezeInvariants.map((item) => item.category).filter((category, index, values) => index === 0 || values[index - 1] !== category)).toEqual(freeze.sceneCompositionFreezeInvariantCategories);
    expect(deeplyFrozen(freeze.sceneCompositionFreezeInvariantCategories)).toBe(true);
    expect(deeplyFrozen(freeze.sceneCompositionFreezeInvariants)).toBe(true);
  });

  it("contains every required invariant family", () => {
    const ids = freeze.sceneCompositionFreezeInvariants.map((item) => item.id);
    for (const id of ["scene-composition-freeze-identity-fixed", "scene-composition-certification-is-sole-production-dependency", "freeze-eligible-result-required", "composition-vocabulary-preserved", "nol-6-binding-compatibility-preserved", "all-freeze-exports-deeply-frozen", "freeze-public-api-identities-fixed", "freeze-registry-verifiable", "platform-is-only-immediate-consumer", "all-mandatory-invariants-pass"] as const) expect(ids).toContain(id);
    expect(freeze.sceneCompositionFreezeInvariants.filter((item) => item.category === "identity")).toHaveLength(5);
    expect(freeze.sceneCompositionFreezeInvariants.filter((item) => item.category === "dependency")).toHaveLength(13);
    expect(freeze.sceneCompositionFreezeInvariants.filter((item) => item.category === "certification")).toHaveLength(9);
    expect(freeze.sceneCompositionFreezeInvariants.filter((item) => item.category === "composition")).toHaveLength(18);
    expect(freeze.sceneCompositionFreezeInvariants.filter((item) => item.category === "compatibility")).toHaveLength(11);
  });

  it("locks the complete ten-entry Foundation vocabulary metadata surface", () => {
    const surface = freeze.getNexoraObjectDirectorSceneCompositionFrozenVocabularySurface();
    expect(surface).toBe(freeze.sceneCompositionFrozenVocabularySurface);
    expect(surface.map((item) => item.exportName)).toEqual(["sceneCompositionUnitKinds", "sceneCompositionLayerRoles", "sceneCompositionStates", "sceneCompositionModes", "sceneCompositionPlacementRoles", "sceneCompositionGroupingRoles", "sceneCompositionRelationshipRoles", "sceneCompositionFocusRoles", "sceneCompositionEmphasisRoles", "sceneCompositionOwnershipRoles"]);
    expect(surface.every((item) => item.sourcePhase === "NOL-7:1" && item.locked)).toBe(true);
    expect(freeze.getNexoraObjectDirectorSceneCompositionFrozenVocabularyCount()).toBe(surface.length);
    expect(deeplyFrozen(surface)).toBe(true);
    expect(executablePresent(surface)).toBe(false);
  });

  it("locks approved NOL-7:2 contract identities without internal helpers", () => {
    const surface = freeze.getNexoraObjectDirectorSceneCompositionFrozenContractSurface();
    expect(surface).toBe(freeze.sceneCompositionFrozenContractSurface);
    expect(surface).toHaveLength(19);
    expect(surface.map((item) => item.exportName)).toEqual(expect.arrayContaining(["NexoraObjectDirectorSceneCompositionContract", "SceneCompositionUnitContract", "SceneCompositionRelationshipContract", "SceneCompositionSnapshotContract", "SceneCompositionBindingCompatibilityContract"]));
    expect(surface.every((item) => item.sourcePhase === "NOL-7:2" && item.locked && !/helper|internal/i.test(item.exportName))).toBe(true);
    expect(new Set(surface.map((item) => item.exportName)).size).toBe(surface.length);
    expect(freeze.getNexoraObjectDirectorSceneCompositionFrozenContractCount()).toBe(surface.length);
    expect(deeplyFrozen(surface)).toBe(true);
  });

  it("locks approved NOL-7:3 Validation metadata and APIs", () => {
    const surface = freeze.getNexoraObjectDirectorSceneCompositionFrozenValidationSurface();
    expect(surface).toBe(freeze.sceneCompositionFrozenValidationSurface);
    expect(surface.map((item) => item.exportName)).toEqual(expect.arrayContaining(["sceneCompositionValidationCodes", "SceneCompositionValidationResult", "validateNexoraObjectDirectorSceneComposition", "isNexoraObjectDirectorSceneCompositionValidationResult", "getNexoraObjectDirectorSceneCompositionValidationSummary", "nexoraObjectDirectorSceneCompositionValidationRegistry"]));
    expect(surface.every((item) => item.sourcePhase === "NOL-7:3" && item.locked && item.platformVisible)).toBe(true);
    expect(new Set(surface.map((item) => item.exportName)).size).toBe(surface.length);
    expect(freeze.getNexoraObjectDirectorSceneCompositionFrozenValidationCount()).toBe(surface.length);
    expect(deeplyFrozen(surface)).toBe(true);
    expect(executablePresent(surface)).toBe(false);
  });

  it("locks approved NOL-7:4 Certification metadata and APIs", () => {
    const surface = freeze.getNexoraObjectDirectorSceneCompositionFrozenCertificationSurface();
    expect(surface).toBe(freeze.sceneCompositionFrozenCertificationSurface);
    expect(surface.map((item) => item.exportName)).toEqual(expect.arrayContaining([...certification.nexoraObjectDirectorSceneCompositionCertificationPrimaryPublicApiSurface, "sceneCompositionCertificationRequirements", "SceneCompositionCertificationResult", "nexoraObjectDirectorSceneCompositionCertificationRegistry"]));
    expect(surface.every((item) => item.sourcePhase === "NOL-7:4" && item.locked && item.platformVisible)).toBe(true);
    expect(new Set(surface.map((item) => item.exportName)).size).toBe(surface.length);
    expect(freeze.getNexoraObjectDirectorSceneCompositionFrozenCertificationCount()).toBe(surface.length);
    expect(deeplyFrozen(surface)).toBe(true);
  });

  it("prohibits semantic drift through the exact compatibility policy", () => {
    expect(freeze.sceneCompositionFreezeCompatibilityPolicy).toEqual({ semanticVersion: "7.5.0", backwardCompatibilityRequired: true, publicTerminologyStable: true, compositionVocabularyStable: true, contractIdentityStable: true, validationSemanticsStable: true, certificationSemanticsStable: true, additiveChangesAllowed: false, breakingChangesAllowed: false, mutationAllowed: false, directOverrideAllowed: false, extensionRequiresNewPhase: true, validationBypassAllowed: false, certificationBypassAllowed: false, sceneBindingCompatibilityBypassAllowed: false });
    expect(deeplyFrozen(freeze.sceneCompositionFreezeCompatibilityPolicy)).toBe(true);
  });

  it("publishes the exact consumer policy and Platform handoff", () => {
    expect(freeze.sceneCompositionFreezeConsumerPolicy).toEqual({ immediateAllowedConsumers: ["NOL-7:6"], eventualConsumerEntry: "NOL-7:9", directFeatureConsumptionAllowed: false, internalContractImportAllowed: false, mutationAllowed: false, overrideAllowed: false });
    expect(freeze.sceneCompositionFreezePlatformHandoff).toEqual({ nextPhase: "NOL-7:6", role: "sole-platform-upstream", ready: true, requiresFreezeVerification: true, requiresRegistryVerification: true, directFeatureImportsProhibited: true });
    expect(deeplyFrozen(freeze.sceneCompositionFreezeConsumerPolicy)).toBe(true);
    expect(deeplyFrozen(freeze.sceneCompositionFreezePlatformHandoff)).toBe(true);
  });

  it("preserves exact public NOL-6 terminology through the verified lineage", () => {
    expect(bindingPublicIndex.sceneBindingPublicVisibilityValues).toEqual(["visible", "hidden", "collapsed"]);
    expect(bindingPublicIndex.sceneBindingPublicInteractionValues).toEqual(["none", "selectable", "focusable", "interactive"]);
    expect(bindingPublicIndex.sceneBindingPublicRendererStates).toEqual(["minimum", "report", "operation"]);
    expect(bindingPublicIndex.sceneBindingPublicInteractionValues).not.toContain("actionable");
    expect(freeze.verifyNexoraObjectDirectorSceneCompositionFreeze().checkResults.find((item) => item.checkId === "binding-terminology")?.passed).toBe(true);
  });

  it("passes deterministic deeply frozen structural Freeze verification", () => {
    const first = freeze.verifyNexoraObjectDirectorSceneCompositionFreeze(), second = freeze.verifyNexoraObjectDirectorSceneCompositionFreeze();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, lockActive: true, readyForPlatform: true, failedCheckCount: 0 });
    expect(first.passedCheckCount).toBe(first.checkResults.length);
    expect(new Set(first.checkResults.map((item) => item.checkId)).size).toBe(first.checkResults.length);
    expect(first.checkResults.every((item) => item.passed)).toBe(true);
    expect(deeplyFrozen(first)).toBe(true);
  });

  it("reports frozen and ready for Platform deterministically through zero-parameter guards", () => {
    expect(freeze.isNexoraObjectDirectorSceneCompositionFrozen.length).toBe(0);
    expect(freeze.isNexoraObjectDirectorSceneCompositionReadyForPlatform.length).toBe(0);
    expect(freeze.isNexoraObjectDirectorSceneCompositionFrozen()).toBe(true);
    expect(freeze.isNexoraObjectDirectorSceneCompositionReadyForPlatform()).toBe(true);
    expect(freeze.isNexoraObjectDirectorSceneCompositionReadyForPlatform()).toBe(true);
  });

  it("publishes a dynamic immutable Freeze summary", () => {
    const summary = freeze.getNexoraObjectDirectorSceneCompositionFreezeSummary();
    expect(summary).toEqual({ identity: freeze.nexoraObjectDirectorSceneCompositionFreezeId, version: "7.5.0", namespace: "nexora.nol.scene.composition.freeze", lockId: "NOL-7-DIRECTOR-SCENE-COMPOSITION-LOCKED", released: true, certified: true, frozen: true, stable: true, readiness: "ready-for-platform", invariantCount: freeze.sceneCompositionFreezeInvariants.length, frozenVocabularyCount: freeze.sceneCompositionFrozenVocabularySurface.length, frozenContractCount: freeze.sceneCompositionFrozenContractSurface.length, frozenValidationApiCount: freeze.sceneCompositionFrozenValidationSurface.length, frozenCertificationApiCount: freeze.sceneCompositionFrozenCertificationSurface.length, registryEntryCount: freeze.nexoraObjectDirectorSceneCompositionFreezeRegistry.length, soleDependency: certification.nexoraObjectDirectorSceneCompositionCertificationId, nextPhase: "NOL-7:6" });
    expect(freeze.getNexoraObjectDirectorSceneCompositionFreezeSummary()).toEqual(summary);
    expect(deeplyFrozen(summary)).toBe(true);
  });

  it("publishes exactly 12 primary APIs, 4 registry APIs, and 32 capabilities", () => {
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiCount).toBe(12);
    expect(new Set(freeze.nexoraObjectDirectorSceneCompositionFreezePrimaryPublicApiSurface).size).toBe(12);
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeCapabilityCount).toBe(32);
    expect(new Set(freeze.nexoraObjectDirectorSceneCompositionFreezeCapabilities).size).toBe(32);
    expect(deeplyFrozen(freeze.nexoraObjectDirectorSceneCompositionFreezeCapabilities)).toBe(true);
    for (const name of ["getNexoraObjectDirectorSceneCompositionFreezeRegistry", "getNexoraObjectDirectorSceneCompositionFreezeRegistryCount", "verifyNexoraObjectDirectorSceneCompositionFreezeRegistry", "isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen"] as const) expect(typeof freeze[name]).toBe("function");
  });

  it("publishes the exact ordered frozen 19-section registry", () => {
    const registry = freeze.getNexoraObjectDirectorSceneCompositionFreezeRegistry();
    expect(registry).toBe(freeze.nexoraObjectDirectorSceneCompositionFreezeRegistry);
    expect(registry.map((item) => item.section)).toEqual(["Identity", "Release Status", "Freeze Lock", "Certified Upstream", "Invariant Categories", "Freeze Invariants", "Frozen Vocabulary Surface", "Frozen Contract Surface", "Frozen Validation Surface", "Frozen Certification Surface", "Compatibility Policy", "Consumer Policy", "Platform Handoff", "Verification Contracts", "Public APIs", "Dependency Boundary", "Freeze Capabilities", "Readiness", "Release Information"]);
    expect(registry.every((item, index) => item.order === index && item.locked)).toBe(true);
    expect(freeze.getNexoraObjectDirectorSceneCompositionFreezeRegistryCount()).toBe(registry.length);
    expect(freeze.nexoraObjectDirectorSceneCompositionFreezeRegistryCount).toBe(19);
    expect(freeze.isNexoraObjectDirectorSceneCompositionFreezeRegistryFrozen()).toBe(true);
    expect(freeze.verifyNexoraObjectDirectorSceneCompositionFreezeRegistry()).toMatchObject({ valid: true, ordered: true, unique: true, countValid: true, publicApisValid: true, capabilitiesValid: true, frozen: true, violations: [] });
    expect(deeplyFrozen(registry)).toBe(true);
  });

  it("does not mutate or freeze imported upstream values", () => {
    const registry = certification.nexoraObjectDirectorSceneCompositionCertificationRegistry;
    const before = JSON.stringify(registry), wasFrozen = Object.isFrozen(registry);
    freeze.verifyNexoraObjectDirectorSceneCompositionFreeze();
    freeze.getNexoraObjectDirectorSceneCompositionFreezeSummary();
    expect(JSON.stringify(registry)).toBe(before);
    expect(Object.isFrozen(registry)).toBe(wasFrozen);
  });

  it("preserves every upstream verification boundary", () => {
    expect(certification.verifyNexoraObjectDirectorSceneCompositionCertificationRegistry().valid).toBe(true);
    expect(validation.verifyNexoraObjectDirectorSceneCompositionValidationRegistry().valid).toBe(true);
    expect(contracts.verifyNexoraObjectDirectorSceneCompositionContracts().valid).toBe(true);
    expect(foundation.verifyNexoraObjectDirectorSceneCompositionFoundation().valid).toBe(true);
    expect(bindingPublicIndex.verifyNexoraObjectDirectorSceneBindingPublicIndex().valid).toBe(true);
  });

  it("contains metadata only and no forbidden execution mechanism", () => {
    expect(source).not.toMatch(/\b(?:class\s+\w+|constructor\s*\(|async\s+function|await\s+|new\s+Promise|setTimeout\s*\(|setInterval\s*\(|addEventListener\s*\(|console\.|Math\.random|Date\.now|process\.env)/);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:three|react|canvas|webgl|runtime|renderer|platform)[^"']*["']/i);
    expect(source).not.toMatch(/\b(?:certifyNexoraObjectDirectorSceneComposition|validateNexoraObjectDirectorSceneComposition)\s*\(/);
    expect(executablePresent(freeze.nexoraObjectDirectorSceneCompositionFreezeRegistry)).toBe(false);
  });
});
