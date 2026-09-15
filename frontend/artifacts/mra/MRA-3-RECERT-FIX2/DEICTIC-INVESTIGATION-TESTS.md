# Deictic investigation tests

Suite: `app/lib/nexora-conversation/mra3RecertFix2InvestigationFidelity.runtime.test.ts`

Live: `scripts/mra-3-recert-fix2-live-audit.mjs`

With Demand Surge established:

| Id | Utterance | Expected subject |
| --- | --- | --- |
| A | investigate it | Demand Surge |
| B | look deeper into it | Demand Surge |
| C | what else do we know about it? | Demand Surge |
| D | what evidence do we have about it? | Demand Surge continuity; not attention steal |
| E | why is it important? | Demand Surge continuity |
| F | what are we missing about it? | Demand Surge continuity |
| preserve | explain it / tell me more / how sure / impact | Demand Surge |
| explicit | Investigate Capacity Expansion Plan / Investigate Margin Pressure | named subject |
| G | What should I investigate? (no established Scenario) | attention/priority intelligence remains available |
| H | Investigate Margin Pressure after Demand Surge | Margin Pressure |

Ambiguous `investigate it` with no reliable subject must not force Margin Pressure.
