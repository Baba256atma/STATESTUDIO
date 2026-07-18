/**
 * DKL-1:5 — Data Knowledge Foundation Manifest.
 *
 * Public entry point for the DKL Foundation manifest platform.
 * Publishes exactly eight metadata-only public APIs and nothing else.
 */

export {
  DataKnowledgeFoundationManifest,
  DataKnowledgeFoundationPhaseManifest,
  DataKnowledgeFoundationInventoryManifest,
  DataKnowledgeFoundationDependencyManifest,
  DataKnowledgeFoundationCompatibilityManifest,
  getDataKnowledgeFoundationManifest,
  getDataKnowledgeFoundationManifestSummary,
  getDataKnowledgeFoundationPhaseById,
} from "./dataKnowledgeFoundationManifest.ts";
