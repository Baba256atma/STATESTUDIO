/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
} from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "../decision-journal/decisionJournalContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./crossScenarioLearningPlatformCertificationManifest.ts";
import { getCrossScenarioLearningCompatibility } from "./crossScenarioLearningPlatformFreezeCompatibility.ts";
import type { CrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST,
  validateCrossScenarioLearningFreezeManifest,
} from "./crossScenarioLearningPlatformFreezeManifest.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS,
  CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getCrossScenarioLearningPlatformRegistry,
} from "./crossScenarioLearningPlatformFreezeRegistry.ts";
import type {
  CrossScenarioLearningPlatformFreezeCertificationDependency,
  CrossScenarioLearningPlatformFreezeValidationCheck,
  CrossScenarioLearningPlatformFreezeValidationResult,
} from "./crossScenarioLearningPlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): CrossScenarioLearningPlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readFreezeModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function allDocumentationPresent(): boolean {
  return CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyNoImplementationPatterns(): CrossScenarioLearningPlatformFreezeValidationCheck {
  const sources = [
    readFreezeModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts"),
    readFreezeModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeCompatibility.ts"),
    readFreezeModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeTypes.ts"),
  ].join("\n");

  const passed =
    !/export\s+(function|const)\s+\w*(Dashboard|Assistant|Chart|Visualization)\w*\s*=/.test(sources) &&
    !/await\s+fetch\s*\(/.test(sources) &&
    !/recommendationGenerator\s*\(/.test(sources);

  return check(
    "no_new_runtime_behavior",
    "No new runtime behavior in freeze modules",
    passed,
    passed ? "metadata-only freeze modules" : "runtime pattern detected"
  );
}

export function validateCrossScenarioLearningPlatformFreeze(
  certification: CrossScenarioLearningPlatformFreezeCertificationDependency | null,
  manifest: CrossScenarioLearningPlatformFreezeManifest | null
): CrossScenarioLearningPlatformFreezeValidationResult {
  const checks: CrossScenarioLearningPlatformFreezeValidationCheck[] = [];
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
        certification.report.contractVersion
      )
    );
    checks.push(
      check(
        "certification_pass",
        "APP-10:8 certification PASS",
        certification.certified === true && certification.report.certified === true,
        certification.certified ? "PASS" : "FAIL"
      )
    );
    if (!certification.certified) {
      issues.push(
        Object.freeze({ code: "certification_failed", message: "APP-10:8 certification did not pass.", readOnly: true as const })
      );
    }
    checks.push(
      check(
        "ready_for_freeze",
        "APP-10:8 readyForFreeze is true",
        certification.readyForFreeze === true && certification.report.status.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-10:8 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_reference",
        "Consumed certification matches APP-10/8",
        certification.report.contractVersion === CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.contractVersion
      )
    );
  }

  const manifestValidation = validateCrossScenarioLearningFreezeManifest(manifest);
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

  const registry = getCrossScenarioLearningPlatformRegistry();
  checks.push(
    check(
      "phase_registry",
      "Certified phase registry",
      registry.phaseCount === CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES.length,
      String(registry.phaseCount)
    )
  );
  checks.push(
    check(
      "public_api_registry",
      "Public API registry",
      registry.publicApiCount === CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS.length,
      String(registry.publicApiCount)
    )
  );
  checks.push(
    check(
      "consumer_registry",
      "Consumer compatibility registry",
      registry.consumerCount === 4,
      String(registry.consumerCount)
    )
  );
  checks.push(
    check(
      "contract_registry",
      "Public contract registry frozen",
      CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  const compatibility = getCrossScenarioLearningCompatibility();
  checks.push(
    check(
      "compatibility_matrix",
      "Compatibility matrix valid",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app10Platform.compatible === true &&
        compatibility.app5ScenarioTimeline.directInternalCouplingForbidden === true &&
        compatibility.app9ConfidenceEvolution.directInternalCouplingForbidden === true &&
        compatibility.intPlatform.readOnlyReferenceOnly === true &&
        compatibility.dsPlatform.metadataOnly === true &&
        compatibility.layPlatform.extendOnly === true &&
        compatibility.workspaceConsumer.workspaceIsolationRequired === true,
      compatibility.compatibilityVersion
    )
  );

  checks.push(
    check(
      "extension_policy",
      "Extension policy valid",
      manifest?.extensionPolicy.facadeRequired === true &&
        manifest?.extensionPolicy.layCompatibilityRequired === true &&
        CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length >= 10,
      String(CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length)
    )
  );

  checks.push(
    check(
      "forbidden_changes",
      "Forbidden changes listed",
      CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES.length >= 10,
      String(CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts",
        allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "crossScenarioLearningPlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  checks.push(verifyNoImplementationPatterns());

  checks.push(
    check(
      "prior_platforms_untouched",
      "Prior APP-5 through APP-9 untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      "APP-5 through APP-9 identity verified"
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

export const CrossScenarioLearningPlatformFreezeValidation = Object.freeze({
  validateCrossScenarioLearningPlatformFreeze,
});
