import type {
  AnalyzeFullIn,
  AnalyzeFullResponse,
  ChatIn,
  ChatResponseOut,
  DecisionExecutionRequest,
  DecisionExecutionResponse,
} from "./generated";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:8000";

type JsonRequestOptions = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

async function getJson<TResponse>(path: string, options?: JsonRequestOptions): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      ...(options?.headers ?? {}),
    },
    signal: options?.signal,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { detail?: { error?: { message?: string } }; error?: { message?: string } } | null)?.detail?.error
        ?.message ??
      (data as { error?: { message?: string } } | null)?.error?.message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as TResponse;
}

async function postJson<TRequest, TResponse>(
  path: string,
  payload: TRequest,
  options?: JsonRequestOptions
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    body: JSON.stringify(payload),
    signal: options?.signal,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { detail?: { error?: { message?: string } }; error?: { message?: string } } | null)?.detail?.error
        ?.message ??
      (data as { error?: { message?: string } } | null)?.error?.message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as TResponse;
}

export { getJson, postJson };

export async function postChat(
  payload: ChatIn,
  options?: JsonRequestOptions
): Promise<ChatResponseOut> {
  return postJson<ChatIn, ChatResponseOut>("/chat", payload, options);
}

export async function postAnalyzeFull(
  payload: AnalyzeFullIn,
  options?: JsonRequestOptions
): Promise<AnalyzeFullResponse> {
  return postJson<AnalyzeFullIn, AnalyzeFullResponse>("/analyze/full", payload, options);
}

export async function postDecisionExecution(
  endpoint: "/decision/simulate" | "/decision/compare",
  payload: DecisionExecutionRequest,
  options?: JsonRequestOptions
): Promise<DecisionExecutionResponse> {
  return postJson<DecisionExecutionRequest, DecisionExecutionResponse>(endpoint, payload, options);
}

export type StrategicAnalysisTextIn = { text: string };
export type StrategicAnalysisTextOut = { ok: boolean; decision_analysis: Record<string, unknown> | null };

/** Same engine path as chat ``decision_analysis`` attachment; used on domain demo / scenario load. */
export async function postStrategicAnalysisText(
  payload: StrategicAnalysisTextIn,
  options?: JsonRequestOptions
): Promise<StrategicAnalysisTextOut> {
  return postJson<StrategicAnalysisTextIn, StrategicAnalysisTextOut>(
    "/decision/strategic-analysis-text",
    payload,
    options
  );
}
