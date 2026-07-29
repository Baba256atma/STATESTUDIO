/**
 * EX-1:7 — Executive Stage Certification Result.
 *
 * Immutable certification result model and status vocabulary.
 * Only Certified may continue to Freeze.
 *
 * Ownership: owned exclusively by EX-1:7.
 */

/** Canonical certification status. */
export type ExecutiveStageCertificationStatusName =
  | "Pending"
  | "Running"
  | "Passed"
  | "Failed"
  | "Certified";

/** Certification result field declaration. */
export interface ExecutiveStageCertificationResultField {
  readonly fieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: true;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const resultField = (
  fieldName: string,
  description: string,
  order: number,
): ExecutiveStageCertificationResultField =>
  Object.freeze({
    fieldId: `EX-1:7/CertificationResult/Field/${fieldName}`,
    fieldName,
    description,
    required: true as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Structured CertificationResult model — seven sections.
 * Identity, Status, Certified Domains, Warnings, Errors, Timestamp, Platform Version.
 */
export const ExecutiveStageCertificationResultModel = Object.freeze({
  resultModelId: "EX-1:7/CertificationResult" as const,
  fields: Object.freeze([
    resultField("identity", "Certification result identity.", 1),
    resultField("status", "Overall certification status.", 2),
    resultField("certifiedDomains", "Domains that passed certification.", 3),
    resultField("warnings", "Non-blocking warning collection.", 4),
    resultField("errors", "Blocking error collection.", 5),
    resultField("timestamp", "Immutable evaluation timestamp metadata.", 6),
    resultField("platformVersion", "Certified Platform version metadata.", 7),
  ]),
  fieldCount: 7,
  immutableResults: true as const,
  archivedForReleaseTraceability: true as const,
  modifiesPlatform: false as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Certification status declaration. */
export interface ExecutiveStageCertificationStatusDeclaration {
  readonly statusId: `EX-1:7/Status/${ExecutiveStageCertificationStatusName}`;
  readonly status: ExecutiveStageCertificationStatusName;
  readonly description: string;
  readonly allowsFreezeProgression: boolean;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const status = (
  name: ExecutiveStageCertificationStatusName,
  description: string,
  allowsFreezeProgression: boolean,
  order: number,
): ExecutiveStageCertificationStatusDeclaration =>
  Object.freeze({
    statusId: `EX-1:7/Status/${name}` as const,
    status: name,
    description,
    allowsFreezeProgression,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly five certification statuses. */
export const ExecutiveStageCertificationStatuses = Object.freeze([
  status("Pending", "Certification has not started.", false, 1),
  status("Running", "Certification evaluation is in progress.", false, 2),
  status(
    "Passed",
    "Domain evaluation passed. Awaiting Certified release status.",
    false,
    3,
  ),
  status(
    "Failed",
    "Certification failed. Freeze progression is blocked.",
    false,
    4,
  ),
  status(
    "Certified",
    "Certification complete. Freeze progression is permitted.",
    true,
    5,
  ),
] as const);

export const ExecutiveStageCertificationStatusNames = Object.freeze([
  "Pending",
  "Running",
  "Passed",
  "Failed",
  "Certified",
] as const satisfies readonly ExecutiveStageCertificationStatusName[]);

/** Only Certified allows Freeze. */
export const ExecutiveStageFreezeProgressionStatus = "Certified" as const;
