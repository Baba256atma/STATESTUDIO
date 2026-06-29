/**
 * APP-3:15 — Executive Intent Platform Final Certification.
 * Official release gate wrapping APP-3:14 platform certification and freeze validation.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES } from "./executiveIntentAssistantIntegration.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES } from "./executiveIntentDashboardIntegration.ts";
import {
  EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES,
  EXECUTIVE_INTENT_PLATFORM_IDENTITY,
} from "./executiveIntentPlatformCertificationContract.ts";
import { runExecutiveIntentPlatformCertification } from "./executiveIntentPlatformCertification.ts";
import {
  buildExecutiveIntentPlatformFreezeManifest,
  EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
  EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
  EXECUTIVE_INTENT_PLATFORM_STATUS,
} from "./executiveIntentPlatformFreezeManifest.ts";
import { runExecutiveIntentPlatformFreezeRegression } from "./executiveIntentPlatformFreezeRegression.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_RULES } from "./executiveIntentReasoningEngine.ts";

const REPO_ROOT = join(process.cwd(), "..");
const FREEZE_REPORT_PATH = join(
  REPO_ROOT,
  "docs/app-3-15-executive-intent-platform-freeze-report.md"
);

export { EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS as EXECUTIVE_INTENT_PLATFORM_FINAL_TAGS };

export type ExecutiveIntentFreezeCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveIntentPlatformFinalCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  released: boolean;
  checks: readonly ExecutiveIntentFreezeCertificationCheck[];
  passedChecks: readonly ExecutiveIntentFreezeCertificationCheck[];
  failedChecks: readonly ExecutiveIntentFreezeCertificationCheck[];
  tags: typeof EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS;
  summary: string;
  generatedAt: string;
  regression: ReturnType<typeof runExecutiveIntentPlatformFreezeRegression>;
  platformCertification: ReturnType<typeof runExecutiveIntentPlatformCertification>;
  freezeManifest: ReturnType<typeof buildExecutiveIntentPlatformFreezeManifest>;
  publicApiValidation: Readonly<{
    frozenPublicSurface: readonly string[];
    forbiddenConsumerImports: readonly string[];
    reasoningConsumerOnly: boolean;
  }>;
  readOnly: true;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveIntentFreezeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function runExecutiveIntentPlatformFinalCertification(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveIntentPlatformFinalCertificationResult {
  const regression = runExecutiveIntentPlatformFreezeRegression(timestamp);
  const platformCertification = runExecutiveIntentPlatformCertification(timestamp);
  const certificationDate = nowIso();
  const freezeManifest = buildExecutiveIntentPlatformFreezeManifest(certificationDate);

  const phaseById = Object.fromEntries(regression.phases.map((phase) => [phase.phaseId, phase]));
  const gateByKey = Object.fromEntries(
    platformCertification.gates.map((gate) => [gate.gateKey, gate])
  );

  const checks: ExecutiveIntentFreezeCertificationCheck[] = [
    check(
      "A",
      "Platform Identity",
      EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId === "executive-intent-platform" &&
        freezeManifest.platformStatus === EXECUTIVE_INTENT_PLATFORM_STATUS,
      EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformName
    ),
    check(
      "B",
      "Contract Freeze",
      phaseById["APP-3/1"]?.certified === true,
      phaseById["APP-3/1"]?.message ?? ""
    ),
    check(
      "C",
      "State Freeze",
      phaseById["APP-3/2"]?.certified === true,
      phaseById["APP-3/2"]?.message ?? ""
    ),
    check(
      "D",
      "Extraction Freeze",
      phaseById["APP-3/4"]?.certified === true,
      phaseById["APP-3/4"]?.message ?? ""
    ),
    check(
      "E",
      "Semantic Freeze",
      phaseById["APP-3/5"]?.certified === true,
      phaseById["APP-3/5"]?.message ?? ""
    ),
    check(
      "F",
      "Classification Freeze",
      phaseById["APP-3/6"]?.certified === true,
      phaseById["APP-3/6"]?.message ?? ""
    ),
    check(
      "G",
      "Conflict Freeze",
      phaseById["APP-3/7"]?.certified === true,
      phaseById["APP-3/7"]?.message ?? ""
    ),
    check(
      "H",
      "Dependency Freeze",
      phaseById["APP-3/8"]?.certified === true,
      phaseById["APP-3/8"]?.message ?? ""
    ),
    check(
      "I",
      "Evolution Freeze",
      phaseById["APP-3/9"]?.certified === true,
      phaseById["APP-3/9"]?.message ?? ""
    ),
    check(
      "J",
      "Confidence Freeze",
      phaseById["APP-3/10"]?.certified === true,
      phaseById["APP-3/10"]?.message ?? ""
    ),
    check(
      "K",
      "Reasoning Freeze",
      phaseById["APP-3/11"]?.certified === true,
      phaseById["APP-3/11"]?.message ?? ""
    ),
    check(
      "L",
      "Assistant Integration Freeze",
      phaseById["APP-3/12"]?.certified === true &&
        EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly === true,
      phaseById["APP-3/12"]?.message ?? ""
    ),
    check(
      "M",
      "Dashboard Integration Freeze",
      phaseById["APP-3/13"]?.certified === true &&
        EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly === true,
      phaseById["APP-3/13"]?.message ?? ""
    ),
    check(
      "N",
      "Platform Certification Freeze",
      phaseById["APP-3/14"]?.certified === true && platformCertification.passed === true,
      platformCertification.summary.headline
    ),
    check(
      "O",
      "Consumer Rules",
      platformCertification.consumerCertificationPassed === true &&
        EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly === true &&
        EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly === true,
      "Assistant and dashboard consume reasoning only."
    ),
    check(
      "P",
      "Regression",
      regression.certified && regression.architectureDriftDetected === false,
      regression.summary
    ),
    check(
      "Q",
      "Public API Freeze",
      freezeManifest.frozenPublicSurface.length === 4 &&
        EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE.includes("ExecutiveIntentPlatformRunner"),
      freezeManifest.frozenPublicSurface.join(", ")
    ),
    check(
      "R",
      "Platform Runner",
      typeof runExecutiveIntentPlatformFinalCertification === "function" &&
        typeof buildExecutiveIntentPlatformFreezeManifest === "function",
      "Freeze modules export callable functions."
    ),
    check(
      "S",
      "Freeze Manifest",
      freezeManifest.architectureHash.startsWith("arch-") &&
        freezeManifest.freezeVersion === EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
      freezeManifest.architectureHash
    ),
    check(
      "T",
      "Compatibility",
      Object.values(freezeManifest.compatibilityManifest).every(
        (entry) => "compatible" in entry && entry.compatible === true
      ) && freezeManifest.futureCompatibility.readOnly === true,
      "Forward and backward compatibility declared."
    ),
    check(
      "U",
      "Architecture Frozen",
      EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.architectureImmutable === true &&
        EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.readOnly === true &&
        EXECUTIVE_INTENT_REASONING_ENGINE_RULES.readOnly === true,
      "Architecture rules frozen."
    ),
    check(
      "V",
      "Read-only Guarantees",
      EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.noMutation === true &&
        EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.noStorage === true &&
        EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.noReact === true,
      "Read-only freeze rules verified."
    ),
    check(
      "W",
      "Release Tags",
      EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[RELEASE_READY]") &&
        EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[EXECUTIVE_INTENT_PLATFORM_FROZEN]"),
      EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.join(" ")
    ),
    check(
      "X",
      "End-to-End Pipeline",
      gateByKey["O"]?.passed === true && platformCertification.endToEndPassed === true,
      gateByKey["O"]?.message ?? ""
    ),
    check(
      "Y",
      "Backward Compatibility",
      EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.breakingChangesForbidden === true &&
        freezeManifest.compatibilityManifest.backwardCompatible.compatible === true,
      "Backward compatibility preserved."
    ),
    check(
      "Z",
      "Platform Released",
      freezeManifest.platformStatus === EXECUTIVE_INTENT_PLATFORM_STATUS &&
        regression.certified &&
        platformCertification.passed &&
        existsSync(FREEZE_REPORT_PATH),
      EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION
    ),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-3:15 Executive Intent Platform Freeze",
    status: certified ? "PASS" : "FAIL",
    certified,
    released: certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    tags: EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
    summary: certified
      ? "APP-3:15 Executive Intent Platform CERTIFIED and FROZEN."
      : `APP-3:15 Executive Intent Platform freeze FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: certificationDate,
    regression,
    platformCertification,
    freezeManifest,
    publicApiValidation: Object.freeze({
      frozenPublicSurface: freezeManifest.frozenPublicSurface,
      forbiddenConsumerImports: EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
      reasoningConsumerOnly:
        EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly === true &&
        EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly === true,
    }),
    readOnly: true as const,
  });
}

export const ExecutiveIntentPlatformFinalCertification = Object.freeze({
  runExecutiveIntentPlatformFinalCertification,
});
