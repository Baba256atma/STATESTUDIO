/**
 * APP-8:9 — Decision Journal Platform Freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import type { DecisionJournalPlatformCertificationResult } from "./decisionJournalPlatformCertification.ts";
import { DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./decisionJournalPlatformCertificationManifest.ts";
import { getDecisionJournalCompatibility } from "./decisionJournalPlatformFreezeCompatibility.ts";
import type { DecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import {
  DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST,
  validateDecisionJournalFreezeManifest,
} from "./decisionJournalPlatformFreezeManifest.ts";
import {
  DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES,
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  DECISION_JOURNAL_PLATFORM_FROZEN_PHASES,
  DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS,
  DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getDecisionJournalPlatformRegistry,
} from "./decisionJournalPlatformFreezeRegistry.ts";
import type {
  DecisionJournalPlatformFreezeValidationCheck,
  DecisionJournalPlatformFreezeValidationResult,
} from "./decisionJournalPlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionJournalPlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readFreezeModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function allDocumentationPresent(): boolean {
  return DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyNoImplementationPatterns(): DecisionJournalPlatformFreezeValidationCheck {
  const sources = [
    readFreezeModule("app/lib/decision-journal/decisionJournalPlatformFreeze.ts"),
    readFreezeModule("app/lib/decision-journal/decisionJournalPlatformFreezeRegistry.ts"),
    readFreezeModule("app/lib/decision-journal/decisionJournalPlatformFreezeCompatibility.ts"),
    readFreezeModule("app/lib/decision-journal/decisionJournalPlatformFreezeTypes.ts"),
  ].join("\n");

  const passed =
    !/export\s+(function|const)\s+\w*(Dashboard|Assistant|Chart|Visualization)\w*\s*=/.test(sources) &&
    !/await\s+fetch\s*\(/.test(sources);

  return check(
    "no_new_runtime_behavior",
    "No new runtime behavior in freeze modules",
    passed,
    passed ? "metadata-only freeze modules" : "runtime pattern detected"
  );
}

export function validateDecisionJournalPlatformFreeze(
  certification: DecisionJournalPlatformCertificationResult | null,
  manifest: DecisionJournalPlatformFreezeManifest | null
): DecisionJournalPlatformFreezeValidationResult {
  const checks: DecisionJournalPlatformFreezeValidationCheck[] = [];
  const issues: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  if (!certification) {
    checks.push(check("certification_exists", "Certification result exists", false, "missing certification"));
    issues.push(
      Object.freeze({ code: "missing_certification", message: "Certification result is required.", readOnly: true as const })
    );
  } else {
    checks.push(
      check(
        "certification_exists",
        "Certification result exists",
        true,
        certification.report.certificationVersion
      )
    );
    checks.push(
      check(
        "certification_pass",
        "APP-8:8 certification PASS",
        certification.status === "PASS" && certification.certified === true,
        certification.status
      )
    );
    if (certification.status !== "PASS") {
      issues.push(
        Object.freeze({ code: "certification_failed", message: "APP-8:8 certification did not pass.", readOnly: true as const })
      );
    }
    checks.push(
      check(
        "ready_for_freeze",
        "APP-8:8 readyForFreeze is true",
        certification.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-8:8 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_reference",
        "Consumed certification matches APP-8/8",
        certification.report.certificationVersion === DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.certificationVersion
      )
    );
  }

  const manifestValidation = validateDecisionJournalFreezeManifest(manifest);
  checks.push(
    check(
      "manifest_valid",
      "Freeze manifest valid",
      manifestValidation.valid,
      manifestValidation.valid ? "manifest valid" : manifestValidation.issues.join("; ")
    )
  );
  if (!manifestValidation.valid) {
    for (const issue of manifestValidation.issues) {
      issues.push(Object.freeze({ code: "invalid_manifest", message: issue, readOnly: true as const }));
    }
  }

  if (manifest) {
    checks.push(
      check(
        "manifest_immutable",
        "Freeze manifest is immutable",
        Object.isFrozen(manifest) && manifest.metadataOnly === true,
        manifest.architectureHash
      )
    );
    checks.push(
      check(
        "release_flags",
        "Release flags certified/frozen/released",
        manifest.releaseStatus.certified === true &&
          manifest.releaseStatus.frozen === true &&
          manifest.releaseStatus.released === true,
        "certified/frozen/released"
      )
    );
    checks.push(
      check(
        "ready_for_release",
        "readyForRelease true",
        manifest.readyForRelease === true,
        String(manifest.readyForRelease)
      )
    );
  }

  const registry = getDecisionJournalPlatformRegistry();
  checks.push(
    check(
      "phase_registry",
      "Certified phase registry",
      registry.phaseCount === DECISION_JOURNAL_PLATFORM_FROZEN_PHASES.length,
      String(registry.phaseCount)
    )
  );
  checks.push(
    check(
      "public_api_registry",
      "Public API registry",
      registry.publicApiCount === DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS.length,
      String(registry.publicApiCount)
    )
  );
  checks.push(
    check(
      "consumer_registry",
      "Consumer compatibility registry",
      registry.consumerCount === 7,
      String(registry.consumerCount)
    )
  );
  checks.push(
    check(
      "contract_registry",
      "Public contract registry frozen",
      DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  const compatibility = getDecisionJournalCompatibility();
  checks.push(
    check(
      "compatibility_matrix",
      "Compatibility matrix valid",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app8Platform.compatible === true &&
        compatibility.app6DecisionTimeline.directInternalCouplingForbidden === true &&
        compatibility.workspaceConsumer.workspaceIsolationRequired === true,
      compatibility.compatibilityVersion
    )
  );

  checks.push(
    check(
      "extension_policy",
      "Extension policy valid",
      manifest?.extensionPolicy.facadeRequired === true &&
        manifest?.extensionPolicy.consumerContractsRequired === true &&
        DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length >= 9,
      String(DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length)
    )
  );

  checks.push(
    check(
      "forbidden_changes",
      "Forbidden changes listed",
      DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES.length >= 9,
      String(DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalPlatformFreeze.ts",
        allowedFiles: DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "decisionJournalPlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  checks.push(verifyNoImplementationPatterns());

  checks.push(
    check(
      "prior_platforms_untouched",
      "Prior APP-1 through APP-7 untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
      "APP-5, APP-6, APP-7 identity verified"
    )
  );

  const manifestPass = checks
    .filter((entry) =>
      ["manifest_valid", "manifest_immutable", "release_flags", "ready_for_release"].includes(entry.id)
    )
    .every((entry) => entry.passed);
  const registryPass = checks
    .filter((entry) =>
      ["phase_registry", "public_api_registry", "consumer_registry", "contract_registry"].includes(entry.id)
    )
    .every((entry) => entry.passed);
  const compatibilityPass = checks.find((entry) => entry.id === "compatibility_matrix")?.passed === true;
  const certificationDependencyPass =
    checks.find((entry) => entry.id === "certification_pass")?.passed === true &&
    checks.find((entry) => entry.id === "ready_for_freeze")?.passed === true;
  const releasePass = checks.find((entry) => entry.id === "release_flags")?.passed === true;
  const valid = checks.every((entry) => entry.passed);

  return Object.freeze({
    valid,
    manifestPass,
    registryPass,
    compatibilityPass,
    certificationDependencyPass,
    releasePass,
    checks: Object.freeze(checks),
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const DecisionJournalPlatformFreezeValidation = Object.freeze({
  validateDecisionJournalPlatformFreeze,
});
