/**
 * EX-2 Tier-0 Synthetic UI Development/Test Harness.
 *
 * Demonstrates all nine facade view states through the gated local route.
 *
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

"use client";

import type { ReactElement } from "react";
import { createExecutiveJournalSyntheticUiDemoView } from "./executiveJournalSyntheticUiFacade.ts";
import { ExecutiveJournalSyntheticPreview } from "./ExecutiveJournalSyntheticPreview.tsx";
import {
  ExecutiveJournalSyntheticUiCssText,
  ex2t0,
} from "./executiveJournalSyntheticUiStyles.ts";
import {
  assertExecutiveJournalSyntheticUiViewState,
  ExecutiveJournalSyntheticUiViewStates,
  type ExecutiveJournalSyntheticUiViewState,
} from "./executiveJournalSyntheticUiTypes.ts";

export interface ExecutiveJournalSyntheticHarnessProps {
  readonly demoState?: ExecutiveJournalSyntheticUiViewState;
  readonly "data-testid"?: string;
}

/**
 * Development/test-only harness for Tier-0 synthetic UI states.
 * Keep unreferenced by app routes and primary navigation.
 */
export function ExecutiveJournalSyntheticHarness({
  demoState = "Ready",
  "data-testid": testId = "ex2-t0-synthetic-harness",
}: ExecutiveJournalSyntheticHarnessProps): ReactElement {
  const state = assertExecutiveJournalSyntheticUiViewState(demoState);
  const view = createExecutiveJournalSyntheticUiDemoView(state);

  return (
    <div
      className={ex2t0.harness}
      data-testid={testId}
      data-harness="DevelopmentTestHarnessOnly"
      data-demo-state={state}
      data-production="false"
      data-route="none"
    >
      <style data-ex2-t0-canonical-css="true">
        {ExecutiveJournalSyntheticUiCssText}
      </style>
      <p className={ex2t0.harnessNote} data-testid="ex2-t0-harness-note">
        Development/test harness only. Demonstrates synthetic UI state{" "}
        <strong>{state}</strong>. Available only through the gated local
        development route. No live journal data.
      </p>
      <ExecutiveJournalSyntheticPreview
        view={view}
        data-testid="ex2-t0-harness-preview"
      />
    </div>
  );
}

export const ExecutiveJournalSyntheticHarnessMeta = Object.freeze({
  host: "DevelopmentTestHarnessOnly" as const,
  demoStates: ExecutiveJournalSyntheticUiViewStates,
  appRouterMounted: false as const,
  primaryNavigationExposure: false as const,
  productionMount: false as const,
  networkFallback: false as const,
  realData: false as const,
  immutable: true as const,
});
