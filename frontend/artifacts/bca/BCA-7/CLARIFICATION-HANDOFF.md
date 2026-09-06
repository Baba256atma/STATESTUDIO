# BCA:7 clarification handoff

```
BCA:6 need
  → BCA:7 advisorContext.clarificationQuestionIntent
  → existing NCA / Advisor wording
  → existing confirmation writer
```

`writesConfirmation: false`. No second question writer.

If BCA:6 `clarificationNeeded = false`, BCA:7 does not ask.

Confirmed / declined BCA:6 keys remain suppressed. One question at a time because BCA:6 already selects one primary need.
