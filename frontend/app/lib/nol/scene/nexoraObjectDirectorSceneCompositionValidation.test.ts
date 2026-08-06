import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as bindingPublicIndex from "./nexoraObjectDirectorSceneBindingPublicIndex.ts";
import * as foundation from "./nexoraObjectDirectorSceneCompositionFoundation.ts";
import * as contracts from "./nexoraObjectDirectorSceneCompositionContracts.ts";
import * as validation from "./nexoraObjectDirectorSceneCompositionValidation.ts";
import type { NexoraObjectDirectorSceneCompositionContract } from "./nexoraObjectDirectorSceneCompositionContracts.ts";

vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts", async () => import("./nexoraObjectDirectorSceneCompositionContracts.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation", async () => import("./nexoraObjectDirectorSceneCompositionFoundation.ts"));
vi.mock("@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex", async () => import("./nexoraObjectDirectorSceneBindingPublicIndex.ts"));

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const productionPath = resolve(currentDirectory, "nexoraObjectDirectorSceneCompositionValidation.ts");
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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function emphasis() {
  return { role: "neutral", reason: null, source: null };
}

function bindingCompatibility() {
  return clone(contracts.sceneCompositionBindingCompatibilityContract);
}

function minimalComposition() {
  return {
    identity: { compositionId: "composition-empty", kind: "scene", version: "1.0.0" },
    metadata: { title: "Empty", description: null, tags: [], source: null, createdBy: "director" },
    state: "empty",
    mode: "global",
    ownership: { owner: "director", sourceId: null, delegated: false },
    layers: [],
    relationships: [],
    annotations: [],
    focus: { activeUnitId: null, activeGroupId: null, activeLayerId: null, role: "none", reason: null },
    bindingCompatibility: bindingCompatibility(),
  };
}

function layeredComposition() {
  const units = [
    { unitId: "unit-primary", kind: "node", layerId: "layer-primary", nodeReference: { nodeReferenceId: "node-ref-primary", sceneBindingNodeId: "binding-primary", sceneBindingKind: "object", required: true }, placement: { role: "center", anchorUnitId: null, relativeOrder: 0 }, focusRole: "focused", emphasisRole: "positive", order: { layerOrder: 0, groupOrder: 0, unitOrder: 0 }, metadata: { caption: "Primary", semanticRole: "subject", labels: ["primary"], presentationHint: null } },
    { unitId: "unit-related", kind: "node", layerId: "layer-primary", nodeReference: null, placement: { role: "orbit", anchorUnitId: "unit-primary", relativeOrder: 1 }, focusRole: "contextual", emphasisRole: "informational", order: { layerOrder: 0, groupOrder: 0, unitOrder: 1 }, metadata: { caption: "Related", semanticRole: null, labels: [], presentationHint: "supporting" } },
  ];
  return {
    identity: { compositionId: "composition-layered", kind: "scene", version: "1.0.0" },
    metadata: { title: "Layered", description: "Valid composition", tags: ["executive", "scene"], source: "test", createdBy: "director" },
    state: "active",
    mode: "goal",
    ownership: { owner: "director", sourceId: "director-1", delegated: false },
    layers: [{ layerId: "layer-primary", role: "primary", order: 0, visible: true, groups: [{ groupId: "group-primary", role: "goal-related", title: "Goal", order: 0, unitIds: ["unit-primary", "unit-related"], focusRole: "focused", emphasisRole: "positive" }], units }],
    relationships: [{ relationshipId: "relationship-primary", role: "supports", source: { unitId: "unit-related", role: "source" }, target: { unitId: "unit-primary", role: "target" }, directed: true, order: 0, label: "supports", emphasis: emphasis() }],
    annotations: [{ annotationId: "annotation-primary", unitId: "unit-primary", relationshipId: null, kind: "label", text: "Primary object", emphasis: emphasis(), order: 0 }],
    focus: { activeUnitId: "unit-primary", activeGroupId: null, activeLayerId: null, role: "focused", reason: "Selected subject" },
    bindingCompatibility: bindingCompatibility(),
  };
}

function codes(result: validation.SceneCompositionValidationResult): string[] {
  return result.findings.map((finding) => finding.code);
}

describe("NOL-7:3 Director Scene Composition Validation", () => {
  it("creates exactly the two requested NOL-7:3 files", () => {
    const files = readdirSync(currentDirectory).filter((name) => name.startsWith("nexoraObjectDirectorSceneCompositionValidation"));
    expect(files.sort()).toEqual(["nexoraObjectDirectorSceneCompositionValidation.test.ts", "nexoraObjectDirectorSceneCompositionValidation.ts"]);
    expect(source).not.toMatch(/\bexport\s+default\b/);
  });

  it("publishes the exact Validation identity and default policy", () => {
    expect(validation.nexoraObjectDirectorSceneCompositionValidationId).toBe("NOL-7:3/NexoraObjectDirectorSceneCompositionValidation");
    expect(validation.nexoraObjectDirectorSceneCompositionValidationVersion).toBe("7.3.0");
    expect(validation.nexoraObjectDirectorSceneCompositionValidationNamespace).toBe("nexora.nol.scene.composition.validation");
    expect(validation.sceneCompositionValidationStatus).toEqual({ validationLayer: true, released: true, immutable: true, deterministic: true, readiness: "ready-for-certification" });
    expect(deeplyFrozen(validation.sceneCompositionValidationStatus)).toBe(true);
    expect(validation.defaultSceneCompositionValidationOptions).toEqual({ allowUnknownFields: false, requireFrozenInput: false, requireContiguousOrder: true, requireUniqueOrders: true, requireReferencedUnitsInSameComposition: true, requireAnnotationTarget: true, allowRelationshipSelfReference: false, allowEmptyLayers: true });
    expect(deeplyFrozen(validation.defaultSceneCompositionValidationOptions)).toBe(true);
  });

  it("imports only the canonical NOL-7:2 Contracts dependency", () => {
    const dependencies = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    expect(dependencies).toEqual(["@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts"]);
    expect(source).not.toMatch(/from\s+["'][^"']*(?:SceneCompositionFoundation|SceneBinding|\/runtime|\/renderer|three|react|\/ui)[^"']*["']/i);
  });

  it("publishes canonical frozen severities and all required unique codes", () => {
    expect(validation.sceneCompositionValidationSeverities).toEqual(["info", "warning", "error", "fatal"]);
    expect(new Set(validation.sceneCompositionValidationCodes).size).toBe(validation.sceneCompositionValidationCodes.length);
    expect(validation.sceneCompositionValidationCodeCount).toBe(validation.sceneCompositionValidationCodes.length);
    for (const code of ["SCENE_COMPOSITION_VALID", "SCENE_COMPOSITION_INPUT_REQUIRED", "SCENE_COMPOSITION_LAYER_ID_DUPLICATE", "SCENE_COMPOSITION_PLACEMENT_SELF_ANCHOR", "SCENE_COMPOSITION_ACTIONABLE_TERM_PROHIBITED", "SCENE_COMPOSITION_CONTRACT_REGISTRY_MISMATCH"]) expect(validation.sceneCompositionValidationCodes).toContain(code);
    expect(deeplyFrozen(validation.sceneCompositionValidationSeverities)).toBe(true);
    expect(deeplyFrozen(validation.sceneCompositionValidationCodes)).toBe(true);
  });

  it("accepts minimal empty and complete layered compositions", () => {
    const empty = validation.validateNexoraObjectDirectorSceneComposition(minimalComposition());
    const layered = validation.validateNexoraObjectDirectorSceneComposition(layeredComposition());
    expect(empty.valid).toBe(true);
    expect(empty.findings).toEqual([]);
    expect(layered.valid).toBe(true);
    expect(layered.findings).toEqual([]);
    expect(layered).toMatchObject({ checkedCompositionCount: 1, checkedLayerCount: 1, checkedGroupCount: 1, checkedUnitCount: 2, checkedRelationshipCount: 1, checkedAnnotationCount: 1, checkedNodeReferenceCount: 1 });
  });

  it("returns fatal immutable findings rather than throwing for invalid roots", () => {
    for (const value of [null, undefined, 1, "scene", [], new (class Custom {})()]) {
      expect(() => validation.validateNexoraObjectDirectorSceneComposition(value)).not.toThrow();
      const result = validation.validateNexoraObjectDirectorSceneComposition(value);
      expect(result.valid).toBe(false);
      expect(result.fatalCount).toBeGreaterThan(0);
      expect(deeplyFrozen(result)).toBe(true);
    }
  });

  it("validates composition identity without normalizing caller IDs", () => {
    const missing = minimalComposition(); missing.identity.compositionId = "";
    const whitespace = minimalComposition(); whitespace.identity.compositionId = " composition ";
    const version = minimalComposition(); version.identity.version = "v1";
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(missing))).toContain("SCENE_COMPOSITION_ID_REQUIRED");
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(whitespace))).toContain("SCENE_COMPOSITION_ID_INVALID");
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(version))).toContain("SCENE_COMPOSITION_VERSION_INVALID");
    expect(whitespace.identity.compositionId).toBe(" composition ");
  });

  it("validates metadata, duplicate tags, state, mode, and ownership", () => {
    const value = minimalComposition();
    value.metadata.title = 1 as unknown as string;
    (value.metadata as { tags: string[] }).tags = ["same", "same"];
    value.state = "unknown";
    value.mode = "unknown";
    value.ownership.owner = "unknown";
    const result = validation.validateNexoraObjectDirectorSceneComposition(value);
    expect(result.valid).toBe(false);
    expect(codes(result)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_METADATA_INVALID", "SCENE_COMPOSITION_METADATA_TAG_DUPLICATE", "SCENE_COMPOSITION_STATE_INVALID", "SCENE_COMPOSITION_MODE_INVALID", "SCENE_COMPOSITION_OWNERSHIP_INVALID"]));
  });

  it("validates layers, duplicate IDs, orders, and empty-layer policy", () => {
    const value = layeredComposition();
    value.layers.push(clone(value.layers[0]));
    value.layers[1].order = 0;
    const invalid = validation.validateNexoraObjectDirectorSceneComposition(value);
    expect(codes(invalid)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_LAYER_ID_DUPLICATE", "SCENE_COMPOSITION_LAYER_ORDER_DUPLICATE"]));
    const emptyLayer = { layerId: "empty", role: "support", order: 0, visible: true, groups: [], units: [] };
    expect(validation.validateNexoraObjectDirectorSceneCompositionLayer(emptyLayer).valid).toBe(true);
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionLayer(emptyLayer, {}, { allowEmptyLayers: false }))).toContain("SCENE_COMPOSITION_LAYER_COLLECTION_REQUIRED");
    for (const order of [-1, 0.5, Number.POSITIVE_INFINITY]) { const candidate = clone(emptyLayer); candidate.order = order; expect(codes(validation.validateNexoraObjectDirectorSceneCompositionLayer(candidate))).toContain("SCENE_COMPOSITION_LAYER_ORDER_INVALID"); }
  });

  it("validates groups as ordered ID-reference collections", () => {
    const value = layeredComposition();
    const group = value.layers[0].groups[0];
    const context = { groups: value.layers[0].groups as unknown as readonly contracts.SceneCompositionGroupContract[], units: value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[], layerId: value.layers[0].layerId };
    expect(validation.validateNexoraObjectDirectorSceneCompositionGroup(group, context).valid).toBe(true);
    const duplicate = clone(group); duplicate.unitIds.push("unit-primary");
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionGroup(duplicate, context))).toContain("SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_DUPLICATE");
    const missing = clone(group); missing.unitIds = ["missing-unit"];
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionGroup(missing, context))).toContain("SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_INVALID");
    const embedded = clone(group) as unknown as Record<string, unknown>; embedded.unitIds = [value.layers[0].units[0]];
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionGroup(embedded, context))).toContain("SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_INVALID");
  });

  it("validates units, node references, reciprocity, metadata, and executable values", () => {
    const value = layeredComposition();
    const layers = value.layers as unknown as readonly contracts.SceneCompositionLayerContract[];
    const units = value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[];
    expect(validation.validateNexoraObjectDirectorSceneCompositionUnit(value.layers[0].units[0], { layers, units }).valid).toBe(true);
    const invalid = clone(value.layers[0].units[0]); invalid.unitId = ""; invalid.kind = "mesh"; invalid.layerId = "missing"; invalid.metadata.labels = [" bad "];
    const result = validation.validateNexoraObjectDirectorSceneCompositionUnit(invalid, { layers, units });
    expect(codes(result)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_UNIT_ID_REQUIRED", "SCENE_COMPOSITION_UNIT_KIND_INVALID", "SCENE_COMPOSITION_UNIT_LAYER_REFERENCE_INVALID", "SCENE_COMPOSITION_UNIT_METADATA_INVALID"]));
    const executable = clone(value.layers[0].units[0]) as unknown as Record<string, unknown>; (executable.metadata as Record<string, unknown>).callback = () => true;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionUnit(executable, { layers, units }))).toContain("SCENE_COMPOSITION_EXECUTABLE_VALUE_PROHIBITED");
  });

  it("validates placement roles, anchors, self-reference, and relative order", () => {
    const value = layeredComposition();
    const layers = value.layers as unknown as readonly contracts.SceneCompositionLayerContract[];
    const units = value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[];
    const orbit = clone(value.layers[0].units[1]);
    orbit.placement.anchorUnitId = null;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionUnit(orbit, { layers, units }))).toContain("SCENE_COMPOSITION_PLACEMENT_ANCHOR_INVALID");
    orbit.placement.anchorUnitId = orbit.unitId;
    orbit.placement.relativeOrder = -1;
    const self = validation.validateNexoraObjectDirectorSceneCompositionUnit(orbit, { layers, units });
    expect(codes(self)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_PLACEMENT_SELF_ANCHOR", "SCENE_COMPOSITION_RELATIVE_ORDER_INVALID"]));
    const unknown = clone(value.layers[0].units[0]) as unknown as Record<string, unknown>; (unknown.placement as Record<string, unknown>).x = 10;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionUnit(unknown, { layers, units }))).toContain("SCENE_COMPOSITION_UNKNOWN_FIELD");
  });

  it("validates focus references and role conflicts", () => {
    const value = layeredComposition(); value.focus.activeUnitId = "missing";
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(value))).toContain("SCENE_COMPOSITION_FOCUS_UNIT_REFERENCE_INVALID");
    const none = layeredComposition(); none.focus.role = "none";
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(none))).toContain("SCENE_COMPOSITION_FOCUS_REFERENCE_CONFLICT");
    const missing = layeredComposition(); (missing.focus as { activeUnitId: string | null }).activeUnitId = null;
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(missing))).toContain("SCENE_COMPOSITION_FOCUS_REFERENCE_CONFLICT");
  });

  it("validates relationships, endpoints, self-reference, order, and prohibited fields", () => {
    const value = layeredComposition();
    const units = value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[];
    const relationships = value.relationships as unknown as readonly contracts.SceneCompositionRelationshipContract[];
    const relation = value.relationships[0];
    expect(validation.validateNexoraObjectDirectorSceneCompositionRelationship(relation, { units, relationships }).valid).toBe(true);
    const self = clone(relation); self.target.unitId = self.source.unitId;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionRelationship(self, { units, relationships }))).toContain("SCENE_COMPOSITION_RELATIONSHIP_SELF_REFERENCE");
    expect(validation.validateNexoraObjectDirectorSceneCompositionRelationship(self, { units, relationships }, { allowRelationshipSelfReference: true }).valid).toBe(true);
    const geometry = clone(relation) as unknown as Record<string, unknown>; geometry.geometry = [];
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionRelationship(geometry, { units, relationships }))).toContain("SCENE_COMPOSITION_UNKNOWN_FIELD");
  });

  it("validates annotation kinds, text, targets, ambiguity, and target policy", () => {
    const value = layeredComposition();
    const units = value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[];
    const relationships = value.relationships as unknown as readonly contracts.SceneCompositionRelationshipContract[];
    const annotations = value.annotations as unknown as readonly contracts.SceneCompositionAnnotationContract[];
    const context = { units, relationships, annotations };
    expect(validation.validateNexoraObjectDirectorSceneCompositionAnnotation(value.annotations[0], context).valid).toBe(true);
    const missing = clone(value.annotations[0]); (missing as { unitId: string | null }).unitId = null;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionAnnotation(missing, context))).toContain("SCENE_COMPOSITION_ANNOTATION_TARGET_INVALID");
    expect(validation.validateNexoraObjectDirectorSceneCompositionAnnotation(missing, context, { requireAnnotationTarget: false }).valid).toBe(true);
    const dual = clone(value.annotations[0]); (dual as { relationshipId: string | null }).relationshipId = value.relationships[0].relationshipId;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionAnnotation(dual, context))).toContain("SCENE_COMPOSITION_ANNOTATION_TARGET_AMBIGUOUS");
  });

  it("validates ordering membership, duplicates, unknown references, and contiguity", () => {
    const value = layeredComposition();
    const context = { layers: value.layers as unknown as readonly contracts.SceneCompositionLayerContract[], groups: value.layers[0].groups as unknown as readonly contracts.SceneCompositionGroupContract[], units: value.layers[0].units as unknown as readonly contracts.SceneCompositionUnitContract[], relationships: value.relationships as unknown as readonly contracts.SceneCompositionRelationshipContract[], annotations: value.annotations as unknown as readonly contracts.SceneCompositionAnnotationContract[] };
    const ordering = { layerOrder: ["layer-primary"], groupOrder: ["group-primary"], unitOrder: ["unit-primary", "unit-related"], relationshipOrder: ["relationship-primary"], annotationOrder: ["annotation-primary"] };
    expect(validation.validateNexoraObjectDirectorSceneCompositionOrdering(ordering, context).valid).toBe(true);
    const invalid = clone(ordering); invalid.unitOrder = ["unit-primary", "unit-primary", "unknown"];
    const result = validation.validateNexoraObjectDirectorSceneCompositionOrdering(invalid, context);
    expect(codes(result)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE", "SCENE_COMPOSITION_ORDER_REFERENCE_INVALID", "SCENE_COMPOSITION_ORDER_COLLECTION_MISMATCH"]));
    expect(invalid.unitOrder).toEqual(["unit-primary", "unit-primary", "unknown"]);
  });

  it("validates composition collections without lifecycle behavior", () => {
    const first = minimalComposition(); const second = minimalComposition(); second.identity.compositionId = "composition-second";
    const collection = { compositions: [first, second], activeCompositionId: first.identity.compositionId, order: [first.identity.compositionId, second.identity.compositionId] };
    expect(validation.validateNexoraObjectDirectorSceneCompositionCollection(collection).valid).toBe(true);
    const duplicate = clone(collection); duplicate.compositions[1].identity.compositionId = first.identity.compositionId;
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionCollection(duplicate))).toContain("SCENE_COMPOSITION_COLLECTION_ID_DUPLICATE");
    const active = clone(collection); active.activeCompositionId = "missing";
    expect(codes(validation.validateNexoraObjectDirectorSceneCompositionCollection(active))).toContain("SCENE_COMPOSITION_ACTIVE_REFERENCE_INVALID");
  });

  it("validates snapshots structurally without replay or timeline behavior", () => {
    const composition = layeredComposition() as unknown as NexoraObjectDirectorSceneCompositionContract;
    const snapshot = { snapshotId: "snapshot-1", compositionId: composition.identity.compositionId, state: "active", mode: "goal", focus: clone(composition.focus), ordering: { layerOrder: ["layer-primary"], groupOrder: ["group-primary"], unitOrder: ["unit-primary", "unit-related"], relationshipOrder: ["relationship-primary"], annotationOrder: ["annotation-primary"] } };
    expect(validation.validateNexoraObjectDirectorSceneCompositionSnapshot(snapshot, [composition]).valid).toBe(true);
    const missing = clone(snapshot); missing.snapshotId = ""; missing.compositionId = "missing"; missing.state = "invalid";
    const result = validation.validateNexoraObjectDirectorSceneCompositionSnapshot(missing, [composition]);
    expect(codes(result)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_SNAPSHOT_INVALID", "SCENE_COMPOSITION_SNAPSHOT_REFERENCE_INVALID", "SCENE_COMPOSITION_STATE_INVALID"]));
  });

  it("validates exact NOL-6 public terminology and rejects actionable", () => {
    const wrongPhase = minimalComposition(); (wrongPhase.bindingCompatibility as unknown as { upstreamPhase: string }).upstreamPhase = "NOL-6:8";
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(wrongPhase))).toContain("SCENE_COMPOSITION_UPSTREAM_PHASE_INVALID");
    const actionable = minimalComposition(); (actionable.bindingCompatibility.requiredPublicTerminology as unknown as { interaction: string[] }).interaction = ["none", "selectable", "focusable", "actionable"];
    const result = validation.validateNexoraObjectDirectorSceneComposition(actionable);
    expect(codes(result)).toEqual(expect.arrayContaining(["SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_INVALID", "SCENE_COMPOSITION_ACTIONABLE_TERM_PROHIBITED"]));
  });

  it("enforces unknown-field and executable-value policies safely", () => {
    const unknown = minimalComposition() as unknown as Record<string, unknown>; unknown.extension = { plain: true };
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(unknown))).toContain("SCENE_COMPOSITION_UNKNOWN_FIELD");
    expect(validation.validateNexoraObjectDirectorSceneComposition(unknown, { allowUnknownFields: true }).valid).toBe(true);
    let executed = false; unknown.extension = () => { executed = true; };
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(unknown, { allowUnknownFields: true }))).toContain("SCENE_COMPOSITION_EXECUTABLE_VALUE_PROHIBITED");
    expect(executed).toBe(false);
  });

  it("supports optional frozen-input enforcement without freezing caller data", () => {
    const unfrozen = minimalComposition();
    expect(validation.validateNexoraObjectDirectorSceneComposition(unfrozen).valid).toBe(true);
    expect(codes(validation.validateNexoraObjectDirectorSceneComposition(unfrozen, { requireFrozenInput: true }))).toContain("SCENE_COMPOSITION_INPUT_NOT_FROZEN");
    expect(Object.isFrozen(unfrozen)).toBe(false);
    expect(Object.isFrozen(unfrozen.layers)).toBe(false);
    const frozen = deepFreeze(clone(unfrozen));
    expect(validation.validateNexoraObjectDirectorSceneComposition(frozen, { requireFrozenInput: true }).valid).toBe(true);
  });

  it("canonicalizes, deduplicates, counts, and freezes findings", () => {
    const value = layeredComposition(); value.layers[0].units[0].placement.anchorUnitId = "unit-primary"; value.layers[0].units[0].metadata.labels = [" bad "];
    const first = validation.validateNexoraObjectDirectorSceneComposition(value);
    const second = validation.validateNexoraObjectDirectorSceneComposition(clone(value));
    expect(first).toEqual(second);
    expect(first.valid).toBe(false);
    expect(first.errorCount).toBe(first.findings.filter((finding) => finding.severity === "error").length);
    expect(first.findings.length).toBe(new Set(first.findings.map((finding) => JSON.stringify(finding))).size);
    expect(first.findings.every((finding) => deeplyFrozen(finding) && deeplyFrozen(finding.path))).toBe(true);
  });

  it("guards results structurally and resolves all summary statuses", () => {
    const clean = validation.validateNexoraObjectDirectorSceneComposition(minimalComposition());
    const invalid = validation.validateNexoraObjectDirectorSceneComposition(null);
    expect(validation.isNexoraObjectDirectorSceneCompositionValidationResult(clean)).toBe(true);
    expect(validation.isNexoraObjectDirectorSceneCompositionValidationResult({ ...clean, errorCount: 1 })).toBe(false);
    expect(validation.getNexoraObjectDirectorSceneCompositionValidationSummary(clean).status).toBe("valid");
    expect(validation.getNexoraObjectDirectorSceneCompositionValidationSummary(invalid).status).toBe("fatal");
    const warning: validation.SceneCompositionValidationResult = deepFreeze({ ...clean, valid: true, findings: [{ code: "SCENE_COMPOSITION_METADATA_TAG_DUPLICATE" as const, severity: "warning" as const, message: "Warning", path: [] }], warningCount: 1 });
    expect(validation.isNexoraObjectDirectorSceneCompositionValidationResult(warning)).toBe(true);
    expect(validation.getNexoraObjectDirectorSceneCompositionValidationSummary(warning).status).toBe("valid-with-warnings");
    expect(deeplyFrozen(validation.getNexoraObjectDirectorSceneCompositionValidationSummary(warning))).toBe(true);
  });

  it("publishes and verifies exactly seventeen registry sections and 28 capabilities", () => {
    const registry = validation.getNexoraObjectDirectorSceneCompositionValidationRegistry();
    const sections = ["Identity", "Severities", "Validation Codes", "Validation Options", "Validation Findings", "Validation Result", "Composition Validation", "Component Validators", "Collection and Snapshot Validation", "Result Guard", "Summary", "Contract Compatibility", "Public APIs", "Dependency", "Validation Capabilities", "Readiness", "Release Information"];
    expect(registry).toBe(validation.nexoraObjectDirectorSceneCompositionValidationRegistry);
    expect(registry.map((entry) => entry.section)).toEqual(sections);
    expect(registry.map((entry) => entry.order)).toEqual(Array.from({ length: 17 }, (_, index) => index));
    expect(validation.getNexoraObjectDirectorSceneCompositionValidationRegistryCount()).toBe(registry.length);
    expect(validation.nexoraObjectDirectorSceneCompositionValidationCapabilityCount).toBe(28);
    expect(new Set(validation.nexoraObjectDirectorSceneCompositionValidationCapabilities).size).toBe(28);
    expect(validation.verifyNexoraObjectDirectorSceneCompositionValidationRegistry().valid).toBe(true);
    expect(validation.isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen()).toBe(true);
    expect(deeplyFrozen(registry)).toBe(true);
  });

  it("exports exactly eleven primary and four registry APIs", () => {
    expect(validation.nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiCount).toBe(11);
    const functions = Object.entries(validation).filter(([, value]) => typeof value === "function").map(([name]) => name);
    expect(functions).toHaveLength(15);
    expect(functions.filter((name) => /Registry/.test(name))).toHaveLength(4);
    expect(functions.some((name) => /(?:repair|normalize|mutate|set|update|remove|add)/i.test(name))).toBe(false);
  });

  it("preserves Contracts, Foundation, and NOL-6:9 verification", () => {
    expect(contracts.verifyNexoraObjectDirectorSceneCompositionContracts().valid).toBe(true);
    expect(contracts.isNexoraObjectDirectorSceneCompositionContractsFrozen()).toBe(true);
    expect(foundation.verifyNexoraObjectDirectorSceneCompositionFoundation().valid).toBe(true);
    expect(bindingPublicIndex.verifyNexoraObjectDirectorSceneBindingPublicIndex().valid).toBe(true);
  });

  it("contains no composition execution, rendering, framework, effects, or mutation behavior", () => {
    expect(source).not.toMatch(/\basync\s+(?:function|\()/);
    expect(source).not.toMatch(/\b(?:await|Promise|setTimeout|setInterval|requestAnimationFrame|fetch|window|document|localStorage|sessionStorage|Math\.random|Date\b|Worker|process|console\.)\b/);
    expect(source).not.toMatch(/\b(?:useState|useEffect|createElement|addEventListener|dispatchEvent|subscribe|observe)\s*\(/);
    expect(source).not.toMatch(/class\s+[A-Za-z_$]|extends\s+[A-Za-z_$]|new\s+(?:Map|Set|Date|Promise|Scene|Mesh|Object3D)\s*\(/);
    expect(source).not.toMatch(/\b(?:compose|layout|repair|normalize|transition|animate|mount|render|execute|generateId)\s*\(/);
    expect(source).not.toMatch(/\b(?:coordinates|vector|camera|rendererObject|runtimeController|sceneInstance)\s*:/i);
  });
});
