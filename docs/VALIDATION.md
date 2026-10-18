# Public deployment validation — 18 October 2026

- At the user's explicit request to give everyone access, revision `merchantlens-paytm-00004-mc4` was published as an unauthenticated public demo at `https://merchantlens-paytm-412542191970.asia-south1.run.app`.
- IAP is disabled and Cloud Run's documented public-access setting is enabled. No organization policy was changed. Domain-restricted sharing rejected an `allUsers` IAM binding, so the supported `--no-invoker-iam-check` method was used.
- Anonymous home and provider requests returned HTTP 200; provider reported `publicDemo: true` and Gemini configured. Anonymous checkpoint list, specific-record read and write returned HTTP 403. The browser UI shows browser-local resume guidance with no private checkpoint controls.
- TypeScript and all 39 core/storage/origin tests passed, including the public-mode guard with private owner/bucket still configured. Public HTTP tests passed six checks; one missing-key check was skipped because Gemini is configured.
- One anonymous hosted Gemini smoke test returned HTTP 200 in 3,845 ms and executed three model calls. This does not establish model accuracy or sustained latency.
- Existing private Cloud Storage snapshots were retained. New public-demo interviews remain in each visitor's browser unless the visitor exports an approved brief. The API key remains server-side in Secret Manager.

# Validation record

Validated locally on 18 October 2026.

## Automated

- 12 domain acceptance tests pass: ambiguous amount clarification, amount correction, answered-topic skipping, damaged-device branching, early finish, redaction of retained and historical text, conservative public export, common secret masking, participant instruction isolation, fixture provenance, approval invalidation, and source-linked manual review correction.
- 7 HTTP integration tests pass: honest provider status, guided interview response, explicit unavailable Gemini error, cross-origin rejection, malformed payload rejection, final-turn validation, and masking of common secrets before returning evidence.
- TypeScript type checking passes.
- Vinext production build passes. A final build is included in packaging after source changes.

These tests exercise deterministic prototype behavior. They do not establish LLM interview accuracy, privacy compliance, or production reliability.

## Browser verification

Using the local app in the Codex browser:

- Opened the overview and checked layout visually at the available desktop viewport.
- Started a synthetic interview after consent; checked that start was disabled before consent.
- Sent ten sample answers through the real HTTP interview endpoint.
- Observed adaptive amount clarification, payment/app distinction, unknown bank settlement, progress updates, and completion.
- Opened the generated brief; exports were disabled before audience approval.
- Removed the synthetic customer name Ravi; retained observations and transcript displayed the redaction.
- Approved the internal version; JSON export became available and triggered a download notification.
- Switched to the anonymized version and observed an independent approval requirement and generalized output without raw quotes or exact payment values.
- Opened the evidence chain and selected a quote to navigate to its transcript source.
- Corrected frequency during review; a new source turn appeared, the brief version incremented, and both export approvals were invalidated.
- Confirmed local interview state survived a development page reload.

## Not validated

- Live Gemini calls: no API key was configured. HTTP error handling was tested with no key.
- Microphone capture, speech provider accuracy, Hindi recognition and actual audio playback: require manual testing and browser permission on the demo device.
- Mobile-device behavior: responsive styles implemented; physical-device review not performed.
- Live Paytm, transaction records, bank settlement, device diagnostics, external tickets, multi-user database and GCP deployment: not implemented.
- No production security audit, penetration test, broad privacy evaluation or load test was performed.

## Hosting

A private Sites deployment is prepared in this task. Its deployment result is the authority for the final live URL. Local tests do not independently verify hosted microphone capabilities or provider configuration.

## v2 agent architecture verification

The upgraded implementation adds graph orchestration and private D1 snapshots. The current local result is **43 passing automated checks**:

- 30 domain, agent-contract and checkpoint-policy tests, including the complete guided graph interview.
- 7 HTTP interview/provider tests against the running app.
- 6 HTTP checkpoint tests against a migrated local D1 database, using the Sites development-only auth fixture.

The 15 agent tests cover exact provenance, no automatic promotion to verification, conflicting accounts and explicit corrections, critical-question ranking, tool allowlists, source ablation, early-stop handling, separate model-role invocation with injected clients, critic rejection, bounded extraction repair, policy-gate override, duplicate source rejection, question budget, seven-probe evaluation, and full guided interview completion. Injected model clients test contracts and orchestration only; they are not live model-quality results.

Checkpoint integration checks cover unauthenticated/spoofed-header rejection, authenticated save/restore, identical retry behavior, stale/conflicting versions, approval-only updates with the last known stamp, and an unknown-record 404. Actual cross-account deployment testing was not performed. Code inspection confirms every D1 query scopes records by trusted owner identity.

Browser checks on v2:

- Opened Agent control room and executed a synthetic probe through the interview endpoint.
- Observed eight executed stages, explicit CODE labels in guided mode, zero model tokens, three read-only tools, measured stage times, and amount ambiguity winning question selection.
- Ran evaluation in the interface; all seven observed checks passed and the limited scope was displayed.
- Removed an evidence source in the dependency explorer and observed one dependent payment-status observation lose support.
- Confirmed unauthenticated checkpoint save requires sign-in.
- Used the Sites local sign-in flow, then saved, listed and restored the synthetic interview checkpoint.

The production build passes with D1 enabled. The schema-only migration was inspected and applied once to local preview. Publication applies the tracked migration to the hosted database; no GCP deployment is claimed.

Remaining limits: no live Gemini credential, live-model benchmark, actual Wispr dictation recording, microphone/audio validation, independent payment verification, privacy certification or merchant pilot. Wispr compatibility means external dictation into the received-text field; no Wispr API integration is claimed.

After v2 publication, the actual private hosted app loaded successfully; its guided graph probe ran and a synthetic ML-0181 checkpoint was saved and listed in the hosted D1 database. Zero code-only runtime readings were observed and the UI was clarified to display clock-limited rather than imply zero latency. No production cross-account test or live-model call was performed.
# Cloud Run target validation — 18 October 2026

- Node 24 standalone build succeeded; production home returned HTTP 200.
- Docker image `merchantlens-cloudrun:local` built and started as a non-root user. All seven HTTP behavior checks passed against the container.
- TypeScript check and 36 domain, graph, checkpoint policy and Cloud Storage adapter tests passed.
- The existing Sites target passed its six D1 checkpoint HTTP regression checks, including spoofed identity rejection, restore and stale-write refusal.
- The Gemini key was absent from the standalone build output. `.env*` files are excluded from Docker and Google Cloud build uploads.
- Google Cloud authentication succeeded for `[deployment account omitted]`. The selected project `billing-dashboard-505116` has billing enabled.
- Initial deployment was blocked by Cloud Terms acceptance. After the user accepted the terms and confirmed billing account `[billing account omitted]` uses card ending 8192, deployment succeeded. Card details were confirmed by the user; this account cannot independently view payment details.
- Cloud Run revision `merchantlens-paytm-00003-qpd` serves `https://merchantlens-paytm-412542191970.asia-south1.run.app` in `asia-south1`. IAM authentication is required; unauthenticated provider requests were rejected.
- The external HTTPS origin is explicitly allowlisted because the Node server receives HTTP behind Cloud Run. Two additional origin-security tests passed (38 total core/storage/origin tests); spoofed forwarded headers cannot expand the allowlist.
- Final hosted checks returned HTTP 200 for provider configuration, checkpoint save, restore, list and duplicate idempotent save; an unrelated Origin returned HTTP 403. Guided interview completed successfully.
- `gemini-3.8-flash` timed out locally and returned upstream HTTP 503 from Cloud Run. Runtime was explicitly switched to `gemini-3.5-flash-lite`. A hosted synthetic live interview returned HTTP 200 in 3,262 ms with three model calls and observed 1,308 input / 236 output tokens. This is one smoke test, not a model-quality benchmark.
- Initial validation used the IAM-authenticated loopback proxy on port 8088. Production access now uses Identity-Aware Proxy (IAP): unauthenticated requests return HTTP 302 to Google sign-in, and the direct HTTPS page was verified in Chrome as `[deployment account omitted]`. The IAP resource policy grants that account browser access; the IAP service agent has Cloud Run Invoker. No public IAM invocation grant was added.

## Current public demo QA and recording — 18 October 2026

This section supersedes the historical private/IAP status and earlier missing-key limitations above.

- Public Cloud Run access works without sign-in; IAP is disabled and the invoker IAM check is disabled. Organization policy was not changed. Public checkpoint reads and writes return 403; visitor interviews remain in browser storage.
- 43 domain, agent, checkpoint, storage and origin tests plus TypeScript passed. The four added tests enforce a single shared schema/source repair across extractor, critic and planner within a maximum of four calls. Provider/network failures do not silently switch to guided mode.
- Browser QA completed the guided interview to 100% topic coverage, a live Gemini follow-up, source highlighting, correction, selective redaction, independent version-bound approvals, actual JSON/Markdown downloads, source ablation, seven guided evaluation probes, early stopping, Hindi initialization, filtering, theme and reload persistence. No captured browser console warnings or errors were present.
- Downloaded anonymized JSON was checked to omit the synthetic customer name, exact payment amount and session identifier. Redaction and correction invalidated earlier approvals.
- Early stopping without merchant observations now produces an explicitly incomplete public brief and no invented hypotheses.
- During recording, one live response failed validation and preserved the answer without committing state. Structured array limits and length instructions were strengthened; a shared bounded repair now also covers schema errors in all three model roles. This is a reliability safeguard, not a guarantee against provider failures.
- Microphone start/stop and speech playback controls responded in browser QA. Human spoken-input transcription accuracy, noisy audio, interruption handling and cross-browser voice behavior remain unvalidated. Wispr remains external dictation compatibility, not a Wispr API integration.
- No Paytm transaction APIs, telephony, independent bank/payment verification, production load benchmark or merchant pilot are claimed. The seven on-screen probes are deterministic regression checks, not live-model accuracy evaluation.

Final recorded build: `merchantlens-paytm-00006-rrt`, serving 100% traffic. Post-deploy HTTP checks: six passed, one credential-absence test skipped because the key is configured. A synthetic three-turn sequence returned the expected live settlement question in 22,044 ms (three model calls, no repair). The browser recording then completed its live turn in 20,942 ms with three calls. A separate attempt received a transient 503; the answer remained preserved. Availability is therefore not guaranteed.

The 3:44 edited demo contains actual UI capture, typed synthetic merchant answers and labelled synthetic voiceover. The final MP4 is H.264/AAC, 1280×816, 224.02 seconds, about 10 MB. Export v12 was parsed and checked to omit Ravi, ₹2,400 and the session ID. Representative rendered frames and audio-track levels were checked. This is a product walkthrough, not an uninterrupted spoken interview.

## Recorded audio transcription fallback

A participant encountered Web Speech recognition's network error in the embedded browser. The app now uses MediaRecorder plus server-side Gemini audio transcription when Gemini is configured. It captures up to 45 seconds, releases microphone tracks, sends audio only with an explicit audio-consent checkbox, and puts the transcript into the reviewable answer field. Transcription does not automatically submit an answer. Clips are not persisted by MerchantLens. Google processes the raw audio; text scrubbing occurs after transcription, so users must not speak secrets. Leaving the interview or changing sessions cancels capture and discards stale results.

Audio requests enforce origin checks, consent, supported MIME types, a streaming 4 MiB limit, a 45-second provider deadline and validated transcript output. Added tests cover empty/unsupported audio, size limits without Content-Length, malformed provider replies and provider failures. All 46 tests and TypeScript pass. A synthetic spoken WAV was transcribed through the actual configured Gemini model as: “My soundbox stayed silent after a customer paid. I think I lost 2,400 rupees.” This validates audio-to-text with synthetic speech, not human microphone accuracy, noisy environments or real-time streaming. The existing video predates this fallback and uses typed responses.
