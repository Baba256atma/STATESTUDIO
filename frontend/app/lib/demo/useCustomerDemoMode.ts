"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getCustomerDemoProfile, getDefaultCustomerDemoProfileId } from "./customerDemoProfiles";
import type { CustomerDemoProfile, CustomerDemoState } from "./customerDemoTypes";

const STORAGE_KEY = "nexora.customer_demo_profile";
const EVENT_NAME = "nexora:customer-demo-profile-changed";

function readStoredProfileId() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? String(value) : null;
}

function broadcastProfileId(profileId: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<{ profileId: string | null }>(EVENT_NAME, { detail: { profileId } }));
}

export function useCustomerDemoMode(defaultDomainId?: string | null): CustomerDemoState & {
  setActiveProfile: (profileId: string | null) => void;
  clearDemoMode: () => void;
  recommendedPrompts: string[];
  heroSummary: string | null;
  headerContextLabel: string | null;
} {
  const defaultProfileId = useMemo(() => getDefaultCustomerDemoProfileId(defaultDomainId), [defaultDomainId]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => readStoredProfileId() ?? defaultProfileId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readStoredProfileId()) return;
    setActiveProfileId((current) => current ?? defaultProfileId);
  }, [defaultProfileId]);

  useEffect(() => {
    const onProfileChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ profileId?: string | null }>).detail;
      setActiveProfileId(typeof detail?.profileId === "string" ? detail.profileId : detail?.profileId === null ? null : readStoredProfileId());
    };
    window.addEventListener(EVENT_NAME, onProfileChanged as EventListener);
    return () => window.removeEventListener(EVENT_NAME, onProfileChanged as EventListener);
  }, []);

  const setActiveProfile = useCallback((profileId: string | null) => {
    if (typeof window !== "undefined") {
      if (profileId) window.localStorage.setItem(STORAGE_KEY, profileId);
      else window.localStorage.removeItem(STORAGE_KEY);
    }
    setActiveProfileId(profileId);
    broadcastProfileId(profileId);
  }, []);

  const clearDemoMode = useCallback(() => {
    setActiveProfile(null);
  }, [setActiveProfile]);

  const activeProfile: CustomerDemoProfile | null = useMemo(
    () => getCustomerDemoProfile(activeProfileId),
    [activeProfileId]
  );

  return {
    activeProfileId: activeProfile?.id ?? null,
    activeProfile,
    isDemoMode: !!activeProfile,
    setActiveProfile,
    clearDemoMode,
    recommendedPrompts: activeProfile?.recommended_prompts ?? [],
    heroSummary: activeProfile?.hero_summary ?? null,
    headerContextLabel: activeProfile?.header_context_label ?? null,
  };
}
