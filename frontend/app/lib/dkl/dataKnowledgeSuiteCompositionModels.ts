/**
 * DKL-9:3 — Data Knowledge Suite Composition Models.
 *
 * Suite, capability, ordering, version, status, and readiness model kinds
 * and instances. Derived exclusively from DataKnowledgeSuiteRegistryPlatform.
 *
 * Ownership: owned exclusively by DKL-9:3.
 */

import { DataKnowledgeSuiteRegistryPlatform } from "./dataKnowledgeSuiteRegistry.ts";
import type {
  DataKnowledgeSuiteModelInstanceBase,
  DataKnowledgeSuiteModelKindDescriptor,
} from "./dataKnowledgeSuiteModelTypes.ts";

const registry = DataKnowledgeSuiteRegistryPlatform;

const descriptor = (
  modelKind: DataKnowledgeSuiteModelKindDescriptor["modelKind"],
  description: string,
  fields: readonly string[],
  order: number,
): DataKnowledgeSuiteModelKindDescriptor =>
  Object.freeze({
    modelKindId: `DKL-9:3/ModelKind/${modelKind}`,
    modelKind,
    description,
    fields: Object.freeze([...fields]),
    sourcePhase: "DKL-9:3" as const,
    registryAligned: true as const,
    runtimeBehavior: "None" as const,
    reconstructsUpstreamModels: false as const,
    duplicatesUpstreamModels: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Composition model kind descriptors. */
export const DataKnowledgeSuiteCompositionModelKinds: readonly DataKnowledgeSuiteModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "Suite",
      "Structural model of the Data Knowledge Suite composition root.",
      Object.freeze([
        "suiteId",
        "registryId",
        "capabilityOrder",
        "status",
        "readiness",
      ]),
      1,
    ),
    descriptor(
      "Capability",
      "Structural model of a suite capability registered by DKL-9:2.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "publicIndexId",
        "publicIndexVersion",
        "capabilityReference",
      ]),
      2,
    ),
    descriptor(
      "CapabilityReference",
      "Structural reference model preserving Foundation catalog entries via Registry.",
      Object.freeze(["capabilityId", "capabilityReference"]),
      3,
    ),
    descriptor(
      "CapabilityOrdering",
      "Structural model of canonical suite capability order.",
      Object.freeze(["capabilityOrder", "position", "capabilityId"]),
      4,
    ),
    descriptor(
      "CapabilityVersion",
      "Structural model of capability Public Index version.",
      Object.freeze(["capabilityId", "publicIndexVersion"]),
      5,
    ),
    descriptor(
      "CapabilityStatus",
      "Structural model of capability suite composition status.",
      Object.freeze(["capabilityId", "capabilityStatus", "suiteFoundationStatus"]),
      6,
    ),
    descriptor(
      "CapabilityReadiness",
      "Structural model of capability readiness through Public Index availability.",
      Object.freeze([
        "capabilityId",
        "capabilityReadiness",
        "suiteFoundationReadiness",
      ]),
      7,
    ),
  ]);

export interface DataKnowledgeSuiteSuiteModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "Suite";
  readonly registryId: string;
  readonly capabilityOrder: typeof registry.capabilityOrder;
  readonly registryStatus: typeof registry.status;
  readonly registryReadiness: typeof registry.readiness;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "Capability";
  readonly capabilityId: (typeof registry.capabilities)[number]["capabilityId"];
  readonly capabilityRegistration: (typeof registry.capabilities)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityReference";
  readonly capabilityId: (typeof registry.capabilityReferences)[number]["capabilityId"];
  readonly capabilityReferenceRegistration: (typeof registry.capabilityReferences)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityOrderingModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityOrdering";
  readonly capabilityId: (typeof registry.capabilityOrder)[number];
  readonly position: number;
  readonly capabilityOrder: typeof registry.capabilityOrder;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityVersionModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityVersion";
  readonly capabilityId: (typeof registry.versions)[number]["capabilityId"];
  readonly versionRegistration: (typeof registry.versions)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityStatusModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityStatus";
  readonly capabilityId: (typeof registry.statuses)[number]["capabilityId"];
  readonly statusRegistration: (typeof registry.statuses)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteCapabilityReadinessModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "CapabilityReadiness";
  readonly capabilityId: (typeof registry.readinessEntries)[number]["capabilityId"];
  readonly readinessRegistration: (typeof registry.readinessEntries)[number];
  readonly preservesCanonicalReference: true;
}

/** Single suite composition root model. */
export const DataKnowledgeSuiteSuiteModels: readonly DataKnowledgeSuiteSuiteModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/Suite/DataKnowledgeSuite",
      modelKind: "Suite" as const,
      name: "Data Knowledge Suite",
      registryId: registry.identity.registryId,
      capabilityOrder: registry.capabilityOrder,
      registryStatus: registry.status,
      registryReadiness: registry.readiness,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

/** Capability models — Registry capability registrations preserved by reference. */
export const DataKnowledgeSuiteCapabilityModels: readonly DataKnowledgeSuiteCapabilityModel[] =
  Object.freeze(
    registry.capabilities.map((capability, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/Capability/${capability.capabilityId}`,
        modelKind: "Capability" as const,
        name: capability.capabilityName,
        capabilityId: capability.capabilityId,
        capabilityRegistration: capability,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability reference models. */
export const DataKnowledgeSuiteCapabilityReferenceModels: readonly DataKnowledgeSuiteCapabilityReferenceModel[] =
  Object.freeze(
    registry.capabilityReferences.map((reference, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityReference/${reference.capabilityId}`,
        modelKind: "CapabilityReference" as const,
        name: reference.name,
        capabilityId: reference.capabilityId,
        capabilityReferenceRegistration: reference,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability ordering models. */
export const DataKnowledgeSuiteCapabilityOrderingModels: readonly DataKnowledgeSuiteCapabilityOrderingModel[] =
  Object.freeze(
    registry.capabilityOrder.map((capabilityId, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityOrdering/${capabilityId}`,
        modelKind: "CapabilityOrdering" as const,
        name: `${capabilityId} Order Position`,
        capabilityId,
        position: index + 1,
        capabilityOrder: registry.capabilityOrder,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability version models. */
export const DataKnowledgeSuiteCapabilityVersionModels: readonly DataKnowledgeSuiteCapabilityVersionModel[] =
  Object.freeze(
    registry.versions.map((version, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityVersion/${version.capabilityId}`,
        modelKind: "CapabilityVersion" as const,
        name: version.name,
        capabilityId: version.capabilityId,
        versionRegistration: version,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability status models. */
export const DataKnowledgeSuiteCapabilityStatusModels: readonly DataKnowledgeSuiteCapabilityStatusModel[] =
  Object.freeze(
    registry.statuses.map((status, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityStatus/${status.capabilityId}`,
        modelKind: "CapabilityStatus" as const,
        name: status.name,
        capabilityId: status.capabilityId,
        statusRegistration: status,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability readiness models. */
export const DataKnowledgeSuiteCapabilityReadinessModels: readonly DataKnowledgeSuiteCapabilityReadinessModel[] =
  Object.freeze(
    registry.readinessEntries.map((readiness, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/CapabilityReadiness/${readiness.capabilityId}`,
        modelKind: "CapabilityReadiness" as const,
        name: readiness.name,
        capabilityId: readiness.capabilityId,
        readinessRegistration: readiness,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );
