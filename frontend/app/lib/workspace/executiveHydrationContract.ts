/**
 * E2 — Hydration contract for executive workspace surfaces.
 *
 * Rule: SSR HTML must match the first client render before any effects run.
 * Never read window, document, localStorage, sessionStorage, matchMedia, or Date.now()
 * inside render paths for orientation, welcome, or onboarding overlays.
 */

import type { ExecutiveOrientationSnapshot } from "./orientation/executiveOrientationTypes";

export const EXECUTIVE_HYDRATION_CONTRACT = Object.freeze({
  rule: "No client-only conditions during render.",
  storageReads: "localStorage and sessionStorage reads occur only after hydration in useEffect.",
  visibility: "Orientation welcome is hidden until post-hydration visibility resolution.",
});

/** Stable SSR / pre-hydration orientation snapshot — welcome suppressed until client effect. */
export const SSR_EXECUTIVE_ORIENTATION_SNAPSHOT = Object.freeze({
  tier: "returningUser",
  visitCount: 0,
  welcomeDismissed: true,
  isFirstVisit: false,
}) as ExecutiveOrientationSnapshot;

export function assertHydrationSafeRender(source: string, clientOnlyDetected: boolean): void {
  if (process.env.NODE_ENV === "production" || !clientOnlyDetected) return;
  const key = `${source}:client_only_render`;
  if (hydrationContractLogKeys.has(key)) return;
  hydrationContractLogKeys.add(key);
  globalThis.console?.warn?.("[Nexora][HydrationContract]", {
    source,
    violation: "client_only_condition_in_render",
  });
}

const hydrationContractLogKeys = new Set<string>();

export function resetExecutiveHydrationContractLogsForTests(): void {
  hydrationContractLogKeys.clear();
}
