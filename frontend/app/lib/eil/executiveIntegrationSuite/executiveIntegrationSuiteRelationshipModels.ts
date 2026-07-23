/**
 * EIL-8:3 — Executive Integration Suite Relationship Models.
 *
 * Exactly ten immutable architectural relationship types.
 * Declarative metadata only. Not counted in model inventory.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import { ExecutiveIntegrationSuiteCapabilityModels } from "./executiveIntegrationSuiteCapabilityModels.ts";
import { ExecutiveIntegrationSuiteContractModels } from "./executiveIntegrationSuiteContractModels.ts";
import { ExecutiveIntegrationSuiteDomainModels } from "./executiveIntegrationSuiteDomainModels.ts";
import { ExecutiveIntegrationSuiteLifecycleModels } from "./executiveIntegrationSuiteLifecycleModels.ts";
import { ExecutiveIntegrationSuiteModuleModels } from "./executiveIntegrationSuiteModuleModels.ts";
import { ExecutiveIntegrationSuiteRegistry } from "./executiveIntegrationSuiteRegistry.ts";

/** Closed relationship-type vocabulary. */
export type SuiteRelationshipType =
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
export interface ExecutiveIntegrationSuiteRelationshipModel {
  readonly relationshipId: `EIL-8:3/Relationship/${string}`;
  readonly relationshipType: SuiteRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelId: string;
  readonly targetModelId: string;
  readonly order: number;
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ExecutiveIntegrationSuiteRelationshipTypes = Object.freeze([
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
] as const satisfies readonly SuiteRelationshipType[]);

const domains = ExecutiveIntegrationSuiteDomainModels;
const contracts = ExecutiveIntegrationSuiteContractModels;
const capabilities = ExecutiveIntegrationSuiteCapabilityModels;
const modules = ExecutiveIntegrationSuiteModuleModels;
const lifecycles = ExecutiveIntegrationSuiteLifecycleModels;

const relationship = (
  key: string,
  relationshipType: SuiteRelationshipType,
  canonicalName: string,
  description: string,
  sourceModelId: string,
  targetModelId: string,
  order: number,
): ExecutiveIntegrationSuiteRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-8:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModelId,
    targetModelId,
    order,
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten architectural relationships covering every relationship type.
 * Descriptive metadata only — not counted in the canonical model inventory of 40.
 */
export const ExecutiveIntegrationSuiteRelationshipModels: readonly ExecutiveIntegrationSuiteRelationshipModel[] =
  Object.freeze([
    relationship(
      "SuiteOwnsModules",
      "owns",
      "Suite → Modules",
      "Suite domain owns Modules domain architectural metadata.",
      domains[7]!.modelId,
      domains[2]!.modelId,
      1,
    ),
    relationship(
      "ModuleReferencesPublicIndex",
      "references",
      "EIL-1 Module → Public Index",
      "EIL-1 module model references its Public Index relationship metadata.",
      modules[0]!.modelId,
      modules[0]!.publicIndexId,
      2,
    ),
    relationship(
      "CompositionContainsModules",
      "contains",
      "Composition → Modules",
      "Composition domain contains Modules domain metadata.",
      domains[1]!.modelId,
      domains[2]!.modelId,
      3,
    ),
    relationship(
      "SuiteDependsOnModules",
      "dependsOn",
      "Suite → Modules",
      "Suite domain depends on Modules domain metadata.",
      domains[7]!.modelId,
      domains[2]!.modelId,
      4,
    ),
    relationship(
      "SuiteComposedOfEilModules",
      "composedOf",
      "Suite → EIL Modules",
      "Suite is composed of EIL-1 through EIL-7 module models.",
      domains[7]!.modelId,
      modules[0]!.modelId,
      5,
    ),
    relationship(
      "SuiteAggregatesPublicIndexes",
      "aggregates",
      "Suite → Public Indexes",
      "Suite aggregates released Public Index module references.",
      domains[7]!.modelId,
      modules[6]!.modelId,
      6,
    ),
    relationship(
      "SuitePublishesReadiness",
      "publishes",
      "Suite → SuiteReadiness",
      "Suite publishes Suite Readiness capability metadata.",
      domains[7]!.modelId,
      capabilities[7]!.modelId,
      7,
    ),
    relationship(
      "SuiteContractValidatedByValidated",
      "validatedBy",
      "SuiteContract → Validated",
      "Suite contract is validated by Validated lifecycle metadata.",
      contracts[0]!.modelId,
      lifecycles[3]!.modelId,
      8,
    ),
    relationship(
      "SuiteCertifiedByCertified",
      "certifiedBy",
      "Suite → Certified",
      "Suite domain is certified by Certified lifecycle metadata.",
      domains[7]!.modelId,
      lifecycles[6]!.modelId,
      9,
    ),
    relationship(
      "ModelSourcedFromRegistry",
      "sourcedFrom",
      "Model → Registry",
      "Model aggregate is sourced from Registry aggregate metadata.",
      "EIL-8:3/ExecutiveIntegrationSuiteModel",
      ExecutiveIntegrationSuiteRegistry.identity.canonicalId,
      10,
    ),
  ]);
