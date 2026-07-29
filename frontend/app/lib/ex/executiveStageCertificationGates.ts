/**
 * EX-1:7 — Executive Stage Certification Gates.
 *
 * Exactly sixteen deterministic certification gates.
 * Each gate must pass.
 *
 * Ownership: owned exclusively by EX-1:7.
 */

import type { ExecutiveStageCertificationDomainName } from "./executiveStageCertificationDomains.ts";

/** Canonical certification gate name. */
export type ExecutiveStageCertificationGateName =
  | "Architecture Gate"
  | "Identity Gate"
  | "Registry Gate"
  | "Model Gate"
  | "Validation Gate"
  | "Manifest Gate"
  | "Platform Gate"
  | "Runtime Gate"
  | "Dependency Gate"
  | "API Gate"
  | "Quality Gate"
  | "Test Gate"
  | "TypeScript Gate"
  | "ESLint Gate"
  | "Compatibility Gate"
  | "Release Gate";

/** Certification gate declaration. */
export interface ExecutiveStageCertificationGateDeclaration {
  readonly gateId: string;
  readonly gateName: ExecutiveStageCertificationGateName;
  readonly description: string;
  readonly domain: ExecutiveStageCertificationDomainName;
  readonly order: number;
  readonly deterministic: true;
  readonly modifiesPlatform: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  gateName: ExecutiveStageCertificationGateName,
  domain: ExecutiveStageCertificationDomainName,
  description: string,
  order: number,
): ExecutiveStageCertificationGateDeclaration =>
  Object.freeze({
    gateId: `EX-1:7/Gate/${String(order).padStart(2, "0")}`,
    gateName,
    description,
    domain,
    order,
    deterministic: true as const,
    modifiesPlatform: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly sixteen certification gates. */
export const ExecutiveStageCertificationGates = Object.freeze([
  gate(
    "Architecture Gate",
    "Architecture",
    "Canonical Stage architecture and phase ordering are verified.",
    1,
  ),
  gate(
    "Identity Gate",
    "Identity",
    "Canonical Stage identifiers and namespace consistency are verified.",
    2,
  ),
  gate(
    "Registry Gate",
    "Registry",
    "Stage Registry completeness and layer ordering are verified.",
    3,
  ),
  gate(
    "Model Gate",
    "Model",
    "Stage Model consistency and ownership hierarchy are verified.",
    4,
  ),
  gate(
    "Validation Gate",
    "Validation",
    "Stage Validation baseline and categories are verified.",
    5,
  ),
  gate(
    "Manifest Gate",
    "Manifest",
    "Stage Manifest completeness and declarations are verified.",
    6,
  ),
  gate(
    "Platform Gate",
    "Platform",
    "Stage Platform services, lifecycle, and events are verified.",
    7,
  ),
  gate(
    "Runtime Gate",
    "Runtime Compatibility",
    "Runtime Public Index compatibility is verified without execution.",
    8,
  ),
  gate(
    "Dependency Gate",
    "Dependencies",
    "Approved upstream imports and isolation rules are verified.",
    9,
  ),
  gate(
    "API Gate",
    "Public API",
    "Stable public Platform API surface is verified.",
    10,
  ),
  gate(
    "Quality Gate",
    "Quality",
    "Quality gate catalogue completeness is verified.",
    11,
  ),
  gate(
    "Test Gate",
    "Quality",
    "Unit and architecture tests are verified.",
    12,
  ),
  gate(
    "TypeScript Gate",
    "Quality",
    "Strict TypeScript compilation is verified.",
    13,
  ),
  gate(
    "ESLint Gate",
    "Quality",
    "ESLint compliance with zero warnings is verified.",
    14,
  ),
  gate(
    "Compatibility Gate",
    "Runtime Compatibility",
    "Runtime compatibility checks are verified.",
    15,
  ),
  gate(
    "Release Gate",
    "Release Readiness",
    "Stage is certified and ready for Freeze progression.",
    16,
  ),
] as const);

export const ExecutiveStageCertificationGateNames = Object.freeze([
  "Architecture Gate",
  "Identity Gate",
  "Registry Gate",
  "Model Gate",
  "Validation Gate",
  "Manifest Gate",
  "Platform Gate",
  "Runtime Gate",
  "Dependency Gate",
  "API Gate",
  "Quality Gate",
  "Test Gate",
  "TypeScript Gate",
  "ESLint Gate",
  "Compatibility Gate",
  "Release Gate",
] as const satisfies readonly ExecutiveStageCertificationGateName[]);
