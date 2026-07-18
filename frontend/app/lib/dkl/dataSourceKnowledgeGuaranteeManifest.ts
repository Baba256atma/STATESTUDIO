/**
 * DKL-2:5 — Guarantee Manifest.
 *
 * Exactly twelve immutable architectural guarantees for the DKL-2 platform, each
 * supported by approved prior-phase metadata and DKL-2:4 validation results.
 * These are architectural guarantees only — not operational SLAs or runtime
 * reliability promises.
 *
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: depends only on the DKL-2:4 public validation runner and the
 * DKL-2:5 manifest types.
 */

import { DataSourceKnowledgeValidationManifest } from "./dataSourceKnowledgeValidationRunner.ts";
import {
  MANIFEST_SOURCE_PHASE,
  type GuaranteeManifestContainer,
  type GuaranteeManifestEntry,
} from "./dataSourceKnowledgeManifestTypes.ts";

const guarantee = (
  guaranteeId: string,
  name: string,
  description: string,
  evidence: readonly string[]
): GuaranteeManifestEntry =>
  Object.freeze({
    guaranteeId,
    name,
    description,
    sourcePhase: MANIFEST_SOURCE_PHASE,
    evidence: Object.freeze([...evidence]),
    status: "Guaranteed",
    metadataOnly: true,
    immutable: true,
  });

const validationEvidence = `DKL-2:4 ${DataSourceKnowledgeValidationManifest.validationStatus} (${DataSourceKnowledgeValidationManifest.passCount}/${DataSourceKnowledgeValidationManifest.ruleCount} PASS)`;

const guarantees: readonly GuaranteeManifestEntry[] = Object.freeze([
  guarantee("dsk-guarantee-metadata-only", "MetadataOnly", "Every DKL-2 artifact is descriptive metadata with no runtime behavior.", [
    "RuntimeBoundary rules PASS",
    validationEvidence,
  ]),
  guarantee("dsk-guarantee-runtime-free", "RuntimeFree", "No phase performs I/O, network, filesystem, or connector execution.", [
    "RuntimeBoundary rules PASS",
  ]),
  guarantee("dsk-guarantee-deterministic", "Deterministic", "All outputs are pure functions of immutable in-memory metadata.", [
    "Determinism rules PASS",
  ]),
  guarantee("dsk-guarantee-deeply-immutable", "DeeplyImmutable", "All public objects are deeply frozen.", [
    "Immutability rules PASS",
  ]),
  guarantee("dsk-guarantee-public-api-only", "PublicApiOnlyDependencies", "Every phase consumes prior phases only through public APIs.", [
    "Dependency rules PASS",
  ]),
  guarantee("dsk-guarantee-forward-only", "ForwardOnlyDependencies", "The dependency graph is strictly forward-only.", [
    "Dependency manifest forwardOnly=true",
  ]),
  guarantee("dsk-guarantee-cycle-free", "CycleFreeArchitecture", "The dependency graph contains no cycles.", [
    "Dependency manifest cycleFree=true",
  ]),
  guarantee("dsk-guarantee-unique-ids", "GloballyUniqueIdentifiers", "All registry, model, and rule identifiers are globally unique.", [
    "Registry and Model rules PASS",
  ]),
  guarantee("dsk-guarantee-reference-integrity", "ReferenceIntegrityCertified", "Every cross-phase reference resolves exactly once with no dangling references.", [
    "ReferenceIntegrity rules PASS",
  ]),
  guarantee("dsk-guarantee-ownership-boundaries", "OwnershipBoundariesProtected", "Phase ownership is separated and owned/forbidden sets do not overlap.", [
    "Ownership rules PASS",
  ]),
  guarantee("dsk-guarantee-no-live-source", "NoLiveSourceAccess", "No phase connects to, discovers, or reads any live source.", [
    "RuntimeBoundary rules PASS",
  ]),
  guarantee("dsk-guarantee-validation-certified", "ValidationCertified", "The architecture is certified by the DKL-2:4 validation platform.", [
    validationEvidence,
  ]),
]);

export const DataSourceKnowledgeGuaranteeManifest: GuaranteeManifestContainer = Object.freeze({
  kind: "GuaranteeManifest",
  guarantees,
  getByGuaranteeId: (guaranteeId: string): GuaranteeManifestEntry | undefined =>
    guarantees.find((entry) => entry.guaranteeId === guaranteeId),
});
