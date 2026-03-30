import type { DecisionExecutionPayload, DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import { buildPreviewDecisionExecutionResult } from "./buildPreviewDecisionExecutionResult";
import type { DecisionExecutionIntent } from "./decisionExecutionIntent";

export type ExecutionSafetyResult = {
  success: boolean;
  mode: "real" | "preview" | "failed";
  result?: DecisionExecutionResult;
  error?: string;
};

type SafeExecuteDecisionContext = {
  endpoint?: string | null;
  payload?: DecisionExecutionPayload | null;
  responseData?: unknown;
  timeoutMs?: number;
  safeExecutionOnly?: boolean;
  executor?: (
    endpoint: string,
    payload: DecisionExecutionPayload
  ) => Promise<DecisionExecutionResult>;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`Decision execution timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

export async function safeExecuteDecision(
  intent: DecisionExecutionIntent | null,
  context: SafeExecuteDecisionContext
): Promise<ExecutionSafetyResult> {
  const timeoutMs = Math.max(100, context.timeoutMs ?? 1800);
  const canExecuteReal = Boolean(
    !context.safeExecutionOnly && intent && context.endpoint && context.payload && context.executor
  );

  if (!canExecuteReal) {
    if (!intent) {
      return {
        success: false,
        mode: "failed",
        error: "No actionable decision intent is available.",
      };
    }
    return {
      success: true,
      mode: "preview",
      result: buildPreviewDecisionExecutionResult({
        intent,
        responseData: context.responseData ?? null,
      }),
      error: context.safeExecutionOnly
        ? "Safe execution only is enabled, so Nexora stayed in preview mode."
        : "Execution context was incomplete, so Nexora fell back to preview mode.",
    };
  }

  try {
    const result = await withTimeout(
      context.executor!(context.endpoint!, context.payload!),
      timeoutMs
    );
    return {
      success: true,
      mode: "real",
      result,
    };
  } catch (error) {
    if (!intent) {
      return {
        success: false,
        mode: "failed",
        error: error instanceof Error ? error.message : "Decision execution failed.",
      };
    }
    return {
      success: true,
      mode: "preview",
      result: buildPreviewDecisionExecutionResult({
        intent,
        responseData: context.responseData ?? null,
      }),
      error:
        error instanceof Error
          ? `${error.message} Falling back to preview mode.`
          : "Decision execution failed. Falling back to preview mode.",
    };
  }
}
