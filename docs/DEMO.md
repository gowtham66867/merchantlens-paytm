# MerchantLens recorded demo

Target duration: 3 minutes 44 seconds. Actual deployed Cloud Run UI, edited into chapters with clearly labelled synthetic narration and typed synthetic merchant answers.

Production URL: https://merchantlens-paytm-412542191970.asia-south1.run.app/

## 0:00 — A clearer merchant problem

Meet MerchantLens, a problem intake interviewer built for the Paytm and AI Garage buildathon. It turns ambiguous merchant conversations into evidence-linked problem briefs. This is the deployed Cloud Run app, using clearly labelled synthetic merchant data.

## 0:16 — Consent before the conversation

We begin with consent, a merchant alias, and the interview language. Public demo drafts stay in the visitor's browser. This recording uses typed synthetic responses. Browser voice controls are available, and the merchant reviews the text before sending.

## 0:32 — The follow-up that changes the story

The merchant says the Soundbox was silent and thinks two thousand four hundred rupees were lost. The guided interviewer does not accept that as verified financial loss. It asks what the amount actually represents. This is a labelled rules-based turn, with a concrete clarification instead of a generic questionnaire.

## 0:56 — Live Gemini, explicitly selected

We clarify that the amount was affected payment value, not a confirmed loss. Now we explicitly select live Gemini and report that the merchant app showed successful payments. The next question separates bank settlement from the missing audio announcement. The application preserves the distinction between a merchant report and independent verification.

## 1:20 — Inspect what actually ran

The agent control room exposes the actual run: extraction, provenance verification, parallel critique and context retrieval, question planning, and a code policy gate. Model calls, tokens, tools, and timing come from the completed request. Source removal shows dependencies, not causation. Retrieved product context is kept separate from merchant evidence.

## 1:44 — Complete the interview adaptively

We finish the remaining questions with the labelled synthetic sample answers. The merchant describes unknown settlement, recurrence, checkout disruption, the phone-sharing workaround, earlier troubleshooting, constraints, and a useful outcome. Questions adapt to captured information. Full topic coverage means the topics were addressed; it does not make the claims independently true.

## 2:06 — Every observation has a source

In the evidence chain, each observation links to its original merchant quote. Selecting the quote highlights the source turn. The amount interpretation is clarified, while financial loss, settlement verification, and root cause remain open. A builder gets both the reported problem and the gaps that still need investigation.

## 2:26 — The merchant controls private details

The synthetic interview includes a customer name. Removing it scrubs retained transcript text, observations, and history. A correction or redaction creates a new version and invalidates previous approvals. The merchant controls what is retained and what can be exported.

## 2:42 — Two audiences, two approvals

The internal brief preserves investigation detail. The anonymized version omits names, exact amounts, source identifiers, and raw quotes. Each audience requires a separate approval for the current version. The agent cannot approve itself or submit anything externally. The merchant reviews the draft and explicitly approves the selected audience.

## 3:02 — Export a useful, reviewable outcome

Approval unlocks actual JSON and Markdown downloads, ready for a builder or operations reviewer. Public demo interviews stay in each browser; private cloud checkpoints remain protected.

## 3:14 — Test behavior, not the pitch

Seven guided probes test money ambiguity, unavailable bank evidence, early stopping, prompt injection, device damage and fabricated sources. These observable regression checks do not establish live-model accuracy or production interview quality.

## 3:30 — From conversation to investigation

MerchantLens turns conversations into traceable briefs with human review. Live Gemini and exports work. Paytm APIs are not connected. Voice transcription accuracy still requires a human spoken-input test.

## Validation limits

The recording includes a real live Gemini request, followed by explicitly selected guided turns. It is not a full voice conversation recording. Browser microphone start/stop and read-aloud controls were checked separately; human spoken-input accuracy remains unvalidated. Paytm APIs and telephony are not connected. Public demo checkpoints are intentionally disabled; drafts persist in each visitor browser. The seven probes are guided regression tests, not a model-quality benchmark.
