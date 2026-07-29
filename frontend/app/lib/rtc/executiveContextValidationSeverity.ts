/**
 * RTC-1:4 — Executive Context Validation Severity.
 *
 * Four canonical severity levels. Only Error and Critical prevent activation.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

/** Canonical validation severity levels. */
export type ExecutiveContextValidationSeverityLevel =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

/** Severity declaration. */
export interface ExecutiveContextValidationSeverityDeclaration {
  readonly severityId: `RTC-1:4/Severity/${ExecutiveContextValidationSeverityLevel}`;
  readonly level: ExecutiveContextValidationSeverityLevel;
  readonly description: string;
  readonly preventsActivation: boolean;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const severity = (
  level: ExecutiveContextValidationSeverityLevel,
  description: string,
  preventsActivation: boolean,
  order: number,
): ExecutiveContextValidationSeverityDeclaration =>
  Object.freeze({
    severityId: `RTC-1:4/Severity/${level}` as const,
    level,
    description,
    preventsActivation,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Ordered severity catalogue. */
export const ExecutiveContextValidationSeverities = Object.freeze([
  severity("Info", "Informational validation observation.", false, 1),
  severity("Warning", "Non-blocking validation concern.", false, 2),
  severity(
    "Error",
    "Blocking validation failure. Prevents activation.",
    true,
    3,
  ),
  severity(
    "Critical",
    "Critical validation failure. Prevents activation.",
    true,
    4,
  ),
] as const);

export const ExecutiveContextValidationSeverityNames = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveContextValidationSeverityLevel[]);

/** Severity levels that prevent activation. */
export const ExecutiveContextActivationBlockingSeverities = Object.freeze([
  "Error",
  "Critical",
] as const satisfies readonly ExecutiveContextValidationSeverityLevel[]);
