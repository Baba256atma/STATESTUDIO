/**
 * KNL-2 — Business Ontology facade.
 */

import { getBusinessOntologyManifest, validateBusinessOntology } from "./businessOntologyContracts.ts";
import {
  getBusinessOntologyRegistry,
  getBusinessOntologyState,
  initializeBusinessOntology,
  isBusinessOntologyInitialized,
  registerBusinessCapability,
  registerBusinessEntity,
  registerBusinessRelationship,
  resetBusinessOntologyRegistryForTests,
} from "./businessOntologyRegistry.ts";
import { resetKnowledgeFoundationForTests } from "./knowledgeFoundation.ts";

export const BUSINESS_ONTOLOGY_VERSION = "KNL/2" as const;

export function resetBusinessOntologyForTests(): void {
  resetBusinessOntologyRegistryForTests();
  resetKnowledgeFoundationForTests();
}

export function buildBusinessOntology(timestamp: string = new Date(0).toISOString()) {
  return initializeBusinessOntology(timestamp);
}

export function getBusinessOntology(timestamp: string = new Date(0).toISOString()): Readonly<{
  state: ReturnType<typeof getBusinessOntologyState>;
  registry: ReturnType<typeof getBusinessOntologyRegistry>;
  readOnly: true;
}> {
  if (!isBusinessOntologyInitialized()) {
    initializeBusinessOntology(timestamp);
  }
  return Object.freeze({
    state: getBusinessOntologyState(timestamp),
    registry: getBusinessOntologyRegistry(),
    readOnly: true as const,
  });
}

export {
  registerBusinessEntity,
  registerBusinessRelationship,
  registerBusinessCapability,
  getBusinessOntologyManifest,
  validateBusinessOntology,
  isBusinessOntologyInitialized,
};

export const BusinessOntology = Object.freeze({
  registerBusinessEntity,
  registerBusinessRelationship,
  registerBusinessCapability,
  getBusinessOntology,
  validateBusinessOntology,
  getBusinessOntologyManifest,
  resetBusinessOntologyForTests,
  version: BUSINESS_ONTOLOGY_VERSION,
});
