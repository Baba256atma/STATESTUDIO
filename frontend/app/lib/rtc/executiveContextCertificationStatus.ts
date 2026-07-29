/**
 * RTC-1:7 — Executive Context Certification Status.
 *
 * Canonical certification states. Only Passed allows progression to Freeze.
 *
 * Ownership: owned exclusively by RTC-1:7.
 */

/** Canonical certification status. */
export type ExecutiveContextCertificationStatusName =
  | "Pending"
  | "Running"
  | "Passed"
  | "PassedWithWarnings"
  | "Failed";

/** Certification status declaration. */
export interface ExecutiveContextCertificationStatusDeclaration {
  readonly statusId: `RTC-1:7/Status/${ExecutiveContextCertificationStatusName}`;
  readonly status: ExecutiveContextCertificationStatusName;
  readonly description: string;
  readonly allowsFreezeProgression: boolean;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const status = (
  name: ExecutiveContextCertificationStatusName,
  description: string,
  allowsFreezeProgression: boolean,
  order: number,
): ExecutiveContextCertificationStatusDeclaration =>
  Object.freeze({
    statusId: `RTC-1:7/Status/${name}` as const,
    status: name,
    description,
    allowsFreezeProgression,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly five certification statuses. */
export const ExecutiveContextCertificationStatuses = Object.freeze([
  status("Pending", "Certification has not started.", false, 1),
  status("Running", "Certification evaluation is in progress.", false, 2),
  status(
    "Passed",
    "Certification passed. Freeze progression is permitted.",
    true,
    3,
  ),
  status(
    "PassedWithWarnings",
    "Certification passed with warnings. Freeze progression is not permitted.",
    false,
    4,
  ),
  status("Failed", "Certification failed. Freeze progression is blocked.", false, 5),
] as const);

export const ExecutiveContextCertificationStatusNames = Object.freeze([
  "Pending",
  "Running",
  "Passed",
  "PassedWithWarnings",
  "Failed",
] as const satisfies readonly ExecutiveContextCertificationStatusName[]);

/** Only Passed allows Freeze. */
export const ExecutiveContextFreezeProgressionStatus = "Passed" as const;
