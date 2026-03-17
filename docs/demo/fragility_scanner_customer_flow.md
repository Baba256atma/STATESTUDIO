# Fragility Scanner Customer Flow

This document defines the customer-facing MVP flow for Fragility Scanner.

## 1. Self-Serve Demo Flow

### Welcome state

Goal:
- Help the user understand what the product does before they type anything

Recommended copy:
- Title: `Fragility Scanner`
- Helper text: `Paste a business update, report excerpt, or operational concern to detect fragility drivers.`
- Supporting line: `Nexora scans the text, explains where the system looks weak, and highlights what to inspect next.`

### Prompt support

Goal:
- Remove blank-screen anxiety

Recommended copy:
- Try-example CTA: `Use example scenario`
- Example helper line: `Start with a supplier delay, low inventory, or recovery weakness update.`

### Input step

Goal:
- Make the first action feel easy and natural

Recommended placeholder:
- `Example: Deliveries are slipping because one supplier is overloaded, inventory buffers are low, and recovery time has increased across the network.`

### Run step

Goal:
- Make the action clear and low-friction

Recommended button:
- `Run Fragility Scan`

Loading copy:
- `Scanning fragility...`

### Result step

Goal:
- Help the user interpret the result quickly

Interpretation hint:
- `Read the score first, then review the top drivers and findings. The highlighted objects show where Nexora recommends deeper inspection.`

### Next action step

Goal:
- Make the product feel actionable, not purely analytical

Recommended CTA block:
- `Inspect the suggested objects`
- `Paste a different update`
- `Compare another scenario`

## 2. Customer Flow Map

### Step 1. User lands on Fragility Scanner

- User goal: understand what this tool is for
- UI response: clear title, one-sentence explanation, example prompt hint
- Risk of confusion: the user may think this is generic chat
- Improvement: explicitly say `detect fragility drivers` and `highlight what to inspect next`

### Step 2. User sees short explanation

- User goal: decide whether the tool is relevant
- UI response: concise business-focused description
- Risk of confusion: value sounds too abstract
- Improvement: reference real artifacts like updates, report excerpts, and operational concerns

### Step 3. User pastes update or report text

- User goal: give the system something realistic
- UI response: large textarea, example text, optional try-example CTA
- Risk of confusion: the user is unsure what “good input” looks like
- Improvement: show an operational example in the placeholder

### Step 4. User runs scan

- User goal: get a result quickly
- UI response: disabled button, loading copy, no distracting transitions
- Risk of confusion: no visible progress
- Improvement: use clear loading text and keep the panel stable

### Step 5. User receives score, drivers, findings, actions

- User goal: understand the answer
- UI response: score card first, then drivers, findings, actions
- Risk of confusion: too much output at once
- Improvement: keep summary short and findings concise

### Step 6. User sees scene emphasis

- User goal: connect the analysis to the system view
- UI response: highlighted objects and overlay summary
- Risk of confusion: the user may not notice the scene changed
- Improvement: add a compact overlay that states scanner is active and shows the main takeaway

### Step 7. User understands what is fragile

- User goal: identify the weak part of the system
- UI response: suggested focus objects plus driver list
- Risk of confusion: fragility stays too conceptual
- Improvement: tie each driver to visible objects

### Step 8. User decides what to inspect next

- User goal: move from result to action
- UI response: suggested actions and focus objects
- Risk of confusion: no obvious next step
- Improvement: use direct CTAs like `Inspect the suggested objects`

### Step 9. User is invited to next step

- User goal: continue exploration or connect the demo to real work
- UI response: reset, try another scenario, bring a real update
- Risk of confusion: the demo feels finished too early
- Improvement: always leave one obvious next action

## 3. Business Value Translation

### Core value lines

- This helps you detect weak points before they become operational failure.
- This shortens the gap between operational updates and managerial action.
- This turns scattered status language into an explainable risk picture.
- This helps teams see where resilience is thinning.
- This gives managers a faster way to move from update to inspection.

### Investor-style value lines

- Nexora turns operational language into a decision surface, not just a summary.
- The scanner creates a fast, clear wedge into larger system-intelligence workflows.
- This is a credible path from text input to structured risk understanding.
- The visual reaction makes the product feel more durable than a single-purpose text tool.
- It shows how Nexora can monetize decision intelligence before full platform expansion.

### Buyer-style value lines

- Your team can move from report text to action faster.
- The output is explainable enough to use in manager reviews.
- It helps surface concentration risk and buffer weakness earlier.
- It gives a common interpretation layer across operations and strategy.
- It reduces the time spent turning narrative updates into decision discussions.

### Operational-user value lines

- It helps me see what deserves attention first.
- It turns a vague update into a clearer action frame.
- It helps me spot dependency and delivery issues quickly.
- It gives me something I can show in a review meeting.
- It helps me inspect the weak part of the system, not just read about it.

## 4. Optional Demo Modes

### Investor demo mode

- Main goal: show wedge strength and platform direction
- Emphasize: speed to insight, product clarity, visual reaction, extensibility
- Skip: long operational detail
- Best length: 60 seconds to 2 minutes
- Best scenario: multi-factor operational stress

### Customer discovery mode

- Main goal: test resonance with a real buyer problem
- Emphasize: realistic input, credible findings, suggested actions
- Skip: broad platform vision
- Best length: 3 to 5 minutes
- Best scenario: supplier dependency or delivery escalation

### Product walkthrough mode

- Main goal: help the user understand the full scanner workflow
- Emphasize: input, result interpretation, scene reaction, next step
- Skip: deep founder pitch
- Best length: 2 to 4 minutes
- Best scenario: inventory buffer erosion

