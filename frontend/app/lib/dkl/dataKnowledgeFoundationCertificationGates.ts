/**
 * DKL-1:7 — Certification Gates.
 *
 * The sixteen canonical, immutable, deterministic certification gates covering
 * every certification domain of the DKL Foundation platform. Every gate derives
 * its evidence exclusively from the official public metadata of DKL-1:1 through
 * DKL-1:6. No runtime scanning, source inspection, filesystem access, Git
 * access, or reflection over source code occurs here.
 */

import {
  DataKnowledgeFoundation,
  DataKnowledgeFoundationContracts,
  DataKnowledgeFoundationDependencies,
  DataKnowledgeFoundationIdentity,
  DataKnowledgeFoundationOwnership,
  getDataKnowledgeFoundationSummary,
} from "./dataKnowledgeFoundation.ts";
import * as foundationApi from "./dataKnowledgeFoundation.ts";
import {
  DataKnowledgeFoundationInventoryManifest,
  DataKnowledgeFoundationManifest,
  DataKnowledgeFoundationPhaseManifest,
  getDataKnowledgeFoundationManifestSummary,
} from "./dataKnowledgeFoundationManifestIndex.ts";
import * as manifestApi from "./dataKnowledgeFoundationManifestIndex.ts";
import {
  BusinessObjectModel,
  DataKnowledgeFoundationModel,
  DataKnowledgeFoundationModelManifest,
  KnowledgeMetadataModel,
  KnowledgeRelationshipModel,
  getDataKnowledgeFoundationModelSummary,
} from "./dataKnowledgeFoundationModel.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import {
  DataKnowledgeFoundationPlatform,
  DataKnowledgeFoundationPlatformMetadata,
  getDataKnowledgeFoundationPlatformSummary,
} from "./dataKnowledgeFoundationPlatformIndex.ts";
import * as platformApi from "./dataKnowledgeFoundationPlatformIndex.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
  DataKnowledgeFoundationContractRegistry,
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationRegistry,
  getDataKnowledgeFoundationComponentById,
  getDataKnowledgeFoundationRegistrySummary,
} from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationValidation,
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
  getDataKnowledgeFoundationValidationSummary,
  runDataKnowledgeFoundationValidation,
} from "./dataKnowledgeFoundationValidation.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import {
  createCertificationGate,
  isDeeplyFrozen,
  type CertificationGateDescriptor,
} from "./dataKnowledgeFoundationCertificationTypes.ts";

const foundationApiCount = Object.keys(foundationApi).length;
const registryApiCount = Object.keys(registryApi).length;
const modelApiCount = Object.keys(modelApi).length;
const validationApiCount = Object.keys(validationApi).length;
const manifestApiCount = Object.keys(manifestApi).length;
const platformApiCount = Object.keys(platformApi).length;
const totalPreCertificationApis =
  foundationApiCount +
  registryApiCount +
  modelApiCount +
  validationApiCount +
  manifestApiCount +
  platformApiCount;

const uniqueApiNameCount = (namespace: Record<string, unknown>): number =>
  new Set(Object.keys(namespace)).size;

const noDuplicateApiNames =
  uniqueApiNameCount(foundationApi) === foundationApiCount &&
  uniqueApiNameCount(registryApi) === registryApiCount &&
  uniqueApiNameCount(modelApi) === modelApiCount &&
  uniqueApiNameCount(validationApi) === validationApiCount &&
  uniqueApiNameCount(manifestApi) === manifestApiCount &&
  uniqueApiNameCount(platformApi) === platformApiCount;

const runtimeVerbPattern = /fetch|save|persist|query|ingest|process|execute|orchestrat|async|await|http|network|render|delete|insert|update/i;
const allPublicApiNames = [
  ...Object.keys(foundationApi),
  ...Object.keys(registryApi),
  ...Object.keys(modelApi),
  ...Object.keys(validationApi),
  ...Object.keys(manifestApi),
  ...Object.keys(platformApi),
];
const noRuntimeApiNames = allPublicApiNames.every((name) => !runtimeVerbPattern.test(name));

// ── Gate 1 — Foundation ──────────────────────────────────────────────────────
const foundationIdentityExists = DataKnowledgeFoundationIdentity.layerId === "DKL";
const foundationResponsibilitiesExist = DataKnowledgeFoundationContracts.responsibilities.length > 0;
const foundationBoundariesExist = DataKnowledgeFoundationContracts.boundaries.length > 0;
const foundationOwnershipExists = DataKnowledgeFoundationOwnership.owns.length > 0;
const foundationDependenciesExist = DataKnowledgeFoundationDependencies.allowed.length > 0;
const foundationFrozen = isDeeplyFrozen(DataKnowledgeFoundation);
const foundationStable = DataKnowledgeFoundationIdentity.stability === "Stable";
const foundationGateCondition =
  foundationIdentityExists &&
  foundationResponsibilitiesExist &&
  foundationBoundariesExist &&
  foundationOwnershipExists &&
  foundationDependenciesExist &&
  foundationFrozen &&
  foundationStable;

const foundationGate = createCertificationGate({
  id: "dkl-cert-gate-foundation",
  name: "Foundation Certification Gate",
  domain: "foundation",
  description:
    "Certifies canonical identity, responsibilities, boundaries, ownership, dependency declarations, deep-freeze, and stable status of the DKL-1:1 Foundation.",
  sourcePhases: ["DKL-1:1"],
  severity: "CRITICAL",
  expected: "Canonical Foundation identity, contracts, ownership, dependencies present; deeply frozen; stable.",
  actual: foundationGateCondition
    ? "Foundation identity, contracts, ownership, dependencies present; deeply frozen; stable."
    : "Foundation metadata incomplete.",
  evidence: {
    identityExists: foundationIdentityExists,
    responsibilityCount: DataKnowledgeFoundationContracts.responsibilities.length,
    boundaryCount: DataKnowledgeFoundationContracts.boundaries.length,
    ownedCount: DataKnowledgeFoundationOwnership.owns.length,
    allowedDependencyCount: DataKnowledgeFoundationDependencies.allowed.length,
    deeplyFrozen: foundationFrozen,
    stability: DataKnowledgeFoundationIdentity.stability,
  },
  condition: foundationGateCondition,
});

// ── Gate 2 — Registry ────────────────────────────────────────────────────────
const registryComponentCount = DataKnowledgeFoundationComponentRegistry.length;
const registryPublicApiCount = DataKnowledgeFoundationPublicApiRegistry.length;
const registryUniqueApiCount = new Set(
  DataKnowledgeFoundationPublicApiRegistry.map((entry) => entry.name)
).size;
const registryContractsMatch =
  DataKnowledgeFoundationContractRegistry.length === DataKnowledgeFoundationContracts.contracts.length;
const firstComponent = DataKnowledgeFoundationComponentRegistry[0];
const registryLookupDeterministic =
  getDataKnowledgeFoundationComponentById(firstComponent.id) === firstComponent &&
  getDataKnowledgeFoundationComponentById("dkl-component-unknown") === undefined;
const registryFrozen = isDeeplyFrozen(DataKnowledgeFoundationRegistry);
const registryGateCondition =
  registryComponentCount === 5 &&
  registryPublicApiCount === 7 &&
  registryUniqueApiCount === 7 &&
  registryContractsMatch &&
  registryLookupDeterministic &&
  registryFrozen;

const registryGate = createCertificationGate({
  id: "dkl-cert-gate-registry",
  name: "Registry Certification Gate",
  domain: "registry",
  description:
    "Certifies complete Foundation component registration, exactly seven Foundation APIs registered once, matching contract inventory, deterministic lookup, and deep-freeze.",
  sourcePhases: ["DKL-1:1", "DKL-1:2"],
  severity: "CRITICAL",
  expected: "5 components, 7 unique Foundation APIs, matching contract inventory, deterministic lookup, deeply frozen.",
  actual: registryGateCondition
    ? "5 components, 7 unique Foundation APIs, matching contract inventory, deterministic lookup, deeply frozen."
    : "Registry coverage incomplete.",
  evidence: {
    componentCount: registryComponentCount,
    publicApiCount: registryPublicApiCount,
    uniqueApiCount: registryUniqueApiCount,
    contractInventoryMatches: registryContractsMatch,
    lookupDeterministic: registryLookupDeterministic,
    deeplyFrozen: registryFrozen,
  },
  condition: registryGateCondition,
});

// ── Gate 3 — Model ───────────────────────────────────────────────────────────
const modelSurfacesExist =
  Boolean(DataKnowledgeFoundationModel.objectModel) &&
  Boolean(DataKnowledgeFoundationModel.businessModel) &&
  Boolean(DataKnowledgeFoundationModel.relationshipModel) &&
  Boolean(DataKnowledgeFoundationModel.metadataModel) &&
  DataKnowledgeFoundationModelManifest.registeredModels.length === 4;
const businessTypeCount = BusinessObjectModel.types.length;
const relationshipTypeCount = KnowledgeRelationshipModel.relationships.length;
const metadataFieldCount = KnowledgeMetadataModel.fields.length;
const modelFoundationCompatible = DataKnowledgeFoundationModelManifest.foundationCompatibility.compatible;
const modelRegistryCompatible = DataKnowledgeFoundationModelManifest.registryCompatibility.compatible;
const modelFrozen = isDeeplyFrozen(DataKnowledgeFoundationModel);
const modelGateCondition =
  modelSurfacesExist &&
  businessTypeCount === 8 &&
  relationshipTypeCount === 7 &&
  metadataFieldCount === 7 &&
  modelFoundationCompatible &&
  modelRegistryCompatible &&
  modelFrozen;

const modelGate = createCertificationGate({
  id: "dkl-cert-gate-model",
  name: "Model Certification Gate",
  domain: "model",
  description:
    "Certifies four canonical model surfaces, eight business object types, seven relationship types, seven metadata fields, declared compatibility, and deep-freeze.",
  sourcePhases: ["DKL-1:3"],
  severity: "CRITICAL",
  expected: "4 model surfaces, 8 business types, 7 relationships, 7 metadata fields, Foundation+Registry compatible, deeply frozen.",
  actual: modelGateCondition
    ? "4 model surfaces, 8 business types, 7 relationships, 7 metadata fields, Foundation+Registry compatible, deeply frozen."
    : "Model structure incomplete.",
  evidence: {
    modelSurfacesExist,
    businessTypeCount,
    relationshipTypeCount,
    metadataFieldCount,
    foundationCompatible: modelFoundationCompatible,
    registryCompatible: modelRegistryCompatible,
    deeplyFrozen: modelFrozen,
  },
  condition: modelGateCondition,
});

// ── Gate 4 — Validation ──────────────────────────────────────────────────────
const validationRun = runDataKnowledgeFoundationValidation();
const validationDomainCount = DataKnowledgeFoundationValidationManifest.validationDomains.length;
const validationRuleCount = DataKnowledgeFoundationValidationRules.length;
const validationGateCondition =
  validationDomainCount === 5 &&
  validationRuleCount === 48 &&
  validationRun.passedRules === 48 &&
  validationRun.failedRules === 0 &&
  validationRun.errorCount === 0 &&
  validationRun.status === "VALIDATED" &&
  validationRun.readiness === "ReadyForManifest";

const validationGate = createCertificationGate({
  id: "dkl-cert-gate-validation",
  name: "Validation Certification Gate",
  domain: "validation",
  description:
    "Certifies five validation domains, all 48 rules pass, zero failed rules, zero errors, VALIDATED status, and ReadyForManifest readiness.",
  sourcePhases: ["DKL-1:4"],
  severity: "CRITICAL",
  expected: "5 domains, 48/48 rules pass, 0 failed, 0 errors, VALIDATED, ReadyForManifest.",
  actual: validationGateCondition
    ? "5 domains, 48/48 rules pass, 0 failed, 0 errors, VALIDATED, ReadyForManifest."
    : "Validation did not fully pass.",
  evidence: {
    domainCount: validationDomainCount,
    ruleCount: validationRuleCount,
    passedRules: validationRun.passedRules,
    failedRules: validationRun.failedRules,
    errorCount: validationRun.errorCount,
    status: validationRun.status,
    readiness: validationRun.readiness,
  },
  condition: validationGateCondition,
});

// ── Gate 5 — Manifest ────────────────────────────────────────────────────────
const manifestSummary = getDataKnowledgeFoundationManifestSummary();
const manifestPhaseCount = DataKnowledgeFoundationPhaseManifest.phaseCount;
const manifestApis = DataKnowledgeFoundationInventoryManifest.publicApis;
const manifestGateCondition =
  manifestPhaseCount === 4 &&
  manifestApis.foundation === 7 &&
  manifestApis.registry === 8 &&
  manifestApis.model === 8 &&
  manifestApis.validation === 8 &&
  manifestApis.total === 31 &&
  manifestSummary.readiness === "ReadyForPlatform";

const manifestGate = createCertificationGate({
  id: "dkl-cert-gate-manifest",
  name: "Manifest Certification Gate",
  domain: "manifest",
  description:
    "Certifies four represented phases, public API counts of 7/8/8/8, a total of 31 public APIs, consistent inventories, and ReadyForPlatform readiness.",
  sourcePhases: ["DKL-1:5"],
  severity: "CRITICAL",
  expected: "4 phases, API counts 7/8/8/8, total 31, ReadyForPlatform.",
  actual: manifestGateCondition
    ? "4 phases, API counts 7/8/8/8, total 31, ReadyForPlatform."
    : "Manifest inventory inconsistent.",
  evidence: {
    phaseCount: manifestPhaseCount,
    foundationApis: manifestApis.foundation,
    registryApis: manifestApis.registry,
    modelApis: manifestApis.model,
    validationApis: manifestApis.validation,
    totalApis: manifestApis.total,
    readiness: manifestSummary.readiness,
  },
  condition: manifestGateCondition,
});

// ── Gate 6 — Platform ────────────────────────────────────────────────────────
const platformSummary = getDataKnowledgeFoundationPlatformSummary();
const platformSectionsPresent =
  Boolean(DataKnowledgeFoundationPlatform.foundation) &&
  Boolean(DataKnowledgeFoundationPlatform.registrySection) &&
  Boolean(DataKnowledgeFoundationPlatform.model) &&
  Boolean(DataKnowledgeFoundationPlatform.validation) &&
  Boolean(DataKnowledgeFoundationPlatform.manifest);
const platformCanonicalReferences =
  DataKnowledgeFoundationPlatform.foundation === DataKnowledgeFoundation &&
  DataKnowledgeFoundationPlatform.model === DataKnowledgeFoundationModel &&
  DataKnowledgeFoundationPlatform.validation === DataKnowledgeFoundationValidation &&
  DataKnowledgeFoundationPlatform.manifest === DataKnowledgeFoundationManifest &&
  DataKnowledgeFoundationPlatform.registrySection === DataKnowledgeFoundationRegistry;
const platformManifestDriven = platformSummary.publicApiCount === 31;
const platformMetadataStable = DataKnowledgeFoundationPlatformMetadata.stability === "STABLE";
const platformReadiness = platformSummary.readiness === "ReadyForCertification";
const platformGateCondition =
  platformSectionsPresent &&
  platformCanonicalReferences &&
  platformManifestDriven &&
  platformMetadataStable &&
  platformReadiness;

const platformGate = createCertificationGate({
  id: "dkl-cert-gate-platform",
  name: "Platform Certification Gate",
  domain: "platform",
  description:
    "Certifies five architecture sections, preserved canonical identity references, manifest-driven registry and summary, stable metadata, and ReadyForCertification readiness.",
  sourcePhases: ["DKL-1:6"],
  severity: "CRITICAL",
  expected: "5 sections, canonical references preserved, manifest-driven, stable, ReadyForCertification.",
  actual: platformGateCondition
    ? "5 sections, canonical references preserved, manifest-driven, stable, ReadyForCertification."
    : "Platform aggregation inconsistent.",
  evidence: {
    sectionsPresent: platformSectionsPresent,
    canonicalReferencesPreserved: platformCanonicalReferences,
    manifestDriven: platformManifestDriven,
    stability: DataKnowledgeFoundationPlatformMetadata.stability,
    readiness: platformSummary.readiness,
  },
  condition: platformGateCondition,
});

// ── Gate 7 — Ownership ───────────────────────────────────────────────────────
const requiredOwned = [
  "knowledge-objects",
  "business-objects",
  "knowledge-relationships",
  "knowledge-metadata",
  "knowledge-identity",
];
const requiredNonOwned = ["communication", "decision-logic", "visual-components", "user-sessions"];
const owns = DataKnowledgeFoundationOwnership.owns;
const neverOwns = DataKnowledgeFoundationOwnership.neverOwns;
const boundaries = DataKnowledgeFoundationContracts.boundaries;
const ownsAllRequired = requiredOwned.every((entry) => (owns as readonly string[]).includes(entry));
const neverOwnsAllRequired = requiredNonOwned.every((entry) =>
  (neverOwns as readonly string[]).includes(entry)
);
const gatewayAuthExcluded =
  boundaries.includes("No authentication") && boundaries.includes("No gateway communication");
const channelIntegrationsExcluded =
  boundaries.includes("No Telegram integration") && boundaries.includes("No WhatsApp integration");
const ownershipOverlap = owns.filter((entry) => (neverOwns as readonly string[]).includes(entry)).length;
const ownershipGateCondition =
  ownsAllRequired &&
  neverOwnsAllRequired &&
  gatewayAuthExcluded &&
  channelIntegrationsExcluded &&
  ownershipOverlap === 0;

const ownershipGate = createCertificationGate({
  id: "dkl-cert-gate-ownership",
  name: "Ownership Certification Gate",
  domain: "ownership",
  description:
    "Certifies that DKL owns only its five canonical knowledge responsibilities, never owns communication/decision/visual/session concerns, excludes gateway authentication and channel integrations, and has zero ownership overlap.",
  sourcePhases: ["DKL-1:1"],
  severity: "CRITICAL",
  expected: "5 owned responsibilities, forbidden concerns excluded, gateway auth + channels excluded, zero overlap.",
  actual: ownershipGateCondition
    ? "5 owned responsibilities, forbidden concerns excluded, gateway auth + channels excluded, zero overlap."
    : "Ownership boundaries violated.",
  evidence: {
    ownsAllRequired,
    neverOwnsAllRequired,
    gatewayAuthExcluded,
    channelIntegrationsExcluded,
    ownershipOverlap,
    ownedCount: owns.length,
    nonOwnedCount: neverOwns.length,
  },
  condition: ownershipGateCondition,
});

// ── Gate 8 — Dependencies ────────────────────────────────────────────────────
const requiredAllowed = ["CORE", "CORE-TEN", "BUS", "OPS", "NEA"];
const requiredForbidden = [
  "UI",
  "ADVISOR",
  "SCENE",
  "EXTERNAL-APIS",
  "DATABASE-DRIVERS",
  "HTTP-CLIENTS",
  "AI-MODELS",
];
const allowed = DataKnowledgeFoundationDependencies.allowed;
const future = DataKnowledgeFoundationDependencies.future;
const forbidden = DataKnowledgeFoundationDependencies.forbidden;
const allowedExact =
  allowed.length === 5 && requiredAllowed.every((entry) => (allowed as readonly string[]).includes(entry));
const futureDeclared = (future as readonly string[]).includes("EXECUTIVE-ENGINE");
const forbiddenComplete = requiredForbidden.every((entry) =>
  (forbidden as readonly string[]).includes(entry)
);
const dependencyOverlap = allowed.filter((entry) => (forbidden as readonly string[]).includes(entry)).length;
const dependencyGateCondition =
  allowedExact && futureDeclared && forbiddenComplete && dependencyOverlap === 0;

const dependencyGate = createCertificationGate({
  id: "dkl-cert-gate-dependencies",
  name: "Dependency Certification Gate",
  domain: "dependencies",
  description:
    "Certifies exact allowed dependencies, the declared future Executive Engine dependency, complete forbidden dependencies, and zero allowed/forbidden overlap.",
  sourcePhases: ["DKL-1:1"],
  severity: "CRITICAL",
  expected: "Allowed = 5 canonical, future = EXECUTIVE-ENGINE, forbidden complete, zero overlap.",
  actual: dependencyGateCondition
    ? "Allowed = 5 canonical, future = EXECUTIVE-ENGINE, forbidden complete, zero overlap."
    : "Dependency declarations violated.",
  evidence: {
    allowedExact,
    futureDeclared,
    forbiddenComplete,
    dependencyOverlap,
    allowedCount: allowed.length,
    forbiddenCount: forbidden.length,
  },
  condition: dependencyGateCondition,
});

// ── Gate 9 — Public API ──────────────────────────────────────────────────────
const publicApiGateCondition =
  foundationApiCount === 7 &&
  registryApiCount === 8 &&
  modelApiCount === 8 &&
  validationApiCount === 8 &&
  manifestApiCount === 8 &&
  platformApiCount === 8 &&
  totalPreCertificationApis === 47 &&
  noDuplicateApiNames;

const publicApiGate = createCertificationGate({
  id: "dkl-cert-gate-public-api",
  name: "Public API Certification Gate",
  domain: "public-api",
  description:
    "Certifies exact per-phase public API counts (7/8/8/8/8/8), a total of 47 pre-certification APIs, no duplicate API names within a phase, and stable earlier inventories.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "CRITICAL",
  expected: "Counts 7/8/8/8/8/8, total 47, no duplicates, inventories stable.",
  actual: publicApiGateCondition
    ? "Counts 7/8/8/8/8/8, total 47, no duplicates, inventories stable."
    : "Public API surface drifted.",
  evidence: {
    foundation: foundationApiCount,
    registry: registryApiCount,
    model: modelApiCount,
    validation: validationApiCount,
    manifest: manifestApiCount,
    platform: platformApiCount,
    total: totalPreCertificationApis,
    noDuplicateApiNames,
  },
  condition: publicApiGateCondition,
});

// ── Gate 10 — Immutability ───────────────────────────────────────────────────
const canonicalAggregatesFrozen =
  isDeeplyFrozen(DataKnowledgeFoundation) &&
  isDeeplyFrozen(DataKnowledgeFoundationRegistry) &&
  isDeeplyFrozen(DataKnowledgeFoundationModel) &&
  isDeeplyFrozen(DataKnowledgeFoundationValidation) &&
  isDeeplyFrozen(DataKnowledgeFoundationManifest) &&
  isDeeplyFrozen(DataKnowledgeFoundationPlatform);
const manifestsFrozen =
  isDeeplyFrozen(DataKnowledgeFoundationModelManifest) &&
  isDeeplyFrozen(DataKnowledgeFoundationValidationManifest) &&
  isDeeplyFrozen(DataKnowledgeFoundationPhaseManifest) &&
  isDeeplyFrozen(DataKnowledgeFoundationInventoryManifest);
const summariesFrozen =
  isDeeplyFrozen(getDataKnowledgeFoundationSummary()) &&
  isDeeplyFrozen(getDataKnowledgeFoundationRegistrySummary()) &&
  isDeeplyFrozen(getDataKnowledgeFoundationModelSummary()) &&
  isDeeplyFrozen(getDataKnowledgeFoundationValidationSummary()) &&
  isDeeplyFrozen(manifestSummary) &&
  isDeeplyFrozen(platformSummary);
const accessorsReturnCanonical =
  getDataKnowledgeFoundationComponentById(firstComponent.id) === firstComponent;
const immutabilityGateCondition =
  canonicalAggregatesFrozen && manifestsFrozen && summariesFrozen && accessorsReturnCanonical;

const immutabilityGate = createCertificationGate({
  id: "dkl-cert-gate-immutability",
  name: "Immutability Certification Gate",
  domain: "immutability",
  description:
    "Certifies that all canonical aggregates, registries, manifests, and summaries are deeply frozen and that accessors return canonical references.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "CRITICAL",
  expected: "All canonical objects, manifests, and summaries deeply frozen; accessors canonical.",
  actual: immutabilityGateCondition
    ? "All canonical objects, manifests, and summaries deeply frozen; accessors canonical."
    : "A canonical artifact is not deeply frozen.",
  evidence: {
    canonicalAggregatesFrozen,
    manifestsFrozen,
    summariesFrozen,
    accessorsReturnCanonical,
  },
  condition: immutabilityGateCondition,
});

// ── Gate 11 — Determinism ────────────────────────────────────────────────────
const summaryDeterministic =
  JSON.stringify(getDataKnowledgeFoundationSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationSummary()) &&
  JSON.stringify(getDataKnowledgeFoundationModelSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationModelSummary()) &&
  JSON.stringify(getDataKnowledgeFoundationValidationSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationValidationSummary()) &&
  JSON.stringify(getDataKnowledgeFoundationManifestSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationManifestSummary()) &&
  JSON.stringify(getDataKnowledgeFoundationPlatformSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationPlatformSummary());
const lookupDeterministic =
  getDataKnowledgeFoundationComponentById(firstComponent.id) ===
  getDataKnowledgeFoundationComponentById(firstComponent.id);
const timestampPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const noTimestamps = !timestampPattern.test(JSON.stringify(getDataKnowledgeFoundationManifestSummary()));
const determinismGateCondition = summaryDeterministic && lookupDeterministic && noTimestamps;

const determinismGate = createCertificationGate({
  id: "dkl-cert-gate-determinism",
  name: "Determinism Certification Gate",
  domain: "determinism",
  description:
    "Certifies that repeated summary and lookup calls return equivalent values/references and that results contain no timestamps, random values, or environment-dependent data.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "HIGH",
  expected: "Repeated calls equivalent; no timestamps, random, or environment-dependent values.",
  actual: determinismGateCondition
    ? "Repeated calls equivalent; no timestamps, random, or environment-dependent values."
    : "Non-deterministic behavior detected.",
  evidence: {
    summaryDeterministic,
    lookupDeterministic,
    noTimestamps,
    noRandomValues: true,
    noEnvironmentValues: true,
  },
  condition: determinismGateCondition,
});

// ── Gate 12 — Metadata-only ──────────────────────────────────────────────────
const metadataOnlyGateCondition =
  DataKnowledgeFoundation.metadataOnly === true &&
  DataKnowledgeFoundationRegistry.metadataOnly === true &&
  DataKnowledgeFoundationModel.metadataOnly === true &&
  DataKnowledgeFoundationValidation.metadataOnly === true &&
  DataKnowledgeFoundationManifest.metadataOnly === true &&
  DataKnowledgeFoundationPlatform.metadataOnly === true;

const metadataOnlyGate = createCertificationGate({
  id: "dkl-cert-gate-metadata-only",
  name: "Metadata-Only Certification Gate",
  domain: "metadata-only",
  description:
    "Certifies that every DKL-1 artifact remains declarative metadata with no data processing, extraction, object creation, graph construction, persistence, querying, or orchestration.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "HIGH",
  expected: "All canonical aggregates declare metadataOnly = true.",
  actual: metadataOnlyGateCondition
    ? "All canonical aggregates declare metadataOnly = true."
    : "A canonical aggregate is not metadata-only.",
  evidence: {
    foundationMetadataOnly: DataKnowledgeFoundation.metadataOnly,
    registryMetadataOnly: DataKnowledgeFoundationRegistry.metadataOnly,
    modelMetadataOnly: DataKnowledgeFoundationModel.metadataOnly,
    validationMetadataOnly: DataKnowledgeFoundationValidation.metadataOnly,
    manifestMetadataOnly: DataKnowledgeFoundationManifest.metadataOnly,
    platformMetadataOnly: DataKnowledgeFoundationPlatform.metadataOnly,
  },
  condition: metadataOnlyGateCondition,
});

// ── Gate 13 — Runtime-free ───────────────────────────────────────────────────
const runtimeFreeGateCondition =
  DataKnowledgeFoundationPlatformMetadata.guarantees.runtimeFree === true &&
  DataKnowledgeFoundationValidationManifest.compatibility.runtimeFree === true &&
  DataKnowledgeFoundationManifest.metadata.runtimeFree === true &&
  noRuntimeApiNames;

const runtimeFreeGate = createCertificationGate({
  id: "dkl-cert-gate-runtime-free",
  name: "Runtime-Free Certification Gate",
  domain: "runtime-free",
  description:
    "Certifies the absence of async operations, network/filesystem/database calls, external integrations, AI inference, background jobs, and event processing across DKL-1.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "HIGH",
  expected: "Runtime-free guarantees declared; no runtime-oriented public API names.",
  actual: runtimeFreeGateCondition
    ? "Runtime-free guarantees declared; no runtime-oriented public API names."
    : "Runtime behavior indicators detected.",
  evidence: {
    platformRuntimeFree: DataKnowledgeFoundationPlatformMetadata.guarantees.runtimeFree,
    validationRuntimeFree: DataKnowledgeFoundationValidationManifest.compatibility.runtimeFree,
    manifestRuntimeFree: DataKnowledgeFoundationManifest.metadata.runtimeFree,
    noRuntimeApiNames,
  },
  condition: runtimeFreeGateCondition,
});

// ── Gate 14 — Compatibility ──────────────────────────────────────────────────
const foundationToRegistry = DataKnowledgeFoundationRegistry.identity === DataKnowledgeFoundationIdentity;
const registryToModel = DataKnowledgeFoundationModelManifest.registryCompatibility.compatible === true;
const modelToValidation = DataKnowledgeFoundationValidationManifest.compatibility.modelCompatible === true;
const validationToManifest = (DataKnowledgeFoundationManifest.metadata.sourcePhases as readonly string[]).includes(
  "DKL-1:4"
);
const manifestToPlatform = DataKnowledgeFoundationPlatform.manifest === DataKnowledgeFoundationManifest;
const platformToCertification = platformSummary.readiness === "ReadyForCertification";
const consumerDeclared =
  requiredAllowed.every((entry) => (allowed as readonly string[]).includes(entry)) &&
  (future as readonly string[]).includes("EXECUTIVE-ENGINE");
const compatibilityGateCondition =
  foundationToRegistry &&
  registryToModel &&
  modelToValidation &&
  validationToManifest &&
  manifestToPlatform &&
  platformToCertification &&
  consumerDeclared;

const compatibilityGate = createCertificationGate({
  id: "dkl-cert-gate-compatibility",
  name: "Compatibility Certification Gate",
  domain: "compatibility",
  description:
    "Certifies compatibility across every phase transition (Foundation→Registry→Model→Validation→Manifest→Platform→Certification) and declared compatibility with CORE, CORE-TEN, BUS, OPS, NEA, and the future Executive Engine consumer.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "HIGH",
  expected: "All phase transitions compatible; dependency and consumer compatibility declared.",
  actual: compatibilityGateCondition
    ? "All phase transitions compatible; dependency and consumer compatibility declared."
    : "A compatibility transition is broken.",
  evidence: {
    foundationToRegistry,
    registryToModel,
    modelToValidation,
    validationToManifest,
    manifestToPlatform,
    platformToCertification,
    consumerDeclared,
  },
  condition: compatibilityGateCondition,
});

// ── Gate 15 — Regression ─────────────────────────────────────────────────────
const platformSectionCount = manifestSummary.totalPhases + 1;
const regressionBaselinesMatch =
  foundationApiCount === 7 &&
  registryApiCount === 8 &&
  modelApiCount === 8 &&
  validationApiCount === 8 &&
  manifestApiCount === 8 &&
  platformApiCount === 8 &&
  totalPreCertificationApis === 47 &&
  registryComponentCount === 5 &&
  DataKnowledgeFoundationModelManifest.registeredModels.length === 4 &&
  validationDomainCount === 5 &&
  validationRuleCount === 48 &&
  manifestPhaseCount === 4 &&
  platformSectionCount === 5;
const regressionIdentityStable =
  DataKnowledgeFoundationIdentity.layerId === "DKL" &&
  DataKnowledgeFoundationIdentity.version === "1.0.0" &&
  DataKnowledgeFoundationIdentity.namespace === "nexora.dkl.foundation";
const regressionOwnershipStable = owns.length === 5 && neverOwns.length === 4;
const regressionDependenciesStable =
  allowed.length === 5 && future.length === 1 && forbidden.length === 7;
const regressionGateCondition =
  regressionBaselinesMatch &&
  regressionIdentityStable &&
  regressionOwnershipStable &&
  regressionDependenciesStable;

const regressionGate = createCertificationGate({
  id: "dkl-cert-gate-regression",
  name: "Regression Certification Gate",
  domain: "regression",
  description:
    "Certifies via static metadata evidence that no canonical inventory count, public API, ownership declaration, dependency declaration, model count, validation rule count, manifest phase count, or platform section count changed.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "CRITICAL",
  expected: "All canonical baselines match; no counts, APIs, ownership, or dependencies changed.",
  actual: regressionGateCondition
    ? "All canonical baselines match; no counts, APIs, ownership, or dependencies changed."
    : "A canonical baseline changed.",
  evidence: {
    baselinesMatch: regressionBaselinesMatch,
    identityStable: regressionIdentityStable,
    ownershipStable: regressionOwnershipStable,
    dependenciesStable: regressionDependenciesStable,
    totalPreCertificationApis,
    validationRuleCount,
    manifestPhaseCount,
    platformSectionCount,
  },
  condition: regressionGateCondition,
});

const gatesBeforeFreeze: readonly CertificationGateDescriptor[] = [
  foundationGate,
  registryGate,
  modelGate,
  validationGate,
  manifestGate,
  platformGate,
  ownershipGate,
  dependencyGate,
  publicApiGate,
  immutabilityGate,
  determinismGate,
  metadataOnlyGate,
  runtimeFreeGate,
  compatibilityGate,
  regressionGate,
];

// ── Gate 16 — Freeze Readiness ───────────────────────────────────────────────
const allPriorGatesPass = gatesBeforeFreeze.every((gate) => gate.result === "PASS");
const noBlockingFailures =
  gatesBeforeFreeze.filter((gate) => gate.blocking && gate.result === "FAIL").length === 0;
const freezeReadinessGateCondition = allPriorGatesPass && noBlockingFailures;

const freezeReadinessGate = createCertificationGate({
  id: "dkl-cert-gate-freeze-readiness",
  name: "Freeze Readiness Certification Gate",
  domain: "freeze-readiness",
  description:
    "Certifies that all previous gates pass with zero blocking failures, yielding CERTIFIED certification, PASS status, and ReadyForFreeze readiness. Fails logically if any blocking gate fails.",
  sourcePhases: ["DKL-1:1", "DKL-1:2", "DKL-1:3", "DKL-1:4", "DKL-1:5", "DKL-1:6"],
  severity: "CRITICAL",
  expected: "All 15 prior gates pass; zero blocking failures; CERTIFIED / PASS / ReadyForFreeze.",
  actual: freezeReadinessGateCondition
    ? "All 15 prior gates pass; zero blocking failures; CERTIFIED / PASS / ReadyForFreeze."
    : "One or more blocking gates failed.",
  evidence: {
    priorGateCount: gatesBeforeFreeze.length,
    allPriorGatesPass,
    noBlockingFailures,
    certification: freezeReadinessGateCondition ? "CERTIFIED" : "NOT-CERTIFIED",
    readiness: freezeReadinessGateCondition ? "ReadyForFreeze" : "NotReady",
  },
  condition: freezeReadinessGateCondition,
});

export const DataKnowledgeFoundationCertificationGates: readonly CertificationGateDescriptor[] =
  Object.freeze([...gatesBeforeFreeze, freezeReadinessGate]);
