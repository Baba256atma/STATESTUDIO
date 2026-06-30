/**
 * KNL-2 — Business Ontology contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_ENTITY_TYPE_KEYS,
  BUSINESS_ONTOLOGY_ARCHITECTURE_VERSION,
  BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
  BUSINESS_ONTOLOGY_CATEGORY_KEYS,
  BUSINESS_ONTOLOGY_CONTRACT_VERSION,
  BUSINESS_ONTOLOGY_FORBIDDEN_PATTERNS,
  BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS,
  BUSINESS_ONTOLOGY_ID,
  BUSINESS_ONTOLOGY_MUST_NOT_OWN,
  BUSINESS_ONTOLOGY_NAME,
  BUSINESS_ONTOLOGY_NAMESPACE,
  BUSINESS_ONTOLOGY_PRINCIPLES,
  BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY,
  BUSINESS_RELATIONSHIP_TYPE_KEYS,
} from "./businessOntologyCatalog.ts";
import {
  getBusinessOntologySnapshot,
  initializeBusinessOntology,
  isBusinessOntologyInitialized,
} from "./businessOntologyRegistry.ts";
import type {
  BusinessCapability,
  BusinessConstraint,
  BusinessDecision,
  BusinessDependency,
  BusinessDomain,
  BusinessEntity,
  BusinessEvent,
  BusinessFunction,
  BusinessGoal,
  BusinessKpi,
  BusinessMetadata,
  BusinessObject,
  BusinessOntologyManifest,
  BusinessOntologyValidationReport,
  BusinessOpportunity,
  BusinessPolicy,
  BusinessProcess,
  BusinessRelationship,
  BusinessResource,
  BusinessRisk,
  BusinessRule,
  BusinessScenario,
  BusinessStakeholder,
} from "./businessOntologyTypes.ts";
import {
  validateBusinessOntologyContractVersion,
  validateBusinessOntologyDependencyDeclarations,
  validateKnowledgeFoundationDependency,
} from "./businessOntologyValidation.ts";

export const BUSINESS_ONTOLOGY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noGraphTraversal: true,
  noRetrieval: true,
  noSemanticSearch: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  structureOnly: true,
  readOnly: true as const,
});

export const BUSINESS_ONTOLOGY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_ONTOLOGY_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_ONTOLOGY_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/2",
  title: "Business Ontology",
  goal: "Canonical metadata-only business ontology definitions, relationships, registry, and validation.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/businessOntologyCatalog.ts",
    "frontend/app/lib/knowledge/businessOntologyTypes.ts",
    "frontend/app/lib/knowledge/businessOntologyContracts.ts",
    "frontend/app/lib/knowledge/businessOntologyRegistry.ts",
    "frontend/app/lib/knowledge/businessOntologyValidation.ts",
    "frontend/app/lib/knowledge/businessOntology.ts",
    "frontend/app/lib/knowledge/businessOntology.test.ts",
    "docs/knl-2-business-ontology-report.md",
  ]),
  forbiddenPatterns: BUSINESS_ONTOLOGY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_2]", "[BUSINESS_ONTOLOGY]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): BusinessMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    namespace: BUSINESS_ONTOLOGY_NAMESPACE,
    owner: "business-ontology-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveBusinessMetadataExample(timestamp: string): BusinessMetadata {
  return createMetadata("business-metadata-example-001", timestamp);
}

export function resolveBusinessDomainExample(timestamp: string): BusinessDomain {
  return Object.freeze({
    domainId: "business-domain-example-001",
    label: "Business Domain Example",
    description: "Example business domain contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessEntityExample(timestamp: string): BusinessEntity {
  return Object.freeze({
    entityId: "business-entity-example-001",
    entityType: "entity",
    name: "business_entity_example",
    label: "Business Entity Example",
    description: "Example business entity contract.",
    categoryKey: "structural",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessObjectExample(timestamp: string): BusinessObject {
  return Object.freeze({
    objectId: "business-object-example-001",
    entityId: "business-entity-example-001",
    label: "Business Object Example",
    description: "Example business object contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessProcessExample(timestamp: string): BusinessProcess {
  return Object.freeze({
    processId: "business-process-example-001",
    label: "Business Process Example",
    description: "Example business process contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessFunctionExample(timestamp: string): BusinessFunction {
  return Object.freeze({
    functionId: "business-function-example-001",
    label: "Business Function Example",
    description: "Example business function contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessCapabilityExample(timestamp: string): BusinessCapability {
  return Object.freeze({
    capabilityId: "business-capability-example-001",
    capabilityKey: "entity_registry",
    label: "Entity Registry",
    description: "Example business capability contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessGoalExample(timestamp: string): BusinessGoal {
  return Object.freeze({
    goalId: "business-goal-example-001",
    label: "Business Goal Example",
    description: "Example business goal contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessKpiExample(timestamp: string): BusinessKpi {
  return Object.freeze({
    kpiId: "business-kpi-example-001",
    label: "Business KPI Example",
    description: "Example business KPI contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessRiskExample(timestamp: string): BusinessRisk {
  return Object.freeze({
    riskId: "business-risk-example-001",
    label: "Business Risk Example",
    description: "Example business risk contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessResourceExample(timestamp: string): BusinessResource {
  return Object.freeze({
    resourceId: "business-resource-example-001",
    label: "Business Resource Example",
    description: "Example business resource contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessStakeholderExample(timestamp: string): BusinessStakeholder {
  return Object.freeze({
    stakeholderId: "business-stakeholder-example-001",
    label: "Business Stakeholder Example",
    description: "Example business stakeholder contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessPolicyExample(timestamp: string): BusinessPolicy {
  return Object.freeze({
    policyId: "business-policy-example-001",
    label: "Business Policy Example",
    description: "Example business policy contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessRuleExample(timestamp: string): BusinessRule {
  return Object.freeze({
    ruleId: "business-rule-example-001",
    label: "Business Rule Example",
    description: "Example business rule contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessEventExample(timestamp: string): BusinessEvent {
  return Object.freeze({
    eventId: "business-event-example-001",
    label: "Business Event Example",
    description: "Example business event contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessScenarioExample(timestamp: string): BusinessScenario {
  return Object.freeze({
    scenarioId: "business-scenario-example-001",
    label: "Business Scenario Example",
    description: "Example business scenario contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessDecisionExample(timestamp: string): BusinessDecision {
  return Object.freeze({
    decisionId: "business-decision-example-001",
    label: "Business Decision Example",
    description: "Example business decision contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessRelationshipExample(timestamp: string): BusinessRelationship {
  return Object.freeze({
    relationshipId: "business-relationship-example-001",
    relationshipType: "depends_on",
    sourceEntityId: "business-entity-example-001",
    targetEntityId: "business-entity-example-002",
    label: "Depends On",
    description: "Example business relationship contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessDependencyExample(timestamp: string): BusinessDependency {
  return Object.freeze({
    dependencyId: "business-dependency-example-001",
    sourceEntityId: "business-entity-example-001",
    targetEntityId: "business-entity-example-002",
    label: "Business Dependency Example",
    description: "Example business dependency contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessConstraintExample(timestamp: string): BusinessConstraint {
  return Object.freeze({
    constraintId: "business-constraint-example-001",
    label: "Business Constraint Example",
    description: "Example business constraint contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessOpportunityExample(timestamp: string): BusinessOpportunity {
  return Object.freeze({
    opportunityId: "business-opportunity-example-001",
    label: "Business Opportunity Example",
    description: "Example business opportunity contract.",
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: resolveBusinessMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getBusinessOntologyManifest(
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyManifest {
  if (!isBusinessOntologyInitialized()) {
    initializeBusinessOntology(timestamp);
  }
  return Object.freeze({
    ontologyId: BUSINESS_ONTOLOGY_ID,
    ontologyName: BUSINESS_ONTOLOGY_NAME,
    namespace: BUSINESS_ONTOLOGY_NAMESPACE,
    contractVersion: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    architectureVersion: BUSINESS_ONTOLOGY_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    supportedEntityTypes: BUSINESS_ENTITY_TYPE_KEYS,
    supportedRelationshipTypes: BUSINESS_RELATIONSHIP_TYPE_KEYS,
    supportedCategories: BUSINESS_ONTOLOGY_CATEGORY_KEYS,
    supportedCapabilities: BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
    publicApis: BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY,
    principles: BUSINESS_ONTOLOGY_PRINCIPLES,
    mustNotOwn: BUSINESS_ONTOLOGY_MUST_NOT_OWN,
    futurePhases: BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateBusinessOntology(
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyValidationReport {
  const issues: BusinessOntologyValidationReport["issues"][number][] = [];

  const dependencyValidation = validateBusinessOntologyDependencyDeclarations();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const versionValidation = validateBusinessOntologyContractVersion();
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isBusinessOntologyInitialized()) {
    initializeBusinessOntology(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) {
    issues.push(...foundationValidation.issues);
  }

  const manifestValidation = validateStageManifest(BUSINESS_ONTOLOGY_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getBusinessOntologySnapshot();
  if (snapshot.categoryCount < BUSINESS_ONTOLOGY_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Business ontology category registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.capabilityCount < BUSINESS_ONTOLOGY_CAPABILITY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Business ontology capability registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.entityCount < BUSINESS_RELATIONSHIP_TYPE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "relationship_definitions_missing",
        message: "Canonical relationship type definitions must be seeded.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyInitialized: isBusinessOntologyInitialized(),
    registryValid:
      snapshot.categoryCount >= BUSINESS_ONTOLOGY_CATEGORY_KEYS.length &&
      snapshot.capabilityCount >= BUSINESS_ONTOLOGY_CAPABILITY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const BusinessOntologyContract = Object.freeze({
  BUSINESS_ONTOLOGY_PUBLIC_API_RULES,
  BUSINESS_ONTOLOGY_SELF_MANIFEST,
  getBusinessOntologyManifest,
  validateBusinessOntology,
  resolveBusinessDomainExample,
  resolveBusinessEntityExample,
  resolveBusinessRelationshipExample,
  version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
});
