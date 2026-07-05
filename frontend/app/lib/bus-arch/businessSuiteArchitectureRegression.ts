import { validateBusinessSuiteApiPolicy } from "./businessSuiteApiPolicyIndex.ts";
import { validateBusinessSuiteArchitecture } from "./businessSuiteArchitectureIndex.ts";
import { validateBusinessSuiteBoundary } from "./businessSuiteBoundaryIndex.ts";
import { validateBusinessSuiteDependencyMap } from "./businessSuiteDependencyIndex.ts";
import { validateBusinessSuiteRoadmap } from "./businessSuiteRoadmapIndex.ts";
import type { BusinessArchitectureRegression } from "./businessSuiteArchitectureFreezeTypes.ts";

export function runBusinessSuiteArchitectureRegression(): BusinessArchitectureRegression {
  const phaseResults = Object.freeze([
    `BUS-ARCH-1:${validateBusinessSuiteArchitecture().valid ? "PASS" : "FAIL"}`,
    `BUS-ARCH-2:${validateBusinessSuiteBoundary().valid ? "PASS" : "FAIL"}`,
    `BUS-ARCH-3:${validateBusinessSuiteDependencyMap().valid ? "PASS" : "FAIL"}`,
    `BUS-ARCH-4:${validateBusinessSuiteApiPolicy().valid ? "PASS" : "FAIL"}`,
    `BUS-ARCH-5:${validateBusinessSuiteRoadmap().valid ? "PASS" : "FAIL"}`,
  ]);
  const diagnostics = phaseResults.filter((result) => result.endsWith("FAIL"));

  return Object.freeze({
    regressionId: "bus-arch-regression",
    status: diagnostics.length === 0 ? "PASS" : "FAIL",
    phaseResults,
    diagnostics: Object.freeze(diagnostics),
    metadataOnly: true,
    immutable: true,
  });
}
