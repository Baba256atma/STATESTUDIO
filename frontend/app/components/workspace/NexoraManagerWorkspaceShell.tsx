"use client";

import React from "react";
import { SceneStateProvider } from "../SceneContext";
import { HomeScreen } from "../../screens/HomeScreen";
import NexoraShell from "../NexoraShell";
import NexoraOSShell from "../../os/NexoraOSShell";
import { resolveDomainExperience } from "../../lib/domain/domainExperienceRegistry";
import { DebugInspector } from "../debug/DebugInspector";
import { NexoraDevTasksWidget } from "../dev/NexoraDevTasksWidget";
import {
  DEFAULT_THEME_MODE,
  getSystemPrefersDark,
  NexoraUiThemeProvider,
  persistThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
} from "../../lib/ui/nexoraUiTheme";
import { logWorkspaceAppearancePreferenceRestored } from "../../lib/ui/workspaceAppearanceInstrumentation";
import { bindMediaQueryListener } from "../../lib/dom/domListenerLifecycle";
import { InvestorDemoProvider } from "../demo/InvestorDemoContext";
import { NexoraOperatorModeProvider } from "../../lib/product/nexoraOperatorModeContext";
import { getNexoraProductMode } from "../../lib/product/nexoraProductMode";
import { NexoraRunbookGuidanceProvider } from "../../lib/pilot/nexoraRunbookGuidanceContext";
import { AdaptiveGovernanceIntelligenceRootProvider } from "../../lib/enterprise/governance";
import { WorkspaceLayoutProvider } from "../../lib/ui/useWorkspaceLayout";
import { HudPreferencesProvider } from "../../lib/ui/useHudPreferences";
import { SceneThemeProvider } from "../../lib/theme/useSceneTheme";
import { shouldExposeExecutiveDevSurfaces } from "../../lib/ui/executiveWorkspacePresentation";
import { initializeNexoraArchitectureFreeze } from "../../lib/architecture/nexoraArchitectureFreezeRuntime";
import { emitPhase2RuntimeCertification } from "../../lib/architecture/nexoraPhase2RuntimeCertification";
import { emitPhase3DashboardCertification } from "../../lib/architecture/nexoraPhase3DashboardCertification";

export type NexoraManagerWorkspaceShellProps = {
  domainId: string;
  organizationId?: string;
  sessionHydrated?: boolean;
  showDevWidgets?: boolean;
};

/**
 * Canonical Nexora manager workspace entry: NexoraOSShell → NexoraShell → HomeScreen.
 * Shared by `/` (after domain selection) and `/type-c` (direct Type-C activation).
 */
export function NexoraManagerWorkspaceShell(props: NexoraManagerWorkspaceShellProps): React.ReactElement {
  const stateVector = React.useMemo(() => ({ intensity: 0.5, volatility: 0 }), []);
  const [themeMode, setThemeModeState] = React.useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [prefersDark, setPrefersDark] = React.useState<boolean>(false);

  const resolvedSelection = React.useMemo(
    () => resolveDomainExperience(props.domainId),
    [props.domainId]
  );

  const organizationId =
    props.organizationId?.trim() || `nexora-${resolvedSelection.experience.domainId}`;
  const sessionHydrated = props.sessionHydrated ?? true;
  const showDevWidgets =
    props.showDevWidgets ??
    (shouldExposeExecutiveDevSurfaces() &&
      process.env.NODE_ENV !== "production" &&
      getNexoraProductMode() !== "pilot");

  React.useLayoutEffect(() => {
    const stored = readStoredThemeMode();
    setThemeModeState(stored);
    setPrefersDark(getSystemPrefersDark());
    logWorkspaceAppearancePreferenceRestored(stored, resolveThemeMode(stored, getSystemPrefersDark()));
  }, []);

  React.useEffect(() => {
    initializeNexoraArchitectureFreeze();
    emitPhase2RuntimeCertification();
    emitPhase3DashboardCertification();
  }, []);

  const resolvedTheme: ResolvedUiTheme = React.useMemo(
    () => resolveThemeMode(themeMode, prefersDark),
    [themeMode, prefersDark]
  );

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (themeMode !== "auto") return undefined;
    if (typeof window === "undefined" || window == null) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mq.matches);
    return bindMediaQueryListener("(prefers-color-scheme: dark)", (event) => setPrefersDark(event.matches), {
      component: "NexoraManagerWorkspaceShell",
      elementId: "prefers-color-scheme: dark",
      eventType: "change",
    });
  }, [themeMode]);

  const setThemeMode = React.useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    persistThemeMode(mode);
    const nextResolved = resolveThemeMode(mode, window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", nextResolved);
  }, []);

  return (
    <SceneStateProvider stateVector={stateVector as { intensity: number; volatility: number }}>
      <div
        id="nexora-viewport"
        data-nx="nexora-manager-workspace"
        data-nx-domain={resolvedSelection.experience.domainId}
        style={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          minWidth: 0,
          minHeight: 0,
          background: "var(--nx-bg-app)",
          color: "var(--nx-text)",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NexoraUiThemeProvider themeMode={themeMode} setThemeMode={setThemeMode} resolvedTheme={resolvedTheme}>
            <SceneThemeProvider>
            <HudPreferencesProvider>
            <WorkspaceLayoutProvider>
            <InvestorDemoProvider>
              <NexoraOperatorModeProvider>
                <NexoraRunbookGuidanceProvider>
                  <AdaptiveGovernanceIntelligenceRootProvider
                    sessionHydrated={sessionHydrated}
                    organizationId={organizationId}
                  >
                    <NexoraOSShell>
                      <NexoraShell canonicalDomainExperience={resolvedSelection}>
                        <HomeScreen domainExperience={resolvedSelection} />
                      </NexoraShell>
                    </NexoraOSShell>
                  </AdaptiveGovernanceIntelligenceRootProvider>
                </NexoraRunbookGuidanceProvider>
              </NexoraOperatorModeProvider>
            </InvestorDemoProvider>
            </WorkspaceLayoutProvider>
            </HudPreferencesProvider>
            </SceneThemeProvider>
          </NexoraUiThemeProvider>
        </div>
        {showDevWidgets ? (
          <>
            <NexoraDevTasksWidget workspaceDomainId={resolvedSelection.experience.domainId} />
            <DebugInspector />
          </>
        ) : null}
      </div>
    </SceneStateProvider>
  );
}
