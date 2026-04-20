import type { PanelPayloadSourceFlags } from "./panelPayloadBuilderTypes";
import type { AdvicePanelData } from "../../../lib/panels/panelDataContract";
import { resolveAdvicePayloadPolicy } from "../panelPayloadPolicy";

type BuildAdvicePanelPayloadArgs = {
  currentView: string | null | undefined;
  resolvedPanelData: unknown;
  canonicalAdvice: unknown;
  canonicalStrategicAdvice: unknown;
  rawStrategicAdvice: unknown;
  responseStrategicAdvice: unknown;
  sceneStrategicAdvice: unknown;
};

export function buildAdvicePanelPayload(args: BuildAdvicePanelPayloadArgs): {
  payload: AdvicePanelData | Record<string, unknown> | null;
  sourceFlags: PanelPayloadSourceFlags;
} {
  const rawAdvicePayload =
    args.rawStrategicAdvice ??
    args.responseStrategicAdvice ??
    args.sceneStrategicAdvice ??
    null;
  const resolved = resolveAdvicePayloadPolicy<AdvicePanelData | Record<string, unknown>>({
    resolved:
      (args.currentView === "advice" ? args.resolvedPanelData : null) as AdvicePanelData | Record<string, unknown> | null,
    canonicalAdvice: args.canonicalAdvice as AdvicePanelData | Record<string, unknown> | null,
    canonicalStrategicAdvice: args.canonicalStrategicAdvice as AdvicePanelData | Record<string, unknown> | null,
    raw: rawAdvicePayload as AdvicePanelData | Record<string, unknown> | null,
  });

  return {
    payload: resolved.payload,
    sourceFlags: resolved.sourceFlags,
  };
}
