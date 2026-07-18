/**
 * DKL-5:8 — Knowledge Validation Freeze Locks.
 *
 * Explicit immutable locks protecting certified DKL-5 architecture.
 * Metadata only — locks describe protection; they do not enforce at runtime.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import type { FreezeLockEntry } from "./knowledgeValidationFreezeTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Freeze";

const lock = (
  lockId: string,
  name: string,
  target: string,
  targetPhase: string,
  lockType: string,
  evidence: string,
): FreezeLockEntry =>
  Object.freeze({
    lockId,
    name,
    target,
    targetPhase,
    lockType,
    protectionLevel: "Permanent" as const,
    breakingChangePolicy: "Forbidden" as const,
    additiveChangePolicy: "Controlled" as const,
    ownership: OWNER,
    status: "Locked" as const,
    evidence,
    unlockPolicy: "Forbidden" as const,
    deterministic: true as const,
    immutable: true as const,
  });

const LOCKS: readonly FreezeLockEntry[] = Object.freeze([
  lock("LOCK-FND-IDENTITY", "Foundation identity lock", "Foundation identity", "DKL-5:1", "IdentityLock", "certifiedPlatform.foundation.identity"),
  lock("LOCK-FND-CONTRACT", "Foundation contract lock", "20 Foundation contract kinds", "DKL-5:1", "ContractLock", "certifiedPlatform.foundation.contracts.contractKinds"),
  lock("LOCK-VAL-TARGET", "Validation target lock", "19 validation targets", "DKL-5:1", "TargetLock", "certifiedPlatform.foundation.contracts.targetCategories"),
  lock("LOCK-VAL-DIMENSION", "Validation dimension lock", "20 validation dimensions", "DKL-5:1", "DimensionLock", "certifiedPlatform.foundation.contracts.dimensions"),
  lock("LOCK-QUALITY-SIGNAL", "Quality signal lock", "20 quality signals", "DKL-5:1", "SignalLock", "certifiedPlatform.foundation.contracts.qualitySignals"),
  lock("LOCK-VAL-OUTCOME", "Validation outcome lock", "11 validation outcomes", "DKL-5:1", "OutcomeLock", "certifiedPlatform.foundation.contracts.outcomes"),
  lock("LOCK-SEVERITY", "Severity lock", "6 severity levels", "DKL-5:1", "SeverityLock", "certifiedPlatform.foundation.contracts.severities"),
  lock("LOCK-REG-COLLECTION", "Registry collection lock", "24 Registry collections", "DKL-5:2", "CollectionLock", "certifiedPlatform.registry.summary.registryCategoryCount"),
  lock("LOCK-REG-ENTRY", "Registry entry lock", "266 Registry entries", "DKL-5:2", "EntryLock", "certifiedPlatform.registry.summary.totalEntryCount"),
  lock("LOCK-CANONICAL-MODEL", "Canonical model lock", "30 canonical models", "DKL-5:3", "ModelLock", "certifiedPlatform.model.catalog.modelKinds"),
  lock("LOCK-MODEL-RELATIONSHIP", "Model relationship lock", "14 structural relationships", "DKL-5:3", "RelationshipLock", "certifiedPlatform.model.relationships.declarations"),
  lock("LOCK-VAL-CATEGORY", "Validation category lock", "27 validation categories", "DKL-5:4", "CategoryLock", "certifiedPlatform.validation.categories"),
  lock("LOCK-VAL-RULE", "Validation rule lock", "63 validation rules", "DKL-5:4", "RuleLock", "certifiedPlatform.validation.rules"),
  lock("LOCK-VAL-EVIDENCE", "Validation evidence lock", "63 validation evidence records", "DKL-5:4", "EvidenceLock", "certifiedPlatform.validation.result.ruleResults"),
  lock("LOCK-MNF-SECTION", "Manifest section lock", "12 Manifest sections", "DKL-5:5", "SectionLock", "certifiedPlatform.manifest.sections"),
  lock("LOCK-MNF-ORDERING", "Manifest ordering lock", "Manifest section ordering", "DKL-5:5", "OrderingLock", "certifiedPlatform.manifest.inventory.sectionOrder"),
  lock("LOCK-MNF-INVENTORY", "Manifest inventory lock", "Manifest inventories and counts", "DKL-5:5", "InventoryLock", "certifiedPlatform.manifest.counts"),
  lock("LOCK-PLT-SECTION", "Platform section lock", "6 Platform sections", "DKL-5:6", "SectionLock", "certifiedPlatform.sections"),
  lock("LOCK-PLT-ORDERING", "Platform ordering lock", "Platform section ordering", "DKL-5:6", "OrderingLock", "certifiedPlatform.sectionOrder"),
  lock("LOCK-PLT-COMPONENT", "Platform component lock", "5 Platform components", "DKL-5:6", "ComponentLock", "certifiedPlatform.components"),
  lock("LOCK-CERT-CATEGORY", "Certification category lock", "24 Certification categories", "DKL-5:7", "CategoryLock", "certification.categories"),
  lock("LOCK-CERT-GATE", "Certification gate lock", "85 Certification gates", "DKL-5:7", "GateLock", "certification.gates"),
  lock("LOCK-CERT-EVIDENCE", "Certification evidence lock", "85 Certification evidence records", "DKL-5:7", "EvidenceLock", "certification.evidence"),
  lock("LOCK-REGRESSION", "Regression declaration lock", "30 regression declarations", "DKL-5:7", "RegressionLock", "certification.regression.declarations"),
  lock("LOCK-EVIDENCE-GUARANTEE", "Evidence-oriented guarantee lock", "Evidence-oriented architecture guarantees", "DKL-5:1", "GuaranteeLock", "certifiedPlatform.foundation.contracts.evidenceAndFindings"),
  lock("LOCK-EXPLAINABILITY", "Explainability guarantee lock", "Explainable and traceable findings", "DKL-5:1", "GuaranteeLock", "certifiedPlatform.foundation.contracts.evidenceAndFindings.notes"),
  lock("LOCK-PARTIAL-USABILITY", "Partial-usability guarantee lock", "ValidWithLimitations and partial usability", "DKL-5:1", "GuaranteeLock", "certifiedPlatform.foundation.contracts.outcomeStatuses"),
  lock("LOCK-CONSUMER-READINESS", "Consumer-readiness lock", "Consumer suitability states", "DKL-5:3", "ReadinessLock", "certifiedPlatform.model.catalog.consumerSuitabilityStates"),
  lock("LOCK-EXECUTIVE-USABILITY", "Executive-usability lock", "Executive usability capabilities", "DKL-5:3", "UsabilityLock", "certifiedPlatform.model.catalog.executiveUsabilityCapabilities"),
  lock("LOCK-OWNERSHIP", "Ownership boundary lock", "Ownership boundaries", "DKL-5:6", "OwnershipLock", "certifiedPlatform.metadata.ownership"),
  lock("LOCK-DEPENDENCY", "Dependency boundary lock", "Dependency boundaries", "DKL-5:6", "DependencyLock", "certifiedPlatform.dependencies"),
  lock("LOCK-COMPATIBILITY", "Compatibility declaration lock", "Compatibility declarations", "DKL-5:6", "CompatibilityLock", "certifiedPlatform.compatibility"),
  lock("LOCK-EXTENSION-POLICY", "Extension policy lock", "Extension policies", "DKL-5:6", "ExtensionLock", "certifiedPlatform.extensions.policy"),
  lock("LOCK-PUBLIC-API", "Public API surface lock", "56 public APIs through Certification", "DKL-5:7", "ApiLock", "7×8 public APIs"),
  lock("LOCK-RUNTIME-PROHIBITION", "Runtime-validation prohibition lock", "Runtime organizational validation prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noRuntimeOrganizationalValidation"),
  lock("LOCK-SCORING-PROHIBITION", "Numeric-scoring prohibition lock", "Numeric scoring prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noNumericScoring"),
  lock("LOCK-TRUST-PROHIBITION", "Trust-calculation prohibition lock", "Trust calculation prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noTrustCalculation"),
  lock("LOCK-CLEANSING-PROHIBITION", "Cleansing prohibition lock", "Cleansing prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noCleansing"),
  lock("LOCK-REMEDIATION-PROHIBITION", "Remediation prohibition lock", "Remediation prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noRemediation"),
  lock("LOCK-AI-INFERENCE-PROHIBITION", "AI and inference prohibition lock", "AI and semantic inference prohibition", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noAiOrSemanticInference"),
  lock("LOCK-PERSISTENCE-PROHIBITION", "Persistence prohibition lock", "Persistence, search, query, graph prohibitions", "DKL-5:6", "ProhibitionLock", "certifiedPlatform.metadata.guarantees.noPersistence"),
  lock("LOCK-METADATA-ONLY", "Metadata-only guarantee lock", "Metadata-only architecture guarantee", "DKL-5:6", "GuaranteeLock", "certifiedPlatform.metadataOnly"),
]);

/** Canonical immutable Freeze lock catalog. */
export const KnowledgeValidationFreezeLocks = Object.freeze({
  locksId: "DKL-5:8/FreezeLocks",
  sourcePhase: "DKL-5:8" as const,
  owner: OWNER,
  locks: LOCKS,
  lockCount: LOCKS.length,
  lockIds: Object.freeze(LOCKS.map((entry) => entry.lockId)),
  unlockPolicy: "Forbidden" as const,
  breakingChangePolicy: "Forbidden" as const,
  additiveChangePolicy: "Controlled" as const,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
