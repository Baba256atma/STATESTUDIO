import {
  buildDomainFoundationManifest,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  DomainVocabularyPlatformFreeze,
} from "./domainVocabularyPlatformFreezeIndex.ts";
import {
  createDomainOntologyRegistry,
  freezeDomainOntologyRegistry,
  registerDomainOntology,
  validateDomainOntologyFoundation,
  validateDomainOntologyRegistry,
  type DomainOntologyPackage,
  type DomainOntologyRegistry,
} from "./domainOntologyIndex.ts";
import {
  DomainOntologyQueryLayer,
  buildDomainOntologySnapshot,
  buildOntologyTraversalResult,
  diffDomainOntologySnapshots,
  findDomainEntityType,
  queryDomainOntologies,
  validateDomainOntologySnapshot,
} from "./domainOntologyQueryIndex.ts";
import {
  buildDomainOntologyExportBundle,
  compareDomainOntologyExportBundles,
  validateDomainOntologyExportBundle,
} from "./domainOntologyExport.ts";
import {
  DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION,
  type DomainOntologyCertificationGate,
  type DomainOntologyCertificationResult,
} from "./domainOntologyExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): DomainOntologyCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.ontology-certification",
      name: "Ontology Certification",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Ontology Certification Domain",
        description: "Neutral placeholder domain metadata for ontology certification.",
        category: "other",
        tags: Object.freeze(["ontology-certification"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "ontology-certification",
          name: "Ontology Certification",
          description: "Supports deterministic ontology certification fixtures.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: "active",
    }),
  });
}

function placeholderOntology(description = "Neutral placeholder ontology metadata."): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.certification.core",
    domainId: "domain.ontology-certification",
    name: "Ontology Certification Fixture",
    description,
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.certification.source",
        label: "Certification Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: "entity.certification.target",
        label: "Certification Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.certification.link",
        label: "Certification Link",
        description: "Neutral direct relationship metadata.",
        sourceEntityTypeId: "entity.certification.source",
        targetEntityTypeId: "entity.certification.target",
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.certification.label",
        ownerEntityTypeId: "entity.certification.source",
        label: "Certification Label",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: "constraint.certification.label",
        targetType: "attribute",
        targetId: "attribute.certification.label",
        label: "Certification Constraint",
        description: "Neutral constraint metadata.",
        severity: "warning",
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationFixtureRegistry(description?: string): DomainOntologyRegistry {
  const domainRegistry = registerDomain(createDomainRegistry(), placeholderDomain()).registry;
  return registerDomainOntology(
    createDomainOntologyRegistry(),
    placeholderOntology(description),
    domainRegistry
  ).registry;
}

function hasQueryCapability(): boolean {
  return (
    typeof DomainOntologyQueryLayer.queryDomainOntologies === "function" &&
    typeof DomainOntologyQueryLayer.findOntologiesByDomain === "function" &&
    typeof DomainOntologyQueryLayer.sortDomainOntologies === "function"
  );
}

function hasLookupCapability(): boolean {
  const fixture = certificationFixtureRegistry();
  return (
    typeof DomainOntologyQueryLayer.findDomainEntityType === "function" &&
    typeof DomainOntologyQueryLayer.findDomainRelationshipType === "function" &&
    typeof DomainOntologyQueryLayer.findDomainAttribute === "function" &&
    typeof DomainOntologyQueryLayer.findDomainConstraint === "function" &&
    findDomainEntityType(fixture, "entity.certification.source").found
  );
}

function hasTraversalCapability(): boolean {
  const traversal = buildOntologyTraversalResult(certificationFixtureRegistry(), "entity.certification.source");
  return (
    typeof DomainOntologyQueryLayer.buildOntologyTraversalResult === "function" &&
    traversal.entity.found &&
    traversal.outgoingRelationships.length === 1 &&
    traversal.connectedEntities.length === 1
  );
}

function snapshotDiffPasses(): boolean {
  const left = buildDomainOntologySnapshot(certificationFixtureRegistry());
  const right = buildDomainOntologySnapshot(certificationFixtureRegistry("Modified neutral placeholder ontology metadata."));
  return diffDomainOntologySnapshots(left, right).entries.some((entry) => entry.type === "modified");
}

function hasDomCompatibility(): boolean {
  const vocabularyFreeze = DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze();
  return (
    validateDomainFoundation().valid &&
    buildDomainFoundationManifest().metadataOnly === true &&
    vocabularyFreeze.status === "PASS" &&
    vocabularyFreeze.manifest.metadataOnly === true
  );
}

export function runDomainOntologyCertification(
  registry: DomainOntologyRegistry
): DomainOntologyCertificationResult {
  const exportBundle = buildDomainOntologyExportBundle(registry);
  const secondBundle = buildDomainOntologyExportBundle(registry);
  const exportValidation = validateDomainOntologyExportBundle(exportBundle);
  const snapshotValidation = validateDomainOntologySnapshot(exportBundle.ontologySnapshot);
  const reproducible = compareDomainOntologyExportBundles(exportBundle, secondBundle).equal;
  const frozenRegistry = freezeDomainOntologyRegistry(registry);
  const frozenBundle = buildDomainOntologyExportBundle(frozenRegistry);

  const gates: readonly DomainOntologyCertificationGate[] = Object.freeze([
    gate("ontology-foundation-valid", "Ontology foundation validation passes.", validateDomainOntologyFoundation().valid),
    gate("registry-valid", "Ontology registry validation passes.", validateDomainOntologyRegistry(registry).valid),
    gate("snapshot-valid", "Ontology snapshot validation passes.", snapshotValidation.valid),
    gate("export-bundle-valid", "Ontology export bundle validation passes.", exportValidation.valid),
    gate("deterministic-reproducibility", "Export bundle generation is deterministically reproducible.", reproducible),
    gate(
      "query-capability-available",
      "Ontology query capability APIs are available and callable.",
      hasQueryCapability() && Array.isArray(queryDomainOntologies(registry))
    ),
    gate("lookup-capability-available", "Ontology lookup capability APIs are available and callable.", hasLookupCapability()),
    gate(
      "direct-traversal-capability-available",
      "Ontology direct traversal APIs are available without runtime graph reasoning.",
      hasTraversalCapability()
    ),
    gate("snapshot-diff-capability", "Ontology snapshot diff capability detects deterministic metadata changes.", snapshotDiffPasses()),
    gate(
      "frozen-registry-readable",
      "Frozen ontology registry can be read and exported.",
      frozenBundle.metadata.frozen === true && validateDomainOntologyExportBundle(frozenBundle).valid
    ),
    gate("dom-1-compatibility", "DOM-1 foundation public APIs remain compatible.", validateDomainFoundation().valid),
    gate("dom-2-compatibility", "DOM-2 vocabulary platform public APIs remain compatible.", hasDomCompatibility()),
    gate(
      "metadata-only-boundary",
      "Ontology certification remains metadata-only with no runtime behavior.",
      exportBundle.metadata.metadataOnly &&
        !exportBundle.metadata.runtimeBehavior &&
        exportBundle.ontologyManifest.metadataOnly &&
        !exportBundle.ontologyManifest.runtimeBehavior &&
        exportBundle.traversalCapability.metadataOnly &&
        !exportBundle.traversalCapability.runtimeBehavior
    ),
  ]);

  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    contractVersion: DOMAIN_ONTOLOGY_EXPORT_CONTRACT_VERSION,
    status: passed ? "PASS" : "FAIL",
    gates,
    exportBundle,
  });
}
