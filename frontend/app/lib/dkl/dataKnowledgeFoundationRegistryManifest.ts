/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Immutable manifest describing the DKL Foundation Registry platform.
 * Metadata only — no runtime behavior.
 */

import { DataKnowledgeFoundationComponentRegistry } from "./dataKnowledgeFoundationComponentRegistry.ts";
import { DataKnowledgeFoundationPublicApiRegistry } from "./dataKnowledgeFoundationPublicApiRegistry.ts";
import type { DataKnowledgeRegistryManifestDescriptor } from "./dataKnowledgeFoundationRegistryTypes.ts";

export const DataKnowledgeFoundationRegistryManifest = Object.freeze({
  registryVersion: "1.0.0",
  registryNamespace: "nexora.dkl.foundation.registry",
  registryId: "DKL-1:2",
  categories: Object.freeze([
    "components",
    "public-apis",
    "contracts",
    "ownership",
    "dependencies",
    "identity",
    "capabilities",
    "boundaries",
  ]),
  registeredComponentCount: DataKnowledgeFoundationComponentRegistry.length,
  publicApiInventory: Object.freeze(
    DataKnowledgeFoundationPublicApiRegistry.map((entry) => entry.name)
  ),
  foundationCompatibility: Object.freeze({
    phase: "DKL-1:1",
    version: "1.0.0",
    compatible: true,
  }),
  stability: "Stable",
  certificationStatus: "Certified",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeRegistryManifestDescriptor);
