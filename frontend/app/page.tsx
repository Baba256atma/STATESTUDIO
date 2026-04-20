"use client";

import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SceneStateProvider } from "./components/SceneContext";
import { HomeScreen } from "./screens/HomeScreen";
import NexoraShell from "./components/NexoraShell";
import { DomainSelectionScreen } from "./components/DomainSelectionScreen";
import { resolveDomainExperience } from "./lib/domain/domainExperienceRegistry";
import { DEFAULT_LAUNCH_DOMAIN_ID } from "./lib/product/mvpShippingPlan";
import { DebugInspector } from "./components/debug/DebugInspector";
import { NexoraDevTasksWidget } from "./components/dev/NexoraDevTasksWidget";
import { tertiaryButtonStyle } from "./components/ui/nexoraTheme";
import {
  DEFAULT_THEME_MODE,
  getSystemPrefersDark,
  NexoraUiThemeProvider,
  persistThemeMode,
  readStoredThemeMode,
  resolveThemeMode,
  type ResolvedUiTheme,
  type ThemeMode,
} from "./lib/ui/nexoraUiTheme";
import { InvestorDemoProvider } from "./components/demo/InvestorDemoContext";
import { NexoraOperatorModeProvider } from "./lib/product/nexoraOperatorModeContext";
import { getNexoraProductMode } from "./lib/product/nexoraProductMode";
import { NexoraRunbookGuidanceProvider } from "./lib/pilot/nexoraRunbookGuidanceContext";

const DOMAIN_STORAGE_KEY = "nexora.selected_domain";

export default function HomePage() {
  const stateVector = React.useMemo(() => ({ intensity: 0.5, volatility: 0 }), []);
  const [selectedDomainId, setSelectedDomainId] = React.useState<string>(DEFAULT_LAUNCH_DOMAIN_ID);
  const [domainConfirmed, setDomainConfirmed] = React.useState<boolean>(false);
  const [themeMode, setThemeModeState] = React.useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [prefersDark, setPrefersDark] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    setThemeModeState(readStoredThemeMode());
    setPrefersDark(getSystemPrefersDark());
  }, []);

  const resolvedTheme: ResolvedUiTheme = React.useMemo(
    () => resolveThemeMode(themeMode, prefersDark),
    [themeMode, prefersDark]
  );

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (themeMode !== "auto") return undefined;
    setPrefersDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [themeMode]);

  const setThemeMode = React.useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    persistThemeMode(mode);
    const nextResolved = resolveThemeMode(mode, window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", nextResolved);
  }, []);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DOMAIN_STORAGE_KEY);
      if (stored) {
        const resolved = resolveDomainExperience(stored);
        setSelectedDomainId(resolved.experience.domainId);
      }
    } catch {
      // Ignore storage unavailability and fall back to the primary launch domain.
    }
  }, []);

  const handleSelectDomain = React.useCallback((domainId: string) => {
    const resolved = resolveDomainExperience(domainId);
    setSelectedDomainId(resolved.experience.domainId);
  }, []);

  const handleContinue = React.useCallback(() => {
    try {
      window.localStorage.setItem(DOMAIN_STORAGE_KEY, selectedDomainId);
    } catch {
      // Ignore storage failures in MVP mode.
    }
    setDomainConfirmed(true);
  }, [selectedDomainId]);

  const handleChangeDomain = React.useCallback(() => {
    setDomainConfirmed(false);
  }, []);

  const resolvedSelection = React.useMemo(
    () => resolveDomainExperience(selectedDomainId),
    [selectedDomainId]
  );

  return (
    <ErrorBoundary>
      <SceneStateProvider stateVector={stateVector as any}>
        <div
          id="nexora-viewport"
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
          {domainConfirmed ? (
            <>
              <button
                type="button"
                onClick={handleChangeDomain}
                title="Return to domain selection"
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 30,
                  ...tertiaryButtonStyle,
                }}
              >
                Switch workspace
              </button>
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
                  <InvestorDemoProvider>
                    <NexoraOperatorModeProvider>
                      <NexoraRunbookGuidanceProvider>
                        <NexoraShell>
                          <HomeScreen domainExperience={resolvedSelection} />
                        </NexoraShell>
                      </NexoraRunbookGuidanceProvider>
                    </NexoraOperatorModeProvider>
                  </InvestorDemoProvider>
                </NexoraUiThemeProvider>
              </div>
              {process.env.NODE_ENV !== "production" && getNexoraProductMode() !== "pilot" ? (
                <>
                  <NexoraDevTasksWidget workspaceDomainId={resolvedSelection.experience.domainId} />
                  <DebugInspector />
                </>
              ) : null}
            </>
          ) : (
            <DomainSelectionScreen
              selectedDomainId={selectedDomainId}
              onSelect={handleSelectDomain}
              onContinue={handleContinue}
            />
          )}
        </div>
      </SceneStateProvider>
    </ErrorBoundary>
  );
}
