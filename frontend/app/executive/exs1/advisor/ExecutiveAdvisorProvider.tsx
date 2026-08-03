"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useExecutiveMetadata } from "../metadata";
import {
  useExecutiveRuntimeState,
  useExecutiveRuntimeStoreApi,
} from "../runtime";
import { buildExecutiveAdvisorContext } from "./ExecutiveAdvisorContextBuilder";
import { runExecutiveAdvisorEngine } from "./ExecutiveAdvisorEngine";
import { publishAdvisorInspectorSnapshot } from "./advisorInspectorBridge";
import {
  createInitialAdvisorSession,
  markProposalStatus,
  rememberAdvisorExplanation,
  rememberAdvisorQuestion,
  type ExecutiveAdvisorSessionState,
} from "./ExecutiveAdvisorSession";
import type {
  AdvisorEngineResult,
  AdvisorProposal,
  AdvisorReference,
  ExecutiveAdvisorContext,
} from "./ExecutiveAdvisorTypes";

export type ExecutiveAdvisorContextValue = {
  readonly context: ExecutiveAdvisorContext;
  readonly engine: AdvisorEngineResult;
  readonly session: ExecutiveAdvisorSessionState;
  readonly ask: (question: string) => void;
  readonly approveProposal: (proposalId: string) => void;
  readonly dismissProposal: (proposalId: string) => void;
  readonly focusReference: (reference: AdvisorReference) => void;
};

export const ExecutiveAdvisorReactContext =
  createContext<ExecutiveAdvisorContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveAdvisorProvider — Runtime-aware Advisor session.
 * Publishes advisor events; applies Runtime mutations only after approval.
 */
export function ExecutiveAdvisorProvider({ children }: Props) {
  const store = useExecutiveRuntimeStoreApi();
  const runtimeState = useExecutiveRuntimeState((s) => s);
  const { catalog } = useExecutiveMetadata();
  const context = useMemo(
    () => buildExecutiveAdvisorContext(runtimeState, catalog),
    [runtimeState, catalog],
  );

  const engineBase = useMemo(
    () => runExecutiveAdvisorEngine(context),
    [context],
  );

  const [session, setSession] = useState<ExecutiveAdvisorSessionState>(() =>
    createInitialAdvisorSession(context.packTitle),
  );

  const lastSignatureRef = useRef<string>("");

  useEffect(() => {
    const signature = [
      context.mode,
      context.packId,
      context.selectedObjectId,
      context.scenarioId,
      context.decisionId,
      context.decisionStatus,
      context.executionStatus,
      context.monitoringHealth,
      context.dataSourceId,
      context.dataActive ? "1" : "0",
    ].join("|");

    if (signature === lastSignatureRef.current) return;
    lastSignatureRef.current = signature;

    const nextEngine = runExecutiveAdvisorEngine(context);
    setSession((prev) => {
      const explained = rememberAdvisorExplanation(
        prev,
        nextEngine.explanation,
        context.packTitle,
      );
      return {
        ...explained,
        pendingProposals: nextEngine.proposals.map((p) => ({
          ...p,
          status: "pending" as const,
        })),
        lastAdvisorEvent: "AdvisorExplanationGenerated",
      };
    });
    store.emit("AdvisorExplanationGenerated", {
      mode: context.mode,
      conversationMode: nextEngine.conversationMode,
    });
  }, [context, store]);

  const pendingProposals = session.pendingProposals;
  const engine: AdvisorEngineResult = useMemo(
    () => ({
      ...engineBase,
      proposals: pendingProposals.length
        ? pendingProposals
        : engineBase.proposals,
    }),
    [engineBase, pendingProposals],
  );

  useEffect(() => {
    const lastPending =
      session.pendingProposals.find((p) => p.status === "pending") ?? null;
    publishAdvisorInspectorSnapshot({
      conversationMode: engine.conversationMode,
      mode: context.mode,
      packTitle: context.packTitle,
      lastProposal: lastPending?.title ?? null,
      pendingCount: session.pendingProposals.filter((p) => p.status === "pending")
        .length,
      lastAdvisorEvent: session.lastAdvisorEvent,
    });
  }, [engine.conversationMode, context.mode, context.packTitle, session]);

  const ask = useCallback((question: string) => {
    setSession((prev) => rememberAdvisorQuestion(prev, question));
  }, []);

  const executeApprovedProposal = useCallback(
    (proposal: AdvisorProposal) => {
      const actions = store.actions;
      switch (proposal.kind) {
        case "Create Scenario":
          actions.addScenario({
            name: `Advisor Scenario · ${context.packTitle}`,
            description: "Created from approved Advisor proposal (mock).",
            color: "#38bdf8",
            cloneFromId: context.scenarioId,
          });
          break;
        case "Approve Decision":
          if (proposal.decisionId) actions.approveDecision(proposal.decisionId);
          break;
        case "Start Execution":
          actions.startExecution();
          break;
        case "Take Snapshot":
          actions.createMonitoringSnapshot();
          break;
        case "Open Data Mapping":
          actions.setNav("Data");
          actions.setDataSection("Mappings");
          break;
        case "Focus Object":
          if (proposal.objectId) actions.selectObject(proposal.objectId);
          break;
        case "Open Journal":
          actions.setNav("Journal");
          break;
        case "Open Objects":
          actions.setNav("Objects");
          break;
        case "Open Model":
          actions.setNav("Model");
          break;
        case "Highlight Pack":
          if (proposal.packId) actions.selectPack(proposal.packId);
          break;
        case "Focus Timeline":
          if (proposal.lens) actions.selectLens(proposal.lens);
          break;
        default:
          break;
      }
    },
    [store, context.packTitle, context.scenarioId],
  );

  const approveProposal = useCallback(
    (proposalId: string) => {
      const proposal = session.pendingProposals.find((p) => p.id === proposalId);
      if (!proposal || proposal.status !== "pending") return;
      store.emit("AdvisorProposalCreated", { proposalId, kind: proposal.kind });
      executeApprovedProposal(proposal);
      setSession((prev) => markProposalStatus(prev, proposalId, "accepted"));
      store.emit("AdvisorSuggestionAccepted", {
        proposalId,
        kind: proposal.kind,
      });
    },
    [session.pendingProposals, executeApprovedProposal, store],
  );

  const dismissProposal = useCallback(
    (proposalId: string) => {
      const proposal = session.pendingProposals.find((p) => p.id === proposalId);
      if (!proposal || proposal.status !== "pending") return;
      setSession((prev) => markProposalStatus(prev, proposalId, "dismissed"));
      store.emit("AdvisorSuggestionDismissed", {
        proposalId,
        kind: proposal.kind,
      });
    },
    [session.pendingProposals, store],
  );

  const focusReference = useCallback(
    (reference: AdvisorReference) => {
      const actions = store.actions;
      store.emit("AdvisorFocusRequested", {
        kind: reference.kind,
        label: reference.label,
      });
      if (reference.objectId) {
        actions.selectObject(reference.objectId);
        return;
      }
      if (reference.packId) {
        actions.selectPack(reference.packId);
        return;
      }
      if (reference.scenarioId) {
        actions.setCurrentScenario(reference.scenarioId);
        return;
      }
      if (reference.decisionId) {
        actions.setCurrentDecision(reference.decisionId);
        return;
      }
      if (reference.lens) {
        actions.selectLens(reference.lens);
        return;
      }
      if (reference.nav) {
        actions.setNav(reference.nav);
      }
    },
    [store],
  );

  const value = useMemo(
    () => ({
      context,
      engine,
      session,
      ask,
      approveProposal,
      dismissProposal,
      focusReference,
    }),
    [
      context,
      engine,
      session,
      ask,
      approveProposal,
      dismissProposal,
      focusReference,
    ],
  );

  return (
    <ExecutiveAdvisorReactContext.Provider value={value}>
      {children}
    </ExecutiveAdvisorReactContext.Provider>
  );
}
