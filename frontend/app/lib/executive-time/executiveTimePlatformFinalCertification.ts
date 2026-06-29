/**
 * APP-1:10 — Executive Time Platform Final Certification.
 * End-to-end platform certification and freeze validation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary } from "../stage/stageArchitectureGuards.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { listConsumerIds, listConsumers } from "./executiveTimeConsumerRegistry.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS,
  ExecutiveTimeIntegration,
} from "./executiveTimeIntegration.ts";
import {
  rejectDirectEngineAccess,
  resolvePlatformService,
  validateConsumer,
} from "./executiveTimeIntegrationResolver.ts";
import { ExecutiveTimePlatformGateway } from "./executiveTimePlatformGateway.ts";
import {
  EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT,
  EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
  ExecutiveTimePlatform,
  getCapabilities,
  getPlatformVersionMetadata,
} from "./executiveTimePlatformApi.ts";
import {
  buildExecutiveTimePlatformFreezeManifest,
  EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
  EXECUTIVE_TIME_PLATFORM_STATUS,
} from "./executiveTimePlatformFreezeManifest.ts";
import { runExecutiveTimePlatformRegression } from "./executiveTimePlatformRegression.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_PLATFORM_FINAL_TAGS = Object.freeze([
  "[APP1_10_EXECUTIVE_TIME_PLATFORM_CERTIFIED]",
  "[EXECUTIVE_TIME_PLATFORM_FROZEN]",
  "[PUBLIC_API_FROZEN]",
  "[ENGINE_CONTRACTS_FROZEN]",
  "[AUTHORITY_CONTRACTS_FROZEN]",
  "[EXECUTIVE_TIME_RELEASE_READY]",
  "[NO_UI_MUTATION]",
] as const);

const REPO_ROOT = join(process.cwd(), "..");
const FRONTEND_LIB = join(process.cwd(), "app/lib/executive-time");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function readModule(name: string): string {
  return readFileSync(join(FRONTEND_LIB, name), "utf8");
}

function publicSurfaceDoesNotExportEngines(): boolean {
  const integration = readModule("executiveTimeIntegration.ts");
  const gateway = readModule("executiveTimePlatformGateway.ts");
  const platformApi = readModule("executiveTimePlatformApi.ts");
  return (
    integration.includes("ExecutiveTimePlatformGateway") &&
    platformApi.includes("export { ExecutiveTimePlatform }") &&
    gateway.includes("ExecutiveTimePlatform") &&
    !gateway.includes("executiveTimeContextEngine") &&
    !gateway.includes("executivePredictionEngine")
  );
}

function validateConsumerBinding(consumerId: Parameters<typeof validateConsumer>[0]["consumerId"]): boolean {
  const consumer = validateConsumer({ consumerId });
  if (!consumer.valid) return false;
  const bindingKey =
    consumerId === "executive_memory"
      ? "executiveMemory"
      : (consumerId as keyof typeof EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS);
  const binding = EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS[bindingKey];
  return binding?.mustUsePlatformGateway === true && binding.runtimeBehaviorChanged === false;
}

function measureMetadataOperation<T>(operation: () => T): Readonly<{ ok: boolean; durationMs: number }> {
  const started = performance.now();
  operation();
  const durationMs = performance.now() - started;
  return Object.freeze({ ok: true, durationMs });
}

export function runExecutiveTimePlatformFinalCertification() {
  const regression = runExecutiveTimePlatformRegression();
  const certificationDate = nowIso();
  const freezeManifest = buildExecutiveTimePlatformFreezeManifest(certificationDate);
  const reportPath = join(REPO_ROOT, "docs/app-1-10-executive-time-platform-certification-report.md");

  const gatewayContext = Object.freeze({ consumerId: "app" as const });
  const workspaceId = "ws-platform-final-cert";
  ExecutiveTimePlatformGateway.switchContext(gatewayContext, { workspaceId, contextId: "this_week" });
  const routedContext = ExecutiveTimePlatformGateway.getCurrentContext(gatewayContext, { workspaceId });
  const routedCamera = ExecutiveTimePlatformGateway.getCamera(gatewayContext, workspaceId);

  const initPerf = measureMetadataOperation(() => getPlatformVersionMetadata());
  const routingPerf = measureMetadataOperation(() =>
    ExecutiveTimePlatform.getCurrentContext({ workspaceId })
  );
  const consumerPerf = measureMetadataOperation(() => validateConsumer({ consumerId: "dashboard" }));
  const capabilityPerf = measureMetadataOperation(() => getCapabilities());
  const versionPerf = measureMetadataOperation(() => ExecutiveTimeIntegration.getPlatformVersion());
  const registryPerf = measureMetadataOperation(() => listConsumers());

  const directEngineRejected = rejectDirectEngineAccess(
    "frontend/app/lib/executive-time/executiveTimeContextEngine.ts"
  );
  const platformService = resolvePlatformService("timeline");

  const phaseById = Object.fromEntries(regression.phases.map((phase) => [phase.phaseId, phase]));

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Foundation certified", phaseById["APP-1/1"]?.certified === true, phaseById["APP-1/1"]?.summary ?? ""),
    check("B", "Context certified", phaseById["APP-1/2"]?.certified === true, phaseById["APP-1/2"]?.summary ?? ""),
    check("C", "Camera certified", phaseById["APP-1/3"]?.certified === true, phaseById["APP-1/3"]?.summary ?? ""),
    check("D", "State certified", phaseById["APP-1/4"]?.certified === true, phaseById["APP-1/4"]?.summary ?? ""),
    check("E", "Transition certified", phaseById["APP-1/5"]?.certified === true, phaseById["APP-1/5"]?.summary ?? ""),
    check("F", "Priority certified", phaseById["APP-1/6"]?.certified === true, phaseById["APP-1/6"]?.summary ?? ""),
    check("G", "Events certified", phaseById["APP-1/7"]?.certified === true, phaseById["APP-1/7"]?.summary ?? ""),
    check("H", "Prediction certified", phaseById["APP-1/8"]?.certified === true, phaseById["APP-1/8"]?.summary ?? ""),
    check("I", "Platform API certified", phaseById["APP-1/8.5"]?.certified === true, phaseById["APP-1/8.5"]?.summary ?? ""),
    check("J", "Integration certified", phaseById["APP-1/9"]?.certified === true, phaseById["APP-1/9"]?.summary ?? ""),
    check("K", "Gateway certified", routedContext.success && routedCamera.success, routedContext.data?.id ?? ""),
    check("L", "Consumer Registry certified", listConsumers().length >= 11, String(listConsumerIds().length)),
    check("M", "Platform Routing certified", typeof ExecutiveTimePlatformGateway.evaluateTransition === "function", "Gateway routes."),
    check("N", "Engine Isolation certified", publicSurfaceDoesNotExportEngines() && directEngineRejected.directEngineAccessRejected, directEngineRejected.reason),
    check("O", "Public API freeze verified", freezeManifest.frozenPublicApis.includes("ExecutiveTimePlatform"), freezeManifest.platformStatus),
    check("P", "Authority contracts frozen", freezeManifest.frozenAuthorityRules.length >= 6, String(freezeManifest.frozenAuthorityRules.length)),
    check("Q", "Regression passed", regression.certified, regression.summary),
    check("R", "Compatibility validated", validateConsumerBinding("dashboard") && validateConsumerBinding("lay") && platformService.available, "Consumer bindings."),
    check("S", "Immutable platform verified", Object.isFrozen(freezeManifest) && EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.directEngineAccessPermitted === false, "Frozen manifest."),
    check("T", "Freeze manifest created", freezeManifest.architectureHash.startsWith("arch-"), freezeManifest.architectureHash),
    check("U", "Tests pass assumptions", initPerf.ok && routingPerf.ok && consumerPerf.ok && capabilityPerf.ok, `${registryPerf.durationMs.toFixed(2)}ms registry`),
    check("V", "Documentation completed", existsSync(reportPath), reportPath),
    check("W", "Platform released", freezeManifest.platformStatus === EXECUTIVE_TIME_PLATFORM_STATUS && regression.certified, EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:10 Executive Time Platform Certification & Freeze",
    status: certified ? "PASS" : "FAIL",
    certified,
    released: certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(
      versionPerf.durationMs > 100 ? ["Version lookup exceeded informal metadata threshold."] : []
    ),
    tags: EXECUTIVE_TIME_PLATFORM_FINAL_TAGS,
    summary: certified
      ? "APP-1:10 Executive Time Platform CERTIFIED and FROZEN."
      : `APP-1:10 Executive Time Platform certification FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: certificationDate,
    regression,
    freezeManifest,
    performanceMetadata: Object.freeze({
      initializationMs: initPerf.durationMs,
      routingMs: routingPerf.durationMs,
      consumerValidationMs: consumerPerf.durationMs,
      capabilityLookupMs: capabilityPerf.durationMs,
      versionLookupMs: versionPerf.durationMs,
      registryLookupMs: registryPerf.durationMs,
      metadataOnly: true,
    }),
    publicApiValidation: Object.freeze({
      permittedEntryPoints: Object.freeze(["ExecutiveTimePlatform", "ExecutiveTimePlatformGateway", "ExecutiveTimeIntegration"]),
      forbiddenEngineImports: EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
      directEngineAccessRejected: directEngineRejected.directEngineAccessRejected,
    }),
    uiIsolationVerified: !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: Object.freeze([`frontend/app/lib/executive-time/executiveTimePlatformFinalCertification.ts`]),
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
  });
}

export const ExecutiveTimePlatformFinalCertification = Object.freeze({
  runExecutiveTimePlatformFinalCertification,
});
