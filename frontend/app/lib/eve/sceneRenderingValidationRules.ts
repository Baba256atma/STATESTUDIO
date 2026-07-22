import { SceneRenderingModel } from "./sceneRenderingModel.ts";
import type {
  SceneRenderingValidationCategory,
  SceneRenderingValidationGate,
  SceneRenderingValidationRule,
} from "./sceneRenderingValidationTypes.ts";

const categoryNames: readonly SceneRenderingValidationCategory[] = Object.freeze([
  "IdentityIntegrity", "RegistryReferenceIntegrity", "ModelCompleteness",
  "RelationshipIntegrity", "OwnershipConsistency", "BoundaryCompliance",
  "LifecycleConsistency", "CapabilityConsistency", "ExtensionCompatibility",
  "InventoryConsistency", "NamespaceIntegrity", "PublicExportConsistency",
  "DependencyCompliance", "CanonicalInventoryRuleCompliance",
]);

export const SceneRenderingValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-2:4/Category/${name}`,
    name,
    modelReference: SceneRenderingModel.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable Identities", "Unique Identifiers", "Valid Registry References",
  "Relationship Completeness", "Required Metadata Presence", "Ownership Validity",
  "Boundary Integrity", "Lifecycle Consistency", "Capability References",
  "Extension References", "Namespace Consistency", "Inventory Derivation",
  "Export Consistency", "Dependency Restrictions",
] as const);

export const SceneRenderingValidationRules: readonly SceneRenderingValidationRule[] =
  Object.freeze(ruleNames.map((name, index) => Object.freeze({
    id: `EVE-2:4/Rule/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Scene Rendering Model requirement for ${name}.`,
    category: categoryNames[index]!,
    severity: "Error",
    expectedOutcome: "Compliant",
    modelReference: SceneRenderingModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

const gateNames = Object.freeze([
  "Identity Verified", "Registry Verified", "Model Verified",
  "Relationships Verified", "Ownership Verified", "Boundaries Verified",
  "Lifecycle Verified", "Capabilities Verified", "Inventory Verified",
  "Dependencies Verified", "Architecture Verified", "Ready For Manifest",
] as const);

export const SceneRenderingValidationGates: readonly SceneRenderingValidationGate[] =
  Object.freeze(gateNames.map((name, index) => Object.freeze({
    id: `EVE-2:4/Gate/${name.replaceAll(" ", "")}`,
    name,
    outcome: "Compliant",
    status: "Declared",
    modelReference: SceneRenderingModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));
