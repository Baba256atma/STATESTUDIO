import {
  buildSchedulingValidationManifest,
  getSchedulingValidationEntries,
} from "./schedulingValidationManifest.ts";

export const runSchedulingValidation = () => {
  const validationEntries = getSchedulingValidationEntries();
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
    manifest: buildSchedulingValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getSchedulingValidationStatus = () => runSchedulingValidation().status;

export const getSchedulingValidationSummary = () =>
  Object.freeze({
    totalChecks: runSchedulingValidation().totalChecks,
    passedChecks: runSchedulingValidation().passedChecks,
    failedChecks: runSchedulingValidation().failedChecks,
    status: runSchedulingValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
