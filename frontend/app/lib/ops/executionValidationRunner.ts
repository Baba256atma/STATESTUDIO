import {
  buildExecutionValidationManifest,
  getExecutionValidationEntries,
} from "./executionValidationManifest.ts";

export const runExecutionValidation = () => {
  const validationEntries = getExecutionValidationEntries();
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
    manifest: buildExecutionValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getExecutionValidationStatus = () =>
  runExecutionValidation().status;

export const getExecutionValidationSummary = () =>
  Object.freeze({
    totalChecks: runExecutionValidation().totalChecks,
    passedChecks: runExecutionValidation().passedChecks,
    failedChecks: runExecutionValidation().failedChecks,
    status: runExecutionValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
