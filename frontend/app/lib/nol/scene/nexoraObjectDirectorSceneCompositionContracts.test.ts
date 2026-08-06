import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as bindingPublicIndex from "./nexoraObjectDirectorSceneBindingPublicIndex.ts";
import * as foundation from "./nexoraObjectDirectorSceneCompositionFoundation.ts";
import * as contracts from "./nexoraObjectDirectorSceneCompositionContracts.ts";
import type {
  NexoraObjectDirectorSceneCompositionContract,
  SceneCompositionAnnotationContract,
  SceneCompositionAnnotationId,
  SceneCompositionBindingCompatibilityContract,
  SceneCompositionCollectionContract,
  SceneCompositionEmphasisContract,
  SceneCompositionFocusContract,
  SceneCompositionGroupContract,
  SceneCompositionGroupId,
  SceneCompositionId,
  SceneCompositionIdentityContract,
  SceneCompositionLayerContract,
  SceneCompositionLayerId,
  SceneCompositionMetadataContract,
  SceneCompositionNodeReferenceContract,
  SceneCompositionNodeReferenceId,
  SceneCompositionOrderingContract,
  SceneCompositionOwnershipContract,
  SceneCompositionPlacementContract,
  SceneCompositionRelationshipContract,
  SceneCompositionRelationshipEndpointContract,
  SceneCompositionRelationshipId,
  SceneCompositionSnapshotContract,
  SceneCompositionUnitContract,
  SceneCompositionUnitId,
  SceneCompositionUnitMetadataContract,
} from "./nexoraObjectDirectorSceneCompositionContracts.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

type ContractAvailabilityProbe = Readonly<{
  compositionId: SceneCompositionId;
  unitId: SceneCompositionUnitId;
  layerId: SceneCompositionLayerId;
  groupId: SceneCompositionGroupId;
  relationshipId: SceneCompositionRelationshipId;
  annotationId: SceneCompositionAnnotationId;
  nodeReferenceId: SceneCompositionNodeReferenceId;
  metadata: SceneCompositionMetadataContract | null;
  identity: SceneCompositionIdentityContract | null;
  scene: NexoraObjectDirectorSceneCompositionContract | null;
  layer: SceneCompositionLayerContract | null;
  group: SceneCompositionGroupContract | null;
  unit: SceneCompositionUnitContract | null;
  unitMetadata: SceneCompositionUnitMetadataContract | null;
  nodeReference: SceneCompositionNodeReferenceContract | null;
  placement: SceneCompositionPlacementContract | null;
  focus: SceneCompositionFocusContract | null;
  emphasis: SceneCompositionEmphasisContract | null;
  ownership: SceneCompositionOwnershipContract | null;
  endpoint: SceneCompositionRelationshipEndpointContract | null;
  relationship: SceneCompositionRelationshipContract | null;
  annotation: SceneCompositionAnnotationContract | null;
  ordering: SceneCompositionOrderingContract | null;
  collection: SceneCompositionCollectionContract | null;
  snapshot: SceneCompositionSnapshotContract | null;
  compatibility: SceneCompositionBindingCompatibilityContract | null;
}>;

const contractAvailabilityProbe: ContractAvailabilityProbe = {
  compositionId: "composition",
  unitId: "unit",
  layerId: "layer",
  groupId: "group",
  relationshipId: "relationship",
  annotationId: "annotation",
  nodeReferenceId: "node-reference",
  metadata: null,
  identity: null,
  scene: null,
  layer: null,
  group: null,
  unit: null,
  unitMetadata: null,
  nodeReference: null,
  placement: null,
  focus: null,
  emphasis: null,
  ownership: null,
  endpoint: null,
  relationship: null,
  annotation: null,
  ordering: null,
  collection: null,
  snapshot: null,
  compatibility: null,
};

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productionPath = resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionContracts.ts");
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

describe("NOL-7:2 Director Scene Composition Contracts", () => {
  it("creates exactly the two requested NOL-7:2 files", () => {
    const files = readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionContracts"));
    expect(files.sort()).toEqual(["nexoraObjectDirectorSceneCompositionContracts.test.ts", "nexoraObjectDirectorSceneCompositionContracts.ts"]);
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });

  it("publishes the exact Contracts identity and immutable release state", () => {
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsId).toBe("NOL-7:2/NexoraObjectDirectorSceneCompositionContracts");
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsVersion).toBe("7.2.0");
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsNamespace).toBe("nexora.nol.scene.composition.contracts");
    expect(contracts.sceneCompositionContractsStatus).toEqual({ contracts: true, released: true, immutable: true, stable: true, readiness: "ready-for-validation" });
    expect(deeplyFrozen(contracts.sceneCompositionContractsStatus)).toBe(true);
  });

  it("imports only the canonical NOL-7:1 Foundation dependency", () => {
    const dependencies = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    expect(dependencies).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation"]);
    expect(source).not.toMatch(/from\s+["'][^"']*SceneBinding/i);
    expect(source).not.toMatch(/from\s+["'][^"']*\/(?:runtime|renderer|director|ui|workspace|timeline|journal|assistant|validation|certification|freeze)[^"']*["']/i);
  });

  it("makes all seven identifier aliases and nineteen major contracts available", () => {
    expect(Object.keys(contractAvailabilityProbe)).toHaveLength(26);
    expect(Object.values(contractAvailabilityProbe).slice(0, 7).every((value) => typeof value === "string")).toBe(true);
    expect(Object.values(contractAvailabilityProbe).slice(7).every((value) => value === null)).toBe(true);
  });

  it("defines all contract shapes as readonly type-only structures", () => {
    const readonlyContracts = [...source.matchAll(/export type ([A-Za-z]+Contract) = Readonly<\{/g)].map((match) => match[1]);
    expect(readonlyContracts).toContain("SceneCompositionMetadataContract");
    expect(readonlyContracts).toContain("SceneCompositionIdentityContract");
    expect(readonlyContracts).toContain("NexoraObjectDirectorSceneCompositionContract");
    expect(readonlyContracts).toContain("SceneCompositionSnapshotContract");
    expect(readonlyContracts).toContain("SceneCompositionBindingCompatibilityContract");
    expect(source).not.toMatch(/\b(?:onClick|onChange|callback|handler)\s*:/i);
  });

  it("defines the complete root composition contract", () => {
    const block = source.match(/export type NexoraObjectDirectorSceneCompositionContract = Readonly<\{([\s\S]*?)\n\}>;/)?.[1] ?? "";
    for (const field of ["identity", "metadata", "state", "mode", "ownership", "layers", "relationships", "annotations", "focus", "bindingCompatibility"]) expect(block).toContain(`${field}:`);
    expect(block).toContain("layers: readonly SceneCompositionLayerContract[]");
    expect(block).toContain("relationships: readonly SceneCompositionRelationshipContract[]");
    expect(block).toContain("annotations: readonly SceneCompositionAnnotationContract[]");
  });

  it("defines semantic layer and group contracts", () => {
    expect(source).toMatch(/type SceneCompositionLayerContract = Readonly<\{[\s\S]*?layerId:[\s\S]*?role:[\s\S]*?order: number;[\s\S]*?visible: boolean;[\s\S]*?groups: readonly[\s\S]*?units: readonly/);
    expect(source).toMatch(/type SceneCompositionGroupContract = Readonly<\{[\s\S]*?groupId:[\s\S]*?unitIds: readonly SceneCompositionUnitId\[];[\s\S]*?focusRole:[\s\S]*?emphasisRole:/);
    expect(source).not.toMatch(/\bzIndex\s*:/);
  });

  it("defines an abstract unit contract with ID-based node separation", () => {
    const block = source.match(/export type SceneCompositionUnitContract = Readonly<\{([\s\S]*?)\n\}>;/)?.[1] ?? "";
    for (const field of ["unitId", "kind", "layerId", "nodeReference", "placement", "focusRole", "emphasisRole", "order", "metadata"]) expect(block).toContain(`${field}:`);
    expect(block).toContain("SceneCompositionNodeReferenceContract | null");
    expect(block).not.toMatch(/\b(?:coordinates|vector|transform|rendererObject)\b/i);
  });

  it("defines plain unit metadata and binding-node references", () => {
    expect(source).toMatch(/type SceneCompositionUnitMetadataContract = Readonly<\{[\s\S]*?caption:[\s\S]*?semanticRole:[\s\S]*?labels: readonly string\[];[\s\S]*?presentationHint:/);
    expect(source).toMatch(/type SceneCompositionNodeReferenceContract = Readonly<\{[\s\S]*?nodeReferenceId:[\s\S]*?sceneBindingNodeId: string;[\s\S]*?sceneBindingKind: string;[\s\S]*?required: boolean;/);
  });

  it("defines abstract placement, focus, emphasis, and ownership contracts", () => {
    expect(source).toMatch(/type SceneCompositionPlacementContract = Readonly<\{[\s\S]*?role:[\s\S]*?anchorUnitId:[\s\S]*?relativeOrder: number;/);
    expect(source).toMatch(/type SceneCompositionFocusContract = Readonly<\{[\s\S]*?activeUnitId:[\s\S]*?activeGroupId:[\s\S]*?activeLayerId:[\s\S]*?role:[\s\S]*?reason:/);
    expect(source).toMatch(/type SceneCompositionEmphasisContract = Readonly<\{[\s\S]*?role:[\s\S]*?reason:[\s\S]*?source:/);
    expect(source).toMatch(/type SceneCompositionOwnershipContract = Readonly<\{[\s\S]*?owner:[\s\S]*?sourceId:[\s\S]*?delegated: boolean;/);
  });

  it("defines semantic endpoint and relationship contracts without geometry", () => {
    expect(source).toMatch(/type SceneCompositionRelationshipEndpointContract = Readonly<\{[\s\S]*?unitId:[\s\S]*?role: "source" \| "target";/);
    const block = source.match(/export type SceneCompositionRelationshipContract = Readonly<\{([\s\S]*?)\n\}>;/)?.[1] ?? "";
    for (const field of ["relationshipId", "role", "source", "target", "directed", "order", "label", "emphasis"]) expect(block).toContain(`${field}:`);
    expect(block).not.toMatch(/\b(?:geometry|pathPoints|lineStyle|material|timing)\b/i);
  });

  it("defines semantic annotations with exact supported kinds", () => {
    const block = source.match(/export type SceneCompositionAnnotationContract = Readonly<\{([\s\S]*?)\n\}>;/)?.[1] ?? "";
    expect(block).toContain('kind: "label" | "status" | "direction" | "explanation"');
    for (const field of ["annotationId", "unitId", "relationshipId", "text", "emphasis", "order"]) expect(block).toContain(`${field}:`);
    expect(block).not.toMatch(/\b(?:jsx|html|component)\b/i);
  });

  it("defines readonly canonical ordering, collection, and snapshot contracts", () => {
    const ordering = source.match(/export type SceneCompositionOrderingContract = Readonly<\{([\s\S]*?)\n\}>;/)?.[1] ?? "";
    for (const field of ["layerOrder", "groupOrder", "unitOrder", "relationshipOrder", "annotationOrder"]) expect(ordering).toContain(`${field}: readonly`);
    expect(source).toMatch(/type SceneCompositionCollectionContract = Readonly<\{[\s\S]*?compositions: readonly[\s\S]*?activeCompositionId:[\s\S]*?order: readonly/);
    expect(source).toMatch(/type SceneCompositionSnapshotContract = Readonly<\{[\s\S]*?snapshotId:[\s\S]*?compositionId:[\s\S]*?state:[\s\S]*?mode:[\s\S]*?focus:[\s\S]*?ordering:/);
  });

  it("publishes exact immutable binding compatibility terminology", () => {
    expect(contracts.sceneCompositionBindingCompatibilityContract).toEqual({
      upstreamPhase: "NOL-6:9",
      upstreamIdentity: bindingPublicIndex.nexoraObjectDirectorSceneBindingPublicIndexId,
      requiredPublicTerminology: {
        visibility: ["visible", "hidden", "collapsed"],
        interaction: ["none", "selectable", "focusable", "interactive"],
        rendererState: ["minimum", "report", "operation"],
      },
      compatible: true,
    });
    expect(contracts.sceneCompositionBindingCompatibilityContract.requiredPublicTerminology.interaction).not.toContain("actionable");
    expect(deeplyFrozen(contracts.sceneCompositionBindingCompatibilityContract)).toBe(true);
  });

  it("publishes all fifty ordered, unique, required, locked requirements", () => {
    const requirements = contracts.getNexoraObjectDirectorSceneCompositionContractRequirements();
    const ids = requirements.map((entry) => entry.id);
    const requiredIds = ["composition-id-required", "scene-layer-collection-required", "layer-collections-readonly", "group-unit-references-only", "unit-placement-required", "relationship-renderer-data-prohibited", "annotation-ui-reference-prohibited", "focus-transition-logic-prohibited", "ordering-normalization-prohibited", "interactive-term-preserved", "actionable-term-excluded", "no-mutable-collections"];
    expect(requirements).toBe(contracts.sceneCompositionContractRequirements);
    expect(requirements).toHaveLength(50);
    expect(requiredIds.every((id) => ids.includes(id as never))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(requirements.map((entry) => entry.category))).toEqual(new Set(["identity", "scene", "layer", "group", "unit", "relationship", "annotation", "focus", "ordering", "compatibility", "immutability"]));
    expect(requirements.every((entry) => entry.required && entry.locked && entry.description.length > 0)).toBe(true);
    expect(deeplyFrozen(requirements)).toBe(true);
  });

  it("derives the requirement count from the canonical collection", () => {
    expect(contracts.sceneCompositionContractRequirementCount).toBe(contracts.sceneCompositionContractRequirements.length);
    expect(contracts.getNexoraObjectDirectorSceneCompositionContractRequirementCount()).toBe(contracts.sceneCompositionContractRequirements.length);
  });

  it("publishes exactly seventeen ordered canonical contract definitions", () => {
    const definitions = contracts.getNexoraObjectDirectorSceneCompositionContractDefinitions();
    const ids = ["composition-identity", "composition-metadata", "scene-composition", "composition-layer", "composition-group", "composition-unit", "composition-unit-metadata", "composition-node-reference", "composition-placement", "composition-focus", "composition-emphasis", "composition-ownership", "composition-relationship-endpoint", "composition-relationship", "composition-annotation", "composition-ordering-and-collections", "composition-binding-compatibility"];
    expect(definitions).toBe(contracts.sceneCompositionContractDefinitions);
    expect(definitions.map((entry) => entry.contractId)).toEqual(ids);
    expect(new Set(definitions.map((entry) => entry.contractId)).size).toBe(17);
    expect(definitions.every((entry) => entry.exportName.length > 0 && entry.requiredFields.length > 0 && entry.locked && deeplyFrozen(entry.requiredFields))).toBe(true);
    expect(deeplyFrozen(definitions)).toBe(true);
    expect(plainData(definitions)).toBe(true);
  });

  it("derives the contract definition count from the canonical collection", () => {
    expect(contracts.sceneCompositionContractDefinitionCount).toBe(contracts.sceneCompositionContractDefinitions.length);
    expect(contracts.getNexoraObjectDirectorSceneCompositionContractDefinitionCount()).toBe(contracts.sceneCompositionContractDefinitions.length);
  });

  it("publishes exactly eleven zero-based ordered frozen registry sections", () => {
    const registry = contracts.getNexoraObjectDirectorSceneCompositionContractsRegistry();
    const sections = ["identity", "contract-definitions", "requirements", "scene-contract", "unit-contracts", "relationship-contracts", "collection-contracts", "compatibility", "public-apis", "dependency", "release"];
    expect(registry).toBe(contracts.nexoraObjectDirectorSceneCompositionContractsRegistry);
    expect(registry.map((entry) => entry.section)).toEqual(sections);
    expect(registry.map((entry) => entry.order)).toEqual(Array.from({ length: 11 }, (_, index) => index));
    expect(new Set(registry.map((entry) => entry.section)).size).toBe(11);
    expect(registry.every((entry) => entry.locked && entry.exportNames.length > 0 && deeplyFrozen(entry.exportNames))).toBe(true);
    expect(deeplyFrozen(registry)).toBe(true);
    expect(plainData(registry)).toBe(true);
  });

  it("derives registry count and preserves canonical registry identity", () => {
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsRegistryCount).toBe(contracts.nexoraObjectDirectorSceneCompositionContractsRegistry.length);
    expect(contracts.getNexoraObjectDirectorSceneCompositionContractsRegistryCount()).toBe(contracts.nexoraObjectDirectorSceneCompositionContractsRegistry.length);
  });

  it("exports and registers exactly ten inspection APIs", () => {
    const functionNames = Object.entries(contracts).filter(([, value]) => typeof value === "function").map(([name]) => name).sort();
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiSurface).toHaveLength(10);
    expect(contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiCount).toBe(10);
    expect(functionNames).toEqual([...contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiSurface].sort());
    expect(functionNames.some((name) => /(?:set|add|remove|update|mutate|validate|certify|execute)/i.test(name))).toBe(false);
    expect(deeplyFrozen(contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiSurface)).toBe(true);
  });

  it("verifies complete Foundation compatibility deterministically", () => {
    const first = contracts.verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility();
    const second = contracts.verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ compatible: true, upstreamIdentityValid: true, vocabularyCompatible: true, unitKindsCompatible: true, rolesCompatible: true, statesCompatible: true, modesCompatible: true, bindingCompatibilityPreserved: true });
    expect(first.checks).toHaveLength(7);
    expect(first.checks.every((check) => check.endsWith(":passed"))).toBe(true);
    expect(deeplyFrozen(first)).toBe(true);
    expect(plainData(first)).toBe(true);
  });

  it("passes all nineteen deterministic Contracts verification checks", () => {
    const first = contracts.verifyNexoraObjectDirectorSceneCompositionContracts();
    const second = contracts.verifyNexoraObjectDirectorSceneCompositionContracts();
    expect(first).toEqual(second);
    expect(first).toMatchObject({ valid: true, identityValid: true, definitionsValid: true, requirementsValid: true, registryValid: true, compatibilityValid: true, failedCheckCount: 0 });
    expect(first.checks).toHaveLength(19);
    expect(first.passedCheckCount).toBe(first.checks.length);
    expect(first.checks.every((check) => check.passed)).toBe(true);
    expect(new Set(first.checks.map((check) => check.id)).size).toBe(first.checks.length);
    expect(deeplyFrozen(first)).toBe(true);
    expect(plainData(first)).toBe(true);
  });

  it("reports the Contracts surface frozen with a zero-parameter guard", () => {
    expect(contracts.isNexoraObjectDirectorSceneCompositionContractsFrozen.length).toBe(0);
    expect(contracts.isNexoraObjectDirectorSceneCompositionContractsFrozen()).toBe(true);
    expect(contracts.isNexoraObjectDirectorSceneCompositionContractsFrozen()).toBe(true);
  });

  it("returns the exact dynamic deeply frozen Contracts summary", () => {
    const summary = contracts.getNexoraObjectDirectorSceneCompositionContractsSummary();
    expect(summary).toEqual({
      identity: contracts.nexoraObjectDirectorSceneCompositionContractsId,
      version: contracts.nexoraObjectDirectorSceneCompositionContractsVersion,
      namespace: contracts.nexoraObjectDirectorSceneCompositionContractsNamespace,
      contractDefinitionCount: contracts.sceneCompositionContractDefinitions.length,
      requirementCount: contracts.sceneCompositionContractRequirements.length,
      registryEntryCount: contracts.nexoraObjectDirectorSceneCompositionContractsRegistry.length,
      publicApiCount: contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiSurface.length,
      soleDependency: foundation.nexoraObjectDirectorSceneCompositionFoundationId,
      compatibility: true,
      nextPhase: "NOL-7:3",
    });
    expect(summary).toEqual(contracts.getNexoraObjectDirectorSceneCompositionContractsSummary());
    expect(deeplyFrozen(summary)).toBe(true);
    expect(plainData(summary)).toBe(true);
  });

  it("does not mutate imported Foundation or binding terminology", () => {
    const before = JSON.stringify({ identity: foundation.nexoraObjectDirectorSceneCompositionFoundationId, units: foundation.sceneCompositionUnitKinds, modes: foundation.sceneCompositionModes, compatibility: foundation.sceneCompositionBindingCompatibility });
    const unitIdentity = foundation.sceneCompositionUnitKinds;
    contracts.verifyNexoraObjectDirectorSceneCompositionContracts();
    contracts.verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility();
    expect(JSON.stringify({ identity: foundation.nexoraObjectDirectorSceneCompositionFoundationId, units: foundation.sceneCompositionUnitKinds, modes: foundation.sceneCompositionModes, compatibility: foundation.sceneCompositionBindingCompatibility })).toBe(before);
    expect(foundation.sceneCompositionUnitKinds).toBe(unitIdentity);
  });

  it("keeps all Contracts-owned runtime metadata and results deeply frozen plain data", () => {
    const values = [contracts.sceneCompositionContractsStatus, contracts.sceneCompositionBindingCompatibilityContract, contracts.sceneCompositionContractRequirements, contracts.sceneCompositionContractDefinitions, contracts.nexoraObjectDirectorSceneCompositionContractsRegistry, contracts.nexoraObjectDirectorSceneCompositionContractsPublicApiSurface, contracts.verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility(), contracts.verifyNexoraObjectDirectorSceneCompositionContracts(), contracts.getNexoraObjectDirectorSceneCompositionContractsSummary()];
    for (const value of values) {
      expect(deeplyFrozen(value)).toBe(true);
      expect(plainData(value)).toBe(true);
    }
  });

  it("preserves the NOL-6:9 and NOL-7:1 regression boundary", () => {
    expect(bindingPublicIndex.verifyNexoraObjectDirectorSceneBindingPublicIndex().valid).toBe(true);
    expect(foundation.verifyNexoraObjectDirectorSceneCompositionFoundation().valid).toBe(true);
    expect(foundation.isNexoraObjectDirectorSceneCompositionFoundationFrozen()).toBe(true);
    expect(contracts.sceneCompositionBindingCompatibilityContract.requiredPublicTerminology.interaction).toEqual(["none", "selectable", "focusable", "interactive"]);
  });

  it("contains no live composition, framework, layout, effects, or mutation behavior", () => {
    expect(source).not.toMatch(/\basync\s+(?:function|\()/);
    expect(source).not.toMatch(/\b(?:await|Promise|setTimeout|setInterval|requestAnimationFrame|fetch|window|document|localStorage|sessionStorage|Math\.random|Date\b|Worker|process|console\.)\b/);
    expect(source).not.toMatch(/\b(?:useState|useEffect|createElement|addEventListener|dispatchEvent|subscribe|observe)\s*\(/);
    expect(source).not.toMatch(/class\s+[A-Za-z_$]|extends\s+[A-Za-z_$]|new\s+(?:Map|Set|Date|Promise|Scene|Mesh|Object3D)\s*\(/);
    expect(source).not.toMatch(/\b(?:compose|layout|normalize|repair|transition|animate|mount|render|execute|createScene|createNode|createBinding|generateId)\s*\(/);
    expect(source).not.toMatch(/\b(?:coordinates|vector|transform|camera|rendererObject|runtimeController|sceneInstance)\s*:/i);
  });
});
