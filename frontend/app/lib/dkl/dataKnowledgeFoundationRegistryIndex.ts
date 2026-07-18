/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Public entry point for the DKL Foundation Registry platform.
 * Publishes exactly eight metadata-only public APIs and nothing else.
 */

export { DataKnowledgeFoundationComponentRegistry } from "./dataKnowledgeFoundationComponentRegistry.ts";
export { DataKnowledgeFoundationContractRegistry } from "./dataKnowledgeFoundationContractRegistry.ts";
export { DataKnowledgeFoundationPublicApiRegistry } from "./dataKnowledgeFoundationPublicApiRegistry.ts";
export { DataKnowledgeFoundationRegistryManifest } from "./dataKnowledgeFoundationRegistryManifest.ts";
export {
  DataKnowledgeFoundationRegistry,
  getDataKnowledgeFoundationComponentById,
  getDataKnowledgeFoundationRegistry,
  getDataKnowledgeFoundationRegistrySummary,
} from "./dataKnowledgeFoundationRegistry.ts";
