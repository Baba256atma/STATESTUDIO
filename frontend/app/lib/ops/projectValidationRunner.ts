import {
  buildProjectValidationManifest,
  getProjectValidationEntries,
} from "./projectValidationManifest.ts";

export const runProjectValidation = () => {
  const validationEntries = getProjectValidationEntries();
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
    manifest: buildProjectValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getProjectValidationStatus = () => runProjectValidation().status;

export const getProjectValidationSummary = () =>
  Object.freeze({
    totalChecks: runProjectValidation().totalChecks,
    passedChecks: runProjectValidation().passedChecks,
    failedChecks: runProjectValidation().failedChecks,
    status: runProjectValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

