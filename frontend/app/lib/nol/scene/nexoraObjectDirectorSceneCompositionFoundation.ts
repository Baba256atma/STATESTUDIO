/** NOL-7:1 — immutable vocabulary for abstract Director scene composition. */
import {
  isNexoraObjectDirectorSceneBindingReadyForConsumer,
  nexoraObjectDirectorSceneBindingPublicIndexId,
  sceneBindingPublicInteractionValues,
  sceneBindingPublicRendererStates,
  sceneBindingPublicTypeRegistry,
  sceneBindingPublicVisibilityValues,
  verifyNexoraObjectDirectorSceneBindingPublicIndex,
} from "@/app/lib/nol/scene/nexoraObjectDirectorSceneBindingPublicIndex";

export const nexoraObjectDirectorSceneCompositionFoundationId = "NOL-7:1/NexoraObjectDirectorSceneCompositionFoundation" as const;
export const nexoraObjectDirectorSceneCompositionFoundationVersion = "7.1.0" as const;
export const nexoraObjectDirectorSceneCompositionFoundationNamespace = "nexora.nol.scene.composition.foundation" as const;

function freezeOwned<T>(value: T, visited: object[] = []): T {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return value;
  visited.push(value as object);
  for (const child of Object.values(value as Record<string, unknown>)) freezeOwned(child, visited);
  return Object.freeze(value);
}

function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}

function unique(values: readonly string[]): boolean {
  return values.every((value, index) => values.indexOf(value) === index);
}

function exact(values: readonly string[], expected: readonly string[]): boolean {
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
}

export type SceneCompositionFoundationStatus = Readonly<{
  foundation: true;
  released: true;
  immutable: true;
  stable: true;
  readiness: "ready-for-contracts";
}>;

export const sceneCompositionFoundationStatus: SceneCompositionFoundationStatus = freezeOwned({
  foundation: true,
  released: true,
  immutable: true,
  stable: true,
  readiness: "ready-for-contracts",
});

export type SceneCompositionUnitKind = "scene" | "layer" | "group" | "node" | "relationship" | "annotation";
export const sceneCompositionUnitKinds = freezeOwned(["scene", "layer", "group", "node", "relationship", "annotation"] as const satisfies readonly SceneCompositionUnitKind[]);

export type SceneCompositionLayerRole = "background" | "context" | "primary" | "relationship" | "support" | "overlay" | "attention";
export const sceneCompositionLayerRoles = freezeOwned(["background", "context", "primary", "relationship", "support", "overlay", "attention"] as const satisfies readonly SceneCompositionLayerRole[]);

export type SceneCompositionState = "empty" | "prepared" | "active" | "focused" | "transitioning" | "suspended" | "archived";
export const sceneCompositionStates = freezeOwned(["empty", "prepared", "active", "focused", "transitioning", "suspended", "archived"] as const satisfies readonly SceneCompositionState[]);

export type SceneCompositionMode = "global" | "goal" | "object" | "pack" | "path" | "comparison" | "presentation";
export const sceneCompositionModes = freezeOwned(["global", "goal", "object", "pack", "path", "comparison", "presentation"] as const satisfies readonly SceneCompositionMode[]);

export type SceneCompositionPlacementRole = "center" | "orbit" | "perimeter" | "edge" | "background" | "overlay" | "hidden";
export const sceneCompositionPlacementRoles = freezeOwned(["center", "orbit", "perimeter", "edge", "background", "overlay", "hidden"] as const satisfies readonly SceneCompositionPlacementRole[]);

export type SceneCompositionGroupingRole = "goal-related" | "object-related" | "pack-related" | "dependency-related" | "comparison-related" | "status-related" | "narrative-related";
export const sceneCompositionGroupingRoles = freezeOwned(["goal-related", "object-related", "pack-related", "dependency-related", "comparison-related", "status-related", "narrative-related"] as const satisfies readonly SceneCompositionGroupingRole[]);

export type SceneCompositionRelationshipRole = "contains" | "belongs-to" | "depends-on" | "influences" | "supports" | "conflicts-with" | "flows-to" | "derived-from" | "compares-with" | "focuses-on";
export const sceneCompositionRelationshipRoles = freezeOwned(["contains", "belongs-to", "depends-on", "influences", "supports", "conflicts-with", "flows-to", "derived-from", "compares-with", "focuses-on"] as const satisfies readonly SceneCompositionRelationshipRole[]);

export type SceneCompositionFocusRole = "none" | "candidate" | "selected" | "focused" | "dominant" | "contextual" | "dimmed";
export const sceneCompositionFocusRoles = freezeOwned(["none", "candidate", "selected", "focused", "dominant", "contextual", "dimmed"] as const satisfies readonly SceneCompositionFocusRole[]);

export type SceneCompositionEmphasisRole = "neutral" | "informational" | "positive" | "attention" | "warning" | "critical";
export const sceneCompositionEmphasisRoles = freezeOwned(["neutral", "informational", "positive", "attention", "warning", "critical"] as const satisfies readonly SceneCompositionEmphasisRole[]);

export type SceneCompositionOwnershipRole = "director" | "workspace" | "runtime" | "renderer" | "consumer";
export const sceneCompositionOwnershipRoles = freezeOwned(["director", "workspace", "runtime", "renderer", "consumer"] as const satisfies readonly SceneCompositionOwnershipRole[]);

export type SceneCompositionOrder = Readonly<{
  layerOrder: number;
  groupOrder: number;
  unitOrder: number;
}>;

export type SceneCompositionIdentity = Readonly<{
  compositionId: string;
  compositionKind: "scene";
}>;

export type SceneCompositionUnitIdentity = Readonly<{
  unitId: string;
  unitKind: SceneCompositionUnitKind;
}>;

export type SceneCompositionUnitFoundation = Readonly<{
  identity: SceneCompositionUnitIdentity;
  layerRole: SceneCompositionLayerRole;
  placementRole: SceneCompositionPlacementRole;
  groupingRole: SceneCompositionGroupingRole | null;
  focusRole: SceneCompositionFocusRole;
  emphasisRole: SceneCompositionEmphasisRole;
  order: SceneCompositionOrder;
}>;

export type NexoraObjectDirectorSceneCompositionFoundation = Readonly<{
  identity: SceneCompositionIdentity;
  state: SceneCompositionState;
  mode: SceneCompositionMode;
  ownership: SceneCompositionOwnershipRole;
  units: readonly SceneCompositionUnitFoundation[];
}>;

const supportedSceneNodeKinds = freezeOwned(["object", "group", "label", "badge", "connection", "anchor"] as const);
const supportedRendererStates = freezeOwned(["minimum", "report", "operation"] as const);
const supportedVisibilityValues = freezeOwned(["visible", "hidden", "collapsed"] as const);
const supportedInteractionModes = freezeOwned(["none", "selectable", "focusable", "interactive"] as const);

export type SceneCompositionBindingCompatibility = Readonly<{
  upstreamPhase: "NOL-6:9";
  upstreamIdentity: string;
  supportedSceneNodeKinds: readonly string[];
  supportedRendererStates: readonly ["minimum", "report", "operation"];
  supportedVisibilityValues: readonly ["visible", "hidden", "collapsed"];
  supportedInteractionModes: readonly ["none", "selectable", "focusable", "interactive"];
  compatible: true;
}>;

export const sceneCompositionBindingCompatibility: SceneCompositionBindingCompatibility = freezeOwned({
  upstreamPhase: "NOL-6:9",
  upstreamIdentity: nexoraObjectDirectorSceneBindingPublicIndexId,
  supportedSceneNodeKinds,
  supportedRendererStates,
  supportedVisibilityValues,
  supportedInteractionModes,
  compatible: true,
});

export type SceneCompositionFoundationRegistryCategory = "identity" | "unit-kind" | "layer-role" | "state" | "mode" | "placement-role" | "grouping-role" | "relationship-role" | "focus-role" | "emphasis-role" | "ownership-role" | "order" | "compatibility";
export type SceneCompositionFoundationRegistryEntry = Readonly<{
  order: number;
  id: string;
  category: SceneCompositionFoundationRegistryCategory;
  exportName: string;
  locked: true;
}>;

const registryDefinitions = [
  ["identity", "scene-composition-foundation-identity", "nexoraObjectDirectorSceneCompositionFoundationId"],
  ["unit-kind", "scene-composition-unit-kinds", "sceneCompositionUnitKinds"],
  ["layer-role", "scene-composition-layer-roles", "sceneCompositionLayerRoles"],
  ["state", "scene-composition-states", "sceneCompositionStates"],
  ["mode", "scene-composition-modes", "sceneCompositionModes"],
  ["placement-role", "scene-composition-placement-roles", "sceneCompositionPlacementRoles"],
  ["grouping-role", "scene-composition-grouping-roles", "sceneCompositionGroupingRoles"],
  ["relationship-role", "scene-composition-relationship-roles", "sceneCompositionRelationshipRoles"],
  ["focus-role", "scene-composition-focus-roles", "sceneCompositionFocusRoles"],
  ["emphasis-role", "scene-composition-emphasis-roles", "sceneCompositionEmphasisRoles"],
  ["ownership-role", "scene-composition-ownership-roles", "sceneCompositionOwnershipRoles"],
  ["order", "scene-composition-order", "SceneCompositionOrder"],
  ["compatibility", "scene-composition-binding-compatibility", "sceneCompositionBindingCompatibility"],
] as const satisfies readonly (readonly [SceneCompositionFoundationRegistryCategory, string, string])[];

export const nexoraObjectDirectorSceneCompositionFoundationRegistry: readonly SceneCompositionFoundationRegistryEntry[] = freezeOwned(
  registryDefinitions.map(([category, id, exportName], order) => freezeOwned({ order, id, category, exportName, locked: true })),
);
export const nexoraObjectDirectorSceneCompositionFoundationRegistryCount = nexoraObjectDirectorSceneCompositionFoundationRegistry.length;

export const nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface = freezeOwned([
  "getNexoraObjectDirectorSceneCompositionFoundationRegistry",
  "getNexoraObjectDirectorSceneCompositionFoundationRegistryCount",
  "verifyNexoraObjectDirectorSceneCompositionFoundation",
  "verifyNexoraObjectDirectorSceneCompositionBindingCompatibility",
  "isNexoraObjectDirectorSceneCompositionFoundationFrozen",
  "getNexoraObjectDirectorSceneCompositionFoundationSummary",
] as const);
export const nexoraObjectDirectorSceneCompositionFoundationPublicApiCount = nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface.length;

export function getNexoraObjectDirectorSceneCompositionFoundationRegistry(): typeof nexoraObjectDirectorSceneCompositionFoundationRegistry {
  return nexoraObjectDirectorSceneCompositionFoundationRegistry;
}

export function getNexoraObjectDirectorSceneCompositionFoundationRegistryCount(): number {
  return nexoraObjectDirectorSceneCompositionFoundationRegistry.length;
}

export type SceneCompositionBindingCompatibilityVerification = Readonly<{
  compatible: boolean;
  upstreamIdentityValid: boolean;
  rendererStatesValid: boolean;
  visibilityValuesValid: boolean;
  interactionModesValid: boolean;
  sceneNodeKindsAvailable: boolean;
  checks: readonly string[];
}>;

export function verifyNexoraObjectDirectorSceneCompositionBindingCompatibility(): SceneCompositionBindingCompatibilityVerification {
  const upstreamVerification = verifyNexoraObjectDirectorSceneBindingPublicIndex();
  const upstreamIdentityValid = sceneCompositionBindingCompatibility.upstreamPhase === "NOL-6:9"
    && sceneCompositionBindingCompatibility.upstreamIdentity === nexoraObjectDirectorSceneBindingPublicIndexId
    && upstreamVerification.valid
    && isNexoraObjectDirectorSceneBindingReadyForConsumer();
  const rendererStatesValid = exact(sceneCompositionBindingCompatibility.supportedRendererStates, sceneBindingPublicRendererStates);
  const visibilityValuesValid = exact(sceneCompositionBindingCompatibility.supportedVisibilityValues, sceneBindingPublicVisibilityValues);
  const interactionModesValid = exact(sceneCompositionBindingCompatibility.supportedInteractionModes, sceneBindingPublicInteractionValues)
    && !sceneCompositionBindingCompatibility.supportedInteractionModes.includes("actionable" as never);
  const sceneNodeKindsAvailable = sceneCompositionBindingCompatibility.supportedSceneNodeKinds.length > 0
    && unique(sceneCompositionBindingCompatibility.supportedSceneNodeKinds)
    && sceneBindingPublicTypeRegistry.some((entry) => entry.exportName === "NexoraDirectorSceneNodeKind" && entry.consumerVisible && entry.locked);
  const states = [upstreamIdentityValid, rendererStatesValid, visibilityValuesValid, interactionModesValid, sceneNodeKindsAvailable] as const;
  const ids = ["upstream-identity", "renderer-states", "visibility-values", "interaction-modes", "scene-node-kinds"] as const;
  const checks = freezeOwned(states.map((passed, index) => `${ids[index]}:${passed ? "passed" : "failed"}`));
  return freezeOwned({ compatible: sceneCompositionBindingCompatibility.compatible && states.every(Boolean), upstreamIdentityValid, rendererStatesValid, visibilityValuesValid, interactionModesValid, sceneNodeKindsAvailable, checks });
}

const vocabularyCollections: readonly (readonly string[])[] = [
  sceneCompositionUnitKinds,
  sceneCompositionLayerRoles,
  sceneCompositionStates,
  sceneCompositionModes,
  sceneCompositionPlacementRoles,
  sceneCompositionGroupingRoles,
  sceneCompositionRelationshipRoles,
  sceneCompositionFocusRoles,
  sceneCompositionEmphasisRoles,
  sceneCompositionOwnershipRoles,
];

const expectedVocabulary: readonly (readonly string[])[] = [
  ["scene", "layer", "group", "node", "relationship", "annotation"],
  ["background", "context", "primary", "relationship", "support", "overlay", "attention"],
  ["empty", "prepared", "active", "focused", "transitioning", "suspended", "archived"],
  ["global", "goal", "object", "pack", "path", "comparison", "presentation"],
  ["center", "orbit", "perimeter", "edge", "background", "overlay", "hidden"],
  ["goal-related", "object-related", "pack-related", "dependency-related", "comparison-related", "status-related", "narrative-related"],
  ["contains", "belongs-to", "depends-on", "influences", "supports", "conflicts-with", "flows-to", "derived-from", "compares-with", "focuses-on"],
  ["none", "candidate", "selected", "focused", "dominant", "contextual", "dimmed"],
  ["neutral", "informational", "positive", "attention", "warning", "critical"],
  ["director", "workspace", "runtime", "renderer", "consumer"],
];

function vocabularyCollectionValid(index: number): boolean {
  const collection = vocabularyCollections[index];
  return exact(collection, expectedVocabulary[index]) && unique(collection) && deeplyFrozen(collection);
}

function registryValid(): boolean {
  const categories = nexoraObjectDirectorSceneCompositionFoundationRegistry.map((entry) => entry.category);
  const ids = nexoraObjectDirectorSceneCompositionFoundationRegistry.map((entry) => entry.id);
  const exportNames = nexoraObjectDirectorSceneCompositionFoundationRegistry.map((entry) => entry.exportName);
  return nexoraObjectDirectorSceneCompositionFoundationRegistry.length === registryDefinitions.length
    && nexoraObjectDirectorSceneCompositionFoundationRegistry.every((entry, index) => entry.order === index && entry.locked && entry.category === registryDefinitions[index][0])
    && unique(categories)
    && unique(ids)
    && unique(exportNames)
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionFoundationRegistry);
}

export type SceneCompositionFoundationVerificationCheck = Readonly<{ id: string; passed: boolean; message: string }>;
export type SceneCompositionFoundationVerification = Readonly<{
  valid: boolean;
  identityValid: boolean;
  vocabularyValid: boolean;
  registryValid: boolean;
  compatibilityValid: boolean;
  passedCheckCount: number;
  failedCheckCount: number;
  checks: readonly SceneCompositionFoundationVerificationCheck[];
}>;

const verificationDefinitions = [
  ["identity", "Foundation identity"],
  ["version", "Foundation version"],
  ["namespace", "Foundation namespace"],
  ["unit-kinds", "Composition unit kinds"],
  ["layer-roles", "Layer roles"],
  ["states", "Composition states"],
  ["modes", "Composition modes"],
  ["placement-roles", "Placement roles"],
  ["grouping-roles", "Grouping roles"],
  ["relationship-roles", "Relationship roles"],
  ["focus-roles", "Focus roles"],
  ["emphasis-roles", "Emphasis roles"],
  ["ownership-roles", "Ownership roles"],
  ["registry-count", "Registry category count"],
  ["registry-order", "Registry order"],
  ["registry-lock", "Registry lock state"],
  ["binding-compatibility", "Scene Binding compatibility"],
  ["public-terminology", "Public terminology"],
  ["owned-freeze", "Foundation-owned immutability"],
] as const;

export function verifyNexoraObjectDirectorSceneCompositionFoundation(): SceneCompositionFoundationVerification {
  const compatibility = verifyNexoraObjectDirectorSceneCompositionBindingCompatibility();
  const vocabularyStates = vocabularyCollections.map((_, index) => vocabularyCollectionValid(index));
  const registryState = registryValid();
  const terminologyState = exact(sceneCompositionBindingCompatibility.supportedInteractionModes, ["none", "selectable", "focusable", "interactive"])
    && !sceneCompositionBindingCompatibility.supportedInteractionModes.includes("actionable" as never);
  const ownedFreezeState = vocabularyCollections.every((collection) => deeplyFrozen(collection))
    && deeplyFrozen(sceneCompositionFoundationStatus)
    && deeplyFrozen(sceneCompositionBindingCompatibility)
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionFoundationRegistry)
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionFoundationPublicApiSurface);
  const states = [
    nexoraObjectDirectorSceneCompositionFoundationId === "NOL-7:1/NexoraObjectDirectorSceneCompositionFoundation",
    nexoraObjectDirectorSceneCompositionFoundationVersion === "7.1.0",
    nexoraObjectDirectorSceneCompositionFoundationNamespace === "nexora.nol.scene.composition.foundation",
    ...vocabularyStates,
    nexoraObjectDirectorSceneCompositionFoundationRegistry.length === 13,
    registryState,
    nexoraObjectDirectorSceneCompositionFoundationRegistry.every((entry) => entry.locked),
    compatibility.compatible,
    terminologyState,
    ownedFreezeState,
  ];
  const checks = freezeOwned(verificationDefinitions.map(([id, title], index) => freezeOwned({ id, passed: states[index] === true, message: `${title} ${states[index] === true ? "verified" : "failed"}.` })));
  const passedCheckCount = checks.filter((check) => check.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const identityValid = states.slice(0, 3).every(Boolean);
  const vocabularyValid = states.slice(3, 13).every(Boolean);
  return freezeOwned({ valid: failedCheckCount === 0, identityValid, vocabularyValid, registryValid: registryState, compatibilityValid: compatibility.compatible, passedCheckCount, failedCheckCount, checks });
}

export function isNexoraObjectDirectorSceneCompositionFoundationFrozen(): boolean {
  const verification = verifyNexoraObjectDirectorSceneCompositionFoundation();
  return verification.valid
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionFoundationRegistry)
    && vocabularyCollections.every((collection) => deeplyFrozen(collection))
    && deeplyFrozen(sceneCompositionBindingCompatibility);
}

export function getNexoraObjectDirectorSceneCompositionFoundationSummary(): Readonly<{
  identity: string;
  version: string;
  namespace: string;
  unitKindCount: number;
  layerRoleCount: number;
  stateCount: number;
  modeCount: number;
  placementRoleCount: number;
  groupingRoleCount: number;
  relationshipRoleCount: number;
  focusRoleCount: number;
  emphasisRoleCount: number;
  ownershipRoleCount: number;
  registryEntryCount: number;
  soleDependency: string;
  nextPhase: "NOL-7:2";
}> {
  return freezeOwned({
    identity: nexoraObjectDirectorSceneCompositionFoundationId,
    version: nexoraObjectDirectorSceneCompositionFoundationVersion,
    namespace: nexoraObjectDirectorSceneCompositionFoundationNamespace,
    unitKindCount: sceneCompositionUnitKinds.length,
    layerRoleCount: sceneCompositionLayerRoles.length,
    stateCount: sceneCompositionStates.length,
    modeCount: sceneCompositionModes.length,
    placementRoleCount: sceneCompositionPlacementRoles.length,
    groupingRoleCount: sceneCompositionGroupingRoles.length,
    relationshipRoleCount: sceneCompositionRelationshipRoles.length,
    focusRoleCount: sceneCompositionFocusRoles.length,
    emphasisRoleCount: sceneCompositionEmphasisRoles.length,
    ownershipRoleCount: sceneCompositionOwnershipRoles.length,
    registryEntryCount: nexoraObjectDirectorSceneCompositionFoundationRegistry.length,
    soleDependency: nexoraObjectDirectorSceneBindingPublicIndexId,
    nextPhase: "NOL-7:2",
  });
}
