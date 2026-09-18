# Composition model

`runRmsScenario` / `executeRmsScenario`:

1. resolve + validate Scenario
2. instantiate world template (RMS:2)
3. load RMS:6 schedule
4. step ticks
5. Operator observe/publish (RMS:3 / RDI)
6. prepare/run Manager (RMS:4 / CC:5)
7. Observer measure (RMS:5)

No scenario-specific engines.
