# MerchantLens

**Every merchant story. A clearer problem.**

A working voice-first merchant problem intake prototype with a bounded agent graph for Challenge 2 of the Paytm × AI Garage buildathon, built using ARGUS as a benchmark for traceability and human review.

## Submission

Sole participant: **Gowtham Ramachandra**.

- [Public app](https://merchantlens-paytm-412542191970.asia-south1.run.app/)
- [3:44 demo video](https://merchantlens-paytm-412542191970.asia-south1.run.app/merchantlens-demo.mp4)
- [Download demo from this repository](public/merchantlens-demo.mp4)

Current public deployment uses browser-local drafts; private cloud checkpoint APIs are intentionally unavailable. Live Gemini was smoke-tested. Human spoken-input accuracy remains unvalidated. See the latest section of docs/VALIDATION.md for current results.

## Run

Requires Node.js 22.13+ (Node 24 tested).

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the Local URL printed by the dev server, normally http://127.0.0.1:5173.

### Optional live AI

Set these server-side variables in an ignored `.env.local` file or hosting runtime configuration, then restart the server:

```text
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Do not commit credentials. No provider key is required for the guided demo. Wispr Flow can dictate into the answer field, but is not the reasoning backend. Gemini is shown as unavailable until the server reports a configured key. Provider failure preserves the typed answer and never silently changes to the guided engine. The default model ID is configurable and must be available to your project.

## Working features

- Responsive operational workspace with light/dark modes and searchable brief library.
- Real text-answer loop plus supported browser microphone transcription and speech playback.
- Guided adaptive interview with amount clarification, answered-topic skipping, damaged-device branching, and early finish.
- Three separately scoped Gemini roles: extractor, independent critic, and question planner, plus code-enforced provenance and bounded repair.
- Read-only tool selection, parallel critique/retrieval, ranked follow-ups, explicit budgets and an inspectable execution trace.
- Source-dependency ablation and an executable seven-scenario guided evaluation.
- Optional account-owned D1 checkpoints with sign-in, idempotent saves, conflict detection and explicit restore.
- Evidence chain linking observations to precise transcript turns.
- Superseded observations, explicit uncertainty, and versioned review history.
- Selective redaction across retained transcript, current and previous claims, and history.
- Separate internal and anonymized briefs, per-audience approval bound to a version, JSON/Markdown downloads.
- Browser-local persistence, three labeled synthetic sample interviews, and an in-app demo guide.

## Architecture

React / Vinext client → privacy boundary → extraction → provenance verifier → parallel read-only tools and independent critique → question planner → code gate → turn checkpoint → human review → approved audience-specific brief.

The graph uses deterministic role adapters in guided mode and separately scoped model calls in Gemini mode. It does not represent rules as AI inference. See `docs/ARCHITECTURE.md` for boundaries, budgets, memory, and failure behavior.

Browser voice transcription uses Web Speech recognition where supported. Speech playback uses speechSynthesis. No audio is retained by the app. A browser may send speech to its provider. Text persists in local storage on the current device. Guided transcripts are processed through the local application's server. In Gemini mode, scrubbed interview text is sent to Google; consent covers these modes. Explicit Save checkpoint stores the interview and trace in the signed-in account’s D1 record. Saving is opt-in; nothing is automatically migrated from browser storage. There is no shared team database or Paytm API access. After redacting locally, save the new version to replace any earlier cloud snapshot.

Core files:

- `components/workspace.tsx`: views, interview, voice controls and review flow.
- `app/globals.css`: responsive design system.
- `lib/interview.ts`: domain model, guided interviewer, privacy, brief generation and fixtures.
- `lib/agents/`: graph orchestration, separately scoped model roles, planning, critique, tools, source checks and evaluation.
- `lib/provider.ts`: input schemas.
- `lib/checkpoints.ts`, `app/api/checkpoints/`: account-scoped snapshot validation and storage.
- `app/api/interview/route.ts`: request validation and explicit provider selection.
- `tests/interview.test.ts`: domain acceptance checks.

## Verify

```sh
node --experimental-strip-types --test tests/interview.test.ts tests/agents.test.ts tests/checkpoints.test.ts
# With the local dev server and migrated D1 running:
node --test tests/api.test.mjs
node --experimental-strip-types --test tests/checkpoints-api.test.mjs
node node_modules/typescript/bin/tsc --noEmit
node /Users/gowtham/.codex/plugins/cache/openai-curated-remote/sites/1.0.0/scripts/build-site.mjs
```

The last command uses the installed Sites helper; elsewhere use `npm run build`.

## Important limits

This is an independent buildathon prototype. It is not an official Paytm product and has no live payment, settlement, device, refund or support-ticket integration. All seeded merchant records are synthetic. Merchant speech is not independent verification. Public briefs conservatively generalize content; privacy patterns are not comprehensive. Private drafts can contain personal information and should be reviewed before export. Browser-local data is not encrypted application storage. Production use needs access controls, encryption, retention controls, rate limits, privacy review, and broader language/device evaluation.

The live Gemini integration and microphone/audio round trip require credentials and/or the user's actual demo hardware. Do not represent them as tested until validated. No ARGUS benchmark is reused as a MerchantLens result.

See `docs/BUILD-STANDARD.md`, `docs/DEMO.md`, and `docs/VALIDATION.md` for the business case, reference adaptation, demo sequence and actual verification results.

## Private checkpoint setup locally

The hosting manifest enables D1. Generate new schema migrations with `npm run db:generate`. After the first build, apply the tracked migration to the local preview database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_eager_kate_bishop.sql
```

Apply only once to a fresh local database. Hosted migrations are applied by Sites publication. Open the Agent control room, sign in using the local sign-in link when prompted, and save or restore a checkpoint explicitly.

See `docs/REFERENCE-REVIEW.md` for the Sanjay Prasad/LVL, ARGUS, Apollo and ModelProof comparison, including which prize claims were independently supported by the organizer.
