/**
 * APP-11:8 — Executive Inbox Platform Freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_INTELLIGENCE_IDENTITY } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./executiveInboxPlatformCertificationManifest.ts";
import { getExecutiveInboxCompatibility } from "./executiveInboxPlatformFreezeCompatibility.ts";
import type { ExecutiveInboxPlatformFreezeManifest } from "./executiveInboxPlatformFreezeManifest.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST,
  validateExecutiveInboxFreezeManifest,
} from "./executiveInboxPlatformFreezeManifest.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getExecutiveInboxPlatformRegistry,
} from "./executiveInboxPlatformFreezeRegistry.ts";
import type {
  ExecutiveInboxPlatformFreezeCertificationDependency,
  ExecutiveInboxPlatformFreezeValidationCheck,
  ExecutiveInboxPlatformFreezeValidationResult,
} from "./executiveInboxPlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxPlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readFreezeModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function allDocumentationPresent(): boolean {
  return EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyNoImplementationPatterns(): ExecutiveInboxPlatformFreezeValidationCheck {
  const sources = [
    readFreezeModule("app/lib/executive-inbox/executiveInboxPlatformFreeze.ts"),
    readFreezeModule("app/lib/executive-inbox/executiveInboxPlatformFreezeCompatibility.ts"),
    readFreezeModule("app/lib/executive-inbox/executiveInboxPlatformFreezeTypes.ts"),
  ].join("\n");

  const passed =
    !/export\s+(function|const)\s+\w*(Dashboard|Assistant|Chart|Visualization)\w*\s*=/.test(sources) &&
    !/await\s+fetch\s*\(/.test(sources) &&
    !/createCalendarEvent\s*\(/.test(sources) &&
    !/deliverNotification\s*\(/.test(sources);

  return check(
    "no_new_runtime_behavior",
    "No new runtime behavior in freeze modules",
    passed,
    passed ? "metadata-only freeze modules" : "runtime pattern detected"
  );
}

export function validateExecutiveInboxPlatformFreeze(
  certification: ExecutiveInboxPlatformFreezeCertificationDependency | null,
  manifest: ExecutiveInboxPlatformFreezeManifest | null
): ExecutiveInboxPlatformFreezeValidationResult {
  const checks: ExecutiveInboxPlatformFreezeValidationCheck[] = [];
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
        "APP-11:7 certification PASS",
        certification.certified === true && certification.report.certified === true,
        certification.certified ? "PASS" : "FAIL"
      )
    );
    if (!certification.certified) {
      issues.push(
        Object.freeze({ code: "certification_failed", message: "APP-11:7 certification did not pass.", readOnly: true as const })
      );
    }
    checks.push(
      check(
        "ready_for_freeze",
        "APP-11:7 readyForFreeze is true",
        certification.readyForFreeze === true && certification.report.status.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-11:7 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_reference",
        "Consumed certification matches APP-11/7",
        certification.report.contractVersion === EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.contractVersion
      )
    );
  }

  const manifestValidation = validateExecutiveInboxFreezeManifest(manifest);
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

  const registry = getExecutiveInboxPlatformRegistry();
  checks.push(
    check(
      "phase_registry",
      "Certified phase registry",
      registry.phaseCount === EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES.length,
      String(registry.phaseCount)
    )
  );
  checks.push(
    check(
      "public_api_registry",
      "Public API registry",
      registry.publicApiCount === EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS.length,
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
      EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  const compatibility = getExecutiveInboxCompatibility();
  checks.push(
    check(
      "compatibility_matrix",
      "Compatibility matrix valid",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app11Platform.compatible === true &&
        compatibility.app5ScenarioTimeline.directInternalCouplingForbidden === true &&
        compatibility.app10CrossScenarioLearning.directInternalCouplingForbidden === true &&
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
        EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length >= 10,
      String(EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length)
    )
  );

  checks.push(
    check(
      "forbidden_changes",
      "Forbidden changes listed",
      EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES.length >= 10,
      String(EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxPlatformFreeze.ts",
        allowedFiles: EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxPlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  checks.push(verifyNoImplementationPatterns());

  checks.push(
    check(
      "prior_platforms_untouched",
      "Prior APP-1 through APP-10 untouched",
      EXECUTIVE_TIME_FOUNDATION_VERSION.startsWith("APP-1") &&
        SCENARIO_INTELLIGENCE_IDENTITY.appId === "APP-2" &&
        EXECUTIVE_INTENT_IDENTITY.appId === "APP-3" &&
        EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4" &&
        SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-1 through APP-10 identity verified"
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

export const ExecutiveInboxPlatformFreezeValidation = Object.freeze({
  validateExecutiveInboxPlatformFreeze,
});
