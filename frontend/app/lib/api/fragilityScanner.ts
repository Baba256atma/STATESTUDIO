import { apiBase } from "../apiBase";
import { fetchJson } from "./fetchJson";
import type { FetchJsonError } from "./fetchJson";
import type {
  FragilityDriver,
  FragilitySceneHighlight,
  FragilitySceneObject,
  FragilityScenePayload,
  FragilityScanRequest,
  FragilityScanResponse,
} from "../../types/fragilityScanner";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeReasonsByObject(value: unknown): Record<string, string[]> | undefined {
  if (!isRecord(value)) return undefined;
  const normalized = Object.fromEntries(
    Object.entries(value).flatMap(([key, rawReasons]) => {
      if (typeof key !== "string" || !key.trim()) return [];
      const reasons = readStringArray(rawReasons) ?? [];
      return [[key, reasons]] as const;
    })
  );
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function normalizeSceneObject(value: unknown): FragilitySceneObject | null {
  if (!isRecord(value)) return null;
  const id = readString(value.id);
  if (!id) return null;
  return {
    id,
    emphasis: typeof value.emphasis === "number" && Number.isFinite(value.emphasis) ? value.emphasis : undefined,
    reason: typeof value.reason === "string" ? value.reason : undefined,
  };
}

function normalizeSceneHighlight(value: unknown): FragilitySceneHighlight | null {
  if (!isRecord(value)) return null;
  const type = readString(value.type);
  const target = readString(value.target);
  if (!type || !target) return null;
  return {
    type,
    target,
    severity: typeof value.severity === "string" ? value.severity : undefined,
  };
}

function normalizeScenePayload(value: unknown): FragilityScenePayload | undefined {
  if (!isRecord(value)) return undefined;
  return {
    highlighted_object_ids: readStringArray(value.highlighted_object_ids) ?? [],
    primary_object_ids: readStringArray(value.primary_object_ids) ?? [],
    affected_object_ids: readStringArray(value.affected_object_ids) ?? [],
    dim_unrelated_objects: value.dim_unrelated_objects === true,
    reasons_by_object: normalizeReasonsByObject(value.reasons_by_object),
    objects: Array.isArray(value.objects)
      ? value.objects.map(normalizeSceneObject).filter(Boolean) as FragilitySceneObject[]
      : [],
    highlights: Array.isArray(value.highlights)
      ? value.highlights.map(normalizeSceneHighlight).filter(Boolean) as FragilitySceneHighlight[]
      : [],
    state_vector: isRecord(value.state_vector)
      ? {
          fragility_score:
            typeof value.state_vector.fragility_score === "number" && Number.isFinite(value.state_vector.fragility_score)
              ? value.state_vector.fragility_score
              : undefined,
          fragility_level:
            typeof value.state_vector.fragility_level === "string" ? value.state_vector.fragility_level : undefined,
          scanner_mode:
            typeof value.state_vector.scanner_mode === "string" ? value.state_vector.scanner_mode : undefined,
        }
      : undefined,
    suggested_focus: readStringArray(value.suggested_focus) ?? [],
    scanner_overlay: isRecord(value.scanner_overlay)
      ? {
          summary: typeof value.scanner_overlay.summary === "string" ? value.scanner_overlay.summary : undefined,
          top_driver_ids: readStringArray(value.scanner_overlay.top_driver_ids),
        }
      : undefined,
  };
}

function normalizeDriver(value: unknown): FragilityDriver | null {
  if (!isRecord(value)) return null;
  const id = readString(value.id);
  const label = readString(value.label);
  const rawEvidence = value.evidence_text;
  let evidenceText: string | null | undefined = undefined;
  if (typeof rawEvidence === "string") {
    evidenceText = rawEvidence;
  } else if (rawEvidence === null) {
    evidenceText = null;
  }
  if (!id || !label) return null;
  return {
    id,
    label,
    score: readNumber(value.score),
    severity: readString(value.severity, "unknown"),
    dimension: typeof value.dimension === "string" ? value.dimension : undefined,
    evidence_text: evidenceText,
  };
}

function normalizeFragilityScanResponse(value: unknown): FragilityScanResponse | null {
  if (!isRecord(value)) return null;
  const summary = readString(value.summary);
  const level = readString(value.fragility_level);
  if (typeof value.ok !== "boolean" || !summary || !level) return null;

  const drivers = Array.isArray(value.drivers) ? value.drivers.map(normalizeDriver).filter(Boolean) as FragilityDriver[] : [];

  return {
    ok: value.ok,
    summary,
    fragility_score: readNumber(value.fragility_score),
    fragility_level: level,
    drivers,
    findings: Array.isArray(value.findings) ? value.findings : undefined,
    suggested_objects: readStringArray(value.suggested_objects),
    suggested_actions: readStringArray(value.suggested_actions),
    scene_payload: normalizeScenePayload(value.scene_payload),
    debug: isRecord(value.debug) ? value.debug : null,
  };
}

function toReadableError(error: unknown): string {
  if (isRecord(error)) {
    const fetchError = error as FetchJsonError;
    if (typeof fetchError.status === "number") {
      return `Fragility scan failed (${fetchError.status}).`;
    }
    if (typeof fetchError.message === "string" && fetchError.message.trim()) {
      return fetchError.message;
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "Unable to run fragility scan right now.";
}

export async function runFragilityScan(payload: FragilityScanRequest): Promise<FragilityScanResponse> {
  const text = payload.text.trim();
  if (!text) {
    throw new Error("Please enter business text before running the scan.");
  }

  try {
    const response = await fetchJson(`${apiBase()}/scanner/fragility`, {
      method: "POST",
      body: {
        ...payload,
        text,
        mode: typeof payload.mode === "string" && payload.mode.trim() ? payload.mode : "business",
      },
      retryNetworkErrors: false,
    });
    const normalized = normalizeFragilityScanResponse(response);
    if (!normalized) {
      throw new Error("Invalid fragility scan response.");
    }
    if (!normalized.ok) {
      throw new Error("Fragility scan did not complete successfully.");
    }
    return normalized;
  } catch (error) {
    throw new Error(toReadableError(error));
  }
}
