/**
 * DKL-1:7 — Compatibility Certification.
 *
 * One immutable compatibility certification object declaring compatibility of
 * the complete DKL-1 platform across every phase transition, its allowed
 * dependencies, its future consumer, and the canonical guarantees required for
 * freeze. Metadata only — no runtime behavior, no source or Git inspection.
 */

import { DataKnowledgeFoundationDependencies } from "./dataKnowledgeFoundation.ts";
import type { CompatibilityCertificationDescriptor } from "./dataKnowledgeFoundationCertificationTypes.ts";

export const DataKnowledgeFoundationCompatibilityCertification = Object.freeze({
  compatibilityId: "DKL-1:7-COMPAT",
  certifiedPhases: Object.freeze([
    "DKL-1:1",
    "DKL-1:2",
    "DKL-1:3",
    "DKL-1:4",
    "DKL-1:5",
    "DKL-1:6",
  ]),
  dependencyCompatibility: Object.freeze([...DataKnowledgeFoundationDependencies.allowed]),
  consumerCompatibility: Object.freeze([...DataKnowledgeFoundationDependencies.future]),
  ownershipCompatibility: true,
  publicApiCompatibility: true,
  modelCompatibility: true,
  validationCompatibility: true,
  platformCompatibility: true,
  guarantees: Object.freeze({
    metadataOnly: true,
    runtimeFree: true,
    deepFrozen: true,
    deterministic: true,
    publicApiStable: true,
    ownershipProtected: true,
    dependencyProtected: true,
    manifestDriven: true,
    canonicalReferencesPreserved: true,
    readyForFreeze: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies CompatibilityCertificationDescriptor);
