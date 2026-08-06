/** NOL-6:2 — immutable contract declarations for Director Scene Binding. */
import {
  nexoraDirectorSceneBindingStates,
  nexoraDirectorSceneNodeKinds,
  nexoraDirectorSceneNodeVisibilities,
} from "./nexoraObjectDirectorSceneBindingFoundation.ts";

export const sceneBindingContractId = "NOL-6:2/NexoraObjectDirectorSceneBindingContracts" as const;
export const sceneBindingContractVersion = "6.2.0" as const;
export const sceneBindingContractNamespace = "nexora.nol.scene.binding.contracts" as const;

const frozen = <T>(value: T): Readonly<T> => Object.freeze(value);
const fields = (...values: string[]): readonly string[] => frozen(values);
const rules = (...values: string[]): readonly string[] => frozen(values);

export const SceneNodeContract = frozen({ contractName: "SceneNodeContract", order: 1, requiredFields: fields("nodeId", "kind", "parentId", "children", "visibility", "interaction", "binding", "order"), plainDataOnly: true, methodsForbidden: true, immutable: true } as const);
export const SceneNodeIdentityContract = frozen({ contractName: "SceneNodeIdentityContract", order: 2, requiredFields: fields("nodeId", "kind"), supportedKinds: nexoraDirectorSceneNodeKinds, stableIdentityRequired: true, immutable: true } as const);
export const SceneNodeRelationshipContract = frozen({ contractName: "SceneNodeRelationshipContract", order: 3, supportedDefinitions: fields("parent", "children", "ancestor", "descendant", "root", "leaf"), identifiersOnly: true, orderedChildren: true, immutable: true } as const);
export const SceneNodeCollectionContract = frozen({ contractName: "SceneNodeCollectionContract", order: 4, requiredFields: fields("nodes", "count", "ordered"), itemContract: "SceneNodeContract", ordered: true, countDerivedFromItems: true, immutable: true } as const);

export const RendererBindingContract = frozen({ contractName: "RendererBindingContract", order: 5, requiredFields: fields("rendererObjectId", "rendererState", "rendererCapabilities", "rendererBindingType"), sourceIdentityPreserved: true, implementationForbidden: true, immutable: true } as const);
export const RendererObjectContract = frozen({ contractName: "RendererObjectContract", order: 6, requiredFields: fields("rendererObjectId", "rendererState", "rendererCapabilities", "rendererBindingType"), implementationForbidden: true, immutable: true } as const);
export const RendererStateContract = frozen({ contractName: "RendererStateContract", order: 7, supportedStates: fields("minimum", "report", "operation"), additionalStatesForbidden: true, immutable: true } as const);

export const VisibilityContract = frozen({ contractName: "VisibilityContract", order: 8, supportedValues: nexoraDirectorSceneNodeVisibilities, foundationAligned: true, immutable: true } as const);
export const VisibilityCollectionContract = frozen({ contractName: "VisibilityCollectionContract", order: 9, requiredFields: fields("values", "count", "ordered"), itemContract: "VisibilityContract", ordered: true, countDerivedFromItems: true, immutable: true } as const);

export const InteractionContract = frozen({ contractName: "InteractionContract", order: 10, requiredFields: fields("mode", "selectable", "focusable", "interactive"), executableHandlersForbidden: true, capabilityDefinitionsOnly: true, immutable: true } as const);
export const InteractionModeContract = frozen({ contractName: "InteractionModeContract", order: 11, supportedModes: fields("none", "selectable", "focusable", "interactive"), foundationActionableSemantic: "interactive", immutable: true } as const);
export const InteractionCollectionContract = frozen({ contractName: "InteractionCollectionContract", order: 12, requiredFields: fields("interactions", "count", "ordered"), itemContract: "InteractionContract", ordered: true, countDerivedFromItems: true, immutable: true } as const);

export const SceneOrderContract = frozen({ contractName: "SceneOrderContract", order: 13, requiredFields: fields("order"), sequential: true, stable: true, sourceOrderPreserved: true, immutable: true } as const);
export const SceneHierarchyContract = frozen({ contractName: "SceneHierarchyContract", order: 14, requiredFields: fields("parentId", "children"), relationshipDefinitions: SceneNodeRelationshipContract.supportedDefinitions, rules: rules("a node has zero or one parent", "children remain ordered", "self-parenting is forbidden", "self-children are forbidden", "duplicate children are forbidden"), immutable: true } as const);

export const SceneBindingValidationContract = frozen({ contractName: "SceneBindingValidationContract", order: 15, requiredFields: fields("requiredFields", "supportedEnums", "orderingRules", "hierarchyRules", "bindingRules"), supportedEnums: frozen({ nodeKinds: nexoraDirectorSceneNodeKinds, bindingStates: nexoraDirectorSceneBindingStates, visibility: nexoraDirectorSceneNodeVisibilities, rendererStates: RendererStateContract.supportedStates, interactionModes: InteractionModeContract.supportedModes }), orderingRules: SceneOrderContract, hierarchyRules: SceneHierarchyContract, bindingRules: RendererBindingContract, executionForbidden: true, immutable: true } as const);
export const SceneBindingCertificationContract = frozen({ contractName: "SceneBindingCertificationContract", order: 16, requiredEvidence: fields("identity", "namespace", "version", "registryIntegrity", "orderingIntegrity", "deepImmutability", "dependencyBoundary"), structuralCertificationOnly: true, runtimeCertificationForbidden: true, immutable: true } as const);

export const sceneBindingContractRegistry = frozen([
  SceneNodeContract,
  SceneNodeIdentityContract,
  SceneNodeRelationshipContract,
  SceneNodeCollectionContract,
  RendererBindingContract,
  RendererObjectContract,
  RendererStateContract,
  VisibilityContract,
  VisibilityCollectionContract,
  InteractionContract,
  InteractionModeContract,
  InteractionCollectionContract,
  SceneOrderContract,
  SceneHierarchyContract,
  SceneBindingValidationContract,
  SceneBindingCertificationContract,
] as const);

export const sceneBindingContractCount = sceneBindingContractRegistry.length;

export interface SceneBindingContractsVerificationReport { readonly valid: boolean; readonly identityValid: boolean; readonly registryComplete: boolean; readonly registryOrdered: boolean; readonly registryUnique: boolean; readonly contractsFrozen: boolean; readonly foundationAligned: boolean; readonly violations: readonly string[]; }

function deeplyFrozen(value: unknown): boolean { if (value === null || typeof value !== "object") return true; if (!Object.isFrozen(value)) return false; return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child)); }

export function getSceneBindingContractRegistry(): typeof sceneBindingContractRegistry { return sceneBindingContractRegistry; }
export function getSceneBindingContractCount(): number { return sceneBindingContractRegistry.length; }
export function isSceneBindingContractsFrozen(): boolean { return sceneBindingContractRegistry.every((contract) => deeplyFrozen(contract)) && deeplyFrozen(sceneBindingContractRegistry); }
export function verifySceneBindingContracts(): SceneBindingContractsVerificationReport { const identityValid = sceneBindingContractId === "NOL-6:2/NexoraObjectDirectorSceneBindingContracts" && sceneBindingContractVersion === "6.2.0" && sceneBindingContractNamespace === "nexora.nol.scene.binding.contracts", registryComplete = sceneBindingContractRegistry.length === 16 && sceneBindingContractCount === sceneBindingContractRegistry.length, registryOrdered = sceneBindingContractRegistry.every((contract, index) => contract.order === index + 1), contractNames = sceneBindingContractRegistry.map((contract) => contract.contractName), registryUnique = contractNames.every((name, index) => contractNames.indexOf(name) === index), contractsFrozen = isSceneBindingContractsFrozen(), foundationAligned = VisibilityContract.supportedValues === nexoraDirectorSceneNodeVisibilities && SceneNodeIdentityContract.supportedKinds === nexoraDirectorSceneNodeKinds && SceneBindingValidationContract.supportedEnums.bindingStates === nexoraDirectorSceneBindingStates, violations: string[] = []; if (!identityValid) violations.push("Contract identity is invalid"); if (!registryComplete) violations.push("Contract registry is incomplete"); if (!registryOrdered) violations.push("Contract registry order is invalid"); if (!registryUnique) violations.push("Contract names are duplicated"); if (!contractsFrozen) violations.push("A contract is mutable"); if (!foundationAligned) violations.push("Foundation contract alignment is invalid"); return frozen({ valid: violations.length === 0, identityValid, registryComplete, registryOrdered, registryUnique, contractsFrozen, foundationAligned, violations: frozen(violations) }); }
