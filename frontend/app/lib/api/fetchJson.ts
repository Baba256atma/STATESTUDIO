export type FetchJsonError = {
  message: string;
  status?: number;
  details?: unknown;
};

type FetchJsonOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  retryNetworkErrors?: boolean;
};

const DEFAULT_TIMEOUT = 10_000;

export async function fetchJson(url: string, options: FetchJsonOptions = {}): Promise<unknown> {
  const {
    method = "GET",
    headers = {},
    body,
    timeoutMs = DEFAULT_TIMEOUT,
    retryNetworkErrors = true,
  } = options;

  const attempt = async (abortSignal: AbortSignal) => {
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: abortSignal,
      });
    } catch (err: any) {
      throw <FetchJsonError>{
        message: err?.message || "Network request failed",
        details: err,
      };
    }
    if (!res.ok) {
      let details: unknown = undefined;
      let message = "Request failed";
      try {
        details = await res.json();
        const detailMessage =
          typeof (details as any)?.detail?.error?.message === "string"
            ? (details as any).detail.error.message
            : typeof (details as any)?.detail?.message === "string"
              ? (details as any).detail.message
              : typeof (details as any)?.detail === "string"
                ? (details as any).detail
                : typeof (details as any)?.error?.message === "string"
                  ? (details as any).error.message
                  : null;
        if (detailMessage && detailMessage.trim()) {
          message = detailMessage;
        }
      } catch {
        details = undefined;
      }
      throw <FetchJsonError>{
        message,
        status: res.status,
        details,
      };
    }
    try {
      return await res.json();
    } catch (err: any) {
      throw <FetchJsonError>{
        message: "Invalid JSON response",
        status: res.status,
        details: err?.message,
      };
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await attempt(controller.signal);
  } catch (err: any) {
    const firstError = err as FetchJsonError;
    const isNetworkError = firstError.status === undefined;
    if (retryNetworkErrors && isNetworkError) {
      try {
        return await attempt(controller.signal);
      } catch (err2: any) {
        throw err2 as FetchJsonError;
      }
    }
    throw firstError;
  } finally {
    clearTimeout(timer);
  }
}
