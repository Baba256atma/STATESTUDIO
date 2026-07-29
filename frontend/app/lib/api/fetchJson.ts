import { readUnknownErrorMessage } from "../system/nexoraErrors";

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

function readNestedStringMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value !== "object" || value === null) return null;
  if ("message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
}

function extractDetailsErrorMessage(details: unknown): string | null {
  if (typeof details === "string" && details.trim()) return details;
  if (typeof details !== "object" || details === null) return null;

  const detail = "detail" in details ? (details as { detail?: unknown }).detail : undefined;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (typeof detail === "object" && detail !== null) {
    if ("error" in detail) {
      const nested = readNestedStringMessage((detail as { error?: unknown }).error);
      if (nested) return nested;
    }
    const direct = readNestedStringMessage(detail);
    if (direct) return direct;
  }

  if ("error" in details) {
    const nested = readNestedStringMessage((details as { error?: unknown }).error);
    if (nested) return nested;
  }

  return null;
}

function isFetchJsonError(err: unknown): err is FetchJsonError {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  );
}

function toFetchJsonError(err: unknown, fallbackMessage: string): FetchJsonError {
  if (isFetchJsonError(err)) return err;
  return { message: readUnknownErrorMessage(err, fallbackMessage) };
}

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
    } catch (err: unknown) {
      throw <FetchJsonError>{
        message: readUnknownErrorMessage(err, "Network request failed"),
        details: err,
      };
    }
    if (!res.ok) {
      let details: unknown = undefined;
      let message = "Request failed";
      try {
        details = await res.json();
        const detailMessage = extractDetailsErrorMessage(details);
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
    } catch (err: unknown) {
      let details: unknown = undefined;
      if (typeof err === "object" && err !== null && "message" in err) {
        const message = (err as { message?: unknown }).message;
        if (typeof message === "string") details = message;
      }
      throw <FetchJsonError>{
        message: "Invalid JSON response",
        status: res.status,
        details,
      };
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await attempt(controller.signal);
  } catch (err: unknown) {
    const firstError = toFetchJsonError(err, "Request failed");
    const isNetworkError = firstError.status === undefined;
    if (retryNetworkErrors && isNetworkError) {
      try {
        return await attempt(controller.signal);
      } catch (err2: unknown) {
        throw toFetchJsonError(err2, "Request failed");
      }
    }
    throw firstError;
  } finally {
    clearTimeout(timer);
  }
}
