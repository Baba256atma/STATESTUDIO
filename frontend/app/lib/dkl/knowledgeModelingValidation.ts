/**
 * DKL-4:4 — Knowledge Modeling Validation.
 *
 * Canonical immutable validation layer for DKL-4:1–4:3 architectural integrity.
 * Publishes exactly eight runtime exports. Validates platform structure only —
 * never operational payloads, never repairs, never mutates.
 *
 * Ownership: owned exclusively by DKL-4:4.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
  KnowledgeModelingRegistrySummary,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModel,
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
  KnowledgeModelingModelCatalog,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidationRules,
  KNOWLEDGE_MODELING_VALIDATION_CATEGORIES,
} from "./knowledgeModelingValidationRules.ts";
import { KnowledgeModelingValidationOwnership } from "./knowledgeModelingValidationOwnership.ts";
import { KnowledgeModelingValidationBoundaries } from "./knowledgeModelingValidationBoundaries.ts";
import type {
  KnowledgeModelingValidationIdentityDescriptor,
  KnowledgeModelingValidationResult,
  KnowledgeModelingValidationRuleResult,
} from "./knowledgeModelingValidationTypes.ts";

export const KnowledgeModelingValidationVersion = "1.0.0";

export const KnowledgeModelingValidationNamespace =
  "nexora.dkl.knowledge-modeling.validation";

export const KnowledgeModelingValidationIdentity: KnowledgeModelingValidationIdentityDescriptor =
  Object.freeze({
    validationId: "DKL-4:4/KnowledgeModelingValidation",
    validationVersion: KnowledgeModelingValidationVersion,
    validationName: "Knowledge Modeling Validation",
    validationNamespace: KnowledgeModelingValidationNamespace,
    owner: "DKL-4 Knowledge Modeling Validation",
    sourcePhase: "DKL-4:4",
    platformId: "DKL-4",
    platformVersion: KnowledgeModelingValidationVersion,
    status: "ValidationComplete",
    readiness: "ReadyForManifest",
  });

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const noOverlap = (
  owns: readonly string[],
  doesNotOwn: readonly string[],
): boolean => {
  const set = new Set(owns);
  for (const item of doesNotOwn) {
    if (set.has(item)) {
      return false;
    }
  }
  return true;
};

const allRegistryIds = (): readonly string[] =>
  Object.freeze(
    Object.values(KnowledgeModelingRegistry.collections).flatMap((entries) =>
      entries.map((entry: { readonly id: string }) => entry.id),
    ),
  );

const evaluateRules = (): readonly KnowledgeModelingValidationRuleResult[] => {
  const foundationOk =
    KnowledgeModelingFoundationIdentity.status === "FoundationComplete" &&
    KnowledgeModelingFoundationIdentity.readiness === "ReadyForRegistry";
  const lifecycleOk = KnowledgeModelingFoundation.lifecycle.stateCount === 11;
  const ownershipOk =
    KnowledgeModelingFoundation.ownership.owns.length >= 1 &&
    KnowledgeModelingFoundation.ownership.doesNotOwn.length >= 1 &&
    noOverlap(
      [...KnowledgeModelingFoundation.ownership.owns],
      [...KnowledgeModelingFoundation.ownership.doesNotOwn],
    );
  const extensionOk =
    KnowledgeModelingFoundation.contracts.extensionPolicies.length >= 1 &&
    KnowledgeModelingFoundation.contracts.compatibilityPolicies.length >= 1;
  const registryOk =
    KnowledgeModelingRegistryIdentity.status === "RegistryComplete" &&
    KnowledgeModelingRegistryIdentity.readiness === "ReadyForModel";
  const categoryOk = KnowledgeModelingRegistrySummary.registryCategoryCount === 18;
  const boOk = KnowledgeModelingRegistrySummary.businessObjectTypeCount === 26;
  const relOk = KnowledgeModelingRegistrySummary.relationshipTypeCount === 20;
  const uniqueOk =
    KnowledgeModelingRegistrySummary.uniqueIdentifiersGuaranteed === true &&
    unique(allRegistryIds());
  const modelOk =
    KnowledgeModelingModelIdentity.status === "ModelComplete" &&
    KnowledgeModelingModelIdentity.readiness === "ReadyForValidation";
  const modelCountOk = KnowledgeModelingModelCatalog.modelCount === 20;
  const koFields = KnowledgeModelingModelCatalog.byKind.KnowledgeObject.fields;
  const koReadonlyOk = koFields.every(
    (field) => field.readonly === true && field.executableBehaviorImplied === false,
  );
  const boComposesOk = KnowledgeModelingModelCatalog.byKind.BusinessObject.fields.some(
    (field) => field.fieldName === "knowledgeObject",
  );
  const registryDepOk =
    KnowledgeModelingRegistry.dependencies.approvedFoundationDependency.module ===
    "knowledgeModelingFoundation.ts";
  const modelDepOk =
    KnowledgeModelingModel.dependencies.approvedDependencyCount === 2 &&
    KnowledgeModelingModel.dependencies.noDirectDkl3Dependency === true;
  const noFutureOk =
    KnowledgeModelingRegistry.dependencies.noFutureDkl4Dependency === true &&
    KnowledgeModelingModel.dependencies.noFutureDkl4Dependency === true;
  const noDupOwnOk =
    KnowledgeModelingRegistry.ownership.noDuplicateArchitecturalOwnership === true;
  const foundationApiOk =
    KnowledgeModelingRegistrySummary.publicFoundationApiCount === 8;
  const registryExportOk = Object.keys(KnowledgeModelingRegistry).length >= 1;
  const modelExportOk = Object.keys(KnowledgeModelingModel).length >= 1;
  const metadataOk =
    KnowledgeModelingFoundation.metadataOnly === true &&
    KnowledgeModelingRegistry.metadataOnly === true &&
    KnowledgeModelingModel.metadataOnly === true &&
    KnowledgeModelingFoundation.immutable === true &&
    KnowledgeModelingRegistry.immutable === true &&
    KnowledgeModelingModel.immutable === true;
  const noRuntimeOk =
    KnowledgeModelingModel.guarantees.noObjectFactories === true &&
    KnowledgeModelingModel.guarantees.noGraphOperations === true;
  const compatById = Object.fromEntries(
    KnowledgeModelingFoundation.contracts.compatibilityPolicies.map((p) => [
      p.policyId,
      p,
    ]),
  );
  const compatOk =
    compatById["COMPAT-DKL3"]?.status === "Compatible" &&
    compatById["COMPAT-AI-FORBIDDEN"]?.status === "Forbidden";
  const extById = Object.fromEntries(
    KnowledgeModelingFoundation.contracts.extensionPolicies.map((p) => [p.policyId, p]),
  );
  const extOk =
    extById["EXT-ADDITIVE"]?.status === "AdditiveAllowed" &&
    extById["EXT-RUNTIME-FORBIDDEN"]?.status === "Forbidden";
  const boundaryOk =
    KnowledgeModelingFoundation.boundaries.persistenceForbidden === true &&
    KnowledgeModelingFoundation.boundaries.aiExecutionForbidden === true;

  const checks: Record<string, boolean> = {
    "KM-VAL-FND-001": foundationOk,
    "KM-VAL-FND-002": lifecycleOk,
    "KM-VAL-FND-003": ownershipOk,
    "KM-VAL-FND-004": extensionOk,
    "KM-VAL-REG-001": registryOk,
    "KM-VAL-REG-002": categoryOk,
    "KM-VAL-REG-003": boOk,
    "KM-VAL-REG-004": relOk,
    "KM-VAL-REG-005": uniqueOk,
    "KM-VAL-MDL-001": modelOk,
    "KM-VAL-MDL-002": modelCountOk,
    "KM-VAL-MDL-003": koReadonlyOk,
    "KM-VAL-MDL-004": boComposesOk,
    "KM-VAL-DEP-001": registryDepOk,
    "KM-VAL-DEP-002": modelDepOk,
    "KM-VAL-DEP-003": noFutureOk,
    "KM-VAL-OWN-001": noDupOwnOk,
    "KM-VAL-API-001": foundationApiOk,
    "KM-VAL-API-002": registryExportOk && modelExportOk,
    "KM-VAL-IMM-001": metadataOk,
    "KM-VAL-IMM-002": noRuntimeOk,
    "KM-VAL-CMP-001": compatOk,
    "KM-VAL-EXT-001": extOk,
    "KM-VAL-BND-001": boundaryOk,
  };

  return Object.freeze(
    KnowledgeModelingValidationRules.map((rule) =>
      Object.freeze({
        ruleId: rule.ruleId,
        category: rule.category,
        status: (checks[rule.ruleId] ? "Pass" : "Fail") as "Pass" | "Fail",
        message: checks[rule.ruleId]
          ? `PASS: ${rule.expected}`
          : `FAIL: expected ${rule.expected}`,
      }),
    ),
  );
};

/**
 * Deterministic architectural validation of DKL-4:1–4:3 public surfaces.
 * Pure, metadata-only, never mutates, never repairs, never throws for Fail.
 */
export function validateKnowledgeModelingArchitecture(): KnowledgeModelingValidationResult {
  const ruleResults = evaluateRules();
  const passCount = ruleResults.filter((r) => r.status === "Pass").length;
  const failCount = ruleResults.filter((r) => r.status === "Fail").length;
  const valid = failCount === 0;
  return Object.freeze({
    validationId: KnowledgeModelingValidationIdentity.validationId,
    status: valid ? ("Validated" as const) : ("Failed" as const),
    readiness: valid ? ("ReadyForManifest" as const) : ("NotReady" as const),
    ruleResults,
    passCount,
    failCount,
    categoryCount: KNOWLEDGE_MODELING_VALIDATION_CATEGORIES.length,
    ruleCount: KnowledgeModelingValidationRules.length,
    metadataOnly: true,
    inputMutated: false,
    repaired: false,
    immutable: true,
    deterministic: true,
  });
}

const CANONICAL_RESULT = validateKnowledgeModelingArchitecture();

/** Frozen canonical validation report snapshot. */
export const KnowledgeModelingValidationReport = Object.freeze({
  reportId: "DKL-4:4/ValidationReport",
  identity: KnowledgeModelingValidationIdentity,
  categories: KNOWLEDGE_MODELING_VALIDATION_CATEGORIES,
  categoryCount: KNOWLEDGE_MODELING_VALIDATION_CATEGORIES.length,
  rules: KnowledgeModelingValidationRules,
  ruleCount: KnowledgeModelingValidationRules.length,
  result: CANONICAL_RESULT,
  passCount: CANONICAL_RESULT.passCount,
  failCount: CANONICAL_RESULT.failCount,
  status: CANONICAL_RESULT.status,
  readiness: CANONICAL_RESULT.readiness,
  boundaries: KnowledgeModelingValidationBoundaries,
  ownership: KnowledgeModelingValidationOwnership,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Knowledge Modeling Validation aggregate. */
export const KnowledgeModelingValidation = Object.freeze({
  identity: KnowledgeModelingValidationIdentity,
  version: KnowledgeModelingValidationVersion,
  namespace: KnowledgeModelingValidationNamespace,
  rules: KnowledgeModelingValidationRules,
  categories: KNOWLEDGE_MODELING_VALIDATION_CATEGORIES,
  ownership: KnowledgeModelingValidationOwnership,
  boundaries: KnowledgeModelingValidationBoundaries,
  report: KnowledgeModelingValidationReport,
  foundation: Object.freeze({
    identity: KnowledgeModelingFoundationIdentity,
    version: KnowledgeModelingFoundationVersion,
  }),
  registry: Object.freeze({
    identity: KnowledgeModelingRegistryIdentity,
    version: KnowledgeModelingRegistryVersion,
  }),
  model: Object.freeze({
    identity: KnowledgeModelingModelIdentity,
    version: KnowledgeModelingModelVersion,
  }),
  readiness: Object.freeze({
    ValidationComplete: true,
    ReadyForManifest: CANONICAL_RESULT.readiness === "ReadyForManifest",
    MetadataOnly: true,
    OperationalPayloadValidationForbidden: true,
    RepairForbidden: true,
    MutationForbidden: true,
    GraphTraversalForbidden: true,
    PersistenceForbidden: true,
    AiForbidden: true,
    EngineFree: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "ValidationComplete",
    "RulesCatalogued",
    "ArchitectureValidated",
    "ReadyForManifest",
  ]),
  nextPhase: "DKL-4:5 — Knowledge Modeling Manifest",
  metadataOnly: true,
  validationOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeModelingValidationRules,
  KnowledgeModelingValidationOwnership,
};
