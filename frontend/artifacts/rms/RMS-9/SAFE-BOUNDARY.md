# Safe-boundary behavior

`inFlightManagerTurn` prevents a second Agent turn and delays authority transfer. Completing or clearing in-flight settles a pending handoff. CC:5 turns are not cancelled mid-flight.
