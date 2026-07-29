/**
 * EX-1:4 — Executive Stage Validation Severity.
 *
 * Four canonical severity levels. Only Error and Critical prevent rendering.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

/** Canonical validation severity levels. */
export type ExecutiveStageValidationSeverityLevel =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

/** Severity declaration. */
export interface ExecutiveStageValidationSeverityDeclaration {
  readonly severityId: `EX-1:4/Severity/${ExecutiveStageValidationSeverityLevel}`;
  readonly level: ExecutiveStageValidationSeverityLevel;
  readonly description: string;
  readonly preventsRendering: boolean;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const severity = (
  level: ExecutiveStageValidationSeverityLevel,
  description: string,
  preventsRendering: boolean,
  order: number,
): ExecutiveStageValidationSeverityDeclaration =>
  Object.freeze({
    severityId: `EX-1:4/Severity/${level}` as const,
    level,
    description,
    preventsRendering,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Ordered severity catalogue. */
export const ExecutiveStageValidationSeverities = Object.freeze([
  severity("Info", "Informational validation observation.", false, 1),
  severity("Warning", "Non-blocking validation concern.", false, 2),
  severity(
    "Error",
    "Blocking validation failure. Prevents rendering.",
    true,
    3,
  ),
  severity(
    "Critical",
    "Critical validation failure. Prevents rendering.",
    true,
    4,
  ),
] as const);

export const ExecutiveStageValidationSeverityNames = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveStageValidationSeverityLevel[]);

/** Severity levels that prevent rendering. */
export const ExecutiveStageRenderingBlockingSeverities = Object.freeze([
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveStageValidationSeverityLevel[]);
