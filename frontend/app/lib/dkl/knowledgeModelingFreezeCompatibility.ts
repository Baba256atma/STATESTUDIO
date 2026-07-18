/**
 * DKL-4:8 — Knowledge Modeling Freeze Compatibility.
 *
 * Immutable compatibility protections for the frozen release candidate.
 * Metadata only. No runtime version negotiation.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import type { FreezeCompatibilityEntry } from "./knowledgeModelingFreezeTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Freeze";

const compat = (
  compatibilityId: string,
  name: string,
  target: string,
  status: FreezeCompatibilityEntry["status"],
  description: string,
): FreezeCompatibilityEntry =>
  Object.freeze({ compatibilityId, name, target, status, description });

const ENTRIES: readonly FreezeCompatibilityEntry[] = Object.freeze([
  compat(
    "FREEZE-COMPAT-FND",
    "DKL-4:1 Foundation",
    "DKL-4:1",
    "Frozen",
    "Foundation architecture is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-REG",
    "DKL-4:2 Registry",
    "DKL-4:2",
    "Frozen",
    "Registry architecture is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-MDL",
    "DKL-4:3 Model",
    "DKL-4:3",
    "Frozen",
    "Model architecture is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-VAL",
    "DKL-4:4 Validation",
    "DKL-4:4",
    "Frozen",
    "Validation architecture is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-MNF",
    "DKL-4:5 Manifest",
    "DKL-4:5",
    "Frozen",
    "Manifest architecture is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-PLT",
    "DKL-4:6 Platform",
    "DKL-4:6",
    "Frozen",
    "Platform composition is frozen by reference.",
  ),
  compat(
    "FREEZE-COMPAT-CERT",
    "DKL-4:7 Certification",
    "DKL-4:7",
    "Frozen",
    "Certification result is frozen.",
  ),
  compat(
    "FREEZE-COMPAT-DKL3",
    "DKL-3 upstream public-reference contract",
    "DKL-3",
    "Protected",
    "DKL-3 remains upstream-reference only through Foundation.",
  ),
  compat(
    "FREEZE-COMPAT-PUBLIC-INDEX",
    "DKL-4:9 Public Index forward consumption",
    "DKL-4:9",
    "Compatible",
    "Freeze is ReadyForPublicIndex for DKL-4:9 consumption.",
  ),
  compat(
    "FREEZE-COMPAT-ENGINE",
    "Executive Engine consumer compatibility",
    "Executive Engine",
    "Protected",
    "Engine may consume Public Index metadata only after DKL-4:9.",
  ),
  compat(
    "FREEZE-COMPAT-EXT",
    "Additive extensions",
    "Extension policy",
    "AdditiveOnly",
    "Future extensions must be additive, versioned, and re-certified.",
  ),
  compat(
    "FREEZE-COMPAT-API",
    "Public API stability",
    "Public APIs",
    "BreakingChangeForbidden",
    "Public API surfaces are locked; breaking changes forbidden.",
  ),
  compat(
    "FREEZE-COMPAT-OWN",
    "Ownership stability",
    "Ownership boundaries",
    "BreakingChangeForbidden",
    "Ownership boundaries remain frozen and non-transferable.",
  ),
  compat(
    "FREEZE-COMPAT-DEP",
    "Dependency stability",
    "Dependency boundaries",
    "BreakingChangeForbidden",
    "Dependency boundaries remain public-entry-point-only.",
  ),
  compat(
    "FREEZE-COMPAT-SCHEMA",
    "Metadata schema stability",
    "Metadata schemas",
    "Frozen",
    "Metadata schemas are frozen for the release candidate.",
  ),
  compat(
    "FREEZE-COMPAT-RUNTIME",
    "Runtime prohibition stability",
    "Runtime prohibitions",
    "BreakingChangeForbidden",
    "Runtime prohibitions remain permanently active.",
  ),
]);

/** Canonical immutable Freeze compatibility protections. */
export const KnowledgeModelingFreezeCompatibility = Object.freeze({
  compatibilityId: "DKL-4:8/FreezeCompatibility",
  sourcePhase: "DKL-4:8" as const,
  owner: OWNER,
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  runtimeVersionNegotiation: false,
  breakingChangeForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
