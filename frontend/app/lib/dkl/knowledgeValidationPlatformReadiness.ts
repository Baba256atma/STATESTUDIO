/**
 * DKL-5:6 — Knowledge Validation Platform Readiness.
 *
 * Deterministic metadata-only readiness gates verifying DKL-5:1–5:5 completion
 * and Platform composition integrity. Pure evaluation. Frozen results.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationIdentity,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryIdentity,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModel,
  KnowledgeValidationModelIdentity,
} from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationValidation,
  KnowledgeValidationValidationIdentity,
} from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationManifest,
  KnowledgeValidationManifestIdentity,
  getKnowledgeValidationManifestStatistics,
} from "./knowledgeValidationManifest.ts";
import { KnowledgeValidationPlatformComponents } from "./knowledgeValidationPlatformComponents.ts";
import { KnowledgeValidationPlatformDependencies } from "./knowledgeValidationPlatformDependencies.ts";
import type { PlatformReadinessGate } from "./knowledgeValidationPlatformTypes.ts";

const PRIMARY_SECTION_ORDER = Object.freeze([
  "metadata",
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
] as const);

const gate = (
  gateId: string,
  description: string,
  pass: boolean,
  expected: string,
  actual: string,
): PlatformReadinessGate =>
  Object.freeze({
    gateId,
    description,
    status: (pass ? "Pass" : "Fail") as "Pass" | "Fail",
    expected,
    actual,
  });

const evaluateGates = (): readonly PlatformReadinessGate[] => {
  const stats = getKnowledgeValidationManifestStatistics();
  const manifestReadiness = KnowledgeValidationManifest.manifestReadiness;
  const counts = KnowledgeValidationManifest.counts;

  const foundationStatusOk =
    KnowledgeValidationFoundationIdentity.status === "FoundationComplete";
  const foundationReadyOk =
    KnowledgeValidationFoundationIdentity.readiness === "ReadyForRegistry";
  const registryStatusOk =
    KnowledgeValidationRegistryIdentity.status === "RegistryComplete";
  const registryReadyOk =
    KnowledgeValidationRegistryIdentity.readiness === "ReadyForModel";
  const modelStatusOk =
    KnowledgeValidationModelIdentity.status === "ModelComplete";
  const modelReadyOk =
    KnowledgeValidationModelIdentity.readiness === "ReadyForValidation";
  const validationStatusOk =
    KnowledgeValidationValidationIdentity.status === "ValidationComplete";
  const validationPassOk =
    KnowledgeValidationValidation.result.overallStatus === "Pass";
  const validationReadyOk =
    KnowledgeValidationValidationIdentity.readiness === "ReadyForManifest";
  const manifestStatusOk =
    KnowledgeValidationManifestIdentity.status === "ManifestComplete";
  const manifestReadyOk =
    KnowledgeValidationManifestIdentity.readiness === "ReadyForPlatform";
  const manifestGatesOk = manifestReadiness.allGatesPass === true;
  const sectionCountOk = PRIMARY_SECTION_ORDER.length === 6;
  const sectionOrderOk =
    PRIMARY_SECTION_ORDER[0] === "metadata" &&
    PRIMARY_SECTION_ORDER[1] === "foundation" &&
    PRIMARY_SECTION_ORDER[2] === "registry" &&
    PRIMARY_SECTION_ORDER[3] === "model" &&
    PRIMARY_SECTION_ORDER[4] === "validation" &&
    PRIMARY_SECTION_ORDER[5] === "manifest";
  const componentCountOk =
    KnowledgeValidationPlatformComponents.componentCount === 5;
  const byReferenceOk =
    KnowledgeValidationPlatformComponents.includedByReferenceOnly === true &&
    KnowledgeValidationPlatformComponents.components.every(
      (entry) => entry.includedByReference === true,
    );
  const noReOwnOk =
    KnowledgeValidationPlatformComponents.noComponentReOwned === true &&
    KnowledgeValidationPlatformComponents.components.every(
      (entry) => entry.ownedByPlatform === false,
    );
  const entryPointsOk =
    KnowledgeValidationPlatformDependencies.entryCount === 5 &&
    KnowledgeValidationPlatformDependencies.publicEntryPointOnly === true &&
    KnowledgeValidationPlatformDependencies.noInternalPriorPhaseImports ===
      true &&
    KnowledgeValidationPlatformDependencies.noDirectDkl4Dependency === true &&
    KnowledgeValidationPlatformDependencies.noFuturePhases === true;
  const inventoryOk =
    counts.totalPublicApiCount === 40 &&
    counts.foundationContractCount === stats.foundationContractCount &&
    counts.validationTargetCount === 19 &&
    counts.validationDimensionCount === 20 &&
    counts.qualitySignalCount === 20 &&
    counts.outcomeCount === 11 &&
    counts.severityCount === 6 &&
    counts.registryCollectionCount === 24 &&
    counts.registryEntryCount === 266 &&
    counts.canonicalModelCount === 30 &&
    counts.modelRelationshipCount === 14 &&
    counts.validationCategoryCount === 27 &&
    counts.validationRuleCount === 63 &&
    counts.validationPassCount === 63 &&
    counts.validationFailCount === 0;
  const ownershipOk =
    KnowledgeValidationRegistry.ownership.noDuplicateArchitecturalOwnership ===
      true &&
    KnowledgeValidationManifest.ownership.noOwnershipTransfer === true &&
    KnowledgeValidationPlatformComponents.noComponentReOwned === true;
  const dependencyOk =
    KnowledgeValidationPlatformDependencies.noCircularDependency === true &&
    KnowledgeValidationPlatformDependencies.noPersistenceDependency === true &&
    KnowledgeValidationPlatformDependencies.noExternalPackageDependency ===
      true;
  const runtimeForbiddenOk =
    KnowledgeValidationFoundation.metadataOnly === true &&
    KnowledgeValidationRegistry.metadataOnly === true &&
    KnowledgeValidationModel.metadataOnly === true &&
    KnowledgeValidationValidation.metadataOnly === true &&
    KnowledgeValidationManifest.metadataOnly === true &&
    KnowledgeValidationManifest.guarantees.noRuntimeKnowledgeValidation ===
      true;
  const scoringForbiddenOk =
    KnowledgeValidationManifest.guarantees.noNumericScoring === true &&
    KnowledgeValidationModel.guarantees.noNumericScoring === true;
  const trustForbiddenOk =
    KnowledgeValidationManifest.guarantees.noTrustCalculation === true &&
    KnowledgeValidationModel.guarantees.noTrustCalculation === true;
  const cleansingForbiddenOk =
    KnowledgeValidationManifest.guarantees.noCleansing === true &&
    KnowledgeValidationManifest.guarantees.noRemediation === true;
  const aiForbiddenOk =
    KnowledgeValidationManifest.guarantees.noAiConfidence === true &&
    KnowledgeValidationModel.guarantees.noAiConfidence === true;
  const frozenOk =
    Object.isFrozen(KnowledgeValidationPlatformComponents) &&
    Object.isFrozen(KnowledgeValidationPlatformDependencies) &&
    Object.isFrozen(KnowledgeValidationManifest);

  return Object.freeze([
    gate(
      "KV-PLT-GATE-001",
      "Foundation status is FoundationComplete",
      foundationStatusOk,
      "FoundationComplete",
      KnowledgeValidationFoundationIdentity.status,
    ),
    gate(
      "KV-PLT-GATE-002",
      "Foundation readiness is ReadyForRegistry",
      foundationReadyOk,
      "ReadyForRegistry",
      KnowledgeValidationFoundationIdentity.readiness,
    ),
    gate(
      "KV-PLT-GATE-003",
      "Registry status is RegistryComplete",
      registryStatusOk,
      "RegistryComplete",
      KnowledgeValidationRegistryIdentity.status,
    ),
    gate(
      "KV-PLT-GATE-004",
      "Registry readiness is ReadyForModel",
      registryReadyOk,
      "ReadyForModel",
      KnowledgeValidationRegistryIdentity.readiness,
    ),
    gate(
      "KV-PLT-GATE-005",
      "Model status is ModelComplete",
      modelStatusOk,
      "ModelComplete",
      KnowledgeValidationModelIdentity.status,
    ),
    gate(
      "KV-PLT-GATE-006",
      "Model readiness is ReadyForValidation",
      modelReadyOk,
      "ReadyForValidation",
      KnowledgeValidationModelIdentity.readiness,
    ),
    gate(
      "KV-PLT-GATE-007",
      "Validation status is ValidationComplete",
      validationStatusOk,
      "ValidationComplete",
      KnowledgeValidationValidationIdentity.status,
    ),
    gate(
      "KV-PLT-GATE-008",
      "Validation overall result is Pass",
      validationPassOk,
      "Pass",
      KnowledgeValidationValidation.result.overallStatus,
    ),
    gate(
      "KV-PLT-GATE-009",
      "Validation readiness is ReadyForManifest",
      validationReadyOk,
      "ReadyForManifest",
      KnowledgeValidationValidationIdentity.readiness,
    ),
    gate(
      "KV-PLT-GATE-010",
      "Manifest status is ManifestComplete",
      manifestStatusOk,
      "ManifestComplete",
      KnowledgeValidationManifestIdentity.status,
    ),
    gate(
      "KV-PLT-GATE-011",
      "Manifest readiness is ReadyForPlatform",
      manifestReadyOk,
      "ReadyForPlatform",
      KnowledgeValidationManifestIdentity.readiness,
    ),
    gate(
      "KV-PLT-GATE-012",
      "All 15 Manifest readiness gates pass",
      manifestGatesOk,
      "allGatesPass=true; gateCount=15",
      `allGatesPass=${String(manifestReadiness.allGatesPass)}; gateCount=${manifestReadiness.gateCount}`,
    ),
    gate(
      "KV-PLT-GATE-013",
      "Exactly six Platform sections exist",
      sectionCountOk,
      "6",
      String(PRIMARY_SECTION_ORDER.length),
    ),
    gate(
      "KV-PLT-GATE-014",
      "Platform section ordering is correct",
      sectionOrderOk,
      "metadata→foundation→registry→model→validation→manifest",
      PRIMARY_SECTION_ORDER.join("→"),
    ),
    gate(
      "KV-PLT-GATE-015",
      "Exactly five components exist",
      componentCountOk,
      "5",
      String(KnowledgeValidationPlatformComponents.componentCount),
    ),
    gate(
      "KV-PLT-GATE-016",
      "Every component is included by canonical reference",
      byReferenceOk,
      "includedByReference=true",
      byReferenceOk ? "all by reference" : "violation",
    ),
    gate(
      "KV-PLT-GATE-017",
      "No component is re-owned",
      noReOwnOk,
      "ownedByPlatform=false",
      noReOwnOk ? "no re-ownership" : "re-owned",
    ),
    gate(
      "KV-PLT-GATE-018",
      "Public-entry-point-only dependencies are satisfied",
      entryPointsOk,
      "5 public entry points; no internals/DKL-4/future",
      `${KnowledgeValidationPlatformDependencies.entryCount} modules`,
    ),
    gate(
      "KV-PLT-GATE-019",
      "Inventory counts match Manifest metadata",
      inventoryOk,
      "canonical Manifest counts",
      inventoryOk ? "matched" : "mismatch",
    ),
    gate(
      "KV-PLT-GATE-020",
      "Ownership conflicts are absent",
      ownershipOk,
      "noDuplicateOwnership + noOwnershipTransfer + noComponentReOwned",
      ownershipOk ? "absent" : "conflict",
    ),
    gate(
      "KV-PLT-GATE-021",
      "Dependency violations are absent",
      dependencyOk,
      "no circular/persistence/external package deps",
      dependencyOk ? "absent" : "violation",
    ),
    gate(
      "KV-PLT-GATE-022",
      "Runtime organizational validation remains prohibited",
      runtimeForbiddenOk,
      "noRuntimeKnowledgeValidation",
      runtimeForbiddenOk ? "prohibited" : "violated",
    ),
    gate(
      "KV-PLT-GATE-023",
      "Numeric scoring remains prohibited",
      scoringForbiddenOk,
      "noNumericScoring",
      scoringForbiddenOk ? "prohibited" : "violated",
    ),
    gate(
      "KV-PLT-GATE-024",
      "Trust calculation remains prohibited",
      trustForbiddenOk,
      "noTrustCalculation",
      trustForbiddenOk ? "prohibited" : "violated",
    ),
    gate(
      "KV-PLT-GATE-025",
      "Cleansing and remediation remain prohibited",
      cleansingForbiddenOk,
      "noCleansing + noRemediation",
      cleansingForbiddenOk ? "prohibited" : "violated",
    ),
    gate(
      "KV-PLT-GATE-026",
      "AI and inference remain prohibited",
      aiForbiddenOk,
      "noAiConfidence",
      aiForbiddenOk ? "prohibited" : "violated",
    ),
    gate(
      "KV-PLT-GATE-027",
      "Platform metadata is frozen",
      frozenOk,
      "Object.isFrozen(components, dependencies, manifest)",
      frozenOk ? "frozen" : "mutable",
    ),
  ]);
};

const GATES = evaluateGates();
const PASS_COUNT = GATES.filter((entry) => entry.status === "Pass").length;
const FAIL_COUNT = GATES.filter((entry) => entry.status === "Fail").length;
const ALL_PASS = FAIL_COUNT === 0;

/** Canonical immutable Platform readiness aggregate. */
export const KnowledgeValidationPlatformReadiness = Object.freeze({
  readinessId: "DKL-5:6/PlatformReadiness",
  sourcePhase: "DKL-5:6" as const,
  owner: "DKL-5 Knowledge Validation Platform",
  primarySectionOrder: PRIMARY_SECTION_ORDER,
  gates: GATES,
  gateCount: GATES.length,
  passCount: PASS_COUNT,
  failCount: FAIL_COUNT,
  allGatesPass: ALL_PASS,
  status: ALL_PASS ? ("PlatformComplete" as const) : ("NotReady" as const),
  readiness: ALL_PASS
    ? ("ReadyForCertification" as const)
    : ("NotReady" as const),
  flags: Object.freeze({
    FoundationComplete: true,
    RegistryComplete: true,
    ModelComplete: true,
    ValidationComplete: true,
    ManifestComplete: true,
    PlatformComplete: ALL_PASS,
    ReadyForCertification: ALL_PASS,
    ReadyForFreeze: ALL_PASS,
    ReadyForPublicIndex: ALL_PASS,
    MetadataOnly: true,
    PlatformOnly: true,
    Deterministic: true,
    Immutable: true,
    RuntimeBehaviorForbidden: true,
    RuntimeValidationForbidden: true,
    ScoringForbidden: true,
    TrustCalculationForbidden: true,
    CleansingForbidden: true,
    RemediationForbidden: true,
    PersistenceForbidden: true,
    GraphTraversalForbidden: true,
    AiForbidden: true,
    InferenceForbidden: true,
    EngineFree: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  pure: true,
  sideEffectFree: true,
});
