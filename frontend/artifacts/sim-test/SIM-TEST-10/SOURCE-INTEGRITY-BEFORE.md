# SIM-TEST:10 production integrity (pre-execution)

Independent aggregate sha256 of production `frontend/app` sources excluding `sim-test` and `*.test.*`:

`e7eeeac4c61acd7df596026392dba2b31da76cfbe2272c3a8ecc0d72ebaa6767`

fileCount: 12704

The SIM-TEST:10 runner records its own `productionSnapshot` digest at start and end. Certification requires those two to match.
