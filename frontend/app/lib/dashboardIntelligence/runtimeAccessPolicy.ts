/**
 * INT-1.1 — Runtime access policy.
 * Every consumer must route through Dashboard Intelligence Runtime — no bypass.
 */

import type {
  DashboardIntelligenceMode,
  DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";
import {
  assertPresentationMayNotImportDsEngine,
  isForbiddenDirectDsImport,
  type ForbiddenPresentationConsumer,
} from "./directAccessProtectionContract.ts";
import { getIntelligenceConsumer } from "./intelligenceConsumerRegistry.ts";
import type {
  IntelligenceConsumerId,
  IntelligenceGatewayRejection,
} from "./singleIntelligenceSourceContract.ts";

export type RuntimeAccessPolicyDecision = Readonly<{
  allowed: boolean;
  reason:
    | "allowed"
    | "unregistered_consumer"
    | "consumer_not_prepared"
    | "mode_not_allowed"
    | "panel_not_allowed"
    | "direct_access_forbidden";
  message: string;
}>;

function reject(
  reason: RuntimeAccessPolicyDecision["reason"],
  message: string
): RuntimeAccessPolicyDecision {
  return Object.freeze({ allowed: false, reason, message });
}

function allow(): RuntimeAccessPolicyDecision {
  return Object.freeze({
    allowed: true,
    reason: "allowed",
    message: "Consumer may request intelligence through the runtime gateway.",
  });
}

export function evaluateRuntimeAccessPolicy(input: {
  consumer: IntelligenceConsumerId;
  panel: DashboardIntelligencePanelId;
  mode: DashboardIntelligenceMode;
}): RuntimeAccessPolicyDecision {
  const registration = getIntelligenceConsumer(input.consumer);
  if (!registration) {
    return reject(
      "unregistered_consumer",
      `Consumer "${input.consumer}" is not registered with the intelligence gateway.`
    );
  }

  if (registration.lifecycle === "reserved") {
    return reject(
      "consumer_not_prepared",
      `Consumer "${input.consumer}" is reserved and cannot request intelligence yet.`
    );
  }

  if (!registration.allowedModes.includes(input.mode)) {
    return reject(
      "mode_not_allowed",
      `Mode "${input.mode}" is not allowed for consumer "${input.consumer}".`
    );
  }

  if (!registration.allowedPanels.includes(input.panel)) {
    return reject(
      "panel_not_allowed",
      `Panel "${input.panel}" is not allowed for consumer "${input.consumer}".`
    );
  }

  return allow();
}

export function enforcePresentationImportPolicy(input: {
  consumer: ForbiddenPresentationConsumer;
  importSpecifier: string;
}): RuntimeAccessPolicyDecision {
  const violation = assertPresentationMayNotImportDsEngine(input);
  if (!violation) return allow();
  return reject(
    "direct_access_forbidden",
    `Direct DS import "${input.importSpecifier}" is forbidden for ${input.consumer}.`
  );
}

export function isDirectDsImportForbidden(importSpecifier: string): boolean {
  return isForbiddenDirectDsImport(importSpecifier);
}

export function toGatewayRejection(input: {
  requestId: string;
  consumer: IntelligenceConsumerId | null;
  decision: RuntimeAccessPolicyDecision;
}): IntelligenceGatewayRejection {
  return Object.freeze({
    success: false,
    requestId: input.requestId,
    consumer: input.consumer,
    reason:
      input.decision.reason === "allowed"
        ? "unregistered_consumer"
        : input.decision.reason,
    message: input.decision.message,
    generatedAt: new Date().toISOString(),
  });
}

export const RUNTIME_ACCESS_POLICY_RULE =
  "Every consumer must request intelligence through Dashboard Intelligence Runtime. No exceptions. No bypass. No direct DS imports." as const;
