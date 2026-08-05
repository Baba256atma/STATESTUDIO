"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useExecutiveAdvisor } from "../advisor/hooks/useExecutiveAdvisor";
import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import { ExecutiveRuntimeIntelligenceContext } from "../intelligence/ExecutiveRuntimeIntelligenceProvider";
import { ExecutiveSimulationContext } from "../simulation/ExecutiveSimulationProvider";
import { useExecutiveRuntimeStoreApi } from "../runtime";
import type { ExecutiveAdvisorTab } from "../shell/executiveCockpitTypes";
import {
  CONVERSATION_STREAM_CHUNK_MS,
  CONVERSATION_THINKING_MS,
  QUICK_ACTION_PROMPTS,
  type ConversationQuickAction,
} from "./ExecutiveConversationConfig";
import {
  buildConversationTurn,
  streamConversationText,
} from "./ExecutiveConversationController";
import {
  appendUserMessage,
  beginAssistantMessage,
  buildSuggestedQuestions,
  buildWelcomeCopy,
  createEmptyConversationSession,
  filterConversationMessages,
  patchMessage,
  resetConversationSession,
  setStreamState,
  type ConversationReference,
  type ConversationRuntimeFacts,
  type ExecutiveConversationSession,
} from "./ExecutiveConversationSession";

export type ExecutiveConversationContextValue = {
  readonly session: ExecutiveConversationSession;
  readonly welcomeCopy: string;
  readonly suggestions: readonly string[];
  readonly visibleMessages: ReturnType<typeof filterConversationMessages>;
  readonly pendingProposals: readonly AdvisorProposal[];
  readonly send: (text: string, perspective?: ExecutiveAdvisorTab) => void;
  readonly stop: () => void;
  readonly reset: () => void;
  readonly setSearchQuery: (query: string) => void;
  readonly runQuickAction: (
    action: ConversationQuickAction,
    perspective?: ExecutiveAdvisorTab,
  ) => void;
  readonly focusReference: (reference: ConversationReference) => void;
  readonly approveProposal: (proposalId: string) => void;
  readonly dismissProposal: (proposalId: string) => void;
  readonly dismissError: (messageId: string) => void;
  readonly copyText: (text: string) => void;
  readonly facts: ConversationRuntimeFacts;
};

export const ExecutiveConversationReactContext =
  createContext<ExecutiveConversationContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

export function ExecutiveConversationProvider({ children }: Props) {
  const advisor = useExecutiveAdvisor();
  const store = useExecutiveRuntimeStoreApi();
  const intelligence = useContext(ExecutiveRuntimeIntelligenceContext);
  const simulation = useContext(ExecutiveSimulationContext);

  const facts: ConversationRuntimeFacts = useMemo(() => {
    const signals = intelligence?.signals ?? [];
    const warningSignalCount = signals.filter(
      (s) => s.type === "Warning" || s.severity === "High",
    ).length;
    const criticalSignalCount = signals.filter(
      (s) => s.type === "Critical" || s.severity === "Critical",
    ).length;
    const sessions = simulation?.sessions ?? [];
    const simulationCompleted = sessions.some((s) => s.status === "Completed");
    const simulationSummary =
      simulation?.advisorFacts?.[0] ??
      (simulationCompleted ? "Inventory simulation finished" : null);
    const decisionStatus = advisor.context.decisionStatus ?? "";
    const pendingDecision =
      Boolean(advisor.context.decisionId) &&
      (decisionStatus === "Draft" ||
        decisionStatus === "Under Review" ||
        decisionStatus === "Pending Approval");

    return {
      modelName: "Manufacturing",
      warningSignalCount,
      criticalSignalCount,
      pendingDecision,
      decisionName: advisor.context.decisionName,
      simulationCompleted,
      simulationSummary,
      monitoringHealth: advisor.context.monitoringHealth,
      alertTitles: advisor.context.alertTitles,
    };
  }, [intelligence?.signals, simulation, advisor.context]);

  const [session, setSession] = useState<ExecutiveConversationSession>(() =>
    createEmptyConversationSession(advisor.context),
  );

  const abortRef = useRef<AbortController | null>(null);
  const perspectiveRef = useRef<ExecutiveAdvisorTab>("Assist");
  const generatingRef = useRef(false);

  useEffect(() => {
    setSession((prev) => ({
      ...prev,
      activePackTitle: advisor.context.packTitle,
      activeMode: advisor.context.mode,
      executiveGoal: advisor.context.goal,
    }));
  }, [
    advisor.context.packTitle,
    advisor.context.mode,
    advisor.context.goal,
  ]);

  const welcomeCopy = useMemo(
    () => buildWelcomeCopy(advisor.context, facts),
    [advisor.context, facts],
  );

  const suggestions = useMemo(
    () => buildSuggestedQuestions(advisor.context, facts),
    [advisor.context, facts],
  );

  const visibleMessages = useMemo(
    () => filterConversationMessages(session.messages, session.searchQuery),
    [session.messages, session.searchQuery],
  );

  const pendingProposals = useMemo(
    () =>
      advisor.engine.proposals.filter((p) => p.status === "pending").slice(0, 4),
    [advisor.engine.proposals],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    generatingRef.current = false;
    setSession((prev) => {
      if (!prev.streamingMessageId) {
        return setStreamState(prev, "cancelled", null);
      }
      const patched = patchMessage(prev, prev.streamingMessageId, {
        streamState: "cancelled",
        text:
          prev.messages.find((m) => m.id === prev.streamingMessageId)?.text ||
          "Generation stopped.",
      });
      return setStreamState(patched, "cancelled", null);
    });
  }, []);

  const send = useCallback(
    (text: string, perspective: ExecutiveAdvisorTab = perspectiveRef.current) => {
      const trimmed = text.trim();
      if (!trimmed || generatingRef.current) return;
      generatingRef.current = true;

      perspectiveRef.current = perspective;
      advisor.ask(trimmed);

      setSession((prev) => {
        const withUser = appendUserMessage(prev, trimmed);
        return beginAssistantMessage(withUser, perspective).session;
      });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      void (async () => {
        try {
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(resolve, CONVERSATION_THINKING_MS);
            const onAbort = () => {
              clearTimeout(timer);
              reject(new DOMException("Aborted", "AbortError"));
            };
            controller.signal.addEventListener("abort", onAbort, {
              once: true,
            });
          });

          const turn = buildConversationTurn(
            trimmed,
            perspective,
            advisor.context,
            advisor.engine,
            facts,
          );

          setSession((prev) => {
            if (!prev.streamingMessageId) return prev;
            return setStreamState(
              patchMessage(prev, prev.streamingMessageId, {
                streamState: "streaming",
                references: turn.references,
                proposals: turn.proposals,
                insight: turn.insight ?? undefined,
                retryPrompt: trimmed,
              }),
              "streaming",
            );
          });

          await streamConversationText(
            turn.text,
            (partial) => {
              setSession((prev) => {
                if (!prev.streamingMessageId) return prev;
                return patchMessage(prev, prev.streamingMessageId, {
                  text: partial,
                  streamState: "streaming",
                });
              });
            },
            {
              chunkMs: CONVERSATION_STREAM_CHUNK_MS,
              signal: controller.signal,
            },
          );

          setSession((prev) => {
            if (!prev.streamingMessageId) return prev;
            const completed = patchMessage(prev, prev.streamingMessageId, {
              streamState: "completed",
              references: turn.references,
              proposals: turn.proposals,
              insight: turn.insight ?? undefined,
            });
            return {
              ...setStreamState(completed, "completed", null),
              references: turn.references,
              pendingProposalIds: turn.proposals.map((p) => p.id),
            };
          });
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          setSession((prev) => {
            if (!prev.streamingMessageId) {
              return {
                ...prev,
                streamState: "error",
                lastError: "Conversation response failed.",
              };
            }
            const errored = patchMessage(prev, prev.streamingMessageId, {
              streamState: "error",
              error:
                "I could not complete that response. You can retry or continue.",
              retryPrompt: trimmed,
              text:
                prev.messages.find((m) => m.id === prev.streamingMessageId)
                  ?.text ?? "",
            });
            return {
              ...setStreamState(errored, "error", null),
              lastError: "Conversation response failed.",
            };
          });
        } finally {
          generatingRef.current = false;
          if (abortRef.current === controller) {
            abortRef.current = null;
          }
        }
      })();
    },
    [advisor, facts],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    generatingRef.current = false;
    setSession((prev) => resetConversationSession(prev, advisor.context));
  }, [advisor.context]);

  const setSearchQuery = useCallback((query: string) => {
    setSession((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const runQuickAction = useCallback(
    (
      action: ConversationQuickAction,
      perspective: ExecutiveAdvisorTab = perspectiveRef.current,
    ) => {
      send(QUICK_ACTION_PROMPTS[action], perspective);
    },
    [send],
  );

  const focusReference = useCallback(
    (reference: ConversationReference) => {
      const actions = store.actions;
      if (reference.kind === "signal") {
        if (reference.signalId) {
          intelligence?.setSelectedSignalId(reference.signalId);
        }
        actions.setNav(reference.nav ?? "Intelligence");
        return;
      }
      if (reference.kind === "simulation") {
        actions.setNav(reference.nav ?? "Simulations");
        return;
      }
      const kind =
        reference.kind === "object" ||
        reference.kind === "pack" ||
        reference.kind === "timeline" ||
        reference.kind === "scenario" ||
        reference.kind === "decision" ||
        reference.kind === "explorer"
          ? reference.kind
          : "explorer";
      advisor.focusReference({
        id: reference.id,
        kind,
        label: reference.label,
        objectId: reference.objectId,
        packId: reference.packId,
        scenarioId: reference.scenarioId,
        decisionId: reference.decisionId,
        nav: reference.nav,
        lens: reference.lens,
      });
    },
    [store, intelligence, advisor],
  );

  const dismissError = useCallback((messageId: string) => {
    setSession((prev) =>
      patchMessage(prev, messageId, { error: undefined }),
    );
  }, []);

  const copyText = useCallback((text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
    }
  }, []);

  const value = useMemo<ExecutiveConversationContextValue>(
    () => ({
      session,
      welcomeCopy,
      suggestions,
      visibleMessages,
      pendingProposals,
      send,
      stop,
      reset,
      setSearchQuery,
      runQuickAction,
      focusReference,
      approveProposal: advisor.approveProposal,
      dismissProposal: advisor.dismissProposal,
      dismissError,
      copyText,
      facts,
    }),
    [
      session,
      welcomeCopy,
      suggestions,
      visibleMessages,
      pendingProposals,
      send,
      stop,
      reset,
      setSearchQuery,
      runQuickAction,
      focusReference,
      advisor.approveProposal,
      advisor.dismissProposal,
      dismissError,
      copyText,
      facts,
    ],
  );

  return (
    <ExecutiveConversationReactContext.Provider value={value}>
      {children}
    </ExecutiveConversationReactContext.Provider>
  );
}
