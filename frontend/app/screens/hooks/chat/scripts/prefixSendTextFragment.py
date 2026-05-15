#!/usr/bin/env python3
"""Prefix HomeScreen sendText closure identifiers with `d.` for createChatPipelineSendText extraction."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAG = ROOT / "_sendTextFragment.txt"
OUT = ROOT / "chatPipelineSendTextLifecycle.body.ts"

# From HomeScreen sendTextImplementation useCallback dependency array (lines ~11588–11624).
DEPS_ARRAY = """
activeExecutiveObjectId
activeMode
activeDomainExperience
activeSidePanel
episodeId
focusMode
focusModeStore
focusedId
focusPinned
pinnedId
activeLoopIdStore
loading
objectProfiles
prefs
productModeContext
rightPanelTab
selectedObjectIdState
applyTypeCChatIntent
applyExecutionResultToUi
applyProductFlowViewModel
applyUICommands
buildChatRequestPayload
deriveProductFlowViewModel
sceneJson
emitChatResult
applyRetailTriggerEnhancement
applyUnifiedSceneReaction
pulseObjectByText
updateSelectedObjectInfo
updateObjectUx
finalizeChatRequest
isLatestChatRequest
isPilotProductMode
objectSelection
requestPanelAuthorityOpen
writeChatPipelineDebug
""".split()

# Mismatch fix: body uses upstream dedupe helper, not applyUnifiedSceneReaction.
ALIAS_REPLACE = {"applyUnifiedSceneReaction": "applyUnifiedSceneReactionUpstreamDedup"}

# Symbols used by the fragment but missing from the React dependency array (closure correctness).
EXTRA = [
    "markUserStartedFlow",
    "normalizeChatInputForDedup",
    "makeMsg",
    "appendMessages",
    "messagesRef",
    "setMessages",
    "saveProject",
    "pushHistory",
    "buildPersistedProjectSnapshot",
    "buildStarterSceneFromText",
    "applySceneChangeUpstreamDedup",
    "setObjectSelection",
    "setSelectedObjectIdState",
    "setEntryFlowState",
    "setCenterOverlay",
    "setCenterComponent",
    "setCenterComponentVisible",
    "lastChatDedupRef",
    "loopGuardInFlightByTextRef",
    "chatLoopGuardDepthRef",
    "chatLoopGuardActiveRef",
    "demoFlowPauseRef",
    "activeChatRequestRef",
    "chatRequestSeqRef",
    "latestChatPipelineRunIdRef",
    "activeChatDebugCorrelationRef",
    "isSendingRef",
    "setChatRequestStatus",
    "setLoading",
    "setChatDelayedBusy",
    "setCameraLockedByUser",
    "setNoSceneUpdate",
    "setSourceLabel",
    "setPrefs",
    "setEpisodeId",
    "setActiveMode",
    "setActiveSidePanel",
    "setSceneWarn",
    "setLastActions",
    "setMemory",
    "setOverrideRef",
    "clearAllOverridesRef",
    "pruneOverridesRef",
    "entryFlowStateRef",
    "selectedIdRef",
    "overridesRef",
    "pendingVisualPatchesRef",
    "analyzeInFlightRef",
    "analyzePreflightArmedRef",
    "analyzeSelectionLockRef",
    "passiveDeselectGuardUntilRef",
    "rightPanelRouteLockRef",
    "lastAppliedChatPipelineSignatureRef",
    "lastAppliedPanelEffectRef",
    "lastAppliedSceneEffectRef",
    "activePanelFamilyAuditRef",
    "pendingPanelFamilyAuditClearTimeoutRef",
    "nextDemoFlowSequence",
    "chatToBackendLifecycle",
    "routeChatInput",
    "executeNexoraAction",
    "resolveNexoraIntentRoute",
    "runNexoraChatPromptPipeline",
    "getHighlightedObjectIdsFromSelection",
    "resolveExplicitSelectedObject",
    "getAnalyzeLockedObjectId",
    "getLocalChatResponse",
    "applyDecisionActions",
    "updateMemory",
    "deriveVisualPatch",
    "applySceneFromChat",
    "applyUnifiedSceneReactionUpstreamDedup",
    "evaluateChatPipelineStability",
    "evaluateSelectedObjectGuard",
    "resolveChatPipelinePanelOpen",
    "mapNexoraTargetPanelToRightPanelView",
    "resolvePreferredPanelFamilyFromIntent",
    "logPanelGuidedPromptWarn",
    "panelFamilyDataFromExecutionPayloads",
    "readPanelFamilySliceDiagnostics",
    "shouldApplyExecutionResultImmediately",
    "mergeNextObjectSelectionFromUnifiedReaction",
    "pickAcceptedChatSceneReplacement",
    "reactionModeHintFromIntent",
    "buildChatEffectSignature",
    "buildChatRequestPayload",
    "buildFailureResponse",
    "buildUnifiedReactionFromChatResponse",
    "buildUnifiedReactionFromRetailTriggerConfig",
    "detectRetailTriggerConfig",
    "isRetailScenePayload",
    "isRetailDemoScene",
    "normalizeSceneJson",
    "hasMeaningfulSceneMutation",
    "shouldAcceptIncomingSceneReplacement",
    "emitDebugEvent",
    "emitGuardRailAlerts",
    "getRecentDebugEvents",
    "runGuardChecks",
    "traceDemoFlowEvent",
    "tracePanelFlowRuntime",
    "tracePanelFamilyAudit",
    "traceAuditRef",
    "traceAnalyzeObjectRoute",
    "memory",
    "environmentConfig",
    "rightPanelState",
    "selectedObjectInfo",
    "firstMeaningfulState",
    "analyzeFull",
    "visibleResponseData",
    "visibleStrategicAdvice",
    "visibleDecisionCockpit",
    "visibleRiskPropagation",
    "visibleSceneJson",
    "visibleSelectedObjectId",
    "visibleFocusedId",
    "visibleObjectSelection",
    "isMeaningfulPanel",
    "isAnalyzeLikeUserText",
    "isAbortLikeError",
    "getChatLifecycleErrorMessage",
    "userSafeChatMessage",
    "NEXORA_PIPELINE_USER_FAILURE",
    "NEXORA_PANEL_DEPRECATION_DEBUG",
]

ALLOW = {x.strip() for x in DEPS_ARRAY if x.strip()}
ALLOW.update(EXTRA)
for k, v in ALIAS_REPLACE.items():
    if k in ALLOW:
        ALLOW.remove(k)
        ALLOW.add(v)

# Fragment starts after trim in HomeScreen; outer wrapper supplies `text`.
TEXT = FRAG.read_text(encoding="utf-8")

# Replace alias names in source before prefixing (dependency used wrong symbol name).
for old, new in ALIAS_REPLACE.items():
    TEXT = re.sub(rf"\b{re.escape(old)}\b", new, TEXT)

# Declared bindings in the fragment (do not prefix).
declared: set[str] = set()

def record_decl(s: str) -> None:
    declared.add(s)


for m in re.finditer(r"\b(?:const|let)\s+([A-Za-z_$][\w$]*)\b", TEXT):
    record_decl(m.group(1))

# Multi-decls: const a, b = ...
for m in re.finditer(r"\b(?:const|let)\s+([^=;]+?)\s*=", TEXT):
    head = m.group(1)
    for part in head.split(","):
        part = part.split(":")[0].strip()
        if re.match(r"^[A-Za-z_$][\w$]*$", part):
            record_decl(part)

# Common outer-param / pseudo-keywords never prefix.
NEVER = {
    "text",
    "textRaw",
    "requestId",
    "options",
    "undefined",
    "null",
    "true",
    "false",
    "await",
    "return",
    "throw",
    "new",
    "typeof",
    "void",
    "case",
    "switch",
    "default",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "async",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "do",
    "of",
    "in",
    "import",
    "export",
    "from",
    "as",
    "any",
    "never",
    "unknown",
    "string",
    "number",
    "boolean",
    "object",
    "bigint",
    "symbol",
}

# Sort longest first to avoid partial overlaps (none expected for ids).
keys = sorted((k for k in ALLOW if k not in NEVER and k not in declared), key=len, reverse=True)

out = TEXT
for key in keys:
    out = re.sub(rf"\b{re.escape(key)}\b", f"d.{key}", out)

OUT.write_text(out, encoding="utf-8")
print(f"Wrote {OUT} ({len(out.splitlines())} lines), keys={len(keys)}")
