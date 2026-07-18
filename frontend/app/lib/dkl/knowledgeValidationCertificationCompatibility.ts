/**
 * DKL-5:7 — Knowledge Validation Certification Compatibility.
 *
 * Immutable compatibility certification declarations. Metadata only.
 * No runtime negotiation.
 *
 * Ownership: owned exclusively by DKL-5:7.
 */

const OWNER = "DKL-5 Knowledge Validation Certification";

type CompatStatus = "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";

const compat = (
  compatibilityId: string,
  subject: string,
  status: CompatStatus,
  description: string,
) =>
  Object.freeze({ compatibilityId, subject, status, description });

/** Canonical immutable compatibility certification declarations. */
export const KnowledgeValidationCertificationCompatibility = Object.freeze({
  compatibilityId: "DKL-5:7/CertificationCompatibility",
  sourcePhase: "DKL-5:7" as const,
  owner: OWNER,
  entries: Object.freeze([
    compat(
      "CERT-COMPAT-DKL4",
      "DKL-4 Knowledge Modeling Public Index",
      "Compatible",
      "DKL-4 reached only through approved public-index path via Platform upstream metadata.",
    ),
    compat(
      "CERT-COMPAT-FND",
      "DKL-5:1 Foundation",
      "Compatible",
      "Foundation included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-REG",
      "DKL-5:2 Registry",
      "Compatible",
      "Registry included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-MDL",
      "DKL-5:3 Model",
      "Compatible",
      "Model included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-VAL",
      "DKL-5:4 Validation",
      "Compatible",
      "Validation included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-MNF",
      "DKL-5:5 Manifest",
      "Compatible",
      "Manifest included by canonical Platform reference.",
    ),
    compat(
      "CERT-COMPAT-PLT",
      "DKL-5:6 Platform",
      "Compatible",
      "Platform composition certified through public entry point only.",
    ),
    compat(
      "CERT-COMPAT-FREEZE",
      "DKL-5:8 Freeze forward compatibility",
      "ForwardCompatible",
      "Certification metadata intended for Freeze without schema rename.",
    ),
    compat(
      "CERT-COMPAT-PUBLIC-INDEX",
      "DKL-5:9 Public Index forward compatibility",
      "ForwardCompatible",
      "Certified Platform is intended for Public Index publication.",
    ),
    compat(
      "CERT-COMPAT-REPOSITORY",
      "Future Knowledge Repository compatibility",
      "ForwardCompatible",
      "Certified metadata may be consumed by future repository layers.",
    ),
    compat(
      "CERT-COMPAT-SERVICES",
      "Future Knowledge Services compatibility",
      "ForwardCompatible",
      "Certified metadata may be consumed by future knowledge services.",
    ),
    compat(
      "CERT-COMPAT-ENGINE",
      "Executive Engine restricted consumption",
      "Restricted",
      "Engine may consume certified metadata only; no runtime APIs exist.",
    ),
    compat(
      "CERT-COMPAT-ADVISOR",
      "Advisor integration contracts",
      "Restricted",
      "Advisor may consume declarations later; Advisor behavior is not owned here.",
    ),
    compat(
      "CERT-COMPAT-SCENE",
      "Scene integration contracts",
      "Restricted",
      "Scene may consume declarations later; Scene rendering is not owned here.",
    ),
    compat(
      "CERT-COMPAT-STATUS",
      "Stable status meanings",
      "Compatible",
      "Validation status meanings remain stable.",
    ),
    compat(
      "CERT-COMPAT-SEVERITY",
      "Stable severity meanings",
      "Compatible",
      "Severity meanings remain stable.",
    ),
    compat(
      "CERT-COMPAT-SIGNALS",
      "Stable quality-signal meanings",
      "Compatible",
      "Quality-signal meanings remain stable.",
    ),
    compat(
      "CERT-COMPAT-TRUST",
      "Stable trust-level meanings",
      "Compatible",
      "Trust-level meanings remain stable.",
    ),
    compat(
      "CERT-COMPAT-EXTENSION",
      "Additive extension compatibility",
      "Compatible",
      "Extensions remain additive and backward-compatible.",
    ),
    compat(
      "CERT-COMPAT-PUBLIC-API",
      "Public API stability",
      "Compatible",
      "Each DKL-5 phase publishes exactly eight stable public APIs.",
    ),
  ]),
  entryCount: 20,
  runtimeNegotiationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
