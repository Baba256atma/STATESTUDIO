/**
 * EIL-9:3 — Executive Integration Layer Relationship Models.
 *
 * Exactly ten immutable architectural relationship types.
 * Declarative metadata only. Not counted in model inventory.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import { ExecutiveIntegrationLayerCapabilityModels } from "./executiveIntegrationLayerCapabilityModels.ts";
import { ExecutiveIntegrationLayerContractModels } from "./executiveIntegrationLayerContractModels.ts";
import { ExecutiveIntegrationLayerDomainModels } from "./executiveIntegrationLayerDomainModels.ts";
import { ExecutiveIntegrationLayerLifecycleModels } from "./executiveIntegrationLayerLifecycleModels.ts";
import { ExecutiveIntegrationLayerModuleModels } from "./executiveIntegrationLayerModuleModels.ts";
import { ExecutiveIntegrationLayerRegistry } from "./executiveIntegrationLayerRegistry.ts";

/** Closed relationship-type vocabulary. */
export type LayerRelationshipType =
  | "owns"
  | "references"
  | "contains"
  | "dependsOn"
  | "composedOf"
  | "aggregates"
  | "publishes"
  | "validatedBy"
  | "certifiedBy"
  | "sourcedFrom";

/** Immutable relationship descriptor. */
export interface ExecutiveIntegrationLayerRelationshipModel {
  readonly relationshipId: `EIL-9:3/Relationship/${string}`;
  readonly relationshipType: LayerRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceType: string;
  readonly targetType: string;
  readonly sourceModelId: string;
  readonly targetModelId: string;
  readonly order: number;
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ExecutiveIntegrationLayerRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "contains",
  "dependsOn",
  "composedOf",
  "aggregates",
  "publishes",
  "validatedBy",
  "certifiedBy",
  "sourcedFrom",
] as const satisfies readonly LayerRelationshipType[]);

const domains = ExecutiveIntegrationLayerDomainModels;
const contracts = ExecutiveIntegrationLayerContractModels;
const capabilities = ExecutiveIntegrationLayerCapabilityModels;
const modules = ExecutiveIntegrationLayerModuleModels;
const lifecycles = ExecutiveIntegrationLayerLifecycleModels;

const relationship = (
  key: string,
  relationshipType: LayerRelationshipType,
  canonicalName: string,
  description: string,
  sourceType: string,
  targetType: string,
  sourceModelId: string,
  targetModelId: string,
  order: number,
): ExecutiveIntegrationLayerRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-9:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceType,
    targetType,
    sourceModelId,
    targetModelId,
    order,
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });

/**
 * Exactly ten architectural relationships covering every relationship type.
 * Descriptive metadata only — not counted in the canonical model inventory of 34.
 */
export const ExecutiveIntegrationLayerRelationshipModels: readonly ExecutiveIntegrationLayerRelationshipModel[] =
  Object.freeze([
    relationship(
      "LayerOwnsSuite",
      "owns",
      "Layer → Suite",
      "Layer domain owns Suite domain architectural metadata.",
      "DomainModel",
      "DomainModel",
      domains[1]!.modelId,
      domains[2]!.modelId,
      1,
    ),
    relationship(
      "ModuleReferencesPublicIndex",
      "references",
      "Suite Module → Public Index",
      "Suite module model references its EIL-8 Public Index relationship metadata.",
      "ModuleModel",
      "PublicIndex",
      modules[0]!.modelId,
      modules[0]!.publicIndexId,
      2,
    ),
    relationship(
      "CompositionContainsSuite",
      "contains",
      "Composition → Suite",
      "Composition domain contains Suite domain metadata.",
      "DomainModel",
      "DomainModel",
      domains[3]!.modelId,
      domains[2]!.modelId,
      3,
    ),
    relationship(
      "LayerDependsOnSuite",
      "dependsOn",
      "Layer → Suite",
      "Layer domain depends on Suite domain metadata.",
      "DomainModel",
      "DomainModel",
      domains[1]!.modelId,
      domains[2]!.modelId,
      4,
    ),
    relationship(
      "LayerComposedOfSuiteModule",
      "composedOf",
      "Layer → Suite Module",
      "Layer is composed of the Executive Integration Suite module model.",
      "DomainModel",
      "ModuleModel",
      domains[1]!.modelId,
      modules[0]!.modelId,
      5,
    ),
    relationship(
      "LayerAggregatesSuitePublicIndex",
      "aggregates",
      "Layer → Suite Public Index",
      "Layer aggregates the released Suite Public Index module reference.",
      "DomainModel",
      "ModuleModel",
      domains[1]!.modelId,
      modules[0]!.modelId,
      6,
    ),
    relationship(
      "LayerPublishesReadiness",
      "publishes",
      "Layer → LayerReadiness",
      "Layer publishes Layer Readiness capability metadata.",
      "DomainModel",
      "CapabilityModel",
      domains[1]!.modelId,
      capabilities[7]!.modelId,
      7,
    ),
    relationship(
      "LayerContractValidatedByValidated",
      "validatedBy",
      "LayerContract → Validated",
      "Layer contract is validated by Validated lifecycle metadata.",
      "ContractModel",
      "LifecycleModel",
      contracts[0]!.modelId,
      lifecycles[3]!.modelId,
      8,
    ),
    relationship(
      "LayerCertifiedByCertified",
      "certifiedBy",
      "Layer → Certified",
      "Layer domain is certified by Certified lifecycle metadata.",
      "DomainModel",
      "LifecycleModel",
      domains[1]!.modelId,
      lifecycles[6]!.modelId,
      9,
    ),
    relationship(
      "ModelSourcedFromRegistry",
      "sourcedFrom",
      "Model → Registry",
      "Model aggregate is sourced from Registry aggregate metadata.",
      "Model",
      "Registry",
      "EIL-9:3/ExecutiveIntegrationLayerModel",
      ExecutiveIntegrationLayerRegistry.identity.canonicalId,
      10,
    ),
  ]);
