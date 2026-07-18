/**
 * DKL-9:3 — Data Knowledge Suite Dependency Models.
 *
 * Capability dependency structural models from Registry dependencies.
 *
 * Ownership: owned exclusively by DKL-9:3.
 */

import { DataKnowledgeSuiteRegistryPlatform } from "./dataKnowledgeSuiteRegistry.ts";
import type {
  DataKnowledgeSuiteModelInstanceBase,
  DataKnowledgeSuiteModelKindDescriptor,
} from "./dataKnowledgeSuiteModelTypes.ts";

const registry = DataKnowledgeSuiteRegistryPlatform;

/** Capability dependency model kind descriptor. */
export const DataKnowledgeSuiteDependencyModelKinds: readonly DataKnowledgeSuiteModelKindDescriptor[] =
  Object.freeze([
    Object.freeze({
      modelKindId: "DKL-9:3/ModelKind/CapabilityDependency",
      modelKind: "CapabilityDependency" as const,
      description:
        "Structural model of suite capability dependency ordering via Registry.",
      fields: Object.freeze([
        "capabilityId",
        "priorCapabilityId",
        "publicIndexModule",
        "dependsOnPriorSuiteCapability",
      ]),
      sourcePhase: "DKL-9:3" as const,
      registryAligned: true as const,
      runtimeBehavior: "None" as const,
      reconstructsUpstreamModels: false as const,
      duplicatesUpstreamModels: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 13,
    }),
  ]);

export interface DataKnowledgeSuiteCapabilityDependencyModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityDependency";
  readonly capabilityId: (typeof registry.dependencies)[number]["capabilityId"];
  readonly dependencyRegistration: (typeof registry.dependencies)[number];
  readonly preservesCanonicalReference: true;
}

/** Capability dependency models — Registry dependencies preserved by reference. */
export const DataKnowledgeSuiteCapabilityDependencyModels: readonly DataKnowledgeSuiteCapabilityDependencyModel[] =
  Object.freeze(
    registry.dependencies.map((dependency, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityDependency/${dependency.capabilityId}`,
        modelKind: "CapabilityDependency" as const,
        name: dependency.name,
        capabilityId: dependency.capabilityId,
        dependencyRegistration: dependency,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );
