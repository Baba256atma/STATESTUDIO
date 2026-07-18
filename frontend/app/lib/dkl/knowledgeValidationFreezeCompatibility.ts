/**
 * DKL-5:8 — Knowledge Validation Freeze Compatibility.
 *
 * Immutable compatibility protections for the frozen release candidate.
 * Metadata only. No runtime version negotiation.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import type { FreezeCompatibilityEntry } from "./knowledgeValidationFreezeTypes.ts";

const compat = (
  compatibilityId: string,
  subject: string,
  target: string,
  status: FreezeCompatibilityEntry["status"],
  description: string,
): FreezeCompatibilityEntry =>
  Object.freeze({ compatibilityId, subject, target, status, description });

const ENTRIES: readonly FreezeCompatibilityEntry[] = Object.freeze([
  compat("FREEZE-COMPAT-DKL4", "DKL-4 Knowledge Modeling Public Index", "DKL-4", "Protected", "DKL-4 remains upstream-reference only through approved public-index path."),
  compat("FREEZE-COMPAT-FND", "DKL-5:1 Foundation", "DKL-5:1", "Frozen", "Foundation architecture is frozen by reference."),
  compat("FREEZE-COMPAT-REG", "DKL-5:2 Registry", "DKL-5:2", "Frozen", "Registry architecture is frozen by reference."),
  compat("FREEZE-COMPAT-MDL", "DKL-5:3 Model", "DKL-5:3", "Frozen", "Model architecture is frozen by reference."),
  compat("FREEZE-COMPAT-VAL", "DKL-5:4 Validation", "DKL-5:4", "Frozen", "Validation architecture is frozen by reference."),
  compat("FREEZE-COMPAT-MNF", "DKL-5:5 Manifest", "DKL-5:5", "Frozen", "Manifest architecture is frozen by reference."),
  compat("FREEZE-COMPAT-PLT", "DKL-5:6 Platform", "DKL-5:6", "Frozen", "Platform composition is frozen by reference."),
  compat("FREEZE-COMPAT-CERT", "DKL-5:7 Certification", "DKL-5:7", "Frozen", "Certification result is frozen."),
  compat("FREEZE-COMPAT-PUBLIC-INDEX", "DKL-5:9 Public Index forward consumption", "DKL-5:9", "AdditiveOnly", "Frozen architecture is intended for Public Index publication."),
  compat("FREEZE-COMPAT-REPOSITORY", "Future Knowledge Repository", "Future", "Protected", "Frozen metadata may be consumed by future repository layers."),
  compat("FREEZE-COMPAT-SERVICES", "Future Knowledge Services", "Future", "Protected", "Frozen metadata may be consumed by future knowledge services."),
  compat("FREEZE-COMPAT-ENGINE", "Executive Engine restricted consumption", "Engine", "BreakingChangeForbidden", "Engine may consume frozen metadata only; no runtime APIs exist."),
  compat("FREEZE-COMPAT-ADVISOR", "Advisor integration contracts", "Advisor", "Protected", "Advisor may consume declarations later; Advisor behavior is not owned here."),
  compat("FREEZE-COMPAT-SCENE", "Scene integration contracts", "Scene", "Protected", "Scene may consume declarations later; Scene rendering is not owned here."),
  compat("FREEZE-COMPAT-STATUS", "Status meaning stability", "Status", "Frozen", "Validation status meanings remain stable."),
  compat("FREEZE-COMPAT-SEVERITY", "Severity meaning stability", "Severity", "Frozen", "Severity meanings remain stable."),
  compat("FREEZE-COMPAT-SIGNALS", "Quality-signal meaning stability", "QualitySignal", "Frozen", "Quality-signal meanings remain stable."),
  compat("FREEZE-COMPAT-TRUST", "Trust-level meaning stability", "TrustLevel", "Frozen", "Trust-level meanings remain stable."),
  compat("FREEZE-COMPAT-EVIDENCE", "Evidence meaning stability", "Evidence", "Frozen", "Evidence meanings remain stable."),
  compat("FREEZE-COMPAT-CONSUMER", "Consumer-readiness meaning stability", "ConsumerReadiness", "Frozen", "Consumer-readiness meanings remain stable."),
  compat("FREEZE-COMPAT-EXECUTIVE", "Executive-usability meaning stability", "ExecutiveUsability", "Frozen", "Executive-usability meanings remain stable."),
  compat("FREEZE-COMPAT-OWNERSHIP", "Ownership stability", "Ownership", "BreakingChangeForbidden", "Ownership boundaries remain stable."),
  compat("FREEZE-COMPAT-DEPENDENCY", "Dependency stability", "Dependency", "BreakingChangeForbidden", "Dependency boundaries remain stable."),
  compat("FREEZE-COMPAT-PUBLIC-API", "Public API stability", "PublicAPI", "BreakingChangeForbidden", "Public API surfaces remain stable."),
  compat("FREEZE-COMPAT-RUNTIME", "Runtime-prohibition stability", "RuntimeProhibition", "BreakingChangeForbidden", "Runtime organizational validation remains prohibited."),
  compat("FREEZE-COMPAT-SCORING", "Scoring-prohibition stability", "ScoringProhibition", "BreakingChangeForbidden", "Numeric scoring remains prohibited."),
  compat("FREEZE-COMPAT-TRUST-CALC", "Trust-calculation-prohibition stability", "TrustCalculationProhibition", "BreakingChangeForbidden", "Trust calculation remains prohibited."),
  compat("FREEZE-COMPAT-CLEANSING", "Cleansing-prohibition stability", "CleansingProhibition", "BreakingChangeForbidden", "Cleansing remains prohibited."),
  compat("FREEZE-COMPAT-REMEDIATION", "Remediation-prohibition stability", "RemediationProhibition", "BreakingChangeForbidden", "Remediation remains prohibited."),
  compat("FREEZE-COMPAT-SCHEMA", "Metadata-schema stability", "MetadataSchema", "Frozen", "Metadata schemas remain stable."),
  compat("FREEZE-COMPAT-EXTENSION", "Additive extension compatibility", "Extension", "AdditiveOnly", "Extensions remain additive and backward-compatible."),
]);

/** Canonical immutable Freeze compatibility protections. */
export const KnowledgeValidationFreezeCompatibility = Object.freeze({
  compatibilityId: "DKL-5:8/FreezeCompatibility",
  sourcePhase: "DKL-5:8" as const,
  owner: "DKL-5 Knowledge Validation Freeze",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  subjects: Object.freeze(ENTRIES.map((entry) => entry.subject)),
  runtimeNegotiationForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
