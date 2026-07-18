/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Canonical, immutable, metadata-only registry platform aggregating every
 * DKL Foundation registry into a single deep-frozen structure. Extends the
 * DKL-1:1 Foundation without modifying or replacing it.
 *
 * Zero runtime behavior: no I/O, no network, no database access, no parsing,
 * no AI, no async, no reflection, no side effects.
 */

import { DataKnowledgeFoundationDependencies } from "./dataKnowledgeFoundationDependencies.ts";
import { DataKnowledgeFoundationIdentity } from "./dataKnowledgeFoundationIdentity.ts";
import { DataKnowledgeFoundationOwnership } from "./dataKnowledgeFoundationOwnership.ts";
import {
  DataKnowledgeFoundationCapabilityRegistry,
  DataKnowledgeFoundationComponentRegistry,
} from "./dataKnowledgeFoundationComponentRegistry.ts";
import { DataKnowledgeFoundationContractRegistry } from "./dataKnowledgeFoundationContractRegistry.ts";
import { DataKnowledgeFoundationPublicApiRegistry } from "./dataKnowledgeFoundationPublicApiRegistry.ts";
import { DataKnowledgeFoundationRegistryManifest } from "./dataKnowledgeFoundationRegistryManifest.ts";
import type {
  DataKnowledgeComponentDescriptor,
  DataKnowledgeFoundationRegistryDescriptor,
  DataKnowledgeFoundationRegistrySummary,
} from "./dataKnowledgeFoundationRegistryTypes.ts";

export const DataKnowledgeFoundationRegistry = Object.freeze({
  components: DataKnowledgeFoundationComponentRegistry,
  contracts: DataKnowledgeFoundationContractRegistry,
  publicApis: DataKnowledgeFoundationPublicApiRegistry,
  capabilities: DataKnowledgeFoundationCapabilityRegistry,
  dependencies: DataKnowledgeFoundationDependencies,
  ownership: DataKnowledgeFoundationOwnership,
  identity: DataKnowledgeFoundationIdentity,
  manifest: DataKnowledgeFoundationRegistryManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationRegistryDescriptor);

export const getDataKnowledgeFoundationRegistry = (): DataKnowledgeFoundationRegistryDescriptor =>
  DataKnowledgeFoundationRegistry;

export const getDataKnowledgeFoundationRegistrySummary = (): DataKnowledgeFoundationRegistrySummary =>
  Object.freeze({
    registryId: DataKnowledgeFoundationRegistryManifest.registryId,
    registryVersion: DataKnowledgeFoundationRegistryManifest.registryVersion,
    componentCount: DataKnowledgeFoundationComponentRegistry.length,
    contractCount: DataKnowledgeFoundationContractRegistry.length,
    publicApiCount: DataKnowledgeFoundationPublicApiRegistry.length,
    capabilityCount: DataKnowledgeFoundationCapabilityRegistry.length,
    foundationPhase: "DKL-1:1",
    certificationStatus: DataKnowledgeFoundationRegistryManifest.certificationStatus,
    stability: DataKnowledgeFoundationRegistryManifest.stability,
    metadataOnly: true,
    immutable: true,
  } as const satisfies DataKnowledgeFoundationRegistrySummary);

export const getDataKnowledgeFoundationComponentById = (
  id: string
): DataKnowledgeComponentDescriptor | undefined =>
  DataKnowledgeFoundationComponentRegistry.find((component) => component.id === id);
