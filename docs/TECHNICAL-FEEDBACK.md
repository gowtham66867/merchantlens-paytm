# Technical feedback and implementation register

Captured through 18 October 2026. This register distinguishes the user's requirements/questions, reported leader feedback, observed failures and engineering follow-ups. **Only the five-layer statement below is attributed to the Paytm leader.** Other entries must not be presented as direct judge quotations. “Implemented” describes prototype behavior, not production certification or measured business impact.

## 1. Problem understanding and evidence

| ID | Source | Feedback / requirement | Incorporated response | Status / boundary | Deck |
| --- | --- | --- | --- | --- | --- |
| F01 | User / event brief | Conduct a useful interview, beyond reading a form | Adaptive follow-ups prioritize missing information, payment ambiguity and contradictions | Implemented; interview quality needs real merchant evaluation | 1, 2, 4 |
| F02 | User | Include verifiability in the problem statement | Observations cite exact received quotes and existing source turn IDs; source links stay visible | Provenance is checkable; no independent payment verification | 1, 2 |
| F03 | User / implementation review | Separate payment failure from missing Soundbox audio | App entry, bank settlement and announcement are separate questions; amount meaning is clarified | ₹2,400 can be affected payment value; actual loss remains unverified | 2 |
| F04 | User / event brief | Separate reports, estimates, assumptions and missing evidence | Reported/estimated labels, explicit unknowns, critic checks and correction history | These labels do not establish financial truth or calibrated confidence | 2, 4 |
| F05 | User | Explain the context provided to the model | Received turns/IDs, prior observations/quotes, language, required topics, gaps, corrections, curated context and role rules | No Paytm ledger, bank account, device telemetry or private historical corpus is connected | 2, 4 |
| F06 | User | Preserve merchant correction, redaction and control | Edits create a new version and invalidate both audience approvals; each export needs the matching approval | Browser state is owner-editable; no cryptographic approval signature | 2, 4 |

## 2. Agent architecture and communication

| ID | Source | Feedback / requirement | Incorporated response | Status / boundary | Deck |
| --- | --- | --- | --- | --- | --- |
| F07 | User | Explain communication between agents | Central TypeScript orchestrator passes schema-constrained JSON between extractor, critic and planner | Separately scoped Gemini requests; no direct A2A protocol, message broker or audio between roles | 4 |
| F08 | User | Use advanced agentic concepts with a sound architecture | Stateful graph, structured extraction, critique, parallel tools, gap ranking, conditional policy gate and bounded repair | Same Gemini backend; not independent model consensus or an autonomous swarm | 4 |
| F09 | User | Explain harness engineering | Code controls input boundaries, exact-source checks, topic selection, safe response form, budgets, failures and approval authority | A harness is the control system around inference, not merely a prompt | 4 |
| F10 | Engineering | Bound execution and repairs | Per turn: at most 4 model calls, 3 read-only tool calls, one shared role repair, 55-second graph deadline; at most 14 merchant turns | Repair consumes the same call budget; no unbounded background loop | 4 |
| F11 | User / engineering | Make tools, memory and retrieval inspectable | Allowlisted coverage/evidence/context tools; typed interview state; actual trace of calls, tools, tokens, timings and source fingerprint | Curated lexical retrieval, not web/vector RAG; fingerprint is not a signature | 4 |
| F12 | User | Show what changes when evidence is removed | Source-ablation explorer identifies observations depending on a removed turn | Dependency test, not causal inference | 4 notes |
| F13 | User | Explain guardrails and authority | Untrusted transcript/tool content; exact quote/source checks; safe candidate override; secret masking; no payment/refund tools; no model-granted approval | Heuristics and regex checks are incomplete; production review remains necessary | 4 |
| F14 | User | Define exit criteria | Stop on merchant request, sufficient topic coverage or turn limit; preserve unknowns; provider failure retains pending answer and prior committed state | Coverage is not truth, resolution or interview-quality verification | 4 |

## 3. Voice and language feedback

| ID | Source | Feedback / issue | Incorporated response | Status / boundary | Deck |
| --- | --- | --- | --- | --- | --- |
| F15 | Observed failure | Browser speech recognition failed with a network error | Configured path uses MediaRecorder → server-side Gemini transcription → editable text → explicit Send | Network/provider failures remain possible; legacy browser recognition only when Gemini is unavailable | 3 |
| F16 | User | Add Hindi and Kannada alongside English | Native Hindi/Kannada and romanized Hinglish selection; language/script guidance and at most one wrong-script retry | Synthetic multilingual smoke tests passed; real speech word error rate is unmeasured | 3 |
| F17 | User | Use Wispr Flow | External Wispr dictation inserts text into the answer field for review | No Wispr microphone, transcription or reasoning API is integrated | 3 notes |
| F18 | User / actual API test | Explore GPT-Live 1 and choose a working voice provider | OpenAI model lookup succeeded, but an audio transcription request returned `credit_balance_exhausted`; Gemini remained active | GPT-Live is not wired to the browser; availability/model listing is not a working voice-session test | 3 |
| F19 | User | Improve voice and detect when speech ends | Browser-supported noise suppression/echo cancellation/gain control; local energy VAD; pause options 1.2/2/3.5 seconds | Heuristic pause detector, not neural/semantic VAD; noise and thinking pauses can affect it | 3 |
| F20 | Engineering | Prevent empty or excessive recording | 200 ms sustained voice filters clicks; 10 seconds without detected speech discards locally; 45-second/4 MiB recording cap; stale-session cancellation | Manual Stop/auto-stop off are available; no hands-free full-duplex conversation | 3 notes |
| F21 | User | Improve spoken questions | Gemini `gemini-3.8-flash-lite-tts`, Kore voice, separate delivery metadata, Stop playback and device-voice fallback | Cloud generation adds delay; device voices depend on installation/browser | 3 |
| F22 | User | Explain the codec | Preferred microphone: Opus in WebM; browser-supported MP4/Ogg/default fallbacks. Tested TTS: 16-bit PCM, 24 kHz mono in WAV | Container differs from codec; MP4 codec/sample rate is not forced; PCM details were observed in the tested output | 3 |
| F23 | Observed demo failure / user confirmed | Interviewer did not speak | Found an older loaded UI and spoken responses switched off; preserved unsent text, refreshed, enabled speech and replayed the question; Chrome reached “Interviewer speaking” | **Open:** refresh currently resets spoken responses to off. Browser playing state does not prove room speakers are audible | 3 |

## 4. Evals, privacy and deployment

| ID | Source | Feedback / requirement | Incorporated response | Status / boundary | Deck |
| --- | --- | --- | --- | --- | --- |
| F24 | User | Prepare live evals and validation | 61 automated tests passed after support-journey addition; 7 visible guided probes exercise amount ambiguity, signal separation, early stop, injection, damaged device, unknown bank evidence and fabricated quote rejection | Guided/contract checks, not a live-model accuracy benchmark; synthetic voice smoke tests are separate | 4 |
| F25 | User / observed infrastructure errors | Deploy a link accessible to judges | Cloud Run public demo, Docker/Node runtime, Secret Manager; IAP/public-invocation configuration corrected after Forbidden/access errors | Public checkpoints remain blocked; production authentication and distributed abuse controls remain future work | 3, 5 |
| F26 | User / engineering | Protect private data and exports | Consent, common-secret masking, selective redaction, separate internal/anonymized approval, browser-local public sessions and no persisted raw app audio | Not complete PII detection, encrypted enterprise storage or privacy certification; provider policies still apply | 2, 4 |
| F27 | Engineering | Preserve explicit state and handle concurrent saves | Optional private D1/Cloud Storage adapters, owner scoping, observed-version/generation checks and approval-only concurrency checks | Public demo has no shared cloud interview database; old downloaded copies cannot be recalled | 4 notes |
| F28 | User | Include demo evidence without overstating it | Visible partial human English session documented; typed synthetic 3:44 backup video labeled; synthetic multilingual STT/TTS smoke tests and public WAV playback recorded | Backup video predates newer voice/support features; no native speaker or noisy-shop benchmark | 3, 4 notes |
| F29 | User | Remove external reference branding | Removed comparison-project references from current app, README/build standards and reference review | Current presentation checked; no Git history rewrite was requested | 1 notes |

## 5. Paytm feedback, business value and integration

| ID | Source | Feedback / requirement | Incorporated response | Status / boundary | Deck |
| --- | --- | --- | --- | --- | --- |
| F30 | User-reported Paytm leader feedback | Five layers already exist before reaching human support | Built Support journey to preserve prior checks, channels, outcomes and unresolved questions across touchpoints | Exact internal layer names and APIs were not provided or publicly verified; labels are explicitly illustrative | 1, 5 |
| F31 | Engineering response to F30 | Avoid making the merchant retell the story or repeat a failed loop | Prior attempt creates a source-linked merchant turn and `attempts` observation; chronology carries into internal handoff; two unresolved entries recommend human review | Entered manually; two notes do not prove two distinct executed actions; no autonomous diagnosis | 2, 5 |
| F32 | Engineering response to F30 | Keep access to human review | Human review can be requested with zero completed stages or payment evidence; completing all five is never required | Local request/flag only; no ticket sent and no human connected by the prototype | 5 |
| F33 | User | Quantify Paytm ROI | Proposed 10-merchant feasibility pilot; compare time to reviewer-accepted brief, repeat questions/contacts, routing agreement, corrections, voice failures, review effort and cost | Savings and deflection are unmeasured; do not double-count time/contact benefits | 5 |
| F34 | User | Extend the prototype into Paytm systems | Proposed authorized read-only history/payment/settlement/device adapters, separate source provenance, reviewed/idempotent case creation, tenant isolation, retention, monitoring and real-language evaluation | No Paytm API connection, live import, ticket submission, payment verification, refund or device repair | 5 |
| F35 | Public research | Establish what already exists before proposing value | Reviewed Paytm AI Soundbox and merchant help guidance; positioned the extension around context continuity and exception handoff | Published consumer grievance tiers must not be presented as the leader's five merchant-support layers | 1, 5 notes |

## Proposed release criteria and open work

Prototype checks already exercised: source-valid received claims; approval invalidation after edits; no unauthorized financial actions; unknowns retained on stop; prior support history retained in the interview graph; redaction and anonymized-output boundaries; direct human request; failed provider calls preserve pending answers. The local HTTP integration smoke test returned 200, retained a source-linked prior attempt and selected `settlement` instead of repeating the `attempts` topic.

Still to validate or build:

1. Obtain Paytm's actual five layer definitions, ownership, eligibility and escalation rules.
2. Agree authorized history/ledger/device/ticket APIs, merchant identity and consent. Keep reports separate from trusted system evidence.
3. Make the spoken-response preference persistent and clearer after refresh; verify first-question playback and room audio on the demo device.
4. Evaluate noisy real merchant English/Hindi/Kannada/Hinglish input and spoken output with human raters; measure transcription error and end-to-end task success.
5. Evaluate live Gemini interviews against reviewer-labeled cases; guided probes and mocked contracts are insufficient.
6. Establish production identity, tenant isolation, retention/deletion, complete security/privacy review, distributed request/cost controls and monitoring.
7. Agree pilot quality, usefulness, latency and cost thresholds before evaluation. Measure confirmed resolution and recontacts, not only fewer human contacts.
8. Refresh the backup demo video to include the latest voice controls and support journey; the existing video remains labeled historical.

## Sources

Implementation: [`graph.ts`](../lib/agents/graph.ts), [`types.ts`](../lib/agents/types.ts), [`interview.ts`](../lib/interview.ts), [`transcription.ts`](../lib/transcription.ts), [`speech.ts`](../lib/speech.ts), [`voice-activity.ts`](../lib/voice-activity.ts), [`support-journey.ts`](../lib/support-journey.ts), [communication contracts](AGENT-COMMUNICATION.md), [voice observations](VOICE-UPGRADE.md), [support-journey research](SUPPORT-JOURNEY.md), and tests in this repository. Technical observations are from the build/debug sessions; no raw audio or credentials are included here.

Primary research: [Paytm AI Soundbox announcement](https://paytm.com/document/ir/press-release/AI-SB.pdf), [merchant help channels](https://business.paytmpayments.com/contact-us), [payment-receipt guidance](https://paytm.com/support/paytm-soundbox/how-merchants-can-verify-payment-receipts), [consumer grievance policy](https://paytm.com/company/grievance). The leader's five-layer statement is user-reported, not independently verified from those pages.
