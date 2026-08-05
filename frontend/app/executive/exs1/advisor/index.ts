export {
  buildExecutiveAdvisorContext,
  formatAdvisorContextBrief,
} from "./ExecutiveAdvisorContextBuilder";
export {
  createProposalId,
  runExecutiveAdvisorEngine,
} from "./ExecutiveAdvisorEngine";
export {
  ADVISOR_PROMPT_TEMPLATES,
  selectPromptTemplate,
} from "./ExecutiveAdvisorPromptTemplates";
export {
  createInitialAdvisorSession,
  markProposalStatus,
  rememberAdvisorExplanation,
  rememberAdvisorQuestion,
  syncPendingProposals,
} from "./ExecutiveAdvisorSession";
export type { ExecutiveAdvisorSessionState } from "./ExecutiveAdvisorSession";
export type {
  AdvisorConversationMode,
  AdvisorEngineResult,
  AdvisorProposal,
  AdvisorProposalKind,
  AdvisorReference,
  AdvisorSuggestion,
  AdvisorSuggestionKind,
  ExecutiveAdvisorContext,
} from "./ExecutiveAdvisorTypes";
export { ExecutiveAdvisorProvider } from "./ExecutiveAdvisorProvider";
export { useExecutiveAdvisor } from "./hooks/useExecutiveAdvisor";
export { ExecutiveAdvisorSuggestionCard } from "./ExecutiveAdvisorSuggestionCard";
export { ExecutiveAdvisorProposalCard } from "./ExecutiveAdvisorProposalCard";
export { ExecutiveAdvisorReference } from "./ExecutiveAdvisorReference";
export { ExecutiveAdvisorConversation } from "./ExecutiveAdvisorConversation";
export { ExecutiveAdvisorHeader } from "./ExecutiveAdvisorHeader";
export { ExecutiveAdvisorStatusStrip } from "./ExecutiveAdvisorStatusStrip";
export { ExecutiveAdvisorCollapseButton } from "./ExecutiveAdvisorCollapseButton";
export { ExecutiveHelpPopover } from "./ExecutiveHelpPopover";
export { ExecutiveContextPopover } from "./ExecutiveContextPopover";
export { ExecutiveSuggestionPopover } from "./ExecutiveSuggestionPopover";
export { ExecutiveFooterActions } from "./ExecutiveFooterActions";
export { ExecutiveAdvisorFooter } from "./ExecutiveAdvisorFooter";
export { ExecutiveActionInboxButton } from "./ExecutiveActionInboxButton";
export { ExecutiveActionInboxDropdown } from "./ExecutiveActionInboxDropdown";
export { ExecutiveActionInboxItem } from "./ExecutiveActionInboxItem";
export { ExecutiveActionBadge } from "./ExecutiveActionBadge";
export {
  buildExecutiveActionItems,
  useExecutiveActionInbox,
  findProposalForAction,
} from "./hooks/useExecutiveActionInbox";
export type {
  ExecutiveActionItem,
  ExecutiveActionType,
  ExecutiveActionPriority,
} from "./hooks/useExecutiveActionInbox";
export {
  getAdvisorInspectorSnapshot,
  publishAdvisorInspectorSnapshot,
  subscribeAdvisorInspector,
} from "./advisorInspectorBridge";
