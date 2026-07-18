/**
 * DKL-1:4 — Foundation Validation domain.
 *
 * Deterministically validates the DKL-1:1 Foundation using its official public
 * APIs only. Metadata only — no runtime behavior.
 */

import {
  DataKnowledgeFoundation,
  DataKnowledgeFoundationContracts,
  DataKnowledgeFoundationIdentity,
  getDataKnowledgeFoundation,
  getDataKnowledgeFoundationSummary,
} from "./dataKnowledgeFoundation.ts";
import {
  createValidationDomain,
  createValidationRule,
  isDeeplyFrozen,
} from "./dataKnowledgeFoundationValidationTypes.ts";

const accessorsDeterministic =
  getDataKnowledgeFoundation() === DataKnowledgeFoundation &&
  JSON.stringify(getDataKnowledgeFoundationSummary()) ===
    JSON.stringify(getDataKnowledgeFoundationSummary());

const rules = [
  createValidationRule({
    id: "DKL-VAL-F-01",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Foundation identity exists",
    description: "The Foundation must publish an identity descriptor with a platform name.",
    expected: "identity.platformName is non-empty",
    actual: DataKnowledgeFoundationIdentity.platformName,
    condition: DataKnowledgeFoundationIdentity.platformName.length > 0,
    evidence: { platformName: DataKnowledgeFoundationIdentity.platformName },
  }),
  createValidationRule({
    id: "DKL-VAL-F-02",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Namespace is canonical",
    description: "The Foundation namespace must equal the canonical DKL namespace.",
    expected: "nexora.dkl.foundation",
    actual: DataKnowledgeFoundationIdentity.namespace,
    condition: DataKnowledgeFoundationIdentity.namespace === "nexora.dkl.foundation",
    evidence: { namespace: DataKnowledgeFoundationIdentity.namespace },
  }),
  createValidationRule({
    id: "DKL-VAL-F-03",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Layer identifier is correct",
    description: "The Foundation layer identifier must be DKL.",
    expected: "DKL",
    actual: DataKnowledgeFoundationIdentity.layerId,
    condition: DataKnowledgeFoundationIdentity.layerId === "DKL",
    evidence: { layerId: DataKnowledgeFoundationIdentity.layerId },
  }),
  createValidationRule({
    id: "DKL-VAL-F-04",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Version metadata exists",
    description: "The Foundation must declare a semantic version.",
    expected: "1.0.0",
    actual: DataKnowledgeFoundationIdentity.version,
    condition: DataKnowledgeFoundationIdentity.version === "1.0.0",
    evidence: { version: DataKnowledgeFoundationIdentity.version },
  }),
  createValidationRule({
    id: "DKL-VAL-F-05",
    domain: "foundation",
    severity: "INFO",
    sourcePhase: "DKL-1:1",
    title: "Stability is declared",
    description: "The Foundation must declare a stability level.",
    expected: "Stable",
    actual: DataKnowledgeFoundationIdentity.stability,
    condition: DataKnowledgeFoundationIdentity.stability === "Stable",
    evidence: { stability: DataKnowledgeFoundationIdentity.stability },
  }),
  createValidationRule({
    id: "DKL-VAL-F-06",
    domain: "foundation",
    severity: "INFO",
    sourcePhase: "DKL-1:1",
    title: "Release status is declared",
    description: "The Foundation must declare a release status.",
    expected: "Certified",
    actual: DataKnowledgeFoundationIdentity.releaseStatus,
    condition: DataKnowledgeFoundationIdentity.releaseStatus === "Certified",
    evidence: { releaseStatus: DataKnowledgeFoundationIdentity.releaseStatus },
  }),
  createValidationRule({
    id: "DKL-VAL-F-07",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Responsibilities exist",
    description: "The Foundation contracts must publish at least one responsibility.",
    expected: "responsibilities.length > 0",
    actual: String(DataKnowledgeFoundationContracts.responsibilities.length),
    condition: DataKnowledgeFoundationContracts.responsibilities.length > 0,
    evidence: { responsibilityCount: DataKnowledgeFoundationContracts.responsibilities.length },
  }),
  createValidationRule({
    id: "DKL-VAL-F-08",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Boundaries exist",
    description: "The Foundation contracts must publish architectural boundaries.",
    expected: "boundaries.length > 0",
    actual: String(DataKnowledgeFoundationContracts.boundaries.length),
    condition: DataKnowledgeFoundationContracts.boundaries.length > 0,
    evidence: { boundaryCount: DataKnowledgeFoundationContracts.boundaries.length },
  }),
  createValidationRule({
    id: "DKL-VAL-F-09",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Extension policy exists",
    description: "The Foundation must declare an additive-only extension policy.",
    expected: "additive-only",
    actual: DataKnowledgeFoundationContracts.extensionPolicy.policy,
    condition: DataKnowledgeFoundationContracts.extensionPolicy.policy === "additive-only",
    evidence: {
      policy: DataKnowledgeFoundationContracts.extensionPolicy.policy,
      allowsRuntimeBehavior: DataKnowledgeFoundationContracts.extensionPolicy.allowsRuntimeBehavior,
    },
  }),
  createValidationRule({
    id: "DKL-VAL-F-10",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Foundation object is deeply frozen",
    description: "The aggregate Foundation object and all nested metadata must be deeply frozen.",
    expected: "isDeeplyFrozen(DataKnowledgeFoundation) === true",
    actual: String(isDeeplyFrozen(DataKnowledgeFoundation)),
    condition: isDeeplyFrozen(DataKnowledgeFoundation),
    evidence: { deeplyFrozen: isDeeplyFrozen(DataKnowledgeFoundation) },
  }),
  createValidationRule({
    id: "DKL-VAL-F-11",
    domain: "foundation",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Foundation accessors are deterministic",
    description: "Both Foundation accessor APIs must return canonical, deterministic values.",
    expected: "accessors return canonical deterministic values",
    actual: String(accessorsDeterministic),
    condition: accessorsDeterministic,
    evidence: { deterministic: accessorsDeterministic },
  }),
];

export const DataKnowledgeFoundationFoundationValidation = createValidationDomain(
  "foundation",
  "Foundation Validation",
  "DKL-1:1",
  rules
);
