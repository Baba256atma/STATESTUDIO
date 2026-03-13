"use client";

import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SceneStateProvider } from "./components/SceneContext";
import { HomeScreen } from "./screens/HomeScreen";
import NexoraShell from "./components/NexoraShell";
import { DomainSelectionScreen } from "./components/DomainSelectionScreen";
import { resolveDomainExperience } from "./lib/domain/domainExperienceRegistry";
import { DEFAULT_LAUNCH_DOMAIN_ID } from "./lib/product/mvpShippingPlan";

const DOMAIN_STORAGE_KEY = "nexora.selected_domain";

export default function HomePage() {
  const stateVector = React.useMemo(() => ({ intensity: 0.5, volatility: 0 }), []);
  const [selectedDomainId, setSelectedDomainId] = React.useState<string>(DEFAULT_LAUNCH_DOMAIN_ID);
  const [domainConfirmed, setDomainConfirmed] = React.useState<boolean>(false);

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
          }}
        >
          {domainConfirmed ? (
            <>
              <button
                type="button"
                onClick={handleChangeDomain}
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 30,
                  height: 32,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(15,23,42,0.7)",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Change Domain
              </button>
              <NexoraShell>
                <HomeScreen domainExperience={resolvedSelection} />
              </NexoraShell>
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
