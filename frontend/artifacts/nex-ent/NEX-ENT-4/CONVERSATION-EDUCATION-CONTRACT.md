# NEX-ENT:4 conversation education contract

Identity: `NEX-ENT:4/AdvisorGuidedConversation` `1.0.0`

## Manager question

How do I work with Nexora?

## Progression

`NOT_STARTED` → `ASK` → `SHOW` → `EXPLAIN` → `INVESTIGATE` → `COMPARE` → `REVIEW` → `COMPLETED` | `SKIPPED`

Session field: `guidedIntroduction.conversationEducation`. Educational UI only. Not a durable onboarding store. Refresh returns to NEX-ENT:1.

## Teach by doing

Advisor narrates each lesson and offers mixed `kind: "question"` / `kind: "answer"` suggestions. Lesson advance uses the same continue phrases as ENT:3 (`Show me the next one`, and educational `Show me something`). Real work phrases are left to NCA:

- Show me the problems
- Let me see the issues
- Explain this / What is this?
- Why?
- Show me that one
- No, I meant the other Scenario

## Safety-owned replies (not a second NLU)

While conversation education is active, ENT:4 may answer bounded safety lessons without writing truth:

- Investigate / cause questions: evidence first; no fabricated cause
- Compare these / them: differences without winner, scores, or cost
- Which one should I choose?: no commitment
- I don’t know / I’m not sure: honest continuation
- How do I add my data?: high-level only, no Data education or Guided Attention
- Can you make charts?: high-level only, no chart fabrication

## Educational actors

Reuses `obj-nex-ent3-*`. Adds presentation-only `obj-nex-ent3-scenario-b` for comparison density. Never converts educational actors into canonical Problems, Scenarios, or Decisions.

## Density

ASK/EXPLAIN/INVESTIGATE: Problem. SHOW: Problem + Risk. COMPARE/REVIEW: Problem + two educational Scenarios.

## Skip

`Skip this` uses the existing guided skip: first-time overlay ends, educational actors retire, workspace becomes `existing-workspace`, discovery sessions remain null.
