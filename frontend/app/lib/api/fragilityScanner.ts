import { apiBase } from "../apiBase";
import { fetchJson } from "./fetchJson";
import type { FragilityScanRequest, FragilityScanResponse } from "../../types/fragilityScanner";

function isFragilityScanResponse(value: unknown): value is FragilityScanResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.ok === "boolean" &&
    typeof candidate.summary === "string" &&
    typeof candidate.fragility_score === "number" &&
    typeof candidate.fragility_level === "string" &&
    Array.isArray(candidate.drivers) &&
    Array.isArray(candidate.findings) &&
    Array.isArray(candidate.suggested_objects) &&
    Array.isArray(candidate.suggested_actions) &&
    !!candidate.scene_payload &&
    typeof candidate.scene_payload === "object"
  );
}

export async function runFragilityScan(
  payload: FragilityScanRequest
): Promise<FragilityScanResponse> {
  const response = await fetchJson(`${apiBase()}/scanner/fragility`, {
    method: "POST",
    body: payload,
    retryNetworkErrors: false,
  });

  if (!isFragilityScanResponse(response)) {
    throw new Error("Invalid fragility scan response");
  }

  return response;
}
