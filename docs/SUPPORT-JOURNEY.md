# Support journey: preserve context across existing touchpoints

## What the leader's feedback changes

The builder reported that a Paytm leader described **five layers before reaching support**. The exact internal layer names, ownership and APIs were not supplied. The prototype therefore uses five explicitly illustrative stages, not a claim about Paytm's internal architecture.

The business hypothesis is that merchants and staff benefit when previous checks, unresolved questions and attempted fixes survive each handoff. Measure repeated questioning, reviewer time and handoff usefulness; do not claim ticket deflection or savings before a pilot.

## Public research, reviewed 18 October 2026

- [Paytm's AI Soundbox announcement, 7 October 2025](https://paytm.com/document/ir/press-release/AI-SB.pdf) already describes an AI assistant, local-language interaction and merchant business insights. This establishes existing voice assistance; it does not establish the leader's five support layers.
- [Official merchant support channels](https://business.paytmpayments.com/contact-us) direct QR/Soundbox/card-machine issues to merchant help through the Business app or published helpdesk. MerchantLens does not create a ticket through these channels.
- [Paytm payment-receipt guidance](https://paytm.com/support/paytm-soundbox/how-merchants-can-verify-payment-receipts) distinguishes app transaction history, Soundbox announcements and bank records. Missing audio alone does not establish failed payment or missing settlement.
- [Paytm's published grievance policy](https://paytm.com/company/grievance) describes consumer complaint registration and escalation with a prior ticket. That consumer grievance hierarchy is **not** evidence of five internal merchant-support layers and is not implemented as this prototype's routing policy.

## Implemented workflow

Open **Support journey** for the active interview. Existing interview observations remain available.

1. Record an earlier touchpoint: illustrative stage, channel/team, action and merchant-reported outcome.
2. Save a source-linked merchant turn and an `attempts` observation. The received history becomes context for the existing interview graph; it is not treated as a system record.
3. Preserve the chronology, including unsuccessful checks and unknown results. A record marked resolved is still only a merchant report.
4. Use deterministic next-step guidance. Two unresolved entries recommend human review. An explicit human-help request takes priority immediately, even with no prior entries or payment evidence.
5. Finish the interview and review the internal handoff. Export still requires approval at the current version; no ticket is sent.

### Illustrative stage labels

- Clarify the report.
- Review payment evidence.
- Capture self-service checks.
- Review previous contact.
- Prepare human handoff.

These are editable in the code's `supportStages` definition. They are not mandatory gates, verified Paytm stage names, or five independently operating agents. The interface labels them illustrative throughout. Recording an attempt at a later stage does not require completing earlier stages.

### Data and privacy

`Session.supportJourney` stores bounded merchant-entered history: up to 20 attempts, source turn IDs, selected stage, channel, action, reported outcome and time recorded. The timestamp is when the note was entered, not a verified time of the earlier interaction. Outcomes are `unresolved`, `unknown` or `reported_resolved`.

New history and human-help requests increment the interview version and reset both audience approvals. The current human request does not itself contact support. Exact-source links establish the provenance of a received note, not proof that an action occurred.

Internal JSON/Markdown includes the chronology, next-step recommendation and explicit unknowns. The review screen shows the history before approval. Anonymized output omits free-text support history and channel details. Existing common-secret masking applies on entry; redaction removes matching retained details from support history as well as turns, facts and audit text. The masking is not a complete PII detection system.

Public sessions remain browser-local. The optional private checkpoint schema retains support history; public checkpoint APIs remain disabled. No shared merchant identity, ticket-status lookup, support-history import, Paytm ledger/device access, resolution execution or ticket submission is connected.

### Rules and limitations

- Human help can be requested immediately. No rule forces five stages or proof of loss before review.
- Two unresolved entries trigger a human-review recommendation. They are not necessarily two distinct underlying attempts: notes are manually entered and need reviewer checking.
- A latest reported resolution requests confirmation instead of claiming verified closure.
- Unavailable payment evidence stays unknown. The app cannot verify a ledger, classify the true root cause or guarantee that an issue is resolved.
- Read-only stage guidance is deterministic; it is not a separate LLM diagnosis or a Paytm-approved escalation policy.
- Existing free-text support reports from the interview remain visible. They are not automatically split into fabricated historical events.

## Validation

61 automated tests passed after the addition, alongside TypeScript. New tests cover immediate human access, source/approval integrity, repeated unresolved history, non-verified resolution, privacy/redaction, checkpoint retention and record bounds. Browser checks with synthetic notes verified that two unresolved attempts recommend human review, direct human request carries into the brief, and export stays locked pending review.

## Integration needed for an actual Paytm rollout

Confirm the five real layer names and escalation criteria with Paytm's owners. Add authorized read-only adapters for existing interactions and relevant payment/device records; tag each imported record with source, timestamp and trust basis. Keep merchant reports separate from system evidence. Add identity/consent, tenant isolation, retention and deletion, idempotent support-case creation after approval, distributed rate limits and monitored quality/cost/latency. Evaluate repeat questions and handling time against the existing flow using matched cases. Measure confirmed resolution and recontacts; do not optimize only for fewer human contacts.

Code: [`support-journey.ts`](../lib/support-journey.ts), [`support-journey.tsx`](../components/support-journey.tsx), [`interview.ts`](../lib/interview.ts), [`checkpoints.ts`](../lib/checkpoints.ts), [tests](../tests/support-journey.test.ts).
