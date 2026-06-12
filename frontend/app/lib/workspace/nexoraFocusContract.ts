/** MRP_HUD:13:9 — Focus mode must preserve Scene Panel as permanent scene control authority. */

let loggedFocusContract = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceNexoraFocusContract(input: {
  scenePanelPreserved: boolean;
  objectPanelHidden: boolean;
  timelineHidden: boolean;
}): void {
  if (!isDev() || loggedFocusContract) return;
  loggedFocusContract = true;
  globalThis.console?.log?.(
    `[NexoraFocusContract] scenePanelPreserved=${input.scenePanelPreserved} objectPanelHidden=${input.objectPanelHidden} timelineHidden=${input.timelineHidden}`
  );
}

export function resetNexoraFocusContractForTests(): void {
  loggedFocusContract = false;
}
