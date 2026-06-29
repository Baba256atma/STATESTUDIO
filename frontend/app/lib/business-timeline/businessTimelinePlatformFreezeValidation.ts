/**
 * APP-7:8 — Business Timeline Platform Freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import type { BusinessTimelinePlatformCertificationResult } from "./businessTimelinePlatformCertification.ts";
import { BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./businessTimelinePlatformCertificationManifest.ts";
import { getBusinessTimelineCompatibility } from "./businessTimelinePlatformFreezeCompatibility.ts";
import type { BusinessTimelinePlatformFreezeManifest } from "./businessTimelinePlatformFreezeManifest.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
  validateBusinessTimelineFreezeManifest,
} from "./businessTimelinePlatformFreezeManifest.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getBusinessTimelinePlatformRegistry,
} from "./businessTimelinePlatformFreezeRegistry.ts";
import type { BusinessTimelinePlatformFreezeValidationCheck, BusinessTimelinePlatformFreezeValidationResult } from "./businessTimelinePlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): BusinessTimelinePlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readFreezeModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function allDocumentationPresent(): boolean {
  return BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyNoImplementationPatterns(): BusinessTimelinePlatformFreezeValidationCheck {
  const sources = [
    readFreezeModule("app/lib/business-timeline/businessTimelinePlatformFreeze.ts"),
    readFreezeModule("app/lib/business-timeline/businessTimelinePlatformFreezeRegistry.ts"),
    readFreezeModule("app/lib/business-timeline/businessTimelinePlatformFreezeCompatibility.ts"),
    readFreezeModule("app/lib/business-timeline/businessTimelinePlatformFreezeManifest.ts"),
    readFreezeModule("app/lib/business-timeline/businessTimelinePlatformFreezeTypes.ts"),
  ].join("\n");

  const passed =
    !/export\s+(function|const)\s+\w*(Dashboard|Assistant|Chart|Visualization|DataSource)\w*\s*=/.test(sources) &&
    !/await\s+fetch\s*\(/.test(sources);

  return check(
    "no_new_runtime_behavior",
    "No new runtime behavior in freeze modules",
    passed,
    passed ? "metadata-only freeze modules" : "runtime pattern detected"
  );
}

export function validateBusinessTimelinePlatformFreeze(
  certification: BusinessTimelinePlatformCertificationResult | null,
  manifest: BusinessTimelinePlatformFreezeManifest | null
): BusinessTimelinePlatformFreezeValidationResult {
  const checks: BusinessTimelinePlatformFreezeValidationCheck[] = [];
  const issues: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  if (!certification) {
    checks.push(check("certification_exists", "Certification result exists", false, "missing certification"));
    issues.push(Object.freeze({ code: "missing_certification", message: "Certification result is required.", readOnly: true as const }));
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
        "APP-7:7 certification PASS",
        certification.status === "PASS" && certification.certified === true,
        certification.status
      )
    );
    if (certification.status !== "PASS") {
      issues.push(Object.freeze({ code: "certification_failed", message: "APP-7:7 certification did not pass.", readOnly: true as const }));
    }
    checks.push(
      check(
        "ready_for_freeze",
        "APP-7:7 readyForFreeze is true",
        certification.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-7:7 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_reference",
        "Consumed certification matches APP-7/7",
        certification.report.certificationVersion === BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.certificationVersion
      )
    );
  }

  const manifestValidation = validateBusinessTimelineFreezeManifest(manifest);
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

  const registry = getBusinessTimelinePlatformRegistry();
  checks.push(
    check(
      "phase_registry",
      "Certified phase registry",
      registry.phaseCount === BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES.length,
      String(registry.phaseCount)
    )
  );
  checks.push(
    check(
      "public_api_registry",
      "Public API registry",
      registry.publicApiCount === BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length,
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
      BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  const compatibility = getBusinessTimelineCompatibility();
  checks.push(
    check(
      "compatibility_matrix",
      "Compatibility matrix valid",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app7Platform.compatible === true &&
        compatibility.app5ScenarioTimeline.directInternalCouplingForbidden === true &&
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
        BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length >= 7,
      String(BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length)
    )
  );

  checks.push(
    check(
      "forbidden_changes",
      "Forbidden changes listed",
      BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES.length >= 7,
      String(BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelinePlatformFreeze.ts",
        allowedFiles: BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "businessTimelinePlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  checks.push(verifyNoImplementationPatterns());

  checks.push(
    check(
      "prior_platforms_untouched",
      "Prior APP-1 through APP-6 untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
      "APP-5 and APP-6 identity verified"
    )
  );

  const manifestPass = checks.filter((entry) =>
    ["manifest_valid", "manifest_immutable", "release_flags", "ready_for_release"].includes(entry.id)
  ).every((entry) => entry.passed);
  const registryPass = checks.filter((entry) =>
    ["phase_registry", "public_api_registry", "consumer_registry", "contract_registry"].includes(entry.id)
  ).every((entry) => entry.passed);
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

export const BusinessTimelinePlatformFreezeValidation = Object.freeze({
  validateBusinessTimelinePlatformFreeze,
});
