/**
 * DKL-1:4 — Ownership and Dependency Validation domain.
 *
 * Deterministically validates DKL ownership boundaries and dependency rules
 * using the DKL-1:1 public ownership, dependency, and contract metadata.
 * Metadata only — no runtime behavior.
 */

import {
  DataKnowledgeFoundationContracts,
  DataKnowledgeFoundationDependencies,
  DataKnowledgeFoundationOwnership,
} from "./dataKnowledgeFoundation.ts";
import {
  createValidationDomain,
  createValidationRule,
} from "./dataKnowledgeFoundationValidationTypes.ts";

const REQUIRED_OWNED = [
  "knowledge-objects",
  "business-objects",
  "knowledge-relationships",
  "knowledge-metadata",
  "knowledge-identity",
] as const;

const REQUIRED_NOT_OWNED = ["communication", "decision-logic", "visual-components", "user-sessions"] as const;

const REQUIRED_ALLOWED = ["CORE", "CORE-TEN", "BUS", "OPS", "NEA"] as const;

const REQUIRED_FORBIDDEN = [
  "UI",
  "ADVISOR",
  "SCENE",
  "EXTERNAL-APIS",
  "DATABASE-DRIVERS",
  "HTTP-CLIENTS",
  "AI-MODELS",
] as const;

const owns = DataKnowledgeFoundationOwnership.owns as readonly string[];
const neverOwns = DataKnowledgeFoundationOwnership.neverOwns as readonly string[];
const allowed = DataKnowledgeFoundationDependencies.allowed as readonly string[];
const future = DataKnowledgeFoundationDependencies.future as readonly string[];
const forbidden = DataKnowledgeFoundationDependencies.forbidden as readonly string[];
const boundaries = DataKnowledgeFoundationContracts.boundaries as readonly string[];

const ownershipOverlap = owns.filter((asset) => neverOwns.includes(asset));
const dependencyOverlap = allowed.filter((dependency) => forbidden.includes(dependency));

const gatewayAuthenticationNotOwned =
  boundaries.includes("No authentication") && boundaries.includes("No gateway communication");

const channelIntegrationsNotOwned =
  boundaries.includes("No Telegram integration") &&
  boundaries.includes("No WhatsApp integration") &&
  boundaries.includes("No email communication");

const rules = [
  createValidationRule({
    id: "DKL-VAL-O-01",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL owns the required knowledge assets",
    description: "DKL must own knowledge objects, business objects, relationships, metadata, and identity.",
    expected: REQUIRED_OWNED.join(","),
    actual: owns.join(","),
    condition: REQUIRED_OWNED.every((asset) => owns.includes(asset)),
    evidence: { ownedCount: owns.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-02",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL does not own communication, decisions, visuals, or sessions",
    description: "DKL must declare external communication, decision logic, visualization, and user sessions as non-owned.",
    expected: REQUIRED_NOT_OWNED.join(","),
    actual: neverOwns.join(","),
    condition: REQUIRED_NOT_OWNED.every((asset) => neverOwns.includes(asset)),
    evidence: { nonOwnedCount: neverOwns.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-03",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL does not own gateway authentication",
    description: "Gateway authentication must be excluded through the Foundation boundaries.",
    expected: "boundaries exclude authentication and gateway communication",
    actual: String(gatewayAuthenticationNotOwned),
    condition: gatewayAuthenticationNotOwned,
    evidence: { gatewayAuthenticationNotOwned },
  }),
  createValidationRule({
    id: "DKL-VAL-O-04",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "DKL does not own channel integrations",
    description: "Channel integrations must be excluded through the Foundation boundaries.",
    expected: "boundaries exclude Telegram, WhatsApp, and email integrations",
    actual: String(channelIntegrationsNotOwned),
    condition: channelIntegrationsNotOwned,
    evidence: { channelIntegrationsNotOwned },
  }),
  createValidationRule({
    id: "DKL-VAL-O-05",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Allowed dependencies are exact",
    description: "The allowed dependency set must be exactly CORE, CORE-TEN, BUS, OPS, NEA.",
    expected: REQUIRED_ALLOWED.join(","),
    actual: allowed.join(","),
    condition:
      allowed.length === REQUIRED_ALLOWED.length &&
      REQUIRED_ALLOWED.every((dependency, index) => allowed[index] === dependency),
    evidence: { allowedCount: allowed.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-06",
    domain: "ownership",
    severity: "INFO",
    sourcePhase: "DKL-1:1",
    title: "Future dependency is EXECUTIVE-ENGINE",
    description: "The future dependency set must include EXECUTIVE-ENGINE.",
    expected: "EXECUTIVE-ENGINE",
    actual: future.join(","),
    condition: future.includes("EXECUTIVE-ENGINE"),
    evidence: { futureCount: future.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-07",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Forbidden dependencies include all prohibited layers",
    description: "The forbidden dependency set must include UI, ADVISOR, SCENE, external APIs, database drivers, HTTP clients, and AI models.",
    expected: REQUIRED_FORBIDDEN.join(","),
    actual: forbidden.join(","),
    condition: REQUIRED_FORBIDDEN.every((dependency) => forbidden.includes(dependency)),
    evidence: { forbiddenCount: forbidden.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-08",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "No ownership responsibility appears in both inventories",
    description: "The owned and non-owned inventories must be disjoint.",
    expected: "0 overlapping ownership responsibilities",
    actual: String(ownershipOverlap.length),
    condition: ownershipOverlap.length === 0,
    evidence: { overlapCount: ownershipOverlap.length },
  }),
  createValidationRule({
    id: "DKL-VAL-O-09",
    domain: "ownership",
    severity: "ERROR",
    sourcePhase: "DKL-1:1",
    title: "Allowed and forbidden dependencies are disjoint",
    description: "No dependency may be simultaneously allowed and forbidden.",
    expected: "0 overlapping dependencies",
    actual: String(dependencyOverlap.length),
    condition: dependencyOverlap.length === 0,
    evidence: { overlapCount: dependencyOverlap.length },
  }),
];

export const DataKnowledgeFoundationOwnershipValidation = createValidationDomain(
  "ownership",
  "Ownership and Dependency Validation",
  "DKL-1:1",
  rules
);
