# Context precedence (implemented)

For a generic/locative problem question of the family:

What is / explain / tell me about + (the) problem|issue + optional here|there|now

production now uses:

1. current conversation / session / executive subject
2. not `currentProblem` typed identity merely because the utterance contains “problem”
3. NCA:2 does not topic-shift that locative onto a different incoming Problem name
4. NXA:1 consumes NCA:2 active subject for that deictic family (no second referent resolver)

This is the existing `genericCurrentProblemQuestion` branch, plus locative. It is not a global recency ranker and not “Decision/Execution always wins.”
