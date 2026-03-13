"use client";

import { useCallback, useEffect, useState } from "react";
import type { CompanyConfigPayload } from "../lib/companyConfigTypes";
import { apiBase, companyId } from "../lib/apiBase";

const cached: Record<string, CompanyConfigPayload> = {};

export function useCompanyConfig(companyOverride?: string): {
  config: CompanyConfigPayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const id = companyOverride || companyId();
  const [config, setConfig] = useState<CompanyConfigPayload | null>(cached[id] ?? null);
  const [loading, setLoading] = useState<boolean>(!cached[id]);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError(null);
      const query = refresh ? "?refresh=1" : "";
      try {
        const res = await fetch(`${apiBase()}/config/${id}${query}`);
        if (!res.ok) {
          throw new Error(`Config fetch failed: ${res.status}`);
        }
        const payload = (await res.json()) as { ok?: boolean; data?: CompanyConfigPayload };
        if (!payload?.ok || !payload.data) {
          throw new Error("Config response invalid");
        }
        cached[id] = payload.data;
        setConfig(payload.data);
      } catch (err: any) {
        setError(err?.message ?? "Config fetch failed");
        setConfig(refresh ? null : cached[id] ?? null);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (cached[id]) {
      setConfig(cached[id]);
      setLoading(false);
      return;
    }
    fetchConfig(false);
  }, [fetchConfig, id]);

  const refresh = useCallback(() => {
    fetchConfig(true);
  }, [fetchConfig]);

  return { config, loading, error, refresh };
}
