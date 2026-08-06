/** NOL-7:2 — immutable structural contracts for Director scene composition. */
import {
  isNexoraObjectDirectorSceneCompositionFoundationFrozen,
  nexoraObjectDirectorSceneCompositionFoundationId,
  nexoraObjectDirectorSceneCompositionFoundationNamespace,
  nexoraObjectDirectorSceneCompositionFoundationVersion,
  sceneCompositionBindingCompatibility,
  sceneCompositionEmphasisRoles,
  sceneCompositionFocusRoles,
  sceneCompositionGroupingRoles,
  sceneCompositionLayerRoles,
  sceneCompositionModes,
  sceneCompositionOwnershipRoles,
  sceneCompositionPlacementRoles,
  sceneCompositionRelationshipRoles,
  sceneCompositionStates,
  sceneCompositionUnitKinds,
  verifyNexoraObjectDirectorSceneCompositionBindingCompatibility,
  verifyNexoraObjectDirectorSceneCompositionFoundation,
  type SceneCompositionEmphasisRole,
  type SceneCompositionFocusRole,
  type SceneCompositionGroupingRole,
  type SceneCompositionLayerRole,
  type SceneCompositionMode,
  type SceneCompositionOrder,
  type SceneCompositionOwnershipRole,
  type SceneCompositionPlacementRole,
  type SceneCompositionRelationshipRole,
  type SceneCompositionState,
  type SceneCompositionUnitKind,
} from "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionFoundation";

export const nexoraObjectDirectorSceneCompositionContractsId = "NOL-7:2/NexoraObjectDirectorSceneCompositionContracts" as const;
export const nexoraObjectDirectorSceneCompositionContractsVersion = "7.2.0" as const;
export const nexoraObjectDirectorSceneCompositionContractsNamespace = "nexora.nol.scene.composition.contracts" as const;

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

export type SceneCompositionContractsStatus = Readonly<{
  contracts: true;
  released: true;
  immutable: true;
  stable: true;
  readiness: "ready-for-validation";
}>;

export const sceneCompositionContractsStatus: SceneCompositionContractsStatus = freezeOwned({
  contracts: true,
  released: true,
  immutable: true,
  stable: true,
  readiness: "ready-for-validation",
});

export type SceneCompositionId = string;
export type SceneCompositionUnitId = string;
export type SceneCompositionLayerId = string;
export type SceneCompositionGroupId = string;
export type SceneCompositionRelationshipId = string;
export type SceneCompositionAnnotationId = string;
export type SceneCompositionNodeReferenceId = string;

export type SceneCompositionMetadataContract = Readonly<{
  title: string;
  description: string | null;
  tags: readonly string[];
  source: string | null;
  createdBy: SceneCompositionOwnershipRole;
}>;

export type SceneCompositionIdentityContract = Readonly<{
  compositionId: SceneCompositionId;
  kind: "scene";
  version: string;
}>;

export type SceneCompositionLayerContract = Readonly<{
  layerId: SceneCompositionLayerId;
  role: SceneCompositionLayerRole;
  order: number;
  visible: boolean;
  groups: readonly SceneCompositionGroupContract[];
  units: readonly SceneCompositionUnitContract[];
}>;

export type SceneCompositionGroupContract = Readonly<{
  groupId: SceneCompositionGroupId;
  role: SceneCompositionGroupingRole;
  title: string | null;
  order: number;
  unitIds: readonly SceneCompositionUnitId[];
  focusRole: SceneCompositionFocusRole;
  emphasisRole: SceneCompositionEmphasisRole;
}>;

export type SceneCompositionUnitMetadataContract = Readonly<{
  caption: string | null;
  semanticRole: string | null;
  labels: readonly string[];
  presentationHint: string | null;
}>;

export type SceneCompositionNodeReferenceContract = Readonly<{
  nodeReferenceId: SceneCompositionNodeReferenceId;
  sceneBindingNodeId: string;
  sceneBindingKind: string;
  required: boolean;
}>;

export type SceneCompositionPlacementContract = Readonly<{
  role: SceneCompositionPlacementRole;
  anchorUnitId: SceneCompositionUnitId | null;
  relativeOrder: number;
}>;

export type SceneCompositionUnitContract = Readonly<{
  unitId: SceneCompositionUnitId;
  kind: SceneCompositionUnitKind;
  layerId: SceneCompositionLayerId;
  nodeReference: SceneCompositionNodeReferenceContract | null;
  placement: SceneCompositionPlacementContract;
  focusRole: SceneCompositionFocusRole;
  emphasisRole: SceneCompositionEmphasisRole;
  order: SceneCompositionOrder;
  metadata: SceneCompositionUnitMetadataContract;
}>;

export type SceneCompositionFocusContract = Readonly<{
  activeUnitId: SceneCompositionUnitId | null;
  activeGroupId: SceneCompositionGroupId | null;
  activeLayerId: SceneCompositionLayerId | null;
  role: SceneCompositionFocusRole;
  reason: string | null;
}>;

export type SceneCompositionEmphasisContract = Readonly<{
  role: SceneCompositionEmphasisRole;
  reason: string | null;
  source: string | null;
}>;

export type SceneCompositionOwnershipContract = Readonly<{
  owner: SceneCompositionOwnershipRole;
  sourceId: string | null;
  delegated: boolean;
}>;

export type SceneCompositionRelationshipEndpointContract = Readonly<{
  unitId: SceneCompositionUnitId;
  role: "source" | "target";
}>;

export type SceneCompositionRelationshipContract = Readonly<{
  relationshipId: SceneCompositionRelationshipId;
  role: SceneCompositionRelationshipRole;
  source: SceneCompositionRelationshipEndpointContract;
  target: SceneCompositionRelationshipEndpointContract;
  directed: boolean;
  order: number;
  label: string | null;
  emphasis: SceneCompositionEmphasisContract;
}>;

export type SceneCompositionAnnotationContract = Readonly<{
  annotationId: SceneCompositionAnnotationId;
  unitId: SceneCompositionUnitId | null;
  relationshipId: SceneCompositionRelationshipId | null;
  kind: "label" | "status" | "direction" | "explanation";
  text: string;
  emphasis: SceneCompositionEmphasisContract;
  order: number;
}>;

export type SceneCompositionOrderingContract = Readonly<{
  layerOrder: readonly SceneCompositionLayerId[];
  groupOrder: readonly SceneCompositionGroupId[];
  unitOrder: readonly SceneCompositionUnitId[];
  relationshipOrder: readonly SceneCompositionRelationshipId[];
  annotationOrder: readonly SceneCompositionAnnotationId[];
}>;

export type SceneCompositionCollectionContract = Readonly<{
  compositions: readonly NexoraObjectDirectorSceneCompositionContract[];
  activeCompositionId: SceneCompositionId | null;
  order: readonly SceneCompositionId[];
}>;

export type SceneCompositionSnapshotContract = Readonly<{
  snapshotId: string;
  compositionId: SceneCompositionId;
  state: SceneCompositionState;
  mode: SceneCompositionMode;
  focus: SceneCompositionFocusContract;
  ordering: SceneCompositionOrderingContract;
}>;

export type SceneCompositionBindingCompatibilityContract = Readonly<{
  upstreamPhase: "NOL-6:9";
  upstreamIdentity: string;
  requiredPublicTerminology: Readonly<{
    visibility: readonly ["visible", "hidden", "collapsed"];
    interaction: readonly ["none", "selectable", "focusable", "interactive"];
    rendererState: readonly ["minimum", "report", "operation"];
  }>;
  compatible: true;
}>;

export type NexoraObjectDirectorSceneCompositionContract = Readonly<{
  identity: SceneCompositionIdentityContract;
  metadata: SceneCompositionMetadataContract;
  state: SceneCompositionState;
  mode: SceneCompositionMode;
  ownership: SceneCompositionOwnershipContract;
  layers: readonly SceneCompositionLayerContract[];
  relationships: readonly SceneCompositionRelationshipContract[];
  annotations: readonly SceneCompositionAnnotationContract[];
  focus: SceneCompositionFocusContract;
  bindingCompatibility: SceneCompositionBindingCompatibilityContract;
}>;

export const sceneCompositionBindingCompatibilityContract: SceneCompositionBindingCompatibilityContract = freezeOwned({
  upstreamPhase: "NOL-6:9",
  upstreamIdentity: sceneCompositionBindingCompatibility.upstreamIdentity,
  requiredPublicTerminology: freezeOwned({
    visibility: freezeOwned(["visible", "hidden", "collapsed"] as const),
    interaction: freezeOwned(["none", "selectable", "focusable", "interactive"] as const),
    rendererState: freezeOwned(["minimum", "report", "operation"] as const),
  }),
  compatible: true,
});

export type SceneCompositionContractRequirementCategory = "identity" | "scene" | "layer" | "group" | "unit" | "relationship" | "annotation" | "focus" | "ordering" | "compatibility" | "immutability";
const requirementDefinitions = [
  ["composition-id-required", "identity"],
  ["composition-version-required", "identity"],
  ["unit-identities-required", "identity"],
  ["relationship-identities-required", "identity"],
  ["annotation-identities-required", "identity"],
  ["scene-state-required", "scene"],
  ["scene-mode-required", "scene"],
  ["scene-ownership-required", "scene"],
  ["scene-layer-collection-required", "scene"],
  ["scene-relationship-collection-required", "scene"],
  ["scene-annotation-collection-required", "scene"],
  ["scene-focus-required", "scene"],
  ["layer-id-required", "layer"],
  ["layer-role-required", "layer"],
  ["layer-order-required", "layer"],
  ["layer-collections-readonly", "layer"],
  ["group-id-required", "group"],
  ["group-role-required", "group"],
  ["group-unit-references-only", "group"],
  ["group-order-required", "group"],
  ["unit-id-required", "unit"],
  ["unit-kind-required", "unit"],
  ["unit-layer-reference-required", "unit"],
  ["unit-placement-required", "unit"],
  ["unit-focus-required", "unit"],
  ["unit-emphasis-required", "unit"],
  ["unit-order-required", "unit"],
  ["relationship-source-required", "relationship"],
  ["relationship-target-required", "relationship"],
  ["relationship-role-required", "relationship"],
  ["relationship-order-required", "relationship"],
  ["relationship-renderer-data-prohibited", "relationship"],
  ["annotation-text-required", "annotation"],
  ["annotation-target-reference-required", "annotation"],
  ["annotation-order-required", "annotation"],
  ["annotation-ui-reference-prohibited", "annotation"],
  ["focus-remains-declarative", "focus"],
  ["focus-transition-logic-prohibited", "focus"],
  ["ordering-collections-readonly", "ordering"],
  ["ordering-normalization-prohibited", "ordering"],
  ["nol-6-public-terminology-preserved", "compatibility"],
  ["interactive-term-preserved", "compatibility"],
  ["actionable-term-excluded", "compatibility"],
  ["renderer-states-preserved", "compatibility"],
  ["visibility-values-preserved", "compatibility"],
  ["all-contract-fields-readonly", "immutability"],
  ["no-executable-contract-fields", "immutability"],
  ["no-runtime-references", "immutability"],
  ["no-renderer-references", "immutability"],
  ["no-mutable-collections", "immutability"],
] as const satisfies readonly (readonly [string, SceneCompositionContractRequirementCategory])[];

export type SceneCompositionContractRequirementId = typeof requirementDefinitions[number][0];
export type SceneCompositionContractRequirement = Readonly<{
  id: SceneCompositionContractRequirementId;
  category: SceneCompositionContractRequirementCategory;
  description: string;
  required: true;
  locked: true;
}>;

export const sceneCompositionContractRequirements: readonly SceneCompositionContractRequirement[] = freezeOwned(
  requirementDefinitions.map(([id, category]) => freezeOwned({ id, category, description: `${id.replaceAll("-", " ")} is required by the Scene Composition contract boundary.`, required: true, locked: true })),
);
export const sceneCompositionContractRequirementCount = sceneCompositionContractRequirements.length;

export type SceneCompositionContractDefinitionCategory = "identity" | "metadata" | "scene" | "layer" | "group" | "unit" | "node-reference" | "placement" | "focus" | "emphasis" | "ownership" | "relationship" | "annotation" | "ordering" | "collection" | "snapshot" | "compatibility";
export type SceneCompositionContractDefinition = Readonly<{
  contractId: string;
  exportName: string;
  category: SceneCompositionContractDefinitionCategory;
  requiredFields: readonly string[];
  locked: true;
}>;

const contractDefinitionData = [
  ["composition-identity", "SceneCompositionIdentityContract", "identity", ["compositionId", "kind", "version"]],
  ["composition-metadata", "SceneCompositionMetadataContract", "metadata", ["title", "description", "tags", "source", "createdBy"]],
  ["scene-composition", "NexoraObjectDirectorSceneCompositionContract", "scene", ["identity", "metadata", "state", "mode", "ownership", "layers", "relationships", "annotations", "focus", "bindingCompatibility"]],
  ["composition-layer", "SceneCompositionLayerContract", "layer", ["layerId", "role", "order", "visible", "groups", "units"]],
  ["composition-group", "SceneCompositionGroupContract", "group", ["groupId", "role", "title", "order", "unitIds", "focusRole", "emphasisRole"]],
  ["composition-unit", "SceneCompositionUnitContract", "unit", ["unitId", "kind", "layerId", "nodeReference", "placement", "focusRole", "emphasisRole", "order", "metadata"]],
  ["composition-unit-metadata", "SceneCompositionUnitMetadataContract", "unit", ["caption", "semanticRole", "labels", "presentationHint"]],
  ["composition-node-reference", "SceneCompositionNodeReferenceContract", "node-reference", ["nodeReferenceId", "sceneBindingNodeId", "sceneBindingKind", "required"]],
  ["composition-placement", "SceneCompositionPlacementContract", "placement", ["role", "anchorUnitId", "relativeOrder"]],
  ["composition-focus", "SceneCompositionFocusContract", "focus", ["activeUnitId", "activeGroupId", "activeLayerId", "role", "reason"]],
  ["composition-emphasis", "SceneCompositionEmphasisContract", "emphasis", ["role", "reason", "source"]],
  ["composition-ownership", "SceneCompositionOwnershipContract", "ownership", ["owner", "sourceId", "delegated"]],
  ["composition-relationship-endpoint", "SceneCompositionRelationshipEndpointContract", "relationship", ["unitId", "role"]],
  ["composition-relationship", "SceneCompositionRelationshipContract", "relationship", ["relationshipId", "role", "source", "target", "directed", "order", "label", "emphasis"]],
  ["composition-annotation", "SceneCompositionAnnotationContract", "annotation", ["annotationId", "unitId", "relationshipId", "kind", "text", "emphasis", "order"]],
  ["composition-ordering-and-collections", "SceneCompositionOrderingContract", "ordering", ["layerOrder", "groupOrder", "unitOrder", "relationshipOrder", "annotationOrder", "compositions", "activeCompositionId", "snapshotId"]],
  ["composition-binding-compatibility", "SceneCompositionBindingCompatibilityContract", "compatibility", ["upstreamPhase", "upstreamIdentity", "requiredPublicTerminology", "compatible"]],
] as const satisfies readonly (readonly [string, string, SceneCompositionContractDefinitionCategory, readonly string[]])[];

export const sceneCompositionContractDefinitions: readonly SceneCompositionContractDefinition[] = freezeOwned(
  contractDefinitionData.map(([contractId, exportName, category, requiredFields]) => freezeOwned({ contractId, exportName, category, requiredFields: freezeOwned([...requiredFields]), locked: true })),
);
export const sceneCompositionContractDefinitionCount = sceneCompositionContractDefinitions.length;

export type SceneCompositionContractsRegistrySection = "identity" | "contract-definitions" | "requirements" | "scene-contract" | "unit-contracts" | "relationship-contracts" | "collection-contracts" | "compatibility" | "public-apis" | "dependency" | "release";
export type SceneCompositionContractsRegistryEntry = Readonly<{
  order: number;
  section: SceneCompositionContractsRegistrySection;
  exportNames: readonly string[];
  locked: true;
}>;

const registryData = [
  ["identity", ["nexoraObjectDirectorSceneCompositionContractsId", "nexoraObjectDirectorSceneCompositionContractsVersion", "nexoraObjectDirectorSceneCompositionContractsNamespace"]],
  ["contract-definitions", ["sceneCompositionContractDefinitions", "sceneCompositionContractDefinitionCount"]],
  ["requirements", ["sceneCompositionContractRequirements", "sceneCompositionContractRequirementCount"]],
  ["scene-contract", ["NexoraObjectDirectorSceneCompositionContract", "SceneCompositionIdentityContract", "SceneCompositionMetadataContract"]],
  ["unit-contracts", ["SceneCompositionLayerContract", "SceneCompositionGroupContract", "SceneCompositionUnitContract", "SceneCompositionNodeReferenceContract", "SceneCompositionPlacementContract", "SceneCompositionFocusContract", "SceneCompositionEmphasisContract", "SceneCompositionOwnershipContract"]],
  ["relationship-contracts", ["SceneCompositionRelationshipEndpointContract", "SceneCompositionRelationshipContract", "SceneCompositionAnnotationContract"]],
  ["collection-contracts", ["SceneCompositionOrderingContract", "SceneCompositionCollectionContract", "SceneCompositionSnapshotContract"]],
  ["compatibility", ["SceneCompositionBindingCompatibilityContract", "sceneCompositionBindingCompatibilityContract"]],
  ["public-apis", ["getNexoraObjectDirectorSceneCompositionContractDefinitions", "getNexoraObjectDirectorSceneCompositionContractDefinitionCount", "getNexoraObjectDirectorSceneCompositionContractRequirements", "getNexoraObjectDirectorSceneCompositionContractRequirementCount", "getNexoraObjectDirectorSceneCompositionContractsRegistry", "getNexoraObjectDirectorSceneCompositionContractsRegistryCount", "verifyNexoraObjectDirectorSceneCompositionContracts", "verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility", "isNexoraObjectDirectorSceneCompositionContractsFrozen", "getNexoraObjectDirectorSceneCompositionContractsSummary"]],
  ["dependency", ["NOL-7:1/NexoraObjectDirectorSceneCompositionFoundation"]],
  ["release", ["sceneCompositionContractsStatus"]],
] as const satisfies readonly (readonly [SceneCompositionContractsRegistrySection, readonly string[]])[];

export const nexoraObjectDirectorSceneCompositionContractsRegistry: readonly SceneCompositionContractsRegistryEntry[] = freezeOwned(
  registryData.map(([section, exportNames], order) => freezeOwned({ order, section, exportNames: freezeOwned([...exportNames]), locked: true })),
);
export const nexoraObjectDirectorSceneCompositionContractsRegistryCount = nexoraObjectDirectorSceneCompositionContractsRegistry.length;

export const nexoraObjectDirectorSceneCompositionContractsPublicApiSurface = freezeOwned(registryData[8][1]);
export const nexoraObjectDirectorSceneCompositionContractsPublicApiCount = nexoraObjectDirectorSceneCompositionContractsPublicApiSurface.length;

export function getNexoraObjectDirectorSceneCompositionContractDefinitions(): typeof sceneCompositionContractDefinitions {
  return sceneCompositionContractDefinitions;
}

export function getNexoraObjectDirectorSceneCompositionContractDefinitionCount(): number {
  return sceneCompositionContractDefinitions.length;
}

export function getNexoraObjectDirectorSceneCompositionContractRequirements(): typeof sceneCompositionContractRequirements {
  return sceneCompositionContractRequirements;
}

export function getNexoraObjectDirectorSceneCompositionContractRequirementCount(): number {
  return sceneCompositionContractRequirements.length;
}

export function getNexoraObjectDirectorSceneCompositionContractsRegistry(): typeof nexoraObjectDirectorSceneCompositionContractsRegistry {
  return nexoraObjectDirectorSceneCompositionContractsRegistry;
}

export function getNexoraObjectDirectorSceneCompositionContractsRegistryCount(): number {
  return nexoraObjectDirectorSceneCompositionContractsRegistry.length;
}

export type SceneCompositionFoundationCompatibilityVerification = Readonly<{
  compatible: boolean;
  upstreamIdentityValid: boolean;
  vocabularyCompatible: boolean;
  unitKindsCompatible: boolean;
  rolesCompatible: boolean;
  statesCompatible: boolean;
  modesCompatible: boolean;
  bindingCompatibilityPreserved: boolean;
  checks: readonly string[];
}>;

export function verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility(): SceneCompositionFoundationCompatibilityVerification {
  const foundationVerification = verifyNexoraObjectDirectorSceneCompositionFoundation();
  const bindingVerification = verifyNexoraObjectDirectorSceneCompositionBindingCompatibility();
  const upstreamIdentityValid = nexoraObjectDirectorSceneCompositionFoundationId === "NOL-7:1/NexoraObjectDirectorSceneCompositionFoundation"
    && nexoraObjectDirectorSceneCompositionFoundationVersion === "7.1.0"
    && nexoraObjectDirectorSceneCompositionFoundationNamespace === "nexora.nol.scene.composition.foundation"
    && foundationVerification.valid
    && isNexoraObjectDirectorSceneCompositionFoundationFrozen();
  const unitKindsCompatible = exact(sceneCompositionUnitKinds, ["scene", "layer", "group", "node", "relationship", "annotation"]);
  const rolesCompatible = exact(sceneCompositionLayerRoles, ["background", "context", "primary", "relationship", "support", "overlay", "attention"])
    && exact(sceneCompositionGroupingRoles, ["goal-related", "object-related", "pack-related", "dependency-related", "comparison-related", "status-related", "narrative-related"])
    && exact(sceneCompositionRelationshipRoles, ["contains", "belongs-to", "depends-on", "influences", "supports", "conflicts-with", "flows-to", "derived-from", "compares-with", "focuses-on"])
    && exact(sceneCompositionPlacementRoles, ["center", "orbit", "perimeter", "edge", "background", "overlay", "hidden"])
    && exact(sceneCompositionFocusRoles, ["none", "candidate", "selected", "focused", "dominant", "contextual", "dimmed"])
    && exact(sceneCompositionEmphasisRoles, ["neutral", "informational", "positive", "attention", "warning", "critical"])
    && exact(sceneCompositionOwnershipRoles, ["director", "workspace", "runtime", "renderer", "consumer"]);
  const statesCompatible = exact(sceneCompositionStates, ["empty", "prepared", "active", "focused", "transitioning", "suspended", "archived"]);
  const modesCompatible = exact(sceneCompositionModes, ["global", "goal", "object", "pack", "path", "comparison", "presentation"]);
  const vocabularyCompatible = foundationVerification.vocabularyValid && unitKindsCompatible && rolesCompatible && statesCompatible && modesCompatible;
  const terminology = sceneCompositionBindingCompatibilityContract.requiredPublicTerminology;
  const bindingCompatibilityPreserved = bindingVerification.compatible
    && exact(terminology.visibility, sceneCompositionBindingCompatibility.supportedVisibilityValues)
    && exact(terminology.interaction, sceneCompositionBindingCompatibility.supportedInteractionModes)
    && exact(terminology.rendererState, sceneCompositionBindingCompatibility.supportedRendererStates)
    && !terminology.interaction.includes("actionable" as never);
  const states = [upstreamIdentityValid, vocabularyCompatible, unitKindsCompatible, rolesCompatible, statesCompatible, modesCompatible, bindingCompatibilityPreserved] as const;
  const ids = ["upstream-identity", "vocabulary", "unit-kinds", "roles", "states", "modes", "binding-compatibility"] as const;
  const checks = freezeOwned(states.map((passed, index) => `${ids[index]}:${passed ? "passed" : "failed"}`));
  return freezeOwned({ compatible: states.every(Boolean), upstreamIdentityValid, vocabularyCompatible, unitKindsCompatible, rolesCompatible, statesCompatible, modesCompatible, bindingCompatibilityPreserved, checks });
}

function definitionsValid(): boolean {
  const ids = sceneCompositionContractDefinitions.map((definition) => definition.contractId);
  return sceneCompositionContractDefinitions.length === contractDefinitionData.length
    && sceneCompositionContractDefinitions.every((definition, index) => definition.contractId === contractDefinitionData[index][0] && definition.locked && definition.requiredFields.length > 0 && unique(definition.requiredFields) && deeplyFrozen(definition.requiredFields))
    && unique(ids)
    && deeplyFrozen(sceneCompositionContractDefinitions);
}

function requirementsValid(): boolean {
  const ids = sceneCompositionContractRequirements.map((requirement) => requirement.id);
  return sceneCompositionContractRequirements.length === requirementDefinitions.length
    && sceneCompositionContractRequirements.every((requirement, index) => requirement.id === requirementDefinitions[index][0] && requirement.category === requirementDefinitions[index][1] && requirement.required && requirement.locked)
    && unique(ids)
    && deeplyFrozen(sceneCompositionContractRequirements);
}

function registryValid(): boolean {
  const sections = nexoraObjectDirectorSceneCompositionContractsRegistry.map((entry) => entry.section);
  return nexoraObjectDirectorSceneCompositionContractsRegistry.length === registryData.length
    && nexoraObjectDirectorSceneCompositionContractsRegistry.every((entry, index) => entry.order === index && entry.section === registryData[index][0] && entry.locked && entry.exportNames.length > 0 && unique(entry.exportNames) && deeplyFrozen(entry.exportNames))
    && unique(sections)
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionContractsRegistry);
}

export type SceneCompositionContractsVerificationCheck = Readonly<{ id: string; passed: boolean; message: string }>;
export type SceneCompositionContractsVerification = Readonly<{
  valid: boolean;
  identityValid: boolean;
  definitionsValid: boolean;
  requirementsValid: boolean;
  registryValid: boolean;
  compatibilityValid: boolean;
  passedCheckCount: number;
  failedCheckCount: number;
  checks: readonly SceneCompositionContractsVerificationCheck[];
}>;

const verificationDefinitions = [
  ["identity", "Contracts identity"],
  ["version", "Contracts version"],
  ["namespace", "Contracts namespace"],
  ["definition-count", "Contract definition count"],
  ["definition-order", "Contract definition order"],
  ["definition-uniqueness", "Contract definition uniqueness"],
  ["definition-field-freeze", "Contract required-field immutability"],
  ["requirement-order", "Contract requirement order"],
  ["requirement-uniqueness", "Contract requirement uniqueness"],
  ["requirement-required", "Contract required state"],
  ["requirement-lock", "Contract requirement lock"],
  ["registry-count", "Contracts registry count"],
  ["registry-order", "Contracts registry order"],
  ["registry-uniqueness", "Contracts registry uniqueness"],
  ["registry-lock", "Contracts registry lock"],
  ["foundation-compatibility", "Foundation compatibility"],
  ["public-terminology", "Public terminology"],
  ["owned-freeze", "Contracts-owned immutability"],
  ["public-api-count", "Public API count"],
] as const;

export function verifyNexoraObjectDirectorSceneCompositionContracts(): SceneCompositionContractsVerification {
  const compatibility = verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility();
  const definitionIds = sceneCompositionContractDefinitions.map((definition) => definition.contractId);
  const requirementIds = sceneCompositionContractRequirements.map((requirement) => requirement.id);
  const registrySections = nexoraObjectDirectorSceneCompositionContractsRegistry.map((entry) => entry.section);
  const terminology = sceneCompositionBindingCompatibilityContract.requiredPublicTerminology;
  const definitionState = definitionsValid();
  const requirementState = requirementsValid();
  const registryState = registryValid();
  const states = [
    nexoraObjectDirectorSceneCompositionContractsId === "NOL-7:2/NexoraObjectDirectorSceneCompositionContracts",
    nexoraObjectDirectorSceneCompositionContractsVersion === "7.2.0",
    nexoraObjectDirectorSceneCompositionContractsNamespace === "nexora.nol.scene.composition.contracts",
    sceneCompositionContractDefinitions.length === 17,
    sceneCompositionContractDefinitions.every((definition, index) => definition.contractId === contractDefinitionData[index][0]),
    unique(definitionIds),
    sceneCompositionContractDefinitions.every((definition) => deeplyFrozen(definition.requiredFields)),
    sceneCompositionContractRequirements.every((requirement, index) => requirement.id === requirementDefinitions[index][0]),
    unique(requirementIds),
    sceneCompositionContractRequirements.every((requirement) => requirement.required),
    sceneCompositionContractRequirements.every((requirement) => requirement.locked),
    nexoraObjectDirectorSceneCompositionContractsRegistry.length === 11,
    nexoraObjectDirectorSceneCompositionContractsRegistry.every((entry, index) => entry.order === index),
    unique(registrySections),
    nexoraObjectDirectorSceneCompositionContractsRegistry.every((entry) => entry.locked),
    compatibility.compatible,
    exact(terminology.visibility, ["visible", "hidden", "collapsed"]) && exact(terminology.interaction, ["none", "selectable", "focusable", "interactive"]) && exact(terminology.rendererState, ["minimum", "report", "operation"]) && !terminology.interaction.includes("actionable" as never),
    deeplyFrozen(sceneCompositionContractsStatus) && deeplyFrozen(sceneCompositionBindingCompatibilityContract) && definitionState && requirementState && registryState && deeplyFrozen(nexoraObjectDirectorSceneCompositionContractsPublicApiSurface),
    nexoraObjectDirectorSceneCompositionContractsPublicApiCount === 10 && nexoraObjectDirectorSceneCompositionContractsPublicApiSurface.length === 10,
  ];
  const checks = freezeOwned(verificationDefinitions.map(([id, title], index) => freezeOwned({ id, passed: states[index] === true, message: `${title} ${states[index] === true ? "verified" : "failed"}.` })));
  const passedCheckCount = checks.filter((check) => check.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  return freezeOwned({
    valid: failedCheckCount === 0,
    identityValid: states.slice(0, 3).every(Boolean),
    definitionsValid: definitionState,
    requirementsValid: requirementState,
    registryValid: registryState,
    compatibilityValid: compatibility.compatible,
    passedCheckCount,
    failedCheckCount,
    checks,
  });
}

export function isNexoraObjectDirectorSceneCompositionContractsFrozen(): boolean {
  const verification = verifyNexoraObjectDirectorSceneCompositionContracts();
  return verification.valid
    && deeplyFrozen(sceneCompositionContractDefinitions)
    && deeplyFrozen(sceneCompositionContractRequirements)
    && deeplyFrozen(nexoraObjectDirectorSceneCompositionContractsRegistry)
    && deeplyFrozen(sceneCompositionBindingCompatibilityContract);
}

export function getNexoraObjectDirectorSceneCompositionContractsSummary(): Readonly<{
  identity: string;
  version: string;
  namespace: string;
  contractDefinitionCount: number;
  requirementCount: number;
  registryEntryCount: number;
  publicApiCount: number;
  soleDependency: string;
  compatibility: true;
  nextPhase: "NOL-7:3";
}> {
  return freezeOwned({
    identity: nexoraObjectDirectorSceneCompositionContractsId,
    version: nexoraObjectDirectorSceneCompositionContractsVersion,
    namespace: nexoraObjectDirectorSceneCompositionContractsNamespace,
    contractDefinitionCount: sceneCompositionContractDefinitions.length,
    requirementCount: sceneCompositionContractRequirements.length,
    registryEntryCount: nexoraObjectDirectorSceneCompositionContractsRegistry.length,
    publicApiCount: nexoraObjectDirectorSceneCompositionContractsPublicApiSurface.length,
    soleDependency: nexoraObjectDirectorSceneCompositionFoundationId,
    compatibility: true,
    nextPhase: "NOL-7:3",
  });
}
