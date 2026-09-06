# BCA:6 clarification safety

## Question safety

Intents are neutral, single-subject, and free of BCA/NCA/DATA-ADV jargon.

Forbidden: “Is Capacity causing Backlog?”

Allowed: qualified connection already known (`POTENTIALLY_RELATED_TO`) without a new question.

## “I don’t know”

`confirmationState = DECLINED` (or `UNRESOLVED`) suppresses the same key. No fabricated answer. Bounded proceed is allowed.

## Manager correction

Existing writer updates meaning/scope. BCA:1–6 rebuild from that input. General knowledge may remain. BCA:6 does not write the correction.

## Isolation

Source-context and project-id confirmations do not transfer. Multiple stable roles remain; `currentRolePerspective` is a separate overlay.

## Temporal

A figure without `temporalStatus` is not assumed current when current-state reasoning is requested.

## Loops

Same `clarificationKey` with `MANAGER_CONFIRMED` / `DECLINED` / `UNRESOLVED` is not asked again unless a new scoped record is absent.
