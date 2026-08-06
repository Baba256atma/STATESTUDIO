/** NOL-7:3 — deterministic structural validation for Director scene composition. */
import {
  getNexoraObjectDirectorSceneCompositionContractDefinitionCount,
  getNexoraObjectDirectorSceneCompositionContractDefinitions,
  getNexoraObjectDirectorSceneCompositionContractRequirementCount,
  getNexoraObjectDirectorSceneCompositionContractRequirements,
  getNexoraObjectDirectorSceneCompositionContractsRegistry,
  getNexoraObjectDirectorSceneCompositionContractsRegistryCount,
  isNexoraObjectDirectorSceneCompositionContractsFrozen,
  nexoraObjectDirectorSceneCompositionContractsId,
  nexoraObjectDirectorSceneCompositionContractsNamespace,
  nexoraObjectDirectorSceneCompositionContractsVersion,
  sceneCompositionBindingCompatibilityContract,
  sceneCompositionContractDefinitionCount,
  sceneCompositionContractDefinitions,
  sceneCompositionContractRequirementCount,
  sceneCompositionContractRequirements,
  nexoraObjectDirectorSceneCompositionContractsRegistry,
  nexoraObjectDirectorSceneCompositionContractsRegistryCount,
  verifyNexoraObjectDirectorSceneCompositionContracts,
  verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility,
  type NexoraObjectDirectorSceneCompositionContract,
  type SceneCompositionAnnotationContract,
  type SceneCompositionGroupContract,
  type SceneCompositionLayerContract,
  type SceneCompositionRelationshipContract,
  type SceneCompositionUnitContract,
} from "@/app/lib/nol/scene/nexoraObjectDirectorSceneCompositionContracts";

export const nexoraObjectDirectorSceneCompositionValidationId = "NOL-7:3/NexoraObjectDirectorSceneCompositionValidation" as const;
export const nexoraObjectDirectorSceneCompositionValidationVersion = "7.3.0" as const;
export const nexoraObjectDirectorSceneCompositionValidationNamespace = "nexora.nol.scene.composition.validation" as const;

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

function exact(values: readonly unknown[], expected: readonly unknown[]): boolean {
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
}

function record(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function executablePresent(value: unknown, visited: object[] = []): boolean {
  if (typeof value === "function") return true;
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return false;
  visited.push(value as object);
  if (!Array.isArray(value) && !record(value)) return true;
  return Object.values(value as Record<string, unknown>).some((child) => executablePresent(child, visited));
}

function validId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}

function validOrder(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

export type SceneCompositionValidationStatus = Readonly<{ validationLayer: true; released: true; immutable: true; deterministic: true; readiness: "ready-for-certification" }>;
export const sceneCompositionValidationStatus: SceneCompositionValidationStatus = freezeOwned({ validationLayer: true, released: true, immutable: true, deterministic: true, readiness: "ready-for-certification" });

export type SceneCompositionValidationSeverity = "info" | "warning" | "error" | "fatal";
export const sceneCompositionValidationSeverities = freezeOwned(["info", "warning", "error", "fatal"] as const satisfies readonly SceneCompositionValidationSeverity[]);

export const sceneCompositionValidationCodes = freezeOwned([
  "SCENE_COMPOSITION_VALID",
  "SCENE_COMPOSITION_INPUT_REQUIRED",
  "SCENE_COMPOSITION_INPUT_NOT_PLAIN_OBJECT",
  "SCENE_COMPOSITION_UNKNOWN_FIELD",
  "SCENE_COMPOSITION_EXECUTABLE_VALUE_PROHIBITED",
  "SCENE_COMPOSITION_INPUT_NOT_FROZEN",
  "SCENE_COMPOSITION_IDENTITY_REQUIRED",
  "SCENE_COMPOSITION_ID_REQUIRED",
  "SCENE_COMPOSITION_ID_INVALID",
  "SCENE_COMPOSITION_VERSION_REQUIRED",
  "SCENE_COMPOSITION_VERSION_INVALID",
  "SCENE_COMPOSITION_METADATA_REQUIRED",
  "SCENE_COMPOSITION_METADATA_INVALID",
  "SCENE_COMPOSITION_METADATA_TAG_INVALID",
  "SCENE_COMPOSITION_METADATA_TAG_DUPLICATE",
  "SCENE_COMPOSITION_STATE_INVALID",
  "SCENE_COMPOSITION_MODE_INVALID",
  "SCENE_COMPOSITION_OWNERSHIP_INVALID",
  "SCENE_COMPOSITION_LAYER_COLLECTION_REQUIRED",
  "SCENE_COMPOSITION_LAYER_COLLECTION_INVALID",
  "SCENE_COMPOSITION_LAYER_REQUIRED",
  "SCENE_COMPOSITION_LAYER_ID_REQUIRED",
  "SCENE_COMPOSITION_LAYER_ID_INVALID",
  "SCENE_COMPOSITION_LAYER_ID_DUPLICATE",
  "SCENE_COMPOSITION_LAYER_ROLE_INVALID",
  "SCENE_COMPOSITION_LAYER_ORDER_INVALID",
  "SCENE_COMPOSITION_LAYER_ORDER_DUPLICATE",
  "SCENE_COMPOSITION_GROUP_INVALID",
  "SCENE_COMPOSITION_GROUP_ID_REQUIRED",
  "SCENE_COMPOSITION_GROUP_ID_INVALID",
  "SCENE_COMPOSITION_GROUP_ID_DUPLICATE",
  "SCENE_COMPOSITION_GROUP_ROLE_INVALID",
  "SCENE_COMPOSITION_GROUP_ORDER_INVALID",
  "SCENE_COMPOSITION_GROUP_ORDER_DUPLICATE",
  "SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_INVALID",
  "SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_DUPLICATE",
  "SCENE_COMPOSITION_UNIT_REQUIRED",
  "SCENE_COMPOSITION_UNIT_INVALID",
  "SCENE_COMPOSITION_UNIT_ID_REQUIRED",
  "SCENE_COMPOSITION_UNIT_ID_INVALID",
  "SCENE_COMPOSITION_UNIT_ID_DUPLICATE",
  "SCENE_COMPOSITION_UNIT_KIND_INVALID",
  "SCENE_COMPOSITION_UNIT_LAYER_REFERENCE_INVALID",
  "SCENE_COMPOSITION_UNIT_METADATA_INVALID",
  "SCENE_COMPOSITION_NODE_REFERENCE_INVALID",
  "SCENE_COMPOSITION_NODE_REFERENCE_ID_REQUIRED",
  "SCENE_COMPOSITION_NODE_REFERENCE_ID_DUPLICATE",
  "SCENE_COMPOSITION_BINDING_NODE_ID_REQUIRED",
  "SCENE_COMPOSITION_BINDING_NODE_KIND_REQUIRED",
  "SCENE_COMPOSITION_PLACEMENT_INVALID",
  "SCENE_COMPOSITION_PLACEMENT_ROLE_INVALID",
  "SCENE_COMPOSITION_PLACEMENT_ANCHOR_INVALID",
  "SCENE_COMPOSITION_PLACEMENT_SELF_ANCHOR",
  "SCENE_COMPOSITION_RELATIVE_ORDER_INVALID",
  "SCENE_COMPOSITION_FOCUS_INVALID",
  "SCENE_COMPOSITION_FOCUS_ROLE_INVALID",
  "SCENE_COMPOSITION_FOCUS_UNIT_REFERENCE_INVALID",
  "SCENE_COMPOSITION_FOCUS_GROUP_REFERENCE_INVALID",
  "SCENE_COMPOSITION_FOCUS_LAYER_REFERENCE_INVALID",
  "SCENE_COMPOSITION_FOCUS_REFERENCE_CONFLICT",
  "SCENE_COMPOSITION_EMPHASIS_INVALID",
  "SCENE_COMPOSITION_EMPHASIS_ROLE_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_COLLECTION_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_ID_REQUIRED",
  "SCENE_COMPOSITION_RELATIONSHIP_ID_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_ID_DUPLICATE",
  "SCENE_COMPOSITION_RELATIONSHIP_ROLE_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_SOURCE_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_TARGET_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_SELF_REFERENCE",
  "SCENE_COMPOSITION_RELATIONSHIP_ORDER_INVALID",
  "SCENE_COMPOSITION_RELATIONSHIP_ORDER_DUPLICATE",
  "SCENE_COMPOSITION_ANNOTATION_COLLECTION_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_ID_REQUIRED",
  "SCENE_COMPOSITION_ANNOTATION_ID_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_ID_DUPLICATE",
  "SCENE_COMPOSITION_ANNOTATION_KIND_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_TEXT_REQUIRED",
  "SCENE_COMPOSITION_ANNOTATION_TARGET_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_TARGET_AMBIGUOUS",
  "SCENE_COMPOSITION_ANNOTATION_ORDER_INVALID",
  "SCENE_COMPOSITION_ANNOTATION_ORDER_DUPLICATE",
  "SCENE_COMPOSITION_ORDERING_INVALID",
  "SCENE_COMPOSITION_ORDER_REFERENCE_INVALID",
  "SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE",
  "SCENE_COMPOSITION_ORDER_COLLECTION_MISMATCH",
  "SCENE_COMPOSITION_ORDER_NOT_CONTIGUOUS",
  "SCENE_COMPOSITION_COLLECTION_INVALID",
  "SCENE_COMPOSITION_COLLECTION_ID_DUPLICATE",
  "SCENE_COMPOSITION_ACTIVE_REFERENCE_INVALID",
  "SCENE_COMPOSITION_SNAPSHOT_INVALID",
  "SCENE_COMPOSITION_SNAPSHOT_REFERENCE_INVALID",
  "SCENE_COMPOSITION_BINDING_COMPATIBILITY_INVALID",
  "SCENE_COMPOSITION_UPSTREAM_PHASE_INVALID",
  "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_INVALID",
  "SCENE_COMPOSITION_ACTIONABLE_TERM_PROHIBITED",
  "SCENE_COMPOSITION_REFERENCE_INTEGRITY_FAILED",
  "SCENE_COMPOSITION_CONTRACT_REGISTRY_MISMATCH",
] as const);
export type SceneCompositionValidationCode = typeof sceneCompositionValidationCodes[number];
export const sceneCompositionValidationCodeCount = sceneCompositionValidationCodes.length;

export type SceneCompositionValidationPath = readonly (string | number)[];
export type SceneCompositionValidationFinding = Readonly<{
  code: SceneCompositionValidationCode;
  severity: SceneCompositionValidationSeverity;
  message: string;
  path: SceneCompositionValidationPath;
  compositionId?: string;
  layerId?: string;
  groupId?: string;
  unitId?: string;
  relationshipId?: string;
  annotationId?: string;
  relatedId?: string;
  contractId?: string;
}>;

export type SceneCompositionValidationResult = Readonly<{
  valid: boolean;
  findings: readonly SceneCompositionValidationFinding[];
  fatalCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  checkedCompositionCount: number;
  checkedLayerCount: number;
  checkedGroupCount: number;
  checkedUnitCount: number;
  checkedRelationshipCount: number;
  checkedAnnotationCount: number;
  checkedNodeReferenceCount: number;
}>;

export type SceneCompositionValidationOptions = Readonly<{
  allowUnknownFields: boolean;
  requireFrozenInput: boolean;
  requireContiguousOrder: boolean;
  requireUniqueOrders: boolean;
  requireReferencedUnitsInSameComposition: boolean;
  requireAnnotationTarget: boolean;
  allowRelationshipSelfReference: boolean;
  allowEmptyLayers: boolean;
}>;

export const defaultSceneCompositionValidationOptions: SceneCompositionValidationOptions = freezeOwned({
  allowUnknownFields: false,
  requireFrozenInput: false,
  requireContiguousOrder: true,
  requireUniqueOrders: true,
  requireReferencedUnitsInSameComposition: true,
  requireAnnotationTarget: true,
  allowRelationshipSelfReference: false,
  allowEmptyLayers: true,
});

export type SceneCompositionValidationInput = NexoraObjectDirectorSceneCompositionContract;

const unitKinds = ["scene", "layer", "group", "node", "relationship", "annotation"] as const;
const layerRoles = ["background", "context", "primary", "relationship", "support", "overlay", "attention"] as const;
const states = ["empty", "prepared", "active", "focused", "transitioning", "suspended", "archived"] as const;
const modes = ["global", "goal", "object", "pack", "path", "comparison", "presentation"] as const;
const placementRoles = ["center", "orbit", "perimeter", "edge", "background", "overlay", "hidden"] as const;
const groupingRoles = ["goal-related", "object-related", "pack-related", "dependency-related", "comparison-related", "status-related", "narrative-related"] as const;
const relationshipRoles = ["contains", "belongs-to", "depends-on", "influences", "supports", "conflicts-with", "flows-to", "derived-from", "compares-with", "focuses-on"] as const;
const focusRoles = ["none", "candidate", "selected", "focused", "dominant", "contextual", "dimmed"] as const;
const emphasisRoles = ["neutral", "informational", "positive", "attention", "warning", "critical"] as const;
const ownershipRoles = ["director", "workspace", "runtime", "renderer", "consumer"] as const;
const annotationKinds = ["label", "status", "direction", "explanation"] as const;

type FindingIdentity = Partial<Pick<SceneCompositionValidationFinding, "compositionId" | "layerId" | "groupId" | "unitId" | "relationshipId" | "annotationId" | "relatedId" | "contractId">>;
type MutableFinding = { code: SceneCompositionValidationCode; severity: SceneCompositionValidationSeverity; message: string; path: (string | number)[] } & FindingIdentity;
type Counts = { compositions: number; layers: number; groups: number; units: number; relationships: number; annotations: number; nodeReferences: number };
type ValidationState = { findings: MutableFinding[]; counts: Counts; options: SceneCompositionValidationOptions };

function resolveOptions(options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationOptions {
  const candidate = record(options) ? options : {};
  const value = (key: keyof SceneCompositionValidationOptions): boolean => typeof candidate[key] === "boolean" ? candidate[key] : defaultSceneCompositionValidationOptions[key];
  return freezeOwned({ allowUnknownFields: value("allowUnknownFields"), requireFrozenInput: value("requireFrozenInput"), requireContiguousOrder: value("requireContiguousOrder"), requireUniqueOrders: value("requireUniqueOrders"), requireReferencedUnitsInSameComposition: value("requireReferencedUnitsInSameComposition"), requireAnnotationTarget: value("requireAnnotationTarget"), allowRelationshipSelfReference: value("allowRelationshipSelfReference"), allowEmptyLayers: value("allowEmptyLayers") });
}

function validationState(options?: Partial<SceneCompositionValidationOptions>): ValidationState {
  return { findings: [], counts: { compositions: 0, layers: 0, groups: 0, units: 0, relationships: 0, annotations: 0, nodeReferences: 0 }, options: resolveOptions(options) };
}

function add(state: ValidationState, code: SceneCompositionValidationCode, message: string, path: readonly (string | number)[], identity: FindingIdentity = {}, severity: SceneCompositionValidationSeverity = "error"): void {
  state.findings.push({ code, severity, message, path: [...path], ...identity });
}

function inspectObject(state: ValidationState, value: Record<string, unknown>, allowed: readonly string[], path: readonly (string | number)[], identity: FindingIdentity = {}): void {
  if (state.options.requireFrozenInput && !deeplyFrozen(value)) add(state, "SCENE_COMPOSITION_INPUT_NOT_FROZEN", "Input structure must be deeply frozen.", path, identity);
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key) && !state.options.allowUnknownFields) add(state, "SCENE_COMPOSITION_UNKNOWN_FIELD", `Unknown field '${key}' is not allowed.`, [...path, key], identity);
    if (executablePresent(value[key])) add(state, "SCENE_COMPOSITION_EXECUTABLE_VALUE_PROHIBITED", `Executable or non-plain value at '${key}' is prohibited.`, [...path, key], identity);
  }
}

function lexical(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

const severityPriority: Readonly<Record<SceneCompositionValidationSeverity, number>> = { fatal: 0, error: 1, warning: 2, info: 3 };
function findingKeyPart(finding: MutableFinding, key: keyof FindingIdentity): string { return String(finding[key] ?? ""); }
function compareFindings(left: MutableFinding, right: MutableFinding): number {
  const severity = severityPriority[left.severity] - severityPriority[right.severity];
  if (severity !== 0) return severity;
  const valuesLeft = [JSON.stringify(left.path), findingKeyPart(left, "compositionId"), findingKeyPart(left, "layerId"), findingKeyPart(left, "groupId"), findingKeyPart(left, "unitId"), findingKeyPart(left, "relationshipId"), findingKeyPart(left, "annotationId"), findingKeyPart(left, "relatedId"), left.code, left.message];
  const valuesRight = [JSON.stringify(right.path), findingKeyPart(right, "compositionId"), findingKeyPart(right, "layerId"), findingKeyPart(right, "groupId"), findingKeyPart(right, "unitId"), findingKeyPart(right, "relationshipId"), findingKeyPart(right, "annotationId"), findingKeyPart(right, "relatedId"), right.code, right.message];
  for (let index = 0; index < valuesLeft.length; index += 1) { const result = lexical(valuesLeft[index], valuesRight[index]); if (result !== 0) return result; }
  return lexical(findingKeyPart(left, "contractId"), findingKeyPart(right, "contractId"));
}

function canonicalFindings(findings: readonly MutableFinding[]): readonly SceneCompositionValidationFinding[] {
  const ordered = [...findings].sort(compareFindings);
  const deduplicated = ordered.filter((finding, index) => index === 0 || JSON.stringify(finding) !== JSON.stringify(ordered[index - 1]));
  return freezeOwned(deduplicated.map((finding) => freezeOwned({ ...finding, path: freezeOwned([...finding.path]) })));
}

function result(state: ValidationState): SceneCompositionValidationResult {
  const findings = canonicalFindings(state.findings);
  const count = (severity: SceneCompositionValidationSeverity): number => findings.filter((finding) => finding.severity === severity).length;
  const fatalCount = count("fatal"), errorCount = count("error"), warningCount = count("warning"), infoCount = count("info");
  return freezeOwned({ valid: fatalCount === 0 && errorCount === 0, findings, fatalCount, errorCount, warningCount, infoCount, checkedCompositionCount: state.counts.compositions, checkedLayerCount: state.counts.layers, checkedGroupCount: state.counts.groups, checkedUnitCount: state.counts.units, checkedRelationshipCount: state.counts.relationships, checkedAnnotationCount: state.counts.annotations, checkedNodeReferenceCount: state.counts.nodeReferences });
}

function idsOf(values: readonly unknown[], key: string): string[] {
  return values.filter(record).map((value) => value[key]).filter((value): value is string => typeof value === "string");
}

function checkDuplicateIds(state: ValidationState, values: readonly unknown[], key: string, code: SceneCompositionValidationCode, path: readonly (string | number)[], identityKey: keyof FindingIdentity): void {
  const ids = idsOf(values, key);
  ids.forEach((id, index) => { if (ids.indexOf(id) !== index) add(state, code, `Duplicate ${key} '${id}'.`, path, { [identityKey]: id }); });
}

function checkOrders(state: ValidationState, orders: readonly unknown[], duplicateCode: SceneCompositionValidationCode, path: readonly (string | number)[]): void {
  const valid = orders.filter(validOrder);
  if (state.options.requireUniqueOrders) valid.forEach((order, index) => { if (valid.indexOf(order) !== index) add(state, duplicateCode, `Duplicate order '${order}'.`, path, { relatedId: String(order) }); });
  if (state.options.requireContiguousOrder && valid.length === orders.length && valid.some((order) => order >= valid.length) || state.options.requireContiguousOrder && valid.length === orders.length && valid.some((_, index) => !valid.includes(index))) add(state, "SCENE_COMPOSITION_ORDER_NOT_CONTIGUOUS", "Orders must form a contiguous zero-based sequence.", path);
}

function validateEmphasis(value: unknown, state: ValidationState, path: readonly (string | number)[], identity: FindingIdentity = {}): void {
  if (!record(value)) { add(state, "SCENE_COMPOSITION_EMPHASIS_INVALID", "Emphasis must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["role", "reason", "source"], path, identity);
  if (!emphasisRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_EMPHASIS_ROLE_INVALID", "Emphasis role is invalid.", [...path, "role"], identity);
  if (!(value.reason === null || typeof value.reason === "string") || !(value.source === null || typeof value.source === "string")) add(state, "SCENE_COMPOSITION_EMPHASIS_INVALID", "Emphasis reason and source must be strings or null.", path, identity);
}

function validateMetadata(value: unknown, state: ValidationState, path: readonly (string | number)[], compositionId?: string): void {
  const identity = compositionId ? { compositionId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_METADATA_REQUIRED", "Composition metadata is required.", path, identity); return; }
  inspectObject(state, value, ["title", "description", "tags", "source", "createdBy"], path, identity);
  if (typeof value.title !== "string" || !(value.description === null || typeof value.description === "string") || !(value.source === null || typeof value.source === "string") || !ownershipRoles.includes(value.createdBy as never)) add(state, "SCENE_COMPOSITION_METADATA_INVALID", "Composition metadata fields are invalid.", path, identity);
  if (!Array.isArray(value.tags)) add(state, "SCENE_COMPOSITION_METADATA_TAG_INVALID", "Metadata tags must be an array.", [...path, "tags"], identity);
  else {
    const tags = value.tags;
    tags.forEach((tag, index) => { if (!validId(tag)) add(state, "SCENE_COMPOSITION_METADATA_TAG_INVALID", "Metadata tags must be non-empty trimmed strings.", [...path, "tags", index], identity); });
    tags.forEach((tag, index) => { if (typeof tag === "string" && tags.indexOf(tag) !== index) add(state, "SCENE_COMPOSITION_METADATA_TAG_DUPLICATE", `Duplicate metadata tag '${tag}'.`, [...path, "tags", index], identity); });
  }
}

function validateOwnership(value: unknown, state: ValidationState, path: readonly (string | number)[], compositionId?: string): void {
  const identity = compositionId ? { compositionId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_OWNERSHIP_INVALID", "Ownership must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["owner", "sourceId", "delegated"], path, identity);
  if (!ownershipRoles.includes(value.owner as never) || !(value.sourceId === null || typeof value.sourceId === "string") || typeof value.delegated !== "boolean") add(state, "SCENE_COMPOSITION_OWNERSHIP_INVALID", "Ownership fields are invalid.", path, identity);
}

function validateNodeReference(value: unknown, state: ValidationState, path: readonly (string | number)[], unitId: string | undefined, nodeReferenceIds: string[]): void {
  const identity = unitId ? { unitId } : {};
  if (value === null) return;
  state.counts.nodeReferences += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_NODE_REFERENCE_INVALID", "Node reference must be a plain object or null.", path, identity); return; }
  inspectObject(state, value, ["nodeReferenceId", "sceneBindingNodeId", "sceneBindingKind", "required"], path, identity);
  if (value.nodeReferenceId === undefined || value.nodeReferenceId === "") add(state, "SCENE_COMPOSITION_NODE_REFERENCE_ID_REQUIRED", "Node reference ID is required.", [...path, "nodeReferenceId"], identity);
  else if (!validId(value.nodeReferenceId)) add(state, "SCENE_COMPOSITION_NODE_REFERENCE_INVALID", "Node reference ID is invalid.", [...path, "nodeReferenceId"], identity);
  else {
    if (nodeReferenceIds.includes(value.nodeReferenceId)) add(state, "SCENE_COMPOSITION_NODE_REFERENCE_ID_DUPLICATE", `Duplicate node reference ID '${value.nodeReferenceId}'.`, [...path, "nodeReferenceId"], { ...identity, relatedId: value.nodeReferenceId });
    nodeReferenceIds.push(value.nodeReferenceId);
  }
  if (!validId(value.sceneBindingNodeId)) add(state, "SCENE_COMPOSITION_BINDING_NODE_ID_REQUIRED", "Scene Binding node ID is required.", [...path, "sceneBindingNodeId"], identity);
  if (!validId(value.sceneBindingKind)) add(state, "SCENE_COMPOSITION_BINDING_NODE_KIND_REQUIRED", "Scene Binding kind is required.", [...path, "sceneBindingKind"], identity);
  if (typeof value.required !== "boolean") add(state, "SCENE_COMPOSITION_NODE_REFERENCE_INVALID", "Node reference required flag must be boolean.", [...path, "required"], identity);
}

function validatePlacement(value: unknown, state: ValidationState, path: readonly (string | number)[], unitId: string | undefined, unitIds: readonly string[]): void {
  const identity = unitId ? { unitId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_PLACEMENT_INVALID", "Placement must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["role", "anchorUnitId", "relativeOrder"], path, identity);
  if (!placementRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_PLACEMENT_ROLE_INVALID", "Placement role is invalid.", [...path, "role"], identity);
  if (!(value.anchorUnitId === null || validId(value.anchorUnitId))) add(state, "SCENE_COMPOSITION_PLACEMENT_ANCHOR_INVALID", "Placement anchor must be a valid unit ID or null.", [...path, "anchorUnitId"], identity);
  else if (typeof value.anchorUnitId === "string") {
    if (value.anchorUnitId === unitId) add(state, "SCENE_COMPOSITION_PLACEMENT_SELF_ANCHOR", "A unit cannot anchor itself.", [...path, "anchorUnitId"], identity);
    else if (state.options.requireReferencedUnitsInSameComposition && !unitIds.includes(value.anchorUnitId)) add(state, "SCENE_COMPOSITION_PLACEMENT_ANCHOR_INVALID", "Placement anchor does not reference an existing unit.", [...path, "anchorUnitId"], { ...identity, relatedId: value.anchorUnitId });
  }
  if (value.role === "orbit" && value.anchorUnitId === null) add(state, "SCENE_COMPOSITION_PLACEMENT_ANCHOR_INVALID", "Orbit placement requires an anchor unit.", [...path, "anchorUnitId"], identity);
  if (!validOrder(value.relativeOrder)) add(state, "SCENE_COMPOSITION_RELATIVE_ORDER_INVALID", "Relative order must be a non-negative finite integer.", [...path, "relativeOrder"], identity);
}

function validateUnitMetadata(value: unknown, state: ValidationState, path: readonly (string | number)[], unitId?: string): void {
  const identity = unitId ? { unitId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_UNIT_METADATA_INVALID", "Unit metadata must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["caption", "semanticRole", "labels", "presentationHint"], path, identity);
  if (!(value.caption === null || typeof value.caption === "string") || !(value.semanticRole === null || typeof value.semanticRole === "string") || !(value.presentationHint === null || typeof value.presentationHint === "string") || !Array.isArray(value.labels) || !value.labels.every((label) => validId(label)) || !unique(value.labels.filter((label): label is string => typeof label === "string"))) add(state, "SCENE_COMPOSITION_UNIT_METADATA_INVALID", "Unit metadata fields are invalid.", path, identity);
}

function validateCompositionOrder(value: unknown, state: ValidationState, path: readonly (string | number)[], unitId?: string): void {
  const identity = unitId ? { unitId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_ORDERING_INVALID", "Composition order must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["layerOrder", "groupOrder", "unitOrder"], path, identity);
  if (![value.layerOrder, value.groupOrder, value.unitOrder].every(validOrder)) add(state, "SCENE_COMPOSITION_ORDERING_INVALID", "Composition order values must be non-negative finite integers.", path, identity);
}

type UnitContext = Readonly<{ layers?: readonly SceneCompositionLayerContract[]; units?: readonly SceneCompositionUnitContract[]; nodeReferenceIds?: readonly string[] }>;
function validateUnitInternal(value: unknown, state: ValidationState, context: UnitContext = {}, path: readonly (string | number)[] = ["unit"], containingLayerId?: string, nodeReferenceIds: string[] = []): void {
  state.counts.units += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_UNIT_REQUIRED", "Composition unit must be a plain object.", path); return; }
  const unitId = typeof value.unitId === "string" ? value.unitId : undefined;
  const identity = unitId ? { unitId } : {};
  inspectObject(state, value, ["unitId", "kind", "layerId", "nodeReference", "placement", "focusRole", "emphasisRole", "order", "metadata"], path, identity);
  if (value.unitId === undefined || value.unitId === "") add(state, "SCENE_COMPOSITION_UNIT_ID_REQUIRED", "Unit ID is required.", [...path, "unitId"], identity);
  else if (!validId(value.unitId)) add(state, "SCENE_COMPOSITION_UNIT_ID_INVALID", "Unit ID must be a non-empty trimmed string.", [...path, "unitId"], identity);
  if (!unitKinds.includes(value.kind as never)) add(state, "SCENE_COMPOSITION_UNIT_KIND_INVALID", "Unit kind is invalid.", [...path, "kind"], identity);
  const layerIds = (context.layers ?? []).map((layer) => layer.layerId);
  if (!validId(value.layerId) || (containingLayerId !== undefined && value.layerId !== containingLayerId) || (layerIds.length > 0 && !layerIds.includes(value.layerId))) add(state, "SCENE_COMPOSITION_UNIT_LAYER_REFERENCE_INVALID", "Unit layer reference is invalid or not reciprocal.", [...path, "layerId"], identity);
  const unitIds = (context.units ?? []).map((unit) => unit.unitId);
  validateNodeReference(value.nodeReference, state, [...path, "nodeReference"], unitId, nodeReferenceIds);
  validatePlacement(value.placement, state, [...path, "placement"], unitId, unitIds);
  if (!focusRoles.includes(value.focusRole as never)) add(state, "SCENE_COMPOSITION_FOCUS_ROLE_INVALID", "Unit focus role is invalid.", [...path, "focusRole"], identity);
  if (!emphasisRoles.includes(value.emphasisRole as never)) add(state, "SCENE_COMPOSITION_EMPHASIS_ROLE_INVALID", "Unit emphasis role is invalid.", [...path, "emphasisRole"], identity);
  validateCompositionOrder(value.order, state, [...path, "order"], unitId);
  validateUnitMetadata(value.metadata, state, [...path, "metadata"], unitId);
}

type GroupContext = Readonly<{ groups?: readonly SceneCompositionGroupContract[]; units?: readonly SceneCompositionUnitContract[]; layerId?: string }>;
function validateGroupInternal(value: unknown, state: ValidationState, context: GroupContext = {}, path: readonly (string | number)[] = ["group"]): void {
  state.counts.groups += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_GROUP_INVALID", "Composition group must be a plain object.", path); return; }
  const groupId = typeof value.groupId === "string" ? value.groupId : undefined;
  const identity = groupId ? { groupId } : {};
  inspectObject(state, value, ["groupId", "role", "title", "order", "unitIds", "focusRole", "emphasisRole"], path, identity);
  if (value.groupId === undefined || value.groupId === "") add(state, "SCENE_COMPOSITION_GROUP_ID_REQUIRED", "Group ID is required.", [...path, "groupId"], identity);
  else if (!validId(value.groupId)) add(state, "SCENE_COMPOSITION_GROUP_ID_INVALID", "Group ID must be a non-empty trimmed string.", [...path, "groupId"], identity);
  if (!groupingRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_GROUP_ROLE_INVALID", "Group role is invalid.", [...path, "role"], identity);
  if (!(value.title === null || typeof value.title === "string")) add(state, "SCENE_COMPOSITION_GROUP_INVALID", "Group title must be a string or null.", [...path, "title"], identity);
  if (!validOrder(value.order)) add(state, "SCENE_COMPOSITION_GROUP_ORDER_INVALID", "Group order must be a non-negative finite integer.", [...path, "order"], identity);
  if (!Array.isArray(value.unitIds) || !value.unitIds.every((id) => validId(id))) add(state, "SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_INVALID", "Group unit references must be valid IDs.", [...path, "unitIds"], identity);
  else {
    const refs = value.unitIds;
    refs.forEach((id, index) => { if (refs.indexOf(id) !== index) add(state, "SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_DUPLICATE", `Duplicate group unit reference '${id}'.`, [...path, "unitIds", index], { ...identity, relatedId: id }); });
    const available = (context.units ?? []).map((unit) => unit.unitId);
    if (state.options.requireReferencedUnitsInSameComposition) refs.forEach((id, index) => { if (!available.includes(id)) add(state, "SCENE_COMPOSITION_GROUP_UNIT_REFERENCE_INVALID", `Unknown group unit reference '${id}'.`, [...path, "unitIds", index], { ...identity, relatedId: id }); });
  }
  if (!focusRoles.includes(value.focusRole as never)) add(state, "SCENE_COMPOSITION_FOCUS_ROLE_INVALID", "Group focus role is invalid.", [...path, "focusRole"], identity);
  if (!emphasisRoles.includes(value.emphasisRole as never)) add(state, "SCENE_COMPOSITION_EMPHASIS_ROLE_INVALID", "Group emphasis role is invalid.", [...path, "emphasisRole"], identity);
}

type LayerContext = Readonly<{ layers?: readonly SceneCompositionLayerContract[]; units?: readonly SceneCompositionUnitContract[] }>;
function validateLayerInternal(value: unknown, state: ValidationState, context: LayerContext = {}, path: readonly (string | number)[] = ["layer"], nodeReferenceIds: string[] = []): void {
  state.counts.layers += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_LAYER_REQUIRED", "Composition layer must be a plain object.", path); return; }
  const layerId = typeof value.layerId === "string" ? value.layerId : undefined;
  const identity = layerId ? { layerId } : {};
  inspectObject(state, value, ["layerId", "role", "order", "visible", "groups", "units"], path, identity);
  if (value.layerId === undefined || value.layerId === "") add(state, "SCENE_COMPOSITION_LAYER_ID_REQUIRED", "Layer ID is required.", [...path, "layerId"], identity);
  else if (!validId(value.layerId)) add(state, "SCENE_COMPOSITION_LAYER_ID_INVALID", "Layer ID must be a non-empty trimmed string.", [...path, "layerId"], identity);
  if (!layerRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_LAYER_ROLE_INVALID", "Layer role is invalid.", [...path, "role"], identity);
  if (!validOrder(value.order)) add(state, "SCENE_COMPOSITION_LAYER_ORDER_INVALID", "Layer order must be a non-negative finite integer.", [...path, "order"], identity);
  if (typeof value.visible !== "boolean") add(state, "SCENE_COMPOSITION_LAYER_COLLECTION_INVALID", "Layer visibility must be boolean.", [...path, "visible"], identity);
  if (!Array.isArray(value.groups) || !Array.isArray(value.units)) { add(state, "SCENE_COMPOSITION_LAYER_COLLECTION_INVALID", "Layer groups and units must be arrays.", path, identity); return; }
  if (!state.options.allowEmptyLayers && value.groups.length === 0 && value.units.length === 0) add(state, "SCENE_COMPOSITION_LAYER_COLLECTION_REQUIRED", "Empty layers are not allowed.", path, identity);
  checkDuplicateIds(state, value.groups, "groupId", "SCENE_COMPOSITION_GROUP_ID_DUPLICATE", [...path, "groups"], "groupId");
  checkDuplicateIds(state, value.units, "unitId", "SCENE_COMPOSITION_UNIT_ID_DUPLICATE", [...path, "units"], "unitId");
  checkOrders(state, value.groups.filter(record).map((group) => group.order), "SCENE_COMPOSITION_GROUP_ORDER_DUPLICATE", [...path, "groups"]);
  checkOrders(state, value.units.filter(record).map((unit) => record(unit.order) ? unit.order.unitOrder : undefined), "SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE", [...path, "units"]);
  const typedUnits = value.units.filter(record) as unknown as readonly SceneCompositionUnitContract[];
  const typedLayers = context.layers ?? (layerId ? [{ layerId } as SceneCompositionLayerContract] : []);
  value.units.forEach((unit, index) => validateUnitInternal(unit, state, { layers: typedLayers, units: context.units ?? typedUnits }, [...path, "units", index], layerId, nodeReferenceIds));
  value.groups.forEach((group, index) => validateGroupInternal(group, state, { units: context.units ?? typedUnits, layerId }, [...path, "groups", index]));
}

function validateFocus(value: unknown, state: ValidationState, path: readonly (string | number)[], context: { unitIds: readonly string[]; groupIds: readonly string[]; layerIds: readonly string[] }, compositionId?: string): void {
  const identity = compositionId ? { compositionId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_FOCUS_INVALID", "Focus must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["activeUnitId", "activeGroupId", "activeLayerId", "role", "reason"], path, identity);
  if (!focusRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_FOCUS_ROLE_INVALID", "Focus role is invalid.", [...path, "role"], identity);
  if (!(value.reason === null || typeof value.reason === "string")) add(state, "SCENE_COMPOSITION_FOCUS_INVALID", "Focus reason must be a string or null.", [...path, "reason"], identity);
  const refs = [["activeUnitId", value.activeUnitId, context.unitIds, "SCENE_COMPOSITION_FOCUS_UNIT_REFERENCE_INVALID"], ["activeGroupId", value.activeGroupId, context.groupIds, "SCENE_COMPOSITION_FOCUS_GROUP_REFERENCE_INVALID"], ["activeLayerId", value.activeLayerId, context.layerIds, "SCENE_COMPOSITION_FOCUS_LAYER_REFERENCE_INVALID"]] as const;
  refs.forEach(([field, reference, available, code]) => { if (!(reference === null || validId(reference)) || typeof reference === "string" && !available.includes(reference)) add(state, code, `Focus ${field} is invalid.`, [...path, field], { ...identity, relatedId: typeof reference === "string" ? reference : undefined }); });
  const activeCount = refs.filter(([, reference]) => typeof reference === "string").length;
  if (value.role === "none" && activeCount > 0 || (value.role === "focused" || value.role === "dominant") && activeCount === 0 || activeCount > 1) add(state, "SCENE_COMPOSITION_FOCUS_REFERENCE_CONFLICT", "Focus role and active references conflict.", path, identity);
}

type RelationshipContext = Readonly<{ units?: readonly SceneCompositionUnitContract[]; relationships?: readonly SceneCompositionRelationshipContract[] }>;
function validateRelationshipInternal(value: unknown, state: ValidationState, context: RelationshipContext = {}, path: readonly (string | number)[] = ["relationship"]): void {
  state.counts.relationships += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_RELATIONSHIP_INVALID", "Relationship must be a plain object.", path); return; }
  const relationshipId = typeof value.relationshipId === "string" ? value.relationshipId : undefined;
  const identity = relationshipId ? { relationshipId } : {};
  inspectObject(state, value, ["relationshipId", "role", "source", "target", "directed", "order", "label", "emphasis"], path, identity);
  if (value.relationshipId === undefined || value.relationshipId === "") add(state, "SCENE_COMPOSITION_RELATIONSHIP_ID_REQUIRED", "Relationship ID is required.", [...path, "relationshipId"], identity);
  else if (!validId(value.relationshipId)) add(state, "SCENE_COMPOSITION_RELATIONSHIP_ID_INVALID", "Relationship ID must be a non-empty trimmed string.", [...path, "relationshipId"], identity);
  if (!relationshipRoles.includes(value.role as never)) add(state, "SCENE_COMPOSITION_RELATIONSHIP_ROLE_INVALID", "Relationship role is invalid.", [...path, "role"], identity);
  const unitIds = (context.units ?? []).map((unit) => unit.unitId);
  const endpoint = (endpointValue: unknown, expectedRole: "source" | "target", code: SceneCompositionValidationCode, endpointPath: readonly (string | number)[]): string | undefined => {
    if (!record(endpointValue)) { add(state, code, `Relationship ${expectedRole} endpoint is invalid.`, endpointPath, identity); return undefined; }
    inspectObject(state, endpointValue, ["unitId", "role"], endpointPath, identity);
    if (!validId(endpointValue.unitId) || endpointValue.role !== expectedRole || state.options.requireReferencedUnitsInSameComposition && !unitIds.includes(endpointValue.unitId)) { add(state, code, `Relationship ${expectedRole} endpoint is invalid.`, endpointPath, { ...identity, relatedId: typeof endpointValue.unitId === "string" ? endpointValue.unitId : undefined }); return undefined; }
    return endpointValue.unitId;
  };
  const sourceId = endpoint(value.source, "source", "SCENE_COMPOSITION_RELATIONSHIP_SOURCE_INVALID", [...path, "source"]);
  const targetId = endpoint(value.target, "target", "SCENE_COMPOSITION_RELATIONSHIP_TARGET_INVALID", [...path, "target"]);
  if (sourceId !== undefined && sourceId === targetId && !state.options.allowRelationshipSelfReference) add(state, "SCENE_COMPOSITION_RELATIONSHIP_SELF_REFERENCE", "Relationship self-reference is not allowed.", path, identity);
  if (typeof value.directed !== "boolean") add(state, "SCENE_COMPOSITION_RELATIONSHIP_INVALID", "Relationship directed flag must be boolean.", [...path, "directed"], identity);
  if (!validOrder(value.order)) add(state, "SCENE_COMPOSITION_RELATIONSHIP_ORDER_INVALID", "Relationship order must be a non-negative finite integer.", [...path, "order"], identity);
  if (!(value.label === null || typeof value.label === "string")) add(state, "SCENE_COMPOSITION_RELATIONSHIP_INVALID", "Relationship label must be a string or null.", [...path, "label"], identity);
  validateEmphasis(value.emphasis, state, [...path, "emphasis"], identity);
}

type AnnotationContext = Readonly<{ units?: readonly SceneCompositionUnitContract[]; relationships?: readonly SceneCompositionRelationshipContract[]; annotations?: readonly SceneCompositionAnnotationContract[] }>;
function validateAnnotationInternal(value: unknown, state: ValidationState, context: AnnotationContext = {}, path: readonly (string | number)[] = ["annotation"]): void {
  state.counts.annotations += 1;
  if (!record(value)) { add(state, "SCENE_COMPOSITION_ANNOTATION_INVALID", "Annotation must be a plain object.", path); return; }
  const annotationId = typeof value.annotationId === "string" ? value.annotationId : undefined;
  const identity = annotationId ? { annotationId } : {};
  inspectObject(state, value, ["annotationId", "unitId", "relationshipId", "kind", "text", "emphasis", "order"], path, identity);
  if (value.annotationId === undefined || value.annotationId === "") add(state, "SCENE_COMPOSITION_ANNOTATION_ID_REQUIRED", "Annotation ID is required.", [...path, "annotationId"], identity);
  else if (!validId(value.annotationId)) add(state, "SCENE_COMPOSITION_ANNOTATION_ID_INVALID", "Annotation ID must be a non-empty trimmed string.", [...path, "annotationId"], identity);
  if (!annotationKinds.includes(value.kind as never)) add(state, "SCENE_COMPOSITION_ANNOTATION_KIND_INVALID", "Annotation kind is invalid.", [...path, "kind"], identity);
  if (!validId(value.text)) add(state, "SCENE_COMPOSITION_ANNOTATION_TEXT_REQUIRED", "Annotation text is required and must be trimmed.", [...path, "text"], identity);
  const unitValid = value.unitId === null || validId(value.unitId) && (context.units ?? []).some((unit) => unit.unitId === value.unitId);
  const relationshipValid = value.relationshipId === null || validId(value.relationshipId) && (context.relationships ?? []).some((relationship) => relationship.relationshipId === value.relationshipId);
  if (!unitValid || !relationshipValid) add(state, "SCENE_COMPOSITION_ANNOTATION_TARGET_INVALID", "Annotation target reference is invalid.", path, identity);
  const targetCount = Number(typeof value.unitId === "string") + Number(typeof value.relationshipId === "string");
  if (targetCount > 1) add(state, "SCENE_COMPOSITION_ANNOTATION_TARGET_AMBIGUOUS", "Annotation cannot target both a unit and relationship.", path, identity);
  else if (state.options.requireAnnotationTarget && targetCount !== 1) add(state, "SCENE_COMPOSITION_ANNOTATION_TARGET_INVALID", "Exactly one annotation target is required.", path, identity);
  if (!validOrder(value.order)) add(state, "SCENE_COMPOSITION_ANNOTATION_ORDER_INVALID", "Annotation order must be a non-negative finite integer.", [...path, "order"], identity);
  validateEmphasis(value.emphasis, state, [...path, "emphasis"], identity);
}

function validateBindingCompatibility(value: unknown, state: ValidationState, path: readonly (string | number)[], compositionId?: string): void {
  const identity = compositionId ? { compositionId } : {};
  if (!record(value)) { add(state, "SCENE_COMPOSITION_BINDING_COMPATIBILITY_INVALID", "Binding compatibility must be a plain object.", path, identity); return; }
  inspectObject(state, value, ["upstreamPhase", "upstreamIdentity", "requiredPublicTerminology", "compatible"], path, identity);
  if (value.upstreamPhase !== "NOL-6:9") add(state, "SCENE_COMPOSITION_UPSTREAM_PHASE_INVALID", "Binding compatibility upstream phase must be NOL-6:9.", [...path, "upstreamPhase"], identity);
  if (!validId(value.upstreamIdentity) || value.compatible !== true) add(state, "SCENE_COMPOSITION_BINDING_COMPATIBILITY_INVALID", "Binding compatibility identity or compatible state is invalid.", path, identity);
  if (!record(value.requiredPublicTerminology)) { add(state, "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_INVALID", "Required public terminology is missing.", [...path, "requiredPublicTerminology"], identity); return; }
  const terminology = value.requiredPublicTerminology;
  inspectObject(state, terminology, ["visibility", "interaction", "rendererState"], [...path, "requiredPublicTerminology"], identity);
  const visibilityValid = Array.isArray(terminology.visibility) && exact(terminology.visibility, ["visible", "hidden", "collapsed"]);
  const interactionValid = Array.isArray(terminology.interaction) && exact(terminology.interaction, ["none", "selectable", "focusable", "interactive"]);
  const rendererValid = Array.isArray(terminology.rendererState) && exact(terminology.rendererState, ["minimum", "report", "operation"]);
  if (!visibilityValid || !interactionValid || !rendererValid) add(state, "SCENE_COMPOSITION_PUBLIC_TERMINOLOGY_INVALID", "Public terminology does not match the approved contract.", [...path, "requiredPublicTerminology"], identity);
  if (Array.isArray(terminology.interaction) && terminology.interaction.includes("actionable")) add(state, "SCENE_COMPOSITION_ACTIONABLE_TERM_PROHIBITED", "The actionable interaction term is prohibited.", [...path, "requiredPublicTerminology", "interaction"], identity);
}

function contractRegistryCompatible(): boolean {
  const definitions = getNexoraObjectDirectorSceneCompositionContractDefinitions();
  const requirements = getNexoraObjectDirectorSceneCompositionContractRequirements();
  const registry = getNexoraObjectDirectorSceneCompositionContractsRegistry();
  const terminology = sceneCompositionBindingCompatibilityContract.requiredPublicTerminology;
  return nexoraObjectDirectorSceneCompositionContractsId === "NOL-7:2/NexoraObjectDirectorSceneCompositionContracts"
    && nexoraObjectDirectorSceneCompositionContractsVersion === "7.2.0"
    && nexoraObjectDirectorSceneCompositionContractsNamespace === "nexora.nol.scene.composition.contracts"
    && definitions === sceneCompositionContractDefinitions
    && getNexoraObjectDirectorSceneCompositionContractDefinitionCount() === definitions.length
    && sceneCompositionContractDefinitionCount === definitions.length
    && requirements === sceneCompositionContractRequirements
    && getNexoraObjectDirectorSceneCompositionContractRequirementCount() === requirements.length
    && sceneCompositionContractRequirementCount === requirements.length
    && registry === nexoraObjectDirectorSceneCompositionContractsRegistry
    && getNexoraObjectDirectorSceneCompositionContractsRegistryCount() === registry.length
    && nexoraObjectDirectorSceneCompositionContractsRegistryCount === registry.length
    && verifyNexoraObjectDirectorSceneCompositionContracts().valid
    && isNexoraObjectDirectorSceneCompositionContractsFrozen()
    && verifyNexoraObjectDirectorSceneCompositionFoundationCompatibility().compatible
    && exact(terminology.visibility, ["visible", "hidden", "collapsed"])
    && exact(terminology.interaction, ["none", "selectable", "focusable", "interactive"])
    && exact(terminology.rendererState, ["minimum", "report", "operation"]);
}

const contractsRegistryCompatible = contractRegistryCompatible();

function collectCompositionParts(value: Record<string, unknown>): { layers: readonly SceneCompositionLayerContract[]; groups: readonly SceneCompositionGroupContract[]; units: readonly SceneCompositionUnitContract[]; relationships: readonly SceneCompositionRelationshipContract[]; annotations: readonly SceneCompositionAnnotationContract[] } {
  const layers = Array.isArray(value.layers) ? value.layers.filter(record) as unknown as readonly SceneCompositionLayerContract[] : [];
  const groups = layers.flatMap((layer) => Array.isArray(layer.groups) ? layer.groups.filter(record) as unknown as readonly SceneCompositionGroupContract[] : []);
  const units = layers.flatMap((layer) => Array.isArray(layer.units) ? layer.units.filter(record) as unknown as readonly SceneCompositionUnitContract[] : []);
  const relationships = Array.isArray(value.relationships) ? value.relationships.filter(record) as unknown as readonly SceneCompositionRelationshipContract[] : [];
  const annotations = Array.isArray(value.annotations) ? value.annotations.filter(record) as unknown as readonly SceneCompositionAnnotationContract[] : [];
  return { layers, groups, units, relationships, annotations };
}

function validateCompositionInternal(input: unknown, state: ValidationState, path: readonly (string | number)[] = []): void {
  if (input === null || input === undefined) { add(state, "SCENE_COMPOSITION_INPUT_REQUIRED", "Scene composition input is required.", path, {}, "fatal"); return; }
  if (!record(input)) { add(state, "SCENE_COMPOSITION_INPUT_NOT_PLAIN_OBJECT", "Scene composition input must be a plain object.", path, {}, "fatal"); return; }
  state.counts.compositions += 1;
  if (executablePresent(input)) add(state, "SCENE_COMPOSITION_EXECUTABLE_VALUE_PROHIBITED", "Scene composition contains an executable or non-plain value.", path, {}, "fatal");
  const compositionId = record(input.identity) && typeof input.identity.compositionId === "string" ? input.identity.compositionId : undefined;
  const identity = compositionId ? { compositionId } : {};
  inspectObject(state, input, ["identity", "metadata", "state", "mode", "ownership", "layers", "relationships", "annotations", "focus", "bindingCompatibility"], path, identity);
  if (!record(input.identity)) add(state, "SCENE_COMPOSITION_IDENTITY_REQUIRED", "Composition identity is required.", [...path, "identity"], identity);
  else {
    inspectObject(state, input.identity, ["compositionId", "kind", "version"], [...path, "identity"], identity);
    if (input.identity.compositionId === undefined || input.identity.compositionId === "") add(state, "SCENE_COMPOSITION_ID_REQUIRED", "Composition ID is required.", [...path, "identity", "compositionId"], identity);
    else if (!validId(input.identity.compositionId)) add(state, "SCENE_COMPOSITION_ID_INVALID", "Composition ID must be a non-empty trimmed string.", [...path, "identity", "compositionId"], identity);
    if (input.identity.version === undefined || input.identity.version === "") add(state, "SCENE_COMPOSITION_VERSION_REQUIRED", "Composition version is required.", [...path, "identity", "version"], identity);
    else if (typeof input.identity.version !== "string" || !/^\d+\.\d+\.\d+$/.test(input.identity.version)) add(state, "SCENE_COMPOSITION_VERSION_INVALID", "Composition version must be a semantic version string.", [...path, "identity", "version"], identity);
    if (input.identity.kind !== "scene") add(state, "SCENE_COMPOSITION_IDENTITY_REQUIRED", "Composition identity kind must be scene.", [...path, "identity", "kind"], identity);
  }
  validateMetadata(input.metadata, state, [...path, "metadata"], compositionId);
  if (!states.includes(input.state as never)) add(state, "SCENE_COMPOSITION_STATE_INVALID", "Composition state is invalid.", [...path, "state"], identity);
  if (!modes.includes(input.mode as never)) add(state, "SCENE_COMPOSITION_MODE_INVALID", "Composition mode is invalid.", [...path, "mode"], identity);
  validateOwnership(input.ownership, state, [...path, "ownership"], compositionId);
  const parts = collectCompositionParts(input);
  if (!Array.isArray(input.layers)) add(state, "SCENE_COMPOSITION_LAYER_COLLECTION_REQUIRED", "Layer collection is required.", [...path, "layers"], identity);
  else {
    checkDuplicateIds(state, input.layers, "layerId", "SCENE_COMPOSITION_LAYER_ID_DUPLICATE", [...path, "layers"], "layerId");
    checkDuplicateIds(state, parts.groups, "groupId", "SCENE_COMPOSITION_GROUP_ID_DUPLICATE", [...path, "layers"], "groupId");
    checkDuplicateIds(state, parts.units, "unitId", "SCENE_COMPOSITION_UNIT_ID_DUPLICATE", [...path, "layers"], "unitId");
    checkOrders(state, input.layers.filter(record).map((layer) => layer.order), "SCENE_COMPOSITION_LAYER_ORDER_DUPLICATE", [...path, "layers"]);
    const nodeReferenceIds: string[] = [];
    input.layers.forEach((layer, index) => validateLayerInternal(layer, state, { layers: parts.layers, units: parts.units }, [...path, "layers", index], nodeReferenceIds));
  }
  if (!Array.isArray(input.relationships)) add(state, "SCENE_COMPOSITION_RELATIONSHIP_COLLECTION_INVALID", "Relationship collection must be an array.", [...path, "relationships"], identity);
  else {
    checkDuplicateIds(state, input.relationships, "relationshipId", "SCENE_COMPOSITION_RELATIONSHIP_ID_DUPLICATE", [...path, "relationships"], "relationshipId");
    checkOrders(state, input.relationships.filter(record).map((relationship) => relationship.order), "SCENE_COMPOSITION_RELATIONSHIP_ORDER_DUPLICATE", [...path, "relationships"]);
    input.relationships.forEach((relationship, index) => validateRelationshipInternal(relationship, state, { units: parts.units, relationships: parts.relationships }, [...path, "relationships", index]));
  }
  if (!Array.isArray(input.annotations)) add(state, "SCENE_COMPOSITION_ANNOTATION_COLLECTION_INVALID", "Annotation collection must be an array.", [...path, "annotations"], identity);
  else {
    checkDuplicateIds(state, input.annotations, "annotationId", "SCENE_COMPOSITION_ANNOTATION_ID_DUPLICATE", [...path, "annotations"], "annotationId");
    checkOrders(state, input.annotations.filter(record).map((annotation) => annotation.order), "SCENE_COMPOSITION_ANNOTATION_ORDER_DUPLICATE", [...path, "annotations"]);
    input.annotations.forEach((annotation, index) => validateAnnotationInternal(annotation, state, { units: parts.units, relationships: parts.relationships, annotations: parts.annotations }, [...path, "annotations", index]));
  }
  validateFocus(input.focus, state, [...path, "focus"], { unitIds: parts.units.map((unit) => unit.unitId), groupIds: parts.groups.map((group) => group.groupId), layerIds: parts.layers.map((layer) => layer.layerId) }, compositionId);
  validateBindingCompatibility(input.bindingCompatibility, state, [...path, "bindingCompatibility"], compositionId);
}

export function validateNexoraObjectDirectorSceneComposition(input: unknown, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options);
  if (!contractsRegistryCompatible) add(state, "SCENE_COMPOSITION_CONTRACT_REGISTRY_MISMATCH", "NOL-7:2 Contracts registry compatibility failed.", [], { contractId: nexoraObjectDirectorSceneCompositionContractsId }, "fatal");
  validateCompositionInternal(input, state);
  return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionLayer(layer: unknown, context: LayerContext = {}, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateLayerInternal(layer, state, context); return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionGroup(group: unknown, context: GroupContext = {}, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateGroupInternal(group, state, context); return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionUnit(unit: unknown, context: UnitContext = {}, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateUnitInternal(unit, state, context, ["unit"], undefined, [...(context.nodeReferenceIds ?? [])]); return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionRelationship(relationship: unknown, context: RelationshipContext = {}, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateRelationshipInternal(relationship, state, context); return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionAnnotation(annotation: unknown, context: AnnotationContext = {}, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateAnnotationInternal(annotation, state, context); return result(state);
}

type OrderingContext = Readonly<{ layers: readonly SceneCompositionLayerContract[]; groups: readonly SceneCompositionGroupContract[]; units: readonly SceneCompositionUnitContract[]; relationships: readonly SceneCompositionRelationshipContract[]; annotations: readonly SceneCompositionAnnotationContract[] }>;
function validateOrderingInternal(ordering: unknown, context: OrderingContext, state: ValidationState, path: readonly (string | number)[] = ["ordering"]): void {
  if (!record(ordering)) { add(state, "SCENE_COMPOSITION_ORDERING_INVALID", "Ordering must be a plain object.", path); return; }
  inspectObject(state, ordering, ["layerOrder", "groupOrder", "unitOrder", "relationshipOrder", "annotationOrder"], path);
  const definitions = [["layerOrder", context.layers.map((item) => item.layerId), context.layers.map((item) => item.order)], ["groupOrder", context.groups.map((item) => item.groupId), context.groups.map((item) => item.order)], ["unitOrder", context.units.map((item) => item.unitId), context.units.map((item) => item.order.unitOrder)], ["relationshipOrder", context.relationships.map((item) => item.relationshipId), context.relationships.map((item) => item.order)], ["annotationOrder", context.annotations.map((item) => item.annotationId), context.annotations.map((item) => item.order)]] as const;
  definitions.forEach(([field, expectedIds, numericOrders]) => {
    const value = ordering[field];
    if (!Array.isArray(value) || !value.every(validId)) { add(state, "SCENE_COMPOSITION_ORDERING_INVALID", `${field} must contain string IDs.`, [...path, field]); return; }
    value.forEach((id, index) => { if (value.indexOf(id) !== index) add(state, "SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE", `Duplicate ordering reference '${id}'.`, [...path, field, index], { relatedId: id }); else if (!expectedIds.includes(id)) add(state, "SCENE_COMPOSITION_ORDER_REFERENCE_INVALID", `Unknown ordering reference '${id}'.`, [...path, field, index], { relatedId: id }); });
    if (value.length !== expectedIds.length || expectedIds.some((id) => !value.includes(id))) add(state, "SCENE_COMPOSITION_ORDER_COLLECTION_MISMATCH", `${field} does not exactly match its collection.`, [...path, field]);
    checkOrders(state, numericOrders, "SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE", [...path, field]);
  });
}

export function validateNexoraObjectDirectorSceneCompositionOrdering(ordering: unknown, context: OrderingContext, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options); validateOrderingInternal(ordering, context, state); return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionCollection(collection: unknown, options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options);
  if (!record(collection)) { add(state, "SCENE_COMPOSITION_COLLECTION_INVALID", "Composition collection must be a plain object.", ["collection"]); return result(state); }
  inspectObject(state, collection, ["compositions", "activeCompositionId", "order"], ["collection"]);
  if (!Array.isArray(collection.compositions)) { add(state, "SCENE_COMPOSITION_COLLECTION_INVALID", "Compositions must be an array.", ["collection", "compositions"]); return result(state); }
  const compositions = collection.compositions;
  compositions.forEach((composition, index) => validateCompositionInternal(composition, state, ["collection", "compositions", index]));
  const compositionIds = compositions.filter(record).map((composition) => record(composition.identity) ? composition.identity.compositionId : undefined).filter((id): id is string => typeof id === "string");
  compositionIds.forEach((id, index) => { if (compositionIds.indexOf(id) !== index) add(state, "SCENE_COMPOSITION_COLLECTION_ID_DUPLICATE", `Duplicate composition ID '${id}'.`, ["collection", "compositions", index], { compositionId: id }); });
  if (!(collection.activeCompositionId === null || validId(collection.activeCompositionId) && compositionIds.includes(collection.activeCompositionId))) add(state, "SCENE_COMPOSITION_ACTIVE_REFERENCE_INVALID", "Active composition reference is invalid.", ["collection", "activeCompositionId"], { relatedId: typeof collection.activeCompositionId === "string" ? collection.activeCompositionId : undefined });
  const collectionOrder = collection.order;
  if (!Array.isArray(collectionOrder) || !collectionOrder.every(validId)) add(state, "SCENE_COMPOSITION_ORDERING_INVALID", "Composition order must contain string IDs.", ["collection", "order"]);
  else {
    collectionOrder.forEach((id, index) => { if (collectionOrder.indexOf(id) !== index) add(state, "SCENE_COMPOSITION_ORDER_REFERENCE_DUPLICATE", `Duplicate composition order reference '${id}'.`, ["collection", "order", index], { relatedId: id }); else if (!compositionIds.includes(id)) add(state, "SCENE_COMPOSITION_ORDER_REFERENCE_INVALID", `Unknown composition order reference '${id}'.`, ["collection", "order", index], { relatedId: id }); });
    if (collectionOrder.length !== compositionIds.length || compositionIds.some((id) => !collectionOrder.includes(id))) add(state, "SCENE_COMPOSITION_ORDER_COLLECTION_MISMATCH", "Composition order does not match the collection.", ["collection", "order"]);
  }
  return result(state);
}

export function validateNexoraObjectDirectorSceneCompositionSnapshot(snapshot: unknown, context: readonly NexoraObjectDirectorSceneCompositionContract[] = [], options?: Partial<SceneCompositionValidationOptions>): SceneCompositionValidationResult {
  const state = validationState(options);
  if (!record(snapshot)) { add(state, "SCENE_COMPOSITION_SNAPSHOT_INVALID", "Snapshot must be a plain object.", ["snapshot"]); return result(state); }
  inspectObject(state, snapshot, ["snapshotId", "compositionId", "state", "mode", "focus", "ordering"], ["snapshot"]);
  if (!validId(snapshot.snapshotId)) add(state, "SCENE_COMPOSITION_SNAPSHOT_INVALID", "Snapshot ID is required and must be trimmed.", ["snapshot", "snapshotId"]);
  const composition = context.find((item) => item.identity.compositionId === snapshot.compositionId);
  if (!validId(snapshot.compositionId) || context.length > 0 && composition === undefined) add(state, "SCENE_COMPOSITION_SNAPSHOT_REFERENCE_INVALID", "Snapshot composition reference is invalid.", ["snapshot", "compositionId"], { relatedId: typeof snapshot.compositionId === "string" ? snapshot.compositionId : undefined });
  if (!states.includes(snapshot.state as never)) add(state, "SCENE_COMPOSITION_STATE_INVALID", "Snapshot state is invalid.", ["snapshot", "state"]);
  if (!modes.includes(snapshot.mode as never)) add(state, "SCENE_COMPOSITION_MODE_INVALID", "Snapshot mode is invalid.", ["snapshot", "mode"]);
  const parts = composition ? collectCompositionParts(composition as unknown as Record<string, unknown>) : { layers: [], groups: [], units: [], relationships: [], annotations: [] };
  validateFocus(snapshot.focus, state, ["snapshot", "focus"], { unitIds: parts.units.map((unit) => unit.unitId), groupIds: parts.groups.map((group) => group.groupId), layerIds: parts.layers.map((layer) => layer.layerId) }, typeof snapshot.compositionId === "string" ? snapshot.compositionId : undefined);
  validateOrderingInternal(snapshot.ordering, parts, state, ["snapshot", "ordering"]);
  return result(state);
}

export function isNexoraObjectDirectorSceneCompositionValidationResult(value: unknown): value is SceneCompositionValidationResult {
  if (!record(value) || typeof value.valid !== "boolean" || !Array.isArray(value.findings)) return false;
  const findings = value.findings;
  const countKeys = ["fatalCount", "errorCount", "warningCount", "infoCount", "checkedCompositionCount", "checkedLayerCount", "checkedGroupCount", "checkedUnitCount", "checkedRelationshipCount", "checkedAnnotationCount", "checkedNodeReferenceCount"] as const;
  if (!countKeys.every((key) => validOrder(value[key]))) return false;
  const findingsValid = findings.every((finding) => record(finding) && sceneCompositionValidationCodes.includes(finding.code as never) && sceneCompositionValidationSeverities.includes(finding.severity as never) && typeof finding.message === "string" && Array.isArray(finding.path) && finding.path.every((part) => typeof part === "string" || validOrder(part)));
  if (!findingsValid) return false;
  const severityCount = (severity: string): number => findings.filter((finding) => record(finding) && finding.severity === severity).length;
  return value.fatalCount === severityCount("fatal") && value.errorCount === severityCount("error") && value.warningCount === severityCount("warning") && value.infoCount === severityCount("info") && value.valid === (value.fatalCount === 0 && value.errorCount === 0);
}

export function getNexoraObjectDirectorSceneCompositionValidationSummary(resultValue: SceneCompositionValidationResult): Readonly<{ status: "valid" | "valid-with-warnings" | "invalid" | "fatal"; findingCount: number; fatalCount: number; errorCount: number; warningCount: number; infoCount: number; checkedCompositionCount: number; checkedLayerCount: number; checkedGroupCount: number; checkedUnitCount: number; checkedRelationshipCount: number; checkedAnnotationCount: number; checkedNodeReferenceCount: number }> {
  const status = resultValue.fatalCount > 0 ? "fatal" : resultValue.errorCount > 0 ? "invalid" : resultValue.warningCount > 0 ? "valid-with-warnings" : "valid";
  return freezeOwned({ status, findingCount: resultValue.findings.length, fatalCount: resultValue.fatalCount, errorCount: resultValue.errorCount, warningCount: resultValue.warningCount, infoCount: resultValue.infoCount, checkedCompositionCount: resultValue.checkedCompositionCount, checkedLayerCount: resultValue.checkedLayerCount, checkedGroupCount: resultValue.checkedGroupCount, checkedUnitCount: resultValue.checkedUnitCount, checkedRelationshipCount: resultValue.checkedRelationshipCount, checkedAnnotationCount: resultValue.checkedAnnotationCount, checkedNodeReferenceCount: resultValue.checkedNodeReferenceCount });
}

export const nexoraObjectDirectorSceneCompositionValidationCapabilities = freezeOwned(["composition-validation", "layer-validation", "group-validation", "unit-validation", "relationship-validation", "annotation-validation", "ordering-validation", "collection-validation", "snapshot-validation", "identity-validation", "metadata-validation", "reference-integrity-validation", "duplicate-detection", "order-integrity-validation", "focus-validation", "placement-validation", "binding-compatibility-validation", "public-terminology-validation", "unknown-field-validation", "frozen-input-validation", "plain-data-validation", "canonical-finding-order", "finding-deduplication", "immutable-results", "contract-registry-compatibility", "dynamic-summary", "non-mutation", "deterministic-validation"] as const);
export const nexoraObjectDirectorSceneCompositionValidationCapabilityCount = nexoraObjectDirectorSceneCompositionValidationCapabilities.length;

export const nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiSurface = freezeOwned(["validateNexoraObjectDirectorSceneComposition", "validateNexoraObjectDirectorSceneCompositionLayer", "validateNexoraObjectDirectorSceneCompositionGroup", "validateNexoraObjectDirectorSceneCompositionUnit", "validateNexoraObjectDirectorSceneCompositionRelationship", "validateNexoraObjectDirectorSceneCompositionAnnotation", "validateNexoraObjectDirectorSceneCompositionOrdering", "validateNexoraObjectDirectorSceneCompositionCollection", "validateNexoraObjectDirectorSceneCompositionSnapshot", "isNexoraObjectDirectorSceneCompositionValidationResult", "getNexoraObjectDirectorSceneCompositionValidationSummary"] as const);
export const nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiCount = nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiSurface.length;

const validationRegistryData = [
  ["Identity", ["nexoraObjectDirectorSceneCompositionValidationId", "nexoraObjectDirectorSceneCompositionValidationVersion", "nexoraObjectDirectorSceneCompositionValidationNamespace"]],
  ["Severities", ["sceneCompositionValidationSeverities"]],
  ["Validation Codes", ["sceneCompositionValidationCodes", "sceneCompositionValidationCodeCount"]],
  ["Validation Options", ["defaultSceneCompositionValidationOptions"]],
  ["Validation Findings", ["SceneCompositionValidationFinding", "SceneCompositionValidationPath"]],
  ["Validation Result", ["SceneCompositionValidationResult"]],
  ["Composition Validation", ["validateNexoraObjectDirectorSceneComposition"]],
  ["Component Validators", ["validateNexoraObjectDirectorSceneCompositionLayer", "validateNexoraObjectDirectorSceneCompositionGroup", "validateNexoraObjectDirectorSceneCompositionUnit", "validateNexoraObjectDirectorSceneCompositionRelationship", "validateNexoraObjectDirectorSceneCompositionAnnotation", "validateNexoraObjectDirectorSceneCompositionOrdering"]],
  ["Collection and Snapshot Validation", ["validateNexoraObjectDirectorSceneCompositionCollection", "validateNexoraObjectDirectorSceneCompositionSnapshot"]],
  ["Result Guard", ["isNexoraObjectDirectorSceneCompositionValidationResult"]],
  ["Summary", ["getNexoraObjectDirectorSceneCompositionValidationSummary"]],
  ["Contract Compatibility", ["verifyNexoraObjectDirectorSceneCompositionContracts"]],
  ["Public APIs", [...nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiSurface, "getNexoraObjectDirectorSceneCompositionValidationRegistry", "getNexoraObjectDirectorSceneCompositionValidationRegistryCount", "verifyNexoraObjectDirectorSceneCompositionValidationRegistry", "isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen"]],
  ["Dependency", ["NOL-7:2/NexoraObjectDirectorSceneCompositionContracts"]],
  ["Validation Capabilities", ["nexoraObjectDirectorSceneCompositionValidationCapabilities"]],
  ["Readiness", ["sceneCompositionValidationStatus", "ready-for-certification"]],
  ["Release Information", ["sceneCompositionValidationStatus", "released", "immutable", "deterministic"]],
] as const;

export type SceneCompositionValidationRegistryEntry = Readonly<{ order: number; section: string; exportNames: readonly string[]; locked: true }>;
export const nexoraObjectDirectorSceneCompositionValidationRegistry: readonly SceneCompositionValidationRegistryEntry[] = freezeOwned(validationRegistryData.map(([section, exportNames], order) => freezeOwned({ order, section, exportNames: freezeOwned([...exportNames]), locked: true })));
export const nexoraObjectDirectorSceneCompositionValidationRegistryCount = nexoraObjectDirectorSceneCompositionValidationRegistry.length;

export function getNexoraObjectDirectorSceneCompositionValidationRegistry(): typeof nexoraObjectDirectorSceneCompositionValidationRegistry { return nexoraObjectDirectorSceneCompositionValidationRegistry; }
export function getNexoraObjectDirectorSceneCompositionValidationRegistryCount(): number { return nexoraObjectDirectorSceneCompositionValidationRegistry.length; }
export function isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen(): boolean { return deeplyFrozen(nexoraObjectDirectorSceneCompositionValidationRegistry) && deeplyFrozen(nexoraObjectDirectorSceneCompositionValidationCapabilities) && deeplyFrozen(sceneCompositionValidationCodes) && deeplyFrozen(sceneCompositionValidationSeverities) && deeplyFrozen(defaultSceneCompositionValidationOptions) && deeplyFrozen(sceneCompositionValidationStatus); }
export function verifyNexoraObjectDirectorSceneCompositionValidationRegistry(): Readonly<{ valid: boolean; ordered: boolean; unique: boolean; countValid: boolean; publicApisValid: boolean; capabilitiesValid: boolean; frozen: boolean; violations: readonly string[] }> {
  const ordered = nexoraObjectDirectorSceneCompositionValidationRegistry.every((entry, index) => entry.order === index && entry.section === validationRegistryData[index][0]);
  const sections = nexoraObjectDirectorSceneCompositionValidationRegistry.map((entry) => entry.section);
  const uniqueEntries = unique(sections);
  const countValid = nexoraObjectDirectorSceneCompositionValidationRegistryCount === validationRegistryData.length;
  const publicApis = validationRegistryData[12][1];
  const publicApisValid = publicApis.length === 15 && unique(publicApis) && nexoraObjectDirectorSceneCompositionValidationPrimaryPublicApiCount === 11;
  const capabilitiesValid = nexoraObjectDirectorSceneCompositionValidationCapabilityCount === nexoraObjectDirectorSceneCompositionValidationCapabilities.length && unique(nexoraObjectDirectorSceneCompositionValidationCapabilities);
  const frozen = isNexoraObjectDirectorSceneCompositionValidationRegistryFrozen();
  const checks = [[ordered, "Validation registry order is invalid"], [uniqueEntries, "Validation registry sections are duplicated"], [countValid, "Validation registry count is invalid"], [publicApisValid, "Validation public APIs are invalid"], [capabilitiesValid, "Validation capabilities are invalid"], [frozen, "Validation registry is mutable"]] as const;
  const violations = checks.filter(([passed]) => !passed).map(([, message]) => message);
  return freezeOwned({ valid: violations.length === 0, ordered, unique: uniqueEntries, countValid, publicApisValid, capabilitiesValid, frozen, violations: freezeOwned(violations) });
}
