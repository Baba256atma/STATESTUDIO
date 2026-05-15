import { validateDomainProjectSnapshot } from "./domainProjectValidation.ts";
import type {
  DomainProjectLoadResult,
  DomainProjectSaveResult,
  DomainProjectSnapshot,
} from "./domainProjectTypes.ts";

export const DOMAIN_PROJECT_STORAGE_KEY = "nexora.domain.project.v1";

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function saveDomainProjectSnapshot(
  snapshot: DomainProjectSnapshot
): DomainProjectSaveResult {
  const validation = validateDomainProjectSnapshot(snapshot);
  if (!validation.valid) {
    return {
      success: false,
      warnings: validation.warnings,
    };
  }

  const storage = getLocalStorage();
  if (!storage) {
    return {
      success: false,
      warnings: ["local_storage_unavailable"],
    };
  }

  try {
    storage.setItem(DOMAIN_PROJECT_STORAGE_KEY, JSON.stringify(snapshot));
    return { success: true, snapshot };
  } catch {
    return {
      success: false,
      warnings: ["local_storage_write_failed"],
    };
  }
}

export function loadDomainProjectSnapshot(): DomainProjectLoadResult {
  const storage = getLocalStorage();
  if (!storage) {
    return {
      success: false,
      warnings: ["local_storage_unavailable"],
    };
  }

  try {
    const raw = storage.getItem(DOMAIN_PROJECT_STORAGE_KEY);
    if (!raw) {
      return {
        success: false,
        warnings: ["snapshot_not_found"],
      };
    }
    const parsed = JSON.parse(raw) as unknown;
    const validation = validateDomainProjectSnapshot(parsed);
    if (!validation.valid) {
      return {
        success: false,
        warnings: validation.warnings,
      };
    }
    return {
      success: true,
      snapshot: parsed as DomainProjectSnapshot,
    };
  } catch {
    return {
      success: false,
      warnings: ["local_storage_read_failed"],
    };
  }
}

export function clearDomainProjectSnapshot(): {
  success: boolean;
  warnings?: string[];
} {
  const storage = getLocalStorage();
  if (!storage) {
    return {
      success: false,
      warnings: ["local_storage_unavailable"],
    };
  }

  try {
    storage.removeItem(DOMAIN_PROJECT_STORAGE_KEY);
    return { success: true };
  } catch {
    return {
      success: false,
      warnings: ["local_storage_clear_failed"],
    };
  }
}
