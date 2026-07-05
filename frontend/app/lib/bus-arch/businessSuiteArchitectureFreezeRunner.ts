import { runBusinessSuiteArchitectureCertification } from "./businessSuiteArchitectureCertification.ts";
import { buildBusinessSuiteArchitectureFreezeManifest } from "./businessSuiteArchitectureFreezeManifest.ts";
import { runBusinessSuiteArchitectureRegression } from "./businessSuiteArchitectureRegression.ts";
import type { BusinessArchitectureFreeze } from "./businessSuiteArchitectureFreezeTypes.ts";

export function runBusinessSuiteArchitectureFreeze(): BusinessArchitectureFreeze {
  const certification = runBusinessSuiteArchitectureCertification();
  const regression = runBusinessSuiteArchitectureRegression();
  const manifest = buildBusinessSuiteArchitectureFreezeManifest();
  const passed = certification.status === "PASS" && regression.status === "PASS" && manifest.freezeStatus.status === "PASS";

  return Object.freeze({
    freezeId: "bus-arch-freeze",
    status: passed ? "PASS" : "FAIL",
    certificationStatus: passed ? "Certified" : "Not Certified",
    freezeStatus: passed ? "Frozen" : "Not Frozen",
    releaseStatus: passed ? "Released" : "Not Released",
    certifiedPhaseIds: manifest.certifiedPhaseRegistry,
    publicApiCatalog: manifest.publicApiCatalog,
    metadataOnly: true,
    immutable: true,
  });
}

export function getBusinessSuiteArchitectureState(): BusinessArchitectureFreeze {
  return runBusinessSuiteArchitectureFreeze();
}
