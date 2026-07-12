import {
  buildWorkflowValidationManifest,
  getWorkflowValidationEntries,
} from "./workflowValidationManifest.ts";

export const runWorkflowValidation = () => {
  const validationEntries = getWorkflowValidationEntries();
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
    manifest: buildWorkflowValidationManifest(),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

export const getWorkflowValidationStatus = () => runWorkflowValidation().status;

export const getWorkflowValidationSummary = () =>
  Object.freeze({
    totalChecks: runWorkflowValidation().totalChecks,
    passedChecks: runWorkflowValidation().passedChecks,
    failedChecks: runWorkflowValidation().failedChecks,
    status: runWorkflowValidation().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
