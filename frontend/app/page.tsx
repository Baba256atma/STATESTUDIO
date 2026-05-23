"use client";

import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DomainSelectionScreen } from "./components/DomainSelectionScreen";
import { NexoraManagerWorkspaceShell } from "./components/workspace/NexoraManagerWorkspaceShell";
import { resolveDomainExperience } from "./lib/domain/domainExperienceRegistry";
import { DEFAULT_LAUNCH_DOMAIN_ID } from "./lib/product/mvpShippingPlan";

const DOMAIN_STORAGE_KEY = "nexora.selected_domain";

export default function HomePage() {
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

  const resolvedSelection = React.useMemo(
    () => resolveDomainExperience(selectedDomainId),
    [selectedDomainId]
  );

  return (
    <ErrorBoundary>
      {domainConfirmed ? (
        <NexoraManagerWorkspaceShell
          domainId={resolvedSelection.experience.domainId}
          organizationId={`nexora-${resolvedSelection.experience.domainId}`}
          sessionHydrated={domainConfirmed}
        />
      ) : (
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
          <DomainSelectionScreen
            selectedDomainId={selectedDomainId}
            onSelect={handleSelectDomain}
            onContinue={handleContinue}
          />
        </div>
      )}
    </ErrorBoundary>
  );
}
