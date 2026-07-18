/**
 * DKL-4:7 — Knowledge Modeling Certification Compatibility.
 *
 * Immutable compatibility certification declarations. Metadata only.
 * No runtime negotiation.
 *
 * Ownership: owned exclusively by DKL-4:7.
 */

import { KnowledgeModelingPlatform } from "./knowledgeModelingPlatform.ts";

const OWNER = "DKL-4 Knowledge Modeling Certification";

type CompatStatus = "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";

const compat = (
  compatibilityId: string,
  name: string,
  status: CompatStatus,
  description: string,
) =>
  Object.freeze({ compatibilityId, name, status, description });

/** Canonical immutable compatibility certification declarations. */
export const KnowledgeModelingCertificationCompatibility = Object.freeze({
  compatibilityId: "DKL-4:7/CertificationCompatibility",
  sourcePhase: "DKL-4:7" as const,
  owner: OWNER,
  entries: Object.freeze([
    compat(
      "CERT-COMPAT-FND",
      "DKL-4:1 Foundation compatibility",
      "Compatible",
      "Foundation included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-REG",
      "DKL-4:2 Registry compatibility",
      "Compatible",
      "Registry included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-MDL",
      "DKL-4:3 Model compatibility",
      "Compatible",
      "Model included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-VAL",
      "DKL-4:4 Validation compatibility",
      "Compatible",
      "Validation included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-MNF",
      "DKL-4:5 Manifest compatibility",
      "Compatible",
      "Manifest included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-PLT",
      "DKL-4:6 Platform compatibility",
      "Compatible",
      "Platform composition certified through public entry point.",
    ),
    compat(
      "CERT-COMPAT-DKL3",
      "DKL-3 upstream-reference compatibility",
      "Compatible",
      "DKL-3 reached only through Foundation upstream metadata.",
    ),
    compat(
      "CERT-COMPAT-FREEZE",
      "DKL-4:8 Freeze forward compatibility",
      "ForwardCompatible",
      "Certification metadata intended for Freeze without schema rename.",
    ),
    compat(
      "CERT-COMPAT-PUBLIC-INDEX",
      "DKL-4:9 Public Index forward compatibility",
      "ForwardCompatible",
      "Certification metadata intended for Public Index publication.",
    ),
    compat(
      "CERT-COMPAT-ENGINE",
      "Executive Engine consumer compatibility",
      "Restricted",
      "Engine may consume metadata only; no runtime modeling APIs.",
    ),
    compat(
      "CERT-COMPAT-EXT",
      "Additive-extension compatibility",
      "Compatible",
      "Extensions remain additive and phase-owned.",
    ),
    compat(
      "CERT-COMPAT-API",
      "Public API stability compatibility",
      "Compatible",
      "Public API surfaces remain explicit and stable.",
    ),
  ]),
  entryCount: 12,
  platformCompatibilityEntryCount: KnowledgeModelingPlatform.compatibility.entryCount,
  runtimeCompatibilityLogic: false,
  versionNegotiationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
