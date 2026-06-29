/**
 * APP-6:12 — Decision Timeline Platform Freeze validation.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import type { DecisionTimelinePlatformCertificationResult } from "./decisionTimelinePlatformCertification.ts";
import { DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./decisionTimelinePlatformCertificationManifest.ts";
import { getDecisionTimelineCompatibility } from "./decisionTimelinePlatformFreezeCompatibility.ts";
import type { DecisionTimelinePlatformFreezeManifest } from "./decisionTimelinePlatformFreezeManifest.ts";
import { DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST } from "./decisionTimelinePlatformFreezeManifest.ts";
import {
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  getDecisionTimelinePlatformRegistry,
} from "./decisionTimelinePlatformFreezeRegistry.ts";

const REPO_ROOT = join(process.cwd(), "..");

export type DecisionTimelinePlatformFreezeValidationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionTimelinePlatformFreezeValidationResult = Readonly<{
  valid: boolean;
  manifestPass: boolean;
  registryPass: boolean;
  compatibilityPass: boolean;
  certificationDependencyPass: boolean;
  frozenPass: boolean;
  checks: readonly DecisionTimelinePlatformFreezeValidationCheck[];
  issues: readonly Readonly<{ code: string; message: string; readOnly: true }>[];
  readOnly: true;
}>;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionTimelinePlatformFreezeValidationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function allDocumentationPresent(): boolean {
  return DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

export function validateDecisionTimelinePlatformFreeze(
  certification: DecisionTimelinePlatformCertificationResult | null,
  manifest: DecisionTimelinePlatformFreezeManifest | null
): DecisionTimelinePlatformFreezeValidationResult {
  const checks: DecisionTimelinePlatformFreezeValidationCheck[] = [];
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
        "ready_for_freeze",
        "APP-6:11 readyForFreeze is true",
        certification.readyForFreeze === true,
        String(certification.readyForFreeze)
      )
    );
    if (certification.readyForFreeze !== true) {
      issues.push(
        Object.freeze({
          code: "not_ready_for_freeze",
          message: "APP-6:11 certification reported readyForFreeze=false.",
          readOnly: true as const,
        })
      );
    }
    checks.push(
      check(
        "certification_certified",
        "APP-6:11 certification passed",
        certification.certified === true,
        certification.status
      )
    );
    checks.push(
      check(
        "certification_reference",
        "Certification reference matches APP-6/11",
        certification.report.certificationVersion === DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        certification.report.certificationVersion
      )
    );
  }

  if (!manifest) {
    checks.push(check("manifest_exists", "Freeze manifest exists", false, "missing manifest"));
    issues.push(Object.freeze({ code: "missing_manifest", message: "Freeze manifest is required.", readOnly: true as const }));
  } else {
    checks.push(check("manifest_exists", "Freeze manifest exists", true, manifest.freezeVersion));
    checks.push(
      check(
        "manifest_immutable",
        "Freeze manifest is immutable",
        Object.isFrozen(manifest) && manifest.frozen === true,
        manifest.architectureHash
      )
    );
    checks.push(
      check(
        "manifest_integrity",
        "Manifest version consistency",
        manifest.freezeVersion === DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION &&
          manifest.certificationReference === DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
        manifest.freezeVersion
      )
    );
    checks.push(
      check(
        "frozen_status",
        "Platform status is FROZEN",
        manifest.platformStatus.frozen === "FROZEN",
        manifest.platformStatus.frozen
      )
    );
  }

  const registry = getDecisionTimelinePlatformRegistry();
  checks.push(
    check(
      "registry_integrity",
      "Platform registry integrity",
      registry.registryVersion === DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION &&
        registry.publicApiCount === DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length,
      String(registry.publicApiCount)
    )
  );

  const compatibility = getDecisionTimelineCompatibility();
  checks.push(
    check(
      "compatibility_integrity",
      "Compatibility matrix integrity",
      compatibility.backwardCompatibility.guaranteed === true &&
        compatibility.app6Platform.compatible === true &&
        compatibility.workspacePlatform.workspaceIsolationRequired === true,
      compatibility.compatibilityVersion
    )
  );

  checks.push(
    check(
      "public_api_integrity",
      "Public API registry frozen",
      DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Freeze stage manifest valid",
      validateStageManifest(DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid === true,
      DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary enforced",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreeze.ts",
        allowedFiles: DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "decisionTimelinePlatformFreeze.ts"
    )
  );

  checks.push(
    check(
      "documentation_complete",
      "Freeze documentation complete",
      allDocumentationPresent(),
      String(DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    )
  );

  const manifestPass = checks.filter((entry) =>
    ["manifest_exists", "manifest_immutable", "manifest_integrity", "frozen_status"].includes(entry.id)
  ).every((entry) => entry.passed);
  const registryPass = checks.find((entry) => entry.id === "registry_integrity")?.passed === true;
  const compatibilityPass = checks.find((entry) => entry.id === "compatibility_integrity")?.passed === true;
  const certificationDependencyPass =
    checks.find((entry) => entry.id === "ready_for_freeze")?.passed === true &&
    checks.find((entry) => entry.id === "certification_certified")?.passed === true;
  const frozenPass = checks.find((entry) => entry.id === "frozen_status")?.passed === true;
  const valid = checks.every((entry) => entry.passed);

  return Object.freeze({
    valid,
    manifestPass,
    registryPass,
    compatibilityPass,
    certificationDependencyPass,
    frozenPass,
    checks: Object.freeze(checks),
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const DecisionTimelinePlatformFreezeValidation = Object.freeze({
  validateDecisionTimelinePlatformFreeze,
});
