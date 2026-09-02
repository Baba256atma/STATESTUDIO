# DATA-UX:2 Advisor Handoff

The Data Rail does not contain a chatbot. It marks unresolved mappings visually and leaves conversation to the existing Nexora Advisor/NCA surface.

## Clarification boundary

- A parsed unknown column remains `Meaning unknown`.
- It appears under `Needs your help`.
- Validation is disabled while the field is unresolved.
- The manager must map or explicitly ignore the field before canonical preparation can continue.
- The existing Advisor remains open and usable while the Rail is open.

The source-detail `Ask Nexora` action continues to call `createExecutiveSourceAdvisorContext` and the shell’s existing Advisor callback. No new conversation state, prompt runtime, memory, or evidence path was added.

## Live proof

`production-clarification.csv` contained `CAP_AV`. The runtime showed four understood mappings, showed `? CAP_AV`, displayed the parsed-versus-understood warning, and disabled validation with `1 field need clarification`. The Advisor remained visible with its normal conversational control. Only after the manager explicitly chose `Ignore this column` did validation become available.

## Deferred

DATA-UX:3 owns deeper business-language clarification and richer Advisor-led resolution. DATA-UX:2 does not invent calibrated confidence or automatically propose a confirmed meaning.

