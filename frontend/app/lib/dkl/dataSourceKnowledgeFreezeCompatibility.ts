/**
 * DKL-2:8 — Freeze Compatibility Policy.
 *
 * Ten immutable compatibility policy declarations defining what may change after
 * release (additive, identifier-preserving extensions), what is restricted (new
 * dependencies), and what is forbidden or locked (identifier changes, public-API
 * removal, ownership transfer, public-index naming strategy).
 *
 * The public-index naming strategy declaration is anchored on a pure, in-memory
 * reference comparison certifying that the DKL-2:2 registry-entry platform and
 * the DKL-2:6 complete platform remain distinct canonical objects, consumed via
 * explicit local aliases.
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: consumes the DKL-2:2 and DKL-2:6 public platform roots (via
 * aliases) and the DKL-2:8 freeze types.
 */

import { DataSourceKnowledgeRegistryPlatform as Dkl22RegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl26CompletePlatform } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import {
  CANONICAL_COMPLETE_PLATFORM_EXPORT,
  type CompatibilityPolicyDeclaration,
  type FreezeCompatibilityContainer,
} from "./dataSourceKnowledgeFreezeTypes.ts";

// Pure reference comparison: the two similarly named platform roots are distinct
// canonical objects. Used deterministically to gate the naming-strategy status.
const platformSurfacesAreDistinct =
  (Dkl22RegistryPlatform as object) !== (Dkl26CompletePlatform as object);

const namingStrategyStatus = platformSurfacesAreDistinct ? "Locked" : "Forbidden";

const compatibilityEntries: readonly CompatibilityPolicyDeclaration[] = Object.freeze([
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "AdditiveRegistryEntriesCompatible",
    name: "Additive Registry Entries Compatible",
    description:
      "New data-source registry entries may be added when identifiers are globally unique and " +
      "existing entries and contracts are unchanged.",
    changeType: "AdditiveExtension",
    status: "Compatible",
    conditions: Object.freeze([
      "New identifiers must be globally unique.",
      "Existing entries and contracts must remain unchanged.",
    ]),
    protectedSurfaces: Object.freeze(["dataSourceKnowledgeRegistryPlatform.ts#DataSourceRegistry"]),
    sourcePhase: "DKL-2:2",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "AdditiveKnowledgeTypesCompatible",
    name: "Additive Knowledge Types Compatible",
    description:
      "New knowledge-type registry entries may be added when identifiers are unique and existing " +
      "knowledge contracts are unchanged.",
    changeType: "AdditiveExtension",
    status: "Compatible",
    conditions: Object.freeze([
      "New identifiers must be globally unique.",
      "Existing knowledge entries and contracts must remain unchanged.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceKnowledgeRegistryPlatform.ts#KnowledgeTypeRegistry",
    ]),
    sourcePhase: "DKL-2:2",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "AdditiveConnectorTypesCompatible",
    name: "Additive Connector Types Compatible",
    description:
      "New connector-type registry entries may be added when identifiers are unique and existing " +
      "connector contracts are unchanged.",
    changeType: "AdditiveExtension",
    status: "Compatible",
    conditions: Object.freeze([
      "New identifiers must be globally unique.",
      "Existing connector entries and contracts must remain unchanged.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceKnowledgeRegistryPlatform.ts#ConnectorTypeRegistry",
    ]),
    sourcePhase: "DKL-2:2",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "AdditiveContentTypesCompatible",
    name: "Additive Content Types Compatible",
    description:
      "New content-type registry entries may be added when identifiers are unique and existing " +
      "content contracts are unchanged.",
    changeType: "AdditiveExtension",
    status: "Compatible",
    conditions: Object.freeze([
      "New identifiers must be globally unique.",
      "Existing content entries and contracts must remain unchanged.",
    ]),
    protectedSurfaces: Object.freeze(["dataSourceKnowledgeRegistryPlatform.ts#ContentTypeRegistry"]),
    sourcePhase: "DKL-2:2",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "AdditiveOptionalMetadataCompatible",
    name: "Additive Optional Metadata Compatible",
    description:
      "New optional metadata fields may be added to models and manifests when existing required " +
      "fields and their semantics are unchanged.",
    changeType: "AdditiveExtension",
    status: "Compatible",
    conditions: Object.freeze([
      "New fields must be optional.",
      "Existing required fields and semantics must remain unchanged.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceRegistryModelPlatform.ts",
      "dataSourceKnowledgeRegistryManifestPlatform.ts",
    ]),
    sourcePhase: "DKL-2:3",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "ExistingIdentifierChangesForbidden",
    name: "Existing Identifier Changes Forbidden",
    description:
      "Existing canonical identifiers (registry, model, validation-rule, gate, and evidence ids) " +
      "must never be renamed or repurposed.",
    changeType: "IdentifierChange",
    status: "Forbidden",
    conditions: Object.freeze([
      "Renaming an existing identifier is forbidden.",
      "Repurposing an existing identifier is forbidden.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceKnowledgeRegistryPlatform.ts",
      "dataSourceRegistryModelPlatform.ts",
      "dataSourceKnowledgeValidationRunner.ts",
      "dataSourceKnowledgeCertificationPlatform.ts",
    ]),
    sourcePhase: "DKL-2:2",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "ExistingPublicApiRemovalForbidden",
    name: "Existing Public API Removal Forbidden",
    description:
      "Existing runtime public exports must not be removed without a future major-version migration.",
    changeType: "PublicApiRemoval",
    status: "Forbidden",
    conditions: Object.freeze([
      "Removal requires a future major-version migration.",
      "The frozen per-phase export counts (7, 8, 9, 7, 8, 6, 7) must be preserved.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceKnowledgeRegistryFoundation.ts",
      "dataSourceKnowledgeRegistryPlatform.ts",
      "dataSourceRegistryModelPlatform.ts",
      "dataSourceKnowledgeValidationRunner.ts",
      "dataSourceKnowledgeRegistryManifestPlatform.ts",
      "dataSourceKnowledgeRegistryPlatformIndex.ts",
      "dataSourceKnowledgeCertificationPlatform.ts",
    ]),
    sourcePhase: "DKL-2:7",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "OwnershipTransferForbidden",
    name: "Ownership Transfer Forbidden",
    description:
      "Ownership of a phase's architecture must not silently move between phases; each phase owns " +
      "its own surface.",
    changeType: "OwnershipTransfer",
    status: "Forbidden",
    conditions: Object.freeze([
      "Ownership must not silently move between phases.",
      "Cross-phase writes are forbidden.",
    ]),
    protectedSurfaces: Object.freeze(["DKL-2 ownership boundaries"]),
    sourcePhase: "DKL-2:1",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "DependencyBoundaryExpansionRestricted",
    name: "Dependency Boundary Expansion Restricted",
    description:
      "New dependencies may only be introduced with explicit later certification and must remain " +
      "forward-only, cycle-free, and public-API-only.",
    changeType: "DependencyExpansion",
    status: "Restricted",
    conditions: Object.freeze([
      "New dependencies require explicit later certification.",
      "Dependencies must remain forward-only, cycle-free, and public-API-only.",
    ]),
    protectedSurfaces: Object.freeze(["DKL-2 dependency graph"]),
    sourcePhase: "DKL-2:5",
  }),
  Object.freeze<CompatibilityPolicyDeclaration>({
    compatibilityId: "PublicIndexNamingStrategyLocked",
    name: "Public Index Naming Strategy Locked",
    description:
      `The DKL-2:9 Public Index must expose exactly one canonical complete-platform object named ` +
      `${CANONICAL_COMPLETE_PLATFORM_EXPORT} (the DKL-2:6 aggregate). The DKL-2:2 registry-entry ` +
      `platform must not be re-exported under the same indistinguishable name; it must be exposed ` +
      `through a clearly named section or alias (e.g. registry / registryPlatform / ` +
      `dataSourceKnowledgeRegistry).`,
    changeType: "NamingStrategy",
    status: namingStrategyStatus,
    conditions: Object.freeze([
      "The DKL-2:2 and DKL-2:6 platform roots are distinct canonical objects.",
      "The Public Index must publish exactly one canonical complete-platform name.",
      "The DKL-2:2 registry root must be accessed via a clearly named section or alias.",
    ]),
    protectedSurfaces: Object.freeze([
      "dataSourceKnowledgeRegistryPlatform.ts#DataSourceKnowledgeRegistryPlatform",
      "dataSourceKnowledgeRegistryPlatformIndex.ts#DataSourceKnowledgeRegistryPlatform",
    ]),
    sourcePhase: "DKL-2:7",
  }),
]);

const compatibilityById: ReadonlyMap<string, CompatibilityPolicyDeclaration> = new Map(
  compatibilityEntries.map((entry) => [entry.compatibilityId, entry]),
);

export const DataSourceKnowledgeFreezeCompatibility: FreezeCompatibilityContainer =
  Object.freeze<FreezeCompatibilityContainer>({
    kind: "FreezeCompatibility",
    declarations: compatibilityEntries,
    getCompatibilityById: (
      compatibilityId: string,
    ): CompatibilityPolicyDeclaration | undefined => compatibilityById.get(compatibilityId),
    metadataOnly: true,
    immutable: true,
  });
