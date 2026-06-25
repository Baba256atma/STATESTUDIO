/**
 * INT-5 — Executive Intelligence Platform regression suite.
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EXECUTIVE_INTELLIGENCE_REGRESSION_TEST_FILES,
  type ExecutiveIntelligenceRegressionSuiteResult,
} from "./executiveIntelligencePlatformCertificationContract.ts";

const FRONTEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

export function runExecutiveIntelligenceRegressionSuite(input?: {
  includeBuild?: boolean;
}): ExecutiveIntelligenceRegressionSuiteResult {
  const failures: string[] = [];
  const testFiles: string[] = [];

  for (const relativePath of EXECUTIVE_INTELLIGENCE_REGRESSION_TEST_FILES) {
    const absolutePath = join(FRONTEND_ROOT, relativePath);
    if (!existsSync(absolutePath)) {
      failures.push(`Missing regression test file: ${relativePath}`);
      continue;
    }
    testFiles.push(relativePath);
  }

  let passedTests = 0;
  let failedTests = 0;
  let totalTests = 0;

  if (testFiles.length > 0) {
    const testResult = spawnSync("node", ["--test", ...testFiles], {
      cwd: FRONTEND_ROOT,
      stdio: "pipe",
      encoding: "utf8",
    });
    const output = `${testResult.stdout ?? ""}\n${testResult.stderr ?? ""}`;
    const passMatch = output.match(/ℹ pass (\d+)/);
    const failMatch = output.match(/ℹ fail (\d+)/);
    const totalMatch = output.match(/ℹ tests (\d+)/);
    passedTests = passMatch ? Number(passMatch[1]) : 0;
    failedTests = failMatch ? Number(failMatch[1]) : testResult.status === 0 ? 0 : 1;
    totalTests = totalMatch ? Number(totalMatch[1]) : passedTests + failedTests;
    if (testResult.status !== 0) {
      failures.push("Executive Intelligence regression test suite failed.");
    }
  }

  if (input?.includeBuild !== false) {
    const buildResult = spawnSync("npm", ["run", "build"], {
      cwd: FRONTEND_ROOT,
      stdio: "pipe",
      encoding: "utf8",
    });
    if (buildResult.status !== 0) {
      failures.push("npm run build failed during regression suite.");
    }
  }

  return Object.freeze({
    passed: failures.length === 0 && failedTests === 0,
    totalTests,
    passedTests,
    failedTests,
    testFiles: Object.freeze([...testFiles]),
    failures: Object.freeze(failures),
  });
}
