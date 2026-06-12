/**
 * MRP_HUD:10:5 — HUD runtime freeze diagnostics.
 */

import type {
  HudRuntimeFreezeStatus,
  HudRuntimeFreezeZoneId,
} from "./hudRuntimeFreezeContract.ts";
import type { HudRuntimeFreezeValidationResult } from "./hudRuntimeFreezeValidation.ts";

let freezeLogged = false;
let lastFreezeSignature: string | null = null;

export function traceHudFreezeZone(input: {
  zone: HudRuntimeFreezeZoneId;
  status: HudRuntimeFreezeStatus;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraHUDFreeze]\nzone=${input.zone}\nstatus=${input.status}`
  );
}

export function traceHudFreezeOverall(status: HudRuntimeFreezeStatus): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraHUDFreeze]\noverall=${status}`);
}

export function traceHudRuntimeFreeze(
  result: HudRuntimeFreezeValidationResult,
  options?: { force?: boolean }
): HudRuntimeFreezeValidationResult {
  if (process.env.NODE_ENV === "production") {
    return result;
  }

  const signature = result.signature;
  if (!options?.force && freezeLogged && lastFreezeSignature === signature) {
    return result;
  }

  freezeLogged = true;
  lastFreezeSignature = signature;

  for (const zoneId of Object.keys(result.zones) as HudRuntimeFreezeZoneId[]) {
    traceHudFreezeZone({ zone: zoneId, status: result.zones[zoneId] });
  }
  traceHudFreezeOverall(result.overall);

  if (typeof window !== "undefined") {
    (
      window as typeof window & {
        __NEXORA_HUD_RUNTIME_FREEZE__?: HudRuntimeFreezeValidationResult;
      }
    ).__NEXORA_HUD_RUNTIME_FREEZE__ = result;
  }

  return result;
}

export function resetHudRuntimeFreezeDiagnosticsForTests(): void {
  freezeLogged = false;
  lastFreezeSignature = null;
  if (typeof window !== "undefined") {
    delete (
      window as typeof window & {
        __NEXORA_HUD_RUNTIME_FREEZE__?: HudRuntimeFreezeValidationResult;
      }
    ).__NEXORA_HUD_RUNTIME_FREEZE__;
  }
}
