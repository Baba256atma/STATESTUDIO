import {
  buildTaskValidationManifest,
  getTaskValidationEntries,
} from "./taskValidationManifest.ts";

export const runTaskValidation = () => {
  const validationEntries = getTaskValidationEntries();
  const passedChecks = validationEntries.filter(
    (entry) => entry.status === "PASS",
  ).length;
  const failedChecks = validationEntries.length - passedChecks;

  return Object.freeze({
    totalChecks: validationEntries.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    validationEntries,
    manifest: buildTaskValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getTaskValidationStatus = () => runTaskValidation().status;

export const getTaskValidationSummary = () =>
  Object.freeze({
    totalChecks: runTaskValidation().totalChecks,
    passedChecks: runTaskValidation().passedChecks,
    failedChecks: runTaskValidation().failedChecks,
    status: runTaskValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
