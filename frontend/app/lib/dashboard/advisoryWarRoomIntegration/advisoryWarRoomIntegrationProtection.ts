/**
 * Phase 5:6 — Advisory–War Room integration architecture protection.
 */

import { ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY } from "./advisoryWarRoomIntegrationRegistry.ts";
import type { IntegrationProtectionWarning } from "./advisoryWarRoomIntegrationContract.ts";

const warnedKeys = new Set<string>();

function emitWarning(code: string, message: string): IntegrationProtectionWarning {
  const warning = Object.freeze({ code, message });
  if (process.env.NODE_ENV !== "production" && !warnedKeys.has(code)) {
    warnedKeys.add(code);
    globalThis.console?.warn?.("[Nexora][AdvisoryWarRoomIntegration]", warning);
  }
  return warning;
}

export function validateIntegrationRegistry(): readonly IntegrationProtectionWarning[] {
  const warnings: IntegrationProtectionWarning[] = [];
  const expected = ["war_room", "executive_advisory", "decision_guidance"] as const;

  for (const participantId of expected) {
    const registered = ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY.some(
      (entry) => entry.participantId === participantId
    );
    if (!registered) {
      warnings.push(
        emitWarning(
          `integration.registry.missing_${participantId}`,
          `Integration participant ${participantId} is not registered`
        )
      );
    }
  }

  return Object.freeze(warnings);
}

export function detectIntegrationBypass(
  source: string,
  usedIntegrationLayer: boolean
): IntegrationProtectionWarning | null {
  if (usedIntegrationLayer) return null;
  return emitWarning(
    "integration.bypass_detected",
    `Direct advisory–war room path detected from ${source} — use advisoryWarRoomIntegrationRuntime`
  );
}

export function runAdvisoryWarRoomIntegrationProtection(): readonly IntegrationProtectionWarning[] {
  return validateIntegrationRegistry();
}

export function resetAdvisoryWarRoomIntegrationProtectionForTests(): void {
  warnedKeys.clear();
}
