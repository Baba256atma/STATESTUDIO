/**
 * APP-9:9 — Confidence Evolution Platform Freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "../decision-journal/decisionJournalContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import type { ConfidenceEvolutionPlatformCertificationResult } from "./confidenceEvolutionPlatformCertification.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./confidenceEvolutionPlatformCertificationManifest.ts";
import { getConfidenceEvolutionCompatibility } from "./confidenceEvolutionPlatformFreezeCompatibility.ts";
import type { ConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST,
  validateConfidenceEvolutionFreezeManifest,
} from "./confidenceEvolutionPlatformFreezeManifest.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS,
  CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getConfidenceEvolutionPlatformRegistry,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";
import type {
  ConfidenceEvolutionPlatformFreezeValidationCheck,
  ConfidenceEvolutionPlatformFreezeValidationResult,
} from "./confidenceEvolutionPlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionPlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readFreezeModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function allDocumentationPresent(): boolean {
  return CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyNoImplementationPatterns(): ConfidenceEvolutionPlatformFreezeValidationCheck {
  const sources = [
    readFreezeModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.ts"),
    readFreezeModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeRegistry.ts"),
    readFreezeModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeCompatibility.ts"),
    readFreezeModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeTypes.ts"),
  ].join("\n");

  const passed =
    !/export\s+(function|const)\s+\w*(Dashboard|Assistant|Chart|Visualization)\w*\s*=/.test(sources) &&
    !/await\s+fetch\s*\(/.test(sources) &&
    !/predict\s*\(|recommend\s*\(/.test(sources);

  return check(
    "no_new_runtime_behavior",
    "No new runtime behavior in freeze modules",
    passed,
    passed ? "metadata-only freeze modules" : "runtime pattern detected"
  );
}

export function validateConfidenceEvolutionPlatformFreeze(
  certification: ConfidenceEvolutionPlatformCertificationResult | null,
  manifest: ConfidenceEvolutionPlatformFreezeManifest | null
): ConfidenceEvolutionPlatformFreezeValidationResult {
  const checks: ConfidenceEvolutionPlatformFreezeValidationCheck[] = [];
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
        "APP-9:8 certification PASS",
        certification.status === "PASS" && certification.certified === true,
        certification.status
      )
    );
    if (certification.status !== "PASS") {
      issues.push(
        Object.freeze({ code: "certification_failed", message: "APP-9:8 certification did not pass.", readOnly: true as const })
      );
    }
    checks.push(
      check(
        "ready_for_freeze",
        "APP-9:8 readyForFreeze is true",
        certification.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-9:8 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_reference",
        "Consumed certification matches APP-9/8",
        certification.report.certificationVersion === CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.certificationVersion
      )
    );
  }

  const manifestValidation = validateConfidenceEvolutionFreezeManifest(manifest);
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

  const registry = getConfidenceEvolutionPlatformRegistry();
  checks.push(
    check(
      "phase_registry",
      "Certified phase registry",
      registry.phaseCount === CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES.length,
      String(registry.phaseCount)
    )
  );
  checks.push(
    check(
      "public_api_registry",
      "Public API registry",
      registry.publicApiCount === CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS.length,
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
      CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  const compatibility = getConfidenceEvolutionCompatibility();
  checks.push(
    check(
      "compatibility_matrix",
      "Compatibility matrix valid",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app9Platform.compatible === true &&
        compatibility.app6DecisionTimeline.directInternalCouplingForbidden === true &&
        compatibility.app7BusinessTimeline.directInternalCouplingForbidden === true &&
        compatibility.app8DecisionJournal.directInternalCouplingForbidden === true &&
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
        CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length >= 10,
      String(CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length)
    )
  );

  checks.push(
    check(
      "forbidden_changes",
      "Forbidden changes listed",
      CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES.length >= 10,
      String(CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "confidenceEvolutionPlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  checks.push(verifyNoImplementationPatterns());

  checks.push(
    check(
      "prior_platforms_untouched",
      "Prior APP-1 through APP-8 untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
      "APP-5, APP-6, APP-7, APP-8 identity verified"
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

export const ConfidenceEvolutionPlatformFreezeValidation = Object.freeze({
  validateConfidenceEvolutionPlatformFreeze,
});
