# Speech-act contract

`ManagerSpeechAct` coexists with `ManagerConversationNeed`. Reference resolution does not choose the action.

| Utterance | Speech act | Need (typical) |
| --- | --- | --- |
| Show Delivery. | COMMAND | LOCATE |
| Delivery is okay. | ASSERTION / OBSERVATION | PROVIDE_INFORMATION |
| Is Delivery okay? | QUESTION | EVALUATE / UNDERSTAND |
| Delivery is 94%. | OBSERVATION | PROVIDE_INFORMATION |
| No, Delivery is 94%. | CORRECTION | PROVIDE_INFORMATION |
| I'm okay with 91%. | PREFERENCE | PROVIDE_INFORMATION (tolerance) |
| yes / no / sure | ANSWER | ANSWER_NEXORA |
| hi | SOCIAL | SOCIAL_CONVERSATION |
| show all problems | COMMAND | collection, not LOCATE-object |

## Interpretation precedence

1. Explicit answer to the latest valid Nexora question  
2. Explicit correction / assertion / observation  
3. Explicit command / question  
4. Collection semantics  
5. Single-reference semantics  
6. Contextual fallback  

Object mention alone must not override speech act.
