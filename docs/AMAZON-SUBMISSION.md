# MerchantLens — Support context that survives the conversation

Track: **Alexa+ / simulated Alexa+ experience**. Independent web simulation; not a live Alexa integration, not endorsed by Amazon or Paytm.

## Project description
MerchantLens helps a shopkeeper investigate a payment-support problem without retelling the story at every touchpoint. A voice or text conversation separates missing device audio, app transaction status and bank settlement. A bounded extractor–critic–planner pipeline asks for missing information and retains source-linked merchant reports. An optional visual layer lets the merchant add a device photo or app/error screenshot, cover private areas locally, and explicitly consent to Google processing. The AI drafts provisional visual observations; only merchant-reviewed text is saved, not the raw image. Earlier attempts, unresolved questions and reviewed image notes travel into the internal handoff. An anonymized brief excludes image notes and free-text support history. Every edit invalidates audience-specific export approvals. Human help can be requested at any time; no stage is compulsory.

The Alexa+ track surface is a working, clearly labelled web simulation using the existing agent backend. It supports click-to-talk recording, editable transcription, spoken replies, actual execution receipts and navigation into the shared support journey. It has no wake-word detection, Echo connection, Alexa account integration or MCP endpoint. This entry uses the alternate simulation route, not the MCP/Agent Skill route.

## Significant changes from the earlier Paytm prototype
- Dedicated Alexa+ simulation UI using the real interview harness, not a prerecorded chatbot.
- Eight optional support stages, including photo capture, visual review and follow-up.
- Local image resizing/metadata removal, rectangle covering, explicit image-processing consent and bounded Gemini vision.
- Source-linked reviewed image notes with SHA-256 digest of the redacted image; the digest is a reference, not proof of image authenticity. Raw photos are not retained or included in checkpoints/exports.
- Image-note removal cleans its source text and derived facts, clears prior model traces and invalidates approvals.
- Direct `/?view=alexa` and `/?view=support` entry links.
- Six new regression tests; 67 automated tests total.

## Technology and implementation
React 19, TypeScript, Vinext/Vite, Node 24, Zod, Gemini structured generation and vision, MediaRecorder, local optional energy-based VAD, Gemini transcription/TTS, Docker and Cloud Run. Gemini roles communicate via bounded JSON contracts; code enforces provenance, tool allowlists and execution limits. Photo observations cannot independently establish a payment, financial loss, settlement, root cause or image authenticity. An image containing instructions is untrusted input.

## Run locally
Node 24 recommended. `npm ci`, then configure ignored `.env.local` with `GEMINI_API_KEY`, optionally `GEMINI_MODEL`, `GEMINI_VISION_MODEL`, `GEMINI_AUDIO_MODEL`, and `GEMINI_TTS_MODEL`. Do not commit secrets. Run `npm run dev -- --port 5173`, open `http://127.0.0.1:5173/?view=alexa`. Guided mode and manual image notes work without a model key; voice recording/transcription and AI image analysis require the configured provider.

Tests: `node --experimental-strip-types --test tests/*.test.ts`; type check: `node node_modules/typescript/bin/tsc --noEmit`; build: `npm run build`.

## Three-minute demonstration plan
Use explicitly synthetic merchant statements and an illustrative payment screen, never a real customer's transaction.

- 00:00–00:20: Show the simulation label and describe the merchant's repeated-story problem.
- 00:20–00:55: Send a merchant report: Soundbox silent, app successful, bank credit unknown, restart unsuccessful. Show the actual follow-up and execution receipt.
- 00:55–01:35: Add a synthetic screenshot, cover the reference area, consent to image processing, inspect the AI's provisional findings and save a corrected note.
- 01:35–02:10: Record the earlier self-service restart and bot contact. Show the recommendation to stop repeating attempts and prepare human review.
- 02:10–02:40: Return to the simulator; show retained context, then finish and inspect the internal handoff versus anonymized output. Explain version-bound approval.
- 02:40–02:55: State limits: simulated Alexa+, no payment actions, no Paytm APIs, no independent verification. Show code and test count.

Record actual working UI. The legacy 3:44 video predates these features and must not be used as this entry's demonstration. The new video must be under three minutes, public on YouTube/Vimeo, with its URL added to Devpost.

## Submission checklist
- [ ] Confirm entrant eligibility and ownership; disclose reused foundation and new work.
- [ ] Review current official rules: https://amazonappdev2026.devpost.com/rules and FAQs: https://amazonappdev2026.devpost.com/details/faqs
- [x] Public GitHub repository with MIT licence and setup instructions.
- [x] Under-three-minute public narrated walkthrough of captured working UI: https://youtu.be/4YZxqTezDJY (YouTube displays 2:56).
- [x] Product feedback for tools actually used is included in AMAZON-ENTRY-TEXT.md.
- [ ] Check teammate invitations if entering as a team; do not reuse another event's team roster without confirmation.
- [ ] Submit before October 23, 2026 at 12:00 PM PDT / October 24 at 00:30 IST.
- [ ] Retain an immutable submission snapshot and follow the organizers' freeze instructions after the deadline.

AWS Builder is optional and is not claimed: this version runs on GCP and uses Gemini. No AWS integration is fabricated. The additional Open Source mini-challenge needs a separately identified qualifying contribution; a licence alone does not establish that mini-challenge entry.
