/**
 * RTC-1:8 — Executive Context Freeze Compatibility.
 *
 * Exactly eight immutable compatibility declarations for the release.
 *
 * Ownership: owned exclusively by RTC-1:8.
 */

/** Compatibility target name. */
export type ExecutiveContextFreezeCompatibilityName =
  | "Executive Journal Runtime"
  | "Executive Timeline Runtime"
  | "Executive Stage Runtime"
  | "Executive Workspace Runtime"
  | "Executive Assistant Runtime"
  | "Director Runtime"
  | "Runtime Context Consumers"
  | "Future RTC Modules";

/** Compatibility declaration. */
export interface ExecutiveContextFreezeCompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly name: ExecutiveContextFreezeCompatibilityName;
  readonly order: number;
  readonly contractLevelOnly: true;
  readonly immutableForRelease: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const compatibility = (
  name: ExecutiveContextFreezeCompatibilityName,
  order: number,
): ExecutiveContextFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `RTC-1:8/Compatibility/${String(order).padStart(2, "0")}`,
    name,
    order,
    contractLevelOnly: true as const,
    immutableForRelease: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight compatibility declarations. */
export const ExecutiveContextFreezeCompatibilityDeclarations = Object.freeze([
  compatibility("Executive Journal Runtime", 1),
  compatibility("Executive Timeline Runtime", 2),
  compatibility("Executive Stage Runtime", 3),
  compatibility("Executive Workspace Runtime", 4),
  compatibility("Executive Assistant Runtime", 5),
  compatibility("Director Runtime", 6),
  compatibility("Runtime Context Consumers", 7),
  compatibility("Future RTC Modules", 8),
] as const);

export const ExecutiveContextFreezeCompatibilityNames = Object.freeze([
  "Executive Journal Runtime",
  "Executive Timeline Runtime",
  "Executive Stage Runtime",
  "Executive Workspace Runtime",
  "Executive Assistant Runtime",
  "Director Runtime",
  "Runtime Context Consumers",
  "Future RTC Modules",
] as const satisfies readonly ExecutiveContextFreezeCompatibilityName[]);

/** Compatibility catalogue. */
export const ExecutiveContextFreezeCompatibility = Object.freeze({
  compatibilityId: "RTC-1:8/CompatibilityCatalog",
  declarations: ExecutiveContextFreezeCompatibilityDeclarations,
  declarationCount: ExecutiveContextFreezeCompatibilityDeclarations.length,
  immutableForRelease: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
