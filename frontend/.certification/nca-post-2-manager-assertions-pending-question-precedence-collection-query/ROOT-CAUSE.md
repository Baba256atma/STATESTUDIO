# NCA-POST:2 root cause

Identity: `NCA-POST:2/ManagerAssertionsPendingQuestionPrecedenceCollectionQueryIntelligence`  
Version: 1.0.0  
Namespace: `nexora.nca.post.manager-assertions-pending-question-precedence-collection-query`

This is not NCA:8. No phrase tables.

## A. Stale `yes`

NCA:2 stored a single `pendingQuestion`. NCA:3 capacity questions (`BOOLEAN_BUSINESS_FACT`, e.g. demand continuing) stayed `ACTIVE` after a greeting that also asked a review offer. CC greet attached `pendingTurnExpectation` (`select-subject` / `review-subject`) even for ordinary `hi`. `extractAnswer` treated `yes` as BOOLEAN even when expected information was FREE_TEXT. Composer then applied capacity-hypothesis copy. Newest explicit unanswered Nexora question did not outrank older pending.

## B. Assertion classified as navigation

Canonical meaning defaulted `NONE` + registered subject + not OBSERVE to `FOCUS`. Copular evaluative language (`is okay`, `looks tight`) was not OBSERVE. NCA:1 mapped FOCUS to LOCATE. Object mention determined action.

## C. Collection treated as object lookup

`matchCollectionShows` required `show problems` without intervening scope tokens such as `all` / `active`. `show me all problems` fell through to a single-object hint **All Problems**.

## D. Greeting initiative

CC greet copy appended attention + “Would you like to review it?” for any issue. NCA:5 treated greeting like any other manager turn and allowed non-critical interrupt. Greeting was used as free space for attention dumping.

## E. Tautological attention copy

Explain / WATCH mapping produced “worth monitoring”. Composer then produced `{label} needs attention because it is {state}` → “needs attention because it is worth monitoring”. The reason was a synonym of the conclusion. Owner is MO explain + NCA:6 rewrite, not a sentence patch.
