# NPA-T ORG:5 — Advisor + Flexible Right Panel

## Stop condition

Right Context consumes the final existing Stage/Advisor bridge for subject, collection, or safe empty presentation; stale subject props cannot override a collection/cleared bridge; panel chrome stays presentation-only; Advisor authority and conversation state remain unchanged.

## Root cause

The existing bridge already emitted `presentationMode="collection"`, the collection category, count, and contextual label after “Show scenarios.” It also correctly cleared semantic object focus. The Details presentation derived only from `focusedSubject`, so the cleared focus was interpreted as Overview and the bridge’s collection projection was ignored.

## Synchronization

The Right projection now follows the bridge’s resolved mode:

1. Collection mode → collection category/count/label from the existing bridge; stale object props are ignored.
2. Object-focus mode → the bridge’s canonical `advisorSubjectId`; a label is used only from a matching existing subject.
3. Cleared/overview context → safe empty/overview treatment; previous subject props are ignored.

The collection summary is visible in both Advisor and Details modes. Details does not render the stale Overview insight when a collection is active.

## Flexible panel

Width and collapsed state remain local presentation state. Context continues recomputing while collapsed; neither operation writes Stage, selection, referent, or conversation state.

## Authority

CC:5/NCA/NXA/ECA remain the Advisor/conversation authority. The selector consumes `NexoraMVPAdvisorContextBridge`; it does not route commands, rank context, resolve referents, or mutate canonical state.

## Deferred

ORG:6 Detail Workspace, ORG:7 activity/history and broader natural-language control, and ORG:8 responsive/full integration remain untouched.

## Verification

- Focused ORG:5 proofs: 8 passed, 0 failed, 0 skipped.
- Owning-layer compatibility set (ORG:2–5 plus existing Advisor/Insight): 50 passed, 0 failed, 0 skipped.
- Targeted ESLint for the Right projection, proofs, and production region: 0 errors and 0 warnings.
- Live browser: Details began at `empty:overview:overview`; “Show scenarios” moved Stage to collection mode and Right to `collection:scenario`, with `Scenarios Collection · 3 objects` and `3 live canonical items in this collection.`
- Live browser collapse proof: Right retained `collection:scenario` while collapsed at 52 px; Stage remained collection mode with no object focus or selected object.
- Live browser console: 0 errors and 0 warnings.
- The initial post-edit test rerun was blocked before execution by sandbox denial of the local `tsx` IPC socket. The identical focused command passed after the required permission boundary was granted; this was an environmental non-test failure.
- No broad build, repository typecheck, or full milestone funnel was run: the change is confined to the owning Right presentation region and a pure projection over its existing prop contract, while the requested focused and owning-layer checks cover that seam. ORG:6+ certification remains separate.

## Verdict

CERTIFIED — Right Context follows authoritative workspace context without creating a second Advisor or context authority
