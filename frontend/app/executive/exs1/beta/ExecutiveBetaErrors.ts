/**
 * Phase E — Single executive error language + recovery actions.
 */

export type ExecutiveErrorCode =
  | "ValidationFailed"
  | "ConnectorFailed"
  | "MappingConflict"
  | "SimulationFailed"
  | "RuntimeConflict"
  | "MissingMetadata";

export type ExecutiveRecoveryAction =
  | "Retry"
  | "Resume"
  | "Cancel"
  | "Review"
  | "Continue Later";

export type ExecutiveError = {
  readonly code: ExecutiveErrorCode;
  readonly title: string;
  readonly message: string;
  readonly recovery: readonly ExecutiveRecoveryAction[];
  readonly at: number;
};

const LANGUAGE: Record<
  ExecutiveErrorCode,
  { title: string; message: string; recovery: readonly ExecutiveRecoveryAction[] }
> = {
  ValidationFailed: {
    title: "Validation Needs Attention",
    message:
      "Executive validation found issues that must be reviewed before continuing.",
    recovery: ["Review", "Retry", "Cancel"],
  },
  ConnectorFailed: {
    title: "Connector Could Not Complete",
    message:
      "The enterprise connector did not finish intake. Review the source and try again.",
    recovery: ["Retry", "Review", "Continue Later"],
  },
  MappingConflict: {
    title: "Mapping Conflict",
    message:
      "A field mapping conflicts with existing Metadata. Confirm mappings before publish.",
    recovery: ["Review", "Resume", "Cancel"],
  },
  SimulationFailed: {
    title: "Simulation Could Not Finish",
    message:
      "The scenario simulation did not complete. Assumptions remain unchanged; Runtime is safe.",
    recovery: ["Retry", "Review", "Continue Later"],
  },
  RuntimeConflict: {
    title: "Runtime Conflict",
    message:
      "Runtime could not apply the requested change consistently. Review Pack and Mode, then resume.",
    recovery: ["Review", "Resume", "Cancel"],
  },
  MissingMetadata: {
    title: "Metadata Incomplete",
    message:
      "An Executive Object is missing Metadata. Resolve meaning before relying on Intelligence.",
    recovery: ["Review", "Continue Later", "Cancel"],
  },
};

export function createExecutiveError(
  code: ExecutiveErrorCode,
  detail?: string,
): ExecutiveError {
  const base = LANGUAGE[code];
  return {
    code,
    title: base.title,
    message: detail ? `${base.message} ${detail}` : base.message,
    recovery: base.recovery,
    at: Date.now(),
  };
}
