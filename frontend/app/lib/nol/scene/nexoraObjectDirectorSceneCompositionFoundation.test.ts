import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as bindingPublicIndex from "./nexoraObjectDirectorSceneBindingPublicIndex.ts";
import * as foundation from "./nexoraObjectDirectorSceneCompositionFoundation.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productionPath = resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionFoundation.ts");
const source = readFileSync(productionPath, "utf8");

function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}

function plainData(value: unknown, visited: object[] = []): boolean {
  if (value === null || ["string", "number", "boolean", "undefined"].includes(typeof value)) return true;
  if (typeof value === "function" || typeof value !== "object" || visited.includes(value as object)) return false;
  visited.push(value as object);
  const prototype = Object.getPrototypeOf(value);
  return (Array.isArray(value) || prototype === Object.prototype || prototype === null)
    && Object.values(value as Record<string, unknown>).every((child) => plainData(child, visited));
}

function expectCanonicalCollection(actual: readonly string[], expected: readonly string[]): void {
  expect(actual).toEqual(expected);
  expect(new Set(actual).size).toBe(actual.length);
  expect(deeplyFrozen(actual)).toBe(true);
}

describe("NOL-7:1 Director Scene Composition Foundation", () => {
  it("creates exactly the two requested NOL-7:1 files", () => {
    const files = readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionFoundation"));
    expect(files.sort()).toEqual([
      "nexoraObjectDirectorSceneCompositionFoundation.test.ts",
      "nexoraObjectDirectorSceneCompositionFoundation.ts",
    ]);
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });

  it("publishes the exact Foundation identity and release state", () => {
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationId).toBe("NOL-7:1/NexoraObjectDirectorSceneCompositionFoundation");
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationVersion).toBe("7.1.0");
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationNamespace).toBe("nexora.nol.scene.composition.foundation");
    expect(foundation.sceneCompositionFoundationStatus).toEqual({ foundation: true, released: true, immutable: true, stable: true, readiness: "ready-for-contracts" });
    expect(deeplyFrozen(foundation.sceneCompositionFoundationStatus)).toBe(true);
  });

  it("uses NOL-6:9 Public Index as its sole canonical production dependency", () => {
    const dependencies = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    expect(dependencies).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex"]);
    expect(source).not.toMatch(/SceneBinding(?:Foundation|Contracts|Validation|Certification|Freeze|Platform|AdapterCertification|AdapterFreeze)["']/);
    expect(source).not.toMatch(/from\s+["'][^"']*\/(?:runtime|renderer|director|ui|workspace|timeline|journal|assistant)[^"']*["']/i);
  });

  it("publishes the six canonical composition unit kinds", () => {
    expectCanonicalCollection(foundation.sceneCompositionUnitKinds, ["scene", "layer", "group", "node", "relationship", "annotation"]);
  });

  it("publishes the seven canonical semantic layer roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionLayerRoles, ["background", "context", "primary", "relationship", "support", "overlay", "attention"]);
  });

  it("publishes the seven canonical composition states without transitions", () => {
    expectCanonicalCollection(foundation.sceneCompositionStates, ["empty", "prepared", "active", "focused", "transitioning", "suspended", "archived"]);
  });

  it("publishes the seven canonical declarative composition modes", () => {
    expectCanonicalCollection(foundation.sceneCompositionModes, ["global", "goal", "object", "pack", "path", "comparison", "presentation"]);
  });

  it("publishes the seven canonical abstract placement roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionPlacementRoles, ["center", "orbit", "perimeter", "edge", "background", "overlay", "hidden"]);
  });

  it("publishes the seven canonical grouping roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionGroupingRoles, ["goal-related", "object-related", "pack-related", "dependency-related", "comparison-related", "status-related", "narrative-related"]);
  });

  it("publishes the ten canonical relationship presentation roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionRelationshipRoles, ["contains", "belongs-to", "depends-on", "influences", "supports", "conflicts-with", "flows-to", "derived-from", "compares-with", "focuses-on"]);
  });

  it("publishes the seven canonical focus roles without visual values", () => {
    expectCanonicalCollection(foundation.sceneCompositionFocusRoles, ["none", "candidate", "selected", "focused", "dominant", "contextual", "dimmed"]);
  });

  it("publishes the six canonical color-independent emphasis roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionEmphasisRoles, ["neutral", "informational", "positive", "attention", "warning", "critical"]);
  });

  it("publishes the five responsibility-only ownership roles", () => {
    expectCanonicalCollection(foundation.sceneCompositionOwnershipRoles, ["director", "workspace", "runtime", "renderer", "consumer"]);
  });

  it("defines readonly structural composition contracts only", () => {
    expect(source).toMatch(/type SceneCompositionOrder = Readonly<\{[\s\S]*?layerOrder: number;[\s\S]*?groupOrder: number;[\s\S]*?unitOrder: number;/);
    expect(source).toMatch(/type SceneCompositionIdentity = Readonly<\{/);
    expect(source).toMatch(/type SceneCompositionUnitIdentity = Readonly<\{/);
    expect(source).toMatch(/type SceneCompositionUnitFoundation = Readonly<\{/);
    expect(source).toMatch(/type NexoraObjectDirectorSceneCompositionFoundation = Readonly<\{/);
    expect(source).not.toMatch(/\b(?:position|coordinates|rotation|scale)\s*:/i);
  });

  it("publishes exact deeply frozen NOL-6:9 binding compatibility", () => {
    expect(foundation.sceneCompositionBindingCompatibility).toEqual({
      upstreamPhase: "NOL-6:9",
      upstreamIdentity: bindingPublicIndex.nexoraObjectDirectorSceneBindingPublicIndexId,
      supportedSceneNodeKinds: ["object", "group", "label", "badge", "connection", "anchor"],
      supportedRendererStates: ["minimum", "report", "operation"],
      supportedVisibilityValues: ["visible", "hidden", "collapsed"],
      supportedInteractionModes: ["none", "selectable", "focusable", "interactive"],
      compatible: true,
    });
    expect(foundation.sceneCompositionBindingCompatibility.supportedInteractionModes).not.toContain("actionable");
    expect(deeplyFrozen(foundation.sceneCompositionBindingCompatibility)).toBe(true);
    expect(plainData(foundation.sceneCompositionBindingCompatibility)).toBe(true);
  });

  it("verifies binding compatibility structurally and deterministically", () => {
    const first = foundation.verifyNexoraObjectDirectorSceneCompositionBindingCompatibility();
    const second = foundation.verifyNexoraObjectDirectorSceneCompositionBindingCompatibility();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ compatible: true, upstreamIdentityValid: true, rendererStatesValid: true, visibilityValuesValid: true, interactionModesValid: true, sceneNodeKindsAvailable: true });
    expect(first.checks).toHaveLength(5);
    expect(first.checks.every((check) => check.endsWith(":passed"))).toBe(true);
    expect(deeplyFrozen(first)).toBe(true);
    expect(plainData(first)).toBe(true);
  });

  it("publishes exactly thirteen ordered, unique, locked registry entries", () => {
    const registry = foundation.getNexoraObjectDirectorSceneCompositionFoundationRegistry();
    const categories = ["identity", "unit-kind", "layer-role", "state", "mode", "placement-role", "grouping-role", "relationship-role", "focus-role", "emphasis-role", "ownership-role", "order", "compatibility"];
    expect(registry).toBe(foundation.nexoraObjectDirectorSceneCompositionFoundationRegistry);
    expect(registry.map((entry) => entry.category)).toEqual(categories);
    expect(registry.map((entry) => entry.order)).toEqual(Array.from({ length: 13 }, (_, index) => index));
    expect(new Set(registry.map((entry) => entry.id)).size).toBe(13);
    expect(new Set(registry.map((entry) => entry.exportName)).size).toBe(13);
    expect(registry.every((entry) => entry.locked)).toBe(true);
    expect(deeplyFrozen(registry)).toBe(true);
    expect(plainData(registry)).toBe(true);
  });

  it("derives registry and public API counts from canonical collection lengths", () => {
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationRegistryCount).toBe(foundation.nexoraObjectDirectorSceneCompositionFoundationRegistry.length);
    expect(foundation.getNexoraObjectDirectorSceneCompositionFoundationRegistryCount()).toBe(foundation.nexoraObjectDirectorSceneCompositionFoundationRegistry.length);
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationPublicApiCount).toBe(foundation.nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface.length);
    expect(foundation.nexoraObjectDirectorSceneCompositionFoundationPublicApiCount).toBe(6);
    expect(deeplyFrozen(foundation.nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface)).toBe(true);
  });

  it("passes every deterministic Foundation verification check", () => {
    const first = foundation.verifyNexoraObjectDirectorSceneCompositionFoundation();
    const second = foundation.verifyNexoraObjectDirectorSceneCompositionFoundation();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, identityValid: true, vocabularyValid: true, registryValid: true, compatibilityValid: true, failedCheckCount: 0 });
    expect(first.checks).toHaveLength(19);
    expect(first.passedCheckCount).toBe(first.checks.length);
    expect(first.checks.every((check) => check.passed)).toBe(true);
    expect(new Set(first.checks.map((check) => check.id)).size).toBe(first.checks.length);
    expect(deeplyFrozen(first)).toBe(true);
    expect(plainData(first)).toBe(true);
  });

  it("reports the Foundation as deeply frozen with a zero-parameter guard", () => {
    expect(foundation.isNexoraObjectDirectorSceneCompositionFoundationFrozen.length).toBe(0);
    expect(foundation.isNexoraObjectDirectorSceneCompositionFoundationFrozen()).toBe(true);
    expect(foundation.isNexoraObjectDirectorSceneCompositionFoundationFrozen()).toBe(true);
  });

  it("returns the exact dynamic deeply frozen Foundation summary", () => {
    const summary = foundation.getNexoraObjectDirectorSceneCompositionFoundationSummary();
    expect(summary).toEqual({
      identity: foundation.nexoraObjectDirectorSceneCompositionFoundationId,
      version: foundation.nexoraObjectDirectorSceneCompositionFoundationVersion,
      namespace: foundation.nexoraObjectDirectorSceneCompositionFoundationNamespace,
      unitKindCount: foundation.sceneCompositionUnitKinds.length,
      layerRoleCount: foundation.sceneCompositionLayerRoles.length,
      stateCount: foundation.sceneCompositionStates.length,
      modeCount: foundation.sceneCompositionModes.length,
      placementRoleCount: foundation.sceneCompositionPlacementRoles.length,
      groupingRoleCount: foundation.sceneCompositionGroupingRoles.length,
      relationshipRoleCount: foundation.sceneCompositionRelationshipRoles.length,
      focusRoleCount: foundation.sceneCompositionFocusRoles.length,
      emphasisRoleCount: foundation.sceneCompositionEmphasisRoles.length,
      ownershipRoleCount: foundation.sceneCompositionOwnershipRoles.length,
      registryEntryCount: foundation.nexoraObjectDirectorSceneCompositionFoundationRegistry.length,
      soleDependency: bindingPublicIndex.nexoraObjectDirectorSceneBindingPublicIndexId,
      nextPhase: "NOL-7:2",
    });
    expect(summary).toEqual(foundation.getNexoraObjectDirectorSceneCompositionFoundationSummary());
    expect(deeplyFrozen(summary)).toBe(true);
    expect(plainData(summary)).toBe(true);
  });

  it("does not mutate or freeze imported NOL-6:9 values", () => {
    const before = JSON.stringify({
      identity: bindingPublicIndex.nexoraObjectDirectorSceneBindingPublicIndexId,
      rendererStates: bindingPublicIndex.sceneBindingPublicRendererStates,
      visibility: bindingPublicIndex.sceneBindingPublicVisibilityValues,
      interaction: bindingPublicIndex.sceneBindingPublicInteractionValues,
      types: bindingPublicIndex.sceneBindingPublicTypeRegistry,
    });
    const rendererIdentity = bindingPublicIndex.sceneBindingPublicRendererStates;
    foundation.verifyNexoraObjectDirectorSceneCompositionFoundation();
    foundation.verifyNexoraObjectDirectorSceneCompositionBindingCompatibility();
    expect(JSON.stringify({ identity: bindingPublicIndex.nexoraObjectDirectorSceneBindingPublicIndexId, rendererStates: bindingPublicIndex.sceneBindingPublicRendererStates, visibility: bindingPublicIndex.sceneBindingPublicVisibilityValues, interaction: bindingPublicIndex.sceneBindingPublicInteractionValues, types: bindingPublicIndex.sceneBindingPublicTypeRegistry })).toBe(before);
    expect(bindingPublicIndex.sceneBindingPublicRendererStates).toBe(rendererIdentity);
  });

  it("keeps every Foundation-owned runtime value deeply frozen plain data", () => {
    const values = [
      foundation.sceneCompositionFoundationStatus,
      foundation.sceneCompositionUnitKinds,
      foundation.sceneCompositionLayerRoles,
      foundation.sceneCompositionStates,
      foundation.sceneCompositionModes,
      foundation.sceneCompositionPlacementRoles,
      foundation.sceneCompositionGroupingRoles,
      foundation.sceneCompositionRelationshipRoles,
      foundation.sceneCompositionFocusRoles,
      foundation.sceneCompositionEmphasisRoles,
      foundation.sceneCompositionOwnershipRoles,
      foundation.sceneCompositionBindingCompatibility,
      foundation.nexoraObjectDirectorSceneCompositionFoundationRegistry,
      foundation.nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface,
      foundation.verifyNexoraObjectDirectorSceneCompositionBindingCompatibility(),
      foundation.verifyNexoraObjectDirectorSceneCompositionFoundation(),
      foundation.getNexoraObjectDirectorSceneCompositionFoundationSummary(),
    ];
    for (const value of values) {
      expect(deeplyFrozen(value)).toBe(true);
      expect(plainData(value)).toBe(true);
    }
  });

  it("preserves NOL-6:9 readiness and public interaction terminology", () => {
    expect(bindingPublicIndex.verifyNexoraObjectDirectorSceneBindingPublicIndex().valid).toBe(true);
    expect(bindingPublicIndex.isNexoraObjectDirectorSceneBindingReadyForConsumer()).toBe(true);
    expect(bindingPublicIndex.sceneBindingPublicInteractionValues).toEqual(["none", "selectable", "focusable", "interactive"]);
    expect(foundation.sceneCompositionBindingCompatibility.supportedInteractionModes).toEqual(bindingPublicIndex.sceneBindingPublicInteractionValues);
  });

  it("contains no live composition, rendering, framework, effects, or mutation behavior", () => {
    expect(source).not.toMatch(/\basync\s+(?:function|\()/);
    expect(source).not.toMatch(/\b(?:await|Promise|setTimeout|setInterval|requestAnimationFrame|fetch|window|document|localStorage|sessionStorage|Math\.random|Date\b|Worker|process|console\.)\b/);
    expect(source).not.toMatch(/\b(?:useState|useEffect|createElement|addEventListener|dispatchEvent|subscribe|observe)\s*\(/);
    expect(source).not.toMatch(/class\s+[A-Za-z_$]|extends\s+[A-Za-z_$]|new\s+(?:Map|Set|Date|Promise|Scene|Mesh|Object3D)\s*\(/);
    expect(source).not.toMatch(/\b(?:compose|layout|transition|animate|mount|render|execute|createScene|createNode|createBinding)\s*\(/);
    expect(Object.keys(foundation).some((name) => /(?:set|add|remove|update|mutate|reset|unlock|override|patch)/i.test(name))).toBe(false);
  });
});
