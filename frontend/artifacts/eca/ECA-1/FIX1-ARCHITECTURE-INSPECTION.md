# ECA:1-FIX1 Mutation Architecture Inspection

Inspection date: 2026-09-06.

## Findings

| Boundary | Existing authority | FIX1 decision |
| --- | --- | --- |
| Recognition | NCA canonical manager meaning plus NCA-POST semantic scope; `canonicalManagerMeaningInterpreter.ts` and `nexoraNcaPost3...ts` | ECA consumes meaning and adds a bounded explicit mutation frame. Knowledge, hypothesis, Decision, and Execution requests remain outside the frame. |
| Proposal | Existing session conversation state (`NCA:2`) and ECA working projection | ECA creates an immutable proposal projection. It is not business truth and has no write method. |
| Confirmation | Existing NCA pending-question and CC:10/CC:11 confirmation mechanisms | FIX1 recognizes confirmation/cancellation language only as proposal-bound helpers. It does not reuse Decision confirmation for Risk mutation. |
| Writer | `workspace/objectApprovalPanelRuntime.ts` and `workspace/workspaceObjectCreationPipeline.ts` write approved workspace/data-source objects | These are canonical workspace object approval writers, not a canonical Risk-domain writer. ECA must not pretend they create a Risk. Conversational Risk handoff therefore remains an explicit certification blocker until a real writer is supplied. |
| Reconciliation | Workspace scene sync, Stage/Director projections, Advisor/runtime authorities | ECA does not manually insert or reconcile Stage objects. Successful reconciliation must be emitted by the canonical writer and its existing projections. |
| Duplicate protection | Existing workspace object creation candidate/object identity checks and domain stores | ECA adds no duplicate registry. A future handoff must delegate duplicate validation to the canonical writer. |
| Data semantics | DATA-ADV/Data Reality and CSV semantic confirmation | ECA preserves candidate/confirmed status; mutation intent cannot promote semantic candidates. |
| Session boundary | NCA:2 and existing entrance continuity; APP-4 durable memory | Proposals are session-only. ECA adds no persistence. |

## Writer blocker

The repository has a manager-confirmed workspace object approval flow, but no identified canonical conversational writer that creates a Risk entity with Risk-domain semantics. The existing workspace object pipeline requires an approved candidate/data-source path and creates a generic workspace object. Routing `Add Supplier Delay as a Risk` to that path would violate the authority boundary. FIX1 therefore implements recognition and read-only proposal presentation only; canonical handoff and post-success reconciliation remain NOT CERTIFIED until the owning Risk writer is identified or exposed.