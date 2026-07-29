/**
 * EX-1:8 — Executive Stage Compatibility.
 *
 * Compatibility declarations and Runtime compatibility baseline.
 * Declarative and versioned — no Runtime implementation embedded.
 *
 * Ownership: owned exclusively by EX-1:8.
 */

/** Compatibility target name. */
export type ExecutiveStageFreezeCompatibilityName =
  | "RTC-1 Executive Context Runtime"
  | "EX-2 Executive Journal"
  | "EX-3 Executive Timeline"
  | "EX-4 Executive Interaction"
  | "Workspace Layer"
  | "Assistant Layer"
  | "Director Layer"
  | "EVE Visualization Layer";

/** Compatibility declaration. */
export interface ExecutiveStageFreezeCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly name: ExecutiveStageFreezeCompatibilityName;
  readonly order: number;
  readonly contractLevelOnly: true;
  readonly immutableForRelease: true;
  readonly versioned: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  name: ExecutiveStageFreezeCompatibilityName,
  order: number,
): ExecutiveStageFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EX-1:8/Compatibility/${String(order).padStart(2, "0")}`,
    name,
    order,
    contractLevelOnly: true as const,
    immutableForRelease: true as const,
    versioned: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight compatibility declarations. */
export const ExecutiveStageFreezeCompatibilityDeclarations = Object.freeze([
  compatibility("RTC-1 Executive Context Runtime", 1),
  compatibility("EX-2 Executive Journal", 2),
  compatibility("EX-3 Executive Timeline", 3),
  compatibility("EX-4 Executive Interaction", 4),
  compatibility("Workspace Layer", 5),
  compatibility("Assistant Layer", 6),
  compatibility("Director Layer", 7),
  compatibility("EVE Visualization Layer", 8),
] as const);

export const ExecutiveStageFreezeCompatibilityNames = Object.freeze([
  "RTC-1 Executive Context Runtime",
  "EX-2 Executive Journal",
  "EX-3 Executive Timeline",
  "EX-4 Executive Interaction",
  "Workspace Layer",
  "Assistant Layer",
  "Director Layer",
  "EVE Visualization Layer",
] as const satisfies readonly ExecutiveStageFreezeCompatibilityName[]);

/** Runtime compatibility baseline — no Runtime implementation embedded. */
export const ExecutiveStageRuntimeCompatibilityBaseline = Object.freeze({
  baselineId: "EX-1:8/RuntimeCompatibilityBaseline",
  checks: Object.freeze([
    "Executive Context Runtime Public Index",
    "Runtime lifecycle",
    "Runtime context model",
    "Runtime focus model",
    "Runtime update pipeline",
  ] as const),
  checkCount: 5 as const,
  embedsRuntimeImplementation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Compatibility catalogue. */
export const ExecutiveStageFreezeCompatibility = Object.freeze({
  compatibilityId: "EX-1:8/CompatibilityCatalog",
  declarations: ExecutiveStageFreezeCompatibilityDeclarations,
  declarationCount: ExecutiveStageFreezeCompatibilityDeclarations.length,
  names: ExecutiveStageFreezeCompatibilityNames,
  runtimeCompatibility: ExecutiveStageRuntimeCompatibilityBaseline,
  immutableForRelease: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
