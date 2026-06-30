/**
 * KNL-4 — Knowledge Graph facade.
 */

import { getKnowledgeGraphManifest, validateKnowledgeGraph } from "./knowledgeGraphContracts.ts";
import {
  getKnowledgeGraphDefinition,
  initializeKnowledgeGraph,
  isKnowledgeGraphInitialized,
  registerKnowledgeEdge,
  registerKnowledgeNode,
  registerKnowledgeNodeType,
  resetKnowledgeGraphRegistryForTests,
} from "./knowledgeGraphRegistry.ts";
import { resetBusinessVocabularyRegistryForTests } from "./businessVocabularyRegistry.ts";
import { resetBusinessOntologyRegistryForTests } from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const KNOWLEDGE_GRAPH_VERSION = "KNL/4" as const;

export function resetKnowledgeGraphForTests(): void {
  resetKnowledgeGraphRegistryForTests();
  resetBusinessVocabularyRegistryForTests();
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildKnowledgeGraph(timestamp: string = new Date(0).toISOString()) {
  return initializeKnowledgeGraph(timestamp);
}

export function getKnowledgeGraph(timestamp: string = new Date(0).toISOString()) {
  if (!isKnowledgeGraphInitialized()) {
    initializeKnowledgeGraph(timestamp);
  }
  return getKnowledgeGraphDefinition();
}

export {
  registerKnowledgeNode,
  registerKnowledgeEdge,
  registerKnowledgeNodeType,
  getKnowledgeGraphManifest,
  validateKnowledgeGraph,
  isKnowledgeGraphInitialized,
};

export const KnowledgeGraph = Object.freeze({
  registerKnowledgeNode,
  registerKnowledgeEdge,
  registerKnowledgeNodeType,
  getKnowledgeGraph,
  validateKnowledgeGraph,
  getKnowledgeGraphManifest,
  resetKnowledgeGraphForTests,
  version: KNOWLEDGE_GRAPH_VERSION,
});
