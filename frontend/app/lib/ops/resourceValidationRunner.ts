import {
  buildResourceValidationManifest,
  getResourceValidationEntries,
} from "./resourceValidationManifest.ts";

export const runResourceValidation = () => {
  const validationEntries = getResourceValidationEntries();
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
    manifest: buildResourceValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getResourceValidationStatus = () => runResourceValidation().status;

export const getResourceValidationSummary = () =>
  Object.freeze({
    totalChecks: runResourceValidation().totalChecks,
    passedChecks: runResourceValidation().passedChecks,
    failedChecks: runResourceValidation().failedChecks,
    status: runResourceValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
