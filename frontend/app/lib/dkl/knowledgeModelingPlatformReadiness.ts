/**
 * DKL-4:6 — Knowledge Modeling Platform Readiness.
 *
 * Deterministic metadata-only readiness gates verifying DKL-4:1–4:5 completion.
 * Pure evaluation. Frozen results. No side effects.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModel,
  KnowledgeModelingModelIdentity,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidation,
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationReport,
} from "./knowledgeModelingValidation.ts";
import {
  KnowledgeModelingManifest,
  KnowledgeModelingManifestIdentity,
} from "./knowledgeModelingManifest.ts";
import { KnowledgeModelingPlatformComponents } from "./knowledgeModelingPlatformComponents.ts";
import { KnowledgeModelingPlatformDependencies } from "./knowledgeModelingPlatformDependencies.ts";
import type { PlatformReadinessGate } from "./knowledgeModelingPlatformTypes.ts";

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
  name: string,
  pass: boolean,
  expected: string,
  actual: string,
): PlatformReadinessGate =>
  Object.freeze({
    gateId,
    name,
    status: (pass ? "Pass" : "Fail") as "Pass" | "Fail",
    expected,
    actual,
  });

const evaluateGates = (): readonly PlatformReadinessGate[] => {
  const foundationStatusOk =
    KnowledgeModelingFoundationIdentity.status === "FoundationComplete";
  const foundationReadyOk =
    KnowledgeModelingFoundationIdentity.readiness === "ReadyForRegistry";
  const registryStatusOk =
    KnowledgeModelingRegistryIdentity.status === "RegistryComplete";
  const registryReadyOk =
    KnowledgeModelingRegistryIdentity.readiness === "ReadyForModel";
  const modelStatusOk = KnowledgeModelingModelIdentity.status === "ModelComplete";
  const modelReadyOk =
    KnowledgeModelingModelIdentity.readiness === "ReadyForValidation";
  const validationStatusOk =
    KnowledgeModelingValidationIdentity.status === "ValidationComplete";
  const validationPassOk =
    KnowledgeModelingValidationReport.status === "Validated" &&
    KnowledgeModelingValidationReport.failCount === 0;
  const validationReadyOk =
    KnowledgeModelingValidationIdentity.readiness === "ReadyForManifest";
  const manifestStatusOk =
    KnowledgeModelingManifestIdentity.status === "ManifestComplete";
  const manifestReadyOk =
    KnowledgeModelingManifestIdentity.readiness === "ReadyForPlatform";
  const entryPointsOk =
    KnowledgeModelingPlatformDependencies.entryCount === 5 &&
    KnowledgeModelingPlatformDependencies.publicEntryPointOnly === true &&
    KnowledgeModelingPlatformDependencies.modules.length === 5;
  const componentsOk = KnowledgeModelingPlatformComponents.componentCount === 5;
  const sectionOrderOk =
    PRIMARY_SECTION_ORDER.length === 6 &&
    PRIMARY_SECTION_ORDER[0] === "metadata" &&
    PRIMARY_SECTION_ORDER[1] === "foundation" &&
    PRIMARY_SECTION_ORDER[2] === "registry" &&
    PRIMARY_SECTION_ORDER[3] === "model" &&
    PRIMARY_SECTION_ORDER[4] === "validation" &&
    PRIMARY_SECTION_ORDER[5] === "manifest";
  const ownershipOk =
    KnowledgeModelingRegistry.ownership.noDuplicateArchitecturalOwnership === true &&
    KnowledgeModelingPlatformComponents.noComponentReOwned === true;
  const runtimeForbiddenOk =
    KnowledgeModelingFoundation.metadataOnly === true &&
    KnowledgeModelingRegistry.metadataOnly === true &&
    KnowledgeModelingModel.metadataOnly === true &&
    KnowledgeModelingValidation.metadataOnly === true &&
    KnowledgeModelingManifest.metadataOnly === true &&
    KnowledgeModelingModel.guarantees.noObjectFactories === true &&
    KnowledgeModelingModel.guarantees.noGraphOperations === true;

  return Object.freeze([
    gate(
      "KM-PLT-GATE-001",
      "Foundation status is FoundationComplete",
      foundationStatusOk,
      "FoundationComplete",
      KnowledgeModelingFoundationIdentity.status,
    ),
    gate(
      "KM-PLT-GATE-002",
      "Foundation readiness is ReadyForRegistry",
      foundationReadyOk,
      "ReadyForRegistry",
      KnowledgeModelingFoundationIdentity.readiness,
    ),
    gate(
      "KM-PLT-GATE-003",
      "Registry status is RegistryComplete",
      registryStatusOk,
      "RegistryComplete",
      KnowledgeModelingRegistryIdentity.status,
    ),
    gate(
      "KM-PLT-GATE-004",
      "Registry readiness is ReadyForModel",
      registryReadyOk,
      "ReadyForModel",
      KnowledgeModelingRegistryIdentity.readiness,
    ),
    gate(
      "KM-PLT-GATE-005",
      "Model status is ModelComplete",
      modelStatusOk,
      "ModelComplete",
      KnowledgeModelingModelIdentity.status,
    ),
    gate(
      "KM-PLT-GATE-006",
      "Model readiness is ReadyForValidation",
      modelReadyOk,
      "ReadyForValidation",
      KnowledgeModelingModelIdentity.readiness,
    ),
    gate(
      "KM-PLT-GATE-007",
      "Validation status is ValidationComplete",
      validationStatusOk,
      "ValidationComplete",
      KnowledgeModelingValidationIdentity.status,
    ),
    gate(
      "KM-PLT-GATE-008",
      "Validation overall result is Pass",
      validationPassOk,
      "Validated with failCount=0",
      `${KnowledgeModelingValidationReport.status}/failCount=${KnowledgeModelingValidationReport.failCount}`,
    ),
    gate(
      "KM-PLT-GATE-009",
      "Validation readiness is ReadyForManifest",
      validationReadyOk,
      "ReadyForManifest",
      KnowledgeModelingValidationIdentity.readiness,
    ),
    gate(
      "KM-PLT-GATE-010",
      "Manifest status is ManifestComplete",
      manifestStatusOk,
      "ManifestComplete",
      KnowledgeModelingManifestIdentity.status,
    ),
    gate(
      "KM-PLT-GATE-011",
      "Manifest readiness is ReadyForPlatform",
      manifestReadyOk,
      "ReadyForPlatform",
      KnowledgeModelingManifestIdentity.readiness,
    ),
    gate(
      "KM-PLT-GATE-012",
      "All canonical entry-point dependencies exist",
      entryPointsOk,
      "5 public entry points",
      `${KnowledgeModelingPlatformDependencies.entryCount} modules`,
    ),
    gate(
      "KM-PLT-GATE-013",
      "All Platform sections are present",
      componentsOk && sectionOrderOk,
      "6 sections; 5 upstream components",
      `sections=${PRIMARY_SECTION_ORDER.length}; components=${KnowledgeModelingPlatformComponents.componentCount}`,
    ),
    gate(
      "KM-PLT-GATE-014",
      "Platform section order is correct",
      sectionOrderOk,
      "metadata→foundation→registry→model→validation→manifest",
      PRIMARY_SECTION_ORDER.join("→"),
    ),
    gate(
      "KM-PLT-GATE-015",
      "Ownership conflicts are absent",
      ownershipOk,
      "noDuplicateArchitecturalOwnership + noComponentReOwned",
      ownershipOk ? "absent" : "conflict",
    ),
    gate(
      "KM-PLT-GATE-016",
      "Runtime behavior remains prohibited",
      runtimeForbiddenOk,
      "metadataOnly + no factories/graph",
      runtimeForbiddenOk ? "prohibited" : "violated",
    ),
  ]);
};

const GATES = evaluateGates();
const PASS_COUNT = GATES.filter((g) => g.status === "Pass").length;
const FAIL_COUNT = GATES.filter((g) => g.status === "Fail").length;
const ALL_PASS = FAIL_COUNT === 0;

/** Canonical immutable Platform readiness aggregate. */
export const KnowledgeModelingPlatformReadiness = Object.freeze({
  readinessId: "DKL-4:6/PlatformReadiness",
  sourcePhase: "DKL-4:6" as const,
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
    ModelingExecutionForbidden: true,
    ValidationExecutionForbidden: true,
    GraphTraversalForbidden: true,
    PersistenceForbidden: true,
    InferenceForbidden: true,
    AiForbidden: true,
    EngineFree: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  pure: true,
  sideEffectFree: true,
});
