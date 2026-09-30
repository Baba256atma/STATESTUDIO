# SIM-TEST:6 Findings

### sim-test-1:sim-test-6-logistics-parity:sim-test-6-2:journey:SUBJECT_LOSS:23:0
- Finding ID: sim-test-1:sim-test-6-logistics-parity:sim-test-6-2:journey:SUBJECT_LOSS:23:0
- Severity: S3
- Scenario: logistics-delivery-pressure
- Turn: 23
- Tick: 0
- Manager utterance: Is this proven or only associated?
- Expected legitimate behavior: NPS problem label and active subject stay semantically aligned
- Actual behavior: NPS problem label Capacity Gap differs from the active subject while the reply still discusses that subject
- First divergence: T23 JOURNEY/SUBJECT_LOSS
- Earliest owner: NPS
- Root/downstream: ROOT
- Reproduction signature: JOURNEY/SUBJECT_LOSS@sim-test-6-logistics-parity:T23
- Status: OPEN

### sim-test-1:sim-test-6-project-long:sim-test-6-1:journey:SUBJECT_LOSS:34:0
- Finding ID: sim-test-1:sim-test-6-project-long:sim-test-6-1:journey:SUBJECT_LOSS:34:0
- Severity: S3
- Scenario: project-delivery-pressure
- Turn: 34
- Tick: 5
- Manager utterance: Is the delay proven or only associated?
- Expected legitimate behavior: NPS problem label and active subject stay semantically aligned
- Actual behavior: NPS problem label Capacity Gap differs from the active subject while the reply still discusses that subject
- First divergence: T34 JOURNEY/SUBJECT_LOSS
- Earliest owner: NPS
- Root/downstream: DOWNSTREAM
- Reproduction signature: JOURNEY/SUBJECT_LOSS@sim-test-6-project-long:T34
- Status: OPEN
